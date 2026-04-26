#!/usr/bin/env node
/**
 * TestedRoutes — publish a single story folder to Sanity.
 *
 * Expected folder layout:
 *   <folder>/
 *     story.md        ← markdown with YAML frontmatter (see scripts/story-template.md)
 *     hero.jpg        ← OR hero-*.jpg  (first match used as hero image)
 *     01-foo.jpg      ← gallery images, sorted by filename
 *     02-bar.jpg
 *     guide.pdf       ← optional; attaches as the guide's PDF asset
 *
 * Usage:
 *   npm run publish -- drafts/my-new-story                 # publish or update
 *   npm run publish -- drafts/my-new-story --dry-run       # preview only
 *   npm run publish -- drafts/my-new-story --verbose       # per-asset logging
 *
 * Idempotent by slug: re-running overwrites the existing story with the new
 * content. Reference documents (destination, author, collection, category)
 * are created on first reference and reused thereafter.
 *
 * Env vars required (from .env.local via `node --env-file`):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN   (Editor role or higher)
 */
import { createClient } from "next-sanity";
import { marked } from "marked";
import yaml from "js-yaml";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/* ────────── setup ────────── */

const args = process.argv.slice(2);
const folderArg = args.find((a) => !a.startsWith("--"));
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

if (!folderArg) exit("Usage: npm run publish -- <folder> [--dry-run] [--verbose]");

const folder = path.resolve(folderArg);
const STORY_MD = path.join(folder, "story.md");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Pass --env-file=.env.local to node.");
if (!DRY_RUN && !TOKEN) exit("SANITY_API_WRITE_TOKEN is not set. Required unless --dry-run.");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

/* ────────── utils ────────── */

function exit(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function randomKey() {
  return crypto.randomBytes(6).toString("hex");
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

function pruneUndefined(obj) {
  if (Array.isArray(obj)) return obj.map(pruneUndefined);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      if (v === null) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[k] = pruneUndefined(v);
    }
    return out;
  }
  return obj;
}

/* ────────── frontmatter parser ────────── */

async function readStoryMd() {
  if (!(await fileExists(STORY_MD))) exit(`No story.md found in ${folder}`);
  const raw = await fs.readFile(STORY_MD, "utf8");
  const match = raw.match(/^---\s*\n([\s\S]+?)\n---\s*\n([\s\S]*)$/);
  if (!match) exit("story.md is missing YAML frontmatter (delimited by ---)");
  let fm;
  try {
    fm = yaml.load(match[1]) || {};
  } catch (err) {
    exit(`Could not parse YAML frontmatter: ${err.message}`);
  }
  return { frontmatter: fm, body: match[2].trim() };
}

/* ────────── validation ────────── */

function validateFrontmatter(fm) {
  const errs = [];
  if (!fm.title || typeof fm.title !== "string") errs.push("title is required (string)");
  if (!fm.destination || typeof fm.destination !== "string") {
    errs.push("destination is required (country or region name)");
  }
  if (!fm.author || typeof fm.author !== "string") {
    errs.push("author is required (the writer's full name)");
  }
  if (fm.status && !["draft", "published", "archived"].includes(fm.status)) {
    errs.push(`status must be draft | published | archived (got "${fm.status}")`);
  }
  if (fm.guide?.hasGuide && fm.guide?.price == null) {
    errs.push("guide.price is required when guide.hasGuide is true");
  }
  if (errs.length) {
    exit(`Frontmatter validation failed:\n  - ${errs.join("\n  - ")}`);
  }
}

/* ────────── photo discovery ────────── */

async function findPhotos() {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  const photos = files.filter((n) => /\.(jpe?g|png|webp)$/i.test(n));
  const heroName = photos.find((n) => /^hero\b/i.test(n)) || null;
  const gallery = photos
    .filter((n) => n !== heroName)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const pdf = files.find((n) => /\.pdf$/i.test(n)) || null;
  return { heroName, gallery, pdf };
}

function altFromFilename(name) {
  return path
    .basename(name, path.extname(name))
    .replace(/^hero-?/i, "")
    .replace(/^\d+[-_.\s]+/, "")
    .replace(/[-_]/g, " ")
    .trim() || "Photo";
}

/* ────────── asset upload ────────── */

const assetCache = new Map();

async function uploadAsset(absPath, type /* "image" | "file" */) {
  if (assetCache.has(absPath)) return assetCache.get(absPath);
  if (DRY_RUN) {
    const fake = { _id: `dry-run-${path.basename(absPath)}` };
    assetCache.set(absPath, fake);
    return fake;
  }
  try {
    const stream = createReadStream(absPath);
    const asset = await client.assets.upload(type, stream, {
      filename: path.basename(absPath),
    });
    const result = { _id: asset._id, url: asset.url };
    assetCache.set(absPath, result);
    if (VERBOSE) console.log(`  ↑ uploaded ${path.basename(absPath)}`);
    return result;
  } catch (err) {
    throw new Error(`Failed to upload ${path.basename(absPath)}: ${err.message}`);
  }
}

/* ────────── reference docs ────────── */

const refQueue = [];
const refCache = new Map();

function ensureRef(type, id, doc) {
  const _id = sanitizeId(id);
  if (refCache.has(_id)) return _id;
  refCache.set(_id, true);
  refQueue.push({ _id, _type: type, ...doc });
  return _id;
}

function destinationRef(name, countryCode, continent) {
  if (!name) return null;
  const slug = slugify(name);
  return ensureRef("destination", `destination-${slug}`, {
    name,
    slug: { _type: "slug", current: slug },
    country: name,
    countryCode: countryCode ? countryCode.toUpperCase() : undefined,
    continent: continent || undefined,
  });
}

function authorRef(name, role = "partner") {
  if (!name) return null;
  const slug = slugify(name);
  return ensureRef("author", `author-${slug}`, {
    name,
    slug: { _type: "slug", current: slug },
    role,
  });
}

function collectionRef(name) {
  if (!name || typeof name !== "string") return null;
  const slug = slugify(name);
  return ensureRef("collection", `collection-${slug}`, {
    name,
    slug: { _type: "slug", current: slug },
  });
}

function categoryRef(value, type /* "journey" | "activity" */) {
  if (!value || typeof value !== "string") return null;
  const slug = slugify(value);
  return ensureRef("category", `category-${type}-${slug}`, {
    name: value.replace(/_/g, " "),
    slug: { _type: "slug", current: slug },
    type,
  });
}

/* ────────── markdown → Portable Text ────────── */

function mdToPortableText(md) {
  if (!md || !md.trim()) return [];
  const tokens = marked.lexer(md);
  const blocks = [];
  const makeBlock = (text, style = "normal", listItem = null) => {
    const out = {
      _type: "block",
      _key: randomKey(),
      style,
      children: [{ _type: "span", _key: randomKey(), text: text || "", marks: [] }],
      markDefs: [],
    };
    if (listItem) {
      out.listItem = listItem;
      out.level = 1;
    }
    return out;
  };

  for (const token of tokens) {
    switch (token.type) {
      case "heading":
        blocks.push(makeBlock(token.text, `h${Math.min(token.depth, 3)}`));
        break;
      case "paragraph":
        blocks.push(makeBlock(token.text));
        break;
      case "blockquote":
        blocks.push(makeBlock(token.text || token.raw, "blockquote"));
        break;
      case "list":
        for (const item of token.items) {
          blocks.push(makeBlock(item.text, "normal", token.ordered ? "number" : "bullet"));
        }
        break;
      case "space":
      case "hr":
        break;
      default:
        if (token.text || token.raw) blocks.push(makeBlock(token.text || token.raw));
    }
  }
  return blocks;
}

/* ────────── field mapping ────────── */

async function buildStoryDoc(fm, body, heroName, galleryNames, pdfName) {
  const title = fm.title.trim();
  const slug = (fm.slug && fm.slug.trim()) || slugify(title);

  /* hero + gallery uploads */
  let heroImage;
  if (heroName) {
    const asset = await uploadAsset(path.join(folder, heroName), "image");
    heroImage = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: fm.heroAlt || altFromFilename(heroName),
    };
  }

  const galleryImages = [];
  for (const name of galleryNames) {
    const asset = await uploadAsset(path.join(folder, name), "image");
    galleryImages.push({
      _type: "image",
      _key: randomKey(),
      asset: { _type: "reference", _ref: asset._id },
      alt: altFromFilename(name),
    });
  }

  /* pdf */
  let guideField;
  if (fm.guide) {
    const g = fm.guide;
    let pdfRef;
    if (pdfName) {
      const asset = await uploadAsset(path.join(folder, pdfName), "file");
      pdfRef = asset._id;
    }
    guideField = {
      _type: "guide",
      hasGuide: !!g.hasGuide,
      status: g.status || undefined,
      price: g.price != null ? Number(g.price) : undefined,
      currency: g.currency || undefined,
      format: Array.isArray(g.format) ? g.format : g.hasGuide ? ["PDF"] : undefined,
      pdf: pdfRef ? { _type: "file", asset: { _type: "reference", _ref: pdfRef } } : undefined,
      pageSlug: g.pageSlug || undefined,
    };
  }

  /* references */
  const destRef = destinationRef(
    fm.destination,
    fm.countryCode,
    fm.continent,
  );
  const authRef = authorRef(fm.author, fm.authorRole || "partner");
  const primaryColRef = fm.primaryCollection ? collectionRef(fm.primaryCollection) : undefined;
  const allColRefs = Array.isArray(fm.allCollections)
    ? fm.allCollections.map(collectionRef).filter(Boolean)
    : [];
  const journeyCatRef = fm.journeyCategory ? categoryRef(fm.journeyCategory, "journey") : undefined;
  const activityCatRef = fm.activityCategory ? categoryRef(fm.activityCategory, "activity") : undefined;

  /* body */
  const bodyBlocks = mdToPortableText(body);

  /* coordinates helper */
  const gp = (c) =>
    c && typeof c.lat === "number" && typeof c.lng === "number"
      ? { _type: "geopoint", lat: c.lat, lng: c.lng }
      : undefined;

  /* primary stats */
  const primaryStats = Array.isArray(fm.primaryStats)
    ? fm.primaryStats
        .filter((s) => s && s.label && s.value)
        .map((s) => ({ _type: "primaryStat", _key: randomKey(), label: String(s.label), value: String(s.value) }))
    : undefined;

  /* route points */
  const routePoints = Array.isArray(fm.routePoints)
    ? fm.routePoints
        .filter((p) => p && p.name && p.coordinates)
        .map((p) => ({
          _type: "routePoint",
          _key: randomKey(),
          name: p.name,
          coordinates: gp(p.coordinates),
          type: p.type || "stop",
        }))
    : undefined;

  const doc = {
    _id: sanitizeId(`story-${slug}`),
    _type: "story",
    title,
    slug: { _type: "slug", current: slug },
    storyId: fm.storyId || undefined,
    status: fm.status || "published",
    language: fm.language || "en",
    publishedDate: fm.publishedDate || new Date().toISOString().slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    author: authRef ? { _type: "reference", _ref: authRef } : undefined,

    eyebrow: fm.eyebrow,
    subtitle: fm.subtitle,
    heroImage,
    primaryStats,
    body: bodyBlocks.length ? bodyBlocks : undefined,
    galleryImages: galleryImages.length ? galleryImages : undefined,

    destination: destRef ? { _type: "reference", _ref: destRef } : undefined,
    regions: fm.regions,
    nearestCity: fm.nearestCity,
    nearestCityDistanceKm: fm.nearestCityDistanceKm,
    coordinates: gp(fm.coordinates),
    startingPoint: fm.startingPoint
      ? {
          _type: "startingPoint",
          name: fm.startingPoint.name,
          type: fm.startingPoint.type,
          coordinates: gp(fm.startingPoint.coordinates),
        }
      : undefined,

    overallLevel: fm.difficulty?.overallLevel,
    physicalFitnessRequired: fm.difficulty?.physicalFitnessRequired,
    technicalSkillRequired: fm.difficulty?.technicalSkillRequired,
    elevationGainM: fm.difficulty?.elevationGainM,
    maxAltitudeM: fm.difficulty?.maxAltitudeM,
    totalDistanceKm: fm.difficulty?.totalDistanceKm,
    difficultyFactors: fm.difficulty?.factors,
    notSuitableIf: fm.difficulty?.notSuitableIf,

    familyFriendly: fm.suitability?.familyFriendly,
    minAgeRecommended: fm.suitability?.minAgeRecommended,
    soloFriendly: fm.suitability?.soloFriendly,
    beginnerFriendly: fm.suitability?.beginnerFriendly,
    wheelchairAccessible: fm.suitability?.wheelchairAccessible,
    idealGroupSize: fm.suitability?.idealGroupSize,
    testedWith: fm.suitability?.testedWith,
    idealFor: fm.suitability?.idealFor,

    durationDays: fm.timing?.durationDays,
    durationHours: fm.timing?.durationHours,
    durationDisplay: fm.timing?.durationDisplay,
    bestMonths: fm.timing?.bestMonths,
    bestSeasons: fm.timing?.bestSeasons,
    avoidMonths: fm.timing?.avoidMonths,
    timeOfDay: fm.timing?.timeOfDay,
    weatherDependent: fm.timing?.weatherDependent,
    snowSeasonAccessible: fm.timing?.snowSeasonAccessible,

    transportationRequired: fm.logistics?.transportRequired,
    transportationDifficulty: fm.logistics?.transportDifficulty,
    carRequired: fm.logistics?.carRequired,
    fourByFourRequired: fm.logistics?.fourByFourRequired,
    publicTransportAccessible: fm.logistics?.publicTransportAccessible,
    accommodationType: fm.logistics?.accommodationType,
    permitsRequired: fm.logistics?.permitsRequired,
    permitsInfo: fm.logistics?.permitsInfo,
    bookingsRequired: fm.logistics?.bookingsRequired,
    bookingsAdvanceDays: fm.logistics?.bookingsAdvanceDays,
    specialEquipment: fm.logistics?.specialEquipment,
    rentalEquipmentAvailable: fm.logistics?.rentalEquipmentAvailable,

    budgetLevel: fm.budget?.level,
    estimatedCost:
      fm.budget?.estimatedCostMin != null || fm.budget?.estimatedCostMax != null
        ? {
            _type: "estimatedCost",
            min: fm.budget?.estimatedCostMin,
            max: fm.budget?.estimatedCostMax,
            currency: fm.budget?.currency || "EUR",
          }
        : undefined,
    costBreakdown: fm.budget?.costBreakdown
      ? {
          _type: "costBreakdown",
          transport: fm.budget.costBreakdown.transport,
          food: fm.budget.costBreakdown.food,
          equipmentRental: fm.budget.costBreakdown.equipmentRental,
          accommodation: fm.budget.costBreakdown.accommodation,
          activities: fm.budget.costBreakdown.activities,
        }
      : undefined,
    moneySavingTips: fm.budget?.moneySavingTips,

    uniqueSellingPoints: fm.differentiation?.uniqueSellingPoints,
    whatMakesThisSpecial: fm.differentiation?.whatMakesThisSpecial,
    bestForCrowdType: fm.differentiation?.bestForCrowdType,
    crowdLevel: fm.differentiation?.crowdLevel,
    scenicRating: fm.differentiation?.scenicRating,
    adrenalineLevel: fm.differentiation?.adrenaline,

    guide: guideField,
    whyThisTrip: fm.sales?.whyThisTrip,
    whoThisIsFor: fm.sales?.whoThisIsFor,
    whatYouGet: fm.sales?.whatYouGet,
    difficultyAtAGlance: fm.sales?.difficultyAtAGlance,
    notSuitableSales: fm.sales?.notSuitable,

    primaryCollection: primaryColRef ? { _type: "reference", _ref: primaryColRef } : undefined,
    allCollections: allColRefs.length
      ? allColRefs.map((r) => ({ _type: "reference", _key: randomKey(), _ref: r }))
      : undefined,
    journeyCategory: journeyCatRef ? { _type: "reference", _ref: journeyCatRef } : undefined,
    activityCategory: activityCatRef ? { _type: "reference", _ref: activityCatRef } : undefined,
    activityTags: fm.activityTags,
    journeyStyle: fm.journeyStyle,
    highlights: fm.highlights,

    metaTitle: fm.seo?.metaTitle,
    metaDescription: fm.seo?.metaDescription,
    keywords: fm.seo?.keywords,
    searchTags: fm.seo?.searchTags,
    searchSynonyms: fm.seo?.searchSynonyms,
    alternativeNames: fm.seo?.alternativeNames,
    appearsInSearches: fm.seo?.appearsInSearches,

    timesCompleted: fm.credibility?.timesCompleted,
    mostRecentCompletion: fm.credibility?.mostRecentCompletion,
    testedBy: fm.credibility?.testedBy,
    verifiedFacts: fm.credibility?.verifiedFacts,
    commonMistakes: fm.credibility?.commonMistakes,
    insiderTips: fm.credibility?.insiderTips,

    routeMode: fm.route?.mode,
    mapZoom: fm.route?.mapZoom,
    routePoints,

    featuredInHomepage: fm.featuredInHomepage,
    featuredPriority: fm.featuredPriority,
  };

  return pruneUndefined(doc);
}

/* ────────── main ────────── */

async function main() {
  console.log(
    `\nTestedRoutes → Sanity publish\n` +
      `  folder:   ${folder}\n` +
      `  mode:     ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE"}\n`,
  );

  const { frontmatter: fm, body } = await readStoryMd();
  validateFrontmatter(fm);

  const { heroName, gallery, pdf } = await findPhotos();
  console.log(
    `  title:    ${fm.title}\n` +
      `  slug:     ${fm.slug || slugify(fm.title)}\n` +
      `  hero:     ${heroName || "(none)"}\n` +
      `  gallery:  ${gallery.length} photos\n` +
      `  pdf:      ${pdf || "(none)"}\n` +
      `  guide?    ${fm.guide?.hasGuide ? "YES" : "no"}\n`,
  );

  const existing = TOKEN
    ? await client.fetch(`*[_type == "story" && slug.current == $slug][0]{_id, title}`, {
        slug: fm.slug || slugify(fm.title),
      })
    : null;
  if (existing) console.log(`  ⚠ Existing story found — will overwrite (${existing._id})`);

  const doc = await buildStoryDoc(fm, body, heroName, gallery, pdf);

  console.log(
    `\n  refs to create/reuse:\n` +
      `    destinations: ${refQueue.filter((d) => d._type === "destination").length}\n` +
      `    authors:      ${refQueue.filter((d) => d._type === "author").length}\n` +
      `    collections:  ${refQueue.filter((d) => d._type === "collection").length}\n` +
      `    categories:   ${refQueue.filter((d) => d._type === "category").length}\n` +
      `  assets uploaded: ${assetCache.size}\n`,
  );

  if (DRY_RUN) {
    console.log("Dry run complete. Re-run without --dry-run to publish.\n");
    return;
  }

  /* write references first, then the story */
  if (refQueue.length) {
    const refTx = client.transaction();
    for (const r of refQueue) refTx.createIfNotExists(r);
    await refTx.commit();
  }

  await client.createOrReplace(doc);

  const guideUrl =
    fm.guide?.hasGuide && (fm.guide?.pageSlug || doc.slug.current)
      ? `https://testedroutes.com/guides/${fm.guide?.pageSlug || doc.slug.current}`
      : null;

  console.log(`\n✓ Published.`);
  console.log(`  Story:  https://testedroutes.com/inspire/${doc.slug.current}`);
  if (guideUrl) console.log(`  Guide:  ${guideUrl}`);
  console.log(`  Studio: https://testedroutes.com/studio/desk/story;${doc._id}\n`);
  console.log("Live site will update in ~30s via the Sanity → Vercel webhook.\n");
}

main().catch((err) => {
  console.error("\n✖ Publish failed:");
  console.error(err.message || err);
  process.exit(1);
});

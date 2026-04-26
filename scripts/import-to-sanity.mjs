#!/usr/bin/env node
/**
 * TestedRoutes — one-time content import into Sanity.
 *
 * Reads public/Content/Stories/**, uploads images + PDFs to Sanity's asset
 * pipeline, creates or updates destination / author / collection / category /
 * story documents, and converts story markdown bodies to Portable Text.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-to-sanity.mjs --dry-run
 *   node --env-file=.env.local scripts/import-to-sanity.mjs --limit=2
 *   node --env-file=.env.local scripts/import-to-sanity.mjs
 *
 * Flags:
 *   --dry-run    Parse everything and print a summary; do not call Sanity.
 *   --limit=N    Only process the first N stories from the manifest.
 *   --verbose    Per-document logging.
 *
 * Idempotent: deterministic _ids based on slugs. Safe to re-run.
 */
import { createClient } from "next-sanity";
import { marked } from "marked";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/* ──────────────── setup ──────────────── */

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), "..");
const STORIES_ROOT = path.join(REPO_ROOT, "public", "Content", "Stories");
const MANIFEST_PATH = path.join(STORIES_ROOT, "stories-manifest.json");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");
const LIMIT_ARG = args.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1], 10) : Infinity;

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Is --env-file=.env.local passed?");
if (!DRY_RUN && !TOKEN) exit("SANITY_API_WRITE_TOKEN is not set. Required unless --dry-run.");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

const AUTHOR_ID = "author-paulius-pikelis"; // single author for all historic content

/* ──────────────── utils ──────────────── */

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

function randomKey() {
  return crypto.randomBytes(6).toString("hex");
}

function sanitizeId(id) {
  // Sanity _ids must be URL-safe. Our deterministic IDs from slugify satisfy this.
  return id.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function readTextSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

/* ──────────────── markdown → Portable Text ──────────────── */

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
        if (token.depth <= 3) {
          blocks.push(makeBlock(token.text, `h${token.depth}`));
        } else {
          blocks.push(makeBlock(token.text, "h3"));
        }
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
      case "code":
        blocks.push(makeBlock(token.text, "normal"));
        break;
      default:
        if (token.text || token.raw) blocks.push(makeBlock(token.text || token.raw));
    }
  }
  return blocks;
}

/* ──────────────── asset upload (idempotent via content hash) ──────────────── */

const assetCache = new Map(); // filepath -> {_id, url}

async function uploadAsset(absPath, type /* "image" | "file" */) {
  if (assetCache.has(absPath)) return assetCache.get(absPath);
  if (DRY_RUN) {
    const fake = { _id: `would-upload-${path.basename(absPath)}`, url: "" };
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
    if (VERBOSE) console.log(`  ↑ uploaded ${path.basename(absPath)} → ${asset._id}`);
    return result;
  } catch (err) {
    console.error(`  ✖ failed to upload ${path.basename(absPath)}: ${err.message}`);
    return null;
  }
}

/* ──────────────── reference docs (created on-the-fly, deduped) ──────────────── */

const refCache = new Map(); // _id -> _ref (same string)
const refCreationQueue = [];

function ensureRef(type, id, doc) {
  const _id = sanitizeId(id);
  if (refCache.has(_id)) return _id;
  refCache.set(_id, _id);
  refCreationQueue.push({ _id, _type: type, ...doc });
  return _id;
}

function destinationRef(countryName, countryCode, continent) {
  if (!countryName) return null;
  const slug = slugify(countryName);
  return ensureRef("destination", `destination-${slug}`, {
    name: countryName,
    slug: { _type: "slug", current: slug },
    country: countryName,
    countryCode: countryCode ? countryCode.toUpperCase() : undefined,
    continent: continent || undefined,
  });
}

function authorRef() {
  return ensureRef("author", AUTHOR_ID, {
    name: "Paulius Pikelis",
    slug: { _type: "slug", current: "paulius-pikelis" },
    role: "owner",
    bio: "Founder of TestedRoutes. 15 years of independent travel across 140 countries.",
  });
}

function collectionRef(name) {
  if (!name || typeof name !== "string") return null;
  const str = name.trim();
  if (!str) return null;
  const slug = slugify(str);
  return ensureRef("collection", `collection-${slug}`, {
    name: str,
    slug: { _type: "slug", current: slug },
  });
}

function categoryRef(value, type /* "journey" | "activity" */) {
  if (!value || typeof value !== "string") return null;
  const str = value.trim();
  if (!str) return null;
  const slug = slugify(str);
  return ensureRef("category", `category-${type}-${slug}`, {
    name: str.replace(/_/g, " "),
    slug: { _type: "slug", current: slug },
    type,
  });
}

function collectionRefSafe(name) {
  if (!name || typeof name !== "string") return null;
  return collectionRef(name.trim());
}

/* ──────────────── core: build story doc from metadata ──────────────── */

async function buildStoryDoc(entry, metadata, storyMd) {
  const folder = entry.folder;
  const folderAbs = path.join(STORIES_ROOT, folder);

  const title = String(metadata.title || "").trim();
  if (!title) return null;

  const slug =
    (typeof metadata.slug === "string" && metadata.slug.trim()) ||
    slugify(folder.replace(/^\d{8}[\s_-]*/, ""));

  const storyId = String(metadata.story_id || slug);

  /* hero image */
  const heroName = metadata?.content?.media?.hero_image;
  let heroImageField = null;
  if (heroName) {
    const heroPath = path.join(folderAbs, heroName);
    if (await fileExists(heroPath)) {
      const asset = await uploadAsset(heroPath, "image");
      if (asset) {
        heroImageField = {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: metadata?.content?.media?.hero_alt || title,
        };
      }
    }
  }
  if (!heroImageField) {
    // Fallback: first photo in manifest
    const firstPhoto = (entry.photos || []).find((p) => /\.(jpe?g|png)$/i.test(p));
    if (firstPhoto) {
      const p = path.join(folderAbs, firstPhoto);
      if (await fileExists(p)) {
        const asset = await uploadAsset(p, "image");
        if (asset) {
          heroImageField = {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: title,
          };
        }
      }
    }
  }

  /* gallery images */
  const galleryNames =
    metadata?.content?.media?.gallery_images && Array.isArray(metadata.content.media.gallery_images)
      ? metadata.content.media.gallery_images
      : [];
  const galleryImages = [];
  for (const name of galleryNames) {
    const p = path.join(folderAbs, name);
    if (!(await fileExists(p))) continue;
    const asset = await uploadAsset(p, "image");
    if (asset) {
      galleryImages.push({
        _type: "image",
        _key: randomKey(),
        asset: { _type: "reference", _ref: asset._id },
        alt: title,
      });
    }
  }

  /* guide pdf */
  let guideField = undefined;
  if (metadata.guide) {
    const g = metadata.guide;
    const pdfName = g.guide_pdf;
    let pdfAssetRef = undefined;
    if (pdfName) {
      const pdfPath = path.join(folderAbs, pdfName);
      if (await fileExists(pdfPath)) {
        const asset = await uploadAsset(pdfPath, "file");
        if (asset) pdfAssetRef = asset._id;
      }
    }
    guideField = {
      _type: "guide",
      hasGuide: g.has_guide === true || g.has_guide === "true",
      status: g.guide_status || undefined,
      price: g.guide_price ? Number(g.guide_price) : undefined,
      currency: g.guide_currency || undefined,
      format: Array.isArray(g.guide_format) ? g.guide_format : undefined,
      pdf: pdfAssetRef
        ? { _type: "file", asset: { _type: "reference", _ref: pdfAssetRef } }
        : undefined,
      pageSlug:
        typeof g.guide_page === "string"
          ? (g.guide_page.match(/guides\/([^/]+?)(?:\.html)?$/i)?.[1] ?? undefined)
          : undefined,
    };
  }

  /* references */
  const dest = destinationRef(
    metadata?.geography?.country,
    metadata?.geography?.country_code,
    metadata?.geography?.continent,
  );
  const author = authorRef();
  const primaryCollection = collectionRef(metadata?.classification?.primary_collection);
  const allCollections = Array.isArray(metadata?.classification?.all_collections)
    ? metadata.classification.all_collections.map(collectionRef).filter(Boolean)
    : [];
  const journeyCat = categoryRef(metadata?.classification?.journey_category, "journey");
  const activityCat = categoryRef(metadata?.classification?.activity_category, "activity");

  /* body */
  const body = mdToPortableText(storyMd);

  /* coordinates helper */
  const gp = (c) =>
    c && typeof c.lat === "number" && typeof c.lng === "number"
      ? { _type: "geopoint", lat: c.lat, lng: c.lng }
      : undefined;

  /* route points */
  const routePoints = Array.isArray(metadata?.route?.points)
    ? metadata.route.points
        .filter((p) => p && p.name && typeof p.lat === "number")
        .map((p) => ({
          _type: "routePoint",
          _key: randomKey(),
          name: p.name,
          coordinates: { _type: "geopoint", lat: p.lat, lng: p.lng },
          type: p.type || "stop",
        }))
    : undefined;

  const starting = metadata?.geography?.starting_point;
  const startingPointField = starting && starting.name
    ? {
        _type: "startingPoint",
        name: starting.name,
        type: starting.type,
        coordinates: gp(starting.coordinates),
      }
    : undefined;

  /* assemble story doc */
  const doc = {
    _id: sanitizeId(`story-${slug}`),
    _type: "story",
    title,
    slug: { _type: "slug", current: slug },
    storyId,
    status: metadata.status || "published",
    language: metadata.language || "en",
    publishedDate: metadata.created_date || undefined,
    lastUpdated: metadata.last_updated || undefined,
    author: { _type: "reference", _ref: author },

    eyebrow: metadata?.hero?.eyebrow || undefined,
    subtitle: metadata?.hero?.subtitle || undefined,
    heroImage: heroImageField || undefined,
    primaryStats: Array.isArray(metadata?.hero?.primary_stats)
      ? metadata.hero.primary_stats
          .filter((s) => s && s.label && s.value)
          .map((s) => ({ _type: "primaryStat", _key: randomKey(), label: s.label, value: s.value }))
      : undefined,

    body: body.length ? body : undefined,
    galleryImages: galleryImages.length ? galleryImages : undefined,
    hasVideo: metadata?.content?.media?.has_video || undefined,
    videoUrl: metadata?.content?.media?.video_url || undefined,

    destination: dest ? { _type: "reference", _ref: dest } : undefined,
    regions: Array.isArray(metadata?.geography?.regions) ? metadata.geography.regions : undefined,
    nearestCity: metadata?.geography?.nearest_major_city || undefined,
    nearestCityDistanceKm: metadata?.geography?.nearest_major_city_distance_km || undefined,
    coordinates: gp(metadata?.geography?.coordinates),
    startingPoint: startingPointField,

    overallLevel: metadata?.difficulty?.overall_level || undefined,
    physicalFitnessRequired: metadata?.difficulty?.physical_fitness_required || undefined,
    technicalSkillRequired: metadata?.difficulty?.technical_skill_required || undefined,
    elevationGainM: metadata?.difficulty?.elevation_gain_m || undefined,
    maxAltitudeM: metadata?.difficulty?.max_altitude_m || undefined,
    totalDistanceKm: metadata?.difficulty?.total_distance_km || undefined,
    difficultyFactors: metadata?.difficulty?.difficulty_factors || undefined,
    notSuitableIf: metadata?.difficulty?.not_suitable_if || undefined,

    familyFriendly: metadata?.suitability?.family_friendly ?? undefined,
    minAgeRecommended: metadata?.suitability?.min_age_recommended || undefined,
    soloFriendly: metadata?.suitability?.solo_friendly ?? undefined,
    beginnerFriendly: metadata?.suitability?.beginner_friendly ?? undefined,
    wheelchairAccessible: metadata?.suitability?.wheelchair_accessible ?? undefined,
    idealGroupSize: metadata?.suitability?.ideal_group_size || undefined,
    testedWith: metadata?.suitability?.tested_with || undefined,
    idealFor: metadata?.suitability?.ideal_for || undefined,

    durationDays: metadata?.timing?.duration_days || undefined,
    durationHours: metadata?.timing?.duration_hours || undefined,
    durationDisplay: metadata?.timing?.duration_display || undefined,
    bestMonths: metadata?.timing?.best_months || undefined,
    bestSeasons: metadata?.timing?.best_seasons || undefined,
    avoidMonths: metadata?.timing?.avoid_months || undefined,
    timeOfDay: metadata?.timing?.time_of_day || undefined,
    weatherDependent: metadata?.timing?.weather_dependent ?? undefined,
    snowSeasonAccessible: metadata?.timing?.snow_season_accessible ?? undefined,

    transportationRequired: metadata?.logistics?.transportation_required || undefined,
    transportationDifficulty: metadata?.logistics?.transportation_difficulty || undefined,
    carRequired: metadata?.logistics?.car_required ?? undefined,
    fourByFourRequired: metadata?.logistics?.["4x4_required"] ?? undefined,
    publicTransportAccessible: metadata?.logistics?.public_transport_accessible ?? undefined,
    accommodationType: metadata?.logistics?.accommodation_type || undefined,
    permitsRequired: metadata?.logistics?.permits_required ?? undefined,
    permitsInfo: metadata?.logistics?.permits_info || undefined,
    bookingsRequired: metadata?.logistics?.bookings_required || undefined,
    bookingsAdvanceDays: metadata?.logistics?.bookings_advance_days || undefined,
    specialEquipment: metadata?.logistics?.special_equipment || undefined,
    rentalEquipmentAvailable: metadata?.logistics?.rental_equipment_available ?? undefined,

    budgetLevel: metadata?.budget?.level || undefined,
    estimatedCost: metadata?.budget?.estimated_cost_usd
      ? {
          _type: "estimatedCost",
          min: metadata.budget.estimated_cost_usd.min,
          max: metadata.budget.estimated_cost_usd.max,
          currency: metadata.budget.estimated_cost_usd.currency || "USD",
        }
      : undefined,
    costBreakdown: metadata?.budget?.cost_breakdown
      ? {
          _type: "costBreakdown",
          transport: metadata.budget.cost_breakdown.transport,
          food: metadata.budget.cost_breakdown.food,
          equipmentRental: metadata.budget.cost_breakdown.equipment_rental,
          accommodation: metadata.budget.cost_breakdown.accommodation,
          activities: metadata.budget.cost_breakdown.activities,
        }
      : undefined,
    moneySavingTips: metadata?.budget?.money_saving_tips || undefined,

    uniqueSellingPoints: metadata?.differentiation?.unique_selling_points || undefined,
    whatMakesThisSpecial: metadata?.differentiation?.what_makes_this_special || undefined,
    bestForCrowdType: metadata?.differentiation?.best_for_crowd_type || undefined,
    crowdLevel: metadata?.differentiation?.crowd_level || undefined,
    scenicRating: metadata?.differentiation?.scenic_rating || undefined,
    adrenalineLevel: metadata?.differentiation?.adrenaline_level || undefined,

    guide: guideField,
    whyThisTrip: metadata?.sales?.why_this_trip || undefined,
    whoThisIsFor: metadata?.sales?.who_this_is_for || undefined,
    whatYouGet: metadata?.sales?.what_you_get || undefined,
    difficultyAtAGlance: metadata?.sales?.difficulty_at_a_glance || undefined,
    notSuitableSales: metadata?.sales?.not_suitable || undefined,

    primaryCollection: primaryCollection
      ? { _type: "reference", _ref: primaryCollection }
      : undefined,
    allCollections: allCollections.length
      ? allCollections.map((r) => ({ _type: "reference", _key: randomKey(), _ref: r }))
      : undefined,
    journeyCategory: journeyCat ? { _type: "reference", _ref: journeyCat } : undefined,
    activityCategory: activityCat ? { _type: "reference", _ref: activityCat } : undefined,
    activityTags: metadata?.classification?.activity_tags || undefined,
    journeyStyle: metadata?.classification?.journey_style || undefined,
    highlights: metadata?.classification?.highlights || undefined,

    metaTitle: metadata?.seo?.meta_title || undefined,
    metaDescription: metadata?.seo?.meta_description || undefined,
    keywords: metadata?.seo?.keywords || undefined,
    searchTags: metadata?.seo?.search_tags || undefined,
    searchSynonyms: metadata?.discovery?.search_synonyms || undefined,
    alternativeNames: metadata?.discovery?.alternative_names || undefined,
    appearsInSearches: metadata?.discovery?.appears_in_searches || undefined,

    timesCompleted: metadata?.credibility?.times_completed || undefined,
    mostRecentCompletion: metadata?.credibility?.most_recent_completion || undefined,
    testedBy: metadata?.credibility?.tested_by || undefined,
    verifiedFacts: metadata?.credibility?.verified_facts || undefined,
    commonMistakes: metadata?.credibility?.common_mistakes || undefined,
    insiderTips: metadata?.credibility?.insider_tips || undefined,

    routeMode: metadata?.route?.mode || undefined,
    mapZoom: metadata?.route?.map_zoom || undefined,
    routePoints,

    lastVerifiedDate: metadata?.maintenance?.last_verified_date || undefined,
    verificationFrequencyMonths: metadata?.maintenance?.verification_frequency_months || undefined,
    nextUpdateDue: metadata?.maintenance?.next_update_due || undefined,
    routeStatus: metadata?.maintenance?.route_status || undefined,
    contentQualityScore: metadata?.maintenance?.content_quality_score || undefined,
    needsAttention: metadata?.maintenance?.needs_attention ?? undefined,
    attentionNotes: metadata?.maintenance?.attention_notes || undefined,

    featuredInHomepage: metadata?.content?.featured_in_homepage ?? undefined,
    featuredPriority: metadata?.content?.featured_priority || undefined,
  };

  // Strip undefined values so Sanity doesn't persist empties
  return pruneUndefined(doc);
}

function pruneUndefined(obj) {
  if (Array.isArray(obj)) return obj.map(pruneUndefined);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      out[k] = pruneUndefined(v);
    }
    return out;
  }
  return obj;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/* ──────────────── orchestrator ──────────────── */

async function main() {
  console.log(
    `\nTestedRoutes → Sanity import\n` +
      `  project: ${PROJECT_ID}  dataset: ${DATASET}  apiVersion: ${API_VERSION}\n` +
      `  mode: ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE (will write to Sanity)"}` +
      (LIMIT !== Infinity ? `  limit: ${LIMIT}` : "") +
      `\n`,
  );

  const manifest = await readJsonSafe(MANIFEST_PATH);
  if (!manifest) exit(`No manifest at ${MANIFEST_PATH}`);
  const entries = Array.isArray(manifest) ? manifest : manifest.stories || [];
  if (!entries.length) exit("Manifest is empty.");
  console.log(`Found ${entries.length} stories in manifest.`);

  const stats = {
    stories: 0,
    storiesSkipped: 0,
    images: 0,
    pdfs: 0,
  };

  const storyDocs = [];

  for (const [i, entry] of entries.slice(0, LIMIT).entries()) {
    const folder = entry?.folder;
    const metaFile = entry?.metaFile;
    if (!folder || !metaFile) {
      stats.storiesSkipped += 1;
      if (VERBOSE) console.log(`  skip [${i}]: no folder/metaFile`);
      continue;
    }
    const metadata = await readJsonSafe(path.join(STORIES_ROOT, folder, metaFile));
    if (!metadata) {
      stats.storiesSkipped += 1;
      console.log(`  skip ${folder}: couldn't read metadata`);
      continue;
    }
    const storyFileName =
      entry.storyFile ||
      metadata.story_file ||
      metadata?.content?.story_file ||
      null;
    const storyMd = storyFileName
      ? await readTextSafe(path.join(STORIES_ROOT, folder, storyFileName))
      : "";

    console.log(`[${i + 1}/${Math.min(entries.length, LIMIT)}] ${folder}`);
    const doc = await buildStoryDoc(entry, metadata, storyMd);
    if (!doc) {
      stats.storiesSkipped += 1;
      console.log(`  skip ${folder}: no title`);
      continue;
    }
    storyDocs.push(doc);
    stats.stories += 1;
  }

  /* Count asset uploads */
  for (const [, v] of assetCache) {
    if (v._id?.endsWith(".pdf") || v._id?.includes("file-")) stats.pdfs += 1;
    else stats.images += 1;
  }
  stats.images = [...assetCache.keys()].filter((p) => /\.(jpe?g|png)$/i.test(p)).length;
  stats.pdfs = [...assetCache.keys()].filter((p) => /\.pdf$/i.test(p)).length;

  console.log(
    `\n── Summary ──\n` +
      `  stories:         ${stats.stories}\n` +
      `  stories skipped: ${stats.storiesSkipped}\n` +
      `  destinations:    ${refCreationQueue.filter((d) => d._type === "destination").length}\n` +
      `  collections:     ${refCreationQueue.filter((d) => d._type === "collection").length}\n` +
      `  categories:      ${refCreationQueue.filter((d) => d._type === "category").length}\n` +
      `  authors:         ${refCreationQueue.filter((d) => d._type === "author").length}\n` +
      `  image uploads:   ${stats.images}\n` +
      `  pdf uploads:     ${stats.pdfs}\n`,
  );

  if (DRY_RUN) {
    console.log(
      "Dry run — nothing written. Re-run without --dry-run to execute for real.\n",
    );
    return;
  }

  /* Create reference docs first (stories depend on them) */
  console.log("Writing reference documents (destinations, collections, categories, authors)...");
  const refTx = client.transaction();
  for (const doc of refCreationQueue) {
    refTx.createOrReplace(doc);
  }
  await refTx.commit();
  console.log(`  ✓ ${refCreationQueue.length} reference documents written`);

  /* Create story docs in batches to avoid single huge transaction */
  console.log("Writing story documents...");
  const BATCH = 10;
  for (let i = 0; i < storyDocs.length; i += BATCH) {
    const batch = storyDocs.slice(i, i + BATCH);
    const tx = client.transaction();
    for (const doc of batch) tx.createOrReplace(doc);
    await tx.commit();
    console.log(`  ✓ ${Math.min(i + BATCH, storyDocs.length)}/${storyDocs.length}`);
  }

  console.log(`\n✓ Import complete.\n`);
  console.log(`Open Studio: https://pikelis-travel.vercel.app/studio\n`);
}

main().catch((err) => {
  console.error("\n✖ Import failed:");
  console.error(err);
  process.exit(1);
});

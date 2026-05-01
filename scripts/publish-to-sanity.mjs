#!/usr/bin/env node
/**
 * TestedRoutes — publish a single story folder to Sanity.
 *
 * Supports two folder layouts:
 *
 * A. LEGACY (matches your existing public/Content/Stories/... folders)
 *    <folder>/
 *      *Meta*.txt          JSON metadata (nested: hero/geography/classification/...)
 *      *Inspire*.md        story body in markdown
 *      *Story*.md          (alternative body filename)
 *      Hero-*.jpg          hero image
 *      <any other>.jpg     gallery images, sorted by filename
 *      Guide-*.pdf         guide PDF (optional)
 *      *.pptx, *.docx      source files — ignored
 *
 * B. NEW-STYLE (cleaner for new drafts)
 *    <folder>/
 *      metadata.yaml       OR metadata.yml OR metadata.json — flat shape (see template)
 *      story.md            body only (YAML frontmatter also supported if no separate metadata file)
 *      hero.jpg            OR hero-*.jpg
 *      01-*.jpg, 02-*.jpg  gallery in numeric order
 *      guide.pdf           optional
 *
 * Metadata precedence (highest wins):
 *   1. metadata.yaml / metadata.yml / metadata.json
 *   2. *Meta*.txt / *Meta*.json  (auto-translated from legacy nested shape)
 *   3. YAML frontmatter at the top of story.md
 *
 * Body precedence:
 *   1. story.md (body after frontmatter marker, or whole file if no frontmatter)
 *   2. *Inspire*Story*.md / *Inspire*.md / *Story*.md
 *   3. *Inspire*.txt / *Story*.txt  (treated as markdown)
 *
 * Usage:
 *   npm run publish -- <folder>                        # publish or overwrite
 *   npm run publish -- <folder> --dry-run              # preview only
 *   npm run publish -- <folder> --verbose              # per-asset logging
 *
 * Idempotent by slug. Re-running overwrites. Reference docs (destination,
 * author, collection, category) are created once, reused thereafter.
 *
 * Env vars required (from .env.local via `node --env-file`):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN   (Editor role or higher)
 */
import { createClient } from "next-sanity";
import Anthropic from "@anthropic-ai/sdk";
import { marked } from "marked";
import yaml from "js-yaml";
import { createReadStream, readFileSync, existsSync, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/* Load .env.local with override semantics.
 *
 * Node's --env-file flag is non-overriding: if a parent process already set
 * an env var (e.g. Claude Code sets ANTHROPIC_API_KEY=""), --env-file silently
 * skips it. This loader unconditionally overrides — required so the script
 * can run from any environment. */
function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let value = m[2];
      // Strip optional surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[m[1]] = value;
    }
  }
}
loadEnvLocal();

/* ────────── setup ────────── */

const args = process.argv.slice(2);
const folderArg = args.find((a) => !a.startsWith("--"));
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");
const GENERATE_METADATA = args.includes("--generate-metadata") || args.includes("--generate");
const REGENERATE_METADATA = args.includes("--regenerate-metadata") || args.includes("--regenerate");

if (!folderArg) {
  exit(
    "Usage: npm run publish -- <folder> [flags]\n" +
      "  --dry-run              Preview without writing to Sanity\n" +
      "  --verbose              Per-asset logging\n" +
      "  --generate-metadata    Call Claude API to generate metadata if none exists\n" +
      "                         (requires ANTHROPIC_API_KEY in .env.local)\n" +
      "  --regenerate-metadata  Force-regenerate metadata even if a cached file exists",
  );
}

const folder = path.resolve(folderArg);

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const METADATA_PROMPT_PATH = path.join(SCRIPT_DIR, "metadata-prompt.txt");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local.");
if (!DRY_RUN && !TOKEN) exit("SANITY_API_WRITE_TOKEN is not set. Required unless --dry-run.");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

const DEFAULT_AUTHOR = "Paulius Pikelis";

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

/* ────────── legacy JSON → flat frontmatter translator ────────── */

function translateLegacyMeta(m) {
  if (!m || typeof m !== "object") return {};

  /* Some fields may live at the top level (legacy Meta-*.txt format) OR
     nested under `core_identification` (Claude-generated format). Try both. */
  const ci = m.core_identification || {};
  const pick = (...candidates) => candidates.find((v) => v !== undefined && v !== null);

  const g = m.geography || {};
  const cls = m.classification || {};
  const hero = m.hero || {};
  const sales = m.sales || {};
  const guide = m.guide || {};
  const diff = m.difficulty || {};
  const suit = m.suitability || {};
  const tim = m.timing || {};
  const log = m.logistics || {};
  const bud = m.budget || {};
  const diffr = m.differentiation || {};
  const cred = m.credibility || {};
  const seo = m.seo || {};
  const disc = m.discovery || {};
  const route = m.route || {};
  const content = m.content || {};

  /* guide.guide_page is e.g. "guides/trift-bridge-from-zurich.html"
     — extract just the bare slug. */
  let guidePageSlug;
  if (typeof guide.guide_page === "string") {
    const match = guide.guide_page.match(/guides\/([^/]+?)(?:\.html)?$/i);
    if (match) guidePageSlug = match[1];
  }

  /* Country: prefer single string field, else first of countries[] */
  const countryFromArray = Array.isArray(g.countries) ? g.countries[0] : undefined;

  /* Starting point: prefer object form, else build from start_location string */
  let startingPoint;
  if (g.starting_point && typeof g.starting_point === "object") {
    startingPoint = g.starting_point;
  } else if (typeof g.start_location === "string") {
    startingPoint = { name: g.start_location };
  }

  /* best_for_crowd_type may be string OR array — coerce to first string */
  const bestForCrowd = Array.isArray(diffr.best_for_crowd_type)
    ? diffr.best_for_crowd_type[0]
    : diffr.best_for_crowd_type;

  return {
    title: pick(m.title, ci.title),
    slug: pick(m.slug, ci.slug),
    storyId: pick(m.story_id, ci.story_id),
    status: pick(m.status, ci.status, "published"),
    language: pick(m.language, ci.language, "en"),
    publishedDate: pick(m.created_date, ci.created_date),
    lastUpdated: pick(m.last_updated, ci.last_updated),
    author: pick(m.author, ci.author, DEFAULT_AUTHOR),
    authorRole: pick(m.author_role, ci.author_role),

    eyebrow: hero.eyebrow,
    subtitle: hero.subtitle,
    primaryStats: Array.isArray(hero.primary_stats)
      ? hero.primary_stats.filter((s) => s && s.label && s.value)
      : undefined,

    destination: pick(g.country, countryFromArray),
    countryCode: g.country_code,
    continent: g.continent,
    regions: g.regions,
    nearestCity: g.nearest_major_city,
    nearestCityDistanceKm: g.nearest_major_city_distance_km,
    coordinates: g.coordinates,
    startingPoint: startingPoint
      ? {
          name: startingPoint.name,
          type: startingPoint.type,
          coordinates: startingPoint.coordinates,
        }
      : undefined,

    primaryCollection: cls.primary_collection,
    allCollections: cls.all_collections,
    journeyCategory: cls.journey_category,
    activityCategory: cls.activity_category,
    activityTags: cls.activity_tags,
    journeyStyle: cls.journey_style,
    highlights: cls.highlights,

    difficulty: {
      overallLevel: diff.overall_level,
      physicalFitnessRequired: diff.physical_fitness_required,
      technicalSkillRequired: diff.technical_skill_required,
      elevationGainM: diff.elevation_gain_m,
      maxAltitudeM: diff.max_altitude_m,
      totalDistanceKm: diff.total_distance_km,
      factors: diff.difficulty_factors,
      notSuitableIf: diff.not_suitable_if,
    },

    suitability: {
      familyFriendly: suit.family_friendly,
      minAgeRecommended: suit.min_age_recommended,
      soloFriendly: suit.solo_friendly,
      beginnerFriendly: suit.beginner_friendly,
      wheelchairAccessible: suit.wheelchair_accessible,
      idealGroupSize: suit.ideal_group_size,
      testedWith: suit.tested_with,
      idealFor: suit.ideal_for,
    },

    timing: {
      durationDays: tim.duration_days,
      durationHours: tim.duration_hours,
      durationDisplay: tim.duration_display,
      bestMonths: tim.best_months,
      bestSeasons: tim.best_seasons,
      avoidMonths: tim.avoid_months,
      timeOfDay: tim.time_of_day,
      weatherDependent: tim.weather_dependent,
      snowSeasonAccessible: tim.snow_season_accessible,
    },

    logistics: {
      transportRequired: log.transportation_required,
      transportDifficulty: log.transportation_difficulty,
      carRequired: log.car_required,
      fourByFourRequired: log["4x4_required"],
      publicTransportAccessible: log.public_transport_accessible,
      accommodationType: log.accommodation_type,
      permitsRequired: log.permits_required,
      permitsInfo: log.permits_info,
      bookingsRequired: log.bookings_required,
      bookingsAdvanceDays: log.bookings_advance_days,
      specialEquipment: log.special_equipment,
      rentalEquipmentAvailable: log.rental_equipment_available,
    },

    budget: {
      level: bud.level,
      estimatedCostMin: bud.estimated_cost_usd?.min,
      estimatedCostMax: bud.estimated_cost_usd?.max,
      currency: bud.estimated_cost_usd?.currency || "USD",
      costBreakdown: bud.cost_breakdown
        ? {
            transport: bud.cost_breakdown.transport,
            food: bud.cost_breakdown.food,
            equipmentRental: bud.cost_breakdown.equipment_rental,
            accommodation: bud.cost_breakdown.accommodation,
            activities: bud.cost_breakdown.activities,
          }
        : undefined,
      moneySavingTips: bud.money_saving_tips,
    },

    differentiation: {
      uniqueSellingPoints: diffr.unique_selling_points,
      whatMakesThisSpecial: diffr.what_makes_this_special,
      bestForCrowdType: bestForCrowd,
      crowdLevel: pick(diffr.crowd_level, cls.crowd_level),
      scenicRating: diffr.scenic_rating,
      adrenaline: diffr.adrenaline_level,
    },

    guide: guide
      ? {
          /* undefined when not specified (so PDF presence can drive the decision);
             only explicit true/false values flow through. */
          hasGuide:
            guide.has_guide === true || guide.has_guide === "true"
              ? true
              : guide.has_guide === false || guide.has_guide === "false"
                ? false
                : undefined,
          status: guide.guide_status || guide.status,
          price:
            guide.guide_price != null
              ? Number(guide.guide_price)
              : guide.price_usd != null
                ? Number(guide.price_usd)
                : guide.price != null
                  ? Number(guide.price)
                  : undefined,
          currency: guide.guide_currency || guide.currency,
          format: guide.guide_format || guide.format,
          pageSlug: guidePageSlug,
          legacyPdfFilename: guide.guide_pdf,
        }
      : undefined,

    sales: {
      whyThisTrip: sales.why_this_trip,
      whoThisIsFor: sales.who_this_is_for,
      whatYouGet: sales.what_you_get,
      difficultyAtAGlance: sales.difficulty_at_a_glance,
      notSuitable: sales.not_suitable,
    },

    credibility: {
      timesCompleted: cred.times_completed,
      mostRecentCompletion: cred.most_recent_completion,
      testedBy: cred.tested_by,
      verifiedFacts: cred.verified_facts,
      commonMistakes: cred.common_mistakes,
      insiderTips: cred.insider_tips,
    },

    route: { mode: route.mode, mapZoom: route.map_zoom },
    routePoints: Array.isArray(route.points)
      ? route.points
          .filter((p) => p && p.name && typeof p.lat === "number")
          .map((p) => ({
            name: p.name,
            coordinates: { lat: p.lat, lng: p.lng },
            type: p.type,
          }))
      : undefined,

    seo: {
      metaTitle: seo.meta_title,
      metaDescription: seo.meta_description,
      keywords: seo.keywords,
      searchTags: seo.search_tags,
      searchSynonyms: disc.search_synonyms,
      alternativeNames: disc.alternative_names,
      appearsInSearches: disc.appears_in_searches,
    },

    featuredInHomepage: content.featured_in_homepage,
    featuredPriority: content.featured_priority,

    // Legacy hero image filename — we'll use file discovery instead
    _legacyHeroImage: content.media?.hero_image,
    _legacyHeroAlt: content.media?.hero_alt,
  };
}

/* ────────── Claude API metadata generator ────────── */

async function generateMetadataWithClaude({ storyBody, pdfPath, photoFilenames, hasPdf }) {
  if (!ANTHROPIC_API_KEY) {
    exit(
      "ANTHROPIC_API_KEY is not set. Required for --generate-metadata.\n" +
        "Get a key at https://console.anthropic.com/settings/keys and add to .env.local.",
    );
  }

  console.log(`\n🤖 Generating metadata with ${CLAUDE_MODEL}...`);

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const promptTemplate = await fs.readFile(METADATA_PROMPT_PATH, "utf8");

  /* Hydrate the prompt template with actual content */
  const hydratedPrompt = promptTemplate
    .replace(
      "[PASTE YOUR STORY TEXT HERE. Otherwise auto-detect from folder.]",
      storyBody || "(no story text available)",
    )
    .replace(
      "[List filenames only if needed. Otherwise auto-detect from folder.]",
      photoFilenames.length ? photoFilenames.join("\n") : "(no photos in folder)",
    )
    .replace("Has guide available: [Yes/No]", `Has guide available: ${hasPdf ? "Yes" : "No"}`)
    .replace(
      "Guide status: [available / in_progress / planned / none]",
      `Guide status: ${hasPdf ? "available" : "none"}`,
    );

  /* Block ordering matters for prompt caching (prefix-based):
       1. PDF — large, identical across regenerates → cacheable
       2. Hydrated prompt — story-specific, not cached
     Cache hits make --regenerate (and re-publishes after a tweak) much
     cheaper, since the PDF is by far the largest input token block. */
  const content = [];
  if (pdfPath) {
    const pdfBuffer = await fs.readFile(pdfPath);
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: pdfBuffer.toString("base64"),
      },
      cache_control: { type: "ephemeral" },
    });
    if (VERBOSE) console.log(`  ↑ attached guide PDF (${Math.round(pdfBuffer.length / 1024)} KB, cacheable)`);
  }
  content.push({ type: "text", text: hydratedPrompt });

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("Claude response contained no text content");
  const raw = textBlock.text.trim();

  /* Extract JSON — handle raw JSON and ```json fenced blocks */
  const fenced = raw.match(/```(?:json)?\s*\n([\s\S]+?)\n```/);
  const jsonText = fenced ? fenced[1] : raw;

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    const debugPath = path.join(folder, "metadata.generation-debug.txt");
    await fs.writeFile(debugPath, raw, "utf8");
    throw new Error(
      `Claude returned invalid JSON. Full response saved to ${debugPath}.\n` +
        `Parse error: ${err.message}`,
    );
  }

  const usage = response.usage;
  if (usage) {
    /* Per-million-token rates by Claude family. Cache reads/writes are
       priced separately; ignored here for a quick estimate. */
    const rates = /opus/i.test(CLAUDE_MODEL)
      ? { input: 15, output: 75 }
      : /haiku/i.test(CLAUDE_MODEL)
        ? { input: 1, output: 5 }
        : /sonnet/i.test(CLAUDE_MODEL)
          ? { input: 3, output: 15 }
          : null;
    const cached = usage.cache_read_input_tokens || 0;
    const cacheNote = cached > 0 ? ` (${cached.toLocaleString()} cached)` : "";
    if (rates) {
      const cost =
        (usage.input_tokens / 1_000_000) * rates.input +
        (usage.output_tokens / 1_000_000) * rates.output;
      console.log(
        `  ✓ Generated (${usage.input_tokens.toLocaleString()} in${cacheNote}, ${usage.output_tokens.toLocaleString()} out — ~$${cost.toFixed(3)})`,
      );
    } else {
      console.log(
        `  ✓ Generated (${usage.input_tokens.toLocaleString()} in${cacheNote}, ${usage.output_tokens.toLocaleString()} out — cost N/A for ${CLAUDE_MODEL})`,
      );
    }
  } else {
    console.log(`  ✓ Generated`);
  }

  return parsed;
}

/* ────────── folder reader (detects format, returns unified shape) ────────── */

async function readStoryInput() {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  /* 1. Metadata source */
  const metaYaml = files.find((f) => /^metadata\.ya?ml$/i.test(f));
  const metaJson = files.find((f) => /^metadata\.json$/i.test(f));
  const metaLegacy = files.find((f) => /meta.*\.(txt|json)$/i.test(f) && !/^metadata\./i.test(f));

  let frontmatter = null;
  let metadataSource = null;

  if (metaYaml) {
    const raw = await fs.readFile(path.join(folder, metaYaml), "utf8");
    frontmatter = yaml.load(raw) || {};
    metadataSource = metaYaml;
  } else if (metaJson) {
    const raw = await fs.readFile(path.join(folder, metaJson), "utf8");
    frontmatter = JSON.parse(raw);
    metadataSource = metaJson;
  } else if (metaLegacy) {
    const raw = await fs.readFile(path.join(folder, metaLegacy), "utf8");
    let legacy;
    try {
      legacy = JSON.parse(raw);
    } catch (err) {
      exit(`Could not parse legacy metadata "${metaLegacy}" as JSON: ${err.message}`);
    }
    frontmatter = translateLegacyMeta(legacy);
    metadataSource = `${metaLegacy} (auto-translated from legacy format)`;
  }

  /* 2. Body source */
  const storyMdPath = files.find((f) => /^story\.md$/i.test(f));
  const inspireMd = files.find((f) => /inspire.*\.md$/i.test(f));
  const storyMd = files.find((f) => /story.*\.md$/i.test(f) && !/^story\.md$/i.test(f));
  const inspireTxt = files.find((f) => /inspire.*\.txt$/i.test(f) && !/meta/i.test(f));
  const storyTxt = files.find((f) => /story.*\.txt$/i.test(f) && !/meta/i.test(f));

  let body = "";
  let bodySource = null;
  const bodyFile = storyMdPath || inspireMd || storyMd || inspireTxt || storyTxt;

  if (bodyFile) {
    const raw = await fs.readFile(path.join(folder, bodyFile), "utf8");
    bodySource = bodyFile;

    /* If story.md has its own frontmatter and no separate metadata source was found,
       use its frontmatter. Otherwise strip any frontmatter block and use only the body. */
    const fmMatch = raw.match(/^---\s*\n([\s\S]+?)\n---\s*\n([\s\S]*)$/);
    if (fmMatch) {
      if (!frontmatter) {
        try {
          frontmatter = yaml.load(fmMatch[1]) || {};
          metadataSource = `${bodyFile} (frontmatter)`;
        } catch (err) {
          exit(`Could not parse YAML frontmatter in ${bodyFile}: ${err.message}`);
        }
      }
      body = fmMatch[2].trim();
    } else {
      body = raw.trim();
    }
  }

  /* If no metadata was found and generation is requested, call Claude */
  const cachedGeneratedPath = path.join(folder, "metadata.generated.json");
  const hasCachedGenerated = await fileExists(cachedGeneratedPath);

  if (!frontmatter && hasCachedGenerated && !REGENERATE_METADATA) {
    const cached = JSON.parse(await fs.readFile(cachedGeneratedPath, "utf8"));
    frontmatter = translateLegacyMeta(cached);
    metadataSource = "metadata.generated.json (cached — use --regenerate-metadata to refresh)";
  }

  if ((!frontmatter && GENERATE_METADATA) || REGENERATE_METADATA) {
    const pdf = files.find((f) => /\.pdf$/i.test(f) && !/^\./.test(f));
    const photos = files
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !/^\./.test(f));

    const legacy = await generateMetadataWithClaude({
      storyBody: body,
      pdfPath: pdf ? path.join(folder, pdf) : null,
      photoFilenames: photos,
      hasPdf: !!pdf,
    });
    await fs.writeFile(cachedGeneratedPath, JSON.stringify(legacy, null, 2), "utf8");
    frontmatter = translateLegacyMeta(legacy);
    metadataSource = REGENERATE_METADATA
      ? "metadata.generated.json (newly regenerated)"
      : "metadata.generated.json (newly generated)";
  }

  if (!frontmatter) {
    exit(
      `No metadata found in ${folder}.\n` +
        `Expected one of: metadata.yaml / metadata.yml / metadata.json / *Meta*.txt / story.md with YAML frontmatter.\n` +
        `Or run with --generate-metadata to have Claude generate it for you.`,
    );
  }

  return { frontmatter, body, metadataSource, bodySource };
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
  if (fm.guide?.hasGuide && !fm.guide?.pricingTier) {
    errs.push(
      "guide.pricingTier is required when guide.hasGuide is true (slug, e.g. 'day-trip', 'expedition')",
    );
  }
  if (fm.guide?.customPrices != null && !Array.isArray(fm.guide.customPrices)) {
    errs.push("guide.customPrices must be an array of { currency, amount }");
  }
  if (errs.length) {
    exit(`Metadata validation failed:\n  - ${errs.join("\n  - ")}`);
  }
}

/* ────────── photo / pdf discovery ────────── */

async function findAssets() {
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  const photos = files
    .filter((n) => /\.(jpe?g|png|webp)$/i.test(n))
    .filter((n) => !/^\./.test(n));

  const heroName =
    photos.find((n) => /^hero\b/i.test(n)) ||
    photos.find((n) => /hero/i.test(n)) ||
    null;

  const gallery = photos
    .filter((n) => n !== heroName)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const pdfs = files.filter((n) => /\.pdf$/i.test(n)).filter((n) => !/^\./.test(n));
  const pdf = pdfs.find((n) => /^guide\b/i.test(n)) || pdfs[0] || null;

  /* Source files to explicitly ignore (warn if big ones found) */
  const ignored = files.filter((n) => /\.(pptx?|docx?|xlsx?|psd|ai|sketch|fig|key|pages|numbers)$/i.test(n));

  return { heroName, gallery, pdf, ignored };
}

function altFromFilename(name) {
  return path
    .basename(name, path.extname(name))
    .replace(/^hero[-_\s]?/i, "")
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
    countryCode: countryCode ? String(countryCode).toUpperCase() : undefined,
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

/**
 * Walk marked's inline tokens and build a Portable Text children array
 * + the markDefs they reference. Handles plain text, bold/italic
 * decorators, and inline links (with optional affiliate enrichment
 * looked up by URL against affiliateMap).
 *
 * affiliateMap is a Map<canonicalUrl, { isAffiliate, program, category }>
 * where canonicalUrl is the lower-cased URL with a trailing-slash
 * normalisation applied. Pass an empty Map to skip affiliate tagging.
 */
function inlineTokensToChildren(tokens, affiliateMap) {
  const children = [];
  const markDefs = [];

  const pushSpan = (text, marks = []) => {
    if (!text) return;
    children.push({
      _type: "span",
      _key: randomKey(),
      text,
      marks,
    });
  };

  const walk = (node, currentMarks) => {
    if (!node) return;
    if (typeof node === "string") {
      pushSpan(node, currentMarks);
      return;
    }
    switch (node.type) {
      case "text":
        // marked emits nested tokens for text containing inline markdown
        if (Array.isArray(node.tokens) && node.tokens.length > 0) {
          for (const child of node.tokens) walk(child, currentMarks);
        } else {
          pushSpan(node.text || "", currentMarks);
        }
        break;
      case "strong":
        for (const child of node.tokens || []) walk(child, [...currentMarks, "strong"]);
        break;
      case "em":
        for (const child of node.tokens || []) walk(child, [...currentMarks, "em"]);
        break;
      case "codespan":
        pushSpan(node.text || "", [...currentMarks, "code"]);
        break;
      case "link": {
        const href = node.href || "";
        if (!href) {
          // No URL — just render the text inline
          for (const child of node.tokens || []) walk(child, currentMarks);
          return;
        }
        const markKey = randomKey();
        const meta = affiliateMap.get(canonicaliseUrl(href)) || null;
        markDefs.push({
          _type: "link",
          _key: markKey,
          href,
          blank: true,
          isAffiliate: !!meta,
          ...(meta && meta.program ? { affiliateProgram: meta.program } : {}),
          ...(meta && meta.category ? { affiliateCategory: meta.category } : {}),
        });
        const innerMarks = [...currentMarks, markKey];
        if (Array.isArray(node.tokens) && node.tokens.length > 0) {
          for (const child of node.tokens) walk(child, innerMarks);
        } else {
          pushSpan(node.text || href, innerMarks);
        }
        break;
      }
      case "br":
        pushSpan("\n", currentMarks);
        break;
      default:
        // Fallback: render visible text if the token has any
        if (typeof node.text === "string") {
          pushSpan(node.text, currentMarks);
        } else if (Array.isArray(node.tokens)) {
          for (const child of node.tokens) walk(child, currentMarks);
        }
    }
  };

  for (const t of tokens || []) walk(t, []);

  // Empty paragraphs need at least one span so Sanity validates the block
  if (children.length === 0) {
    children.push({ _type: "span", _key: randomKey(), text: "", marks: [] });
  }
  return { children, markDefs };
}

/**
 * Normalise a URL for affiliate-map lookup. Lower-cased host, no
 * trailing slash, query string preserved (some affiliate URLs depend
 * on params). Yaml-declared URLs and body-markdown URLs go through
 * the same normaliser so equivalents match.
 */
function canonicaliseUrl(href) {
  if (!href) return "";
  try {
    const u = new URL(href);
    u.hostname = u.hostname.toLowerCase();
    let path = u.pathname.replace(/\/+$/, "") || "/";
    return `${u.protocol}//${u.hostname}${path}${u.search}`;
  } catch {
    return String(href).trim().toLowerCase();
  }
}

function mdToPortableText(md, affiliateMap = new Map()) {
  if (!md || !md.trim()) return [];
  const tokens = marked.lexer(md);
  const blocks = [];

  const blockFromInline = (inlineTokens, style = "normal", listItem = null, fallbackText = "") => {
    const { children, markDefs } =
      Array.isArray(inlineTokens) && inlineTokens.length > 0
        ? inlineTokensToChildren(inlineTokens, affiliateMap)
        : {
            children: [
              { _type: "span", _key: randomKey(), text: fallbackText || "", marks: [] },
            ],
            markDefs: [],
          };
    const out = {
      _type: "block",
      _key: randomKey(),
      style,
      children,
      markDefs,
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
        blocks.push(blockFromInline(token.tokens, `h${Math.min(token.depth, 3)}`, null, token.text));
        break;
      case "paragraph":
        blocks.push(blockFromInline(token.tokens, "normal", null, token.text));
        break;
      case "blockquote":
        blocks.push(blockFromInline(token.tokens, "blockquote", null, token.text || token.raw));
        break;
      case "list":
        for (const item of token.items) {
          // marked nests list-item content under item.tokens; the
          // inline tokens for the item's text live in item.tokens[0]
          // (a "text" or "paragraph" token) when the item is simple.
          let inlineTokens = null;
          if (Array.isArray(item.tokens) && item.tokens.length > 0) {
            const first = item.tokens[0];
            if (first?.type === "text" && Array.isArray(first.tokens)) {
              inlineTokens = first.tokens;
            } else if (first?.type === "paragraph" && Array.isArray(first.tokens)) {
              inlineTokens = first.tokens;
            }
          }
          blocks.push(
            blockFromInline(
              inlineTokens,
              "normal",
              token.ordered ? "number" : "bullet",
              item.text,
            ),
          );
        }
        break;
      case "space":
      case "hr":
        break;
      default:
        if (token.text || token.raw) {
          blocks.push(blockFromInline(token.tokens, "normal", null, token.text || token.raw));
        }
    }
  }
  return blocks;
}

/* ────────── affiliate yaml + Sanity affiliateLink upsert ────────── */

/**
 * Repository root from the script's location. Used to find the
 * shared content/affiliates-global.yaml file regardless of which
 * folder the user is publishing.
 */
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const GLOBAL_AFFILIATES_PATH = path.join(REPO_ROOT, "content", "affiliates-global.yaml");

/**
 * Load and validate one affiliate entry. Errors loudly on shape mistakes
 * — the user should fix them in the yaml, not silently skip.
 */
function validateAffiliateEntry(entry, source) {
  const required = ["slug", "url", "program", "category"];
  for (const k of required) {
    if (!entry?.[k]) {
      exit(
        `Affiliate entry missing "${k}" in ${source}:\n  ${JSON.stringify(entry, null, 2)}`,
      );
    }
  }
  const slug = String(entry.slug).trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,95}$/.test(slug)) {
    exit(
      `Affiliate slug "${entry.slug}" in ${source} is invalid. ` +
        `Use lowercase letters, digits, and hyphens only (max 96 chars).`,
    );
  }
  return {
    slug,
    label: entry.label || slug,
    category: entry.category,
    url: entry.url,
    program: entry.program,
    linkText: entry.linkText || null,
    notes: entry.notes || null,
    regions: Array.isArray(entry.regions)
      ? entry.regions
          .filter((r) => r && r.region && r.url && r.program)
          .map((r) => ({
            region: String(r.region).toLowerCase(),
            url: r.url,
            program: r.program,
          }))
      : [],
  };
}

/**
 * Read content/affiliates-global.yaml. Returns a Map<slug, entry> with
 * scope: "global" stamped on each. Empty map if the file doesn't exist
 * (the build should still publish — affiliates are optional).
 */
async function loadGlobalAffiliates() {
  if (!(await fileExists(GLOBAL_AFFILIATES_PATH))) {
    return new Map();
  }
  const raw = await fs.readFile(GLOBAL_AFFILIATES_PATH, "utf8");
  const parsed = yaml.load(raw);
  if (!parsed) return new Map();
  const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.links) ? parsed.links : [];
  const map = new Map();
  for (const raw of list) {
    const entry = validateAffiliateEntry(raw, "content/affiliates-global.yaml");
    if (map.has(entry.slug)) {
      exit(
        `Duplicate affiliate slug "${entry.slug}" in content/affiliates-global.yaml. ` +
          `Each slug must be unique.`,
      );
    }
    map.set(entry.slug, { ...entry, scope: "global" });
  }
  return map;
}

/**
 * Read <folder>/affiliates.yaml. Two top-level keys:
 *   references: [<global slug>, ...]    — links inherited from globals
 *   links:      [...affiliateEntry]     — guide-specific definitions
 *
 * Returns { references: string[], guideLinks: Map<slug, entry> }.
 */
async function loadGuideAffiliates() {
  const candidates = ["affiliates.yaml", "affiliates.yml"];
  let filePath = null;
  for (const name of candidates) {
    const p = path.join(folder, name);
    if (await fileExists(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) {
    return { references: [], guideLinks: new Map(), source: null };
  }
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = yaml.load(raw) || {};
  const references = Array.isArray(parsed.references)
    ? parsed.references.map((s) => String(s).trim().toLowerCase()).filter(Boolean)
    : [];
  const linkList = Array.isArray(parsed.links) ? parsed.links : [];
  const guideLinks = new Map();
  for (const raw of linkList) {
    const entry = validateAffiliateEntry(raw, path.basename(filePath));
    if (guideLinks.has(entry.slug)) {
      exit(`Duplicate affiliate slug "${entry.slug}" in ${path.basename(filePath)}.`);
    }
    guideLinks.set(entry.slug, { ...entry, scope: "guide" });
  }
  return { references, guideLinks, source: path.basename(filePath) };
}

/**
 * Resolve which affiliate entries this guide actually uses (for upsert
 * + story.affiliateLinks references). Combines:
 *   - guide-specific links (always)
 *   - referenced globals (from `references:`)
 *
 * Validates that every reference resolves to a global entry — bad
 * references are a publish-time error.
 */
function resolveGuideAffiliateUsage(globals, guideAffiliates) {
  const used = new Map();
  for (const [slug, entry] of guideAffiliates.guideLinks) {
    used.set(slug, entry);
  }
  for (const ref of guideAffiliates.references) {
    const entry = globals.get(ref);
    if (!entry) {
      exit(
        `Affiliate reference "${ref}" in affiliates.yaml is not defined ` +
          `in content/affiliates-global.yaml. Add it to globals or remove the reference.`,
      );
    }
    if (!used.has(ref)) used.set(ref, entry);
  }
  return used;
}

/**
 * Convert a resolved affiliate entry to a Sanity affiliateLink doc.
 */
function buildAffiliateDoc(entry) {
  return {
    _id: sanitizeId(`affiliateLink-${entry.slug}`),
    _type: "affiliateLink",
    label: entry.label,
    slug: { _type: "slug", current: entry.slug },
    scope: entry.scope || "global",
    category: entry.category,
    url: entry.url,
    program: entry.program,
    regions: entry.regions.length
      ? entry.regions.map((r) => ({
          _type: "regionalAffiliate",
          _key: randomKey(),
          region: r.region,
          url: r.url,
          program: r.program,
        }))
      : undefined,
    linkText: entry.linkText || undefined,
    notes: entry.notes || undefined,
  };
}

/**
 * Build a Map<canonicalUrl, { isAffiliate, program, category }> for
 * markdown-link affiliate matching during mdToPortableText. Includes
 * both the default URL and any regional URLs so affiliate links
 * pasted in body markdown match regardless of which retailer's URL
 * the author used.
 */
function buildAffiliateUrlMap(usedAffiliates) {
  const map = new Map();
  for (const entry of usedAffiliates.values()) {
    const meta = (program, category) => ({ isAffiliate: true, program, category });
    map.set(canonicaliseUrl(entry.url), meta(entry.program, entry.category));
    for (const r of entry.regions) {
      map.set(canonicaliseUrl(r.url), meta(r.program, entry.category));
    }
  }
  return map;
}

/**
 * Write a markdown cheat sheet listing every affiliate link this guide
 * uses, with the /go/<slug> URL the PDF author should hyperlink in the
 * PDF. Regenerated on every publish — overwriting is intentional.
 */
async function writePdfCheatSheet(usedAffiliates, guideSlug) {
  if (usedAffiliates.size === 0) return null;
  const cheatPath = path.join(folder, "pdf-affiliate-links.md");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://testedroutes.com";
  const lines = [];
  lines.push(`# PDF affiliate links — ${guideSlug}`);
  lines.push("");
  lines.push(
    "Use these short URLs in the PDF. Each /go/<slug> 302-redirects to the",
  );
  lines.push(
    "tagged affiliate URL at click time, with country-aware retailer/region",
  );
  lines.push("routing. Don't paste the raw destination URL into the PDF —");
  lines.push("if you do, you bypass tracking and any future env-var rotation.");
  lines.push("");
  lines.push("| Suggested PDF link text | URL to paste in PDF |");
  lines.push("|---|---|");
  const sorted = [...usedAffiliates.values()].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  for (const entry of sorted) {
    const text = entry.linkText || entry.label;
    const url = `${origin}/go/${entry.slug}`;
    lines.push(`| ${text} | ${url} |`);
  }
  lines.push("");
  await fs.writeFile(cheatPath, lines.join("\n"), "utf8");
  return cheatPath;
}

/* ────────── field mapping (fm → Sanity doc) ────────── */

async function buildStoryDoc(fm, body, heroName, galleryNames, pdfName, affiliateContext = null) {
  const title = fm.title.trim();
  const slug = (fm.slug && fm.slug.trim()) || slugify(title);

  let heroImage;
  if (heroName) {
    const asset = await uploadAsset(path.join(folder, heroName), "image");
    heroImage = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: fm._legacyHeroAlt || fm.heroAlt || altFromFilename(heroName),
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

  let guideField;
  /* A folder is treated as having a guide if a PDF is present, OR if
     metadata explicitly says so. Frontmatter can override (set guide.hasGuide
     to false to keep a story-only post even with a PDF in the folder). */
  const inferredHasGuide = !!pdfName || !!fm.guide?.hasGuide;
  if (fm.guide || pdfName) {
    const g = fm.guide || {};
    const explicitFalse = g.hasGuide === false;
    const hasGuide = explicitFalse ? false : inferredHasGuide;
    let pdfRef;
    if (pdfName && hasGuide) {
      const asset = await uploadAsset(path.join(folder, pdfName), "file");
      pdfRef = asset._id;
    }
    guideField = {
      _type: "guide",
      hasGuide,
      status: g.status || (hasGuide ? "available" : undefined),
      pricingTier: g.pricingTier
        ? { _type: "reference", _ref: `pricingTier-${g.pricingTier}` }
        : undefined,
      customPrices: Array.isArray(g.customPrices)
        ? g.customPrices.map((p) => ({
            _type: "priceEntry",
            _key: randomKey(),
            currency: String(p.currency || "").toUpperCase(),
            amount: Number(p.amount),
          }))
        : undefined,
      format: Array.isArray(g.format) ? g.format : hasGuide ? ["PDF"] : undefined,
      pdf: pdfRef ? { _type: "file", asset: { _type: "reference", _ref: pdfRef } } : undefined,
      pageSlug: g.pageSlug || undefined,
    };
  }

  const destRef = destinationRef(fm.destination, fm.countryCode, fm.continent);
  const authRef = authorRef(fm.author, fm.authorRole || "partner");
  const primaryColRef = fm.primaryCollection ? collectionRef(fm.primaryCollection) : undefined;
  const allColRefs = Array.isArray(fm.allCollections)
    ? fm.allCollections.map(collectionRef).filter(Boolean)
    : [];
  const journeyCatRef = fm.journeyCategory ? categoryRef(fm.journeyCategory, "journey") : undefined;
  const activityCatRef = fm.activityCategory ? categoryRef(fm.activityCategory, "activity") : undefined;

  const affiliateUrlMap = affiliateContext?.urlMap || new Map();
  const bodyBlocks = mdToPortableText(body, affiliateUrlMap);

  const affiliateRefs = affiliateContext?.usedAffiliates
    ? [...affiliateContext.usedAffiliates.values()].map((e) => ({
        _type: "reference",
        _key: randomKey(),
        _ref: sanitizeId(`affiliateLink-${e.slug}`),
      }))
    : undefined;

  const gp = (c) =>
    c && typeof c.lat === "number" && typeof c.lng === "number"
      ? { _type: "geopoint", lat: c.lat, lng: c.lng }
      : undefined;

  const primaryStats = Array.isArray(fm.primaryStats)
    ? fm.primaryStats
        .filter((s) => s && s.label && s.value)
        .map((s) => ({ _type: "primaryStat", _key: randomKey(), label: String(s.label), value: String(s.value) }))
    : undefined;

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
    affiliateLinks: affiliateRefs && affiliateRefs.length ? affiliateRefs : undefined,
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

  const { frontmatter: fm, body, metadataSource, bodySource } = await readStoryInput();

  /* Legacy fallback: ensure author exists */
  if (!fm.author) fm.author = DEFAULT_AUTHOR;

  validateFrontmatter(fm);

  const { heroName, gallery, pdf, ignored } = await findAssets();

  const slug = (fm.slug && fm.slug.trim()) || slugify(fm.title);

  /* Will the published doc be a guide? PDF presence implies yes unless
     metadata explicitly sets guide.hasGuide: false. */
  const willBeGuide = fm.guide?.hasGuide === false ? false : !!(pdf || fm.guide?.hasGuide);

  console.log(
    `  metadata: ${metadataSource}\n` +
      `  body:     ${bodySource || "(none — will publish with empty body)"}\n` +
      `  title:    ${fm.title}\n` +
      `  slug:     ${slug}\n` +
      `  hero:     ${heroName || "(none)"}\n` +
      `  gallery:  ${gallery.length} photos\n` +
      `  pdf:      ${pdf || "(none)"}\n` +
      `  guide?    ${willBeGuide ? "YES" : "no"}\n`,
  );

  if (ignored.length) {
    console.log(`  ignored: ${ignored.join(", ")} (non-publishable source files)\n`);
  }

  const existing = TOKEN
    ? await client.fetch(`*[_type == "story" && slug.current == $slug][0]{_id, title}`, { slug })
    : null;
  if (existing) console.log(`  ⚠ Existing story found — will overwrite (${existing._id})\n`);

  /* Affiliate ingestion: load global yaml + per-guide yaml, resolve
     used set, build URL map for body link tagging, prepare upsert
     batch. Done before buildStoryDoc so it can attach references. */
  const globals = await loadGlobalAffiliates();
  const guideAffiliates = await loadGuideAffiliates();
  const usedAffiliates = resolveGuideAffiliateUsage(globals, guideAffiliates);
  const affiliateUrlMap = buildAffiliateUrlMap(usedAffiliates);
  const affiliateContext = { usedAffiliates, urlMap: affiliateUrlMap };

  if (usedAffiliates.size > 0) {
    console.log(
      `  affiliates: ${usedAffiliates.size} used` +
        ` (${[...usedAffiliates.values()].filter((e) => e.scope === "global").length} global` +
        ` + ${[...usedAffiliates.values()].filter((e) => e.scope === "guide").length} guide-specific)\n`,
    );
  } else if (guideAffiliates.source) {
    console.log(`  affiliates: ${guideAffiliates.source} found but contains no usable entries\n`);
  }

  const doc = await buildStoryDoc(fm, body, heroName, gallery, pdf, affiliateContext);

  console.log(
    `  refs to create/reuse:\n` +
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

  if (refQueue.length) {
    const refTx = client.transaction();
    for (const r of refQueue) refTx.createIfNotExists(r);
    await refTx.commit();
  }

  // Upsert (createOrReplace) every affiliateLink doc this guide uses,
  // before we createOrReplace the story (so the references are valid).
  // Idempotent by slug-derived _id — safe to re-run.
  if (usedAffiliates.size > 0) {
    const affTx = client.transaction();
    for (const entry of usedAffiliates.values()) {
      affTx.createOrReplace(buildAffiliateDoc(entry));
    }
    await affTx.commit();
    if (VERBOSE) console.log(`  ✓ Upserted ${usedAffiliates.size} affiliateLink doc(s)`);
  }

  await client.createOrReplace(doc);

  // PDF cheat sheet: regenerate per publish so the PDF author always
  // has a current /go/<slug> list to copy from.
  const cheatPath = await writePdfCheatSheet(usedAffiliates, slug);
  if (cheatPath) {
    console.log(`  ✓ PDF cheat sheet: ${path.relative(folder, cheatPath) || path.basename(cheatPath)}`);
  }

  const guideUrl =
    fm.guide?.hasGuide && (fm.guide?.pageSlug || slug)
      ? `https://testedroutes.com/guides/${fm.guide?.pageSlug || slug}`
      : null;

  console.log(`\n✓ Published.`);
  console.log(`  Story:  https://testedroutes.com/inspire/${slug}`);
  if (guideUrl) console.log(`  Guide:  ${guideUrl}`);
  console.log(`  Studio: https://testedroutes.vercel.app/studio/desk/story;${doc._id}\n`);
  console.log("Live site will update in ~30s via the Sanity → Vercel webhook.\n");
}

main().catch((err) => {
  console.error("\n✖ Publish failed:");
  console.error(err.message || err);
  process.exit(1);
});

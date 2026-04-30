#!/usr/bin/env node
/**
 * Replace em-dashes (—, U+2014) with en-dashes (–, U+2013) in
 * Sanity-stored content.
 *
 * Why: PR #23 swept the repository code (JSX / components / MD) but
 * left Sanity-stored Portable Text untouched. As of 2026-04-30,
 * /inspire still rendered ~48 em-dashes from story bodies because
 * those characters live in the CMS, not the codebase.
 *
 * Scope:
 *   - Walks `body` (Portable Text array) on every published story
 *   - Walks the long-form text fields where editors paste prose:
 *       eyebrow, subtitle, whyThisTrip, whoThisIsFor, whatYouGet,
 *       difficultyAtAGlance, notSuitableSales, whatMakesThisSpecial,
 *       moneySavingTips, permitsInfo, attentionNotes, faq[].question,
 *       faq[].answer, testimonials[].quote
 *   - Skips the title field (rare em-dash use, and titles drive slugs
 *     + URLs; safer to leave untouched and review case-by-case)
 *   - Skips fields that are typically machine-generated or short labels
 *     (storyId, slug, status, currency codes, geopoints, etc.)
 *
 * Idempotency: runs safely as many times as you want — the en-dash is
 * never re-replaced, no side effects on already-clean stories.
 *
 * Safety:
 *   - Default dry-run unless SANITY_SWEEP_ENABLED=1
 *   - Per-story error isolation
 *   - Reports exactly which fields changed and how many em-dashes
 *     were replaced per story
 *
 * Usage:
 *   npm run sweep:em-dashes -- --dry-run            # preview (default)
 *   SANITY_SWEEP_ENABLED=1 npm run sweep:em-dashes  # live
 *   npm run sweep:em-dashes -- --slug=<slug>        # single story
 *   npm run sweep:em-dashes -- --verbose            # log each replacement context
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN     Editor role
 *   SANITY_SWEEP_ENABLED       must be "1" to perform writes
 */
import { createClient } from "next-sanity";

/* ────────── args + env ────────── */

const args = process.argv.slice(2);
const FORCE_DRY = args.includes("--dry-run");
const SINGLE_SLUG =
  (args.find((a) => a.startsWith("--slug=")) || "").split("=")[1] || null;
const VERBOSE = args.includes("--verbose");

const ENABLED = process.env.SANITY_SWEEP_ENABLED === "1";
const DRY_RUN = FORCE_DRY || !ENABLED;

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
if (!DRY_RUN && !SANITY_TOKEN) exit("SANITY_API_WRITE_TOKEN is required for live runs");
if (!ENABLED && !FORCE_DRY) {
  console.log(
    "SANITY_SWEEP_ENABLED is not set to '1' — running in dry-run mode. Set the env var to perform writes.",
  );
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: SANITY_TOKEN,
});

/* ────────── target field list ────────── */

// Plain string fields where editors paste prose.
const STRING_FIELDS = [
  "eyebrow",
  "subtitle",
  "whyThisTrip",
  "whoThisIsFor",
  "whatYouGet",
  "difficultyAtAGlance",
  "notSuitableSales",
  "whatMakesThisSpecial",
  "moneySavingTips",
  "permitsInfo",
  "attentionNotes",
];

// Array-of-string fields (multi-line callout lists).
const STRING_ARRAY_FIELDS = [
  "uniqueSellingPoints",
  "difficultyFactors",
  "notSuitableIf",
  "highlights",
  "idealFor",
  "alternativeNames",
  "appearsInSearches",
  "searchSynonyms",
];

// FAQ + testimonials are arrays of objects; replacement targets specific subfields.
// `body` is Portable Text — handled by walkPortableText.

/* ────────── helpers ────────── */

function exit(msg) {
  console.error(`\n${msg}\n`);
  process.exit(1);
}

const EM = "—"; // U+2014
const EN = "–"; // U+2013

function replaceEmInString(s) {
  if (typeof s !== "string") return { value: s, count: 0 };
  if (!s.includes(EM)) return { value: s, count: 0 };
  const count = (s.match(/—/g) || []).length;
  return { value: s.replaceAll(EM, EN), count };
}

/**
 * Walk a Portable Text body[] array. Every block of `_type: "block"`
 * contains `children: [{ _type: "span", text: "...", marks: [...] }]`.
 * Replace em-dashes inside `span.text`.
 *
 * For custom block types (galleryGrid, mapEmbed, statBlock, callout,
 * pullQuote), we walk known text fields where applicable.
 */
function sweepPortableText(blocks, ctx) {
  if (!Array.isArray(blocks)) return { value: blocks, count: 0 };
  let total = 0;
  const out = blocks.map((block) => {
    if (!block || typeof block !== "object") return block;

    if (block._type === "block" && Array.isArray(block.children)) {
      const newChildren = block.children.map((child) => {
        if (child && child._type === "span" && typeof child.text === "string") {
          const r = replaceEmInString(child.text);
          if (r.count > 0) {
            total += r.count;
            if (VERBOSE) {
              console.log(`    ↳ block span: "${child.text.slice(0, 80)}…"`);
            }
            return { ...child, text: r.value };
          }
        }
        return child;
      });
      return { ...block, children: newChildren };
    }

    // Custom block types — handle the text fields each carries.
    if (block._type === "callout") {
      let count = 0;
      const next = { ...block };
      for (const k of ["title", "body"]) {
        const r = replaceEmInString(next[k]);
        if (r.count > 0) {
          count += r.count;
          next[k] = r.value;
        }
      }
      total += count;
      return next;
    }
    if (block._type === "pullQuote") {
      let count = 0;
      const next = { ...block };
      for (const k of ["quote", "attribution"]) {
        const r = replaceEmInString(next[k]);
        if (r.count > 0) {
          count += r.count;
          next[k] = r.value;
        }
      }
      total += count;
      return next;
    }
    if (block._type === "statBlock") {
      let count = 0;
      const next = { ...block };
      for (const k of ["label", "value", "context"]) {
        const r = replaceEmInString(next[k]);
        if (r.count > 0) {
          count += r.count;
          next[k] = r.value;
        }
      }
      total += count;
      return next;
    }
    if (block._type === "galleryGrid") {
      // Walk image alt + caption fields if present.
      let count = 0;
      const next = { ...block };
      if (Array.isArray(next.images)) {
        next.images = next.images.map((img) => {
          if (!img || typeof img !== "object") return img;
          let local = 0;
          const ni = { ...img };
          for (const k of ["alt", "caption"]) {
            const r = replaceEmInString(ni[k]);
            if (r.count > 0) {
              local += r.count;
              ni[k] = r.value;
            }
          }
          count += local;
          return local > 0 ? ni : img;
        });
      }
      total += count;
      return next;
    }
    if (block._type === "mapEmbed") {
      // Title / caption etc. on map embeds.
      let count = 0;
      const next = { ...block };
      for (const k of ["title", "caption"]) {
        const r = replaceEmInString(next[k]);
        if (r.count > 0) {
          count += r.count;
          next[k] = r.value;
        }
      }
      total += count;
      return next;
    }
    return block;
  });
  return { value: out, count: total };
}

/* ────────── per-story sweep ────────── */

function sweepStory(story) {
  // Build a `set` patch payload only with fields that actually changed.
  const set = {};
  const fieldCounts = {};
  let total = 0;

  // 1. Plain string fields
  for (const field of STRING_FIELDS) {
    const r = replaceEmInString(story[field]);
    if (r.count > 0) {
      set[field] = r.value;
      fieldCounts[field] = r.count;
      total += r.count;
    }
  }

  // 2. Array-of-string fields
  for (const field of STRING_ARRAY_FIELDS) {
    const arr = story[field];
    if (!Array.isArray(arr)) continue;
    let count = 0;
    const next = arr.map((item) => {
      const r = replaceEmInString(item);
      count += r.count;
      return r.value;
    });
    if (count > 0) {
      set[field] = next;
      fieldCounts[field] = count;
      total += count;
    }
  }

  // 3. faq[] — array of { question, answer }
  if (Array.isArray(story.faq)) {
    let count = 0;
    const next = story.faq.map((item) => {
      if (!item || typeof item !== "object") return item;
      const ni = { ...item };
      for (const k of ["question", "answer"]) {
        const r = replaceEmInString(ni[k]);
        if (r.count > 0) {
          count += r.count;
          ni[k] = r.value;
        }
      }
      return ni;
    });
    if (count > 0) {
      set.faq = next;
      fieldCounts.faq = count;
      total += count;
    }
  }

  // 4. testimonials[] — array of { quote, author, location }
  if (Array.isArray(story.testimonials)) {
    let count = 0;
    const next = story.testimonials.map((item) => {
      if (!item || typeof item !== "object") return item;
      const ni = { ...item };
      for (const k of ["quote", "author", "location"]) {
        const r = replaceEmInString(ni[k]);
        if (r.count > 0) {
          count += r.count;
          ni[k] = r.value;
        }
      }
      return ni;
    });
    if (count > 0) {
      set.testimonials = next;
      fieldCounts.testimonials = count;
      total += count;
    }
  }

  // 5. body — Portable Text
  if (Array.isArray(story.body)) {
    const r = sweepPortableText(story.body, { storyId: story._id });
    if (r.count > 0) {
      set.body = r.value;
      fieldCounts.body = r.count;
      total += r.count;
    }
  }

  return { set, fieldCounts, total };
}

/* ────────── main ────────── */

async function main() {
  console.log(
    `\nsweep-sanity-em-dashes  •  ${DRY_RUN ? "DRY RUN" : "LIVE"}${
      SINGLE_SLUG ? `  •  slug=${SINGLE_SLUG}` : ""
    }`,
  );

  const filter = SINGLE_SLUG
    ? `*[_type == "story" && slug.current == $slug]`
    : `*[_type == "story" && status == "published"]`;

  const stories = await sanity.fetch(
    `${filter}{
      _id,
      title,
      "slug": slug.current,
      eyebrow,
      subtitle,
      body,
      whyThisTrip,
      whoThisIsFor,
      whatYouGet,
      difficultyAtAGlance,
      notSuitableSales,
      whatMakesThisSpecial,
      moneySavingTips,
      permitsInfo,
      attentionNotes,
      uniqueSellingPoints,
      difficultyFactors,
      notSuitableIf,
      highlights,
      idealFor,
      alternativeNames,
      appearsInSearches,
      searchSynonyms,
      faq,
      testimonials
    }`,
    SINGLE_SLUG ? { slug: SINGLE_SLUG } : {},
  );

  console.log(`\nFound ${stories.length} story(ies). Scanning…\n`);

  const report = { changed: [], unchanged: [], failed: [] };
  let grandTotal = 0;

  for (const story of stories) {
    let result;
    try {
      result = sweepStory(story);
    } catch (err) {
      report.failed.push({ slug: story.slug, error: err.message });
      console.log(`  ✗ FAIL   ${story.slug.padEnd(40)} ${err.message}`);
      continue;
    }

    if (result.total === 0) {
      report.unchanged.push(story.slug);
      if (VERBOSE) console.log(`  · clean  ${story.slug}`);
      continue;
    }

    grandTotal += result.total;
    const fieldsTouched = Object.keys(result.fieldCounts);
    const summary = fieldsTouched
      .map((k) => `${k}:${result.fieldCounts[k]}`)
      .join(", ");

    if (DRY_RUN) {
      console.log(
        `  ◌ would  ${story.slug.padEnd(40)} ${result.total} replacement(s) — ${summary}`,
      );
      report.changed.push(story.slug);
      continue;
    }

    try {
      await sanity.patch(story._id).set(result.set).commit();
      console.log(
        `  ✓ patch  ${story.slug.padEnd(40)} ${result.total} replacement(s) — ${summary}`,
      );
      report.changed.push(story.slug);
    } catch (err) {
      report.failed.push({ slug: story.slug, error: err.message });
      console.log(`  ✗ FAIL   ${story.slug.padEnd(40)} ${err.message}`);
    }
  }

  console.log("");
  console.log(`  ${DRY_RUN ? "Would change" : "Changed"}: ${report.changed.length}`);
  console.log(`  Unchanged:   ${report.unchanged.length}`);
  console.log(`  Failed:      ${report.failed.length}`);
  for (const f of report.failed) console.log(`    - ${f.slug}: ${f.error}`);
  console.log(`  Total replacements: ${grandTotal}`);
  console.log("");

  if (report.failed.length) process.exit(1);
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  console.error(err.stack);
  process.exit(1);
});

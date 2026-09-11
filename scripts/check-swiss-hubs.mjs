#!/usr/bin/env node
/**
 * TestedRoutes — drift checker for the Switzerland region registry.
 *
 * Same philosophy as check:guides and check:inspire: it doesn't fix
 * anything, it tells you where the code (app/_lib/swissRegions.js) and the
 * live dataset disagree about which guide and story belongs to which
 * regional hub. Story `regions` in Sanity are display labels, not keys, so
 * the registry is hand-maintained - and a hand-maintained list is exactly
 * the kind that rots silently: a guide publishes, nobody adds it, and it
 * never appears on the country page or on any sub-hub, with no error
 * anywhere.
 *
 * Findings:
 *
 *  ERROR  — a slug listed in a region is not live (typo, or the doc was
 *           unpublished / retired). The page would silently render nothing
 *           for it. Exits 1.
 *  ERROR  — a live Swiss guide sits in zero regions (it vanishes from the
 *           country page) or in two or more (it would be sold twice, and
 *           two sub-hubs would claim it). Exits 1.
 *  WARN   — a live Swiss story sits in no region. The country page still
 *           lists it; a sub-hub never will. Fine for a genuinely national
 *           story, wrong for a stage story - a human decides which.
 *           `--strict` turns these into failures.
 *
 * "Swiss" here means `destination->slug.current == "switzerland"`, which is
 * the same scoping the country page's fetch uses, so the two cannot drift.
 * Guides are matched on their PAGE slug (coalesce(guide.pageSlug,
 * slug.current)) because that is what /guides/ routes on and what the
 * registry lists; stories on their doc slug.
 *
 * Read-only against the public dataset; no token needed.
 *
 * Usage:
 *   npm run check:swiss-hubs
 *   npm run check:swiss-hubs -- --strict
 */
import { createClient } from "next-sanity";
import { SWISS_REGIONS } from "../app/_lib/swissRegions.js";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "y3gc8dx6";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const STRICT = process.argv.includes("--strict");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const [guides, stories] = await Promise.all([
    client.fetch(
      `*[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "switzerland" && (language == "en" || !defined(language))]{
        "pageSlug": coalesce(guide.pageSlug, slug.current), "slug": slug.current, title
      }`,
    ),
    client.fetch(
      `*[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "switzerland" && (language == "en" || !defined(language))]{
        "slug": slug.current, title
      }`,
    ),
  ]);

  const liveGuideSlugs = new Set(guides.map((g) => g.pageSlug));
  const liveStorySlugs = new Set(stories.map((s) => s.slug));

  const errors = [];
  const warnings = [];

  // Registry → live: every listed slug must exist.
  for (const region of SWISS_REGIONS) {
    for (const slug of region.guideSlugs) {
      if (!liveGuideSlugs.has(slug)) {
        // Say so when the registry named the DOC slug instead of the page slug -
        // that is the likeliest way a Trift-style guide ends up here.
        const byDoc = guides.find((g) => g.slug === slug);
        errors.push(
          `${region.slug}: guide "${slug}" is not live` +
            (byDoc ? ` (that is the doc slug; the page slug is "${byDoc.pageSlug}")` : ""),
        );
      }
    }
    for (const slug of region.storySlugs) {
      if (!liveStorySlugs.has(slug)) {
        errors.push(`${region.slug}: story "${slug}" is not live`);
      }
    }
  }

  // Live → registry: every guide in exactly one region, every story in at most one.
  for (const g of guides) {
    const owners = SWISS_REGIONS.filter((r) => r.guideSlugs.includes(g.pageSlug)).map((r) => r.slug);
    if (owners.length === 0) {
      errors.push(`live guide "${g.pageSlug}" (${g.title}) is in no region - it will not appear on the country page`);
    } else if (owners.length > 1) {
      errors.push(`live guide "${g.pageSlug}" is in ${owners.length} regions: ${owners.join(", ")}`);
    }
  }
  for (const s of stories) {
    const owners = SWISS_REGIONS.filter((r) => r.storySlugs.includes(s.slug)).map((r) => r.slug);
    if (owners.length === 0) {
      warnings.push(`live story "${s.slug}" (${s.title}) is in no region`);
    } else if (owners.length > 1) {
      errors.push(`live story "${s.slug}" is in ${owners.length} regions: ${owners.join(", ")}`);
    }
  }

  if (errors.length) {
    console.log(`\n✗ ${errors.length} error(s) between swissRegions.js and live Sanity:\n`);
    for (const e of errors) console.log(`  ${e}`);
  }
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} live Swiss story(ies) in no region:\n`);
    for (const w of warnings) console.log(`  ${w}`);
    console.log(`\n  Add each to a region's storySlugs in app/_lib/swissRegions.js, or leave it national on purpose.`);
  }
  if (!errors.length && !warnings.length) {
    console.log(
      `✓ ${guides.length} live Swiss guides and ${stories.length} stories all placed, one region each, across ${SWISS_REGIONS.length} regions.`,
    );
  }
  process.exit(errors.length || (STRICT && warnings.length) ? 1 : 0);
}

main().catch((e) => {
  console.error(`✗ ${e.message || e}`);
  process.exit(1);
});

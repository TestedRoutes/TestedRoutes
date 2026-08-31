#!/usr/bin/env node
/**
 * TestedRoutes — drift checker for inspire-story → guide tagging.
 *
 * Same philosophy as check:guides: it doesn't fix anything, it tells you
 * where the data and the rendered site disagree about intent.
 *
 * Two findings:
 *
 *  ERROR  — a story's `relatedGuideSlugs` names a guide that doesn't exist
 *           live. The page silently drops the tag and falls back, so a typo
 *           is invisible in the browser; this is the only place it surfaces.
 *           Exits 1.
 *
 *  WARN   — a published story with no tag and no legacy pin sits in a
 *           country with 2+ live guides, so the country fallback (top 3 by
 *           purchases) is choosing its guides. Fine for genuinely shared
 *           stories, wrong for stage/venue stories — the list is here so a
 *           human decides which. `--strict` turns these into failures.
 *
 * Read-only against the public dataset; no token needed.
 *
 * Usage:
 *   npm run check:inspire            # errors fail, warnings listed
 *   npm run check:inspire -- --strict
 */
import { createClient } from "next-sanity";

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
  const [stories, guides] = await Promise.all([
    client.fetch(
      `*[_type == "story" && status == "published" && guide.hasGuide != true]{
        "slug": slug.current, title, language, relatedGuideSlugs,
        "pinSlug": guide.pageSlug,
        "country": destination->country
      }`,
    ),
    client.fetch(
      `*[_type == "story" && status == "published" && guide.hasGuide == true]{
        "pageSlug": coalesce(guide.pageSlug, slug.current), "slug": slug.current,
        title, "country": destination->country,
        "purchases": coalesce(guide.purchasesCount, 0)
      }`,
    ),
  ]);

  const knownGuideSlugs = new Set(guides.flatMap((g) => [g.pageSlug, g.slug]));
  const guidesByCountry = new Map();
  for (const g of guides) {
    if (!g.country) continue;
    if (!guidesByCountry.has(g.country)) guidesByCountry.set(g.country, []);
    guidesByCountry.get(g.country).push(g);
  }

  const errors = [];
  const warnings = [];

  for (const s of stories) {
    const tags = Array.isArray(s.relatedGuideSlugs) ? s.relatedGuideSlugs : [];
    const unknown = tags.filter((t) => !knownGuideSlugs.has(t));
    if (unknown.length) {
      errors.push(`${s.slug} (${s.language || "en"}) tags unknown guide(s): ${unknown.join(", ")}`);
    }
    if (tags.length) continue;

    // Untagged: does anything pin it? (legacy guide.pageSlug, or a guide
    // sharing the story's slug — the same order the page resolves in)
    if (s.pinSlug || knownGuideSlugs.has(s.slug)) continue;

    const countryGuides = s.country ? guidesByCountry.get(s.country) || [] : [];
    if (countryGuides.length >= 2) {
      const fallback = [...countryGuides]
        .sort((a, b) => b.purchases - a.purchases)
        .slice(0, 3)
        .map((g) => g.pageSlug)
        .join(", ");
      warnings.push(`${s.slug} (${s.language || "en"}) — country fallback picks: ${fallback}`);
    }
  }

  if (errors.length) {
    console.log(`\n✗ ${errors.length} story(ies) tag guides that don't exist:\n`);
    for (const e of errors) console.log(`  ${e}`);
  }
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} untagged story(ies) letting the country fallback choose:\n`);
    for (const w of warnings) console.log(`  ${w}`);
    console.log(`\n  Tag intentional ones with npm run set:story-guides -- --story <slug> --guides <slugs>`);
  }
  if (!errors.length && !warnings.length) {
    console.log(`✓ ${stories.length} published stories, all guide links resolve intentionally.`);
  }
  process.exit(errors.length || (STRICT && warnings.length) ? 1 : 0);
}

main().catch((e) => {
  console.error(`✗ ${e.message || e}`);
  process.exit(1);
});

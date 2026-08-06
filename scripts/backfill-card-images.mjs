#!/usr/bin/env node
/**
 * Backfill guide.cardImage on guide stories that don't have one yet.
 *
 * Cards render cardImage at a fixed 4:5 crop, so any source shape works.
 * This seeds the field from the guide's cover artwork (the branded page-1
 * export, so the title survives the crop), falling back to the story hero
 * photo when there is no cover. The seeded crop is hotspot-centered —
 * open the doc in Studio afterwards to tune the framing per guide.
 *
 * A guide with a hand-made 4:5 branded crop should get it uploaded in
 * Studio instead; this script never overwrites an existing cardImage.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-card-images.mjs [--dry-run] [--slug <story slug>]
 */
import { createClient } from "next-sanity";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const slugIdx = args.indexOf("--slug");
const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Token fetches return drafts and published docs alike; patching both keeps
// a later Studio publish from reverting the backfill.
const docs = await client.fetch(
  `*[_type == "story" && guide.hasGuide == true ${ONLY_SLUG ? "&& slug.current == $slug" : ""}]{
    _id,
    title,
    "slug": slug.current,
    "hasCardImage": defined(guide.cardImage.asset),
    "cover": guide.cover,
    heroImage
  }`,
  ONLY_SLUG ? { slug: ONLY_SLUG } : {},
);

if (!docs.length) {
  console.error("no guide stories matched");
  process.exit(1);
}

let patched = 0;
for (const doc of docs) {
  if (doc.hasCardImage) {
    console.log(`skip  ${doc._id} (${doc.slug}) — already has a cardImage`);
    continue;
  }
  const source = doc.cover?.asset ? doc.cover : doc.heroImage?.asset ? doc.heroImage : null;
  if (!source) {
    console.warn(`WARN  ${doc._id} (${doc.slug}) — no cover or hero image to seed from`);
    continue;
  }
  const from = source === doc.cover ? "cover" : "heroImage";
  const cardImage = {
    _type: "image",
    asset: { _type: "reference", _ref: source.asset._ref },
    // Keep the source's framing when it has one so the 4:5 crop starts from
    // the same focal point the editor already chose.
    ...(source.hotspot ? { hotspot: source.hotspot } : {}),
    ...(source.crop ? { crop: source.crop } : {}),
    alt: source.alt || doc.title,
  };
  console.log(`${DRY_RUN ? "would" : "patch"} ${doc._id} (${doc.slug}) — seed cardImage from ${from}`);
  if (!DRY_RUN) {
    const res = await client.patch(doc._id).set({ "guide.cardImage": cardImage }).commit();
    console.log("  done, rev", res._rev);
    patched++;
  }
}
console.log(DRY_RUN ? "dry run complete" : `patched ${patched} doc(s)`);

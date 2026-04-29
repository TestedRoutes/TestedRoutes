/**
 * One-time migration: copy lastVerifiedDate → lastReviewedDate (and
 * verificationFrequencyMonths → reviewFrequencyMonths) on every story
 * document, then unset the old fields.
 *
 *   node --env-file=.env.local scripts/migrate-last-reviewed.mjs
 *
 * Safe to re-run: skips docs that already have the new fields and no
 * legacy fields to migrate.
 *
 * Requires SANITY_API_WRITE_TOKEN.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const docs = await client.fetch(
  `*[_type == "story" && (defined(lastVerifiedDate) || defined(verificationFrequencyMonths))]{
    _id, _rev, title, lastVerifiedDate, verificationFrequencyMonths,
    lastReviewedDate, reviewFrequencyMonths
  }`,
);

if (!docs.length) {
  console.log("No stories with legacy fields. Nothing to migrate.");
  process.exit(0);
}

console.log(`Migrating ${docs.length} story document(s)…`);
let migrated = 0;
for (const doc of docs) {
  const patches = {};
  const unsets = [];
  if (doc.lastVerifiedDate && !doc.lastReviewedDate) {
    patches.lastReviewedDate = doc.lastVerifiedDate;
  }
  if (doc.verificationFrequencyMonths && !doc.reviewFrequencyMonths) {
    patches.reviewFrequencyMonths = doc.verificationFrequencyMonths;
  }
  if (doc.lastVerifiedDate) unsets.push("lastVerifiedDate");
  if (doc.verificationFrequencyMonths) unsets.push("verificationFrequencyMonths");

  let tx = client.patch(doc._id);
  if (Object.keys(patches).length) tx = tx.set(patches);
  if (unsets.length) tx = tx.unset(unsets);
  await tx.commit();
  console.log(
    `  ✓ ${doc.title || doc._id}: set=${JSON.stringify(patches)} unset=${unsets.join(",")}`,
  );
  migrated++;
}

console.log(`Done. Migrated ${migrated}.`);

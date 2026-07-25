#!/usr/bin/env node
/**
 * Rename a published story document in Sanity.
 *
 * publish-to-sanity derives the document _id from the slug (`story-<slug>`),
 * so changing a story's slug on disk without moving the document leaves the
 * old one live and makes the next publish create a duplicate. This copies the
 * document to the new _id (carrying every field and asset reference), applies
 * the new slug/storyId/title, then deletes the original.
 *
 * Usage:
 *   node --env-file=.env.local scripts/rename-story-doc.mjs \
 *     --from story-x-eight-days --to story-x-seven-days \
 *     --slug x-seven-days --story-id 2026_x-seven-days \
 *     [--set '{"title":"…"}'] [--dry-run]
 */
import { createClient } from "next-sanity";

const args = process.argv.slice(2);
const argOf = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const FROM = argOf("--from");
const TO = argOf("--to");
const SLUG = argOf("--slug");
const STORY_ID = argOf("--story-id");
const SET = argOf("--set");
const DRY_RUN = args.includes("--dry-run");

if (!FROM || !TO || !SLUG) {
  console.error("usage: --from <id> --to <id> --slug <slug> [--story-id <id>] [--set <json>] [--dry-run]");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const doc = await client.getDocument(FROM);
if (!doc) {
  console.error(`source document not found: ${FROM}`);
  process.exit(1);
}
if (await client.getDocument(TO)) {
  console.error(`target already exists: ${TO}`);
  process.exit(1);
}

// Anything referencing the old document has to be repointed, or the rename
// silently breaks related-story links.
const referrers = await client.fetch(`*[references($id)]{_id, _type}`, { id: FROM });

const { _id, _rev, _createdAt, _updatedAt, _system, ...rest } = doc;
const next = {
  ...rest,
  _id: TO,
  slug: { _type: "slug", current: SLUG },
  ...(STORY_ID ? { storyId: STORY_ID } : {}),
  ...(SET ? JSON.parse(SET) : {}),
};

console.log(`${DRY_RUN ? "[dry-run] " : ""}${FROM} -> ${TO}`);
console.log(`  slug     ${doc.slug?.current} -> ${SLUG}`);
if (STORY_ID) console.log(`  storyId  ${doc.storyId} -> ${STORY_ID}`);
if (SET) for (const [k, v] of Object.entries(JSON.parse(SET))) console.log(`  ${k.padEnd(8)} ${String(v).slice(0, 70)}`);
console.log(`  referring documents: ${referrers.length}${referrers.length ? " (" + referrers.map((r) => r._id).join(", ") + ")" : ""}`);

if (DRY_RUN) {
  console.log("dry run - nothing written");
  process.exit(0);
}

await client.create(next);
console.log(`  created ${TO}`);

for (const r of referrers) {
  const full = await client.getDocument(r._id);
  const repointed = JSON.parse(JSON.stringify(full).replaceAll(`"${FROM}"`, `"${TO}"`));
  const { _rev: _r, _updatedAt: _u, _createdAt: _c, _system: _s, ...body } = repointed;
  await client.createOrReplace(body);
  console.log(`  repointed ${r._id}`);
}

await client.delete(FROM);
console.log(`  deleted ${FROM}`);

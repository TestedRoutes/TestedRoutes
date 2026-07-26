// One-off: set guide.statusNote on a story doc. Patches only that field.
// Usage: node --env-file=.env.local patch-status-note.mjs <slug> "<note>"
import { createClient } from "next-sanity";

const [slug, note] = process.argv.slice(2);
if (!slug) {
  console.error('usage: patch-status-note.mjs <slug> "<note>" (empty note clears)');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const doc = await client.fetch(
  `*[_type == "story" && slug.current == $slug && defined(guide)][0]{_id, title, "note": guide.statusNote}`,
  { slug },
);
if (!doc) {
  console.error(`no guide story found for slug ${slug}`);
  process.exit(1);
}
console.log(`patching ${doc._id} (${doc.title}): statusNote ${JSON.stringify(doc.note)} -> ${JSON.stringify(note || null)}`);

const p = client.patch(doc._id);
const res = note ? await p.set({ "guide.statusNote": note }).commit()
                 : await p.unset(["guide.statusNote"]).commit();
console.log("done, rev", res._rev);

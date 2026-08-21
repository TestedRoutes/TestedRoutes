// One-shot: upload the Triftbrücke PDF asset onto the guide story
// (draft + published). Usage: node --env-file=.env.local scripts/publish-trift-pdf.mjs
//
// This script used to set guide.customPrices too, from the days when the
// guide had no scripts/guides/ data module and the price had nowhere better
// to live. The module exists now and carries the price, which check:guides
// verifies against the live document — while nothing checks this script.
// Two writers for one field is exactly the drift shape the publish engine
// was rebuilt to remove (tracker #237), so this script is PDF-only now: a
// re-run can never roll the price back.
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";

const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\trift-bridge-from-zurich\final\TestedRoutes-Triftbrucke-Day-Trip.pdf`;
const SLUG = "triftbrucke-from-zurich";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const asset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Triftbrucke-Day-Trip.pdf",
  contentType: "application/pdf",
});
console.log("uploaded asset", asset._id, Math.round(asset.size / 1024), "KB");

const docs = await client.fetch(
  `*[_type == "story" && slug.current == $slug && defined(guide)]{_id}`,
  { slug: SLUG },
);
for (const d of docs) {
  await client
    .patch(d._id)
    .set({
      "guide.pdf": { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    })
    .commit();
  console.log("patched", d._id);
}

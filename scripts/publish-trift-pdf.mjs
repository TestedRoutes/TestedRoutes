// One-shot: upload the Triftbrücke PDF asset and set customPrices on the
// guide story (draft + published). Usage: node --env-file=.env.local scripts/publish-trift-pdf.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";

const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\trift-bridge-from-zurich\final\TestedRoutes-Triftbrucke-Day-Trip.pdf`;
const SLUG = "triftbrucke-from-zurich";
// Kept in step with the live price so a re-run of this script (its real job is
// the PDF upload) cannot quietly roll the price back. Day / layover rung of the
// ladder, Content Plan v57 Pricing tab, founder 2026-08-16. This guide has no
// scripts/guides/ data module, so there is nowhere better for the number to
// live yet.
const PRICES = [
  { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 12 },
  { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 12 },
  { _key: "usd", _type: "priceEntry", currency: "USD", amount: 15 },
  { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 12 },
];

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
      "guide.customPrices": PRICES,
    })
    .commit();
  console.log("patched", d._id);
}

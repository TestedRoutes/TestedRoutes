#!/usr/bin/env node
/**
 * Re-upload a guide's sellable PDF and repoint guide.pdf at the new asset.
 *
 * Generalised from publish-trift-pdf.mjs / publish-simplon-pdf.mjs, which
 * were one-shots that also (re)set prices. A PDF revision happens far more
 * often than a first publish, and it must NOT go through the guide's
 * create-*.mjs script: those are createOrReplace on a fixed _id, so re-running
 * one to pick up a new PDF silently reverts every patch made since (prices,
 * carousel, copy fixes). This patches the single field instead, on the draft
 * and the published doc alike, so a later Studio publish can't bring the old
 * PDF back.
 *
 * The page count is read off the new file and compared with guide.pages —
 * mismatches are reported, not written, because the sales copy quotes that
 * number and the founder may have meant to change it.
 *
 * Card renders are NOT touched here: carousel slides 1-2 and guide.cover are
 * renders of PDF pages 1-2 (see CLAUDE.md), and the tool that regenerates
 * them reads the PDF already in Sanity. Run it after this one:
 *   npm run reexport:cards -- --slug <slug>
 *
 * Usage:
 *   node --env-file=.env.local scripts/replace-guide-pdf.mjs --slug <slug> --file <path> [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};

const SLUG = arg("--slug");
const FILE = arg("--file");
if (!SLUG || !FILE) {
  console.error("usage: --slug <story slug> --file <path to pdf> [--dry-run]");
  process.exit(1);
}

const bytes = readFileSync(FILE);
if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
  console.error(`${FILE} does not start with %PDF- — not a PDF?`);
  process.exit(1);
}
// The page tree's root /Count is the page total; the last one wins in an
// incrementally-updated file, which is why this scans rather than matching once.
const counts = [...bytes.toString("latin1").matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
const pageCount = counts.length ? Math.max(...counts) : null;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Token fetches return drafts alongside published docs — both get patched.
const docs = await client.fetch(
  `*[_type == "story" && slug.current == $slug && defined(guide)]{
     _id, title, "pages": guide.pages, "currentPdf": guide.pdf.asset->originalFilename, "currentRef": guide.pdf.asset._ref
   }`,
  { slug: SLUG },
);
if (!docs.length) {
  console.error(`no guide story with slug "${SLUG}"`);
  process.exit(1);
}

console.log(`${path.basename(FILE)} — ${Math.round(bytes.length / 1024)} KB, ${pageCount} pages`);
for (const d of docs) {
  console.log(`  ${d._id}: currently ${d.currentPdf ?? "(no pdf)"} — guide.pages ${d.pages}`);
  if (pageCount && d.pages && pageCount !== d.pages) {
    console.warn(`  ! page count changed ${d.pages} -> ${pageCount}; guide.pages is NOT updated by this script`);
  }
}

if (DRY_RUN) {
  console.log("DRY RUN — nothing uploaded or patched.");
  process.exit(0);
}

const asset = await client.assets.upload("file", bytes, {
  filename: path.basename(FILE),
  contentType: "application/pdf",
});
console.log("uploaded asset", asset._id, Math.round(asset.size / 1024), "KB");

for (const d of docs) {
  if (d.currentRef === asset._id) {
    // Sanity dedupes on content hash: identical bytes come back as the same
    // asset _id, so this run changed nothing.
    console.log("unchanged (identical file already attached)", d._id);
    continue;
  }
  await client
    .patch(d._id)
    .set({ "guide.pdf": { _type: "file", asset: { _type: "reference", _ref: asset._id } } })
    .commit();
  console.log("patched", d._id);
}

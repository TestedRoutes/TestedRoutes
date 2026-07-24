#!/usr/bin/env node
/**
 * Fill a guide's carousel from a folder of publish-ready media.
 *
 * The founder curates the folder by hand: files are named with a leading
 * number giving display order ("1. cover.jpg", "2. snapshot.jpg", "3 route.jpg",
 * "4. sunset.mp4", … "10.jpg"), and page exports already have their QR codes
 * removed. This script does not crop, mask or re-order anything — it uploads
 * what is there, in numeric order, and replaces guide.carousel wholesale.
 *
 * Images are downscaled to a display-only 1600px long edge before upload so
 * the source pages are never served at print resolution.
 *
 * Alt text comes from ALT below, keyed by filename; a file with no entry
 * still uploads (alt falls back to the guide title) so adding a slide never
 * blocks on copy.
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-guide-carousel.mjs \
 *     --doc story-seychelles-1-week --dir "content/countries/seychelles/guide/generated/web"
 *   …add --dry-run to list the resolved order without writing.
 */
import { createClient } from "next-sanity";
import { createReadStream } from "node:fs";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const DOC = argOf("--doc");
const DIR = argOf("--dir");
const DRY_RUN = args.includes("--dry-run");
if (!DOC || !DIR) {
  console.error("usage: --doc <sanity doc id> --dir <folder> [--dry-run]");
  process.exit(1);
}

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);
const MAX_EDGE = 1600;

// Alt text per source filename. Captions are deliberately sparse: the page
// exports get one so a buyer knows they are seeing inside the product; the
// trip photos speak for themselves.
const ALT = {
  "1. cover.jpg": {
    alt: "Cover of the Seychelles eight-day island route guide",
    caption: "The guide",
  },
  "2. snapshot.jpg": {
    alt: "Route snapshot page: pace, difficulty, season and what to expect",
    caption: "Route snapshot",
  },
  "3 route.jpg": {
    alt: "Route map across Mahé, Praslin, Curieuse and La Digue",
    caption: "The route, mapped",
  },
  "4. sunset.mp4": { alt: "Sunset over the Indian Ocean, filmed on the route" },
  "5. sample-day.jpg": {
    alt: "A day page from the guide, timed from morning to evening",
    caption: "A day, hour by hour",
  },
  "6.jpg": { alt: "Sunset through palm fronds on a Seychelles beach" },
  "7.jpg": { alt: "Dusk on the beach with a catamaran anchored offshore and a crescent moon" },
  "8.jpg": { alt: "The granite islet of St. Pierre in turquoise water off Praslin" },
  "9.mp4": { alt: "Clear water off the islands, filmed on the route" },
  "10.jpg": { alt: "Granite boulders and a leaning palm on Anse Source d'Argent, La Digue" },
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(6).toString("hex");

// "10.jpg" must sort after "9.mp4": order on the leading integer, not
// lexically. Files without a leading number sort last, by name.
function orderOf(name) {
  const m = name.match(/^\s*(\d+)/);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

const entries = (await readdir(DIR))
  .filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
  })
  .sort((a, b) => orderOf(a) - orderOf(b) || a.localeCompare(b));

if (!entries.length) {
  console.error(`no media found in ${DIR}`);
  process.exit(1);
}

console.log(`${entries.length} slide(s) in ${DIR}:`);
for (const [i, f] of entries.entries()) {
  const meta = ALT[f] || {};
  console.log(
    `  ${String(i + 1).padStart(2)}. ${f.padEnd(20)} ${VIDEO_EXT.has(path.extname(f).toLowerCase()) ? "video" : "image"}${meta.alt ? "" : "   (no alt text — using guide title)"}`,
  );
}
if (DRY_RUN) {
  console.log("\nDry run — nothing uploaded.");
  process.exit(0);
}

const TMP = path.join(DIR, ".web-tmp");
await mkdir(TMP, { recursive: true });

const slides = [];
for (const file of entries) {
  const src = path.join(DIR, file);
  const ext = path.extname(file).toLowerCase();
  const meta = ALT[file] || {};
  const isVideo = VIDEO_EXT.has(ext);

  let asset;
  if (isVideo) {
    asset = await client.assets.upload("file", createReadStream(src), { filename: file });
  } else {
    // Downscale for display; never ship the print-resolution page export.
    const out = path.join(TMP, `${path.parse(file).name}.jpg`);
    await sharp(src)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toFile(out);
    const before = (await stat(src)).size;
    const after = (await stat(out)).size;
    console.log(`  resized ${file}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
    asset = await client.assets.upload("image", createReadStream(out), { filename: file });
  }

  slides.push({
    _type: "carouselSlide",
    _key: key(),
    ...(isVideo
      ? { video: { _type: "file", asset: { _type: "reference", _ref: asset._id } } }
      : { image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }),
    ...(meta.alt ? { alt: meta.alt } : {}),
    ...(meta.caption ? { caption: meta.caption } : {}),
  });
  console.log(`  uploaded ${file} -> ${asset._id}`);
}

await client.patch(DOC).set({ "guide.carousel": slides }).commit();
console.log(`\nset guide.carousel on ${DOC}: ${slides.length} slides`);

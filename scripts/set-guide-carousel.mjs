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
  // Keys are scoped per doc id: the same natural filename ("1. cover.jpg")
  // can exist in every guide folder without captions bleeding across guides.
  "story-seychelles-1-week": {
    "1. cover.jpg": { alt: "Cover of the Seychelles seven-day island route guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: pace, difficulty, season and what to expect" },
    "3 route.jpg": { alt: "Route map across Mahé, Praslin, Curieuse and La Digue" },
    "4. sunset.mp4": { alt: "Sunset over the Indian Ocean, filmed on the route" },
    "5. sample-day.jpg": { alt: "A day page from the guide, timed from morning to evening" },
    "6.jpg": { alt: "Sunset through palm fronds on a Seychelles beach" },
    "7.jpg": { alt: "Dusk on the beach with a catamaran anchored offshore and a crescent moon" },
    "8.jpg": { alt: "The granite islet of St. Pierre in turquoise water off Praslin" },
    "9.mp4": { alt: "Clear water off the islands, filmed on the route" },
    "10.jpg": { alt: "Granite boulders and a leaning palm on Anse Source d'Argent, La Digue" },
  },
  "story-triftbrucke-from-zurich": {
    "1. cover.jpg": { alt: "Cover of the Triftbrücke day-trip guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: effort, difficulty, season and what to expect" },
    "3. Clip.mp4": { alt: "Crossing the Triftbrücke, filmed on the route" },
    "4. bridge.jpg": { alt: "The 170 m Triftbrücke spanning the Trift gorge" },
    "5. clip.mp4": { alt: "On the trail above the Trift gorge, filmed on the route" },
    "6. triftsee.jpg": { alt: "Turquoise Triftsee below the gorge cliffs" },
    "7. forest-trail.jpg": { alt: "Mossy forest trail on the lower ascent" },
    "8. ascent.jpg": { alt: "The rocky trail climbing toward snowy peaks above the Trift valley" },
  },
  "story-gruben-to-grimentz": {
    "1. cover.jpg": { alt: "Cover of the Gruben to Grimentz weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. clip.mp4": { alt: "Descending from the Meidpass, filmed on the route" },
    "4. clip.mp4": { alt: "Looking down on the Val d'Anniviers from the balcony trail, filmed on the route" },
    "5.jpg": { alt: "Hiker above the Val d'Anniviers with 4,000-metre peaks across the valley" },
    "6. clip.mp4": { alt: "The terrace of the Hotel Weisshorn at 2,337 m, filmed on the route" },
    "7.jpg": { alt: "Morning view up the Turtmanntal to the Turtmann glacier" },
    "8.jpg": { alt: "The signpost at the Meidsee tarn below the Meidpass" },
    "9.jpg": { alt: "Tipi tents on the alp above Gruben" },
    "10.jpg": { alt: "Selfie below the rock towers on the Meidpass crossing" },
    "11.jpg": { alt: "Dawn alpenglow over Gruben in the Turtmanntal" },
    "12.jpg": { alt: "Carved wooden figures on the forest descent to Ayer" },
    "13.jpg": { alt: "The white Hotel Weisshorn at 2,337 m, the overnight stop" },
    "14.jpg": { alt: "Selfie on the approach to the Hotel Weisshorn" },
    "15.jpg": { alt: "The gâteau aux myrtilles at the Hotel Weisshorn" },
  },
  "story-saas-fee-to-gruben": {
    "1. cover.jpg": { alt: "Cover of the Saas Fee to Gruben weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. ring.jpg": { alt: "The What-a-beautiful-place ring in Saas-Fee at the start of Stage 20" },
    "4. clip.mp4": { alt: "On the balcony trail high above the Saastal, filmed on the route" },
    "5.jpg": { alt: "Descending a wire-rope secured rock step on the Day 1 ledges" },
    "6.jpg": { alt: "The bench above the Mattertal, Weisshorn views ahead on Day 1" },
    "7. lake.jpg": { alt: "The swimming lake at Grächen at the end of Day 1" },
    "8. clip.mp4": { alt: "Above the valley on the traverse, filmed on the route" },
    "9. clip.mp4": { alt: "Fireweed meadows on the descent into the Turtmanntal, filmed on the route" },
    "10.jpg": { alt: "The signpost cairn on the Augstbordpass at 2,892 m" },
    "11.jpg": { alt: "Descending the high moraine valley from the Augstbordpass on Day 2" },
    "12.jpg": { alt: "Grächen on its sun terrace, the overnight stop" },
    "13.jpg": { alt: "Looking down the valley from the trail above Grächen on Day 2" },
  },
  "story-grimentz-to-evolene": {
    "1. cover.jpg": { alt: "Cover of the Grimentz to Evolène weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. clip.mp4": { alt: "Crossing the tarn-dotted Lona plateau, filmed on the route" },
    "4.jpg": { alt: "A cairn on the high trail above the Val d'Anniviers on Day 1" },
    "5. clip.mp4": { alt: "Descending the scree below the Pas de Lona, filmed on the route" },
    "6.jpg": { alt: "The turquoise Lac de Lona below the Pas de Lona" },
    "7. clip.mp4": { alt: "Dropping into the Val d'Hérens on Day 2, filmed on the route" },
    "8.jpg": { alt: "Selfie at the signpost on the Col des Becs de Bosson" },
    "9. clip.mp4": { alt: "The high bowl above Lac de Lona, filmed on the route" },
    "10.jpg": { alt: "The Cabane des Becs de Bosson at 2,985 m, the overnight stop" },
    "11.jpg": { alt: "The Val d'Hérens opening below the Day 2 descent" },
    "12.jpg": { alt: "Croûte au fromage with a fried egg at the hut" },
    "13.jpg": { alt: "Evolène's old street under Swiss and Valais flags, the end of the route" },
  },
  "story-simplon-pass-to-saas-fee": {
    "1. simplon-guide-cover.png": { alt: "Cover of the Simplon Pass to Saas Fee weekend-hike guide" },
    "2. simplon-route-snapshot.png": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. simplon-trail-cairn.jpg": { alt: "A hiker passes a stone cairn on the high traverse between Simplon Pass and Gspon" },
    "4. simplon-hospiz-pond.jpg": { alt: "Simplon Pass at the start: the Hospiz across the meadows, seen from a small pond" },
    "5. simplon-on-the-trail.mp4": { alt: "On the trail between Simplon Pass and Saas-Fee, filmed on the route" },
    "6. simplon-saastal-ledge.jpg": { alt: "Above the Saas Valley on Day 2, glaciers across the valley" },
    "7. simplon-gspon-balcony.jpg": { alt: "The Gspon balcony: a pennant over the drop to the Vispa valley" },
    "8. simplon-saas-fee-glacier.jpg": { alt: "Saas-Fee under the Fee Glacier at the end of Day 2" },
    "9. simplon-saas-fee-gorge.jpg": { alt: "The gorge tower at the entrance to Saas-Fee, glaciers above" },
    "10. simplon-eagle-monument.jpg": { alt: "The stone monument on Simplon Pass, minutes from the Hospiz" },
  },
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

// Card standard gate (see CLAUDE.md): slides 1-2 are the A4 portrait
// page-1/page-2 renders of the guide, shown whole on the browse card.
// Catching a square or landscape export here beats discovering it on the
// live card grid; --allow-shape skips the check when the shape is
// deliberate.
const ALLOW_SHAPE = args.includes("--allow-shape");
for (const [i, f] of entries.slice(0, 2).entries()) {
  if (!IMAGE_EXT.has(path.extname(f).toLowerCase())) {
    console.error(`slide ${i + 1} (${f}) is not an image — slides 1-2 must be the page renders`);
    process.exit(1);
  }
  const meta = await sharp(path.join(DIR, f)).metadata();
  const ratio = meta.height / meta.width;
  if ((ratio < 1.3 || ratio > 1.52) && !ALLOW_SHAPE) {
    console.error(
      `slide ${i + 1} (${f}) is ${meta.width}x${meta.height} (${ratio.toFixed(2)}:1), not A4 portrait (~1.41:1).\n` +
        "Cards render slides 1-2 whole in the document treatment; export the page in A4, " +
        "or re-render from the PDF with reexport-card-pages.mjs, or pass --allow-shape.",
    );
    process.exit(1);
  }
}

console.log(`${entries.length} slide(s) in ${DIR}:`);
for (const [i, f] of entries.entries()) {
  const meta = (ALT[DOC] || {})[f] || {};
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
  const meta = (ALT[DOC] || {})[file] || {};
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

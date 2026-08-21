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
  // Alt text is written from the actual frames, never from memory.
  "story-fiji-honeymoon-14-days": {
    "1. cover.jpg": { alt: "Cover of the Fiji 14-day honeymoon guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: why this trip, at a glance, and the route map" },
    "3.jpg": { alt: "A thatched pavilion under coconut palms on a resort lawn" },
    "4.mp4": { alt: "A fire dancer spinning flames on the sand after dark, filmed on the route" },
    "5.jpg": { alt: "Palms leaning over a white-sand island beach" },
    "6.mp4": { alt: "A resort pool deck under palms, blue umbrellas along the water" },
    "7.mp4": { alt: "A diver signalling OK as sharks circle behind him on the Awakening dive" },
    "8.jpg": { alt: "A beach bonfire at sunset beside calm water" },
    "9.jpg": { alt: "Feet up on a sun lounger over white sand and turquoise shallows" },
    "10.jpg": { alt: "A thatched beach umbrella and palms over the sand" },
    "11.mp4": { alt: "Yachts moored off the Port Denarau marina" },
    "12.jpg": { alt: "A last walk along the beach at sunset" },
    "13.jpg": { alt: "The chalked activities board at a Yasawa island resort" },
    "14.mp4": { alt: "Fire and knife dancers performing on the sand after dark" },
    "15.jpg": { alt: "A garden bure under coconut palms at dusk" },
    "16.jpg": { alt: "A resort transfer boat on turquoise water off the reef" },
    "17.jpg": { alt: "A resort bed made up with BULA spelled in leaves and hibiscus flowers" },
  },
  "story-samoa-upolu-savaii-7-days": {
    "1. cover.jpg": { alt: "Cover of the Samoa seven-day Upolu and Savai'i guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: why this trip, at a glance, and the photo spread" },
    "3.jpg": { alt: "To-Sua Ocean Trench from the rim, the ladder down to swimmers in the green pool" },
    "4.mp4": { alt: "An Alofaaga blowhole firing seawater skyward over the lava shelf, filmed on the route" },
    "5.mp4": { alt: "A tiny palm islet just offshore in evening light" },
    "6.mp4": { alt: "Beach fales along the sand over turquoise shallows" },
    "7.jpg": { alt: "A resort pool under palms after dark" },
    "8.mp4": { alt: "A tall waterfall ribboning into a jungle gorge" },
    "9.mp4": { alt: "Sunset over open water from the coast" },
    "10.mp4": { alt: "Green spring water below a painted walkway rail" },
    "11.jpg": { alt: "An empty white-sand beach with an island off the headland" },
    "12.jpg": { alt: "A yellow Samoan island bus parked under palms" },
    "13.jpg": { alt: "A thatched beach fale pavilion on the sand" },
    "14.jpg": { alt: "A painted church with Samoan flags flying" },
    "15.jpg": { alt: "A tall waterfall dropping into a green pool" },
  },
  "story-kuwait-2-days": {
    "1. cover.jpg": { alt: "Cover of the Kuwait two-day city and desert guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: why this trip, at a glance, and the photo spread" },
    "3.mp4": { alt: "Kuwait Towers against the low sun from the promenade, filmed on the route" },
    "4.mp4": { alt: "Yachts at the Souq Sharq marina with the skyline behind" },
    "5.mp4": { alt: "Wooden dhows moored hull to hull at the dhow harbour" },
    "6.mp4": { alt: "Kuwait Bay through the glass of the Kuwait Towers viewing sphere" },
    "7.mp4": { alt: "The fish market hall with the day's catch on the counters" },
    "8.jpg": { alt: "The corniche promenade into the low sun below Kuwait Towers" },
    "9.jpg": { alt: "Kuwait Towers and the national flag between palms" },
    "10.jpg": { alt: "The marina and the lit skyline at night" },
    "11.mp4": { alt: "The skyline across the water at dusk, red buoys in the foreground" },
    "12.mp4": { alt: "A heritage courtyard strung with lights after dark" },
    "13.jpg": { alt: "The desert road at dusk from the car" },
    "14.jpg": { alt: "Baskets of the day's catch and a market cat at the fish market" },
  },
  "story-tuvalu-2-days": {
    "1. cover.jpg": { alt: "Cover of the Tuvalu two-day Funafuti guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: pace, difficulty, season and what to expect" },
    "3.mp4": { alt: "Waiting at the Alofa Road runway crossing, filmed on the route" },
    "4.mp4": { alt: "The atoll's reef rim from the plane window on approach" },
    "5.jpg": { alt: "Kids playing in the lagoon off the causeway at sunset" },
    "6.mp4": { alt: "Crossing the lagoon by open boat toward the islets, filmed on the route" },
    "7.jpg": { alt: "Sunset through a palm on Funafuti's ocean shore" },
    "8.mp4": { alt: "Barefoot over the coral rubble of an islet beach, filmed on the route" },
    "9.mp4": { alt: "Pandanus trees over the shore road at golden hour" },
    "10.mp4": { alt: "Riding a hired scooter down Funafuti's one main road" },
    "11.mp4": { alt: "Kids jumping off the village wharf into the lagoon" },
  },
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
  "story-ausserferrera-to-turra": {
    "1. cover.jpg": { alt: "Cover of the Ausserferrera to Turra weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. clip.mp4": { alt: "Morning light over the scree on the climb out of the Ferrera valley, filmed on the route" },
    "4. clip.mp4": { alt: "Waterfalls streaking the wall above the Safiental farms, filmed on the route" },
    "5. clip.mp4": { alt: "Cattle crossing the alp beside the trail, filmed on the route" },
    "6. clip.mp4": { alt: "The flower meadows below the Safierberg, filmed on the route" },
    "7. clip.mp4": { alt: "Climbing through the pines above Ausserferrera, filmed on the route" },
    "8.jpg": { alt: "A Walser roof under the waterfall wall in the upper Safiental" },
    "9.jpg": { alt: "Waterfalls threading the cliffs above the Rabiusa" },
    "10.jpg": { alt: "A stone-roofed barn below the peaks of the Safiental" },
  },
  "story-alp-flix-to-ausserferrera": {
    "1. cover.jpg": { alt: "Cover of the Alp Flix to Ausserferrera weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. clip.mp4": { alt: "Looking up a green side valley on the Day 1 balcony, filmed on the route" },
    "4. clip.mp4": { alt: "A marmot in the meadow beside the trail, filmed on the route" },
    "5. clip.mp4": { alt: "The Alp d'Err tavern at 2,178 m, the Day 1 lunch stop, filmed on the route" },
    "6. clip.mp4": { alt: "The stream gorge on the descent from Alp Mos, filmed on the route" },
    "7. clip.mp4": { alt: "Climbing the upper Val Schmorras meadows, filmed on the route" },
    "8.jpg": { alt: "The trail rolling toward the Furschela da Colm under a blue sky" },
    "9.jpg": { alt: "Climbing with poles on the balcony below Pizza Grossa" },
    "10.jpg": { alt: "A woodshed on the alp with the pass ridge behind" },
    "11.jpg": { alt: "Braided streams below Pass da Schmorras in the mist" },
    "12.jpg": { alt: "With the cattle at the misty tarn below the pass" },
  },
  "story-st-moritz-to-alp-flix": {
    "1. cover.jpg": { alt: "Cover of the St. Moritz to Alp Flix weekend-hike guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: distance, ascent, difficulty and season at a glance" },
    "3. clip.mp4": { alt: "Sunrise over Val Bever from the Jenatschhütte, Swiss flag in the wind, filmed on the route" },
    "4. clip.mp4": { alt: "The turquoise Leg Leget at 2,700 m, the Day 2 swim stop, filmed on the route" },
    "5. clip.mp4": { alt: "The grassy head of Val Bever on the approach to the hut, filmed on the route" },
    "6. clip.mp4": { alt: "Crossing the boulder fields below the Fuorcla d'Agnel, filmed on the route" },
    "7. clip.mp4": { alt: "Looking back over the Suvretta lakes from the Day 1 climb, filmed on the route" },
    "8. clip.mp4": { alt: "Dropping toward the Alp Flix moorland on Day 2, filmed on the route" },
    "9.jpg": { alt: "In the rust-red amphitheatre below the Fuorcla Suvretta" },
    "10. clip.mp4": { alt: "Marmots on the alp beside the trail, filmed on the route" },
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
  "story-iceland-layover-reykjavik-blue-lagoon": {
    "1. cover.jpg": { alt: "Cover of the Iceland one-day layover guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: pace, difficulty, season and what to expect" },
    "3.mp4": { alt: "Swimming out into the Blue Lagoon's milky water, filmed on the route" },
    "4.mp4": { alt: "Gunnuhver's steam column roaring over the rust-red ground, filmed on the route" },
    "5.mp4": { alt: "Surf breaking on the sea stacks at the Reykjanes lighthouse corner, filmed on the route" },
    "6.mp4": { alt: "Waves churning through the black lava shelf on the Reykjanes coast, filmed on the route" },
    "7.jpg": { alt: "The painted shopping street in central Reykjavik, benches and gable ends" },
    "8.jpg": { alt: "Hallgrimskirkja's concrete columns sweeping up to the spire" },
    "9.mp4": { alt: "Grass-topped black-sand dunes on the Reykjanes coast, filmed on the route" },
  },
  "story-iceland-south-coast-5-days": {
    "1. cover.jpg": { alt: "Cover of the Iceland South Coast five-day self-drive guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: pace, difficulty, season and what to expect" },
    "3. clip.mp4": { alt: "Steam drifting over the milky blue water of the Blue Lagoon, filmed on the route" },
    "4. clip.mp4": { alt: "Skógafoss pouring over its lip head-on, walkers at the base for scale" },
    "5.jpg": { alt: "Basalt columns at Reynisfjara with the Reynisdrangar sea stacks beyond" },
    "6. clip.mp4": { alt: "A glacial river rushing between moss-green banks, filmed on the route" },
    "7. clip.mp4": { alt: "Icebergs drifting across the glacier lagoon, filmed on the route" },
    "8.jpg": { alt: "A Reykjavík shopping street with painted shopfronts and benches" },
    "9. clip.mp4": { alt: "Dark sea cliffs dropping into turquoise coves on the south coast, filmed on the route" },
    "10. clip.mp4": { alt: "Steam rising off a dark geothermal pool, filmed on the route" },
    "11. clip.mp4": { alt: "A steam plume over the rust-red ground of a geothermal field, filmed on the route" },
    "12. clip.mp4": { alt: "Strokkur erupting at Geysir, filmed from the roped edge" },
    "13.jpg": { alt: "Hallgrímskirkja seen head-on from the plaza, its stepped concrete façade filling the frame" },
    "15.jpg": { alt: "A blue-white iceberg glowing in the sunlight on the glacier lagoon" },
  },
  "story-iceland-ring-road-7-days": {
    "1. cover.jpg": { alt: "Cover of the Iceland Ring Road seven-day self-drive guide" },
    "2. snapshot.jpg": { alt: "Route snapshot page: pace, difficulty, season and what to expect" },
    "3. clip.mp4": { alt: "Strokkur erupting at Geysir, filmed from the roped edge" },
    "4. clip.mp4": { alt: "A wide waterfall pouring over its lip on the south coast, walkers at the base for scale" },
    "5.jpg": { alt: "Basalt columns at Reynisfjara, a walker in red climbing them, with the sea stacks beyond" },
    "6. clip.mp4": { alt: "Dark sea cliffs dropping to the Atlantic under an open sky" },
    "7. clip.mp4": { alt: "Icebergs drifting across the glacier lagoon toward the sea" },
    "8.jpg": { alt: "A Reykjavík shopping street with painted shopfronts and a striped crossing" },
    "9. clip.mp4": { alt: "Grey meltwater and low cloud over the lagoon" },
    "10.jpg": { alt: "A blue-and-white Icelandic house with a turf roof under an open sky" },
    "11. clip.mp4": { alt: "Steam rising off the orange mineral ground of a geothermal field" },
    "12.jpg": { alt: "The black sand beach at Reynisfjara with the Reynisdrangar stacks and a lone figure in red" },
    "13.jpg": { alt: "Hallgrímskirkja seen head-on from the plaza, its stepped concrete façade filling the frame" },
    "15.jpg": { alt: "A single blue-white iceberg drifting in the turquoise water of the glacier lagoon" },
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

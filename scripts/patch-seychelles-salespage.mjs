#!/usr/bin/env node
/**
 * One-shot: add the sales-page block data (guide-page-build-spec) to
 * story-seychelles-1-week — cover, proof, day strip, carousel (4 slide
 * exports + 2 trip video clips), and the free Day-4 sample.
 *
 * Asset sources: content/countries/seychelles/guide/generated/web/
 * (exported from the final PPTX; map slide has the QR removed).
 *
 * Usage: node --env-file=.env.local scripts/patch-seychelles-salespage.mjs
 */
import { createClient } from "next-sanity";
import { createReadStream } from "node:fs";
import crypto from "node:crypto";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(6).toString("hex");
const DIR = "content/countries/seychelles/guide/generated/web";

async function img(file) {
  const a = await client.assets.upload("image", createReadStream(`${DIR}/${file}`), {
    filename: `seychelles-1-week-${file}`,
  });
  console.log(`uploaded ${file} -> ${a._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: a._id } };
}

async function vid(file) {
  const a = await client.assets.upload("file", createReadStream(`${DIR}/${file}`), {
    filename: `seychelles-1-week-${file}`,
  });
  console.log(`uploaded ${file} -> ${a._id}`);
  return { _type: "file", asset: { _type: "reference", _ref: a._id } };
}

async function main() {
  const cover = await img("cover.jpg");
  const proof = await img("proof.jpg");
  const map = await img("carousel-01-map.jpg");
  const snapshot = await img("carousel-02-snapshot.jpg");
  const day = await img("carousel-03-day.jpg");
  const costs = await img("carousel-04-costs.jpg");
  const sampleImg = await img("sample-day-04.jpg");
  const clipBoat = await vid("clip-20260519_120225.mp4");
  const clipEvening = await vid("clip-20260521_182207.mp4");

  await client
    .patch("story-seychelles-1-week")
    .set({
      "guide.cover": { ...cover, alt: "Cover of the Seychelles eight-day island route guide" },
      "guide.pages": 25,
      "guide.dayStrip":
        "Day 1 Mahé · Days 2–3 Praslin · Day 4 Curieuse · Days 5–6 La Digue · Days 7–8 Mahé",
      "guide.proofLine": "I flew here with my own plan. This is the version I would book again.",
      "guide.proofPhoto": {
        ...proof,
        alt: "The author and his wife with a giant tortoise on Curieuse Island",
      },
      "guide.carousel": [
        { _type: "carouselSlide", _key: key(), image: map, caption: "The route", alt: "Route map across four Seychelles islands" },
        { _type: "carouselSlide", _key: key(), video: clipBoat, image: null, caption: "Filmed on the route", alt: "Video clip from the boat day" },
        { _type: "carouselSlide", _key: key(), image: snapshot, caption: "Route snapshot", alt: "Route snapshot page showing pace, season and difficulty" },
        { _type: "carouselSlide", _key: key(), image: day, caption: "A day, hour by hour", alt: "A timed day page from the guide" },
        { _type: "carouselSlide", _key: key(), video: clipEvening, image: null, caption: "Filmed on the route", alt: "Video clip from the islands" },
        { _type: "carouselSlide", _key: key(), image: costs, caption: "What it costs", alt: "Cost table at three spend levels" },
      ],
      "guide.sample": {
        label: "Day 4, Curieuse. The full page, free.",
        body: "Day 4 takes you to Curieuse, where giant tortoises roam loose in a national park, and gets you onto the last ferry to La Digue. This is the page exactly as it appears in the guide.",
        image: sampleImg,
        pdfPath: "/samples/seychelles-day-04.pdf",
      },
    })
    .commit();
  console.log("✓ patched story-seychelles-1-week");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * One-shot: create the Seychelles week guide story doc in Sanity.
 *
 * Source content: content/countries/seychelles/guide/final/ (PDF + build spec)
 * and the PPTX "at a glance" facts. Prices are the founder-confirmed
 * EUR 19 / USD 22 / GBP 19 / CHF 19 (customPrices — no tier matches).
 *
 * Idempotency: aborts if story-seychelles-1-week already exists. Re-running
 * after a successful create is a no-op with exit 1, never a clobber.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-seychelles-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { createReadStream } from "node:fs";
import crypto from "node:crypto";

const DRY_RUN = process.argv.includes("--dry-run");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(6).toString("hex");
const GUIDE_DIR = "content/countries/seychelles/guide";

const PHOTOS = [
  // [file, alt] — first entry becomes the hero image.
  ["20260520_093038.jpg", "Granite boulders, palms and white sand on La Digue, Seychelles"],
  ["20260518_175802.jpg", "Sunset over an empty Seychelles beach framed by palm fronds"],
  ["20260519_111312.jpg", "Granite islet of St. Pierre in turquoise water off Praslin, Seychelles"],
  ["20260518_183832.jpg", "Dusk on a Seychelles beach with a moored sailboat offshore"],
];

const block = (text) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function main() {
  const existing = await client.fetch(`*[_id == "story-seychelles-1-week"][0]._id`);
  if (existing) {
    console.error("story-seychelles-1-week already exists — aborting (no overwrite).");
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("Dry run: would upload 4 images + 1 PDF and create story-seychelles-1-week.");
    return;
  }

  // Country collection (mirrors collection-switzerland).
  await client.createIfNotExists({
    _id: "collection-seychelles",
    _type: "collection",
    name: "Seychelles",
    slug: { _type: "slug", current: "seychelles" },
  });
  console.log("collection-seychelles ensured");

  const imageRefs = [];
  for (const [file, alt] of PHOTOS) {
    const asset = await client.assets.upload(
      "image",
      createReadStream(`${GUIDE_DIR}/generated/web/${file}`),
      { filename: `seychelles-1-week-${file}` },
    );
    imageRefs.push({
      _type: "image",
      _key: key(),
      alt,
      asset: { _type: "reference", _ref: asset._id },
    });
    console.log(`uploaded ${file} -> ${asset._id}`);
  }

  const pdfAsset = await client.assets.upload(
    "file",
    createReadStream(`${GUIDE_DIR}/final/TestedRoutes-Seychelles-1-week-vFinal.pdf`),
    { filename: "TestedRoutes-Seychelles-1-week.pdf" },
  );
  console.log(`uploaded PDF -> ${pdfAsset._id}`);

  const [hero, ...gallery] = imageRefs;
  const doc = {
    _id: "story-seychelles-1-week",
    _type: "story",
    title: "Seychelles in a week: the tested island route",
    slug: { _type: "slug", current: "seychelles-1-week" },
    storyId: "2026_seychelles-1-week",
    language: "en",
    status: "published",
    publishedDate: "2026-07-24",
    lastReviewedDate: "2026-07-24",
    eyebrow: "Seychelles · Island hopping · 8 days",
    subtitle:
      "Mahé to Praslin to Curieuse to La Digue. I flew here with my own plan – this is the version I would book again.",
    author: { _type: "reference", _ref: "author-paulius-pikelis" },
    destination: { _type: "reference", _ref: "destination-seychelles" },
    journeyCategory: { _type: "reference", _ref: "category-journey-week-trip" },
    primaryCollection: { _type: "reference", _ref: "collection-seychelles" },
    allCollections: [
      { _type: "reference", _key: key(), _ref: "collection-seychelles" },
      { _type: "reference", _key: key(), _ref: "collection-island-travel" },
    ],
    activityTags: [
      "island hopping",
      "beach travel",
      "snorkelling",
      "ferry travel",
      "cycling",
      "wildlife",
    ],
    heroImage: { ...hero, _key: undefined },
    galleryImages: gallery,
    hasVideo: false,
    body: [
      block(
        "Eight days across the granitic islands: ease into Mahé, two days on Praslin for the forest and the headline beaches, a boat day to Curieuse where giant tortoises roam loose, two slower days on La Digue where bicycles replace the car, then a final Mahé day so departure never becomes a rush.",
      ),
      block(
        "The guide times every day from wake-up to dinner, lists every booking in deadline order, and gives hotel and restaurant picks at three price levels on each island. A full cost table covers the trip at lean, core and splurge, per couple.",
      ),
      block(
        "Everything in it comes from my own trip in May 2026 – the ferry timings, the gate hours, the tide notes, and the takeaway counter that beat every restaurant.",
      ),
      block(
        "A companion Google map ships with the guide, with every pin from every day already placed.",
      ),
    ],
    primaryStats: [
      { _type: "primaryStat", _key: key(), label: "Duration", value: "8 days, 7 nights" },
      {
        _type: "primaryStat",
        _key: key(),
        label: "Day plan",
        value: "Day 1 Mahé · Days 2–3 Praslin · Day 4 Curieuse · Days 5–6 La Digue · Days 7–8 Mahé",
      },
      { _type: "primaryStat", _key: key(), label: "Pace", value: "Unhurried – a ferry every two to three days" },
      { _type: "primaryStat", _key: key(), label: "Difficulty", value: "Easy" },
      { _type: "primaryStat", _key: key(), label: "Season", value: "May to October; July and August are peak" },
      {
        _type: "primaryStat",
        _key: key(),
        label: "Format",
        value: "25-page PDF, printable A4, instant download, companion Google map",
      },
    ],
    durationDays: 8,
    durationDisplay: "8 days, 7 nights",
    bestMonths: [5, 6, 7, 8, 9, 10],
    budgetLevel: "moderate",
    coordinates: { _type: "geopoint", lat: -4.6191, lng: 55.4513 },
    startingPoint: {
      _type: "startingPoint",
      name: "Mahé International Airport (SEZ)",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -4.6743, lng: 55.5218 },
    },
    routeStops: [
      { _type: "routeStop", _key: key(), name: "Mahé", type: "town", coordinates: { _type: "geopoint", lat: -4.6191, lng: 55.4513 } },
      { _type: "routeStop", _key: key(), name: "Praslin", type: "town", coordinates: { _type: "geopoint", lat: -4.3232, lng: 55.7351 } },
      { _type: "routeStop", _key: key(), name: "Curieuse", type: "other", coordinates: { _type: "geopoint", lat: -4.2833, lng: 55.7333 } },
      { _type: "routeStop", _key: key(), name: "La Digue", type: "town", coordinates: { _type: "geopoint", lat: -4.3595, lng: 55.8412 } },
    ],
    finishPoint: {
      _type: "startingPoint",
      name: "Mahé International Airport (SEZ)",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -4.6743, lng: 55.5218 },
    },
    bookingsRequired: [
      "Inter-island ferries (Cat Cocos, Seyferry)",
      "Curieuse day trip with a licensed operator",
      "Travel Authorization (TAS) before departure",
    ],
    bookingsAdvanceDays: 30,
    whyThisTrip: [
      "Most itineraries lock you to one resort island for a week – this route covers four islands in eight days without ever feeling rushed",
      "Every ferry, gate hour and booking deadline is already worked out, so you can book the whole trip in an evening",
      "Hotel and restaurant picks at three price levels on each island, from real visits",
      "The whole country runs on two ferry routes and a bicycle – no tour operator needed",
    ],
    whoThisIsFor: [
      "Independent travellers who want the whole country in one trip",
      "Couples and pairs who would rather drive and cycle than be driven",
      "First-time visitors who do not want to build a ferry spreadsheet",
    ],
    notSuitableSales: [
      "Anyone booking a single resort week and not leaving it",
      "Backpacker budgets – this route assumes mid-range and up",
      "Travellers who want a tour operator to run the days",
    ],
    whatYouGet: [
      "Eight day-by-day plans, timed from wake-up to dinner",
      "Route snapshot: pace, difficulty, season, what to expect",
      "Hotel picks, three price levels on each of the three islands",
      "Restaurant picks, split into reserve-ahead, walk-in and takeaway",
      "Full cost table at lean, core and splurge, per couple",
      "Essential reservations, ordered by booking deadline",
      "Before-the-flight page: paperwork, money, plugs, driving",
      "Packing list built for this trip, not a generic one",
      "Ferry routes, site gate hours and tide notes",
      "Companion Google map with every pin from the guide",
    ],
    difficultyAtAGlance: [
      "Terrain: easy – short coastal walks, flat cycling",
      "Sea: ferry crossings can be rough in season",
      "Sun: year-round equatorial UV – cover up midday",
      "Driving: left-hand traffic, narrow roads on Mahé and Praslin",
    ],
    commonMistakes: [
      "Assuming ferry tickets can be bought at the dock – they sell out in season",
      "Renting a car on La Digue, an island that runs on bicycles",
      "Arriving at Source d'Argent mid-morning with the day-tripper crowds",
      "Underestimating the sun because the heat feels mild",
    ],
    faq: [
      { _key: key(), question: "What format is the guide?", answer: "A PDF, sized for A4 and designed to print. It opens on any phone, tablet or laptop and needs no app." },
      { _key: key(), question: "When do I get it?", answer: "Straight after checkout. The download link arrives by email as well, so you can find it again later." },
      { _key: key(), question: "Does it work offline?", answer: "Yes. Download it before you fly and it works with no signal. The companion Google map can be saved offline in Google Maps." },
      { _key: key(), question: "What is the map?", answer: "A Google map with every place in the guide already pinned, with a short note on each. It opens inside the Google Maps app you already use." },
      { _key: key(), question: "Can I print it?", answer: "Yes, and a lot of people do. It is laid out for A4." },
      { _key: key(), question: "What if something has changed since publication?", answer: "Tell us at feedback@testedroutes.com. Verified corrections go into the next edition and we will usually credit you for the trouble." },
      { _key: key(), question: "Can I share it with the people I am travelling with?", answer: "Yes, with your immediate travel party. Public sharing, reselling and file-sharing sites are not allowed." },
      { _key: key(), question: "What if it is not what I expected?", answer: "30-day refund, no questions asked. Email refunds@testedroutes.com." },
    ],
    similarStories: [
      { _type: "reference", _key: key(), _ref: "story-seychelles-source-dargent-sunrise" },
      { _type: "reference", _key: key(), _ref: "story-seychelles-curieuse-tortoises" },
      { _type: "reference", _key: key(), _ref: "story-seychelles-la-digue-by-bike" },
    ],
    metaTitle: "Seychelles in a week: the tested island route",
    metaDescription:
      "Eight days across Mahé, Praslin, Curieuse and La Digue – timed day plans, ferry timings, booking deadlines, hotel picks and real costs in one 25-page guide.",
    keywords: [
      "seychelles one week itinerary",
      "seychelles island hopping route",
      "seychelles 8 day itinerary",
      "mahe praslin la digue itinerary",
      "seychelles travel guide pdf",
    ],
    appearsInSearches: [
      "how many days do you need in Seychelles",
      "Seychelles itinerary without a tour",
      "Mahé Praslin La Digue ferry route",
      "Seychelles island hopping one week",
    ],
    guide: {
      _type: "guide",
      hasGuide: true,
      status: "available",
      format: ["PDF"],
      pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
      customPrices: [
        { _type: "priceEntry", _key: key(), currency: "EUR", amount: 19 },
        { _type: "priceEntry", _key: key(), currency: "USD", amount: 22 },
        { _type: "priceEntry", _key: key(), currency: "GBP", amount: 19 },
        { _type: "priceEntry", _key: key(), currency: "CHF", amount: 19 },
      ],
    },
  };
  delete doc.heroImage._key;

  const created = await client.create(doc);
  console.log(`✓ created ${created._id}`);
}

main().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});

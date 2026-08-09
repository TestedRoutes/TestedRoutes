#!/usr/bin/env node
/**
 * One-shot: create the Iceland Ring Road 7-day guide story doc in Sanity.
 *
 * Cloned from create-ausserferrera-turra-guide.mjs (the newest sibling, per the
 * production playbook v6 §"Phase 6 publish rounds"). Every fact below comes from
 * the sellable deck (v25) or Content Plan v53 — nothing is written from memory.
 *
 * Distances: 2,225 km total, day totals 110/330/205/405/330/505/220/120. These
 * were re-based by routing the country master's own pins with Route 1 forced
 * through Varmahlíð/Blönduós and Djúpivogur/Breiðdalsvík/Reyðarfjörður, so the
 * router could not shortcut over gravel the guide tells a 2WD driver to avoid.
 *
 * DELIBERATELY OMITTED — needs a founder decision, do not guess:
 *   estimatedCost / costBreakdown. The deck quotes ~EUR 3,200 / 5,500 / 9,200
 *   PER COUPLE across three comfort tiers. The site field reads as a per-person
 *   figure (sanityStory.js maps it to estimated_cost_usd), so publishing the
 *   per-couple number unlabelled would mislead. Set it once the basis is agreed.
 *
 * Idempotency: createOrReplace on a fixed _id, so re-running refreshes the doc
 * but re-uploads the assets. Run --dry-run first.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-iceland-ring-road-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\517d8955-21f5-4c15-b685-ac1addef32b8\scratchpad\guide-assets-iceland`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\iceland\guides\iceland-ring-road-7-days\TestedRoutes_Iceland_Guide_7_Days_Ring_Road.pdf`;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function img(file, alt) {
  if (DRY_RUN) return { _type: "image", alt, asset: { _type: "reference", _ref: `DRY-${file}` } };
  const a = await client.assets.upload("image", readFileSync(path.join(ASSETS, file)), { filename: file });
  return { _type: "image", alt, asset: { _type: "reference", _ref: a._id } };
}

// Alt text written from the actual frames, not from the shortlist.
const hero = await img(
  "hero.jpg",
  "Basalt columns at Reynisfjara, a walker in red climbing them, with the Reynisdrangar sea stacks beyond",
);
const galleryDefs = [
  ["g1.jpg", "A single blue-white iceberg drifting in the turquoise water of the glacier lagoon"],
  ["g2.jpg", "The black sand beach at Reynisfjara with the Reynisdrangar stacks and a lone figure in red"],
  ["g3.jpg", "Hallgrímskirkja seen head-on from the plaza, its stepped concrete façade filling the frame"],
  ["g4.jpg", "A blue-and-white Icelandic house with a turf roof under an open sky"],
  ["g5.jpg", "A Reykjavík shopping street with painted shopfronts and a striped crossing"],
];
const gallery = [];
for (const [file, alt] of galleryDefs) {
  const g = await img(file, alt);
  gallery.push({ ...g, _key: file.replace(/\W/g, "") });
}

const pdfAsset = DRY_RUN
  ? { _id: "DRY-pdf" }
  : await client.assets.upload("file", readFileSync(PDF), {
      filename: "TestedRoutes_Iceland_Guide_7_Days_Ring_Road.pdf",
      contentType: "application/pdf",
    });

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key,
  _type: "block",
  style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-iceland-ring-road-7-days",
  _type: "story",
  title: "Iceland Ring Road: A 7-Day Self-Drive Itinerary",
  slug: { _type: "slug", current: "iceland-ring-road-7-days" },
  storyId: "iceland-ring-road-7-days-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-09",
  lastUpdated: "2026-08-09",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  // timesCompleted / mostRecentCompletion: FOUNDER TO SUPPLY. The Iceland inspire
  // stories carry 2015 and 2022 ids, so there is more than one trip on file and
  // guessing a number here would be inventing trip history.

  eyebrow: "ICELAND • 7-DAY ROAD TRIP • RING ROAD",
  subtitle:
    "The full loop without rookie route mistakes - and a real budget.",
  metaTitle: "Iceland Ring Road: 7-Day Self-Drive Itinerary",
  metaDescription:
    "The full Ring Road in seven days, planned to the hour: which slots to book before you fly, where to sleep so you never double back, and what to cut when you fall behind.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Most Iceland itineraries either push the loop into five days or spend the difference standing still. This one takes seven and spends the difference where it changes the trip - a whale boat that sails at 08:30, a glacier walk that needs the afternoon, an evening at Reynisfjara when the tour buses have gone."),
    P("b2", "Every day is timed to the hour: arrival, how long the stop is worth, and the leave-by that keeps the rest of the day intact. Six bases, no backtracking, and 2,225 km of driving that never needs a 4WD or an F-road permit."),
    P("b3", "It is an honest plan rather than a comfortable one. Day 6 is 505 km and the guide says so on the page, along with what to cut if the morning runs late."),
  ],

  whatMakesThisSpecial:
    "The whole ring in seven days without doubling back, timed to the hour and honest about the days that are long.",
  highlights: [
    "Jökulsárlón - icebergs drifting onto black sand",
    "Hverir - a geothermal field from another planet",
    "Húsavík - whales of Skjálfandi Bay",
    "Dettifoss on the sealed west bank, no gravel needed",
    "Reynisfjara's basalt columns and the Reynisdrangar stacks",
  ],
  whyThisTrip: [
    "Seven days is the shortest the full loop works without rushing every stop",
    "Six bases chosen so no day ever drives back over yesterday's road",
    "Timed to the hour, with leave-by times rather than vague half-days",
    "Built for a standard 2WD rental - no F-roads anywhere on the route",
  ],
  uniqueSellingPoints: [
    "Hour-by-hour timelines for all eight days on the ground",
    "The bookings that actually sell out, and how far ahead each one goes",
    "A costed budget across three comfort levels, itemised by activity and hotel",
    "Plan B for the whale day if the boat is sold out or blown out",
    "Google My Maps companion with every pin in the guide",
  ],
  whoThisIsFor: [
    "First-time visitors who want the whole island, not a corner of it",
    "Drivers comfortable with long days behind the wheel",
    "Couples and pairs splitting the driving",
    "Anyone who would rather follow a tested plan than build one",
  ],
  notSuitableIf: [
    "You have fewer than eight days on the ground",
    "You want to be in one place for more than a night at a time",
    "You are travelling between October and April - this is a June-to-August plan",
    "You want highland F-roads, Landmannalaugar or the Westfjords",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "7 days" },
    { _key: "distance", _type: "primaryStat", label: "Driving", value: "~2,225 km, 8 days on the ground" },
    { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days; Day 6 is 505 km" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Self-drive 2WD from Keflavík" },
    { _key: "season", _type: "primaryStat", label: "Season", value: "June to August" },
  ],
  durationDays: 7,
  durationDisplay: "7 days, 8 on the ground",
  totalDistanceKm: 2225,
  overallLevel: "moderate",
  crowdLevel: "medium",
  beginnerFriendly: true,
  familyFriendly: true,
  soloFriendly: true,
  idealGroupSize: "2 people",
  idealFor: ["road trippers", "first-time visitors", "photographers", "couples"],

  difficultyAtAGlance: [
    "No hiking harder than a marked path; the longest walk is the Svartifoss loop",
    "The driving is the effort - 2,225 km over eight days on the ground",
    "Day 6 is the one to watch at 505 km",
    "Standard 2WD rental; no F-roads and no gravel that matters",
  ],
  commonMistakes: [
    "Driving the loop anticlockwise and arriving at the south coast tired",
    "Leaving Mývatn too late for the 08:30 whale boat out of Húsavík",
    "Booking a 4WD nobody on this route needs",
    "Opening a car door in wind - the one damage rentals never cover",
  ],
  insiderTips: [
    "Both hands on the car door every time you open it, all week",
    "Take the sealed Rt 862 west bank to Dettifoss; the east bank adds nothing in a 2WD",
    "A head net beats repellent at Mývatn - the midges there do not bite, they swarm",
    "Kitchens outside Reykjavík close early: 21:00 is normal, 22:00 is late",
    "Book the day's dinner at breakfast and check the hours that same morning",
  ],
  verifiedFacts: [
    "The route totals ~2,225 km with day totals of 110/330/205/405/330/505/220/120",
    "Day 6 ends at Varmaland, not Borgarnes - Borgarnes forces a backtrack on Day 7",
    "The last stretch to Hvítserkur on Rt 711 is gravel, fine in a 2WD but slow",
    "Fuel between Akureyri and Staðarskáli: Varmahlíð and Hvammstangi both have pumps",
    "Mid-June to mid-July never gets properly dark; by August proper dusk returns",
  ],

  bookingsRequired: [
    "Rental car from Keflavík",
    "Húsavík whale watching (08:30 sailing)",
    "Skaftafell glacier walk",
    "Silfra snorkel",
    "Blue Lagoon entry slot",
    "Six nights of accommodation",
  ],
  bookingsAdvanceDays: 60,
  specialEquipment: [
    "waterproof shell",
    "hiking shoes",
    "swimwear and a quick-dry towel",
    "sleep mask for the midnight sun",
    "head net for Mývatn",
    "offline maps + power bank",
    "one credit card with a PIN for unmanned fuel pumps",
  ],
  rentalEquipmentAvailable: true,
  permitsRequired: false,

  budgetLevel: "moderate",
  accommodationType: "hotel",
  journeyStyle: "self_guided",
  journeyCategory: { _ref: "category-journey-week", _type: "reference" },
  activityCategory: { _ref: "category-activity-road-trips", _type: "reference" },
  routeMode: "driving",
  timeOfDay: "multi_day",
  weatherDependent: true,
  snowSeasonAccessible: false,
  wheelchairAccessible: false,
  carRequired: true,
  fourByFourRequired: false,
  publicTransportAccessible: false,
  transportationRequired: ["car"],
  transportationDifficulty: "easy",
  nearestCity: "Reykjavík",
  nearestCityDistanceKm: 50,

  bestSeasons: ["summer"],
  bestMonths: [6, 7, 8],
  avoidMonths: [11, 12, 1, 2, 3],

  destination: { _ref: "destination-iceland", _type: "reference" },
  primaryCollection: { _ref: "collection-iceland", _type: "reference" },
  allCollections: [
    { _key: "is", _ref: "collection-iceland", _type: "reference" },
  ],
  regions: ["Reykjanes", "Golden Circle", "South Coast", "East Iceland", "North Iceland", "West Iceland"],
  coordinates: { _type: "geopoint", lat: 64.96, lng: -18.5 },
  mapZoom: 6,
  startingPoint: {
    _type: "startingPoint",
    name: "Keflavík International Airport",
    type: "airport",
    coordinates: { _type: "geopoint", lat: 63.97565, lng: -22.64024 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Keflavík International Airport",
    type: "airport",
    coordinates: { _type: "geopoint", lat: 63.97565, lng: -22.64024 },
  },
  routePoints: [
    { _key: "kef", _type: "routePoint", name: "Keflavík Airport", type: "start", coordinates: { _type: "geopoint", lat: 63.97565, lng: -22.64024 } },
    { _key: "gullfoss", _type: "routePoint", name: "Gullfoss", type: "highlight", coordinates: { _type: "geopoint", lat: 64.3271, lng: -20.1199 } },
    { _key: "vik", _type: "routePoint", name: "Vík", type: "stop", coordinates: { _type: "geopoint", lat: 63.4187, lng: -19.0060 } },
    { _key: "jokulsarlon", _type: "routePoint", name: "Jökulsárlón", type: "highlight", coordinates: { _type: "geopoint", lat: 64.04583, lng: -16.19178 } },
    { _key: "egilsstadir", _type: "routePoint", name: "Egilsstaðir", type: "stop", coordinates: { _type: "geopoint", lat: 65.26217, lng: -14.41754 } },
    { _key: "myvatn", _type: "routePoint", name: "Mývatn", type: "highlight", coordinates: { _type: "geopoint", lat: 65.6417, lng: -16.9186 } },
    { _key: "husavik", _type: "routePoint", name: "Húsavík", type: "highlight", coordinates: { _type: "geopoint", lat: 66.0449, lng: -17.3389 } },
    { _key: "varmaland", _type: "routePoint", name: "Varmaland", type: "stop", coordinates: { _type: "geopoint", lat: 64.68782, lng: -21.59400 } },
    { _key: "thingvellir", _type: "routePoint", name: "Þingvellir", type: "highlight", coordinates: { _type: "geopoint", lat: 64.2559, lng: -21.1300 } },
    { _key: "return", _type: "routePoint", name: "Keflavík Airport", type: "end", coordinates: { _type: "geopoint", lat: 63.97565, lng: -22.64024 } },
  ],
  trackLine,

  activityTags: [
    "Ring Road", "Iceland road trip", "self-drive", "glacier lagoon",
    "whale watching", "Golden Circle", "midnight sun", "waterfalls",
  ],
  keywords: [
    "Iceland Ring Road", "7 day Iceland itinerary", "Iceland self-drive",
    "Route 1 Iceland", "Jökulsárlón", "Mývatn", "Húsavík whales", "Iceland road trip",
  ],
  searchTags: [
    "Iceland itinerary 7 days", "Iceland Ring Road itinerary",
    "Iceland self drive summer", "Iceland road trip plan",
  ],
  searchSynonyms: ["Route 1", "Þjóðvegur 1", "Iceland loop", "Hringvegur"],
  appearsInSearches: [
    "7 day Iceland ring road itinerary",
    "how many days to drive the ring road",
    "Iceland self drive itinerary summer",
    "Iceland ring road clockwise or anticlockwise",
  ],
  alternativeNames: ["Hringvegur", "Route 1 Iceland", "Iceland loop road trip"],

  whatYouGet: [
    "Hour-by-hour timelines for all eight days, with leave-by times and what to cut",
    "Six bases picked so you never drive back over yesterday's road",
    "Every booking that sells out, and how far ahead each one goes",
    "A costed budget across three comfort levels, itemised by activity and hotel",
    "Restaurant picks per region with the kitchen-closing times that catch people out",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
  ],
  similarStories: [
    { _key: "driving", _ref: "story-iceland-ring-road-driving", _type: "reference" },
    { _key: "days", _ref: "story-iceland-ring-road-many-days-do", _type: "reference" },
    { _key: "cost", _ref: "story-iceland-ring-road-expensive-honest-breakdown", _type: "reference" },
  ],

  featuredInHomepage: false,

  guide: {
    _type: "guide",
    hasGuide: true,
    status: "available",
    format: ["PDF"],
    pages: 29,
    customPrices: [
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 29 },
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 29 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 29 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 35 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
    cardLine: "The full loop in seven days, timed to the hour",
    dayStrip: "Reykjanes · Golden Circle · South Coast · East · Mývatn · North · West · Reykjavík",
    // proofLine: FOUNDER TO SUPPLY - it is a trust claim with a date, and the
    // trip year is not derivable from anything in the repo. Left unset rather
    // than guessed; the page falls back gracefully without it.
  },
};

if (DRY_RUN) {
  console.log("DRY RUN — no writes. Doc preview:");
  console.log(JSON.stringify({ ...doc, trackLine: `[${JSON.parse(trackLine).length} points]` }, null, 2).slice(0, 2600));
  console.log("\n… truncated. Assets that WOULD upload:", ["hero.jpg", ...galleryDefs.map((g) => g[0]), "PDF"].join(", "));
} else {
  // The Iceland collection does not exist yet — every other country guide has one.
  await client.createIfNotExists({ _id: "collection-iceland", _type: "collection", slug: { _type: "slug", current: "iceland" } });
  const res = await client.createOrReplace(doc);
  console.log("created", res._id);
}

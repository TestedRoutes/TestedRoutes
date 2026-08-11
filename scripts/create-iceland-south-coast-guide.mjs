#!/usr/bin/env node
/**
 * One-shot: create the Iceland South Coast 5-day guide story doc in Sanity.
 *
 * Cloned from create-iceland-ring-road-guide.mjs (the newest sibling, per the
 * production playbook). Every fact below comes from the sellable deck (the
 * founder's final pptx, QA-gated 2026-08-11) or Content Plan v53 — nothing is
 * written from memory.
 *
 * Title, subtitle and prices are verbatim from the Content Plan Guides sheet
 * (final price set 2026-08-09: EUR 19 / CHF 19 / GBP 19 / USD 25, customPrices,
 * no tier matches). The meta description is the plan's 145-160 SEO string —
 * it sat in the Ring Road row's cell by paste slip; moved to this SKU's row at
 * publish time.
 *
 * Distances: ~1,300 km total, day totals 110/230/170/300/350 + 120 on the
 * departure day, read from the deck's route page (which was itself re-based
 * from the day-plan workbook, v8 playbook §derive-not-transcribe).
 *
 * estimatedCost IS set here, unlike the Ring Road: the 5-day deck quotes costs
 * per person, costed for two sharing (v8 playbook), which matches the site
 * field's basis. LEAN ~990 to SPLURGE ~3,285 EUR.
 *
 * Idempotency: createOrReplace on a fixed _id, so re-running refreshes the doc
 * but re-uploads the assets. Run --dry-run first.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-iceland-south-coast-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\b274bb1c-25d2-41a3-a621-b4838b23f3fb\scratchpad\guide-assets-iceland-5d`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\iceland\guides\iceland-south-coast-5-days\TestedRoutes_Iceland_Guide_5_Days_South_Coast.pdf`;

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
  "Basalt columns at Reynisfjara with the Reynisdrangar sea stacks rising from the black sand beyond",
);
const galleryDefs = [
  ["g1.jpg", "A blue-white iceberg glowing in sunlight on the glacier lagoon"],
  ["g2.jpg", "A Reykjavík shopping street with painted shopfronts and benches"],
  ["g3.jpg", "Hallgrímskirkja seen head-on from the plaza, its stepped concrete façade filling the frame"],
  ["g4.jpg", "Skógafoss pouring over its lip, walkers at the base for scale"],
  ["g5.jpg", "Icebergs drifting across Jökulsárlón toward the sea"],
];
const gallery = [];
for (const [file, alt] of galleryDefs) {
  const g = await img(file, alt);
  gallery.push({ ...g, _key: file.replace(/\W/g, "") });
}

const pdfAsset = DRY_RUN
  ? { _id: "DRY-pdf" }
  : await client.assets.upload("file", readFileSync(PDF), {
      filename: "TestedRoutes_Iceland_Guide_5_Days_South_Coast.pdf",
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
  _id: "story-iceland-south-coast-5-days",
  _type: "story",
  title: "Iceland South Coast: A 5-Day Self-Drive Itinerary",
  slug: { _type: "slug", current: "iceland-south-coast-5-days" },
  storyId: "iceland-south-coast-5-days-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-11",
  lastUpdated: "2026-08-11",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  // timesCompleted / mostRecentCompletion: FOUNDER TO SUPPLY, same as the
  // Ring Road — more than one Iceland trip is on file and guessing a number
  // would be inventing trip history.

  eyebrow: "ICELAND • 5-DAY ROAD TRIP • SOUTH COAST",
  subtitle:
    "The waterfalls, black sand and the glacier lagoon - without committing a week to the Ring Road.",
  metaTitle: "Iceland South Coast: A 5-Day Self-Drive Itinerary",
  metaDescription:
    "Seljalandsfoss to Jokulsarlon in five days, based in Vik and Skaftafell. The south coast done properly, without driving the full Ring Road.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Most south-coast itineraries are three days that sprint to the glacier lagoon and back, or a full Ring Road that spends half its week driving the north. This one takes five days on the stretch everyone actually comes for, and folds the Golden Circle into the drive home - where it costs nothing."),
    P("b2", "Every day is timed to the hour: arrival, how long the stop is worth, and the leave-by that keeps the rest of the day intact. Three hotels across five nights - Reykjavík and Vík twice each, one night at the glacier - and about 1,300 km of driving that never needs a 4WD or an F-road."),
    P("b3", "It is an honest plan rather than a comfortable one. Reynisfjara's sneaker waves are named as the one genuine danger on the route, the Blue Lagoon comes with an eruption plan, and every long day says what to cut when you fall behind."),
  ],

  whatMakesThisSpecial:
    "Iceland's best stretch in five days - every slot timed, and the Golden Circle saved for the road home.",
  highlights: [
    "Jökulsárlón - icebergs drifting onto black sand",
    "Seljalandsfoss - the waterfall you walk behind",
    "Dyrhólaey - a rock arch over an endless black coast",
    "Reynisfjara's basalt columns and the Reynisdrangar stacks",
    "Silfra - snorkelling the rift between two continents",
  ],
  whyThisTrip: [
    "Five days on the stretch everyone actually comes for - no half-week driving the north",
    "Three hotels across five nights, with Vík and Reykjavík twice each, so you rarely repack",
    "Timed to the hour, with leave-by times rather than vague half-days",
    "Built for a standard 2WD rental - no F-roads anywhere on the route",
    "The Golden Circle folded into the drive back, so the loop costs you nothing",
  ],
  uniqueSellingPoints: [
    "Hour-by-hour timelines for all six days on the ground",
    "The five bookings that actually sell out, and how far ahead each one goes",
    "A costed budget across three comfort levels - per person, itemised",
    "An eruption plan for the Blue Lagoon and a fallback if the glacier hike is booked out",
    "Google My Maps companion with every pin in the guide",
  ],
  whoThisIsFor: [
    "First-time visitors who want Iceland's best stretch, not the whole loop",
    "Anyone with five days rather than seven",
    "Couples and pairs splitting the driving",
    "Anyone who would rather follow a tested plan than build one",
  ],
  notSuitableIf: [
    "You have eight days or more on the ground - drive the full Ring Road instead",
    "You want the north: Mývatn, Húsavík's whales and Dettifoss are not on this route",
    "You are travelling between October and April - this is a June-to-August plan",
    "You want highland F-roads, Landmannalaugar or the Westfjords",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "5 days" },
    { _key: "distance", _type: "primaryStat", label: "Driving", value: "~1,300 km, 6 days on the ground" },
    { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days, with clear cuts" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Self-drive 2WD from Keflavík" },
    { _key: "season", _type: "primaryStat", label: "Season", value: "June to August" },
  ],
  durationDays: 5,
  durationDisplay: "5 days, 6 on the ground",
  totalDistanceKm: 1300,
  overallLevel: "easy",
  crowdLevel: "high",
  beginnerFriendly: true,
  familyFriendly: true,
  soloFriendly: true,
  idealGroupSize: "2 people",
  idealFor: ["road trippers", "first-time visitors", "photographers", "couples"],

  difficultyAtAGlance: [
    "Easy driving, 2WD throughout - the only gravel is the short access into Fjaðrárgljúfur",
    "The longest walk is the 5.5 km Svartifoss loop; the glacier hike is guided, crampons provided",
    "Day 5 is the longest drive at 350 km, with the Golden Circle folded in",
    "Reynisfjara's sneaker waves are the one genuine danger - watch the light board, stay on dry sand",
  ],
  commonMistakes: [
    "Sprinting to Jökulsárlón and back in three days and spending the trip in the car",
    "Leaving the Blue Lagoon slot unbooked - it sells out weeks ahead in summer",
    "Booking a 4WD nobody on this route needs",
    "Turning your back on the ocean at Reynisfjara",
    "Doing Dyrhólaey at midday instead of the evening, when the low light runs along the black coast",
  ],
  insiderTips: [
    "Reynisfjara at 08:00 - the tour buses arrive mid-morning",
    "Wade into Gljúfrabúi's slot canyon 200 m north of Seljalandsfoss - most people walk past it",
    "Book the day's dinner at breakfast: kitchens outside Reykjavík close by 21:00",
    "Dyrhólaey is an evening stop on purpose - by 19:00 the low sun runs along the black coast",
    "Fill up whenever the tank drops below half; every pump takes a card with a PIN",
  ],
  verifiedFacts: [
    "The route totals ~1,300 km with day totals of 110/230/170/300/350 km, plus 120 km on the departure day",
    "Three hotels cover the five nights: Reykjavík twice, Vík twice and one night at Freysnes",
    "Suður-Vík takes no same-day bookings after 18:00 - book at lunch",
    "The Háey upper road at Dyrhólaey can close in nesting season; the arch and lower level stay open",
    "Mid-June to mid-July it never gets properly dark; by August proper dusk returns",
  ],

  bookingsRequired: [
    "Rental car from Keflavík (2WD + gravel cover)",
    "Blue Lagoon entry slot (~16:00 on Day 1)",
    "Icelandic Lava Show (Day 2, 20:00 or 21:00 show)",
    "Blue Ice glacier hike at Skaftafell (Day 3, the ~14:30 departure)",
    "Jökulsárlón amphibian boat (Day 4, sails May to October)",
    "Silfra snorkel (Day 5, ~17:00, medical form signed)",
    "Five nights of accommodation - Vík and Freysnes go 3-6 months ahead",
  ],
  bookingsAdvanceDays: 90,
  specialEquipment: [
    "waterproof shell - worn behind two waterfalls",
    "fleece or wool mid-layer, even in July",
    "hiking shoes with grip",
    "two swimsuits and a quick-dry towel",
    "sleep mask for the midnight sun",
    "binoculars for the puffins at Dyrhólaey",
    "offline maps + power bank",
    "one credit card with a PIN for unmanned fuel pumps",
  ],
  rentalEquipmentAvailable: true,
  permitsRequired: false,

  budgetLevel: "moderate",
  estimatedCost: { _type: "estimatedCost", min: 990, max: 3285, currency: "EUR" },
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
  regions: ["Reykjanes", "South Coast", "Golden Circle"],
  coordinates: { _type: "geopoint", lat: 63.75, lng: -19.6 },
  mapZoom: 7,
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
    { _key: "bluelagoon", _type: "routePoint", name: "Blue Lagoon", type: "highlight", coordinates: { _type: "geopoint", lat: 63.8804, lng: -22.4495 } },
    { _key: "seljalandsfoss", _type: "routePoint", name: "Seljalandsfoss", type: "highlight", coordinates: { _type: "geopoint", lat: 63.61561, lng: -19.98856 } },
    { _key: "skogafoss", _type: "routePoint", name: "Skógafoss", type: "highlight", coordinates: { _type: "geopoint", lat: 63.53207, lng: -19.51134 } },
    { _key: "vik", _type: "routePoint", name: "Vík", type: "stop", coordinates: { _type: "geopoint", lat: 63.4187, lng: -19.006 } },
    { _key: "skaftafell", _type: "routePoint", name: "Skaftafell", type: "stop", coordinates: { _type: "geopoint", lat: 64.01639, lng: -16.96598 } },
    { _key: "jokulsarlon", _type: "routePoint", name: "Jökulsárlón", type: "highlight", coordinates: { _type: "geopoint", lat: 64.04583, lng: -16.19178 } },
    { _key: "dyrholaey", _type: "routePoint", name: "Dyrhólaey", type: "highlight", coordinates: { _type: "geopoint", lat: 63.4023, lng: -19.1301 } },
    { _key: "thingvellir", _type: "routePoint", name: "Þingvellir", type: "highlight", coordinates: { _type: "geopoint", lat: 64.2559, lng: -21.13 } },
    { _key: "return", _type: "routePoint", name: "Keflavík Airport", type: "end", coordinates: { _type: "geopoint", lat: 63.97565, lng: -22.64024 } },
  ],
  trackLine,

  activityTags: [
    "Iceland south coast", "self-drive", "glacier lagoon", "waterfalls",
    "black sand beaches", "Golden Circle", "midnight sun", "glacier hike",
  ],
  keywords: [
    "Iceland south coast itinerary", "5 day Iceland itinerary", "Jökulsárlón",
    "Seljalandsfoss", "Skógafoss", "Reynisfjara", "Iceland self-drive", "Golden Circle",
  ],
  searchTags: [
    "Iceland itinerary 5 days", "Iceland south coast itinerary",
    "Iceland self drive summer", "Iceland road trip without ring road",
  ],
  searchSynonyms: ["Suðurland", "south Iceland", "the waterfall coast"],
  appearsInSearches: [
    "5 day Iceland itinerary south coast",
    "Iceland south coast how many days",
    "is 5 days enough for Iceland",
    "Iceland itinerary without the ring road",
  ],
  alternativeNames: ["South Iceland road trip", "Suðurland route"],

  whatYouGet: [
    "Hour-by-hour timelines for all six days on the ground, with leave-by times and what to cut",
    "Three hotel bases across five nights - Vík and Reykjavík twice each, so you rarely repack",
    "Every booking that sells out and how far ahead each one goes, with an eruption plan for the Blue Lagoon",
    "A costed budget across three comfort levels - per person, costed for two sharing",
    "Hotel and restaurant picks per base, cheapest to splurge, with the kitchen-closing times that catch people out",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
  ],
  similarStories: [
    { _key: "waterfall", _ref: "story-south-coast-one-waterfall-iceland", _type: "reference" },
    { _key: "lagoon", _ref: "story-south-coast-glacier-lagoon-can", _type: "reference" },
    { _key: "days", _ref: "story-iceland-ring-road-many-days-do", _type: "reference" },
  ],

  featuredInHomepage: false,

  guide: {
    _type: "guide",
    hasGuide: true,
    status: "available",
    format: ["PDF"],
    pages: 25,
    customPrices: [
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 19 },
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 19 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 19 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 25 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
    cardLine: "Iceland's best stretch in five days, timed to the hour",
    dayStrip: "Reykjanes · Waterfall Coast · Glacier Coast · Icebergs · Golden Circle · Reykjavík",
    // proofLine: FOUNDER TO SUPPLY, same as the Ring Road - it is a trust
    // claim with a date. The page falls back gracefully without it.
  },
};

if (DRY_RUN) {
  console.log("DRY RUN — no writes. Doc preview:");
  console.log(JSON.stringify({ ...doc, trackLine: `[${JSON.parse(trackLine).length} points]` }, null, 2).slice(0, 2600));
  console.log("\n… truncated. Assets that WOULD upload:", ["hero.jpg", ...galleryDefs.map((g) => g[0]), "PDF"].join(", "));
} else {
  const res = await client.createOrReplace(doc);
  console.log("created", res._id);
}

#!/usr/bin/env node
/**
 * One-shot: create the Iceland 1-day layover guide story doc in Sanity.
 *
 * Cloned from create-tuvalu-2-days-guide.mjs (the newest sibling, per the
 * production playbook). Every fact below comes from the sellable deck (the
 * founder's final pptx, QA-gated 2026-08-13), Iceland master v27h, or Content
 * Plan v54 row 125 - nothing is written from memory.
 *
 * Title, subtitle, meta description and prices verbatim from the Content Plan
 * Guides sheet (founder price 2026-08-09: EUR 12 / CHF 12 / GBP 12 / USD 15,
 * customPrices, no tier matches).
 *
 * estimatedCost is NOT set: the deck quotes two per-person totals (~EUR 380 by
 * car, ~EUR 425 by bus) - mode alternatives, not the LEAN..SPLURGE band the
 * site field wants. The cost story lives in the deck and in copy below.
 *
 * GEO/SEO intent: the layover is searched as a *question* - "what to do on a
 * layover in Iceland" / "can you leave the airport" / "is the Blue Lagoon
 * worth it on a layover" - before it is searched as a route. appearsInSearches
 * + keywords target those phrasings; searchSynonyms carries KEF / Keflavik /
 * stopover so the doc matches however the hours are named.
 *
 * References are hardcoded but were resolved against the live dataset on
 * 2026-08-14 (destination-iceland, category-journey-day-trip = what the
 * sibling 1-day guide uses, the three similarStories ids, and the four
 * affiliateLink-* ids); createOrReplace would not surface a dangling _ref,
 * so do not swap these without re-querying.
 *
 * Idempotency: createOrReplace on a fixed _id. Run --dry-run first.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-iceland-layover-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\40a48b0a-94b1-4a73-a99d-623940f36215\scratchpad\guide-assets-iceland-layover-1d`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\iceland\guides\iceland-layover-reykjavik-blue-lagoon\TestedRoutes_Iceland_Guide_1_Day_Reykjavik_Blue_Lagoon.pdf`;

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

// Alt text written from the actual frames (all seven viewed 2026-08-14).
const hero = await img(
  "hero.jpg",
  "The Blue Lagoon's milky-blue water full of bathers, steam drifting toward the lava ridge",
);
const galleryDefs = [
  ["g1.jpg", "The boardwalk into the Blue Lagoon, a lifeguard's yellow vest over the steam"],
  ["g2.jpg", "Thumbs up in a white silica mask, mid-soak in the lagoon"],
  ["g3.jpg", "Seabird cliffs above the churning surf at the Reykjanes lighthouse corner"],
  ["g4.jpg", "Hallgrimskirkja head-on from the plaza, wet paving in the evening light"],
  ["g5.jpg", "The painted shopping street in central Reykjavik, benches and gable ends"],
  ["g6.jpg", "Hallgrimskirkja's concrete columns sweeping up to the spire"],
];
const gallery = [];
for (const [file, alt] of galleryDefs) {
  const g = await img(file, alt);
  gallery.push({ ...g, _key: file.replace(/\W/g, "") });
}

const pdfAsset = DRY_RUN
  ? { _id: "DRY-pdf" }
  : await client.assets.upload("file", readFileSync(PDF), {
      filename: "TestedRoutes_Iceland_Guide_1_Day_Reykjavik_Blue_Lagoon.pdf",
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
  _id: "story-iceland-layover-reykjavik-blue-lagoon",
  _type: "story",
  title: "Iceland Layover: Reykjavik and Blue Lagoon in 1 Day",
  slug: { _type: "slug", current: "iceland-layover-reykjavik-blue-lagoon" },
  storyId: "iceland-layover-reykjavik-blue-lagoon-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-14",
  lastUpdated: "2026-08-14",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],

  eyebrow: "ICELAND • 1-DAY LAYOVER • REYKJAVIK & BLUE LAGOON",
  subtitle: "Lava fields, a lagoon and the city - sized to the hours you actually have.",
  metaTitle: "Iceland Layover: Reykjavik and Blue Lagoon in 1 Day",
  metaDescription:
    "One curated day between two flights: the Reykjanes loop, the Blue Lagoon and Reykjavik on foot, timed landing to take-off, by car or entirely by bus.",

  heroImage: hero,
  galleryImages: gallery,

  // "My Experience" on the page - first person ON PURPOSE (founder-sanctioned
  // exception, same as the siblings): it renders under that heading and must
  // read as the actual trip. Grounded in the May 2022 layover the photo
  // archive documents - which ran the plan in reverse.
  body: [
    P("b1", "Our own version of this day ran backwards. We landed in the evening, too late for the peninsula, so the first hours were Reykjavik on foot - the waterfront, the painted street climbing to the church, and a city that stays light long past ten in late May. The loop waited for morning."),
    P("b2", "The next day was the guide's day compressed: the lagoon not long after opening - silica masks, steam rolling off the water, a drink at the in-water bar - then the lighthouse corner with Gunnuhver roaring behind its ropes and seabirds stacked on the cliffs, and black sand between the stops. By mid-afternoon we were at the car return, smelling faintly of sulphur, with the whole country ticked in a day."),
    P("b3", "That reversed run is exactly why this guide is built on an anchor you can shift. Flights hit Keflavik at every hour, so the plan is written 10:00 to 10:00 with rules for moving it - land at dawn, land at midnight, fly out early - instead of pretending everyone arrives at the same time. The order of the day changes; the day itself holds."),
  ],

  whatMakesThisSpecial:
    "Iceland between two flights - the sea-cliff corner, the Blue Lagoon and the capital, timed landing to take-off.",
  highlights: [
    "The lighthouse corner - Valahnukamol's boulder surf, cliffs and summer seabirds",
    "The Bridge Between Continents - a footbridge across the rift between two plates",
    "Gunnuhver - a roaring mud spring named after a ghost",
    "The Blue Lagoon, booked for the hour you land",
    "Reykjavik in an evening - Sun Voyager, the painted street, Hallgrimskirkja",
  ],
  whyThisTrip: [
    "One curated day on a 10:00-to-10:00 anchor, with rules for shifting it to your flight times",
    "Two complete plans: the peninsula loop by car, or the lagoon and the capital entirely by bus",
    "The one booking that actually matters - the lagoon slot - and the exact moment to make it",
    "A short-layover page for 6-10 hours between flights, counted from landing",
    "The honest call on what will not fit - whale watching, Silfra and the rest, with reasons",
  ],
  uniqueSellingPoints: [
    "Hour-by-hour timelines for the by-car and the by-bus day",
    "Shift-the-anchor rules for every landing window, from dawn to after 21:00",
    "A costed per-person budget: ~EUR 380 by car, ~EUR 425 by bus",
    "The four airport-coach times the bus plan hangs on, and the Flybus rule home",
    "Google My Maps companion with every pin - extras ringed, rejects marked",
  ],
  whoThisIsFor: [
    "Anyone with about 24 hours between flights at Keflavik",
    "First-timers deciding whether Iceland deserves a full trip",
    "Travellers without a car - the bus day is a real plan, not a compromise",
    "Anyone who wants the lagoon slot, dinner and the night solved in one pass",
  ],
  notSuitableIf: [
    "You have under six hours between flights - the short-layover page says stay or go, honestly",
    "You want the Golden Circle - that is the sibling layover guide, not this one",
    "You want nightlife - kitchens close by ~21:30 and the evening is a walk, not a bar crawl",
    "You expect whale watching or Silfra to fit - they do not, and the guide shows why",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "1 day · 10:00 to 10:00" },
    { _key: "pace", _type: "primaryStat", label: "Pace", value: "One curated day + departure" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "2WD hire car or airport coaches" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · short flat walks" },
    { _key: "season", _type: "primaryStat", label: "Season", value: "Year-round" },
  ],
  durationDays: 1,
  durationDisplay: "24 hours, landing to take-off",
  overallLevel: "easy",
  crowdLevel: "moderate",
  beginnerFriendly: true,
  familyFriendly: true,
  soloFriendly: true,
  idealGroupSize: "2 people",
  idealFor: ["layover travellers", "first-timers", "couples", "solo travellers"],

  difficultyAtAGlance: [
    "Easy 2WD driving on paved roads - about 150 km across the 24 hours",
    "Short flat walks at every stop - nothing on this route counts as a hike",
    "Wind is the real variable: vedur.is is the forecast that matters, road.is in winter",
    "The bus plan swaps driving for four fixed coach times - the skill is watching the clock",
  ],
  commonMistakes: [
    "Booking the lagoon slot last - it sells out weeks ahead in summer; book it with the flights",
    "Leaving Reykjavik less than 4 hours before the flight",
    "Planning peninsula stops by public transport - no service exists to any of them",
    "Treating the second morning as sightseeing time - it is only the drive out, and the guide says so",
    "Taking big cases to the lagoon on the bus day - they go into the KEF lockers, one opening per rental",
  ],
  insiderTips: [
    "Set the lagoon slot at landing + 4 h by car, or bus + 30 min without one",
    "Sky Lagoon is the swap if the Blue Lagoon is closed or full - 15 min from downtown, cheaper",
    "Cafe Loki takes no bookings - walk in by 20:00; Messinn books out, reserve at lunch",
    "Sep to Apr, check the vedur.is aurora page - Grotta is the dark spot, 15 min west",
    "Braud & Co opens 06:30 - the fly-out breakfast on the way to the car",
  ],
  verifiedFacts: [
    "Airport coaches to the Blue Lagoon run four times a day - 07:30, 09:30, 12:30, 16:30 - at 4,395 ISK",
    "Flybus meets every arriving flight; BSI departures run from 03:30, 3,999 ISK",
    "KEF's luggage lockers run ~EUR 34 large / ~EUR 52 XL per 24 h - and one opening per rental",
    "The Blue Lagoon slot is the only booking that must be made the day you buy flights",
    "No public transport reaches Gunnuhver, the Bridge or Valahnukamol - none exists",
  ],

  bookingsRequired: [
    "Blue Lagoon slot - the moment you buy flights (~landing + 4 h by car, ~13:00 by bus)",
    "The night's bed, Reykjavik or airport-side - booked with the flights",
    "Rental car (2WD + gravel cover) or the coach seats - same day",
  ],
  bookingsAdvanceDays: 30,
  specialEquipment: [
    "swimwear - the lagoon is the middle of the day",
    "a windproof layer - the cliffs are the windiest corner of the day",
    "trainers cover every stop - no hiking shoes needed",
    "a card with a PIN - the whole day runs on card, no cash",
  ],
  rentalEquipmentAvailable: false,
  permitsRequired: false,

  budgetLevel: "moderate",
  accommodationType: "hotel",
  journeyStyle: "self_guided",
  journeyCategory: { _ref: "category-journey-day-trip", _type: "reference" },
  routeMode: "driving",
  timeOfDay: "full_day",
  weatherDependent: true,
  snowSeasonAccessible: true,
  wheelchairAccessible: false,
  carRequired: false,
  fourByFourRequired: false,
  publicTransportAccessible: true,
  transportationRequired: ["car", "bus"],
  transportationDifficulty: "easy",
  nearestCity: "Reykjavík",
  nearestCityDistanceKm: 50,

  bestSeasons: ["spring", "summer", "fall", "winter"],
  bestMonths: [5, 6, 7, 8, 9],

  destination: { _ref: "destination-iceland", _type: "reference" },
  regions: ["Reykjanes", "Reykjavik"],
  coordinates: { _type: "geopoint", lat: 63.98, lng: -22.3 },
  mapZoom: 9,
  startingPoint: {
    _type: "startingPoint",
    name: "Keflavik International Airport (KEF)",
    type: "airport",
    coordinates: { _type: "geopoint", lat: 63.9815, lng: -22.6282 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Keflavik International Airport (KEF)",
    type: "airport",
    coordinates: { _type: "geopoint", lat: 63.9815, lng: -22.6282 },
  },
  routePoints: [
    { _key: "kef", _type: "routePoint", name: "Land at KEF", type: "start", coordinates: { _type: "geopoint", lat: 63.9815, lng: -22.6282 } },
    { _key: "bridge", _type: "routePoint", name: "Bridge Between Continents", type: "stop", coordinates: { _type: "geopoint", lat: 63.8683, lng: -22.6755 } },
    { _key: "lighthouse", _type: "routePoint", name: "Reykjanes Lighthouse + Valahnukamol", type: "highlight", coordinates: { _type: "geopoint", lat: 63.8159, lng: -22.7045 } },
    { _key: "gunnuhver", _type: "routePoint", name: "Gunnuhver", type: "stop", coordinates: { _type: "geopoint", lat: 63.8192, lng: -22.6847 } },
    { _key: "lagoon", _type: "routePoint", name: "Blue Lagoon", type: "highlight", coordinates: { _type: "geopoint", lat: 63.8807, lng: -22.4473 } },
    { _key: "oldroad", _type: "routePoint", name: "Old Blue Lagoon Road", type: "stop", coordinates: { _type: "geopoint", lat: 63.8885, lng: -22.4258 } },
    { _key: "sunvoyager", _type: "routePoint", name: "Sun Voyager", type: "stop", coordinates: { _type: "geopoint", lat: 64.1476, lng: -21.9222 } },
    { _key: "church", _type: "routePoint", name: "Hallgrimskirkja", type: "highlight", coordinates: { _type: "geopoint", lat: 64.142, lng: -21.9265 } },
    { _key: "kefout", _type: "routePoint", name: "KEF - fly out", type: "end", coordinates: { _type: "geopoint", lat: 63.9815, lng: -22.6282 } },
  ],
  trackLine,

  activityTags: [
    "layover", "stopover", "Blue Lagoon", "Reykjanes peninsula",
    "geothermal", "city walk", "self-drive", "by bus",
  ],
  keywords: [
    "Iceland layover itinerary", "what to do on a layover in Iceland",
    "Blue Lagoon layover", "Reykjavik layover", "Iceland stopover guide",
    "KEF layover", "Reykjanes peninsula day trip", "Blue Lagoon from the airport",
  ],
  searchTags: [
    "Iceland 1 day itinerary", "Iceland layover 24 hours",
    "Blue Lagoon between flights", "Reykjavik in one day",
  ],
  searchSynonyms: ["Keflavik", "KEF", "Reykjanes", "stopover", "Icelandair stopover"],
  appearsInSearches: [
    "what to do on a long layover in Iceland",
    "can you leave the airport on an Iceland layover",
    "is the Blue Lagoon worth it on a layover",
    "how many hours do you need for the Blue Lagoon",
    "Reykjavik or Blue Lagoon on a layover",
  ],
  alternativeNames: ["Reykjanes layover", "KEF stopover day"],

  whatYouGet: [
    "Two complete day plans on one anchor: the peninsula loop by car, the lagoon and the capital by bus",
    "Shift-the-anchor rules for every landing and take-off window",
    "A short-layover page for 6-10 hours between flights, counted from landing",
    "The bookings in order with QR links - and the Sky Lagoon swap if the Blue Lagoon is full",
    "A costed per-person budget for both plans, including the extras nobody lists",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
    { _key: "parka", _ref: "affiliateLink-parka-app", _type: "reference" },
  ],
  similarStories: [
    { _key: "layoverstory", _ref: "story-iceland-reykjanes-layover", _type: "reference" },
    { _key: "ringroad", _ref: "story-iceland-ring-road-7-days", _type: "reference" },
    { _key: "southcoast", _ref: "story-iceland-south-coast-5-days", _type: "reference" },
  ],

  featuredInHomepage: false,

  guide: {
    _type: "guide",
    hasGuide: true,
    status: "available",
    format: ["PDF"],
    pages: 17,
    customPrices: [
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 12 },
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 12 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 12 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 15 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
    cardLine: "Iceland between two flights, timed landing to take-off",
    dayStrip: "Land · Lighthouse corner · Blue Lagoon · Reykjavik evening · Fly out",
  },
};

if (DRY_RUN) {
  console.log("DRY RUN - no writes. Doc preview:");
  console.log(JSON.stringify({ ...doc, trackLine: `[${JSON.parse(trackLine).length} points]` }, null, 2).slice(0, 2200));
  console.log("\n... truncated. Assets that WOULD upload:", ["hero.jpg", ...galleryDefs.map((g) => g[0]), "PDF"].join(", "));
} else {
  const res = await client.createOrReplace(doc);
  console.log("created", res._id);
}

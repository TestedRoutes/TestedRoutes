// One-shot: create the St. Moritz to Alp Flix weekend-guide story doc
// (Alpine Passes Trail stages 1+2), modeled on create-grimentz-evolene-guide.mjs.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-st-moritz-alp-flix-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\fc3f6f3b-f071-436c-84da-4d2f6e0ae5f4\scratchpad\guide-assets-sma`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-1-2-st-moritz-to-alp-flix\final\TestedRoutes-St-Moritz-Alp-Flix-Weekend-Hike.pdf`;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function img(file, alt) {
  const a = await client.assets.upload("image", readFileSync(path.join(ASSETS, file)), { filename: file });
  console.log("image", file, a._id);
  return { _type: "image", alt, asset: { _type: "reference", _ref: a._id } };
}

const hero = await img(
  "20250801_062500.jpg",
  "The Jenatschhütte at dawn at 2,652 m, the highest SAC hut in Graubünden and the Day 1 overnight",
);
const gallery = [];
const galleryDefs = [
  ["20250731_144457.jpg", "Setting off from Corviglia at 2,488 m, the official start of the Alpine Passes Trail"],
  ["20250731_172941.jpg", "Descending into the rust-red amphitheatre below the Fuorcla Suvretta"],
  ["20250801_081232.jpg", "The turquoise Leg Leget at 2,700 m, the Day 2 swim stop"],
  ["20250801_062426.jpg", "Sunrise over Val Bever from the hut, Swiss flag in the wind"],
  ["20250801_125608.jpg", "Berghaus Piz Platta on the Alp Flix plateau, the end of the route"],
  ["20250731_193744.jpg", "Dinner at the Jenatschhütte, one sitting at 18:30"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-St-Moritz-Alp-Flix-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-st-moritz-to-alp-flix",
  _type: "story",
  title: "St. Moritz to Alp Flix",
  slug: { _type: "slug", current: "st-moritz-to-alp-flix" },
  storyId: "switzerland-st-moritz-alp-flix-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-07",
  lastUpdated: "2026-08-07",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2025-08-01",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "The first two stages of the Alpine Passes Trail: four passes near 3,000 m, a night at the Jenatschhütte — the highest SAC hut in Graubünden — and a descent to the Alp Flix plateau.",
  metaTitle: "St. Moritz to Alp Flix: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 1 and 2): from Corviglia over the Fuorcla Suvretta to a night at the 2,652 m Jenatschhütte, then over the Fuorcla d'Agnel to Alp Flix, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "St. Moritz to Alp Flix"),
    P("b2", "From Corviglia the glitter of St. Moritz falls away within the hour."),
    P("b3", "The trail climbs past Lej Alv to the Fuorcla Schlattain, drops to the Suvretta lakes, then takes on the crux: 400 metres of steep, partly fixed switchbacks to the Fuorcla Suvretta at 2,967 metres. The far side is a rust-red amphitheatre with Piz Bernina stacked on the horizon, and at the bottom of it, alone at the head of Val Bever, stands the Jenatschhütte — the highest SAC hut in Graubünden. Dinner is one sitting at 18:30. There is no mobile signal. That is the point."),
    P("b4", "Day 2 crosses the Fuorcla d'Agnel at 2,982 metres, the highest ground of the weekend and the gateway to Parc Ela. An hour later comes the reward almost nobody knows about: Leg Leget, a lakelet at 2,700 metres with no inflow and no outlet — which means it is warm enough to swim in. We did."),
    P("b5", "From there the moonscape softens into the Alp Flix moorland, a plateau they call the Treasure Island of Biodiversity. Coffee and cake at Berghaus Piz Platta, a CHF 12 shuttle down to Sur, and the PostBus rolls you back toward the trains."),
    P("b6", "One 2026 note: the Corviglia funicular is closed all summer. The way up is the Signal cable car from St. Moritz Bad and a shuttle to the Piz Nair valley station — it works, and the guide walks you through it."),
    P("b7", "25 km. Four passes. One night at 2,652 m."),
  ],

  whatMakesThisSpecial:
    "A night at the Jenatschhütte, the highest SAC hut in Graubünden, alone at the head of Val Bever — plus a swim in a 2,700 m lakelet that almost nobody knows is warm.",
  highlights: [
    "One night at the Jenatschhütte, 2,652 m — the highest SAC hut in Graubünden",
    "The Fuorcla Suvretta at 2,967 m, with Piz Bernina stacked on the horizon",
    "A swim in Leg Leget, the warm 2,700 m lakelet with no inflow or outlet",
    "The Fuorcla d'Agnel, 2,982 m — the gateway to Parc Ela",
    "Alp Flix, the moorland plateau they call the Treasure Island of Biodiversity",
  ],
  whyThisTrip: [
    "The first two stages of the 43-stage Alpine Passes Trail, done properly",
    "Four passes near 3,000 m packed into one weekend",
    "A hut night with no mobile signal, two valleys behind the resort",
    "A finish on one of Switzerland's most protected moorland plateaus",
  ],
  uniqueSellingPoints: [
    "The official start of the Alpine Passes Trail, walked as the trail intends",
    "The highest SAC hut in Graubünden, slept in rather than walked past",
    "A warm 2,700 m swim stop verified in person",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "The 2026 Corviglia funicular closure solved: the Signal cable car chain, mapped",
  ],
  whoThisIsFor: [
    "Comfortable walking five hours a day with sustained climbs",
    "Walkers who want passes, not summits",
    "Wanting a hut night that is not a formality",
    "Prefer self-guided independent travel",
  ],
  notSuitableIf: [
    "You need a bail-out mid-stage — there is no lift out beyond Corviglia",
    "You need privacy to sleep: the hut is dormitory bunks",
    "Forecast is unstable — there is no shelter between the passes",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If you need a bail-out — beyond Corviglia there is no lift down",
    "If you need privacy to sleep — the hut is dormitory bunks",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~10 h walking · ~1,551 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,982 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + lifts, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "A night at the highest hut in Graubünden" },
  ],
  durationDays: 2,
  durationHours: 10,
  durationDisplay: "2 days, ~10 h walking total",
  totalDistanceKm: 25,
  elevationGainM: 1551,
  maxAltitudeM: 2982,
  overallLevel: "hard",
  physicalFitnessRequired: "high",
  technicalSkillRequired: "basic",
  adrenalineLevel: 3,
  scenicRating: 5,
  crowdLevel: "low",
  beginnerFriendly: false,
  familyFriendly: false,
  soloFriendly: true,
  minAgeRecommended: 12,
  idealGroupSize: "1–4 people",
  idealFor: ["alpine hikers", "weekend adventurers", "hut-night collectors", "photographers"],
  bestForCrowdType: "active_explorers",

  difficultyAtAGlance: [
    "T3+ mountain hiking — steep, partly fixed sections at the Fuorcla Suvretta",
    "Highest point 2,982 m at the Fuorcla d'Agnel",
    "25 km / 1,551 m ascent over 2 days",
    "No kitchen or tap between Corviglia and the hut — carry 2 L",
  ],
  difficultyFactors: [
    "The T3+ grade comes from the Fuorcla Suvretta: steep, partly exposed, short fixed sections",
    "Four passes near 3,000 m with no lift out beyond Corviglia",
    "The descents off both big passes are steep and slippery when wet",
    "Snow can sit on the passes into mid-July",
    "The trip ends on a fixed shuttle chain: the 17:08 off the plateau is the last",
  ],
  commonMistakes: [
    "Booking train tickets before the hut — no hut, no trip",
    "Forgetting the sleeping-bag liner, which is mandatory at the hut",
    "Not filling bottles at breakfast — the hut spring is the last tap until Alp Flix",
    "Starting the climb after 10:30 — there is no shelter between the passes once storms build",
    "Missing the 17:08 shuttle and discovering it is an hour on foot down to Sur",
  ],
  insiderTips: [
    "Book the hut first — online or phone, 70 places, fine Saturdays go first",
    "Fill Day 2's bottles at breakfast; the hut runs on spring water",
    "Pack the swim gear: Leg Leget at 2,700 m is genuinely warm on a hot day",
    "The hut takes cards and EUR at 1:1.20 — but cash in small notes is smoother",
    "No mobile signal at the hut — download offline maps before leaving",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes early — CHF 52 per day booked ahead",
    "Pack both picnics from home; there is no kitchen after Corviglia",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 from Corviglia to the hut took under 4 h of moving time",
    "Dinner at the hut is one sitting at 18:30; half-board CHF 87 with hut tea",
    "The silk sleeping-bag liner is mandatory — bring one",
    "Leg Leget at 2,700 m is warm enough to swim — no inflow, no outlet",
    "The Bus Alpin shuttle (CHF 12) leaves Tigias at 15:08 and 17:08, meeting the :33 PostBus at Sur",
    "The Corviglia funicular is closed for summer 2026 — the Signal cable car chain works",
  ],

  bookingsRequired: ["Jenatschhütte (online or phone; beds before trains)", "SBB Saver fares"],
  bookingsAdvanceDays: 60,
  specialEquipment: [
    "hiking shoes",
    "30 L backpack",
    "2 L water capacity",
    "trekking poles",
    "sleeping-bag liner (mandatory at the hut)",
    "raincoat + warm layer",
    "sun protection",
    "CHF 150 cash in small notes",
    "offline maps + power bank",
  ],
  rentalEquipmentAvailable: false,
  permitsRequired: false,
  permitsInfo: "",

  budgetLevel: "moderate",
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 245, max: 420 },
  costBreakdown: { _type: "costBreakdown", accommodation: 87, food: 30, transport: 130, activities: 0 },

  accommodationType: "mountain_hut",
  journeyStyle: "self_guided",
  journeyCategory: { _ref: "category-journey-weekend", _type: "reference" },
  activityCategory: { _ref: "category-activity-outdoor-hiking", _type: "reference" },
  routeMode: "hiking",
  timeOfDay: "multi_day",
  weatherDependent: true,
  snowSeasonAccessible: false,
  wheelchairAccessible: false,
  carRequired: false,
  fourByFourRequired: false,
  publicTransportAccessible: true,
  transportationRequired: ["train", "bus"],
  transportationDifficulty: "moderate",
  nearestCity: "St. Moritz",
  nearestCityDistanceKm: 0,

  bestSeasons: ["summer"],
  bestMonths: [7, 8, 9],
  avoidMonths: [11, 12, 1, 2, 3, 4],

  destination: { _ref: "destination-switzerland", _type: "reference" },
  primaryCollection: { _ref: "collection-switzerland", _type: "reference" },
  allCollections: [
    { _key: "ch", _ref: "collection-switzerland", _type: "reference" },
    { _key: "we", _ref: "collection-weekend-trips", _type: "reference" },
    { _key: "hi", _ref: "collection-hiking", _type: "reference" },
    { _key: "apt", _ref: "collection-alpine-passes-trail", _type: "reference" },
    { _key: "md", _ref: "collection-multi-day-hikes", _type: "reference" },
  ],
  regions: ["Graubünden", "Engadin", "Parc Ela"],
  coordinates: { _type: "geopoint", lat: 46.515, lng: 9.74 },
  mapZoom: 12,
  startingPoint: {
    _type: "startingPoint",
    name: "St. Moritz",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.498021, lng: 9.845944 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Alp Flix",
    type: "landmark",
    coordinates: { _type: "geopoint", lat: 46.521625, lng: 9.655481 },
  },
  routeStops: [
    {
      _key: "jenatsch", _type: "routeStop", name: "Chamanna Jenatsch (Jenatschhütte)", type: "landmark",
      coordinates: { _type: "geopoint", lat: 46.529356, lng: 9.72446 },
    },
  ],
  routePoints: [
    { _key: "stmoritz", _type: "routePoint", name: "St. Moritz", type: "start", coordinates: { _type: "geopoint", lat: 46.498021, lng: 9.845944 } },
    { _key: "corviglia", _type: "routePoint", name: "Corviglia", type: "highlight", coordinates: { _type: "geopoint", lat: 46.508007, lng: 9.818531 } },
    { _key: "suvretta", _type: "routePoint", name: "Fuorcla Suvretta", type: "highlight", coordinates: { _type: "geopoint", lat: 46.510441, lng: 9.755516 } },
    { _key: "jenatsch", _type: "routePoint", name: "Jenatschhütte", type: "stop", coordinates: { _type: "geopoint", lat: 46.529356, lng: 9.72446 } },
    { _key: "agnel", _type: "routePoint", name: "Fuorcla d'Agnel", type: "highlight", coordinates: { _type: "geopoint", lat: 46.510327, lng: 9.714855 } },
    { _key: "alpflix", _type: "routePoint", name: "Alp Flix", type: "end", coordinates: { _type: "geopoint", lat: 46.521625, lng: 9.655481 } },
  ],
  trackLine,

  activityTags: [
    "alpine pass", "two-day hike", "Alpine Passes Trail", "Fuorcla Suvretta",
    "Jenatschhütte", "Engadin", "Parc Ela", "Swiss Alps hiking",
  ],
  keywords: [
    "St. Moritz", "Alp Flix", "Jenatschhütte", "Alpine Passes Trail", "Fuorcla Suvretta",
    "Stage 1", "Stage 2", "Switzerland hiking", "2-day hike", "Graubünden hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "Swiss hut night hikes",
    "highest hut Graubünden", "Engadin multi-day hikes",
  ],
  searchSynonyms: [
    "Alpenpässe-Weg", "Alpine Pass Way", "Chamanna Jenatsch", "Suvretta pass hike", "Val Bever hike", "Parc Ela hike",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "St. Moritz to Alp Flix hike",
    "Jenatschhütte hike",
    "Fuorcla Suvretta hike Switzerland",
    "weekend hike Switzerland Graubünden",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 1-2", "St. Moritz to Alp Flix traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — including the 2026 Corviglia funicular workaround",
    "Overnight plan for the Jenatschhütte with backups on both sides of the passes",
    "Full route map with numbered waypoints and elevation profiles",
    "Pack list, full cost breakdown, and reservations checklist with QR codes",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "sbb", _ref: "Hzb255FjNE6NXKMTm7u2wU", _type: "reference" },
    { _key: "mob", _ref: "Hzb255FjNE6NXKMTm7u30j", _type: "reference" },
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
  ],
  similarStories: [
    { _key: "hut", _ref: "story-st-moritz-alp-flix-hut-behind-corviglia", _type: "reference" },
    { _key: "gev", _ref: "story-grimentz-to-evolene", _type: "reference" },
  ],

  featuredInHomepage: false,
  featuredPriority: 5,

  guide: {
    _type: "guide",
    hasGuide: true,
    status: "available",
    format: ["PDF"],
    pricingTier: { _ref: "pricingTier-weekend-trip", _type: "reference" },
    customPrices: [
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 9 },
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 9 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 11 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 9 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
  },
};

const res = await client.createOrReplace(doc);
console.log("created", res._id);

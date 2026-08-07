// One-shot: create the Grimentz to Evolène weekend-guide story doc
// (Alpine Passes Trail stages 24+25), modeled on create-gruben-grimentz-guide.mjs.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-grimentz-evolene-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\b935c781-5f92-4220-9d07-1ec2ee84204d\scratchpad\guide-assets-gev`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-24-25-grimentz-to-evolene\final\TestedRoutes-Grimentz-Evolene-Weekend-Hike.pdf`;

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
  "20260802_123758.jpg",
  "The Cabane des Becs de Bosson at 2,985 m, the highest point on the Alpine Passes Trail and the Day 1 overnight",
);
const gallery = [];
const galleryDefs = [
  ["20260802_110053.jpg", "The turquoise Lac de Lona on the high plateau below the Pas de Lona"],
  ["20260802_112814.jpg", "Looking back across the Lona plateau toward the Val d'Anniviers on the Day 1 climb"],
  ["20260802_123900.jpg", "At the signpost on the Col des Becs de Bosson, the high point of the route"],
  ["20260802_132337.jpg", "Hérens fighting cows grazing at Alp L'A Vieille on the Day 2 descent"],
  ["20260802_130726.jpg", "The Val d'Hérens opening below the Pas de Lona at the start of Day 2"],
  ["20260802_143631.jpg", "Evolène's old street below the church, the end of the route"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Grimentz-Evolene-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-grimentz-to-evolene",
  _type: "story",
  title: "Grimentz to Evolène",
  slug: { _type: "slug", current: "grimentz-to-evolene" },
  storyId: "switzerland-grimentz-evolene-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-07",
  lastUpdated: "2026-08-07",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2026-08-02",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "Two days over the 2,787 m Pas de Lona with one night at 2,985 m, the highest point of the whole Alpine Passes Trail, then a valley-long descent into Evolène.",
  metaTitle: "Grimentz to Evolène: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 24 and 25): one long climb over the Pas de Lona, a night at the 2,985 m Cabane des Becs de Bosson, then down the Val d'Hérens to Evolène, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Grimentz to Evolène"),
    P("b2", "From Grimentz the trail does one thing: up."),
    P("b3", "Past the top lift station the crowds stop, and they stay stopped. The path keeps climbing to a plateau with a lake on it, glaciers stacked behind, marmots complaining somewhere ahead. At the Pas de Lona, 2,787 metres, the turquoise Lac de Lona appears below and the last half hour turns serious: chains, wet rock, careful feet. That spur is where the T3 grade comes from, and it ends at the Cabane des Becs de Bosson at 2,985 metres, the highest point on the entire Alpine Passes Trail. Higher than every pass on it."),
    P("b4", "Almost nobody sleeps up there, which is the whole reason to. Three things we learned in person: pay cash, the card fee is three francs. Do not plan to charge anything at lunch, the sockets only run in the evening. Order the raclette."),
    P("b5", "Next morning you cross back over the pass into a different valley and a different language, and give away 1,642 metres into the Val d'Hérens: loose rock first, then pasture where Hérens fighting cows graze beside a tiny chapel and a buvette sells alpage cheese, then forest, then the old street of Evolène with glaciers standing over it."),
    P("b6", "There is a gondola out of Grimentz that removes the first 540 metres. Using it is a reasonable decision and it changes the day from demanding to pleasant. We walked past it, which is a less reasonable decision, and the plateau at the top was worth every metre of it."),
    P("b7", "Twenty-one kilometres sounds modest. The climb is 1,438 metres in one go and the descent gives all of it back."),
    P("b8", "21 km. 1,475 m of climbing. T3. One night at 2,985 m."),
  ],

  whatMakesThisSpecial:
    "Dinner and sunrise at 2,985 m in the Cabane des Becs de Bosson, the highest point of the entire 43-stage Alpine Passes Trail, a hut almost nobody sleeps in.",
  highlights: [
    "One night at the Cabane des Becs de Bosson, 2,985 m — the highest point of the whole trail",
    "The turquoise Lac de Lona appearing below the 2,787 m Pas de Lona",
    "The Lona plateau — marmots ahead, the Weisshorn stacked behind",
    "Hérens fighting cows and alpage cheese at Alp L'A Vieille",
    "Evolène — old larch houses and glaciers standing over the street",
  ],
  whyThisTrip: [
    "Two stages of the Alpine Passes Trail in a single weekend",
    "The highest sleep on the entire trail, above every one of its passes",
    "One clean shape: one long climb up, one valley-long descent down",
    "A finish in one of the prettiest villages in Romandy",
  ],
  uniqueSellingPoints: [
    "The highest point of the Alpine Passes Trail, slept in rather than walked past",
    "A 2,985 m hut night that most walkers skip — dinner at altitude, sunrise included",
    "Two valleys and two dialects joined by one 2,787 m pass",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "An optional gondola takes 540 m off the climb without changing the route",
  ],
  whoThisIsFor: [
    "Comfortable walking five hours with a single sustained climb",
    "Walkers who would rather have one big climb than two medium ones",
    "Wanting a hut night that is not a formality",
    "Prefer self-guided independent travel",
  ],
  notSuitableIf: [
    "You need a bail-out above mid-mountain — above the gondola there is no lift down",
    "You need privacy to sleep: the hut is dormitory bunks",
    "Forecast is unstable — there is no shelter above Bendolla",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If you need a bail-out — above the gondola there is no lift down",
    "If you need privacy to sleep — the hut is dormitory bunks",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~9 h walking · ~1,475 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,985 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + bus, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "A night at the highest point of the trail" },
  ],
  durationDays: 2,
  durationHours: 9,
  durationDisplay: "2 days, ~9 h walking total",
  totalDistanceKm: 21,
  elevationGainM: 1475,
  maxAltitudeM: 2985,
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
    "T3 mountain hiking — a chained spur below the hut, slick when wet",
    "Highest point 2,985 m at the Cabane des Becs de Bosson",
    "21 km / 1,475 m ascent over 2 days",
    "No tap water above Bendolla — the hut sells bottled only",
  ],
  difficultyFactors: [
    "The Day 1 climb is 1,438 m in one go, with no lift out above Bendolla",
    "The T3 grade comes from the chained spur below the hut: rock that is slick when wet",
    "Day 2 gives away 1,642 m into the Val d'Hérens — poles matter",
    "Snow can sit around the Pas de Lona into early July",
    "The trip ends on a fixed Sunday bus: the 19:48 out of Evolène is the last",
  ],
  commonMistakes: [
    "Booking train tickets before the hut — no hut, no trip",
    "Carrying too little cash: the hut charges CHF 3 per card payment",
    "Not refilling at Bendolla, the last tap on the route",
    "Starting the climb after 10:15 — there is no shelter above Bendolla once storms build",
    "Missing the 17:48 out of Evolène and discovering the 19:48 is the last bus",
  ],
  insiderTips: [
    "Book the hut first, 2 months ahead — email or phone, no online booking",
    "Buy Day 2's water at dinner; the sockets are live at dinner only, so charge at the table",
    "Order the raclette at the hut — and pay cash in small notes",
    "The Bendolla gondola (CHF 16) cuts the first 540 m without changing the route",
    "Signal is patchy above the treeline in both valleys — download offline maps before leaving",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes early — booking ahead is worth ~CHF 150 per person",
    "Pack both picnics from home; there is no kitchen on the route after Bendolla",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 from Grimentz to the hut took around 5 h of walking, arriving around 16:30",
    "Day 2 from the hut down to Evolène took around 4 h of walking",
    "Dinner at the hut is one sitting at 19:00; sockets run at dinner only",
    "Card payments at the hut carry a CHF 3 fee — cash is the way",
    "The hut is guarded from 20 June to 4 October and fills on fine weekends",
    "The 17:48 PostBus from Evolène, village is the one to aim for; the 19:48 is the last",
  ],

  bookingsRequired: ["Cabane des Becs de Bosson (2 months ahead, email or phone)", "SBB Saver fares"],
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
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 240, max: 390 },
  costBreakdown: { _type: "costBreakdown", accommodation: 77, food: 30, transport: 130, activities: 0 },

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
  nearestCity: "Sierre",
  nearestCityDistanceKm: 12,

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
  regions: ["Valais", "Val d'Anniviers", "Val d'Hérens"],
  coordinates: { _type: "geopoint", lat: 46.155, lng: 7.52 },
  mapZoom: 12,
  startingPoint: {
    _type: "startingPoint",
    name: "Grimentz",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.175635, lng: 7.573951 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Evolène",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.112885, lng: 7.495596 },
  },
  routeStops: [
    {
      _key: "becsdebosson", _type: "routeStop", name: "Cabane des Becs de Bosson", type: "landmark",
      coordinates: { _type: "geopoint", lat: 46.164065, lng: 7.516415 },
    },
  ],
  routePoints: [
    { _key: "grimentz", _type: "routePoint", name: "Grimentz", type: "start", coordinates: { _type: "geopoint", lat: 46.175635, lng: 7.573951 } },
    { _key: "bendolla", _type: "routePoint", name: "Bendolla", type: "highlight", coordinates: { _type: "geopoint", lat: 46.180629, lng: 7.557956 } },
    { _key: "pasdelona", _type: "routePoint", name: "Pas de Lona", type: "highlight", coordinates: { _type: "geopoint", lat: 46.155751, lng: 7.519966 } },
    { _key: "becsdebosson", _type: "routePoint", name: "Cabane des Becs de Bosson", type: "stop", coordinates: { _type: "geopoint", lat: 46.164065, lng: 7.516415 } },
    { _key: "lavieille", _type: "routePoint", name: "Alp L'A Vieille", type: "highlight", coordinates: { _type: "geopoint", lat: 46.154445, lng: 7.495574 } },
    { _key: "evolene", _type: "routePoint", name: "Evolène", type: "end", coordinates: { _type: "geopoint", lat: 46.112885, lng: 7.495596 } },
  ],
  trackLine,

  activityTags: [
    "alpine pass", "two-day hike", "Alpine Passes Trail", "Pas de Lona",
    "Cabane des Becs de Bosson", "Val d'Anniviers", "Val d'Hérens", "Swiss Alps hiking",
  ],
  keywords: [
    "Grimentz", "Evolène", "Pas de Lona", "Alpine Passes Trail", "Cabane des Becs de Bosson",
    "Stage 24", "Stage 25", "Switzerland hiking", "2-day hike", "Valais hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "Swiss hut night hikes",
    "highest hut Alpine Passes Trail", "Valais multi-day hikes",
  ],
  searchSynonyms: [
    "Lona pass", "Alpenpässe-Weg", "Alpine Pass Way", "Becs de Bosson hut", "Anniviers hike", "Hérens valley hike",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "Grimentz to Evolène hike",
    "Pas de Lona hike Switzerland",
    "Cabane des Becs de Bosson hike",
    "weekend hike Switzerland Valais",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 24-25", "Grimentz to Evolène traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — trains, valley buses, and the Sunday bus out",
    "Overnight plan for the Cabane des Becs de Bosson with backups on both sides of the pass",
    "Full route map with numbered waypoints and elevation profiles",
    "Pack list, full cost breakdown, and reservations checklist with QR codes",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "sbb", _ref: "ZJfSH2y70QKCy4v2EHa7oG", _type: "reference" },
    { _key: "mob", _ref: "ZJfSH2y70QKCy4v2EHa7qH", _type: "reference" },
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
  ],
  similarStories: [
    { _key: "dinner", _ref: "story-grimentz-evolene-dinner-2985", _type: "reference" },
    { _key: "ggr", _ref: "story-gruben-to-grimentz", _type: "reference" },
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

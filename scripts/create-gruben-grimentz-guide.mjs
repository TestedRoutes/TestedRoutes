// One-shot: create the Gruben to Grimentz weekend-guide story doc
// (Alpine Passes Trail stages 22+23), modeled on create-saas-fee-gruben-guide.mjs.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-gruben-grimentz-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\1bfac99b-e676-4cba-89b7-3db4ec259de5\scratchpad\guide-assets-ggr`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-22-23-gruben-to-grimentz\final\TestedRoutes-Gruben-Grimentz-Weekend-Hike.pdf`;

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
  "20260801_122655.jpg",
  "The 1882 Hotel Weisshorn at 2,337 m above the Val d'Anniviers, the Day 1 overnight stop",
);
const gallery = [];
const galleryDefs = [
  ["20260801_063422.jpg", "Dawn alpenglow over Gruben in the Turtmanntal, the valley that empties every winter"],
  ["20260801_102355.jpg", "The Meidsee tarn below the Meidpass, the Day 1 lunch stop"],
  ["20260801_102906.jpg", "Hikers on the final loose-rock climb to the 2,789 m Meidpass"],
  ["20260801_135846.jpg", "The balcony trail above the Val d'Anniviers on the Sierre-Zinal race line"],
  ["20260801_165357.jpg", "Grimentz appearing below the larch forest on the Day 2 descent"],
  ["20260801_213324.jpg", "Grimentz granaries on staddle stones at dusk, the end of the route"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Gruben-Grimentz-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-gruben-to-grimentz",
  _type: "story",
  title: "Gruben to Grimentz",
  slug: { _type: "slug", current: "gruben-to-grimentz" },
  storyId: "switzerland-gruben-grimentz-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-06",
  lastUpdated: "2026-08-06",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2026-08-01",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "Two days from the valley that sleeps all winter to the geranium village of Grimentz, crossing the 2,789 m Meidpass. One night at the Hotel Weisshorn, 2,337 m.",
  metaTitle: "Gruben to Grimentz: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 22 and 23): over the 2,789 m Meidpass to the Hotel Weisshorn, then the Val d'Anniviers balcony into Grimentz, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Gruben to Grimentz"),
    P("b2", "Everyone spoke German at breakfast. By lunch, everyone spoke French."),
    P("b3", "The switch happens on the Meidpass at 2,789 metres, and it is abrupt enough to feel staged. Not a bilingual blur, not a slow drift. A line drawn across one ridge, with grüezi on one side and bonjour on the other."),
    P("b4", "You leave from the Turtmanntal, which empties completely every winter and runs four buses a day in summer, booked by telephone the evening before. The climb out is honest rather than hard: forest, then high pasture, then the tarn at Meidsee below the crest, then a stretch of loose rock to the pass. Nothing exposed, nothing chained. It is the reason this weekend grades T2 and the reason it is the one to hand somebody walking their first pass."),
    P("b5", "Standing on the far side is the Hotel Weisshorn: white, 1882, at 2,337 metres, visible for an hour before you reach it. Half the people on its terrace walked up from the valley purely to eat, which tells you what the kitchen is worth. The menu du jour runs to four courses and finishes with blueberry pie."),
    P("b6", "Day two is a balcony. An hour of gently rolling trail on the Sierre-Zinal race line, with the Zinalrothorn, the Dent Blanche and the tip of the Matterhorn arranged across the valley, then 1,130 metres down through larch into Ayer and along an old irrigation channel into Grimentz: geraniums on sun-blackened larch, granaries on staddle stones, a long lunch earned."),
    P("b7", "The gentlest of the three Valais weekends. Not the least beautiful."),
    P("b8", "23 km. 1,480 m of climbing. T2. One night at 2,337 m."),
  ],

  whatMakesThisSpecial:
    "The language changes from German to French on one 2,789 m pass crossing, and the night is spent at an 1882 hotel at 2,337 m famous for its blueberry pie.",
  highlights: [
    "The Meidpass at 2,789 m — grüezi on one side, bonjour on the other",
    "One night at the Hotel Weisshorn, an 1882 hotel at 2,337 m",
    "Four-course half-board dinner ending in the famous gâteau aux myrtilles",
    "The balcony trail facing the Weisshorn, Zinalrothorn, Dent Blanche and Matterhorn",
    "Grimentz — geraniums on sun-blackened larch and granaries on staddle stones",
  ],
  whyThisTrip: [
    "Two stages of the Alpine Passes Trail in a single weekend",
    "The gentlest of the three Valais weekend crossings — T2 the whole way",
    "A mountain-hotel night without hut bunks: real rooms at 2,337 m",
    "A finish in one of the prettiest old villages in Valais",
  ],
  uniqueSellingPoints: [
    "The German–French language line crossed on foot at 2,789 m",
    "An 1882 hotel at 2,337 m with a four-course dinner and blueberry pie",
    "The Sierre-Zinal race-line balcony facing four 4,000 m peaks",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "The way in is an adventure: a four-a-day valley bus booked by phone",
  ],
  whoThisIsFor: [
    "Comfortable walking five or six hours two days running",
    "Mixed-ability pairs — the climbs are honest rather than hard",
    "Walking their first alpine pass with a night in the mountains",
    "Prefer self-guided independent travel",
  ],
  notSuitableIf: [
    "Descents wreck your knees — Day 2 drops 1,130 m, half of it in one sustained hour",
    "You need flexibility getting in: the only way to Gruben is a four-a-day, phone-booked bus",
    "Forecast is unstable — there is no shelter on the pass",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If your knees hate descending — Day 2 does half its drop in one sustained hour",
    "If the forecast is unstable — there is no shelter on the Meidpass",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~11 h walking · ~1,480 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,791 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + bus, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "German to French in one pass crossing" },
  ],
  durationDays: 2,
  durationHours: 11,
  durationDisplay: "2 days, ~11 h walking total",
  totalDistanceKm: 23,
  elevationGainM: 1480,
  maxAltitudeM: 2791,
  overallLevel: "moderate",
  physicalFitnessRequired: "moderate",
  technicalSkillRequired: "basic",
  adrenalineLevel: 2,
  scenicRating: 5,
  crowdLevel: "low",
  beginnerFriendly: false,
  familyFriendly: false,
  soloFriendly: true,
  minAgeRecommended: 12,
  idealGroupSize: "1–4 people",
  idealFor: ["alpine hikers", "weekend adventurers", "mixed-ability pairs", "photographers"],
  bestForCrowdType: "active_explorers",

  difficultyAtAGlance: [
    "T2 mountain hiking — loose stone both sides of the pass, nothing chained",
    "Highest point 2,791 m at the Meidpass",
    "23 km / 1,480 m ascent over 2 days",
    "No hut, spring or shop on Day 1 between Gruben and the hotel",
  ],
  difficultyFactors: [
    "23 km with 1,480 m of ascent split across two honest days",
    "Steep loose stone on both sides of the 2,789 m Meidpass",
    "Day 2 gives away 1,130 m, half of it in one sustained hour of switchbacks",
    "Snow can sit on the Meidpass into early July",
    "The trip starts from a reservation-only valley bus with four departures a day",
  ],
  commonMistakes: [
    "Not phoning the Turtmanntal bus at least an hour before the 10:10",
    "Not booking the Hotel Weisshorn 2-3 months ahead",
    "Underestimating water needs on Day 1 — no refill between Gruben and the hotel",
    "Missing the Mission detour: the Ayer footbridge is out through 2026",
  ],
  insiderTips: [
    "Plan the whole weekend around the 10:10 valley bus — phone +41 27 932 15 50 at least 1 h ahead",
    "Carry 3 L of water on Day 1 — there is no hut, spring or shop before the hotel",
    "Save room at dinner: the gâteau aux myrtilles is the house specialty",
    "Avoid the Sierre-Zinal race weekend in early August — the mountain sells out",
    "Signal is patchy in the Turtmanntal — download offline maps before leaving",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes early — from CHF 52, and booking ahead is worth ~CHF 150 per person",
    "Pack both lunches from home; Gruben's shop is tiny",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 from Gruben over the Meidpass to the Hotel Weisshorn took around 6 h including breaks",
    "Day 2 along the balcony and down to Grimentz took around 5 h",
    "The Turtmanntal valley bus is phone-booked and paid in cash",
    "Half-board dinner at the Weisshorn is four courses at 19:30",
    "The Ayer footbridge is out: the trail detours to the road bridge at Mission through 2026",
    "The language on the trail switches from German to French at the Meidpass",
  ],

  bookingsRequired: ["Hotel Weisshorn (2-3 months ahead)", "Turtmanntal valley bus (by phone)", "SBB Saver fares"],
  bookingsAdvanceDays: 90,
  specialEquipment: [
    "hiking shoes",
    "30 L backpack",
    "3 L water capacity",
    "trekking poles",
    "raincoat + warm layer",
    "sun protection",
    "CHF 150 cash in small notes",
    "offline maps + power bank",
  ],
  rentalEquipmentAvailable: false,
  permitsRequired: false,
  permitsInfo: "",

  budgetLevel: "moderate",
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 302, max: 480 },
  costBreakdown: { _type: "costBreakdown", accommodation: 170, food: 30, transport: 102, activities: 0 },

  accommodationType: "hotel",
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
  transportationRequired: ["train", "bus", "cable_car"],
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
  regions: ["Valais", "Turtmanntal", "Val d'Anniviers"],
  coordinates: { _type: "geopoint", lat: 46.2, lng: 7.64 },
  mapZoom: 12,
  startingPoint: {
    _type: "startingPoint",
    name: "Gruben",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.211536, lng: 7.706014 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Grimentz",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.180295, lng: 7.573834 },
  },
  routeStops: [
    {
      _key: "weisshorn", _type: "routeStop", name: "Hotel Weisshorn", type: "landmark",
      coordinates: { _type: "geopoint", lat: 46.208286, lng: 7.617635 },
    },
  ],
  routePoints: [
    { _key: "gruben", _type: "routePoint", name: "Gruben", type: "start", coordinates: { _type: "geopoint", lat: 46.211536, lng: 7.706014 } },
    { _key: "meidsee", _type: "routePoint", name: "Meidsee", type: "highlight", coordinates: { _type: "geopoint", lat: 46.223559, lng: 7.673718 } },
    { _key: "meidpass", _type: "routePoint", name: "Meidpass", type: "highlight", coordinates: { _type: "geopoint", lat: 46.222898, lng: 7.661369 } },
    { _key: "weisshorn", _type: "routePoint", name: "Hotel Weisshorn", type: "stop", coordinates: { _type: "geopoint", lat: 46.208286, lng: 7.617635 } },
    { _key: "ayer", _type: "routePoint", name: "Ayer", type: "highlight", coordinates: { _type: "geopoint", lat: 46.178766, lng: 7.603268 } },
    { _key: "grimentz", _type: "routePoint", name: "Grimentz", type: "end", coordinates: { _type: "geopoint", lat: 46.180295, lng: 7.573834 } },
  ],
  trackLine,

  activityTags: [
    "alpine pass", "two-day hike", "Alpine Passes Trail", "Meidpass",
    "Hotel Weisshorn", "Val d'Anniviers", "Turtmanntal", "Swiss Alps hiking",
  ],
  keywords: [
    "Gruben", "Grimentz", "Meidpass", "Alpine Passes Trail", "Hotel Weisshorn",
    "Stage 22", "Stage 23", "Switzerland hiking", "2-day hike", "Valais hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "beginner alpine pass hikes",
    "Swiss mountain hotel hikes", "Valais multi-day hikes",
  ],
  searchSynonyms: [
    "Meid pass", "Alpenpässe-Weg", "Alpine Pass Way", "Turtmann valley", "Anniviers hike", "Weisshorn hotel hike",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "Gruben to Grimentz hike",
    "Meidpass hike Switzerland",
    "Hotel Weisshorn hike",
    "weekend hike Switzerland Valais",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 22-23", "Gruben to Grimentz traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — including the phone-booked valley bus in",
    "Overnight plan for the Hotel Weisshorn with backups on both sides of the pass",
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
    { _key: "lang", _ref: "story-gruben-grimentz-language-changes", _type: "reference" },
    { _key: "sfg", _ref: "story-saas-fee-to-gruben", _type: "reference" },
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

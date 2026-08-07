// One-shot: create the Alp Flix to Ausserferrera weekend-guide story doc
// (Alpine Passes Trail stages 3+4), modeled on create-st-moritz-alp-flix-guide.mjs.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-alp-flix-ausserferrera-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\fc3f6f3b-f071-436c-84da-4d2f6e0ae5f4\scratchpad\guide-assets-afa`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-3-4-alp-flix-to-ausserferrera\final\TestedRoutes-Alp-Flix-Ausserferrera-Weekend-Hike.pdf`;

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
  "20250802_121545.jpg",
  "The alp hamlet of Radons in Val Nandro on the Day 2 climb toward Pass da Schmorras",
);
const gallery = [];
const galleryDefs = [
  ["20250801_125609.jpg", "Berghaus Piz Platta on the Alp Flix plateau, the start of the route"],
  ["20250802_141550.jpg", "Cattle at the misty tarn below Pass da Schmorras"],
  ["20250802_152629.jpg", "Waterfalls on the descent from Alp Mos into the Ferrera valley"],
  ["20250802_140604.jpg", "The signpost on Pass da Schmorras at 2,566 m, the high point of the route"],
  ["20250802_162614.jpg", "Cresta and its listed church above Ausserferrera"],
  ["20250801_161705.jpg", "Reaching the Surses valley floor at the end of the Day 1 balcony"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Alp-Flix-Ausserferrera-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-alp-flix-to-ausserferrera",
  _type: "story",
  title: "Alp Flix to Ausserferrera",
  slug: { _type: "slug", current: "alp-flix-to-ausserferrera" },
  storyId: "switzerland-alp-flix-ausserferrera-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-07",
  lastUpdated: "2026-08-07",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2025-08-02",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "Two big days through Parc Ela: a balcony walk from the Alp Flix plateau down to Savognin, then the long, lonely crossing of the 2,566 m Pass da Schmorras into the Ferrera valley.",
  metaTitle: "Alp Flix to Ausserferrera: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 3 and 4): the Alp Flix balcony to Savognin, a village night, then 22 km over Pass da Schmorras to Ausserferrera, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Alp Flix to Ausserferrera"),
    P("b2", "Alp Flix empties fast once the day visitors turn back."),
    P("b3", "A shuttle bus lifts you to the plateau they call the Treasure Island of Biodiversity, and from the Furschela da Colm a balcony path curls for two hours below Pizza Grossa: marmots whistling, edelweiss in the rocks, bearded vultures riding the wind. Lunch is cheese plates and famous meringues at the Alp d'Err tavern, a converted stable at 2,178 metres. Then forest, then Savognin, the sunny capital of the Surses, and a hotel bed."),
    P("b4", "Day 2 is the longest, loneliest day of this section: 22 kilometres and 7.5 official hours. The gravel road up Val Schmorras seems endless, then meadows tilt up to the 2,566 m pass — Piz Grisch ahead like a volcano — and the descent to Alp Mos is faint enough that you watch for the paint marks. Waterfalls, a gorge, the hamlet of Cresta, and finally a drink at Gasthaus Edelweiss two minutes from the bus stop."),
    P("b5", "We crossed in a hailstorm and still rate it. Hardly anyone walks the second day. That is the point."),
    P("b6", "42 km. Two passes. One village night between them."),
  ],

  whatMakesThisSpecial:
    "The loneliest big day of the early Alpine Passes Trail: 22 km over Pass da Schmorras, book-ended by the Alp Flix balcony and a tavern lunch of alp cheese and meringues.",
  highlights: [
    "The balcony path below Pizza Grossa, high above the Surses",
    "Lunch at the Alp d'Err tavern, 2,178 m — cheese plates and famous meringues",
    "Pass da Schmorras, 2,566 m, with Piz Grisch rising like a volcano",
    "The waterfall descent past Alp Mos into the Ferrera valley",
    "Alp Flix, the moorland plateau they call the Treasure Island of Biodiversity",
  ],
  whyThisTrip: [
    "Stages 3 and 4 of the Alpine Passes Trail in a single weekend",
    "A genuine village night in Savognin between two mountain days",
    "The emptiest stage of the section — you will likely have the pass to yourselves",
    "Continues seamlessly from the St. Moritz to Alp Flix weekend",
  ],
  uniqueSellingPoints: [
    "A 22 km crossing that almost nobody walks, fully mapped with turnback points",
    "The only kitchen on each day named, tested, and pinned",
    "The 2026 Cresta trail diversion already built into the plan",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "A hotel night, not a dorm — privacy between two big days",
  ],
  whoThisIsFor: [
    "Comfortable with a 7-plus-hour day at a steady pace",
    "Walkers who prefer empty trails over famous ones",
    "Happy to start Day 2 at first light",
    "Prefer self-guided independent travel",
  ],
  notSuitableIf: [
    "You want short days — Day 2 is 22 km with no shortcut",
    "You need a bail-out beyond Radons: past it the only ways off are forward or back",
    "Forecast is unstable — the Schmorras crossing has no shelter",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If you want short days — Day 2 is 22 km with no shortcut",
    "If you need a mid-stage bail-out — past Radons it is forward or back",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~14 h walking · ~2,168 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,566 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + bus, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "The loneliest 22 km of the early trail" },
  ],
  durationDays: 2,
  durationHours: 14,
  durationDisplay: "2 days, ~14 h walking total",
  totalDistanceKm: 42,
  elevationGainM: 2168,
  maxAltitudeM: 2566,
  overallLevel: "hard",
  physicalFitnessRequired: "high",
  technicalSkillRequired: "basic",
  adrenalineLevel: 2,
  scenicRating: 4,
  crowdLevel: "low",
  beginnerFriendly: false,
  familyFriendly: false,
  soloFriendly: true,
  minAgeRecommended: 12,
  idealGroupSize: "1–4 people",
  idealFor: ["alpine hikers", "weekend adventurers", "solitude seekers", "long-distance walkers"],
  bestForCrowdType: "active_explorers",

  difficultyAtAGlance: [
    "T2 mountain hiking — good paths, never exposed; the difficulty is length",
    "Highest point 2,566 m at Pass da Schmorras",
    "42 km / 2,168 m ascent over 2 days — Day 2 alone is 22 km",
    "Alp d'Err (Day 1) and Radons (Day 2) are the only kitchens en route",
  ],
  difficultyFactors: [
    "Day 2 is 22 km with 1,411 m of ascent and an official time of 7.5 hours",
    "The descent off Pass da Schmorras is faint in places — watch the paint marks",
    "Cresta–Alp Sut Fuina runs on a signposted diversion through 30 Oct 2026",
    "Snow can sit at the Schmorras into late June",
    "The trip ends on a fixed bus: the 18:48 out of Ausserferrera is the last",
  ],
  commonMistakes: [
    "Underestimating Day 2 — walking by 07:00 is what keeps the 16:28 bus honest",
    "Relying on Volg Savognin on Sunday — it is closed; carry both picnics",
    "Missing the last shuttle up to Alp Flix and adding 250 m of climb from Sur",
    "Not refilling at Radons — after it there is nothing until Ausserferrera",
    "Following old maps on the last hour instead of the yellow diversion markers",
  ],
  insiderTips: [
    "Book Savognin a few weeks ahead and ask for the earliest breakfast at check-in",
    "The 09:50 Bus Alpin from Sur meets the 07:07 train from Zürich — CHF 12, no booking needed",
    "Order the meringues at Alp d'Err — and refill your bottles there",
    "Turn back at Radons if the pass is past 13:00 — it has beds and a kitchen",
    "Signal is patchy in Val Schmorras and the Ferrera valley — download offline maps",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes early — CHF 52 per day booked ahead",
    "Pack both picnics from home; Sunday shops do not exist on this route",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 from Tigias to Savognin is 20 km with one 500 m climb over the Furschela da Colm",
    "Alp d'Err charges CHF 90 half-board and has 16 beds — the Day 1 safety valve",
    "Berghuus Radons is open daily 08:00–22:00 in season, the last kitchen before the pass",
    "The Cresta descent diversion is signposted on site (validated closure to 30 Oct 2026)",
    "PostBus 552: 16:28 is the one to aim for; the 18:48 is the last, then only phone-booked night runs",
    "We crossed Pass da Schmorras in hail — the faint descent is findable, but slowly",
  ],

  bookingsRequired: ["Hotel in Savognin (a few weeks ahead)", "SBB Saver fares"],
  bookingsAdvanceDays: 21,
  specialEquipment: [
    "hiking shoes",
    "30 L backpack",
    "2 L water capacity",
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
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 260, max: 435 },
  costBreakdown: { _type: "costBreakdown", accommodation: 80, food: 65, transport: 128, activities: 0 },

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
  transportationRequired: ["train", "bus"],
  transportationDifficulty: "moderate",
  nearestCity: "Thusis",
  nearestCityDistanceKm: 20,

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
  regions: ["Graubünden", "Parc Ela", "Surses", "Val Ferrera"],
  coordinates: { _type: "geopoint", lat: 46.56, lng: 9.55 },
  mapZoom: 11,
  startingPoint: {
    _type: "startingPoint",
    name: "Alp Flix",
    type: "landmark",
    coordinates: { _type: "geopoint", lat: 46.521625, lng: 9.655481 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Ausserferrera",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.55657, lng: 9.43934 },
  },
  routeStops: [
    {
      _key: "savognin", _type: "routeStop", name: "Savognin", type: "town",
      coordinates: { _type: "geopoint", lat: 46.5948, lng: 9.59381 },
    },
  ],
  routePoints: [
    { _key: "alpflix", _type: "routePoint", name: "Alp Flix", type: "start", coordinates: { _type: "geopoint", lat: 46.521625, lng: 9.655481 } },
    { _key: "colm", _type: "routePoint", name: "Furschela da Colm", type: "highlight", coordinates: { _type: "geopoint", lat: 46.555433, lng: 9.659785 } },
    { _key: "alpderr", _type: "routePoint", name: "Alp d'Err", type: "highlight", coordinates: { _type: "geopoint", lat: 46.571728, lng: 9.693099 } },
    { _key: "savognin", _type: "routePoint", name: "Savognin", type: "stop", coordinates: { _type: "geopoint", lat: 46.5948, lng: 9.59381 } },
    { _key: "schmorras", _type: "routePoint", name: "Pass da Schmorras", type: "highlight", coordinates: { _type: "geopoint", lat: 46.553847, lng: 9.498854 } },
    { _key: "ausserferrera", _type: "routePoint", name: "Ausserferrera", type: "end", coordinates: { _type: "geopoint", lat: 46.55657, lng: 9.43934 } },
  ],
  trackLine,

  activityTags: [
    "alpine pass", "two-day hike", "Alpine Passes Trail", "Pass da Schmorras",
    "Alp Flix", "Parc Ela", "Val Ferrera", "Swiss Alps hiking",
  ],
  keywords: [
    "Alp Flix", "Ausserferrera", "Savognin", "Pass da Schmorras", "Alpine Passes Trail",
    "Stage 3", "Stage 4", "Switzerland hiking", "2-day hike", "Graubünden hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "Parc Ela hikes",
    "empty trails Switzerland", "Graubünden multi-day hikes",
  ],
  searchSynonyms: [
    "Alpenpässe-Weg", "Alpine Pass Way", "Schmorras pass", "Surses hike", "Ferrera valley hike", "Alp d'Err",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "Alp Flix to Savognin hike",
    "Pass da Schmorras hike",
    "Savognin to Ausserferrera hike",
    "weekend hike Switzerland Graubünden",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 3-4", "Alp Flix to Ausserferrera traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — trains, the Alp Flix shuttle, and the last bus out",
    "Savognin overnight plan with backups, plus the Alp d'Err and Radons safety valves",
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
    { _key: "hail", _ref: "story-alp-flix-ausserferrera-hail-pass", _type: "reference" },
    { _key: "sma", _ref: "story-st-moritz-to-alp-flix", _type: "reference" },
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

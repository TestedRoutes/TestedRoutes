// One-shot: create the Ausserferrera to Turra weekend-guide story doc
// (Alpine Passes Trail stages 5+6), modeled on create-alp-flix-ausserferrera-guide.mjs.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-ausserferrera-turra-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\fc3f6f3b-f071-436c-84da-4d2f6e0ae5f4\scratchpad\guide-assets-atu`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-5-6-ausserferrera-to-turra\final\TestedRoutes-Ausserferrera-Turra-Weekend-Hike.pdf`;

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
  "20250629_122106.jpg",
  "The waterfall wall above the Safiental on the descent from the Safierberg",
);
const gallery = [];
const galleryDefs = [
  ["20250803_121454.jpg", "Arriving in Splügen, the Wakker-Prize pass village, at the end of Day 1"],
  ["20250803_111744.jpg", "Lake Sufers glittering below the trail on the last hour into Splügen"],
  ["20250629_112235.jpg", "At the Safierberg signpost, 2,486 m, the lonely pass into the Safiental"],
  ["20250803_122907.jpg", "A swim in the Hinterrhein at Splügen after Day 1"],
  ["20250803_102432.jpg", "The turquoise Suretta stream in the forest above Ausserferrera"],
  ["20250629_113213.jpg", "The empty upper Safiental unrolling below the pass on Day 2"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Ausserferrera-Turra-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-ausserferrera-to-turra",
  _type: "story",
  title: "Ausserferrera to Turra",
  slug: { _type: "slug", current: "ausserferrera-to-turra" },
  storyId: "switzerland-ausserferrera-turra-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-07",
  lastUpdated: "2026-08-07",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2025-08-03",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "Two quiet days: the steep secret stage out of the Ferrera valley to Splügen, a night in a 1722 pass inn, then over the lonely 2,486 m Safierberg into the Safiental.",
  metaTitle: "Ausserferrera to Turra: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 5 and 6): Ausserferrera to Splügen past Lake Sufers, a night at the historic Hotel Bodenhaus, then the Safierberg crossing to Turrahus, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Ausserferrera to Turra"),
    P("b2", "Stage 5 is the stage nobody talks about."),
    P("b3", "It starts with the crux: 550 metres of steep forest climb out of Ausserferrera, past the Magic Wood boulders, where the game trails lie and the marked path is the one to trust. Then the day flows — silver-thistle alps just over 2,000 metres, Piz Grisch behind, the Teurihorn ahead, an old wooden bridge over the turquoise Suretta, and Lake Sufers glittering below the last hour into Splügen, a Wakker-Prize village of Walser wood and Italianate stone."),
    P("b4", "The night is the treat: the Hotel Bodenhaus, a 1722 trading inn on the square with Einstein and Nietzsche in the guestbook — renovated in 2025, pool and sauna included. We swam in the Hinterrhein instead. Both work."),
    P("b5", "Day 2 climbs 1,000 metres straight out of the lanes to the Safierberg at 2,486 metres, the lonely pass between Rheinwald and Safiental. Ibex silhouettes on the Alperschällihora, zig-zags down to the young Rabiusa, and softening pastures to the Turrahus, a 300-year-old Walser inn at the road-end where the bus leaves from the door."),
    P("b6", "No reservation needed for that bus, whatever the folklore says — we checked the timetable so you don't have to."),
    P("b7", "26 km. One pass. Two of Graubünden's quietest valleys."),
  ],

  whatMakesThisSpecial:
    "The emptiest weekend of the early Alpine Passes Trail: a secret stage, a 1722 pass inn with a pool, and the lonely Safierberg crossing into the roadless-feeling Safiental.",
  highlights: [
    "The Safierberg, 2,486 m — the lonely pass between Rheinwald and Safiental",
    "A night at the Hotel Bodenhaus, the 1722 pass inn on Splügen's square",
    "Lake Sufers glittering below the last hour of Day 1",
    "The turquoise Suretta stream and the Magic Wood boulders",
    "The Turrahus, a 300-year-old Walser inn at the road-end of the valley",
  ],
  whyThisTrip: [
    "Stages 5 and 6 of the Alpine Passes Trail in a single weekend",
    "A historic pass-village night with a pool between two honest mountain days",
    "Two valleys most Swiss hikers have never walked",
    "Completes the first six stages when paired with the two sibling weekends",
  ],
  uniqueSellingPoints: [
    "The 'stage nobody talks about', tested and mapped with turnback points",
    "A 1722 inn with Einstein in the guestbook as the overnight",
    "The Safiental bus folklore resolved: no seat reservation needed, timetable pinned",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "Splügen bailout buses until 21:09 make Day 2 low-risk to attempt",
  ],
  whoThisIsFor: [
    "Comfortable with blunt 500-1,000 m climbs at a steady pace",
    "Walkers who prefer empty trails over famous ones",
    "Wanting a proper hotel night, not a dorm",
    "Prefer self-guided independent travel",
  ],
  notSuitableIf: [
    "You need a mid-stage bail-out — past Stutzalp the only ways off the pass are forward or back",
    "Forecast is unstable — there is no shelter above Stutzalp",
    "Snowfields worry you — they can sit on stage 5's high sections into midsummer",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If you need a mid-stage bail-out — past Stutzalp it is forward or back",
    "If unstable forecasts unsettle you — there is no shelter above Stutzalp",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~10 h walking · ~1,963 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,486 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + bus, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "The lonely Safierberg crossing" },
  ],
  durationDays: 2,
  durationHours: 10,
  durationDisplay: "2 days, ~10 h walking total",
  totalDistanceKm: 26,
  elevationGainM: 1963,
  maxAltitudeM: 2486,
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
  idealFor: ["alpine hikers", "weekend adventurers", "solitude seekers", "history lovers"],
  bestForCrowdType: "active_explorers",

  difficultyAtAGlance: [
    "T2 mountain hiking — steep and rough in places, never exposed",
    "Highest point 2,486 m at the Safierberg",
    "26 km / 1,963 m ascent over 2 days",
    "No kitchen on stage 5 and none over the Safierberg — carry 2 L each day",
  ],
  difficultyFactors: [
    "The climbs are blunt: 550 m out of the Ferrera forest, 1,000 m straight from Splügen",
    "The Safierberg descent zig-zags on loose ground — poles out",
    "Snowfields can sit on stage 5's high sections into midsummer",
    "Livestock guardian dogs work the Safiental alps",
    "The trip ends on a fixed bus: the 19:32 out of Turrahus is the last",
  ],
  commonMistakes: [
    "Following game trails on the Nursera climb instead of the marked path",
    "Skipping the Volg run in Splügen — there is nothing to buy over the pass",
    "Believing the reservation folklore and not just boarding the Safiental bus",
    "Starting Day 2 late — past 13:30 and not on the pass means turning back",
    "Missing the 17:38 and not knowing the 19:32 still gets you to Zürich by 22:22",
  ],
  insiderTips: [
    "Book the Bodenhaus a few weeks ahead — and pack swimwear for the pool",
    "Volg Splügen is open daily 07:00-19:00, steps from the hotel — Day 2's picnic sorted",
    "Cake on the Turrahus terrace while you wait: the bus leaves from the door",
    "The optional Wanderbus to Alp Stutz (reservation) cuts ~460 m of the Day 2 climb",
    "Signal is patchy in the Ferrera valley and upper Safiental — download offline maps",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes early — CHF 52 per day booked ahead",
    "Pack Day 1's picnic from home and buy Day 2's at Volg Splügen",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 took ~4 h moving time; the 550 m Nursera climb is the crux",
    "We swam in the Hinterrhein at Splügen — cold, brilliant, optional",
    "The Bodenhaus reopened in 2025 after renovation, with pool and sauna",
    "PostBus 401 needs no seat reservation — that rule is for bikes only",
    "Sunday buses from Turrahus: 13:38, 15:38, 17:38 and a late 19:32 (Zürich by 22:22)",
    "Splügen bailout buses toward Chur run until 21:09 on Sundays",
  ],

  bookingsRequired: ["Hotel Bodenhaus, Splügen (a few weeks ahead)", "SBB Saver fares"],
  bookingsAdvanceDays: 21,
  specialEquipment: [
    "hiking shoes",
    "30 L backpack",
    "2 L water capacity",
    "trekking poles",
    "raincoat + warm layer",
    "sun protection",
    "swimwear (the Bodenhaus has a pool)",
    "CHF 150 cash in small notes",
    "offline maps + power bank",
  ],
  rentalEquipmentAvailable: false,
  permitsRequired: false,
  permitsInfo: "",

  budgetLevel: "moderate",
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 285, max: 460 },
  costBreakdown: { _type: "costBreakdown", accommodation: 115, food: 65, transport: 104, activities: 0 },

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
  nearestCity: "Chur",
  nearestCityDistanceKm: 40,

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
  regions: ["Graubünden", "Val Ferrera", "Rheinwald", "Safiental"],
  coordinates: { _type: "geopoint", lat: 46.57, lng: 9.3 },
  mapZoom: 11,
  startingPoint: {
    _type: "startingPoint",
    name: "Ausserferrera",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.55657, lng: 9.43934 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Turrahus",
    type: "landmark",
    coordinates: { _type: "geopoint", lat: 46.62466, lng: 9.275965 },
  },
  routeStops: [
    {
      _key: "spluegen", _type: "routeStop", name: "Splügen", type: "town",
      coordinates: { _type: "geopoint", lat: 46.55433, lng: 9.32262 },
    },
  ],
  routePoints: [
    { _key: "ausserferrera", _type: "routePoint", name: "Ausserferrera", type: "start", coordinates: { _type: "geopoint", lat: 46.55657, lng: 9.43934 } },
    { _key: "nursera", _type: "routePoint", name: "Alp Nursera", type: "highlight", coordinates: { _type: "geopoint", lat: 46.556587, lng: 9.422202 } },
    { _key: "spluegen", _type: "routePoint", name: "Splügen", type: "stop", coordinates: { _type: "geopoint", lat: 46.55433, lng: 9.32262 } },
    { _key: "safierberg", _type: "routePoint", name: "Safierberg", type: "highlight", coordinates: { _type: "geopoint", lat: 46.578345, lng: 9.264791 } },
    { _key: "turrahus", _type: "routePoint", name: "Turrahus", type: "end", coordinates: { _type: "geopoint", lat: 46.62466, lng: 9.275965 } },
  ],
  trackLine,

  activityTags: [
    "alpine pass", "two-day hike", "Alpine Passes Trail", "Safierberg",
    "Splügen", "Safiental", "Val Ferrera", "Swiss Alps hiking",
  ],
  keywords: [
    "Ausserferrera", "Splügen", "Turrahus", "Safierberg", "Alpine Passes Trail",
    "Stage 5", "Stage 6", "Switzerland hiking", "2-day hike", "Graubünden hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "Safiental hikes",
    "empty trails Switzerland", "Graubünden multi-day hikes",
  ],
  searchSynonyms: [
    "Alpenpässe-Weg", "Alpine Pass Way", "Safier Berg", "Rheinwald hike", "Splügen pass village", "Turra",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "Ausserferrera to Splügen hike",
    "Safierberg hike",
    "Splügen to Safiental hike",
    "weekend hike Switzerland Graubünden",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 5-6", "Ausserferrera to Turrahus traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — trains, valley buses, and the Safiental bus out",
    "Splügen overnight plan with backups, plus the Turrahus safety valve at the finish",
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
    { _key: "nobody", _ref: "story-ausserferrera-splugen-stage-nobody-wanted", _type: "reference" },
    { _key: "afa", _ref: "story-alp-flix-to-ausserferrera", _type: "reference" },
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

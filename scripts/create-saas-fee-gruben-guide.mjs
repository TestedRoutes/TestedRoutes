// One-shot: create the Saas Fee to Gruben weekend-guide story doc
// (Alpine Passes Trail stages 20+21), modeled on story-simplon-pass-to-saas-fee.
// Uploads hero + gallery photos and the PDF, then client.createOrReplace.
// Usage: node --env-file=.env.local scripts/create-saas-fee-gruben-guide.mjs
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\fc3c2a91-8f1a-4a78-8e1f-918efd0418e7\scratchpad\guide-assets`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\switzerland\guides\APT-20-21-saas-fee-to-gruben\final\TestedRoutes-Saas-Fee-Gruben-Weekend-Hike.pdf`;

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
  "20260730_105208.jpg",
  "Hiker on the wire-rope secured ledge of the Alpine Passes Trail high above the Saastal",
);
const gallery = [];
const galleryDefs = [
  ["20260730_090743.jpg", "Old wooden barns of Saas-Fee with the Fee Glacier behind at the start of Stage 20"],
  ["20260730_110515.jpg", "The balcony trail traversing high above the Saas Valley on Day 1"],
  ["20260730_115442.jpg", "The trail ducks under an overhanging rock wall on the exposed Day 1 traverse"],
  ["20260730_163819.jpg", "Grächen's old village core with traditional Valais houses, the overnight stop"],
  ["20260731_130412.jpg", "Hikers climbing the boulder field towards the Augstbordpass on Day 2"],
  ["20260731_170020.jpg", "First view of Gruben in the quiet Turtmanntal at the end of Day 2"],
];
for (const [f, alt] of galleryDefs) {
  const { _type, alt: a, asset } = await img(f, alt);
  gallery.push({ _key: f.slice(9, 15), _type, alt: a, asset });
}

const pdfAsset = await client.assets.upload("file", readFileSync(PDF), {
  filename: "TestedRoutes-Saas-Fee-Gruben-Weekend-Hike.pdf",
  contentType: "application/pdf",
});
console.log("pdf", pdfAsset._id, Math.round(pdfAsset.size / 1024), "KB");

const trackLine = JSON.stringify(JSON.parse(readFileSync(path.join(ASSETS, "trackline.json"), "utf8")));

const P = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: key + "s", _type: "span", text }],
});

const doc = {
  _id: "story-saas-fee-to-gruben",
  _type: "story",
  title: "Saas Fee to Gruben",
  slug: { _type: "slug", current: "saas-fee-to-gruben" },
  storyId: "switzerland-saasfee-gruben-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-06",
  lastUpdated: "2026-08-06",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],
  timesCompleted: 1,
  mostRecentCompletion: "2026-07-31",

  eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
  subtitle:
    "Two days from glacier country to a valley that sleeps all winter, crossing the highest pass of the Alpine Passes Trail. One night on the Grächen sun terrace.",
  metaTitle: "Saas Fee to Gruben: 2-Day Alpine Hike",
  metaDescription:
    "A 2-day hike on Switzerland's Alpine Passes Trail (Stages 20 and 21): the Saastal balcony ledges, the 2,892 m Augstbordpass and the quiet Turtmanntal, with full logistics.",

  heroImage: hero,
  galleryImages: gallery,

  body: [
    P("b1", "Saas Fee to Gruben"),
    P("b2", "The hardest weekend on the Alpine Passes Trail. And the emptiest."),
    P("b3", "An hour out of Saas-Fee the path stops being a path. It narrows to a ledge with a wire rope bolted into the rock, and the Weissmies fills the entire far side of the valley. We met six people all day, in high season, one valley over from a busy resort. There is a boulder out there with a very long drop behind it, and not everyone in the group was willing to climb it for the photograph."),
    P("b4", "Lunch was whatever we carried, because there is no kitchen up there. Afterwards the trail swings into the Mattertal and the whole cast changes: the Weisshorn ahead, the tip of the Matterhorn beside it, ibex working the slope below a bench somebody placed exactly right. Then a long drop into Grächen, a proper village on a sun terrace with shops, beds and a spa, and the last place you will see any of that."),
    P("b5", "Day two is the biggest day of the weekend. Five hundred metres down to St. Niklaus, then straight back up the old mule path to Jungen with the Matterhorn standing behind you, then a boulder field, then the Augstbordpass at 2,892 metres. Half of Valais opens from the top. On the far side you give away a thousand metres into the Turtmanntal, a valley so quiet its only village empties for winter."),
    P("b6", "There is a shortcut on day two, a bus and a small cable car that removes about two and a half hours of climbing. Two of our group took it. We did not, spent the morning chasing them, and caught them just below the pass, which felt like winning something nobody else had entered."),
    P("b7", "Hardly anyone links these two days, which is exactly why they are worth linking."),
    P("b8", "42 km. 2,814 m of ascent. Around 18 hours on the trail. One night in Grächen."),
  ],

  whatMakesThisSpecial:
    "The Alpine Passes Trail's highest pass and its airiest balcony ledges in one weekend, ending in a valley so quiet its only village empties every winter.",
  highlights: [
    "The wire-rope balcony trail high above the Saastal — exposed, quiet, spectacular",
    "The Augstbordpass at 2,892 m, the highest point of the entire Alpine Passes Trail",
    "One night in Grächen, a sun-terrace village with shops, beds and a spa",
    "Weisshorn and Matterhorn views from the old Jungen mule path",
    "Gruben in the Turtmanntal — a valley that empties every winter",
  ],
  whyThisTrip: [
    "Two stages of the Alpine Passes Trail in a single weekend",
    "The trail's highest pass at 2,892 m",
    "Real exposure on secured ledges without technical climbing",
    "A finish in one of the quietest valleys in Valais",
  ],
  uniqueSellingPoints: [
    "The highest pass of the Alpine Passes Trail crossed on Day 2",
    "Exposed wire-rope ledges an hour from a busy resort — and almost nobody on them",
    "Village overnight in Grächen instead of a hut: real beds, shops and dinner",
    "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    "The exit is an adventure in itself: a phone-booked valley bus and a tiny cable car",
  ],
  whoThisIsFor: [
    "Comfortable with a 9-hour day followed by another 9-hour day",
    "Want real exposure with wire-rope security, not technical climbing",
    "Prefer self-guided independent travel",
    "Based in Switzerland or Europe with public-transport access",
  ],
  notSuitableIf: [
    "You freeze on exposure — Day 1's ledges are long, airy and committed",
    "You cannot commit to a 2-day, 1-night plan",
    "Forecast is unstable for either day",
    "You need step-free or wheelchair access",
  ],
  notSuitableSales: [
    "If exposed ledges are not your thing — Day 1 is long, airy and committed",
    "If the forecast is unstable — there is no shelter on either stage",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "~18 h walking · ~2,814 m ascent" },
    { _key: "altitude", _type: "primaryStat", label: "Altitude", value: "2,893 m highest point" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Train + bus, or car" },
    { _key: "highlight", _type: "primaryStat", label: "Highlight", value: "The trail's highest pass at 2,892 m" },
  ],
  durationDays: 2,
  durationHours: 18,
  durationDisplay: "2 days, ~18 h walking total",
  totalDistanceKm: 42,
  elevationGainM: 2814,
  maxAltitudeM: 2893,
  overallLevel: "hard",
  physicalFitnessRequired: "high",
  technicalSkillRequired: "basic",
  adrenalineLevel: 3,
  scenicRating: 5,
  crowdLevel: "low",
  beginnerFriendly: false,
  familyFriendly: false,
  soloFriendly: true,
  minAgeRecommended: 14,
  idealGroupSize: "1–4 people",
  idealFor: ["alpine hikers", "weekend adventurers", "long-distance trail walkers", "photographers"],
  bestForCrowdType: "active_explorers",

  difficultyAtAGlance: [
    "T3 mountain hiking — exposed ledges secured with wire ropes on Day 1",
    "Highest point 2,893 m at the Augstbordpass",
    "42 km / 2,814 m ascent over 2 days",
    "No services on the trail between Saas-Fee and Hannigalp",
  ],
  difficultyFactors: [
    "42 km with 2,814 m of ascent split across two long days",
    "Day 1 ledges are exposed and wire-rope secured, with no exit until Hannigalp",
    "Day 2 crosses a huge boulder field below the 2,892 m pass",
    "Snow can sit on the Augstbordpass into mid-July",
    "The trip ends on a reservation-only bus with no later departure",
  ],
  commonMistakes: [
    "Not booking the Walliserhof in Grächen early enough",
    "Forgetting to phone-book the Turtmanntal bus the evening before Day 2",
    "Underestimating water needs on Day 1 — no refill until Hannigalp",
    "Carrying too little cash: the Jungenbahn, the valley bus and Gruben run on cash",
  ],
  insiderTips: [
    "Book the 17:20 Turtmanntal bus by phone the evening before, at dinner",
    "Carry 3 L of water on Day 1 — there is no hut, spring or shop until Hannigalp",
    "The Hannigalp gondola saves the last 500 m of descent into Grächen (CHF 14)",
    "Bus #551 + Jungenbahn can cut 2.5+ hours of climbing from Day 2",
    "Signal is patchy on the balcony trail and in the Turtmanntal — download offline maps",
  ],
  moneySavingTips: [
    "Buy SBB Saver Day Passes 2–3 weeks ahead — booking early is worth ~CHF 150 per person",
    "Pack both lunches from home; buy Day 2's picnic in Grächen",
    "A Half-fare card cuts the train cost roughly in half",
  ],
  verifiedFacts: [
    "Day 1 from Saas-Fee to Grächen took around 9 h including breaks",
    "Day 2 over the Augstbordpass to Gruben took around 9 h",
    "The Turtmanntal valley bus is phone-booked and paid in cash",
    "The Jungenbahn cable car from St. Niklaus to Jungen is cash only",
    "Hannigalp gondola descent to Grächen costs CHF 14",
    "We met six other hikers on the entire Day 1 balcony trail in high season",
  ],

  bookingsRequired: ["Hotel Walliserhof Grächen", "Turtmanntal valley bus (by phone)", "SBB Saver fares"],
  bookingsAdvanceDays: 60,
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
  estimatedCost: { _type: "estimatedCost", currency: "CHF", min: 230, max: 405 },
  costBreakdown: { _type: "costBreakdown", accommodation: 95, food: 30, transport: 104, activities: 0 },

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
  nearestCity: "Visp",
  nearestCityDistanceKm: 15,

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
  regions: ["Valais", "Saastal", "Mattertal", "Turtmanntal"],
  coordinates: { _type: "geopoint", lat: 46.19, lng: 7.82 },
  mapZoom: 11,
  startingPoint: {
    _type: "startingPoint",
    name: "Saas-Fee",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.108813, lng: 7.929233 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Gruben",
    type: "town",
    coordinates: { _type: "geopoint", lat: 46.211536, lng: 7.706014 },
  },
  routeStops: [
    {
      _key: "graechen", _type: "routeStop", name: "Grächen", type: "town",
      coordinates: { _type: "geopoint", lat: 46.195115, lng: 7.838606 },
    },
  ],
  routePoints: [
    { _key: "saasfee", _type: "routePoint", name: "Saas Fee", type: "start", coordinates: { _type: "geopoint", lat: 46.108813, lng: 7.929233 } },
    { _key: "graechen", _type: "routePoint", name: "Grächen", type: "stop", coordinates: { _type: "geopoint", lat: 46.195115, lng: 7.838606 } },
    { _key: "jungen", _type: "routePoint", name: "Jungen", type: "highlight", coordinates: { _type: "geopoint", lat: 46.195148, lng: 7.799123 } },
    { _key: "augstbordpass", _type: "routePoint", name: "Augstbordpass", type: "highlight", coordinates: { _type: "geopoint", lat: 46.208742, lng: 7.753215 } },
    { _key: "gruben", _type: "routePoint", name: "Gruben", type: "end", coordinates: { _type: "geopoint", lat: 46.211536, lng: 7.706014 } },
  ],
  trackLine,

  activityTags: [
    "alpine traverse", "high pass", "two-day hike", "Alpine Passes Trail",
    "Saas Fee", "Augstbordpass", "Turtmanntal", "Swiss Alps hiking",
  ],
  keywords: [
    "Saas Fee", "Gruben", "Augstbordpass", "Alpine Passes Trail", "Grächen",
    "Stage 20", "Stage 21", "Switzerland hiking", "2-day hike", "Valais hiking",
  ],
  searchTags: [
    "weekend hikes Switzerland", "Alpine Passes Trail stages", "hardest weekend hikes Switzerland",
    "Swiss long-distance hikes", "Valais multi-day hikes",
  ],
  searchSynonyms: [
    "Saas-Fee", "Augstbord pass", "Alpenpässe-Weg", "Alpine Pass Way", "Turtmann valley", "Grächen hike",
  ],
  appearsInSearches: [
    "Alpine Passes Trail Switzerland 2-day hike",
    "Saas Fee to Gruben hike",
    "Augstbordpass hike Switzerland",
    "Stage 20 Stage 21 Alpine Passes Trail",
    "weekend hike Switzerland Valais",
  ],
  alternativeNames: ["Alpine Passes Trail Stages 20-21", "Saas Fee to Gruben traverse"],

  whatYouGet: [
    "Day 1 and Day 2 hour-by-hour timelines with turnback checkpoints",
    "Transport plan from Zurich, Bern, Basel, and Geneva — including the phone-booked valley bus home",
    "Overnight plan for Grächen with a backup if the Walliserhof is full",
    "Full route map with numbered waypoints and elevation profiles",
    "Pack list, full cost breakdown, and reservations checklist with QR codes",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "hotelg", _ref: "ZJfSH2y70QKCy4v2EHa7eB", _type: "reference" },
    { _key: "hotelgr", _ref: "ZJfSH2y70QKCy4v2EHa7iD", _type: "reference" },
    { _key: "sbb", _ref: "ZJfSH2y70QKCy4v2EHa7oG", _type: "reference" },
    { _key: "mob", _ref: "ZJfSH2y70QKCy4v2EHa7qH", _type: "reference" },
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
    { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
  ],
  similarStories: [{ _key: "ledge", _ref: "story-saas-fee-gruben", _type: "reference" }],

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

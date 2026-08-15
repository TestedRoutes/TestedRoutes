#!/usr/bin/env node
/**
 * One-shot: create the Samoa 7-day guide story doc in Sanity.
 *
 * Cloned from create-kuwait-2-days-guide.mjs (the newest sibling, per the
 * production playbook). Every fact below comes from the sellable deck (the
 * founder's final pptx/PDF, 2026-08-15, 28 pages), the country master v3,
 * meta.yaml or Content Plan v54 - nothing is written from memory.
 *
 * Title, subtitle and metaTitle verbatim from the Content Plan Guides sheet;
 * the meta description is the plan's own cell, copied here unchanged (the
 * plan is the register; the site is the render).
 *
 * Prices: the plan says 49. The house currency set is EUR/CHF/GBP/USD with
 * USD priced above the pack, +6 on both recent siblings (Tuvalu 29/35,
 * Kuwait 19/25, Ring Road 29/35), so 49/49/49/55. If that reading is wrong,
 * repricing is a customPrices patch + polar sync, nothing is printed.
 *
 * trackLine: OSRM driving over the master's Route pins, chained across day
 * boundaries and split at the ferry - Upolu chain (248 km, deck says ~250),
 * a straight ferry segment Mulifanua->Salelologa, the Savai'i loop (220 km,
 * deck says ~200 by taxi), the straight ferry back, and the wharf->airport
 * leg. Downsampled to ~250 [lat,lng] pairs.
 *
 * "My Experience" body is first person ON PURPOSE (founder rule, 2026-08-13):
 * the field renders under that heading and must read as the actual trip. No
 * published Samoa inspire story exists yet to source it from, so it is
 * written from the founder's own trip evidence (the Dec 2024 - Jan 2025
 * photo archive: To-Sua, Savaia, the Alofaaga blowholes, the New Year) and
 * claims nothing beyond it. similarStories is omitted for the same reason -
 * patch it in when the Samoa stories publish.
 *
 * Idempotency: createOrReplace on a fixed _id. Run --dry-run first.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-samoa-upolu-savaii-7-days-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\c543bb5a-b257-4d17-8e11-4bc5412a617e\scratchpad\guide-assets-samoa-7d`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\samoa\guides\samoa-upolu-savaii-7-days\TestedRoutes_Samoa_Guide_7_Days_Upolu_Savaii.pdf`;

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

// Alt text written from the actual frames (founder's destination cull), not
// from memory. hero/g1..g6 are web exports of the culled originals.
const hero = await img(
  "hero.jpg",
  "To-Sua Ocean Trench from the rim, swimmers on the ladder into the green pool",
);
const galleryDefs = [
  ["g1.jpg", "An Alofaaga blowhole firing seawater high above the lava shelf"],
  ["g2.jpg", "White sand and beach fales at Lalomanu, swimmers in the shallows"],
  ["g3.jpg", "Sopo'aga Falls dropping into its jungle gorge"],
  ["g4.jpg", "Twin falls into the swimming pool at Afu Aau, Savai'i"],
  ["g5.jpg", "A yellow Lady Samoa island bus parked under coconut palms"],
  ["g6.jpg", "Black lava field running to the sea on the Savai'i coast"],
];
const gallery = [];
for (const [file, alt] of galleryDefs) {
  const g = await img(file, alt);
  gallery.push({ ...g, _key: file.replace(/\W/g, "") });
}

const pdfAsset = DRY_RUN
  ? { _id: "DRY-pdf" }
  : await client.assets.upload("file", readFileSync(PDF), {
      filename: "TestedRoutes_Samoa_Guide_7_Days_Upolu_Savaii.pdf",
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
  _id: "story-samoa-upolu-savaii-7-days",
  _type: "story",
  title: "Samoa in a Week: Upolu & Savai'i Self-Drive",
  slug: { _type: "slug", current: "samoa-upolu-savaii-7-days" },
  storyId: "samoa-upolu-savaii-7-days-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-15",
  lastUpdated: "2026-08-15",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],

  eyebrow: "SAMOA • 7-DAY SELF-DRIVE • UPOLU & SAVAI'I",
  subtitle: "Two islands at their own pace.",
  metaTitle: "Samoa in a Week: Upolu & Savai'i Self-Drive",
  metaDescription:
    "A tested 7-day Samoa itinerary covering Upolu and Savai'i: To-Sua, waterfalls, the inter-island ferry, lava fields and blowholes, with costs and bookings.",

  heroImage: hero,
  galleryImages: gallery,

  // "My Experience" - first person ON PURPOSE (see the header comment).
  body: [
    P("b1", "I crossed into the New Year in Samoa - it sits just west of the date line, so midnight arrives there before almost anywhere else on earth. The trip covered both islands over the turn of the year: Upolu's waterfalls and its famous sinkhole first, then the ferry across to Savai'i, which most itineraries skip and which turned out to hold half the trip's best hours."),
    P("b2", "The hits are real. To-Sua is a 30 m ladder down into a green pool the ocean feeds through the lava, and going early matters - the vans arrive mid-morning. At Savaia the giant clams sit below a village flag and wild turtles graze the seagrass in waist-deep water. And at Taga the Alofaaga blowholes fire seawater tens of metres into the sky while you stand on the shelf it comes through."),
    P("b3", "What the trip taught me is that Samoa's only real logistics problem is the ferry, and that it has a clean answer: cross as a foot passenger and let a local driver do Savai'i. This guide is that trip done properly - the week planned so the crossing, the Sunday closures and the early equatorial dark all work for you instead of against you."),
  ],

  whatMakesThisSpecial:
    "Two islands in one week without the logistics battle - the ferry crossed on foot, Savai'i handed to a local driver, and every night where it earns its keep.",
  highlights: [
    "To-Sua Ocean Trench - a 30 m sinkhole you swim inside, at opening time",
    "The Alofaaga Blowholes - seawater cannons through the lava shelf at Taga",
    "Wild turtles and giant clams at Savaia, waist-deep off a village beach",
    "Lalomanu Beach - white sand facing Nu'utele island, stay for the sunset",
    "The Sale'aula lava fields - a church swallowed to its windows in 1905",
  ],
  whyThisTrip: [
    "The ferry crossed the clever way: on foot, with a taxi doing Savai'i for you",
    "Bases chosen so the nights earn their keep - never a hotel change without a reason",
    "Every slot timed around the Sunday closures and the 19:00 dark",
    "The booking order worked out - what needs months, what needs a day, what needs nothing",
    "The fallbacks named: the rain card, the fales-full swap, the same-driver deal",
  ],
  uniqueSellingPoints: [
    "Hour-by-hour timelines for all seven days",
    "The ferry math: foot passengers vs a car on the deck, and why the car stays",
    "Fifteen hotels and nine restaurants across both islands, each with a QR link",
    "A costed budget in three tiers - per person, for two sharing",
    "Google My Maps companion with every pin in the guide",
  ],
  whoThisIsFor: [
    "Travellers who want the South Pacific without a resort-only week",
    "Self-drive travellers happy on quiet left-hand roads",
    "Couples and families who want swims, waterfalls and beaches over nightlife",
    "Anyone who would rather follow a tested plan than piece one together",
  ],
  notSuitableIf: [
    "You want nightlife - kitchens close by 21:00 and Sundays close nearly everything",
    "You will not drive - buses run to the market and back, and that is the whole timetable",
    "You need everything bookable by card - villages, fales and fees run on cash",
    "You want a single resort to stay put in - this trip moves through five bases",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "7 days, 7 nights" },
    { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days, easy mornings" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Fly to APW · visa-free for most" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · 2WD driving, short flat walks" },
    { _key: "season", _type: "primaryStat", label: "Season", value: "May to October is the dry season" },
  ],
  durationDays: 7,
  durationDisplay: "7 days, 7 nights",
  overallLevel: "easy",
  crowdLevel: "low",
  beginnerFriendly: true,
  familyFriendly: true,
  soloFriendly: true,
  idealGroupSize: "2 people",
  idealFor: ["couples", "families", "self-drive travellers", "snorkellers"],

  difficultyAtAGlance: [
    "Easy 2WD driving on sealed roads - left-hand side, 40 km/h in villages",
    "Short flat walks everywhere; the lava-field walk is the longest at about two hours",
    "Swimming is the main activity - the trench has a ladder, the falls have pools",
    "No street lighting outside Apia: every day is planned to be parked by dark",
  ],
  commonMistakes: [
    "Queueing a rental car onto the ferry - foot passengers walk on and a taxi does Savai'i",
    "Letting the Savai'i return fall on a Sunday - one boat each way that day",
    "Trusting the ferry timetable weeks out - it is monthly and marked tentative",
    "Arriving without small cash - village fees at nearly every stop are tala only",
    "Leaving Aga Reef and the beach fales unbooked in holiday weeks - they fill weeks ahead",
  ],
  insiderTips: [
    "Be at To-Sua for opening and the trench is yours before the vans arrive",
    "Check the tide at breakfast - Palolo Deep floats at high tide, the blowholes fire hardest then too",
    "Order the Savai'i packed lunch at dinner the night before - the south coast has no kitchen",
    "If the taxi driver clicks, agree a two-day price on the spot - loop, lunch stop and wharf drop",
    "Keep a pouch of small tala notes - the village fee is the custom, paid without haggling",
  ],
  verifiedFacts: [
    "The inter-island ferry takes foot passengers at WST 10 each way, tickets at the window",
    "To-Sua Ocean Trench opens 08:00 to 17:00, entry about WST 25 cash, shut on Sundays",
    "Sundays run one ferry each way, and most of the country closes for church",
    "Samoa drives on the left - it switched in 2009 - and a temporary local permit comes from the rental desk",
    "Sunset runs 18:30 to 19:15 all year, and the roads are unlit outside Apia",
  ],

  bookingsRequired: [
    "Hotels for all nights, 4-6 months ahead - Aga Reef and the Sheraton shape the trip, and holiday weeks book out",
    "The rental car with a night return arranged, 1-2 months ahead",
    "The Savai'i packed lunch - ordered at the hotel desk the evening before the crossing",
  ],
  bookingsAdvanceDays: 120,
  specialEquipment: [
    "a snorkel mask - rentals at Savaia are basic, your own is better",
    "reef shoes - lava rock and coral underfoot all week",
    "a dry bag - boat spray, blowholes and sudden rain",
    "a Type I power adapter - the Australia / NZ pin layout",
    "a pouch of small tala notes for village fees",
  ],
  rentalEquipmentAvailable: false,
  permitsRequired: false,

  budgetLevel: "moderate",
  accommodationType: "hotel",
  journeyStyle: "self_guided",
  journeyCategory: { _ref: "category-journey-week", _type: "reference" },
  routeMode: "driving",
  timeOfDay: "multi_day",
  weatherDependent: true,
  snowSeasonAccessible: false,
  wheelchairAccessible: false,
  carRequired: true,
  fourByFourRequired: false,
  publicTransportAccessible: false,
  transportationRequired: ["car", "boat"],
  transportationDifficulty: "easy",
  nearestCity: "Apia",
  nearestCityDistanceKm: 30,

  // May-Oct dry season = the austral winter; Dec-Mar is the wet, cyclone-risk
  // and holiday-price season per the deck's At a glance and hotels pages.
  bestSeasons: ["winter"],
  bestMonths: [5, 6, 7, 8, 9, 10],
  avoidMonths: [12, 1, 2, 3],

  destination: { _ref: "destination-samoa", _type: "reference" },
  regions: ["Upolu", "Savai'i", "Apia"],
  coordinates: { _type: "geopoint", lat: -13.75, lng: -172.1 },
  mapZoom: 9,
  startingPoint: {
    _type: "startingPoint",
    name: "Faleolo International Airport",
    type: "airport",
    coordinates: { _type: "geopoint", lat: -13.83308, lng: -171.99957 },
  },
  finishPoint: {
    _type: "startingPoint",
    name: "Faleolo International Airport",
    type: "airport",
    coordinates: { _type: "geopoint", lat: -13.83308, lng: -171.99957 },
  },
  routePoints: [
    { _key: "apw", _type: "routePoint", name: "Faleolo International Airport", type: "start", coordinates: { _type: "geopoint", lat: -13.83308, lng: -171.99957 } },
    { _key: "apia", _type: "routePoint", name: "Apia", type: "stop", coordinates: { _type: "geopoint", lat: -13.8304, lng: -171.76852 } },
    { _key: "palolo", _type: "routePoint", name: "Palolo Deep Marine Reserve", type: "highlight", coordinates: { _type: "geopoint", lat: -13.82526, lng: -171.75778 } },
    { _key: "piula", _type: "routePoint", name: "Piula Cave Pool", type: "highlight", coordinates: { _type: "geopoint", lat: -13.87332, lng: -171.59709 } },
    { _key: "fuipisia", _type: "routePoint", name: "Fuipisia Falls", type: "stop", coordinates: { _type: "geopoint", lat: -13.97814, lng: -171.58796 } },
    { _key: "lalomanu", _type: "routePoint", name: "Lalomanu Beach", type: "highlight", coordinates: { _type: "geopoint", lat: -14.04593, lng: -171.4476 } },
    { _key: "tosua", _type: "routePoint", name: "To-Sua Ocean Trench", type: "highlight", coordinates: { _type: "geopoint", lat: -14.04387, lng: -171.56232 } },
    { _key: "lavawalk", _type: "routePoint", name: "Lava Field Coastal Walkway", type: "stop", coordinates: { _type: "geopoint", lat: -14.04531, lng: -171.74544 } },
    { _key: "savaia", _type: "routePoint", name: "Savaia Giant Clam Sanctuary", type: "highlight", coordinates: { _type: "geopoint", lat: -13.95527, lng: -171.96128 } },
    { _key: "mulifanua", _type: "routePoint", name: "Mulifanua Wharf - the ferry", type: "stop", coordinates: { _type: "geopoint", lat: -13.83003, lng: -172.03645 } },
    { _key: "afuaau", _type: "routePoint", name: "Afu Aau Falls", type: "highlight", coordinates: { _type: "geopoint", lat: -13.7471, lng: -172.31275 } },
    { _key: "alofaaga", _type: "routePoint", name: "Alofaaga Blowholes", type: "highlight", coordinates: { _type: "geopoint", lat: -13.8022, lng: -172.5197 } },
    { _key: "mulinuu", _type: "routePoint", name: "Cape Mulinu'u", type: "stop", coordinates: { _type: "geopoint", lat: -13.51754, lng: -172.80336 } },
    { _key: "saleaula", _type: "routePoint", name: "Sale'aula Lava Fields", type: "highlight", coordinates: { _type: "geopoint", lat: -13.45151, lng: -172.33229 } },
    { _key: "out", _type: "routePoint", name: "Faleolo International Airport", type: "end", coordinates: { _type: "geopoint", lat: -13.83308, lng: -171.99957 } },
  ],
  trackLine,

  activityTags: [
    "self-drive", "island hopping", "snorkelling", "waterfalls", "beaches",
    "South Pacific", "swimming", "road trip",
  ],
  keywords: [
    "Samoa itinerary", "7 days in Samoa", "Samoa travel guide",
    "Upolu and Savaii itinerary", "To Sua Ocean Trench", "Samoa self drive",
    "Savaii ferry", "is Samoa worth visiting",
  ],
  searchTags: [
    "Samoa 7 day itinerary", "Samoa one week", "Samoa road trip",
    "Upolu Savaii route",
  ],
  searchSynonyms: ["Upolu", "Savai'i", "Savaii", "Apia", "APW", "To Sua"],
  appearsInSearches: [
    "how many days do you need in Samoa",
    "is Samoa worth visiting",
    "Samoa or Fiji which is better",
    "how to get to Savaii from Upolu",
    "To Sua Ocean Trench how to visit",
  ],
  alternativeNames: ["Samoa one-week itinerary", "Upolu and Savai'i road trip"],

  whatYouGet: [
    "Hour-by-hour timelines for all seven days, from the midnight landing to the late fly-out",
    "The ferry playbook: foot-passenger tickets, the taxi hire, and why the car stays behind",
    "Fifteen hotels in three bands and nine restaurants across both islands, each with a QR link",
    "A costed three-tier budget per person, for two sharing",
    "The Sunday rule, the village-fee custom and the 19:00 dark - planned around, not discovered",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  affiliateLinks: [
    { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
  ],

  featuredInHomepage: false,

  guide: {
    _type: "guide",
    hasGuide: true,
    status: "available",
    format: ["PDF"],
    pages: 28,
    customPrices: [
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 49 },
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 49 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 49 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 55 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
    cardLine: "Two islands, one ferry crossed the clever way",
    dayStrip: "Apia · East to Lalomanu · To-Sua · West coast · Savai'i by taxi · Lava fields · Fly out",
  },
};

const md = doc.metaDescription;
if (md.length < 145 || md.length > 160) {
  console.error(`metaDescription is ${md.length} chars, wanted 145-160`);
  process.exit(1);
}

if (DRY_RUN) {
  console.log("DRY RUN - no writes. Doc preview:");
  console.log(JSON.stringify({ ...doc, trackLine: `[${JSON.parse(trackLine).length} points]` }, null, 2).slice(0, 2000));
  console.log("\n... truncated. Assets that WOULD upload:", ["hero.jpg", ...galleryDefs.map((g) => g[0]), "PDF"].join(", "));
  console.log("metaDescription length:", md.length);
} else {
  const res = await client.createOrReplace(doc);
  console.log("created", res._id, "| metaDescription", md.length, "chars");
}

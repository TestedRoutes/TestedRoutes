#!/usr/bin/env node
/**
 * One-shot: create the Samoa 5-day Upolu guide story doc in Sanity.
 *
 * Cloned from create-samoa-upolu-savaii-7-days-guide.mjs (the newest sibling,
 * per the production playbook). Every fact below comes from the sellable deck
 * (the founder's final pptx/PDF, 2026-08-15, 24 pages), the country master v4
 * (5D trio), meta.yaml or Content Plan v54 - nothing is written from memory.
 *
 * Title, subtitle and metaTitle verbatim from the Content Plan Guides sheet;
 * the meta description is the plan's own cell, copied here unchanged (the
 * plan is the register; the site is the render).
 *
 * Prices: the plan says 19. House currency set EUR/CHF/GBP/USD with USD
 * priced above the pack (Kuwait 19/25, Tuvalu 29/35, Samoa 7D 49/55), so
 * 19/19/19/25.
 *
 * trackLine: OSRM driving over the master's 5D Route pins, chained across
 * day boundaries (airport -> Apia loop -> east coast -> Lalomanu -> To-Sua ->
 * the national park -> Savaia -> Cape Fatuosofia -> airport), downsampled to
 * ~250 [lat,lng] pairs. OSRM total 252 km vs the deck's "~350 km in your
 * car": the deck's figure adds the night-base backtracking (Togitogiga back
 * east to Aga Reef, then the same south coast again the next morning, ~90 km)
 * which a map polyline deliberately does not draw twice. The Upolu chain
 * matches the 7-day sibling's 248 km for the shared legs, which is the check
 * that the method is sound.
 *
 * "My Experience" body is first person ON PURPOSE (founder rule, 2026-08-13),
 * written from the founder's own trip evidence (the Dec 2024 - Jan 2025
 * photo archive: To-Sua, Savaia, Lalomanu, the New Year) and claims nothing
 * beyond it. similarStories cross-sells the 7-day sibling; the sibling gets
 * the mirror-image patch in the publish session.
 *
 * Idempotency: createOrReplace on a fixed _id. Run --dry-run first.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-samoa-upolu-5-days-guide.mjs [--dry-run]
 */
import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

const ASSETS = String.raw`C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\f7e6b087-a430-4e7c-bd5b-1f6cab3fc311\scratchpad\guide-assets-samoa-5d`;
const PDF = String.raw`C:\Users\pauli\Desktop\TestedRoutes - Website\content\countries\samoa\guides\samoa-upolu-5-days\TestedRoutes_Samoa_Guide_5_Days_Upolu.pdf`;

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

// Alt text written from the actual frames (the guide folder's founder-curated
// deck-photos pools), not from memory. hero/g1..g6 are web exports.
const hero = await img(
  "hero.jpg",
  "Inside To-Sua Ocean Trench: the platform at the foot of the ladder, swimmers in the green pool",
);
const galleryDefs = [
  ["g1.jpg", "Sopo'aga Falls dropping into its jungle gorge, seen from the garden lookout"],
  ["g2.jpg", "White sand and beach fales at Lalomanu, swimmers in the clear shallows"],
  ["g3.jpg", "Snorkelling water: the turquoise lagoon shallows off an Upolu beach"],
  ["g4.jpg", "A painted blue-and-white village church behind its flower beds on Upolu"],
  ["g5.jpg", "Tide pools in the black lava shelf on Upolu's south coast"],
  ["g6.jpg", "The empty island road through the palms, from the driver's seat"],
];
const gallery = [];
for (const [file, alt] of galleryDefs) {
  const g = await img(file, alt);
  gallery.push({ ...g, _key: file.replace(/\W/g, "") });
}

const pdfAsset = DRY_RUN
  ? { _id: "DRY-pdf" }
  : await client.assets.upload("file", readFileSync(PDF), {
      filename: "TestedRoutes_Samoa_Guide_5_Days_Upolu.pdf",
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
  _id: "story-samoa-upolu-5-days",
  _type: "story",
  title: "Samoa in 5 Days: An Upolu Self-Drive Itinerary",
  slug: { _type: "slug", current: "samoa-upolu-5-days" },
  storyId: "samoa-upolu-5-days-2026",
  language: "en",
  status: "published",
  publishedDate: "2026-08-15",
  lastUpdated: "2026-08-15",
  author: { _ref: "author-paulius-pikelis", _type: "reference" },
  testedBy: "pikelis",
  testedWith: ["adult travelers"],

  eyebrow: "SAMOA • 5-DAY SELF-DRIVE • UPOLU",
  subtitle: "Upolu at its own pace.",
  metaTitle: "Samoa in 5 Days: An Upolu Self-Drive Itinerary",
  metaDescription:
    "A tested 5-day Upolu itinerary: To-Sua Ocean Trench, waterfalls, Lalomanu Beach and a wild-turtle snorkel, with drive times, costs and bookings sorted.",

  heroImage: hero,
  galleryImages: gallery,

  // "My Experience" - first person ON PURPOSE (see the header comment).
  body: [
    P("b1", "I spent the turn of the year in Samoa, and Upolu is where the trip actually happened: the waterfalls stacked along the east road, the ladder down into To-Sua before the vans arrived, and an afternoon at Savaia where wild green turtles grazed the seagrass around me in waist-deep water."),
    P("b2", "The question everyone asks about Samoa is whether you can skip Savai'i. With five days, the honest answer is yes - trying to force both islands into this window means a ferry, a fourth hotel and two half-days lost to logistics. Upolu alone fills five days without a single filler stop: the capital on foot, Lalomanu's sand at sunset, the lava coast of the South Pacific's first national park."),
    P("b3", "What shaped this plan was the clock. Near the equator the light is gone by seven, Sundays close nearly everything, and the flights land around midnight - so the guide times every swim, every drive and every night so none of those facts costs you anything. It is the trip I would do again with five days, in exactly this order."),
  ],

  whatMakesThisSpecial:
    "Five days that answer the Savai'i question by ignoring it - one island, one rental car, three bases, and every swim timed to beat the crowds and the dark.",
  highlights: [
    "To-Sua Ocean Trench - a 30 m sinkhole you swim inside, at opening time",
    "Wild turtles and giant clams at Savaia, waist-deep off a village beach",
    "Lalomanu Beach - white sand facing Nu'utele island, stay for the sunset",
    "Fuipisia Falls - a 55 m drop where you stand at the lip",
    "The lava-coast walk in O Le Pupu-Pue, the South Pacific's first national park",
  ],
  whyThisTrip: [
    "One island on purpose: no ferry, no fourth hotel, no drive over two hours",
    "Three bases that follow the route - Apia, the south-east coast, the airport side",
    "Every slot timed around the Sunday closures and the 19:00 dark",
    "The booking order worked out - what needs months, what needs a day, what needs nothing",
    "The last day is a pool day ten minutes from the terminal, not a race back to Apia",
  ],
  uniqueSellingPoints: [
    "Hour-by-hour timelines for all five days",
    "The arrival-night decision solved for the around-midnight landings",
    "Nine hotels in three bands and six restaurants, each with a QR link",
    "A costed budget in three tiers - per person, for two sharing",
    "Google My Maps companion with every pin in the guide",
  ],
  whoThisIsFor: [
    "Travellers with five days who want Samoa without the ferry logistics",
    "Self-drive travellers happy on quiet left-hand roads",
    "Couples and families who want swims, waterfalls and beaches over nightlife",
    "Anyone who would rather follow a tested plan than piece one together",
  ],
  notSuitableIf: [
    "You want both islands - that is the 7-day trip, not a tighter version of this one",
    "You want nightlife - kitchens close by 21:00 and Sundays close nearly everything",
    "You will not drive - buses run to the market and back, and that is the whole timetable",
    "You need everything bookable by card - villages, fales and fees run on cash",
  ],

  primaryStats: [
    { _key: "duration", _type: "primaryStat", label: "Duration", value: "5 days, 5 nights" },
    { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days, easy mornings" },
    { _key: "access", _type: "primaryStat", label: "Access", value: "Fly to APW · visa-free for most" },
    { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · 2WD driving, short flat walks" },
    { _key: "season", _type: "primaryStat", label: "Season", value: "May to October is the dry season" },
  ],
  durationDays: 5,
  durationDisplay: "5 days, 5 nights",
  overallLevel: "easy",
  crowdLevel: "low",
  beginnerFriendly: true,
  familyFriendly: true,
  soloFriendly: true,
  idealGroupSize: "2 people",
  idealFor: ["couples", "families", "self-drive travellers", "snorkellers"],

  difficultyAtAGlance: [
    "Easy 2WD driving on sealed roads - left-hand side, 40 km/h in villages",
    "Short flat walks everywhere; the lava-field walk is the longest, flat but hot",
    "Swimming is the main activity - the trench has a ladder, the falls have pools",
    "No street lighting outside Apia: every day is planned to be parked by dark",
  ],
  commonMistakes: [
    "Squeezing Savai'i into five days - the ferry eats two half-days and adds a fourth hotel",
    "Letting a Sunday be the errands day - shops shut and kitchens thin out for church",
    "Arriving without small cash - village fees at nearly every stop are tala only",
    "Leaving Aga Reef and the beach fales unbooked in holiday weeks - they fill weeks ahead",
    "Not arranging the after-midnight car return when collecting the car",
  ],
  insiderTips: [
    "Be at To-Sua by 08:30 and the trench is yours before the vans arrive",
    "Check the tide at breakfast - Palolo Deep floats at high tide; flip the afternoon if needed",
    "Litia Sini's kitchen closes at 15:00 - no dawdling on the pass road if lunch is there",
    "If late check-out costs a day-use rate on the last day, pay it - the flight is at 16:00 or 01:25",
    "Keep a pouch of small tala notes - the village fee is the custom, paid without haggling",
  ],
  verifiedFacts: [
    "To-Sua Ocean Trench opens 08:00 to 17:00, entry about WST 25 cash, shut on Sundays",
    "Sundays close nearly everything as the country turns to church and to'ona'i lunch",
    "Samoa drives on the left - it switched in 2009 - and a temporary local permit comes from the rental desk",
    "Sunset runs 18:30 to 19:15 all year, and the roads are unlit outside Apia",
    "Village fees of a few tala, in cash, are the legitimate custom at falls, pools and beaches",
  ],

  bookingsRequired: [
    "Hotels for all nights, 4-6 months ahead - Aga Reef and the airport-side resort shape the trip, and holiday weeks book out",
    "The rental car with a night return arranged, 1-2 months ahead",
    "Late check-out for the departure day - asked for when booking the last hotel",
  ],
  bookingsAdvanceDays: 120,
  specialEquipment: [
    "a snorkel mask - rentals at Savaia are basic, your own is better",
    "reef shoes - lava rock and coral underfoot all week",
    "a dry bag - reef swims, waterfalls and sudden rain",
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
  transportationRequired: ["car"],
  transportationDifficulty: "easy",
  nearestCity: "Apia",
  nearestCityDistanceKm: 30,

  // May-Oct dry season = the austral winter; Dec-Mar is the wet, cyclone-risk
  // and holiday-price season per the deck's At a glance and hotels pages.
  bestSeasons: ["winter"],
  bestMonths: [5, 6, 7, 8, 9, 10],
  avoidMonths: [12, 1, 2, 3],

  destination: { _ref: "destination-samoa", _type: "reference" },
  regions: ["Upolu", "Apia"],
  coordinates: { _type: "geopoint", lat: -13.93, lng: -171.75 },
  mapZoom: 10,
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
    { _key: "sopoaga", _type: "routePoint", name: "Sopo'aga Falls", type: "stop", coordinates: { _type: "geopoint", lat: -14.0096, lng: -171.58434 } },
    { _key: "lavawalk", _type: "routePoint", name: "Lava Field Coastal Walkway", type: "stop", coordinates: { _type: "geopoint", lat: -14.04531, lng: -171.74544 } },
    { _key: "togitogiga", _type: "routePoint", name: "Togitogiga Falls", type: "stop", coordinates: { _type: "geopoint", lat: -14.01397, lng: -171.7177 } },
    { _key: "savaia", _type: "routePoint", name: "Savaia Giant Clam Sanctuary", type: "highlight", coordinates: { _type: "geopoint", lat: -13.95527, lng: -171.96128 } },
    { _key: "fatuosofia", _type: "routePoint", name: "Cape Fatuosofia", type: "stop", coordinates: { _type: "geopoint", lat: -13.86601, lng: -172.07313 } },
    { _key: "out", _type: "routePoint", name: "Faleolo International Airport", type: "end", coordinates: { _type: "geopoint", lat: -13.83308, lng: -171.99957 } },
  ],
  trackLine,

  activityTags: [
    "self-drive", "snorkelling", "waterfalls", "beaches",
    "South Pacific", "swimming", "road trip",
  ],
  // Keywords identical to the fix_doc_metadata entry that stamped the PDF -
  // one list, two renders.
  keywords: [
    "Samoa itinerary", "5 days in Samoa", "Samoa travel guide",
    "Upolu itinerary", "To Sua Ocean Trench", "Samoa self drive",
    "Lalomanu Beach", "is 5 days enough for Samoa",
  ],
  searchTags: [
    "Samoa 5 day itinerary", "Upolu itinerary", "Samoa road trip",
    "Samoa without Savaii",
  ],
  searchSynonyms: ["Upolu", "Apia", "APW", "To Sua", "Lalomanu"],
  appearsInSearches: [
    "is 5 days enough for Samoa",
    "can you skip Savaii",
    "how many days do you need in Samoa",
    "To Sua Ocean Trench how to visit",
    "Upolu what to do",
  ],
  alternativeNames: ["Samoa five-day itinerary", "Upolu road trip"],

  whatYouGet: [
    "Hour-by-hour timelines for all five days, from the midnight landing to the fly-out",
    "The arrival-night decision solved: airport-side bed or the night drive to Apia",
    "Nine hotels in three bands and six restaurants, each with a QR link",
    "A costed three-tier budget per person, for two sharing",
    "The Sunday rule, the village-fee custom and the 19:00 dark - planned around, not discovered",
    "Interactive Google My Maps companion with every pin in the guide",
  ],

  similarStories: [
    { _key: "samoa7d", _ref: "story-samoa-upolu-savaii-7-days", _type: "reference" },
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
    pages: 24,
    customPrices: [
      { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 19 },
      { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 19 },
      { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 19 },
      { _key: "usd", _type: "priceEntry", currency: "USD", amount: 25 },
    ],
    pdf: { _type: "file", asset: { _type: "reference", _ref: pdfAsset._id } },
    cardLine: "One island, three bases, no ferry, no rush",
    dayStrip: "Apia · East to Lalomanu · To-Sua + the park · Clams, turtles + west · Pool + fly out",
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

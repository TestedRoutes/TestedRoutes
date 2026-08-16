/**
 * samoa-upolu-savaii-7-days: content for the Sanity story doc.
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
 * Prices are the Week rung of the pricing ladder (Content Plan v57 Pricing
 * tab, founder 2026-08-16): 29/29/35/29 EUR/CHF/USD/GBP. A 7-day itinerary is
 * Week, and Week is 29 - the same as the Iceland Ring Road, which is the point
 * of a ladder. This replaced 49/49/55/49, set when the plan still carried a
 * per-guide price and the USD uplift was inferred from siblings. Repricing is
 * a customPrices patch + polar sync; nothing is printed.
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
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-samoa-upolu-savaii-7-days",

  assets: {
    // Where the hero and gallery sources live when publishing from
    // files. Absent on disk, publish-guide.mjs carries forward whatever
    // is already on the doc instead of failing or, worse, publishing blank.
    // Originally: C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\c543bb5a-b257-4d17-8e11-4bc5412a617e\scratchpad\guide-assets-samoa-7d
    dir: null,
    hero: { file: "hero.jpg", alt: "To-Sua Ocean Trench from the rim, swimmers on the ladder into the green pool" },
    gallery: [
      { file: "g1.jpg", key: "g1jpg", alt: "An Alofaaga blowhole firing seawater high above the lava shelf" },
      { file: "g2.jpg", key: "g2jpg", alt: "White sand and beach fales at Lalomanu, swimmers in the shallows" },
      { file: "g3.jpg", key: "g3jpg", alt: "Sopo'aga Falls dropping into its jungle gorge" },
      { file: "g4.jpg", key: "g4jpg", alt: "Twin falls into the swimming pool at Afu Aau, Savai'i" },
      { file: "g5.jpg", key: "g5jpg", alt: "A yellow Lady Samoa island bus parked under coconut palms" },
      { file: "g6.jpg", key: "g6jpg", alt: "Black lava field running to the sea on the Savai'i coast" },
    ],
    trackLine: "tracklines/samoa-upolu-savaii-7-days.json",
    pdf: {
      path: "content/countries/samoa/guides/samoa-upolu-savaii-7-days/TestedRoutes_Samoa_Guide_7_Days_Upolu_Savaii.pdf",
      filename: "TestedRoutes_Samoa_Guide_7_Days_Upolu_Savaii.pdf",
    },
  },

  doc: {
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


    // "My Experience" - first person ON PURPOSE (see the header comment).
    body: [
      paragraph("b1", "I crossed into the New Year in Samoa - it sits just west of the date line, so midnight arrives there before almost anywhere else on earth. The trip covered both islands over the turn of the year: Upolu's waterfalls and its famous sinkhole first, then the ferry across to Savai'i, which most itineraries skip and which turned out to hold half the trip's best hours."),
      paragraph("b2", "The hits are real. To-Sua is a 30 m ladder down into a green pool the ocean feeds through the lava, and going early matters - the vans arrive mid-morning. At Savaia the giant clams sit below a village flag and wild turtles graze the seagrass in waist-deep water. And at Taga the Alofaaga blowholes fire seawater tens of metres into the sky while you stand on the shelf it comes through."),
      paragraph("b3", "What the trip taught me is that Samoa's only real logistics problem is the ferry, and that it has a clean answer: cross as a foot passenger and let a local driver do Savai'i. This guide is that trip done properly - the week planned so the crossing, the Sunday closures and the early equatorial dark all work for you instead of against you."),
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
        { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 29 },
        { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 29 },
        { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 29 },
        { _key: "usd", _type: "priceEntry", currency: "USD", amount: 35 },
      ],
      cardLine: "Two islands, one ferry crossed the clever way",
      dayStrip: "Apia · East to Lalomanu · To-Sua · West coast · Savai'i by taxi · Lava fields · Fly out",
    },
  },
};

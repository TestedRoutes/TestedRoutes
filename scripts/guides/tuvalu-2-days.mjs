import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-tuvalu-2-days",

  assets: {
    // Where the hero and gallery sources live when publishing from
    // files. Absent on disk, publish-guide.mjs carries forward whatever
    // is already on the doc instead of failing or, worse, publishing blank.
    // Originally: C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\cc2ced33-6ac5-482f-93d1-0015266a1930\scratchpad\guide-assets-tuvalu-2d
    dir: null,
    hero: { file: "hero.jpg", alt: "Funafuti's runway tarmac at golden hour with the terminal building behind" },
    gallery: [
      { file: "g1.jpg", key: "g1jpg", alt: "The Fiji Airways ATR 72 parked at Funafuti's terminal - the only way in" },
      { file: "g2.jpg", key: "g2jpg", alt: "Two kids cycling across the bare coral flat under a huge sky" },
      { file: "g3.jpg", key: "g3jpg", alt: "The rubble spit running out from Fongafale's southern arm" },
      { file: "g4.jpg", key: "g4jpg", alt: "The road north through a green tunnel of palms and pandanus" },
      { file: "g5.jpg", key: "g5jpg", alt: "Lunch at the Funafuti Lagoon Hotel, the country's one working restaurant" },
      { file: "g6.jpg", key: "g6jpg", alt: "The rusting tugboat beached on the lagoon shore" },
    ],
    trackLine: "tracklines/tuvalu-2-days.json",
    pdf: {
      path: "content/countries/tuvalu/guides/tuvalu-2-days/TestedRoutes_Tuvalu_Guide_2_Days.pdf",
      filename: "TestedRoutes_Tuvalu_Guide_2_Days.pdf",
    },
  },

  doc: {
    title: "Tuvalu: 2 Days in the World's Least-Visited Country",
    slug: { _type: "slug", current: "tuvalu-2-days" },
    storyId: "tuvalu-2-days-2026",
    language: "en",
    status: "published",
    publishedDate: "2026-08-13",
    lastUpdated: "2026-08-13",
    author: { _ref: "author-paulius-pikelis", _type: "reference" },
    testedBy: "pikelis",
    testedWith: ["adult travelers"],

    eyebrow: "TUVALU • 2-DAY ISLAND STAY • FUNAFUTI",
    subtitle:
      "Two days between flights on Funafuti – the runway at dusk, the lagoon islets, and how it all actually works.",
    metaTitle: "Tuvalu: 2 Days in the World's Least-Visited Country",
    metaDescription:
      "How to visit Tuvalu: the Fiji Airways flight gap, the one hotel and its restaurant, a lagoon boat day, and two days on Funafuti planned end to end.",


    // "My Experience" on the page - first person ON PURPOSE (founder, 2026-08-13):
    // this field renders under that heading and must read as the actual trip, not
    // a repeat of the guide pitch. Sourced from the three published inspire
    // stories; the guide/site no-"I" rule stands everywhere else on the doc.
    body: [
      paragraph("b1", "We went in December, on our honeymoon - the only honeymooners in the country. Tuvalu does that: a couple of flights a week from Fiji, and once you land you are there until the next one leaves, whether that suits you or not. One hotel, one restaurant, cash for everything. Once we stopped fighting how the place works, it became the point."),
      paragraph("b2", "The best day very nearly did not happen. We tried to arrange a boat to the empty islets on a Sunday, and nothing was moving - no boat, for any money, because the day belongs to church. The workaround came from a local tip: find someone who does not keep the same Sunday. A Jehovah's Witness couple took us across, soaking, on two plastic chairs in an open boat, and on the far side was a string of islands with nobody on any of them. Our footprints were the only ones; the two boatmen waded in and held the boat against the wind like living anchors."),
      paragraph("b3", "The rest of what stays is small and exact. The police gently stopping our evening stroll for devotion time, the fifteen minutes when the whole island pauses to pray. The prison with barely a fence and, when we looked in, one inmate. The runway at sunset, when a third of the country becomes its living room. The best meal we ate was the one our guesthouse host cooked. The guide is those three days with the near-misses removed - the boat arranged on day one instead of Sunday morning, and every step timed."),
    ],

    whatMakesThisSpecial:
      "The whole country in two days - the runway at dusk, three empty islets, and every practical step named.",
    highlights: [
      "The runway at dusk - football and half the town on the airstrip",
      "Tepuka - the postcard islet with nobody on it",
      "The narrowest point - about 60 metres of land between lagoon and ocean",
      "The green-tunnel road to Tengako's quiet beaches",
      "An honour-system prison and a one-desk airport",
    ],
    whyThisTrip: [
      "Two full days and a fly-out morning - matched exactly to the flight gap",
      "Every step timed, from the 13:30 hotel lunch to the dusk runway",
      "The boat day de-risked: where to ask, what a fair price is, and the fee to agree up front",
      "No car needed - the whole plan runs on foot, bicycle and one open boat",
      "The fallbacks named: two backup beds, the Sunday plan, and what a flight delay actually means",
    ],
    uniqueSellingPoints: [
      "Hour-by-hour timelines for both days and the departure morning",
      "The boat-day playbook: AUD 150-250 for the boat, arranged at the hotel desk on day one",
      "A costed budget in AUD and EUR - per person, all seven lines",
      "The runway rules: when it is the town square and when police clear it",
      "Google My Maps companion with every pin in the guide",
    ],
    whoThisIsFor: [
      "Country counters and completists - this is the hardest tick done properly",
      "Anyone routing through Fiji with three spare days",
      "Travellers who want the story nobody else at the table has",
      "Anyone who would rather follow a tested plan than piece one together",
    ],
    notSuitableIf: [
      "You want resorts, menus or nightlife - there is one hotel and one restaurant",
      "You cannot handle plans moving - weather holds the ATR in Suva more often than it cancels",
      "You need card payments everywhere - cash runs the island",
      "You want diving or surfing - this trip is walking, one boat day and a lagoon swim",
    ],

    primaryStats: [
      { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days" },
      { _key: "pace", _type: "primaryStat", label: "Pace", value: "Slow on purpose" },
      { _key: "access", _type: "primaryStat", label: "Access", value: "Fly via Fiji · ~3 flights a week" },
      { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · flat walking, one wet boat" },
      { _key: "season", _type: "primaryStat", label: "Season", value: "May to Oct dry season" },
    ],
    durationDays: 2,
    durationDisplay: "2 days, 3 on the ground",
    overallLevel: "easy",
    crowdLevel: "low",
    beginnerFriendly: true,
    familyFriendly: true,
    soloFriendly: true,
    idealGroupSize: "2 people",
    idealFor: ["country counters", "couples", "solo travellers", "story collectors"],

    difficultyAtAGlance: [
      "Flat walking everywhere - the highest ground in the country is a rubbish pile",
      "One wet 30-minute boat crossing each way; coral underfoot on two islets, reef shoes on",
      "The optional northern tip is about 10 km each way - ride a bicycle or scooter",
      "Heat and sun are the real difficulty: no shade on the water, none on the sand bars",
    ],
    commonMistakes: [
      "Leaving the boat unarranged until the boat day - start asking at the hotel desk on day one",
      "Landing without cash - Australian dollars run the island and the bank keeps short weekday hours",
      "Planning the trip over a Sunday without expecting the island to pause",
      "Wandering the far side of the runway on departure day - crossings close when the ATR appears",
      "Booking onward flights the same day you leave - keep a buffer night in Fiji",
    ],
    insiderTips: [
      "Sit left on the flight in for the atoll approach, right on the way out",
      "Swim the lagoon side: calm, shallow, warm - the ocean side is reef shelf and surf",
      "The stalls by the terminal appear only before a flight - if you see them, someone is leaving",
      "Evening devotion pauses the island around 18:45 - if police wave you off the road, wait out the minutes",
      "Postcards from one of the least-visited post offices on earth - the postmark is the souvenir",
    ],
    verifiedFacts: [
      "Fiji Airways flies Suva to Funafuti about three times a week; the weekdays rotate by season",
      "The Funafuti Lagoon Hotel holds the country's one working restaurant; two guesthouses are the backup beds",
      "The lagoon boat is arranged in person - AUD 150-250 per boat, fuel included, is a fair quote",
      "A 30-day visitor permit is stamped on arrival for most passports",
      "First ATMs arrived in 2025; card acceptance is new and patchy - carry the trip in cash",
    ],

    bookingsRequired: [
      "The flight pair from Suva - the gap between flights IS the trip length (3-6 months ahead)",
      "Funafuti Lagoon Hotel right after the flights - delegations fill it",
      "Nothing else books ahead: the boat, dinner and bikes are arranged on the island",
    ],
    bookingsAdvanceDays: 90,
    specialEquipment: [
      "reef shoes - coral underfoot on two of the three islets",
      "snorkel and mask - nowhere on the island rents them",
      "reef-safe sunscreen, hat and a shirt for the water",
      "dry bag - the lagoon crossing soaks everything loose",
      "AUD cash in mixed notes - the trip's real wallet",
      "power bank - power cuts happen",
      "Australian Type I adapter",
    ],
    rentalEquipmentAvailable: false,
    permitsRequired: false,

    budgetLevel: "moderate",
    accommodationType: "hotel",
    journeyStyle: "self_guided",
    journeyCategory: { _ref: "category-journey-weekend", _type: "reference" },
    routeMode: "hiking",
    timeOfDay: "multi_day",
    weatherDependent: true,
    snowSeasonAccessible: false,
    wheelchairAccessible: false,
    carRequired: false,
    fourByFourRequired: false,
    publicTransportAccessible: false,
    transportationRequired: ["plane", "boat"],
    transportationDifficulty: "moderate",
    nearestCity: "Suva",
    nearestCityDistanceKm: 1100,

    bestSeasons: ["summer"],
    bestMonths: [6, 7, 8, 9],
    avoidMonths: [12, 1, 2, 3],

    destination: { _ref: "destination-tuvalu", _type: "reference" },
    regions: ["Funafuti"],
    coordinates: { _type: "geopoint", lat: -8.52, lng: 179.19 },
    mapZoom: 11,
    startingPoint: {
      _type: "startingPoint",
      name: "Funafuti International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -8.524, lng: 179.1968 },
    },
    finishPoint: {
      _type: "startingPoint",
      name: "Funafuti International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -8.524, lng: 179.1968 },
    },
    routePoints: [
      { _key: "fun", _type: "routePoint", name: "Funafuti Airport", type: "start", coordinates: { _type: "geopoint", lat: -8.524, lng: 179.1968 } },
      { _key: "falekaupule", _type: "routePoint", name: "Vaiaku Falekaupule", type: "stop", coordinates: { _type: "geopoint", lat: -8.5249, lng: 179.195 } },
      { _key: "shipwreck", _type: "routePoint", name: "Swimming beach with shipwreck", type: "stop", coordinates: { _type: "geopoint", lat: -8.5262, lng: 179.1927 } },
      { _key: "runway", _type: "routePoint", name: "The runway at dusk", type: "highlight", coordinates: { _type: "geopoint", lat: -8.522, lng: 179.196 } },
      { _key: "tepuka", _type: "routePoint", name: "Tepuka", type: "highlight", coordinates: { _type: "geopoint", lat: -8.4627, lng: 179.0796 } },
      { _key: "fualifeke", _type: "routePoint", name: "Fualifeke", type: "highlight", coordinates: { _type: "geopoint", lat: -8.4281, lng: 179.1212 } },
      { _key: "narrowest", _type: "routePoint", name: "The narrowest point", type: "highlight", coordinates: { _type: "geopoint", lat: -8.4718, lng: 179.1895 } },
      { _key: "tengako", _type: "routePoint", name: "Tengako tip beaches", type: "stop", coordinates: { _type: "geopoint", lat: -8.4478, lng: 179.178 } },
      { _key: "return", _type: "routePoint", name: "Funafuti Airport", type: "end", coordinates: { _type: "geopoint", lat: -8.524, lng: 179.1968 } },
    ],
    activityTags: [
      "least-visited country", "atoll", "lagoon islets", "island walking",
      "boat day", "runway life", "off the beaten path", "Pacific",
    ],
    keywords: [
      "how to visit Tuvalu", "Tuvalu itinerary", "least visited country in the world",
      "Funafuti", "Tuvalu travel guide", "things to do in Tuvalu",
      "Fiji Airways Suva to Funafuti", "Tuvalu tourism",
    ],
    searchTags: [
      "Tuvalu 2 day itinerary", "how to get to Tuvalu",
      "Tuvalu travel", "visit Tuvalu from Fiji",
    ],
    searchSynonyms: ["Funafuti", "Fongafale", "Ellice Islands", "Vaiaku"],
    appearsInSearches: [
      "what is the least visited country in the world",
      "is Tuvalu worth visiting",
      "how to get to Tuvalu",
      "how many days do you need in Tuvalu",
      "things to do in Funafuti",
    ],
    alternativeNames: ["Funafuti atoll trip", "the least-visited country"],

    whatYouGet: [
      "Hour-by-hour timelines for both days and the departure morning, with the runway-closing rule built in",
      "The boat-day playbook: where to ask on day one, a fair price per boat, and the conservation fee to agree up front",
      "The three beds that exist, in booking order, with QR links - and what to do when the hotel is full",
      "A costed budget in AUD and EUR, per person, including the Fiji flight pair",
      "Cash, SIM, permits and Sunday - the practical layer nobody writes down",
      "Interactive Google My Maps companion with every pin in the guide",
    ],

    affiliateLinks: [
      { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    ],
    similarStories: [
      { _key: "honeymoon", _ref: "story-tuvalu-one-least-visited", _type: "reference" },
      { _key: "logistics", _ref: "story-tuvalu-flights-beds-sunday", _type: "reference" },
      { _key: "customs", _ref: "story-tuvalu-devotion-prison-runway", _type: "reference" },
    ],

    featuredInHomepage: false,

    guide: {
      _type: "guide",
      hasGuide: true,
      status: "available",
      format: ["PDF"],
      pages: 14,
      customPrices: [
        { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 29 },
        { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 29 },
        { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 29 },
        { _key: "usd", _type: "priceEntry", currency: "USD", amount: 35 },
      ],
      cardLine: "The world's least-visited country, planned end to end",
      dayStrip: "Arrival · Town on foot · Runway at dusk · Lagoon islets · Island tips · Fly out",
    },
  },
};

/**
 * kuwait-2-days: content for the Sanity story doc.
 *
 * Cloned from create-tuvalu-2-days-guide.mjs (the newest sibling, per the
 * production playbook). Every fact below comes from the sellable deck (the
 * founder's final pptx/PDF, 2026-08-14), the country master v24, meta.yaml or
 * Content Plan v54 - nothing is written from memory.
 *
 * Title, subtitle and metaTitle verbatim from the Content Plan Guides sheet.
 * The plan's meta-description cell was empty, so the one below was written for
 * this doc and copied back into the plan in the same session - the plan and
 * the site must say the same thing, in that order of authority.
 *
 * Prices are the Weekend rung of the pricing ladder (Content Plan v57 Pricing
 * tab, founder 2026-08-16): 15/15/19/15 EUR/CHF/USD/GBP. They are not derived
 * here - a 2-3 day guide is Weekend, and Weekend is 15. This replaced the
 * launch price of 19/19/25/19, which had been read off sibling guides before
 * a ladder existed. Repricing is a customPrices patch + polar sync; nothing
 * about the price is printed in the deck.
 *
 * The FCDO advisory: the founder's decision (2026-08-13, on the record in the
 * guide's meta.yaml) is to publish with an advisory note on the card rather
 * than shelve. notSuitableIf carries the check-your-government's-advice line
 * so the sales page says it before the buy button, matching deck slide 16.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-kuwait-2-days",

  assets: {
    // Where the hero and gallery sources live when publishing from
    // files. Absent on disk, publish-guide.mjs carries forward whatever
    // is already on the doc instead of failing or, worse, publishing blank.
    // Originally: C:\Users\pauli\AppData\Local\Temp\claude\C--Users-pauli-Desktop-TestedRoutes---Website\0eccd96c-743d-4884-9e24-4abb043cb963\scratchpad\guide-assets-kuwait-2d
    dir: null,
    hero: { file: "hero.jpg", alt: "The wooden pier at Souq Sharq marina at night, lit skyline behind" },
    gallery: [
      { file: "g1.jpg", key: "g1jpg", alt: "The open-air food courtyard of Souk Al-Mubarakiya under its timber roof" },
      { file: "g2.jpg", key: "g2jpg", alt: "Wooden dhows moored hull to hull at the dhow harbour" },
      { file: "g3.jpg", key: "g3jpg", alt: "Kuwait Towers against the low winter sun from the promenade" },
      { file: "g4.jpg", key: "g4jpg", alt: "The fish market hall with the day's catch on the counters" },
      { file: "g5.jpg", key: "g5jpg", alt: "A winter desert camp lit up after dark" },
      { file: "g6.jpg", key: "g6jpg", alt: "The Kuwait City skyline across the bay from the causeway" },
    ],
    trackLine: "tracklines/kuwait-2-days.json",
    pdf: {
      path: "content/countries/kuwait/guides/kuwait-2-days/TestedRoutes_Kuwait_Guide_2_Days.pdf",
      filename: "TestedRoutes_Kuwait_Guide_2_Days.pdf",
    },
  },

  doc: {
    title: "Kuwait in 2 Days: A Weekend Itinerary",
    slug: { _type: "slug", current: "kuwait-2-days" },
    storyId: "kuwait-2-days-2026",
    language: "en",
    status: "published",
    publishedDate: "2026-08-14",
    lastUpdated: "2026-08-14",
    author: { _ref: "author-paulius-pikelis", _type: "reference" },
    testedBy: "pikelis",
    testedWith: ["adult travelers"],

    eyebrow: "KUWAIT • 2-DAY CITY + DESERT • KUWAIT CITY",
    subtitle: "The underrated Gulf city.",
    metaTitle: "Kuwait in 2 Days: A Weekend Itinerary",
    metaDescription:
      "Kuwait in two days, tested: the old souk and Grand Mosque, the dhow harbour, a ferry to Failaka island, and the winter desert camps lighting up at dusk.",


    // "My Experience" - first person ON PURPOSE (founder rule, 2026-08-13):
    // this field renders under that heading and must read as the actual trip.
    // Sourced from the two published inspire stories; the no-"I" rule stands
    // everywhere else on the doc.
    body: [
      paragraph("b1", "Kuwait was a deliberate layover: I landed in the morning with a flight out late at night, and the city fit into the day. It nearly ended at the airport, though - my visa, approved months earlier, had expired before I ever used it. Visa on arrival saved the day in about forty-five minutes, and the lesson applies everywhere: check the expiry date, not just the approval."),
      paragraph("b2", "The city's hits fit into an afternoon: the old market at Mubarakiya, where I had the lanes nearly to myself, Safat Square and the Liberation Tower, the dhow port with hundreds of wooden ships moored hull to hull, the fish market with the day's catch coming in, then a ticket up Kuwait Towers for the panorama. Nobody walks in Kuwait - I enjoyed being the only pedestrian in the capital, but the trip runs on a car."),
      paragraph("b3", "Done by four, I crossed the long causeway over the bay to see what was on the other side. Desert, at first: highways, power lines, an empty beach. Then, as darkness fell, lights began appearing on both sides of the road - whole villages of tents. I had driven into Kuwait's winter camping season, the country's favourite tradition, and the puzzle of the empty daytime capital solved itself. This guide is that day done properly, plus the second day I had to research my way onto: the boat to Failaka island, which almost nobody takes."),
    ],

    whatMakesThisSpecial:
      "A Gulf capital done in a weekend - the old souk and the dhows on day one, a Bronze-Age island and the desert at dusk on day two.",
    highlights: [
      "Souk Al-Mubarakiya - two hundred years of market under one roof",
      "The dhow harbour - wooden ships moored hull to hull",
      "Kuwait Towers - the whole bay from a sphere that turns at 123 m",
      "Failaka island - tank graveyard, ruins and a Bronze-Age site by boat",
      "The winter desert camps lighting up at dusk",
    ],
    whyThisTrip: [
      "Two full days matched to a weekend - fly in early, fly out late on day two",
      "Every step timed, from the visa queue to the last light in the desert",
      "The Failaka ferry de-risked: tide-shifted sailings, the WhatsApp number, and the ticket rule",
      "The Kuwaiti week decoded - why Sunday to Thursday is when this guide works",
      "The fallbacks named: the wet-weather day two, the driver-guide alternative, and what to cut",
    ],
    uniqueSellingPoints: [
      "Hour-by-hour timelines for both days",
      "The ferry playbook: KWD 15 return, times posted monthly, confirmed by WhatsApp",
      "A costed budget in three tiers - per person, for two sharing",
      "Nine hotels and nine restaurants, each with a QR link",
      "Google My Maps companion with every pin in the guide",
    ],
    whoThisIsFor: [
      "Long-layover and stopover travellers routing through the Gulf",
      "Country counters who want Kuwait done properly, not just the airport",
      "Travellers curious about the Gulf beyond Dubai's version of it",
      "Anyone who would rather follow a tested plan than piece one together",
    ],
    notSuitableIf: [
      "You want nightlife or a drink with dinner - alcohol is illegal everywhere in Kuwait",
      "You are not comfortable driving - the city runs on cars, and the trip does too",
      "You want beaches and resorts - this is a city, an island and a desert, not a beach holiday",
      "You book without checking your government's travel advice for Kuwait - conditions in the region have changed quickly; read it before you book and again before you fly",
    ],

    primaryStats: [
      { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days, 1 night" },
      { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days, early starts" },
      { _key: "access", _type: "primaryStat", label: "Access", value: "Fly to KWI · visa on arrival for most" },
      { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · city driving, flat walking" },
      { _key: "season", _type: "primaryStat", label: "Season", value: "November to March" },
    ],
    durationDays: 2,
    durationDisplay: "2 days, 1 night",
    overallLevel: "easy",
    crowdLevel: "low",
    beginnerFriendly: true,
    familyFriendly: true,
    soloFriendly: true,
    idealGroupSize: "2 people",
    idealFor: ["stopover travellers", "country counters", "couples", "solo travellers"],

    difficultyAtAGlance: [
      "Flat, easy walking - the difficulty is logistics, not terrain",
      "City driving is fast with loose lane discipline; cameras are everywhere",
      "The Failaka crossing is 30-40 minutes by boat, tide-dependent",
      "Never drive off-road in the desert - landmines and unexploded ordnance remain",
    ],
    commonMistakes: [
      "Landing on a Friday - no mosque tours, Sadu House shut, the souk trades evenings only",
      "Trusting an e-visa's approval date - check the expiry; visa on arrival is the fallback",
      "Leaving the ferry unconfirmed - sailings shift with the tides and are posted a month at a time",
      "Assuming the desert camps are always there - they exist from about mid-November to mid-March",
      "Packing duty-free alcohol - it is seized at the airport",
    ],
    insiderTips: [
      "Land later than 08:00? Take the 10:00 or 11:00 mosque slot - plan two hours from landing",
      "Buy the ferry ticket at the Marina office the evening before and bring a passport copy",
      "Go up Kuwait Towers for the last hour of light - sunset runs 16:50 to 18:10 in season",
      "Lunch in the souk's open courtyard around Masjid Al-Bahar - tea brewed over coals",
      "Stay in Sharq and most of day one is walkable from the door",
    ],
    verifiedFacts: [
      "Visa on arrival takes about 45 minutes for most nationalities",
      "Grand Mosque tours run Sunday to Thursday only - free, 45-90 minutes, and the Awqaf form is the reservation",
      "The Failaka ferry is KWD 15 return; times shift with the tides and are posted monthly",
      "The Cultural Centre (ASCC) is closed on Sundays",
      "Alcohol is illegal everywhere; photographing government, military or oil sites is a criminal offence",
    ],

    bookingsRequired: [
      "The Grand Mosque tour form - the one booking to make before you fly (2-4 weeks ahead)",
      "The rental car with an International Driving Permit issued at home (3-4 weeks ahead)",
      "The Failaka sailing - confirm your date by WhatsApp, then buy in person a day ahead",
    ],
    bookingsAdvanceDays: 30,
    specialEquipment: [
      "International Driving Permit - rental desks ask for it and it must be issued at home",
      "a passport copy - the coast guard asks for one at the ferry",
      "a jacket for winter evenings - the sea wind does its job",
      "cash in small dinar notes for the souk and the island bus",
    ],
    rentalEquipmentAvailable: false,
    permitsRequired: false,

    budgetLevel: "moderate",
    accommodationType: "hotel",
    journeyStyle: "self_guided",
    journeyCategory: { _ref: "category-journey-weekend", _type: "reference" },
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
    nearestCity: "Kuwait City",
    nearestCityDistanceKm: 16,

    bestSeasons: ["winter"],
    bestMonths: [11, 12, 1, 2, 3],
    avoidMonths: [5, 6, 7, 8, 9],

    destination: { _ref: "destination-kuwait", _type: "reference" },
    regions: ["Kuwait City", "Failaka Island", "Subiya desert"],
    coordinates: { _type: "geopoint", lat: 29.3759, lng: 47.9774 },
    mapZoom: 10,
    startingPoint: {
      _type: "startingPoint",
      name: "Kuwait International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: 29.22027, lng: 47.95516 },
    },
    finishPoint: {
      _type: "startingPoint",
      name: "Kuwait International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: 29.22027, lng: 47.95516 },
    },
    routePoints: [
      { _key: "kwi", _type: "routePoint", name: "Kuwait International Airport", type: "start", coordinates: { _type: "geopoint", lat: 29.22027, lng: 47.95516 } },
      { _key: "mosque", _type: "routePoint", name: "Grand Mosque of Kuwait", type: "highlight", coordinates: { _type: "geopoint", lat: 29.37959, lng: 47.97505 } },
      { _key: "souk", _type: "routePoint", name: "Souk Al-Mubarakiya", type: "highlight", coordinates: { _type: "geopoint", lat: 29.37388, lng: 47.97363 } },
      { _key: "fishmkt", _type: "routePoint", name: "The fish market", type: "stop", coordinates: { _type: "geopoint", lat: 29.38644, lng: 47.97931 } },
      { _key: "towers", _type: "routePoint", name: "Kuwait Towers", type: "highlight", coordinates: { _type: "geopoint", lat: 29.38992, lng: 48.00329 } },
      { _key: "marina", _type: "routePoint", name: "Marina Crescent - the Failaka ferry", type: "stop", coordinates: { _type: "geopoint", lat: 29.3409707, lng: 48.0632441 } },
      { _key: "failaka", _type: "routePoint", name: "Failaka Heritage Village", type: "highlight", coordinates: { _type: "geopoint", lat: 29.4468798, lng: 48.2752529 } },
      { _key: "tanks", _type: "routePoint", name: "Failaka tank graveyard", type: "highlight", coordinates: { _type: "geopoint", lat: 29.46287, lng: 48.29891 } },
      { _key: "causeway", _type: "routePoint", name: "Sheikh Jaber Al-Ahmad Causeway", type: "stop", coordinates: { _type: "geopoint", lat: 29.3809852, lng: 47.9161525 } },
      { _key: "desert", _type: "routePoint", name: "Subiya desert camps", type: "highlight", coordinates: { _type: "geopoint", lat: 29.6302402, lng: 48.0706217 } },
      { _key: "redfort", _type: "routePoint", name: "Al Qasr Al Ahmar (Red Fort)", type: "stop", coordinates: { _type: "geopoint", lat: 29.34808, lng: 47.67985 } },
      { _key: "out", _type: "routePoint", name: "Kuwait International Airport", type: "end", coordinates: { _type: "geopoint", lat: 29.22027, lng: 47.95516 } },
    ],
    activityTags: [
      "city break", "souk", "desert", "island day trip", "Gulf",
      "stopover", "self-drive", "winter sun",
    ],
    keywords: [
      "Kuwait itinerary", "things to do in Kuwait", "Kuwait travel guide",
      "Kuwait City layover", "Failaka island", "Kuwait desert camps",
      "is Kuwait worth visiting", "Kuwait 2 days",
    ],
    searchTags: [
      "Kuwait 2 day itinerary", "Kuwait weekend trip",
      "Kuwait City what to do", "Kuwait stopover",
    ],
    searchSynonyms: ["Kuwait City", "Al Kuwayt", "Mubarakiya", "Failaka", "KWI"],
    appearsInSearches: [
      "is Kuwait worth visiting",
      "what to do in Kuwait in one day",
      "Kuwait layover what to do",
      "how many days do you need in Kuwait",
      "can you visit Failaka island",
    ],
    alternativeNames: ["Kuwait City weekend", "Kuwait stopover trip"],

    whatYouGet: [
      "Hour-by-hour timelines for both days, from the visa queue to the last light in the desert",
      "The Failaka ferry playbook: the WhatsApp number, the ticket rule, and what the island bus covers",
      "Nine hotels in three bands and nine restaurants, each with a QR link",
      "A costed three-tier budget per person, for two sharing",
      "The Kuwaiti week decoded - what closes on Friday, and why Sunday to Thursday is the window",
      "Interactive Google My Maps companion with every pin in the guide",
    ],

    affiliateLinks: [
      { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    ],
    similarStories: [
      { _key: "layover", _ref: "story-kuwait-layover-one-day", _type: "reference" },
      { _key: "camps", _ref: "story-kuwait-desert-tent-camps", _type: "reference" },
    ],

    featuredInHomepage: false,

    guide: {
      _type: "guide",
      hasGuide: true,
      status: "available",
      format: ["PDF"],
      pages: 18,
      customPrices: [
        { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 15 },
        { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 15 },
        { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 15 },
        { _key: "usd", _type: "priceEntry", currency: "USD", amount: 19 },
      ],
      cardLine: "The Gulf capital, a Bronze-Age island and the desert at dusk",
      dayStrip: "Old town on foot · Kuwait Towers · Failaka by boat · Desert at dusk · Fly out",
    },
  },
};

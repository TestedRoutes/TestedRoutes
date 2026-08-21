/**
 * fiji-honeymoon-14-days: content for the Sanity story doc.
 *
 * Every fact below comes from the sellable deck (the founder's final PDF,
 * 2026-08-21, 36 pages), the Fiji country master v9 or Content Plan v60 -
 * nothing is written from memory. Title and subtitle verbatim from the
 * Content Plan Guides sheet; the plan's meta-description cell was empty, so
 * the string here was authored with the doc and copied back into the plan in
 * the same session (the plan is the register; the site is the render).
 *
 * Prices are the plan's 2-week rung: 49/49/49 EUR/CHF/GBP with the USD
 * uplift to 59, matching the ladder set 2026-08-16.
 *
 * No trackLine on purpose: the route is boats and small planes, not roads,
 * so there is no OSRM polyline to derive. The site falls back to connecting
 * routePoints in order, which for an island-hopping route IS the honest
 * line - straight water legs between stops.
 *
 * Longitudes past the antimeridian are stored as >180 (Taveuni's -179.88
 * becomes 180.12). Leaflet fits bounds on a continuous plane, so the
 * negative form would span the map the long way around the world and the
 * route line would cross Africa. Rainbow Reef at 179.92 sits on the same
 * side already.
 *
 * "My Experience" body is first person ON PURPOSE (founder rule,
 * 2026-08-13): it renders under that heading and must read as the actual
 * trip. It is written from the six published Fiji inspire stories (the
 * honeymoon comparison, the shark dive, Sawa-i-Lau, the kava ceremony, the
 * Great White Wall) and claims nothing beyond them.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-fiji-honeymoon-14-days",

  assets: {
    // Hero and gallery were uploaded on the first publish from a scratchpad
    // set drawn from the founder-curated pools (website-card cull + the
    // published inspire stories' photos). Absent on disk, publish-guide.mjs
    // carries forward whatever is already on the doc.
    dir: null,
    hero: { file: "hero.jpg", alt: "Looking down over a green Yasawa island ridge to turquoise reef water and an offshore islet, Fiji" },
    gallery: [
      { file: "g1.jpg", key: "g1jpg", alt: "A beach bonfire at sunset beside calm water on a Fijian island" },
      { file: "g2.jpg", key: "g2jpg", alt: "A thatched beachfront bure under palms with sun loungers, Yasawa Islands, Fiji" },
      { file: "g3.jpg", key: "g3jpg", alt: "Green seawater inside the limestone chambers of the Sawa-i-Lau caves, Fiji" },
      { file: "g4.jpg", key: "g4jpg", alt: "A diver signalling OK as reef sharks circle behind him, Yasawa Islands, Fiji" },
      { file: "g5.jpg", key: "g5jpg", alt: "A resort bed made up with BULA spelled in leaves and hibiscus flowers, Fiji" },
      { file: "g6.jpg", key: "g6jpg", alt: "The chalked activities board at a Yasawa island resort, Fiji" },
    ],
    pdf: {
      path: "content/countries/fiji/guides/fiji-honeymoon-14-days/final/TestedRoutes_Fiji_14-day-honeymoon.pdf",
      filename: "TestedRoutes_Fiji_14-day-honeymoon.pdf",
    },
  },

  doc: {
    title: "Fiji Honeymoon: A 2-Week Itinerary",
    slug: { _type: "slug", current: "fiji-honeymoon-14-days" },
    storyId: "fiji-honeymoon-14-days-2026",
    language: "en",
    status: "published",
    publishedDate: "2026-08-21",
    lastUpdated: "2026-08-21",
    author: { _ref: "author-paulius-pikelis", _type: "reference" },
    testedBy: "pikelis",
    testedWith: ["adult travelers"],

    eyebrow: "FIJI • 14-DAY HONEYMOON • YASAWAS & TAVEUNI",
    subtitle: "Which island for which couple – mainland vs resort.",
    metaTitle: "Fiji Honeymoon: A 2-Week Itinerary",
    metaDescription:
      "A tested 14-day Fiji honeymoon itinerary: three Yasawa island stops on the Bula Pass, the Kuata shark dive, the manta channel, then Taveuni's Rainbow Reef.",

    // "My Experience" - first person ON PURPOSE (see the header comment).
    body: [
      paragraph("b1", "Fiji was our honeymoon - December into the New Year - and we did it the way this guide now runs: a few nights on the mainland, then out into the Yasawas, resort to resort up the chain. The moment the catamaran started weaving between the islets I understood what people fly here for. Denarau is where you land, change money and catch the boat; the postcard is out on the water."),
      paragraph("b2", "The islands delivered a range no single resort could. I knelt behind a rubble wall while sharks worked a bait ball an arm's length away - my wife stayed on the beach with her book and rated her morning higher. We swam the half-flooded chambers at Sawa-i-Lau, drank kava when the bowl came round, and learned that when the lali drum beats you drop everything, because the mantas set the timing."),
      paragraph("b3", "Then on Christmas morning off Taveuni we hit the Great White Wall on the right tide: a cliff face of white soft coral falling away further than I could see. This guide is that trip rebuilt in the order I would do it again - the three island stops chosen, the boats and the helicopter timed, and the tide-dependent wall given the flexible day it needs."),
    ],

    whatMakesThisSpecial:
      "Two completely different Fijis in one honeymoon - three Yasawa stops timed to the one daily catamaran, then Taveuni's rainforest and the reef that made Fiji famous.",
    highlights: [
      "Three Yasawa islands, two nights each - the shark stop, the manta channel, the Blue Lagoon",
      "The Awakening shark dive at Kuata, with an introductory option that needs no licence",
      "The manta channel - snorkel with rays when the lali drum beats",
      "Sawa-i-Lau - half-flooded limestone caves you swim into",
      "Taveuni - rainforest, waterfalls and the Rainbow Reef's Great White Wall",
    ],
    whyThisTrip: [
      "The 2+2+2 island pattern matched to how the Yasawa Flyer actually runs",
      "A pick at every stop, with the budget and splurge alternates named and priced",
      "The helicopter back on Day 10 instead of losing the day to the sea",
      "Both dive days planned against the 18-hour flying-after-diving clock",
      "A buffer day where it belongs - between the small plane and the long-haul home",
    ],
    uniqueSellingPoints: [
      "Hour-by-hour timelines for all 14 days",
      "The Yasawa Flyer timetable decoded, with the Bula Pass and helicopter maths",
      "Every bed in the guide priced, from dorm bunk to private-island splurge",
      "A costed three-tier budget per person, for two sharing",
      "Google My Maps companion with every pin in the guide",
    ],
    whoThisIsFor: [
      "Honeymooners who want more than one resort's beach for two weeks",
      "Couples deciding between the mainland, the islands and a package",
      "Snorkellers and divers - only the wall needs a licence",
      "Anyone who would rather follow a tested plan than piece one together",
    ],
    notSuitableIf: [
      "You want one resort and zero transit days - this trip moves seven times",
      "Boats are a problem - the longest Flyer leg is 4 h 45 in open water",
      "You need everything payable by card - village gates and taxis run on cash",
      "The trip is built around mantas in December - they feed May to October",
    ],

    primaryStats: [
      { _key: "duration", _type: "primaryStat", label: "Duration", value: "14 days, 14 nights" },
      { _key: "pace", _type: "primaryStat", label: "Pace", value: "Resort days, real transit days" },
      { _key: "access", _type: "primaryStat", label: "Access", value: "Fly to NAN · visa on arrival for most" },
      { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · only the wall needs a licence" },
      { _key: "season", _type: "primaryStat", label: "Season", value: "May to Oct dry · Nov to Apr wet" },
    ],
    durationDays: 14,
    durationDisplay: "14 days, 14 nights",
    overallLevel: "easy",
    crowdLevel: "moderate",
    beginnerFriendly: true,
    familyFriendly: false,
    soloFriendly: false,
    idealGroupSize: "2 people",
    idealFor: ["couples", "honeymooners", "snorkellers", "divers"],

    difficultyAtAGlance: [
      "Easy throughout - resort living with boat transfers that land on beaches",
      "Snorkelling needs no licence: the reef sharks, the manta channel, the caves",
      "The Great White Wall is the one advanced item: 25 to 30 m, certified divers only",
      "The longest boat leg is 4 h 45 on the Yasawa Flyer - pack motion-sickness tablets",
    ],
    commonMistakes: [
      "Comparing island beds without the meal plan - it is compulsory on most islands and half the cost",
      "Turning up for Castaway - the day boat is capped at 20 seats, book before you fly",
      "Walking to the wrong Nadi terminal - international and domestic are separate buildings",
      "Building a December trip around seeing a manta - they feed May to October",
      "Adding an afternoon dive on Day 13 - it breaks the 18-hour flying-after-diving margin",
    ],
    insiderTips: [
      "Read the activities board the moment you land on each island - almost none of it is online",
      "When the lali drum beats, drop everything and get to the boat",
      "Ask the dive shop about the wall's tide windows on Day 12, and keep Day 13 flexible",
      "Pack to 15 kg from home - it is the checked limit on the helicopter and the Taveuni flights alike",
      "Carry small Fijian-dollar notes from day one - taxis, park gates and villages are cash",
    ],
    verifiedFacts: [
      "One catamaran runs the Yasawa chain once a day each way, leaving Port Denarau by 08:45",
      "The Yasawa Flyer never docks at the islands - each resort sends its own boat out to meet it",
      "The Awakening shark dive runs at 08:00 and 11:00 daily off Kuata",
      "Island Hoppers flies the northern chain back to Nadi in about 25 minutes",
      "Fiji is not a malaria zone, and a visitor permit on arrival covers most passports",
    ],

    bookingsRequired: [
      "All 14 hotel nights, 3-6 months ahead - island beds first, they set the route",
      "The Bula Pass and the Nadi to Taveuni flights, 1-2 months ahead",
      "The helicopter, the Castaway day boat and the sunset cruise, about a month ahead",
      "The Rainbow Reef dive days, about a month ahead",
    ],
    bookingsAdvanceDays: 120,
    specialEquipment: [
      "reef shoes - coral underfoot and the Lavena stream crossing",
      "reef-safe sunscreen - you are in the water daily",
      "a dry bag - boat transfers land on beaches and bags ride in spray",
      "your own snorkel mask if fit matters to you",
      "a Type I power adapter - the Australia / NZ pin layout",
      "certification card and logbook for the dive days",
    ],
    rentalEquipmentAvailable: true,
    permitsRequired: false,

    budgetLevel: "moderate",
    accommodationType: "hotel",
    journeyStyle: "self_guided",
    // Multi-week tier (founder 2026-08-21): a 14-day SKU is not Week+. The
    // category-journey-multi-week doc was created with this guide; the chip
    // renders bg-brand-cat-multi (pink) via app/_lib/tripCategory.js.
    journeyCategory: { _ref: "category-journey-multi-week", _type: "reference" },
    routeMode: "mixed",
    timeOfDay: "multi_day",
    weatherDependent: true,
    snowSeasonAccessible: false,
    wheelchairAccessible: false,
    carRequired: false,
    fourByFourRequired: false,
    publicTransportAccessible: false,
    transportationRequired: ["boat", "plane", "taxi"],
    transportationDifficulty: "moderate",
    nearestCity: "Nadi",
    nearestCityDistanceKm: 12,

    // May-Oct dry season = the austral winter; Nov-Apr is the wet, cyclone
    // season. The deck sells December honestly ("what rain costs") but the
    // avoid list follows the deck's own season page, matching Samoa's.
    bestSeasons: ["winter"],
    bestMonths: [5, 6, 7, 8, 9, 10],
    avoidMonths: [12, 1, 2, 3],

    destination: { _ref: "destination-fiji", _type: "reference" },
    regions: ["Yasawa Islands", "Taveuni", "Nadi & Denarau"],
    coordinates: { _type: "geopoint", lat: -17.3, lng: 178.5 },
    mapZoom: 7,
    startingPoint: {
      _type: "startingPoint",
      name: "Nadi International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -17.753308, lng: 177.450758 },
    },
    finishPoint: {
      _type: "startingPoint",
      name: "Nadi International Airport",
      type: "airport",
      coordinates: { _type: "geopoint", lat: -17.753308, lng: 177.450758 },
    },
    // Route pins from the country master v9 (14D trio), in day order.
    // Taveuni-side longitudes are stored as >180 - see the header comment.
    routePoints: [
      { _key: "nan", _type: "routePoint", name: "Nadi International Airport", type: "start", coordinates: { _type: "geopoint", lat: -17.753308, lng: 177.450758 } },
      { _key: "hilton", _type: "routePoint", name: "Denarau Island", type: "stop", coordinates: { _type: "geopoint", lat: -17.768362, lng: 177.377492 } },
      { _key: "castaway", _type: "routePoint", name: "Castaway Island", type: "highlight", coordinates: { _type: "geopoint", lat: -17.735284, lng: 177.129375 } },
      { _key: "sleepinggiant", _type: "routePoint", name: "Garden of the Sleeping Giant", type: "stop", coordinates: { _type: "geopoint", lat: -17.713029, lng: 177.469247 } },
      { _key: "sabeto", _type: "routePoint", name: "Sabeto Hot Springs and Mud Pool", type: "stop", coordinates: { _type: "geopoint", lat: -17.718211, lng: 177.484435 } },
      { _key: "temple", _type: "routePoint", name: "Sri Siva Subramaniya Temple", type: "stop", coordinates: { _type: "geopoint", lat: -17.807254, lng: 177.415068 } },
      { _key: "crusoe", _type: "routePoint", name: "Robinson Crusoe Island", type: "stop", coordinates: { _type: "geopoint", lat: -18.055979, lng: 177.2874 } },
      { _key: "denarauport", _type: "routePoint", name: "Port Denarau Marina", type: "stop", coordinates: { _type: "geopoint", lat: -17.772825, lng: 177.380814 } },
      { _key: "octopus", _type: "routePoint", name: "Octopus Resort, Waya", type: "highlight", coordinates: { _type: "geopoint", lat: -17.276837, lng: 177.107057 } },
      { _key: "sharkdive", _type: "routePoint", name: "The Awakening Shark Dive, Kuata", type: "highlight", coordinates: { _type: "geopoint", lat: -17.361946, lng: 177.13437 } },
      { _key: "mantaray", _type: "routePoint", name: "Mantaray Island Resort, Nanuya Balavu", type: "highlight", coordinates: { _type: "geopoint", lat: -17.175631, lng: 177.184749 } },
      { _key: "mantachannel", _type: "routePoint", name: "The manta channel, Drawaqa", type: "highlight", coordinates: { _type: "geopoint", lat: -17.171958, lng: 177.191903 } },
      { _key: "coconutbeach", _type: "routePoint", name: "Coconut Beach Resort, Nacula", type: "stop", coordinates: { _type: "geopoint", lat: -16.933875, lng: 177.357662 } },
      { _key: "sawailau", _type: "routePoint", name: "Sawa-i-Lau Caves", type: "highlight", coordinates: { _type: "geopoint", lat: -16.850966, lng: 177.466709 } },
      { _key: "bluelagoon", _type: "routePoint", name: "The Blue Lagoon", type: "highlight", coordinates: { _type: "geopoint", lat: -16.91182, lng: 177.38223 } },
      { _key: "matei", _type: "routePoint", name: "Taveuni Airport (Matei)", type: "stop", coordinates: { _type: "geopoint", lat: -16.688113, lng: 180.118937 } },
      { _key: "tavoro", _type: "routePoint", name: "Tavoro Falls, Bouma", type: "highlight", coordinates: { _type: "geopoint", lat: -16.8268796, lng: 180.1213125 } },
      { _key: "lavena", _type: "routePoint", name: "Lavena Coastal Walk", type: "highlight", coordinates: { _type: "geopoint", lat: -16.872341, lng: 180.098606 } },
      { _key: "rainbowreef", _type: "routePoint", name: "Rainbow Reef", type: "highlight", coordinates: { _type: "geopoint", lat: -16.784602, lng: 179.92309 } },
      { _key: "whitewall", _type: "routePoint", name: "Great White Wall", type: "highlight", coordinates: { _type: "geopoint", lat: -16.7754, lng: 179.899 } },
      { _key: "out", _type: "routePoint", name: "Nadi International Airport", type: "end", coordinates: { _type: "geopoint", lat: -17.753308, lng: 177.450758 } },
    ],
    activityTags: [
      "island hopping", "snorkelling", "diving", "honeymoon", "beaches",
      "South Pacific", "boat travel", "waterfalls",
    ],
    // Same list as the PDF's /Keywords - the PDF and the sales page must
    // never disagree (playbook §15.1).
    keywords: [
      "Fiji honeymoon itinerary", "Fiji 2 week itinerary", "Yasawa Islands",
      "Bula Pass", "Yasawa Flyer", "Taveuni", "Rainbow Reef",
      "manta snorkelling", "Sawa-i-Lau", "Fiji island hopping",
    ],
    searchTags: [
      "Fiji honeymoon itinerary", "Fiji 14 day itinerary",
      "Fiji 2 week itinerary", "Yasawa Islands itinerary",
    ],
    searchSynonyms: ["Yasawas", "Nadi", "Denarau", "Taveuni", "NAN", "Bula Pass"],
    appearsInSearches: [
      "how many days do you need in Fiji",
      "Fiji honeymoon where to stay",
      "Yasawa Islands or Mamanucas",
      "is Fiji worth it for a honeymoon",
      "how to get to Taveuni",
    ],
    alternativeNames: ["Fiji two-week honeymoon itinerary", "Yasawas and Taveuni itinerary"],

    whatYouGet: [
      "Hour-by-hour timelines for all 14 days, from the first landing to the buffer day",
      "The Yasawa Flyer timetable decoded, with the Bula Pass and helicopter maths",
      "Every bed priced at all seven stops, dorm bunk to private-island splurge, each with a QR link",
      "A costed three-tier budget per person, for two sharing",
      "The dive clock, the two Nadi terminals and the meal-plan trap - planned around, not discovered",
      "Interactive Google My Maps companion with every pin in the guide",
    ],

    affiliateLinks: [
      { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
      { _key: "saily", _ref: "affiliateLink-saily-esim", _type: "reference" },
      { _key: "nordvpn", _ref: "affiliateLink-nordvpn", _type: "reference" },
    ],

    similarStories: [
      { _key: "resortvsmainland", _ref: "story-fiji-honeymoon-resort-island-vs-mainland", _type: "reference" },
      { _key: "sharkdive", _ref: "story-fiji-yasawa-shark-dive", _type: "reference" },
      { _key: "whitewall", _ref: "story-fiji-taveuni-great-white-wall", _type: "reference" },
      { _key: "sawailau", _ref: "story-fiji-sawa-i-lau-caves", _type: "reference" },
    ],

    featuredInHomepage: false,

    guide: {
      _type: "guide",
      hasGuide: true,
      status: "available",
      format: ["PDF"],
      pages: 36,
      customPrices: [
        { _key: "eur", _type: "priceEntry", currency: "EUR", amount: 49 },
        { _key: "chf", _type: "priceEntry", currency: "CHF", amount: 49 },
        { _key: "gbp", _type: "priceEntry", currency: "GBP", amount: 49 },
        { _key: "usd", _type: "priceEntry", currency: "USD", amount: 59 },
      ],
      cardLine: "Three islands, the manta channel, then the Rainbow Reef",
      dayStrip: "Nadi · Castaway · Kava night · Sharks at Kuata · Manta channel · Blue Lagoon · Taveuni · Buffer day",
    },
  },
};

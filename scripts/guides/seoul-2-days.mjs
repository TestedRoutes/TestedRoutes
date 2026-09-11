/**
 * seoul-2-days: content for the Sanity story doc.
 *
 * Cloned from kuwait-2-days.mjs (the newest city-weekend sibling, per the
 * production playbook). Every fact below comes from the founder's FINAL deck
 * (final/TestedRoutes_Seoul_Guide_2_Days_vFinal.pdf, his v19 saved
 * 2026-09-11, 18 pages), the country master v9, meta.yaml, research/facts.md
 * or Content Plan v129 - nothing is written from memory.
 *
 * Title, subtitle and metaTitle verbatim from the Content Plan Guides sheet.
 * The plan's meta-description cell carries the same string as below (same-string
 * rule, playbook s1). `keywords` is the PDF's /Keywords list, verbatim, so the
 * file and the sales page never disagree.
 *
 * Prices are the Weekend rung of the pricing ladder (Content Plan Pricing tab,
 * founder 2026-08-16): 15/15/19/15 EUR/CHF/USD/GBP. Repricing is a
 * customPrices patch + polar sync; nothing about the price is printed.
 *
 * Two founder rules from the Seoul build that this copy has to keep obeying
 * (playbook v19 s0c): closures are notes, never the plan - the guide runs on
 * any two consecutive days and no sentence here names a weekday as the plan;
 * and essential reservations are the tour, the reserved table and the entry
 * paperwork - a bed is a choice on the hotels page, not a booking step.
 *
 * Published 2026-09-11. Hero and gallery were uploaded once from
 * generated/site-assets/ (the images the founder approved inside the deck:
 * deck-media/ picks, landscape only, the site hero slot is 4:3); dir stays
 * null so re-publishing carries the uploaded assets forward.
 *
 * No trackLine: a walking-and-metro route has no road geometry worth drawing;
 * the site connects routePoints in order when trackLine is absent.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-seoul-2-days",

  assets: {
    // Hero + gallery come from the founder's cull of deck-photos/ and
    // website-card/ (playbook s15.6). Until that cull lands, dir stays null
    // and publish-guide.mjs carries forward whatever is on the doc.
    dir: null,
    hero: { file: "hero.jpg", alt: "Gyeonghoeru pavilion on its stone pillars over the pond at Gyeongbokgung palace, Seoul" },
    gallery: [
      { file: "g1.jpg", key: "g1jpg", alt: "Geunjeongjeon, the throne hall of Gyeongbokgung, across its flagstone courtyard with Bugaksan behind" },
      { file: "g2.jpg", key: "g2jpg", alt: "The tiled roofs of Changdeokgung palace with the office towers of Seoul rising behind" },
      { file: "g3.jpg", key: "g3jpg", alt: "Tiled hanok roofs in Bukchon with the modern skyline behind them, Seoul" },
      { file: "g4.jpg", key: "g4jpg", alt: "Inside an Insadong teahouse: leather booths, low tables and a window onto the lane" },
      { file: "g5.jpg", key: "g5jpg", alt: "A Korean barbecue table in Myeongdong: meat on the grill, tongs and a ring of side dishes" },
      { file: "g6.jpg", key: "g6jpg", alt: "Seoul at night from Namsan, city lights running to the horizon" },
    ],
    trackLine: null,
    pdf: {
      path: "content/countries/south-korea/guides/seoul-2-days/final/TestedRoutes_Seoul_Guide_2_Days_vFinal.pdf",
      filename: "TestedRoutes_Seoul_Guide_2_Days.pdf",
    },
  },

  doc: {
    title: "Seoul in 2 Days: A Weekend Itinerary",
    slug: { _type: "slug", current: "seoul-2-days" },
    storyId: "seoul-2-days-2026",
    language: "en",
    status: "published",
    publishedDate: "2026-09-11",
    lastUpdated: "2026-09-11",
    author: { _ref: "author-paulius-pikelis", _type: "reference" },
    testedBy: "pikelis",
    testedWith: ["adult travelers"],

    eyebrow: "SOUTH KOREA • 2-DAY CITY WEEKEND • SEOUL",
    subtitle: "Palaces, food and city lights in 48 hours.",
    metaTitle: "Seoul in 2 Days: A Weekend Itinerary",
    metaDescription:
      "Seoul in two days, tested: the Secret Garden tour, a night in a Bukchon hanok, Gyeongbokgung in a hanbok, Myeongdong barbecue and N Seoul Tower after dark.",

    // "My Experience" - first person ON PURPOSE (founder rule, 2026-08-13):
    // this field renders under that heading and must read as the actual trip.
    // Sourced from the published inspire stories (seoul-weekend,
    // seoul-hanbok-palaces, seoul-hanok-night); the no-"I" rule stands
    // everywhere else on the doc.
    body: [
      paragraph("b1", "I had a long weekend from Hong Kong and a July heatwave, and Seoul rewarded it better than almost any big city I know: the good things sit close together and the metro does the rest. I walked the old city on foot - Sungnyemun gate, Deoksugung, the Cheonggyecheon stream, then Insadong for tea, where I ordered desserts I could not name and liked so much I went straight into a second teahouse. Changdeokgung's Secret Garden, which you can only see with a guide, was the highlight of the day."),
      paragraph("b2", "I ended in Bukchon at the end of the working day, fitted in like a fish in a barrel, and liked the neighbourhood enough to swap my tiny hotel for a night in a hanok there: sliding doors, tea on arrival, a view over the city, and in place of a bed, a mattress laid straight on the floor. The next afternoon I rented a hanbok at the gate of Gyeongbokgung - wear one and the palaces let you in free - and walked the throne-hall courtyards as Emperor Pau-Lee, fascinated, delighted and soaked through."),
      paragraph("b3", "Then Myeongdong, a thousand signs and a thousand snacks, a meat-and-heater dinner where the staff showed me what to do, and N Seoul Tower after dark, when the city is lights to every horizon. This guide is that weekend put in the right order: the garden tour anchored, Bukchon inside its visiting hours, every closing day printed on its stop, and the barbecue before the queue."),
    ],

    whatMakesThisSpecial:
      "Seoul's core in a weekend - the Secret Garden, a hanok night, the grand palace in a hanbok, barbecue and the city from Namsan after dark.",
    highlights: [
      "Changdeokgung's Secret Garden - the guided tour that anchors day two",
      "A night in a Bukchon hanok - sliding doors and a mattress on the floor",
      "Gyeongbokgung in a hanbok - free entry, and a different way to see it",
      "Myeongdong - barbecue at the table, street food from four",
      "N Seoul Tower after dark - the city lit to every horizon",
    ],
    whyThisTrip: [
      "Any two consecutive days, in either order - every stop that shuts prints its closing day and the stand-in beside it",
      "Both days timed, from the 10:30 garden tour to the last cable car down",
      "The closing days decoded: which palace shuts Monday, which Tuesday, and what to swap in",
      "Bukchon done inside its five o'clock visitor window, with the night spent behind it",
      "Nine beds and nine tables, each with a QR link, cheapest to splurge",
    ],
    uniqueSellingPoints: [
      "Hour-by-hour timelines for both days",
      "The Secret Garden booking rule: when the slots open and how to get one",
      "A costed budget in three tiers - per person, for two sharing, two nights",
      "Three hanok stays alongside six hotels, each with a QR link",
      "Google My Maps companion with every pin in the guide",
    ],
    whoThisIsFor: [
      "First-time visitors with a weekend, not a week",
      "Travellers routing through Seoul with two spare days",
      "Couples who want the old city and the evening city without a car",
      "Anyone who would rather follow a tested plan than piece one together",
    ],
    notSuitableIf: [
      "You want Busan, Gyeongju or Jeju - this is Seoul, and the rest of the country is a different trip",
      "You want the DMZ inside the two days - it is a third day, and the guide says so",
      "You cannot walk about 8 km a day on pavement - the plan is on foot",
      "You want nightlife - Seoul eats early, and the plan ends on a hill, not in a bar",
    ],

    primaryStats: [
      { _key: "duration", _type: "primaryStat", label: "Duration", value: "2 days, 2 nights" },
      { _key: "pace", _type: "primaryStat", label: "Pace", value: "Full days, one hard anchor" },
      { _key: "access", _type: "primaryStat", label: "Access", value: "Fly to Incheon · 90 days visa-free for most" },
      { _key: "effort", _type: "primaryStat", label: "Effort", value: "Easy · flat walking, about 8 km a day" },
      { _key: "season", _type: "primaryStat", label: "Season", value: "April to May · October to early November" },
    ],
    durationDays: 2,
    durationDisplay: "2 days, 2 nights",
    overallLevel: "easy",
    crowdLevel: "high",
    beginnerFriendly: true,
    familyFriendly: true,
    soloFriendly: true,
    idealGroupSize: "2 people",
    idealFor: ["first-time visitors", "couples", "solo travellers", "stopover travellers"],

    difficultyAtAGlance: [
      "Flat, easy walking on pavement and palace gravel - about 8 km a day",
      "The metro is signed in English and does every long hop; nobody rents a car",
      "One hill: the cable car takes it",
      "July and August are a wet 30 °C or more - the plan still runs, in the shade",
    ],
    commonMistakes: [
      "Not checking the closing days - Changdeokgung shuts Mondays, Gyeongbokgung Tuesdays, and each day page carries the swap",
      "Turning up for the Secret Garden without a slot - half the tickets sell online six days ahead",
      "Wandering Bukchon after five - the lanes are homes, and the fines are real",
      "Queueing for barbecue at seven - book Wangbijib on CatchTable, or be seated by half past five",
      "Opening Google Maps for directions - it will not route you in Korea; Naver or Kakao will",
    ],
    insiderTips: [
      "Wear a hanbok and every royal palace is free - rent it at opening, before the rush",
      "Book the 10:30 Secret Garden tour and build day two backwards from it",
      "Stay in a hanok in Bukchon: guests are not visitors, so the curfew does not apply to you",
      "Ride up Namsan after dinner - the view is the lights, not the daylight",
      "Buy a T-money card at the airport before the train and never think about tickets again",
    ],
    verifiedFacts: [
      "Gyeongbokgung closes Tuesdays; Changdeokgung, Deoksugung, Sungnyemun and Namsangol close Mondays",
      "The Secret Garden is guided-tour only: English tours at 10:30, 11:30, 14:30 and 15:30, 100 places, half online from six days ahead",
      "Hanbok wearers enter the royal palaces free - Korea Heritage Service policy",
      "Bukchon's residential lanes admit visitors 10:00 to 17:00, and the curfew is enforced with fines",
      "AREX Express: Incheon to Seoul Station nonstop in 43 minutes",
    ],

    bookingsRequired: [
      "The Secret Garden tour - online, six days before day two, the morning the slots open",
      "Entry paperwork - K-ETA is waived to 31 December 2026 for most EU, UK and US passports; without one, the e-Arrival Card three days before landing",
      "Balwoo Gongyang for the day-two lunch, the 13:30 sitting - a week ahead, closed Sundays, Gogung Insadong stands in",
    ],
    bookingsAdvanceDays: 7,
    specialEquipment: [
      "comfortable walking shoes - about 8 km a day",
      "a Type C / F adapter for UK and US plugs",
      "a T-money card, bought at the airport",
      "Naver Map or Kakao Map installed before landing",
    ],
    rentalEquipmentAvailable: true,
    permitsRequired: false,

    budgetLevel: "moderate",
    accommodationType: "guesthouse",
    journeyStyle: "self_guided",
    journeyCategory: { _ref: "category-journey-weekend", _type: "reference" },
    routeMode: "walking",
    timeOfDay: "multi_day",
    weatherDependent: false,
    snowSeasonAccessible: true,
    wheelchairAccessible: false,
    carRequired: false,
    fourByFourRequired: false,
    publicTransportAccessible: true,
    transportationRequired: ["train", "metro"],
    transportationDifficulty: "easy",
    nearestCity: "Seoul",
    nearestCityDistanceKm: 0,

    bestSeasons: ["spring", "autumn"],
    bestMonths: [4, 5, 10, 11],
    avoidMonths: [7, 8],

    destination: { _ref: "destination-south-korea", _type: "reference" },
    regions: ["Seoul", "Bukchon", "Myeongdong"],
    coordinates: { _type: "geopoint", lat: 37.5729, lng: 126.9838 },
    mapZoom: 13,
    startingPoint: {
      _type: "startingPoint",
      name: "Gyeongbokgung Palace",
      type: "landmark",
      coordinates: { _type: "geopoint", lat: 37.579617, lng: 126.977041 },
    },
    finishPoint: {
      _type: "startingPoint",
      name: "Gwangjang Market",
      type: "landmark",
      coordinates: { _type: "geopoint", lat: 37.570189, lng: 126.9994995 },
    },
    routePoints: [
      { _key: "gyeongbokgung", _type: "routePoint", name: "Gyeongbokgung Palace", type: "start", coordinates: { _type: "geopoint", lat: 37.579617, lng: 126.977041 } },
      { _key: "gwanghwamun", _type: "routePoint", name: "Gwanghwamun Square", type: "stop", coordinates: { _type: "geopoint", lat: 37.572389, lng: 126.9769117 } },
      { _key: "namsangol", _type: "routePoint", name: "Namsangol Hanok Village", type: "stop", coordinates: { _type: "geopoint", lat: 37.559315, lng: 126.994477 } },
      { _key: "myeongdong", _type: "routePoint", name: "Myeongdong", type: "highlight", coordinates: { _type: "geopoint", lat: 37.5637699, lng: 126.9844765 } },
      { _key: "tower", _type: "routePoint", name: "N Seoul Tower", type: "highlight", coordinates: { _type: "geopoint", lat: 37.5511694, lng: 126.9882266 } },
      { _key: "hanok", _type: "routePoint", name: "The hanok, Bukchon", type: "stop", coordinates: { _type: "geopoint", lat: 37.582296, lng: 126.984189 } },
      { _key: "changdeokgung", _type: "routePoint", name: "Changdeokgung Palace", type: "highlight", coordinates: { _type: "geopoint", lat: 37.5794309, lng: 126.9910426 } },
      { _key: "secretgarden", _type: "routePoint", name: "The Secret Garden", type: "highlight", coordinates: { _type: "geopoint", lat: 37.5821721, lng: 126.9931659 } },
      { _key: "bukchon", _type: "routePoint", name: "Bukchon Hanok Village", type: "highlight", coordinates: { _type: "geopoint", lat: 37.5825303, lng: 126.9836464 } },
      { _key: "baekinje", _type: "routePoint", name: "Baek In-je House", type: "stop", coordinates: { _type: "geopoint", lat: 37.5823845, lng: 126.9821147 } },
      { _key: "insadong", _type: "routePoint", name: "Insadong-gil", type: "stop", coordinates: { _type: "geopoint", lat: 37.5743033, lng: 126.9844135 } },
      { _key: "jogyesa", _type: "routePoint", name: "Jogyesa Temple", type: "stop", coordinates: { _type: "geopoint", lat: 37.5738369, lng: 126.982202 } },
      { _key: "deoksugung", _type: "routePoint", name: "Deoksugung Palace", type: "stop", coordinates: { _type: "geopoint", lat: 37.5658862, lng: 126.9749017 } },
      { _key: "sungnyemun", _type: "routePoint", name: "Sungnyemun Gate", type: "stop", coordinates: { _type: "geopoint", lat: 37.559984, lng: 126.9753071 } },
      { _key: "gwangjang", _type: "routePoint", name: "Gwangjang Market", type: "end", coordinates: { _type: "geopoint", lat: 37.570189, lng: 126.9994995 } },
    ],
    activityTags: [
      "city break", "palaces", "hanok stay", "hanbok", "street food", "Korean BBQ",
      "walking", "metro", "weekend",
    ],
    // Verbatim the PDF's /Keywords (fix_doc_metadata.py) - one list, two places.
    keywords: [
      "Seoul itinerary", "Seoul 2 days", "Seoul weekend", "Gyeongbokgung hanbok",
      "Changdeokgung Secret Garden", "Bukchon hanok stay", "Myeongdong", "N Seoul Tower",
      "South Korea travel guide",
    ],
    searchTags: [
      "Seoul 2 day itinerary", "Seoul weekend itinerary", "what to do in Seoul in 2 days",
      "Seoul first time",
    ],
    searchSynonyms: ["Seoul", "Bukchon", "Insadong", "Myeongdong", "Namsan", "ICN"],
    appearsInSearches: [
      "how many days do you need in Seoul",
      "is a weekend in Seoul enough",
      "Seoul itinerary 2 days",
      "how to book Changdeokgung Secret Garden",
      "hanok stay Seoul Bukchon",
    ],
    alternativeNames: ["Seoul weekend", "Seoul city break", "Seoul in 48 hours"],

    whatYouGet: [
      "Hour-by-hour timelines for both days, from the garden tour to the last cable car",
      "The closing-days rule that sets the order - and the swap if your weekend slips",
      "Nine beds, three of them hanok, and nine tables, each with a QR link",
      "A costed three-tier budget per person, for two sharing, two nights",
      "The Secret Garden booking rule, the hanbok mechanics and the Bukchon curfew, explained once",
      "Interactive Google My Maps companion with every pin in the guide",
    ],

    affiliateLinks: [
      { _key: "revolut", _ref: "affiliateLink-revolut", _type: "reference" },
    ],
    // The seven published South Korea stories, own trip first (playbook s15).
    similarStories: [
      { _key: "weekend", _ref: "story-seoul-weekend", _type: "reference" },
      { _key: "hanbok", _ref: "story-seoul-hanbok-palaces", _type: "reference" },
      { _key: "hanok", _ref: "story-seoul-hanok-night", _type: "reference" },
      { _key: "bbq", _ref: "story-seoul-korean-bbq-order", _type: "reference" },
      { _key: "july", _ref: "story-seoul-in-july", _type: "reference" },
      { _key: "dmz", _ref: "story-seoul-dmz-north-korea", _type: "reference" },
      { _key: "mud", _ref: "story-boryeong-mud-festival", _type: "reference" },
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
      cardLine: "The Secret Garden, a hanok night, a palace in a hanbok, and the city lit from Namsan",
      dayStrip: "Secret Garden · Bukchon hanok night · Gyeongbokgung in hanbok · Myeongdong BBQ · Namsan after dark",
    },
  },
};

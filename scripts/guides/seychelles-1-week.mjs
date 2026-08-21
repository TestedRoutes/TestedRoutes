/**
 * seychelles-1-week: content for the Sanity story doc.
 *
 * Source content: the sellable PDF and build spec under
 * content/countries/seychelles/guides/seychelles-7-days/, plus the PPTX
 * "at a glance" facts. Prices are the Week rung of the pricing ladder (Content
 * Plan v57 Pricing tab, founder 2026-08-16): EUR 29 / USD 35 / GBP 29 / CHF 29,
 * up from the EUR 19 / USD 22 / GBP 19 / CHF 19 this launched at. Still
 * customPrices, not a pricingTier ref - the tier docs hold stale launch numbers
 * and nothing reads them.
 *
 * Hand-ported 2026-08-16, not extracted like its twelve siblings: the original
 * create-seychelles-guide.mjs was the first of the family and is shaped
 * differently - wrapped in main(), random crypto _keys, and it creates the
 * country collection as well as the story. It was also the only one already
 * broken before this migration: its paths were relative and pointed at
 * content/countries/seychelles/guide/, which became .../guides/seychelles-7-days/
 * when the content tree was reorganised.
 *
 * The gallery keys below are the ones live in Sanity. They were generated
 * randomly at first publish, so they cannot be re-derived from anything - they
 * have to be carried, or the Studio treats the images as new items.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-seychelles-1-week",

  assets: {
    // The web derivatives this guide was published from are no longer on disk.
    // That is survivable: with no directory here, publish-guide.mjs carries the
    // existing Sanity assets forward rather than failing or blanking them.
    dir: null,
    hero: {
      file: "20260520_093038.jpg",
      alt: "Granite boulders, palms and white sand on La Digue, Seychelles",
    },
    gallery: [
      {
        file: "20260518_175802.jpg",
        key: "094912166d1f",
        alt: "Sunset over an empty Seychelles beach framed by palm fronds",
      },
      {
        file: "20260519_111312.jpg",
        key: "175b0077e6a4",
        alt: "Granite islet of St. Pierre in turquoise water off Praslin, Seychelles",
      },
      {
        file: "20260518_183832.jpg",
        key: "1a44426b5da6",
        alt: "Dusk on a Seychelles beach with a moored sailboat offshore",
      },
    ],
    pdf: {
      path: "content/countries/seychelles/guides/seychelles-7-days/final/TestedRoutes-Seychelles-7-days.pdf",
      filename: "TestedRoutes-Seychelles-1-week.pdf",
    },
  },

  // The country collection the story belongs to. Created if absent, never
  // overwritten - the original script did the same thing.
  companionDocs: [
    { _id: "collection-seychelles", _type: "collection", slug: { _type: "slug", current: "seychelles" } },
  ],

  doc: {
    activityTags: ["island hopping", "beach travel", "snorkelling", "ferry travel", "cycling", "wildlife"],
    allCollections: [
      {
        _key: "e5167c56b99b",
        _ref: "collection-seychelles",
        _type: "reference",
      },
      {
        _key: "57c082785a6a",
        _ref: "collection-island-travel",
        _type: "reference",
      },
    ],
    appearsInSearches: [
      "seychelles 7 day itinerary",
      "how many days do you need in Seychelles",
      "Seychelles itinerary without a tour",
      "Mahé Praslin La Digue ferry route",
    ],
    author: {
      _ref: "author-paulius-pikelis",
      _type: "reference",
    },
    bestMonths: [5, 6, 7, 8, 9, 10],
    body: [
      {
        _key: "0ee8a051ac14",
        _type: "block",
        children: [
          {
            _key: "3ffd306e0638",
            _type: "span",
            marks: [],
            text: "Seven days, four islands. On paper it sounds like the kind of trip where you spend more time queuing for ferries than actually being anywhere. It was not – it is one of the best-paced trips we have done, and it never once felt rushed.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "d0a44e11139b",
        _type: "block",
        children: [
          {
            _key: "c4575a936444",
            _type: "span",
            marks: [],
            text: "We rode bicycles through the dark to reach the most photographed beach on earth before the sun did, and had four empty coves almost to ourselves while the granite turned from grey to gold to pink. We shared a beach with giant tortoises over a hundred years old, walked into the only forest where the coco de mer grows wild, and ate the best meal of the whole trip at a takeaway counter we reached by bike.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "0adb3f6e29b4",
        _type: "block",
        children: [
          {
            _key: "c50aa8ee6050",
            _type: "span",
            marks: [],
            text: "What made it work was giving each island enough time to become itself – long enough on Mahé to drive the mountain roads and find the quiet beaches, long enough on Praslin for the jungle and the headline sand, and a proper couple of days on La Digue, which deserves them.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "b26fdb8b628c",
        _type: "block",
        children: [
          {
            _key: "25d320960135",
            _type: "span",
            marks: [],
            text: "This guide is that trip, rebuilt as the version I would book again – the same islands, the same mornings, the same tables, with everything we had to figure out already figured out.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    bookingsAdvanceDays: 30,
    bookingsRequired: [
      "Inter-island ferries (Cat Cocos, Seyferry)",
      "Curieuse day trip with a licensed operator",
      "Travel Authorization (TAS) before departure",
    ],
    budgetLevel: "moderate",
    commonMistakes: [
      "Assuming ferry tickets can be bought at the dock – they sell out in season",
      "Renting a car on La Digue, an island that runs on bicycles",
      "Arriving at Source d'Argent mid-morning with the day-tripper crowds",
      "Underestimating the sun because the heat feels mild",
    ],
    coordinates: {
      _type: "geopoint",
      lat: -4.6191,
      lng: 55.4513,
    },
    destination: {
      _ref: "destination-seychelles",
      _type: "reference",
    },
    difficultyAtAGlance: [
      "Terrain: easy – short coastal walks, flat cycling",
      "Sea: ferry crossings can be rough in season",
      "Sun: year-round equatorial UV – cover up midday",
      "Driving: left-hand traffic, narrow roads on Mahé and Praslin",
    ],
    durationDays: 7,
    durationDisplay: "7 days, 7 nights",
    eyebrow: "Seychelles · Island hopping · 7 days",
    faq: [
      {
        _key: "ef87c5fcbb71",
        answer: "A PDF, sized for A4 and designed to print. It opens on any phone, tablet or laptop and needs no app.",
        question: "What format is the guide?",
      },
      {
        _key: "7a15b0046d70",
        answer: "Straight after checkout. The download link arrives by email as well, so you can find it again later.",
        question: "When do I get it?",
      },
      {
        _key: "b186637a9003",
        answer: "Yes. Download it before you fly and it works with no signal. The companion Google map can be saved offline in Google Maps.",
        question: "Does it work offline?",
      },
      {
        _key: "3ed17c2ae4b9",
        answer: "A Google map with every place in the guide already pinned, with a short note on each. It opens inside the Google Maps app you already use.",
        question: "What is the map?",
      },
      {
        _key: "23b1862bd587",
        answer: "Yes, and a lot of people do. It is laid out for A4.",
        question: "Can I print it?",
      },
      {
        _key: "51cc9a83591d",
        answer: "Tell us at feedback@testedroutes.com. Verified corrections go into the next edition and we will usually credit you for the trouble.",
        question: "What if something has changed since publication?",
      },
      {
        _key: "96036bdf978b",
        answer: "Yes, with your immediate travel party. Public sharing, reselling and file-sharing sites are not allowed.",
        question: "Can I share it with the people I am travelling with?",
      },
      {
        _key: "0f1b0b9e8358",
        answer: "30-day refund, no questions asked. Email refunds@testedroutes.com.",
        question: "What if it is not what I expected?",
      },
    ],
    finishPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: -4.6743,
        lng: 55.5218,
      },
      name: "Mahé International Airport (SEZ)",
      type: "airport",
    },
    guide: {
      _type: "guide",
      cardLine: "Seychelles · 4 islands",
      customPrices: [
        {
          _key: "73c1a3ed89ba",
          _type: "priceEntry",
          amount: 29,
          currency: "EUR",
        },
        {
          _key: "ee1a43e9c01d",
          _type: "priceEntry",
          amount: 35,
          currency: "USD",
        },
        {
          _key: "d8a131c54db9",
          _type: "priceEntry",
          amount: 29,
          currency: "GBP",
        },
        {
          _key: "6ae07e8db612",
          _type: "priceEntry",
          amount: 29,
          currency: "CHF",
        },
      ],
      dayStrip: "Islands: Mahé · Praslin · Curieuse · La Digue",
      format: ["PDF"],
      hasGuide: true,
      pageSlug: "seychelles-7-days",
      pages: 25,
      proofLine: "I flew here with my own plan. This is the version I would book again.",
      proofPhoto: {
        _type: "image",
        alt: "The author and his wife with a giant tortoise on Curieuse Island",
        asset: {
          _ref: "image-cc0532930539a9d2c0a5a4d81a5f394e012c9883-800x613-jpg",
          _type: "reference",
        },
      },
      purchasesCount: 2,
      sample: {
        body: "Day 4 takes you to Curieuse, where giant tortoises roam loose in a national park, and gets you onto the last ferry to La Digue. This is the page exactly as it appears in the guide.",
        image: {
          _type: "image",
          asset: {
            _ref: "image-1ff2ffd7fba1ef72a532025a1a7b883b39ccf4b0-1132x1600-jpg",
            _type: "reference",
          },
        },
        label: "Day 4, Curieuse. The full page, free.",
        pdfPath: "/samples/seychelles-day-04.pdf",
      },
      status: "available",
    },
    hasVideo: false,
    journeyCategory: {
      _ref: "category-journey-week",
      _type: "reference",
    },
    keywords: [
      "seychelles 7 day itinerary",
      "seychelles island hopping route",
      "seychelles one week itinerary",
      "mahe praslin la digue itinerary",
      "seychelles travel guide pdf",
    ],
    language: "en",
    lastReviewedDate: "2026-07-24",
    metaDescription: "Mahé, Praslin, Curieuse and La Digue in seven days: timed day plans, ferry times, booking deadlines, hotel picks and what the trip actually costs.",
    metaTitle: "Seychelles: Four Islands in 7 Days",
    notSuitableSales: [
      "Anyone booking a single resort week and not leaving it",
      "Backpacker budgets – this route assumes mid-range and up",
      "Travellers who want a tour operator to run the days",
    ],
    primaryCollection: {
      _ref: "collection-seychelles",
      _type: "reference",
    },
    primaryStats: [
      {
        _key: "00f23974458d",
        _type: "primaryStat",
        label: "Duration",
        value: "7 days, 7 nights",
      },
      {
        _key: "6de40b09b4a5",
        _type: "primaryStat",
        label: "Islands",
        value: "Mahé, Praslin, Curieuse, La Digue",
      },
      {
        _key: "c580c1f2f359",
        _type: "primaryStat",
        label: "Pace",
        value: "Unhurried – a ferry every two to three days",
      },
      {
        _key: "f2639375a169",
        _type: "primaryStat",
        label: "Difficulty",
        value: "Easy",
      },
      {
        _key: "4077ac322b5f",
        _type: "primaryStat",
        label: "Season",
        value: "May to October; July and August are peak",
      },
      {
        _key: "0cd6886a4e8e",
        _type: "primaryStat",
        label: "Format",
        value: "25-page PDF, printable A4, instant download, companion Google map",
      },
    ],
    publishedDate: "2026-07-24",
    routeStops: [
      {
        _key: "b0ecdc05c382",
        _type: "routeStop",
        coordinates: {
          _type: "geopoint",
          lat: -4.6191,
          lng: 55.4513,
        },
        name: "Mahé",
        type: "town",
      },
      {
        _key: "3a8f78ba9276",
        _type: "routeStop",
        coordinates: {
          _type: "geopoint",
          lat: -4.3232,
          lng: 55.7351,
        },
        name: "Praslin",
        type: "town",
      },
      {
        _key: "628ce24604b4",
        _type: "routeStop",
        coordinates: {
          _type: "geopoint",
          lat: -4.2833,
          lng: 55.7333,
        },
        name: "Curieuse",
        type: "other",
      },
      {
        _key: "b72de3daff22",
        _type: "routeStop",
        coordinates: {
          _type: "geopoint",
          lat: -4.3595,
          lng: 55.8412,
        },
        name: "La Digue",
        type: "town",
      },
    ],
    similarStories: [
      {
        _key: "bfba6b223cfb",
        _ref: "story-seychelles-source-dargent-sunrise",
        _type: "reference",
      },
      {
        _key: "be70b67883de",
        _ref: "story-seychelles-curieuse-tortoises",
        _type: "reference",
      },
      {
        _key: "7ca839f22f0e",
        _ref: "story-seychelles-la-digue-by-bike",
        _type: "reference",
      },
    ],
    slug: {
      _type: "slug",
      current: "seychelles-1-week",
    },
    startingPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: -4.6743,
        lng: 55.5218,
      },
      name: "Mahé International Airport (SEZ)",
      type: "airport",
    },
    status: "published",
    storyId: "2026_seychelles-1-week",
    subtitle: "Four islands in seven days, by ferry and hire car, without the honeymoon markup.",
    title: "Seychelles: Four Islands in 7 Days",
    whatYouGet: [
      "Seven day-by-day plans, timed from wake-up to dinner",
      "Route snapshot: pace, difficulty, season, what to expect",
      "Hotel picks, three price levels on each of the three islands",
      "Restaurant picks, split into reserve-ahead, walk-in and takeaway",
      "Full cost table at lean, core and splurge, per couple",
      "Essential reservations, ordered by booking deadline",
      "Before-the-flight page: paperwork, money, plugs, driving",
      "Packing list built for this trip, not a generic one",
      "Ferry routes, site gate hours and tide notes",
      "Companion Google map with every pin from the guide",
    ],
    whoThisIsFor: [
      "Independent travellers who want the whole country in one trip",
      "Couples and pairs who would rather drive and cycle than be driven",
      "First-time visitors who do not want to build a ferry spreadsheet",
    ],
    whyThisTrip: [
      "Most itineraries lock you to one resort island for a week – this route covers four islands in seven days without ever feeling rushed",
      "Every ferry, gate hour and booking deadline is already worked out, so you can book the whole trip in an evening",
      "Hotel and restaurant picks at three price levels on each island, from real visits",
      "The whole country runs on two ferry routes and a bicycle – no tour operator needed",
    ],
  },
};

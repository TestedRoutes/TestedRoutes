/**
 * triftbrucke-from-zurich: content for the Sanity story doc.
 *
 * Published by publish-trift-pdf.mjs, not by a create-<slug> script, so there
 * was nothing to extract: this module is built from the live document.
 *
 * All five gallery images share one alt text, "Triftbrucke from Zurich".
 * Carried as-is rather than invented - five identical alts describe nothing,
 * but writing five new ones needs someone who can see the photographs.
 * Noted 2026-08-16.
 *
 * The diverging Studio draft was resolved 2026-08-19 (Tracker #230). The
 * published guide.polarProductId (281914f7...) is the correct one - it is the
 * product the live buy button sells and the one this module carries; the
 * draft's ce85132d... was stale, and the draft has been patched to match, so
 * a Studio Publish can no longer repoint checkout. The draft's two genuine
 * founder edits were rescued into this module and published: the corrected
 * map pins on routePoints ("Trift Suspension Bridge" highlight) and
 * routeStops ("Triftbrücke"), moved in the Studio on 2026-08-16 but never
 * published. The rest of the draft still predates the 2026-08-17 alt-text
 * and en-dash fixes - it should be discarded in the Studio, not published.
 * Full draft snapshot at content/countries/switzerland/guides/
 * trift-bridge-from-zurich/generated/studio-draft-backup-20260819.json.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-triftbrucke-from-zurich",

  assets: {
    // No source directory: the web derivatives this guide published from are
    // not on disk. publish-guide.mjs carries the existing Sanity assets
    // forward, which is the normal path for every guide in this library.
    dir: null,
    hero: { file: "hero.jpg", alt: "Trift suspension bridge stretching across a rocky alpine gorge with snow-covered mountains behind" },
    // Rewritten 2026-08-17 from the published images themselves. All five read
    // "Triftbrücke from Zurich" until then - the guide's title repeated five
    // times, which describes none of them and tells a screen reader nothing it
    // did not already have from the heading.
    gallery: [
      { file: "g1.jpg", key: "99efd273c509", alt: "Looking along the Trift suspension bridge deck, snow between the planks and a snow-covered peak ahead" },
      { file: "g2.jpg", key: "834339e0ad60", alt: "A hiker sitting on a rock above the milky green Triftsee, the snow-covered cirque behind" },
      { file: "g3.jpg", key: "e261fd9bfaa6", alt: "Golden larches and fresh snow above the Trift valley, cloud filling the far side" },
      { file: "g4.jpg", key: "3b51b052e19b", alt: "The forest trail below the bridge, sun through the conifers and moss over the boulders" },
      { file: "g5.jpg", key: "24a9d3fcfc68", alt: "A hiker with a green pack on the snowy approach, looking across the gorge to the peaks" },
    ],
    pdf: {
      path: "content/countries/switzerland/guides/trift-bridge-from-zurich/final/TestedRoutes-Triftbrucke-Day-Trip.pdf",
      filename: "TestedRoutes-Triftbrucke-Day-Trip.pdf",
    },
  },

  doc: {
    _system: {
      base: {
        id: "story-triftbrucke-from-zurich",
        rev: "IzeT8U1mpEPDqfEBJOsV3D",
      },
    },
    accommodationType: "none",
    activityCategory: {
      _ref: "category-activity-outdoor-hiking",
      _type: "reference",
    },
    activityTags: [
      "suspension bridge hike",
      "alpine day hike",
      "glacier valley views",
      "mountain lake viewpoint",
      "cable car access",
      "Swiss Alps hiking",
      "photography stop",
      "Zurich day trip",
    ],
    adrenalineLevel: 4,
    affiliateLinks: [
      {
        _key: "56bd39ff335a",
        _ref: "affiliateLink-triftbrucke-sbb-train",
        _type: "reference",
      },
      {
        _key: "aaed0cb11e00",
        _ref: "affiliateLink-triftbrucke-car-rental",
        _type: "reference",
      },
      {
        _key: "e444613fb952",
        _ref: "affiliateLink-triftbrucke-cable-car",
        _type: "reference",
      },
      {
        _key: "28beaba732f5",
        _ref: "affiliateLink-triftbrucke-day-hike-kit",
        _type: "reference",
      },
      {
        _key: "43a2233ea810",
        _ref: "affiliateLink-revolut",
        _type: "reference",
      },
      {
        _key: "53e1c62a6f71",
        _ref: "affiliateLink-saily-esim",
        _type: "reference",
      },
    ],
    allCollections: [
      {
        _key: "5a35f4d1fd7a",
        _ref: "collection-switzerland",
        _type: "reference",
      },
      {
        _key: "5267a7b24326",
        _ref: "collection-day-trips",
        _type: "reference",
      },
      {
        _key: "835fda53e5f3",
        _ref: "collection-hiking",
        _type: "reference",
      },
      {
        _key: "77e1232855cd",
        _ref: "collection-suspension-bridges",
        _type: "reference",
      },
      {
        _key: "06e2ffa92d63",
        _ref: "collection-alpine-lakes",
        _type: "reference",
      },
    ],
    alternativeNames: ["Trift Bridge", "Hängebrücke Trift", "Trift Suspension Bridge"],
    appearsInSearches: [
      "how to visit Triftbrucke from Zurich",
      "best day trip hike from Zurich Switzerland",
      "Trift Bridge hike Switzerland",
      "Triftbrucke cable car and hike",
      "Swiss suspension bridge hike day trip",
      "Triftbrucke in autumn",
      "Triftsee and Triftbrucke hike guide",
    ],
    author: {
      _ref: "author-paulius-pikelis",
      _type: "reference",
    },
    avoidMonths: [11, 12, 1, 2, 3, 4],
    beginnerFriendly: false,
    bestForCrowdType: "active_explorers",
    bestMonths: [6, 7, 8, 9, 10],
    bestSeasons: ["summer", "fall"],
    body: [
      {
        _key: "f5d06c8345eb",
        _type: "block",
        children: [
          {
            _key: "4179c1797c21",
            _type: "span",
            marks: [],
            text: "Triftbrücke from Zurich",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "4a16a711fe15",
        _type: "block",
        children: [
          {
            _key: "d52a32e4f021",
            _type: "span",
            marks: [],
            text: "Sometimes the best hikes start with a simple plan: park the car and just walk.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "d367bbf438a5",
        _type: "block",
        children: [
          {
            _key: "98d5f6a513eb",
            _type: "span",
            marks: [],
            text: "I did the Triftbrücke hike with a friend on a clear morning, starting straight from the parking lot at 9:30 - no gondola, just the trail and the climb ahead. The path gains height quickly, and within the first hour you already feel far away from the valley. It's steady work, but the kind that keeps you motivated because the landscape keeps opening up around you. It's one of those hikes where the landscape keeps getting bigger the higher you go.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "832b557c348b",
        _type: "block",
        children: [
          {
            _key: "1ac9f8e16f0f",
            _type: "span",
            marks: [],
            text: "By 11:30 we reached the suspension bridge. Seeing it appear suddenly above the turquoise glacier lake is one of those moments that makes the whole ascent worth it. Standing there, with the wind moving the bridge slightly and the glacier right in front of us, felt wild and real in the best possible way. For a moment it felt more like an expedition than a day trip from Zurich.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "0cdc97211515",
        _type: "block",
        children: [
          {
            _key: "1f7470ef0209",
            _type: "span",
            marks: [],
            text: "We walked the entire route up and down – about 15 km with 1,200 m of ascent in roughly 5.5 hours. A big alpine day, but completely doable - and exactly the kind of hike I keep suggesting when someone asks for something memorable without needing technical climbing skills.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    bookingsAdvanceDays: 3,
    bookingsRequired: ["Triftbahn cable car in busy periods"],
    budgetLevel: "moderate",
    carRequired: false,
    commonMistakes: [
      "Underestimating the full day when starting from Zurich including transport",
      "Arriving without checking Triftbahn operating times and weather",
      "Wearing casual shoes for a rocky mountain trail",
      "Assuming the bridge is fine for anyone who dislikes heights",
    ],
    contentQualityScore: 4,
    coordinates: {
      _type: "geopoint",
      lat: 46.6958,
      lng: 8.3526,
    },
    costBreakdown: {
      _type: "costBreakdown",
      accommodation: 0,
      activities: 32,
      equipmentRental: 0,
      food: 20,
      transport: 40,
    },
    crowdLevel: "moderate",
    destination: {
      _ref: "destination-switzerland",
      _type: "reference",
    },
    difficultyAtAGlance: [
      "Steepness: consistent uphill ~1.5 h",
      "Exposure: suspension bridge only",
      "Trail: marked alpine hiking path",
      "Fitness: ~450 m ascent / ~6 km",
    ],
    difficultyFactors: [
      "15 km with 1,200 m of ascent – a long, demanding alpine day",
      "Exposure on the suspension bridge",
      "Possible snow or ice in shoulder season",
      "Long day when done from Zurich including transport",
      "Rocky and uneven footing in the upper alpine section",
    ],
    durationDays: 1,
    durationDisplay: "1 day from Zurich, with about 5.5 hours of hiking",
    durationHours: 5.5,
    elevationGainM: 1200,
    estimatedCost: {
      _type: "estimatedCost",
      currency: "CHF",
      max: 150,
      min: 70,
    },
    eyebrow: "SWITZERLAND • DAY TRIP • HIKING",
    familyFriendly: true,
    featuredInHomepage: false,
    featuredPriority: 5,
    finishPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: 47.3779,
        lng: 8.5403,
      },
      name: "Zurich HB",
      type: "train_station",
    },
    fourByFourRequired: false,
    guide: {
      _type: "guide",
      customPrices: [
        {
          _key: "eur",
          _type: "priceEntry",
          amount: 12,
          currency: "EUR",
        },
        {
          _key: "chf",
          _type: "priceEntry",
          amount: 12,
          currency: "CHF",
        },
        {
          _key: "gbp",
          _type: "priceEntry",
          amount: 12,
          currency: "GBP",
        },
        {
          _key: "usd",
          _type: "priceEntry",
          amount: 15,
          currency: "USD",
        },
      ],
      format: ["PDF"],
      hasGuide: true,
      pageSlug: "trift-bridge-from-zurich",
      pricingTier: {
        _ref: "pricingTier-day-trip",
        _type: "reference",
      },
      purchasesCount: 4,
      status: "available",
    },
    highlights: [
      "Crossing the dramatic Trift suspension bridge high above the gorge",
      "Wide glacier valley views with snow-covered peaks",
      "A realistic one-day alpine adventure from Zurich",
      "Photogenic mix of forest trail, rock, lake, and high mountains",
      "Big-mountain feel without a multi-day commitment",
    ],
    idealFor: ["photographers", "active explorers", "couples", "solo travelers"],
    idealGroupSize: "1–4 people",
    insiderTips: [
      "Start early from Zurich — arriving at the trailhead by 9:30 gives a comfortable day",
      "Bring layers even on sunny days — the upper valley is significantly colder than the city",
      "Get your best bridge photos before midday crowds arrive",
      "The whole valley approach is part of the experience, not just a warm-up",
      "Fresh snow makes the scenery even better but traction and timing matter much more",
    ],
    journeyCategory: {
      _ref: "category-journey-day-trip",
      _type: "reference",
    },
    journeyStyle: "self_guided",
    keywords: [
      "Triftbrücke",
      "Trift Bridge",
      "Zurich day trip",
      "Switzerland hiking",
      "suspension bridge hike",
      "Swiss Alps day hike",
      "Triftbahn",
      "Triftsee",
      "Gadmen hike",
      "Bernese Oberland",
    ],
    language: "en",
    lastReviewedDate: "2026-07-27",
    lastUpdated: "2026-04-18",
    mapZoom: 13,
    maxAltitudeM: 1720,
    metaDescription: "A 170 m suspension bridge above the turquoise Triftsee, reached by gondola and a 3-hour hike. A full day trip from Zurich, with transport and timings.",
    metaTitle: "Triftbrücke from Zurich: Epic Swiss Day Hike",
    minAgeRecommended: 12,
    moneySavingTips: [
      "Use public transport passes or saver tickets from Zurich",
      "Bring your own lunch and snacks instead of relying on mountain food",
      "Travel on a weekday to avoid crowds and last-minute transport changes",
    ],
    mostRecentCompletion: "2020-10-18",
    nearestCity: "Lucerne",
    nearestCityDistanceKm: 85,
    needsAttention: false,
    nextUpdateDue: "2027-04-18",
    notSuitableIf: [
      "You have a strong fear of heights",
      "You are uncomfortable on exposed, swaying bridges",
      "You lack the fitness for a 5.5-hour mountain hike",
      "There is fresh snow or ice and you do not have the right gear",
      "You need step-free or wheelchair access",
    ],
    notSuitableSales: [
      "If you have a fear of heights or exposed bridge crossings",
      "For most dogs – the moving bridge deck spooks them",
    ],
    overallLevel: "moderate",
    permitsRequired: false,
    physicalFitnessRequired: "high",
    primaryCollection: {
      _ref: "collection-switzerland",
      _type: "reference",
    },
    primaryStats: [
      {
        _key: "ffb2c2a50efe",
        _type: "primaryStat",
        label: "Duration",
        value: "1 day",
      },
      {
        _key: "ef18d04a3a8b",
        _type: "primaryStat",
        label: "Effort",
        value: "~3 h hike · 5.6 km return (with gondola)",
      },
      {
        _key: "3cbdf80a8610",
        _type: "primaryStat",
        label: "Altitude",
        value: "1,720 m (bridge level)",
      },
      {
        _key: "d07547398706",
        _type: "primaryStat",
        label: "Access",
        value: "Car ~2 h · Public transport ~3 h from Zürich",
      },
      {
        _key: "e8ece94e24e6",
        _type: "primaryStat",
        label: "Highlight",
        value: "170 m suspension bridge",
      },
    ],
    publicTransportAccessible: true,
    publishedDate: "2026-04-18",
    regions: ["Bern", "Bernese Oberland", "Gadmen"],
    rentalEquipmentAvailable: false,
    reviewFrequencyMonths: 12,
    routeMode: "hiking",
    routePoints: [
      {
        _key: "aba1cf3605c6",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 47.3782,
          lng: 8.5403,
        },
        name: "Zurich HB",
        type: "start",
      },
      {
        _key: "ec9bfba2a4b0",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 46.7184,
          lng: 8.3482,
        },
        name: "Gadmen / Triftbahn Station",
        type: "stop",
      },
      {
        _key: "35c381ce305a",
        _type: "routePoint",
        coordinates: {
          // Founder's Studio correction of 2026-08-16, rescued from the
          // discarded draft - the old 46.6958/8.3526 pin sat kilometres
          // west of the bridge.
          _type: "geopoint",
          lat: 46.7298,
          lng: 8.3719,
        },
        name: "Trift Suspension Bridge",
        type: "highlight",
      },
      {
        _key: "ee2662ec7f85",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 47.3782,
          lng: 8.5403,
        },
        name: "Zurich HB",
        type: "end",
      },
    ],
    routeStatus: "active",
    routeStops: [
      {
        _key: "9f87609480fa",
        _type: "routeStop",
        coordinates: {
          // Founder's Studio correction of 2026-08-16, rescued from the
          // discarded draft - matches the bridge's real longitude.
          _type: "geopoint",
          lat: 46.6943,
          lng: 8.4145,
        },
        name: "Triftbrücke",
        type: "bridge",
      },
    ],
    scenicRating: 5,
    searchSynonyms: [
      "Triftbrucke",
      "Triftbrücke",
      "Trift Bridge",
      "Hangebrucke Trift",
      "Hängebrücke Trift",
      "Triftbahn hike",
      "Trift suspension bridge",
      "Triftsee hike",
    ],
    searchTags: [
      "day trips from Zurich",
      "best hikes near Zurich",
      "Swiss suspension bridges",
      "alpine lake hike Switzerland",
      "autumn hikes Switzerland",
      "dramatic mountain hikes Europe",
    ],
    similarStories: [
      {
        _key: "footbridge",
        _ref: "story-switzerland-triftbrucke-scariest-footbridge",
        _type: "reference",
      },
    ],
    slug: {
      _type: "slug",
      current: "triftbrucke-from-zurich",
    },
    snowSeasonAccessible: false,
    soloFriendly: true,
    specialEquipment: [
      "good hiking shoes",
      "waterproof jacket",
      "warm layer",
      "water and snacks",
      "microspikes in shoulder season if snow or ice is present",
    ],
    startingPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: 47.3779,
        lng: 8.5403,
      },
      name: "Zurich HB",
      type: "train_station",
    },
    status: "published",
    storyId: "switzerland-triftbrucke-2020",
    subtitle: "A 170 m suspension bridge above a turquoise glacier lake, a day trip from Zurich.",
    technicalSkillRequired: "basic",
    testedBy: "pikelis",
    testedWith: ["adult travelers"],
    timeOfDay: "full_day",
    timesCompleted: 1,
    title: "Triftbrücke from Zurich: A Suspension Bridge Day Trip",
    totalDistanceKm: 15,
    transportationDifficulty: "moderate",
    transportationRequired: ["train", "bus", "public_transport", "cable_car"],
    uniqueSellingPoints: [
      "One of the most dramatic suspension bridge hikes you can do as a Zurich day trip",
      "Combines forest trail, glacier lake, rocky alpine terrain, and a high bridge in one route",
      "Feels far wilder than most easy-access Swiss day hikes",
      "Genuine adrenaline moment on the bridge without needing technical skills",
      "Strong visual payoff in every direction – exceptional for photography",
    ],
    verifiedFacts: [
      "Done car-to-car without the cable car, starting at 9:30 from the parking lot",
      "Bridge reached at 11:30 — roughly 2 hours from the trailhead",
      "Total route: ~15 km with 1,200 m of ascent in about 5.5 hours",
      "The bridge sways in the wind and sits high above the turquoise glacier lake",
      "Snow can appear on the route in shoulder season (October)",
    ],
    weatherDependent: true,
    whatMakesThisSpecial: "Triftbrücke delivers a true high-alpine atmosphere in a single day from Zurich. The full valley approach through forest, rock, and glacier scenery makes it a complete mountain experience, not just a bridge stop.",
    whatYouGet: [
      "Trail map, elevation profile, and a companion Google Map with every pin",
      "Step-by-step day plan for both car and public transport with exact timings",
      "Gondola booking guide: schedule, capacity, pricing, and how to avoid missing your slot",
      "Weather go/no-go rules using MeteoSwiss — when to postpone",
      "Full cost breakdown: gondola, parking, train tickets, and saver fare tips",
      "Complete packing list and what to eat and drink on the route",
    ],
    wheelchairAccessible: false,
    whoThisIsFor: [
      "Based in Zurich for 1–2 days or more",
      "Comfortable walking uphill for 2–3 hours",
      "Prefer independent travel",
      "Prefer clear step-by-step logistics, not inspiration",
    ],
    whyThisTrip: [
      "Best suspension bridge hike near Zürich",
      "Real glacier landscape without overnight stay",
      "Feels remote but fits into one day",
      "No technical skills required",
    ],
  },
};

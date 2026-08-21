/**
 * simplon-pass-to-saas-fee: content for the Sanity story doc.
 *
 * Published by publish-simplon-pdf.mjs, not by a create-<slug> script, so
 * there was nothing to extract: this module is built from the live document.
 *
 * The six gallery alt texts below are the ones live on the site, and they are
 * wrong - "103820", "104008" and so on are capture timestamps left over from
 * the filenames, not descriptions. Carried verbatim rather than invented,
 * because alt text describes a photograph nobody can see from here. Worth
 * fixing: six images on a selling page currently announce a number to a
 * screen reader. Noted 2026-08-16.
 */

import { paragraph } from "./_lib.mjs";

export default {
  docId: "story-simplon-pass-to-saas-fee",

  assets: {
    // No source directory: the web derivatives this guide published from are
    // not on disk. publish-guide.mjs carries the existing Sanity assets
    // forward, which is the normal path for every guide in this library.
    dir: null,
    hero: { file: "hero.jpg", alt: "Hiker on the Alpine Passes Trail above Simplon Pass with snow-covered peaks behind" },
    // Rewritten 2026-08-17 from the published images themselves. These read
    // "103820", "104008" and so on until then - capture timestamps carried over
    // from the filenames, which announced a number to anyone using a screen
    // reader on a page that is trying to sell something.
    gallery: [
      { file: "g1.jpg", key: "02bf7763123d", alt: "The stone eagle monument at Simplon Pass on its bare rock outcrop, mountains and the pass road behind" },
      { file: "g2.jpg", key: "09335acad2a5", alt: "Looking down on the Simplon Pass road and its lay-by, lorries parked below a glaciated peak" },
      { file: "g3.jpg", key: "0c7e4da70120", alt: "A hiker on the stony ridge path, a cairn beside the trail and the valley opening out beyond" },
      { file: "g4.jpg", key: "6c5150cb497e", alt: "Dark timber barns and slate roofs of a hillside hamlet, a snow-capped peak across the valley" },
      { file: "g5.jpg", key: "90e7152b85c5", alt: "A flag on a pole at a viewpoint above the valley, glaciated peaks along the skyline under cloud" },
      { file: "g6.jpg", key: "16cd2beb40ef", alt: "Saas-Fee below its glacier, chalets and apartment blocks under the icefall" },
    ],
    trackLine: "tracklines/simplon-pass-to-saas-fee.json",
    pdf: {
      path: "content/countries/switzerland/guides/APT-18-19-simplon-pass-to-saas-fee/final/TestedRoutes-Simplon-Saas-Fee-Weekend-Hike.pdf",
      filename: "TestedRoutes-Simplon-Saas-Fee-Weekend-Hike.pdf",
    },
  },

  doc: {
    accommodationType: "hotel",
    activityCategory: {
      _ref: "category-activity-hiking",
      _type: "reference",
    },
    activityTags: [
      "alpine traverse",
      "ridge walk",
      "two-day hike",
      "Alpine Passes Trail",
      "Saas Fee",
      "Visp valley",
      "mountain hut overnight",
      "Swiss Alps hiking",
    ],
    adrenalineLevel: 2,
    affiliateLinks: [
      {
        _key: "3ed12e346bc9",
        _ref: "affiliateLink-simplon-saasfee-alpenblick-gspon",
        _type: "reference",
      },
      {
        _key: "8d7e2210c23b",
        _ref: "affiliateLink-simplon-saasfee-sbb",
        _type: "reference",
      },
      {
        _key: "2083aa75646f",
        _ref: "affiliateLink-simplon-saasfee-switzerlandmobility",
        _type: "reference",
      },
      {
        _key: "fea9e9930cbb",
        _ref: "affiliateLink-revolut",
        _type: "reference",
      },
      {
        _key: "2bf562396d3e",
        _ref: "affiliateLink-saily-esim",
        _type: "reference",
      },
      {
        _key: "a184a2cdd0c7",
        _ref: "affiliateLink-nordvpn",
        _type: "reference",
      },
    ],
    allCollections: [
      {
        _key: "c20e5c46be63",
        _ref: "collection-switzerland",
        _type: "reference",
      },
      {
        _key: "7c74f1c0a766",
        _ref: "collection-weekend-trips",
        _type: "reference",
      },
      {
        _key: "8a54e76b0ea6",
        _ref: "collection-hiking",
        _type: "reference",
      },
      {
        _key: "a3762436eab8",
        _ref: "collection-alpine-passes-trail",
        _type: "reference",
      },
      {
        _key: "23f299c037f2",
        _ref: "collection-multi-day-hikes",
        _type: "reference",
      },
    ],
    alternativeNames: ["Alpine Pass Trail Stage 18-19", "Simplon to Saas Fee traverse"],
    appearsInSearches: [
      "Alpine Passes Trail Switzerland 2-day hike",
      "Simplon Pass hike to Saas Fee",
      "Stage 18 Stage 19 Alpine Passes Trail",
      "weekend hike Switzerland Valais",
      "Gspon overnight hike",
    ],
    author: {
      _ref: "author-paulius-pikelis",
      _type: "reference",
    },
    avoidMonths: [11, 12, 1, 2, 3, 4],
    beginnerFriendly: false,
    bestForCrowdType: "active_explorers",
    bestMonths: [7, 8, 9],
    bestSeasons: ["summer"],
    body: [
      {
        _key: "83e2a6ab8187",
        _type: "block",
        children: [
          {
            _key: "3431cc246ddb",
            _type: "span",
            text: "Simplon Pass to Saas Fee",
          },
        ],
        style: "normal",
      },
      {
        _key: "b0d46bb819f7",
        _type: "block",
        children: [
          {
            _key: "8dd8185f3717",
            _type: "span",
            text: "Weekend in the mountains. Back on the Alpine Passes Trail.",
          },
        ],
        style: "normal",
      },
      {
        _key: "aaf35fc6168b",
        _type: "block",
        children: [
          {
            _key: "0bc75d82fce0",
            _type: "span",
            text: "Early morning train from Zurich. Always the same feeling. Coffee in hand, watching the city disappear and knowing that in a few hours you will be somewhere completely different. Quick stop at Simplon Pass for a late breakfast and then straight on the trail.",
          },
        ],
        style: "normal",
      },
      {
        _key: "a3e0842b51ac",
        _type: "block",
        children: [
          {
            _key: "2bb3c3b624ae",
            _type: "span",
            text: "The section toward Gspon is easy to follow and surprisingly scenic from the start. Wide views, open terrain and proper summer conditions. Blue sky, strong sun, snow still sitting on the peaks in the distance. It felt like one of those days where everything just works.",
          },
        ],
        style: "normal",
      },
      {
        _key: "1d35c179fdd4",
        _type: "block",
        children: [
          {
            _key: "082408a54793",
            _type: "span",
            text: "Lunch by a stream turned into a longer break than planned. Slipped on a wet rock, small hand bruise, nothing serious. More annoying was the heat. We started running low on water and there was not much shade. Good reminder that even simple routes can become demanding when the sun is strong.",
          },
        ],
        style: "normal",
      },
      {
        _key: "953dd829e646",
        _type: "block",
        children: [
          {
            _key: "01b5c799272c",
            _type: "span",
            text: "As we got closer to Gspon, sheep started appearing along the trail and the landscape softened a bit. Reached the village just before 18:00. Perfect timing. Or so we thought. Everything was fully booked! For a moment it felt like the trip might end right there - \"what do we do now?\". Quick decision. The gondola was still running. We went down to Stalden, found a random hotel and saved the weekend! ",
          },
        ],
        style: "normal",
      },
      {
        _key: "f7d0bea93ed6",
        _type: "block",
        children: [
          {
            _key: "3b562faa195d",
            _type: "span",
            text: "Next morning back up with the gondola and straight onto the trail again. Completely different day. Cloudy, cooler, much better for hiking. As we approached Saas Fee, the route felt more alive. More people, more movement, more energy around.",
          },
        ],
        style: "normal",
      },
      {
        _key: "e12f4e0f615b",
        _type: "block",
        children: [
          {
            _key: "0dae6265fa72",
            _type: "span",
            text: "At one point we passed some zip lines. Looked fun, but after 2 days on the move it was an easy pass :) Legs were done. Saas Fee at the end felt busy but in a good way. People coming for the weekend, relaxing, hiking, enjoying the mountains. Not this time - we went straight to the bus and back to Zurich.",
          },
        ],
        style: "normal",
      },
      {
        _key: "885a6cb5be62",
        _type: "block",
        children: [
          {
            _key: "e7c7c5bd7c78",
            _type: "span",
            text: "43 km. 1,700 m ascent. Around 9 hours on the trail. One of those quick weekend trips that feels much bigger than it actually is.",
          },
        ],
        style: "normal",
      },
    ],
    bookingsAdvanceDays: 14,
    bookingsRequired: ["Hotel Alpenblick Gspon", "SBB Saver fares"],
    budgetLevel: "moderate",
    carRequired: false,
    commonMistakes: [
      "Not booking Hotel Alpenblick Gspon early — it is the only option in town",
      "Underestimating water needs on a sunny Day 1",
      "Skipping a backup plan if Alpenblick is full",
    ],
    coordinates: {
      _type: "geopoint",
      lat: 46.179,
      lng: 7.98,
    },
    costBreakdown: {
      _type: "costBreakdown",
      accommodation: 120,
      activities: 0,
      food: 30,
      transport: 52,
    },
    crowdLevel: "low",
    destination: {
      _ref: "destination-switzerland",
      _type: "reference",
    },
    difficultyAtAGlance: [
      "Sustained alpine traverse — moderate but committed",
      "Highest point ~2,200 m",
      "~21 km / ~1,400 m ascent over 2 days",
      "Limited services between Simplon Pass and Saas Fee",
    ],
    difficultyFactors: [
      "21 km with 1,400 m of ascent split across two days",
      "Long Day 1 (~6 h) before reaching Gspon",
      "Day 2 ridge crossing exposed to weather",
      "Snow possible into late June in shoulder season",
      "Limited services between Simplon Pass and Saas Fee",
    ],
    durationDays: 2,
    durationDisplay: "2 days, ~13 h walking total",
    durationHours: 13,
    elevationGainM: 1820,
    estimatedCost: {
      _type: "estimatedCost",
      currency: "CHF",
      max: 300,
      min: 200,
    },
    eyebrow: "SWITZERLAND • 2-DAY HIKE • ALPINE PASSES TRAIL",
    familyFriendly: false,
    featuredInHomepage: false,
    featuredPriority: 5,
    finishPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: 46.1087,
        lng: 7.9297,
      },
      name: "Saas-Fee",
      type: "town",
    },
    fourByFourRequired: false,
    guide: {
      _type: "guide",
      customPrices: [
        {
          _key: "eur",
          _type: "priceEntry",
          amount: 15,
          currency: "EUR",
        },
        {
          _key: "chf",
          _type: "priceEntry",
          amount: 15,
          currency: "CHF",
        },
        {
          _key: "gbp",
          _type: "priceEntry",
          amount: 15,
          currency: "GBP",
        },
        {
          _key: "usd",
          _type: "priceEntry",
          amount: 19,
          currency: "USD",
        },
      ],
      format: ["PDF"],
      hasGuide: true,
      pricingTier: {
        _ref: "pricingTier-weekend-trip",
        _type: "reference",
      },
      status: "available",
    },
    highlights: [
      "Two stages of Switzerland's Alpine Passes Trail (Stages 18 and 19) strung together over a weekend",
      "Quiet alpine hamlet of Gspon as the overnight stop",
      "Long ridge traverse above the Visp valley with constantly changing views",
      "Glaciers at eye level on the descent into Saas Fee",
      "Genuine high-mountain corridor without the day-hike crowds",
    ],
    idealFor: ["alpine hikers", "weekend adventurers", "long-distance trail walkers", "photographers"],
    idealGroupSize: "1–4 people",
    insiderTips: [
      "Book Alpenblick 2–3 weeks ahead — fills first because there is no other option",
      "Carry both days' lunches from home — no shops between Simplon Pass and Saas Fee",
      "If Alpenblick is full, sleep in Stalden and use the cable car evening + morning",
      "Phone signal is patchy in Gspon outside the hotel — download offline maps",
    ],
    journeyCategory: {
      _ref: "category-journey-weekend",
      _type: "reference",
    },
    journeyStyle: "self_guided",
    keywords: [
      "Simplon Pass",
      "Saas Fee",
      "Alpine Passes Trail",
      "Gspon",
      "Stage 18",
      "Stage 19",
      "Switzerland hiking",
      "2-day hike",
      "Visp valley",
      "Valais hiking",
    ],
    language: "en",
    lastUpdated: "2026-07-28",
    mapZoom: 11,
    maxAltitudeM: 2483,
    metaDescription: "Glaciers at eye level on the high traverse above the Visp valley, by way of Gspon. Stages 18 and 19 of Switzerland's Alpine Passes Trail, with logistics.",
    metaTitle: "Simplon Pass to Saas-Fee: 2-Day Alpine Hike",
    minAgeRecommended: 14,
    moneySavingTips: [
      "Buy SBB Saver fares 2–3 weeks ahead for up to half-price returns",
      "Carry both days' lunches from home — no shops between Simplon Pass and Saas Fee",
      "Travel midweek to ease pressure on Hotel Alpenblick availability",
    ],
    mostRecentCompletion: "2022-08-13",
    nearestCity: "Brig",
    nearestCityDistanceKm: 30,
    notSuitableIf: [
      "You lack basic alpine fitness",
      "You cannot commit to a 2-day, 1-night plan",
      "Forecast is unstable for both days",
      "You need step-free or wheelchair access",
    ],
    notSuitableSales: [
      "If you lack basic alpine fitness",
      "If forecast is unstable for both days — don't push through",
    ],
    overallLevel: "moderate",
    permitsInfo: "",
    permitsRequired: false,
    physicalFitnessRequired: "high",
    primaryCollection: {
      _ref: "collection-switzerland",
      _type: "reference",
    },
    primaryStats: [
      {
        _key: "944535ffb451",
        _type: "primaryStat",
        label: "Duration",
        value: "2 days",
      },
      {
        _key: "060634bbd6e6",
        _type: "primaryStat",
        label: "Effort",
        value: "~13 h walking · ~1,820 m ascent",
      },
      {
        _key: "c8c08c59a0f3",
        _type: "primaryStat",
        label: "Altitude",
        value: "2,483 m highest point",
      },
      {
        _key: "a4d2b732dfe1",
        _type: "primaryStat",
        label: "Access",
        value: "Train + bus, or car",
      },
      {
        _key: "71606d720f66",
        _type: "primaryStat",
        label: "Highlight",
        value: "Glaciers at eye level into Saas Fee",
      },
    ],
    publicTransportAccessible: true,
    publishedDate: "2026-05-03",
    regions: ["Valais", "Visp Valley", "Saastal"],
    rentalEquipmentAvailable: false,
    routeMode: "hiking",
    routePoints: [
      {
        _key: "dc19c40ec342",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 46.2497,
          lng: 8.0297,
        },
        name: "Simplon Pass",
        type: "start",
      },
      {
        _key: "c6c49a137812",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 46.2251,
          lng: 7.9022,
        },
        name: "Gspon",
        type: "stop",
      },
      {
        _key: "1b55dfb1b784",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 46.24,
          lng: 7.98,
        },
        name: "Bistinepass",
        type: "highlight",
      },
      {
        _key: "c92f759ff068",
        _type: "routePoint",
        coordinates: {
          _type: "geopoint",
          lat: 46.1083,
          lng: 7.9293,
        },
        name: "Saas Fee",
        type: "end",
      },
    ],
    routeStops: [
      {
        _key: "gspon",
        _type: "routeStop",
        coordinates: {
          _type: "geopoint",
          lat: 46.2251,
          lng: 7.9022,
        },
        name: "Gspon",
        type: "town",
      },
    ],
    scenicRating: 5,
    searchSynonyms: [
      "Simplonpass",
      "Simplon hike",
      "Saas-Fee",
      "Alpenpässe-Weg",
      "Alpine Pass Way",
      "Via Alpina Switzerland",
    ],
    searchTags: [
      "weekend hikes Switzerland",
      "Alpine Passes Trail stages",
      "Saas Fee hiking",
      "Swiss long-distance hikes",
      "Valais multi-day hikes",
    ],
    similarStories: [
      {
        _key: "gspon",
        _ref: "story-simplon-pass-saas-fee",
        _type: "reference",
      },
    ],
    slug: {
      _type: "slug",
      current: "simplon-pass-to-saas-fee",
    },
    snowSeasonAccessible: false,
    soloFriendly: true,
    specialEquipment: [
      "hiking boots",
      "30 L backpack",
      "wind layer + fleece + waterproof",
      "dry change for overnight",
      "2 L water capacity",
      "headlamp",
      "offline maps + power bank",
      "cash (CHF) for Gspon",
    ],
    startingPoint: {
      _type: "startingPoint",
      coordinates: {
        _type: "geopoint",
        lat: 46.2497,
        lng: 8.0297,
      },
      name: "Simplon Pass",
      type: "trailhead",
    },
    status: "published",
    storyId: "switzerland-simplon-saasfee-2022",
    subtitle: "The high traverse above the Visp valley, with glaciers at eye level into Saas-Fee.",
    technicalSkillRequired: "basic",
    testedBy: "pikelis",
    testedWith: ["adult travelers"],
    timeOfDay: "multi_day",
    timesCompleted: 1,
    title: "Simplon Pass to Saas-Fee: A 2-Day Alpine Passes Trail Hike",
    totalDistanceKm: 41,
    transportationDifficulty: "moderate",
    transportationRequired: ["train", "bus", "cable_car"],
    uniqueSellingPoints: [
      "Two stages of the Alpine Passes Trail in a single weekend",
      "Genuinely remote alpine hamlet (Gspon) as the overnight",
      "Glacier views right at eye level into Saas Fee",
      "Long traverse without technical climbing",
      "Reachable by public transport from Zurich, Bern, Basel, or Geneva",
    ],
    verifiedFacts: [
      "Day 1 covered Simplon Pass to Gspon in around 6 h with a long lunch break",
      "Hotel Alpenblick was fully booked at our planned arrival — backup via Stalden cable car worked",
      "Day 2 from Gspon to Saas Fee took around 5 h in cooler, cloudy weather",
      "Cable car between Stalden and Gspon runs 04:15 to 21:10",
      "Bus #631 connects Brig to Simplon Pass; Bus #511 connects Saas Fee to Brig",
    ],
    weatherDependent: true,
    whatMakesThisSpecial: "Two long stages of the Alpine Passes Trail strung together in a single weekend, ending in Saas Fee with the high glaciers right there at eye level.",
    whatYouGet: [
      "Day 1 timeline with arrival logistics from Zurich, Bern, Basel, and Geneva",
      "Overnight plan for Hotel Alpenblick Gspon, with the Stalden cable-car backup",
      "Day 2 timeline with return bus and train connections",
      "Full route map with numbered waypoints and elevation profiles",
      "Pack list, full cost breakdown, and reservations checklist",
      "Interactive Google My Maps companion with every pin in the guide",
    ],
    wheelchairAccessible: false,
    whoThisIsFor: [
      "Comfortable with a 7-hour Day 1 followed by a 6-hour Day 2",
      "Want a real 2-day mountain plan with the logistics solved",
      "Prefer self-guided independent travel",
      "Based in Switzerland or Europe with public-transport access",
    ],
    whyThisTrip: [
      "Two stages of the Alpine Passes Trail in a single weekend",
      "Glaciers at eye level on the descent into Saas Fee",
      "Genuine remote feel without leaving Switzerland's transport network",
      "Quiet alpine hamlet of Gspon as the overnight",
    ],
  },
};

---
# ─────────── REQUIRED ───────────
title: Your Story Title Here
destination: Switzerland   # country or region — auto-creates the destination doc if new
author: Paulius Pikelis    # writer's full name — auto-creates the author doc if new

# ─────────── COMMONLY USED ───────────
slug: your-story-slug      # optional — auto-generated from title if omitted
publishedDate: 2024-10-18  # date of the trip (YYYY-MM-DD). defaults to today.
status: published          # draft | published | archived
language: en               # en | de | lt

# Hero
eyebrow: SWITZERLAND • DAY TRIP • HIKING   # small uppercase label above title
subtitle: One or two sentence hook shown under the title.

primaryStats:
  - { label: Duration, value: 1 day }
  - { label: Effort, value: ~3–4 h total }
  - { label: Altitude, value: 1,720 m }
  - { label: Access, value: Car ~2 h from Zürich }

# Country extras (optional)
countryCode: CH            # ISO-3166 two-letter code
continent: europe          # africa | antarctica | asia | europe | north_america | oceania | south_america

# Location details (optional)
regions: [Bern, Bernese Oberland]
nearestCity: Lucerne
nearestCityDistanceKm: 85
coordinates: { lat: 46.6958, lng: 8.3526 }
startingPoint:
  name: Triftbahn Valley Station
  type: trailhead          # trailhead | airport | train_station | city_centre | harbour | parking | base_camp | other
  coordinates: { lat: 46.7184, lng: 8.3482 }

# Classification (powers filters on /inspire)
primaryCollection: Switzerland
allCollections: [Switzerland, Day Trips, Hiking, Suspension Bridges]
journeyCategory: day_trip          # day_trip | expedition | road_trip | weekend | etc.
activityCategory: outdoor_hiking   # hiking | mountain_climbing | diving | driving | etc.
activityTags: [suspension bridge, alpine day hike, glacier valley views]
journeyStyle: self_guided          # self_guided | guided | mixed
highlights:
  - Crossing the dramatic Trift suspension bridge
  - Wide glacier valley views with snow-covered peaks

# Difficulty (optional, but useful)
difficulty:
  overallLevel: moderate           # easy | moderate | hard | very_hard | extreme
  physicalFitnessRequired: high    # low | moderate | high | very_high
  technicalSkillRequired: basic    # none | basic | intermediate | advanced | expert
  elevationGainM: 1200
  maxAltitudeM: 1720
  totalDistanceKm: 15
  factors:
    - Exposure on the suspension bridge
    - Long day when done from Zurich including transport
  notSuitableIf:
    - You have a strong fear of heights
    - You lack the fitness for a 5.5-hour mountain hike

# Suitability (optional)
suitability:
  familyFriendly: true
  minAgeRecommended: 12
  soloFriendly: true
  beginnerFriendly: false
  wheelchairAccessible: false
  idealGroupSize: 1–4 people
  testedWith: [adult travelers]
  idealFor: [photographers, active explorers, couples]

# Timing (optional)
timing:
  durationDays: 1
  durationHours: 5.5
  durationDisplay: 1 day from Zurich, with 5.5 h of hiking
  bestMonths: [6, 7, 8, 9, 10]
  bestSeasons: [summer, fall]
  avoidMonths: [11, 12, 1, 2, 3]
  timeOfDay: full_day              # early_morning | morning | afternoon | evening | night | full_day | multi_day
  weatherDependent: true
  snowSeasonAccessible: false

# Logistics (optional)
logistics:
  transportRequired: [train, bus, cable_car]
  transportDifficulty: moderate    # easy | moderate | high | extreme
  carRequired: false
  fourByFourRequired: false
  publicTransportAccessible: true
  accommodationType: none          # none | hotel | hostel | guesthouse | camping | mountain_hut | homestay | other
  permitsRequired: false
  permitsInfo: ""
  bookingsRequired: [Triftbahn cable car in busy periods]
  bookingsAdvanceDays: 3
  specialEquipment: [hiking shoes, waterproof jacket, warm layer]
  rentalEquipmentAvailable: false

# Budget (optional)
budget:
  level: moderate                  # cheap | moderate | expensive | luxury
  estimatedCostMin: 70
  estimatedCostMax: 150
  currency: CHF
  costBreakdown:
    transport: 40
    food: 20
    accommodation: 0
    activities: 32
  moneySavingTips:
    - Use public transport passes or saver tickets from Zurich
    - Bring your own lunch instead of relying on mountain food

# Differentiation (optional)
differentiation:
  uniqueSellingPoints:
    - Dramatic suspension bridge reachable as a Zurich day trip
    - Combines forest trail, glacier lake, alpine rock, and a high bridge
  whatMakesThisSpecial: Triftbrücke delivers a true high-alpine atmosphere in a single day from Zurich.
  bestForCrowdType: active_explorers
  crowdLevel: moderate             # low | moderate | high | very_high
  scenicRating: 5                  # 1–5
  adrenaline: 4                    # 1–5

# ─────────── GUIDE (only if this is a sellable guide) ───────────
guide:
  hasGuide: false
  # status: available              # available | coming_soon | draft | retired
  # price: 12.99
  # currency: EUR
  # format: [PDF]
  # pageSlug: trift-bridge-from-zurich   # only set if the /guides URL should differ from the story slug

# Sales pitch — appears on the guide landing page. Only used when guide.hasGuide is true.
sales:
  whyThisTrip:
    - Best suspension bridge hike near Zürich
    - Real glacier landscape without overnight stay
  whoThisIsFor:
    - Based in Zurich for 1–2 days
    - Comfortable walking uphill for 2–3 hours
  whatYouGet:
    - 3 route variants compared (gondola vs full hike)
    - Step-by-step day plan for car and public transport
    - Weather go/no-go rules
    - Full cost breakdown and saver-fare tips
    - Complete packing list
  difficultyAtAGlance:
    - Steepness — consistent uphill ~1.5 h
    - Exposure — suspension bridge only
    - Fitness — ~450 m ascent over ~6 km
  notSuitable:
    - If you have a fear of heights
    - If you have a fear of exposed bridge crossings

# SEO (optional)
seo:
  metaTitle: Triftbrücke from Zurich — Epic Swiss Day Hike
  metaDescription: A dramatic day hike from Zurich to Triftbrücke with a suspension bridge, glacier lake views, and big alpine scenery in the Swiss Alps.
  keywords: [Triftbrücke, Trift Bridge, Zurich day trip, Switzerland hiking]
  searchTags: [day trips from Zurich, best hikes near Zurich]
  searchSynonyms: [Triftbrucke, Trift Bridge, Hangebrucke Trift]
  appearsInSearches:
    - how to visit Triftbrucke from Zurich
    - best day trip hike from Zurich Switzerland

# Credibility (optional — admin notes)
credibility:
  timesCompleted: 1
  mostRecentCompletion: 2020-10-18
  testedBy: pikelis
  verifiedFacts:
    - Done car-to-car without the cable car
    - Bridge reached in 2 hours from the trailhead
  commonMistakes:
    - Underestimating the full day when starting from Zurich
    - Wearing casual shoes for a rocky mountain trail
  insiderTips:
    - Start early — arrive at the trailhead by 9:30
    - Bring layers even on sunny days

# Route (optional — shown as map on story/guide page)
route:
  mode: hiking                     # hiking | driving | cycling | flying | boat | mixed
  mapZoom: 13
routePoints:
  - name: Zurich HB
    coordinates: { lat: 47.3782, lng: 8.5403 }
    type: start                    # start | stop | highlight | end
  - name: Triftbahn Station
    coordinates: { lat: 46.7184, lng: 8.3482 }
    type: stop
  - name: Trift Suspension Bridge
    coordinates: { lat: 46.7298, lng: 8.3719 }
    type: highlight

# Homepage (admin-only)
featuredInHomepage: false
featuredPriority: 5

---

# Your story body starts here in plain markdown

Write in first person. Short paragraphs (2–4 sentences). Real details — actual timings, actual costs, actual mistakes. Skip travel-blog clichés.

## Use headings to break up long stories

You can use **bold**, *italic*, and [links](https://example.com).

- Bullet lists
- Like this

1. Numbered lists
2. Like this

> Blockquotes for standout lines.

Delete everything above the `---` and below this line that you don't need — empty fields are ignored.

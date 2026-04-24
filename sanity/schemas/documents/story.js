export default {
  name: "story",
  title: "Story",
  type: "document",
  description:
    'The core Pikelis Travel content unit. Every trip is a "story". Turn on "Has guide" under the Commerce tab if this story has a sellable PDF — it will then appear on the Guides page.',
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "location", title: "Location" },
    { name: "details", title: "Details" },
    { name: "commerce", title: "Commerce" },
    { name: "classification", title: "Classification" },
    { name: "seo", title: "SEO" },
    { name: "relationships", title: "Relationships" },
    { name: "internal", title: "Internal" },
  ],
  fieldsets: [
    { name: "hero", title: "Hero", options: { collapsible: true, collapsed: false } },
    { name: "difficulty", title: "Difficulty", options: { collapsible: true, collapsed: true } },
    { name: "suitability", title: "Suitability", options: { collapsible: true, collapsed: true } },
    { name: "timing", title: "Timing", options: { collapsible: true, collapsed: true } },
    { name: "logistics", title: "Logistics", options: { collapsible: true, collapsed: true } },
    { name: "budget", title: "Budget", options: { collapsible: true, collapsed: true } },
    { name: "differentiation", title: "Differentiation", options: { collapsible: true, collapsed: true } },
    { name: "credibility", title: "Credibility", options: { collapsible: true, collapsed: true } },
    { name: "maintenance", title: "Maintenance", options: { collapsible: true, collapsed: true } },
    { name: "route", title: "Route", options: { collapsible: true, collapsed: true } },
    { name: "sales", title: "Sales pitch (guide landing page)", options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    /* ──────────────── CONTENT ──────────────── */
    {
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      description:
        "URL path under /inspire/ and (if a guide) /guides/. Keep consistent with any existing public URLs to avoid broken links.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "storyId",
      title: "Story ID",
      type: "string",
      group: "content",
      description:
        'Stable internal ID (e.g. "switzerland-triftbrucke-2020"). Used for cross-references; do not change after publishing.',
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "language",
      title: "Language",
      type: "string",
      group: "content",
      initialValue: "en",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "German", value: "de" },
          { title: "Lithuanian", value: "lt" },
        ],
      },
    },
    {
      name: "publishedDate",
      title: "Published date",
      type: "date",
      group: "content",
      description: "When the trip happened (for sorting and dating bylines).",
    },
    {
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      group: "content",
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    },

    /* Hero fieldset */
    {
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "content",
      fieldset: "hero",
      description: 'Small label above the title, e.g. "SWITZERLAND • DAY TRIP • HIKING"',
      validation: (Rule) => Rule.max(80),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      group: "content",
      fieldset: "hero",
      description: "One or two sentences shown under the title.",
      validation: (Rule) => Rule.max(300),
    },
    {
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "content",
      fieldset: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "primaryStats",
      title: "Primary stats",
      type: "array",
      group: "content",
      fieldset: "hero",
      of: [{ type: "primaryStat" }],
      description: "3–6 at-a-glance stats shown with the hero.",
      validation: (Rule) => Rule.max(8),
    },

    /* Body */
    {
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
        { type: "galleryGrid" },
        { type: "mapEmbed" },
        { type: "statBlock" },
        { type: "callout" },
        { type: "pullQuote" },
      ],
    },

    /* Media */
    {
      name: "galleryImages",
      title: "Gallery (outside body)",
      type: "array",
      group: "content",
      description:
        "Additional photos attached to the story but not placed inline in the body. Useful for a bottom-of-page gallery.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt text", type: "string", validation: (Rule) => Rule.required() },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
    },
    { name: "hasVideo", title: "Has video", type: "boolean", group: "content", initialValue: false },
    {
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "content",
      hidden: ({ parent }) => !parent?.hasVideo,
    },

    /* ──────────────── LOCATION ──────────────── */
    {
      name: "destination",
      title: "Destination",
      type: "reference",
      group: "location",
      to: [{ type: "destination" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "regions",
      title: "Regions",
      type: "array",
      group: "location",
      of: [{ type: "string" }],
      description: 'e.g. ["Bern", "Bernese Oberland", "Gadmen"]',
    },
    { name: "nearestCity", title: "Nearest major city", type: "string", group: "location" },
    {
      name: "nearestCityDistanceKm",
      title: "Distance from nearest city (km)",
      type: "number",
      group: "location",
    },
    {
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      group: "location",
      description: "Central point of the trip (for destination filtering).",
    },
    {
      name: "startingPoint",
      title: "Starting point",
      type: "startingPoint",
      group: "location",
    },

    /* ──────────────── DETAILS (difficulty, suitability, timing, logistics, budget, differentiation) ──────────────── */
    /* Difficulty */
    {
      name: "overallLevel",
      title: "Overall level",
      type: "string",
      group: "details",
      fieldset: "difficulty",
      options: {
        list: ["easy", "moderate", "hard", "very_hard", "extreme"].map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: "physicalFitnessRequired",
      title: "Physical fitness required",
      type: "string",
      group: "details",
      fieldset: "difficulty",
      options: {
        list: ["low", "moderate", "high", "very_high"].map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: "technicalSkillRequired",
      title: "Technical skill required",
      type: "string",
      group: "details",
      fieldset: "difficulty",
      options: {
        list: ["none", "basic", "intermediate", "advanced", "expert"].map((v) => ({ title: v, value: v })),
      },
    },
    { name: "elevationGainM", title: "Elevation gain (m)", type: "number", group: "details", fieldset: "difficulty" },
    { name: "maxAltitudeM", title: "Max altitude (m)", type: "number", group: "details", fieldset: "difficulty" },
    { name: "totalDistanceKm", title: "Total distance (km)", type: "number", group: "details", fieldset: "difficulty" },
    {
      name: "difficultyFactors",
      title: "Difficulty factors",
      type: "array",
      group: "details",
      fieldset: "difficulty",
      of: [{ type: "string" }],
    },
    {
      name: "notSuitableIf",
      title: "Not suitable if…",
      type: "array",
      group: "details",
      fieldset: "difficulty",
      of: [{ type: "string" }],
    },

    /* Suitability */
    { name: "familyFriendly", title: "Family friendly", type: "boolean", group: "details", fieldset: "suitability" },
    { name: "minAgeRecommended", title: "Min age recommended", type: "number", group: "details", fieldset: "suitability" },
    { name: "soloFriendly", title: "Solo friendly", type: "boolean", group: "details", fieldset: "suitability" },
    { name: "beginnerFriendly", title: "Beginner friendly", type: "boolean", group: "details", fieldset: "suitability" },
    { name: "wheelchairAccessible", title: "Wheelchair accessible", type: "boolean", group: "details", fieldset: "suitability" },
    { name: "idealGroupSize", title: "Ideal group size", type: "string", group: "details", fieldset: "suitability" },
    {
      name: "testedWith",
      title: "Tested with",
      type: "array",
      group: "details",
      fieldset: "suitability",
      of: [{ type: "string" }],
    },
    {
      name: "idealFor",
      title: "Ideal for",
      type: "array",
      group: "details",
      fieldset: "suitability",
      of: [{ type: "string" }],
    },

    /* Timing */
    { name: "durationDays", title: "Duration (days)", type: "number", group: "details", fieldset: "timing" },
    { name: "durationHours", title: "Duration (hours)", type: "number", group: "details", fieldset: "timing" },
    {
      name: "durationDisplay",
      title: "Duration display",
      type: "string",
      group: "details",
      fieldset: "timing",
      description: 'Human-readable, e.g. "1 day from Zurich, with 5.5 h of hiking"',
    },
    {
      name: "bestMonths",
      title: "Best months",
      type: "array",
      group: "details",
      fieldset: "timing",
      of: [{ type: "number", validation: (Rule) => Rule.min(1).max(12) }],
    },
    {
      name: "bestSeasons",
      title: "Best seasons",
      type: "array",
      group: "details",
      fieldset: "timing",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Spring", value: "spring" },
          { title: "Summer", value: "summer" },
          { title: "Autumn", value: "fall" },
          { title: "Winter", value: "winter" },
        ],
      },
    },
    {
      name: "avoidMonths",
      title: "Avoid months",
      type: "array",
      group: "details",
      fieldset: "timing",
      of: [{ type: "number", validation: (Rule) => Rule.min(1).max(12) }],
    },
    {
      name: "timeOfDay",
      title: "Time of day",
      type: "string",
      group: "details",
      fieldset: "timing",
      options: {
        list: ["early_morning", "morning", "afternoon", "evening", "night", "full_day", "multi_day"].map((v) => ({ title: v, value: v })),
      },
    },
    { name: "weatherDependent", title: "Weather dependent", type: "boolean", group: "details", fieldset: "timing" },
    { name: "snowSeasonAccessible", title: "Snow-season accessible", type: "boolean", group: "details", fieldset: "timing" },

    /* Logistics */
    {
      name: "transportationRequired",
      title: "Transportation required",
      type: "array",
      group: "details",
      fieldset: "logistics",
      of: [{ type: "string" }],
    },
    {
      name: "transportationDifficulty",
      title: "Transportation difficulty",
      type: "string",
      group: "details",
      fieldset: "logistics",
      options: { list: ["easy", "moderate", "high", "extreme"].map((v) => ({ title: v, value: v })) },
    },
    { name: "carRequired", title: "Car required", type: "boolean", group: "details", fieldset: "logistics" },
    { name: "fourByFourRequired", title: "4×4 required", type: "boolean", group: "details", fieldset: "logistics" },
    { name: "publicTransportAccessible", title: "Public transport accessible", type: "boolean", group: "details", fieldset: "logistics" },
    {
      name: "accommodationType",
      title: "Accommodation type",
      type: "string",
      group: "details",
      fieldset: "logistics",
      options: {
        list: ["none", "hotel", "hostel", "guesthouse", "camping", "mountain_hut", "homestay", "other"].map((v) => ({ title: v, value: v })),
      },
    },
    { name: "permitsRequired", title: "Permits required", type: "boolean", group: "details", fieldset: "logistics" },
    { name: "permitsInfo", title: "Permits info", type: "text", rows: 2, group: "details", fieldset: "logistics" },
    {
      name: "bookingsRequired",
      title: "Bookings required",
      type: "array",
      group: "details",
      fieldset: "logistics",
      of: [{ type: "string" }],
    },
    { name: "bookingsAdvanceDays", title: "Bookings advance (days)", type: "number", group: "details", fieldset: "logistics" },
    {
      name: "specialEquipment",
      title: "Special equipment",
      type: "array",
      group: "details",
      fieldset: "logistics",
      of: [{ type: "string" }],
    },
    { name: "rentalEquipmentAvailable", title: "Rental equipment available", type: "boolean", group: "details", fieldset: "logistics" },

    /* Budget */
    {
      name: "budgetLevel",
      title: "Budget level",
      type: "string",
      group: "details",
      fieldset: "budget",
      options: {
        list: ["cheap", "moderate", "expensive", "luxury"].map((v) => ({ title: v, value: v })),
      },
    },
    { name: "estimatedCost", title: "Estimated cost", type: "estimatedCost", group: "details", fieldset: "budget" },
    { name: "costBreakdown", title: "Cost breakdown", type: "costBreakdown", group: "details", fieldset: "budget" },
    {
      name: "moneySavingTips",
      title: "Money saving tips",
      type: "array",
      group: "details",
      fieldset: "budget",
      of: [{ type: "string" }],
    },

    /* Differentiation */
    {
      name: "uniqueSellingPoints",
      title: "Unique selling points",
      type: "array",
      group: "details",
      fieldset: "differentiation",
      of: [{ type: "string" }],
    },
    {
      name: "whatMakesThisSpecial",
      title: "What makes this special",
      type: "text",
      rows: 3,
      group: "details",
      fieldset: "differentiation",
    },
    { name: "bestForCrowdType", title: "Best for crowd type", type: "string", group: "details", fieldset: "differentiation" },
    {
      name: "crowdLevel",
      title: "Crowd level",
      type: "string",
      group: "details",
      fieldset: "differentiation",
      options: { list: ["low", "moderate", "high", "very_high"].map((v) => ({ title: v, value: v })) },
    },
    {
      name: "scenicRating",
      title: "Scenic rating (1–5)",
      type: "number",
      group: "details",
      fieldset: "differentiation",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    },
    {
      name: "adrenalineLevel",
      title: "Adrenaline level (1–5)",
      type: "number",
      group: "details",
      fieldset: "differentiation",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    },

    /* ──────────────── COMMERCE ──────────────── */
    { name: "guide", title: "Guide", type: "guide", group: "commerce" },

    /* Sales pitch — only relevant if guide is present */
    {
      name: "whyThisTrip",
      title: "Why this trip",
      type: "array",
      group: "commerce",
      fieldset: "sales",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.guide?.hasGuide,
    },
    {
      name: "whoThisIsFor",
      title: "Who this is for",
      type: "array",
      group: "commerce",
      fieldset: "sales",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.guide?.hasGuide,
    },
    {
      name: "whatYouGet",
      title: "What you get",
      type: "array",
      group: "commerce",
      fieldset: "sales",
      of: [{ type: "string" }],
      description: "Concrete bullets of what's in the guide PDF.",
      hidden: ({ document }) => !document?.guide?.hasGuide,
    },
    {
      name: "difficultyAtAGlance",
      title: "Difficulty at a glance",
      type: "array",
      group: "commerce",
      fieldset: "sales",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.guide?.hasGuide,
    },
    {
      name: "notSuitableSales",
      title: "Not suitable (sales)",
      type: "array",
      group: "commerce",
      fieldset: "sales",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.guide?.hasGuide,
    },

    /* ──────────────── CLASSIFICATION ──────────────── */
    {
      name: "primaryCollection",
      title: "Primary collection",
      type: "reference",
      group: "classification",
      to: [{ type: "collection" }],
    },
    {
      name: "allCollections",
      title: "All collections",
      type: "array",
      group: "classification",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    },
    {
      name: "journeyCategory",
      title: "Journey category",
      type: "reference",
      group: "classification",
      to: [{ type: "category" }],
      options: {
        filter: 'type == "journey"',
      },
    },
    {
      name: "activityCategory",
      title: "Activity category",
      type: "reference",
      group: "classification",
      to: [{ type: "category" }],
      options: {
        filter: 'type == "activity"',
      },
    },
    {
      name: "activityTags",
      title: "Activity tags",
      type: "array",
      group: "classification",
      of: [{ type: "string" }],
    },
    {
      name: "journeyStyle",
      title: "Journey style",
      type: "string",
      group: "classification",
      options: {
        list: [
          { title: "Self-guided", value: "self_guided" },
          { title: "Guided", value: "guided" },
          { title: "Mixed", value: "mixed" },
        ],
      },
    },
    {
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "classification",
      of: [{ type: "string" }],
    },

    /* ──────────────── SEO ──────────────── */
    { name: "metaTitle", title: "Meta title", type: "string", group: "seo", validation: (Rule) => Rule.max(70) },
    { name: "metaDescription", title: "Meta description", type: "text", rows: 2, group: "seo", validation: (Rule) => Rule.max(160) },
    { name: "keywords", title: "Keywords", type: "array", group: "seo", of: [{ type: "string" }] },
    { name: "searchTags", title: "Search tags", type: "array", group: "seo", of: [{ type: "string" }] },
    { name: "searchSynonyms", title: "Search synonyms", type: "array", group: "seo", of: [{ type: "string" }] },
    { name: "alternativeNames", title: "Alternative names", type: "array", group: "seo", of: [{ type: "string" }] },
    { name: "appearsInSearches", title: "Appears in searches", type: "array", group: "seo", of: [{ type: "string" }] },

    /* ──────────────── RELATIONSHIPS ──────────────── */
    {
      name: "similarStories",
      title: "Similar stories",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "story" }] }],
    },
    {
      name: "combineWith",
      title: "Combine with",
      type: "array",
      group: "relationships",
      of: [{ type: "reference", to: [{ type: "story" }] }],
    },
    {
      name: "combineDescription",
      title: "How to combine",
      type: "text",
      rows: 2,
      group: "relationships",
    },

    /* ──────────────── INTERNAL (admin only) ──────────────── */
    /* Credibility */
    { name: "timesCompleted", title: "Times completed", type: "number", group: "internal", fieldset: "credibility" },
    { name: "mostRecentCompletion", title: "Most recent completion", type: "date", group: "internal", fieldset: "credibility" },
    { name: "testedBy", title: "Tested by", type: "string", group: "internal", fieldset: "credibility" },
    {
      name: "verifiedFacts",
      title: "Verified facts",
      type: "array",
      group: "internal",
      fieldset: "credibility",
      of: [{ type: "string" }],
    },
    {
      name: "commonMistakes",
      title: "Common mistakes",
      type: "array",
      group: "internal",
      fieldset: "credibility",
      of: [{ type: "string" }],
    },
    {
      name: "insiderTips",
      title: "Insider tips",
      type: "array",
      group: "internal",
      fieldset: "credibility",
      of: [{ type: "string" }],
    },

    /* Route */
    {
      name: "routeMode",
      title: "Route mode",
      type: "string",
      group: "internal",
      fieldset: "route",
      options: {
        list: ["hiking", "driving", "cycling", "flying", "boat", "mixed"].map((v) => ({ title: v, value: v })),
      },
    },
    { name: "mapZoom", title: "Map zoom", type: "number", group: "internal", fieldset: "route" },
    {
      name: "routePoints",
      title: "Route points",
      type: "array",
      group: "internal",
      fieldset: "route",
      of: [{ type: "routePoint" }],
    },

    /* Maintenance */
    { name: "lastVerifiedDate", title: "Last verified", type: "date", group: "internal", fieldset: "maintenance" },
    { name: "verificationFrequencyMonths", title: "Verification frequency (months)", type: "number", group: "internal", fieldset: "maintenance" },
    { name: "nextUpdateDue", title: "Next update due", type: "date", group: "internal", fieldset: "maintenance" },
    {
      name: "routeStatus",
      title: "Route status",
      type: "string",
      group: "internal",
      fieldset: "maintenance",
      options: {
        list: ["active", "changed", "closed", "seasonal_closure"].map((v) => ({ title: v, value: v })),
      },
    },
    {
      name: "contentQualityScore",
      title: "Content quality score (1–5)",
      type: "number",
      group: "internal",
      fieldset: "maintenance",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    },
    { name: "needsAttention", title: "Needs attention", type: "boolean", group: "internal", fieldset: "maintenance" },
    { name: "attentionNotes", title: "Attention notes", type: "text", rows: 2, group: "internal", fieldset: "maintenance" },

    /* Homepage featuring */
    { name: "featuredInHomepage", title: "Featured on homepage", type: "boolean", group: "internal" },
    { name: "featuredPriority", title: "Feature priority", type: "number", group: "internal" },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "destination.name",
      status: "status",
      hasGuide: "guide.hasGuide",
      media: "heroImage",
    },
    prepare({ title, subtitle, status, hasGuide, media }) {
      const chips = [status, hasGuide ? "guide" : null].filter(Boolean).join(" · ");
      return {
        title,
        subtitle: [subtitle, chips].filter(Boolean).join(" — "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published date (newest)",
      name: "publishedDesc",
      by: [{ field: "publishedDate", direction: "desc" }],
    },
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Last updated (newest)",
      name: "updatedDesc",
      by: [{ field: "lastUpdated", direction: "desc" }],
    },
  ],
};

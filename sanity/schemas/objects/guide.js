export default {
  name: "guide",
  title: "Guide (purchasable PDF)",
  type: "object",
  description:
    "Fill this in if the story has a sellable PDF guide. Leave Has guide off for story-only posts.",
  fields: [
    {
      name: "hasGuide",
      title: "Has guide",
      type: "boolean",
      description: "When on, the story appears on the Guides listing page.",
      initialValue: false,
    },
    {
      name: "status",
      title: "Guide status",
      type: "string",
      options: {
        list: [
          { title: "Available for purchase", value: "available" },
          { title: "Coming soon", value: "coming_soon" },
          { title: "Unlisted / draft", value: "draft" },
          { title: "Retired", value: "retired" },
        ],
      },
      initialValue: "draft",
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "pdf",
      title: "Guide PDF",
      type: "file",
      options: { accept: "application/pdf" },
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "pricingTier",
      title: "Pricing tier",
      type: "reference",
      to: [{ type: "pricingTier" }],
      description:
        "Pick a tier; the guide inherits all currency prices from it. For one-off pricing, leave the tier and fill Custom prices below — those override the tier.",
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "customPrices",
      title: "Custom prices (override tier)",
      type: "array",
      of: [{ type: "priceEntry" }],
      description:
        "Optional. When set, these prices override the tier for this guide only. Required when the tier is Premium.",
      hidden: ({ parent }) => !parent?.hasGuide,
      validation: (Rule) =>
        Rule.custom((entries) => {
          if (!Array.isArray(entries) || entries.length === 0) return true;
          const currencies = entries.map((e) => e?.currency).filter(Boolean);
          if (!currencies.includes("EUR")) {
            return "Custom prices must include EUR (org default currency).";
          }
          const dupes = currencies.filter((c, i) => currencies.indexOf(c) !== i);
          if (dupes.length) {
            return `Duplicate currency: ${[...new Set(dupes)].join(", ")}`;
          }
          return true;
        }),
    },
    {
      name: "format",
      title: "Format",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "PDF", value: "PDF" },
          { title: "EPUB", value: "EPUB" },
          { title: "Interactive web guide", value: "WEB" },
        ],
      },
      initialValue: ["PDF"],
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "cover",
      title: "Cover artwork",
      type: "image",
      description:
        "The guide cover, used as the sales-page lead image. Export of page 1 of the PDF.",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "pages",
      title: "Page count",
      type: "number",
      description: "Number of pages in the PDF, shown in the hero format facts.",
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "dayStrip",
      title: "Day strip",
      type: "string",
      description:
        'Plain-text route summary rendered in the hero, e.g. "Day 1 Mahé · Days 2–3 Praslin · …". Must be real text so crawlers can read it.',
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "proofLine",
      title: "Proof line",
      type: "string",
      description: 'First-person proof sentence, e.g. "I flew here with my own plan."',
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "proofPhoto",
      title: "Proof photo",
      type: "image",
      description: "Small circular inset next to the proof line — the author on the trip.",
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "carousel",
      title: "Sales carousel",
      type: "array",
      description:
        "Slides shown on the guide sales page. Images render at display resolution only (max 1200px exports). The map slide must have QR codes and /go/ links removed before export. Filling this switches the guide page to the sales layout.",
      of: [
        {
          type: "object",
          name: "carouselSlide",
          fields: [
            { name: "image", title: "Image", type: "image" },
            {
              name: "video",
              title: "Video clip",
              type: "file",
              options: { accept: "video/mp4" },
              description: "7s muted mp4. When set, plays instead of the image.",
            },
            { name: "caption", title: "Caption", type: "string" },
            { name: "alt", title: "Alt text", type: "string" },
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "sample",
      title: "Free sample day",
      type: "object",
      description:
        "One full day page given away free. Never the day carrying the guide's signature tested move.",
      fields: [
        { name: "label", title: "Label", type: "string" },
        { name: "body", title: "Body copy", type: "text", rows: 3 },
        { name: "image", title: "Page image (full readable resolution)", type: "image" },
        {
          name: "pdfPath",
          title: "Sample PDF path",
          type: "string",
          description: "Site-relative crawlable path, e.g. /samples/seychelles-day-04.pdf.",
        },
      ],
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "pageSlug",
      title: "Guide page slug",
      type: "string",
      description:
        "URL slug for the guide landing page under /guides/. Leave blank to use the story slug. Set this only if the guide URL must differ from the story URL (e.g. for historic links you want to preserve).",
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "polarProductId",
      title: "Polar product ID",
      type: "string",
      description:
        "UUID set by sync:polar after the product is created. Do not edit manually — re-running the sync script keeps it in step with the tier.",
      readOnly: true,
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "purchasesCount",
      title: "Purchases (lifetime)",
      type: "number",
      description: "Auto-incremented by the Polar webhook on each paid order. Do not edit manually.",
      readOnly: true,
      hidden: ({ parent }) => !parent?.hasGuide,
    },
  ],
};

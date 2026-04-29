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

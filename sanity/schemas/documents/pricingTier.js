export default {
  name: "pricingTier",
  title: "Pricing tier",
  type: "document",
  description:
    "Reusable price ladder for guides. Edit prices here and re-run sync:polar to propagate to all guides on this tier.",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      description: 'Editor-facing name, e.g. "Day trip", "Expedition".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 64 },
      description: "Stable identifier referenced by guides and the import pipeline.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Sort order in editor dropdowns. Lower = earlier (cheaper tiers first).",
      initialValue: 100,
    },
    {
      name: "prices",
      title: "Prices",
      type: "array",
      of: [{ type: "priceEntry" }],
      description:
        "One entry per currency. Must include EUR (org default). Leave empty for the Premium tier; per-guide customPrices fill in there.",
      validation: (Rule) =>
        Rule.custom((entries) => {
          if (!Array.isArray(entries) || entries.length === 0) return true;
          const currencies = entries.map((e) => e?.currency).filter(Boolean);
          if (!currencies.includes("EUR")) {
            return "Tiers with prices must include EUR (org default currency).";
          }
          const dupes = currencies.filter((c, i) => currencies.indexOf(c) !== i);
          if (dupes.length) {
            return `Duplicate currency: ${[...new Set(dupes)].join(", ")}`;
          }
          return true;
        }),
    },
  ],
  preview: {
    select: { name: "name", slug: "slug.current", prices: "prices" },
    prepare: ({ name, slug, prices }) => {
      const eur = Array.isArray(prices) ? prices.find((p) => p?.currency === "EUR") : null;
      const subtitle = eur ? `€${eur.amount} (${slug})` : `manual price (${slug})`;
      return { title: name, subtitle };
    },
  },
};

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
      name: "price",
      title: "Price",
      type: "number",
      description: "Price in the currency selected below.",
      validation: (Rule) => Rule.min(0),
      hidden: ({ parent }) => !parent?.hasGuide,
    },
    {
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "EUR €", value: "EUR" },
          { title: "USD $", value: "USD" },
          { title: "GBP £", value: "GBP" },
          { title: "CHF", value: "CHF" },
        ],
      },
      initialValue: "EUR",
      hidden: ({ parent }) => !parent?.hasGuide,
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
  ],
};

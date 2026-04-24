export default {
  name: "destination",
  title: "Destination",
  type: "document",
  description:
    "A country or region used on the Destinations page and as the geographic anchor for stories.",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      description: 'Country or region name (e.g. "Switzerland", "Alaska").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "continent",
      title: "Continent",
      type: "string",
      options: {
        list: [
          { title: "Africa", value: "africa" },
          { title: "Antarctica", value: "antarctica" },
          { title: "Asia", value: "asia" },
          { title: "Europe", value: "europe" },
          { title: "North America", value: "north_america" },
          { title: "Oceania", value: "oceania" },
          { title: "South America", value: "south_america" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "country",
      title: "Country",
      type: "string",
      description:
        'Full country name (e.g. "Switzerland"). For country-level destinations this matches the name.',
    },
    {
      name: "countryCode",
      title: "Country code (ISO-3166-1)",
      type: "string",
      description: "Two-letter code, e.g. CH, US, FR.",
      validation: (Rule) => Rule.length(2).uppercase(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short paragraph shown on the Destinations listing and destination page header.",
    },
    {
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Alt text", type: "string" },
      ],
    },
    {
      name: "featuredPriority",
      title: "Featured priority",
      type: "number",
      description:
        "Higher number = more prominent on the Destinations page. Leave blank to not feature.",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "continent", media: "heroImage" },
  },
};

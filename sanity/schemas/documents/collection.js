export default {
  name: "collection",
  title: "Collection",
  type: "document",
  description:
    "Editorial groupings of stories — e.g. Switzerland, 7 Summits, Day Trips, Expeditions, Suspension Bridges.",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
        "Higher number = more prominent. Leave blank if not featured on the homepage.",
    },
  ],
  preview: {
    select: { title: "name", media: "heroImage" },
  },
};

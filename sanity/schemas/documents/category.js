export default {
  name: "category",
  title: "Category",
  type: "document",
  description:
    "Journey and activity categories used to filter stories (day trip, expedition, hiking, diving, etc).",
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
      options: { source: "name", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Journey category", value: "journey" },
          { title: "Activity category", value: "activity" },
        ],
        layout: "radio",
      },
      description:
        "Journey categories describe the trip shape (day trip, expedition, road trip). Activity categories describe what you do (hiking, diving, climbing).",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    },
  ],
  preview: {
    select: { title: "name", subtitle: "type" },
  },
};

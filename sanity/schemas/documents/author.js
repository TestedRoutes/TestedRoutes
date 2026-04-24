export default {
  name: "author",
  title: "Author",
  type: "document",
  description:
    "A person who writes stories for Pikelis Travel — you or a travel partner. Authors are selected on each story.",
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
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Owner", value: "owner" },
          { title: "Partner (travel co-writer)", value: "partner" },
          { title: "Guest contributor", value: "guest" },
        ],
      },
      initialValue: "partner",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
        },
      ],
    },
    {
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 4,
      description: "1–3 sentences shown on author bylines and the author page.",
      validation: (Rule) => Rule.max(500),
    },
    {
      name: "longBio",
      title: "Long bio",
      type: "array",
      of: [{ type: "block" }],
      description: "Optional longer biography shown on the dedicated author page.",
    },
    {
      name: "location",
      title: "Based in",
      type: "string",
      description: 'e.g. "Zurich, Switzerland"',
    },
    {
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [{ type: "socialLink" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar" },
  },
};

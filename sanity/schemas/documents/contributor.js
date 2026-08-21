export default {
  name: "contributor",
  title: "Contributor",
  type: "document",
  description:
    "A 2.0-model guide contributor (Tracker #61) — the person whose tested trip " +
    "became a TestedRoutes SKU under the royalty-only model. Created ahead of the " +
    "contributor portal so stories can reference contributors from day one. " +
    "PUBLIC DATASET: no emails, no payout details, no contact information here — " +
    "identity and payout live off-platform (Polar pays the MB; MB pays the " +
    "contributor, mechanism is Tracker #111). Only what could appear on a public " +
    "byline belongs in this document.",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
      description: "Public byline name, as it would appear on the guide page.",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: "Stable identifier — future contributor pages hang off this.",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      description:
        "Short public bio in the site voice: what they've done, not credentials " +
        "theatre. Same register as the founder's About copy.",
    },
    {
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [{ type: "socialLink" }],
      description: "Public profiles only — these render as byline sameAs links.",
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description:
        "Off: the contributor relationship ended. Their published stories keep " +
        "the reference (the byline stays honest); off just blocks new assignments.",
    },
    {
      name: "joinedAt",
      title: "Joined",
      type: "date",
    },
    {
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      description:
        "Internal context (how they came in, scope agreed). Remember the dataset " +
        "is publicly readable — keep anything sensitive out of Sanity entirely.",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current", active: "active" },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? "💤 " : ""}${title || "unnamed"}`,
        subtitle,
      };
    },
  },
};

export default {
  name: "primaryStat",
  title: "Primary stat",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      description: "e.g. Duration, Effort, Altitude",
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: "value",
      title: "Value",
      type: "string",
      description: 'e.g. "1 day", "6,195 m", "~3–4 h total"',
      validation: (Rule) => Rule.required().max(120),
    },
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
};

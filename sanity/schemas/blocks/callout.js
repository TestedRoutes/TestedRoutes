export default {
  name: "callout",
  title: "Callout",
  type: "object",
  description:
    "An attention-grabbing box. Use for warnings, insider tips, common mistakes, or money-saving advice.",
  fields: [
    {
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Tip (green)", value: "tip" },
          { title: "Warning (amber)", value: "warning" },
          { title: "Danger (red)", value: "danger" },
          { title: "Info (blue)", value: "info" },
          { title: "Insider secret (purple)", value: "insider" },
        ],
      },
      initialValue: "info",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }] }],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { tone: "tone", title: "title" },
    prepare({ tone, title }) {
      return {
        title: title || `Callout (${tone || "info"})`,
        subtitle: tone,
      };
    },
  },
};

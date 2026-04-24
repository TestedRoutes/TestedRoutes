export default {
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  description: "A large emphasised quote or excerpt pulled from the story.",
  fields: [
    {
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    },
    {
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional — who said it, or where the quote came from.",
    },
  ],
  preview: {
    select: { quote: "quote", attribution: "attribution" },
    prepare({ quote, attribution }) {
      return {
        title: quote?.slice(0, 60) + (quote?.length > 60 ? "…" : ""),
        subtitle: attribution,
      };
    },
  },
};

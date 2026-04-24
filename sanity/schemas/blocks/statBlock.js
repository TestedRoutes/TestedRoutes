export default {
  name: "statBlock",
  title: "Stat block",
  type: "object",
  description:
    "A row of at-a-glance stats mid-story (e.g. Distance, Elevation, Duration, Difficulty).",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional title above the stats.",
    },
    {
      name: "stats",
      title: "Stats",
      type: "array",
      of: [{ type: "primaryStat" }],
      validation: (Rule) => Rule.min(1).max(8),
    },
  ],
  preview: {
    select: { heading: "heading", count: "stats.length" },
    prepare({ heading, count }) {
      return {
        title: heading || "Stats",
        subtitle: `${count || 0} stats`,
      };
    },
  },
};

export default {
  name: "mapEmbed",
  title: "Map",
  type: "object",
  description:
    "Embedded interactive map. Use for trailhead locations, route overviews, or highlight pins.",
  fields: [
    {
      name: "mode",
      title: "Mode",
      type: "string",
      options: {
        list: [
          { title: "Hiking", value: "hiking" },
          { title: "Driving", value: "driving" },
          { title: "Cycling", value: "cycling" },
          { title: "Flying", value: "flying" },
          { title: "Mixed", value: "mixed" },
          { title: "Single point", value: "point" },
        ],
      },
      initialValue: "hiking",
    },
    {
      name: "zoom",
      title: "Map zoom",
      type: "number",
      description: "Zoom level (1 world, 20 street).",
      validation: (Rule) => Rule.integer().min(1).max(20),
      initialValue: 10,
    },
    {
      name: "points",
      title: "Points",
      type: "array",
      of: [{ type: "routePoint" }],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: "caption",
      title: "Caption",
      type: "string",
    },
  ],
  preview: {
    select: { mode: "mode", count: "points.length" },
    prepare({ mode, count }) {
      return { title: `Map — ${mode || "mixed"} (${count || 0} points)` };
    },
  },
};

export default {
  name: "routePoint",
  title: "Route point",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Start", value: "start" },
          { title: "Stop", value: "stop" },
          { title: "Highlight", value: "highlight" },
          { title: "End", value: "end" },
        ],
      },
      initialValue: "stop",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "type" },
  },
};

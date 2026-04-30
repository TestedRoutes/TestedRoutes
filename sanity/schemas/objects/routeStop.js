export default {
  name: "routeStop",
  title: "Route stop",
  type: "object",
  description:
    "A named point along the route between the starting point and the finish. Use these in order — the first stop is rendered as the primary destination on the timeline.",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      description: 'What appears on the map pin and the timeline (e.g. "Triftbrücke", "Lake Trift").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Viewpoint", value: "viewpoint" },
          { title: "Summit / peak", value: "summit" },
          { title: "Hut / refuge", value: "hut" },
          { title: "Lake", value: "lake" },
          { title: "Waterfall", value: "waterfall" },
          { title: "Cave", value: "cave" },
          { title: "Town / village", value: "town" },
          { title: "Monument", value: "monument" },
          { title: "Bridge", value: "bridge" },
          { title: "Pass", value: "pass" },
          { title: "Trailhead", value: "trailhead" },
          { title: "Junction", value: "junction" },
          { title: "Transport stop", value: "transport_stop" },
          { title: "Restaurant / cafe", value: "restaurant" },
          { title: "Hotel / accommodation", value: "hotel" },
          { title: "Other", value: "other" },
        ],
      },
    },
    {
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: "name", subtitle: "type" },
  },
};

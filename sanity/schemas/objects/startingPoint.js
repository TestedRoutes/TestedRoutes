export default {
  name: "startingPoint",
  title: "Starting point",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Trailhead", value: "trailhead" },
          { title: "Airport", value: "airport" },
          { title: "Train station", value: "train_station" },
          { title: "City centre", value: "city_centre" },
          { title: "Harbour", value: "harbour" },
          { title: "Parking / trailhead carpark", value: "parking" },
          { title: "Base camp", value: "base_camp" },
          { title: "Other", value: "other" },
        ],
      },
    },
    {
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "type" },
  },
};

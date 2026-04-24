export default {
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "X / Twitter", value: "twitter" },
          { title: "Facebook", value: "facebook" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Strava", value: "strava" },
          { title: "Personal website", value: "website" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
};

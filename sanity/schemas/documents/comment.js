export default {
  name: "comment",
  title: "Comment",
  type: "document",
  description:
    "A buyer comment on a guide page (Tracker #61). SCHEMA ONLY TODAY: nothing " +
    "creates these until guide-page comments ship (Tracker #119, parked for 2.0 " +
    "— hybrid model: ratings come from verified buyers, comments are buyers-only " +
    "via the same purchase token). Created by the future comments API, never by " +
    "hand; moderation happens here via `status`. PUBLIC DATASET: the commenter's " +
    "email is never stored — only the keyed hash, same pattern as feedback and " +
    "the purchase registry.",
  fields: [
    {
      name: "story",
      title: "Guide / story",
      type: "reference",
      to: [{ type: "story" }],
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "authorName",
      title: "Display name",
      type: "string",
      readOnly: true,
      description: "As the buyer typed it. Rendered next to the comment.",
    },
    {
      name: "emailHash",
      title: "Commenter email (hashed)",
      type: "string",
      readOnly: true,
      description:
        "Keyed HMAC — correlates with the purchase registry, cannot be reversed.",
    },
    {
      name: "body",
      title: "Comment",
      type: "text",
      rows: 4,
      readOnly: true,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending review", value: "pending" },
          { title: "Published", value: "published" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      description:
        "Only `published` comments render on the site. Trust-based, but " +
        "post-moderation needs a kill switch.",
    },
    {
      name: "createdAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    },
  ],
  preview: {
    select: { title: "authorName", subtitle: "body", status: "status" },
    prepare({ title, subtitle, status }) {
      const flag = status === "pending" ? "🔵 " : status === "hidden" ? "🚫 " : "";
      return {
        title: `${flag}${title || "anonymous"}`,
        subtitle: (subtitle || "").slice(0, 80),
      };
    },
  },
};

export default {
  name: "purchase",
  title: "Purchase",
  type: "document",
  description:
    "One document per paid Polar order — the registry behind the signed purchase tokens. " +
    "Created by the Polar webhook, never by hand. Ticking 'revoked' kills that buyer's " +
    "token (download link and, later, feedback/rating rights) without touching anyone else's.",
  fields: [
    {
      name: "orderId",
      title: "Polar order id",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "story",
      title: "Guide purchased",
      type: "reference",
      to: [{ type: "story" }],
      readOnly: true,
    },
    {
      name: "guideSlug",
      title: "Guide slug",
      type: "string",
      readOnly: true,
      description: "Denormalized for display and for surviving a story rename.",
    },
    {
      name: "emailHash",
      title: "Buyer email (hashed)",
      type: "string",
      readOnly: true,
      description:
        "Keyed HMAC of the buyer's email — the dataset is publicly readable, so the " +
        "address itself is never stored here. Plaintext lives only in Polar and Beehiiv.",
    },
    {
      name: "createdAt",
      title: "Purchased at",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "revoked",
      title: "Revoked",
      type: "boolean",
      initialValue: false,
      description:
        "The kill switch. On: this purchase's token stops working everywhere. " +
        "Use for refund abuse or a buyer-requested erasure; leave off otherwise.",
    },
    {
      name: "refunded",
      title: "Refunded",
      type: "boolean",
      readOnly: true,
      description:
        "Set by the Polar refund webhook. A refunded buyer keeps their token " +
        "(founder's generous-refund posture) but is excluded from the day-14 " +
        "rating email - asking how the trip was after a refund reads wrong.",
    },
    {
      name: "ratingEmailSentAt",
      title: "Rating email sent",
      type: "datetime",
      readOnly: true,
      description: "Stamped by the day-14 cron. One rating email per purchase, ever.",
    },
    {
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      readOnly: true,
      description:
        "Set when the buyer taps a star. One rating per purchase; a later tap " +
        "updates it (people change their minds - the newest opinion wins).",
    },
    {
      name: "ratedAt",
      title: "Rated at",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "ratingComment",
      title: "Rating comment",
      type: "text",
      rows: 3,
      readOnly: true,
      description: "Optional free text left on the rating thank-you page.",
    },
    {
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 2,
      description: "Why revoked, support context. Internal only.",
    },
  ],
  preview: {
    select: { title: "guideSlug", subtitle: "orderId", revoked: "revoked" },
    prepare({ title, subtitle, revoked }) {
      return {
        title: `${revoked ? "⛔ " : ""}${title || "unknown guide"}`,
        subtitle,
      };
    },
  },
};

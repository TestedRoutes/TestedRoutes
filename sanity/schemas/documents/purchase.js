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

export default {
  name: "feedback",
  title: "Feedback",
  type: "document",
  description:
    "One doc per feedback submission - the unified inbox the trust system triages " +
    "(web form now; pdf-qr and ai-monitor sources join later). Created by " +
    "/api/feedback, never by hand. The submitter's email is NOT stored here " +
    "(the dataset is publicly readable): identity travels in the notification " +
    "email to hello@, whose reply-to is the submitter. Only `status` and " +
    "`internalNotes` are editable - triage state, internal-only. Story status " +
    "never auto-flips off feedback, per the 2026-05-02 founder decision.",
  fields: [
    {
      name: "story",
      title: "Guide / story",
      type: "reference",
      to: [{ type: "story" }],
      readOnly: true,
    },
    {
      name: "guideSlug",
      title: "Guide slug",
      type: "string",
      readOnly: true,
    },
    {
      name: "submitterName",
      title: "Submitter name",
      type: "string",
      readOnly: true,
      description: "Optional, as the buyer typed it. No email here by design.",
    },
    {
      name: "emailHash",
      title: "Submitter email (hashed)",
      type: "string",
      readOnly: true,
      description:
        "Keyed HMAC - correlates with the purchase registry, cannot be reversed. " +
        "The address itself is only in the notification email's reply-to.",
    },
    {
      name: "body",
      title: "Message",
      type: "text",
      rows: 6,
      readOnly: true,
    },
    {
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Web form (buyers-only)", value: "web" },
          { title: "PDF QR (open)", value: "pdf-qr" },
          { title: "AI monitor", value: "ai-monitor" },
        ],
      },
      readOnly: true,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Acknowledged", value: "acknowledged" },
          { title: "Actioned", value: "actioned" },
          { title: "Dismissed", value: "dismissed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    },
    {
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
    },
    {
      name: "createdAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    },
  ],
  preview: {
    select: { title: "guideSlug", subtitle: "body", status: "status" },
    prepare({ title, subtitle, status }) {
      const flag = status === "new" ? "🔵 " : status === "actioned" ? "✅ " : "";
      return {
        title: `${flag}${title || "unknown guide"}`,
        subtitle: (subtitle || "").slice(0, 80),
      };
    },
  },
};

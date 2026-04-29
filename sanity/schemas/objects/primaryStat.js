export default {
  name: "primaryStat",
  title: "Primary stat",
  type: "object",
  description:
    'Trip details rows surfaced at the top of the public guide page. Common labels: Duration, Walking time, Altitude, Access, Highlight. Conventions: Access should describe MODES only ("Train + bus, or car") — never include travel times. Highlight should be a one-line "what makes this trip" hook. Don\'t include "Last reviewed" here — it is rendered automatically from the maintenance fieldset.',
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      description: "e.g. Duration, Walking time, Altitude, Access, Highlight",
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: "value",
      title: "Value",
      type: "string",
      description:
        'e.g. "1 day", "6,195 m", "~3–4 h total", "Train + bus, or car". For Access, list modes only — no times.',
      validation: (Rule) => Rule.required().max(120),
    },
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
};

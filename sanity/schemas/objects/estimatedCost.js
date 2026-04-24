export default {
  name: "estimatedCost",
  title: "Estimated cost",
  type: "object",
  fields: [
    { name: "min", title: "Min", type: "number" },
    { name: "max", title: "Max", type: "number" },
    {
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "EUR €", value: "EUR" },
          { title: "USD $", value: "USD" },
          { title: "GBP £", value: "GBP" },
          { title: "CHF", value: "CHF" },
          { title: "Other", value: "OTHER" },
        ],
      },
      initialValue: "EUR",
    },
  ],
  preview: {
    select: { min: "min", max: "max", currency: "currency" },
    prepare({ min, max, currency }) {
      const c = currency || "EUR";
      const range =
        min != null && max != null
          ? `${min}–${max} ${c}`
          : min != null
            ? `from ${min} ${c}`
            : max != null
              ? `up to ${max} ${c}`
              : "—";
      return { title: range };
    },
  },
};

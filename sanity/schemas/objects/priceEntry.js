export default {
  name: "priceEntry",
  title: "Price entry",
  type: "object",
  fields: [
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
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "amount",
      title: "Amount",
      type: "number",
      description: "Price as a decimal (e.g. 12.99). Polar charges this amount in the chosen currency.",
      validation: (Rule) => Rule.required().min(0),
    },
  ],
  preview: {
    select: { currency: "currency", amount: "amount" },
    prepare: ({ currency, amount }) => {
      const symbol =
        currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "CHF" ? "CHF " : "€";
      return { title: `${symbol}${amount ?? "?"}`, subtitle: currency || "" };
    },
  },
};

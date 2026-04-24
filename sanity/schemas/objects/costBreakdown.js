export default {
  name: "costBreakdown",
  title: "Cost breakdown",
  type: "object",
  description: "Rough per-person cost split in the currency of the estimated cost.",
  fields: [
    { name: "transport", title: "Transport", type: "number" },
    { name: "food", title: "Food", type: "number" },
    { name: "equipmentRental", title: "Equipment rental", type: "number" },
    { name: "accommodation", title: "Accommodation", type: "number" },
    { name: "activities", title: "Activities / entry fees", type: "number" },
  ],
};

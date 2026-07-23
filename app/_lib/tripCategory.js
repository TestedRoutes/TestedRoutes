// Trip-category -> styleguide color chip (TestedRoutes-Styleguide.pdf, 2026-07).
// Category strings vary ("Weekend", "weekend_trip", "Day trip hike"), so match
// loosely; order matters ("weekend" must win over "week"). Unknown categories
// fall back to the neutral Bone chip rather than guessing a tier.
const RULES = [
  [/multi[\s_-]?week/i, "bg-brand-cat-multi"],
  [/weekend/i, "bg-brand-cat-weekend"],
  [/expedition/i, "bg-brand-cat-expedition"],
  [/week/i, "bg-brand-cat-week"],
  [/day/i, "bg-brand-cat-day"],
];

export function tripCategoryChipClass(category) {
  const s = typeof category === "string" ? category : "";
  for (const [re, cls] of RULES) {
    if (re.test(s)) return cls;
  }
  return "bg-brand-bone";
}

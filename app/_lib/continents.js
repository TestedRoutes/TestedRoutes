// Geography values arrive from Sanity in snake_case ("north_america").
// The home continent band and the Inspire continent filter both need the
// same display label and the same URL token, so both live here.

export function prettyGeo(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// "North America" / "north_america" → "north-america"
export function continentSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Continent tabs on the browse pages (founder mockup 2026-08-08): the American
// continents share one "Americas" tab, everything else keeps its own slug.
// Both /guides and /inspire draw this row, and they have to bucket the same
// way — otherwise a story and the guide it belongs to sit under different
// tabs — so the rule lives here rather than in either browse component.
const AMERICAS = new Set([
  "north-america",
  "south-america",
  "central-america",
  "americas",
]);

export const CONTINENT_TAB_ORDER = [
  "europe",
  "asia",
  "africa",
  "americas",
  "oceania",
];

// Takes a raw continent value or an already-slugged one: continentSlug is
// idempotent, so callers holding either can pass it straight through.
export function continentBucket(value) {
  const slug = continentSlug(value);
  if (!slug) return "";
  return AMERICAS.has(slug) ? "americas" : slug;
}

export function continentTabLabel(bucket) {
  return bucket === "americas" ? "Americas" : prettyGeo(bucket);
}

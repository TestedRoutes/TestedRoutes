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

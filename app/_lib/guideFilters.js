import { prettyGeo } from "./continents";

// Shared filter logic for the guide grids on home and /guides (founder
// 2026-08-08: both pages carry the same four dropdowns — Country, Length,
// Activity, Season). Options always derive from the cards actually passed
// in, so a tier or season only appears once a guide carries it.

// Length is the trip tier (the guide's journey category), shown in trip
// order rather than alphabetically: Day Trip, Weekend, Week, Two weeks,
// Expedition. Data values rank by their first word ("Week+" sits with
// Week) so new tiers slot in without code changes.
const LENGTH_ORDER = ["day", "weekend", "week", "two", "multi", "expedition"];
function lengthRank(value) {
  const first = String(value).toLowerCase().trim().split(/[\s+]/)[0];
  const i = LENGTH_ORDER.indexOf(first);
  return i === -1 ? LENGTH_ORDER.length : i;
}

// Fixed calendar order for the Season dropdown; anything unknown sorts last.
const SEASON_ORDER = ["spring", "summer", "autumn", "fall", "winter", "year_round"];
function seasonRank(value) {
  const i = SEASON_ORDER.indexOf(String(value).toLowerCase());
  return i === -1 ? SEASON_ORDER.length : i;
}

const cardCountry = (g) => prettyGeo(g.metadata?.geography?.country);
const cardActivity = (g) => prettyGeo(g.metadata?.classification?.activity_category);
const cardSeasons = (g) =>
  (g.metadata?.timing?.best_seasons || []).map((s) => String(s).toLowerCase());

export function buildGuideFilterOptions(guides) {
  const uniq = (values) => [...new Set(values.filter(Boolean))];
  return {
    countries: uniq(guides.map(cardCountry)).sort(),
    lengths: uniq(guides.map((g) => g.category)).sort(
      (a, b) => lengthRank(a) - lengthRank(b) || a.localeCompare(b),
    ),
    activities: uniq(guides.map(cardActivity)).sort(),
    seasons: uniq(guides.flatMap(cardSeasons)).sort((a, b) => seasonRank(a) - seasonRank(b)),
  };
}

// filters: { country, length, activity, season } — empty string means "All".
export function matchesGuideFilters(guide, filters) {
  return (
    (!filters.country || cardCountry(guide) === filters.country) &&
    (!filters.length || guide.category === filters.length) &&
    (!filters.activity || cardActivity(guide) === filters.activity) &&
    (!filters.season || cardSeasons(guide).includes(filters.season))
  );
}

export function guideSearchHaystack(guide) {
  const geo = guide.metadata?.geography || {};
  // Geography goes in twice: raw snake_case and the display form, so both
  // "new_zealand" and a typed "New Zealand" (or a ?q= link) match.
  return [
    guide.title,
    guide.category,
    geo.country,
    geo.continent,
    prettyGeo(geo.country),
    prettyGeo(geo.continent),
    guide.metadata?.seo?.meta_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function matchesGuideSearch(guide, query) {
  const needle = (query || "").toLowerCase().trim();
  if (!needle) return true;
  return guideSearchHaystack(guide).includes(needle);
}

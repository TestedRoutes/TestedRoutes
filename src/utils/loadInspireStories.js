/**
 * Barrel: display helpers + fetch-based loader (`loadInspireStoriesData.js`).
 * For browser-only React + Babel pages, dynamically import `loadInspireStoriesData.js`
 * together with `inspireStoryDisplay.js` to avoid any `require()` shim from chained exports.
 */

export {
  INSPIRE_FACET_UNSPECIFIED,
  buildInspireFacetOptions,
  createEmptyInspireFacetSelection,
  formatInspireDifficultyLabel,
  formatInspireDurationDays,
  formatInspireJourneyCategoryLabel,
  getInspireFeaturedCardDisplay,
  getInspireStoryCategoryDurationLine,
  getInspireStoryDifficulty,
  getInspireStoryDifficultySortRank,
  getInspireStoryGeoFields,
  getInspireStoryGeoLabel,
  getInspireStoryGuideUrl,
  getInspireStoryHeroAlt,
  getInspireStoryListCardHref,
  getInspireStoryMarkdownExcerpt,
  getInspireStorySearchHaystack,
  getInspireStorySortDateMillis,
  inspireFacetSelectionHasActive,
  inspireListPrimaryDestinationIsGuide,
  inspireStoryHasGuide,
  matchesInspireStorySearch,
  normalizeInspireSearchQuery,
  projectInspireStoryFacetValues,
  sortInspireStoriesByKey,
  storyPassesInspireFacetSelection,
} from "./inspireStoryDisplay.js";

export { loadInspireStories, loadStories } from "./loadInspireStoriesData.js";
export { default } from "./loadInspireStoriesData.js";

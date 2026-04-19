/**
 * Inspire filter primitives (OR within each facet dimension, AND across dimensions).
 * Full browse pipeline (load, debounced search, URL sync, pagination) lives in
 * `useInspireBrowseState.js`.
 */
export {
  storyPassesInspireFacetSelection,
  buildInspireFacetOptions,
  createEmptyInspireFacetSelection,
  inspireFacetSelectionHasActive,
  projectInspireStoryFacetValues,
  matchesInspireStorySearch,
} from "../utils/loadInspireStories.js";

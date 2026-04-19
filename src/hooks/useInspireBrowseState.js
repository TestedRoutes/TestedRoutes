/**
 * Client-side browse state for Inspire: load stories, debounced search,
 * facet filters (OR within a dimension, AND across dimensions), sort, pagination.
 *
 * @param {{
 *   loadModule?: () => Promise<Record<string, unknown>>,
 *   loadStoriesOptions?: Record<string, unknown>,
 * }} [options]
 */
import * as React from "react";
import { createEmptyInspireFacetSelection as createEmptyFacetFromLib } from "../utils/loadInspireStories.js";
import { parseFromSearch, replaceUrl } from "../utils/inspireFilterQuery.js";

export const INSPIRE_PAGE_SIZE = 12;

export const INSPIRE_FACET_UI = [
  { dim: "continent", label: "📍 Continent" },
  { dim: "country", label: "📍 Country" },
  { dim: "duration", label: "⏱️ Duration" },
  { dim: "activity", label: "🎯 Activity type" },
  { dim: "difficulty", label: "💪 Difficulty" },
  { dim: "season", label: "📅 Season" },
  { dim: "budget", label: "💰 Budget" },
];

export function createEmptyInspireFacetSelection() {
  return createEmptyFacetFromLib();
}

export function useInspireBrowseState(options = {}) {
  const loadModule =
    typeof options.loadModule === "function"
      ? options.loadModule
      : () => import("../utils/loadInspireStories.js");

  const loadOptsRef = React.useRef(
    options.loadStoriesOptions && typeof options.loadStoriesOptions === "object" ? options.loadStoriesOptions : {},
  );
  loadOptsRef.current =
    options.loadStoriesOptions && typeof options.loadStoriesOptions === "object" ? options.loadStoriesOptions : {};

  const [contentStories, setContentStories] = React.useState([]);
  const [contentStoriesReady, setContentStoriesReady] = React.useState(false);
  const [contentLoaderMod, setContentLoaderMod] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState("content");
  const [facetSelection, setFacetSelection] = React.useState(() => createEmptyFacetFromLib());
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(INSPIRE_PAGE_SIZE);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 260);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const allowHistorySync = React.useRef(false);

  React.useEffect(() => {
    const { facetSelection: parsedSel, searchInput: parsedQ } = parseFromSearch(window.location.search);
    if (parsedQ) setSearchInput(parsedQ);
    if (parsedSel && typeof parsedSel === "object") {
      const base = createEmptyFacetFromLib();
      const merged = { ...base };
      Object.keys(base).forEach((dim) => {
        const arr = parsedSel[dim];
        merged[dim] = Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
      });
      setFacetSelection(merged);
    }
    window.setTimeout(() => { allowHistorySync.current = true; }, 0);
  }, []);

  React.useEffect(() => {
    if (!allowHistorySync.current) return;
    const t = window.setTimeout(() => { replaceUrl(facetSelection, searchInput); }, 400);
    return () => window.clearTimeout(t);
  }, [facetSelection, searchInput]);

  React.useEffect(() => {
    setVisibleCount(INSPIRE_PAGE_SIZE);
  }, [debouncedSearch, facetSelection, sortKey, contentStories.length]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await loadModule();
        if (cancelled) return;
        setContentLoaderMod(mod);
        const load = mod.loadInspireStories || mod.default;
        if (typeof load !== "function") throw new Error("loadInspireStories missing on module");
        const list = await load(loadOptsRef.current);
        if (cancelled) return;
        setContentStories(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("[useInspireBrowseState] load failed", e);
        if (!cancelled) setContentStories([]);
      } finally {
        if (!cancelled) setContentStoriesReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadModule]);

  const visibleStories = React.useMemo(() => {
    try {
      if (!contentStoriesReady || !contentLoaderMod) return [];
      const match = contentLoaderMod.matchesInspireStorySearch;
      if (typeof match !== "function") return contentStories;
      const q = debouncedSearch.trim();
      if (!q) return contentStories;
      return contentStories.filter((s) => match(s, q));
    } catch {
      return contentStories;
    }
  }, [contentStories, contentStoriesReady, contentLoaderMod, debouncedSearch]);

  const facetOptions = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.buildInspireFacetOptions !== "function") return null;
      return contentLoaderMod.buildInspireFacetOptions(contentStories);
    } catch {
      return null;
    }
  }, [contentLoaderMod, contentStories]);

  const facetFilteredStories = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.storyPassesInspireFacetSelection !== "function") {
        return visibleStories;
      }
      return visibleStories.filter((s) => contentLoaderMod.storyPassesInspireFacetSelection(s, facetSelection));
    } catch {
      return visibleStories;
    }
  }, [contentLoaderMod, visibleStories, facetSelection]);

  const displayedStories = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.sortInspireStoriesByKey !== "function") {
        return facetFilteredStories;
      }
      return contentLoaderMod.sortInspireStoriesByKey(facetFilteredStories, sortKey);
    } catch {
      return facetFilteredStories;
    }
  }, [contentLoaderMod, facetFilteredStories, sortKey]);

  const pagedStories = React.useMemo(
    () => displayedStories.slice(0, Math.min(visibleCount, displayedStories.length)),
    [displayedStories, visibleCount],
  );

  const hasMoreStories = displayedStories.length > pagedStories.length;

  const hasActiveFilters = React.useMemo(() => {
    try {
      if (contentLoaderMod && typeof contentLoaderMod.inspireFacetSelectionHasActive === "function") {
        return contentLoaderMod.inspireFacetSelectionHasActive(facetSelection);
      }
      return Object.values(facetSelection).some((arr) => Array.isArray(arr) && arr.length > 0);
    } catch {
      return false;
    }
  }, [contentLoaderMod, facetSelection]);

  const toggleFacet = React.useCallback((dim, value) => {
    setFacetSelection((prev) => {
      const cur = [...(prev[dim] || [])];
      const i = cur.indexOf(value);
      if (i >= 0) cur.splice(i, 1);
      else cur.push(value);
      return { ...prev, [dim]: cur };
    });
  }, []);

  const clearFacetSelection = React.useCallback(() => {
    setFacetSelection(createEmptyFacetFromLib());
  }, []);

  return {
    contentStories,
    contentStoriesReady,
    contentLoaderMod,
    searchInput,
    setSearchInput,
    debouncedSearch,
    sortKey,
    setSortKey,
    facetSelection,
    setFacetSelection,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    desktopFiltersOpen,
    setDesktopFiltersOpen,
    visibleCount,
    setVisibleCount,
    visibleStories,
    facetOptions,
    facetFilteredStories,
    displayedStories,
    pagedStories,
    hasMoreStories,
    hasActiveFilters,
    toggleFacet,
    clearFacetSelection,
  };
}

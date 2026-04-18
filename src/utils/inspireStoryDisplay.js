/**
 * Normalized display helpers for Inspire story metadata and markdown.
 * Safe on missing or malformed input (never throws from public exports).
 */

/**
 * @param {unknown} metadata
 * @returns {Record<string, unknown>}
 */
function safeMetadata(metadata) {
  try {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
    return /** @type {Record<string, unknown>} */ (metadata);
  } catch {
    return {};
  }
}

/**
 * @param {Record<string, unknown>} obj
 * @param {string[]} keys
 */
function pickFirstString(obj, keys) {
  try {
    if (!obj || typeof obj !== "object") return "";
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function formatInspireDurationDays(value) {
  try {
    if (value === null || value === undefined || value === "") return "";
    const n =
      typeof value === "number" && Number.isFinite(value)
        ? Math.max(0, Math.floor(value))
        : parseInt(String(value).trim(), 10);
    if (!Number.isFinite(n) || n < 1) return "";
    if (n % 7 === 0) {
      const w = n / 7;
      return w === 1 ? "1 week" : `${w} weeks`;
    }
    return n === 1 ? "1 day" : `${n} days`;
  } catch {
    return "";
  }
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function formatInspireDifficultyLabel(raw) {
  try {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "object") return "";
    const s = typeof raw === "number" && Number.isFinite(raw) ? String(raw) : String(raw);
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > 200 ? t.slice(0, 200) : t;
  } catch {
    return "";
  }
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function formatInspireJourneyCategoryLabel(raw) {
  try {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "object") return "";
    const s = typeof raw === "number" && Number.isFinite(raw) ? String(raw) : String(raw);
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > 200 ? t.slice(0, 200) : t;
  } catch {
    return "";
  }
}

/**
 * Safe country / continent strings for filters and display.
 * @param {unknown} metadata
 * @returns {{ country: string, continent: string }}
 */
export function getInspireStoryGeoFields(metadata) {
  const m = safeMetadata(metadata);
  const country = formatInspireJourneyCategoryLabel(
    pickFirstString(m, ["country", "location_country", "country_name"]),
  );
  const continent = formatInspireJourneyCategoryLabel(pickFirstString(m, ["continent", "region_continent"]));
  return { country, continent };
}

/**
 * Single geography line for cards (country · continent, else legacy region fields).
 * @param {unknown} metadata
 */
export function getInspireStoryGeoLabel(metadata) {
  try {
    const m = safeMetadata(metadata);
    const { country, continent } = getInspireStoryGeoFields(m);
    const parts = [country, continent].filter(Boolean);
    if (parts.length) return parts.join(" · ");
    return pickFirstString(m, ["region", "geography", "location_label"]);
  } catch {
    return "";
  }
}

/**
 * @param {Record<string, unknown>} m
 */
function durationDisplayFromMetadata(m) {
  const daysRaw = m.duration_days ?? m.trip_duration_days ?? m.journey_duration_days;
  const fromDays = formatInspireDurationDays(daysRaw);
  if (fromDays) return fromDays;
  return pickFirstString(m, ["duration", "journey_duration", "trip_duration"]);
}

/**
 * Category · duration for cards.
 * @param {unknown} metadata
 */
export function getInspireStoryCategoryDurationLine(metadata) {
  try {
    const m = safeMetadata(metadata);
    const catRaw = pickFirstString(m, ["journey_category", "category", "trip_type"]);
    const cat = formatInspireJourneyCategoryLabel(catRaw);
    const dur = durationDisplayFromMetadata(m);
    if (cat && dur) return `${cat} · ${dur}`;
    return cat || dur;
  } catch {
    return "";
  }
}

/**
 * @param {unknown} metadata
 */
export function getInspireStoryDifficulty(metadata) {
  try {
    const m = safeMetadata(metadata);
    const raw = pickFirstString(m, ["difficulty", "effort", "difficulty_level"]);
    return formatInspireDifficultyLabel(raw);
  } catch {
    return "";
  }
}

/**
 * @param {unknown} metadata
 */
export function getInspireStoryGuideUrl(metadata) {
  try {
    const m = safeMetadata(metadata);
    const g = m.guide;
    if (g && typeof g === "object" && !Array.isArray(g)) {
      const u = /** @type {{ guide_url?: unknown }} */ (g).guide_url;
      if (typeof u === "string" && u.trim()) return u.trim();
    }
    const flat = m.guide_url;
    if (typeof flat === "string" && flat.trim()) return flat.trim();
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * @param {unknown} metadata
 */
export function inspireStoryHasGuide(metadata) {
  try {
    const m = safeMetadata(metadata);
    if (m.has_guide === true || m.has_guide === "true" || m.has_guide === 1 || m.has_guide === "1") {
      return true;
    }
    return Boolean(getInspireStoryGuideUrl(m));
  } catch {
    return false;
  }
}

/**
 * @param {unknown} story
 */
export function getInspireStoryHeroAlt(story) {
  try {
    const s = story && typeof story === "object" ? /** @type {{ metadata?: unknown, title?: unknown }} */ (story) : {};
    const m = safeMetadata(s.metadata);
    const v = pickFirstString(m, ["hero_alt", "image_alt", "cover_alt"]);
    if (v) return v.length > 500 ? v.slice(0, 500) : v;
    if (typeof s.title === "string" && s.title.trim()) return s.title.trim().slice(0, 500);
  } catch {
    /* ignore */
  }
  return "Story image";
}

/**
 * Plain-text preview from markdown (for search / future UI).
 * @param {unknown} storyOrMarkdown
 * @param {{ maxLength?: number }} [options]
 */
export function getInspireStoryMarkdownExcerpt(storyOrMarkdown, options = {}) {
  let raw = "";
  try {
    const max = Math.min(Math.max(Number(options.maxLength) || 160, 20), 200000);
    if (typeof storyOrMarkdown === "string") {
      raw = storyOrMarkdown;
    } else if (storyOrMarkdown && typeof storyOrMarkdown === "object") {
      const sc = /** @type {{ storyContent?: unknown }} */ (storyOrMarkdown).storyContent;
      raw = typeof sc === "string" ? sc : "";
    }
    if (!raw) return "";
    let s = raw.replace(/\r\n/g, "\n");
    s = s.replace(/```[\s\S]*?```/g, " ");
    s = s.replace(/^#{1,6}\s+/gm, "");
    s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
    s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    s = s.replace(/<[^>]+>/g, " ");
    s = s.replace(/\*\*|__|~~|`/g, "");
    s = s.replace(/^\s*[-*+]\s+/gm, "");
    s = s.replace(/\n+/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    if (s.length <= max) return s;
    return `${s.slice(0, max - 1).trimEnd()}…`;
  } catch {
    return "";
  }
}

/**
 * All card-facing strings in one place (filters / search can reuse the same helpers).
 * @param {unknown} story
 */
export function getInspireFeaturedCardDisplay(story) {
  const fallback = {
    geoLabel: "",
    categoryDurationLine: "",
    difficultyLabel: "",
    hasGuide: false,
    guideUrl: "",
    heroAlt: "Story image",
    excerpt: "",
  };
  try {
    if (!story || typeof story !== "object") return fallback;
    const st = /** @type {{ metadata?: unknown, title?: unknown, storyContent?: unknown }} */ (story);
    const m = safeMetadata(st.metadata);
    return {
      geoLabel: getInspireStoryGeoLabel(m),
      categoryDurationLine: getInspireStoryCategoryDurationLine(m),
      difficultyLabel: getInspireStoryDifficulty(m),
      hasGuide: inspireStoryHasGuide(m),
      guideUrl: getInspireStoryGuideUrl(m),
      heroAlt: getInspireStoryHeroAlt(st),
      excerpt: getInspireStoryMarkdownExcerpt(st, { maxLength: 160 }),
    };
  } catch {
    return fallback;
  }
}

/**
 * @param {unknown} query
 */
export function normalizeInspireSearchQuery(query) {
  try {
    return String(query ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  } catch {
    return "";
  }
}

/**
 * @param {Record<string, unknown>} m
 */
function inspireMetadataActivityTagsText(m) {
  try {
    const parts = [];
    const keys = ["activity_tags", "tags", "activities", "tag_list", "keywords"];
    for (const k of keys) {
      const v = m[k];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === "string" && item.trim()) parts.push(item.trim());
          else if (item && typeof item === "object" && typeof item.name === "string" && item.name.trim()) {
            parts.push(item.name.trim());
          }
        }
      } else if (typeof v === "string" && v.trim()) {
        parts.push(v.trim());
      }
    }
    return parts.join(" ");
  } catch {
    return "";
  }
}

/**
 * Lowercased plain-text blob for client-side search (title, geo, tags, category, city, markdown).
 * @param {unknown} story
 */
export function getInspireStorySearchHaystack(story) {
  try {
    if (!story || typeof story !== "object") return "";
    const st = /** @type {{ metadata?: unknown, title?: unknown, storyContent?: unknown }} */ (story);
    const m = safeMetadata(st.metadata);
    const title = typeof st.title === "string" ? st.title.trim() : "";
    const { country, continent } = getInspireStoryGeoFields(m);
    const category = pickFirstString(m, ["journey_category", "category", "trip_type"]);
    const city = pickFirstString(m, [
      "nearest_major_city",
      "nearest_city",
      "major_city",
      "city",
      "hub_city",
    ]);
    const tags = inspireMetadataActivityTagsText(m);
    const md = getInspireStoryMarkdownExcerpt(st, { maxLength: 180000 });
    const chunks = [title, country, continent, category, city, tags, md];
    return chunks
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

/**
 * Client-side match: every whitespace-separated token must appear in the haystack (substring).
 * Empty or whitespace-only query matches all stories.
 * @param {unknown} story
 * @param {unknown} query
 */
export function matchesInspireStorySearch(story, query) {
  try {
    const norm = normalizeInspireSearchQuery(query);
    if (!norm) return true;
    const hay = getInspireStorySearchHaystack(story);
    if (!hay) return false;
    const tokens = norm.split(" ").filter(Boolean);
    if (!tokens.length) return true;
    return tokens.every((tok) => hay.includes(tok));
  } catch {
    return false;
  }
}

/**
 * @param {unknown} story
 * @returns {string}
 */
function inspireStoryTitleForSort(story) {
  try {
    if (story && typeof story === "object" && typeof /** @type {{ title?: unknown }} */ (story).title === "string") {
      return /** @type {{ title: string }} */ (story).title.trim();
    }
  } catch {
    /* ignore */
  }
  return "";
}

/**
 * ISO date millis for sorting, or `null` if missing / invalid (sorts last).
 * Uses top-level `story.date` from the loader, then metadata fallbacks.
 * @param {unknown} story
 * @returns {number | null}
 */
export function getInspireStorySortDateMillis(story) {
  try {
    if (!story || typeof story !== "object") return null;
    const s = /** @type {{ date?: unknown, metadata?: unknown }} */ (story);
    const m = safeMetadata(s.metadata);
    const fromStory = typeof s.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(s.date) ? s.date.slice(0, 10) : "";
    const fromMeta = pickFirstString(m, ["date", "published_date", "trip_date"]);
    const iso = /^\d{4}-\d{2}-\d{2}/.test(fromMeta) ? fromMeta.slice(0, 10) : "";
    const candidate = fromStory || iso;
    if (!candidate) return null;
    const t = Date.parse(`${candidate}T12:00:00Z`);
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

/**
 * Lower rank = easier; missing / empty difficulty sorts last (`100`).
 * Unrecognized text uses `50` so it sits between known tiers and missing.
 * @param {unknown} story
 * @returns {number}
 */
export function getInspireStoryDifficultySortRank(story) {
  try {
    const m = safeMetadata(story?.metadata);
    const raw = pickFirstString(m, ["difficulty", "effort", "difficulty_level"]).toLowerCase();
    if (!raw) return 100;
    if (/(^|\s)(extreme|expert)\b|very\s*hard/.test(raw)) return 3;
    if (/\b(hard|difficult|challenging|advanced|strenuous|severe)\b/.test(raw)) return 2;
    if (/\b(moderate|medium|intermediate|normal)\b/.test(raw)) return 1;
    if (/\b(easy|beginner|light|low|gentle|mild)\b/.test(raw)) return 0;
    return 50;
  } catch {
    return 100;
  }
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
function cmpTitleLocale(a, b) {
  return inspireStoryTitleForSort(a).localeCompare(inspireStoryTitleForSort(b), undefined, { sensitivity: "base" });
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
function cmpDateRecent(a, b) {
  const ma = getInspireStorySortDateMillis(a);
  const mb = getInspireStorySortDateMillis(b);
  if (ma === null && mb === null) return cmpTitleLocale(a, b);
  if (ma === null) return 1;
  if (mb === null) return -1;
  if (mb !== ma) return mb - ma;
  return cmpTitleLocale(a, b);
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
function cmpDateOldest(a, b) {
  const ma = getInspireStorySortDateMillis(a);
  const mb = getInspireStorySortDateMillis(b);
  if (ma === null && mb === null) return cmpTitleLocale(a, b);
  if (ma === null) return 1;
  if (mb === null) return -1;
  if (ma !== mb) return ma - mb;
  return cmpTitleLocale(a, b);
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
function cmpDifficulty(a, b) {
  const ra = getInspireStoryDifficultySortRank(a);
  const rb = getInspireStoryDifficultySortRank(b);
  if (ra !== rb) return ra - rb;
  const ma = safeMetadata(a?.metadata);
  const mb = safeMetadata(b?.metadata);
  const la = getInspireStoryDifficulty(ma);
  const lb = getInspireStoryDifficulty(mb);
  return la.localeCompare(lb, undefined, { sensitivity: "base" }) || cmpTitleLocale(a, b);
}

/**
 * Stable sort of loaded stories for Inspire list UI.
 * @param {unknown[]} stories
 * @param {unknown} sortKey — `recent` | `oldest` | `alpha` | `difficulty`
 * @returns {unknown[]}
 */
export function sortInspireStoriesByKey(stories, sortKey) {
  try {
    if (!Array.isArray(stories)) return [];
    const arr = [...stories];
    const key = typeof sortKey === "string" ? sortKey.trim() : "";
    switch (key) {
      case "oldest":
        arr.sort(cmpDateOldest);
        break;
      case "alpha":
        arr.sort(cmpTitleLocale);
        break;
      case "difficulty":
        arr.sort(cmpDifficulty);
        break;
      case "recent":
      default:
        arr.sort(cmpDateRecent);
        break;
    }
    return arr;
  } catch {
    return Array.isArray(stories) ? [...stories] : [];
  }
}

/**
 * When true and a guide URL exists, Inspire list cards link straight to the guide.
 * @param {unknown} metadata
 */
export function inspireListPrimaryDestinationIsGuide(metadata) {
  try {
    const m = safeMetadata(metadata);
    if (m.inspire_primary_destination === "guide" || m.inspire_primary_destination === "Guide") return true;
    const g = m.guide;
    if (g && typeof g === "object" && !Array.isArray(g)) {
      const o = /** @type {{ is_primary?: unknown, primary?: unknown }} */ (g);
      if (o.is_primary === true || o.primary === true) return true;
      if (o.is_primary === "true" || o.primary === "true") return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * @param {unknown} story
 * @returns {string} href or empty when the card should not navigate
 */
export function getInspireStoryListCardHref(story) {
  try {
    if (!story || typeof story !== "object") return "";
    const m = safeMetadata(/** @type {{ metadata?: unknown }} */ (story).metadata);
    const guideUrl = getInspireStoryGuideUrl(m);
    const slug =
      typeof /** @type {{ slug?: unknown }} */ (story).slug === "string" && /** @type {{ slug: string }} */ (story).slug.trim()
        ? /** @type {{ slug: string }} */ (story).slug.trim()
        : "";
    if (guideUrl && inspireListPrimaryDestinationIsGuide(m)) return guideUrl;
    if (slug) return `inspire-story.html?slug=${encodeURIComponent(slug)}`;
    if (guideUrl) return guideUrl;
    return "";
  } catch {
    return "";
  }
}

export const INSPIRE_FACET_UNSPECIFIED = "(unspecified)";

function normFacetCompare(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

function uniqueSortedFacetValues(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (typeof x !== "string" || !x.trim()) continue;
    const t = x.trim();
    const k = t === INSPIRE_FACET_UNSPECIFIED ? t : normFacetCompare(t);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

/**
 * @param {Record<string, unknown>} m
 */
function flattenMetaMulti(m, keys) {
  const parts = [];
  try {
    for (const k of keys) {
      const v = m[k];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === "string" && item.trim()) {
            item.split(/[,;]/).forEach((piece) => {
              const t = piece.trim();
              if (t) parts.push(t);
            });
          } else if (item && typeof item === "object" && typeof item.name === "string" && item.name.trim()) {
            parts.push(item.name.trim());
          }
        }
      } else if (typeof v === "string" && v.trim()) {
        v.split(/[,;]/).forEach((piece) => {
          const t = piece.trim();
          if (t) parts.push(t);
        });
      }
    }
  } catch {
    /* ignore */
  }
  return uniqueSortedFacetValues(parts);
}

/**
 * @param {Record<string, unknown>} m
 */
function inspireStoryActivityTagsArray(m) {
  const parts = [];
  try {
    const keys = ["activity_tags", "tags", "activities", "tag_list", "keywords"];
    for (const k of keys) {
      const v = m[k];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === "string" && item.trim()) {
            item.split(/[,;]/).forEach((piece) => {
              const t = piece.trim();
              if (t) parts.push(t);
            });
          } else if (item && typeof item === "object" && typeof item.name === "string" && item.name.trim()) {
            parts.push(item.name.trim());
          }
        }
      } else if (typeof v === "string" && v.trim()) {
        v.split(/[,;]/).forEach((piece) => {
          const t = piece.trim();
          if (t) parts.push(t);
        });
      }
    }
  } catch {
    /* ignore */
  }
  return uniqueSortedFacetValues(parts);
}

/**
 * Values per facet dimension for one story (OR semantics within a dimension).
 * @param {unknown} story
 */
export function projectInspireStoryFacetValues(story) {
  const U = INSPIRE_FACET_UNSPECIFIED;
  try {
    if (!story || typeof story !== "object") {
      return {
        continent: [U],
        country: [U],
        duration: [U],
        activity: [U],
        difficulty: [U],
        suitableFor: [U],
        season: [U],
        budget: [U],
        guide: ["No"],
      };
    }
    const m = safeMetadata(/** @type {{ metadata?: unknown }} */ (story).metadata);
    const geo = getInspireStoryGeoFields(m);
    const continent = geo.continent ? [geo.continent] : [U];
    const country = geo.country ? [geo.country] : [U];
    const dur = durationDisplayFromMetadata(m);
    const duration = dur ? [dur] : [U];
    const act = inspireStoryActivityTagsArray(m);
    const activity = act.length ? act : [U];
    const diffRaw = getInspireStoryDifficulty(m);
    const difficulty = diffRaw ? [diffRaw] : [U];
    const suitableFor = flattenMetaMulti(m, [
      "suitable_for",
      "suitable_for_tags",
      "audience",
      "travelers",
      "group_type",
    ]);
    const suitableForOut = suitableFor.length ? suitableFor : [U];
    const seasonVals = flattenMetaMulti(m, ["season", "travel_season", "best_season", "months", "ideal_months"]);
    const season = seasonVals.length ? seasonVals : [U];
    const budgetVals = flattenMetaMulti(m, ["budget", "budget_level", "cost_level", "trip_budget"]);
    const budget = budgetVals.length ? budgetVals : [U];
    const guide = inspireStoryHasGuide(m) ? ["Yes"] : ["No"];
    return {
      continent,
      country,
      duration,
      activity,
      difficulty,
      suitableFor: suitableForOut,
      season,
      budget,
      guide,
    };
  } catch {
    return {
      continent: [U],
      country: [U],
      duration: [U],
      activity: [U],
      difficulty: [U],
      suitableFor: [U],
      season: [U],
      budget: [U],
      guide: ["No"],
    };
  }
}

/**
 * @param {unknown[]} stories
 */
export function buildInspireFacetOptions(stories) {
  const dims = ["continent", "country", "duration", "activity", "difficulty", "suitableFor", "season", "budget", "guide"];
  const acc = {
    continent: new Set(),
    country: new Set(),
    duration: new Set(),
    activity: new Set(),
    difficulty: new Set(),
    suitableFor: new Set(),
    season: new Set(),
    budget: new Set(),
    guide: new Set(),
  };
  if (!Array.isArray(stories)) {
    return Object.fromEntries(dims.map((d) => [d, []]));
  }
  for (const st of stories) {
    const v = projectInspireStoryFacetValues(st);
    dims.forEach((d) => {
      v[d].forEach((x) => acc[d].add(x));
    });
  }
  const out = {};
  dims.forEach((d) => {
    out[d] = [...acc[d]].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  });
  return out;
}

export function createEmptyInspireFacetSelection() {
  return {
    continent: [],
    country: [],
    duration: [],
    activity: [],
    difficulty: [],
    suitableFor: [],
    season: [],
    budget: [],
    guide: [],
  };
}

/**
 * @param {unknown} selection
 */
export function inspireFacetSelectionHasActive(selection) {
  try {
    if (!selection || typeof selection !== "object") return false;
    return Object.values(selection).some((arr) => Array.isArray(arr) && arr.length > 0);
  } catch {
    return false;
  }
}

/**
 * @param {string[]} selected
 * @param {string[]} storyVals
 */
function facetGroupOrMatch(selected, storyVals) {
  if (!Array.isArray(selected) || selected.length === 0) return true;
  if (!Array.isArray(storyVals) || storyVals.length === 0) return false;
  const U = INSPIRE_FACET_UNSPECIFIED;
  const set = new Set();
  storyVals.forEach((x) => {
    if (x === U) set.add(U);
    else set.add(normFacetCompare(x));
  });
  return selected.some((sel) => {
    if (sel === U) return storyVals.includes(U);
    return set.has(normFacetCompare(sel));
  });
}

/**
 * OR within each facet group, AND across groups. Empty selection for a group = no constraint.
 * @param {unknown} story
 * @param {unknown} selection
 */
export function storyPassesInspireFacetSelection(story, selection) {
  try {
    const s = selection && typeof selection === "object" ? /** @type {Record<string, unknown>} */ (selection) : {};
    const v = projectInspireStoryFacetValues(story);
    const dims = ["continent", "country", "duration", "activity", "difficulty", "suitableFor", "season", "budget", "guide"];
    return dims.every((dim) => {
      const sel = s[dim];
      return facetGroupOrMatch(Array.isArray(sel) ? sel : [], v[dim]);
    });
  } catch {
    return true;
  }
}

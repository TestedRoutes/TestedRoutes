/**
 * Normalized display helpers for Inspire story metadata and markdown.
 * Safe on missing or malformed input – never throws from public exports.
 */

function safeMetadata(metadata) {
  try {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
    return metadata;
  } catch {
    return {};
  }
}

function pickFirstString(obj, keys) {
  try {
    if (!obj || typeof obj !== "object") return "";
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  } catch { /* ignore */ }
  return "";
}

function inspireGeographyObject(m) {
  try {
    const g = m.geography;
    if (g && typeof g === "object" && !Array.isArray(g)) return g;
  } catch { /* ignore */ }
  return {};
}

function inspireClassificationObject(m) {
  try {
    const c = m.classification;
    if (c && typeof c === "object" && !Array.isArray(c)) return c;
  } catch { /* ignore */ }
  return {};
}

function inspireDifficultyObject(m) {
  try {
    const d = m.difficulty;
    if (d && typeof d === "object" && !Array.isArray(d)) return d;
  } catch { /* ignore */ }
  return {};
}

function inspireTimingObject(m) {
  try {
    const t = m.timing;
    if (t && typeof t === "object" && !Array.isArray(t)) return t;
  } catch { /* ignore */ }
  return {};
}

function inspireBudgetObject(m) {
  try {
    const b = m.budget;
    if (b && typeof b === "object" && !Array.isArray(b)) return b;
  } catch { /* ignore */ }
  return {};
}

function inspireSuitabilityObject(m) {
  try {
    const s = m.suitability;
    if (s && typeof s === "object" && !Array.isArray(s)) return s;
  } catch { /* ignore */ }
  return {};
}

function humanizeGeoToken(s) {
  const t = String(s ?? "").trim();
  if (!t) return "";
  if (/[A-Z]/.test(t) && !/_/.test(t)) return t;
  return t
    .split(/_/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

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

export function formatInspireDifficultyLabel(raw) {
  try {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "object") return "";
    const s = String(raw);
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > 200 ? t.slice(0, 200) : t;
  } catch {
    return "";
  }
}

export function formatInspireJourneyCategoryLabel(raw) {
  try {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "object") return "";
    const s = String(raw);
    const t = s.replace(/\s+/g, " ").trim();
    return t.length > 200 ? t.slice(0, 200) : t;
  } catch {
    return "";
  }
}

export function getInspireStoryGeoFields(metadata) {
  const m = safeMetadata(metadata);
  const geo = inspireGeographyObject(m);
  const country = formatInspireJourneyCategoryLabel(
    pickFirstString(geo, ["country", "location_country", "country_name"]) ||
      pickFirstString(m, ["country", "location_country", "country_name"]),
  );
  const continentRaw =
    pickFirstString(geo, ["continent", "region_continent"]) || pickFirstString(m, ["continent", "region_continent"]);
  const continent = formatInspireJourneyCategoryLabel(humanizeGeoToken(continentRaw) || continentRaw);
  return { country, continent };
}

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

function durationDaysNumber(m) {
  try {
    const timing = inspireTimingObject(m);
    const raw =
      timing.duration_days ??
      m.duration_days ??
      m.trip_duration_days ??
      m.journey_duration_days ??
      timing.duration_nights;
    if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(0, Math.floor(raw));
    const n = parseInt(String(raw ?? "").trim(), 10);
    return Number.isFinite(n) ? Math.max(0, n) : null;
  } catch {
    return null;
  }
}

function durationBucketsFromDays(days) {
  if (days === null || days === undefined) return [];
  if (days < 1) return ["< 1 day"];
  if (days === 1) return ["1 day"];
  if (days <= 3) return ["1–3 days"];
  if (days <= 7) return ["4–7 days"];
  if (days <= 14) return ["1–2 weeks"];
  return ["2+ weeks"];
}

function durationDisplayFromMetadata(m) {
  const timing = inspireTimingObject(m);
  const daysNum = durationDaysNumber(m);
  if (daysNum !== null) {
    const fromDays = formatInspireDurationDays(daysNum);
    if (fromDays) return fromDays;
  }
  const fromDays = formatInspireDurationDays(
    m.duration_days ?? m.trip_duration_days ?? m.journey_duration_days ?? timing.duration_days,
  );
  if (fromDays) return fromDays;
  return pickFirstString(m, ["duration", "journey_duration", "trip_duration"]);
}

export function getInspireStoryCategoryDurationLine(metadata) {
  try {
    const m = safeMetadata(metadata);
    const cls = inspireClassificationObject(m);
    const catRaw =
      pickFirstString(cls, ["journey_category", "activity_category", "primary_collection"]) ||
      pickFirstString(m, ["journey_category", "category", "trip_type"]);
    const cat = formatInspireJourneyCategoryLabel(String(catRaw || "").replace(/_/g, " "));
    const dur = durationDisplayFromMetadata(m);
    if (cat && dur) return `${cat} · ${dur}`;
    return cat || dur;
  } catch {
    return "";
  }
}

export function getInspireStoryDifficulty(metadata) {
  try {
    const m = safeMetadata(metadata);
    const diff = inspireDifficultyObject(m);
    const raw =
      pickFirstString(diff, ["overall_level", "level", "rating"]) ||
      pickFirstString(m, ["difficulty", "effort", "difficulty_level"]);
    return formatInspireDifficultyLabel(String(raw || "").replace(/_/g, " "));
  } catch {
    return "";
  }
}

export function getInspireStoryGuideUrl(metadata) {
  try {
    const m = safeMetadata(metadata);
    const g = m.guide;
    if (g && typeof g === "object" && !Array.isArray(g)) {
      const u = g.guide_url;
      if (typeof u === "string" && u.trim()) return u.trim();
    }
    const flat = m.guide_url;
    if (typeof flat === "string" && flat.trim()) return flat.trim();
  } catch { /* ignore */ }
  return "";
}

export function inspireStoryHasGuide(metadata) {
  try {
    const m = safeMetadata(metadata);
    const g = m.guide && typeof m.guide === "object" && !Array.isArray(m.guide) ? m.guide : {};
    if (g.has_guide === true || g.has_guide === "true" || g.has_guide === 1 || g.has_guide === "1") return true;
    if (m.has_guide === true || m.has_guide === "true" || m.has_guide === 1 || m.has_guide === "1") return true;
    return Boolean(getInspireStoryGuideUrl(m));
  } catch {
    return false;
  }
}

export function getInspireStoryHeroAlt(story) {
  try {
    const s = story && typeof story === "object" ? story : {};
    const m = safeMetadata(s.metadata);
    const v = pickFirstString(m, ["hero_alt", "image_alt", "cover_alt"]);
    if (v) return v.length > 500 ? v.slice(0, 500) : v;
    if (typeof s.title === "string" && s.title.trim()) return s.title.trim().slice(0, 500);
  } catch { /* ignore */ }
  return "Story image";
}

export function getInspireStoryMarkdownExcerpt(storyOrMarkdown, options = {}) {
  let raw = "";
  try {
    const max = Math.min(Math.max(Number(options.maxLength) || 160, 20), 200000);
    if (typeof storyOrMarkdown === "string") {
      raw = storyOrMarkdown;
    } else if (storyOrMarkdown && typeof storyOrMarkdown === "object") {
      const sc = storyOrMarkdown.storyContent;
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

export function getInspireFeaturedCardDisplay(story) {
  const fallback = { geoLabel: "", categoryDurationLine: "", difficultyLabel: "", hasGuide: false, guideUrl: "", heroAlt: "Story image", excerpt: "" };
  try {
    if (!story || typeof story !== "object") return fallback;
    const m = safeMetadata(story.metadata);
    return {
      geoLabel: getInspireStoryGeoLabel(m),
      categoryDurationLine: getInspireStoryCategoryDurationLine(m),
      difficultyLabel: getInspireStoryDifficulty(m),
      hasGuide: inspireStoryHasGuide(m),
      guideUrl: getInspireStoryGuideUrl(m),
      heroAlt: getInspireStoryHeroAlt(story),
      excerpt: getInspireStoryMarkdownExcerpt(story, { maxLength: 160 }),
    };
  } catch {
    return fallback;
  }
}

export function normalizeInspireSearchQuery(query) {
  try {
    return String(query ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  } catch {
    return "";
  }
}

function inspireMetadataActivityTagsText(m) {
  try {
    const parts = [];
    const cls = inspireClassificationObject(m);
    const clsTags = cls.activity_tags ?? cls.tags;
    if (Array.isArray(clsTags)) {
      for (const item of clsTags) {
        if (typeof item === "string" && item.trim()) parts.push(item.trim());
      }
    }
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

export function getInspireStorySearchHaystack(story) {
  try {
    if (!story || typeof story !== "object") return "";
    const m = safeMetadata(story.metadata);
    const title = typeof story.title === "string" ? story.title.trim() : "";
    const { country, continent } = getInspireStoryGeoFields(m);
    const geo = inspireGeographyObject(m);
    const cls = inspireClassificationObject(m);
    const category =
      pickFirstString(cls, ["journey_category", "activity_category", "primary_collection"]) ||
      pickFirstString(m, ["journey_category", "category", "trip_type"]);
    const city =
      pickFirstString(geo, ["nearest_major_city", "nearest_city", "major_city", "city", "hub_city"]) ||
      pickFirstString(m, ["nearest_major_city", "nearest_city", "major_city", "city", "hub_city"]);
    const sid = pickFirstString(m, ["story_id", "slug"]);
    const tags = inspireMetadataActivityTagsText(m);
    const md = getInspireStoryMarkdownExcerpt(story, { maxLength: 180000 });
    return [title, country, continent, category, city, sid, tags, md]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

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

function inspireStoryTitleForSort(story) {
  try {
    if (story && typeof story === "object" && typeof story.title === "string") return story.title.trim();
  } catch { /* ignore */ }
  return "";
}

export function getInspireStorySortDateMillis(story) {
  try {
    if (!story || typeof story !== "object") return null;
    const m = safeMetadata(story.metadata);
    const fromStory = typeof story.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(story.date) ? story.date.slice(0, 10) : "";
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

function cmpTitleLocale(a, b) {
  return inspireStoryTitleForSort(a).localeCompare(inspireStoryTitleForSort(b), undefined, { sensitivity: "base" });
}

function cmpDateRecent(a, b) {
  const ma = getInspireStorySortDateMillis(a);
  const mb = getInspireStorySortDateMillis(b);
  if (ma === null && mb === null) return cmpTitleLocale(a, b);
  if (ma === null) return 1;
  if (mb === null) return -1;
  if (mb !== ma) return mb - ma;
  return cmpTitleLocale(a, b);
}

function cmpDateOldest(a, b) {
  const ma = getInspireStorySortDateMillis(a);
  const mb = getInspireStorySortDateMillis(b);
  if (ma === null && mb === null) return cmpTitleLocale(a, b);
  if (ma === null) return 1;
  if (mb === null) return -1;
  if (ma !== mb) return ma - mb;
  return cmpTitleLocale(a, b);
}

function cmpDifficulty(a, b) {
  const ra = getInspireStoryDifficultySortRank(a);
  const rb = getInspireStoryDifficultySortRank(b);
  if (ra !== rb) return ra - rb;
  const la = getInspireStoryDifficulty(safeMetadata(a?.metadata));
  const lb = getInspireStoryDifficulty(safeMetadata(b?.metadata));
  return la.localeCompare(lb, undefined, { sensitivity: "base" }) || cmpTitleLocale(a, b);
}

function contentRank(story) {
  const hasPhotos = Array.isArray(story?.photos) && story.photos.length > 0;
  const hasText = typeof story?.storyContent === "string" && story.storyContent.trim().length > 0;
  if (hasPhotos && hasText) return 0;
  if (hasPhotos) return 1;
  if (hasText) return 2;
  return 3;
}

function cmpContent(a, b) {
  const ra = contentRank(a);
  const rb = contentRank(b);
  if (ra !== rb) return ra - rb;
  return cmpDateRecent(a, b);
}

export function sortInspireStoriesByKey(stories, sortKey) {
  try {
    if (!Array.isArray(stories)) return [];
    const arr = [...stories];
    const key = typeof sortKey === "string" ? sortKey.trim() : "";
    switch (key) {
      case "oldest": arr.sort(cmpDateOldest); break;
      case "alpha": arr.sort(cmpTitleLocale); break;
      case "difficulty": arr.sort(cmpDifficulty); break;
      case "recent": arr.sort(cmpDateRecent); break;
      case "popular":
      case "content":
      default: arr.sort(cmpContent); break;
    }
    return arr;
  } catch {
    return Array.isArray(stories) ? [...stories] : [];
  }
}

export function inspireListPrimaryDestinationIsGuide(metadata) {
  try {
    const m = safeMetadata(metadata);
    if (m.inspire_primary_destination === "guide" || m.inspire_primary_destination === "Guide") return true;
    const g = m.guide;
    if (g && typeof g === "object" && !Array.isArray(g)) {
      if (g.is_primary === true || g.primary === true) return true;
      if (g.is_primary === "true" || g.primary === "true") return true;
    }
  } catch { /* ignore */ }
  return false;
}

export function getInspireStoryListCardHref(story) {
  try {
    if (!story || typeof story !== "object") return "";
    const m = safeMetadata(story.metadata);
    const guideUrl = getInspireStoryGuideUrl(m);
    const slug = typeof story.slug === "string" && story.slug.trim() ? story.slug.trim() : "";
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
  return String(s ?? "").trim().toLowerCase();
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

function flattenMetaMulti(m, keys) {
  const parts = [];
  try {
    for (const k of keys) {
      const v = m[k];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === "string" && item.trim()) {
            item.split(/[,;]/).forEach((piece) => { const t = piece.trim(); if (t) parts.push(t); });
          } else if (item && typeof item === "object" && typeof item.name === "string" && item.name.trim()) {
            parts.push(item.name.trim());
          }
        }
      } else if (typeof v === "string" && v.trim()) {
        v.split(/[,;]/).forEach((piece) => { const t = piece.trim(); if (t) parts.push(t); });
      }
    }
  } catch { /* ignore */ }
  return uniqueSortedFacetValues(parts);
}

function inspireStoryActivityTagsArray(m) {
  const parts = [];
  try {
    const cls = inspireClassificationObject(m);
    const jc = pickFirstString(cls, ["journey_category", "activity_category"]);
    if (jc) parts.push(jc.replace(/_/g, " "));
    const pc = pickFirstString(cls, ["primary_collection"]);
    if (pc) parts.push(pc);
    const clsTags = cls.activity_tags ?? cls.tags;
    if (Array.isArray(clsTags)) {
      for (const item of clsTags) {
        if (typeof item === "string" && item.trim()) parts.push(item.trim());
      }
    } else if (typeof clsTags === "string" && clsTags.trim()) {
      clsTags.split(/[,;]/).forEach((piece) => { const t = piece.trim(); if (t) parts.push(t); });
    }
    const allCol = cls.all_collections;
    if (Array.isArray(allCol)) {
      for (const item of allCol) {
        if (typeof item === "string" && item.trim()) parts.push(item.trim());
      }
    }
    const keys = ["activity_tags", "tags", "activities", "tag_list", "keywords"];
    for (const k of keys) {
      const v = m[k];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === "string" && item.trim()) {
            item.split(/[,;]/).forEach((piece) => { const t = piece.trim(); if (t) parts.push(t); });
          } else if (item && typeof item === "object" && typeof item.name === "string" && item.name.trim()) {
            parts.push(item.name.trim());
          }
        }
      } else if (typeof v === "string" && v.trim()) {
        v.split(/[,;]/).forEach((piece) => { const t = piece.trim(); if (t) parts.push(t); });
      }
    }
  } catch { /* ignore */ }
  return uniqueSortedFacetValues(parts);
}

function bucketActivityFromStory(story) {
  try {
    const m = safeMetadata(story.metadata);
    const cls = inspireClassificationObject(m);
    const rawCat = (
      pickFirstString(cls, ["journey_category", "activity_category"]) ||
      pickFirstString(m, ["journey_category", "category", "trip_type"]) || ""
    ).toLowerCase().replace(/_/g, " ");
    const allTags = [
      ...(Array.isArray(cls.activity_tags) ? cls.activity_tags : []),
      ...(Array.isArray(cls.tags) ? cls.tags : []),
      ...(Array.isArray(m.activity_tags) ? m.activity_tags : []),
      ...(Array.isArray(m.tags) ? m.tags : []),
    ].join(" ").toLowerCase();
    const titleText = ((story.title || "") + " " + (story.folderName || "")).toLowerCase();
    const text = `${rawCat} ${allTags} ${titleText}`;
    const buckets = new Set();
    if (/expedition/.test(rawCat)) buckets.add("Expedition");
    if (/summit|mountaineer|peak.bag|aconcagua|denali|kilimanjaro/.test(text)) buckets.add("Summit");
    if (/\bhike\b|hiking|\btrek\b|trekking|alpine day|day hike/.test(text)) buckets.add("Hike");
    if (/roadtrip|\broad[\s-]?trip\b|rally|transfagarasan|multi[\s-]?day[\s-]?trip|overland/.test(text)) buckets.add("Road Trip");
    if (/\bdiv(e|ing)\b|shark dive|scuba/.test(text)) buckets.add("Diving");
    if (/\bswim\w*|open[\s-]?water|lake[\s-]?cross/.test(text)) buckets.add("Swimming");
    if (/boarding|skydiv|paraglid|bungee|extreme[\s-]?sport/.test(text)) buckets.add("Extreme Sport");
    return [...buckets];
  } catch {
    return [];
  }
}

export function projectInspireStoryFacetValues(story) {
  const U = INSPIRE_FACET_UNSPECIFIED;
  try {
    if (!story || typeof story !== "object") {
      return { continent: [U], country: [U], duration: [U], activity: [U], difficulty: [U], suitableFor: [U], season: [U], budget: [U], guide: ["No"] };
    }
    const m = safeMetadata(story.metadata);
    const geo = getInspireStoryGeoFields(m);
    const continent = geo.continent ? [geo.continent] : [U];
    const country = geo.country ? [geo.country] : [U];
    const daysNum = durationDaysNumber(m);
    let duration = daysNum !== null && durationBucketsFromDays(daysNum).length ? durationBucketsFromDays(daysNum) : [];
    if (!duration.length) { const dur = durationDisplayFromMetadata(m); duration = dur ? [dur] : [U]; }
    const act = bucketActivityFromStory(story);
    const activity = act.length ? act : [U];
    const diffRaw = getInspireStoryDifficulty(m);
    const difficulty = diffRaw ? [diffRaw] : [U];
    const suit = inspireSuitabilityObject(m);
    const suitLabels = [];
    if (suit.family_friendly === true || suit.family_friendly === "true" || suit.family_friendly === 1) suitLabels.push("Families");
    if (suit.solo_friendly === true || suit.solo_friendly === "true" || suit.solo_friendly === 1) suitLabels.push("Solo");
    if (suit.beginner_friendly === true || suit.beginner_friendly === "true" || suit.beginner_friendly === 1) suitLabels.push("Beginners");
    const suitableFromFlat = flattenMetaMulti(m, ["suitable_for", "suitable_for_tags", "audience", "travelers", "group_type"]);
    const suitableFor = uniqueSortedFacetValues([...suitLabels, ...suitableFromFlat]);
    const suitableForOut = suitableFor.length ? suitableFor : [U];
    const timing = inspireTimingObject(m);
    const bestSeasons = timing.best_seasons ?? timing.seasons ?? m.best_seasons;
    const seasonFromTiming = Array.isArray(bestSeasons)
      ? bestSeasons.filter((x) => typeof x === "string" && x.trim()).map((x) => humanizeGeoToken(x))
      : [];
    const seasonVals = uniqueSortedFacetValues([
      ...seasonFromTiming,
      ...flattenMetaMulti(m, ["season", "travel_season", "best_season", "months", "ideal_months"]),
    ]);
    const season = seasonVals.length ? seasonVals : [U];
    const bud = inspireBudgetObject(m);
    const budgetStr = pickFirstString(bud, ["level", "tier", "category"]) || (typeof m.budget === "string" ? m.budget.trim() : "");
    const budgetVals = uniqueSortedFacetValues([
      ...(budgetStr ? [humanizeGeoToken(budgetStr.replace(/_/g, " ")) || budgetStr] : []),
      ...flattenMetaMulti(m, ["budget", "budget_level", "cost_level", "trip_budget"]),
    ]);
    const budget = budgetVals.length ? budgetVals : [U];
    const guide = inspireStoryHasGuide(m) ? ["Yes"] : ["No"];
    return { continent, country, duration, activity, difficulty, suitableFor: suitableForOut, season, budget, guide };
  } catch {
    return { continent: [U], country: [U], duration: [U], activity: [U], difficulty: [U], suitableFor: [U], season: [U], budget: [U], guide: ["No"] };
  }
}

export function buildInspireFacetOptions(stories) {
  const dims = ["continent", "country", "duration", "activity", "difficulty", "suitableFor", "season", "budget", "guide"];
  const acc = Object.fromEntries(dims.map((d) => [d, new Set()]));
  if (!Array.isArray(stories)) return Object.fromEntries(dims.map((d) => [d, []]));
  for (const st of stories) {
    const v = projectInspireStoryFacetValues(st);
    dims.forEach((d) => { v[d].forEach((x) => acc[d].add(x)); });
  }
  const out = {};
  dims.forEach((d) => { out[d] = [...acc[d]].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })); });
  return out;
}

export function createEmptyInspireFacetSelection() {
  return { continent: [], country: [], duration: [], activity: [], difficulty: [], suitableFor: [], season: [], budget: [], guide: [] };
}

export function inspireFacetSelectionHasActive(selection) {
  try {
    if (!selection || typeof selection !== "object") return false;
    return Object.values(selection).some((arr) => Array.isArray(arr) && arr.length > 0);
  } catch {
    return false;
  }
}

function facetGroupOrMatch(selected, storyVals) {
  if (!Array.isArray(selected) || selected.length === 0) return true;
  if (!Array.isArray(storyVals) || storyVals.length === 0) return false;
  const U = INSPIRE_FACET_UNSPECIFIED;
  const set = new Set();
  storyVals.forEach((x) => { if (x === U) set.add(U); else set.add(normFacetCompare(x)); });
  return selected.some((sel) => {
    if (sel === U) return storyVals.includes(U);
    return set.has(normFacetCompare(sel));
  });
}

export function storyPassesInspireFacetSelection(story, selection) {
  try {
    const s = selection && typeof selection === "object" ? selection : {};
    const v = projectInspireStoryFacetValues(story);
    const dims = ["continent", "country", "duration", "activity", "difficulty", "suitableFor", "season", "budget", "guide"];
    return dims.every((dim) => facetGroupOrMatch(Array.isArray(s[dim]) ? s[dim] : [], v[dim]));
  } catch {
    return true;
  }
}

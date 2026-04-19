/**
 * Loads Inspire stories from `assets/public/Content/Inspire/` (or a custom base path).
 *
 * Layout per story folder (name like `YYYYMMDD Name` or `YYYYMMDD-name-with-dashes`):
 * - Meta-*.txt — JSON metadata (parsed with JSON.parse)
 * - Story-*.md — markdown body (raw text)
 * - *.jpg / *.jpeg / *.png — photos (first sorted filename = hero unless metadata.photos orders them)
 *
 * ## Browser / static hosting (default)
 * Uses `fetch()` and a manifest file `stories-manifest.json` at the content root that lists
 * each story folder and the exact `metaFile` name (wildcards cannot be resolved over HTTP).
 *
 * ## Vite (optional)
 * Pass `{ useViteGlob: true }` to resolve files with `import.meta.glob` (no manifest required).
 * Paths are relative to this file: `../../assets/public/Content/Inspire/`.
 *
 * @typedef {Object} InspireStoryManifestEntry
 * @property {string} folder — Folder name under the content root (not URL-encoded in JSON).
 * @property {string} metaFile — Exact Meta-*.txt filename inside the folder.
 * @property {string} [storyFile] — Exact Story-*.md filename; if omitted, no markdown is loaded.
 * @property {string[]} [photos] — Optional explicit photo filenames; otherwise from metadata.photos or inferred from glob (Vite only).
 *
 * @typedef {Object} InspireStory
 * @property {string} id
 * @property {string} slug
 * @property {string} folderName
 * @property {string} title
 * @property {string|null} date — ISO date (YYYY-MM-DD) from metadata.date or folder prefix YYYYMMDD.
 * @property {Record<string, unknown>} metadata
 * @property {string} storyContent
 * @property {string[]} photos — Public URLs or resolved module URLs.
 * @property {string|null} heroPhoto
 */

const PHOTO_EXT = /\.(jpe?g|png)$/i;

const DEFAULT_BASE_PATH = "/assets/public/Content/Inspire/";

function normalizeBasePath(basePath) {
  const s = (basePath || DEFAULT_BASE_PATH).trim();
  if (!s) return DEFAULT_BASE_PATH;
  return s.endsWith("/") ? s : `${s}/`;
}

function encodePathSegment(segment) {
  return segment.split("/").map((p) => encodeURIComponent(p)).join("/");
}

function joinContentUrl(basePath, folderName, fileName) {
  const base = normalizeBasePath(basePath);
  return `${base}${encodePathSegment(folderName)}/${encodeURIComponent(fileName)}`;
}

function parseLeadingDateFromFolder(folderName) {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(folderName.trim());
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function slugifyFolderName(folderName) {
  const tail = folderName.replace(/^\d{8}[\s_-]*/, "").trim() || folderName.trim();
  return tail
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "story";
}

function sortPhotoFilenames(names) {
  return [...names].filter((n) => PHOTO_EXT.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * @param {Record<string, unknown>} metadata
 * @param {string[]} [extraPhotos]
 */
function collectPhotoFilenames(metadata, extraPhotos) {
  const fromMeta = metadata.photos;
  if (Array.isArray(fromMeta) && fromMeta.every((x) => typeof x === "string")) {
    return sortPhotoFilenames(fromMeta);
  }
  if (Array.isArray(extraPhotos) && extraPhotos.length) {
    return sortPhotoFilenames(extraPhotos);
  }
  return [];
}

/**
 * @param {unknown} data
 * @returns {data is { stories?: InspireStoryManifestEntry[] }}
 */
function extractManifestStories(data) {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data)) return data;
  const stories = /** @type {{ stories?: unknown }} */ (data).stories;
  return Array.isArray(stories) ? stories : [];
}

async function fetchText(url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

/**
 * Process a single manifest entry, fetching metadata and story content in parallel where possible.
 * @param {string} basePath
 * @param {unknown} entry
 * @returns {Promise<InspireStory | null>}
 */
async function processManifestEntry(basePath, entry) {
  if (!entry || typeof entry !== "object" || typeof entry.folder !== "string" || !entry.folder.trim()) {
    console.warn("[loadInspireStories] Skipping invalid manifest entry (missing folder).", entry);
    return null;
  }
  const folderName = /** @type {any} */ (entry).folder.trim();
  const metaFile = typeof /** @type {any} */ (entry).metaFile === "string" ? /** @type {any} */ (entry).metaFile.trim() : "";
  if (!metaFile || !/^Meta-.+\.txt$/i.test(metaFile)) {
    console.warn("[loadInspireStories] Skipping folder (metaFile must match Meta-*.txt pattern):", folderName);
    return null;
  }

  const metaUrl = joinContentUrl(basePath, folderName, metaFile);
  const knownStoryFile =
    typeof /** @type {any} */ (entry).storyFile === "string" && /** @type {any} */ (entry).storyFile.trim()
      ? /** @type {any} */ (entry).storyFile.trim()
      : null;

  let metadata = {};
  let storyContent = "";

  if (knownStoryFile && /^Story-/i.test(knownStoryFile) && /\.md$/i.test(knownStoryFile)) {
    const storyUrl = joinContentUrl(basePath, folderName, knownStoryFile);
    let metaRaw = "";
    [metaRaw, storyContent] = await Promise.all([
      fetchText(metaUrl),
      fetchText(storyUrl).catch((e) => {
        console.warn("[loadInspireStories] Story markdown missing or unreadable (using empty body):", folderName, e);
        return "";
      }),
    ]);
    try {
      metadata = JSON.parse(metaRaw);
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
        throw new Error("Metadata must be a JSON object");
      }
    } catch (e) {
      console.warn("[loadInspireStories] Skipping story (invalid or missing metadata JSON):", folderName, e);
      return null;
    }
  } else {
    try {
      const metaRaw = await fetchText(metaUrl);
      metadata = JSON.parse(metaRaw);
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
        throw new Error("Metadata must be a JSON object");
      }
    } catch (e) {
      console.warn("[loadInspireStories] Skipping story (invalid or missing metadata JSON):", folderName, e);
      return null;
    }
    const fallbackFile =
      typeof metadata.story_file === "string" && metadata.story_file.trim()
        ? /** @type {string} */ (metadata.story_file).trim()
        : "";
    if (fallbackFile && /^Story-/i.test(fallbackFile) && /\.md$/i.test(fallbackFile)) {
      try {
        storyContent = await fetchText(joinContentUrl(basePath, folderName, fallbackFile));
      } catch (e) {
        console.warn("[loadInspireStories] Story markdown missing or unreadable (using empty body):", folderName, e);
      }
    }
  }

  const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
  if (!title) {
    console.warn("[loadInspireStories] Skipping story (metadata.title required):", folderName);
    return null;
  }

  const manifestPhotos = Array.isArray(/** @type {any} */ (entry).photos)
    ? /** @type {any} */ (entry).photos.filter((p) => typeof p === "string")
    : [];
  const photoNames = collectPhotoFilenames(metadata, manifestPhotos);
  const photos = photoNames.map((name) => joinContentUrl(basePath, folderName, name));
  const heroPhoto = photos.length ? photos[0] : null;

  const slug =
    typeof metadata.story_id === "string" && metadata.story_id.trim()
      ? slugifyFolderName(metadata.story_id.trim())
      : slugifyFolderName(folderName);

  const id =
    typeof metadata.id === "string" && metadata.id.trim()
      ? metadata.id.trim()
      : typeof metadata.story_id === "string" && metadata.story_id.trim()
        ? metadata.story_id.trim()
        : slug;

  const date =
    typeof metadata.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(metadata.date)
      ? metadata.date.slice(0, 10)
      : parseLeadingDateFromFolder(folderName);

  return { id, slug, folderName, title, date, metadata, storyContent, photos, heroPhoto };
}

/**
 * Load stories using fetch + stories-manifest.json (browser-safe).
 * All entries are fetched in parallel; metadata and story content are also fetched
 * in parallel per entry when the storyFile is known from the manifest.
 * @param {{ basePath?: string, manifestUrl?: string | false, stories?: InspireStoryManifestEntry[] }} options
 */
async function loadInspireStoriesWithFetch(options) {
  const basePath = normalizeBasePath(options.basePath);
  let entries = options.stories;

  if (!entries || !entries.length) {
    const manifestUrl =
      options.manifestUrl === false
        ? null
        : typeof options.manifestUrl === "string"
          ? options.manifestUrl
          : `${basePath}stories-manifest.json`;

    if (manifestUrl) {
      try {
        const raw = await fetchText(manifestUrl);
        const data = JSON.parse(raw);
        entries = extractManifestStories(data);
      } catch (e) {
        console.warn("[loadInspireStories] Could not load manifest:", manifestUrl, e);
        entries = [];
      }
    } else {
      entries = [];
    }
  }

  const results = await Promise.all(entries.map((entry) => processManifestEntry(basePath, entry)));
  return /** @type {InspireStory[]} */ (results.filter(Boolean));
}

/**
 * Vite-only: discover Meta-*, Story-*, and images via import.meta.glob.
 * @param {{ basePath?: string }} options
 */
function loadInspireStoriesWithGlob(options) {
  const basePath = normalizeBasePath(options.basePath);

  const metaModules = import.meta.glob("../../assets/public/Content/Inspire/**/Meta-*.{txt,json}", {
    eager: true,
    as: "raw",
  });
  const storyModules = import.meta.glob("../../assets/public/Content/Inspire/**/Story-*.md", {
    eager: true,
    as: "raw",
  });
  const imageModules = import.meta.glob("../../assets/public/Content/Inspire/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
    eager: true,
    import: "default",
  });

  /** @type {Map<string, { folderPath: string, folderName: string, metaKey: string, metaRaw: string }>} */
  const byFolder = new Map();

  for (const [key, raw] of Object.entries(metaModules)) {
    const parts = key.replace(/\\/g, "/").split("/");
    const fileName = parts[parts.length - 1];
    const folderPath = parts.slice(0, -1).join("/");
    const folderName = parts[parts.length - 2] || "";
    if (!folderName || !/^Meta-/i.test(fileName)) continue;
    byFolder.set(folderPath, {
      folderPath,
      folderName,
      metaKey: key,
      metaRaw: typeof raw === "string" ? raw : "",
    });
  }

  const out = [];

  for (const rec of byFolder.values()) {
    const { folderName, metaKey, metaRaw } = rec;
    let metadata = {};
    try {
      metadata = JSON.parse(metaRaw);
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
        throw new Error("Metadata must be a JSON object");
      }
    } catch (e) {
      console.warn("[loadInspireStories] Skipping story (invalid metadata JSON):", folderName, e);
      continue;
    }

    const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
    if (!title) {
      console.warn("[loadInspireStories] Skipping story (metadata.title required):", folderName);
      continue;
    }

    const dirNorm = metaKey.replace(/\\/g, "/");
    const dirPath = dirNorm.slice(0, dirNorm.lastIndexOf("/"));

    let storyContent = "";
    const storyEntry = Object.entries(storyModules).find(([k]) => {
      const kn = k.replace(/\\/g, "/");
      const base = kn.slice(kn.lastIndexOf("/") + 1);
      return kn.startsWith(`${dirPath}/`) && /^Story-.+\.md$/i.test(base);
    });
    if (storyEntry) {
      const raw = storyEntry[1];
      storyContent = typeof raw === "string" ? raw : "";
    } else {
      console.warn("[loadInspireStories] No Story-*.md found for folder:", folderName);
    }

    const imagePaths = Object.entries(imageModules)
      .filter(([k]) => {
        const kn = k.replace(/\\/g, "/");
        if (!kn.startsWith(`${dirPath}/`)) return false;
        const fn = kn.slice(kn.lastIndexOf("/") + 1);
        return PHOTO_EXT.test(fn);
      })
      .map(([path, mod]) => {
        const url = typeof mod === "string" ? mod : "";
        const fileName = path.replace(/\\/g, "/").split("/").pop() || path;
        return { path, url, fileName };
      })
      .filter((x) => x.url && PHOTO_EXT.test(x.fileName));

    const fromMeta = collectPhotoFilenames(metadata, []);
    let ordered = imagePaths;
    if (fromMeta.length) {
      const byName = new Map(imagePaths.map((x) => [x.fileName, x.url]));
      ordered = fromMeta.map((name) => ({ fileName: name, url: byName.get(name) || "" })).filter((x) => x.url);
    } else {
      ordered = [...imagePaths].sort((a, b) =>
        a.fileName.localeCompare(b.fileName, undefined, { numeric: true }),
      );
    }

    const photos = ordered.map((x) => x.url).filter(Boolean);
    const heroPhoto = photos.length ? photos[0] : null;

    const slug =
      typeof metadata.story_id === "string" && metadata.story_id.trim()
        ? slugifyFolderName(metadata.story_id.trim())
        : slugifyFolderName(folderName);

    const id =
      typeof metadata.id === "string" && metadata.id.trim()
        ? metadata.id.trim()
        : typeof metadata.story_id === "string" && metadata.story_id.trim()
          ? metadata.story_id.trim()
          : slug;

    const date =
      typeof metadata.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(metadata.date)
        ? metadata.date.slice(0, 10)
        : parseLeadingDateFromFolder(folderName);

    out.push({
      id,
      slug,
      folderName,
      title,
      date,
      metadata,
      storyContent,
      photos,
      heroPhoto,
    });
  }

  return out;
}

export {
  formatInspireDurationDays,
  formatInspireDifficultyLabel,
  formatInspireJourneyCategoryLabel,
  getInspireStoryGeoFields,
  getInspireStoryMarkdownExcerpt,
  getInspireFeaturedCardDisplay,
  getInspireStoryGeoLabel,
  getInspireStoryCategoryDurationLine,
  getInspireStoryDifficulty,
  getInspireStoryGuideUrl,
  inspireStoryHasGuide,
  getInspireStoryHeroAlt,
  normalizeInspireSearchQuery,
  getInspireStorySearchHaystack,
  matchesInspireStorySearch,
  getInspireStorySortDateMillis,
  getInspireStoryDifficultySortRank,
  sortInspireStoriesByKey,
  inspireListPrimaryDestinationIsGuide,
  getInspireStoryListCardHref,
  INSPIRE_FACET_UNSPECIFIED,
  projectInspireStoryFacetValues,
  buildInspireFacetOptions,
  createEmptyInspireFacetSelection,
  inspireFacetSelectionHasActive,
  storyPassesInspireFacetSelection,
} from "./inspireStoryDisplay.js";

/**
 * Load Inspire story records from local content folders.
 *
 * @param {{
 *   basePath?: string,
 *   manifestUrl?: string | false,
 *   stories?: InspireStoryManifestEntry[],
 *   useViteGlob?: boolean
 * }} [options]
 * @returns {Promise<InspireStory[]>}
 */
export async function loadInspireStories(options = {}) {
  const useGlob =
    options.useViteGlob === true &&
    typeof import.meta !== "undefined" &&
    typeof import.meta.glob === "function";

  if (useGlob) {
    try {
      return loadInspireStoriesWithGlob(options);
    } catch (e) {
      console.warn("[loadInspireStories] import.meta.glob failed, falling back to fetch manifest:", e);
    }
  }

  return loadInspireStoriesWithFetch(options);
}

export default loadInspireStories;

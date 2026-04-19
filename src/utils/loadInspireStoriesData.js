/**
 * Inspire story data loader: manifest + per-folder files via fetch().
 * No framework dependencies — works in any ES module context.
 *
 * Default paths assume Vite publicDir = "assets/public", so
 * assets/public/Content/Inspire/ is served at /Content/Inspire/.
 */

const PHOTO_EXT = /\.(jpe?g|png)$/i;

const DEFAULT_CONTENT_BASE = "/Content/Stories/";

const DEFAULT_MANIFEST_URL = "/Content/Stories/stories-manifest.json";

function resolveFetchBasePath(options) {
  const raw = options.basePath;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return DEFAULT_CONTENT_BASE;
}

function resolveManifestUrlForFetch(options) {
  if (options.manifestUrl === false) return null;
  if (typeof options.manifestUrl === "string" && options.manifestUrl.trim()) {
    return options.manifestUrl.trim();
  }
  if (typeof options.basePath === "string" && options.basePath.trim()) {
    return `${normalizeBasePath(options.basePath)}stories-manifest.json`;
  }
  return DEFAULT_MANIFEST_URL;
}

function isLikelyMetaFilename(name) {
  return typeof name === "string" && /Meta-.+\.txt$/i.test(name.trim());
}

function isLikelyStoryFilename(name) {
  const n = typeof name === "string" ? name.trim() : "";
  if (!n) return false;
  return /^(\d{8}[\s-])?(\d{2}[\s-]\d{2}[\s-])?((Story|Inspire)[-._]).*\.(md|txt)$/i.test(n);
}

function normalizeBasePath(basePath) {
  const s = (basePath || DEFAULT_CONTENT_BASE).trim();
  if (!s) return DEFAULT_CONTENT_BASE;
  return s.endsWith("/") ? s : `${s}/`;
}

function folderHasDuplicatedNestedFragments(folderName) {
  const parts = folderName.split("/").map((p) => p.trim()).filter(Boolean);
  if (parts.some((p) => p === "..")) return true;
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === parts[i + 1]) return true;
  }
  return false;
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
  const valid = [...names].filter((n) => PHOTO_EXT.test(n));
  const heroes = valid.filter((n) => /^hero/i.test(n));
  const rest = valid.filter((n) => !/^hero/i.test(n)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return [...heroes, ...rest];
}

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

function extractManifestStories(manifest) {
  if (Array.isArray(manifest)) return manifest;
  if (manifest && typeof manifest === "object" && Array.isArray(manifest.stories)) {
    return manifest.stories;
  }
  return [];
}

async function fetchText(url) {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

async function loadInspireStoriesWithFetch(options) {
  const basePath = normalizeBasePath(resolveFetchBasePath(options));
  let entries = options.stories;

  if (!entries || !entries.length) {
    const manifestUrl = resolveManifestUrlForFetch(options);
    if (!manifestUrl) {
      entries = [];
    } else {
      try {
        const manifest = await fetch(manifestUrl, { credentials: "same-origin" }).then(async (r) => {
          if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
          return r.json();
        });
        entries = extractManifestStories(manifest);
        console.log("[loadInspireStories] manifest entries:", entries.length);
      } catch (e) {
        console.warn("[loadInspireStories] manifest load failed:", manifestUrl, e);
        entries = [];
      }
    }
  }

  const out = [];
  const skipped = [];

  for (const entry of entries) {
    try {
      if (!entry || typeof entry !== "object" || typeof entry.folder !== "string" || !entry.folder.trim()) {
        skipped.push({ folder: "(invalid entry)", reason: "missing or empty folder" });
        continue;
      }

      const folderName = entry.folder.trim();

      if (folderHasDuplicatedNestedFragments(folderName)) {
        skipped.push({ folder: folderName, reason: "unsafe folder path" });
        continue;
      }

      const metaFile = typeof entry.metaFile === "string" ? entry.metaFile.trim() : "";
      if (!metaFile || !isLikelyMetaFilename(metaFile)) {
        skipped.push({ folder: folderName, reason: `metaFile not Meta-*.txt (got: ${metaFile || "(empty)"})` });
        continue;
      }

      const metaUrl = joinContentUrl(basePath, folderName, metaFile);

      let metadata = {};
      try {
        const metaRaw = await fetchText(metaUrl);
        metadata = JSON.parse(metaRaw);
        if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
          throw new Error("Metadata must be a JSON object");
        }
      } catch (e) {
        skipped.push({ folder: folderName, reason: `metadata fetch/parse failed: ${e.message || e}` });
        continue;
      }

      const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
      if (!title) {
        skipped.push({ folder: folderName, reason: "metadata.title required" });
        continue;
      }

      let storyContent = "";
      let storyFile =
        typeof entry.storyFile === "string" && entry.storyFile.trim()
          ? entry.storyFile.trim()
          : typeof metadata.story_file === "string" && metadata.story_file.trim()
            ? metadata.story_file.trim()
            : "";

      if (storyFile && !isLikelyStoryFilename(storyFile)) {
        console.warn("[loadInspireStories] ignoring invalid story_file name:", folderName, storyFile);
        storyFile = "";
      }

      if (storyFile) {
        try {
          storyContent = await fetchText(joinContentUrl(basePath, folderName, storyFile));
        } catch (e) {
          console.warn("[loadInspireStories] story body failed (continuing):", folderName, e);
        }
      }

      const manifestPhotos = Array.isArray(entry.photos) ? entry.photos.filter((p) => typeof p === "string") : [];
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

      out.push({ id, slug, folderName, title, date, metadata, storyContent, photos, heroPhoto });
    } catch (e) {
      const label = entry && typeof entry.folder === "string" ? entry.folder.trim() : "(unknown)";
      skipped.push({ folder: label, reason: `unexpected error: ${e.message || e}` });
    }
  }

  console.log(`[loadInspireStories] loaded: ${out.length}, skipped: ${skipped.length}`);
  if (skipped.length) console.warn("[loadInspireStories] skipped:", skipped);
  return out;
}

export async function loadInspireStories(options = {}) {
  return loadInspireStoriesWithFetch(options);
}

export { loadInspireStories as loadStories };

export default loadInspireStories;

(function (global) {
  "use strict";

  var PHOTO_EXT = /\.(jpe?g|png)$/i;
  var DEFAULT_CONTENT_BASE = "/assets/public/Content/Inspire/";
  var DEFAULT_MANIFEST_URL = "/assets/public/Content/Inspire/stories-manifest.json";

  function resolveFetchBasePath(options) {
    var raw = options.basePath;
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return DEFAULT_CONTENT_BASE;
  }

  function resolveManifestUrl(options) {
    if (options.manifestUrl === false) return null;
    if (typeof options.manifestUrl === "string" && options.manifestUrl.trim()) return options.manifestUrl.trim();
    if (typeof options.basePath === "string" && options.basePath.trim()) {
      return normalizeBasePath(options.basePath) + "stories-manifest.json";
    }
    return DEFAULT_MANIFEST_URL;
  }

  function isLikelyMetaFilename(name) {
    return typeof name === "string" && /Meta-.+\.txt$/i.test(name.trim());
  }

  function isLikelyStoryFilename(name) {
    var n = typeof name === "string" ? name.trim() : "";
    if (!n) return false;
    return /^(Story|story)[-._].*\.(md|txt)$/i.test(n);
  }

  function normalizeBasePath(basePath) {
    var s = (basePath || DEFAULT_CONTENT_BASE).trim();
    if (!s) return DEFAULT_CONTENT_BASE;
    return s.endsWith("/") ? s : s + "/";
  }

  function folderHasDuplicatedNestedFragments(folderName) {
    var parts = folderName.split("/").map(function (p) { return p.trim(); }).filter(Boolean);
    if (parts.some(function (p) { return p === ".."; })) return true;
    for (var i = 0; i < parts.length - 1; i++) {
      if (parts[i] === parts[i + 1]) return true;
    }
    return false;
  }

  function encodePathSegment(segment) {
    return segment.split("/").map(encodeURIComponent).join("/");
  }

  function joinContentUrl(basePath, folderName, fileName) {
    var base = normalizeBasePath(basePath);
    return base + encodePathSegment(folderName) + "/" + encodeURIComponent(fileName);
  }

  function parseLeadingDateFromFolder(folderName) {
    var m = /^(\d{4})(\d{2})(\d{2})/.exec(folderName.trim());
    if (!m) return null;
    return m[1] + "-" + m[2] + "-" + m[3];
  }

  function slugifyFolderName(folderName) {
    var tail = folderName.replace(/^\d{8}[\s_-]*/, "").trim() || folderName.trim();
    return tail
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "story";
  }

  function sortPhotoFilenames(names) {
    return names.slice().filter(function (n) { return PHOTO_EXT.test(n); }).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
  }

  function collectPhotoFilenames(metadata, extraPhotos) {
    var fromMeta = metadata.photos;
    if (Array.isArray(fromMeta) && fromMeta.every(function (x) { return typeof x === "string"; })) {
      return sortPhotoFilenames(fromMeta);
    }
    if (Array.isArray(extraPhotos) && extraPhotos.length) {
      return sortPhotoFilenames(extraPhotos);
    }
    return [];
  }

  function extractManifestStories(manifest) {
    if (Array.isArray(manifest)) return manifest;
    if (manifest && typeof manifest === "object" && Array.isArray(manifest.stories)) return manifest.stories;
    return [];
  }

  function fetchText(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (res) {
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      return res.text();
    });
  }

  async function loadInspireStories(options) {
    options = options || {};
    var basePath = normalizeBasePath(resolveFetchBasePath(options));
    var entries = options.stories;

    if (!entries || !entries.length) {
      var manifestUrl = resolveManifestUrl(options);
      if (!manifestUrl) {
        entries = [];
      } else {
        try {
          var manifest = await fetch(manifestUrl, { credentials: "same-origin" }).then(function (r) {
            if (!r.ok) throw new Error(r.status + " " + r.statusText);
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

    var out = [];
    var skipped = [];

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      try {
        if (!entry || typeof entry !== "object" || typeof entry.folder !== "string" || !entry.folder.trim()) {
          skipped.push({ folder: "(invalid)", reason: "missing folder" });
          continue;
        }
        var folderName = entry.folder.trim();
        if (folderHasDuplicatedNestedFragments(folderName)) {
          skipped.push({ folder: folderName, reason: "unsafe folder path" });
          continue;
        }
        var metaFile = typeof entry.metaFile === "string" ? entry.metaFile.trim() : "";
        if (!metaFile || !isLikelyMetaFilename(metaFile)) {
          skipped.push({ folder: folderName, reason: "metaFile not Meta-*.txt (got: " + (metaFile || "(empty)") + ")" });
          continue;
        }
        var metaUrl = joinContentUrl(basePath, folderName, metaFile);
        var metadata = {};
        try {
          var metaRaw = await fetchText(metaUrl);
          metadata = JSON.parse(metaRaw);
          if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error("Metadata must be a JSON object");
        } catch (e) {
          skipped.push({ folder: folderName, reason: "metadata fetch/parse failed: " + (e.message || e) });
          continue;
        }
        var title = typeof metadata.title === "string" ? metadata.title.trim() : "";
        if (!title) {
          skipped.push({ folder: folderName, reason: "metadata.title required" });
          continue;
        }
        var storyContent = "";
        var storyFile =
          typeof entry.storyFile === "string" && entry.storyFile.trim() ? entry.storyFile.trim() :
          typeof metadata.story_file === "string" && metadata.story_file.trim() ? metadata.story_file.trim() : "";
        if (storyFile && !isLikelyStoryFilename(storyFile)) {
          console.warn("[loadInspireStories] ignoring invalid story_file:", folderName, storyFile);
          storyFile = "";
        }
        if (storyFile) {
          try {
            storyContent = await fetchText(joinContentUrl(basePath, folderName, storyFile));
          } catch (e) {
            console.warn("[loadInspireStories] story body failed (continuing):", folderName, e);
          }
        }
        var manifestPhotos = Array.isArray(entry.photos) ? entry.photos.filter(function (p) { return typeof p === "string"; }) : [];
        var photoNames = collectPhotoFilenames(metadata, manifestPhotos);
        var photos = photoNames.map(function (name) { return joinContentUrl(basePath, folderName, name); });
        var heroPhoto = photos.length ? photos[0] : null;
        var slug =
          typeof metadata.story_id === "string" && metadata.story_id.trim() ? slugifyFolderName(metadata.story_id.trim()) :
          slugifyFolderName(folderName);
        var id =
          typeof metadata.id === "string" && metadata.id.trim() ? metadata.id.trim() :
          typeof metadata.story_id === "string" && metadata.story_id.trim() ? metadata.story_id.trim() :
          slug;
        var date =
          typeof metadata.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(metadata.date) ? metadata.date.slice(0, 10) :
          parseLeadingDateFromFolder(folderName);
        out.push({ id, slug, folderName, title, date, metadata, storyContent, photos, heroPhoto });
      } catch (e) {
        var label = entry && typeof entry.folder === "string" ? entry.folder.trim() : "(unknown)";
        skipped.push({ folder: label, reason: "unexpected error: " + (e.message || e) });
      }
    }

    console.log("[loadInspireStories] loaded:", out.length, "skipped:", skipped.length);
    if (skipped.length) console.warn("[loadInspireStories] skipped:", skipped);
    return out;
  }

  global.loadInspireStories = loadInspireStories;
})(typeof window !== "undefined" ? window : globalThis);

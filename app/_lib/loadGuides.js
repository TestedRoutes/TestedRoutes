import { promises as fs } from "node:fs";
import path from "node:path";

const STORIES_ROOT = path.join(process.cwd(), "public", "Content", "Stories");
const MANIFEST_PATH = path.join(STORIES_ROOT, "stories-manifest.json");
const STORIES_URL_BASE = "/Content/Stories/";

const PHOTO_EXT = /\.(jpe?g|png)$/i;

function encodeFolder(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

function pickHero(photoNames) {
  if (!Array.isArray(photoNames)) return null;
  const hero = photoNames.find((n) => PHOTO_EXT.test(n) && /^hero/i.test(n));
  if (hero) return hero;
  const anyPhoto = photoNames.find((n) => PHOTO_EXT.test(n));
  return anyPhoto || null;
}

function slugifyFolder(folderName) {
  const tail = folderName.replace(/^\d{8}[\s_-]*/, "").trim() || folderName.trim();
  return (
    tail
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "story"
  );
}

async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.stories)) return json.stories;
    return [];
  } catch {
    return [];
  }
}

async function readMetadata(folder, metaFile) {
  try {
    const raw = await fs.readFile(path.join(STORIES_ROOT, folder, metaFile), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function loadGuides() {
  const entries = await readManifest();
  const results = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const folder = typeof entry.folder === "string" ? entry.folder.trim() : "";
    const metaFile = typeof entry.metaFile === "string" ? entry.metaFile.trim() : "";
    if (!folder || !metaFile) continue;

    const metadata = await readMetadata(folder, metaFile);
    if (!metadata) continue;

    const guide = metadata.guide;
    if (!guide || !(guide.has_guide === true || guide.has_guide === "true")) continue;

    const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
    if (!title) continue;

    const slug =
      typeof metadata.slug === "string" && metadata.slug.trim()
        ? metadata.slug.trim()
        : slugifyFolder(folder);

    const folderUrl = `${STORIES_URL_BASE}${encodeFolder(folder)}/`;
    const heroName = pickHero(entry.photos);
    const heroUrl = heroName ? `${folderUrl}${encodeURIComponent(heroName)}` : null;

    const timing = metadata.timing || {};
    const category = metadata?.classification?.journey_category?.replace(/_/g, " ") || "Guide";
    const durationDisplay =
      timing.duration_display ||
      (timing.duration_days
        ? `${timing.duration_days} day${timing.duration_days !== 1 ? "s" : ""}`
        : "");

    const price = guide.guide_price ? `€${guide.guide_price}` : "";

    // Derive canonical URL slug. Prefer the explicit guide_page path
    // (e.g. "guides/trift-bridge-from-zurich.html") because metadata.slug
    // may differ from it in spelling (German vs. English).
    let pageSlug = slug;
    if (typeof guide.guide_page === "string" && guide.guide_page.trim()) {
      const m = guide.guide_page.trim().match(/guides\/([^/]+?)(?:\.html)?$/i);
      if (m) pageSlug = m[1];
    }

    let href = null;
    if (guide.guide_page) {
      href = `/guides/${pageSlug}`;
    } else if (guide.guide_pdf) {
      href = `${folderUrl}${encodeURIComponent(guide.guide_pdf)}`;
    }

    results.push({
      slug: pageSlug,
      folder,
      metadataSlug: slug,
      title,
      category,
      duration: durationDisplay,
      price,
      image: heroUrl,
      href: href || `/guides/${pageSlug}`,
      purchases: guide.purchases || null,
      // Pass the raw metadata and photos through for detail-page rendering.
      metadata,
      photos: Array.isArray(entry.photos) ? entry.photos : [],
      folderUrl,
      heroName: heroName || null,
    });
  }

  return results;
}

export async function loadGuideBySlug(slug) {
  const all = await loadGuides();
  return all.find((g) => g.slug === slug) || null;
}

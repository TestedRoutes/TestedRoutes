import { promises as fs } from "node:fs";
import path from "node:path";

const STORIES_ROOT = path.join(process.cwd(), "public", "Content", "Stories");
const MANIFEST_PATH = path.join(STORIES_ROOT, "stories-manifest.json");
const STORIES_URL_BASE = "/Content/Stories/";

const PHOTO_EXT = /\.(jpe?g|png)$/i;

function encodeFolder(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

function sortPhotoFilenames(names) {
  const valid = names.filter((n) => PHOTO_EXT.test(n));
  const heroes = valid.filter((n) => /^hero/i.test(n));
  const rest = valid
    .filter((n) => !/^hero/i.test(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return [...heroes, ...rest];
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

function parseLeadingDateFromFolder(folderName) {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(folderName.trim());
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function readManifest() {
  const data = await readJson(MANIFEST_PATH);
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.stories)) return data.stories;
  return [];
}

export async function loadInspireStories() {
  const entries = await readManifest();
  const out = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const folder = typeof entry.folder === "string" ? entry.folder.trim() : "";
    const metaFile = typeof entry.metaFile === "string" ? entry.metaFile.trim() : "";
    if (!folder || !metaFile) continue;

    const metadata = await readJson(path.join(STORIES_ROOT, folder, metaFile));
    if (!metadata || typeof metadata !== "object") continue;

    const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
    if (!title) continue;

    const storyFile =
      (typeof entry.storyFile === "string" && entry.storyFile.trim()) ||
      (typeof metadata.story_file === "string" && metadata.story_file.trim()) ||
      "";
    const storyContent = storyFile
      ? await readText(path.join(STORIES_ROOT, folder, storyFile))
      : "";

    const photoNames = sortPhotoFilenames(
      Array.isArray(metadata.photos) && metadata.photos.every((p) => typeof p === "string")
        ? metadata.photos
        : Array.isArray(entry.photos)
          ? entry.photos
          : [],
    );
    const folderUrl = `${STORIES_URL_BASE}${encodeFolder(folder)}/`;
    const photos = photoNames.map((name) => `${folderUrl}${encodeURIComponent(name)}`);
    const heroPhoto = photos[0] || null;

    const slug =
      typeof metadata.story_id === "string" && metadata.story_id.trim()
        ? slugifyFolder(metadata.story_id.trim())
        : slugifyFolder(folder);

    const id =
      (typeof metadata.id === "string" && metadata.id.trim()) ||
      (typeof metadata.story_id === "string" && metadata.story_id.trim()) ||
      slug;

    const date =
      typeof metadata.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(metadata.date)
        ? metadata.date.slice(0, 10)
        : parseLeadingDateFromFolder(folder);

    out.push({
      id,
      slug,
      folderName: folder,
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

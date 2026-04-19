/**
 * Scans assets/public/Content/Inspire/ on disk and writes stories-manifest.json.
 * Run from repo root: node scripts/build-inspire-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const inspireRoot = path.join(repoRoot, "assets", "public", "Content", "Inspire");
const outFile = path.join(inspireRoot, "stories-manifest.json");

const PHOTO_EXT = /\.(jpe?g|png)$/i;

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function metaCandidatesInDir(absDir) {
  return listFiles(absDir)
    .filter((e) => e.isFile() && /Meta-.+\.txt$/i.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function storyCandidatesInDir(absDir) {
  return listFiles(absDir)
    .filter(
      (e) =>
        e.isFile() &&
        (/^Story-.+\.(md|txt)$/i.test(e.name) || /^story-.+\.(md|txt)$/i.test(e.name)),
    )
    .map((e) => e.name)
    .sort((a, b) => {
      const ap = /\.md$/i.test(a) ? 0 : 1;
      const bp = /\.md$/i.test(b) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.localeCompare(b, undefined, { numeric: true });
    });
}

function photoCandidatesInDir(absDir) {
  return listFiles(absDir)
    .filter((e) => e.isFile() && PHOTO_EXT.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Find story roots: directory containing at least one Meta-*.txt, or descend
 * into a single subdirectory (nested story layout).
 * @param {string} absDir
 * @param {string} relFromInspire posix-style relative path or ""
 * @returns {{ folder: string, absDir: string, metaFile: string }[]}
 */
function discoverStoryDirs(absDir, relFromInspire = "") {
  const metas = metaCandidatesInDir(absDir);
  if (metas.length) {
    const folder = relFromInspire.replace(/\\/g, "/");
    return [{ folder, absDir, metaFile: metas[0] }];
  }

  const subs = listFiles(absDir).filter((e) => e.isDirectory());
  if (subs.length === 1) {
    const sub = subs[0].name;
    const nextRel = relFromInspire ? `${relFromInspire}/${sub}` : sub;
    return discoverStoryDirs(path.join(absDir, sub), nextRel);
  }

  if (!relFromInspire) {
    const out = [];
    for (const s of subs) {
      out.push(...discoverStoryDirs(path.join(absDir, s.name), s.name));
    }
    return out;
  }

  return [];
}

function buildManifest() {
  if (!fs.existsSync(inspireRoot)) {
    console.error("[build-inspire-manifest] Inspire root missing:", inspireRoot);
    process.exit(1);
  }

  const discovered = discoverStoryDirs(inspireRoot, "");
  const stories = [];
  const skipped = [];

  for (const { folder, absDir, metaFile } of discovered) {
    if (!folder) {
      skipped.push({ folder: "(root)", reason: "meta at Inspire root is not supported" });
      continue;
    }

    let metaJson;
    try {
      const raw = fs.readFileSync(path.join(absDir, metaFile), "utf8");
      metaJson = JSON.parse(raw);
    } catch (e) {
      skipped.push({ folder, reason: `invalid metadata JSON: ${e?.message || e}` });
      continue;
    }

    if (!metaJson || typeof metaJson !== "object" || Array.isArray(metaJson)) {
      skipped.push({ folder, reason: "metadata is not a JSON object" });
      continue;
    }

    const title = typeof metaJson.title === "string" ? metaJson.title.trim() : "";
    if (!title) {
      skipped.push({ folder, reason: "metadata.title missing" });
      continue;
    }

    const storyNames = storyCandidatesInDir(absDir);
    const storyFile = storyNames[0] || undefined;
    const photos = photoCandidatesInDir(absDir);

    const entry = {
      folder,
      metaFile,
      ...(storyFile ? { storyFile } : {}),
      ...(photos.length ? { photos } : {}),
    };
    stories.push(entry);
  }

  const manifest = {
    version: 1,
    generated: new Date().toISOString(),
    stories,
  };

  fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log("[build-inspire-manifest] Inspire root:", inspireRoot);
  console.log("[build-inspire-manifest] Story folders found:", discovered.length);
  console.log("[build-inspire-manifest] Manifest entries written:", stories.length);
  console.log("[build-inspire-manifest] Skipped:", skipped.length);
  if (skipped.length) console.log(JSON.stringify(skipped, null, 2));
  console.log("[build-inspire-manifest] Wrote:", path.relative(repoRoot, outFile));
}

buildManifest();

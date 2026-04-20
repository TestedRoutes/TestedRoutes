/**
 * fix-photo-orientation.mjs
 *
 * Re-processes every JPG/JPEG under assets/public/Content/
 * using sharp's auto-rotate, which reads the EXIF orientation tag,
 * physically rotates the pixels to match, then strips the tag.
 *
 * Also caps images at 1920px on the long edge and re-encodes at 82%
 * quality — same settings as the original compression run, but now
 * with orientation baked in so images are never sideways in the browser.
 *
 * Usage:  node scripts/fix-photo-orientation.mjs
 */

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "assets", "public", "Content");

const MAX_PX = 1920;
const QUALITY = 82;

async function walkJpegs(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkJpegs(full, results);
    } else if (/\.(jpe?g)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function processFile(filePath) {
  try {
    const img = sharp(filePath)
      .rotate()                        // auto-rotate from EXIF, strips orientation tag
      .resize(MAX_PX, MAX_PX, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true });

    // Write to a temp buffer, then overwrite the original
    const buf = await img.toBuffer();
    const { writeFile } = await import("fs/promises");
    await writeFile(filePath, buf);

    const { size } = await stat(filePath);
    const kb = (size / 1024).toFixed(0);
    console.log(`  ✓  ${filePath.replace(ROOT, "").slice(1)}  →  ${kb} KB`);
  } catch (err) {
    console.error(`  ✗  ${filePath}  —  ${err.message}`);
  }
}

console.log("Scanning for JPEGs under", ROOT);
const files = await walkJpegs(ROOT);
console.log(`Found ${files.length} files. Processing...\n`);

// Process in batches of 4 to avoid memory spikes
for (let i = 0; i < files.length; i += 4) {
  await Promise.all(files.slice(i, i + 4).map(processFile));
}

console.log("\nDone. Run npm run build then commit dist/.");

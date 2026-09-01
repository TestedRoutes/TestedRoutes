#!/usr/bin/env node
/**
 * Cap the destination hub photo renditions at the width the site can actually
 * display them.
 *
 * Why this exists (2026-09-02): the destination photos ship at 2000px wide,
 * but nothing on the site renders them above 830 CSS px — the hub hero is
 * `sizes="(max-width: 768px) 100vw, 830px"`, PhotoCarousel is 768px, and the
 * /destinations index card is 400px. Next sets an <img src> fallback to the
 * LARGEST srcset candidate (w=3840), and Vercel's optimizer caps a transform
 * at the source width rather than upscaling — so w=3840 and w=2048 both
 * returned the identical 634 KB WebP for a card that displays the 1080w
 * (225 KB) variant. That full-size transform is the heaviest and slowest
 * request on the page and buys nothing; it is the prime suspect for the
 * intermittently broken destination card (an image request that dies in
 * flight leaves the card showing alt text over an empty frame).
 *
 * Capping the source at 1660px (830 × 2 for retina) makes the worst-case
 * variant cheap without costing a visible pixel anywhere on the site.
 *
 * These files are machine-generated web renditions, not founder deliverables,
 * so they are rewritten in place — git is their history. The masters in the
 * sibling `_shortlist-*` folders are untracked and named by capture id, so
 * they are not a re-derivation source; we downscale the existing rendition.
 * One extra encode at q=90 is immaterial next to the WebP q=75 that Vercel
 * applies on delivery.
 *
 *   node scripts/resize-destination-photos.mjs              # dry run
 *   node scripts/resize-destination-photos.mjs --apply
 *   node scripts/resize-destination-photos.mjs --country samoa
 *   node scripts/resize-destination-photos.mjs --max-width 1660
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => {
  const i = args.indexOf(f);
  return i !== -1 && args[i + 1] ? args[i + 1] : d;
};

const APPLY = has("--apply");
const MAX_WIDTH = Number(val("--max-width", "1660"));
const ONLY_COUNTRY = val("--country", null);
const QUALITY = Number(val("--quality", "90"));
const ROOT = path.resolve(process.cwd(), "content/countries");

const kb = (n) => `${Math.round(n / 1024)} KB`;
const pct = (a, b) => `${a > 0 ? Math.round((1 - b / a) * 100) : 0}%`;

async function countries() {
  const out = [];
  for (const name of await readdir(ROOT)) {
    if (ONLY_COUNTRY && name !== ONLY_COUNTRY) continue;
    const dir = path.join(ROOT, name, "destination/generated/web");
    try {
      if ((await stat(dir)).isDirectory()) out.push({ name, dir });
    } catch {
      /* country has no destination renditions yet */
    }
  }
  return out;
}

async function main() {
  const found = await countries();
  if (!found.length) {
    console.error(
      ONLY_COUNTRY
        ? `No destination/generated/web for "${ONLY_COUNTRY}".`
        : "No destination renditions found.",
    );
    process.exit(1);
  }

  console.log(
    `${APPLY ? "APPLY" : "DRY RUN"} · cap width ${MAX_WIDTH}px · jpeg q${QUALITY}\n`,
  );

  let totalBefore = 0;
  let totalAfter = 0;
  let resized = 0;
  let skipped = 0;
  const notes = [];

  for (const { name, dir } of found) {
    const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f));
    let cBefore = 0;
    let cAfter = 0;
    let cCount = 0;

    for (const file of files.sort()) {
      const full = path.join(dir, file);
      const input = await readFile(full);
      const meta = await sharp(input).metadata();

      // EXIF orientation is baked in by .rotate() before we strip metadata,
      // so a stripped file can never render rotated.
      const oriented = meta.orientation && meta.orientation > 1;
      if (oriented) notes.push(`${name}/${file}: EXIF orientation ${meta.orientation} baked in`);

      if (meta.width <= MAX_WIDTH) {
        skipped++;
        totalBefore += input.length;
        totalAfter += input.length;
        continue;
      }

      const output = await sharp(input)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer();

      const after = await sharp(output).metadata();

      // Never let a "saving" pass make a file bigger.
      if (output.length >= input.length) {
        notes.push(
          `${name}/${file}: re-encode was larger (${kb(input.length)} → ${kb(output.length)}), left alone`,
        );
        skipped++;
        totalBefore += input.length;
        totalAfter += input.length;
        continue;
      }

      if (APPLY) await writeFile(full, output);

      resized++;
      cCount++;
      cBefore += input.length;
      cAfter += output.length;
      totalBefore += input.length;
      totalAfter += output.length;

      console.log(
        `  ${name}/${file}\n` +
          `      ${meta.width}x${meta.height} ${kb(input.length)}` +
          `  →  ${after.width}x${after.height} ${kb(output.length)}  (-${pct(input.length, output.length)})`,
      );
    }

    if (cCount) {
      console.log(
        `  ── ${name}: ${cCount} file(s), ${kb(cBefore)} → ${kb(cAfter)} (-${pct(cBefore, cAfter)})\n`,
      );
    }
  }

  if (notes.length) {
    console.log("Notes:");
    for (const n of notes) console.log(`  · ${n}`);
    console.log("");
  }

  console.log(
    `${resized} resized, ${skipped} already within ${MAX_WIDTH}px.\n` +
      `Total ${kb(totalBefore)} → ${kb(totalAfter)} (-${pct(totalBefore, totalAfter)})`,
  );
  if (!APPLY && resized) console.log(`\nNothing written. Re-run with --apply.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

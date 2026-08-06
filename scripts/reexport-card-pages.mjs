#!/usr/bin/env node
/**
 * Re-export every guide's card page renders from its sellable PDF.
 *
 * The card standard (see CLAUDE.md) is the Seychelles treatment: carousel
 * slides 1-2 are the A4 portrait renders of the guide PDF's pages 1-2,
 * shown whole on the card. This script makes that true for all guides in
 * one pass, rendering straight from the PDF asset already in Sanity — the
 * product itself, so the card always shows the real page 1, not a
 * separately-shaped social export.
 *
 * Per guide (drafts and published alike):
 *   - renders PDF pages 1-2 at 1600px long edge, JPEG q82 (the same
 *     display-resolution budget set-guide-carousel.mjs uses)
 *   - replaces the image on carousel slides 1-2, keeping each slide's
 *     _key, alt and caption
 *   - sets guide.cover to the page-1 render (cover is required by schema
 *     and documented as exactly this export)
 *
 * Skips, with a warning instead of a write: guides with no PDF, PDFs whose
 * page 1 isn't A4 portrait (~1:1.41, override with --allow-shape), and
 * carousel slots that hold a video. A guide with no carousel gets its
 * cover set but no slides — author the carousel with set-guide-carousel.mjs.
 *
 * Usage:
 *   node --env-file=.env.local scripts/reexport-card-pages.mjs [--dry-run] [--slug <story slug>] [--allow-shape]
 */
import { createClient } from "next-sanity";
import * as mupdf from "mupdf";
import sharp from "sharp";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ALLOW_SHAPE = args.includes("--allow-shape");
const slugIdx = args.indexOf("--slug");
const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null;

const MAX_EDGE = 1600;
const A4 = 1.414; // portrait height/width
const A4_TOLERANCE = 0.11; // accepts 1.30-1.52 — trimmed exports drift a little

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Token fetches return drafts and published docs alike; patching both keeps
// a later Studio publish from reverting the fix.
const docs = await client.fetch(
  `*[_type == "story" && guide.hasGuide == true ${ONLY_SLUG ? "&& slug.current == $slug" : ""}]{
    _id,
    title,
    "slug": slug.current,
    "pdfUrl": guide.pdf.asset->url,
    "coverAlt": guide.cover.alt,
    "carousel": guide.carousel[]{ _key, caption, alt, "imageRef": image.asset._ref, "isVideo": defined(video) }
  }`,
  ONLY_SLUG ? { slug: ONLY_SLUG } : {},
);
if (!docs.length) {
  console.error("no guide stories matched");
  process.exit(1);
}

// One render+upload per distinct PDF URL — a draft and its published doc
// share the asset, and identical bytes would dedupe server-side anyway.
const renderCache = new Map();

async function renderPages(pdfUrl, slug) {
  if (renderCache.has(pdfUrl)) return renderCache.get(pdfUrl);
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`PDF download failed (${res.status}) for ${slug}`);
  const pdf = Buffer.from(await res.arrayBuffer());
  const doc = mupdf.Document.openDocument(pdf, "application/pdf");
  const pageCount = doc.countPages();
  const pages = [];
  for (let i = 0; i < Math.min(2, pageCount); i++) {
    const page = doc.loadPage(i);
    const [x0, y0, x1, y1] = page.getBounds();
    const w = x1 - x0;
    const h = y1 - y0;
    const ratio = h / w;
    if (Math.abs(ratio - A4) > A4_TOLERANCE && !ALLOW_SHAPE) {
      throw new Error(
        `${slug}: PDF page ${i + 1} is ${ratio.toFixed(2)}:1, not A4 portrait (~1.41:1). ` +
          "The card standard needs the A4 product PDF; re-run with --allow-shape only if this shape is intentional.",
      );
    }
    const scale = MAX_EDGE / Math.max(w, h);
    const pix = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false, true);
    const jpeg = await sharp(Buffer.from(pix.asPNG()))
      .jpeg({ quality: 82, progressive: true })
      .toBuffer();
    pages.push(jpeg);
  }
  const result = { pages, pageCount };
  renderCache.set(pdfUrl, result);
  return result;
}

// Upload once per (pdfUrl, page) — cached alongside the renders.
const uploadCache = new Map();
async function uploadPage(pdfUrl, slug, pageIndex, jpeg) {
  const cacheKey = `${pdfUrl}#${pageIndex}`;
  if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey);
  const asset = await client.assets.upload("image", jpeg, {
    filename: `${slug}-page-${pageIndex + 1}.jpg`,
  });
  uploadCache.set(cacheKey, asset._id);
  return asset._id;
}

let patched = 0;
let warned = 0;
for (const doc of docs) {
  const label = `${doc._id} (${doc.slug})`;
  if (!doc.pdfUrl) {
    console.warn(`WARN  ${label} — no guide PDF uploaded; nothing to render`);
    warned++;
    continue;
  }
  let rendered;
  try {
    rendered = await renderPages(doc.pdfUrl, doc.slug);
  } catch (err) {
    console.warn(`WARN  ${label} — ${err.message}`);
    warned++;
    continue;
  }

  const sets = {};
  const slides = Array.isArray(doc.carousel) ? doc.carousel : [];
  for (const [i, jpeg] of rendered.pages.entries()) {
    const slide = slides[i];
    if (!slide) {
      if (slides.length) {
        console.warn(`WARN  ${label} — carousel has no slide ${i + 1}; run set-guide-carousel.mjs`);
        warned++;
      }
      continue;
    }
    if (slide.isVideo) {
      console.warn(`WARN  ${label} — slide ${i + 1} is a video; slides 1-2 must be the page renders`);
      warned++;
      continue;
    }
    const assetId = DRY_RUN ? `(page-${i + 1} render)` : await uploadPage(doc.pdfUrl, doc.slug, i, jpeg);
    // _key-addressed so the patch is immune to concurrent reordering.
    sets[`guide.carousel[_key=="${slide._key}"].image`] = {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
    };
  }
  if (rendered.pages[0]) {
    const assetId = DRY_RUN ? "(page-1 render)" : await uploadPage(doc.pdfUrl, doc.slug, 0, rendered.pages[0]);
    sets["guide.cover"] = {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      alt: doc.coverAlt || `Cover of ${doc.title}`,
    };
  }

  if (!Object.keys(sets).length) {
    console.warn(`WARN  ${label} — nothing to patch`);
    warned++;
    continue;
  }
  console.log(`${DRY_RUN ? "would patch" : "patching"} ${label}: ${Object.keys(sets).join(", ")}`);
  if (!DRY_RUN) {
    const res = await client.patch(doc._id).set(sets).commit();
    console.log("  done, rev", res._rev);
    patched++;
  }
}
console.log(
  DRY_RUN
    ? `dry run complete (${docs.length} doc(s) examined, ${warned} warning(s))`
    : `patched ${patched}/${docs.length} doc(s), ${warned} warning(s)`,
);

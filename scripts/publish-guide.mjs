#!/usr/bin/env node
/**
 * Publish one guide SKU to Sanity, from data.
 *
 * This replaces thirteen near-identical create-<slug>-guide.mjs scripts. Each
 * of those was ~345 lines, of which maybe forty were mechanics and the rest was
 * one guide's copy sitting inside executable code. The mechanics are now here,
 * once; the copy lives in scripts/guides/<slug>.mjs as plain data.
 *
 * Two things went wrong under the old shape, and both are design constraints
 * for this one:
 *
 * 1. Every script hardcoded an ASSETS path inside the per-session scratchpad
 *    directory that produced it. Those directories are temporary. Nothing
 *    promises they survive, and create-seychelles-guide.mjs had already broken
 *    when the content tree was reorganised under it. A script whose header
 *    comment promises idempotency, but which cannot run twice because its
 *    inputs have evaporated, is worse than one that makes no promise: the
 *    promise is what stops you checking. So asset resolution here is explicit,
 *    and re-publishing an existing guide defaults to carrying forward the
 *    asset references already in Sanity - no source files required at all.
 *
 * 2. Each new guide was cloned from the newest sibling. That copies the bug
 *    surface forward and never back: a fix made in guide thirteen never
 *    reaches the twelve behind it. One engine means one place to fix.
 *
 * Usage:
 *   node --env-file=.env.local scripts/publish-guide.mjs --slug kuwait-2-days --dry-run
 *   node --env-file=.env.local scripts/publish-guide.mjs --slug kuwait-2-days
 *   node --env-file=.env.local scripts/publish-guide.mjs --slug kuwait-2-days --assets ./some/dir
 *
 * Flags:
 *   --slug <slug>    required; selects scripts/guides/<slug>.mjs
 *   --dry-run        build and validate the doc, write nothing, upload nothing
 *   --assets <dir>   upload hero/gallery/PDF from this directory
 *   --reuse-assets   force carrying forward the assets already on the doc
 *   --replace        do NOT preserve fields other tools own; reset the doc to
 *                    exactly this data. Destructive - see the note further down.
 *   --no-ping        skip the IndexNow submission after a successful publish
 *   --json           print the built doc as JSON and nothing else (parity checks)
 */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {
    dryRun: false, json: false, reuseAssets: false, replace: false,
    noPing: false, slug: null, assets: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--json") args.json = true;
    else if (a === "--reuse-assets") args.reuseAssets = true;
    else if (a === "--replace") args.replace = true;
    else if (a === "--no-ping") args.noPing = true;
    else if (a === "--slug") args.slug = argv[++i];
    else if (a === "--assets") args.assets = argv[++i];
    else if (a.startsWith("--slug=")) args.slug = a.slice(7);
    else if (a.startsWith("--assets=")) args.assets = a.slice(9);
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.slug) throw new Error("--slug is required (e.g. --slug kuwait-2-days)");
  return args;
}

const args = parseArgs(process.argv.slice(2));

// --json implies dry-run. Printing a doc is a read-only act and it would be a
// nasty surprise for a parity check to publish.
if (args.json) args.dryRun = true;

const log = (...m) => {
  if (!args.json) console.log(...m);
};

// ---------------------------------------------------------------------------
// Guide data module
// ---------------------------------------------------------------------------
const dataPath = path.join(HERE, "guides", `${args.slug}.mjs`);
if (!existsSync(dataPath)) {
  console.error(`No guide data at scripts/guides/${args.slug}.mjs`);
  console.error("Each SKU needs a data module. Copy an existing one and edit the content.");
  process.exit(1);
}
const guide = (await import(pathToFileURL(dataPath).href)).default;

for (const required of ["docId", "doc", "assets"]) {
  if (!guide?.[required]) throw new Error(`scripts/guides/${args.slug}.mjs is missing "${required}"`);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// ---------------------------------------------------------------------------
// Asset resolution
//
// Three modes, chosen in this order:
//   explicit --assets DIR      -> upload from there
//   --reuse-assets             -> carry forward what is already on the doc
//   guide.assets.dir exists    -> upload from there
//   otherwise, doc exists      -> reuse (this is the common re-publish case)
//   otherwise                  -> fail loudly, naming the directory it wanted
//
// The last line matters. The failure mode worth designing against is not an
// error, it is a script that quietly publishes a guide with no hero image
// because a path was wrong, and nobody notices until the card renders blank.
// ---------------------------------------------------------------------------
function dryImage(file, alt) {
  return { _type: "image", alt, asset: { _type: "reference", _ref: `DRY-${file}` } };
}

async function uploadImage(dir, file, alt) {
  if (args.dryRun) return dryImage(file, alt);
  const asset = await client.assets.upload("image", readFileSync(path.join(dir, file)), { filename: file });
  return { _type: "image", alt, asset: { _type: "reference", _ref: asset._id } };
}

async function resolveByUpload(dir) {
  const { hero, gallery, pdf } = guide.assets;

  // Fail before uploading anything rather than halfway through. A partial
  // upload leaves orphaned assets in Sanity and a doc that was never written.
  if (!args.dryRun) {
    const missing = [hero.file, ...gallery.map((g) => g.file)]
      .filter((f) => !existsSync(path.join(dir, f)));
    if (missing.length) {
      throw new Error(`assets missing from ${dir}: ${missing.join(", ")}`);
    }
  }

  const heroImage = await uploadImage(dir, hero.file, hero.alt);

  const galleryImages = [];
  for (const g of gallery) {
    const image = await uploadImage(dir, g.file, g.alt);
    // The key comes from the data module, never derived here. The legacy
    // scripts used two different derivations - one lineage did
    // file.replace(/\W/g,""), the other f.slice(9,15) - so any single rule
    // would rewrite the keys of half the library. A _key is an item's identity
    // in Sanity: change it and the Studio treats it as a different image,
    // discarding whatever was attached to the old one.
    if (!g.key) throw new Error(`gallery entry ${g.file} has no key`);
    galleryImages.push({ ...image, _key: g.key });
  }

  let pdfRef;
  if (args.dryRun) {
    pdfRef = "DRY-pdf";
  } else {
    const pdfPath = path.isAbsolute(pdf.path) ? pdf.path : path.join(REPO, pdf.path);
    if (!existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
    const asset = await client.assets.upload("file", readFileSync(pdfPath), {
      filename: pdf.filename ?? path.basename(pdfPath),
      contentType: "application/pdf",
    });
    pdfRef = asset._id;
  }

  return { heroImage, galleryImages, pdfRef };
}

async function resolveByReuse() {
  const existing = await client.fetch(
    `*[_id == $id][0]{heroImage, galleryImages, "pdfRef": guide.pdf.asset._ref, trackLine}`,
    { id: guide.docId },
  );
  if (!existing) {
    throw new Error(
      `--reuse-assets needs an existing doc, but ${guide.docId} is not in Sanity yet. ` +
        `Publish it first with --assets <dir>.`,
    );
  }
  if (!existing.heroImage?.asset?._ref) {
    throw new Error(`${guide.docId} exists but has no heroImage asset to reuse.`);
  }

  // Only the asset reference is reused. Everything else about an image - its
  // alt text, its key - is authored content and comes from the data module.
  //
  // Carrying the whole live image object forward instead looks harmless and is
  // not: it silently makes alt text uneditable, because the module's value is
  // overwritten by the doc's on every publish. The publish reports success and
  // changes nothing, which is the worst way for this to fail. Found 2026-08-17
  // trying to fix six alt texts that read as capture timestamps.
  const liveByKey = new Map(
    (existing.galleryImages ?? []).filter((g) => g?._key).map((g) => [g._key, g]),
  );
  const galleryImages = guide.assets.gallery.map((g) => {
    const live = liveByKey.get(g.key);
    if (!live?.asset?._ref) {
      throw new Error(
        `gallery key "${g.key}" (${g.file}) has no matching image on ${guide.docId}, ` +
          `so there is no asset to reuse. Publish with --assets <dir> to upload it.`,
      );
    }
    return { _type: "image", _key: g.key, alt: g.alt, asset: live.asset };
  });

  const orphaned = [...liveByKey.keys()].filter(
    (k) => !guide.assets.gallery.some((g) => g.key === k),
  );
  if (orphaned.length) {
    // Publishing would drop these, so say so rather than quietly shrinking the
    // gallery. Add them to the data module, or remove them deliberately.
    log(`warning: ${orphaned.length} gallery image(s) on the doc are not in the data`);
    log(`  module and would be dropped: ${orphaned.join(", ")}`);
  }

  return {
    heroImage: {
      _type: "image",
      alt: guide.assets.hero.alt,
      asset: existing.heroImage.asset,
    },
    galleryImages,
    pdfRef: existing.pdfRef,
    trackLine: existing.trackLine,
  };
}

async function docExists() {
  if (args.dryRun && !process.env.SANITY_API_WRITE_TOKEN) return false;
  const found = await client.fetch(`count(*[_id == $id])`, { id: guide.docId });
  return found > 0;
}

async function resolveAssets() {
  const declaredDir = guide.assets.dir
    ? path.isAbsolute(guide.assets.dir)
      ? guide.assets.dir
      : path.join(REPO, guide.assets.dir)
    : null;

  if (args.assets) {
    log(`assets: uploading from ${args.assets}`);
    return { mode: "upload", ...(await resolveByUpload(args.assets)) };
  }
  if (args.reuseAssets) {
    log("assets: reusing what is already on the doc");
    return { mode: "reuse", ...(await resolveByReuse()) };
  }
  if (declaredDir && existsSync(declaredDir)) {
    log(`assets: uploading from ${declaredDir}`);
    return { mode: "upload", ...(await resolveByUpload(declaredDir)) };
  }
  if (args.dryRun) {
    // A dry run should still show the shape of the doc even with no assets on
    // disk, otherwise it stops being useful exactly when you most want it.
    log("assets: none on disk, dry-run placeholders");
    return { mode: "upload", ...(await resolveByUpload(declaredDir ?? ".")) };
  }
  if (await docExists()) {
    log("assets: no source directory, reusing what is already on the doc");
    return { mode: "reuse", ...(await resolveByReuse()) };
  }
  throw new Error(
    `No assets to publish. Expected a directory at ${declaredDir ?? "(none declared)"}, ` +
      `or pass --assets <dir>. The doc does not exist yet, so there is nothing to reuse.`,
  );
}

// ---------------------------------------------------------------------------
// Track line
//
// Small enough (0.5-8 KB) to live in the repo next to the data module, which is
// the point: it used to be read out of a scratchpad directory, so the line a
// guide's map draws was not reproducible from a clean checkout.
// ---------------------------------------------------------------------------
function resolveTrackLine(reused) {
  if (!guide.assets.trackLine) return reused ?? undefined;
  const p = path.isAbsolute(guide.assets.trackLine)
    ? guide.assets.trackLine
    : path.join(HERE, "guides", guide.assets.trackLine);
  if (!existsSync(p)) {
    if (reused) {
      log(`track line: ${p} missing, keeping the one already on the doc`);
      return reused;
    }
    throw new Error(`track line declared but not found: ${p}`);
  }
  // Re-stringify rather than passing the file through, so formatting
  // differences in the source file cannot change what is stored.
  return JSON.stringify(JSON.parse(readFileSync(p, "utf8")));
}

// ---------------------------------------------------------------------------
// Validation
//
// These are the checks the per-guide scripts carried, kept as hard failures.
// Every guide gets them now, not just the ones whose author remembered - which
// is the point. The metaDescription length check existed in exactly one
// lineage; running it across all twelve found eight guides outside the range.
// ---------------------------------------------------------------------------
const warnings = [];

/** Checks a guide is allowed to acknowledge via knownIssues. */
const ACKNOWLEDGEABLE = new Set(["metaDescriptionLength"]);

function validate(doc) {
  const problems = [];

  // A guide may acknowledge a check it knowingly fails. The acknowledgement
  // downgrades the failure to a warning that prints on every run, so a known
  // defect stays visible instead of being either invisible or blocking. It is
  // deliberately not a blanket "skip validation" switch: each issue is named,
  // and the data module is expected to say next to it why and since when.
  const known = new Set(guide.knownIssues ?? []);
  const record = (id, message) => {
    if (known.has(id)) warnings.push(`${message}  [acknowledged: ${id}]`);
    else problems.push(message);
  };

  const md = doc.metaDescription;
  if (typeof md !== "string") problems.push("metaDescription is missing");
  else if (md.length < 145 || md.length > 160) {
    // 145-160 is the house range, stated on the Content Plan's own column
    // header ("Meta description (SEO, 145-160)"). Over 160 and Google cuts it
    // off mid-sentence; under 145 wastes the slot.
    record("metaDescriptionLength", `metaDescription is ${md.length} chars, wanted 145-160`);
  }

  if (!doc.title) problems.push("title is missing");
  if (!doc.slug?.current) problems.push("slug.current is missing");
  if (doc.slug?.current && doc.slug.current !== args.slug) {
    problems.push(`slug.current "${doc.slug.current}" does not match --slug "${args.slug}"`);
  }
  if (!doc.heroImage?.asset?._ref) problems.push("heroImage has no asset");
  if (!doc.guide?.pdf?.asset?._ref) problems.push("guide.pdf has no asset");

  // A guide with no price is a guide with a buy button that cannot charge.
  const prices = doc.guide?.customPrices ?? [];
  if (!prices.length) problems.push("guide.customPrices is empty");
  for (const p of prices) {
    if (typeof p.amount !== "number" || p.amount <= 0) {
      problems.push(`price for ${p.currency} is not a positive number`);
    }
  }

  // Duplicate _keys inside an array are silently destructive in Sanity: the
  // Studio treats them as the same item and edits to one overwrite the other.
  for (const field of ["galleryImages", "routePoints", "primaryStats", "similarStories"]) {
    const arr = doc[field];
    if (!Array.isArray(arr)) continue;
    const keys = arr.map((x) => x?._key).filter(Boolean);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    if (dupes.length) problems.push(`${field} has duplicate _key: ${[...new Set(dupes)].join(", ")}`);
  }

  const stale = [...known].filter((id) => !ACKNOWLEDGEABLE.has(id));
  if (stale.length) {
    problems.push(
      `knownIssues names ${stale.join(", ")}, which no check produces. ` +
        `Either the check was removed or the name is a typo - an acknowledgement ` +
        `that matches nothing silently protects nothing.`,
    );
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Build, validate, write
//
// The story doc has more than one author. This pipeline writes the copy and the
// hero/gallery/PDF assets, but other tools own other fields of the same
// document:
//
//   guide.carousel        set-guide-carousel.mjs
//   guide.cover           reexport-card-pages.mjs
//   guide.polarProductId  sync-polar-products.mjs
//   guide.statusNote      patch-status-note.mjs
//   similarStories        patched by hand after related guides publish
//
// The legacy scripts called createOrReplace with only their own fields, which
// means re-running one today would silently delete every field in that list.
// Losing polarProductId alone takes the buy button out of service: the checkout
// route has no product to send the customer to. Nobody would see an error - the
// publish would report success.
//
// So the doc is assembled over whatever is already live: authored fields win,
// unauthored fields survive. --replace opts into the old destructive behaviour
// for the rare case where you really do want the doc reset to just this data.
// ---------------------------------------------------------------------------
const resolved = await resolveAssets();
const trackLine = resolveTrackLine(resolved.trackLine);

const authored = {
  _id: guide.docId,
  _type: "story",
  ...guide.doc,
  heroImage: resolved.heroImage,
  galleryImages: resolved.galleryImages,
  ...(trackLine === undefined ? {} : { trackLine }),
  guide: {
    ...guide.doc.guide,
    pdf: { _type: "file", asset: { _type: "reference", _ref: resolved.pdfRef } },
  },
};

let base = null;
if (!args.replace) {
  base = await client.fetch(`*[_id == $id][0]`, { id: guide.docId }).catch(() => null);
}

const preserved = [];
function mergeOver(existing, next, prefix = "") {
  if (!existing) return next;
  const out = { ...next };
  for (const [k, v] of Object.entries(existing)) {
    if (k.startsWith("_") && k !== "_id" && k !== "_type") continue; // _rev, _createdAt, _updatedAt
    if (k in next) continue;
    out[k] = v;
    preserved.push(prefix + k);
  }
  return out;
}

const doc = mergeOver(base, authored);
if (base?.guide) doc.guide = mergeOver(base.guide, authored.guide, "guide.");

const problems = validate(doc);
if (problems.length) {
  console.error(`\n${args.slug} failed validation:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
// Warnings go to stderr so --json stays a clean pipe, and print on every run
// including a real publish. An acknowledged defect you stop seeing is just a
// defect.
for (const w of warnings) console.error(`  warning: ${args.slug}: ${w}`);

if (args.json) {
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}

if (args.dryRun) {
  const preview = { ...doc };
  if (trackLine) preview.trackLine = `[${JSON.parse(trackLine).length} points]`;
  log(`DRY RUN - no writes. ${guide.docId}:`);
  log(JSON.stringify(preview, null, 2).slice(0, 2000));
  log("\n... truncated.");
  if (resolved.mode === "upload") {
    log("Assets that WOULD upload:", [
      guide.assets.hero.file,
      ...guide.assets.gallery.map((g) => g.file),
      "PDF",
    ].join(", "));
  } else {
    log("Assets: reused from the existing doc, nothing would upload.");
  }
  log("metaDescription length:", doc.metaDescription.length);
} else {
  for (const companion of guide.companionDocs ?? []) {
    await client.createIfNotExists(companion);
    log("ensured", companion._id);
  }
  const res = await client.createOrReplace(doc);
  log("published", res._id, "| metaDescription", doc.metaDescription.length, "chars");

  // Submit to IndexNow so Bing hears about it now rather than on its own
  // schedule. Best-effort by design: a search-engine ping must never be able to
  // fail a publish that has already succeeded, and the document is live either
  // way. Google does not participate in IndexNow - see ping-indexnow.mjs.
  if (!args.noPing) {
    try {
      const { execFileSync } = await import("node:child_process");
      execFileSync(
        process.execPath,
        [path.join(HERE, "ping-indexnow.mjs"), "--url", `https://testedroutes.com/guides/${args.slug}`],
        { stdio: "inherit" },
      );
    } catch {
      log("IndexNow ping failed - the guide is published regardless. Retry with:");
      log(`  npm run ping:indexnow -- --slug ${args.slug}`);
    }
  }
}

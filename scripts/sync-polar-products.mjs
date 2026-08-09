#!/usr/bin/env node
/**
 * Sync Sanity guides → Polar products.
 *
 * Source of truth: Sanity. Re-running upserts each guide's Polar product:
 *   - name, description, multi-currency prices come from Sanity, and a
 *     repriced guide patches its live product (old prices get archived)
 *   - PDF is uploaded once (file replacement is a future flag)
 *
 * Idempotency: Polar product ID written back to `guide.polarProductId` after
 * creation. Re-running skips already-synced guides for full create + benefit
 * upload, but always patches name/description to match Sanity.
 *
 * Safety:
 *   - Default dry-run unless POLAR_SYNC_ENABLED=1
 *   - Skip + report on missing required fields (price, EUR, PDF)
 *   - Per-guide error isolation
 *
 * Org token note: organization_id is implicit on every body. Passing it
 * explicitly fails with `organization_token` validation error.
 *
 * Multi-currency: pass an array of fixed prices, one per currency, in
 * a single products.create() call. Verified against sandbox 2026-04-29.
 * (The SDK's "at most one static price" type comment is misleading.)
 *
 * Usage:
 *   npm run sync:polar -- --dry-run          # preview (default)
 *   POLAR_SYNC_ENABLED=1 npm run sync:polar  # live
 *   npm run sync:polar -- --guide=<slug>     # single guide
 *
 * Env (.env.local):
 *   POLAR_SYNC_TOKEN          token with products:write, benefits:write, files:write
 *   POLAR_SERVER              "sandbox" | "production"
 *   POLAR_SYNC_ENABLED        must be "1" to perform writes
 *   NEXT_PUBLIC_SANITY_*      project, dataset
 *   SANITY_API_WRITE_TOKEN    Editor role
 */
import { Polar } from "@polar-sh/sdk";
import { createClient } from "next-sanity";
import crypto from "node:crypto";

/* ────────── args + env ────────── */

const args = process.argv.slice(2);
const FORCE_DRY = args.includes("--dry-run");
const SINGLE_SLUG = (args.find((a) => a.startsWith("--guide=")) || "").split("=")[1] || null;
const VERBOSE = args.includes("--verbose");

const ENABLED = process.env.POLAR_SYNC_ENABLED === "1";
const DRY_RUN = FORCE_DRY || !ENABLED;

const POLAR_TOKEN = process.env.POLAR_SYNC_TOKEN;
const POLAR_SERVER =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
if (!SANITY_TOKEN) exit("SANITY_API_WRITE_TOKEN is required");
if (!DRY_RUN && !POLAR_TOKEN) exit("POLAR_SYNC_TOKEN is required for live runs");

if (DRY_RUN && ENABLED && !FORCE_DRY) {
  // Should not happen, but be explicit.
  console.log("Defaulting to dry run.");
}
if (!ENABLED && !FORCE_DRY) {
  console.log(
    "POLAR_SYNC_ENABLED is not set to '1' — running in dry-run mode. Set the env var to perform writes.",
  );
}

/* ────────── clients ────────── */

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: SANITY_TOKEN,
});

const polar = POLAR_TOKEN
  ? new Polar({ accessToken: POLAR_TOKEN, server: POLAR_SERVER })
  : null;

/* ────────── helpers ────────── */

function exit(msg) {
  console.error(`\n${msg}\n`);
  process.exit(1);
}

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function pickPrices(guide) {
  if (Array.isArray(guide?.customPrices) && guide.customPrices.length) {
    return guide.customPrices;
  }
  return guide?.pricingTier?.prices ?? [];
}

// Sanity price entries in the shape Polar's products API wants.
function fixedPrices(guide) {
  return pickPrices(guide).map((p) => ({
    amountType: "fixed",
    priceCurrency: String(p.currency).toLowerCase(),
    priceAmount: toCents(p.amount),
  }));
}

// Order-independent fingerprints, so a reordered price array is not read as
// a price change and does not needlessly archive every live price.
function priceKey(prices) {
  return prices
    .map((p) => `${p.priceCurrency}:${p.priceAmount}`)
    .sort()
    .join("|");
}

function livePriceKey(product) {
  return priceKey(
    (product.prices || [])
      .filter((p) => !p.isArchived && p.amountType === "fixed")
      .map((p) => ({
        priceCurrency: String(p.priceCurrency).toLowerCase(),
        priceAmount: p.priceAmount,
      })),
  );
}

// Polar validates product names at 64 characters, which the longer plan
// titles exceed ("Triftbrücke from Zurich: A Day Trip to the Trift
// Suspension Bridge" is 66). The site keeps the full title; only the
// checkout-facing name is shortened, and the part before the colon is the
// route itself, so it identifies the product on its own.
function productName(title) {
  const full = (title || "guide").trim();
  if (full.length <= 64) return full;
  if (full.includes(":")) {
    const head = full.split(":")[0].trim();
    if (head.length >= 8 && head.length <= 64) return head;
  }
  const cut = full.slice(0, 64);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 10 ? cut.slice(0, lastSpace) : cut).replace(/[\s:,–-]+$/, "");
}

// Buyer-facing downloadables label, within Polar's 42-char server limit.
// Trims at a word boundary so a long title never becomes mid-word garbage.
function benefitDescription(title) {
  const full = (title || "guide").trim();
  // Prefer the whole title when it fits — "Seychelles – guide PDF" tells a
  // buyer far less than "Seychelles: four islands in 7 days PDF".
  if (`${full} PDF`.length <= 42) return `${full} PDF`;
  if (full.length <= 42) return full;

  const suffix = " – guide PDF";
  const room = 42 - suffix.length;
  let name = full;
  // Titles are "Place in N days: the marketing subtitle" — the part before
  // the colon is the product name and usually fits on its own.
  if (name.length > room && name.includes(":")) {
    const head = name.split(":")[0].trim();
    if (head.length >= 8) name = head;
  }
  if (name.length > room) {
    const cut = name.slice(0, room);
    const lastSpace = cut.lastIndexOf(" ");
    name = lastSpace > 10 ? cut.slice(0, lastSpace) : cut;
  }
  // Never end on a dangling article or punctuation.
  name = name.replace(/[\s:,–-]+$/, "").replace(/\s+(the|a|an|and|of|in|to)$/i, "");
  return `${name}${suffix}`;
}

// Filename the buyer sees on the downloaded file. Follows the public guide
// URL rather than the internal story slug, which can differ after a retitle.
function downloadFilename(guide) {
  return `${guide.pageSlug || guide.slug}.pdf`;
}

function describeReason(guide) {
  if (!guide.pdfUrl) return "missing PDF (guide.pdf)";
  const prices = pickPrices(guide);
  if (!prices.length) return "no prices (no tier and no customPrices)";
  if (!prices.some((p) => p?.currency === "EUR")) return "missing EUR price (org default)";
  return null;
}

async function findExistingProduct(polarProductId) {
  if (!polarProductId) return null;
  try {
    return await polar.products.get({ id: polarProductId });
  } catch (err) {
    if (String(err?.statusCode) === "404") return null;
    throw err;
  }
}

/**
 * Multipart-upload a PDF to Polar's Files API. Returns the file ID.
 * For PDFs under 10 MB this typically completes in a single part.
 * Org token implies organization — no organization_id in body.
 */
async function uploadPdfToPolar(name, bytes) {
  const checksumSha256Base64 = crypto
    .createHash("sha256")
    .update(bytes)
    .digest("base64");
  const size = bytes.length;

  const fileCreate = await polar.files.create({
    name,
    mimeType: "application/pdf",
    size,
    service: "downloadable",
    checksumSha256Base64,
    upload: {
      parts: [
        {
          number: 1,
          chunkStart: 0,
          chunkEnd: size - 1,
          checksumSha256Base64,
        },
      ],
    },
  });

  const part = fileCreate.upload?.parts?.[0];
  if (!part?.url) throw new Error("Polar files.create did not return a presigned upload URL");

  // PUT raw bytes to the presigned URL
  const putRes = await fetch(part.url, {
    method: "PUT",
    headers: part.headers || {},
    body: bytes,
  });
  if (!putRes.ok) {
    throw new Error(`PDF PUT failed: ${putRes.status} ${putRes.statusText}`);
  }
  const etag = putRes.headers.get("etag")?.replace(/"/g, "") || "";

  await polar.files.uploaded({
    id: fileCreate.id,
    fileUploadCompleted: {
      id: fileCreate.upload?.id,
      path: fileCreate.upload?.path,
      parts: [{ number: 1, checksumEtag: etag, checksumSha256Base64 }],
    },
  });

  return fileCreate.id;
}

async function downloadPdf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download PDF (${res.status}): ${url}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

/* ────────── per-guide handlers ────────── */

async function syncCreate({ guide }) {
  const prices = fixedPrices(guide);

  // 1. Upload PDF
  if (VERBOSE) console.log(`    ↑ uploading PDF for ${guide.slug}`);
  const pdfBytes = await downloadPdf(guide.pdfUrl);
  const fileId = await uploadPdfToPolar(downloadFilename(guide), pdfBytes);

  // 2. Create File Downloads benefit
  if (VERBOSE) console.log(`    + creating downloadables benefit`);
  const benefit = await polar.benefits.create({
    type: "downloadables",
    // Buyer-facing label in the Polar portal. Polar caps it at 42 chars
    // (validated server-side), so long titles are trimmed at a word
    // boundary rather than falling back to the raw slug.
    description: benefitDescription(guide.title),
    properties: { files: [fileId] },
  });

  // 3. Create the product (private, with all currency prices, sanity_story_id metadata)
  if (VERBOSE) console.log(`    + creating product`);
  const product = await polar.products.create({
    name: productName(guide.title),
    description: guide.subtitle || `Tested route: ${guide.title}.`,
    recurringInterval: null,
    prices,
    metadata: {
      sanity_story_id: guide._id,
      sanity_story_slug: guide.slug,
    },
  });

  // 4. Attach benefit to product
  if (VERBOSE) console.log(`    + attaching benefit to product`);
  await polar.products.updateBenefits({
    id: product.id,
    productBenefitsUpdate: { benefits: [benefit.id] },
  });

  // 5. Set visibility to private (post-create patch — create defaults to "public")
  if (product.visibility !== "private") {
    await polar.products.update({
      id: product.id,
      productUpdate: { visibility: "private" },
    });
  }

  // 6. Patch polarProductId back to Sanity
  await sanity
    .patch(guide._id)
    .set({ "guide.polarProductId": product.id })
    .commit();

  return product.id;
}

async function syncUpdate({ guide, existing }) {
  // Name + description + prices, then the PDF itself.
  const description = guide.subtitle || `Tested route: ${guide.title}.`;
  const name = productName(guide.title);
  const update = {};
  if (existing.name !== name || existing.description !== description) {
    update.name = name;
    update.description = description;
  }
  // Repricing an existing product: send the whole fixed-price list and Polar
  // archives whatever it replaces. Safe because checkout is created from the
  // product ID (app/api/checkout/route.js), never a pinned price ID, and
  // past orders keep their own archived price record.
  if (livePriceKey(existing) !== priceKey(fixedPrices(guide))) {
    update.prices = fixedPrices(guide);
  }
  if (Object.keys(update).length) {
    if (VERBOSE) console.log(`    ~ updating ${Object.keys(update).join(", ")}`);
    await polar.products.update({ id: existing.id, productUpdate: update });
  }
  await syncBenefitPdf({ guide, existing });
  return existing.id;
}

/**
 * Replace the downloadable when the guide PDF has changed.
 *
 * A revised guide must reach buyers, and Polar keeps the file on the
 * benefit rather than the product — so the benefit's file list is what has
 * to move. Compares the live PDF's SHA-256 against the file already
 * attached and only re-uploads on a real difference, because every upload
 * creates a new stored file.
 */
async function syncBenefitPdf({ guide, existing }) {
  const benefit = (existing.benefits || []).find((b) => b.type === "downloadables");
  if (!benefit) {
    console.log(`    ! no downloadables benefit on ${guide.slug} — leaving alone`);
    return;
  }

  const pdfBytes = await downloadPdf(guide.pdfUrl);
  const digest = crypto.createHash("sha256").update(pdfBytes).digest("base64");

  let files = benefit.properties?.files || [];
  let replaced = false;
  const wantName = downloadFilename(guide);
  // Both the bytes and the filename are buyer-visible, so either drifting
  // means the attached file is stale.
  let matches = false;
  for (const fileId of files) {
    try {
      const f = await polar.files.list({ ids: [fileId] }).then((r) => r.result?.items?.[0]);
      if (f?.checksumSha256Base64 === digest && f?.name === wantName) matches = true;
    } catch {
      // Unreadable file record: treat as a mismatch and re-upload rather
      // than leaving buyers on a file we cannot verify.
    }
  }

  if (!matches) {
    if (VERBOSE) console.log(`    ↑ uploading ${wantName}`);
    files = [await uploadPdfToPolar(wantName, pdfBytes)];
    replaced = true;
  } else if (VERBOSE) {
    console.log(`    = PDF unchanged`);
  }

  // The label is buyer-facing and tracks the guide title, so keep it in
  // step even when the file itself did not move.
  const description = benefitDescription(guide.title);
  if (!replaced && benefit.description === description) return;

  await polar.benefits.update({
    id: benefit.id,
    // The SDK names this `requestBody` (a discriminated union on `type`),
    // not `benefitUpdate` as the products calls do. `properties` is always
    // sent so an update never clears the attached files.
    requestBody: { type: "downloadables", description, properties: { files } },
  });
  console.log(`    ✓ ${replaced ? `downloadable replaced (${files[0]})` : "benefit label updated"}`);
}

/* ────────── main ────────── */

async function main() {
  console.log(
    `\nsync-polar-products  •  server=${POLAR_SERVER}  •  ${DRY_RUN ? "DRY RUN" : "LIVE"}${SINGLE_SLUG ? `  •  guide=${SINGLE_SLUG}` : ""}`,
  );

  const filter = SINGLE_SLUG
    ? `*[_type == "story" && guide.hasGuide == true && (slug.current == $slug || guide.pageSlug == $slug)]`
    : `*[_type == "story" && guide.hasGuide == true && guide.status == "available"]`;

  const projection = `{
    _id,
    title,
    "slug": slug.current,
    "pageSlug": guide.pageSlug,
    subtitle,
    "polarProductId": guide.polarProductId,
    "pdfUrl": guide.pdf.asset->url,
    "customPrices": guide.customPrices,
    "pricingTier": guide.pricingTier->{ "slug": slug.current, prices }
  }`;

  const guides = await sanity.fetch(
    `${filter} ${projection}`,
    SINGLE_SLUG ? { slug: SINGLE_SLUG } : {},
  );

  console.log(`\nFound ${guides.length} guide(s).\n`);

  const report = { created: [], updated: [], skipped: [], failed: [] };

  for (const guide of guides) {
    const reason = describeReason(guide);
    if (reason) {
      report.skipped.push({ slug: guide.slug, reason });
      console.log(`  ⊘ skip   ${guide.slug.padEnd(40)} ${reason}`);
      continue;
    }

    if (DRY_RUN) {
      const action = guide.polarProductId ? "would update" : "would create";
      const prices = pickPrices(guide)
        .map((p) => `${p.currency} ${p.amount}`)
        .join(", ");
      console.log(`  ◌ dry    ${guide.slug.padEnd(40)} ${action} (${prices})`);
      continue;
    }

    try {
      if (guide.polarProductId) {
        const existing = await findExistingProduct(guide.polarProductId);
        if (existing) {
          await syncUpdate({ guide, existing });
          report.updated.push(guide.slug);
          console.log(`  ✓ update ${guide.slug}`);
        } else {
          // polarProductId set but product missing — recreate.
          const id = await syncCreate({ guide });
          report.created.push(guide.slug);
          console.log(`  ✓ create ${guide.slug.padEnd(40)} ${id} (was stale)`);
        }
      } else {
        const id = await syncCreate({ guide });
        report.created.push(guide.slug);
        console.log(`  ✓ create ${guide.slug.padEnd(40)} ${id}`);
      }
    } catch (err) {
      report.failed.push({ slug: guide.slug, error: err.message });
      console.log(`  ✗ FAIL   ${guide.slug.padEnd(40)} ${err.message}`);
    }
  }

  /* ────────── summary ────────── */
  console.log("");
  console.log(`  Created: ${report.created.length}`);
  console.log(`  Updated: ${report.updated.length}`);
  console.log(`  Skipped: ${report.skipped.length}`);
  for (const s of report.skipped) console.log(`    - ${s.slug}: ${s.reason}`);
  console.log(`  Failed:  ${report.failed.length}`);
  for (const f of report.failed) console.log(`    - ${f.slug}: ${f.error}`);
  console.log("");

  if (report.failed.length) process.exit(1);
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  console.error(err.stack);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * TestedRoutes — patch affiliate links onto an existing story.
 *
 * Non-destructive companion to publish-to-sanity.mjs. Use this when
 * you want to add / update affiliate links on a story that's already
 * been published, without rewriting the story's body, hero, metadata,
 * or any other Sanity Studio edits made since the last publish.
 *
 * What it does:
 *   1. Reads content/affiliates-global.yaml + content/<slug>/affiliates.yaml.
 *   2. Validates entries; errors loudly on duplicate slugs / bad shape.
 *   3. Upserts (createOrReplace) every affiliateLink doc this guide uses.
 *   4. PATCHES (not replaces) only the `affiliateLinks` field on the
 *      existing story doc — every other field stays untouched.
 *   5. Regenerates content/<slug>/pdf-affiliate-links.md.
 *
 * Usage:
 *   npm run patch:affiliates -- <story-slug>
 *   npm run patch:affiliates -- trift-bridge-from-zurich
 *   npm run patch:affiliates -- trift-bridge-from-zurich --dry-run
 *
 * Env vars required (from .env.local via `node --env-file`):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 */
import { createClient } from "next-sanity";
import yaml from "js-yaml";
import { readFileSync, existsSync, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/* ── env ── */
function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[m[1]] = value;
    }
  }
}
loadEnvLocal();

/* ── args ── */
const args = process.argv.slice(2);
const slugArg = args.find((a) => !a.startsWith("--"));
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

function exit(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

if (!slugArg) {
  exit(
    "Usage: npm run patch:affiliates -- <story-slug> [--dry-run] [--verbose]\n" +
      "  Reads content/<slug>/affiliates.yaml and patches the matching\n" +
      "  story doc's affiliateLinks field (everything else untouched).",
  );
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
if (!DRY_RUN && !TOKEN) exit("SANITY_API_WRITE_TOKEN is not set (required unless --dry-run)");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

/* ── paths ── */
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const GLOBAL_AFFILIATES_PATH = path.join(REPO_ROOT, "content", "affiliates-global.yaml");
const guideFolder = path.join(REPO_ROOT, "content", slugArg);
const guideAffiliatesPath = path.join(guideFolder, "affiliates.yaml");

/* ── helpers ── */
function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9._-]/g, "-");
}
function randomKey() {
  return crypto.randomBytes(6).toString("hex");
}
async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

function validateAffiliateEntry(entry, source) {
  const required = ["slug", "url", "program", "category"];
  for (const k of required) {
    if (!entry?.[k]) {
      exit(`Affiliate entry missing "${k}" in ${source}:\n  ${JSON.stringify(entry, null, 2)}`);
    }
  }
  const slug = String(entry.slug).trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,95}$/.test(slug)) {
    exit(
      `Affiliate slug "${entry.slug}" in ${source} is invalid. ` +
        `Use lowercase letters, digits, and hyphens only (max 96 chars).`,
    );
  }
  return {
    slug,
    label: entry.label || slug,
    category: entry.category,
    url: entry.url,
    program: entry.program,
    linkText: entry.linkText || null,
    notes: entry.notes || null,
    regions: Array.isArray(entry.regions)
      ? entry.regions
          .filter((r) => r && r.region && r.url && r.program)
          .map((r) => ({
            region: String(r.region).toLowerCase(),
            url: r.url,
            program: r.program,
          }))
      : [],
  };
}

async function loadGlobalAffiliates() {
  if (!(await fileExists(GLOBAL_AFFILIATES_PATH))) return new Map();
  const raw = await fs.readFile(GLOBAL_AFFILIATES_PATH, "utf8");
  const parsed = yaml.load(raw);
  if (!parsed) return new Map();
  const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.links) ? parsed.links : [];
  const map = new Map();
  for (const raw of list) {
    const entry = validateAffiliateEntry(raw, "content/affiliates-global.yaml");
    if (map.has(entry.slug)) {
      exit(`Duplicate affiliate slug "${entry.slug}" in content/affiliates-global.yaml.`);
    }
    map.set(entry.slug, { ...entry, scope: "global" });
  }
  return map;
}

async function loadGuideAffiliates() {
  if (!(await fileExists(guideAffiliatesPath))) {
    exit(
      `No affiliates.yaml found at ${path.relative(REPO_ROOT, guideAffiliatesPath)}. ` +
        `Create it (or use a different slug).`,
    );
  }
  const raw = await fs.readFile(guideAffiliatesPath, "utf8");
  const parsed = yaml.load(raw) || {};
  const references = Array.isArray(parsed.references)
    ? parsed.references.map((s) => String(s).trim().toLowerCase()).filter(Boolean)
    : [];
  const linkList = Array.isArray(parsed.links) ? parsed.links : [];
  const guideLinks = new Map();
  for (const raw of linkList) {
    const entry = validateAffiliateEntry(raw, `content/${slugArg}/affiliates.yaml`);
    if (guideLinks.has(entry.slug)) {
      exit(`Duplicate affiliate slug "${entry.slug}" in content/${slugArg}/affiliates.yaml.`);
    }
    guideLinks.set(entry.slug, { ...entry, scope: "guide" });
  }
  return { references, guideLinks };
}

function resolveUsage(globals, guideAffiliates) {
  const used = new Map();
  for (const [slug, entry] of guideAffiliates.guideLinks) used.set(slug, entry);
  for (const ref of guideAffiliates.references) {
    const entry = globals.get(ref);
    if (!entry) {
      exit(
        `Reference "${ref}" not found in content/affiliates-global.yaml. ` +
          `Add it to globals or remove the reference from this guide.`,
      );
    }
    if (!used.has(ref)) used.set(ref, entry);
  }
  return used;
}

function buildAffiliateDoc(entry) {
  return {
    _id: sanitizeId(`affiliateLink-${entry.slug}`),
    _type: "affiliateLink",
    label: entry.label,
    slug: { _type: "slug", current: entry.slug },
    scope: entry.scope || "global",
    category: entry.category,
    url: entry.url,
    program: entry.program,
    regions: entry.regions.length
      ? entry.regions.map((r) => ({
          _type: "regionalAffiliate",
          _key: randomKey(),
          region: r.region,
          url: r.url,
          program: r.program,
        }))
      : undefined,
    linkText: entry.linkText || undefined,
    notes: entry.notes || undefined,
  };
}

async function writePdfCheatSheet(usedAffiliates) {
  if (usedAffiliates.size === 0) return null;
  const cheatPath = path.join(guideFolder, "pdf-affiliate-links.md");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://testedroutes.com";
  const lines = [];
  lines.push(`# PDF affiliate links — ${slugArg}`);
  lines.push("");
  lines.push(
    "Use these short URLs in the PDF. Each /go/<slug> 302-redirects to the",
  );
  lines.push("tagged affiliate URL at click time, with country-aware retailer/region routing.");
  lines.push("");
  lines.push("| Suggested PDF link text | URL to paste in PDF |");
  lines.push("|---|---|");
  const sorted = [...usedAffiliates.values()].sort((a, b) => a.slug.localeCompare(b.slug));
  for (const entry of sorted) {
    const text = entry.linkText || entry.label;
    lines.push(`| ${text} | ${origin}/go/${entry.slug} |`);
  }
  lines.push("");
  await fs.writeFile(cheatPath, lines.join("\n"), "utf8");
  return cheatPath;
}

/* ── main ── */
async function main() {
  console.log(
    `\nTestedRoutes → patch affiliates\n` +
      `  guide slug: ${slugArg}\n` +
      `  mode:       ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE"}\n`,
  );

  const globals = await loadGlobalAffiliates();
  const guideAffiliates = await loadGuideAffiliates();
  const used = resolveUsage(globals, guideAffiliates);

  const globalCount = [...used.values()].filter((e) => e.scope === "global").length;
  const guideCount = [...used.values()].filter((e) => e.scope === "guide").length;
  console.log(`  affiliates: ${used.size} total (${globalCount} global + ${guideCount} guide-specific)`);

  // Find the existing story. Match either the canonical slug.current
  // (e.g. "triftbrucke-from-zurich" with original spelling) OR the
  // URL-facing pageSlug (e.g. "trift-bridge-from-zurich") — authors
  // can pass whichever they remember.
  const story = await client.fetch(
    `*[_type == "story" && (slug.current == $slug || guide.pageSlug == $slug)][0]{_id, title, "slug": slug.current, "pageSlug": guide.pageSlug}`,
    { slug: slugArg },
  );
  if (!story) {
    exit(
      `No story found with slug or pageSlug "${slugArg}". The story must ` +
        `already be published — this script doesn't create new stories. ` +
        `Use npm run publish for that.`,
    );
  }
  console.log(`  story:      ${story._id} (${story.title})`);
  if (story.slug !== slugArg && story.pageSlug !== slugArg) {
    // Shouldn't happen — but be loud if the GROQ filter ever drifts.
    exit(`Slug mismatch: looked up "${slugArg}", got slug=${story.slug}, pageSlug=${story.pageSlug}`);
  }

  if (VERBOSE) {
    console.log("\n  links to upsert:");
    for (const entry of used.values()) {
      console.log(`    /go/${entry.slug.padEnd(35)} → ${entry.program} (${entry.category})`);
    }
  }

  if (DRY_RUN) {
    console.log("\nDry run complete. Re-run without --dry-run to push.\n");
    return;
  }

  // Upsert affiliate docs
  const affTx = client.transaction();
  for (const entry of used.values()) {
    affTx.createOrReplace(buildAffiliateDoc(entry));
  }
  await affTx.commit();
  console.log(`  ✓ Upserted ${used.size} affiliateLink doc(s)`);

  // Patch the story — set ONLY the affiliateLinks field
  const refs = [...used.values()].map((e) => ({
    _type: "reference",
    _key: randomKey(),
    _ref: sanitizeId(`affiliateLink-${e.slug}`),
  }));
  await client.patch(story._id).set({ affiliateLinks: refs }).commit();
  console.log(`  ✓ Patched ${story._id}.affiliateLinks (${refs.length} refs)`);

  // PDF cheat sheet
  const cheatPath = await writePdfCheatSheet(used);
  if (cheatPath) {
    console.log(`  ✓ PDF cheat sheet: ${path.relative(REPO_ROOT, cheatPath)}`);
  }

  console.log(`\n✓ Done.`);
  console.log(`  Live page: https://testedroutes.com/guides/${slugArg}/links`);
  console.log(`  Studio:    https://testedroutes.vercel.app/studio/desk/story;${story._id}\n`);
  console.log("Live site updates in ~30s via the Sanity → Vercel webhook.\n");
}

main().catch((err) => {
  console.error("\n✖ Patch failed:");
  console.error(err.message || err);
  process.exit(1);
});

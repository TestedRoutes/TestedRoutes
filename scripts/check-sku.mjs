#!/usr/bin/env node
/**
 * Report drift between each sku.yaml and the structured content live in
 * Postgres — the sibling of check-guides.mjs, for the paid layer.
 *
 * Like its sibling, it deliberately shells out to publish-sku.mjs --json
 * rather than rebuilding the canonical object itself: a checker that
 * re-implements the thing it checks can disagree with it.
 *
 *   npm run check:sku
 *   npm run check:sku -- --slug fiji-honeymoon-14-days
 *   npm run check:sku -- --verbose
 *
 * Exit code is 1 if anything differs. Drift is not automatically a defect —
 * a sku.yaml you have edited but not yet published shows up here, which is
 * the point. It means "these two disagree, know why".
 */
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const COUNTRIES = path.join(REPO, "content", "countries");

const argv = process.argv.slice(2);
const only = argv.includes("--slug") ? argv[argv.indexOf("--slug") + 1] : null;
const verbose = argv.includes("--verbose");

const { loadSku } = await import(new URL("../db/loadSku.js", import.meta.url));

/**
 * contentVersion is DB-side state, not authored content; photoRef on places
 * is owned by the per-place photo pass, another tool entirely — comparing
 * either against the yaml would be perpetual false drift.
 */
function scrub(node) {
  if (Array.isArray(node)) return node.map(scrub);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "contentVersion" || k === "photoRef") continue;
      out[k] = scrub(v);
    }
    return out;
  }
  return node;
}

/** Key order carries no meaning; array order does. (Same as check-guides.) */
function diff(a, b, at = "") {
  const out = [];
  const bothObjects = a && b && typeof a === "object" && typeof b === "object";
  if (!bothObjects) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      out.push(`${at || "<root>"}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
    }
    return out;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return [`${at}: array/object mismatch`];
  if (Array.isArray(a)) {
    if (a.length !== b.length) out.push(`${at}: length ${a.length} -> ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) out.push(...diff(a[i], b[i], `${at}[${i}]`));
    return out;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = at ? `${at}.${k}` : k;
    if (!(k in a)) out.push(`${p}: only in yaml (${JSON.stringify(b[k])?.slice(0, 90)})`);
    else if (!(k in b)) out.push(`${p}: only in DB (${JSON.stringify(a[k])?.slice(0, 90)})`);
    else out.push(...diff(a[k], b[k], p));
  }
  return out;
}

const slugs = [];
for (const country of readdirSync(COUNTRIES)) {
  const guidesDir = path.join(COUNTRIES, country, "guides");
  if (!existsSync(guidesDir)) continue;
  for (const slug of readdirSync(guidesDir)) {
    if (existsSync(path.join(guidesDir, slug, "sku.yaml"))) slugs.push(slug);
  }
}
const targets = slugs.filter((s) => !only || s === only);
if (!targets.length) {
  console.error(only ? `No sku.yaml for "${only}".` : "No sku.yaml files found.");
  process.exit(1);
}

let drifted = 0;
let missing = 0;
const width = Math.max(...targets.map((s) => s.length));

for (const slug of targets) {
  let built;
  try {
    built = JSON.parse(
      execFileSync(
        "node",
        ["--env-file=.env.local", "scripts/publish-sku.mjs", "--slug", slug, "--json"],
        { cwd: REPO, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] },
      ),
    );
  } catch (err) {
    const detail = String(err.stderr || err.message).trim().split("\n").filter(Boolean).pop();
    console.log(`${slug.padEnd(width)}  BUILD FAILED    ${detail}`);
    drifted++;
    continue;
  }

  const live = await loadSku(slug);
  if (!live) {
    console.log(`${slug.padEnd(width)}  NOT PUBLISHED   no guide_sku row for this slug`);
    missing++;
    continue;
  }

  const differences = diff(scrub(live), scrub(built));
  if (!differences.length) {
    if (verbose) console.log(`${slug.padEnd(width)}  matches (v${live.contentVersion})`);
    continue;
  }
  drifted++;
  console.log(`${slug.padEnd(width)}  DRIFT (${differences.length})`);
  for (const d of differences.slice(0, verbose ? differences.length : 6)) console.log(`    ${d}`);
  if (!verbose && differences.length > 6) {
    console.log(`    ... ${differences.length - 6} more (--verbose for all)`);
  }
}

console.log(
  `\n${targets.length - drifted - missing}/${targets.length} sku.yaml files match the database` +
    (missing ? `, ${missing} not published yet` : "") +
    (drifted ? `, ${drifted} drifted` : ""),
);
if (drifted) {
  console.log(
    "\nDrift means the yaml and the database disagree. If you edited the yaml, publish it:\n" +
      "  npm run publish:sku -- --slug <slug> --dry-run\n" +
      "If you did not, someone wrote to the database directly and the yaml needs to catch up.",
  );
  process.exit(1);
}

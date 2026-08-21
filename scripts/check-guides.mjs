#!/usr/bin/env node
/**
 * Report drift between each guide data module and the document live in Sanity.
 *
 * This exists because of how the thirteen per-guide publish scripts died. They
 * were correct on the day they ran and then the site moved on without them:
 * titles synced to the Content Plan, meta descriptions re-cut, prices raised
 * from 9 to 15. Nothing said so. The scripts sat there looking authoritative,
 * and re-running one would have reverted every correction. The data modules
 * that replaced them can rot exactly the same way, and this is the thing that
 * notices.
 *
 * It deliberately shells out to publish-guide.mjs --json rather than rebuilding
 * the document itself. A checker that re-implements the thing it checks can
 * disagree with it, which would be a particularly silly way to fail here.
 *
 *   npm run check:guides
 *   npm run check:guides -- --slug kuwait-2-days
 *   npm run check:guides -- --verbose
 *
 * Exit code is 1 if anything differs. Drift is not automatically a defect - a
 * module you have edited but not yet published will show up here, which is the
 * point. It means "these two disagree, know why".
 */
import { createClient } from "next-sanity";
import { readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

const argv = process.argv.slice(2);
const only = argv.includes("--slug") ? argv[argv.indexOf("--slug") + 1] : null;
const verbose = argv.includes("--verbose");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/**
 * Fields that cannot meaningfully match, and why:
 *   _rev/_createdAt/_updatedAt  Sanity system fields, not authored anywhere
 *   asset._ref                  a dry run emits DRY- placeholders by design
 */
function scrub(node) {
  if (Array.isArray(node)) return node.map(scrub);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "_rev" || k === "_createdAt" || k === "_updatedAt") continue;
      if (k === "_ref" && typeof v === "string" && /^(image|file|DRY)-/.test(v)) {
        out[k] = "<asset>";
        continue;
      }
      out[k] = scrub(v);
    }
    return out;
  }
  return node;
}

/** Track lines are thousands of floats; compare shape, not text. */
function normaliseTrackLine(doc) {
  if (typeof doc?.trackLine === "string") {
    try {
      doc.trackLine = `<${JSON.parse(doc.trackLine).length} points>`;
    } catch {
      doc.trackLine = "<unparseable>";
    }
  }
  return doc;
}

/** Key order carries no meaning to Sanity; array order does. */
function diff(a, b, at = "") {
  const out = [];
  const bothObjects = a && b && typeof a === "object" && typeof b === "object";
  if (!bothObjects) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      out.push(`${at || "<root>"}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
    }
    return out;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return [`${at}: array/object mismatch`];
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) out.push(`${at}: length ${a.length} -> ${b.length}`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) out.push(...diff(a[i], b[i], `${at}[${i}]`));
    return out;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const p = at ? `${at}.${k}` : k;
    if (!(k in a)) out.push(`${p}: only in module (${JSON.stringify(b[k]).slice(0, 90)})`);
    else if (!(k in b)) out.push(`${p}: only in Sanity (${JSON.stringify(a[k]).slice(0, 90)})`);
    else out.push(...diff(a[k], b[k], p));
  }
  return out;
}

const slugs = readdirSync(path.join(HERE, "guides"))
  .filter((f) => f.endsWith(".mjs") && !f.startsWith("_"))
  .map((f) => f.replace(/\.mjs$/, ""))
  .filter((s) => !only || s === only);

if (!slugs.length) {
  console.error(only ? `No data module for "${only}".` : "No guide data modules found.");
  process.exit(1);
}

let drifted = 0;
let missing = 0;
const width = Math.max(...slugs.map((s) => s.length));

for (const slug of slugs) {
  const { default: guide } = await import(pathToFileURL(path.join(HERE, "guides", `${slug}.mjs`)).href);

  const live = await client.fetch(`*[_id == $id][0]`, { id: guide.docId });
  if (!live) {
    console.log(`${slug.padEnd(width)}  NOT PUBLISHED   ${guide.docId} is not in Sanity`);
    missing++;
    continue;
  }

  let built;
  try {
    built = JSON.parse(
      execFileSync("node", ["--env-file=.env.local", "scripts/publish-guide.mjs", "--slug", slug, "--json"], {
        cwd: REPO,
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      }),
    );
  } catch (err) {
    const detail = String(err.stderr || err.message).trim().split("\n").filter(Boolean).pop();
    console.log(`${slug.padEnd(width)}  BUILD FAILED    ${detail}`);
    drifted++;
    continue;
  }

  const differences = diff(normaliseTrackLine(scrub(live)), normaliseTrackLine(scrub(built)));
  if (!differences.length) {
    if (verbose) console.log(`${slug.padEnd(width)}  matches`);
    continue;
  }

  drifted++;
  console.log(`${slug.padEnd(width)}  DRIFT (${differences.length})`);
  for (const d of differences.slice(0, verbose ? differences.length : 6)) {
    console.log(`    ${d}`);
  }
  if (!verbose && differences.length > 6) {
    console.log(`    ... ${differences.length - 6} more (--verbose for all)`);
  }
}

const checked = slugs.length;
console.log(
  `\n${checked - drifted - missing}/${checked} modules match Sanity` +
    (missing ? `, ${missing} not published yet` : "") +
    (drifted ? `, ${drifted} drifted` : ""),
);

if (drifted) {
  console.log(
    "\nDrift means the module and the site disagree. If you edited the module, publish it:\n" +
      "  npm run publish:guide -- --slug <slug> --dry-run\n" +
      "If you did not, someone changed the document in the Studio and the module needs to catch up.",
  );
  process.exit(1);
}

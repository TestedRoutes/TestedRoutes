/**
 * Create the Wave 1 destination documents (Ghana, Togo, Benin).
 *
 * WHY THIS RUNS BEFORE ANY PUBLISH, and not as a side effect of one:
 *
 * publish-to-sanity.mjs resolves a story's destination with
 * `createIfNotExists`, which means the FIRST write is the only write that doc
 * will ever get from the pipeline. It builds the doc from the meta yaml's
 * `destination:` string, and the meta scaffold writes the continent in title
 * case ("Africa"). The schema's enum is lowercase ("africa"), and every one of
 * the 35 live destination docs is lowercase. Guinea's had to be patched by hand
 * after the fact for exactly this reason.
 *
 * So: create them here, correctly, once. After this the publisher's
 * createIfNotExists is a no-op and can no longer get it wrong.
 *
 * Shape copied verbatim from the live Guinea doc (destination-guinea), which is
 * the closest precedent - same rally, same region, stories-first, no SKU.
 *
 * Idempotent. Safe to re-run. Does not touch the 35 existing docs.
 *
 *   node --env-file=.env.local scripts/create-westafrica-destinations.mjs --dry-run
 *   node --env-file=.env.local scripts/create-westafrica-destinations.mjs
 */
import { createClient } from "@sanity/client";

const DRY = process.argv.includes("--dry-run");

const DOCS = [
  { _id: "destination-ghana", name: "Ghana", country: "Ghana", slugCurrent: "ghana", countryCode: "GH" },
  { _id: "destination-togo", name: "Togo", country: "Togo", slugCurrent: "togo", countryCode: "TG" },
  { _id: "destination-benin", name: "Benin", country: "Benin", slugCurrent: "benin", countryCode: "BJ" },
];

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY) {
  console.error("\n  SANITY_API_WRITE_TOKEN missing - run with node --env-file=.env.local\n");
  process.exit(1);
}

const client = createClient({
  projectId: "y3gc8dx6",
  dataset: "production",
  apiVersion: "2023-05-03",
  token,
  useCdn: false,
});

const existing = await client.fetch(
  `*[_type=="destination" && slug.current in $s]{_id,"slug":slug.current,continent}`,
  { s: DOCS.map((d) => d.slugCurrent) },
);
const have = new Set(existing.map((d) => d.slug));

console.log(`\n${DRY ? "DRY RUN - " : ""}Wave 1 destination docs\n`);
for (const d of existing) {
  console.log(`  already present: ${d.slug}  (continent: ${d.continent})`);
}

const todo = DOCS.filter((d) => !have.has(d.slugCurrent));
if (!todo.length) {
  console.log("  nothing to create - all three exist\n");
  process.exit(0);
}

for (const d of todo) {
  const doc = {
    _id: d._id,
    _type: "destination",
    name: d.name,
    country: d.country,
    // lowercase, matching the schema enum and all 35 live docs. This is the
    // whole point of the script - see the header.
    continent: "africa",
    countryCode: d.countryCode,
    slug: { _type: "slug", current: d.slugCurrent },
  };
  if (DRY) {
    console.log(`  would create: ${d._id}`, JSON.stringify(doc));
    continue;
  }
  await client.createIfNotExists(doc);
  console.log(`  created: ${d._id}  (${d.name}, africa, ${d.countryCode})`);
}

if (!DRY) {
  const after = await client.fetch(
    `*[_type=="destination" && slug.current in $s]{"slug":slug.current,continent,country,countryCode}|order(slug)`,
    { s: DOCS.map((d) => d.slugCurrent) },
  );
  console.log("\n  verify:");
  for (const d of after) {
    const ok = d.continent === "africa" ? "OK " : "BAD";
    console.log(`    ${ok} ${d.slug}  continent=${d.continent}  country=${d.country}  code=${d.countryCode}`);
  }
}
console.log("");

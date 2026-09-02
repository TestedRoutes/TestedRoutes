#!/usr/bin/env node
/**
 * Publish one SKU's structured content (sku.yaml + places.yaml) to the private
 * Postgres store — the sibling of publish-guide.mjs, for the paid layer.
 *
 * The repo YAML is the authoring truth; the database is a derived render of
 * it. Every publish rebuilds the SKU's rows wholesale inside one transaction:
 * child rows have no identity of their own, so replace-inside-txn beats
 * diffing. The one stateful thing is content_version — it bumps ONLY when the
 * canonical content hash actually changes, because the version is the app's
 * cache/update signal and an idempotent republish must not churn it.
 *
 * After a real publish the story's guide.contentVersion in Sanity is patched
 * to match, so the public layer can say "updated" and the PDF-staleness check
 * (guide.pdfRenderedFrom vs contentVersion) has something to compare against.
 *
 * Usage:
 *   node --env-file=.env.local scripts/publish-sku.mjs --slug fiji-honeymoon-14-days --dry-run
 *   node --env-file=.env.local scripts/publish-sku.mjs --slug fiji-honeymoon-14-days
 *
 * Flags:
 *   --slug <slug>  required; selects content/countries/<c>/guides/<slug>/sku.yaml
 *   --dry-run      build and validate, touch nothing
 *   --json         print the canonical object as JSON and nothing else
 *                  (parity checks; implies --dry-run)
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const COUNTRIES = path.join(REPO, "content", "countries");

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const args = { slug: null, dryRun: false, json: false };
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--slug") args.slug = argv[++i];
  else if (argv[i] === "--dry-run") args.dryRun = true;
  else if (argv[i] === "--json") args.json = args.dryRun = true;
  else {
    console.error(`Unknown argument: ${argv[i]}`);
    process.exit(1);
  }
}
if (!args.slug) {
  console.error("Usage: publish-sku.mjs --slug <slug> [--dry-run|--json]");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Locate and load the YAML pair
// ---------------------------------------------------------------------------
function findSkuFile(slug) {
  for (const country of readdirSync(COUNTRIES)) {
    const p = path.join(COUNTRIES, country, "guides", slug, "sku.yaml");
    if (existsSync(p)) return { skuPath: p, countryDir: path.join(COUNTRIES, country) };
  }
  return null;
}

const located = findSkuFile(args.slug);
if (!located) {
  console.error(`No sku.yaml found for "${args.slug}" under content/countries/*/guides/.`);
  process.exit(1);
}
const sku = yaml.load(readFileSync(located.skuPath, "utf8"));
const placesPath = path.join(located.countryDir, "places.yaml");
if (!existsSync(placesPath)) {
  console.error(`Missing ${path.relative(REPO, placesPath)} — run npm run import:master first.`);
  process.exit(1);
}
const pool = yaml.load(readFileSync(placesPath, "utf8"));

// The workbook keys per-SKU columns "1D"/"7D"/"10D"/"14D"; sku_code ends in
// the same token ("fiji-14d" -> "14D").
const skuKey = sku.sku_code.split("-").pop().toUpperCase();

// ---------------------------------------------------------------------------
// Build the canonical object — the single shape the DB is compared against.
// db/loadSku.js reconstructs exactly this from the tables; check-sku.mjs
// diffs the two. Array order is meaning; DB ids and timestamps never appear.
// ---------------------------------------------------------------------------
const problems = [];
const warnings = [];

const poolByPin = new Map(pool.places.map((p) => [p.pin_id, p]));

function checkPin(pinId, where) {
  if (pinId && !poolByPin.has(pinId)) problems.push(`${where}: unknown pin "${pinId}"`);
  return pinId ?? null;
}

const days = (sku.days ?? []).map((d, di) => {
  const slots = (d.slots ?? []).map((s, si) => ({
    timeLabel: s.time ?? null,
    title: s.title,
    body: s.body ?? null,
    pinId: checkPin(s.place, `day ${d.day_from} slot ${si + 1}`),
    goSlug: s.go ?? null,
    dayNumber: s.day ?? null,
  }));
  if (slots.length !== 7) {
    warnings.push(`day page ${di + 1} has ${slots.length} slots (deck convention is 7)`);
  }
  return {
    dayFrom: d.day_from,
    dayTo: d.day_to,
    pageGroup: d.page_group,
    title: d.title,
    subtitle: d.subtitle ?? null,
    badge: d.badge ?? null,
    railStart: d.rail_start ?? null,
    railEnd: d.rail_end ?? null,
    photoRef: d.photo_ref ?? null,
    photoCaption: d.photo_caption ?? null,
    slots,
    callouts: (d.callouts ?? []).map((c) => ({
      kind: c.kind ?? "info",
      title: c.title,
      body: Array.isArray(c.body) ? c.body : [c.body],
    })),
  };
});

const covered = new Set();
for (const d of days) for (let n = d.dayFrom; n <= d.dayTo; n++) covered.add(n);
for (let n = 1; n <= sku.duration_days; n++) {
  if (!covered.has(n)) problems.push(`day ${n} is not covered by any day page`);
}

const joins = [];
for (const p of pool.places) {
  const entry = p.skus?.[skuKey];
  if (!entry) continue;
  joins.push({
    pinId: p.pin_id,
    role: entry.role,
    dayNumber: entry.day ?? null,
    orderInDay: entry.order ?? null,
  });
}
if (!joins.length) {
  problems.push(`places.yaml has no entries for SKU key "${skuKey}"`);
}
// Join rows carry their itinerary meaning in day/order fields; the array
// itself is canonically sorted by pinId so the DB round-trip compares clean.
joins.sort((a, b) => (a.pinId < b.pinId ? -1 : 1));

const canonical = {
  sku: {
    slug: sku.slug,
    country: sku.country,
    skuCode: sku.sku_code,
    structureType: sku.structure_type,
    durationDays: sku.duration_days,
    sampleDay: sku.sample_day ?? null,
    status: sku.status ?? "draft",
    title: sku.title,
    subtitle: sku.subtitle ?? null,
  },
  days,
  skuPlaces: joins,
  stayPicks: (sku.stay_picks ?? []).map((p) => ({
    blockHeading: p.block_heading,
    tier: p.tier,
    tierLabel: p.tier_label ?? null,
    name: p.name,
    pinId: checkPin(p.place, `stay pick ${p.name}`),
    body: p.body ?? null,
    goSlug: p.go ?? null,
  })),
  foodPicks: (sku.food_picks ?? []).map((p) => ({
    area: p.area ?? null,
    tierLabel: p.tier_label ?? null,
    name: p.name,
    body: p.body ?? null,
    pinId: checkPin(p.place, `food pick ${p.name}`),
    goSlug: p.go ?? null,
  })),
  costItems: (sku.cost_items ?? []).map((c) => ({
    section: c.section,
    tier: c.tier ?? null,
    label: c.label,
    priceLabel: c.price_label ?? null,
    amountLow: c.amount_low ?? null,
    amountHigh: c.amount_high ?? null,
    currency: c.currency ?? null,
    per: c.per ?? null,
    note: c.note ?? null,
  })),
  reservationRules: (sku.reservation_rules ?? []).map((r) => ({
    group: r.group ?? null,
    label: r.label,
    leadTimeDays: r.lead_time_days ?? null,
    leadTimeLabel: r.lead_time_label ?? null,
    criticality: r.criticality ?? "should",
    pinId: checkPin(r.place, `reservation ${r.label}`),
    goSlug: r.go ?? null,
    note: r.note ?? null,
  })),
  packItems: (sku.pack_items ?? []).map((p) => ({
    group: p.group ?? null,
    label: p.label,
    note: p.note ?? null,
  })),
  activityRows: (sku.activity_rows ?? []).map((a) => ({
    name: a.name,
    priceLabel: a.price_label ?? null,
    note: a.note ?? null,
    pinId: checkPin(a.place, `activity ${a.name}`),
    goSlug: a.go ?? null,
  })),
  sections: (sku.sections ?? []).map((s) => ({
    type: s.type,
    payload: s.payload,
    photoRefs: s.photo_refs ?? null,
  })),
};

// Places referenced by this SKU (joins or content links) are part of what the
// buyer sees, so they participate in the hash; the rest of the country pool
// does not — an unrelated SKU's pin edit must not bump this SKU's version.
const referencedPins = new Set(joins.map((j) => j.pinId));
for (const group of [canonical.days.flatMap((d) => d.slots), canonical.stayPicks,
  canonical.foodPicks, canonical.reservationRules, canonical.activityRows]) {
  for (const item of group) if (item.pinId) referencedPins.add(item.pinId);
}
canonical.places = [...referencedPins].sort().map((pin) => {
  const p = poolByPin.get(pin);
  return {
    pinId: p.pin_id,
    name: p.name,
    type: p.type ?? null,
    region: p.region ?? null,
    tier: p.tier ?? null,
    description: p.description ?? null,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    mapUrl: p.map_url ?? null,
    category: p.category ?? null,
    goSlug: p.go_slug ?? null,
  };
});

// ---------------------------------------------------------------------------
// Report / emit
// ---------------------------------------------------------------------------
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  }
  return value;
}
const contentHash = createHash("sha256").update(JSON.stringify(stable(canonical))).digest("hex");

if (args.json) {
  process.stdout.write(JSON.stringify(canonical));
  process.exit(problems.length ? 1 : 0);
}

for (const w of warnings) console.log(`  warn: ${w}`);
if (problems.length) {
  console.error(`\n${args.slug} failed validation:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const summary =
  `${args.slug}: ${days.length} day pages, ` +
  `${days.reduce((n, d) => n + d.slots.length, 0)} slots, ${joins.length} place joins, ` +
  `${canonical.stayPicks.length} stays, ${canonical.foodPicks.length} food, ` +
  `${canonical.costItems.length} costs, ${canonical.reservationRules.length} reservations, ` +
  `${canonical.sections.length} sections (hash ${contentHash.slice(0, 12)})`;

if (args.dryRun) {
  console.log(`${summary}\n(dry run: nothing written)`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Write. Scripts use the WebSocket driver, not neon-http: neon-http cannot do
// interactive transactions, and this rebuild must be all-or-nothing.
// ---------------------------------------------------------------------------
const { Pool } = await import("@neondatabase/serverless");
const { drizzle } = await import("drizzle-orm/neon-serverless");
const { eq, and, inArray } = await import("drizzle-orm");
const t = await import(new URL("../db/schema.js", import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not configured (provision Neon and add it to .env.local).");
  process.exit(1);
}
const dbPool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(dbPool);

let version;
await db.transaction(async (tx) => {
  // 1. Upsert the whole country pool (not just referenced pins) — places.yaml
  //    is one file; keeping the DB pool complete means the other SKUs' publishes
  //    see their pins already present.
  for (const p of pool.places) {
    await tx
      .insert(t.place)
      .values({
        country: pool.country,
        pinId: p.pin_id,
        name: p.name,
        type: p.type ?? null,
        region: p.region ?? null,
        tier: p.tier ?? null,
        description: p.description ?? null,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
        mapUrl: p.map_url ?? null,
        category: p.category ?? null,
        bookingUrl: p.booking_url ?? null,
        goSlug: p.go_slug ?? null,
        internalNotes: p.internal_notes ?? null,
        attributes: p.attributes ?? null,
      })
      .onConflictDoUpdate({
        target: [t.place.country, t.place.pinId],
        set: {
          name: p.name,
          type: p.type ?? null,
          region: p.region ?? null,
          tier: p.tier ?? null,
          description: p.description ?? null,
          lat: p.lat ?? null,
          lng: p.lng ?? null,
          mapUrl: p.map_url ?? null,
          category: p.category ?? null,
          bookingUrl: p.booking_url ?? null,
          goSlug: p.go_slug ?? null,
          internalNotes: p.internal_notes ?? null,
          attributes: p.attributes ?? null,
        },
      });
  }
  const placeRows = await tx
    .select({ id: t.place.id, pinId: t.place.pinId })
    .from(t.place)
    .where(eq(t.place.country, pool.country));
  const placeId = new Map(placeRows.map((r) => [r.pinId, r.id]));
  const pid = (pin) => (pin ? placeId.get(pin) ?? null : null);

  // 2. Upsert the SKU row; version bumps only on a real content change.
  const [existing] = await tx.select().from(t.guideSku).where(eq(t.guideSku.slug, canonical.sku.slug));
  version = existing
    ? existing.contentHash === contentHash
      ? existing.contentVersion
      : existing.contentVersion + 1
    : 1;
  const skuValues = {
    ...canonical.sku,
    contentVersion: version,
    contentHash,
    updatedAt: new Date(),
  };
  let skuId;
  if (existing) {
    await tx.update(t.guideSku).set(skuValues).where(eq(t.guideSku.id, existing.id));
    skuId = existing.id;
  } else {
    const [row] = await tx.insert(t.guideSku).values(skuValues).returning({ id: t.guideSku.id });
    skuId = row.id;
  }

  // 3. Wholesale replace all child rows.
  const oldDays = await tx.select({ id: t.day.id }).from(t.day).where(eq(t.day.skuId, skuId));
  const oldSections = await tx
    .select({ id: t.guideSection.id })
    .from(t.guideSection)
    .where(eq(t.guideSection.skuId, skuId));
  if (oldDays.length) {
    await tx.delete(t.callout).where(
      and(eq(t.callout.ownerType, "day"), inArray(t.callout.ownerId, oldDays.map((d) => d.id))),
    );
  }
  if (oldSections.length) {
    await tx.delete(t.callout).where(
      and(eq(t.callout.ownerType, "section"), inArray(t.callout.ownerId, oldSections.map((s) => s.id))),
    );
  }
  await tx.delete(t.day).where(eq(t.day.skuId, skuId)); // cascades timeline_slot
  for (const table of [t.skuPlace, t.stayPick, t.foodPick, t.costItem,
    t.reservationRule, t.packItem, t.activityRow, t.guideSection]) {
    await tx.delete(table).where(eq(table.skuId, skuId));
  }

  for (const d of canonical.days) {
    const [dayRow] = await tx
      .insert(t.day)
      .values({
        skuId,
        dayFrom: d.dayFrom,
        dayTo: d.dayTo,
        pageGroup: d.pageGroup,
        title: d.title,
        subtitle: d.subtitle,
        badge: d.badge,
        railStart: d.railStart,
        railEnd: d.railEnd,
        photoRef: d.photoRef,
        photoCaption: d.photoCaption,
      })
      .returning({ id: t.day.id });
    if (d.slots.length) {
      await tx.insert(t.timelineSlot).values(d.slots.map((s, i) => ({
        dayId: dayRow.id,
        sort: i,
        timeLabel: s.timeLabel,
        title: s.title,
        body: s.body,
        placeId: pid(s.pinId),
        goSlug: s.goSlug,
        dayNumber: s.dayNumber,
      })));
    }
    if (d.callouts.length) {
      await tx.insert(t.callout).values(d.callouts.map((c, i) => ({
        ownerType: "day",
        ownerId: dayRow.id,
        sort: i,
        kind: c.kind,
        title: c.title,
        body: c.body,
      })));
    }
  }

  if (canonical.skuPlaces.length) {
    await tx.insert(t.skuPlace).values(canonical.skuPlaces.map((j) => ({
      skuId,
      placeId: placeId.get(j.pinId),
      role: j.role,
      dayNumber: j.dayNumber,
      orderInDay: j.orderInDay,
    })));
  }
  if (canonical.stayPicks.length) {
    await tx.insert(t.stayPick).values(canonical.stayPicks.map((p, i) => ({
      skuId, sort: i, blockHeading: p.blockHeading, tier: p.tier, tierLabel: p.tierLabel,
      name: p.name, placeId: pid(p.pinId), body: p.body, goSlug: p.goSlug,
    })));
  }
  if (canonical.foodPicks.length) {
    await tx.insert(t.foodPick).values(canonical.foodPicks.map((p, i) => ({
      skuId, sort: i, area: p.area, tierLabel: p.tierLabel, name: p.name,
      body: p.body, placeId: pid(p.pinId), goSlug: p.goSlug,
    })));
  }
  if (canonical.costItems.length) {
    await tx.insert(t.costItem).values(canonical.costItems.map((c, i) => ({
      skuId, sort: i, section: c.section, tier: c.tier, label: c.label,
      priceLabel: c.priceLabel, amountLow: c.amountLow, amountHigh: c.amountHigh,
      currency: c.currency, per: c.per, note: c.note,
    })));
  }
  if (canonical.reservationRules.length) {
    await tx.insert(t.reservationRule).values(canonical.reservationRules.map((r, i) => ({
      skuId, sort: i, group: r.group, label: r.label, leadTimeDays: r.leadTimeDays,
      leadTimeLabel: r.leadTimeLabel, criticality: r.criticality,
      placeId: pid(r.pinId), goSlug: r.goSlug, note: r.note,
    })));
  }
  if (canonical.packItems.length) {
    await tx.insert(t.packItem).values(canonical.packItems.map((p, i) => ({
      skuId, sort: i, group: p.group, label: p.label, note: p.note,
    })));
  }
  if (canonical.activityRows.length) {
    await tx.insert(t.activityRow).values(canonical.activityRows.map((a, i) => ({
      skuId, sort: i, name: a.name, priceLabel: a.priceLabel, note: a.note,
      placeId: pid(a.pinId), goSlug: a.goSlug,
    })));
  }
  if (canonical.sections.length) {
    await tx.insert(t.guideSection).values(canonical.sections.map((s, i) => ({
      skuId, type: s.type, sort: i, payload: s.payload, photoRefs: s.photoRefs,
    })));
  }
});
await dbPool.end();

console.log(`${summary}\npublished: content_version ${version}`);

// Mirror the version onto the public story so "updated" surfaces and the
// PDF-staleness comparison have something to read. Failure here is a warning,
// not a rollback — the DB is the source of truth for the reader.
try {
  const { createClient } = await import("next-sanity");
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });
  const storyId = `story-${canonical.sku.slug}`;
  const live = await client.fetch(`*[_id == $id][0]._id`, { id: storyId });
  if (live) {
    await client.patch(storyId).set({ "guide.contentVersion": version }).commit();
    console.log(`Sanity ${storyId}: guide.contentVersion = ${version}`);
  } else {
    console.log(`note: no Sanity story ${storyId}; skipped contentVersion mirror`);
  }
} catch (err) {
  console.warn(`warn: could not mirror contentVersion to Sanity: ${err.message}`);
}

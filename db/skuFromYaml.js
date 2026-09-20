/**
 * The YAML side of the structured-content contract: locate a SKU's
 * sku.yaml + its country's places.yaml, and build the canonical object from
 * them. This is the one builder — publish-sku.mjs writes what it returns to
 * Postgres, db/loadSku.js reconstructs the same shape from the tables, and
 * check-sku.mjs diffs the two. It used to live inline in the publisher; it
 * moved here so the gated reader can render straight from the repo YAML
 * without a database in the loop (the prototype path, 2026-09-20), and so
 * there is exactly one definition of "canonical" for the publisher, the
 * loader's parity target and the reader to share.
 *
 * Nothing here touches the network or the database. `node:fs` and js-yaml
 * only — it runs in a script and in a Next.js server component alike.
 *
 * Shape rules, which the loader mirrors and the checker enforces:
 *   - Array order is meaning (slots, callouts, picks); skuPlaces is the one
 *     exception, canonically sorted by pinId so the DB round-trip compares
 *     clean regardless of insert order.
 *   - DB ids and timestamps never appear. contentVersion is DB-side state
 *     and is not part of the object; the content hash is, as a separate
 *     return value, because the publisher's version-bump decision keys on it.
 *   - place.internal_notes and place.booking_url are never copied into
 *     canonical.places: this shape is what readers serialise, and those two
 *     fields stay server-side ("never exported"; partner URLs render only as
 *     /go/ aliases).
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

/** content/countries relative to the repo root, wherever the caller runs. */
export function countriesDir(repoRoot = process.cwd()) {
  return path.join(repoRoot, "content", "countries");
}

/**
 * Find <countries>/<country>/guides/<slug>/sku.yaml. Returns null when no
 * country directory holds the slug.
 */
export function locateSku(slug, { repoRoot } = {}) {
  const root = countriesDir(repoRoot);
  if (!existsSync(root)) return null;
  for (const country of readdirSync(root)) {
    const skuPath = path.join(root, country, "guides", slug, "sku.yaml");
    if (existsSync(skuPath)) {
      return { skuPath, countryDir: path.join(root, country) };
    }
  }
  return null;
}

/**
 * Read the YAML pair for a slug. Throws with a message naming the missing
 * file, because both callers (publisher, reader) want to fail loudly rather
 * than render half a guide.
 */
export function readSkuYaml(slug, opts = {}) {
  const located = locateSku(slug, opts);
  if (!located) {
    throw new Error(`No sku.yaml found for "${slug}" under content/countries/*/guides/.`);
  }
  const placesPath = path.join(located.countryDir, "places.yaml");
  if (!existsSync(placesPath)) {
    throw new Error(`Missing ${placesPath} — run npm run import:master first.`);
  }
  return {
    ...located,
    placesPath,
    sku: yaml.load(readFileSync(located.skuPath, "utf8")),
    pool: yaml.load(readFileSync(placesPath, "utf8")),
  };
}

/** Sort keys recursively so the hash does not depend on authoring order. */
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  }
  return value;
}

/**
 * Build the canonical object from a parsed sku.yaml and its places pool.
 *
 * Returns { canonical, contentHash, problems, warnings }. `problems` are
 * contract violations (unknown pin, uncovered day, no joins for the SKU) —
 * the publisher refuses to write on any; `warnings` are conventions worth a
 * look (a day page without seven slots) and never block.
 */
export function buildCanonicalSku(sku, pool) {
  const problems = [];
  const warnings = [];

  // The workbook keys per-SKU columns "1D"/"7D"/"10D"/"14D"; sku_code ends in
  // the same token ("fiji-14d" -> "14D").
  const skuKey = sku.sku_code.split("-").pop().toUpperCase();

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
      // The practical facts a place card shows (access, time_needed,
      // cost_band, season, parking, road) — part of what the buyer sees, so
      // part of the hash. photoRef rides along for the reader but is scrubbed
      // by check-sku: the per-place photo pass owns it, not this file.
      attributes: p.attributes ?? null,
      photoRef: p.photo_ref ?? null,
    };
  });

  const contentHash = createHash("sha256").update(JSON.stringify(stable(canonical))).digest("hex");
  return { canonical, contentHash, problems, warnings };
}

/**
 * The reader's loader for the no-database path: the same canonical object
 * db/loadSku.js returns, built from the repo YAML, or null for an unknown
 * slug. Validation problems throw — a guide with an unknown pin must not
 * render with the pin silently dropped.
 *
 * contentVersion is null here on purpose: versions are minted by the
 * publisher on write, and this path never writes. The hash is exposed
 * instead so a caller can still key a cache on the content.
 */
export function loadSkuFromYaml(slug, opts = {}) {
  if (!locateSku(slug, opts)) return null;
  const { sku, pool } = readSkuYaml(slug, opts);
  const { canonical, contentHash, problems } = buildCanonicalSku(sku, pool);
  if (problems.length) {
    throw new Error(`${slug} failed validation:\n  - ${problems.join("\n  - ")}`);
  }
  return { ...canonical, contentVersion: null, contentHash };
}

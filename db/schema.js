/**
 * Drizzle schema for the private structured-guide store (Neon Postgres).
 *
 * Why this database exists at all: the Sanity dataset is publicly readable by
 * design (the whole site depends on token-free reads), so the moment the paid
 * guide becomes structured documents rather than an opaque PDF, those documents
 * cannot live there — they would be one anonymous GROQ query away. Everything
 * in this schema is paid content or its supporting joins; everything public
 * stays in Sanity. The repo YAML (content/countries/<c>/places.yaml and each
 * guide's sku.yaml) is the authoring truth; this DB is a derived render of it,
 * rebuilt wholesale by scripts/publish-sku.mjs. That is why we use
 * `drizzle-kit push` instead of migration files: with one developer and a
 * fully rebuildable database, migration history is ceremony.
 *
 * Two conventions that matter more than they look:
 * - `place.go_slug` stores the /go/<alias> string, never a resolved URL.
 *   Aliases are frozen once printed in a sold PDF; the destination behind them
 *   is re-pointable in Sanity without a deploy. Baking a resolved URL in here
 *   would quietly break that contract.
 * - `place.internal_notes` must never be serialised into any reader, bundle,
 *   or export. It mirrors the workbook column that is titled "never exported".
 */
import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  doublePrecision,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const skuStatus = pgEnum("sku_status", ["draft", "live", "retired"]);
export const calloutKind = pgEnum("callout_kind", ["info", "warning", "booking"]);
export const calloutOwner = pgEnum("callout_owner", ["day", "section"]);
// "service" is the workbook's fifth role: rows that belong to a SKU without
// map placement (airlines, car rental, visa info, map-QR pseudo-pins).
export const placeRole = pgEnum("place_role", ["route", "extra", "detour", "skip", "service"]);
export const stayTier = pgEnum("stay_tier", ["budget", "mid", "splurge"]);
export const costSection = pgEnum("cost_section", ["headline", "detail"]);
export const criticality = pgEnum("criticality", ["must", "should", "nice"]);
export const sectionType = pgEnum("section_type", [
  "snapshot",
  "route_overview",
  "islands",
  "getting_around",
  "when_to_go",
  "highlights",
  "paperwork",
  "essentials",
  "good_to_know",
  "beyond",
  "faq",
  "legal",
  // Page intros/footnotes for content whose rows live in typed tables: the
  // picks pages, the costs page's extras, the pack page's framing line.
  "stays",
  "food",
  "costs",
  "pack",
]);

export const guideSku = pgTable(
  "guide_sku",
  {
    id: serial("id").primaryKey(),
    // Matches the story's guide.pageSlug || slug.current — the join key to
    // Sanity is the slug, deliberately not a document id, so a story rename
    // handled the usual way (pageSlug preserving the old URL) keeps working.
    slug: text("slug").notNull(),
    country: text("country").notNull(), // ISO-ish lowercase, e.g. "fj"
    skuCode: text("sku_code").notNull(), // founder-facing, e.g. "fiji-14d"
    structureType: text("structure_type").notNull(), // week_guide | day_guide | weekend_hike
    durationDays: integer("duration_days").notNull(),
    // Bumped by publish-sku.mjs only when content_hash changes. The app's
    // cache/ETag key and the PDF-staleness reference (guide.pdfRenderedFrom
    // in Sanity is compared against this).
    contentVersion: integer("content_version").notNull().default(1),
    contentHash: text("content_hash"),
    // The one day the public /preview page may serve. Everything else in this
    // database is behind the purchase token.
    sampleDay: integer("sample_day"),
    status: skuStatus("status").notNull().default("draft"),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("guide_sku_slug_ux").on(t.slug)],
);

export const place = pgTable(
  "place",
  {
    id: serial("id").primaryKey(),
    country: text("country").notNull(),
    // The workbook's PinID — the stable ingest identity. Upserts key on
    // (country, pin_id) so re-importing the master never duplicates pins.
    pinId: text("pin_id").notNull(),
    name: text("name").notNull(),
    type: text("type"),
    region: text("region"),
    tier: text("tier"),
    description: text("description"),
    // Canonical -180..180. The site's >180 antimeridian convention (Fiji
    // longitudes past the dateline, for Leaflet bounds) is applied at export
    // when deriving routePoints, never stored here.
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    mapUrl: text("map_url"),
    category: text("category"),
    bookingUrl: text("booking_url"), // raw partner URL — internal only, go_slug is what renders
    goSlug: text("go_slug"),
    internalNotes: text("internal_notes"), // never serialised out — see file header
    // Practical facts with a controlled key set: road, parking, distance_from_car,
    // winter_access, time_needed, cost_band. Optional, filled opportunistically.
    attributes: jsonb("attributes"),
    // Per-place photo (private-Blob/web-reader key). Null until a photo pass
    // assigns one; the map renders photo pins where present and falls back to
    // numbered pins where not. This column is what makes "pictures per point"
    // a fill-in job instead of a schema migration.
    photoRef: text("photo_ref"),
  },
  (t) => [uniqueIndex("place_country_pin_ux").on(t.country, t.pinId)],
);

export const skuPlace = pgTable(
  "sku_place",
  {
    id: serial("id").primaryKey(),
    skuId: integer("sku_id")
      .notNull()
      .references(() => guideSku.id, { onDelete: "cascade" }),
    placeId: integer("place_id")
      .notNull()
      .references(() => place.id, { onDelete: "cascade" }),
    role: placeRole("role").notNull(),
    dayNumber: integer("day_number"),
    orderInDay: integer("order_in_day"),
  },
  (t) => [uniqueIndex("sku_place_ux").on(t.skuId, t.placeId)],
);

export const day = pgTable(
  "day",
  {
    id: serial("id").primaryKey(),
    skuId: integer("sku_id")
      .notNull()
      .references(() => guideSku.id, { onDelete: "cascade" }),
    dayFrom: integer("day_from").notNull(),
    dayTo: integer("day_to").notNull(), // == day_from except deck pages that cover two travel days
    // Days sharing one deck page share a page_group, so the Stage-2 PDF export
    // can reproduce the shipped deck's pagination exactly.
    pageGroup: integer("page_group").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    badge: text("badge"), // "DAY 1" / "DAYS 4-5"
    railStart: integer("rail_start"), // hour, e.g. 8
    railEnd: integer("rail_end"),
    photoRef: text("photo_ref"), // private-Blob key; null until photos are attached
    photoCaption: text("photo_caption"),
    // Derived at publish from the ordered route pins; null until derivation ships.
    distanceKm: doublePrecision("distance_km"),
    driveMin: integer("drive_min"),
    gmapsUrl: text("gmaps_url"),
  },
  (t) => [uniqueIndex("day_sku_from_ux").on(t.skuId, t.dayFrom)],
);

export const timelineSlot = pgTable(
  "timeline_slot",
  {
    id: serial("id").primaryKey(),
    dayId: integer("day_id")
      .notNull()
      .references(() => day.id, { onDelete: "cascade" }),
    sort: integer("sort").notNull(),
    timeLabel: text("time_label"), // "10:00" — label, not a timestamp; guides are year-round content
    title: text("title").notNull(),
    body: text("body"),
    placeId: integer("place_id").references(() => place.id),
    goSlug: text("go_slug"),
    // Only set when the parent day spans two days: each slot names its own day.
    dayNumber: integer("day_number"),
  },
  (t) => [uniqueIndex("slot_day_sort_ux").on(t.dayId, t.sort)],
);

export const callout = pgTable(
  "callout",
  {
    id: serial("id").primaryKey(),
    ownerType: calloutOwner("owner_type").notNull(),
    // Polymorphic (day.id or guide_section.id), so no FK by design; the
    // publisher deletes+reinserts all children in one transaction, which is
    // what keeps orphanhood impossible in practice.
    ownerId: integer("owner_id").notNull(),
    sort: integer("sort").notNull(),
    kind: calloutKind("kind").notNull().default("info"),
    title: text("title").notNull(),
    body: jsonb("body").notNull(), // array of paragraph strings
  },
  (t) => [index("callout_owner_ix").on(t.ownerType, t.ownerId)],
);

export const stayPick = pgTable("stay_pick", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  blockHeading: text("block_heading").notNull(), // the stop/area, e.g. "DENARAU"
  tier: stayTier("tier").notNull(),
  // The deck's own phrasing for the tier ("UNDER FJD 300") — kept per guide so
  // the reader and PDF can print exactly what the founder wrote.
  tierLabel: text("tier_label"),
  name: text("name").notNull(),
  placeId: integer("place_id").references(() => place.id),
  body: text("body"),
  goSlug: text("go_slug"),
});

export const foodPick = pgTable("food_pick", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  area: text("area"),
  // The deck's per-pick label ("Casual / takeaway", "Reserve ahead") — kept
  // verbatim, same reasoning as stay_pick.tier_label.
  tierLabel: text("tier_label"),
  name: text("name").notNull(),
  body: text("body"),
  placeId: integer("place_id").references(() => place.id),
  goSlug: text("go_slug"),
});

export const costItem = pgTable("cost_item", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  section: costSection("section").notNull(),
  // The costs page is a tier matrix (LEAN / CORE / SPLURGE columns); each cell
  // becomes one row carrying its tier. Headline tier cards use tier alone.
  tier: text("tier"),
  label: text("label").notNull(),
  // The deck's price string verbatim ("from ~€1,900", "on enquiry") — the
  // numeric columns fill only when a value actually parses; "on enquiry"
  // must survive as itself.
  priceLabel: text("price_label"),
  amountLow: doublePrecision("amount_low"),
  amountHigh: doublePrecision("amount_high"),
  currency: text("currency"), // FJD/EUR — the deck's currency, not the buyer's
  // couple | person | day | trip — per-couple costs are the week-guide
  // convention; making it a column keeps that explicit instead of implied.
  per: text("per"),
  note: text("note"),
});

export const reservationRule = pgTable("reservation_rule", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  // The deck groups reservations into urgency bands ("BEFORE YOU FLY",
  // "DAY 2 → DAY 13", "ARRANGE ON THE GROUND") — the band is real content.
  group: text("group"),
  label: text("label").notNull(),
  // Reservations are deadline pointers, not bookings: lead_time_label carries
  // the deck's phrasing ("Book 3-6 months ahead"), lead_time_days the
  // machine-usable floor when one exists.
  leadTimeDays: integer("lead_time_days"),
  leadTimeLabel: text("lead_time_label"),
  criticality: criticality("criticality").notNull().default("should"),
  placeId: integer("place_id").references(() => place.id),
  goSlug: text("go_slug"),
  note: text("note"),
});

export const packItem = pgTable("pack_item", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  group: text("group"), // categorical pack list — group headings come from the deck
  label: text("label").notNull(),
  note: text("note"),
});

export const activityRow = pgTable("activity_row", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  sort: integer("sort").notNull(),
  name: text("name").notNull(),
  priceLabel: text("price_label"),
  note: text("note"),
  placeId: integer("place_id").references(() => place.id),
  goSlug: text("go_slug"),
});

export const guideSection = pgTable("guide_section", {
  id: serial("id").primaryKey(),
  skuId: integer("sku_id")
    .notNull()
    .references(() => guideSku.id, { onDelete: "cascade" }),
  type: sectionType("type").notNull(),
  sort: integer("sort").notNull(),
  // Validated per type at ingest by publish-sku.mjs. Twelve fixed page shapes
  // do not deserve twelve tables; they do deserve validation before insert.
  payload: jsonb("payload").notNull(),
  photoRefs: jsonb("photo_refs"), // array of private-Blob keys
});

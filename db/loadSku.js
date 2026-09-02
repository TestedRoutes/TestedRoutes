/**
 * Load one SKU's structured content from the private store, reconstructing
 * exactly the canonical shape publish-sku.mjs emits with --json. That
 * equivalence is load-bearing: check-sku.mjs diffs the two, so any field
 * added to the publisher's canonical object must be reproduced here (the
 * checker failing loudly on a mismatch is the design, not a bug).
 *
 * Consumers: the gated reader pages, the public sample-day page, check-sku,
 * and eventually the app bundle endpoint — one loader, one shape.
 *
 * place.internal_notes and place.booking_url are deliberately NOT selected:
 * this shape is what readers and bundles serialise, and those two columns
 * never leave the server (workbook column: "never exported"; raw partner URLs
 * render only as /go/ aliases).
 */
import { eq, asc, and, inArray } from "drizzle-orm";
import { getDb } from "./index.js";
import {
  guideSku, day, timelineSlot, callout, place, skuPlace,
  stayPick, foodPick, costItem, reservationRule, packItem, activityRow, guideSection,
} from "./schema.js";

/** @returns {Promise<object|null>} the canonical SKU object, or null if unknown */
export async function loadSku(slug) {
  const db = getDb();
  const [sku] = await db.select().from(guideSku).where(eq(guideSku.slug, slug));
  if (!sku) return null;

  const [days, slots, joins, stays, foods, costs, reservations, packs, activities, sections] =
    await Promise.all([
      db.select().from(day).where(eq(day.skuId, sku.id)).orderBy(asc(day.dayFrom)),
      db
        .select({ slot: timelineSlot, pinId: place.pinId })
        .from(timelineSlot)
        .leftJoin(place, eq(timelineSlot.placeId, place.id))
        .innerJoin(day, eq(timelineSlot.dayId, day.id))
        .where(eq(day.skuId, sku.id))
        .orderBy(asc(day.dayFrom), asc(timelineSlot.sort)),
      db
        .select({ join: skuPlace, pin: place })
        .from(skuPlace)
        .innerJoin(place, eq(skuPlace.placeId, place.id))
        .where(eq(skuPlace.skuId, sku.id)),
      db
        .select({ row: stayPick, pinId: place.pinId })
        .from(stayPick)
        .leftJoin(place, eq(stayPick.placeId, place.id))
        .where(eq(stayPick.skuId, sku.id))
        .orderBy(asc(stayPick.sort)),
      db
        .select({ row: foodPick, pinId: place.pinId })
        .from(foodPick)
        .leftJoin(place, eq(foodPick.placeId, place.id))
        .where(eq(foodPick.skuId, sku.id))
        .orderBy(asc(foodPick.sort)),
      db.select().from(costItem).where(eq(costItem.skuId, sku.id)).orderBy(asc(costItem.sort)),
      db
        .select({ row: reservationRule, pinId: place.pinId })
        .from(reservationRule)
        .leftJoin(place, eq(reservationRule.placeId, place.id))
        .where(eq(reservationRule.skuId, sku.id))
        .orderBy(asc(reservationRule.sort)),
      db.select().from(packItem).where(eq(packItem.skuId, sku.id)).orderBy(asc(packItem.sort)),
      db
        .select({ row: activityRow, pinId: place.pinId })
        .from(activityRow)
        .leftJoin(place, eq(activityRow.placeId, place.id))
        .where(eq(activityRow.skuId, sku.id))
        .orderBy(asc(activityRow.sort)),
      db.select().from(guideSection).where(eq(guideSection.skuId, sku.id)).orderBy(asc(guideSection.sort)),
    ]);

  const dayIds = days.map((d) => d.id);
  const dayCallouts = dayIds.length
    ? await db
        .select()
        .from(callout)
        .where(and(eq(callout.ownerType, "day"), inArray(callout.ownerId, dayIds)))
        .orderBy(asc(callout.sort))
    : [];

  const canonicalDays = days.map((d) => ({
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
    slots: slots
      .filter((s) => s.slot.dayId === d.id)
      .map((s) => ({
        timeLabel: s.slot.timeLabel,
        title: s.slot.title,
        body: s.slot.body,
        pinId: s.pinId,
        goSlug: s.slot.goSlug,
        dayNumber: s.slot.dayNumber,
      })),
    callouts: dayCallouts
      .filter((c) => c.ownerId === d.id)
      .map((c) => ({ kind: c.kind, title: c.title, body: c.body })),
  }));

  const referenced = new Map();
  for (const j of joins) referenced.set(j.pin.pinId, j.pin);

  const canonical = {
    sku: {
      slug: sku.slug,
      country: sku.country,
      skuCode: sku.skuCode,
      structureType: sku.structureType,
      durationDays: sku.durationDays,
      sampleDay: sku.sampleDay,
      status: sku.status,
      title: sku.title,
      subtitle: sku.subtitle,
    },
    days: canonicalDays,
    skuPlaces: joins
      .map((j) => ({
        pinId: j.pin.pinId,
        role: j.join.role,
        dayNumber: j.join.dayNumber,
        orderInDay: j.join.orderInDay,
      }))
      .sort((a, b) => (a.pinId < b.pinId ? -1 : 1)),
    stayPicks: stays.map(({ row, pinId }) => ({
      blockHeading: row.blockHeading, tier: row.tier, tierLabel: row.tierLabel,
      name: row.name, pinId, body: row.body, goSlug: row.goSlug,
    })),
    foodPicks: foods.map(({ row, pinId }) => ({
      area: row.area, tierLabel: row.tierLabel, name: row.name,
      body: row.body, pinId, goSlug: row.goSlug,
    })),
    costItems: costs.map((c) => ({
      section: c.section, tier: c.tier, label: c.label, priceLabel: c.priceLabel,
      amountLow: c.amountLow, amountHigh: c.amountHigh, currency: c.currency,
      per: c.per, note: c.note,
    })),
    reservationRules: reservations.map(({ row, pinId }) => ({
      group: row.group, label: row.label, leadTimeDays: row.leadTimeDays,
      leadTimeLabel: row.leadTimeLabel, criticality: row.criticality,
      pinId, goSlug: row.goSlug, note: row.note,
    })),
    packItems: packs.map((p) => ({ group: p.group, label: p.label, note: p.note })),
    activityRows: activities.map(({ row, pinId }) => ({
      name: row.name, priceLabel: row.priceLabel, note: row.note, pinId, goSlug: row.goSlug,
    })),
    sections: sections.map((s) => ({ type: s.type, payload: s.payload, photoRefs: s.photoRefs })),
    contentVersion: sku.contentVersion,
  };

  // Slot/pick pins that carry no join row still belong in the places list.
  const extraPins = new Set();
  for (const group of [canonicalDays.flatMap((d) => d.slots), canonical.stayPicks,
    canonical.foodPicks, canonical.reservationRules, canonical.activityRows]) {
    for (const item of group) {
      if (item.pinId && !referenced.has(item.pinId)) extraPins.add(item.pinId);
    }
  }
  if (extraPins.size) {
    const extra = await db
      .select()
      .from(place)
      .where(and(eq(place.country, sku.country), inArray(place.pinId, [...extraPins])));
    for (const p of extra) referenced.set(p.pinId, p);
  }
  canonical.places = [...referenced.keys()].sort().map((pin) => {
    const p = referenced.get(pin);
    return {
      pinId: p.pinId, name: p.name, type: p.type, region: p.region, tier: p.tier,
      description: p.description, lat: p.lat, lng: p.lng, mapUrl: p.mapUrl,
      category: p.category, goSlug: p.goSlug,
      // photoRef is owned by the (future) per-place photo pass, not by
      // publish-sku — the checker scrubs it, the map renders photo pins
      // where it is set.
      photoRef: p.photoRef ?? null,
    };
  });

  return canonical;
}

/** The one ungated read: only the flagged sample day, plus enough to frame it. */
export async function loadSampleDay(slug) {
  const full = await loadSku(slug);
  if (!full || !full.sku.sampleDay) return null;
  const sample = full.days.find(
    (d) => d.dayFrom <= full.sku.sampleDay && full.sku.sampleDay <= d.dayTo,
  );
  if (!sample) return null;
  return { sku: full.sku, day: sample, contentVersion: full.contentVersion };
}

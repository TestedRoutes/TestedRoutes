/**
 * Server → client shapes. Client components (the Places grid, the map) take
 * plain serialisable objects: photos as URLs, never static-import objects,
 * and nothing the buyer should not see.
 */
import { photoFor } from "./photos";
import { readerPaths, categoryLabel, directionsHref } from "./format";

/** A place for the grid or a map pin. */
export function placeForClient(country, p, extra = {}) {
  const photo = photoFor(country, p.photoRef);
  return {
    pinId: p.pinId,
    name: p.name,
    region: p.region ?? null,
    category: p.category ?? null,
    description: p.description ?? null,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    photoUrl: photo ? photo.src : null,
    timeShort: p.attributes?.time_short ?? null,
    ...extra,
  };
}

/** SKU code "fiji-14d" → the places.yaml skus key "14D". */
const skuKey = (sku) => sku.sku.skuCode.split("-").pop().toUpperCase();

/**
 * Where a place sits in each route, from the place's `skus` join rows:
 * the route title, "Day 2 · stop 3", and the link to that day (or to the
 * route overview when the entry has no day). Shared by the place page and
 * the map's place sheet so both say the same thing.
 */
export function routesForPlace(country, data, place) {
  return data.routes
    .filter((r) => r.sku)
    .map((r) => ({ route: r, entry: place.skus?.[skuKey(r.sku)] }))
    .filter((x) => x.entry)
    .map(({ route, entry }) => {
      const page = entry.day != null ? route.sku.days.find((d) => d.dayFrom <= entry.day && entry.day <= d.dayTo) : null;
      const label = [
        entry.day != null ? `Day ${entry.day}` : "Anytime",
        entry.order != null ? `stop ${entry.order}` : null,
        entry.role && entry.role !== "route" ? entry.role : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        slug: route.slug,
        title: route.title,
        label,
        href: page ? readerPaths.day(country, route.slug, page.dayFrom) : readerPaths.itinerary(country, route.slug),
      };
    });
}

/**
 * A place for the map page: the grid shape plus what its sheet shows when
 * "Details" opens over the map (founder's mock 2026-09-20): the facts, the
 * routes it is in, Directions and the affiliate slot. Locked places carry
 * none of it; the sheet never opens for them.
 */
export function placeForMap(country, data, p, extra = {}) {
  const base = placeForClient(country, p, extra);
  if (base.locked) return base;
  return {
    ...base,
    attributes: p.attributes ?? null,
    directionsHref: directionsHref(p),
    routes: routesForPlace(country, data, p),
    goSlug: p.goSlug ?? null,
  };
}

/**
 * Map pins for a set of places. `numbered` maps pinId → stop number for the
 * day's route stops; `muted` is the storefront's locked set. A place with a
 * photo renders as a photo pin unless it is numbered.
 */
export function pinsForMap(country, places, { numbered = new Map(), muted = new Set(), link = true } = {}) {
  return places
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => {
      const photo = photoFor(country, p.photoRef);
      const n = numbered.get(p.pinId);
      const kind = muted.has(p.pinId) ? "muted" : n ? "number" : photo ? "photo" : "dot";
      return {
        id: p.pinId,
        name: p.name,
        sub: categoryLabel(p.category) + (p.region ? ` · ${p.region}` : ""),
        lat: p.lat,
        lng: p.lng,
        kind,
        label: n ? String(n) : null,
        photoUrl: photo ? photo.src : null,
        href: link && kind !== "muted" ? readerPaths.spot(country, p.pinId) : null,
      };
    });
}

/**
 * Server → client shapes. Client components (the Spots grid, the map) take
 * plain serialisable objects: photos as URLs, never static-import objects,
 * and nothing the buyer should not see.
 */
import { photoFor } from "./photos";
import { readerPaths, categoryLabel } from "./format";

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

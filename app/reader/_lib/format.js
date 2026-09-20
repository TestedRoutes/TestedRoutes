/**
 * Small presentation helpers shared by the reader pages. Pure functions over
 * the canonical SKU object; nothing here knows where the data came from.
 */

/** "THE ISLAND DAY" -> "The Island Day" (deck titles are set in caps). */
export function titleCase(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/(^|[\s(–-])([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase());
}

/** "DAYS 4–5" style badge, from the page's own badge or its day range. */
export function dayBadge(page) {
  if (page.badge) return page.badge;
  return page.dayFrom === page.dayTo
    ? `DAY ${page.dayFrom}`
    : `DAYS ${page.dayFrom}–${page.dayTo}`;
}

/** The short chip label: "2" or "4–5". */
export function dayChip(page) {
  return page.dayFrom === page.dayTo ? String(page.dayFrom) : `${page.dayFrom}–${page.dayTo}`;
}

/** Path of a day page. Multi-day pages are addressed by their first day. */
export function dayHref(slug, page) {
  return `/reader/${slug}/day/${page.dayFrom}`;
}

/** The day page that covers calendar day n, or null. */
export function pageForDay(sku, n) {
  const day = Number(n);
  if (!Number.isInteger(day)) return null;
  return sku.days.find((d) => d.dayFrom <= day && day <= d.dayTo) || null;
}

/**
 * "08:45 – 18:00": first and last slot times when the page has slots, else
 * the deck's rail hours, else nothing.
 */
export function daySpan(page) {
  const times = page.slots.map((s) => s.timeLabel).filter(Boolean);
  if (times.length >= 2) return `${times[0]} – ${times[times.length - 1]}`;
  if (times.length === 1) return times[0];
  if (page.railStart != null && page.railEnd != null) {
    const hh = (h) => `${String(h).padStart(2, "0")}:00`;
    return `${hh(page.railStart)} – ${hh(page.railEnd)}`;
  }
  return null;
}

/**
 * Stop numbers for a day's slots: distinct pinned places in order of first
 * appearance get 1, 2, 3…; unpinned moves (a boat leg, lunch) and a return
 * to an already-numbered place get none. Matches the deck's day maps, where
 * Port Denarau is "1" at 08:45 and unnumbered again at 18:00.
 */
export function stopNumbers(page) {
  const seen = new Map();
  return page.slots.map((s) => {
    if (!s.pinId) return null;
    if (seen.has(s.pinId)) return null;
    seen.set(s.pinId, seen.size + 1);
    return seen.get(s.pinId);
  });
}

/** Lookup of canonical.places by pinId. */
export function placeIndex(sku) {
  return new Map(sku.places.map((p) => [p.pinId, p]));
}

/** A Google Maps directions link to a place, from wherever the reader is. */
export function directionsHref(place) {
  if (place?.lat == null || place?.lng == null) return place?.mapUrl || null;
  // Longitudes are stored past 180 for the map plane; Google wants -180..180.
  const lng = place.lng > 180 ? place.lng - 360 : place.lng;
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${lng}`;
}

/** Group an array by a key function, preserving first-seen order. */
export function groupBy(items, keyFn) {
  const out = new Map();
  for (const item of items) {
    const k = keyFn(item) ?? "";
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(item);
  }
  return [...out.entries()];
}

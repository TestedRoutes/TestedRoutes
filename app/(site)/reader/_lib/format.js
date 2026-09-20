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

/**
 * Path of a day page inside the country reader. Multi-day pages are
 * addressed by their first day.
 */
export function dayHref(country, slug, page) {
  return `/reader/${country}/itineraries/${slug}/day/${page.dayFrom}`;
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

/** Great-circle distance in km between two {lat,lng}; longitudes past 180 are fine. */
export function distanceKm(a, b) {
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (((b.lng - a.lng + 540) % 360) - 180) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** "0.8 km" / "27 km" */
export function kmLabel(d) {
  return `${d < 10 ? d.toFixed(1) : Math.round(d)} km`;
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

/** Places vocabulary → label and a short icon glyph for cards and pins. */
export const CATEGORY = {
  stay: { label: "Stay", glyph: "⌂" },
  walk: { label: "Hike", glyph: "↟" },
  snorkel: { label: "Swim", glyph: "≈" },
  dive: { label: "Dive", glyph: "◈" },
  transport: { label: "Transit", glyph: "➤" },
  sight: { label: "Sights", glyph: "◎" },
  food: { label: "Food", glyph: "✦" },
};

export function categoryLabel(key) {
  return CATEGORY[key]?.label || (key ? String(key) : "Place");
}

/** Path helpers for the country-scoped reader. */
export const readerPaths = {
  country: (c) => `/reader/${c}`,
  spots: (c) => `/reader/${c}/spots`,
  spot: (c, pin) => `/reader/${c}/spots/${pin}`,
  itineraries: (c) => `/reader/${c}/itineraries`,
  itinerary: (c, sku) => `/reader/${c}/itineraries/${sku}`,
  day: (c, sku, n) => `/reader/${c}/itineraries/${sku}/day/${n}`,
  tips: (c) => `/reader/${c}/tips`,
  map: (c) => `/reader/${c}/map`,
  bookings: (c) => `/reader/${c}/tips/bookings`,
  pack: (c) => `/reader/${c}/tips/pack`,
};

/** The route pins of a day in day/order sequence, from the SKU's join rows. */
export function routePinsForDay(sku, dayNumber) {
  return sku.skuPlaces
    .filter((j) => j.role === "route" && j.dayNumber === dayNumber)
    .sort((a, b) => (a.orderInDay ?? 99) - (b.orderInDay ?? 99))
    .map((j) => j.pinId);
}

/** Every route pin of the SKU in day/order sequence (the trip line). */
export function routePinsInOrder(sku) {
  return sku.skuPlaces
    .filter((j) => j.role === "route" && j.dayNumber != null)
    .sort((a, b) => a.dayNumber - b.dayNumber || (a.orderInDay ?? 99) - (b.orderInDay ?? 99))
    .map((j) => j.pinId);
}

/** Pick the amount for a currency from a country price list, EUR fallback. */
export function pickPrice(prices, currency) {
  if (!Array.isArray(prices) || !prices.length) return null;
  return prices.find((p) => p.currency === currency) || prices.find((p) => p.currency === "EUR") || prices[0];
}

/**
 * Price label, the same rule as the sales pages (sanityStory's private
 * formatPrice). Copied rather than imported: that module pulls in the
 * Sanity client at import time, which must never be a dependency of the
 * reader (it renders from the repo YAML and has to work with no Sanity env).
 */
export function formatPrice(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "CHF" ? "CHF " : "€";
  const rounded = n % 1 === 0 ? n.toString() : n.toFixed(2);
  return `${symbol}${rounded}`;
}

/** "2026-08-21" → "21 August 2026" for the kept-current line. */
export function longDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

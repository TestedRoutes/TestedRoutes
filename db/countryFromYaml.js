/**
 * The country layer of the structured content: country.yaml (title, creator
 * line, routes in display order, the sample layer, the price, the verified
 * date) joined to the country's place pool and to every route that already
 * has a sku.yaml.
 *
 * Same discipline as skuFromYaml.js: pure reads, no network, one builder.
 * The reader's country pages render from this; when the paid layer moves to
 * Postgres, a db/loadCountry.js reconstructs the same shape and this stays
 * the authoring-side builder.
 *
 * Routes are returned in the authored order with `sku` set to the canonical
 * SKU object when its sku.yaml exists and null when it does not — the
 * chooser lists every route but links only the ones that render. A country
 * page must never quietly drop a route, so a missing sku.yaml is a state,
 * not an error; a broken sku.yaml (validation problems) still throws.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { countriesDir, locateSku, loadSkuFromYaml } from "./skuFromYaml.js";

/** <countries>/<slug>/country.yaml, or null. */
export function locateCountry(slug, { repoRoot } = {}) {
  const p = path.join(countriesDir(repoRoot), slug, "country.yaml");
  return existsSync(p) ? p : null;
}

/** Country slug for a SKU slug (the directory its sku.yaml lives in), or null. */
export function countryForSku(skuSlug, opts = {}) {
  const located = locateSku(skuSlug, opts);
  return located ? path.basename(located.countryDir) : null;
}

function readPool(countryDir) {
  const p = path.join(countryDir, "places.yaml");
  if (!existsSync(p)) return { country: null, places: [] };
  return yaml.load(readFileSync(p, "utf8"));
}

/** Pool entry → the place shape the reader uses (never internal_notes or booking_url). */
function shapePlace(p) {
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
    attributes: p.attributes ?? null,
    photoRef: p.photo_ref ?? null,
    skus: p.skus ?? {},
  };
}

/**
 * Load a country, or null when no country.yaml exists for the slug.
 *
 * Returns:
 *   country   the yaml's scalar fields (title, subtitle, creatorLine, intro,
 *             heroPhoto, heroAlt, regionLabel, reviewed, price[])
 *   tips      the Travel tips cards in authored order
 *   routes    [{ slug, title, days, who, free, sku }] in authored order
 *   places    every pin in the country pool, reader shape
 *   sample    { routeSlug, day, pins[] } resolved: `route` is the canonical
 *             SKU (or null) and `page` the day page covering `day`
 */
export function loadCountryFromYaml(slug, opts = {}) {
  const file = locateCountry(slug, opts);
  if (!file) return null;
  const c = yaml.load(readFileSync(file, "utf8"));
  const countryDir = path.dirname(file);
  const pool = readPool(countryDir);

  const routes = (c.routes ?? []).map((r) => ({
    slug: r.slug,
    title: r.title,
    days: r.days ?? null,
    who: r.who ?? null,
    free: Boolean(r.free),
    sku: locateSku(r.slug, opts) ? loadSkuFromYaml(r.slug, opts) : null,
  }));

  const sampleRoute = c.sample?.route
    ? routes.find((r) => r.slug === c.sample.route)?.sku ?? null
    : null;
  const samplePage =
    sampleRoute && c.sample?.day != null
      ? sampleRoute.days.find((d) => d.dayFrom <= c.sample.day && c.sample.day <= d.dayTo) ?? null
      : null;

  return {
    country: {
      code: c.country,
      slug: c.slug ?? slug,
      name: c.name ?? c.title,
      title: c.title,
      subtitle: c.subtitle ?? null,
      creatorLine: c.creator_line ?? null,
      intro: c.intro ?? null,
      heroPhoto: c.hero_photo ?? null,
      heroAlt: c.hero_alt ?? null,
      // js-yaml parses a bare date into a Date; the reader wants the plain
      // ISO day, never a locale string.
      regionLabel: c.region_label ?? null,
      // The only date the reader shows. js-yaml parses a bare date into a
      // Date; the reader wants the plain ISO day, never a locale string.
      reviewed: c.reviewed
        ? c.reviewed instanceof Date
          ? c.reviewed.toISOString().slice(0, 10)
          : String(c.reviewed)
        : null,
      price: Array.isArray(c.price) ? c.price : [],
    },
    tips: (c.tips ?? []).map((t) => ({
      eyebrow: t.eyebrow ?? null,
      title: t.title,
      body: t.body ?? null,
      link: t.link ?? null,
      linkLabel: t.link_label ?? null,
    })),
    routes,
    places: (pool.places ?? []).map(shapePlace),
    sample: {
      routeSlug: c.sample?.route ?? null,
      day: c.sample?.day ?? null,
      pins: Array.isArray(c.sample?.pins) ? c.sample.pins : [],
      route: sampleRoute,
      page: samplePage,
    },
  };
}

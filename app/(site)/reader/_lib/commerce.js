/**
 * Prices and buy links for the storefront and the routes chooser.
 *
 * The country guide's price comes from country.yaml. A route's price and
 * its checkout link come from the live guide document (Sanity, via the
 * site's own loader) so a route card sells through the same Polar checkout
 * and lands on the same `checkout_started` event as the sales page. The
 * Sanity read is best-effort and lazy: the loader is imported inside the
 * call because the site's Sanity client throws at import time without its
 * env, and the reader must render from the repo YAML with no Sanity at all
 * (local dev, a Sanity outage). Without it the card still renders, just
 * without a price and a button.
 */
import { checkoutHrefFor } from "../../../_lib/checkoutHref";
import { formatPrice, pickPrice } from "./format";

export function countryPrice(country, currency) {
  const p = pickPrice(country.price, currency);
  return p ? { amount: p.amount, currency: p.currency, label: formatPrice(p.amount, p.currency) } : null;
}

export async function routesWithCommerce(routes, currency) {
  let loadGuideBySlug = null;
  try {
    ({ loadGuideBySlug } = await import("../../../_lib/loadGuides"));
  } catch {
    loadGuideBySlug = null;
  }
  return Promise.all(
    routes.map(async (r) => {
      if (r.free || !loadGuideBySlug) return { ...r, priceLabel: null, checkoutHref: null };
      try {
        const g = await loadGuideBySlug(r.slug, currency);
        return {
          ...r,
          priceLabel: g?.price || null,
          checkoutHref: g ? checkoutHrefFor({ polarProductId: g.polarProductId, slug: g.slug }) : null,
        };
      } catch {
        return { ...r, priceLabel: null, checkoutHref: null };
      }
    }),
  );
}

/**
 * Cards for the Itineraries tab on the site's own guide card shape. A route
 * with a live guide document gets that document's card (photos, category,
 * duration, price in the visitor's currency, Polar checkout) with its link
 * turned into the reader; a route still coming gets the same frame from the
 * country hero with a "Coming" note and no price. `free` routes say Free.
 */
export async function routeCards(country, routes, currency, { heroSrc = null, ownedHrefOnly = false } = {}) {
  let loadGuideBySlug = null;
  let toGuideCard = null;
  try {
    ({ loadGuideBySlug, toGuideCard } = await import("../../../_lib/loadGuides"));
  } catch {
    loadGuideBySlug = null;
  }
  return Promise.all(
    routes.map(async (r) => {
      const readerHref = `/reader/${country}/itineraries/${r.slug}`;
      let live = null;
      if (loadGuideBySlug) {
        try {
          const g = await loadGuideBySlug(r.slug, currency);
          if (g) live = toGuideCard(g);
        } catch {
          live = null;
        }
      }
      if (live) {
        return {
          ...live,
          href: readerHref,
          title: r.title || live.title,
          duration: `${r.days} ${r.days === 1 ? "day" : "days"}`,
          statusNote: r.sku ? null : "Coming",
          price: r.free ? "Free" : live.price,
          polarProductId: r.free || ownedHrefOnly ? null : live.polarProductId,
          guidePdfUrl: null,
          metadata: { ...live.metadata, hero: { subtitle: r.who || live.metadata?.hero?.subtitle || null } },
        };
      }
      return {
        slug: r.slug,
        title: r.title,
        category: "Itinerary",
        duration: `${r.days} ${r.days === 1 ? "day" : "days"}`,
        price: r.free ? "Free" : "",
        image: heroSrc,
        cardPhotos: heroSrc ? [heroSrc] : [],
        cardPagePhotos: [],
        videoUrl: null,
        videoSlot: null,
        videos: [],
        href: r.sku ? readerHref : `/reader/${country}/itineraries`,
        polarProductId: null,
        guidePdfUrl: null,
        cardLine: null,
        statusNote: r.sku ? null : "Coming",
        metadata: {
          geography: { country: country.charAt(0).toUpperCase() + country.slice(1), continent: null },
          classification: { activity_category: null },
          timing: { best_seasons: [] },
          seo: { meta_description: null },
          hero: { subtitle: r.who || null },
        },
      };
    }),
  );
}

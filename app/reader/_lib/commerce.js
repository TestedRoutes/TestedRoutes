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
import { checkoutHrefFor } from "../../_lib/checkoutHref";
import { formatPrice, pickPrice } from "./format";

export function countryPrice(country, currency) {
  const p = pickPrice(country.price, currency);
  return p ? { amount: p.amount, currency: p.currency, label: formatPrice(p.amount, p.currency) } : null;
}

export async function routesWithCommerce(routes, currency) {
  let loadGuideBySlug = null;
  try {
    ({ loadGuideBySlug } = await import("../../_lib/loadGuides"));
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

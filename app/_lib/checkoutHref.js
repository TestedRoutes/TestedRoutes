/**
 * The one place that builds a /api/checkout link.
 *
 * Every buy CTA on the site funnels through /api/checkout?products=<id> —
 * the sales-page hero, the sticky bar, the bottom CTA, the browse cards.
 * That route is therefore the natural place to record "someone tried to
 * buy", but on its own it only knows a Polar product id, and turning that
 * back into a guide would mean a Sanity round trip inside a redirect the
 * buyer is waiting on.
 *
 * So the slug rides along as `g`. It is a label for analytics and nothing
 * else: the route must never branch on it, look anything up by it, or
 * echo it back into a page. `products` stays the only parameter with
 * authority, exactly as before.
 *
 * Centralising this also kills the copy of the URL-building that had
 * drifted into both guidePage.jsx and GuideListCard.jsx — add a CTA
 * anywhere and it gets attribution for free.
 */

/**
 * @param {{polarProductId?: string, slug?: string}} guide
 * @returns {string|null} checkout URL, or null when the guide isn't sellable
 */
export function checkoutHrefFor(guide) {
  if (!guide?.polarProductId) return null;
  const params = new URLSearchParams({ products: guide.polarProductId });
  if (guide.slug) params.set("g", guide.slug);
  return `/api/checkout?${params.toString()}`;
}

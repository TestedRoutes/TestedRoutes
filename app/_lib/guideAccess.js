/**
 * Entitlement check for the gated guide reader (/guides/<slug>/read).
 *
 * Same two-part proof as /api/guide-download, deliberately: the HMAC signature
 * proves the token came from us without a lookup, the purchase document proves
 * the purchase is still honoured (exists + not revoked). Both must pass. The
 * slug check is story-ref-first with the token slug as fallback, so a story
 * rename does not lock buyers out — mirroring the download route's coalesce.
 *
 * Where the token comes from, in order:
 *   1. ?token= on the URL (first click from an email). The page should then
 *      redirect through /api/access/claim so the token moves into an httpOnly
 *      cookie and leaves the URL before any client JS (analytics must never
 *      see tokens).
 *   2. The tr_access_<slug> cookie set by that claim route.
 *
 * Returns null on every failure — callers render the gate page, never throw.
 * The gate is a 200 with a buy CTA: the audience for a failed check is a
 * human with an old or mangled link, not a crawler.
 */
import { cookies } from "next/headers";
import { verifyPurchaseToken } from "./purchaseToken";
import { writeClient } from "../../sanity/lib/writeClient";

export function accessCookieName(slug) {
  return `tr_access_${slug}`;
}

/**
 * @param {string} slug the /guides/<slug> segment being requested
 * @param {string} [urlToken] ?token= from the page's searchParams (layouts
 *   never see searchParams — this must be called from pages)
 * @returns {Promise<null | {
 *   claims: { orderId: string, slug: string, issuedAt: number|null },
 *   purchase: object,
 *   via: "query" | "cookie",
 * }>}
 */
export async function requireGuideAccess(slug, urlToken) {
  if (!slug || !process.env.PURCHASE_TOKEN_SECRET) return null;

  const jar = await cookies();
  const candidates = [
    { token: urlToken, via: "query" },
    { token: jar.get(accessCookieName(slug))?.value, via: "cookie" },
  ];

  for (const { token, via } of candidates) {
    if (!token) continue;
    const claims = verifyPurchaseToken(token);
    if (!claims) continue;

    const purchase = await writeClient
      .getDocument(`purchase-${claims.orderId}`)
      .catch(() => null);
    if (!purchase || purchase.revoked) continue;

    if (await slugMatchesPurchase(slug, claims, purchase)) {
      return { claims, purchase, via };
    }
  }
  return null;
}

/**
 * Story-ref first (survives a slug rename), token slug as fallback. A token
 * for guide A must never open guide B, which is why the fallback compares the
 * requested slug against the token's own claim, not against the purchase doc's
 * denormalized guideSlug alone.
 */
async function slugMatchesPurchase(slug, claims, purchase) {
  const storyId = purchase.story?._ref;
  if (storyId) {
    const ok = await writeClient
      .fetch(
        `*[_id == $storyId][0].guide.pageSlug == $slug ||
          *[_id == $storyId][0].slug.current == $slug`,
        { storyId, slug },
      )
      .catch(() => false);
    if (ok === true) return true;
  }
  return claims.slug === slug;
}

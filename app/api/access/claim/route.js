/**
 * Token → cookie exchange for the guide reader.
 *
 * Email links carry ?token= (the permanent purchase token). Reader pages that
 * see a valid one redirect here; this route verifies it, moves it into an
 * httpOnly cookie scoped to the one guide, and 302s to the clean /read URL.
 * The point is that the token leaves the URL before any client JS runs —
 * PostHog captures URLs, browser history and referrers leak them, and the
 * token is a permanent credential.
 *
 * The cookie value is the token itself: it is already a signed, revocable
 * credential, and inventing a second session format would just add a second
 * thing to audit. Max-age is 400 days (Chrome's cap); the token never expires,
 * so after the cookie dies the buyer just re-clicks their email link.
 *
 * Failures render the same small human page as /api/guide-download — the
 * audience is a buyer clicking an email link months from now.
 */
import { verifyPurchaseToken } from "../../../_lib/purchaseToken";
import { accessCookieName } from "../../../_lib/guideAccess";
import { writeClient } from "../../../../sanity/lib/writeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failPage(message) {
  return new Response(
    `<!doctype html><html><head><meta name="robots" content="noindex"><title>Access link problem · TestedRoutes</title></head>` +
      `<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1e293b">` +
      `<h1 style="font-size:1.25rem">We couldn't open your guide</h1>` +
      `<p>${message}</p>` +
      `<p>Write to <a href="mailto:hello@testedroutes.com">hello@testedroutes.com</a> with the email you bought with – a person reads it, and we'll sort you out.</p>` +
      `</body></html>`,
    { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request) {
  if (!process.env.PURCHASE_TOKEN_SECRET) {
    return failPage("Guide access is briefly unavailable. Please try again shortly.");
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const claims = verifyPurchaseToken(token);
  if (!claims) {
    return failPage(
      "The link looks incomplete or altered – email clients sometimes break long links across lines.",
    );
  }

  const purchase = await writeClient
    .getDocument(`purchase-${claims.orderId}`)
    .catch(() => null);
  if (!purchase || purchase.revoked) {
    return failPage("This access link is no longer active.");
  }

  // Resolve the guide's current slug story-ref-first so old tokens keep
  // working across a rename; the token's own slug is the fallback.
  let slug = null;
  if (purchase.story?._ref) {
    slug = await writeClient
      .fetch(
        `coalesce(*[_id == $storyId][0].guide.pageSlug, *[_id == $storyId][0].slug.current)`,
        { storyId: purchase.story._ref },
      )
      .catch(() => null);
  }
  if (!slug) slug = claims.slug;

  const dest = new URL(`/guides/${slug}/read`, url.origin);
  const headers = new Headers({ Location: dest.toString() });
  // Secure only in production: dev testing happens over plain http from LAN
  // devices (a phone hitting the dev box's 192.168.x address), where browsers
  // rightly refuse Secure cookies.
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  headers.append(
    "Set-Cookie",
    `${accessCookieName(slug)}=${encodeURIComponent(token)}; Path=/guides/${slug}; Max-Age=34560000; HttpOnly; ${secure}SameSite=Lax`,
  );
  return new Response(null, { status: 302, headers });
}

/**
 * Tokened guide download — the "always-current PDF" promise (Tracker #55).
 *
 * Buyers hit this from the link in their purchase email. The token proves
 * the purchase (HMAC signature) and the purchase document proves it is
 * still honoured (exists + not revoked); the redirect target is read from
 * the live story document at request time, so a republished PDF reaches
 * every old email without anyone re-sending anything.
 *
 * Failures render a small human page, not JSON — the audience is a buyer
 * clicking an email link, possibly months from now, and "contact us"
 * beats a curl-shaped error. 403 for bad/revoked tokens keeps crawlers
 * from indexing the failure page as content.
 */
import { verifyPurchaseToken } from "../../_lib/purchaseToken";
import { writeClient } from "../../../sanity/lib/writeClient";
import { after } from "next/server";
import { captureServer } from "../../_lib/serverAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failPage(message) {
  return new Response(
    `<!doctype html><html><head><meta name="robots" content="noindex"><title>Download link problem · TestedRoutes</title></head>` +
      `<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#1e293b">` +
      `<h1 style="font-size:1.25rem">We couldn't open that download</h1>` +
      `<p>${message}</p>` +
      `<p>Write to <a href="mailto:hello@testedroutes.com">hello@testedroutes.com</a> with the email you bought with – a person reads it, and we'll sort you out.</p>` +
      `</body></html>`,
    { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request) {
  if (!process.env.PURCHASE_TOKEN_SECRET) {
    return failPage("Downloads are briefly unavailable. Please try again shortly.");
  }
  const token = new URL(request.url).searchParams.get("token");
  const claims = verifyPurchaseToken(token);
  if (!claims) {
    return failPage(
      "The link looks incomplete or altered – email clients sometimes break long links across lines.",
    );
  }

  const purchase = await writeClient.getDocument(`purchase-${claims.orderId}`);
  if (!purchase || purchase.revoked) {
    return failPage("This download link is no longer active.");
  }

  // Fresh read every time: the promise is the CURRENT pdf, not the one
  // that existed at purchase. Look up by the purchase's story reference
  // first (survives a slug rename), token slug as fallback.
  const pdfUrl = await writeClient.fetch(
    `coalesce(
      *[_id == $storyId][0].guide.pdf.asset->url,
      *[_type == "story" && (guide.pageSlug == $slug || slug.current == $slug)][0].guide.pdf.asset->url
    )`,
    { storyId: purchase.story?._ref || "", slug: claims.slug },
  );
  if (!pdfUrl) {
    return failPage(
      "Your purchase is valid, but the file is momentarily unavailable on our side.",
    );
  }

  after(
    captureServer("guide_download", {
      guide_slug: purchase.guideSlug || claims.slug,
      via: "purchase_token",
    }),
  );
  // ?dl= asks the Sanity CDN to send Content-Disposition: attachment with
  // a sensible filename instead of rendering the PDF inline.
  const sep = pdfUrl.includes("?") ? "&" : "?";
  return Response.redirect(`${pdfUrl}${sep}dl=`, 302);
}

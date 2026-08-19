/**
 * Rating recorder (Tracker #62). POST-only by design: the star links in
 * the rating email land on /rate, and that page calls here from the
 * browser. Email link-scanners GET everything in a message but do not
 * run page JavaScript, so a GET recording ratings would fill the data
 * with phantom bot ratings — there is deliberately no GET handler.
 *
 * One rating per purchase, newest tap wins (people change their minds).
 * The optional comment arrives from the same page's textarea, capped and
 * stored on the purchase doc for Studio triage — never shown publicly
 * (tracker: reactive feedback never displayed; only proactively-collected
 * ratings feed the future public numbers, #63).
 */
import { verifyPurchaseToken } from "../../_lib/purchaseToken";
import { writeClient } from "../../../sanity/lib/writeClient";
import { after } from "next/server";
import { captureServer } from "../../_lib/serverAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!process.env.PURCHASE_TOKEN_SECRET) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const claims = verifyPurchaseToken(body?.token);
  if (!claims) {
    return Response.json({ error: "invalid token" }, { status: 403 });
  }
  const purchase = await writeClient.getDocument(`purchase-${claims.orderId}`);
  if (!purchase || purchase.revoked) {
    return Response.json({ error: "invalid token" }, { status: 403 });
  }

  const stars = Number(body?.stars);
  const hasStars = Number.isInteger(stars) && stars >= 1 && stars <= 5;
  const comment =
    typeof body?.comment === "string" ? body.comment.trim().slice(0, 2000) : null;

  if (!hasStars && !comment) {
    return Response.json({ error: "nothing to record" }, { status: 400 });
  }

  const patch = writeClient.patch(purchase._id);
  if (hasStars) {
    patch.set({ rating: stars, ratedAt: new Date().toISOString() });
  }
  if (comment) {
    patch.set({ ratingComment: comment });
  }
  await patch.commit();

  if (hasStars) {
    after(
      captureServer("rating_submitted", {
        guide_slug: purchase.guideSlug || claims.slug,
        stars,
      }),
    );
  }

  return Response.json({ ok: true, rating: hasStars ? stars : purchase.rating || null });
}

/**
 * Day-14 rating emails (Tracker #62). Runs daily at 04:30 UTC (vercel.json)
 * and sends each eligible purchase its one and only email from us: the
 * five-star ask plus the permanent always-current download link.
 *
 * Eligible = registered 14+ days ago, not revoked, not refunded, never
 * sent a rating email, not already rated. The stamp (ratingEmailSentAt)
 * is written per purchase immediately after its send, so a crash midway
 * re-sends nothing on the next run.
 *
 * The registry stores only an email HASH (public dataset — see
 * purchaseToken.js), so the address is fetched from Polar by order id at
 * send time. The runtime Polar token already carries orders:read (the
 * analytics rollup relies on it), so no new credential is needed. The
 * fetched address is verified against the stored hash when one exists —
 * a mismatch means the order id and hash have drifted somehow, and
 * emailing the wrong person is the one failure this must never have.
 *
 * Manual run / test (sends real email — use your own test purchases):
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://testedroutes.com/api/cron/rating-emails?minAgeDays=0"
 *
 * Env: CRON_SECRET, PURCHASE_TOKEN_SECRET, POLAR_ACCESS_TOKEN (orders:read),
 *      RESEND_API_KEY + CONTACT_FROM_EMAIL, SANITY_API_WRITE_TOKEN.
 */
import { writeClient } from "../../../../sanity/lib/writeClient";
import { polar } from "../../../_lib/polar";
import { mintPurchaseToken, hashBuyerEmail } from "../../../_lib/purchaseToken";
import { buildRatingEmail } from "../../../_lib/ratingEmail";
import { captureServer } from "../../../_lib/serverAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Sequential Polar lookups + sends; the default 10s window is too tight
// once a real day's worth of purchases queues up.
export const maxDuration = 120;

const DEFAULT_MIN_AGE_DAYS = 14;
// Per-run ceiling. At 50/day this only ever binds during an unexpected
// backlog, and the stamp-per-send design means the remainder simply goes
// out tomorrow rather than being lost.
const MAX_PER_RUN = 50;

function extractOrderEmail(order) {
  const candidates = [
    order?.customer?.email,
    order?.user?.email,
    order?.customerEmail,
    order?.email,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.includes("@")) return c.trim().toLowerCase();
  }
  return null;
}

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const missing = [];
  if (!process.env.PURCHASE_TOKEN_SECRET) missing.push("PURCHASE_TOKEN_SECRET");
  if (!polar) missing.push("POLAR_ACCESS_TOKEN");
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!process.env.CONTACT_FROM_EMAIL) missing.push("CONTACT_FROM_EMAIL");
  if (missing.length) {
    // Config gaps are a report, not a crash — same posture as the rollup.
    return Response.json({ sent: 0, skipped: "not configured", missing });
  }

  // minAgeDays override exists for testing against fresh purchases; it is
  // behind the CRON_SECRET, so it cannot be used to spam buyers from outside.
  const url = new URL(request.url);
  const minAgeDays = Math.max(0, Number(url.searchParams.get("minAgeDays") ?? DEFAULT_MIN_AGE_DAYS));
  const cutoff = new Date(Date.now() - minAgeDays * 24 * 60 * 60 * 1000).toISOString();

  const due = await writeClient.fetch(
    `*[_type == "purchase"
        && revoked != true
        && refunded != true
        && !defined(ratingEmailSentAt)
        && !defined(rating)
        && defined(orderId)
        && createdAt < $cutoff
      ] | order(createdAt asc) [0...$max] {
        _id, orderId, guideSlug, emailHash,
        "guideTitle": story->title
      }`,
    { cutoff, max: MAX_PER_RUN },
  );

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  let sent = 0;
  const errors = [];
  for (const p of due) {
    try {
      const order = await polar.orders.get({ id: p.orderId });
      const email = extractOrderEmail(order);
      if (!email) {
        errors.push(`${p.orderId}: no email on Polar order`);
        continue;
      }
      if (p.emailHash && hashBuyerEmail(email) !== p.emailHash) {
        // Wrong-recipient guard: never send when the stored hash disagrees.
        errors.push(`${p.orderId}: email hash mismatch, not sending`);
        continue;
      }

      const token = mintPurchaseToken({ orderId: p.orderId, slug: p.guideSlug });
      const { subject, text, html } = buildRatingEmail({
        guideTitle: p.guideTitle || "TestedRoutes",
        token,
      });
      const result = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [email],
        replyTo: "hello@testedroutes.com",
        subject,
        text,
        html,
      });
      if (result?.error) throw new Error(JSON.stringify(result.error));

      await writeClient
        .patch(p._id)
        .set({ ratingEmailSentAt: new Date().toISOString() })
        .commit();
      sent += 1;
      await captureServer("rating_email_sent", { guide_slug: p.guideSlug || null });
    } catch (err) {
      // Per-purchase isolation: one bad order (deleted in Polar, Resend
      // hiccup) must not stop the rest of the batch.
      console.error(`[rating-emails] ${p.orderId} failed:`, err);
      errors.push(`${p.orderId}: ${String(err?.message || err).slice(0, 200)}`);
    }
  }

  return Response.json({ due: due.length, sent, errors });
}

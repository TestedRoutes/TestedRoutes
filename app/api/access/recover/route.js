/**
 * Access recovery: "I bought a guide but lost the email."
 *
 * POST body: { email, website (honeypot) }
 *
 * The response is `{ ok: true }` REGARDLESS of whether the address matches
 * any purchase — this endpoint must not be an oracle for "does this email
 * have purchases" (the dataset being public makes emailHash enumeration the
 * attacker's job already; we don't help by confirming hits). For the same
 * reason the timing difference is shrugged at: the expensive path is one
 * GROQ query plus one Resend call, both bounded.
 *
 * This is a transactional, user-initiated email and therefore sits outside
 * the one-purchase-one-email rule (the day-14 rating ask remains the only
 * email WE initiate). Documented next to that rule on purpose.
 *
 * Rate limit is an in-memory per-instance Map — best-effort on serverless,
 * accepted because responses are uniform and Resend's 100/day cap bounds
 * abuse. If it ever matters, the upgrade is a recover_request table in
 * Postgres, not more cleverness here.
 *
 * Pre-registry purchases (before the webhook registry existed) have no
 * purchase doc and thus no emailHash — those buyers fall to the existing
 * "write to hello@" path, same as guide-download failures.
 */
import { hashBuyerEmail, mintPurchaseToken } from "../../../_lib/purchaseToken";
import { writeClient } from "../../../../sanity/lib/writeClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = "https://testedroutes.com";

const attempts = new Map(); // key -> [timestamps]
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 3;

function rateLimited(key) {
  const now = Date.now();
  const list = (attempts.get(key) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  attempts.set(key, list);
  if (attempts.size > 5000) attempts.clear(); // crude memory bound
  return list.length > MAX_PER_WINDOW;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — silently swallow obvious bots.
  if (typeof body?.website === "string" && body.website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  const email = String(body?.email || "").trim().toLowerCase().slice(0, 200);
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`e:${email}`) || rateLimited(`ip:${ip}`)) {
    // Uniform response: a limited caller learns nothing except "try later",
    // and a legitimate buyer's third resend within the window still landed.
    return Response.json({ ok: true });
  }

  if (!process.env.PURCHASE_TOKEN_SECRET) {
    console.warn("[recover] PURCHASE_TOKEN_SECRET not configured");
    return Response.json({ ok: true });
  }

  const emailHash = hashBuyerEmail(email);
  let purchases = [];
  try {
    purchases = await writeClient.fetch(
      `*[_type == "purchase" && emailHash == $h && revoked != true && refunded != true]{
        orderId,
        guideSlug,
        "title": story->title,
        "pageSlug": story->guide.pageSlug,
        "storySlug": story->slug.current
      }`,
      { h: emailHash },
    );
  } catch (err) {
    console.error("[recover] purchase lookup failed:", err);
    return Response.json({ ok: true });
  }

  if (!purchases.length) {
    return Response.json({ ok: true }); // identical to the success path
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn("[recover] Resend not configured; recovery mail skipped");
    return Response.json({ ok: true });
  }

  const items = purchases.map((p) => {
    const slug = p.pageSlug || p.storySlug || p.guideSlug;
    const token = mintPurchaseToken({ orderId: p.orderId, slug });
    return {
      title: p.title || slug,
      // The claim route, not /read?token=: a route handler answers with a real
      // 302 and moves the token into the cookie before any page (and its
      // analytics) ever renders. /read?token= also works, but only via a
      // streamed client-side redirect — fine as a fallback, not as the link
      // we hand out.
      readUrl: `${SITE}/api/access/claim?token=${encodeURIComponent(token)}`,
      downloadUrl: `${SITE}/api/guide-download?token=${encodeURIComponent(token)}`,
    };
  });

  const text =
    `Here are your guide access links.\n\n` +
    items
      .map(
        (i) =>
          `${i.title}\n  Read online: ${i.readUrl}\n  Download the PDF: ${i.downloadUrl}`,
      )
      .join("\n\n") +
    `\n\nThese links are yours permanently and always serve the current version of the guide.\n` +
    `If you didn't request this email, you can ignore it – nothing changes without the links.\n\n` +
    `TestedRoutes · hello@testedroutes.com`;

  const html =
    `<div style="font-family:system-ui,sans-serif;max-width:32rem;margin:0 auto;color:#1f0d07">` +
    `<p>Here are your guide access links.</p>` +
    items
      .map(
        (i) =>
          `<p style="margin:16px 0"><strong>${i.title}</strong><br>` +
          `<a href="${i.readUrl}" style="color:#943d21">Read online</a> · ` +
          `<a href="${i.downloadUrl}" style="color:#943d21">Download the PDF</a></p>`,
      )
      .join("") +
    `<p style="color:#5f524d;font-size:13px">These links are yours permanently and always serve ` +
    `the current version of the guide. If you didn't request this email, you can ignore it.</p>` +
    `</div>`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [email],
      subject: "Your TestedRoutes guide access links",
      text,
      html,
    });
    if (result?.error) console.error("[recover] Resend error:", result.error);
  } catch (err) {
    console.error("[recover] send threw:", err);
  }

  return Response.json({ ok: true });
}

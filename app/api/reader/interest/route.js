/**
 * POST /api/reader/interest — the country guide's buy click, until a Polar
 * product exists for it.
 *
 * The buy box shows a real price and a real button; the click captures the
 * buyer's email here. Three things happen, in this order of importance:
 *   1. Beehiiv subscription with `interest_country` = the country slug
 *      (source of truth; the request is saved only if this succeeds), the
 *      same contract as the home page's guide request.
 *   2. A Resend note to the founder with the country and price, so he can
 *      send the access link by hand — the buy box promises exactly that.
 *   3. One anonymous server capture, `reader_buy_click` with country,
 *      price and currency and never the email, so the click count sits
 *      next to `checkout_started` in the rollup.
 * Same safeguards as guide-request: honeypot, email shape, length caps,
 * 10 s timeout, a Beehiiv blip is a 502 the form can retry.
 */
import { after } from "next/server";
import { captureServer, requestContext } from "../../../_lib/serverAnalytics";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9-]{2,40}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body?.website === "string" && body.website.trim().length > 0) {
    return Response.json({ ok: true });
  }
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 200);
  const country = String(body?.country || "").trim().toLowerCase();
  const price = Number(body?.price);
  const currency = String(body?.currency || "").trim().toUpperCase().slice(0, 3);
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!SLUG_RE.test(country)) {
    return Response.json({ error: "Unknown guide." }, { status: 400 });
  }

  const beehiivKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!beehiivKey || !publicationId) {
    return Response.json({ error: "This form is not configured yet." }, { status: 500 });
  }

  let subRes;
  try {
    subRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${beehiivKey}` },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "testedroutes.com",
          utm_medium: "reader-buy-click",
          utm_campaign: country,
          custom_fields: [{ name: "interest_country", value: country }],
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch (err) {
    console.error("[reader-interest beehiiv] request failed:", err);
    return Response.json({ error: "Could not save that right now." }, { status: 502 });
  }
  if (!subRes.ok) {
    const text = await subRes.text().catch(() => "");
    console.error(`[reader-interest beehiiv] ${subRes.status} ${text}`);
    if (subRes.status === 429) {
      return Response.json({ error: "Too many requests, try again shortly." }, { status: 429 });
    }
    return Response.json({ error: "Could not save that right now." }, { status: 502 });
  }

  const priceLabel = Number.isFinite(price) && currency ? `${price} ${currency}` : "no price";
  try {
    await notifyFounder({ email, country, priceLabel });
  } catch (err) {
    console.error("[reader-interest resend]", err);
  }

  const ctx = requestContext(request);
  after(() =>
    captureServer("reader_buy_click", {
      ...ctx,
      guide_country: country,
      price: Number.isFinite(price) ? price : null,
      currency: currency || null,
    }),
  );

  return Response.json({ ok: true });
}

async function notifyFounder({ email, country, priceLabel }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "hello@testedroutes.com";
  if (!apiKey || !from) return;
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[Reader buy click] ${country} · ${priceLabel}`,
    text:
      `Someone clicked Get the guide on /reader/${country} and left their email.\n\n` +
      `Country:  ${country}\n` +
      `Price:    ${priceLabel}\n` +
      `Email:    ${email}\n\n` +
      `The buy box promised the access link by email, from you.\n` +
      `Submitted at ${new Date().toISOString()}`,
  });
  if (result?.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
}

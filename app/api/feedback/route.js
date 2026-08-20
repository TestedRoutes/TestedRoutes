/**
 * Feedback intake (Tracker #56) — buyers-only, verified against the
 * purchase registry rather than a token. The tracker's 2026-05 spec said
 * "signed token from purchase email", but that email was cut (one
 * purchase, one email — Polar's); the registry does the same job better:
 * the buyer enters the email they bought with, we hash it and look for an
 * unrevoked purchase of THIS guide. No Polar API call, no address stored.
 * A token is also accepted (the day-14 email links here), same check.
 *
 * What happens on a valid submission:
 *   1. feedback doc in Sanity — the triage record. No email on it (the
 *      dataset is publicly readable); only the keyed hash for correlation.
 *   2. Notification to hello@ with reply-to = the buyer. That email IS the
 *      identity channel: replying reaches the buyer directly, which is the
 *      founder's actual triage workflow. Until the Studio inbox (#59)
 *      exists, this is also how feedback gets seen at all.
 *   3. Acknowledgment to the buyer — "reaches a person, ~24h" — matching
 *      the promise printed next to the form.
 *
 * Doc 1 is the transaction; 2 and 3 are best-effort. Rate-limited
 * per-instance like /api/e — honest about its limits at this scale.
 *
 * Two sources, two gates (#58): "web" is the buyers-only path above;
 * "pdf-qr" is the open path behind the QR printed in the guide PDF
 * (/f/{slug}). No buyer gate there per the 2026-05-02 founder decision —
 * whoever is holding the printed guide has it legitimately or is at least
 * reading it, and a companion on the trip may not be the buyer of record.
 * Email is optional on that path: without it we can't reply, and the form
 * says so, but a real correction with no reply address still fixes the
 * guide. The honeypot and rate limit hold for both sources.
 */
import { writeClient } from "../../../sanity/lib/writeClient";
import { verifyPurchaseToken, hashBuyerEmail } from "../../_lib/purchaseToken";
import { after } from "next/server";
import { captureServer } from "../../_lib/serverAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-instance limiter: 5 submissions per IP-ish key per 10 minutes.
// Serverless instances don't share this map — fine as a speed bump.
const hits = new Map();
function rateLimited(key) {
  const now = Date.now();
  const windowStart = now - 10 * 60 * 1000;
  const list = (hits.get(key) || []).filter((t) => t > windowStart);
  list.push(now);
  hits.set(key, list);
  return list.length > 5;
}

export async function POST(request) {
  if (!process.env.PURCHASE_TOKEN_SECRET) {
    return Response.json({ error: "Feedback is briefly unavailable." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — silently accept obvious bots, store nothing.
  if (typeof body?.website === "string" && body.website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(key)) {
    return Response.json({ error: "Too many messages — try again in a few minutes." }, { status: 429 });
  }

  const guideSlug = String(body?.guideSlug || "").toLowerCase().trim();
  if (!/^[a-z0-9-]{1,80}$/.test(guideSlug)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const message = String(body?.message || "").trim().slice(0, 4000);
  if (message.length < 10) {
    return Response.json({ error: "Tell us a little more — a sentence or two helps us fix it." }, { status: 400 });
  }
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = String(body?.email || "").trim().toLowerCase();
  const token = typeof body?.token === "string" ? body.token : null;
  // Only the two public form sources are accepted from the wire; anything
  // else collapses to "web" so a crafted source value can't invent a new
  // category in the inbox (ai-monitor docs are created server-side, not here).
  const source = body?.source === "pdf-qr" ? "pdf-qr" : "web";

  let emailHash = null;
  if (source === "pdf-qr") {
    // Open path — no purchase lookup. Hash the email only to give triage a
    // correlation handle when one is offered; an invalid address is treated
    // as none rather than bounced, because the message matters more than
    // the reply channel here.
    emailHash = EMAIL_RE.test(email) ? hashBuyerEmail(email) : null;
  } else {
    // Buyers-only gate: a valid token for this guide, or the purchase email.
    let purchase = null;
    const tokenClaims = token ? verifyPurchaseToken(token) : null;
    if (tokenClaims) {
      purchase = await writeClient.getDocument(`purchase-${tokenClaims.orderId}`);
      if (purchase && !purchase.revoked) {
        emailHash = purchase.emailHash || null;
      } else {
        purchase = null;
      }
    }
    if (!purchase) {
      if (!EMAIL_RE.test(email)) {
        return Response.json(
          { error: "Enter the email you bought the guide with — that's how we match you to your purchase." },
          { status: 400 },
        );
      }
      emailHash = hashBuyerEmail(email);
      purchase = await writeClient.fetch(
        `*[_type == "purchase" && emailHash == $hash && revoked != true && guideSlug == $slug][0]{ _id }`,
        { hash: emailHash, slug: guideSlug },
      );
      if (!purchase) {
        return Response.json(
          {
            error:
              "We couldn't find a purchase of this guide under that email. " +
              "Check it matches your receipt — or write to hello@testedroutes.com and a person will sort it out.",
          },
          { status: 403 },
        );
      }
    }
  }

  const story = await writeClient.fetch(
    `*[_type == "story" && (guide.pageSlug == $slug || slug.current == $slug)][0]{ _id, title }`,
    { slug: guideSlug },
  );

  const doc = await writeClient.create({
    _type: "feedback",
    ...(story?._id ? { story: { _type: "reference", _ref: story._id } } : {}),
    guideSlug,
    submitterName: name || null,
    emailHash,
    body: message,
    source,
    status: "new",
    createdAt: new Date().toISOString(),
  });

  after(captureServer("feedback_submitted", { guide_slug: guideSlug }));

  // Notification + acknowledgment — best-effort, never fail the submission.
  after(
    (async () => {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.CONTACT_FROM_EMAIL;
      if (!apiKey || !from) {
        console.warn("[feedback] Resend not configured; doc saved, no emails sent");
        return;
      }
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const guideTitle = story?.title || guideSlug;
      try {
        await resend.emails.send({
          from,
          to: ["hello@testedroutes.com"],
          // Reply-to is the identity channel: the address is deliberately
          // not in Sanity, so this email is where it lives.
          ...(EMAIL_RE.test(email) ? { replyTo: email } : {}),
          subject: `[Guide feedback] ${guideTitle}`,
          text:
            (source === "pdf-qr"
              ? `Feedback via the PDF QR on ${guideTitle} (open form, not purchase-verified).\n\n`
              : `Verified buyer feedback on ${guideTitle}.\n\n`) +
            `From: ${name || "(no name given)"}${EMAIL_RE.test(email) ? ` <${email}>` : source === "pdf-qr" ? " (no email left)" : " (via token)"}\n\n` +
            `${message}\n\n` +
            `Triage doc: ${doc._id} (Studio -> Feedback). Reply to this email to answer them directly.`,
        });
      } catch (err) {
        console.error("[feedback] founder notification failed:", err);
      }
      if (EMAIL_RE.test(email)) {
        try {
          await resend.emails.send({
            from,
            to: [email],
            replyTo: "hello@testedroutes.com",
            subject: `Got it – your note on ${guideTitle}`,
            text:
              `Thanks for flagging this – your note reached a person, not a queue.\n\n` +
              `We typically respond within 24 hours, and if what you spotted checks ` +
              `out, it fixes the guide for the next traveller. That's exactly how ` +
              `this is supposed to work.\n\n` +
              `Your note:\n${message}\n\n` +
              `Paulius\nTestedRoutes – Skip the research. Take the trip.`,
          });
        } catch (err) {
          console.error("[feedback] acknowledgment failed:", err);
        }
      }
    })(),
  );

  return Response.json({ ok: true });
}

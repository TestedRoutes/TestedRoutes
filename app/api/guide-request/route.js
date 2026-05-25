/**
 * Guide-request: someone wants a guide for a destination not yet in the
 * catalog. Subscribes the email to Beehiiv (source of truth) AND emails
 * Paulius the destination so he can prioritise. Resend notification is
 * best-effort — Beehiiv must succeed for the request to be considered saved.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — silently 200 obvious bots.
  if (typeof body?.website === "string" && body.website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  const email = String(body?.email || "").trim().toLowerCase().slice(0, 200);
  const destination = String(body?.destination || "").trim().slice(0, 200);

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (destination.length < 2) {
    return Response.json({ error: "Tell me where you'd like to go." }, { status: 400 });
  }

  const beehiivKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!beehiivKey || !publicationId) {
    return Response.json({ error: "Request form is not configured yet." }, { status: 500 });
  }

  const subRes = await fetch(
    `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${beehiivKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "testedroutes.com",
        utm_medium: "home-guide-request",
        custom_fields: [{ name: "requested_destination", value: destination }],
      }),
    },
  );

  if (!subRes.ok) {
    const text = await subRes.text().catch(() => "");
    console.error(`[guide-request beehiiv] ${subRes.status} ${text}`);
    if (subRes.status === 429) {
      return Response.json({ error: "Too many requests, try again shortly." }, { status: 429 });
    }
    return Response.json({ error: "Could not save your request right now." }, { status: 502 });
  }

  try {
    await notifyPaulius({ email, destination });
  } catch (err) {
    console.error("[guide-request resend]", err);
  }

  return Response.json({ ok: true });
}

async function notifyPaulius({ email, destination }) {
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
    subject: `[Guide request] ${destination}`,
    text:
      `New guide request from the home page.\n\n` +
      `Destination: ${destination}\n` +
      `Email:       ${email}\n\n` +
      `Submitted via testedroutes.com at ${new Date().toISOString()}`,
  });
  if (result?.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
}

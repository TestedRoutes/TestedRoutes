/**
 * Contact form receiver.
 *
 * POST body: { name, email, topic, message, website (honeypot) }
 *   topic: "general" | "refund" | "privacy" | "partnership" | "security"
 *
 * Behaviour:
 *   - Honeypot (`website` field): bots fill it; real humans don't see it.
 *     If non-empty, we silently 200-acknowledge without sending or logging.
 *   - Validates email shape, message length (10..5000), topic enum.
 *   - If RESEND_API_KEY + CONTACT_FROM_EMAIL are set, sends via Resend to
 *     CONTACT_TO_EMAIL (fallback: hello@testedroutes.com).
 *   - If Resend is not configured, returns 503 with a friendly message —
 *     the form falls back to showing direct email addresses.
 *
 * Why Resend specifically: aligns with Polar's stack (their Sub-processors
 * doc names Resend) and has the simplest free tier for low-volume
 * transactional email (3,000/month, 100/day). Sending domain (likely
 * notifications@testedroutes.com) needs DKIM + SPF DNS records in
 * Namecheap before this works in production.
 *
 * Env:
 *   RESEND_API_KEY        Resend dashboard → API Keys
 *   CONTACT_FROM_EMAIL    e.g. "TestedRoutes <notifications@testedroutes.com>"
 *   CONTACT_TO_EMAIL      defaults to hello@testedroutes.com if unset
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ["general", "refund", "privacy", "partnership", "security"];

const TOPIC_LABELS = {
  general: "General inquiry",
  refund: "Refund request",
  privacy: "Privacy / data request",
  partnership: "Partnership / press",
  security: "Security disclosure",
};

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

  const name = String(body?.name || "").trim().slice(0, 200);
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 200);
  const topic = String(body?.topic || "general").trim().toLowerCase();
  const message = String(body?.message || "").trim().slice(0, 5000);

  if (!name) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!TOPICS.includes(topic)) {
    return Response.json({ error: "Please select a topic." }, { status: 400 });
  }
  if (message.length < 10) {
    return Response.json({ error: "Please write a slightly longer message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "hello@testedroutes.com";

  if (!apiKey || !from) {
    console.warn("[contact] Resend not configured; form submission ignored");
    return Response.json(
      {
        error:
          "Our contact form isn't fully wired up yet. Please email us directly at hello@testedroutes.com – we'll get back to you within two business days.",
      },
      { status: 503 },
    );
  }

  const subject = `[${TOPIC_LABELS[topic] || topic}] Contact form: ${name}`;
  const text =
    `Topic: ${TOPIC_LABELS[topic] || topic}\n` +
    `From: ${name} <${email}>\n\n` +
    `--\n${message}\n--\n\n` +
    `Submitted via testedroutes.com/contact at ${new Date().toISOString()}`;

  try {
    // Lazy-load Resend so it doesn't ship in bundles that don't need it.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text,
    });
    if (result?.error) {
      console.error("[contact] Resend error:", result.error);
      return Response.json(
        { error: "Could not send your message right now. Try again shortly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send threw:", err);
    return Response.json(
      { error: "Could not send your message right now. Try again shortly." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

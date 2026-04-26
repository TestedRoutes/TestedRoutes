/**
 * Beehiiv newsletter subscribe.
 *
 * Body: { email, source?, language? }
 *   email     required
 *   source    optional, e.g. "footer" | "story-end" | "top-banner"
 *   language  optional, e.g. "en" | "de" | "lt"
 *
 * Beehiiv handles double opt-in (configured publication-side), so a successful
 * call here means "confirmation email sent", not "subscribed".
 *
 * Env:
 *   BEEHIIV_API_KEY
 *   BEEHIIV_PUBLICATION_ID  (starts with pub_…)
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    return Response.json(
      { error: "Newsletter is not configured." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const source = typeof body?.source === "string" ? body.source.slice(0, 40) : undefined;
  const language = typeof body?.language === "string" ? body.language.slice(0, 8) : undefined;

  const payload = {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: "testedroutes.com",
    utm_medium: source || "site",
    ...(language ? { custom_fields: [{ name: "language", value: language }] } : {}),
  };

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[beehiiv] ${res.status} ${text}`);
    if (res.status === 429) {
      return Response.json({ error: "Too many requests, try again shortly." }, { status: 429 });
    }
    return Response.json({ error: "Could not subscribe right now." }, { status: 502 });
  }

  return Response.json({ ok: true });
}

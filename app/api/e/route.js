/**
 * Anonymous pageview beacon.
 *
 * This exists for one reason: to keep the conversion rate from being a lie.
 *
 * checkout_started is captured server-side in /api/checkout, so it sees
 * 100% of buy attempts. If the matching view count came from consent-gated
 * PostHog instead, it would see only the share of visitors who accepted
 * analytics — call it half. Dividing a complete numerator by a half-sized
 * denominator doesn't produce a slightly noisy conversion rate, it produces
 * one that is roughly double the truth, every day, in a way that looks
 * entirely plausible on a dashboard. Numerator and denominator have to be
 * collected the same way or the ratio is meaningless.
 *
 * So this endpoint mirrors serverAnalytics exactly: no cookie, no stored
 * IP, no identifier, nothing that links two requests to one person. It is
 * the same anonymous-statistics basis the privacy policy describes, not a
 * loophole around the consent banner — the consent-gated PostHog SDK still
 * handles everything that needs to know who you are across a visit.
 *
 * Deliberately not a GET: a URL that records an event is a URL that gets
 * recorded by prefetchers, crawlers and link previewers.
 */
import { captureServer, requestContext } from "../../_lib/serverAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Only events this endpoint is allowed to produce. Without a whitelist, a
 * public capture endpoint lets anyone invent event names and pollute the
 * dataset — and unlike bad rows in a database, you cannot cleanly delete
 * event history once it is in.
 */
const ALLOWED_EVENTS = new Set(["guide_view"]);

/**
 * Per-instance rate limit. Worth being honest about what this is: Vercel
 * gives each serverless instance its own memory and recycles instances
 * freely, so a determined abuser gets a fresh bucket on every cold start.
 * It stops a runaway client loop or a bored visitor holding down refresh,
 * which is the realistic threat; it is not a defence against someone who
 * actually wants to skew the numbers. Doing that properly needs shared
 * state (Vercel KV), which is not worth adding at this traffic level.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const hits = new Map();

function rateLimited(key) {
  const now = Date.now();
  const bucket = hits.get(key);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    // Opportunistic sweep so the Map can't grow without bound on a
    // long-lived instance.
    if (hits.size > 5000) {
      for (const [k, v] of hits) {
        if (now - v.start > RATE_LIMIT_WINDOW_MS) hits.delete(k);
      }
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function safeSlug(value) {
  const slug = String(value || "").toLowerCase().trim();
  return /^[a-z0-9-]{1,80}$/.test(slug) ? slug : null;
}

/** Cap any free-text dimension so nobody can write essays into a property. */
function safeLabel(value, max = 120) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request) {
  // The IP is used to bucket the rate limiter for the length of one request
  // and is never written into an event or stored anywhere.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const event = String(body?.event || "");
  if (!ALLOWED_EVENTS.has(event)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Country only. requestContext also derives referrer_host, but on a
  // same-origin fetch the Referer header is the guide page itself — taking
  // it here would label every visit as referred by testedroutes.com and
  // erase the acquisition source entirely.
  const { country } = requestContext(request);

  await captureServer(event, {
    guide_slug: safeSlug(body?.slug),
    country,
    // The client reads document.referrer instead, which is the real
    // external origin of the visit.
    referrer_host: safeLabel(body?.referrer_host, 120),
    utm_source: safeLabel(body?.utm_source, 60),
    utm_medium: safeLabel(body?.utm_medium, 60),
    utm_campaign: safeLabel(body?.utm_campaign, 120),
  });

  return Response.json({ ok: true });
}

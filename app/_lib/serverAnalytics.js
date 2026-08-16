/**
 * Server-side, deliberately anonymous event capture.
 *
 * Why this exists at all: the two events that matter most commercially
 * cannot be captured from the browser. A QR code in a printed guide hits
 * /go/<slug>, which 302s server-side before any JS runs — there is no page
 * to run a tracker on. And /api/checkout redirects straight to Polar, so a
 * client-side "buy click" handler would have to be duplicated across the
 * six-plus CTAs that all funnel through that one route. One capture in the
 * route covers every button, forever, including buttons nobody has built yet.
 *
 * Why it does not need consent: every event sent through here is anonymous
 * *by construction*, not by policy. There is no cookie, no stored IP, and
 * no identifier that could link two events to the same person — the
 * distinct_id is fresh random bytes per event and is never persisted
 * anywhere. What lands in PostHog is a count of things that happened, which
 * is statistics rather than personal data. The privacy policy describes this
 * explicitly under "Anonymous usage statistics"; if you ever change the
 * distinct_id to something stable, that stops being true and the consent
 * gate has to come back with it.
 *
 * The cost of that choice, which you have to remember when reading numbers:
 * PostHog's funnel and retention tooling is useless on these events, because
 * every event is its own "person". Conversion has to be computed as a ratio
 * of totals by the nightly rollup, and a ratio of totals is not the same
 * statistic as "share of visitors who went on to buy". Close enough to steer
 * by at this volume; not the same number.
 *
 * Consent-gated client-side PostHog (app/_components/PostHogProvider.jsx)
 * is untouched by this and still does the rich work — autocapture, session
 * behaviour, anything that needs a stable identity across a visit.
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

/**
 * Pull the request-scoped context worth recording. Country only — Vercel
 * also offers city and region headers, and we deliberately don't take them:
 * city plus timestamp plus a guide slug starts to look like a person, and
 * the whole legal basis here rests on that not being possible.
 *
 * @param {Request} request
 * @returns {{country: string|null, referrer_host: string|null}}
 */
export function requestContext(request) {
  const country = request?.headers?.get("x-vercel-ip-country") || null;
  let referrerHost = null;
  const referer = request?.headers?.get("referer");
  if (referer) {
    try {
      referrerHost = new URL(referer).host || null;
    } catch {
      // Malformed Referer headers are common from scanners; ignore.
    }
  }
  return { country, referrer_host: referrerHost };
}

/**
 * Send one event to PostHog and wait for it.
 *
 * Deliberately a raw awaited fetch rather than posthog-node. The Node SDK
 * queues events and flushes them on a timer or at process exit; a Vercel
 * serverless function is frozen the moment its response is returned, so a
 * queued event that hasn't flushed yet is simply lost — silently, and more
 * often under low traffic, which is exactly when you are watching the
 * numbers most closely. One awaited round trip cannot be dropped that way.
 *
 * Never throws and never rejects: a checkout redirect must not fail because
 * an analytics host is having a bad day. Callers can `await` this without
 * defending against it.
 *
 * @param {string} event      Event name, e.g. "checkout_started"
 * @param {object} properties Event properties. Keep them non-identifying.
 * @returns {Promise<boolean>} true if PostHog accepted the event
 */
export async function captureServer(event, properties = {}) {
  if (!POSTHOG_KEY) {
    // Unset in this environment (local dev, preview without env). Not an
    // error — the site must run fine without analytics configured.
    return false;
  }

  try {
    const res = await fetch(`${POSTHOG_HOST.replace(/\/$/, "")}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        // Fresh per event, never persisted. This is the line that makes the
        // whole thing anonymous — see the header comment before changing it.
        distinct_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        properties: {
          ...properties,
          // No person profile: PostHog stores the event and nothing else.
          // Also bills at the cheaper anonymous-event rate.
          $process_person_profile: false,
          // Discard the IP. Ours would be the Vercel function's anyway.
          $ip: null,
          // Without this, PostHog would geolocate that function IP and tag
          // every server event with whichever region Vercel happened to run
          // it in — not merely useless, actively misleading, since it would
          // look like real visitor geography. We send our own `country`
          // from the edge header instead.
          $geoip_disable: true,
          // Marks the events this module produces, so the rollup's HogQL can
          // separate them from consent-gated client-side events with the
          // same name and never double-count.
          tr_source: "server",
        },
      }),
      // Warm, this endpoint answers in well under 200ms. The timeout is
      // sized for a cold start instead: the first request an instance makes
      // pays DNS and a TLS handshake on top of whatever the platform is
      // already doing, and a tighter budget (2.5s was the first guess)
      // drops exactly those first events — the ones from the quiet periods
      // where every data point matters most. Nothing user-facing waits on
      // this call: every caller either overlaps it with other work or
      // defers it with after().
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[analytics] ${event} rejected ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[analytics] ${event} threw:`, err);
    return false;
  }
}

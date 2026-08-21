/**
 * PostHog read side — HogQL queries for the nightly rollup.
 *
 * Two things about the host, because getting either wrong produces a 404
 * that looks like an auth problem:
 *
 *   1. Reads and writes live on different hosts. Events are ingested at
 *      eu.i.posthog.com (the value in NEXT_PUBLIC_POSTHOG_HOST); the query
 *      API is on eu.posthog.com. We derive one from the other by dropping
 *      the `i.` label, with POSTHOG_API_HOST as the escape hatch for
 *      self-hosted or proxied setups.
 *   2. The two also take different credentials. Ingest uses the public
 *      project key; querying needs a *personal* API key with read scope,
 *      which is a secret and must never reach the browser — hence
 *      POSTHOG_PERSONAL_API_KEY with no NEXT_PUBLIC_ prefix.
 *
 * Every query here filters on `properties.tr_source = 'server'` where it
 * matters. Client-side PostHog can emit events with the same names, and
 * counting both would double a number that half the visitors never
 * contribute to — worse than either source alone, because the error varies
 * with the consent rate.
 */

const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

function apiHost() {
  if (process.env.POSTHOG_API_HOST) {
    return process.env.POSTHOG_API_HOST.replace(/\/$/, "");
  }
  const ingest =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
  return ingest.replace(/\/$/, "").replace("://eu.i.", "://eu.").replace("://us.i.", "://us.");
}

export function posthogConfigured() {
  return Boolean(PROJECT_ID && PERSONAL_KEY);
}

/**
 * Run one HogQL query and return rows as arrays.
 *
 * Values are passed through HogQL placeholders rather than interpolated
 * into the query string. The date range is computed by us and could be
 * interpolated safely today, but a query builder that takes strings is one
 * refactor away from taking a slug from a URL.
 *
 * @param {string} query  HogQL with {placeholder} references
 * @param {object} values Placeholder values
 * @returns {Promise<Array<Array>>}
 */
async function hogql(query, values = {}) {
  const res = await fetch(`${apiHost()}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PERSONAL_KEY}`,
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query, values } }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PostHog query ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  return Array.isArray(json?.results) ? json.results : [];
}

/** Shared WHERE clause fragment for a single UTC day. */
const DAY_RANGE =
  "timestamp >= toDateTime({start}) AND timestamp < toDateTime({end})";

/**
 * A note on null-filtering, learned the hard way: exclude empty property
 * values in WHERE, never with `HAVING <alias> IS NOT NULL`.
 *
 * HogQL happily accepts a SELECT alias in GROUP BY, but referencing that
 * same alias in HAVING re-expands it into the raw property lookup, which is
 * then neither an aggregate nor a group key — ClickHouse rejects the whole
 * query with `not_an_aggregate`. Filtering before the grouping avoids the
 * problem entirely and scans less data on the way.
 */

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v) => (typeof v === "string" && v ? v : null);

/**
 * The funnel, one row per guide.
 *
 * views and checkout_starts are both server-captured, so their ratio is a
 * like-for-like comparison. orders come from the Polar webhook, which is
 * also server-side. All three share the same coverage — that is the whole
 * reason the beacon in /api/e exists.
 */
export async function fetchPerGuide({ start, end }) {
  const rows = await hogql(
    `SELECT
       properties.guide_slug AS slug,
       countIf(event = 'guide_view') AS views,
       countIf(event = 'checkout_started') AS checkout_starts,
       countIf(event = 'order_paid') AS orders,
       countIf(event = 'order_refunded') AS refunds,
       toInt(
         sumIf(toFloat(properties.amount_cents), event = 'order_paid')
         - sumIf(toFloat(properties.amount_cents), event = 'order_refunded')
       ) AS revenue_cents,
       any(if(event = 'order_paid', properties.currency, NULL)) AS currency
     FROM events
     WHERE ${DAY_RANGE}
       AND event IN ('guide_view', 'checkout_started', 'order_paid', 'order_refunded')
       AND properties.tr_source = 'server'
       AND properties.guide_slug IS NOT NULL
     GROUP BY slug
     ORDER BY views DESC
     LIMIT 200`,
    { start, end },
  );
  return rows.map((r) => ({
    slug: str(r[0]),
    views: num(r[1]),
    checkoutStarts: num(r[2]),
    orders: num(r[3]),
    refunds: num(r[4]),
    // Net of same-day refunds. A refund landing on a later day than its
    // sale still can't be netted here — each snapshot only sees its own
    // window — which is why Polar's own totals stay the authority for
    // money and this figure is the per-guide approximation.
    revenueCents: num(r[5]),
    currency: str(r[6]),
  }));
}

/** QR scans and short-link clicks, split by resolution branch. */
export async function fetchGoLinks({ start, end }) {
  const rows = await hogql(
    `SELECT properties.slug AS slug, properties.kind AS kind, count() AS clicks
     FROM events
     WHERE ${DAY_RANGE} AND event = 'go_link_click'
     GROUP BY slug, kind
     ORDER BY clicks DESC
     LIMIT 200`,
    { start, end },
  );
  return rows.map((r) => ({
    slug: str(r[0]),
    kind: str(r[1]),
    clicks: num(r[2]),
  }));
}

/**
 * Traffic totals and breakdowns.
 *
 * Country and source come off guide_view rather than $pageview: guide_view
 * is server-captured and therefore complete, while $pageview only exists
 * for visitors who accepted the consent banner. The $pageview total is kept
 * anyway, because comparing the two is how the rollup measures the consent
 * rate — which is the number that tells you how much of the client-side
 * data you are missing.
 */
export async function fetchTraffic({ start, end }) {
  const [totals, byCountry, bySource] = await Promise.all([
    hogql(
      `SELECT
         countIf(event = '$pageview') AS pageviews,
         countIf(event = 'guide_view' AND properties.tr_source = 'server') AS guide_views
       FROM events
       WHERE ${DAY_RANGE}`,
      { start, end },
    ),
    hogql(
      `SELECT properties.country AS country, count() AS c
       FROM events
       WHERE ${DAY_RANGE} AND event = 'guide_view' AND properties.tr_source = 'server'
       GROUP BY country
       ORDER BY c DESC
       LIMIT 40`,
      { start, end },
    ),
    hogql(
      `SELECT
         coalesce(
           nullIf(properties.utm_source, ''),
           nullIf(properties.referrer_host, ''),
           'direct'
         ) AS source,
         count() AS c
       FROM events
       WHERE ${DAY_RANGE} AND event = 'guide_view' AND properties.tr_source = 'server'
       GROUP BY source
       ORDER BY c DESC
       LIMIT 40`,
      { start, end },
    ),
  ]);

  return {
    pageviews: num(totals?.[0]?.[0]),
    guideViews: num(totals?.[0]?.[1]),
    byCountry: byCountry.map((r) => ({ country: str(r[0]), count: num(r[1]) })),
    bySource: bySource.map((r) => ({ source: str(r[0]), count: num(r[1]) })),
  };
}

/**
 * Consent-gated client events: newsletter signups and homepage guide
 * requests.
 *
 * These undercount by whatever share of visitors declines analytics, and
 * there is no server-side equivalent to fix that — both are captured from
 * form handlers in the browser. Treat them as a floor and a trend, never as
 * a total. The guide-request destinations in particular are the most direct
 * "what should I build next" signal the site produces, and nothing has been
 * reading them.
 */
export async function fetchEngagement({ start, end }) {
  const [signups, requests] = await Promise.all([
    hogql(
      `SELECT count() FROM events
       WHERE ${DAY_RANGE} AND event = 'newsletter_signup'`,
      { start, end },
    ),
    hogql(
      `SELECT properties.destination AS destination, count() AS c
       FROM events
       WHERE ${DAY_RANGE} AND event = 'guide_request'
         AND properties.destination IS NOT NULL
       GROUP BY destination
       ORDER BY c DESC
       LIMIT 50`,
      { start, end },
    ),
  ]);

  return {
    newsletterSignups: num(signups?.[0]?.[0]),
    guideRequests: requests.map((r) => ({
      destination: str(r[0]),
      count: num(r[1]),
    })),
  };
}

/**
 * Nightly analytics rollup.
 *
 * Runs at 04:00 UTC (see vercel.json), queries every source for the
 * previous UTC day, and writes one analyticsSnapshot document to Sanity.
 * The morning agent reads those documents; nothing downstream talks to
 * PostHog, Polar, Sentry or Google directly.
 *
 * Two design rules, both learned from how reports like this usually fail:
 *
 *   **Partial beats absent.** Every source is wrapped independently. If
 *   Search Console 403s, the snapshot still lands with traffic and revenue
 *   intact and a note in sourceErrors. A rollup that gives up entirely
 *   because one API was slow leaves a hole in the history that can never be
 *   backfilled, since most of these APIs won't serve old data.
 *
 *   **Never let a gap look like a zero.** A missing source records an error
 *   string, not a 0. Zero traffic and unmeasured traffic are completely
 *   different pieces of news, and the dashboard has to be able to tell them
 *   apart.
 *
 * Manual run / backfill:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://testedroutes.com/api/cron/analytics-rollup?date=2026-08-15"
 *
 * Env:
 *   CRON_SECRET               shared secret; Vercel Cron sends it automatically
 *   POSTHOG_PROJECT_ID        + POSTHOG_PERSONAL_API_KEY (read scope)
 *   POLAR_ACCESS_TOKEN        needs `orders:read` on top of the checkout scopes
 *   SENTRY_AUTH_TOKEN         + SENTRY_ORG + SENTRY_PROJECT  (optional)
 *   GSC_SERVICE_ACCOUNT_JSON  + GSC_SITE_URL                 (optional)
 *   SANITY_API_WRITE_TOKEN    Editor permission
 */
import { writeClient } from "../../../../sanity/lib/writeClient";
import {
  posthogConfigured,
  fetchPerGuide,
  fetchGoLinks,
  fetchTraffic,
  fetchEngagement,
} from "../../../_lib/analytics/posthog";
import { fetchPolarOrders } from "../../../_lib/analytics/polar";
import { sentryConfigured, fetchNewIssues } from "../../../_lib/analytics/sentry";
import {
  searchConsoleConfigured,
  fetchSearchConsole,
} from "../../../_lib/analytics/searchConsole";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Four upstream APIs, some of them slow. The default 10s would turn a
// sluggish Search Console into a nightly false alarm.
export const maxDuration = 120;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Resolve which UTC day to roll up. Defaults to yesterday: the job runs at
 * 04:00 UTC precisely so that "yesterday" is closed everywhere in Europe
 * before we ask about it.
 */
function resolveDay(dateParam) {
  let day;
  if (dateParam && DATE_RE.test(dateParam)) {
    day = new Date(`${dateParam}T00:00:00Z`);
    if (Number.isNaN(day.getTime())) return null;
  } else if (dateParam) {
    return null;
  } else {
    const now = new Date();
    day = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
    );
  }
  const start = day.toISOString();
  const end = new Date(day.getTime() + 86_400_000).toISOString();
  return { date: start.slice(0, 10), start, end };
}

/**
 * Run one source, converting any failure into a labelled error string
 * instead of letting it abort the whole rollup.
 */
async function attempt(label, fn, errors) {
  try {
    return await fn();
  } catch (err) {
    const message = `${label}: ${err?.message || String(err)}`;
    console.error(`[analytics-rollup] ${message}`);
    errors.push(message);
    return null;
  }
}

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }
  // Vercel Cron sends this header automatically; a manual backfill has to
  // supply it by hand.
  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const day = resolveDay(url.searchParams.get("date"));
  if (!day) {
    return Response.json(
      { error: "Invalid date; expected YYYY-MM-DD" },
      { status: 400 },
    );
  }
  const { date, start, end } = day;
  const sourceErrors = [];

  // PostHog is the only source without a graceful degradation story: with
  // no events there is no funnel, and the snapshot is barely worth writing.
  // It still writes one, so the gap in the history is explicit.
  if (!posthogConfigured()) {
    sourceErrors.push(
      "posthog: POSTHOG_PROJECT_ID / POSTHOG_PERSONAL_API_KEY not configured",
    );
  }

  const [perGuide, goLinks, traffic, engagement, polarOrders, errors, search] =
    await Promise.all([
      posthogConfigured()
        ? attempt("posthog.perGuide", () => fetchPerGuide({ start, end }), sourceErrors)
        : null,
      posthogConfigured()
        ? attempt("posthog.goLinks", () => fetchGoLinks({ start, end }), sourceErrors)
        : null,
      posthogConfigured()
        ? attempt("posthog.traffic", () => fetchTraffic({ start, end }), sourceErrors)
        : null,
      posthogConfigured()
        ? attempt("posthog.engagement", () => fetchEngagement({ start, end }), sourceErrors)
        : null,
      attempt("polar.orders", () => fetchPolarOrders({ start, end }), sourceErrors),
      sentryConfigured()
        ? attempt("sentry.newIssues", () => fetchNewIssues({ start }), sourceErrors)
        : null,
      searchConsoleConfigured()
        ? attempt("searchConsole", () => fetchSearchConsole(date), sourceErrors)
        : null,
    ]);

  // Reconcile the two independent views of the same sales. The webhook
  // path is what actually drives purchase counts and Beehiiv tagging, so a
  // shortfall against Polar's own figure is not a reporting nit — it means
  // a real buyer got no tag and the guide's counter never moved.
  if (perGuide && polarOrders) {
    const webhookOrders = perGuide.reduce((sum, g) => sum + (g.orders || 0), 0);
    if (webhookOrders !== polarOrders.orders) {
      sourceErrors.push(
        `reconcile: Polar reported ${polarOrders.orders} orders, webhooks recorded ${webhookOrders}`,
      );
    }
    // Per-guide revenue nets off refunds captured on the same day, but a
    // refund arriving days after its sale lands in a window the original
    // order isn't in. Flagging the count keeps that skew visible instead of
    // letting the two revenue figures disagree silently.
    const webhookRefunds = perGuide.reduce((sum, g) => sum + (g.refunds || 0), 0);
    if (polarOrders.refunded !== webhookRefunds) {
      sourceErrors.push(
        `refunds: Polar reported ${polarOrders.refunded}, webhooks recorded ${webhookRefunds} — per-guide revenue may be gross of the difference`,
      );
    }
  }
  if (polarOrders?.truncated) {
    sourceErrors.push("polar: order paging hit its page cap; totals may be short");
  }

  const doc = {
    _id: `analytics.${date}`,
    _type: "analyticsSnapshot",
    date,
    generatedAt: new Date().toISOString(),
    traffic: traffic || undefined,
    revenue: polarOrders
      ? {
          orders: polarOrders.orders,
          refunded: polarOrders.refunded,
          grossCents: polarOrders.grossCents,
          netCents: polarOrders.netCents,
        }
      : undefined,
    perGuide: perGuide || undefined,
    goLinks: goLinks || undefined,
    guideRequests: engagement?.guideRequests || undefined,
    newsletterSignups: engagement?.newsletterSignups,
    search: search || undefined,
    errors: errors || undefined,
    sourceErrors,
  };

  try {
    // createOrReplace, not patch: these documents are machine-owned and a
    // re-run must produce the same result rather than doubling arrays. See
    // the schema header — the patch-don't-replace rule that governs content
    // documents exists to protect human edits, and there are none here.
    await writeClient.createOrReplace(doc);
  } catch (err) {
    console.error("[analytics-rollup] Sanity write failed:", err);
    return Response.json(
      { error: "snapshot write failed", message: String(err?.message || err) },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    date,
    guides: perGuide?.length ?? 0,
    orders: polarOrders?.orders ?? null,
    sourceErrors,
  });
}

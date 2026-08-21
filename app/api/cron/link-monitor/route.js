/**
 * Weekly guide-link monitor (Tracker #64). Runs Monday 05:00 UTC
 * (vercel.json) and GETs every destination a printed QR or guide link can
 * reach: the curated /go/ map plus every affiliateLink doc (default URL and
 * regional overrides). Report-only by explicit founder decision 2026-05-02:
 * one broken link must never hinder the sales process, so nothing here
 * flips a story status, unpublishes anything, or touches any document —
 * the entire output is one email to hello@, and only when something is
 * actually broken. A quiet week sends nothing.
 *
 * Classification is the hard-won lesson of the 2026-08-20 hand audit
 * (which this cron productionizes): most "failures" a bot sees are bot
 * defenses, not breakage. Booking.com answers 202, GetYourGuide/Sixt/
 * NordVPN answer 403, Facebook answers 400 — all fine in a real browser.
 * So: 2xx/3xx is OK; 202/403/405/429 (and anything from facebook.com) is
 * counted as bot-blocked and never alarmed; 404/410, DNS failures and
 * timeouts are hard-broken; other 4xx/5xx are "suspect" — windegghuette.ch
 * 500s to plain fetch while serving browsers happily, so suspects are
 * reported with a verify-in-browser caveat rather than as fact.
 *
 * Manual run:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://testedroutes.com/api/cron/link-monitor?dry=1"
 *   (dry=1 skips the email and just returns the JSON report.)
 *
 * Env: CRON_SECRET; RESEND_API_KEY + CONTACT_FROM_EMAIL for the email leg.
 */
import { client } from "../../../../sanity/lib/client";
import { CURATED } from "../../../_lib/curatedGoLinks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// ~450 destination GETs at concurrency 12 with an 8s cap: comfortably under
// this, but network weather happens and a truncated sweep reads as healthy.
export const maxDuration = 300;

// Deliberately broken and known about — founder decision 2026-08-21: no
// affiliates or gear links in the launch, so the dead Trift gear targets
// stay dead on purpose and must not cry wolf every Monday. Remove these
// when the affiliate park lifts.
const IGNORED_SLUGS = new Set([
  "triftbrucke-hiking-boots",
  "triftbrucke-trekking-poles",
  "triftbrucke-day-hike-kit",
]);

// Statuses that mean "this site dislikes robots", not "this site is down".
const BOT_BLOCK_STATUSES = new Set([202, 403, 405, 429]);
// Hosts that answer bots with arbitrary errors while serving people fine.
const BOT_HOSTILE_HOSTS = ["facebook.com", "www.facebook.com"];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function probe(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctl.signal,
      headers: { "user-agent": UA, accept: "*/*" },
    });
    return { status: res.status };
  } catch (err) {
    return { status: 0, error: String(err?.cause?.code || err?.name || err).slice(0, 60) };
  } finally {
    clearTimeout(t);
  }
}

function classify(target, result) {
  let host = "";
  try {
    host = new URL(target.url).host;
  } catch {
    return "hard"; // a malformed registered URL is broken by definition
  }
  if (BOT_HOSTILE_HOSTS.includes(host)) return "ok";
  const s = result.status;
  if (s >= 200 && s < 400 && s !== 202) return "ok";
  if (BOT_BLOCK_STATUSES.has(s)) return "bot-blocked";
  if (s === 404 || s === 410) return "hard";
  if (s === 0) {
    // Network-level failures are not all equal. DNS is definitive — the
    // domain is gone for everyone. TLS trust errors are usually the site's
    // missing intermediate cert, which browsers repair via AIA fetching and
    // Node does not, so a browser check tends to pass. Timeouts are what
    // bot-hostile CDNs do instead of answering. Only DNS is "hard".
    const e = String(result.error || "");
    if (e.includes("ENOTFOUND") || e.includes("EAI_AGAIN")) return "hard";
    return "suspect";
  }
  return "suspect";
}

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dry = new URL(request.url).searchParams.get("dry") === "1";

  const affiliate = await client.fetch(
    `*[_type == "affiliateLink"]{ "slug": slug.current, url, "regions": regions[]{region, url} }`,
  );
  const targets = [
    ...Object.entries(CURATED).map(([slug, url]) => ({ slug, url, kind: "curated" })),
    ...affiliate.flatMap((l) => [
      { slug: l.slug, url: l.url, kind: "affiliate" },
      ...(l.regions || []).map((r) => ({
        slug: `${l.slug} [${r.region}]`,
        url: r.url,
        kind: "affiliate-region",
        baseSlug: l.slug,
      })),
    ]),
  ].filter((t) => t.url && !IGNORED_SLUGS.has(t.baseSlug || t.slug));

  // A slug registered both curated and in Sanity (the resolution orders
  // overlap by design) would otherwise be probed and reported twice.
  const seen = new Set();
  const deduped = targets.filter((t) => {
    const key = `${t.slug}|${t.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const results = [];
  const queue = [...deduped];
  async function worker() {
    while (queue.length) {
      const t = queue.shift();
      let r = await probe(t.url);
      // One retry for network-level failures: transient DNS hiccups and
      // slow cold responses otherwise show up as weekly noise.
      if (r.status === 0) r = await probe(t.url);
      results.push({ ...t, ...r, verdict: classify(t, r) });
    }
  }
  await Promise.all(Array.from({ length: 12 }, worker));

  const hard = results.filter((r) => r.verdict === "hard");
  const suspect = results.filter((r) => r.verdict === "suspect");
  const summary = {
    checked: results.length,
    ok: results.filter((r) => r.verdict === "ok").length,
    botBlocked: results.filter((r) => r.verdict === "bot-blocked").length,
    ignored: IGNORED_SLUGS.size,
    hard: hard.map(({ slug, url, status, error }) => ({ slug, url, status, error })),
    suspect: suspect.map(({ slug, url, status }) => ({ slug, url, status })),
  };

  // Email on HARD breakage only. The suspect list is environmental noise in
  // practice (TLS-chain quirks, bot-hostile CDNs, servers that 500 to
  // robots while serving people) — the 2026-08-21 shakedown run produced
  // four suspects, all fine in a real browser. A weekly email listing them
  // would train the reader to ignore the report; instead they ride along as
  // an appendix whenever a real breakage sends one, and are always in the
  // JSON for a manual check.
  if (hard.length && !dry) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    if (apiKey && from) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const lines = [
        `Weekly guide-link sweep: ${summary.checked} destinations checked, ` +
          `${summary.ok} fine, ${summary.botBlocked} bot-blocked (normal).`,
        "",
        ...(hard.length
          ? [
              `BROKEN (${hard.length}) - dead for everyone, needs a re-point:`,
              ...hard.map((r) => `  ${r.slug}  ->  ${r.url}  (${r.status || r.error})`),
              "",
            ]
          : []),
        ...(suspect.length
          ? [
              `SUSPECT (${suspect.length}) - errored to our probe but may serve browsers; ` +
                "open each in a browser before acting:",
              ...suspect.map((r) => `  ${r.slug}  ->  ${r.url}  (${r.status})`),
              "",
            ]
          : []),
        "Re-point affiliate slugs in Studio -> Affiliate links; curated slugs in",
        "app/_lib/curatedGoLinks.js. Nothing has been changed automatically.",
      ];
      try {
        await resend.emails.send({
          from,
          to: ["hello@testedroutes.com"],
          subject: `[Link monitor] ${hard.length} broken, ${suspect.length} suspect`,
          text: lines.join("\n"),
        });
      } catch (err) {
        console.error("[link-monitor] report email failed:", err);
      }
    } else {
      console.warn("[link-monitor] Resend not configured; findings only in logs:", summary);
    }
  }

  return Response.json(summary);
}

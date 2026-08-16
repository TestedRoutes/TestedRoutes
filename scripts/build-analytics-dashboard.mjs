#!/usr/bin/env node
/**
 * Render the analytics dashboard from stored snapshots.
 *
 *   node --env-file=.env.local scripts/build-analytics-dashboard.mjs
 *   node --env-file=.env.local scripts/build-analytics-dashboard.mjs --days 60
 *
 * Reads analyticsSnapshot documents from Sanity, writes a single
 * self-contained HTML file (default analytics/dashboard.html), and prints a
 * compact JSON digest to stdout. The morning agent consumes that digest to
 * write its commentary, then publishes the HTML as an artifact — which is
 * why the numbers go to stdout rather than the agent re-deriving them by
 * scraping the page it just generated.
 *
 * Runs locally, never in a remote session: reading Sanity needs
 * SANITY_API_WRITE_TOKEN out of .env.local.
 *
 * The one rule this file exists to enforce: **a gap is not a zero.** Every
 * metric here can be absent for three quite different reasons — nothing
 * happened, nothing was measured, or a source errored — and a dashboard that
 * renders all three as a flat line at zero is worse than no dashboard,
 * because it invites confident conclusions from missing data. Each renders
 * differently and says which it is.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * The day server-side instrumentation went live (PR #77). Funnel metrics for
 * earlier dates are *unmeasured*, not zero — the beacon and the checkout
 * capture did not exist yet, so those snapshots legitimately contain 0 for
 * guide views and checkout starts while real traffic was happening.
 *
 * A hard constant rather than "first day with a non-zero count", because
 * that heuristic silently reclassifies a genuinely quiet day as
 * pre-instrumentation and the error is invisible.
 */
const INSTRUMENTED_FROM = "2026-08-16";

const args = process.argv.slice(2);
const argVal = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const DAYS = Number(argVal("--days", "30"));
const OUT = resolve(argVal("--out", "analytics/dashboard.html"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity env. Run with: node --env-file=.env.local scripts/build-analytics-dashboard.mjs",
  );
  process.exit(1);
}

// ── Load ────────────────────────────────────────────────────────────────

async function loadSnapshots() {
  const groq = `*[_type == "analyticsSnapshot"] | order(date desc) [0...${DAYS}] {
    date, generatedAt, traffic, revenue, perGuide, goLinks,
    guideRequests, newsletterSignups, search, errors, sourceErrors
  }`;
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Sanity query ${res.status}: ${await res.text()}`);
  const { result } = await res.json();
  // Oldest first for charting.
  return (result || []).slice().reverse();
}

// ── Derive ──────────────────────────────────────────────────────────────

const n = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const measured = (date) => date >= INSTRUMENTED_FROM;

/**
 * Mean of the N days before the latest one. Returns null rather than 0 when
 * there is nothing to average — "no baseline yet" and "baseline of zero" are
 * different claims and only one of them justifies a percentage.
 */
function trailingMean(rows, pick, days) {
  const window = rows.slice(-(days + 1), -1);
  if (!window.length) return null;
  const sum = window.reduce((acc, r) => acc + n(pick(r)), 0);
  return sum / window.length;
}

function delta(current, baseline) {
  if (baseline === null || baseline === 0) return null;
  return ((current - baseline) / baseline) * 100;
}

function derive(rows) {
  const latest = rows[rows.length - 1] || null;
  if (!latest) return { latest: null, rows };

  const pv = (r) => r.traffic?.pageviews;
  const gv = (r) => r.traffic?.guideViews;
  const net = (r) => r.revenue?.netCents;

  const measuredRows = rows.filter((r) => measured(r.date));
  const funnel = measuredRows.reduce(
    (acc, r) => {
      for (const g of r.perGuide || []) {
        acc.views += n(g.views);
        acc.starts += n(g.checkoutStarts);
        acc.orders += n(g.orders);
      }
      return acc;
    },
    { views: 0, starts: 0, orders: 0 },
  );

  // Per-guide totals across the measured window, so a guide with one view a
  // day for a week is visible next to one that had seven in an afternoon.
  const byGuide = new Map();
  for (const r of measuredRows) {
    for (const g of r.perGuide || []) {
      if (!g.slug) continue;
      const e = byGuide.get(g.slug) || {
        slug: g.slug, views: 0, starts: 0, orders: 0, revenueCents: 0,
      };
      e.views += n(g.views);
      e.starts += n(g.checkoutStarts);
      e.orders += n(g.orders);
      e.revenueCents += n(g.revenueCents);
      byGuide.set(g.slug, e);
    }
  }

  const byGoLink = new Map();
  for (const r of measuredRows) {
    for (const l of r.goLinks || []) {
      if (!l.slug) continue;
      const key = `${l.slug}|${l.kind}`;
      const e = byGoLink.get(key) || { slug: l.slug, kind: l.kind, clicks: 0 };
      e.clicks += n(l.clicks);
      byGoLink.set(key, e);
    }
  }

  const byRequest = new Map();
  for (const r of rows) {
    for (const q of r.guideRequests || []) {
      if (!q.destination) continue;
      byRequest.set(q.destination, (byRequest.get(q.destination) || 0) + n(q.count));
    }
  }

  return {
    rows,
    latest,
    measuredFrom: INSTRUMENTED_FROM,
    measuredDays: measuredRows.length,
    pageviews: {
      today: n(pv(latest)),
      d7: trailingMean(rows, pv, 7),
      d28: trailingMean(rows, pv, 28),
    },
    guideViews: { today: n(gv(latest)), d7: trailingMean(measuredRows, gv, 7) },
    revenue: {
      todayNetCents: n(net(latest)),
      todayGrossCents: n(latest.revenue?.grossCents),
      orders: n(latest.revenue?.orders),
      refunded: n(latest.revenue?.refunded),
      windowNetCents: rows.reduce((a, r) => a + n(net(r)), 0),
      windowOrders: rows.reduce((a, r) => a + n(r.revenue?.orders), 0),
      windowRefunded: rows.reduce((a, r) => a + n(r.revenue?.refunded), 0),
    },
    funnel,
    guides: [...byGuide.values()].sort((a, b) => b.views - a.views),
    goLinks: [...byGoLink.values()].sort((a, b) => b.clicks - a.clicks),
    requests: [...byRequest.entries()]
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count),
    newsletter: rows.reduce((a, r) => a + n(r.newsletterSignups), 0),
    search: latest.search || null,
    sourceErrors: latest.sourceErrors || [],
  };
}

// ── Render helpers ──────────────────────────────────────────────────────

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const money = (cents) => `€${(n(cents) / 100).toFixed(2)}`;
const pct = (x) => (x === null ? "—" : `${x >= 0 ? "+" : ""}${x.toFixed(0)}%`);
const rate = (num, den) => (den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "—");

/**
 * Line chart, hand-rolled SVG.
 *
 * No chart library: the published page runs under a CSP that blocks every
 * external host, so anything not inlined simply doesn't load. One series, so
 * no legend — the title names it (dataviz: a legend for a single series is
 * noise). Crosshair and tooltip are wired up in the page script.
 */
function lineChart(rows, pick, { id, label }) {
  const W = 960, H = 260;
  const M = { top: 16, right: 16, bottom: 28, left: 44 };
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;

  const values = rows.map((r) => n(pick(r)));
  const max = Math.max(1, ...values);
  // Round the axis top to something a human would pick.
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;

  const x = (i) => M.left + (rows.length === 1 ? iw / 2 : (i / (rows.length - 1)) * iw);
  const y = (v) => M.top + ih - (v / top) * ih;

  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(values.length - 1).toFixed(1)},${(M.top + ih).toFixed(1)} L${x(0).toFixed(1)},${(M.top + ih).toFixed(1)} Z`;

  const ticks = [0, top / 2, top].map(
    (v) =>
      `<line class="grid" x1="${M.left}" x2="${W - M.right}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/>
       <text class="tick" x="${M.left - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${Math.round(v)}</text>`,
  ).join("");

  // Date labels: first, middle, last only — a tick per day collides below
  // about 900px and the exact date lives in the tooltip anyway.
  const labelIdx = rows.length > 2 ? [0, Math.floor(rows.length / 2), rows.length - 1] : rows.map((_, i) => i);
  const dateLabels = labelIdx.map((i) => {
    const anchor = i === 0 ? "start" : i === rows.length - 1 ? "end" : "middle";
    return `<text class="tick" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="${anchor}">${esc(rows[i].date.slice(5))}</text>`;
  }).join("");

  const points = rows.map((r, i) =>
    `<circle class="pt" cx="${x(i).toFixed(1)}" cy="${y(values[i]).toFixed(1)}" r="3"
       data-i="${i}" data-date="${esc(r.date)}" data-value="${values[i]}"/>`,
  ).join("");

  // Emphasised endpoint. The latest value is the one the reader came for, so
  // it is marked and labelled rather than left to be found by hovering — the
  // one direct label on the chart, which is what keeps it a label and not
  // noise.
  const lastI = values.length - 1;
  const lastV = values[lastI];
  const labelAbove = y(lastV) > M.top + 24;
  const endpoint = `
    <circle class="pt-last" cx="${x(lastI).toFixed(1)}" cy="${y(lastV).toFixed(1)}" r="4.5"/>
    <text class="pt-last-label" x="${x(lastI).toFixed(1)}"
          y="${(y(lastV) + (labelAbove ? -12 : 20)).toFixed(1)}"
          text-anchor="end">${lastV}</text>`;

  return `
  <figure class="chart" id="${id}">
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img"
         aria-label="${esc(label)} over ${rows.length} days">
      ${ticks}
      <path class="area" d="${area}"/>
      <path class="line" d="${line}"/>
      ${points}
      ${endpoint}
      <line class="crosshair" y1="${M.top}" y2="${M.top + ih}" x1="0" x2="0" style="opacity:0"/>
      <rect class="hit" x="${M.left}" y="${M.top}" width="${iw}" height="${ih}" fill="transparent"/>
      ${dateLabels}
    </svg>
    <div class="tooltip" hidden></div>
  </figure>`;
}

function statTile({ label, value, sub, delta: d, tone }) {
  const dCls = d === null || d === undefined ? "" : d >= 0 ? "up" : "down";
  const dTxt = d === null || d === undefined ? "" :
    `<span class="delta ${dCls}">${d >= 0 ? "▲" : "▼"} ${pct(d)}</span>`;
  return `
    <div class="tile${tone ? ` tone-${tone}` : ""}">
      <div class="tile-label">${esc(label)}</div>
      <div class="tile-value">${value}</div>
      <div class="tile-sub">${sub || ""} ${dTxt}</div>
    </div>`;
}

/** An honest empty state. Says which kind of nothing this is. */
function empty(reason) {
  return `<p class="empty">${esc(reason)}</p>`;
}

// ── Page ────────────────────────────────────────────────────────────────

function renderPage(d, commentary) {
  const rows = d.rows;
  const latestDate = d.latest.date;

  const guideRows = d.guides.length
    ? d.guides.map((g) => `
        <tr>
          <td class="slug">${esc(g.slug)}</td>
          <td class="num">${g.views}</td>
          <td class="num">${g.starts}</td>
          <td class="num">${rate(g.starts, g.views)}</td>
          <td class="num">${g.orders}</td>
          <td class="num">${rate(g.orders, g.starts)}</td>
          <td class="num">${money(g.revenueCents)}</td>
        </tr>`).join("")
    : "";

  const goRows = d.goLinks.length
    ? d.goLinks.map((l) => `
        <tr>
          <td class="slug">${esc(l.slug)}</td>
          <td><span class="pill pill-${esc(l.kind)}">${esc(l.kind)}</span></td>
          <td class="num">${l.clicks}</td>
        </tr>`).join("")
    : "";

  const unknownGo = d.goLinks.filter((l) => l.kind === "unknown");

  return `<title>TestedRoutes Daily</title>
<style>
  /* Light is the base; both dark scopes are declared explicitly so the
     viewer's toggle wins in either direction and OS-dark is covered. */
  :root {
    color-scheme: light;
    --surface-1: #fcfcfb;
    --page: #f9f9f7;
    --text-primary: #0b0b0b;
    --text-secondary: #52514e;
    --muted: #898781;
    --grid: #e1e0d9;
    --axis: #c3c2b7;
    --border: rgba(11,11,11,0.10);
    --series-1: #2a78d6;
    --series-1-fill: rgba(42,120,214,0.10);
    --good: #0ca30c;
    --good-text: #006300;
    --warning: #fab219;
    --critical: #d03b3b;
    --pill-bg: rgba(11,11,11,0.05);
  }
  @media (prefers-color-scheme: dark) {
    :root:where(:not([data-theme="light"])) {
      color-scheme: dark;
      --surface-1: #1a1a19;
      --page: #0d0d0d;
      --text-primary: #ffffff;
      --text-secondary: #c3c2b7;
      --muted: #898781;
      --grid: #2c2c2a;
      --axis: #383835;
      --border: rgba(255,255,255,0.10);
      --series-1: #3987e5;
      --series-1-fill: rgba(57,135,229,0.14);
      --good: #0ca30c;
      --good-text: #0ca30c;
      --warning: #fab219;
      --critical: #d03b3b;
      --pill-bg: rgba(255,255,255,0.07);
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --surface-1: #1a1a19;
    --page: #0d0d0d;
    --text-primary: #ffffff;
    --text-secondary: #c3c2b7;
    --muted: #898781;
    --grid: #2c2c2a;
    --axis: #383835;
    --border: rgba(255,255,255,0.10);
    --series-1: #3987e5;
    --series-1-fill: rgba(57,135,229,0.14);
    --good: #0ca30c;
    --good-text: #0ca30c;
    --warning: #fab219;
    --critical: #d03b3b;
    --pill-bg: rgba(255,255,255,0.07);
  }

  body {
    margin: 0;
    background: var(--page);
    color: var(--text-primary);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1040px; margin: 0 auto; padding: 32px 20px 64px; }
  header { margin-bottom: 24px; }
  h1 {
    font-size: 22px; font-weight: 600; margin: 0 0 4px;
    letter-spacing: -0.01em; text-wrap: balance;
  }
  .meta { color: var(--muted); font-size: 13px; }
  h2 {
    font-size: 13px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.07em; color: var(--text-secondary);
    margin: 36px 0 12px; text-wrap: balance;
  }
  .note { color: var(--muted); font-size: 12.5px; margin: -6px 0 12px; }

  .card {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
  }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
  .tile {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
  }
  .tile-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .tile-value { font-size: 26px; font-weight: 600; margin-top: 4px; letter-spacing: -0.02em; }
  .tile-sub { font-size: 12.5px; color: var(--text-secondary); margin-top: 2px; min-height: 18px; }
  .delta { font-weight: 600; }
  .delta.up { color: var(--good-text); }
  .delta.down { color: var(--critical); }

  .chart { margin: 0; position: relative; }
  .chart svg { width: 100%; height: auto; display: block; overflow: visible; }
  .grid { stroke: var(--grid); stroke-width: 1; }
  .tick { fill: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .area { fill: var(--series-1-fill); stroke: none; }
  .line { fill: none; stroke: var(--series-1); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .pt { fill: var(--series-1); stroke: var(--surface-1); stroke-width: 2; opacity: 0; transition: opacity .12s; }
  .pt.on { opacity: 1; }
  .pt-last { fill: var(--series-1); stroke: var(--surface-1); stroke-width: 2; }
  .pt-last-label {
    fill: var(--text-primary); font-size: 12px; font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  @media (prefers-reduced-motion: reduce) {
    .pt { transition: none; }
  }
  .crosshair { stroke: var(--axis); stroke-width: 1; stroke-dasharray: 3 3; }
  .tooltip {
    position: absolute; pointer-events: none;
    background: var(--surface-1); color: var(--text-primary);
    border: 1px solid var(--border); border-radius: 8px;
    padding: 6px 10px; font-size: 12.5px; white-space: nowrap;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12); transform: translate(-50%, -120%);
  }
  .tooltip b { font-variant-numeric: tabular-nums; }

  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  th, td { padding: 9px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  th { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.slug { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; }
  tbody tr:last-child td { border-bottom: none; }

  .pill {
    display: inline-block; padding: 1px 8px; border-radius: 999px;
    background: var(--pill-bg); font-size: 11.5px; color: var(--text-secondary);
  }
  .pill-unknown { background: rgba(208,59,59,0.14); color: var(--critical); font-weight: 600; }

  .empty { color: var(--muted); font-size: 13.5px; margin: 0; font-style: italic; }
  .flag {
    display: flex; gap: 9px; align-items: flex-start;
    font-size: 13px; padding: 9px 0; border-bottom: 1px solid var(--border);
  }
  .flag:last-child { border-bottom: none; }
  .flag-icon { flex: 0 0 auto; font-weight: 700; }
  .flag-warning .flag-icon { color: var(--warning); }
  .flag-critical .flag-icon { color: var(--critical); }
  .commentary { white-space: pre-wrap; font-size: 14.5px; line-height: 1.6; }
  footer { margin-top: 40px; color: var(--muted); font-size: 12px; }
</style>

<div class="wrap">
  <header>
    <h1>TestedRoutes Daily</h1>
    <div class="meta">
      Latest snapshot ${esc(latestDate)} · ${rows.length} days of history ·
      generated ${esc((d.latest.generatedAt || "").slice(0, 16).replace("T", " "))} UTC
    </div>
  </header>

  ${commentary ? `<section class="card"><div class="commentary">${esc(commentary)}</div></section>` : ""}

  <h2>Latest day</h2>
  <div class="tiles">
    ${statTile({
      label: "Pageviews",
      value: d.pageviews.today,
      sub: d.pageviews.d7 === null ? "no baseline" : `7-day avg ${d.pageviews.d7.toFixed(0)}`,
      delta: delta(d.pageviews.today, d.pageviews.d7),
    })}
    ${statTile({
      label: "Guide views",
      value: measured(latestDate) ? d.guideViews.today : "—",
      sub: measured(latestDate) ? "server-measured" : "not measured yet",
    })}
    ${statTile({
      label: "Orders",
      value: d.revenue.orders,
      sub: d.revenue.refunded ? `${d.revenue.refunded} refunded` : "",
    })}
    ${statTile({
      label: "Net revenue",
      value: money(d.revenue.todayNetCents),
      sub: `gross ${money(d.revenue.todayGrossCents)}`,
    })}
  </div>

  <h2>Pageviews</h2>
  <p class="note">
    All visitors, cookie-free. Independent of the consent banner, so this is the
    complete traffic number rather than the consented subset.
  </p>
  <div class="card">
    ${rows.length > 1 ? lineChart(rows, (r) => r.traffic?.pageviews, { id: "pv", label: "Pageviews" })
      : empty("Needs at least two snapshots to draw a trend.")}
  </div>

  <h2>Guide funnel</h2>
  <p class="note">
    Views → checkout starts → orders, ${d.measuredDays === 0 ? "once measurement begins" : `over ${d.measuredDays} measured day${d.measuredDays === 1 ? "" : "s"} since ${esc(d.measuredFrom)}`}.
    Rates are ratios of totals, not per-person conversion — these events carry no
    stable identity by design, so "3 of 100 views" is not the same claim as
    "3% of visitors".
  </p>
  <div class="card scroll">
    ${guideRows ? `
      <table>
        <thead><tr>
          <th>Guide</th><th class="num">Views</th><th class="num">Starts</th>
          <th class="num">View→Start</th><th class="num">Orders</th>
          <th class="num">Start→Order</th><th class="num">Revenue</th>
        </tr></thead>
        <tbody>${guideRows}</tbody>
      </table>`
      : empty(
          d.measuredDays === 0
            ? `No measured days yet. Instrumentation went live ${INSTRUMENTED_FROM}; earlier snapshots predate it, so their zeroes mean "not recorded", not "nobody looked".`
            : "No guide activity recorded in the measured window.",
        )}
  </div>

  <h2>QR scans and short links</h2>
  <p class="note">
    Every QR printed inside a guide resolves through /go/. An
    <span class="pill pill-unknown">unknown</span> row is a printed code that
    resolves to nothing — a paying reader who scanned and landed nowhere.
  </p>
  <div class="card scroll">
    ${goRows ? `
      <table>
        <thead><tr><th>Slug</th><th>Kind</th><th class="num">Clicks</th></tr></thead>
        <tbody>${goRows}</tbody>
      </table>`
      : empty("No short-link traffic in the measured window.")}
  </div>

  <h2>Requested destinations</h2>
  <p class="note">What visitors asked for on the homepage — demand for guides that don't exist yet.</p>
  <div class="card">
    ${d.requests.length
      ? `<table><thead><tr><th>Destination</th><th class="num">Requests</th></tr></thead>
         <tbody>${d.requests.map((r) => `<tr><td>${esc(r.destination)}</td><td class="num">${r.count}</td></tr>`).join("")}</tbody></table>`
      : empty("No requests in this window. (Consent-gated — undercounts by whatever share declines analytics.)")}
  </div>

  <h2>Search</h2>
  <div class="card">
    ${d.search
      ? `<p class="note" style="margin-top:0">Google finalises search data 2–3 days late. These figures are for
         <strong>${esc(d.search.dataDate)}</strong>, not ${esc(latestDate)}.</p>
         <div class="tiles">
           ${statTile({ label: "Clicks", value: n(d.search.clicks) })}
           ${statTile({ label: "Impressions", value: n(d.search.impressions) })}
         </div>`
      : empty("Search Console not configured — no GCP service account yet. This is unconfigured, not zero search traffic.")}
  </div>

  <h2>Data quality</h2>
  <div class="card">
    ${d.sourceErrors.length
      ? d.sourceErrors.map((e) => {
          const critical = /reconcile|refunds/.test(e);
          return `<div class="flag flag-${critical ? "critical" : "warning"}">
            <span class="flag-icon">${critical ? "!" : "▲"}</span>
            <span>${esc(e)}</span></div>`;
        }).join("")
      : `<div class="flag"><span class="flag-icon" style="color:var(--good)">✓</span>
         <span>All sources reported cleanly.</span></div>`}
    ${unknownGo.length
      ? `<div class="flag flag-critical"><span class="flag-icon">!</span>
         <span>${unknownGo.length} unregistered /go/ slug${unknownGo.length === 1 ? "" : "s"} scanned:
         ${unknownGo.map((l) => esc(l.slug)).join(", ")}</span></div>`
      : ""}
  </div>

  <footer>
    Generated by scripts/build-analytics-dashboard.mjs from analyticsSnapshot
    documents in Sanity. Funnel metrics begin ${esc(INSTRUMENTED_FROM)};
    earlier dates show traffic only.
  </footer>
</div>

<script>
(function () {
  document.querySelectorAll(".chart").forEach(function (fig) {
    var svg = fig.querySelector("svg");
    var hit = fig.querySelector(".hit");
    var cross = fig.querySelector(".crosshair");
    var tip = fig.querySelector(".tooltip");
    var pts = Array.prototype.slice.call(fig.querySelectorAll(".pt"));
    if (!hit || !pts.length) return;

    function nearest(clientX) {
      var box = svg.getBoundingClientRect();
      var scale = 960 / box.width;
      var vx = (clientX - box.left) * scale;
      var best = pts[0], bestD = Infinity;
      pts.forEach(function (p) {
        var d = Math.abs(parseFloat(p.getAttribute("cx")) - vx);
        if (d < bestD) { bestD = d; best = p; }
      });
      return best;
    }

    function show(e) {
      var p = nearest(e.clientX);
      pts.forEach(function (q) { q.classList.remove("on"); });
      p.classList.add("on");
      var cx = parseFloat(p.getAttribute("cx"));
      cross.setAttribute("x1", cx); cross.setAttribute("x2", cx);
      cross.style.opacity = 1;
      var box = svg.getBoundingClientRect();
      var ratio = box.width / 960;
      tip.innerHTML = p.getAttribute("data-date") + " &middot; <b>" +
        p.getAttribute("data-value") + "</b>";
      tip.style.left = (cx * ratio) + "px";
      tip.style.top = (parseFloat(p.getAttribute("cy")) * (box.height / 260)) + "px";
      tip.hidden = false;
    }
    function hide() {
      pts.forEach(function (q) { q.classList.remove("on"); });
      cross.style.opacity = 0;
      tip.hidden = true;
    }
    hit.addEventListener("mousemove", show);
    hit.addEventListener("mouseleave", hide);
    hit.addEventListener("touchstart", function (e) { show(e.touches[0]); }, { passive: true });
    hit.addEventListener("touchmove", function (e) { show(e.touches[0]); }, { passive: true });
    hit.addEventListener("touchend", hide);
  });
})();
</script>`;
}

// ── Main ────────────────────────────────────────────────────────────────

const snapshots = await loadSnapshots();
if (!snapshots.length) {
  console.error("No analyticsSnapshot documents found. Has the nightly cron run?");
  process.exit(1);
}

const d = derive(snapshots);

// Commentary is supplied by the morning agent, not written here — this
// script's job is numbers, and a script that also invents prose about them
// would be guessing at exactly the part a human should own.
//
// --commentary-file is the option to reach for: commentary runs to several
// lines, and multi-line text through a shell argument is where quoting goes
// wrong differently on every platform.
const commentaryFile = argVal("--commentary-file", "");
const commentaryArg = commentaryFile
  ? readFileSync(resolve(commentaryFile), "utf8").trim()
  : argVal("--commentary", "");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, renderPage(d, commentaryArg), "utf8");

// Digest for the agent. Deliberately small: the agent needs the shape of the
// day, not every row it can already see in the page.
const digest = {
  latestDate: d.latest.date,
  daysOfHistory: d.rows.length,
  measuredFrom: d.measuredFrom,
  measuredDays: d.measuredDays,
  pageviews: {
    today: d.pageviews.today,
    trailing7: d.pageviews.d7 === null ? null : Math.round(d.pageviews.d7 * 10) / 10,
    trailing28: d.pageviews.d28 === null ? null : Math.round(d.pageviews.d28 * 10) / 10,
    deltaVs7pct: (() => { const x = delta(d.pageviews.today, d.pageviews.d7); return x === null ? null : Math.round(x); })(),
  },
  revenue: d.revenue,
  funnelWindow: d.funnel,
  topGuides: d.guides.slice(0, 8),
  goLinks: d.goLinks.slice(0, 12),
  unknownGoSlugs: d.goLinks.filter((l) => l.kind === "unknown").map((l) => l.slug),
  requests: d.requests.slice(0, 10),
  newsletterWindow: d.newsletter,
  search: d.search,
  sourceErrors: d.sourceErrors,
  outputPath: OUT,
};
console.log(JSON.stringify(digest, null, 2));

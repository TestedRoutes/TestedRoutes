/**
 * Sentry read side — how many new ways the site broke yesterday.
 *
 * Deliberately counts *new* issues rather than total events: a known noisy
 * error firing a thousand times is not news, a novel one firing twice is.
 *
 * Needs a Sentry auth token with `project:read`. Separate from the DSN the
 * app already uses to send errors — that one only writes.
 */
const SENTRY_HOST = process.env.SENTRY_HOST || "https://sentry.io";

export function sentryConfigured() {
  return Boolean(
    process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT,
  );
}

export async function fetchNewIssues({ start }) {
  const org = process.env.SENTRY_ORG;
  const project = process.env.SENTRY_PROJECT;
  const token = process.env.SENTRY_AUTH_TOKEN;

  const url = new URL(
    `${SENTRY_HOST}/api/0/projects/${encodeURIComponent(org)}/${encodeURIComponent(project)}/issues/`,
  );
  url.searchParams.set("statsPeriod", "24h");
  url.searchParams.set("query", `firstSeen:>=${start}`);
  url.searchParams.set("limit", "25");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Sentry ${res.status}: ${text.slice(0, 200)}`);
  }
  const issues = await res.json();
  if (!Array.isArray(issues)) return { newIssues: 0, topIssues: [] };

  return {
    newIssues: issues.length,
    topIssues: issues.slice(0, 10).map((i) => ({
      title: String(i?.title || "").slice(0, 200),
      count: Number(i?.count) || 0,
      url: i?.permalink || null,
    })),
  };
}

/**
 * Google Search Console read side — what people searched before they got
 * here, which is the only signal in this whole system that describes demand
 * we are not yet meeting. Everything else measures people who already found
 * the site.
 *
 * Two things to know before reading any number this produces:
 *
 *   1. **It lags.** Search Console finalises data two to three days behind.
 *      There is no "yesterday" to fetch. This module deliberately asks for
 *      a day three back and returns that date in `dataDate`, so the caller
 *      can label it. An unlabelled search block sitting next to yesterday's
 *      traffic reads as a catastrophic drop, every single morning.
 *   2. **Google has already anonymised it.** Queries arrive pre-aggregated,
 *      with rare ones withheld precisely so individuals can't be identified.
 *      We never see who searched, which is why this needs no consent story
 *      beyond naming Google as a processor.
 *
 * Auth is a service-account JWT signed here rather than via `googleapis`.
 * That library pulls in a very large dependency tree for what is, at the
 * end of it, one RS256 signature and two fetches — and this runs inside a
 * serverless function where cold-start size is not free.
 *
 * Setup, which is manual and has to happen before any of this works:
 *   1. Create a GCP project and a service account; download its JSON key.
 *   2. Enable the "Google Search Console API" on that project.
 *   3. In Search Console → Settings → Users and permissions, add the
 *      service account's client_email as a Full user on the property.
 *      Step 3 is the one everybody forgets; without it the API returns a
 *      403 that reads like a scope problem.
 *   4. base64 the JSON key into GSC_SERVICE_ACCOUNT_JSON, and set
 *      GSC_SITE_URL to the property exactly as Search Console lists it —
 *      "https://testedroutes.com/" for a URL-prefix property, or
 *      "sc-domain:testedroutes.com" for a domain property. These are
 *      different properties with different data; the wrong one 403s.
 */
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
/** Search Console finalises data ~2 days back; 3 is the safe ask. */
export const SEARCH_LAG_DAYS = 3;

export function searchConsoleConfigured() {
  return Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON && process.env.GSC_SITE_URL,
  );
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function serviceAccount() {
  const raw = Buffer.from(
    process.env.GSC_SERVICE_ACCOUNT_JSON,
    "base64",
  ).toString("utf8");
  const parsed = JSON.parse(raw);
  if (!parsed?.client_email || !parsed?.private_key) {
    throw new Error("GSC service account JSON missing client_email/private_key");
  }
  return parsed;
}

/** Sign a JWT assertion and trade it for a short-lived access token. */
async function accessToken() {
  const { client_email, private_key } = serviceAccount();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  // Private keys pasted through env vars routinely arrive with literal
  // backslash-n instead of real newlines, which makes the PEM unparseable.
  const pem = private_key.replace(/\\n/g, "\n");
  const signature = signer.sign(pem, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google token ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  if (!json?.access_token) throw new Error("Google token response had no access_token");
  return json.access_token;
}

async function query(token, body) {
  const site = encodeURIComponent(process.env.GSC_SITE_URL);
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Search Console ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * @param {string} snapshotDate The rollup's own date (YYYY-MM-DD). The
 *   search window is derived backwards from it, not equal to it.
 */
export async function fetchSearchConsole(snapshotDate) {
  const target = new Date(`${snapshotDate}T00:00:00Z`);
  target.setUTCDate(target.getUTCDate() - SEARCH_LAG_DAYS);
  const dataDate = target.toISOString().slice(0, 10);

  const token = await accessToken();
  const window = { startDate: dataDate, endDate: dataDate };

  const [totals, queries, pages] = await Promise.all([
    query(token, { ...window, dimensions: [] }),
    query(token, { ...window, dimensions: ["query"], rowLimit: 25 }),
    query(token, { ...window, dimensions: ["page"], rowLimit: 25 }),
  ]);

  const totalRow = totals?.rows?.[0];

  return {
    dataDate,
    clicks: Math.round(totalRow?.clicks || 0),
    impressions: Math.round(totalRow?.impressions || 0),
    topQueries: (queries?.rows || []).map((r) => ({
      query: r.keys?.[0] || null,
      clicks: Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
      // Rounded to one decimal: Google returns fifteen, and the extra
      // digits imply a precision that average-position does not have.
      position: Math.round((r.position || 0) * 10) / 10,
    })),
    topPages: (pages?.rows || []).map((r) => ({
      page: r.keys?.[0] || null,
      clicks: Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
    })),
  };
}

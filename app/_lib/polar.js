/**
 * Shared Polar SDK client for API routes.
 *
 * Env:
 *   POLAR_ACCESS_TOKEN  organization access token (Polar dashboard →
 *                       Settings → Developers). Scopes: products,
 *                       checkouts, webhooks, discounts.
 *   POLAR_SERVER        "sandbox" or "production" — the only switch
 *                       needed to move between environments.
 */
import { Polar } from "@polar-sh/sdk";
import { HTTPClient } from "@polar-sh/sdk/lib/http";

export const POLAR_SERVER =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

/**
 * The Polar API contract every request is pinned to.
 *
 * Polar introduced date-based versioning in September 2026 (email of
 * 2026-09-11): a request with no `Polar-Version` header gets whatever
 * version is "Current", and Current rolls over in the first week of
 * January, April, July and October. The first rollover is 2026-10-01, when
 * 2026-10 becomes the default and 2026-04 — the contract this integration
 * was written against — becomes Deprecated but keeps serving pinned
 * requests until the January 2027 release removes it. Without the pin the
 * checkout route and the nightly order reconciliation would silently move
 * to a contract nobody here has tested, on a date nobody here chose.
 *
 * Bumping this constant IS the migration: change it to the next version,
 * exercise checkout + webhooks + `sync-polar-products.mjs` against it, and
 * do so before the version named here is removed. Note the webhook payload
 * version is not controlled by this header — it is a property of the
 * endpoint in the Polar dashboard — so check that separately when you bump.
 */
export const POLAR_API_VERSION = "2026-04";

/**
 * Build a Polar client whose every request carries the version pin. Used
 * by the API routes (below) and by the local content scripts, which
 * authenticate with a different token but must speak the same contract.
 */
export function createPolarClient({ accessToken, server = POLAR_SERVER }) {
  const httpClient = new HTTPClient();
  httpClient.addHook("beforeRequest", (req) => {
    req.headers.set("Polar-Version", POLAR_API_VERSION);
    return req;
  });
  return new Polar({ accessToken, server, httpClient });
}

export const polar = process.env.POLAR_ACCESS_TOKEN
  ? createPolarClient({ accessToken: process.env.POLAR_ACCESS_TOKEN })
  : null;

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

export const POLAR_SERVER =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

export const polar = process.env.POLAR_ACCESS_TOKEN
  ? new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: POLAR_SERVER,
    })
  : null;

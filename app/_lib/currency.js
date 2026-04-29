/**
 * Currency selection — Sanity remains the source of truth for prices, this
 * just picks which entry from each guide's price array to display.
 *
 * Resolution order:
 *   1. `tr_currency` cookie (set by the manual <CurrencySwitcher />)
 *   2. Vercel's `x-vercel-ip-country` header → mapped country
 *   3. EUR (org default)
 *
 * Polar's checkout independently geo-detects, so display and checkout
 * normally match. A user who manually overrides to a non-local currency
 * may see Polar default back to their local currency at checkout — known
 * minor inconsistency for v1; not worth wiring through.
 */
import { cookies, headers } from "next/headers";

export const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP", "CHF"];
export const DEFAULT_CURRENCY = "EUR";
export const CURRENCY_COOKIE = "tr_currency";

const COUNTRY_TO_CURRENCY = {
  // Eurozone
  AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR", FI: "EUR",
  FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR", LU: "EUR",
  LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR",
  // United States
  US: "USD",
  // United Kingdom
  GB: "GBP",
  // Switzerland & Liechtenstein
  CH: "CHF", LI: "CHF",
};

export async function getRequestCurrency() {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(CURRENCY_COOKIE)?.value;
  if (fromCookie && SUPPORTED_CURRENCIES.includes(fromCookie)) {
    return fromCookie;
  }
  const headerStore = await headers();
  const country = headerStore.get("x-vercel-ip-country");
  if (country && COUNTRY_TO_CURRENCY[country]) {
    return COUNTRY_TO_CURRENCY[country];
  }
  return DEFAULT_CURRENCY;
}

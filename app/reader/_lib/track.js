/**
 * Anonymous server-side reader measurement, on the same footing as the
 * checkout and /go/ captures: no cookie, no consent, no identifier (see
 * app/_lib/serverAnalytics.js for why that makes it statistics rather than
 * personal data). The reader shows no cookie banner, so client PostHog never
 * initialises there; this is the only signal from these pages.
 *
 * Runs after the response with next/server's after(), so a slow analytics
 * host never delays a page.
 */
import { after } from "next/server";
import { captureServer } from "../../_lib/serverAnalytics";

/**
 * @param {string} country   country slug ("fiji")
 * @param {string} surface   "storefront" | "spots" | "spot" | "itineraries" | "itinerary" | "day" | "bookings" | "pack" | "tips"
 * @param {object} extra     non-identifying properties (route slug, day number)
 */
export function trackReaderView(country, surface, extra = {}) {
  try {
    after(() => captureServer("reader_page_view", { country, surface, ...extra }));
  } catch {
    // after() throws outside a request scope (unit tests); a view is not
    // worth a crash.
  }
}

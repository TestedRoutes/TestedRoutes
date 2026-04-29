/**
 * Polar checkout entry point.
 *
 * Buyer hits /api/checkout?products=<polarProductId> from the Get-the-Guide
 * button. The adapter creates a Polar checkout session and 302-redirects to
 * the hosted Polar checkout. After payment Polar redirects to successUrl,
 * substituting {CHECKOUT_ID}.
 *
 * Env:
 *   POLAR_ACCESS_TOKEN     organization access token from Polar dashboard
 *   POLAR_SERVER           "sandbox" or "production"
 *   NEXT_PUBLIC_SITE_URL   e.g. https://testedroutes.com (used for successUrl)
 */
import { Checkout } from "@polar-sh/nextjs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("[polar-checkout] POLAR_ACCESS_TOKEN is not set");
}

const checkoutHandler = ACCESS_TOKEN
  ? Checkout({
      accessToken: ACCESS_TOKEN,
      successUrl: `${baseUrl}/guides/thanks?checkout_id={CHECKOUT_ID}`,
      server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
    })
  : null;

export async function GET(request) {
  if (!checkoutHandler) {
    return Response.json(
      { error: "POLAR_ACCESS_TOKEN not configured in deployed environment" },
      { status: 503 },
    );
  }
  try {
    return await checkoutHandler(request);
  } catch (err) {
    console.error("[polar-checkout] handler threw:", err);
    return Response.json(
      { error: "checkout handler error", message: String(err?.message || err) },
      { status: 500 },
    );
  }
}

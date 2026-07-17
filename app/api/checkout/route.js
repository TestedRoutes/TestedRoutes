/**
 * Polar checkout entry point.
 *
 * Buyer hits /api/checkout?products=<polarProductId> from the Get-the-Guide
 * button. We create a Polar checkout session via the SDK and 302-redirect to
 * the hosted Polar checkout. After payment Polar redirects to successUrl,
 * substituting {CHECKOUT_ID}.
 *
 * Env:
 *   POLAR_ACCESS_TOKEN     organization access token from Polar dashboard
 *   POLAR_SERVER           "sandbox" or "production"
 *   NEXT_PUBLIC_SITE_URL   e.g. https://testedroutes.com (used for successUrl)
 */
import { polar } from "../../_lib/polar";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!polar) {
  console.error("[polar-checkout] POLAR_ACCESS_TOKEN is not set");
}

export async function GET(request) {
  if (!polar) {
    return Response.json(
      { error: "POLAR_ACCESS_TOKEN not configured in deployed environment" },
      { status: 503 },
    );
  }
  const products = new URL(request.url).searchParams.getAll("products");
  if (products.length === 0) {
    return Response.json(
      { error: "Missing products in query params" },
      { status: 400 },
    );
  }
  try {
    const checkout = await polar.checkouts.create({
      products,
      successUrl: `${baseUrl}/guides/thanks?checkout_id={CHECKOUT_ID}`,
    });
    return Response.redirect(checkout.url, 302);
  } catch (err) {
    console.error("[polar-checkout] checkout create threw:", err);
    return Response.json(
      { error: "checkout handler error", message: String(err?.message || err) },
      { status: 500 },
    );
  }
}

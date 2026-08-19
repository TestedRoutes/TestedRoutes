/**
 * Polar checkout entry point.
 *
 * Buyer hits /api/checkout?products=<polarProductId> from the Get-the-Guide
 * button. We create a Polar checkout session via the SDK and 302-redirect to
 * the hosted Polar checkout. After payment Polar redirects to successUrl,
 * substituting {CHECKOUT_ID}.
 *
 * Also the single choke point for `checkout_started`. Every buy CTA on the
 * site ends up here, so one anonymous capture in this route measures buying
 * intent across all of them — including CTAs added later, which is why the
 * event lives here rather than on the buttons.
 *
 * Env:
 *   POLAR_ACCESS_TOKEN     organization access token from Polar dashboard
 *   POLAR_SERVER           "sandbox" or "production"
 *   NEXT_PUBLIC_SITE_URL   e.g. https://testedroutes.com (used for successUrl)
 */
import { after } from "next/server";
import { polar } from "../../_lib/polar";
import { captureServer, requestContext } from "../../_lib/serverAnalytics";
import { getRequestCurrency } from "../../_lib/currency";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * `g` is the guide slug, attached by checkoutHrefFor() purely so this route
 * can label the event. It is attacker-controllable like any query param, so
 * it gets shape-checked and length-capped before it is allowed to become a
 * property value — an unbounded string here would let anyone write junk
 * dimensions into the analytics dataset.
 */
function safeSlug(value) {
  const slug = String(value || "").toLowerCase().trim();
  return /^[a-z0-9-]{1,80}$/.test(slug) ? slug : null;
}

// Polar product ids are UUIDs. Anything else is garbage we should reject
// before it reaches the Polar API rather than surfacing as a 500.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * `products` is attacker-controllable like `g`, but it decides what the
 * checkout actually sells, so it gets held to the catalogue: only product
 * ids that a published guide carries in Sanity may reach Polar. Without
 * this, any product id in the Polar org — retired SKUs, test products —
 * could be checked out through the site.
 *
 * Fails open on a catalogue outage: checkout is the money path, and
 * refusing every sale because Sanity is briefly unreachable is worse than
 * skipping the allow-list for those requests. The UUID shape check above
 * still applies either way.
 */
async function filterToKnownProducts(products) {
  let known = null;
  try {
    const { loadGuides } = await import("../../_lib/loadGuides");
    const guides = await loadGuides();
    known = new Set(guides.map((g) => g.polarProductId).filter(Boolean));
  } catch (err) {
    console.error("[polar-checkout] catalogue lookup failed, skipping allow-list:", err);
    return products;
  }
  return products.filter((id) => known.has(id));
}

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
  const params = new URL(request.url).searchParams;
  // Cap at 5 before any work happens: legitimate checkouts carry one id
  // (Polar has no multi-item cart), so a long list is never a real buyer.
  const rawProducts = params.getAll("products").slice(0, 5);
  const wellFormed = rawProducts.filter((id) => UUID_RE.test(String(id)));
  if (wellFormed.length === 0) {
    return Response.json(
      { error: "Missing or malformed products in query params" },
      { status: 400 },
    );
  }
  const products = await filterToKnownProducts(wellFormed);
  if (products.length === 0) {
    return Response.json(
      { error: "Unknown product" },
      { status: 400 },
    );
  }
  const currency = await getRequestCurrency();

  // Deferred with after() so the buyer's redirect never waits on an
  // analytics round trip, and so the capture can afford a cold-start-sized
  // timeout without that cost landing on someone trying to give us money.
  //
  // Scheduled before the Polar call, not after, so it fires for the
  // *attempt*. A Polar outage then shows up as checkout starts with no
  // matching orders — which is the point. A funnel that quietly drops its
  // own failures is the one shape of this report that could hide a
  // revenue-losing bug behind a healthy-looking conversion rate.
  after(
    captureServer("checkout_started", {
      guide_slug: safeSlug(params.get("g")),
      product_id: products[0],
      currency,
      ...requestContext(request),
    }),
  );

  try {
    const checkout = await polar.checkouts.create({
      products,
      successUrl: `${baseUrl}/guides/thanks?checkout_id={CHECKOUT_ID}`,
    });
    return Response.redirect(checkout.url, 302);
  } catch (err) {
    // Details go to the log only — upstream error messages can carry
    // internals (ids, config hints) that don't belong in a public response.
    console.error("[polar-checkout] checkout create threw:", err);
    return Response.json(
      { error: "checkout handler error" },
      { status: 500 },
    );
  }
}

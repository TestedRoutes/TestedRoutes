/**
 * Polar read side — the day's orders, straight from the source.
 *
 * Deliberately redundant with the order_paid events the webhook writes into
 * PostHog. The point is the redundancy: a webhook that silently stops
 * firing is invisible in a report built only from webhook data, because
 * "no orders recorded" and "no orders" look identical. Asking Polar what it
 * actually charged gives the rollup a second, independent number, and any
 * gap between the two is a dropped webhook — which also means a buyer whose
 * purchase count never incremented and who never got tagged in Beehiiv.
 *
 * Uses the shared client from app/_lib/polar.js, so it needs
 * POLAR_ACCESS_TOKEN to carry the `orders:read` scope on top of the
 * checkout scopes it already has.
 */
import { polar } from "../polar";

/**
 * @param {{start: string, end: string}} range ISO timestamps, UTC day bounds
 * @returns {Promise<{orders: number, refunded: number, grossCents: number,
 *   netCents: number, byProduct: Array, truncated: boolean}>}
 */
export async function fetchPolarOrders({ start, end }) {
  if (!polar) throw new Error("POLAR_ACCESS_TOKEN not configured");

  const startMs = Date.parse(start);
  const endMs = Date.parse(end);

  let orders = 0;
  let refunded = 0;
  let grossCents = 0;
  let netCents = 0;
  const byProduct = new Map();

  // Page newest-first and stop as soon as we're past the window. Polar's
  // list endpoint doesn't take a date filter, so the alternative is pulling
  // the whole order history every night — fine at ten orders, not at ten
  // thousand. The page cap is a backstop against an unbounded loop if the
  // cursor ever stops advancing; it is logged rather than silent, because a
  // truncated total that looks precise is the worst outcome here.
  const PER_PAGE = 100;
  const MAX_PAGES = 20;
  let page = 1;
  let exhausted = false;

  while (page <= MAX_PAGES) {
    const res = await polar.orders.list({
      limit: PER_PAGE,
      page,
      sorting: ["-created_at"],
    });
    const items = res?.result?.items || [];
    if (!items.length) {
      exhausted = true;
      break;
    }

    let sawOlder = false;
    for (const order of items) {
      const createdMs = Date.parse(order?.createdAt || order?.created_at || "");
      if (!Number.isFinite(createdMs)) continue;
      if (createdMs >= endMs) continue; // newer than the window
      if (createdMs < startMs) {
        sawOlder = true;
        continue;
      }
      const productId = order?.productId || order?.product_id || null;
      const status = order?.status || null;

      // A refunded order is not revenue. Counting one is not a rounding
      // error — the first real order this code ever saw was a €19 sale
      // refunded the same morning, which the naive version would have
      // reported as a €19 day. Refunds are counted separately rather than
      // dropped, because "we sold three and refunded two" is a materially
      // different day from "we sold one".
      if (status === "refunded") {
        refunded += 1;
        continue;
      }

      // Gross is what the buyer paid; net is what Polar actually remits
      // after its merchant-of-record cut. Both are worth keeping: gross is
      // the sales number, net is the one that reaches the bank, and quoting
      // either as "revenue" without the other invites the wrong conclusion.
      const gross = order?.totalAmount ?? order?.total_amount ?? 0;
      const net = order?.netAmount ?? order?.net_amount ?? gross;
      // Partial refunds stay in the order count but shouldn't inflate the
      // money. Polar reports the refunded slice on the order itself.
      const refundedSlice =
        order?.refundedAmount ?? order?.refunded_amount ?? 0;

      orders += 1;
      grossCents += (typeof gross === "number" ? gross : 0) -
        (typeof refundedSlice === "number" ? refundedSlice : 0);
      netCents += typeof net === "number" ? net : 0;
      if (productId) {
        byProduct.set(productId, (byProduct.get(productId) || 0) + 1);
      }
    }

    // Sorted newest-first, so once a page contains anything older than the
    // window every later page is older too.
    if (sawOlder) {
      exhausted = true;
      break;
    }
    page += 1;
  }

  if (!exhausted) {
    console.warn(
      `[analytics] Polar order paging hit the ${MAX_PAGES}-page cap; totals may be short`,
    );
  }

  return {
    orders,
    refunded,
    grossCents,
    netCents,
    byProduct: [...byProduct.entries()].map(([productId, count]) => ({
      productId,
      count,
    })),
    truncated: !exhausted,
  };
}

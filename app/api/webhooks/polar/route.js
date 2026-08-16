/**
 * Polar webhook receiver.
 *
 * Wire up at https://polar.sh/dashboard/<org>/settings/webhooks
 *   URL:    https://testedroutes.com/api/webhooks/polar
 *   Secret: matches POLAR_WEBHOOK_SECRET in Vercel env vars
 *   Events: order.paid (minimum), order.refunded (so revenue figures are
 *           net of refunds rather than gross of them)
 *
 * On a paid order we:
 *   1. find the story whose guide.polarProductId matches the order's product
 *   2. increment guide.purchasesCount
 *   3. revalidate /guides and the guide's detail page so the counter is fresh
 *   4. upsert the buyer in Beehiiv with `customer` + `bought-{slug}` tags
 *      so paying customers can be segmented (excluded from "buy a guide"
 *      campaigns, included in trip-prep + cross-sell sequences).
 *
 * Beehiiv tagging is best-effort: failures are logged but never fail the
 * webhook, so a Beehiiv outage cannot block the purchase-count update or
 * trigger Polar to retry the webhook unnecessarily.
 *
 * Env:
 *   POLAR_WEBHOOK_SECRET     signing secret from Polar
 *   SANITY_API_WRITE_TOKEN   Sanity token with Editor permission
 *   BEEHIIV_API_KEY          (optional) Beehiiv API key — if unset, tagging is skipped
 *   BEEHIIV_PUBLICATION_ID   (optional) Beehiiv publication id, e.g. pub_…
 */
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { revalidatePath } from "next/cache";
import { writeClient } from "../../../../sanity/lib/writeClient";
import { captureServer } from "../../../_lib/serverAnalytics";

const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("[polar-webhook] POLAR_WEBHOOK_SECRET is not set");
}

function extractBuyerEmail(payload) {
  const data = payload?.data || {};
  const candidates = [
    data.customer?.email,
    data.user?.email,
    data.billing?.email,
    data.customer_email,
    data.email,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.includes("@")) return c.trim().toLowerCase();
  }
  return null;
}

/**
 * Order total in minor units (cents). Polar has moved this field around
 * between payload versions, so probe the known spellings the same way
 * extractBuyerEmail does rather than pinning one and silently recording
 * every sale as zero after an upstream rename.
 */
function extractOrderAmount(payload) {
  const data = payload?.data || {};
  const candidates = [
    data.total_amount,
    data.totalAmount,
    data.amount,
    data.net_amount,
    data.netAmount,
  ];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return c;
  }
  return null;
}

async function fetchStoryByProductId(productId) {
  if (!productId) return null;
  return writeClient.fetch(
    `*[_type == "story" && guide.polarProductId == $productId][0]{
      _id,
      "slug": slug.current,
      "guidePageSlug": guide.pageSlug,
      "title": title
    }`,
    { productId },
  );
}

async function bumpPurchaseCount(story) {
  if (!story?._id) return;
  await writeClient
    .patch(story._id)
    .setIfMissing({ "guide.purchasesCount": 0 })
    .inc({ "guide.purchasesCount": 1 })
    .commit();
  revalidatePath("/guides");
  revalidatePath(`/guides/${story.guidePageSlug || story.slug}`);
}

/**
 * Upsert a Beehiiv subscription, attach buyer tags.
 *
 * Two-step flow because POST /subscriptions silently ignores a `tags`
 * field in the body — tags must go through the dedicated endpoint:
 *   1. POST /subscriptions — idempotent on email (reactivate_existing=true);
 *      response includes the subscription id.
 *   2. POST /subscriptions/{id}/tags — adds `customer` + `bought-{slug}`.
 *      Beehiiv auto-creates the tag on the publication if it doesn't
 *      exist yet.
 *
 * Best-effort: any error is logged and swallowed so the webhook still
 * acks 200 (a Beehiiv outage shouldn't trigger Polar retries).
 */
async function tagBuyerInBeehiiv({ email, slug }) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    console.warn("[polar-webhook] Beehiiv not configured; skipping tag");
    return;
  }
  const tags = ["customer"];
  if (slug) tags.push(`bought-${slug}`);

  const baseUrl = `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}`;
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  let subscriptionId;
  try {
    const res = await fetch(`${baseUrl}/subscriptions`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: "testedroutes.com",
        utm_medium: "purchase",
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[polar-webhook] Beehiiv subscribe failed ${res.status}: ${text}`);
      return;
    }
    const json = await res.json().catch(() => null);
    subscriptionId = json?.data?.id;
    if (!subscriptionId) {
      console.error("[polar-webhook] Beehiiv subscribe returned no id", json);
      return;
    }
  } catch (err) {
    console.error("[polar-webhook] Beehiiv subscribe threw:", err);
    return;
  }

  try {
    const res = await fetch(
      `${baseUrl}/subscriptions/${encodeURIComponent(subscriptionId)}/tags`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ tags }),
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[polar-webhook] Beehiiv tag failed ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error("[polar-webhook] Beehiiv tag threw:", err);
  }
}

async function handleOrderPaid(payload) {
  const productId =
    payload?.data?.product_id ||
    payload?.data?.productId ||
    payload?.data?.product?.id;
  if (!productId) {
    console.warn("[polar-webhook] order.paid payload had no product id", payload?.data);
    return;
  }
  const story = await fetchStoryByProductId(productId);

  // Record the sale before anything that can fail, and record it even when
  // the product maps to no story. An unmapped product id is a real failure
  // mode — a Polar product created by hand, or a slug renamed without
  // re-running sync:polar — and the version of this that returned early
  // would drop the sale from the revenue figures at exactly the moment
  // something was wrong. Better to bank the money and let guide_slug be
  // null, which is a question the digest can ask out loud.
  await captureServer("order_paid", {
    guide_slug: story?.slug || null,
    product_id: productId,
    amount_cents: extractOrderAmount(payload),
    currency: payload?.data?.currency || null,
  });

  if (!story) {
    console.warn(`[polar-webhook] no story found for product ${productId}`);
    return;
  }
  await bumpPurchaseCount(story);

  const email = extractBuyerEmail(payload);
  if (email) {
    await tagBuyerInBeehiiv({ email, slug: story.slug });
  } else {
    console.warn("[polar-webhook] no buyer email in order.paid payload; skipping Beehiiv tag");
  }
}

/**
 * A refund reverses a sale, so the analytics stream has to hear about it.
 *
 * Without this, order_paid is the only money event that exists and every
 * revenue figure is gross of refunds forever — the first real order this
 * system ever saw was refunded three hours after purchase, which would have
 * been reported as a €19 day. The nightly rollup cross-checks against
 * Polar's own totals and would flag the gap, but a flag is a worse answer
 * than the number simply being right.
 *
 * Deliberately does NOT touch guide.purchasesCount. That counter is social
 * proof on the guide page, and whether a refunded sale should still count
 * is a copy decision rather than a data one — left alone until someone
 * decides, rather than quietly changed by an analytics patch.
 */
async function handleOrderRefunded(payload) {
  const productId =
    payload?.data?.product_id ||
    payload?.data?.productId ||
    payload?.data?.product?.id ||
    payload?.data?.order?.product_id ||
    payload?.data?.order?.productId;
  const story = productId ? await fetchStoryByProductId(productId) : null;

  // Polar reports the refunded slice on refund events; a full refund and a
  // partial one are the same event type with different amounts.
  const amount =
    payload?.data?.amount ??
    payload?.data?.refunded_amount ??
    payload?.data?.refundedAmount ??
    extractOrderAmount(payload);

  await captureServer("order_refunded", {
    guide_slug: story?.slug || null,
    product_id: productId || null,
    amount_cents: typeof amount === "number" ? amount : null,
    currency: payload?.data?.currency || null,
  });

  if (!story) {
    console.warn(`[polar-webhook] refund for unmapped product ${productId}`);
  }
}

export async function POST(request) {
  if (!WEBHOOK_SECRET) {
    return Response.json(
      { error: "POLAR_WEBHOOK_SECRET not configured in deployed environment" },
      { status: 503 },
    );
  }
  // Reject unsigned probes (scanners hitting /api/webhooks/polar) before the
  // SDK tries to verify, so we don't crash inside Buffer.from(undefined).
  const headers = request.headers;
  if (
    !headers.get("webhook-id") ||
    !headers.get("webhook-signature") ||
    !headers.get("webhook-timestamp")
  ) {
    return Response.json({ error: "missing webhook signature" }, { status: 401 });
  }

  // validateEvent needs the raw body exactly as sent, so read text, not json.
  const body = await request.text();
  let event;
  try {
    event = validateEvent(
      body,
      {
        "webhook-id": headers.get("webhook-id"),
        "webhook-timestamp": headers.get("webhook-timestamp"),
        "webhook-signature": headers.get("webhook-signature"),
      },
      WEBHOOK_SECRET,
    );
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return Response.json({ error: "invalid webhook signature" }, { status: 403 });
    }
    console.error("[polar-webhook] signature validation threw:", err);
    return Response.json({ error: "webhook validation error" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "order.paid":
        await handleOrderPaid(event);
        break;
      // Polar has used both spellings across payload versions; handling
      // each costs nothing and a missed refund is invisible until the
      // month's revenue doesn't match the bank.
      case "order.refunded":
      case "refund.created":
        await handleOrderRefunded(event);
        break;
      case "customer.state_changed":
        // TODO: no customer accounts on the site today. When subscriptions
        // launch, sync entitlement state (active benefits) from
        // event.data here.
        break;
      default:
        break;
    }
    return Response.json({ received: true });
  } catch (err) {
    console.error("[polar-webhook] handler threw:", err);
    return Response.json(
      { error: "webhook handler error", message: String(err?.message || err) },
      { status: 500 },
    );
  }
}

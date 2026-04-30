/**
 * Polar webhook receiver.
 *
 * Wire up at https://polar.sh/dashboard/<org>/settings/webhooks
 *   URL:    https://testedroutes.com/api/webhooks/polar
 *   Secret: matches POLAR_WEBHOOK_SECRET in Vercel env vars
 *   Events: order.paid (minimum)
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
import { Webhooks } from "@polar-sh/nextjs";
import { revalidatePath } from "next/cache";
import { writeClient } from "../../../../sanity/lib/writeClient";

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
 * Beehiiv's POST /subscriptions is idempotent on email when
 * reactivate_existing=true. We pass `tags` so the same call adds the
 * `customer` + `bought-{slug}` tags whether the email is new or existing.
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

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
          tags,
          utm_source: "testedroutes.com",
          utm_medium: "purchase",
        }),
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

const polarHandler = WEBHOOK_SECRET
  ? Webhooks({
      webhookSecret: WEBHOOK_SECRET,
      onOrderPaid: async (payload) => {
        const productId =
          payload?.data?.product_id ||
          payload?.data?.productId ||
          payload?.data?.product?.id;
        if (!productId) {
          console.warn("[polar-webhook] order.paid payload had no product id", payload?.data);
          return;
        }
        const story = await fetchStoryByProductId(productId);
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
      },
    })
  : null;

export async function POST(request) {
  if (!polarHandler) {
    return Response.json(
      { error: "POLAR_WEBHOOK_SECRET not configured in deployed environment" },
      { status: 503 },
    );
  }
  try {
    return await polarHandler(request);
  } catch (err) {
    console.error("[polar-webhook] handler threw:", err);
    return Response.json(
      { error: "webhook handler error", message: String(err?.message || err) },
      { status: 500 },
    );
  }
}

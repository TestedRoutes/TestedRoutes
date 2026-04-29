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
 *
 * Env:
 *   POLAR_WEBHOOK_SECRET     signing secret from Polar
 *   SANITY_API_WRITE_TOKEN   Sanity token with Editor permission
 */
import { Webhooks } from "@polar-sh/nextjs";
import { revalidatePath } from "next/cache";
import { writeClient } from "../../../../sanity/lib/writeClient";

const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("[polar-webhook] POLAR_WEBHOOK_SECRET is not set");
}

async function bumpPurchaseCount(productId) {
  if (!productId) return;

  const story = await writeClient.fetch(
    `*[_type == "story" && guide.polarProductId == $productId][0]{ _id, "slug": slug.current, "guidePageSlug": guide.pageSlug }`,
    { productId },
  );
  if (!story?._id) {
    console.warn(`[polar-webhook] no story found for product ${productId}`);
    return;
  }

  await writeClient
    .patch(story._id)
    .setIfMissing({ "guide.purchasesCount": 0 })
    .inc({ "guide.purchasesCount": 1 })
    .commit();

  revalidatePath("/guides");
  revalidatePath(`/guides/${story.guidePageSlug || story.slug}`);
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
        await bumpPurchaseCount(productId);
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

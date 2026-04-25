/**
 * Polar webhook receiver.
 *
 * Wire up at https://polar.sh/dashboard/<org>/settings/webhooks
 *   URL:    https://pikelistravel.com/api/webhooks/polar
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

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onOrderPaid: async (payload) => {
    const productId = payload?.data?.product_id || payload?.data?.productId;
    await bumpPurchaseCount(productId);
  },
});

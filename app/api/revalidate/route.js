/**
 * Sanity → Next.js on-demand revalidation webhook.
 *
 * Wire up at https://www.sanity.io/manage/project/y3gc8dx6/api/webhooks
 *   URL:     https://testedroutes.com/api/revalidate
 *   Trigger: Create, Update, Delete
 *   Filter:  _type in ["story", "destination", "collection", "category", "author"]
 *   Method:  POST
 *   Headers: x-sanity-revalidate-secret: <SANITY_REVALIDATE_SECRET from Vercel env vars>
 *   Projection: { _type, "slug": slug.current, guide }
 *
 * Manually verify with:
 *   curl -X POST https://testedroutes.com/api/revalidate \
 *     -H "x-sanity-revalidate-secret: $SECRET" \
 *     -H "content-type: application/json" \
 *     -d '{"_type":"story","slug":"triftbrucke-from-zurich","guide":{"hasGuide":true}}'
 */
import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { SANITY_CACHE_TAG } from "../../_lib/sanityStory";

// Constant-time secret comparison. A plain !== leaks how many leading
// characters matched through response timing; over HTTPS on a webhook the
// practical risk is small, but the safe version costs one line.
function secretsMatch(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true, usage: "POST with x-sanity-revalidate-secret header" });
}

export async function POST(request) {
  const secret = request.headers.get("x-sanity-revalidate-secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected) {
    return Response.json(
      { error: "SANITY_REVALIDATE_SECRET is not configured on the server" },
      { status: 500 },
    );
  }
  if (!secret || !secretsMatch(secret, expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // ignore body parse errors; we'll still revalidate listings
  }

  const type = body?._type;
  const slug = typeof body?.slug === "string" ? body.slug : body?.slug?.current;
  const guidePageSlug = body?.guide?.pageSlug;
  const hasGuide = !!body?.guide?.hasGuide;

  /* Listings that aggregate stories — refresh on any content change */
  const revalidated = [];
  const touch = (p) => {
    revalidatePath(p);
    revalidated.push(p);
  };

  // Purge the cached Sanity payloads themselves, not just the route outputs —
  // every content read is tagged, so this is what makes an edit visible
  // before the 5-minute revalidate window would have expired on its own.
  revalidateTag(SANITY_CACHE_TAG);

  touch("/");
  touch("/inspire");
  touch("/guides");
  touch("/destinations");

  /* Detail pages — only on story changes */
  if (type === "story" && slug) {
    touch(`/inspire/${slug}`);
    if (hasGuide) {
      touch(`/guides/${guidePageSlug || slug}`);
    }
  }

  return Response.json({ revalidated, type, slug });
}

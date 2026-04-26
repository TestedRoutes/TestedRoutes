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
import { revalidatePath } from "next/cache";

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
  if (!secret || secret !== expected) {
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

/**
 * /go/<slug> — short-link redirector for shareable contexts.
 *
 * Use this whenever a UTM-tagged URL needs to be shown / typed / spoken
 * (QR codes, podcast mentions, business cards, Instagram bios). The
 * short slug is the published URL; the redirect server-side carries
 * the full UTM-tagged destination so PostHog / Vercel Analytics /
 * Beehiiv still capture the campaign.
 *
 * Two flavours of slug:
 *
 *   1. Curated short links — defined in CURATED below. Hand-pick the
 *      destination + UTMs for each. Stable URLs you can put on print
 *      that never break.
 *      Examples:
 *        /go/zurich      → /guides + UTMs
 *        /go/podcast     → /subscribe + podcast UTMs
 *
 *   2. Guide passthroughs — any slug that matches a published guide
 *      slug redirects to /guides/<slug> with sensible defaults
 *      (utm_source=shortlink, utm_medium=referral, utm_campaign=<slug>).
 *      Useful for "go to testedroutes.com/go/triftbruecke" in casual
 *      contexts.
 *
 *   3. Fallback — unknown slugs 302 to the homepage with
 *      utm_source=shortlink&utm_medium=referral&utm_campaign=unknown-<slug>
 *      so we can detect mistyped / abused links in analytics.
 *
 * SEO: the route returns 302 (temporary) so Google doesn't pass /go/*
 * link-juice into the destination — that's intentional, /go/ is for
 * outbound campaign traffic, not a canonical path. Robots.txt should
 * disallow /go/ if we ever want to be extra-safe.
 */
import { NextResponse } from "next/server";
import { buildUtmUrl } from "../../_lib/utm";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://testedroutes.com";

/**
 * Curated short links. Add entries as campaigns require them.
 * The key is the slug after /go/; the value is the full destination
 * with UTMs already baked in (use buildUtmUrl in code, not here).
 *
 * Convention: keep slugs lowercase, hyphenated, short (under 16 chars
 * if possible). Once published, treat them as stable — printed media
 * relies on them not changing.
 */
const CURATED = {
  // Examples — replace / extend as campaigns go live.
  // "zurich": buildUtmUrl(`${SITE_ORIGIN}/destinations/switzerland`, {
  //   source: "shortlink", medium: "print", campaign: "zurich-bizcard",
  // }),
  // "podcast": buildUtmUrl(`${SITE_ORIGIN}/subscribe`, {
  //   source: "shortlink", medium: "podcast", campaign: "podcast-mention-2026",
  // }),
};

/**
 * Lazy-import guide list to check whether a slug matches a published
 * guide. Imported lazily so this route's serverless function doesn't
 * pull the whole Sanity client into its cold-start.
 */
async function isPublishedGuide(slug) {
  try {
    const { loadGuideBySlug } = await import("../../_lib/loadGuides");
    const guide = await loadGuideBySlug(slug);
    return !!guide;
  } catch {
    return false;
  }
}

export async function GET(request, { params }) {
  const { slug: rawSlug } = await params;
  const slug = String(rawSlug || "").toLowerCase().trim();

  if (!slug) {
    return NextResponse.redirect(SITE_ORIGIN, { status: 302 });
  }

  // 1. Curated short link
  if (CURATED[slug]) {
    return NextResponse.redirect(CURATED[slug], { status: 302 });
  }

  // 2. Guide passthrough
  if (await isPublishedGuide(slug)) {
    const target = buildUtmUrl(`${SITE_ORIGIN}/guides/${slug}`, {
      source: "shortlink",
      medium: "referral",
      campaign: slug,
    });
    return NextResponse.redirect(target, { status: 302 });
  }

  // 3. Unknown — fall through to homepage with a tagged "unknown-<slug>"
  // campaign so we can spot mistyped / abused short links in analytics.
  const fallback = buildUtmUrl(SITE_ORIGIN, {
    source: "shortlink",
    medium: "referral",
    campaign: `unknown-${slug.slice(0, 40)}`,
  });
  return NextResponse.redirect(fallback, { status: 302 });
}

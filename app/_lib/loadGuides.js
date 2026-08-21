import { cache } from "react";
import { fetchAllGuideStories, fetchGuideStoryBySlug, shapeGuide } from "./sanityStory";
import { DEFAULT_CURRENCY } from "./currency";

// cache() around the shaping, not just the fetch: shapeGuide runs a
// markdown render over every guide body, which is the expensive half. The
// exported wrappers normalize default arguments first — cache() keys on the
// exact argument list, so loadGuides() and loadGuides("EUR", "en") must
// resolve to one entry, not two shaping passes.
const loadGuidesCached = cache(async (currency, lang) => {
  const docs = await fetchAllGuideStories(lang);
  return docs.map((d) => shapeGuide(d, currency));
});

export function loadGuides(currency = DEFAULT_CURRENCY, lang = "en") {
  return loadGuidesCached(currency, lang);
}

// One guide, one query — the catalogue-wide fetch-and-find this used to do
// made every guide page, links page and unknown /go/ slug pay for shaping
// the whole library.
const loadGuideBySlugCached = cache(async (slug, currency, lang) => {
  const doc = await fetchGuideStoryBySlug(slug, lang);
  return doc ? shapeGuide(doc, currency) : null;
});

export function loadGuideBySlug(slug, currency = DEFAULT_CURRENCY, lang = "en") {
  if (!slug) return Promise.resolve(null);
  return loadGuideBySlugCached(slug, currency, lang);
}

// Slim, serializable card shape — full shaped guides carry bodyBlocks and
// friends, which would bloat the payload sent to client components.
export function toGuideCard(g) {
  return {
    slug: g.slug,
    title: g.title,
    category: g.category,
    duration: g.duration,
    price: g.price,
    image: g.image,
    cardPhotos: g.cardPhotos,
    // Subset of cardPhotos that are page exports — shown whole, not cropped.
    cardPagePhotos: Array.isArray(g.cardPagePhotos) ? g.cardPagePhotos : [],
    videoUrl: g.videoUrl,
    videoSlot: g.videoSlot,
    videos: Array.isArray(g.videos) ? g.videos : [],
    href: g.href,
    polarProductId: g.polarProductId,
    guidePdfUrl: g.guidePdfUrl,
    cardLine: g.salesPage?.cardLine || null,
    statusNote: g.salesPage?.statusNote || null,
    metadata: {
      geography: {
        country: g.metadata?.geography?.country || null,
        continent: g.metadata?.geography?.continent || null,
      },
      // Feed the guide-browser dropdowns (Activity / Season); Length and
      // Country ride on the top-level duration + geography fields.
      classification: {
        activity_category: g.metadata?.classification?.activity_category || null,
      },
      timing: {
        best_seasons: Array.isArray(g.metadata?.timing?.best_seasons)
          ? g.metadata.timing.best_seasons
          : [],
      },
      seo: { meta_description: g.metadata?.seo?.meta_description || null },
      hero: { subtitle: g.metadata?.hero?.subtitle || null },
    },
  };
}

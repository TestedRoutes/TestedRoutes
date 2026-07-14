import { fetchAllGuideStories, shapeGuide } from "./sanityStory";
import { DEFAULT_CURRENCY } from "./currency";

export async function loadGuides(currency = DEFAULT_CURRENCY, lang = "en") {
  const docs = await fetchAllGuideStories(lang);
  return docs.map((d) => shapeGuide(d, currency));
}

export async function loadGuideBySlug(slug, currency = DEFAULT_CURRENCY, lang = "en") {
  const all = await loadGuides(currency, lang);
  return all.find((g) => g.slug === slug || g.metadataSlug === slug) || null;
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
    videoUrl: g.videoUrl,
    videoSlot: g.videoSlot,
    videos: Array.isArray(g.videos) ? g.videos : [],
    href: g.href,
    polarProductId: g.polarProductId,
    guidePdfUrl: g.guidePdfUrl,
    metadata: {
      geography: {
        country: g.metadata?.geography?.country || null,
        continent: g.metadata?.geography?.continent || null,
      },
      seo: { meta_description: g.metadata?.seo?.meta_description || null },
      hero: { subtitle: g.metadata?.hero?.subtitle || null },
    },
  };
}

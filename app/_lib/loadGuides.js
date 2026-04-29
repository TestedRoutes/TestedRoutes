import { fetchAllGuideStories, shapeGuide } from "./sanityStory";
import { DEFAULT_CURRENCY } from "./currency";

export async function loadGuides(currency = DEFAULT_CURRENCY) {
  const docs = await fetchAllGuideStories();
  return docs.map((d) => shapeGuide(d, currency));
}

export async function loadGuideBySlug(slug, currency = DEFAULT_CURRENCY) {
  const all = await loadGuides(currency);
  return all.find((g) => g.slug === slug || g.metadataSlug === slug) || null;
}

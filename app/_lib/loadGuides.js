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

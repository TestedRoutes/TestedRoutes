import { fetchAllGuideStories, shapeGuide } from "./sanityStory";

export async function loadGuides() {
  const docs = await fetchAllGuideStories();
  return docs.map(shapeGuide);
}

export async function loadGuideBySlug(slug) {
  const all = await loadGuides();
  return all.find((g) => g.slug === slug || g.metadataSlug === slug) || null;
}

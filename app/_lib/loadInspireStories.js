import { fetchAllStories, shapeStory } from "./sanityStory";

export async function loadInspireStories(lang = "en") {
  const docs = await fetchAllStories(lang);
  return docs.map(shapeStory);
}

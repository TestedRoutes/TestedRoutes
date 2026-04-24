import { fetchAllStories, shapeStory } from "./sanityStory";

export async function loadInspireStories() {
  const docs = await fetchAllStories();
  return docs.map(shapeStory);
}

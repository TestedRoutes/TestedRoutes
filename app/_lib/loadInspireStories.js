import { cache } from "react";
import { fetchAllStories, shapeStory } from "./sanityStory";

// cache() around the shaping, not just the fetch — shapeStory runs per doc
// on every call, and story pages ask for this list more than once per
// request. The wrapper normalizes the default argument because cache()
// keys on the exact argument list.
const loadInspireStoriesCached = cache(async (lang) => {
  const docs = await fetchAllStories(lang);
  return docs.map(shapeStory);
});

export function loadInspireStories(lang = "en") {
  return loadInspireStoriesCached(lang);
}

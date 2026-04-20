/**
 * Spec name for story loading – delegates to `loadInspireStories`.
 * Static site: reads `stories-manifest.json` + Meta-*.txt + Story-* under
 * `assets/public/Content/Inspire/`. Regenerate manifest:
 * `node scripts/build-inspire-manifest.mjs`
 */
export { loadInspireStories as loadStories, loadInspireStories as default } from "./loadInspireStories.js";

/**
 * The reader's data source, behind one function so the prototype-to-live
 * switch is a single import change.
 *
 * Today: the repo YAML through db/skuFromYaml.js — no database, no env, the
 * files ship with the deploy (see outputFileTracingIncludes in
 * next.config.mjs, without which Vercel's traced function bundle would not
 * contain them and every reader page would 404 in production while working
 * locally).
 *
 * Live: replace the body with `await loadSku(slug)` from db/loadSku.js. Both
 * return the same canonical object — that equivalence is what check-sku.mjs
 * enforces — so nothing in app/reader changes.
 *
 * React's cache() dedupes the read within one request: the layout loads the
 * SKU for the shell and the page loads it again for the content.
 */
import { cache } from "react";
import { loadSkuFromYaml } from "../../../db/skuFromYaml.js";

export const loadReaderSku = cache(async (slug) => {
  // Reject anything that is not a plain slug before it reaches the
  // filesystem lookup; the locate step joins it into a path.
  if (!/^[a-z0-9-]+$/.test(String(slug || ""))) return null;
  return loadSkuFromYaml(slug);
});

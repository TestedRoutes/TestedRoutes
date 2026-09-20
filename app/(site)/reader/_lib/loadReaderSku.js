/**
 * The reader's data source, behind two functions so the prototype-to-live
 * switch is an import change and nothing in app/reader moves.
 *
 * Today: the repo YAML through db/skuFromYaml.js and db/countryFromYaml.js.
 * No database, no env; the files ship with the deploy (see
 * outputFileTracingIncludes in next.config.mjs, without which Vercel's
 * traced function bundle would not contain them and every reader page would
 * 404 in production while working locally).
 *
 * Live: db/loadSku.js and its country sibling return the same canonical
 * shapes — that equivalence is what check-sku.mjs enforces.
 *
 * React's cache() dedupes each read within one request: the layout loads
 * the country for the shell and the page loads it again for the content.
 */
import { cache } from "react";
import { loadSkuFromYaml } from "../../../../db/skuFromYaml.js";
import { loadCountryFromYaml, countryForSku } from "../../../../db/countryFromYaml.js";

const SLUG = /^[a-z0-9-]+$/;

export const loadReaderSku = cache(async (slug) => {
  // Reject anything that is not a plain slug before it reaches the
  // filesystem lookup; the locate step joins it into a path.
  if (!SLUG.test(String(slug || ""))) return null;
  return loadSkuFromYaml(slug);
});

export const loadReaderCountry = cache(async (slug) => {
  if (!SLUG.test(String(slug || ""))) return null;
  return loadCountryFromYaml(slug);
});

/** For a legacy /reader/<sku> URL: the country to redirect into, or null. */
export const readerCountryForSku = cache(async (skuSlug) => {
  if (!SLUG.test(String(skuSlug || ""))) return null;
  return countryForSku(skuSlug);
});

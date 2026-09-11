/**
 * Destination hub slugs — the single source of truth for routing.
 *
 * The rich cards (hero image, blurb, region) live in
 * app/(site)/destinations/page.jsx because they need static image imports.
 * This list exists so the sitemap does not have to repeat them: it was
 * hardcoded there once and Iceland and Tuvalu shipped without ever being
 * indexed, because nothing tied the two lists together.
 *
 * Adding a destination page? Add its slug here in the same commit.
 */
export const DESTINATION_SLUGS = ["iceland", "seychelles", "tuvalu", "switzerland", "kuwait", "samoa", "fiji", "mauritania", "western-sahara", "gambia", "senegal", "guinea", "guinea-bissau", "canary-islands", "tenerife", "gran-canaria", "lanzarote", "fuerteventura", "south-korea"];

/**
 * Hidden hubs — pages that exist in the repo but are paused from every
 * public surface. A slug listed here keeps its page and its index card in
 * the tree, but every list that would link or index it (sitemap, llms-full,
 * the /destinations grid, guide and story back-links, the search bar)
 * filters on VISIBLE_DESTINATION_SLUGS instead. To hide a hub: add its slug
 * here AND add a 307 from its route to /destinations in vercel.json, so a
 * direct hit does not serve a page nothing links to. To bring it back:
 * remove both in the same commit. Empty today; the mechanism stays because
 * pausing a hub has been needed once already and is a two-line change when
 * it is needed again.
 */
export const HIDDEN_DESTINATION_SLUGS = [];
export const VISIBLE_DESTINATION_SLUGS = DESTINATION_SLUGS.filter(
  (slug) => !HIDDEN_DESTINATION_SLUGS.includes(slug),
);

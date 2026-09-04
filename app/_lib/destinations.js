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
export const DESTINATION_SLUGS = ["iceland", "seychelles", "tuvalu", "switzerland", "kuwait", "samoa", "fiji", "mauritania", "western-sahara", "gambia", "senegal", "guinea", "guinea-bissau", "canary-islands", "tenerife", "gran-canaria", "lanzarote", "fuerteventura", "panama"];

/**
 * Hidden hubs — pages that exist in the repo but are paused from every
 * public surface (founder 2026-08-21: the Switzerland hub is outdated and
 * there is no time to fix it now). The page route 307-redirects to
 * /destinations (vercel.json), and every list that would link or index it
 * filters on VISIBLE_DESTINATION_SLUGS instead. To bring a hub back: remove
 * its slug here and delete its redirect from vercel.json — the page and its
 * card are untouched underneath.
 */
export const HIDDEN_DESTINATION_SLUGS = ["switzerland"];
export const VISIBLE_DESTINATION_SLUGS = DESTINATION_SLUGS.filter(
  (slug) => !HIDDEN_DESTINATION_SLUGS.includes(slug),
);

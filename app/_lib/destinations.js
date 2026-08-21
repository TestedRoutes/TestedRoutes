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
export const DESTINATION_SLUGS = ["iceland", "seychelles", "tuvalu", "switzerland", "kuwait", "samoa", "fiji"];

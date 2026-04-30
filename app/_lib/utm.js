/**
 * UTM URL builder + TestedRoutes campaign-tagging convention.
 *
 * Use this whenever you generate a link that points at testedroutes.com
 * from anywhere external — paid ad, social post, partner site, email
 * blast, QR code, podcast mention. The receiving end (PostHog + Vercel
 * Analytics + Beehiiv) auto-captures the UTM params; a consistent
 * convention means the dashboards stay readable as channels multiply.
 *
 * Convention (also documented in
 * memory/feedback_utm_convention.md):
 *
 *   utm_source    The platform     meta · google · tiktok · pinterest ·
 *                                  reddit · x · youtube · newsletter ·
 *                                  email · partner-<name> · bio-link ·
 *                                  qr-business-card · podcast-<name>
 *
 *   utm_medium    The format       cpc (paid clicks) · social (organic
 *                                  social post) · email · banner ·
 *                                  referral (partner link) · bio ·
 *                                  print · podcast
 *
 *   utm_campaign  What you're      Either a guide slug
 *                 promoting        (triftbrucke-from-zurich) for guide-
 *                                  specific campaigns, or a cross-cutting
 *                                  name (launch-jun2026, summer-2026,
 *                                  newsletter-may26-issue03)
 *
 *   utm_content   Variant inside   Optional. headline-a vs headline-b
 *                 a campaign       for A/B; image-1 vs image-2; etc.
 *
 *   utm_term      Paid-search      Rarely used. Google Ads injects gclid
 *                 keyword          automatically; only set utm_term for
 *                                  manual keyword tagging.
 *
 * Usage:
 *
 *   import { buildUtmUrl } from "@/app/_lib/utm";
 *
 *   const adUrl = buildUtmUrl(
 *     "https://testedroutes.com/guides/trift-bridge-from-zurich",
 *     {
 *       source: "meta",
 *       medium: "cpc",
 *       campaign: "trift-bridge-from-zurich",
 *       content: "video-summit-shot",
 *     }
 *   );
 *   // → https://testedroutes.com/guides/trift-bridge-from-zurich?utm_source=meta&utm_medium=cpc&utm_campaign=trift-bridge-from-zurich&utm_content=video-summit-shot
 */

/**
 * Whitelisted UTM source values. Add new ones as channels go live so we
 * stay consistent across campaigns (avoids "facebook" vs "fb" vs "meta"
 * fragmentation in dashboards).
 */
export const UTM_SOURCES = Object.freeze([
  "meta",
  "google",
  "tiktok",
  "pinterest",
  "reddit",
  "x",
  "youtube",
  "linkedin",
  "newsletter",
  "email",
  "bio-link",
  // partner-<name>, podcast-<name>, qr-<context> are valid prefixed forms
]);

export const UTM_MEDIUMS = Object.freeze([
  "cpc", // paid clicks
  "social", // organic social
  "email",
  "banner",
  "referral",
  "bio",
  "print",
  "podcast",
  "qr",
]);

/**
 * Append UTM parameters to a base URL.
 *
 * Returns a new URL string. Existing query params on `baseUrl` are
 * preserved (and any duplicates among UTM keys are overwritten).
 *
 * Empty or undefined UTM values are skipped — pass only what you have.
 *
 * @param {string} baseUrl  Absolute URL pointing at testedroutes.com
 *                          (or anywhere we want to track inbound from).
 * @param {object} utm
 * @param {string} utm.source     Required. One of UTM_SOURCES (or
 *                                a `partner-<name>`, `podcast-<name>`,
 *                                `qr-<context>` form).
 * @param {string} [utm.medium]   One of UTM_MEDIUMS.
 * @param {string} [utm.campaign] Guide slug or cross-cutting campaign id.
 * @param {string} [utm.content]  Variant identifier within the campaign.
 * @param {string} [utm.term]     Paid-search keyword (rare).
 * @returns {string}
 */
export function buildUtmUrl(baseUrl, utm = {}) {
  if (!baseUrl) throw new Error("buildUtmUrl: baseUrl is required");
  if (!utm.source) throw new Error("buildUtmUrl: utm.source is required");

  const url = new URL(baseUrl);
  const params = url.searchParams;

  // Normalise + set UTM params. Skip empty / undefined.
  const map = {
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
    utm_term: utm.term,
  };
  for (const [key, value] of Object.entries(map)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      params.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Compose a guide-specific campaign URL with sensible defaults.
 *
 * Shortcut for the most common case: pointing an ad at a specific guide.
 * `utm_campaign` defaults to the guide's slug.
 *
 * @param {string} slug          Guide slug, e.g. "trift-bridge-from-zurich"
 * @param {object} utm           Same shape as buildUtmUrl, minus `campaign`
 * @param {string} [siteOrigin]  Defaults to https://testedroutes.com
 * @returns {string}
 */
export function buildGuideCampaignUrl(slug, utm = {}, siteOrigin = "https://testedroutes.com") {
  if (!slug) throw new Error("buildGuideCampaignUrl: slug is required");
  return buildUtmUrl(`${siteOrigin}/guides/${slug}`, {
    campaign: slug,
    ...utm,
  });
}

/**
 * Strip UTM params from a URL (e.g. for canonicalisation).
 * Useful when storing a "clean" reference to a URL the buyer arrived at.
 *
 * @param {string} url
 * @returns {string}
 */
export function stripUtm(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    const drop = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    for (const k of drop) u.searchParams.delete(k);
    return u.toString();
  } catch {
    return url;
  }
}

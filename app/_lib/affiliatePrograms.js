/**
 * Affiliate-program registry + tracking-ID injection + region routing.
 *
 * Editors paste raw destination URLs (in Sanity body markDefs OR in the
 * affiliateLink doc's url field). This module appends the program's
 * tracking parameter at render/click time from env vars. Single source
 * of truth for tracking IDs: rotate the env var, every link picks up
 * the new ID with no Sanity edits and no PDF rework.
 *
 * Two flavours of "tracking":
 *
 * 1. SIMPLE-PARAM PROGRAMS — direct programs that accept a tracking ID
 *    as a URL parameter (Booking aid=, Amazon tag=, Agoda cid=, etc.).
 *    withAffiliateParams() appends the param from PROGRAM_CONFIG.envVar.
 *
 * 2. PASS-THROUGH PROGRAMS — meta-platform-wrapped deeplinks (Awin,
 *    Impact, CJ, AvantLink). The deeplink already carries tracking
 *    inside the wrapper URL. paramName: null tells the helper to leave
 *    the URL alone.
 *
 * Region routing (the gear / Amazon problem):
 *
 * Some affiliate links need to point at different URLs per visitor
 * region — Amazon (.com vs .co.uk vs .de same SKU), or Backcountry US
 * vs Bergfreunde EU (different SKUs, different retailers entirely).
 *
 *   - For Amazon, the regional swap is mechanical: same SKU, different
 *     storefront. resolveAmazonRegional() handles it from one .com URL
 *     by detecting visitor country.
 *   - For multi-retailer items (Backcountry vs Bergfreunde), the
 *     affiliateLink doc carries a `regions` array with per-region URL
 *     and program. /go/ picks the matching override; falls back to the
 *     doc's default url + program when no override matches.
 *
 * Country-to-region bucket mapping is in countryToRegion(): keep the
 * bucket list short ({us, eu, uk, asia}) — affiliate URLs aren't
 * country-specific enough to warrant per-country routing.
 *
 * Adding a new program:
 *   1. Add an entry to PROGRAM_CONFIG below.
 *   2. If it's a simple-param program, add the env var to
 *      .env.local.example with a short comment.
 *   3. Mirror the entry in the Sanity schema dropdowns (story.js link
 *      annotation, affiliateLink doc, regionalAffiliate object) — the
 *      program list must match across all four files.
 */

export const PROGRAM_CONFIG = Object.freeze({
  /* ── Hotels ── */
  booking: { label: "Booking.com", paramName: "aid", envVar: "BOOKING_AID" },
  agoda: { label: "Agoda", paramName: "cid", envVar: "AGODA_CID" },

  /* ── Tours / experiences / tickets ── */
  gyg: { label: "GetYourGuide", paramName: "partner_id", envVar: "GYG_PARTNER_ID" },
  viator: { label: "Viator (CJ)", paramName: null, envVar: null }, // CJ-wrapped deeplinks
  thefork: { label: "TheFork", paramName: null, envVar: null }, // Awin-wrapped

  /* ── Flights ── */
  skyscanner: { label: "Skyscanner", paramName: null, envVar: null }, // Impact-wrapped
  kiwi: { label: "Kiwi.com", paramName: "affilid", envVar: "KIWI_AFFILID" },

  /* ── Cars ── */
  kayak: { label: "Kayak", paramName: null, envVar: null }, // Impact-wrapped
  sixt: { label: "Sixt", paramName: null, envVar: null }, // direct deeplink
  europcar: { label: "Europcar", paramName: null, envVar: null }, // Awin-wrapped

  /* ── Gear — kit retailers ── */
  backcountry: { label: "Backcountry", paramName: null, envVar: null }, // AvantLink-wrapped
  bergfreunde: { label: "Bergfreunde / Alpinetrek", paramName: null, envVar: null }, // Awin-wrapped
  decathlon: { label: "Decathlon", paramName: null, envVar: null }, // Awin-wrapped

  /* ── Gear — brand-direct ── */
  patagonia: { label: "Patagonia", paramName: null, envVar: null }, // AvantLink US / Awin EU
  blackdiamond: { label: "Black Diamond", paramName: null, envVar: null },
  osprey: { label: "Osprey", paramName: null, envVar: null },
  mammut: { label: "Mammut", paramName: null, envVar: null },
  salomon: { label: "Salomon", paramName: null, envVar: null },
  arcteryx: { label: "Arc'teryx", paramName: null, envVar: null },

  /* ── Amazon — region-aware (.com / .co.uk / .de) ── */
  amazon: {
    label: "Amazon",
    paramName: "tag",
    // The default env var (used when visitor country falls outside our
    // known regions). Regional swap happens in resolveAmazonRegional().
    envVar: "AMAZON_TAG_US",
    regional: true,
  },

  /* ── Connectivity ── */
  saily: { label: "Saily", paramName: null, envVar: null }, // Impact-wrapped
  holafly: { label: "Holafly", paramName: null, envVar: null }, // secondary eSIM

  /* ── Money ── */
  revolut: { label: "Revolut", paramName: null, envVar: null }, // Impact-wrapped
  wise: { label: "Wise", paramName: null, envVar: null }, // Impact-wrapped

  /* ── Apps ── */
  nordvpn: { label: "NordVPN", paramName: null, envVar: null }, // Impact-wrapped
  komoot: { label: "Komoot", paramName: null, envVar: null },
  alltrails: { label: "AllTrails", paramName: null, envVar: null }, // Impact-wrapped

  /* ── Ground transport ── */
  trainline: { label: "Trainline", paramName: null, envVar: null }, // Awin-wrapped
  flixbus: { label: "Flixbus", paramName: null, envVar: null }, // Awin-wrapped
  raileurope: { label: "RailEurope", paramName: null, envVar: null }, // Awin-wrapped
  acprail: { label: "ACPRail", paramName: null, envVar: null },
  eurail: { label: "Eurail / Interrail", paramName: null, envVar: null }, // Awin-wrapped
  welcomepickups: { label: "Welcome Pickups", paramName: null, envVar: null }, // Awin-wrapped — airport / city transfers

  /* ── Insurance — kept for backwards compat with earlier drafts; ──
     not part of the v1 strategy. */
  safetywing: { label: "SafetyWing", paramName: "referenceID", envVar: "SAFETYWING_REF" },

  /* ── Pre-baked / generic ── */
  other: { label: "Other (pre-baked URL)", paramName: null, envVar: null },
});

export const AFFILIATE_PROGRAM_OPTIONS = Object.freeze(
  Object.entries(PROGRAM_CONFIG).map(([value, cfg]) => ({
    title: cfg.label,
    value,
  })),
);

/* ─── Region routing helpers ──────────────────────────────────────── */

/**
 * Map an ISO country code (as Vercel reports in x-vercel-ip-country)
 * to one of the affiliate region buckets. Switzerland intentionally
 * sits in the EU bucket — it's outside the EU politically but its
 * outdoor brands (Mammut), language overlap (German), and gear
 * shipping pattern align with EU storefronts. UK is its own bucket
 * post-Brexit (separate shipping, separate Amazon storefront).
 */
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // Non-EU but bucketed with EU for affiliate routing:
  "CH", "NO", "IS", "LI",
]);
const ASIA_COUNTRIES = new Set(["JP", "KR", "SG", "HK", "TW"]);

export function countryToRegion(country) {
  if (!country) return "us";
  const c = String(country).toUpperCase();
  if (c === "GB") return "uk";
  if (EU_COUNTRIES.has(c)) return "eu";
  if (ASIA_COUNTRIES.has(c)) return "asia";
  return "us";
}

/**
 * For a multi-retailer affiliateLink (e.g. Backcountry US +
 * Bergfreunde EU), pick the regional override matching the visitor's
 * country. Falls back to the doc's default (url + program) when no
 * override matches.
 *
 * @param {object} link  affiliateLink doc as returned by GROQ
 * @param {string} country  ISO country code from x-vercel-ip-country
 * @returns {{ url: string, program: string }}
 */
export function resolveRegionalLink(link, country) {
  if (!link) return null;
  const region = countryToRegion(country);
  const override = Array.isArray(link.regions)
    ? link.regions.find((r) => r?.region === region && r.url && r.program)
    : null;
  if (override) {
    return { url: override.url, program: override.program };
  }
  return { url: link.url, program: link.program };
}

/* ─── Amazon regional swap ─────────────────────────────────────────── */

const AMAZON_HOSTS_BY_REGION = Object.freeze({
  us: { host: "www.amazon.com", envVar: "AMAZON_TAG_US" },
  uk: { host: "www.amazon.co.uk", envVar: "AMAZON_TAG_UK" },
  eu: { host: "www.amazon.de", envVar: "AMAZON_TAG_DE" },
  // Asia: defaults to .com — Amazon's regional storefronts in Asia
  // (.co.jp, .sg) require separate Associates accounts; treat as US
  // until those programs are signed up for.
  asia: { host: "www.amazon.com", envVar: "AMAZON_TAG_US" },
});

const AMAZON_HOST_PATTERN =
  /^www\.(amazon\.com|amazon\.co\.uk|amazon\.de|amazon\.fr|amazon\.it|amazon\.es|amazon\.nl|amazon\.com\.au|amazon\.ca)$/i;

/**
 * Swap an amazon.* URL to the storefront matching the visitor's region
 * and tag it with the right per-region env-var tracking ID.
 *
 * If no env var is set for the resolved region, falls back to the .com
 * tag (AMAZON_TAG_US) so the link is still tracked. If even that's
 * missing, the URL is returned with the regional host but no tag —
 * still works, just no commission.
 *
 * @param {string} href
 * @param {string} country
 * @returns {string}
 */
export function resolveAmazonRegional(href, country) {
  if (!href) return href;
  let url;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!AMAZON_HOST_PATTERN.test(url.hostname)) return href;

  const region = countryToRegion(country);
  const target = AMAZON_HOSTS_BY_REGION[region] || AMAZON_HOSTS_BY_REGION.us;

  url.hostname = target.host;
  const tag =
    process.env[target.envVar] || process.env.AMAZON_TAG_US || null;
  if (tag) url.searchParams.set("tag", tag);
  return url.toString();
}

/* ─── Generic param injection (for non-region-aware programs) ──────── */

/**
 * Append the program's tracking parameter to `href`.
 *
 * Returns the href unchanged when:
 *   - href is empty / unparseable
 *   - program is unknown
 *   - program is pass-through (paramName: null)
 *   - the env var holding the tracking ID is unset
 *   - the URL already has the param (don't overwrite editor-supplied IDs)
 *
 * For Amazon (regional: true), prefer resolveAmazonRegional() which
 * also swaps the host. This function will still tag a .com URL if the
 * country isn't known.
 */
export function withAffiliateParams(href, program, country = null) {
  if (!href) return href;
  const cfg = PROGRAM_CONFIG[program];
  if (!cfg) return href;

  // Amazon: full regional swap if we have the visitor country.
  if (cfg.regional && program === "amazon" && country) {
    return resolveAmazonRegional(href, country);
  }

  if (!cfg.paramName || !cfg.envVar) return href;
  const trackingId = process.env[cfg.envVar];
  if (!trackingId) return href;
  try {
    const url = new URL(href);
    if (!url.searchParams.has(cfg.paramName)) {
      url.searchParams.set(cfg.paramName, trackingId);
    }
    return url.toString();
  } catch {
    return href;
  }
}

/* ─── Body-block tagger ────────────────────────────────────────────── */

/**
 * Walk a Portable Text body and rewrite every link annotation that has
 * `affiliateProgram` set, injecting the tracking ID into the href.
 *
 * Used at story-load time (in shapeGuide / shapeStory). Country isn't
 * known at SSG time so Amazon links here keep .com — the country swap
 * happens at /go/ click time, where x-vercel-ip-country is available.
 *
 * @param {Array} blocks
 * @returns {Array}
 */
export function tagAffiliateLinksInBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map((block) => {
    if (block?._type !== "block" || !Array.isArray(block.markDefs)) {
      return block;
    }
    let changed = false;
    const newMarkDefs = block.markDefs.map((m) => {
      if (
        m?._type !== "link" ||
        !m.isAffiliate ||
        !m.affiliateProgram ||
        !m.href
      ) {
        return m;
      }
      const tagged = withAffiliateParams(m.href, m.affiliateProgram);
      if (tagged === m.href) return m;
      changed = true;
      return { ...m, href: tagged };
    });
    if (!changed) return block;
    return { ...block, markDefs: newMarkDefs };
  });
}

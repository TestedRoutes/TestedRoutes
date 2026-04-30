/**
 * Klaro consent-management configuration.
 *
 * Drives the cookie-consent banner + modal at the bottom of every page.
 * Buyers from EU/EEA/UK and other opt-in regions see the banner on first
 * visit; their choices persist in the `tr_consent` cookie for 365 days.
 *
 * Adding a tracker:
 *   1. Add an entry to the `services` array below with `default: false`.
 *   2. In the calling code, gate the tracker's load with `klaro.getManager().consents[<name>]`
 *      (or use the global `klaro.show()` to expose the modal).
 *   3. Mention the tracker in app/(site)/privacy/page.jsx and update its status row.
 *
 * Today no marketing services are wired in — they're all listed as
 * `default: false` placeholders, so consent state exists but no script
 * loads. Flipping a service "on" is just adding a `<script>` tag (or the
 * equivalent fetch) inside its `onAccept` callback later.
 *
 * Reference: https://klaro.org/docs/getting-started
 */

const klaroConfig = {
  version: 1,

  // DOM element id Klaro mounts into. We render an empty <div id="klaro"/>
  // in the root layout so Klaro has a stable target.
  elementID: "klaro",

  // 'light' theme + banner at the top so it doesn't block the buy button.
  styling: { theme: ["light", "top"] },

  // Auto-load on page mount (we want the banner to appear ASAP).
  noAutoLoad: false,

  // Allow HTML in translations (we use <a> tags for the privacy link).
  htmlTexts: true,

  embedded: false,

  // Group services by purpose (Analytics / Marketing) in the modal.
  groupByPurpose: true,

  // Persist consent in a cookie (vs localStorage) so it survives across
  // subdomains and is server-readable if we ever need it.
  storageMethod: "cookie",
  cookieName: "tr_consent",
  cookieExpiresAfterDays: 365,

  // Services default to OFF until the buyer accepts. Required for opt-in
  // jurisdictions (EU/EEA/UK) and a safe default for everywhere else.
  default: false,

  // Banner can be dismissed without making a choice (no `mustConsent`
  // dark-pattern). The dismissal counts as "no consent".
  mustConsent: false,

  // Show "Accept all" + "Decline all" buttons alongside per-service toggles.
  acceptAll: true,
  hideDeclineAll: false,
  hideLearnMore: false,

  // Banner mode (not full-screen modal).
  noticeAsModal: false,
  showNoticeTitle: true,

  // ── Translations ──────────────────────────────────────────────────
  translations: {
    en: {
      consentModal: {
        title: "Cookie & tracking preferences",
        description:
          'We use a small number of technologies to keep the site working, ' +
          'measure how it\'s used, and (in future) run paid marketing. You can ' +
          'choose what to allow. See our <a href="/privacy">Privacy Policy</a> ' +
          'for full details.',
      },
      consentNotice: {
        title: "Privacy on testedroutes.com",
        description:
          'We use cookies and similar technologies to keep the site working ' +
          'and, with your consent, to measure traffic and run marketing ' +
          'campaigns. <a href="/privacy">Read our Privacy Policy</a>.',
        learnMore: "Manage choices",
      },
      ok: "Accept all",
      acceptAll: "Accept all",
      acceptSelected: "Save choices",
      decline: "Decline non-essential",
      close: "Close",
      poweredBy: "Realised with Klaro!",

      purposes: {
        functional: { title: "Functional" },
        analytics: { title: "Analytics" },
        marketing: { title: "Marketing" },
        affiliate: { title: "Affiliate" },
      },

      // Per-service translations: keep purpose-level only for now; service-
      // level descriptions are pulled from the `services` array below.
    },
  },

  // ── Purposes ─────────────────────────────────────────────────────
  purposes: [
    { name: "functional" },
    { name: "analytics" },
    { name: "marketing" },
    { name: "affiliate" },
  ],

  // ── Services ─────────────────────────────────────────────────────
  // Each entry maps to a tracker that we may load. Today none of these
  // load any script (the marketing pixels aren't activated). When
  // activating a tracker, add the load logic inside its `onAccept`
  // callback in app/_components/CookieConsent.jsx.
  services: [
    // Strictly necessary cookie — required, can't be turned off.
    {
      name: "currency",
      title: "Currency preference",
      purposes: ["functional"],
      cookies: [["tr_currency", "/"]],
      required: true,
      default: true,
    },

    // Anonymous, cookie-free site analytics. PostHog is configured for
    // in-memory storage today, so we technically don't *need* consent —
    // but listing it here lets buyers see and toggle it cleanly if we
    // ever switch to cookie-mode persistence.
    {
      name: "posthog",
      title: "PostHog (anonymous analytics)",
      purposes: ["analytics"],
      cookies: [],
      required: false,
      default: false,
      description:
        "Anonymous, cookie-free site analytics. Currently uses in-memory storage only.",
    },

    // ── Marketing platforms — none active yet ──
    {
      name: "meta-pixel",
      title: "Meta Pixel (Facebook, Instagram)",
      purposes: ["marketing"],
      cookies: [["_fbp"], ["fr"]],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for Facebook and Instagram ads.",
    },
    {
      name: "google-ads",
      title: "Google Ads + Google Analytics 4",
      purposes: ["marketing", "analytics"],
      cookies: [/^_ga/, ["_gid"], ["_gcl_au"]],
      required: false,
      default: false,
      description:
        "Measures Google Ads conversions and tracks how visitors arrive on the site.",
    },
    {
      name: "youtube",
      title: "YouTube (via Google Ads)",
      purposes: ["marketing"],
      cookies: [],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for YouTube ads.",
    },
    {
      name: "tiktok-pixel",
      title: "TikTok Pixel",
      purposes: ["marketing"],
      cookies: [["_ttp"]],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for TikTok ads.",
    },
    {
      name: "pinterest-tag",
      title: "Pinterest Tag",
      purposes: ["marketing"],
      cookies: [["_pin_unauth"], ["_pinterest_ct_ua"]],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for Pinterest ads.",
    },
    {
      name: "reddit-pixel",
      title: "Reddit Pixel",
      purposes: ["marketing"],
      cookies: [],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for Reddit ads.",
    },
    {
      name: "x-pixel",
      title: "X (Twitter) Pixel",
      purposes: ["marketing"],
      cookies: [],
      required: false,
      default: false,
      description: "Tracks ad-campaign performance for X (Twitter) ads.",
    },

    // ── Affiliate trackers ──
    // Awin / Impact / Geniuslink etc. only set cookies if we drop their
    // MasterTag on testedroutes.com. They don't fire today; pre-listing
    // the service makes adding them later a one-line change.
    {
      name: "affiliate-trackers",
      title: "Affiliate-network trackers",
      purposes: ["affiliate"],
      cookies: [],
      required: false,
      default: false,
      description:
        "Cookies set by affiliate networks (Awin, Impact, etc.) on testedroutes.com to attribute referred purchases. Outbound clicks to partner sites are not affected by this setting.",
    },
  ],
};

export default klaroConfig;

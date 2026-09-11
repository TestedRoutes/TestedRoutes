/**
 * Switzerland's regional sub-hubs - the registry the country page groups
 * its guide cards by, and the scope each future /destinations/<region>
 * page will fetch from.
 *
 * Why an explicit list rather than a Sanity query: a story's `regions`
 * field is a DISPLAY label ("La Digue · Seychelles · Africa", see
 * app/_lib/inspireStoryDisplay.js) and was never meant to be a key, so
 * scoping by it would break the day someone edits a label to read better.
 * Guides carry no region at all. The scoping therefore lives here, in code,
 * and `npm run check:swiss-hubs` keeps it honest against the live dataset.
 *
 * Rules the checker enforces:
 *
 * - A guide appears in exactly ONE region - a guide in two regions would be
 *   sold twice on the country page and would belong to two sub-hubs. A live
 *   Swiss guide in zero regions is an error too: it would vanish from the
 *   country page silently.
 * - A story may sit in one region; a live Swiss story in no region is a
 *   warning (the country page still lists it, the sub-hub will not).
 * - Every slug listed must be live in Sanity. `guideSlugs` are guide PAGE
 *   slugs (`coalesce(guide.pageSlug, slug.current)`, which is what /guides/
 *   routes on - the Trift guide's doc slug differs from its page slug);
 *   `storySlugs` are story doc slugs.
 * - `hub: true` only when the region's page exists at
 *   app/(site)/destinations/<slug>/page.jsx AND its slug is in
 *   DESTINATION_SLUGS (app/_lib/destinations.js). The country page links a
 *   region card only when `hub` is true; everything else renders as a plain
 *   card. Flip the flag in the same commit as the page, never before.
 *
 * `label` is the reader-facing heading (accented, playbook voice card);
 * `name` is the short form for breadcrumbs and cards; `slug` is ASCII and
 * is also the future URL segment.
 */
export const SWISS_REGIONS = [
  {
    slug: "zurich",
    name: "Zürich",
    label: "Zürich",
    hub: false,
    guideSlugs: [],
    storySlugs: [],
  },
  {
    slug: "lucerne",
    name: "Lucerne",
    label: "Lucerne & Central Switzerland",
    hub: false,
    guideSlugs: [],
    storySlugs: [],
  },
  {
    slug: "interlaken",
    name: "Interlaken",
    label: "Interlaken & the Jungfrau Region",
    hub: false,
    // Page slug; the Sanity doc slug is triftbrucke-from-zurich.
    guideSlugs: ["trift-bridge-from-zurich"],
    storySlugs: ["switzerland-triftbrucke-scariest-footbridge"],
  },
  {
    slug: "zermatt",
    name: "Zermatt",
    label: "Zermatt & Valais",
    hub: false,
    // Alpine Passes Trail stages 19-26, Simplon Pass to Evolène, in trail order.
    guideSlugs: [
      "simplon-pass-to-saas-fee",
      "saas-fee-to-gruben",
      "gruben-to-grimentz",
      "grimentz-to-evolene",
    ],
    storySlugs: [
      "saas-fee-evolene-four-days",
      "grimentz-evolene-dinner-2985",
      "gruben-grimentz-language-changes",
      "saas-fee-gruben",
      "simplon-pass-saas-fee",
    ],
  },
  {
    slug: "geneva",
    name: "Geneva",
    label: "Geneva & Lake Geneva",
    hub: false,
    guideSlugs: [],
    storySlugs: [],
  },
  {
    slug: "lugano",
    name: "Lugano",
    label: "Lugano & Ticino",
    hub: false,
    guideSlugs: [],
    storySlugs: [],
  },
  {
    slug: "st-moritz",
    name: "St. Moritz",
    label: "St. Moritz & the Engadin",
    hub: false,
    // Alpine Passes Trail stages 1-5, St. Moritz to Splügen, in trail order.
    guideSlugs: [
      "st-moritz-to-alp-flix",
      "alp-flix-to-ausserferrera",
      "ausserferrera-to-turra",
    ],
    storySlugs: [
      "st-moritz-splugen-five-stages",
      "st-moritz-alp-flix-hut-behind-corviglia",
      "alp-flix-ausserferrera-hail-pass",
      "ausserferrera-corn-starch",
      "ausserferrera-splugen-stage-nobody-wanted",
    ],
  },
  {
    slug: "appenzell",
    name: "Appenzell",
    label: "Appenzell & Eastern Switzerland",
    hub: false,
    guideSlugs: [],
    storySlugs: [],
  },
];

/** Region entry for a guide page slug, or null when no region claims it. */
export function regionForGuide(pageSlug) {
  return SWISS_REGIONS.find((r) => r.guideSlugs.includes(pageSlug)) ?? null;
}

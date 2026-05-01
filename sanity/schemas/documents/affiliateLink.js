/**
 * Affiliate link document.
 *
 * One doc per stable, addressable affiliate URL — both globally shared
 * links (zurich-hotel, safetywing, swiss-travel-pass) and guide-specific
 * ones (triftbrucke-gear-kit, denali-flights-anchorage).
 *
 * The slug is the path under /go/ — `/go/<slug>` 302-redirects to the
 * URL with the program's tracking ID injected from env vars at request
 * time. The same slugs are what the publish script bakes into the
 * `pdf-affiliate-links.md` cheat sheet for the PDF author to use.
 *
 * Authoring:
 *   These docs are not normally hand-edited in Studio. They're upserted
 *   by the publish script from content/affiliates-global.yaml plus each
 *   guide folder's affiliates.yaml. Studio is the read-only mirror; the
 *   yaml files are the source of truth.
 *
 * Naming convention for slugs:
 *   - Global links: short keyword, e.g. zurich-hotel, safetywing, nordvpn
 *   - Guide-specific: prefixed with the guide slug, e.g.
 *     triftbrucke-gear-kit, denali-flights-anchorage
 *   The prefix is convention, not enforcement — the publish script errors
 *   on slug collisions across stories.
 */
export default {
  name: "affiliateLink",
  title: "Affiliate link",
  type: "document",
  description:
    'Source-of-truth for a single /go/<slug> redirect. Upserted by the publish script from content/affiliates-global.yaml or per-guide affiliates.yaml — don\'t hand-edit unless you really mean to.',
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      description:
        'Editor-facing display name, e.g. "Hilton Zurich" or "Trift Bridge gear kit". Shown in lists and the PDF cheat sheet.',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Stable identifier — used as the path under /go/. Globally unique. Lowercase, hyphenated. Once published, treat as immutable (it lives in PDFs).",
      options: {
        source: "label",
        maxLength: 96,
        slugify: (input) =>
          String(input || "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "scope",
      title: "Scope",
      type: "string",
      description:
        '"Global" = shared across guides (e.g. zurich-hotel). "Guide-specific" = scoped to one guide (e.g. triftbrucke-gear-kit). Affects nothing functionally — just helps Studio filtering and orphan detection.',
      options: {
        list: [
          { title: "Global (shared across guides)", value: "global" },
          { title: "Guide-specific", value: "guide" },
        ],
        layout: "radio",
      },
      initialValue: "global",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Drives display grouping on /guides/<slug>/links. Trip-specific categories appear in the first table; travel essentials in the second.",
      options: {
        list: [
          // Trip-specific (first table on the page)
          { title: "Flights", value: "flights" },
          { title: "Cars", value: "cars" },
          { title: "Transport", value: "transport" },
          { title: "Tickets", value: "tickets" },
          { title: "Hotels", value: "hotels" },
          { title: "Restaurant", value: "restaurant" },
          { title: "Gear", value: "gear" },
          // Travel essentials (second table)
          { title: "Insurance", value: "insurance" },
          { title: "eSIM", value: "esim" },
          { title: "VPN", value: "vpn" },
          { title: "Currency", value: "currency" },
          { title: "Hiking apps", value: "hiking_apps" },
          { title: "Credit cards", value: "credit_cards" },
        ],
        layout: "dropdown",
      },
      initialValue: "hotels",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "url",
      title: "Default URL",
      type: "url",
      description:
        "Destination URL with NO tracking parameters. Tracking IDs are appended at click time from env vars based on the program. Used as the fallback when no regional override matches the visitor's country.",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    },
    {
      name: "program",
      title: "Default program",
      type: "string",
      description:
        "Which network the default URL goes through. Drives which env-var tracking ID gets appended at click time. Mirrors PROGRAM_CONFIG in app/_lib/affiliatePrograms.js.",
      options: {
        list: [
          { title: "Booking.com", value: "booking" },
          { title: "Agoda", value: "agoda" },
          { title: "GetYourGuide", value: "gyg" },
          { title: "Viator (CJ)", value: "viator" },
          { title: "TheFork", value: "thefork" },
          { title: "Skyscanner", value: "skyscanner" },
          { title: "Kiwi.com", value: "kiwi" },
          { title: "Kayak", value: "kayak" },
          { title: "Sixt", value: "sixt" },
          { title: "Europcar", value: "europcar" },
          { title: "Backcountry", value: "backcountry" },
          { title: "Bergfreunde / Alpinetrek", value: "bergfreunde" },
          { title: "Decathlon", value: "decathlon" },
          { title: "Patagonia", value: "patagonia" },
          { title: "Black Diamond", value: "blackdiamond" },
          { title: "Osprey", value: "osprey" },
          { title: "Mammut", value: "mammut" },
          { title: "Salomon", value: "salomon" },
          { title: "Arc'teryx", value: "arcteryx" },
          { title: "Amazon (regional swap by visitor country)", value: "amazon" },
          { title: "Saily", value: "saily" },
          { title: "Holafly", value: "holafly" },
          { title: "Revolut", value: "revolut" },
          { title: "Wise", value: "wise" },
          { title: "NordVPN", value: "nordvpn" },
          { title: "Komoot", value: "komoot" },
          { title: "AllTrails", value: "alltrails" },
          { title: "Trainline", value: "trainline" },
          { title: "Flixbus", value: "flixbus" },
          { title: "RailEurope", value: "raileurope" },
          { title: "ACPRail", value: "acprail" },
          { title: "Eurail", value: "eurail" },
          { title: "Welcome Pickups", value: "welcomepickups" },
          { title: "Other (pre-baked URL — pass-through)", value: "other" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "regions",
      title: "Regional overrides",
      type: "array",
      description:
        "Optional. Per-region URL/program override. Used for gear (Backcountry US vs Bergfreunde EU) and brand-direct sites with separate regional storefronts (Patagonia .com vs eu.patagonia.com). The /go/ resolver picks the override matching the visitor's country bucket; falls back to the default URL/program above when none match.",
      of: [{ type: "regionalAffiliate" }],
    },
    {
      name: "linkText",
      title: "Suggested link text",
      type: "string",
      description:
        "Optional. Default link text the publish script uses in the PDF cheat sheet's 'Link text' column. Falls back to label if unset.",
    },
    {
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description:
        "Internal notes — why this link exists, when to use vs. alternatives, expiry/seasonality. Not shown publicly.",
    },
  ],
  preview: {
    select: {
      title: "label",
      slug: "slug.current",
      scope: "scope",
      program: "program",
      regions: "regions",
    },
    prepare({ title, slug, scope, program, regions }) {
      const regionCount = Array.isArray(regions) ? regions.length : 0;
      const subtitleParts = [
        slug && `/go/${slug}`,
        program,
        scope,
        regionCount > 0 && `${regionCount} region${regionCount > 1 ? "s" : ""}`,
      ].filter(Boolean);
      return { title, subtitle: subtitleParts.join(" · ") };
    },
  },
  orderings: [
    { title: "Slug (A–Z)", name: "slugAsc", by: [{ field: "slug.current", direction: "asc" }] },
    { title: "Category", name: "categoryAsc", by: [{ field: "category", direction: "asc" }] },
    { title: "Scope", name: "scopeAsc", by: [{ field: "scope", direction: "asc" }] },
  ],
};

/**
 * Regional override for an affiliateLink doc.
 *
 * Lets a single affiliate slug (e.g. "merrell-moab-3") point at different
 * URLs in different regions — Backcountry US, Bergfreunde EU, etc. — when
 * the products on each retailer aren't the same SKU.
 *
 * The /go/<slug> resolver picks the override matching the visitor's
 * country (x-vercel-ip-country). If no override matches, it falls back to
 * the affiliateLink's default url + program.
 *
 * Region values:
 *   - "us"   visitors with country=US (and ungrouped fallback for non-EU/UK)
 *   - "eu"   visitors with country in EU member states
 *   - "uk"   visitors with country=GB
 *   - "asia" visitors with country in major Asian markets (JP, KR, SG, HK, TW)
 *
 * Keep the region list short — the resolver maps countries to these
 * buckets, not to every individual country.
 */
export default {
  name: "regionalAffiliate",
  title: "Regional override",
  type: "object",
  fields: [
    {
      name: "region",
      title: "Region",
      type: "string",
      options: {
        list: [
          { title: "US (and other non-EU/UK)", value: "us" },
          { title: "EU", value: "eu" },
          { title: "UK", value: "uk" },
          { title: "Asia (JP, KR, SG, HK, TW)", value: "asia" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      description:
        "Destination URL for visitors in this region. Paste the raw URL — tracking IDs are appended at click time from env vars.",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    },
    {
      name: "program",
      title: "Program",
      type: "string",
      description:
        "Which affiliate program backs this regional URL. Drives which env-var tracking ID gets appended. Mirrors PROGRAM_CONFIG in app/_lib/affiliatePrograms.js.",
      options: {
        list: [
          // Hotels
          { title: "Booking.com", value: "booking" },
          { title: "Agoda", value: "agoda" },
          // Tours / tickets
          { title: "GetYourGuide", value: "gyg" },
          { title: "Viator (CJ)", value: "viator" },
          { title: "TheFork", value: "thefork" },
          // Flights
          { title: "Skyscanner", value: "skyscanner" },
          { title: "Kiwi.com", value: "kiwi" },
          // Cars
          { title: "Kayak", value: "kayak" },
          { title: "Sixt", value: "sixt" },
          { title: "Europcar", value: "europcar" },
          // Gear — kit retailers
          { title: "Backcountry", value: "backcountry" },
          { title: "Bergfreunde / Alpinetrek", value: "bergfreunde" },
          { title: "Decathlon", value: "decathlon" },
          // Gear — brand-direct
          { title: "Patagonia", value: "patagonia" },
          { title: "Black Diamond", value: "blackdiamond" },
          { title: "Osprey", value: "osprey" },
          { title: "Mammut", value: "mammut" },
          { title: "Salomon", value: "salomon" },
          { title: "Arc'teryx", value: "arcteryx" },
          // Amazon (regional handled by program-internal swap, but listed here for completeness)
          { title: "Amazon (.com)", value: "amazon" },
          // Connectivity
          { title: "Saily", value: "saily" },
          { title: "Holafly", value: "holafly" },
          // Money
          { title: "Revolut", value: "revolut" },
          { title: "Wise", value: "wise" },
          // Apps
          { title: "NordVPN", value: "nordvpn" },
          { title: "Komoot", value: "komoot" },
          { title: "AllTrails", value: "alltrails" },
          // Ground transport
          { title: "Trainline", value: "trainline" },
          { title: "Flixbus", value: "flixbus" },
          { title: "RailEurope", value: "raileurope" },
          { title: "ACPRail", value: "acprail" },
          { title: "Eurail", value: "eurail" },
          { title: "Welcome Pickups", value: "welcomepickups" },
          // Other
          { title: "Other (pre-baked URL)", value: "other" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { region: "region", url: "url", program: "program" },
    prepare({ region, url, program }) {
      return {
        title: `${region.toUpperCase()} → ${program}`,
        subtitle: url,
      };
    },
  },
};

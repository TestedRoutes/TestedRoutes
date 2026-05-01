import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuides, loadGuideBySlug } from "../../../../_lib/loadGuides";
import { groupAffiliateLinks } from "../../../../_lib/affiliateLinks";
import { PROGRAM_CONFIG } from "../../../../_lib/affiliatePrograms";

export async function generateStaticParams() {
  const guides = await loadGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(slug);
  if (!guide) return {};
  const title = `${guide.title} – Booking & affiliate links · TestedRoutes`;
  const description = `Curated booking, gear, and tour links for ${guide.title}. Free to use; the full guide with the day-by-day plan is sold separately.`;
  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}/links` },
    robots: { index: false, follow: true },
  };
}

/**
 * Two-table category model:
 *
 *   TRIP_SPECIFIC — items the reader books for this trip (hotel,
 *   transport, tickets, etc.). Render in the first table.
 *
 *   TRAVEL_ESSENTIALS — always-on stack the reader keeps across trips
 *   (insurance, eSIM, VPN, currency, hiking apps, credit cards).
 *   Render in the second table.
 *
 * Categories within each group display in the order listed below.
 * Mirrors the dropdowns in sanity/schemas/documents/{affiliateLink,
 * story}.js — keep in sync.
 */
const TRIP_SPECIFIC = [
  { value: "flights", label: "Flights" },
  { value: "cars", label: "Cars" },
  { value: "transport", label: "Transport" },
  { value: "tickets", label: "Tickets" },
  { value: "hotels", label: "Hotels" },
  { value: "restaurant", label: "Restaurant" },
  { value: "gear", label: "Gear" },
];

const TRAVEL_ESSENTIALS = [
  { value: "insurance", label: "Insurance" },
  { value: "esim", label: "eSIM" },
  { value: "vpn", label: "VPN" },
  { value: "currency", label: "Currency" },
  { value: "hiking_apps", label: "Hiking apps" },
  { value: "credit_cards", label: "Credit cards" },
];

const CATEGORY_INDEX = new Map([
  ...TRIP_SPECIFIC.map((c, i) => [c.value, { ...c, sort: i, group: "trip" }]),
  ...TRAVEL_ESSENTIALS.map((c, i) => [c.value, { ...c, sort: i, group: "essentials" }]),
]);

/**
 * Flatten the guide's affiliateLinks references into row-shaped
 * objects, partitioned into trip-specific vs travel-essentials and
 * sorted by category order within each group.
 */
function buildRowGroups(refs) {
  const trip = [];
  const essentials = [];
  if (!Array.isArray(refs)) return { trip, essentials };

  for (const r of refs) {
    if (!r?.slug) continue;
    const catKey = r.category;
    const catEntry = CATEGORY_INDEX.get(catKey);
    if (!catEntry) continue; // legacy / unknown categories skipped silently
    const program = r.program || "other";
    const programLabel =
      program === "other" ? "Direct" : PROGRAM_CONFIG[program]?.label || program;
    const row = {
      slug: r.slug,
      href: `/go/${r.slug}`,
      label: r.label || r.slug,
      linkText: r.linkText || null,
      categoryLabel: catEntry.label,
      categorySort: catEntry.sort,
      programLabel,
    };
    (catEntry.group === "trip" ? trip : essentials).push(row);
  }
  const sorter = (a, b) => {
    if (a.categorySort !== b.categorySort) return a.categorySort - b.categorySort;
    return a.label.localeCompare(b.label);
  };
  trip.sort(sorter);
  essentials.sort(sorter);
  return { trip, essentials };
}

/**
 * Backward-compat fallback for older guides that still use body
 * markdown affiliate links rather than the affiliateLinks reference
 * array. Maps onto the same row shape; old categories that don't
 * exist in the new model are silently skipped.
 */
function rowGroupsFromBody(blocks) {
  const groups = groupAffiliateLinks(blocks);
  const trip = [];
  const essentials = [];
  for (const g of groups) {
    const catEntry = CATEGORY_INDEX.get(g.value);
    if (!catEntry) continue;
    for (const l of g.links) {
      const row = {
        slug: null,
        href: l.href,
        label: l.text || l.href,
        linkText: null,
        categoryLabel: catEntry.label,
        categorySort: catEntry.sort,
        programLabel: "Direct",
      };
      (catEntry.group === "trip" ? trip : essentials).push(row);
    }
  }
  const sorter = (a, b) => a.categorySort - b.categorySort;
  trip.sort(sorter);
  essentials.sort(sorter);
  return { trip, essentials };
}

function LinkTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header — desktop only; on mobile each row stacks. */}
      <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:grid md:grid-cols-[140px_140px_minmax(0,1fr)_auto] md:gap-6">
        <div>Category</div>
        <div>Provider</div>
        <div>Description</div>
        <div className="w-32" />
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((r) => (
          <div
            key={r.href}
            className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[140px_140px_minmax(0,1fr)_auto] md:items-center md:gap-6"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                Category
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                {r.categoryLabel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                Provider
              </p>
              <p className="text-sm text-slate-700">{r.programLabel}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                Description
              </p>
              <p className="text-sm font-medium text-slate-900">{r.label}</p>
              {r.linkText && r.linkText !== r.label ? (
                <p className="mt-0.5 text-xs italic text-slate-500">
                  {r.linkText}
                </p>
              ) : null}
            </div>
            <div>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex w-full justify-center rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 md:w-32"
              >
                Open link →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ title, hint }) {
  return (
    <div className="mb-3 mt-10">
      <p className="font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        {title}
      </p>
      {hint ? (
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default async function GuideLinksPage({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(slug);
  if (!guide) notFound();

  // Prefer the structured affiliateLinks reference array. Fall back to
  // body extraction for guides authored before that field existed.
  const { trip, essentials } =
    Array.isArray(guide.affiliateLinks) && guide.affiliateLinks.length > 0
      ? buildRowGroups(guide.affiliateLinks)
      : rowGroupsFromBody(guide.bodyBlocks);

  const guideHref = `/guides/${guide.slug}`;
  const isEmpty = trip.length === 0 && essentials.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-16 pt-8">
      <nav
        className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/guides" className="hover:text-slate-600">
          Guides
        </Link>
        <span>›</span>
        <Link href={guideHref} className="hover:text-slate-600">
          {guide.title}
        </Link>
        <span>›</span>
        <span className="text-slate-600">Links</span>
      </nav>

      <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
        {guide.title} – booking links
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
        Curated bookings, gear, and tours we recommend for this trip. The
        full{" "}
        <Link className="underline" href={guideHref}>
          {guide.title} guide
        </Link>{" "}
        (with the day-by-day plan, transport timings, and weather rules) is
        sold separately as a PDF.
      </p>

      <aside
        role="note"
        aria-label="Affiliate disclosure"
        className="mt-5 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs leading-relaxed text-amber-900"
      >
        <p className="font-semibold">Affiliate disclosure</p>
        <p className="mt-1 text-amber-900/80">
          Some of the links on this page are <strong>affiliate links</strong>.
          If you click one and complete a purchase on the destination site, we
          may earn a commission at <strong>no extra cost to you</strong>. The
          price you pay is exactly the same as if you went to that site
          directly. Affiliate income is how we keep guide prices low and stay
          independent of any single tour operator.
        </p>
        <p className="mt-2 text-amber-900/80">
          As an Amazon Associate, TestedRoutes earns from qualifying purchases.
        </p>
      </aside>

      {isEmpty ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
          No affiliate links have been added to this guide yet.
        </p>
      ) : (
        <>
          {trip.length > 0 ? (
            <>
              <SectionHeading
                title="Trip specific"
                hint="Bookings and gear for this particular trip – pick the ones you need."
              />
              <LinkTable rows={trip} />
            </>
          ) : null}

          {essentials.length > 0 ? (
            <>
              <SectionHeading
                title="Travel essentials"
                hint="The always-on stack we use across every trip – same picks regardless of destination."
              />
              <LinkTable rows={essentials} />
            </>
          ) : null}
        </>
      )}

      <div className="mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-[#f1faf6] p-6">
        <p className="font-['Georgia',serif] text-lg font-semibold text-[#1a1816]">
          Want the full plan?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          The PDF guide bundles these links with the day-by-day itinerary,
          transport timings, weather rules, and route variants – everything
          you need so you don't have to plan from scratch.
        </p>
        <Link
          href={guideHref}
          className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          See the full guide{guide.price ? ` – ${guide.price}` : ""} →
        </Link>
      </div>
    </main>
  );
}

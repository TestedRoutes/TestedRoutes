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
 * Display order for affiliate categories. Used to sort the flat table
 * so essential bookings appear first, ephemera last. Categories not
 * listed here fall through to the bottom under their own raw value.
 */
const CATEGORY_ORDER = [
  { value: "essential_booking", label: "Essential booking" },
  { value: "accommodation", label: "Accommodation" },
  { value: "tour", label: "Tour / ticket" },
  { value: "transport", label: "Transport" },
  { value: "gear", label: "Gear" },
  { value: "essentials", label: "Essential" },
  { value: "dining", label: "Dining" },
  { value: "general", label: "Other" },
];

const CATEGORY_INDEX = new Map(CATEGORY_ORDER.map((c, i) => [c.value, { ...c, sort: i }]));

/**
 * Take a compact first-paragraph excerpt from a multi-line notes field
 * for the "Why" cell. Sentence-boundary detection is unreliable
 * ("e.g." trips a naive period-split), so we just take the first
 * paragraph (up to first blank line) and clip at a word boundary if
 * it's longer than 200 chars. Authors who want to control the excerpt
 * should put the headline first and follow with a blank line.
 */
function shortNotes(notes) {
  if (!notes) return "";
  const firstPara = String(notes).trim().split(/\n\s*\n/)[0];
  const text = firstPara.replace(/\s+/g, " ").trim();
  if (text.length <= 200) return text;
  const cut = text.slice(0, 200);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 120 ? cut.slice(0, lastSpace) : cut;
  return trimmed.trimEnd() + "…";
}

/**
 * Flatten the guide's affiliateLinks references into a single array of
 * row-shaped objects, sorted by CATEGORY_ORDER. Each row carries
 * everything the table cell needs: category label/value, brand label
 * (resolved from PROGRAM_CONFIG), and the /go/ short URL.
 */
function flattenAffiliateRows(refs) {
  if (!Array.isArray(refs) || refs.length === 0) return [];
  const rows = [];
  for (const r of refs) {
    if (!r?.slug) continue;
    const catKey = r.category || "general";
    const catEntry = CATEGORY_INDEX.get(catKey) || {
      value: catKey,
      label: catKey,
      sort: 999,
    };
    const program = r.program || "other";
    const programLabel = PROGRAM_CONFIG[program]?.label || program;
    rows.push({
      slug: r.slug,
      href: `/go/${r.slug}`,
      label: r.label || r.slug,
      linkText: r.linkText || null,
      notes: shortNotes(r.notes),
      categoryValue: catEntry.value,
      categoryLabel: catEntry.label,
      categorySort: catEntry.sort,
      programKey: program,
      programLabel,
    });
  }
  rows.sort((a, b) => {
    if (a.categorySort !== b.categorySort) return a.categorySort - b.categorySort;
    return a.label.localeCompare(b.label);
  });
  return rows;
}

/**
 * Body-extracted fallback for older guides that haven't been migrated
 * to the affiliateLinks reference workflow. Maps the body-link shape
 * onto the same row-shape flattenAffiliateRows produces, so the same
 * renderer handles both.
 */
function rowsFromBodyExtraction(blocks) {
  const groups = groupAffiliateLinks(blocks);
  const rows = [];
  for (const g of groups) {
    const catEntry = CATEGORY_INDEX.get(g.value) || {
      value: g.value,
      label: g.value,
      sort: 999,
    };
    for (const l of g.links) {
      rows.push({
        slug: null,
        href: l.href,
        label: l.text || l.href,
        linkText: null,
        notes: "",
        categoryValue: catEntry.value,
        categoryLabel: catEntry.label,
        categorySort: catEntry.sort,
        programKey: "other",
        programLabel: "External",
      });
    }
  }
  rows.sort((a, b) => a.categorySort - b.categorySort);
  return rows;
}

/**
 * Small chip used for the category column. Quiet visual style — the
 * label and CTA are the row's protagonists, not the badge.
 */
function CategoryBadge({ label }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
      {label}
    </span>
  );
}

export default async function GuideLinksPage({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(slug);
  if (!guide) notFound();

  // Prefer the structured affiliateLinks reference array. Fall back to
  // body extraction for guides authored before that field existed.
  const rows =
    Array.isArray(guide.affiliateLinks) && guide.affiliateLinks.length > 0
      ? flattenAffiliateRows(guide.affiliateLinks)
      : rowsFromBodyExtraction(guide.bodyBlocks);

  const guideHref = `/guides/${guide.slug}`;

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

      {rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
          No affiliate links have been added to this guide yet.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Header row — desktop only; on mobile each row stacks. */}
          <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-6">
            <div>Item</div>
            <div>Why we picked it</div>
            <div className="w-32" />
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map((r) => (
              <div
                key={r.href}
                className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-start md:gap-6"
              >
                {/* Column 1 — category badge + brand + title + linkText */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <CategoryBadge label={r.categoryLabel} />
                    {r.programKey && r.programKey !== "other" ? (
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        via {r.programLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-['Georgia',serif] text-base font-semibold text-[#1a1816]">
                    {r.label}
                  </p>
                  {r.linkText && r.linkText !== r.label ? (
                    <p className="mt-0.5 text-xs italic text-slate-500">{r.linkText}</p>
                  ) : null}
                </div>
                {/* Column 2 — why we picked it (notes excerpt). Empty when
                    no note authored — better silent than scolding. */}
                <div className="text-sm leading-relaxed text-slate-600">
                  {r.notes || ""}
                </div>
                {/* Column 3 — CTA */}
                <div className="md:self-center">
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

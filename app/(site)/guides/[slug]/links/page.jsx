import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuides, loadGuideBySlug } from "../../../../_lib/loadGuides";
import { groupAffiliateLinks } from "../../../../_lib/affiliateLinks";

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

export default async function GuideLinksPage({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(slug);
  if (!guide) notFound();
  const groups = groupAffiliateLinks(guide.bodyBlocks);

  const guideHref = `/guides/${guide.slug}`;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-8">
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
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Curated bookings, gear, and tours we recommend for this trip. These
        links pay us a small commission when you buy through them – the full{" "}
        <Link className="underline" href={guideHref}>
          {guide.title} guide
        </Link>{" "}
        (with the day-by-day plan, transport timings, and weather rules) is
        sold separately as a PDF.
      </p>

      {groups.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
          No affiliate links have been added to this guide yet.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map((group) => (
            <section key={group.value}>
              <p className="mb-3 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
                {group.label}
              </p>
              <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
                {group.links.map((l, i) => (
                  <li
                    key={`${l.href}-${i}`}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                      {l.text}
                    </span>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="shrink-0 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Open link →
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-[#f1faf6] p-6">
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

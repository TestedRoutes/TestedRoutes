import Link from "next/link";
import Byline from "../../_components/Byline";
import StickyBuyBar from "../../_components/StickyBuyBar";
import GuideBody from "../../_components/GuideBody";
import GuideCarousel from "./GuideCarousel";
import GuideTitle from "./GuideTitle";
import { PrimaryStats, LocationSection, buildLocation } from "./GuideTripSections";
import { localePath } from "../../_lib/i18n";

/**
 * Sales layout for guide pages (guide-page-build-spec.md).
 * Rendered by GuidePage when the doc carries the per-SKU sales fields
 * (carousel + cover). All copy in blocks 6–8 is GLOBAL: written once,
 * identical on every SKU — only {title} and {price} substitute.
 */

function CtaButton({ href, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-brand-flame px-7 py-3 text-[15px] font-semibold text-white shadow-card transition hover:brightness-95"
    >
      {label}
    </a>
  );
}

function SectionHeading({ children, sub }) {
  return (
    <div className="mb-5">
      <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
      {sub ? <p className="mt-1 text-sm text-slate-500">{sub}</p> : null}
    </div>
  );
}

const COMPARISON = [
  ["Been there in person", "Yes", "Sometimes", "No", "Rarely"],
  ["One curated route, decided for you", "Yes", "No, fifty options", "Generated, not chosen", "Yes"],
  ["Timed day by day", "Yes", "No", "Loosely", "Yes"],
  ["Booking deadlines flagged", "Yes", "No", "No", "Handled for you"],
  ["Hotel and restaurant picks from real visits", "Yes", "Mixed", "No", "Commission-led"],
  ["Cost breakdown at three spend levels", "Yes", "Rarely", "No", "One price, marked up"],
  ["Works offline, printable", "Yes", "No", "No", "Yes"],
];

function formatReviewDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function GuideSalesPage({
  guide,
  lang,
  t,
  dict,
  checkoutHref,
  pdfHref,
  jsonLdBlocks,
}) {
  const meta = guide.metadata || {};
  const hero = meta.hero || {};
  const sales = meta.sales || {};
  const sp = guide.salesPage || {};
  const href = checkoutHref || pdfHref;
  const ctaLabel = guide.price ? `Get the guide – ${guide.price}` : "Get the guide";
  const location = buildLocation(guide);
  const showLocation = !!(location.start || location.destinations?.length);
  const reviewed = formatReviewDate(meta.maintenance?.last_reviewed_date);
  const destSlug = meta.geography?.destination_slug;
  const destName = meta.geography?.country;

  const formatFacts = [
    sp.pages ? `${sp.pages} pages` : null,
    "PDF, instant download",
    "Printable A4",
    "Google map included",
  ].filter(Boolean);

  return (
    <main className="mx-auto max-w-5xl px-6 pb-8 pt-8 md:pb-16">
      {jsonLdBlocks}

      <nav
        className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href={localePath(lang, "/guides")} className="hover:text-slate-600">
          {dict.nav.guides}
        </Link>
        {destSlug ? (
          <>
            <span>›</span>
            <Link href={`/destinations/${destSlug}`} className="hover:text-slate-600">
              {destName}
            </Link>
          </>
        ) : null}
        <span>›</span>
        <span className="text-slate-600">{guide.title}</span>
      </nav>

      {/* Block 1 — Hero */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:items-center">
        {sp.coverUrl ? (
          <img
            src={sp.coverUrl}
            alt={sp.coverAlt || `Cover of ${guide.title}`}
            className="mx-auto w-full max-w-[380px] rounded-2xl shadow-card"
            fetchPriority="high"
          />
        ) : null}
        <div>
          {hero.eyebrow ? (
            <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">{hero.eyebrow}</p>
          ) : null}
          <GuideTitle
            title={guide.title}
            className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-2xl md:text-4xl"
          />
          {sp.statusNote ? (
            <p className="mt-3 w-fit rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
              {sp.statusNote}
            </p>
          ) : null}
          {hero.subtitle ? (
            <p className="mt-2 text-[15px] text-slate-500">{hero.subtitle}</p>
          ) : null}
          {sp.dayStrip ? (
            <p className="mt-4 text-[14px] font-medium text-slate-700">{sp.dayStrip}</p>
          ) : null}
          {sp.proofLine ? (
            <div className="mt-4 flex items-center gap-3">
              {sp.proofPhotoUrl ? (
                <img
                  src={sp.proofPhotoUrl}
                  alt={sp.proofPhotoAlt || "The author on this trip"}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-card"
                />
              ) : null}
              <p className="text-[14px] italic text-slate-600">{sp.proofLine}</p>
            </div>
          ) : null}
          <p className="mt-4 text-[13px] text-slate-500">{formatFacts.join(" · ")}</p>
          <div className="mt-6">
            <CtaButton href={href} label={ctaLabel} />
            <p className="mt-2 text-[12px] text-slate-500">30-day refund, no questions asked</p>
          </div>
          <Byline lang={lang} />
        </div>
      </section>

      {/* Block 2 — Carousel */}
      <section className="mt-12">
        <GuideCarousel slides={sp.carousel} />
      </section>

      {/* Trip details + route map — kept from the classic layout: buyers
          want the facts and the geography before the sales blocks. */}
      {hero.primary_stats || meta.maintenance?.last_reviewed_date ? (
        <section className="mt-14">
          <SectionHeading>{t.tripDetails}</SectionHeading>
          <PrimaryStats
            stats={hero.primary_stats}
            lastReviewedDate={meta.maintenance?.last_reviewed_date}
            lang={lang}
            t={t}
          />
        </section>
      ) : null}

      {showLocation ? (
        <section className="mt-14">
          <LocationSection
            start={location.start}
            destinations={location.destinations}
            finish={location.finish}
            points={location.points}
            t={t}
          />
        </section>
      ) : null}

      {/* Block 3 — Who this is for */}
      <section className="mt-14">
        <SectionHeading>Who this is for.</SectionHeading>
        <div className="grid gap-6 md:grid-cols-2">
          {/* 3pt after each item — founder's paragraph-spacing spec (2026-07). */}
          <ul className="space-y-[3pt] rounded-2xl border border-brand-line bg-white p-6 text-sm text-slate-700">
            {(sales.who_this_is_for || []).map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-0.5 shrink-0 text-brand-terracotta">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-[3pt] rounded-2xl border border-brand-line bg-white p-6 text-sm text-slate-700">
            {(sales.not_suitable || []).map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-0.5 shrink-0 text-slate-400">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Block 4 — What is inside */}
      <section className="mt-14" id="whats-inside">
        <SectionHeading
          sub={sp.pages ? `${sp.pages} pages. Every one of them useful.` : undefined}
        >
          What is inside the guide.
        </SectionHeading>
        <ul className="columns-1 gap-8 space-y-[3pt] text-[15px] leading-relaxed text-slate-700 md:columns-2">
          {(sales.what_you_get || []).map((item) => (
            <li key={item} className="break-inside-avoid">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Block 5 — Free sample */}
      {sp.sample?.imageUrl ? (
        <section className="mt-14">
          <SectionHeading>Read a full day before you buy.</SectionHeading>
          {sp.sample.body ? (
            <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-slate-700">
              {sp.sample.body}
            </p>
          ) : null}
          <a
            href={sp.sample.pdfPath || sp.sample.imageUrl}
            target="_blank"
            rel="noopener"
            className="block overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:shadow-card-hover"
          >
            <img
              src={sp.sample.imageUrl}
              alt={sp.sample.label || "A full sample day page from the guide"}
              className="w-full"
              loading="lazy"
            />
          </a>
          {sp.sample.pdfPath ? (
            <p className="mt-3 text-sm">
              <a
                href={sp.sample.pdfPath}
                target="_blank"
                rel="noopener"
                className="font-medium text-brand-terracotta underline underline-offset-2"
              >
                {sp.sample.label || "Open the sample page as a PDF"}
              </a>
            </p>
          ) : null}
        </section>
      ) : null}

      {/* My experience — the trip in the founder's own words, sourced from
          the inspire stories. Deliberately experiential: no visit date, no
          guide internals (those stay behind the paywall). */}
      {guide.bodyBlocks?.length ? (
        <section className="mt-14">
          <SectionHeading>{t.myExperience || "My experience"}</SectionHeading>
          <div className="max-w-3xl text-[15px]">
            <GuideBody blocks={guide.bodyBlocks} t={t} bare />
          </div>
        </section>
      ) : null}

      {/* Block 6 — Comparison table (GLOBAL) */}
      <section className="mt-14">
        <SectionHeading>How it compares.</SectionHeading>
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-semibold"> </th>
                <th className="px-4 py-3 font-semibold text-slate-900">This guide</th>
                <th className="px-4 py-3 font-semibold">Free blogs and search</th>
                <th className="px-4 py-3 font-semibold">AI trip planners</th>
                <th className="px-4 py-3 font-semibold">Travel agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON.map(([label, ...cells]) => (
                <tr key={label}>
                  <td className="px-4 py-2.5 font-medium text-slate-900">{label}</td>
                  {cells.map((c, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2.5 ${i === 0 ? "font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2.5 font-medium text-slate-900">Price</td>
                <td className="px-4 py-2.5 font-semibold text-slate-900">{guide.price}</td>
                <td className="px-4 py-2.5 text-slate-600">Free, plus your weekend</td>
                <td className="px-4 py-2.5 text-slate-600">Free, plus the risk</td>
                <td className="px-4 py-2.5 text-slate-600">20 to 40% markup</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Block 7 — Product FAQ */}
      <section className="mt-14">
        <SectionHeading>{t.faqTitle}</SectionHeading>
        <div className="overflow-hidden rounded-2xl border border-brand-line bg-white divide-y divide-slate-100">
          {(sales.faq?.length ? sales.faq : t.faq).map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
                <span>{question}</span>
                <span aria-hidden className="text-slate-400 transition group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Block 8 — Guarantee and related */}
      <section className="mt-14">
        <div className="grid gap-4 rounded-2xl border border-brand-line bg-white p-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">30-day refund.</p>
            <p className="mt-0.5 text-[13px] text-slate-600">No questions asked</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Corrections credited.</p>
            <p className="mt-0.5 text-[13px] text-slate-600">Report a real change, get a credit</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {reviewed ? `Last reviewed ${reviewed}.` : "Kept current."}
            </p>
            <p className="mt-0.5 text-[13px] text-slate-600">Updated with verified changes</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {destSlug ? (
            <div>
              <p className="mb-3 font-serif text-xl text-brand-ink">Planning the trip?</p>
              <Link
                href={`/destinations/${destSlug}`}
                className="block rounded-2xl border border-brand-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Destination
                </p>
                <p className="mt-1 font-serif text-lg text-brand-ink">
                  {destName}: what to do, and how long you need
                </p>
              </Link>
            </div>
          ) : null}
          {guide.relatedStories?.length ? (
            <div>
              <p className="mb-3 font-serif text-xl text-brand-ink">
                Read the stories behind this route.
              </p>
              <div className="grid gap-3">
                {guide.relatedStories.slice(0, 3).map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-14 w-20 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <p className="text-sm font-medium leading-snug text-slate-900">{s.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-10 rounded-[28px] bg-brand-terracotta p-10 text-center text-white">
          <p className="font-serif text-3xl font-light leading-tight">{guide.title}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            Every ferry, booking deadline and pick already decided – tested on the route itself.
          </p>
          {href ? (
            <a
              href={href}
              className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              {ctaLabel}
            </a>
          ) : null}
          <p className="mt-3 text-[11px] uppercase tracking-wider text-white/50">
            PDF · Instant download · 30-day refund
          </p>
        </div>
      </section>

      <StickyBuyBar price={guide.price} checkoutHref={checkoutHref} pdfHref={pdfHref} t={t} />
    </main>
  );
}

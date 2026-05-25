import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuides, loadGuideBySlug } from "../../../_lib/loadGuides";
import { getRequestCurrency } from "../../../_lib/currency";
import {
  getEssentialBookings,
  getAffiliateLinks,
} from "../../../_lib/affiliateLinks";
import LocationMap from "../../../_components/LocationMapClient";
import GuideGallery from "../../../_components/GuideGallery";
import GuideBody from "../../../_components/GuideBody";
import BuyBox from "../../../_components/BuyBox";

export async function generateStaticParams() {
  const guides = await loadGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(slug);
  if (!guide) return {};
  const seo = guide.metadata?.seo || {};
  const title = seo.meta_title
    ? `${seo.meta_title} · TestedRoutes`
    : `${guide.title} · TestedRoutes`;
  const description =
    seo.meta_description ||
    guide.metadata?.hero?.subtitle ||
    `Self-guided travel guide: ${guide.title}.`;
  const image = guide.image || "/images/triftbrucke-hero.jpg";
  const canonical = `/guides/${guide.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [{ url: image, alt: guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function formatReviewDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function PrimaryStats({ stats, lastReviewedDate }) {
  const reviewLabel = formatReviewDate(lastReviewedDate);
  if ((!Array.isArray(stats) || stats.length === 0) && !reviewLabel) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {(stats || []).map((stat) => (
          <div
            key={stat.label}
            className="grid grid-cols-[160px_1fr] gap-4 px-5 py-3 md:grid-cols-[200px_1fr]"
          >
            <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {stat.label}
            </p>
            <p className="text-[14px] text-slate-900">{stat.value}</p>
          </div>
        ))}
        {reviewLabel ? (
          <div className="grid grid-cols-[160px_1fr] gap-4 px-5 py-3 md:grid-cols-[200px_1fr]">
            <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Last reviewed
            </p>
            <p className="text-[14px] text-slate-900">{reviewLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CheckBulletSection({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">{title}</p>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-0.5 shrink-0 text-[#0f6e56]">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotSuitableWarning({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className="rounded-2xl border border-[#e5b59a] bg-[#fdf3ea] p-5">
      <div className="flex gap-3">
        <span aria-hidden className="mt-0.5 shrink-0 text-[#b04a3a]">⚠</span>
        <div className="flex-1">
          <p className="mb-2 font-['Georgia',serif] text-base font-semibold text-[#b04a3a]">
            Not suitable
          </p>
          <ul className="space-y-1 text-sm text-[#5a3a2f]">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-1 shrink-0 text-[#b04a3a]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TimelineBadge({ label, color }) {
  // Round badge matching the start / finish markers on the LocationMap.
  return (
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
      style={{ backgroundColor: color, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
    >
      {label}
    </span>
  );
}

function TimelineDrop({ label, color }) {
  // Teardrop matching the destination marker on the LocationMap.
  return (
    <svg width="26" height="34" viewBox="0 0 36 48" aria-hidden className="shrink-0">
      <path
        d="M18 0C8.06 0 0 8.06 0 18c0 12.5 18 30 18 30s18-17.5 18-30C36 8.06 27.94 0 18 0z"
        fill={color}
      />
      <text
        x="18"
        y="22"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="#ffffff"
      >
        {label}
      </text>
    </svg>
  );
}

function LocationSection({ start, destinations, finish, points }) {
  const dests = Array.isArray(destinations) ? destinations : [];
  if (!start && dests.length === 0) return null;
  const startColor = "#0f6e56";
  const destColor = "#1f2937";
  const lastDestIndex = dests.length - 1;
  const multi = dests.length > 1;
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">Location</p>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <ol className="relative space-y-5 pl-1">
          {start ? (
            <li className="flex gap-3">
              <span className="relative mt-0.5">
                <TimelineBadge label="S" color={startColor} />
                {dests.length > 0 || finish ? (
                  <span className="absolute left-[13px] top-7 h-8 w-px bg-slate-300" />
                ) : null}
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Starting point
                </span>
                <span className="text-sm font-medium text-slate-900">{start.name}</span>
              </span>
            </li>
          ) : null}
          {dests.map((d, i) => {
            const showConnector = i < lastDestIndex || !!finish;
            const label = d.legacy ? "TR" : String(i + 1);
            const eyebrow = multi ? `Stop ${i + 1}` : "Destination";
            return (
              <li key={`dest-${i}`} className="flex gap-3">
                <span className="relative mt-0.5">
                  <TimelineDrop label={label} color={destColor} />
                  {showConnector ? (
                    <span className="absolute left-[13px] top-9 h-7 w-px bg-slate-300" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {eyebrow}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{d.name}</span>
                </span>
              </li>
            );
          })}
          {finish ? (
            <li className="flex gap-3">
              <span className="mt-0.5">
                <TimelineBadge label="F" color={startColor} />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Finish
                </span>
                <span className="text-sm font-medium text-slate-900">{finish.name}</span>
              </span>
            </li>
          ) : null}
        </ol>
        <div className="h-[320px] overflow-hidden rounded-xl ring-1 ring-slate-200">
          <LocationMap start={start} destinations={dests} finish={finish} points={points} />
        </div>
      </div>
    </section>
  );
}

function SaveTimeComparison({ price }) {
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        Save time and money
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Guided tour
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">€120–180</p>
          <p className="mt-1 text-xs text-slate-500">Fixed schedule · Group pace</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Plan yourself
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">8+ hours</p>
          <p className="mt-1 text-xs text-slate-500">Research · Risk of gaps</p>
        </div>
        <div className="rounded-2xl border-2 border-[#0f6e56] bg-[#f1faf6] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0f6e56]">
            This guide
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{price || "–"}</p>
          <p className="mt-1 text-xs text-slate-700">30 min · Complete route</p>
        </div>
      </div>
    </section>
  );
}

const STANDARD_FAQ = [
  {
    question: "Is this guide up to date?",
    answer:
      "Yes. Every TestedRoutes guide is reviewed regularly – the date at the top of the trip details shows when it was last reviewed. Reviews flag broken bookings, transport changes, prices, and seasonal closures so the guide stays accurate as conditions change.",
  },
  {
    question: "What format is the guide?",
    answer:
      "PDF, downloadable instantly after purchase. It works offline once saved to your phone, tablet, or laptop – no app required.",
  },
  {
    question: "What if the weather is bad on my day?",
    answer:
      "The guide includes go/no-go decision rules and weather-dependent alternatives where they exist. If the trip is fully weather-dependent and your dates don't work, request a refund within 30 days.",
  },
  {
    question: "Can I get a refund if it doesn't work for me?",
    answer:
      "Yes – 30 days, no questions asked. Email refunds@testedroutes.com with your order ID. Full details in our refund policy.",
  },
];

function FaqAccordion({ items }) {
  const list = Array.isArray(items) && items.length ? items : STANDARD_FAQ;
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        Frequently asked questions
      </p>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {list.map(({ question, answer }) => (
          <details key={question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
              <span>{question}</span>
              <span
                aria-hidden
                className="text-slate-400 transition group-open:rotate-180"
              >
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
  );
}

function Testimonials({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        What readers say
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(({ quote, author, location }, i) => (
          <figure
            key={`${author}-${i}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span aria-hidden className="font-['Georgia',serif] text-3xl leading-none text-[#0f6e56]">
              “
            </span>
            <blockquote className="mt-1 text-sm leading-relaxed text-slate-700">
              {quote}
            </blockquote>
            <figcaption className="mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{author}</span>
              {location ? <span> · {location}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function RelatedGuides({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <p className="mb-5 font-['Georgia',serif] text-2xl font-semibold text-[#1a1816]">
        You might also like
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((g) => (
          <Link
            key={g.slug}
            href={g.href}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {g.image ? (
              <img
                src={g.image}
                alt={g.title}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-slate-100" />
            )}
            <div className="flex flex-1 flex-col gap-1 p-4">
              {g.eyebrow ? (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {g.eyebrow}
                </p>
              ) : null}
              <p className="font-['Georgia',serif] text-base font-semibold leading-snug text-slate-900 group-hover:text-slate-700">
                {g.title}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
                {g.duration ? <span>{g.duration}</span> : <span />}
                {g.price ? (
                  <span className="font-semibold text-slate-900">{g.price}</span>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BottomCta({ price, checkoutHref, pdfHref }) {
  const href = checkoutHref || pdfHref;
  const buttonLabel = price
    ? `Get the Guide – ${price}`
    : "Get the Guide";
  return (
    <section className="mt-12 rounded-[28px] bg-brand-blue p-10 text-center text-white">
      <p className="font-['Georgia',serif] text-3xl font-semibold leading-tight">
        Travel more.
      </p>
      <p className="font-['Georgia',serif] text-3xl font-semibold leading-tight">
        Waste less time planning.
      </p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
        Premium travel guides built from 15 years of independent travel across 140
        countries.
      </p>
      <p className="mt-2 text-sm italic text-white/60">
        AI hasn't been there. I have.
      </p>
      {href ? (
        <a
          href={href}
          className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {buttonLabel}
        </a>
      ) : null}
      <p className="mt-3 text-[11px] uppercase tracking-wider text-white/40">
        PDF · Instant download · 30-day refund
      </p>
    </section>
  );
}

function buildLocation(guide) {
  const start = guide.startingPoint?.name && guide.startingPoint?.coordinates
    ? {
        name: guide.startingPoint.name,
        lat: guide.startingPoint.coordinates.lat,
        lng: guide.startingPoint.coordinates.lng,
      }
    : null;

  // Prefer the new routeStops array. Fall back to a single legacy
  // destination derived from story.title + story.coordinates so guides
  // authored before the multi-stop schema keep rendering unchanged.
  let destinations = [];
  if (Array.isArray(guide.routeStops) && guide.routeStops.length > 0) {
    destinations = guide.routeStops
      .filter((s) => s?.name && s?.coordinates?.lat && s?.coordinates?.lng)
      .map((s) => ({
        name: s.name,
        type: s.type || null,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
      }));
  } else if (guide.coordinates?.lat && guide.coordinates?.lng && guide.title) {
    destinations = [
      {
        name: guide.title,
        lat: guide.coordinates.lat,
        lng: guide.coordinates.lng,
        legacy: true,
      },
    ];
  }

  // Finish: prefer explicit finishPoint; fall back to start (round-trip).
  const finish = guide.finishPoint?.name && guide.finishPoint?.coordinates
    ? {
        name: guide.finishPoint.name,
        lat: guide.finishPoint.coordinates.lat,
        lng: guide.finishPoint.coordinates.lng,
      }
    : start
      ? { ...start }
      : null;

  const points = Array.isArray(guide.routePoints)
    ? guide.routePoints
        .map((p) => p?.coordinates && { lat: p.coordinates.lat, lng: p.coordinates.lng })
        .filter(Boolean)
    : null;
  return { start, destinations, finish, points };
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const currency = await getRequestCurrency();
  const guide = await loadGuideBySlug(slug, currency);
  if (!guide) notFound();

  const meta = guide.metadata || {};
  const hero = meta.hero || {};
  const sales = meta.sales || {};
  const maintenance = meta.maintenance || {};

  const photos = [guide.image, ...(guide.galleryPhotos || [])].filter(Boolean);
  const checkoutHref = guide.polarProductId
    ? `/api/checkout?products=${encodeURIComponent(guide.polarProductId)}`
    : null;
  const pdfHref = !checkoutHref ? guide.guidePdfUrl || null : null;

  const location = buildLocation(guide);
  const showLocation = !!(location.start || (location.destinations && location.destinations.length > 0));
  const essentialBookings = getEssentialBookings(guide.bodyBlocks);
  const affiliateLinks = getAffiliateLinks(guide.bodyBlocks);
  const hasAffiliateLinks = affiliateLinks.length > 0;

  const canonicalUrl = `https://testedroutes.com/guides/${guide.slug}`;
  const reviewedDate = maintenance.last_reviewed_date || null;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description:
      meta.seo?.meta_description || hero.subtitle || `Tested travel guide: ${guide.title}.`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    image: guide.image ? [guide.image] : undefined,
    author: {
      "@type": "Person",
      name: "Paulius Pikelis",
      url: "https://testedroutes.com/about",
      // sameAs: fill once IG / YouTube / LinkedIn URLs are confirmed.
    },
    publisher: {
      "@type": "Organization",
      name: "TestedRoutes",
      url: "https://testedroutes.com",
    },
    ...(reviewedDate
      ? { datePublished: reviewedDate, dateModified: reviewedDate }
      : {}),
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <nav
        className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/guides" className="hover:text-slate-600">
          Guides
        </Link>
        <span>›</span>
        <Link href="/destinations/switzerland" className="hover:text-slate-600">
          Switzerland
        </Link>
        <span>›</span>
        <span className="text-slate-600">{guide.title}</span>
      </nav>

      <div className="mb-4">
        {hero.eyebrow ? (
          <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">{hero.eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-[32px] font-semibold leading-tight text-slate-900">
          {guide.title}
        </h1>
        {hero.subtitle ? (
          <p className="mt-1 text-[15px] text-slate-500">{hero.subtitle}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px] lg:gap-8">
        <div className="space-y-10">
          <GuideGallery photos={photos} />
          {hero.primary_stats || maintenance.last_reviewed_date ? (
            <section>
              <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
                Trip details
              </p>
              <PrimaryStats
                stats={hero.primary_stats}
                lastReviewedDate={maintenance.last_reviewed_date}
              />
            </section>
          ) : null}

          {showLocation ? (
            <LocationSection
              key={slug}
              start={location.start}
              destinations={location.destinations}
              finish={location.finish}
              points={location.points}
            />
          ) : null}

          <div className="grid gap-8 md:grid-cols-2">
            <CheckBulletSection title="Why this trip" items={sales.why_this_trip} />
            <CheckBulletSection title="Who this is for" items={sales.who_this_is_for} />
          </div>
          <NotSuitableWarning items={sales.not_suitable} />
          <CheckBulletSection title="What you get" items={sales.what_you_get} />
          {hasAffiliateLinks ? (
            <aside
              role="note"
              aria-label="Affiliate disclosure"
              className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-xs leading-relaxed text-amber-900"
            >
              <strong>Affiliate disclosure.</strong> Some links below are
              affiliate links. When you buy through them, we may earn a small
              commission at no extra cost to you. As an Amazon Associate,
              TestedRoutes earns from qualifying purchases.{" "}
              <Link href="/affiliate-disclosure" className="underline">
                More on how this works
              </Link>
              .
            </aside>
          ) : null}
          <GuideBody
            blocks={guide.bodyBlocks}
            checkoutHref={checkoutHref}
            pdfHref={pdfHref}
            price={guide.price}
          />
          <Testimonials items={sales.testimonials} />
          <SaveTimeComparison price={guide.price} />
          <FaqAccordion items={sales.faq} />
        </div>

        <BuyBox
          price={guide.price}
          checkoutHref={checkoutHref}
          pdfHref={pdfHref}
          linksHref={`/guides/${guide.slug}/links`}
          hasAffiliateLinks={true}
          essentialBookings={essentialBookings.map((l) => l.href)}
        />
      </div>

      <RelatedGuides items={guide.relatedGuides} />

      <BottomCta
        price={guide.price}
        checkoutHref={checkoutHref}
        pdfHref={pdfHref}
      />
    </main>
  );
}

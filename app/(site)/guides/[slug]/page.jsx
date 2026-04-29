import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { loadGuides, loadGuideBySlug } from "../../../_lib/loadGuides";
import { getRequestCurrency } from "../../../_lib/currency";
import LocationMap from "../../../_components/LocationMapClient";
import GuideGallery from "../../../_components/GuideGallery";

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

function TimelinePin({ color }) {
  // Teardrop pin matching the LocationMap markers.
  return (
    <svg width="22" height="30" viewBox="0 0 28 38" aria-hidden className="shrink-0">
      <path
        d="M14 0C6.27 0 0 6.27 0 14c0 9.5 14 24 14 24s14-14.5 14-24C28 6.27 21.73 0 14 0z"
        fill={color}
      />
      <circle cx="14" cy="14" r="5" fill="#ffffff" />
    </svg>
  );
}

function LocationSection({ start, destination, finish, points }) {
  if (!start && !destination) return null;
  const startColor = "#0f6e56";
  const destColor = "#1f2937";
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">Location</p>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <ol className="relative space-y-5 pl-1">
          {start ? (
            <li className="flex gap-3">
              <span className="relative mt-0.5">
                <TimelinePin color={startColor} />
                <span className="absolute left-[10px] top-7 h-8 w-px bg-slate-300" />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Starting point
                </span>
                <span className="text-sm font-medium text-slate-900">{start.name}</span>
              </span>
            </li>
          ) : null}
          {destination ? (
            <li className="flex gap-3">
              <span className="relative mt-0.5">
                <TimelinePin color={destColor} />
                {finish ? (
                  <span className="absolute left-[10px] top-7 h-8 w-px bg-slate-300" />
                ) : null}
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Destination
                </span>
                <span className="text-sm font-medium text-slate-900">{destination.name}</span>
              </span>
            </li>
          ) : null}
          {finish ? (
            <li className="flex gap-3">
              <span className="mt-0.5">
                <TimelinePin color={startColor} />
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
          <LocationMap start={start} destination={destination} finish={finish} points={points} />
        </div>
      </div>
    </section>
  );
}

function MyExperience({ markdown }) {
  if (!markdown || !markdown.trim()) return null;
  let html = "";
  try {
    html = marked.parse(markdown, { breaks: true, gfm: true });
  } catch {
    return null;
  }
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">My Experience</p>
      <div
        className="text-sm leading-relaxed text-slate-700 [&_p]:my-3 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:font-['Georgia',serif] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#1a1816] [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-[#1a1816] [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
          <p className="mt-2 text-lg font-semibold text-slate-900">{price || "—"}</p>
          <p className="mt-1 text-xs text-slate-700">30 min · Complete route</p>
        </div>
      </div>
    </section>
  );
}

const STANDARD_FAQ = [
  {
    q: "Is this guide up to date?",
    a: "Yes. Every TestedRoutes guide is reviewed regularly — the date at the top of the trip details shows when it was last reviewed. Reviews flag broken bookings, transport changes, prices, and seasonal closures so the guide stays accurate as conditions change.",
  },
  {
    q: "What format is the guide?",
    a: "PDF, downloadable instantly after purchase. It works offline once saved to your phone, tablet, or laptop — no app required.",
  },
  {
    q: "What if the weather is bad on my day?",
    a: "The guide includes go/no-go decision rules and weather-dependent alternatives where they exist. If the trip is fully weather-dependent and your dates don't work, request a refund within 30 days.",
  },
  {
    q: "Can I get a refund if it doesn't work for me?",
    a: "Yes — 30 days, no questions asked. Email refunds@testedroutes.com with your order ID. Full details in our refund policy.",
  },
];

function FaqAccordion() {
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        Frequently asked questions
      </p>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {STANDARD_FAQ.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
              <span>{q}</span>
              <span
                aria-hidden
                className="text-slate-400 transition group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

function BuyBox({ price, checkoutHref, pdfHref }) {
  const button = checkoutHref ? (
    <a
      href={checkoutHref}
      className="block w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Get the Guide
    </a>
  ) : pdfHref ? (
    <a
      href={pdfHref}
      className="block w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Get the Guide
    </a>
  ) : (
    <button
      type="button"
      disabled
      className="block w-full rounded-full bg-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-white"
    >
      Coming soon
    </button>
  );

  const trustItems = [
    { label: "Risk-free", rest: "30-day full refund" },
    { label: "One-time purchase", rest: "No subscription" },
    { label: "Works offline", rest: "Save to phone" },
  ];

  return (
    <aside className="h-fit rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200 md:sticky md:top-6 md:self-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        PDF Guide
      </p>
      {price ? (
        <p className="mt-2 text-3xl font-semibold text-slate-900">{price}</p>
      ) : null}
      <p className="mt-1 text-xs text-slate-500">Instant download</p>
      <div className="mt-4">{button}</div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {trustItems.map(({ label, rest }) => (
          <li key={label} className="flex gap-2">
            <span aria-hidden className="mt-0.5 shrink-0 text-[#0f6e56]">✓</span>
            <span>
              <strong className="font-semibold text-slate-900">{label}</strong>
              <span className="text-slate-500"> · {rest}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function BottomCta({ price, checkoutHref, pdfHref }) {
  const href = checkoutHref || pdfHref;
  const buttonLabel = price
    ? `Get the Guide – ${price}`
    : "Get the Guide";
  return (
    <section className="mt-12 rounded-[28px] bg-[#1a1816] p-10 text-center text-white">
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
  const destination = guide.coordinates && guide.title
    ? {
        name: guide.title,
        lat: guide.coordinates.lat,
        lng: guide.coordinates.lng,
      }
    : null;
  // Round-trip assumption when no explicit finish point: finish = start.
  const finish = start ? { ...start } : null;
  const points = Array.isArray(guide.routePoints)
    ? guide.routePoints
        .map((p) => p?.coordinates && { lat: p.coordinates.lat, lng: p.coordinates.lng })
        .filter(Boolean)
    : null;
  return { start, destination, finish, points };
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
  const showLocation = !!(location.start || location.destination);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
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

      <div className="mb-8">
        <GuideGallery photos={photos} />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-10">
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
              start={location.start}
              destination={location.destination}
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
          <MyExperience markdown={guide.storyContent} />
          <SaveTimeComparison price={guide.price} />
          <FaqAccordion />
        </div>

        <BuyBox
          price={guide.price}
          checkoutHref={checkoutHref}
          pdfHref={pdfHref}
        />
      </div>

      <BottomCta
        price={guide.price}
        checkoutHref={checkoutHref}
        pdfHref={pdfHref}
      />
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuides, loadGuideBySlug } from "../../../_lib/loadGuides";
import { getRequestCurrency } from "../../../_lib/currency";

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

function PrimaryStats({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {stats.map((stat) => (
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
      </div>
    </div>
  );
}

function BulletSection({ title, items, accent }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">{title}</p>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-1 shrink-0 ${accent || "text-slate-400"}`}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Gallery({ photos }) {
  if (!photos.length) return null;
  const main = photos[0];
  const rest = photos.slice(1, 5);
  return (
    <>
      {/* Mobile: simple swipe row */}
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-xl pb-1">
          {photos.slice(0, 5).map((p, i) => (
            <img
              key={p}
              src={p}
              alt=""
              className="h-52 w-[80vw] shrink-0 snap-start rounded-xl object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      </div>
      {/* Desktop: mosaic */}
      <div
        className="hidden overflow-hidden rounded-xl md:grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 4,
          height: 420,
        }}
      >
        <img
          src={main}
          alt=""
          className="h-full w-full object-cover"
          style={{ gridRow: "1 / 3" }}
        />
        {rest.map((p) => (
          <img key={p} src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
        ))}
      </div>
    </>
  );
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const currency = await getRequestCurrency();
  const guide = await loadGuideBySlug(slug, currency);
  if (!guide) notFound();

  const meta = guide.metadata || {};
  const hero = meta.hero || {};
  const sales = meta.sales || {};

  const photos = [guide.image, ...(guide.galleryPhotos || [])].filter(Boolean);
  const checkoutHref = guide.polarProductId
    ? `/api/checkout?products=${encodeURIComponent(guide.polarProductId)}`
    : null;
  const pdfHref = !checkoutHref ? guide.guidePdfUrl || null : null;

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
        <Gallery photos={photos} />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          {hero.primary_stats ? (
            <section>
              <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
                Trip details
              </p>
              <PrimaryStats stats={hero.primary_stats} />
            </section>
          ) : null}

          <BulletSection title="Why this trip" items={sales.why_this_trip} />
          <BulletSection title="Who this is for" items={sales.who_this_is_for} />
          <BulletSection title="What you get" items={sales.what_you_get} />
          <BulletSection title="Difficulty at a glance" items={sales.difficulty_at_a_glance} />
          {sales.not_suitable?.length ? (
            <section>
              <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#b04a3a]">
                Not suitable
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                {sales.not_suitable.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 shrink-0 text-[#b04a3a]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          {guide.price ? (
            <p className="text-2xl font-semibold text-slate-900">{guide.price}</p>
          ) : null}
          {checkoutHref ? (
            <a
              href={checkoutHref}
              className="mt-3 block w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get the Guide
            </a>
          ) : pdfHref ? (
            <a
              href={pdfHref}
              className="mt-3 block w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get the Guide
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-3 block w-full rounded-full bg-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Coming soon
            </button>
          )}
          <p className="mt-2 text-center text-[12px] text-[#0f6e56]">
            Risk-free · 30-day full refund
          </p>
        </aside>
      </div>
    </main>
  );
}

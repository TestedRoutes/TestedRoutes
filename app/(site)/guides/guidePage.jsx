import Link from "next/link";
import { notFound } from "next/navigation";
import { loadGuideBySlug } from "../../_lib/loadGuides";
import { getRequestCurrency } from "../../_lib/currency";
import { fetchStoryTranslations } from "../../_lib/sanityStory";
import {
  getEssentialBookings,
  getAffiliateLinks,
} from "../../_lib/affiliateLinks";
import { getDict, localePath } from "../../_lib/i18n";
import GuideGallery from "../../_components/GuideGallery";
import GuideCarousel from "./GuideCarousel";
import CollapsibleSection from "../../_components/CollapsibleSection";
import GuideBody from "../../_components/GuideBody";
import BuyBox from "../../_components/BuyBox";
import StickyBuyBar from "../../_components/StickyBuyBar";
import Byline from "../../_components/Byline";
import GuideSalesPage from "./guideSalesPage";
import { PrimaryStats, LocationSection, buildLocation } from "./GuideTripSections";

// hreflang alternates across every published language version of the guide.
async function guideLanguageAlternates(guide, lang, slug) {
  const languages = {};
  try {
    const translations = await fetchStoryTranslations(guide.metadata?.story_id);
    for (const tr of translations) {
      if (!tr.hasGuide || !tr.guideSlug) continue;
      languages[tr.language] = localePath(tr.language, `/guides/${tr.guideSlug}`);
    }
    if (languages.en) languages["x-default"] = languages.en;
  } catch {
    // Sanity hiccup — fall back to just the canonical.
  }
  if (!Object.keys(languages).length) {
    languages[lang] = localePath(lang, `/guides/${slug}`);
  }
  return languages;
}

export async function buildGuideMetadata(lang, slug) {
  const guide = await loadGuideBySlug(slug, undefined, lang);
  if (!guide) return {};
  const t = getDict(lang).guide;
  const seo = guide.metadata?.seo || {};
  const title = seo.meta_title
    ? `${seo.meta_title} · TestedRoutes`
    : `${guide.title} · TestedRoutes`;
  const description =
    seo.meta_description ||
    guide.metadata?.hero?.subtitle ||
    `${t.metaDescPrefix} ${guide.title}.`;
  const image = guide.image || "/images/og-default.jpg";
  const canonical = localePath(lang, `/guides/${guide.slug}`);
  const languages = await guideLanguageAlternates(guide, lang, slug);

  return {
    title,
    description,
    alternates: { canonical, languages },
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

function CheckBulletSection({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <CollapsibleSection title={title}>
      {/* 3pt after each item — founder's paragraph-spacing spec (2026-07). */}
      <ul className="space-y-[3pt] text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-0.5 shrink-0 text-[#943d21]">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}

function NotSuitableWarning({ items, t }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <CollapsibleSection title={`⚠ ${t.notSuitable}`} titleClassName="text-[#943d21]">
      <div className="rounded-2xl border border-[#e5b59a] bg-[#fdf3ea] p-5">
        <ul className="space-y-[3pt] text-sm text-[#5a3a2f]">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-1 shrink-0 text-[#943d21]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </CollapsibleSection>
  );
}

function FaqAccordion({ items, t }) {
  const list = Array.isArray(items) && items.length ? items : t.faq;
  return (
    <section>
      <p className="mb-4 font-serif text-xl font-normal text-brand-ink">
        {t.faqTitle}
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

function Testimonials({ items, t }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section>
      <p className="mb-4 font-serif text-xl font-normal text-brand-ink">
        {t.readersSay}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(({ quote, author, location }, i) => (
          <figure
            key={`${author}-${i}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span aria-hidden className="font-serif text-3xl leading-none text-[#943d21]">
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

function RelatedGuides({ items, t, lang }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <p className="mb-5 font-serif text-xl md:text-2xl font-light text-brand-ink">
        {t.youMightAlsoLike}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((g) => (
          <Link
            key={g.slug}
            href={localePath(lang, g.href)}
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
              <p className="font-serif text-base font-medium leading-snug text-slate-900 group-hover:text-slate-700">
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

function BottomCta({ price, checkoutHref, pdfHref, t }) {
  const href = checkoutHref || pdfHref;
  const buttonLabel = price ? `${t.getGuide} – ${price}` : t.getGuide;
  return (
    <section className="mt-8 rounded-[28px] bg-brand-terracotta p-10 text-center text-white md:mt-12">
      <p className="font-serif text-3xl font-light leading-tight">
        {t.bottomLine1}
      </p>
      <p className="font-serif text-3xl font-light leading-tight">
        {t.bottomLine2}
      </p>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
        {t.bottomBody}
      </p>
      <p className="mt-2 text-sm italic text-white/60">{t.bottomTagline}</p>
      {href ? (
        <a
          href={href}
          className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {buttonLabel}
        </a>
      ) : null}
      <p className="mt-3 text-[11px] uppercase tracking-wider text-white/40">
        {t.bottomFooter}
      </p>
    </section>
  );
}

export default async function GuidePage({ lang, slug }) {
  const currency = await getRequestCurrency();
  const guide = await loadGuideBySlug(slug, currency, lang);
  if (!guide) notFound();

  const dict = getDict(lang);
  const t = dict.guide;
  const meta = guide.metadata || {};
  const hero = meta.hero || {};
  const sales = meta.sales || {};
  const maintenance = meta.maintenance || {};

  const photos = [guide.image, ...(guide.galleryPhotos || [])].filter(Boolean);
  const carouselSlides = guide.salesPage?.carousel || [];
  const checkoutHref = guide.polarProductId
    ? `/api/checkout?products=${encodeURIComponent(guide.polarProductId)}`
    : null;
  const pdfHref = !checkoutHref ? guide.guidePdfUrl || null : null;

  const location = buildLocation(guide);
  const showLocation = !!(location.start || (location.destinations && location.destinations.length > 0));
  const essentialBookings = getEssentialBookings(guide.bodyBlocks);
  const affiliateLinks = getAffiliateLinks(guide.bodyBlocks);
  const hasAffiliateLinks = affiliateLinks.length > 0;

  const canonicalUrl = `https://testedroutes.com${localePath(lang, `/guides/${guide.slug}`)}`;
  const reviewedDate = maintenance.last_reviewed_date || null;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description:
      meta.seo?.meta_description || hero.subtitle || `${t.metaDescPrefix} ${guide.title}.`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    image: guide.image ? [guide.image] : undefined,
    inLanguage: lang,
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

  // FAQ, breadcrumb and product markup: machine-readable answers and the
  // offer itself, for search rich results and LLM extraction (GEO).
  const faqItems = Array.isArray(sales.faq) && sales.faq.length ? sales.faq : t.faq;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems
      .filter((f) => f?.question && f?.answer)
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.nav.guides,
        item: `https://testedroutes.com${localePath(lang, "/guides")}`,
      },
      { "@type": "ListItem", position: 2, name: guide.title, item: canonicalUrl },
    ],
  };
  const priceEntry = Array.isArray(guide.prices)
    ? guide.prices.find((p) => p?.currency === "EUR") || guide.prices[0]
    : null;
  const productJsonLd =
    priceEntry && Number.isFinite(Number(priceEntry.amount))
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: guide.title,
          description:
            meta.seo?.meta_description || hero.subtitle || `${t.metaDescPrefix} ${guide.title}.`,
          image: guide.image ? [guide.image] : undefined,
          brand: { "@type": "Brand", name: "TestedRoutes" },
          offers: {
            "@type": "Offer",
            price: Number(priceEntry.amount),
            priceCurrency: priceEntry.currency || "EUR",
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          },
        }
      : null;

  const jsonLdBlocks = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd.mainEntity.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}
    </>
  );

  // Sales layout (guide-page-build-spec) — PARKED 2026-07-24 at the founder's
  // request; every guide renders the classic layout below. The component and
  // its Sanity fields are intact, so flipping this back to true re-enables it
  // for any doc carrying a cover + carousel.
  const SALES_LAYOUT_ENABLED = false;
  if (SALES_LAYOUT_ENABLED && guide.salesPage?.carousel?.length >= 2 && guide.salesPage?.coverUrl) {
    return (
      <GuideSalesPage
        guide={guide}
        lang={lang}
        t={t}
        dict={dict}
        checkoutHref={checkoutHref}
        pdfHref={pdfHref}
        jsonLdBlocks={jsonLdBlocks}
      />
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-8 pt-8 md:pb-16">
      {jsonLdBlocks}
      <nav
        className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href={localePath(lang, "/guides")} className="hover:text-slate-600">
          {dict.nav.guides}
        </Link>
        {meta.geography?.destination_slug ? (
          <>
            <span>›</span>
            <Link
              href={`/destinations/${meta.geography.destination_slug}`}
              className="hover:text-slate-600"
            >
              {meta.geography.country}
            </Link>
          </>
        ) : null}
        <span>›</span>
        <span className="text-slate-600">{guide.title}</span>
      </nav>

      <div className="mb-4">
        {hero.eyebrow ? (
          <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">{hero.eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-2xl md:text-4xl lg:text-5xl">
          {guide.title}
        </h1>
        {hero.subtitle ? (
          <p className="mt-1 text-[15px] text-slate-500">{hero.subtitle}</p>
        ) : null}
        <Byline lang={lang} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="space-y-4 md:space-y-10">
          {/* Guides with an authored carousel show that and nothing else —
              it is the page's only image surface, by design. Guides without
              one fall back to the photo gallery. */}
          {carouselSlides.length >= 2 ? (
            <GuideCarousel slides={carouselSlides} />
          ) : (
            <GuideGallery photos={photos} viewAllLabel={t.viewAllPhotos} />
          )}
          {hero.primary_stats || maintenance.last_reviewed_date ? (
            <section>
              <p className="mb-4 font-serif text-xl font-normal text-brand-ink">
                {t.tripDetails}
              </p>
              <PrimaryStats
                stats={hero.primary_stats}
                lastReviewedDate={maintenance.last_reviewed_date}
                lang={lang}
                t={t}
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
              t={t}
            />
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <CheckBulletSection title={t.whyThisTrip} items={sales.why_this_trip} />
            <CheckBulletSection title={t.whoThisIsFor} items={sales.who_this_is_for} />
          </div>
          <NotSuitableWarning items={sales.not_suitable} t={t} />
          <CheckBulletSection title={t.whatYouGet} items={sales.what_you_get} />
          {hasAffiliateLinks ? (
            <aside
              role="note"
              aria-label="Affiliate disclosure"
              className="rounded-2xl border border-[#e5b59a] bg-brand-terracotta-soft px-5 py-3 text-xs leading-relaxed text-[#5a3a2f]"
            >
              <strong>{t.affiliateHeading}</strong> {t.affiliateBody}{" "}
              <Link href="/affiliate-disclosure" className="underline">
                {t.affiliateMore}
              </Link>
              .
            </aside>
          ) : null}
          <GuideBody
            blocks={guide.bodyBlocks}
            checkoutHref={checkoutHref}
            pdfHref={pdfHref}
            price={guide.price}
            t={t}
          />
          <Testimonials items={sales.testimonials} t={t} />
          <FaqAccordion items={sales.faq} t={t} />
        </div>

        <BuyBox
          price={guide.price}
          checkoutHref={checkoutHref}
          pdfHref={pdfHref}
          linksHref={`/guides/${guide.slug}/links`}
          hasAffiliateLinks={true}
          essentialBookings={essentialBookings.map((l) => l.href)}
          t={t}
        />
      </div>

      <RelatedGuides items={guide.relatedGuides} t={t} lang={lang} />

      <BottomCta
        price={guide.price}
        checkoutHref={checkoutHref}
        pdfHref={pdfHref}
        t={t}
      />

      <StickyBuyBar
        price={guide.price}
        checkoutHref={checkoutHref}
        pdfHref={pdfHref}
        t={t}
      />
    </main>
  );
}

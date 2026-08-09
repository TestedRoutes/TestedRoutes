"use client";

import Link from "next/link";
import CardMediaCarousel, {
  buildMediaSlides,
} from "../../_components/CardMediaCarousel";
import { localePath } from "../../_lib/i18n";
import { tripCategoryChipClass } from "../../_lib/tripCategory";

// Whole card is the link ("more information"); the Buy button jumps straight
// to checkout for people who already know they want it.
export default function GuideListCard({ guide, t, lang = "en" }) {
  // Cards show the guide's full authored sequence, same pictures and same
  // order as its own page. There is no cap: an earlier slice(0, 5) dropped
  // the tail and clamped a late video slot forward, so clips landed in the
  // wrong place. Slides past the first load lazily, so length is cheap.
  const photos =
    Array.isArray(guide.cardPhotos) && guide.cardPhotos.length
      ? guide.cardPhotos
      : guide.image
        ? [guide.image]
        : [];
  // Pages out of the guide show whole; photos and clips fill the card.
  const pageExports = new Set(guide.cardPagePhotos || []);
  const slides = buildMediaSlides({
    photos,
    videoUrl: guide.videoUrl,
    videoSlot: guide.videoSlot,
    videos: guide.videos,
  }).map((s) =>
    s.type === "image" && pageExports.has(s.src) ? { ...s, fit: "contain" } : s,
  );
  const href = localePath(lang, guide.href);

  const geo = guide.metadata?.geography || {};
  // "north_america" → "North America"
  const pretty = (s) =>
    typeof s === "string" && s
      ? s
          .replace(/[_-]+/g, " ")
          .trim()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";
  // Category gets its styleguide tier color as a chip; the rest of the
  // context stays a plain line: "Switzerland · Europe".
  const categoryLabel = pretty(guide.category);
  // An authored card line ("Seychelles · 4 islands") says more to a buyer
  // than the continent does; fall back to country · continent without one.
  const contextLine =
    guide.cardLine ||
    [pretty(geo.country), pretty(geo.continent)].filter(Boolean).join(" · ");
  // The subtitle is the customer-facing line from the Content Plan and says
  // what this route actually is. The meta description is written for search
  // and restates the title's keywords, so leading with it made every card
  // read "Alp Flix to Ausserferrera: A 2-Day Alpine Passes Trail Hike / A
  // 2-day hike on Switzerland's Alpine Passes Trail…". Subtitle first, meta
  // description only as a fallback for guides that have no subtitle yet.
  const excerpt =
    guide.metadata?.hero?.subtitle || guide.metadata?.seo?.meta_description || "";

  const buyHref = guide.polarProductId
    ? `/api/checkout?products=${encodeURIComponent(guide.polarProductId)}`
    : guide.guidePdfUrl || null;
  const onBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (buyHref) window.location.href = buyHref;
  };

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-line transition hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Square on phones so photo + title + excerpt + price clear the tab bar
          even with the browser URL bar showing; 3:4 from sm up where grid
          columns keep cards short anyway. */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[3/4]">
        {slides.length ? (
          <CardMediaCarousel
            slides={slides}
            alt={guide.title}
            imgClassName="transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      {/* Fixed-height text zones so every card's rows line up across the
          grid regardless of how long each guide's copy is — from sm up only,
          since phones show one card per row with nothing to line up against. */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="flex min-w-0 items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
          {categoryLabel ? (
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold normal-case tracking-normal text-brand-ink ${tripCategoryChipClass(guide.category)}`}
            >
              {categoryLabel}
            </span>
          ) : null}
          <span className="truncate">{contextLine}</span>
        </p>
        <h3 className="line-clamp-2 text-lg font-normal leading-snug text-slate-900 sm:min-h-[3.5rem]">
          {guide.title}
        </h3>
        {guide.statusNote ? (
          <p className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            {guide.statusNote}
          </p>
        ) : null}
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:min-h-[2.5rem]">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          {guide.price ? (
            <span className="whitespace-nowrap text-base font-semibold text-slate-900">
              {guide.price}
            </span>
          ) : (
            <span />
          )}
          <span className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-normal tracking-[0.05em] text-slate-700 transition group-hover:border-slate-400">
              {t.viewGuide}
            </span>
            {buyHref ? (
              <button
                type="button"
                onClick={onBuy}
                className="whitespace-nowrap rounded-full bg-brand-terracotta px-3 py-2 text-xs font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90"
              >
                {t.buyGuide}
              </button>
            ) : null}
          </span>
        </div>
      </div>
    </Link>
  );
}

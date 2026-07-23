"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CategoryStrip from "../../_components/CategoryStrip";
import CardMediaCarousel, { buildMediaSlides } from "../../_components/CardMediaCarousel";
import CardFilters from "../../_components/CardFilters";
import { getDict } from "../../_lib/i18n";

function cardHaystack(card) {
  return [
    card.title,
    card.geoLabel,
    card.categoryLabel,
    card.categoryDurationLine,
    card.excerpt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSearch(card, query) {
  const needle = (query || "").toLowerCase().trim();
  if (!needle) return true;
  return cardHaystack(card).includes(needle);
}

// Loose match for category pills: "Hiking" should catch "hike".
function matchesCategory(card, label) {
  if (!label) return true;
  const needle = label.toLowerCase().trim();
  const stem = needle.replace(/ing$/, "").replace(/s$/, "");
  const haystack = cardHaystack(card);
  return haystack.includes(needle) || (stem.length > 2 && haystack.includes(stem));
}

function sortRecentFirst(cards) {
  return [...cards].sort((a, b) => (b.dateMillis || 0) - (a.dateMillis || 0));
}

function StoryCard({ card, t }) {
  const photos =
    Array.isArray(card.photos) && card.photos.length
      ? card.photos
      : card.heroPhoto
        ? [card.heroPhoto]
        : [];
  const slides = buildMediaSlides({
    photos,
    videoUrl: card.videoUrl,
    videoSlot: card.videoSlot,
    videos: card.videos,
  });
  const inner = (
    <>
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-slate-100">
        {slides.length ? (
          <CardMediaCarousel
            slides={slides}
            alt={card.heroAlt || card.title}
            imgClassName="object-center transition duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full min-h-[9.5rem] w-full items-center justify-center bg-slate-100 text-[11px] font-medium text-slate-400">
            No photo
          </div>
        )}
      </div>
      {/* Fixed-height text zones so rows line up across the grid. */}
      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:gap-3">
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          {card.geoLabel || " "}
        </p>
        <div className="flex min-h-[3.5rem] flex-nowrap items-start justify-between gap-2">
          <p className="line-clamp-2 min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight text-slate-900">
            {card.title}
          </p>
          {card.hasGuide ? (
            <span className="shrink-0 rounded-full bg-brand-icy px-3 py-1.5 text-xs font-semibold text-slate-900">
              {t.guideBadge}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500">
          {card.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-end pt-1">
          {card.href ? (
            <span className="shrink-0 rounded-full bg-brand-terracotta px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-brand-terracotta/90">
              {t.readStory}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  const shellInteractive =
    "group flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300/90";
  const shellStatic =
    "flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white opacity-[0.96] shadow-sm ring-1 ring-slate-200/90 cursor-default";

  if (card.href) {
    return (
      <Link href={card.href} className={shellInteractive}>
        {inner}
      </Link>
    );
  }
  return <div className={shellStatic}>{inner}</div>;
}

export default function InspireBrowse({ cards, categoryItems = [], lang = "en" }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const dict = getDict(lang);
  const t = dict.inspireList;

  const types = useMemo(
    () => [...new Set(cards.map((c) => c.categoryLabel).filter(Boolean))].sort(),
    [cards],
  );
  const countries = useMemo(
    () => [...new Set(cards.map((c) => c.country).filter(Boolean))].sort(),
    [cards],
  );

  const filtered = useMemo(() => {
    const matched = cards.filter(
      (c) =>
        matchesSearch(c, search) &&
        matchesCategory(c, activeCategory) &&
        (!typeFilter || c.categoryLabel === typeFilter) &&
        (!countryFilter || c.country === countryFilter),
    );
    return sortRecentFirst(matched);
  }, [cards, search, activeCategory, typeFilter, countryFilter]);

  return (
    <div className="space-y-10">
      <div className="mx-auto w-full max-w-3xl">
        <label htmlFor="inspire-search" className="sr-only">
          Search journeys
        </label>
        <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-slate-200 md:p-2">
          <input
            id="inspire-search"
            type="search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 md:px-6 md:py-4 md:text-base"
          />
          <button
            type="button"
            onClick={() => document.getElementById("inspire-search")?.blur()}
            className="shrink-0 rounded-full bg-brand-terracotta px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-terracotta/90 md:px-6 md:py-4 md:text-base"
          >
            {t.searchButton}
          </button>
        </div>
      </div>

      {categoryItems.length > 0 ? (
        <CategoryStrip
          items={categoryItems}
          activeLabel={activeCategory}
          onItemClick={(label) =>
            setActiveCategory((current) => (current === label ? "" : label))
          }
        />
      ) : null}

      <section className="w-full min-w-0 space-y-6">
        <h2 className="text-xl font-normal">{t.heading}</h2>
        <CardFilters
          types={types}
          countries={countries}
          type={typeFilter}
          country={countryFilter}
          onType={setTypeFilter}
          onCountry={setCountryFilter}
          labels={dict.guideList}
        >
          <p className="text-xs font-medium tabular-nums text-slate-500">
            {filtered.length} {filtered.length === 1 ? t.story : t.stories}
          </p>
        </CardFilters>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-5 py-9 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-8 sm:py-11">
            <p className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
              {t.noMatchTitle}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {t.noMatchBody}
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {t.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {filtered.map((card) => (
              <StoryCard key={card.id} card={card} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

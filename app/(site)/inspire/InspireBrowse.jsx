"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CategoryStrip from "../../_components/CategoryStrip";

function matchesSearch(card, query) {
  if (!query) return true;
  const needle = query.toLowerCase().trim();
  if (!needle) return true;
  const haystack = [
    card.title,
    card.geoLabel,
    card.categoryDurationLine,
    card.excerpt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function sortRecentFirst(cards) {
  return [...cards].sort((a, b) => (b.dateMillis || 0) - (a.dateMillis || 0));
}

function StoryCard({ card }) {
  const inner = (
    <>
      <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[16/10]">
        {card.heroPhoto ? (
          <img
            src={card.heroPhoto}
            alt={card.heroAlt || card.title}
            className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full min-h-[9.5rem] w-full items-center justify-center bg-slate-100 text-[11px] font-medium text-slate-400">
            No photo
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:gap-3">
        {card.geoLabel ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            {card.geoLabel}
          </p>
        ) : null}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight text-slate-900">
            {card.title}
          </p>
          {card.hasGuide ? (
            <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Guide
            </span>
          ) : null}
        </div>
        {card.categoryDurationLine ? (
          <p className="text-sm leading-snug text-slate-600">{card.categoryDurationLine}</p>
        ) : null}
        {card.excerpt ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{card.excerpt}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {card.difficultyLabel ? (
            <span className="inline-flex items-center gap-1 text-xs leading-snug text-slate-500">
              <span aria-hidden>🥾</span>
              {card.difficultyLabel}
            </span>
          ) : null}
          {card.familyFriendly ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
              <span aria-hidden>👨‍👩‍👧</span>
              Family
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

export default function InspireBrowse({ cards, categoryItems = [] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const matched = cards.filter((c) => matchesSearch(c, search));
    return sortRecentFirst(matched);
  }, [cards, search]);

  return (
    <>
      <div className="mx-auto w-full max-w-2xl">
        <label htmlFor="inspire-search" className="sr-only">
          Search journeys
        </label>
        <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
          <input
            id="inspire-search"
            type="search"
            placeholder="Search journeys…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => document.getElementById("inspire-search")?.blur()}
            className="shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </div>
      </div>

      {categoryItems.length > 0 ? (
        <CategoryStrip items={categoryItems} onItemClick={(label) => setSearch(label)} />
      ) : null}

      <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Journeys I've actually done
        </p>
        <p className="text-sm font-medium tabular-nums text-slate-500">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"}
        </p>
      </div>

      <section className="w-full min-w-0">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-5 py-9 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-8 sm:py-11">
            <p className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
              No matching journeys
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Try a shorter phrase or clear the search.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {filtered.map((card) => (
              <StoryCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import GuideListCard from "./GuideListCard";

function matchesSearch(guide, query) {
  const needle = query.toLowerCase().trim();
  if (!needle) return true;
  const geo = guide.metadata?.geography || {};
  const haystack = [
    guide.title,
    guide.category,
    geo.country,
    geo.continent,
    guide.metadata?.seo?.meta_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export default function GuidesBrowse({ guides, t, tl, lang = "en" }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => guides.filter((g) => matchesSearch(g, search)),
    [guides, search],
  );

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-slate-200 md:p-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tl.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 md:px-6 md:py-4 md:text-base"
          />
          <button
            type="button"
            className="shrink-0 rounded-full bg-brand-terracotta px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-terracotta/90 md:px-6 md:py-4 md:text-base"
          >
            {t.inspireList.searchButton}
          </button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-500">{t.inspireList.noMatchTitle}</p>
      ) : null}
    </div>
  );
}

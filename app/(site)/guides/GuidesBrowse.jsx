"use client";

import { useMemo, useState } from "react";
import GuideListCard from "./GuideListCard";
import CardFilters from "../../_components/CardFilters";
import CategoryStrip from "../../_components/CategoryStrip";

function guideHaystack(guide) {
  const geo = guide.metadata?.geography || {};
  return [
    guide.title,
    guide.category,
    geo.country,
    geo.continent,
    guide.metadata?.seo?.meta_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSearch(guide, query) {
  const needle = (query || "").toLowerCase().trim();
  if (!needle) return true;
  return guideHaystack(guide).includes(needle);
}

// Loose category matching: "Hiking" should catch "hike".
function matchesCategory(guide, label) {
  if (!label) return true;
  const needle = label.toLowerCase().trim();
  const stem = needle.replace(/ing$/, "").replace(/s$/, "");
  const haystack = guideHaystack(guide);
  return haystack.includes(needle) || (stem.length > 2 && haystack.includes(stem));
}

export default function GuidesBrowse({
  guides,
  categoryItems = [],
  t,
  tl,
  lang = "en",
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const types = useMemo(
    () => [...new Set(guides.map((g) => g.category).filter(Boolean))].sort(),
    [guides],
  );
  const countries = useMemo(
    () =>
      [...new Set(guides.map((g) => g.metadata?.geography?.country).filter(Boolean))].sort(),
    [guides],
  );

  const filtered = useMemo(
    () =>
      guides.filter(
        (g) =>
          matchesSearch(g, search) &&
          matchesCategory(g, activeCategory) &&
          (!typeFilter || g.category === typeFilter) &&
          (!countryFilter || g.metadata?.geography?.country === countryFilter),
      ),
    [guides, search, activeCategory, typeFilter, countryFilter],
  );

  return (
    <div className="space-y-10">
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

      {categoryItems.length ? (
        <CategoryStrip
          items={categoryItems}
          activeLabel={activeCategory}
          onItemClick={(label) =>
            setActiveCategory((current) => (current === label ? "" : label))
          }
        />
      ) : null}

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">
          {tl.browseHeading}
          {activeCategory ? (
            <span className="ml-2 text-sm font-normal text-slate-500">
              · {activeCategory}
            </span>
          ) : null}
        </h2>
        <CardFilters
          types={types}
          countries={countries}
          type={typeFilter}
          country={countryFilter}
          onType={setTypeFilter}
          onCountry={setCountryFilter}
          labels={tl}
        >
          <p className="text-xs font-medium tabular-nums text-slate-500">
            {filtered.length} {filtered.length === 1 ? tl.guide : tl.guides}
          </p>
        </CardFilters>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((g) => (
            <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t.inspireList.noMatchTitle}</p>
        ) : null}
      </section>
    </div>
  );
}

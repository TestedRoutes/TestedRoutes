"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import GuideFilterRow from "./GuideFilterRow";
import GuideListCard from "../(site)/guides/GuideListCard";
import { prettyGeo } from "../_lib/continents";
import {
  buildGuideFilterOptions,
  matchesGuideFilters,
  guideSearchHaystack,
} from "../_lib/guideFilters";

// Loose category matching: "Hiking" should catch "Day trip hike".
function matchesCategory(card, label) {
  if (!label) return true;
  const needle = label.toLowerCase().trim();
  const stem = needle.replace(/ing$/, "").replace(/s$/, "");
  const haystack = guideSearchHaystack(card);
  return haystack.includes(needle) || (stem.length > 2 && haystack.includes(stem));
}

// Owns the guide grid. The search lives in the photo hero above and the
// activity tiles in the "Choose your adventure" band below (HomeCategoryTiles),
// which drives this grid's category filter over a window event. The dropdown
// row is the same Country/Length/Activity/Season set as /guides (founder
// 2026-08-08).
export default function HomeBrowse({ cards = [], t }) {
  const [activeCategory, setActiveCategory] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    length: "",
    activity: "",
    season: "",
  });
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const gridRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const label = e.detail || "";
      setActiveCategory(label);
      // The tiles sit below the grid, so bring the results back into view.
      if (label) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("home-category-select", handler);
    return () => window.removeEventListener("home-category-select", handler);
  }, []);

  const clearCategory = () => {
    setActiveCategory("");
    window.dispatchEvent(new CustomEvent("home-category-cleared", { detail: "" }));
  };

  const options = useMemo(() => buildGuideFilterOptions(cards), [cards]);
  // Country tabs (founder mockup 2026-08-08): "All countries" plus one tab
  // per country with guides, ordered by guide count. The tabs drive the
  // same state as the Country dropdown below, so the two always agree.
  const countryTabs = useMemo(() => {
    const counts = new Map();
    for (const c of cards) {
      const country = prettyGeo(c.metadata?.geography?.country);
      if (!country) continue;
      counts.set(country, (counts.get(country) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([country]) => country);
  }, [cards]);
  const filtered = useMemo(
    () =>
      cards.filter((c) => matchesCategory(c, activeCategory) && matchesGuideFilters(c, filters)),
    [cards, activeCategory, filters],
  );

  const tabClass = (active) =>
    `-mb-px shrink-0 border-b-2 pb-3 font-sans text-base font-bold transition-colors ${
      active
        ? "border-brand-terracotta text-brand-ink"
        : "border-transparent text-slate-400 hover:text-slate-600"
    }`;

  return (
    <div className="space-y-10">
      {cards.length ? (
        <section ref={gridRef} className="scroll-mt-24 space-y-6">
          {activeCategory ? (
            <button
              type="button"
              onClick={clearCategory}
              className="inline-flex items-center gap-2 rounded-full bg-brand-terracotta-soft px-3.5 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-brand-terracotta-soft/70"
            >
              {activeCategory}
              <span aria-hidden="true" className="text-slate-500">
                ✕
              </span>
              <span className="sr-only">Clear category filter</span>
            </button>
          ) : null}
          <div className="border-b border-brand-line">
            <div className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setFilter("country", "")}
                className={tabClass(filters.country === "")}
              >
                All countries
              </button>
              {countryTabs.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() =>
                    setFilter("country", filters.country === country ? "" : country)
                  }
                  className={tabClass(filters.country === country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
          <GuideFilterRow options={options} filters={filters} onChange={setFilter} tl={t}>
            <Link
              href="/guides"
              className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              View all
            </Link>
          </GuideFilterRow>
          {filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((card) => (
                <GuideListCard key={card.slug} guide={card} t={t} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No guides match this category yet.{" "}
              <button
                type="button"
                onClick={clearCategory}
                className="font-semibold text-slate-700 underline underline-offset-2"
              >
                Clear filter
              </button>
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}

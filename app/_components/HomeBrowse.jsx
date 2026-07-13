"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import HomeSearchBar from "./HomeSearchBar";
import CategoryStrip from "./CategoryStrip";
import CardFilters from "./CardFilters";
import GuideListCard from "../(site)/guides/GuideListCard";

// Loose category matching: "Hiking" should catch "Day trip hike".
function matchesCategory(card, label) {
  if (!label) return true;
  const needle = label.toLowerCase().trim();
  const stem = needle.replace(/ing$/, "").replace(/s$/, "");
  const geo = card.metadata?.geography || {};
  const haystack = [
    card.title,
    card.category,
    geo.country,
    geo.continent,
    card.metadata?.seo?.meta_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle) || (stem.length > 2 && haystack.includes(stem));
}

// Owns the hero search + category pills + guide grid. Pills apply a filter
// to the grid without touching the search input.
export default function HomeBrowse({ guides, categoryItems, cards = [], t }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const heroRef = useRef(null);

  const types = useMemo(
    () => [...new Set(cards.map((c) => c.category).filter(Boolean))].sort(),
    [cards],
  );
  const countries = useMemo(
    () =>
      [...new Set(cards.map((c) => c.metadata?.geography?.country).filter(Boolean))].sort(),
    [cards],
  );

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("home-hero-search-visible", { detail: entry.isIntersecting })
        );
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.dispatchEvent(new CustomEvent("home-hero-search-visible", { detail: true }));
    };
  }, []);

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          matchesCategory(c, activeCategory) &&
          (!typeFilter || c.category === typeFilter) &&
          (!countryFilter || c.metadata?.geography?.country === countryFilter),
      ),
    [cards, activeCategory, typeFilter, countryFilter],
  );

  return (
    <div className="space-y-10">
      <div ref={heroRef}>
        <HomeSearchBar
          guides={guides}
          query={query}
          onQueryChange={setQuery}
          variant="hero"
        />
      </div>
      <CategoryStrip
        items={categoryItems}
        activeLabel={activeCategory}
        onItemClick={(label) =>
          setActiveCategory((current) => (current === label ? "" : label))
        }
      />

      {cards.length ? (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">
            Browse guides
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
            labels={t}
          >
            <Link
              href="/guides"
              className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
            >
              View all
            </Link>
          </CardFilters>
          {filtered.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((card) => (
                <GuideListCard key={card.slug} guide={card} t={t} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No guides match this category yet.{" "}
              <button
                type="button"
                onClick={() => setActiveCategory("")}
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

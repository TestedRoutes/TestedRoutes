"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import HomeSearchBar from "./HomeSearchBar";
import CategoryStrip from "./CategoryStrip";
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
  const heroRef = useRef(null);

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
    () => cards.filter((c) => matchesCategory(c, activeCategory)),
    [cards, activeCategory],
  );

  return (
    <div className="space-y-12">
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Browse guides
              {activeCategory ? (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  · {activeCategory}
                </span>
              ) : null}
            </h2>
            <Link href="/guides" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              View all
            </Link>
          </div>
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

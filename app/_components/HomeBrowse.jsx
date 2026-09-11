"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import GuideFilterBlock from "./GuideFilterBlock";
import GuideListCard from "../(site)/guides/GuideListCard";
import { matchesGuideCategory } from "../_lib/guideFilters";

// Owns the guide grid. The search lives in the photo hero above and the
// activity cards in the "Choose your adventure" section below
// (HomeAdventureGrid), which drives this grid's category filter over a
// window event.
//
// The filter block is the /guides one (founder 2026-09-11: "do the same
// look and feel for filters on Explore page as in Guides page") - continent
// tabs with counts, the four pills opening tickbox panels, dismissable
// chips and a "Showing X of Y" line, all from GuideFilterBlock. It
// replaces the country tab strip and the four native <select>s that stood
// here from the 2026-08-08 mockup; the countries the strip listed are the
// Country panel's rows now, with their guide counts and a type-ahead,
// which is what a library this wide needed anyway.
export default function HomeBrowse({ cards = [], t, tl, interlude = null }) {
  const [activeCategory, setActiveCategory] = useState("");
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

  // The adventure tiles scope the whole block rather than sitting beside
  // it as a fifth filter: the tile is a "show me hiking" decision taken
  // before the filters, so the tabs and every panel count answer within
  // it. The chip in the status row is what says so, and clearing it (or
  // Clear all) puts the tile back to its unpicked state.
  const prefilter = useMemo(
    () => (activeCategory ? (card) => matchesGuideCategory(card, activeCategory) : null),
    [activeCategory],
  );
  const extraChips = activeCategory
    ? [{ key: "category", label: activeCategory, clear: clearCategory }]
    : [];

  if (!cards.length) return null;

  return (
    <div className="space-y-10">
      <section ref={gridRef} className="scroll-mt-24 space-y-6">
        <GuideFilterBlock
          guides={cards}
          t={t}
          tl={tl}
          showSearch={false}
          searchId="home-guides-search"
          prefilter={prefilter}
          extraChips={extraChips}
          onClearAll={clearCategory}
        >
          {(filtered) => (
            <>
              {/* Two rows, then the Choose-your-adventure interlude, then a
                  one-row "Recently added guides" strip with View all
                  (founder 2026-08-08). */}
              {filtered.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.slice(0, 8).map((card) => (
                    <GuideListCard key={card.slug} guide={card} t={tl} />
                  ))}
                </div>
              ) : (
                // The block's own status row carries the chips and Clear
                // all, so this only has to say the grid is empty on purpose.
                <p className="text-sm text-slate-500">No guides match these filters yet.</p>
              )}
              {/* The band renders even with an empty grid: it is a section of
                  the page, and it holds the tiles that set the category the
                  visitor may be trying to undo. */}
              {interlude}
              {filtered.length ? (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    {/* DM Sans Bold (founder 2026-08-08). */}
                    <h3 className="font-sans text-xl font-bold text-brand-ink md:text-2xl">
                      Recently added guides
                    </h3>
                    <Link
                      href="/guides"
                      className="font-sans text-sm font-normal text-slate-900 underline decoration-slate-400 underline-offset-4 transition hover:decoration-slate-700 md:text-base"
                    >
                      View all
                    </Link>
                  </div>
                  {filtered.slice(8, 12).length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {filtered.slice(8, 12).map((card) => (
                        <GuideListCard key={card.slug} guide={card} t={tl} />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </GuideFilterBlock>
      </section>
    </div>
  );
}

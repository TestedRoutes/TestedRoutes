"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { matchesGuideCategory } from "../_lib/guideFilters";

// "Choose your adventure" v2 (founder mockup 2026-08-08): replaces the
// taupe band of pills + tile strip with big photo cards on the plain
// canvas — six featured activities with live guide counts, the rest as an
// "Also on the site:" pill row. Clicking still drives the guide grid
// further up the page over the same window events the old tiles used, so
// HomeBrowse needs no changes. Counts come from loose category matching
// against the actual catalogue and only render when non-zero.
const FEATURED_COUNT = 6;
// Destination pills ride along in the shared category list but aren't
// activities — the destination cards section covers them.
const NON_ACTIVITIES = new Set(["Switzerland", "Iceland"]);

export default function HomeAdventureGrid({ items = [], cards = [] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = (e) => setActive(e.detail || "");
    window.addEventListener("home-category-cleared", handler);
    return () => window.removeEventListener("home-category-cleared", handler);
  }, []);

  const pick = (label) => {
    const next = active === label ? "" : label;
    setActive(next);
    window.dispatchEvent(new CustomEvent("home-category-select", { detail: next }));
  };

  // Count per activity; featured = the six with the most guides (stable
  // sort keeps the curated order for ties).
  const { featured, alsoOn } = useMemo(() => {
    const withCounts = items
      .filter((item) => !NON_ACTIVITIES.has(item.label))
      .map((item) => ({
        ...item,
        count: cards.filter((c) => matchesGuideCategory(c, item.label)).length,
      }));
    const sorted = [...withCounts].sort((a, b) => b.count - a.count);
    return {
      featured: sorted.slice(0, FEATURED_COUNT),
      alsoOn: sorted.slice(FEATURED_COUNT),
    };
  }, [items, cards]);

  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center">
        <h2 className="font-serif font-light leading-tight text-brand-ink text-3xl md:text-5xl lg:text-[72px]">
          Choose your adventure
        </h2>
        <p className="font-serif font-supersoft text-base font-light leading-relaxed text-slate-600 md:text-xl">
          Every activity here has guides behind it
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => pick(item.label)}
            aria-pressed={active === item.label}
            className={`group relative aspect-[16/9] overflow-hidden rounded-3xl text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover ${
              active === item.label ? "ring-2 ring-brand-terracotta" : ""
            }`}
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-brand-ink/25 to-transparent" />
            <span className="absolute bottom-4 left-5 right-5 flex items-baseline gap-2.5">
              <span className="font-serif text-2xl font-normal text-white md:text-[28px]">
                {item.label}
              </span>
              {item.count ? (
                <span className="font-sans text-sm text-white/80">
                  {item.count} {item.count === 1 ? "guide" : "guides"}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {alsoOn.length ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-sans text-sm text-slate-500">Also on the site:</span>
          {alsoOn.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => pick(item.label)}
              aria-pressed={active === item.label}
              className={`rounded-full bg-white px-4 py-2 font-sans text-sm font-semibold text-slate-800 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover ${
                active === item.label ? "ring-2 ring-brand-terracotta" : "ring-1 ring-brand-line"
              }`}
            >
              {item.label}
              {item.count ? <span className="font-normal text-slate-400"> · {item.count}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

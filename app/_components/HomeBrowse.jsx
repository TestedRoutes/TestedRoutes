"use client";

import { useEffect, useRef, useState } from "react";
import HomeSearchBar from "./HomeSearchBar";
import CategoryStrip from "./CategoryStrip";

// Owns the shared search query so the category pills can drive the same
// guide-search dropdown as the search input. Also broadcasts the hero search
// bar's visibility so SiteHeader can swap its nav for a compact search.
export default function HomeBrowse({ guides, categoryItems }) {
  const [query, setQuery] = useState("");
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
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.dispatchEvent(new CustomEvent("home-hero-search-visible", { detail: true }));
    };
  }, []);

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
      <CategoryStrip items={categoryItems} onItemClick={(label) => setQuery(label)} />
    </div>
  );
}

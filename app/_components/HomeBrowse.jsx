"use client";

import { useState } from "react";
import HomeSearchBar from "./HomeSearchBar";
import CategoryStrip from "./CategoryStrip";

// Owns the shared search query so the category pills can drive the same
// guide-search dropdown as the search input.
export default function HomeBrowse({ guides, categoryItems }) {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-12">
      <HomeSearchBar guides={guides} query={query} onQueryChange={setQuery} />
      <CategoryStrip items={categoryItems} onItemClick={(label) => setQuery(label)} />
    </div>
  );
}

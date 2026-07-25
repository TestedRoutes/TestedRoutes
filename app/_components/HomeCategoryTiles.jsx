"use client";

import { useEffect, useState } from "react";
import CategoryStrip from "./CategoryStrip";

// The activity tiles live in the "Choose your adventure" band but filter the
// guide grid further up the page, so the two talk over window events: tiles
// announce a pick, the grid announces a clear. Neither re-dispatches what it
// receives, so there is no feedback loop.
export default function HomeCategoryTiles({ items = [] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = (e) => setActive(e.detail || "");
    window.addEventListener("home-category-cleared", handler);
    return () => window.removeEventListener("home-category-cleared", handler);
  }, []);

  const onItemClick = (label) => {
    const next = active === label ? "" : label;
    setActive(next);
    window.dispatchEvent(new CustomEvent("home-category-select", { detail: next }));
  };

  return <CategoryStrip items={items} activeLabel={active} onItemClick={onItemClick} />;
}

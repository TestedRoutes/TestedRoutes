"use client";

import { useState } from "react";

// GYG-style mobile accordion: collapsed header row with a chevron on
// mobile, always expanded with the normal section heading on desktop.
// Content stays in the DOM either way, so search engines index it at
// full weight.
export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-slate-200 pb-4 md:border-0 md:pb-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-1 text-left md:hidden"
      >
        <span className="font-serif text-xl font-semibold text-brand-ink">{title}</span>
        <span
          aria-hidden
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      <p className="mb-4 hidden font-serif text-xl font-semibold text-brand-ink md:block">
        {title}
      </p>
      <div className={`${open ? "mt-3 block" : "hidden"} md:mt-0 md:block`}>{children}</div>
    </section>
  );
}

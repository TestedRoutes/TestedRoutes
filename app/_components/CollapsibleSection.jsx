"use client";

import { useState } from "react";

// GYG-style mobile accordion: collapsed header row with a chevron on
// mobile, always expanded with the normal section heading on desktop.
// Content stays in the DOM either way, so search engines index it at
// full weight.
export default function CollapsibleSection({
  title,
  titleClassName = "text-brand-ink",
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-slate-200 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-3 text-left md:hidden"
      >
        <span className={`font-serif text-xl font-semibold ${titleClassName}`}>{title}</span>
        <span
          aria-hidden
          className={`text-lg text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      <p className={`mb-4 hidden font-serif text-xl font-semibold md:block ${titleClassName}`}>
        {title}
      </p>
      <div className={`${open ? "mb-4 mt-1 block" : "hidden"} md:mb-0 md:mt-0 md:block`}>
        {children}
      </div>
    </section>
  );
}

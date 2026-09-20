"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY, categoryLabel } from "../_lib/format";

/**
 * The Spots grid: photo-first cards with search, category chips and a region
 * select, the Rexby "Spots" tab in the brand's clothes. Places arrive
 * already serialised (photo as a URL, not a static import) so this can stay
 * a client component for the filtering.
 */
export default function PlaceGrid({ country, places }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [region, setRegion] = useState("");

  const regions = useMemo(() => [...new Set(places.map((p) => p.region).filter(Boolean))], [places]);
  const cats = useMemo(() => Object.keys(CATEGORY).filter((k) => places.some((p) => p.category === k)), [places]);
  const shown = places.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!region || p.region === region) &&
      (!q || `${p.name} ${p.region ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );

  const chip = (on) =>
    "shrink-0 rounded-full px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.1em] transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white/70 text-slate-700 hover:bg-white");

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search spots"
          className="w-full rounded-full border border-brand-line bg-white px-4 py-2 text-sm outline-none focus:border-brand-terracotta md:max-w-xs"
        />
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <button type="button" onClick={() => setCat("")} className={chip(!cat)}>All</button>
          {cats.map((k) => (
            <button key={k} type="button" onClick={() => setCat(cat === k ? "" : k)} className={chip(cat === k)}>
              {CATEGORY[k].label}
            </button>
          ))}
        </div>
        {regions.length > 1 ? (
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-full border border-brand-line bg-white px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-slate-700 md:ml-auto"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        ) : null}
      </div>

      <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500">
        {shown.length} of {places.length} places
      </p>

      <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <li key={p.pinId}>
            <Link href={`/reader/${country}/spots/${p.pinId}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-bone">
                {p.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl text-brand-ink/25">
                    {CATEGORY[p.category]?.glyph || "◎"}
                  </span>
                )}
                {p.stopLabel ? (
                  <span className="absolute left-2 top-2 rounded-full bg-brand-terracotta px-2 py-0.5 font-sans text-[10px] font-bold text-white">
                    {p.stopLabel}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-sans text-[14px] font-bold leading-tight text-slate-900">{p.name}</p>
              <p className="mt-0.5 font-sans text-[11px] text-slate-500">
                {categoryLabel(p.category)}
                {p.region ? ` · ${p.region}` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

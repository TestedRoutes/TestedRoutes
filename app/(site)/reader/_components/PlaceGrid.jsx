"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY, categoryLabel } from "../_lib/format";
import { useSaved } from "../_lib/saved";
import SaveButton from "./SaveButton";

/**
 * The Spots grid from the founder's mock: photo card with the region badge
 * bottom-left and the bookmark top-right, then the name, then
 * "category • time". Search, category chips, a Saved chip, and a link to
 * the full-screen map. Places arrive serialised (photo as a URL) so this
 * can stay a client component for the filtering and the bookmarks.
 */
export default function PlaceGrid({ country, places, mapHref }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const { saved, ready } = useSaved(country);

  const cats = useMemo(() => Object.keys(CATEGORY).filter((k) => places.some((p) => p.category === k)), [places]);
  const shown = places.filter(
    (p) =>
      (cat === "saved" ? saved.has(p.pinId) : !cat || p.category === cat) &&
      (!q || `${p.name} ${p.region ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );

  const chip = (on) =>
    "shrink-0 rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white text-slate-700 ring-1 ring-brand-line hover:bg-brand-ink/5");

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 ring-1 ring-brand-line">
          <span aria-hidden className="h-2 w-2 rounded-full bg-brand-ink" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search spots"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <button type="button" onClick={() => setCat("")} className={chip(!cat)}>All</button>
          {cats.map((k) => (
            <button key={k} type="button" onClick={() => setCat(cat === k ? "" : k)} className={chip(cat === k)}>
              {CATEGORY[k].label}
            </button>
          ))}
          <button type="button" onClick={() => setCat(cat === "saved" ? "" : "saved")} className={chip(cat === "saved")}>
            Saved{ready && saved.size ? ` · ${saved.size}` : ""}
          </button>
          {mapHref ? (
            <Link href={mapHref} className={chip(false) + " lg:hidden"}>Map</Link>
          ) : null}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          {cat === "saved" ? "Nothing saved yet. Tap + on a spot to keep it." : "No spots match."}
        </p>
      ) : null}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {shown.map((p) => (
          <li key={p.pinId}>
            <Link href={`/reader/${country}/spots/${p.pinId}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-bone">
                {p.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-brand-bone to-[#cfcabb] text-4xl text-brand-ink/25">
                    {CATEGORY[p.category]?.glyph || "◎"}
                  </span>
                )}
                {p.region ? (
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink">
                    {p.region}
                  </span>
                ) : null}
                {p.locked ? (
                  <span aria-label="Opens with the guide" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-ink/70 text-white shadow-md">
                    <span aria-hidden className="text-sm">🔒</span>
                  </span>
                ) : (
                  <SaveButton country={country} pinId={p.pinId} className="absolute right-3 top-3" />
                )}
              </div>
              <p className="mt-2.5 font-sans text-[16px] font-semibold leading-tight text-slate-900">{p.name}</p>
              <p className="mt-1 font-sans text-[13px] text-slate-500">
                {categoryLabel(p.category)}
                {p.timeShort ? ` • ${p.timeShort}` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

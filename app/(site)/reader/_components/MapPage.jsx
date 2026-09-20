"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY, categoryLabel } from "../_lib/format";
import { useSaved } from "../_lib/saved";
import RouteMap from "./RouteMap";
import SaveButton from "./SaveButton";

/**
 * The full-screen map from the founder's mock: the Google map filling the
 * viewport, search and category chips top-left, a back button, and the
 * photo strip along the bottom. Strip and map are one selection: click a
 * card and the map pans to its pin and opens the window; click a pin and
 * its card scrolls into view. The chips filter both. Bookmarks toggle on
 * the strip cards. Without access the locked pins sit muted and their
 * cards carry a lock.
 */
export default function MapPage({ country, title, places, backHref, buyHref, priceLabel }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [selected, setSelected] = useState(null);
  const { saved, ready } = useSaved(country);
  const stripRef = useRef(null);

  const cats = useMemo(() => Object.keys(CATEGORY).filter((k) => places.some((p) => p.category === k)), [places]);
  const shown = useMemo(
    () =>
      places.filter(
        (p) =>
          (cat === "saved" ? saved.has(p.pinId) : !cat || p.category === cat) &&
          (!q || `${p.name} ${p.region ?? ""}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [places, cat, q, saved],
  );

  // Numbered in list order so the map and the strip read together.
  const pins = shown
    .filter((p) => p.lat != null && p.lng != null)
    .map((p, i) => ({
      id: p.pinId,
      name: p.name,
      sub: categoryLabel(p.category) + (p.region ? ` · ${p.region}` : "") + (p.timeShort ? ` · ${p.timeShort}` : ""),
      lat: p.lat,
      lng: p.lng,
      kind: p.locked ? "muted" : selected === p.pinId && p.photoUrl ? "photo" : "number",
      label: String(i + 1),
      photoUrl: p.photoUrl,
      href: p.locked ? null : `/reader/${country}/spots/${p.pinId}`,
    }));

  useEffect(() => {
    if (!selected || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-pin="${selected}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selected]);

  const chip = (on) =>
    "shrink-0 rounded-full px-4 py-2 font-sans text-[13px] font-medium shadow-sm transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white text-slate-700 hover:bg-brand-ink/5");

  return (
    <div className="fixed inset-0 z-[80] bg-brand-parchment">
      <div className="absolute inset-0">
        <RouteMap pins={pins} height="100%" maxZoom={11} rounded={false} selectedId={selected} onSelect={setSelected} />
      </div>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 p-3 md:p-4">
        <Link href={backHref} className="pointer-events-auto rounded-full bg-white px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink shadow-sm">← {title}</Link>
        <label className="pointer-events-auto flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span aria-hidden className="h-2 w-2 rounded-full bg-brand-ink" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search spots" className="w-40 bg-transparent text-[14px] outline-none placeholder:text-slate-400 md:w-56" />
        </label>
        <div className="pointer-events-auto flex gap-2 overflow-x-auto">
          <button type="button" onClick={() => setCat("")} className={chip(!cat)}>All</button>
          {cats.map((k) => (
            <button key={k} type="button" onClick={() => setCat(cat === k ? "" : k)} className={chip(cat === k)}>{CATEGORY[k].label}</button>
          ))}
          <button type="button" onClick={() => setCat(cat === "saved" ? "" : "saved")} className={chip(cat === "saved")}>Saved{ready && saved.size ? ` · ${saved.size}` : ""}</button>
        </div>
        {buyHref ? (
          <a href={buyHref} className="pointer-events-auto ml-auto rounded-full bg-brand-flame px-4 py-2 font-sans text-[13px] font-semibold text-white shadow-sm">Get the guide{priceLabel ? ` · ${priceLabel}` : ""}</a>
        ) : null}
      </div>

      {/* Photo strip */}
      <div ref={stripRef} className="absolute inset-x-0 bottom-0 z-10 flex gap-3 overflow-x-auto px-3 pb-3 pt-6 md:px-4 md:pb-4" style={{ scrollbarWidth: "thin" }}>
        {shown.map((p, i) => {
          const on = selected === p.pinId;
          const inner = (
            <>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-bone">
                {p.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl text-brand-ink/25">{CATEGORY[p.category]?.glyph || "◎"}</span>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-brand-ink px-2 py-0.5 font-sans text-[10px] font-bold text-white">{i + 1}</span>
                {p.locked ? (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-ink/70 text-xs text-white">🔒</span>
                ) : (
                  <SaveButton country={country} pinId={p.pinId} size={28} className="absolute right-2 top-2" />
                )}
              </div>
              <p className="mt-2 truncate font-sans text-[13px] font-semibold text-slate-900">{p.name}</p>
              <p className="truncate font-sans text-[11px] text-slate-500">{categoryLabel(p.category)}{p.timeShort ? ` • ${p.timeShort}` : ""}</p>
            </>
          );
          return (
            <div
              key={p.pinId}
              data-pin={p.pinId}
              className={"w-36 shrink-0 cursor-pointer rounded-2xl bg-white p-2 shadow-card transition " + (on ? "ring-2 ring-brand-ink" : "ring-1 ring-brand-line")}
              onClick={() => setSelected(p.pinId)}
              onDoubleClick={() => { if (!p.locked) window.location.href = `/reader/${country}/spots/${p.pinId}`; }}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

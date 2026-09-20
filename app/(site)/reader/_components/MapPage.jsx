"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY, categoryLabel } from "../_lib/format";
import { useSaved } from "../_lib/saved";
import RouteMap from "./RouteMap";
import SaveButton from "./SaveButton";

/**
 * The full-screen map, per the founder's mock (2026-09-20, second pass):
 * the Google map on the left, and on the right a panel that lists every
 * tested place by region, numbered to match the pins — number, thumbnail,
 * name, "category • time", bookmark. Click a row and the map pans to its
 * pin; click a pin and its row highlights and scrolls into view. The
 * selected place also shows as a small card over the map's bottom-left
 * corner, with the link to its page. Search and chips filter both sides.
 *
 * Phones have no room for a side panel: there the list collapses to the
 * photo strip along the bottom.
 *
 * Without access the locked pins sit muted and their rows carry a lock.
 */
export default function MapPage({ country, title, places, backHref, buyHref, priceLabel }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [selected, setSelected] = useState(null);
  const { saved, ready } = useSaved(country);
  const panelRef = useRef(null);
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

  // Region groups in order of first appearance; numbering runs across them
  // so the list and the pins read as one sequence.
  const groups = useMemo(() => {
    const out = [];
    const by = new Map();
    shown.forEach((p) => {
      const key = p.region || "Elsewhere";
      if (!by.has(key)) {
        by.set(key, []);
        out.push([key, by.get(key)]);
      }
      by.get(key).push(p);
    });
    let n = 0;
    return out.map(([region, items]) => [region, items.map((p) => ({ ...p, n: ++n }))]);
  }, [shown]);
  const numbered = useMemo(() => groups.flatMap(([, items]) => items), [groups]);
  const current = selected ? numbered.find((p) => p.pinId === selected) || null : null;

  const pins = numbered
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.pinId,
      name: p.name,
      sub: categoryLabel(p.category) + (p.region ? ` · ${p.region}` : "") + (p.timeShort ? ` · ${p.timeShort}` : ""),
      lat: p.lat,
      lng: p.lng,
      kind: p.locked ? "muted" : "number",
      label: String(p.n),
      photoUrl: p.photoUrl,
      href: p.locked ? null : `/reader/${country}/spots/${p.pinId}`,
    }));

  useEffect(() => {
    if (!selected) return;
    for (const ref of [panelRef, stripRef]) {
      const el = ref.current?.querySelector(`[data-pin="${selected}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selected]);

  const chip = (on) =>
    "shrink-0 rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white text-slate-700 ring-1 ring-brand-line hover:bg-brand-ink/5");

  const thumb = (p, size) => (
    <div className={"relative shrink-0 overflow-hidden rounded-xl bg-brand-bone " + size}>
      {p.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-xl text-brand-ink/25">{CATEGORY[p.category]?.glyph || "◎"}</span>
      )}
    </div>
  );

  const filters = (
    <>
      <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 ring-1 ring-brand-line">
        <span aria-hidden className="h-2 w-2 rounded-full bg-brand-ink" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search spots" className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400" />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setCat("")} className={chip(!cat)}>All</button>
        {cats.map((k) => (
          <button key={k} type="button" onClick={() => setCat(cat === k ? "" : k)} className={chip(cat === k)}>{CATEGORY[k].label}</button>
        ))}
        <button type="button" onClick={() => setCat(cat === "saved" ? "" : "saved")} className={chip(cat === "saved")}>Saved{ready && saved.size ? ` · ${saved.size}` : ""}</button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[80] flex bg-brand-parchment">
      {/* Map */}
      <div className="relative min-w-0 flex-1">
        <div className="absolute inset-0">
          <RouteMap pins={pins} height="100%" maxZoom={11} rounded={false} selectedId={selected} onSelect={setSelected} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center gap-3 p-3 md:p-4">
          <Link href={backHref} className="pointer-events-auto whitespace-nowrap rounded-full bg-white px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink shadow-sm">
            <span className="md:hidden">← {title}</span>
            <span className="hidden md:inline">← Back to {title}</span>
          </Link>
          <span className="hidden font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:inline">{shown.length} of {places.length} places</span>
          {buyHref ? (
            <a href={buyHref} className="pointer-events-auto ml-auto whitespace-nowrap rounded-full bg-brand-flame px-4 py-2 font-sans text-[13px] font-semibold text-white shadow-sm">
              <span className="md:hidden">{priceLabel || "Get the guide"}</span>
              <span className="hidden md:inline">Get the guide{priceLabel ? ` · ${priceLabel}` : ""}</span>
            </a>
          ) : null}
        </div>
        {/* Selected card */}
        {current ? (
          <div className="absolute bottom-4 left-4 z-10 hidden w-72 items-center gap-3 rounded-2xl bg-white p-3 shadow-card ring-1 ring-brand-line md:flex">
            {thumb(current, "h-16 w-16")}
            <div className="min-w-0">
              <p className="truncate font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{current.region || "Fiji"} • {categoryLabel(current.category)}</p>
              <p className="truncate text-lg leading-tight">{current.name}</p>
              <p className="truncate font-sans text-[12px] text-slate-500">Pin {current.n}{current.timeShort ? ` • ${current.timeShort}` : ""}</p>
              {!current.locked ? (
                <Link href={`/reader/${country}/spots/${current.pinId}`} className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">Open the spot →</Link>
              ) : null}
            </div>
          </div>
        ) : null}
        {/* Phone: filters on top, strip along the bottom */}
        <div className="pointer-events-auto absolute inset-x-0 top-16 z-10 flex flex-col gap-2 px-3 md:hidden">{filters}</div>
        <div ref={stripRef} className="absolute inset-x-0 bottom-0 z-10 flex gap-3 overflow-x-auto px-3 pb-3 pt-6 md:hidden" style={{ scrollbarWidth: "thin" }}>
          {numbered.map((p) => (
            <div key={p.pinId} data-pin={p.pinId} onClick={() => setSelected(p.pinId)} className={"w-36 shrink-0 cursor-pointer rounded-2xl bg-white p-2 shadow-card " + (selected === p.pinId ? "ring-2 ring-brand-ink" : "ring-1 ring-brand-line")}>
              <div className="relative">
                {thumb(p, "aspect-square w-full")}
                <span className="absolute left-2 top-2 rounded-full bg-brand-ink px-2 py-0.5 font-sans text-[10px] font-bold text-white">{p.n}</span>
              </div>
              <p className="mt-2 truncate font-sans text-[13px] font-semibold text-slate-900">{p.name}</p>
              <p className="truncate font-sans text-[11px] text-slate-500">{categoryLabel(p.category)}{p.timeShort ? ` • ${p.timeShort}` : ""}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: the panel */}
      <aside ref={panelRef} className="hidden w-[42%] max-w-[46rem] flex-col overflow-y-auto border-l border-brand-line bg-brand-parchment px-6 pb-8 pt-5 md:flex">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{title} • by region</p>
        <h1 className="mt-1 text-3xl leading-tight">Every tested place</h1>
        <div className="mt-4 flex flex-col gap-3">{filters}</div>
        {groups.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">{cat === "saved" ? "Nothing saved yet. Tap + on a place to keep it." : "No places match."}</p>
        ) : null}
        {groups.map(([region, items]) => (
          <section key={region} className="mt-6">
            <div className="flex items-baseline justify-between px-1">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{region}</h2>
              <span className="font-sans text-[11px] text-slate-500">{items.length} {items.length === 1 ? "place" : "places"}</span>
            </div>
            <ol className="mt-2 divide-y divide-brand-line overflow-hidden rounded-2xl bg-white ring-1 ring-brand-line">
              {items.map((p) => {
                const on = selected === p.pinId;
                return (
                  <li
                    key={p.pinId}
                    data-pin={p.pinId}
                    onClick={() => setSelected(p.pinId)}
                    className={"flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors " + (on ? "bg-brand-terracotta-soft" : "hover:bg-brand-ink/[0.03]")}
                  >
                    <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-bold " + (on ? "bg-brand-terracotta text-white" : "bg-brand-ink text-brand-cream")}>{p.n}</span>
                    {thumb(p, "h-12 w-12")}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[15px] font-semibold text-slate-900">{p.name}</p>
                      <p className="truncate font-sans text-[12px] text-slate-500">{categoryLabel(p.category)}{p.timeShort ? ` • ${p.timeShort}` : ""}</p>
                    </div>
                    {p.locked ? (
                      <span aria-label="Opens with the guide" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-ink/70 text-xs text-white">🔒</span>
                    ) : (
                      <SaveButton country={country} pinId={p.pinId} size={32} className="shrink-0" />
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </aside>
    </div>
  );
}

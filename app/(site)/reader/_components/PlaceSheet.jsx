"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CATEGORY, categoryLabel } from "../_lib/format";
import AffiliateSlot from "./AffiliateSlot";
import SaveButton from "./SaveButton";

/**
 * The place sheet over the map (founder's mock, 2026-09-20): "Details" on
 * the selected card opens the place here instead of leaving the map. Photo
 * on the left with "← Back" and the pin badge; on the right the eyebrow,
 * name, "+ Save", Directions and "Show on the map", then why it is in the
 * guide, the facts, the routes it is in, and the "Last reviewed" line (the
 * only date any surface shows). Escape or the dimmed map closes it. Phones
 * stack the photo above the text and scroll inside the sheet.
 *
 * Fact rows follow the mock's labels: Allow (time_needed, else time_short),
 * Cost, Best (season), Getting there (access), then parking and road when
 * a place has them.
 */
const FACTS = [
  ["Allow", (a) => a.time_needed || a.time_short],
  ["Cost", (a) => a.cost_band],
  ["Best", (a) => a.season],
  ["Getting there", (a) => a.access],
  ["Parking", (a) => a.parking],
  ["Road", (a) => a.road],
];

export default function PlaceSheet({ country, place, pinNumber, reviewedLabel, onClose, onShowOnMap }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!place) return null;
  const a = place.attributes || {};
  const facts = FACTS.map(([label, pick]) => [label, pick(a)]).filter(([, v]) => v);
  const eyebrow = `${place.region || country} • ${categoryLabel(place.category)}`;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-brand-ink/45 p-3 md:p-8" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={place.name}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-full w-full max-w-4xl grid-rows-[auto_1fr] overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-[1fr_1.2fr] md:grid-rows-1"
      >
        <div className="relative aspect-[4/3] bg-brand-parchment md:aspect-auto md:h-full md:min-h-[34rem]">
          {place.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.photoUrl} alt={place.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl text-brand-terracotta/70">{CATEGORY[place.category]?.glyph || "◎"}</span>
          )}
          <button type="button" onClick={onClose} className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink shadow-sm">← Back</button>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Pin {pinNumber}{place.region ? ` • ${place.region}` : ""}
          </span>
        </div>

        <div className="min-h-0 overflow-y-auto p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
              <h2 className="mt-1 text-3xl leading-tight">{place.name}</h2>
            </div>
            <SaveButton country={country} pinId={place.pinId} variant="pill" className="shrink-0" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {place.directionsHref ? (
              <a href={place.directionsHref} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink ring-1 ring-brand-line hover:bg-brand-ink/5">Directions</a>
            ) : null}
            <button type="button" onClick={onShowOnMap} className="rounded-full px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink ring-1 ring-brand-line hover:bg-brand-ink/5">Show on the map</button>
            <AffiliateSlot goSlug={place.goSlug} label={place.category === "stay" ? "Check rates" : "Book"} />
          </div>
          <hr className="my-5 border-brand-line" />

          {place.description ? (
            <>
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Why it is in the guide</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{place.description}</p>
            </>
          ) : null}

          {facts.length ? (
            <dl className="mt-4 grid gap-1.5">
              {facts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-3 rounded-xl bg-brand-parchment px-4 py-3">
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
                  <dd className="text-[14px] leading-snug text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <h3 className="mt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">In these routes</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {place.routes?.length ? (
              place.routes.map((r) => (
                <Link key={r.slug} href={r.href} className="rounded-full bg-brand-terracotta-soft px-3 py-1.5 font-sans text-[12px] font-semibold text-slate-900 hover:bg-brand-terracotta hover:text-white">
                  {r.title} · {r.label}
                </Link>
              ))
            ) : (
              <span className="rounded-full bg-brand-parchment px-3 py-1.5 font-sans text-[12px] font-semibold text-slate-600">Not on a route yet</span>
            )}
          </div>

          {reviewedLabel ? <p className="mt-5 font-sans text-[12px] text-slate-500">Last reviewed {reviewedLabel}.</p> : null}
        </div>
      </div>
    </div>
  );
}

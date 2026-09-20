"use client";

import { useState } from "react";
import RouteMap from "./RouteMap";

/**
 * The route map beside the itinerary overview (founder's mock, 2026-09-20):
 * every stop as a "1a, 1b, 2a…" pin (day number + stop letter) joined by
 * the trip line, and a chip per day over the map. Click a day chip and the
 * map shows that day alone; click it again for the whole trip. Pins arrive
 * in trip order with a `day` on each, so the line is just the pins joined.
 */
export default function RouteOverviewMap({ pins, days, height = "100%", maxZoom = 10 }) {
  const [day, setDay] = useState(null);
  const shown = day == null ? pins : pins.filter((p) => p.day === day);
  const line = shown.filter((p) => p.lat != null && p.lng != null).map((p) => [p.lat, p.lng]);
  const chip = (on) =>
    "shrink-0 rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold shadow-sm transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white text-slate-700 ring-1 ring-brand-line hover:bg-brand-ink/5");
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <RouteMap pins={shown} line={line} height={height} maxZoom={maxZoom} />
      </div>
      <div className="absolute inset-x-0 top-0 z-10 flex gap-2 overflow-x-auto overflow-y-hidden p-3">
        {days.map((d) => (
          <button key={d.dayFrom} type="button" onClick={() => setDay(day === d.dayFrom ? null : d.dayFrom)} className={chip(day === d.dayFrom)}>
            {d.label} • {d.title}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

/**
 * The day's two views of the same slots: the hour rail (ours, the
 * executable day the deck sells) and the stop list (Rexby's planner view,
 * what the adapters asked for). Both are rendered on the server and handed
 * in; this only decides which one shows. Rail is the default on purpose.
 */
export default function DayView({ rail, list }) {
  const [mode, setMode] = useState("rail");
  const btn = (on) =>
    "rounded-full px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.1em] transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "text-slate-600 hover:bg-brand-ink/5");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-script text-lg text-brand-terracotta">the plan</p>
        <div className="flex gap-1 rounded-full bg-white/70 p-0.5">
          <button type="button" onClick={() => setMode("rail")} className={btn(mode === "rail")}>Timeline</button>
          <button type="button" onClick={() => setMode("list")} className={btn(mode === "list")}>Stops</button>
        </div>
      </div>
      {mode === "rail" ? rail : list}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

/**
 * The reader's map. Google Maps only (founder rule, 2026-09-20). The key
 * and Map ID come from public env vars; without a key this renders a
 * labelled placeholder rather than a blank box, so a missing variable on a
 * deploy is visible at a glance.
 */
const RouteMapGoogle = dynamic(() => import("./RouteMapGoogle"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-xl bg-brand-bone/60 text-xs text-slate-500">
      Loading map…
    </div>
  ),
});

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// AdvancedMarker needs a Map ID. DEMO_MAP_ID is Google's development
// fallback; a real one (Cloud Console → Map Management) carries the
// brand's map style and removes the development notice.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

export default function RouteMap(props) {
  if (!API_KEY) {
    return (
      <div
        className="flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-brand-ink/25 bg-brand-bone/40 px-6 text-center"
        style={{ height: props.height }}
      >
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">Map</p>
        <p className="mt-1 text-xs text-slate-500">
          Google Maps needs <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in this environment.
        </p>
      </div>
    );
  }
  return <RouteMapGoogle apiKey={API_KEY} mapId={MAP_ID} {...props} />;
}

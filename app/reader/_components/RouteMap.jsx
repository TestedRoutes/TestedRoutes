"use client";

import dynamic from "next/dynamic";

/** Client-only wrapper: Leaflet touches window at import time. */
const RouteMapLeaflet = dynamic(() => import("./RouteMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-xl bg-brand-bone/60 text-xs text-slate-500">
      Loading map…
    </div>
  ),
});

export default RouteMapLeaflet;

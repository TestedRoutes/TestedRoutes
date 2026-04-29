"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
      Loading map…
    </div>
  ),
});

export default LocationMap;

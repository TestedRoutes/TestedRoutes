"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SEARCH_SUGGESTIONS = [
  { label: "Switzerland – Country", href: "/destinations/switzerland" },
  { label: "Zurich – Starting point in Switzerland", href: "/destinations/switzerland?start=zurich" },
  { label: "Triftbrücke from Zurich – Guide", href: "/guides/trift-bridge-from-zurich" },
  { label: "Stoos Ridge from Zurich – Guide", href: "/guides/stoos-ridge-from-zurich" },
  { label: "Appenzell & Ebenalp from Zurich – Guide", href: "/guides/appenzell-ebenalp-from-zurich" },
  { label: "Mount Rigi from Zurich – Guide", href: "/guides/mount-rigi-from-zurich" },
  { label: "Säntis from Zurich – Guide", href: "/guides/santis-from-zurich" },
  { label: "Flims & Caumasee from Zurich – Guide", href: "/guides/flims-caumasee-from-zurich" },
  { label: "Day trips from Zurich – Guide collection", href: "/destinations/switzerland?length=daytrip&start=zurich" },
];

const GUIDE_MATCHES = {
  trift: "/guides/trift-bridge-from-zurich",
  stoos: "/guides/stoos-ridge-from-zurich",
  appenzell: "/guides/appenzell-ebenalp-from-zurich",
  ebenalp: "/guides/appenzell-ebenalp-from-zurich",
  rigi: "/guides/mount-rigi-from-zurich",
  säntis: "/guides/santis-from-zurich",
  santis: "/guides/santis-from-zurich",
  flims: "/guides/flims-caumasee-from-zurich",
  caumasee: "/guides/flims-caumasee-from-zurich",
};

const DESTINATION_TERMS = ["switzerland", "swiss", "zurich", "geneva", "lucerne", "interlaken"];

function resolveDestinationSearch(query) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  const directGuide = Object.keys(GUIDE_MATCHES).find((term) => normalized.includes(term));
  if (directGuide) return GUIDE_MATCHES[directGuide];

  if (!DESTINATION_TERMS.some((term) => normalized.includes(term))) return null;

  let length = null;
  if (normalized.includes("weekend")) length = "weekend";
  else if (normalized.includes("day trip") || normalized.includes("day trips") || normalized.includes("daytrip") || normalized.includes("1 day")) length = "daytrip";
  else if (normalized.includes("expedition")) length = "expedition";
  else if (normalized.includes("2 week") || normalized.includes("two week") || normalized.includes("14 day")) length = "2weeks";
  else if (normalized.includes("5-7") || normalized.includes("week")) length = "week";

  let start = null;
  if (normalized.includes("zurich")) start = "zurich";
  else if (normalized.includes("geneva")) start = "geneva";
  else if (normalized.includes("lucerne")) start = "lucerne";
  else if (normalized.includes("interlaken")) start = "interlaken";

  const params = new URLSearchParams();
  if (length) params.set("length", length);
  if (start) params.set("start", start);
  const qs = params.toString();
  return `/destinations/switzerland${qs ? `?${qs}` : ""}`;
}

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const suggestions = query
    ? SEARCH_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSubmit = () => {
    const url = resolveDestinationSearch(query);
    if (url) router.push(url);
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
          <span className="h-2 w-2 rounded-full bg-slate-900" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Search destinations or guides"
            className="w-full bg-transparent text-sm text-slate-600 outline-none"
          />
        </div>
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          onClick={handleSubmit}
        >
          Search Guides
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {suggestions.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

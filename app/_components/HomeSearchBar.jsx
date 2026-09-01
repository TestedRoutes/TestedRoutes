"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { HIDDEN_DESTINATION_SLUGS } from "../_lib/destinations";
import { langFromPathname, localePath } from "../_lib/locale";

// Supports either uncontrolled (own state) or controlled (parent owns query
// via `query` + `onQueryChange`). The controlled mode lets neighbour widgets
// like CategoryStrip drive the search.

const DESTINATION_TERMS = ["switzerland", "swiss", "zurich", "geneva", "lucerne", "interlaken"];

function resolveDestinationSearch(query) {
  // The Switzerland hub is hidden (_lib/destinations.js): deep-linking a
  // search there would land on a redirect to the generic index, which reads
  // as a broken search. Swiss queries fall through to guide matching instead
  // — the Swiss guides all still exist. Un-hide the hub and this gate can go.
  if (HIDDEN_DESTINATION_SLUGS.includes("switzerland")) return null;
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;
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

function matchGuides(guides, query) {
  const needle = query.toLowerCase().trim();
  if (!needle) return [];
  return guides.filter((g) => {
    const haystack = `${g.title} ${g.slug} ${g.category || ""}`.toLowerCase();
    return haystack.includes(needle);
  });
}

const VARIANT_STYLES = {
  hero: {
    // Sized against the 57hours reference: ~640px bar, ~60px tall on desktop.
    wrapper: "mx-auto w-full max-w-2xl",
    container: "p-1.5 shadow-md",
    input: "px-4 py-3 text-sm md:px-5 md:text-base",
    button: "px-4 py-3 text-sm md:px-6 md:text-base",
    buttonLabel: (
      <>
        <span className="md:hidden">Search</span>
        <span className="hidden md:inline">Search Guides</span>
      </>
    ),
  },
  compact: {
    wrapper: "w-full",
    container: "p-1.5 shadow-md",
    input: "px-5 py-3 text-sm",
    button: "px-5 py-3 text-sm",
    buttonLabel: "Search",
  },
};

// scope decides where a no-match submit lands (/guides?q= vs /inspire?q=)
// and whether the Switzerland destination shortcut applies; the suggestion
// dropdown just lists whatever entries were passed in `guides`.
export default function HomeSearchBar({
  guides = [],
  query: controlledQuery,
  onQueryChange,
  variant = "hero",
  scope = "guides",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isControlled = controlledQuery !== undefined && typeof onQueryChange === "function";
  const [internalQuery, setInternalQuery] = useState("");
  const query = isControlled ? controlledQuery : internalQuery;
  const setQuery = isControlled ? onQueryChange : setInternalQuery;
  const matches = query ? matchGuides(guides, query).slice(0, 8) : [];
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.hero;

  const handleSubmit = () => {
    if (matches.length > 0) {
      router.push(matches[0].href);
      return;
    }
    const url = scope === "guides" ? resolveDestinationSearch(query) : null;
    if (url) {
      router.push(url);
      return;
    }
    // No local match (the header instance only carries slim nav entries, and
    // the destination shortcut is Switzerland-only) — land on the section's
    // index with the query pre-filled instead of doing nothing. /guides?q=
    // is the same target the home continent cards link to.
    const term = query.trim();
    if (!term) return;
    const indexPath = scope === "inspire" ? "/inspire" : "/guides";
    router.push(
      `${localePath(langFromPathname(pathname), indexPath)}?q=${encodeURIComponent(term)}`,
    );
  };

  return (
    <div className={`relative ${styles.wrapper}`}>
      <div className={`flex w-full items-center gap-2 rounded-full bg-white shadow-card ring-1 ring-brand-line ${styles.container}`}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Where to next?"
          className={`min-w-0 flex-1 bg-transparent text-brand-ink outline-none placeholder:text-slate-400 ${styles.input}`}
        />
        <button
          type="button"
          className={`shrink-0 rounded-full bg-brand-terracotta font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 ${styles.button}`}
          onClick={handleSubmit}
        >
          {styles.buttonLabel}
        </button>
      </div>
      {matches.length > 0 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white shadow-card-hover ring-1 ring-brand-line">
          {matches.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="block px-4 py-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-900">{item.title}</span>
              {item.category ? (
                <span className="ml-2 text-slate-500">– {item.category}</span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

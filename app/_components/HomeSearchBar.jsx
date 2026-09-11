"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { VISIBLE_DESTINATION_SLUGS } from "../_lib/destinations";
import { langFromPathname, localePath } from "../_lib/locale";

// Supports either uncontrolled (own state) or controlled (parent owns query
// via `query` + `onQueryChange`). The controlled mode lets neighbour widgets
// like CategoryStrip drive the search.

// Swiss search terms → destination hub. The Switzerland hub is a country
// page plus (planned) regional sub-hubs at /destinations/<region>; a query
// naming a region lands on that region's page once it exists, and on the
// country page until then. Order matters only where terms overlap - none
// do today. The old filter page took ?length=&start= querystrings; the
// editorial hub has no filters, so a search carries nothing but the path.
const SWISS_HUB_TERMS = [
  { terms: ["zurich", "zürich"], slug: "zurich" },
  { terms: ["geneva"], slug: "geneva" },
  { terms: ["lucerne", "luzern"], slug: "lucerne" },
  { terms: ["interlaken"], slug: "interlaken" },
  { terms: ["zermatt"], slug: "zermatt" },
  { terms: ["lugano"], slug: "lugano" },
  { terms: ["st. moritz", "st moritz"], slug: "st-moritz" },
  { terms: ["appenzell"], slug: "appenzell" },
];
const SWISS_COUNTRY_TERMS = ["switzerland", "swiss"];

function resolveDestinationSearch(query) {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;
  // A hub is only a valid landing when it is visible (_lib/destinations.js):
  // a sub-hub that has no page yet, or a hub that is paused, must not be
  // deep-linked from search - that reads as a broken search. Region first,
  // then the country page, then nothing (the caller falls through to
  // /guides?q=).
  const region = SWISS_HUB_TERMS.find((entry) =>
    entry.terms.some((term) => normalized.includes(term)),
  );
  if (region && VISIBLE_DESTINATION_SLUGS.includes(region.slug)) {
    return `/destinations/${region.slug}`;
  }
  const isSwiss =
    Boolean(region) || SWISS_COUNTRY_TERMS.some((term) => normalized.includes(term));
  if (isSwiss && VISIBLE_DESTINATION_SLUGS.includes("switzerland")) {
    return "/destinations/switzerland";
  }
  return null;
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

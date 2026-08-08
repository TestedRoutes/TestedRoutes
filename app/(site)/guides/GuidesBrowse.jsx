"use client";

import { useMemo, useState } from "react";
import GuideListCard from "./GuideListCard";
import GuideFilterRow from "../../_components/GuideFilterRow";
import {
  buildGuideFilterOptions,
  matchesGuideFilters,
  matchesGuideSearch,
} from "../../_lib/guideFilters";

// Line icons for the trust trio, drawn in Brandy: mountain / clock / pin.
const TRUST_ICONS = [
  <path key="mountain" d="M3 20 L10 6 L14 13 L17 9 L21 20 Z M8.5 9 L10 11 L11.5 9" />,
  <path key="clock" d="M12 21 a9 9 0 1 1 0-18 a9 9 0 0 1 0 18 Z M12 7 V12 L15.5 14" />,
  <path key="pin" d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" />,
];

// Two desktop rows of the lg 4-column grid — where the interlude band cuts
// into the card list (founder 2026-08-08).
const INTERLUDE_AFTER = 8;

export default function GuidesBrowse({
  guides,
  t,
  tl,
  lang = "en",
  initialSearch = "",
  interlude = null,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState({
    country: "",
    length: "",
    activity: "",
    season: "",
  });
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const options = useMemo(() => buildGuideFilterOptions(guides), [guides]);
  const filtered = useMemo(
    () => guides.filter((g) => matchesGuideSearch(g, search) && matchesGuideFilters(g, filters)),
    [guides, search, filters],
  );

  const firstRows = filtered.slice(0, INTERLUDE_AFTER);
  const rest = filtered.slice(INTERLUDE_AFTER);
  const cardGrid = (cards) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((g) => (
        <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="w-full max-w-2xl">
        <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-slate-200 ">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tl.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 md:px-5 md:text-base"
          />
          <button
            type="button"
            className="shrink-0 rounded-full bg-brand-terracotta px-4 py-3 text-sm font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 md:px-6 md:text-base"
          >
            {t.inspireList.searchButton}
          </button>
        </div>
      </div>

      {/* Trust trio (founder 2026-08-08): replaces the activity tile strip
          that used to sit after the search — why the guides work, not what
          they cover. Icon inline before the title, everything centered. */}
      <div className="grid gap-8 sm:grid-cols-3">
        {(tl.trust || []).map((item, i) => (
          <div key={item.title} className="space-y-2 text-center">
            <h3 className="flex items-center justify-center gap-2.5 font-serif text-xl font-normal text-brand-ink">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-brand-terracotta"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {TRUST_ICONS[i]}
              </svg>
              {item.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        {/* No heading on the filter row (founder 2026-08-08) — just the
            dropdowns with the result count on the right. */}
        <GuideFilterRow options={options} filters={filters} onChange={setFilter} tl={tl}>
          <p className="text-xs font-medium tabular-nums text-slate-500">
            {filtered.length} {filtered.length === 1 ? tl.guide : tl.guides}
          </p>
        </GuideFilterRow>

        {cardGrid(firstRows)}
        {interlude}
        {rest.length ? cardGrid(rest) : null}

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t.inspireList.noMatchTitle}</p>
        ) : null}
      </section>
    </div>
  );
}

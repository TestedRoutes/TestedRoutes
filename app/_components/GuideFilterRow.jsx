"use client";

import { prettyGeo } from "../_lib/continents";

// The four guide dropdowns — Country, Length, Activity, Season — shared by
// the home grid and /guides (founder 2026-08-08). Options and state live in
// the parent; this only renders the row. `children` is the right-aligned
// slot (result count on /guides, View all on home). On phones the selects
// wrap two per row at a readable size — four in one row shrank each to an
// unreadable sliver; from `sm` up they sit in one row, equal-width, capped
// at 160px.
export default function GuideFilterRow({ options, filters, onChange, tl, children }) {
  const selectClass =
    "h-10 min-w-[calc(50%-0.25rem)] flex-1 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:h-9 sm:min-w-0 sm:max-w-40 sm:text-xs";

  const dropdowns = [
    { key: "country", label: tl.filterCountry, values: options.countries },
    // Length and Season values stay raw for matching ("day trip",
    // "summer"); prettify only for display.
    { key: "length", label: tl.filterLength, values: options.lengths, display: prettyGeo },
    { key: "activity", label: tl.filterActivity, values: options.activities },
    { key: "season", label: tl.filterSeason, values: options.seasons, display: prettyGeo },
  ];

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {dropdowns.map((d) =>
        d.values.length ? (
          <select
            key={d.key}
            value={filters[d.key]}
            onChange={(e) => onChange(d.key, e.target.value)}
            className={selectClass}
            aria-label={d.label}
          >
            <option value="">{`${d.label}: ${tl.filterAll}`}</option>
            {d.values.map((v) => (
              <option key={v} value={v}>
                {d.display ? d.display(v) : v}
              </option>
            ))}
          </select>
        ) : null,
      )}
      {children ? <div className="ml-auto shrink-0">{children}</div> : null}
    </div>
  );
}

"use client";

// One-line filter row shared by home, guides and inspire: trip type +
// country selects on the left, an optional right-aligned slot (count or
// View all) passed as children. On phones the selects go two per row at a
// readable size and the slot wraps below; from `sm` up everything sits in
// one row, equal-width selects capped at 160px.
export default function CardFilters({
  types = [],
  countries = [],
  type,
  country,
  onType,
  onCountry,
  labels,
  children,
}) {
  if (!types.length && !countries.length) return null;
  const selectClass =
    "h-10 min-w-[calc(50%-0.25rem)] flex-1 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:h-9 sm:min-w-0 sm:max-w-40 sm:text-xs";
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {types.length ? (
        <select
          value={type}
          onChange={(e) => onType(e.target.value)}
          className={selectClass}
          aria-label={labels.filterType}
        >
          <option value="">{`${labels.filterType}: ${labels.filterAll}`}</option>
          {types.map((v) => (
            <option key={v} value={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </select>
      ) : null}
      {countries.length ? (
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className={selectClass}
          aria-label={labels.filterCountry}
        >
          <option value="">{`${labels.filterCountry}: ${labels.filterAll}`}</option>
          {countries.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      ) : null}
      {children ? <div className="ml-auto shrink-0">{children}</div> : null}
    </div>
  );
}

"use client";

// One-line filter row shared by home, guides and inspire: trip type +
// country selects on the left, an optional right-aligned slot (count or
// View all) passed as children. Selects flex to fit small screens but
// stay equal-width, capped at 160px on larger ones.
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
    "h-9 min-w-0 flex-1 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:max-w-40";
  return (
    <div className="flex w-full items-center gap-2">
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

"use client";

// Two compact filter selects (trip type + country) shared by the home,
// guides and inspire browse components.
export default function CardFilters({
  types = [],
  countries = [],
  type,
  country,
  onType,
  onCountry,
  labels,
}) {
  if (!types.length && !countries.length) return null;
  // Fixed height + width so both boxes match each other (and the View all
  // pill) on every page.
  const selectClass =
    "h-9 w-36 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none";
  return (
    <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}

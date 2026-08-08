"use client";

import { useMemo, useState } from "react";
import GuideListCard from "./GuideListCard";
import { prettyGeo } from "../../_lib/continents";

function guideHaystack(guide) {
  const geo = guide.metadata?.geography || {};
  // Geography goes in twice: raw snake_case and the display form, so both
  // "new_zealand" and a typed "New Zealand" (or a ?q= link) match.
  return [
    guide.title,
    guide.category,
    geo.country,
    geo.continent,
    prettyGeo(geo.country),
    prettyGeo(geo.continent),
    guide.metadata?.seo?.meta_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSearch(guide, query) {
  const needle = (query || "").toLowerCase().trim();
  if (!needle) return true;
  return guideHaystack(guide).includes(needle);
}

// Duration displays are sentences ("2 days, ~10 h walking total"), so the
// Length dropdown groups on just the leading count + unit — six two-day
// hikes collapse into one "2 days" option.
function lengthKey(duration) {
  const m = String(duration || "").match(/^\s*(\d+)\s*(days?|weeks?|nights?|hours?)/i);
  return m ? `${m[1]} ${m[2].toLowerCase()}` : String(duration || "").trim();
}

// Fixed calendar order for the Season dropdown; anything unknown sorts last.
const SEASON_ORDER = ["spring", "summer", "autumn", "fall", "winter", "year_round"];
function seasonRank(s) {
  const i = SEASON_ORDER.indexOf(String(s).toLowerCase());
  return i === -1 ? SEASON_ORDER.length : i;
}

// "2 days" before "7 days" before "2 weeks" is really a numeric sort with an
// alphabetical tie-break — plain localeCompare would put "10 days" first.
function byLeadingNumber(a, b) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
  return a.localeCompare(b);
}

// Line icons for the trust trio, drawn in Brandy: mountain / clock / pin.
const TRUST_ICONS = [
  <path key="mountain" d="M3 20 L10 6 L14 13 L17 9 L21 20 Z M8.5 9 L10 11 L11.5 9" />,
  <path key="clock" d="M12 21 a9 9 0 1 1 0-18 a9 9 0 0 1 0 18 Z M12 7 V12 L15.5 14" />,
  <path key="pin" d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" />,
];

export default function GuidesBrowse({
  guides,
  t,
  tl,
  lang = "en",
  initialSearch = "",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [countryFilter, setCountryFilter] = useState("");
  const [lengthFilter, setLengthFilter] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");

  const countries = useMemo(
    () =>
      [
        ...new Set(
          guides.map((g) => prettyGeo(g.metadata?.geography?.country)).filter(Boolean),
        ),
      ].sort(),
    [guides],
  );
  const lengths = useMemo(
    () =>
      [...new Set(guides.map((g) => lengthKey(g.duration)).filter(Boolean))].sort(
        byLeadingNumber,
      ),
    [guides],
  );
  const activities = useMemo(
    () =>
      [
        ...new Set(
          guides
            .map((g) => prettyGeo(g.metadata?.classification?.activity_category))
            .filter(Boolean),
        ),
      ].sort(),
    [guides],
  );
  const seasons = useMemo(
    () =>
      [
        ...new Set(
          guides
            .flatMap((g) => g.metadata?.timing?.best_seasons || [])
            .map((s) => String(s).toLowerCase())
            .filter(Boolean),
        ),
      ].sort((a, b) => seasonRank(a) - seasonRank(b)),
    [guides],
  );

  const filtered = useMemo(
    () =>
      guides.filter(
        (g) =>
          matchesSearch(g, search) &&
          (!countryFilter || prettyGeo(g.metadata?.geography?.country) === countryFilter) &&
          (!lengthFilter || lengthKey(g.duration) === lengthFilter) &&
          (!activityFilter ||
            prettyGeo(g.metadata?.classification?.activity_category) === activityFilter) &&
          (!seasonFilter ||
            (g.metadata?.timing?.best_seasons || [])
              .map((s) => String(s).toLowerCase())
              .includes(seasonFilter)),
      ),
    [guides, search, countryFilter, lengthFilter, activityFilter, seasonFilter],
  );

  const selectClass =
    "h-9 min-w-0 flex-1 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:max-w-40";

  const dropdowns = [
    { label: tl.filterCountry, value: countryFilter, set: setCountryFilter, options: countries },
    { label: tl.filterLength, value: lengthFilter, set: setLengthFilter, options: lengths },
    { label: tl.filterActivity, value: activityFilter, set: setActivityFilter, options: activities },
    {
      label: tl.filterSeason,
      value: seasonFilter,
      set: setSeasonFilter,
      options: seasons,
      display: (v) => prettyGeo(v),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="mx-auto w-full max-w-2xl">
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
          they cover. */}
      <div className="grid gap-8 sm:grid-cols-3">
        {(tl.trust || []).map((item, i) => (
          <div key={item.title} className="space-y-2">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-7 w-7 text-brand-terracotta"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {TRUST_ICONS[i]}
            </svg>
            <h3 className="font-serif text-xl font-normal text-brand-ink">{item.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-normal">{tl.browseHeading}</h2>
        <div className="flex w-full flex-wrap items-center gap-2">
          {dropdowns.map((d) =>
            d.options.length ? (
              <select
                key={d.label}
                value={d.value}
                onChange={(e) => d.set(e.target.value)}
                className={selectClass}
                aria-label={d.label}
              >
                <option value="">{`${d.label}: ${tl.filterAll}`}</option>
                {d.options.map((v) => (
                  <option key={v} value={v}>
                    {d.display ? d.display(v) : v}
                  </option>
                ))}
              </select>
            ) : null,
          )}
          <p className="ml-auto shrink-0 text-xs font-medium tabular-nums text-slate-500">
            {filtered.length} {filtered.length === 1 ? tl.guide : tl.guides}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((g) => (
            <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t.inspireList.noMatchTitle}</p>
        ) : null}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GuideListCard from "./GuideListCard";
import { prettyGeo, continentSlug } from "../../_lib/continents";
import {
  buildGuideFilterOptions,
  matchesGuideFilters,
  matchesGuideSearch,
} from "../../_lib/guideFilters";

// Line icons for the trust trio, drawn light on the Taupe band:
// mountain / PDF document ("Made for the road") / pin.
const TRUST_ICONS = [
  <path key="mountain" d="M3 20 L10 6 L14 13 L17 9 L21 20 Z M8.5 9 L10 11 L11.5 9" />,
  <path key="document" d="M6 2 H14 L19 7 V22 H6 Z M14 2 V7 H19 M9.5 12.5 H15.5 M9.5 16.5 H13.5" />,
  <path key="pin" d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" />,
];

// The continent tabs group the two American continents into one "Americas"
// tab (founder mockup 2026-08-08); everything else keeps its own slug.
const AMERICAS = new Set(["north-america", "south-america", "central-america", "americas"]);
const TAB_ORDER = ["europe", "asia", "africa", "americas", "oceania"];

function continentBucket(guide) {
  const slug = continentSlug(guide.metadata?.geography?.continent);
  if (!slug) return "";
  return AMERICAS.has(slug) ? "americas" : slug;
}

function bucketLabel(bucket) {
  return bucket === "americas" ? "Americas" : prettyGeo(bucket);
}

export default function GuidesBrowse({
  guides,
  t,
  tl,
  lang = "en",
  initialSearch = "",
  interlude = null,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [continent, setContinent] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    length: "",
    activity: "",
    season: "",
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const panelRef = useRef(null);
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  // The country panel closes on outside click or Escape, like a native
  // dropdown would.
  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  // Only continents that actually have guides get a tab.
  const tabs = useMemo(() => {
    const present = new Set(guides.map(continentBucket).filter(Boolean));
    return TAB_ORDER.filter((b) => present.has(b));
  }, [guides]);

  // Country counts scoped to the active tab — the panel's "most guides"
  // chips and A–Z list both read from this.
  const countryCounts = useMemo(() => {
    const counts = new Map();
    for (const g of guides) {
      if (continent && continentBucket(g) !== continent) continue;
      const country = prettyGeo(g.metadata?.geography?.country);
      if (!country) continue;
      counts.set(country, (counts.get(country) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [guides, continent]);

  const topCountries = useMemo(
    () => [...countryCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4),
    [countryCounts],
  );

  const listedCountries = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    if (!needle) return countryCounts;
    return countryCounts.filter(([country]) => country.toLowerCase().includes(needle));
  }, [countryCounts, countryQuery]);

  const options = useMemo(() => buildGuideFilterOptions(guides), [guides]);
  const filtered = useMemo(
    () =>
      guides.filter(
        (g) =>
          matchesGuideSearch(g, search) &&
          (!continent || continentBucket(g) === continent) &&
          matchesGuideFilters(g, filters),
      ),
    [guides, search, continent, filters],
  );

  const selectTab = (bucket) => {
    setContinent(bucket);
    setFilters((f) => ({ ...f, country: "" }));
    setPanelOpen(false);
    setCountryQuery("");
  };
  const pickCountry = (country) => {
    setFilters((f) => ({ ...f, country: f.country === country ? "" : country }));
    setPanelOpen(false);
  };

  const scopeLabel = continent
    ? tl.allOfContinent.replace("{name}", bucketLabel(continent))
    : tl.allCountries;
  const countryPillLabel = filters.country || (continent ? scopeLabel : tl.filterAll);

  const chips = [
    filters.country ? { key: "country", label: filters.country } : null,
    filters.length ? { key: "length", label: prettyGeo(filters.length) } : null,
    filters.activity ? { key: "activity", label: filters.activity } : null,
    filters.season ? { key: "season", label: prettyGeo(filters.season) } : null,
  ].filter(Boolean);

  // Same responsive treatment as GuideFilterRow: on phones the pill and
  // selects wrap two per row at a readable size (one row of five shrank
  // them to unreadable slivers); from `sm` up they sit in one row,
  // equal-width, capped at 160px.
  const selectClass =
    "h-10 min-w-[calc(50%-0.25rem)] flex-1 cursor-pointer truncate rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:h-9 sm:min-w-0 sm:max-w-40 sm:text-xs";
  const dropdowns = [
    { key: "length", label: tl.filterLength, values: options.lengths, display: prettyGeo },
    { key: "activity", label: tl.filterActivity, values: options.activities },
    { key: "season", label: tl.filterSeason, values: options.seasons, display: prettyGeo },
  ];

  const cardGrid = (cards) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((g) => (
        <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
      ))}
    </div>
  );
  const firstRow = filtered.slice(0, 4);
  const secondRow = filtered.slice(4, 8);
  const rest = filtered.slice(8);

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

      <section className="space-y-6">
        {/* Continent tabs (founder mockup 2026-08-08): All + one tab per
            continent that has guides, active tab underlined in Brandy. */}
        <div className="border-b border-brand-line">
          <div className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => selectTab("")}
              className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-base font-bold transition-colors ${
                continent === ""
                  ? "border-brand-terracotta text-brand-ink"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tl.filterAll}
            </button>
            {tabs.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => selectTab(b)}
                className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-base font-bold transition-colors ${
                  continent === b
                    ? "border-brand-terracotta text-brand-ink"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {bucketLabel(b)}
              </button>
            ))}
          </div>
        </div>

        {/* Pill row: the Country pill opens the panel below; Length,
            Activity and Season stay plain selects; active filters trail as
            dismissable chips. */}
        <div ref={panelRef} className="relative">
          <div className="flex w-full flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              aria-expanded={panelOpen}
              className={`flex h-10 min-w-[calc(50%-0.25rem)] shrink-0 items-center justify-between gap-2 rounded-full px-4 text-sm font-semibold transition sm:h-9 sm:min-w-0 sm:justify-start sm:text-xs ${
                panelOpen || filters.country
                  ? "bg-brand-ink text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {tl.filterCountry}: {countryPillLabel}
              <svg
                viewBox="0 0 12 8"
                aria-hidden="true"
                className={`h-2 w-3 transition-transform ${panelOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 1.5 L6 6.5 L11 1.5" />
              </svg>
            </button>
            {dropdowns.map((d) =>
              d.values.length ? (
                <select
                  key={d.key}
                  value={filters[d.key]}
                  onChange={(e) => setFilter(d.key, e.target.value)}
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
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key, "")}
                className="flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-ink/5 sm:h-9 sm:text-xs"
              >
                {chip.label}
                <span aria-hidden="true" className="text-brand-terracotta">
                  ✕
                </span>
                <span className="sr-only">Clear {chip.key} filter</span>
              </button>
            ))}
            <p className="ml-auto shrink-0 text-xs font-medium tabular-nums text-slate-500">
              {filtered.length} {filtered.length === 1 ? tl.guide : tl.guides}
            </p>
          </div>

          {/* The panel is half the page wide from md up (founder
              2026-08-08), anchored to the pill; full width only on phones. */}
          {panelOpen ? (
            <div className="absolute left-0 top-full z-20 mt-3 w-full rounded-3xl bg-white p-5 shadow-card-hover ring-1 ring-brand-line md:w-1/2 md:p-8">
              <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 ring-1 ring-brand-line">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5 L21 21" />
                </svg>
                <input
                  type="search"
                  value={countryQuery}
                  onChange={(e) => setCountryQuery(e.target.value)}
                  placeholder={tl.typeCountry}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-brand-ink outline-none placeholder:text-slate-400"
                />
              </div>

              {topCountries.length ? (
                <>
                  <p className="mt-6 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    {tl.mostGuides}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topCountries.map(([country, count]) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => pickCountry(country)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          filters.country === country
                            ? "bg-brand-terracotta-soft text-brand-terracotta"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {country} · {count}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              <p className="mt-6 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                {scopeLabel} · {countryCounts.length} {tl.countriesWord}
              </p>
              <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {listedCountries.map(([country, count]) => (
                  <li key={country}>
                    <button
                      type="button"
                      onClick={() => pickCountry(country)}
                      className={`flex items-baseline gap-2 text-[15px] transition hover:text-brand-terracotta ${
                        filters.country === country
                          ? "font-semibold text-brand-terracotta"
                          : "text-slate-800"
                      }`}
                    >
                      {country} <span className="text-sm text-slate-400">{count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {cardGrid(firstRow)}

        {/* Trust trio (founder 2026-08-08): after the first row of guides,
            full page width on Taupe Grey #5F524D — same breakout as the
            How-I-test band further down. */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-taupe py-10 md:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3">
            {(tl.trust || []).map((item, i) => (
              <div key={item.title} className="space-y-2 text-center">
                <h3 className="flex items-center justify-center gap-2.5 font-serif text-xl font-normal text-white">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-brand-cream/90"
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
                <p className="font-sans text-sm leading-relaxed text-white/75">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {secondRow.length ? cardGrid(secondRow) : null}
        {interlude}
        {rest.length ? cardGrid(rest) : null}

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{t.inspireList.noMatchTitle}</p>
        ) : null}
      </section>
    </div>
  );
}

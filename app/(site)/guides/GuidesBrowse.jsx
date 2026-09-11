"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GuideListCard from "./GuideListCard";
import {
  prettyGeo,
  continentBucket as bucketOf,
  continentTabLabel as bucketLabel,
  CONTINENT_TAB_ORDER as TAB_ORDER,
} from "../../_lib/continents";
import {
  buildGuideFilterOptions,
  cardActivity,
  cardCountry,
  cardSeasons,
  matchesGuideFilters,
  matchesGuideSearch,
} from "../../_lib/guideFilters";
import {
  ArrowIcon,
  BLOCK_CLASS,
  CAPSULE_CLASS,
  ContinentRail,
  ContinentTabs,
  EYEBROW_CLASS,
  fill,
  FilterChip,
  FilterPill,
  MagnifierIcon,
  PANEL_CLASS,
  PanelFooter,
  SEARCH_BUTTON_CLASS,
  SEARCH_INPUT_CLASS,
  TickList,
} from "../../_components/FilterUi";

// Line icons for the trust trio, drawn light on the Taupe band:
// mountain / PDF document ("Made for the road") / pin.
const TRUST_ICONS = [
  <path key="mountain" d="M3 20 L10 6 L14 13 L17 9 L21 20 Z M8.5 9 L10 11 L11.5 9" />,
  <path key="document" d="M6 2 H14 L19 7 V22 H6 Z M14 2 V7 H19 M9.5 12.5 H15.5 M9.5 16.5 H13.5" />,
  <path key="pin" d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" />,
];

// Tab order, the Americas grouping and the labels are shared with the Inspire
// browse page — see app/_lib/continents.js.
function continentBucket(guide) {
  return bucketOf(guide.metadata?.geography?.continent);
}

// The filter block, the Inspire treatment (founder 2026-09-04: "do the same
// now on Guides page. I want searches to have the same look and feel"): one
// rounded block holds the search capsule, the continent tabs with counts, a
// control row of four pills and a status row of dismissable chips. Every
// pill opens a panel of the same multi-column tickbox list — Country keeps
// the continent rail, since continent is the one dimension that scopes it.
//
// The four filters became multi-select with the tickboxes: a checkbox that
// silently unticks its neighbour would be lying about what it does, and
// "Iceland or Norway" is how a trip actually gets planned.
//
// Counts: the tab row is unscoped (whole library — it is navigation, not a
// result preview), while every count inside a panel respects the OTHER
// active filters, so a number always means "guides you would get by ticking
// this". Only the status line and the panels' Show button follow the live
// result set.
export default function GuidesBrowse({
  guides,
  t,
  tl,
  lang = "en",
  initialSearch = "",
  interlude = null,
}) {
  const ti = t.inspireList;
  const [search, setSearch] = useState(initialSearch);
  const [continent, setContinent] = useState("");
  const [filters, setFilters] = useState({
    country: [],
    length: [],
    activity: [],
    season: [],
  });
  // One panel at a time, keyed by filter name; "" is all closed.
  const [openPanel, setOpenPanel] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const panelRef = useRef(null);

  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  const clearFilter = (key) => setFilters((f) => ({ ...f, [key]: [] }));

  // Panels close on outside click or Escape, like a native dropdown would.
  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpenPanel("");
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenPanel("");
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openPanel]);

  // Only continents that actually have guides get a tab.
  const continentCounts = useMemo(() => {
    const counts = new Map();
    for (const g of guides) {
      const bucket = continentBucket(g);
      if (bucket) counts.set(bucket, (counts.get(bucket) || 0) + 1);
    }
    return counts;
  }, [guides]);
  const continentRows = [
    { key: "", label: tl.filterAll, count: guides.length },
    ...TAB_ORDER.filter((b) => continentCounts.has(b)).map((b) => ({
      key: b,
      label: bucketLabel(b),
      count: continentCounts.get(b) || 0,
    })),
  ];

  // Everything except one facet, so that facet's own counts do not collapse
  // to what it has already selected.
  const matchesExcept = (guide, skip) =>
    matchesGuideSearch(guide, search) &&
    (!continent || continentBucket(guide) === continent) &&
    matchesGuideFilters(guide, skip ? { ...filters, [skip]: [] } : filters);

  const facetCounts = useMemo(() => {
    const count = (skip, valuesOf) => {
      const counts = new Map();
      for (const g of guides) {
        if (!matchesExcept(g, skip)) continue;
        for (const v of new Set(valuesOf(g).filter(Boolean))) {
          counts.set(v, (counts.get(v) || 0) + 1);
        }
      }
      return counts;
    };
    return {
      country: count("country", (g) => [cardCountry(g)]),
      length: count("length", (g) => [g.category]),
      activity: count("activity", (g) => [cardActivity(g)]),
      season: count("season", cardSeasons),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guides, search, continent, filters]);

  // The country list is the active continent's countries, most guides
  // first; a country the other filters have emptied drops out unless it is
  // one of the picked ones, which must stay tickable to be unticked.
  const countryRows = useMemo(() => {
    const names = new Set();
    for (const g of guides) {
      if (continent && continentBucket(g) !== continent) continue;
      const name = cardCountry(g);
      if (name) names.add(name);
    }
    return [...names]
      .map((name) => ({ key: name, label: name, count: facetCounts.country.get(name) || 0 }))
      .filter((row) => row.count > 0 || filters.country.includes(row.key))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [guides, continent, facetCounts, filters.country]);
  const listedCountries = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    if (!needle) return countryRows;
    return countryRows.filter((row) => row.label.toLowerCase().includes(needle));
  }, [countryRows, countryQuery]);

  // Length and Season keep the trip/calendar order buildGuideFilterOptions
  // gives them; Activity is alphabetical there.
  const options = useMemo(() => buildGuideFilterOptions(guides), [guides]);
  const facetRows = (key, values, display) =>
    values
      .map((value) => ({
        key: value,
        label: display ? display(value) : value,
        count: facetCounts[key].get(value) || 0,
      }))
      .filter((row) => row.count > 0 || filters[key].includes(row.key));

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

  // Switching continent drops any picked country that is not in it: a
  // hidden Iceland filter under the Africa tab would empty the grid with no
  // visible reason.
  const selectContinent = (bucket) => {
    setContinent(bucket);
    setCountryQuery("");
    if (bucket) {
      const inBucket = new Set(
        guides.filter((g) => continentBucket(g) === bucket).map(cardCountry).filter(Boolean),
      );
      setFilters((f) => ({ ...f, country: f.country.filter((name) => inBucket.has(name)) }));
    }
  };
  const clearAll = () => {
    setSearch("");
    setContinent("");
    setFilters({ country: [], length: [], activity: [], season: [] });
    setCountryQuery("");
    setOpenPanel("");
  };

  const openOnly = (key) => setOpenPanel((open) => (open === key ? "" : key));
  const pillValue = (key, display) => {
    const list = filters[key];
    if (!list.length) return tl.filterAll;
    if (list.length === 1) return display ? display(list[0]) : list[0];
    return fill(tl.selectedCount, { n: list.length });
  };

  // A facet earns a pill when the library has values for it at all — not
  // when the current filters leave it any. Dropping the pill as its last
  // row disappears would shuffle the row under the cursor and leave the
  // visitor hunting for a control that was there a click ago; the empty
  // panel says so instead.
  const facets = [
    {
      key: "length",
      label: tl.filterLength,
      values: options.lengths,
      rows: facetRows("length", options.lengths, prettyGeo),
      display: prettyGeo,
    },
    {
      key: "activity",
      label: tl.filterActivity,
      values: options.activities,
      rows: facetRows("activity", options.activities),
    },
    {
      key: "season",
      label: tl.filterSeason,
      values: options.seasons,
      rows: facetRows("season", options.seasons, prettyGeo),
      display: prettyGeo,
    },
  ].filter((f) => f.values.length);

  const chips = [
    continent
      ? { key: "continent", label: bucketLabel(continent), clear: () => selectContinent("") }
      : null,
    ...["country", "length", "activity", "season"].flatMap((key) =>
      filters[key].map((value) => ({
        key: `${key}:${value}`,
        label: key === "country" || key === "activity" ? value : prettyGeo(value),
        clear: () => toggle(key, value),
      })),
    ),
  ].filter(Boolean);
  const hasFilters = !!(search.trim() || continent || chips.length);

  const scopeLabel = continent ? bucketLabel(continent) : ti.allContinents;
  const showLabel =
    filtered.length === 1
      ? tl.showGuide
      : fill(tl.showGuides, { n: filtered.length });

  const cardGrid = (cards) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((g) => (
        <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
      ))}
    </div>
  );
  // Two rows of cards between each band (founder 2026-08-17) — the grid is
  // four-up from `lg`, so a block is eight guides. Narrower viewports show
  // the same eight over more rows; the bands stay where they are.
  const firstBlock = filtered.slice(0, 8);
  const secondBlock = filtered.slice(8, 16);
  const rest = filtered.slice(16);

  return (
    <div className="space-y-10">
      <div className={BLOCK_CLASS}>
        <label htmlFor="guides-search" className="sr-only">
          {tl.searchPlaceholder}
        </label>
        <div className={CAPSULE_CLASS}>
          <input
            id="guides-search"
            type="search"
            autoComplete="off"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenPanel("");
            }}
            placeholder={tl.searchPlaceholder}
            className={SEARCH_INPUT_CLASS}
          />
          {/* Search is live as you type; the button is the visible "go"
              that phones expect and just closes the keyboard. */}
          <button
            type="button"
            onClick={() => document.getElementById("guides-search")?.blur()}
            aria-label={ti.searchButton}
            className={SEARCH_BUTTON_CLASS}
          >
            <ArrowIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">{ti.searchButton}</span>
          </button>
        </div>

        <div className="mt-4">
          <ContinentTabs rows={continentRows} active={continent} onPick={selectContinent} />
        </div>

        {/* Control row: one pill per filter, each opening its panel below.
            Two per row at thumb size on phones, one compact row from sm. */}
        <div ref={panelRef} className="relative mt-4">
          <div className="flex w-full flex-wrap items-center gap-2">
            <FilterPill
              label={tl.filterCountry}
              value={pillValue("country")}
              open={openPanel === "country"}
              active={filters.country.length > 0}
              onClick={() => openOnly("country")}
            />
            {facets.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                value={pillValue(f.key, f.display)}
                open={openPanel === f.key}
                active={filters[f.key].length > 0}
                onClick={() => openOnly(f.key)}
              />
            ))}
          </div>

          {/* Country panel: continent rail (the same state as the tab row
              above) from md up, the searchable tickbox list always. */}
          {openPanel === "country" ? (
            <div role="dialog" aria-label={tl.filterCountry} className={PANEL_CLASS}>
              <div className="flex">
                <ContinentRail rows={continentRows} active={continent} onPick={selectContinent} />
                <div className="min-w-0 flex-1 p-4 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className={EYEBROW_CLASS}>
                      {scopeLabel} · {countryRows.length} {tl.countriesWord}
                    </p>
                    <div className="flex w-full items-center gap-2 rounded-full bg-slate-50 px-4 ring-1 ring-brand-line sm:w-56">
                      <MagnifierIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <input
                        type="search"
                        value={countryQuery}
                        onChange={(e) => setCountryQuery(e.target.value)}
                        placeholder={tl.typeCountry}
                        aria-label={tl.typeCountry}
                        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-brand-ink outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <TickList
                    rows={listedCountries}
                    isChecked={(key) => filters.country.includes(key)}
                    onToggle={(key) => toggle("country", key)}
                    emptyLabel={ti.noCountryMatch}
                    className="mt-4"
                  />
                  <PanelFooter
                    clearLabel={ti.clearSelection}
                    onClear={() => clearFilter("country")}
                    showLabel={showLabel}
                    onClose={() => setOpenPanel("")}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Length, Activity and Season: the same panel without the rail —
              they have no second dimension to scope by, so the list takes
              the whole width. */}
          {facets.map((f) =>
            openPanel === f.key ? (
              <div
                key={f.key}
                role="dialog"
                aria-label={f.label}
                className={`${PANEL_CLASS} p-4 md:p-6`}
              >
                {/* The facet's own name rather than a row count: these
                    lists are short enough to take in at a glance, and a
                    count here would need a plural form per language to
                    avoid "1 options". */}
                <p className={EYEBROW_CLASS}>
                  {scopeLabel} · {f.label}
                </p>
                <TickList
                  rows={f.rows}
                  isChecked={(key) => filters[f.key].includes(key)}
                  onToggle={(key) => toggle(f.key, key)}
                  emptyLabel={tl.noOptions}
                  className="mt-4"
                />
                <PanelFooter
                  clearLabel={ti.clearSelection}
                  onClear={() => clearFilter(f.key)}
                  showLabel={showLabel}
                  onClose={() => setOpenPanel("")}
                />
              </div>
            ) : null,
          )}
        </div>

        {/* Status row: live count, one chip per active filter, Clear all. */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4">
          <p className="mr-1 text-sm tabular-nums text-slate-600">
            {fill(tl.showing, { shown: filtered.length, total: guides.length })}
          </p>
          {chips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onClear={chip.clear} />
          ))}
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-sm font-medium text-brand-terracotta underline underline-offset-4 transition hover:text-brand-ink"
            >
              {ti.clearAll}
            </button>
          ) : null}
        </div>
      </div>

      <section className="space-y-10">
        {cardGrid(firstBlock)}

        {/* Trust trio (founder 2026-08-08): after the first two rows of guides,
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

        {secondBlock.length ? cardGrid(secondBlock) : null}
        {interlude}
        {rest.length ? cardGrid(rest) : null}

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{ti.noMatchTitle}</p>
        ) : null}
      </section>
    </div>
  );
}

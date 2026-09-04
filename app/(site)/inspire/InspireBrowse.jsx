"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CardMediaCarousel, { buildMediaSlides } from "../../_components/CardMediaCarousel";
import { getDict } from "../../_lib/i18n";
import {
  CONTINENT_TAB_ORDER as TAB_ORDER,
  continentTabLabel as bucketLabel,
} from "../../_lib/continents";
import { INSPIRE_JOURNEYS, journeyMatches } from "../../_lib/inspireJourneys";

function cardHaystack(card) {
  return [
    card.title,
    card.geoLabel,
    card.country,
    card.categoryLabel,
    card.categoryDurationLine,
    ...(Array.isArray(card.styles) ? card.styles : []),
    card.excerpt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSearch(card, query) {
  const needle = (query || "").toLowerCase().trim();
  if (!needle) return true;
  return cardHaystack(card).includes(needle);
}

function sortRecentFirst(cards) {
  return [...cards].sort((a, b) => (b.dateMillis || 0) - (a.dateMillis || 0));
}

// "{n} countries" → "3 countries". The dictionaries carry the templates so
// each language can put the number where its grammar wants it.
function fill(template, vars) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

// Style pills match on a normalised key: "Hiking" as the activity category
// and "hiking" as a free-text tag are the same style.
const styleKey = (name) => String(name || "").trim().toLowerCase();

// Pill rows (founder 2026-09-04): activities — what you do — on the first
// line; everything else (themes and projects: Africa Rally, Seven Summits,
// Culture & People…) on the second. A new activity category lands on the
// second line until it is added here. Keys are the lower-cased Sanity
// names, including the older duplicates still in the category list.
const ACTIVITY_STYLES = new Set([
  "roadtrip",
  "road trips",
  "hiking",
  "outdoor hiking",
  "mountaineering",
  "mountain climbing",
  "diving",
  "bungee",
  "kayaking",
  "adrenaline",
]);

function StoryCard({ card, t }) {
  const photos =
    Array.isArray(card.photos) && card.photos.length
      ? card.photos
      : card.heroPhoto
        ? [card.heroPhoto]
        : [];
  const slides = buildMediaSlides({
    photos,
    videoUrl: card.videoUrl,
    videoSlot: card.videoSlot,
    videos: card.videos,
  });
  const inner = (
    <>
      {/* Square on phones so the photo, title, excerpt and Read story button
          fit one screen above the tab bar; 3:4 from sm up, where the grid
          columns keep cards short anyway. Matches the guide cards. */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[3/4]">
        {/* videoHoverOnly: on desktop the card clips sit frozen and play
            on hover; touch devices keep autoplay (founder 2026-08-08). */}
        {slides.length ? (
          <CardMediaCarousel
            slides={slides}
            alt={card.heroAlt || card.title}
            imgClassName="object-center transition duration-500 ease-out group-hover:scale-[1.03]"
            videoHoverOnly
          />
        ) : (
          <div className="flex h-full min-h-[9.5rem] w-full items-center justify-center bg-slate-100 text-[11px] font-medium text-slate-400">
            No photo
          </div>
        )}
      </div>
      {/* Fixed-height text zones so rows line up across the grid — from sm up
          only, since phones show one card per row with nothing to line up
          against and the reserved space costs a two-line title its room. */}
      <div className="flex flex-1 flex-col gap-2.5 p-5 sm:gap-3">
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          {card.geoLabel || " "}
        </p>
        <div className="flex flex-nowrap items-start justify-between gap-2 sm:min-h-[3.5rem]">
          <p className="line-clamp-2 min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight text-slate-900">
            {card.title}
          </p>
          {card.hasGuide ? (
            <span className="shrink-0 rounded-full bg-brand-terracotta-soft px-3 py-1.5 text-xs font-semibold text-slate-900">
              {t.guideBadge}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:min-h-[2.5rem]">
          {card.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-end pt-1">
          {card.href ? (
            <span className="shrink-0 rounded-full bg-brand-terracotta px-4 py-2 text-xs font-normal tracking-[0.05em] text-white transition group-hover:bg-brand-terracotta/90">
              {t.readStory}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  const shellInteractive =
    "group flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300/90";
  const shellStatic =
    "flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white opacity-[0.96] shadow-sm ring-1 ring-slate-200/90 cursor-default";

  if (card.href) {
    return (
      <Link href={card.href} className={shellInteractive}>
        {inner}
      </Link>
    );
  }
  return <div className={shellStatic}>{inner}</div>;
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className={`h-2 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1.5 L6 6.5 L11 1.5" />
    </svg>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12 H19 M13 6 L19 12 L13 18" />
    </svg>
  );
}

function MagnifierIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" />
    </svg>
  );
}

// Filter block redesign (founder mockup 2026-09-03): one rounded panel
// holds the search bar, the continent tabs with counts, a control row that
// mirrors /guides (founder 2026-09-04: "similar looks and feel as the
// Guides page" — a Country pill that opens the panel plus an Activity
// dropdown, replacing the style-pill rows and the phone bottom sheet), and
// a status row of dismissable chips. The Country panel stays a
// multi-select — several countries at once is the normal way to plan a
// region trip — scoped by the continent picked in its sidebar, which is
// the same state as the tab row above.
//
// Every count on a tab, pill or country line is unscoped (the whole
// library), so the numbers stay put while the visitor narrows down; only
// the "Showing X of Y" line and the panel's Show button follow the live
// result set.
export default function InspireBrowse({
  cards,
  lang = "en",
  initialSearch = "",
  initialContinent = "",
}) {
  const [search, setSearch] = useState(initialSearch);
  const [continent, setContinent] = useState(initialContinent);
  const [countries, setCountries] = useState([]);
  // Several styles at once, OR-ed ("road trips or hikes"): the mobile mockup
  // (founder 2026-09-04) has two pills lit and both chips in the status row.
  const [styleKeys, setStyleKeys] = useState([]);
  const [journey, setJourney] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const panelRef = useRef(null);
  const blockRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const dict = getDict(lang);
  const t = dict.inspireList;
  const tl = dict.guideList;

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

  // Same for the typeahead list under the search input.
  useEffect(() => {
    if (!suggestOpen) return;
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [suggestOpen]);

  const total = cards.length;

  const continentCounts = useMemo(() => {
    const counts = new Map();
    for (const c of cards) {
      if (!c.continentSlug) continue;
      counts.set(c.continentSlug, (counts.get(c.continentSlug) || 0) + 1);
    }
    return counts;
  }, [cards]);

  // Only continents that actually have stories get a tab; the order is the
  // one /guides uses, so a story and its guide sit under the same tab.
  const tabs = useMemo(() => TAB_ORDER.filter((b) => continentCounts.has(b)), [continentCounts]);

  // Style pills: one per activity category in the library, labelled with
  // the category's Sanity name. A story counts under a pill when that is
  // its activity category or one of its tags names it, so the counts can
  // add up to more than the library — a story can be both a road trip and
  // a hike.
  const styles = useMemo(() => {
    const labels = new Map();
    for (const c of cards) {
      if (c.styleLabel) labels.set(styleKey(c.styleLabel), c.styleLabel);
    }
    const counts = new Map();
    for (const c of cards) {
      for (const key of new Set((c.styles || []).map(styleKey))) {
        if (labels.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return [...labels.entries()]
      .map(([key, label]) => ({ key, label, count: counts.get(key) || 0 }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [cards]);

  // Country → story count and the continent bucket(s) it appears under.
  const countryIndex = useMemo(() => {
    const index = new Map();
    for (const c of cards) {
      if (!c.country) continue;
      const entry = index.get(c.country) || { count: 0, continents: new Set() };
      entry.count += 1;
      if (c.continentSlug) entry.continents.add(c.continentSlug);
      index.set(c.country, entry);
    }
    return index;
  }, [cards]);

  // The panel lists the countries of the active continent, most stories
  // first (the mockup's order), filtered by the panel's own search box.
  const scopedCountries = useMemo(
    () =>
      [...countryIndex.entries()]
        .filter(([, entry]) => !continent || entry.continents.has(continent))
        .map(([name, entry]) => [name, entry.count])
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    [countryIndex, continent],
  );
  const listedCountries = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    if (!needle) return scopedCountries;
    return scopedCountries.filter(([name]) => name.toLowerCase().includes(needle));
  }, [scopedCountries, countryQuery]);

  // Journey band: story count per journey (unscoped like every other count
  // on the page) and the newest matching story's hero, the card photo for a
  // journey that has no image of its own.
  const journeyInfo = useMemo(() => {
    const info = new Map();
    const recent = sortRecentFirst(cards);
    for (const j of INSPIRE_JOURNEYS) {
      const matched = recent.filter((c) => journeyMatches(j, c));
      info.set(j.key, {
        count: matched.length,
        fallbackPhoto: matched.find((c) => c.heroPhoto)?.heroPhoto || null,
      });
    }
    return info;
  }, [cards]);
  const journeyCounts = useMemo(
    () => new Map([...journeyInfo].map(([key, v]) => [key, v.count])),
    [journeyInfo],
  );

  const filtered = useMemo(() => {
    const activeJourney = INSPIRE_JOURNEYS.find((j) => j.key === journey) || null;
    const matched = cards.filter(
      (c) =>
        matchesSearch(c, search) &&
        (!continent || c.continentSlug === continent) &&
        (!countries.length || countries.includes(c.country)) &&
        (!styleKeys.length || (c.styles || []).some((s) => styleKeys.includes(styleKey(s)))) &&
        (!activeJourney || journeyMatches(activeJourney, c)),
    );
    return sortRecentFirst(matched);
  }, [cards, search, continent, countries, styleKeys, journey]);

  // Switching continent drops any picked country that is not in it: a
  // hidden Switzerland filter under the Africa tab would empty the grid
  // with no visible reason.
  const selectContinent = (bucket) => {
    setContinent(bucket);
    setCountryQuery("");
    if (bucket) {
      setCountries((list) =>
        list.filter((name) => countryIndex.get(name)?.continents.has(bucket)),
      );
    }
  };
  const toggleCountry = (name) =>
    setCountries((list) =>
      list.includes(name) ? list.filter((n) => n !== name) : [...list, name],
    );
  const toggleStyle = (key) =>
    setStyleKeys((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));
  // A journey card sits below the first two rows of stories, so applying
  // one scrolls back up to the filter block where its chip and the
  // narrowed grid are.
  const pickJourney = (key) => {
    setJourney((j) => (j === key ? "" : key));
    blockRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const clearAll = () => {
    setSearch("");
    setContinent("");
    setCountries([]);
    setStyleKeys([]);
    setJourney("");
    setCountryQuery("");
  };

  const journeyCopy = (i) => (Array.isArray(t.journeys) ? t.journeys[i] : null) || {};
  const journeyLabelOf = (key) =>
    journeyCopy(INSPIRE_JOURNEYS.findIndex((j) => j.key === key)).title || key;

  const hasFilters = !!(
    search.trim() ||
    continent ||
    countries.length ||
    styleKeys.length ||
    journey
  );
  const countryPillLabel =
    countries.length === 0
      ? tl.filterAll
      : countries.length === 1
        ? countries[0]
        : fill(t.countriesSelected, { n: countries.length });
  const styleLabelOf = (key) => styles.find((s) => s.key === key)?.label || key;
  const chips = [
    continent
      ? { key: "continent", label: bucketLabel(continent), clear: () => selectContinent("") }
      : null,
    ...countries.map((name) => ({
      key: `country:${name}`,
      label: name,
      clear: () => toggleCountry(name),
    })),
    ...styleKeys.map((key) => ({
      key: `style:${key}`,
      label: styleLabelOf(key),
      clear: () => toggleStyle(key),
    })),
    journey
      ? { key: "journey", label: journeyLabelOf(journey), clear: () => setJourney("") }
      : null,
  ].filter(Boolean);
  const scopeLabel = continent ? bucketLabel(continent) : t.allContinents;
  const showLabel =
    filtered.length === 1 ? t.showStory : fill(t.showStories, { n: filtered.length });

  const tabClass = (active) =>
    `-mb-px flex shrink-0 items-baseline gap-1.5 border-b-2 pb-3 font-sans text-base font-bold transition-colors ${
      active
        ? "border-brand-terracotta text-brand-ink"
        : "border-transparent text-slate-500 hover:text-slate-700"
    }`;
  const tabCountClass = (active) =>
    `text-xs font-medium tabular-nums ${active ? "text-slate-500" : "text-slate-400"}`;
  const sideClass = (active) =>
    `flex shrink-0 items-center justify-between gap-4 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
      active ? "bg-brand-ink text-white" : "text-slate-600 hover:bg-slate-100"
    }`;
  const sideCountClass = (active) =>
    `text-xs font-medium tabular-nums ${active ? "text-white/70" : "text-slate-400"}`;

  // Activity is a single-pick dropdown in the /guides style (founder
  // 2026-09-04). It writes into the same styleKeys state the pills used, so
  // chips, counts and the filter logic are untouched; activities list before
  // trip types, both alphabetical inside their group (ACTIVITY_STYLES).
  const orderedStyles = [
    ...styles.filter((s) => ACTIVITY_STYLES.has(s.key)),
    ...styles.filter((s) => !ACTIVITY_STYLES.has(s.key)),
  ];
  const activityValue = styleKeys[0] || "";
  const pickActivity = (key) => setStyleKeys(key ? [key] : []);
  // The /guides control sizing: two per row at thumb size on phones, one
  // compact row from sm up.
  const controlClass =
    "h-11 min-w-[calc(50%-0.25rem)] flex-1 rounded-full border text-sm font-semibold transition sm:h-9 sm:min-w-0 sm:max-w-44 sm:text-xs";

  // Country picker pieces shared by the desktop panel and the phone sheet.
  const findBox = (className = "") => (
    <div
      className={`flex items-center gap-2 rounded-full bg-slate-50 px-4 ring-1 ring-brand-line ${className}`}
    >
      <MagnifierIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <input
        type="search"
        value={countryQuery}
        onChange={(e) => setCountryQuery(e.target.value)}
        placeholder={t.findCountry}
        aria-label={t.findCountry}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-brand-ink outline-none placeholder:text-slate-400"
      />
    </div>
  );
  const countryList = (listClass) =>
    listedCountries.length ? (
      <ul className={`grid gap-x-3 gap-y-0.5 overflow-y-auto sm:gap-x-6 ${listClass}`}>
        {listedCountries.map(([name, count]) => {
          const checked = countries.includes(name);
          return (
            <li key={name}>
              {/* Two columns on a 375px phone leave ~100px for the name, so
                  names wrap there instead of truncating (Equatorial Guinea). */}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl px-1 py-2 transition hover:bg-slate-50 sm:gap-3 sm:px-2">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleCountry(name)}
                />
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 transition ${
                    checked ? "bg-brand-ink text-white ring-brand-ink" : "bg-white ring-slate-300"
                  }`}
                >
                  {checked ? (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 6.5 L5 9 L9.5 3.5" />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={`min-w-0 flex-1 text-sm leading-tight sm:truncate sm:text-[15px] ${
                    checked ? "font-bold text-brand-ink" : "text-slate-800"
                  }`}
                >
                  {name}
                </span>
                <span className="text-xs tabular-nums text-slate-400">{count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="mt-6 text-sm text-slate-500">{t.noCountryMatch}</p>
    );
  const panelFooter = (
    <div className="mt-4 flex items-center justify-between gap-4 border-t border-brand-line pt-4">
      <button
        type="button"
        onClick={() => setCountries([])}
        className="text-sm font-medium text-slate-500 underline underline-offset-4 transition hover:text-brand-ink"
      >
        {t.clearSelection}
      </button>
      <button
        type="button"
        onClick={() => setPanelOpen(false)}
        className="rounded-full bg-brand-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-terracotta/90"
      >
        {showLabel}
      </button>
    </div>
  );

  const cardGrid = (list) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {list.map((card) => (
        <StoryCard key={card.id} card={card} t={t} />
      ))}
    </div>
  );
  // The journey band sits after two rows of stories (founder mockup
  // 2026-09-04) — the grid is four-up from lg, so eight cards — and the
  // rest of the results follow it, same shape as the trust trio on /guides.
  const firstBlock = filtered.slice(0, 8);
  const rest = filtered.slice(8);

  const continentRows = [
    { bucket: "", label: tl.filterAll, count: total },
    ...tabs.map((b) => ({
      bucket: b,
      label: bucketLabel(b),
      count: continentCounts.get(b) || 0,
    })),
  ];

  // Typeahead (founder 2026-09-04): from two characters the input offers
  // things to pick — filters first (continent, country, style, journey;
  // at most four), then story titles. Picking a filter applies it and
  // clears the box; picking a story opens it. Cheap enough to compute on
  // every keystroke for a library this size.
  const needle = search.trim().toLowerCase();
  const has = (s) => String(s || "").toLowerCase().includes(needle);
  let suggestions = [];
  if (needle.length >= 2) {
    const filters = [];
    for (const row of continentRows) {
      if (row.bucket && has(row.label)) {
        filters.push({
          kind: "continent",
          label: row.label,
          count: row.count,
          apply: () => selectContinent(row.bucket),
        });
      }
    }
    for (const [name, entry] of countryIndex) {
      if (has(name)) {
        filters.push({
          kind: "country",
          label: name,
          count: entry.count,
          apply: () => setCountries((list) => (list.includes(name) ? list : [...list, name])),
        });
      }
    }
    for (const s of styles) {
      if (has(s.label)) {
        filters.push({
          kind: "style",
          label: s.label,
          count: s.count,
          apply: () => setStyleKeys((list) => (list.includes(s.key) ? list : [...list, s.key])),
        });
      }
    }
    INSPIRE_JOURNEYS.forEach((j, i) => {
      const copy = journeyCopy(i);
      if (has(copy.title)) {
        filters.push({
          kind: "journey",
          label: copy.title,
          count: journeyCounts.get(j.key) || 0,
          apply: () => setJourney(j.key),
        });
      }
    });
    const storyRows = cards
      .filter((c) => c.href && has(c.title))
      .slice(0, 6)
      .map((c) => ({ kind: "story", label: c.title, meta: c.geoLabel, href: c.href }));
    suggestions = [...filters.slice(0, 4), ...storyRows];
  }
  const kindLabels = {
    continent: t.kindContinent,
    country: t.kindCountry,
    style: t.kindStyle,
    journey: t.kindJourney,
    story: t.kindStory,
  };
  const pickSuggestion = (s) => {
    setSuggestOpen(false);
    setActiveIdx(-1);
    if (s.href) {
      router.push(s.href);
      return;
    }
    s.apply();
    setSearch("");
  };
  const onSearchKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestOpen(true);
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (suggestOpen && activeIdx >= 0) {
        e.preventDefault();
        pickSuggestion(suggestions[activeIdx]);
      } else {
        setSuggestOpen(false);
      }
    } else if (e.key === "Escape") {
      setSuggestOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div className="space-y-10">
      {/* scroll-mt clears the sticky header when a journey card scrolls
          back up here. */}
      <div
        ref={blockRef}
        className="scroll-mt-24 rounded-[28px] bg-slate-100/70 p-3 ring-1 ring-brand-line md:p-4"
      >
        <div>
          <label htmlFor="inspire-search" className="sr-only">
            {t.searchPlaceholder}
          </label>
          {/* The capsule holds input + Search only; Country and Activity
              live in the /guides-style control row under the tabs (founder
              2026-09-04). */}
          <div ref={searchRef} className="relative">
          <div className="flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-card ring-1 ring-brand-line">
            <input
              id="inspire-search"
              type="search"
              autoComplete="off"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSuggestOpen(true);
                setActiveIdx(-1);
                setPanelOpen(false);
              }}
              onFocus={() => setSuggestOpen(true)}
              onKeyDown={onSearchKeyDown}
              role="combobox"
              aria-expanded={suggestOpen && suggestions.length > 0}
              aria-controls="inspire-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={activeIdx >= 0 ? `inspire-suggestion-${activeIdx}` : undefined}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 md:px-5 md:text-base"
            />
            {/* Search is live as you type; the button is the visible
                "go" that phones expect and just closes the keyboard. Text
                from sm up, a round arrow on phones. */}
            <button
              type="button"
              onClick={() => document.getElementById("inspire-search")?.blur()}
              aria-label={t.searchButton}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-sm font-semibold text-white transition hover:bg-brand-terracotta/90 sm:w-auto sm:px-5 md:h-12 md:px-6 md:text-base"
            >
              <ArrowIcon className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">{t.searchButton}</span>
            </button>
          </div>

          {suggestOpen && suggestions.length ? (
            <ul
              id="inspire-suggestions"
              role="listbox"
              className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl bg-white shadow-card-hover ring-1 ring-brand-line"
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.kind}:${s.label}`}
                  id={`inspire-suggestion-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                >
                  {/* onMouseDown preventDefault keeps the input focused so
                      the list doesn't close before the click lands. */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickSuggestion(s)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${
                      i === activeIdx ? "bg-slate-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="min-w-0 truncate">
                      <span className="font-semibold text-slate-900">{s.label}</span>
                      {s.kind === "story" && s.meta ? (
                        <span className="ml-2 text-slate-500">– {s.meta}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-slate-400">
                      {kindLabels[s.kind]}
                      {s.kind !== "story"
                        ? ` · ${s.count} ${s.count === 1 ? t.story : t.stories}`
                        : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          </div>

        </div>

        {/* Continent tabs with counts: All + one per continent with stories,
            active tab underlined in Brandy (the /guides treatment). */}
        <div className="mt-4 border-b border-brand-line">
          <div className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {continentRows.map((row) => (
              <button
                key={row.bucket || "all"}
                type="button"
                onClick={() => selectContinent(row.bucket)}
                className={tabClass(continent === row.bucket)}
              >
                {row.label}
                <span className={tabCountClass(continent === row.bucket)}>{row.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Control row, the /guides pattern (founder 2026-09-04): the
            Country pill opens the panel anchored below; Activity is a plain
            select. Two per row at thumb size on phones, one compact row from
            sm up. */}
        <div ref={panelRef} className="relative mt-4">
          <div className="flex w-full flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSuggestOpen(false);
                setPanelOpen((o) => !o);
              }}
              aria-expanded={panelOpen}
              aria-haspopup="dialog"
              className={`flex items-center justify-between gap-2 px-4 sm:px-3 ${controlClass} ${
                panelOpen || countries.length
                  ? "border-transparent bg-brand-ink text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="truncate">
                {tl.filterCountry}: {countryPillLabel}
              </span>
              <Chevron open={panelOpen} />
            </button>
            {orderedStyles.length ? (
              <select
                value={activityValue}
                onChange={(e) => pickActivity(e.target.value)}
                aria-label={tl.filterActivity}
                className={`cursor-pointer truncate border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-300 focus:border-slate-400 focus:outline-none sm:px-3 ${controlClass}`}
              >
                <option value="">{`${tl.filterActivity}: ${tl.filterAll}`}</option>
                {orderedStyles.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label} · {s.count}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {/* Country panel, anchored under the control row on every size:
              continent sidebar (same state as the tab row) from md up, the
              searchable multi-select checkbox list always. */}
          {panelOpen ? (
            <div
              role="dialog"
              aria-label={tl.filterCountry}
              className="absolute left-0 top-full z-20 mt-3 w-full overflow-hidden rounded-3xl bg-white shadow-card-hover ring-1 ring-brand-line"
            >
              <div className="flex">
                <div className="hidden w-56 shrink-0 border-r border-brand-line bg-slate-50/70 p-4 md:block">
                  <div className="flex flex-col gap-1.5">
                    {continentRows.map((row) => (
                      <button
                        key={row.bucket || "all"}
                        type="button"
                        onClick={() => selectContinent(row.bucket)}
                        className={sideClass(continent === row.bucket)}
                      >
                        <span>{row.label}</span>
                        <span className={sideCountClass(continent === row.bucket)}>
                          {row.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-w-0 flex-1 p-4 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {scopeLabel} · {fill(t.countriesWithStories, { n: scopedCountries.length })}
                    </p>
                    {findBox("w-full sm:w-56")}
                  </div>
                  {countryList("mt-4 max-h-[45vh] grid-cols-2 lg:grid-cols-3")}
                  {panelFooter}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Status row: live count, one chip per active filter, Clear all. */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4">
          <p className="mr-1 text-sm tabular-nums text-slate-600">
            {fill(t.showing, { shown: filtered.length, total })}
          </p>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="flex items-center gap-2 rounded-full bg-brand-ink px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-ink/90"
            >
              {chip.label}
              <span aria-hidden="true" className="text-white/60">
                ✕
              </span>
              <span className="sr-only">Clear filter</span>
            </button>
          ))}
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-sm font-medium text-brand-terracotta underline underline-offset-4 transition hover:text-brand-ink"
            >
              {t.clearAll}
            </button>
          ) : null}
        </div>
      </div>

      <section className="w-full min-w-0 space-y-10">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-5 py-9 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-8 sm:py-11">
            <p className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
              {t.noMatchTitle}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {t.noMatchBody}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {t.clearAll}
            </button>
          </div>
        ) : (
          cardGrid(firstBlock)
        )}

        {/* Journey band (founder 2026-09-04): a Coffee Bean strip the full
            page width — same breakout as the trust trio on /guides — with
            four photo cards, each a filter over the stories
            (app/_lib/inspireJourneys.js), counts live. Cards are kept short
            (the first cut at 18rem was "too tall"). */}
        <section
          aria-labelledby="inspire-journeys"
          className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-ink py-10 md:py-12"
        >
          <div className="mx-auto max-w-7xl space-y-5 px-6">
            <h2
              id="inspire-journeys"
              className="font-sans text-base font-light uppercase tracking-[0.3em] text-brand-cream md:text-xl"
            >
              {t.heading}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {INSPIRE_JOURNEYS.map((j, i) => {
                const copy = journeyCopy(i);
                const info = journeyInfo.get(j.key) || { count: 0, fallbackPhoto: null };
                const n = info.count;
                const active = journey === j.key;
                return (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => pickJourney(j.key)}
                    aria-pressed={active}
                    className={`group relative h-44 overflow-hidden rounded-3xl bg-slate-800 text-left text-brand-cream transition duration-200 ease-out hover:-translate-y-0.5 md:h-52 ${
                      active ? "ring-2 ring-brand-terracotta" : "ring-1 ring-white/10"
                    }`}
                  >
                    {j.image ? (
                      <Image
                        src={j.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : info.fallbackPhoto ? (
                      // Sanity CDN rendition, already sized for cards.
                      <img
                        src={info.fallbackPhoto}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : null}
                    {/* Photo darkens toward the bottom so the title reads. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/35 to-brand-ink/10" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5">
                      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-cream/85">
                        {copy.eyebrow}
                      </p>
                      <div>
                        <p className="font-serif text-2xl font-normal leading-tight">{copy.title}</p>
                        <p className="mt-1 text-sm text-brand-cream/75">
                          {n} {n === 1 ? t.story : t.stories} · {copy.blurb}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {rest.length ? cardGrid(rest) : null}
      </section>
    </div>
  );
}

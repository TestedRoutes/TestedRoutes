"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CardMediaCarousel, { buildMediaSlides } from "../../_components/CardMediaCarousel";
import { getDict } from "../../_lib/i18n";
import { continentBucket, continentTabLabel } from "../../_lib/continents";

// The trip row under the heading (founder mockup 2026-08-17). A trip is one
// real journey, not a category: the stories that came out of a single
// continuous run.
//
// Membership resolves two ways, collection tag first and destination country
// second, because no Inspire story is tagged today. The "Alpine Passes Trail"
// collection exists and is applied — but only to the seven guide documents,
// and this index lists exactly the docs that are NOT guides
// (`guide.hasGuide != true` in fetchAllStories), so the tag matches nothing
// here. Country carries every box for now; tag a story into a collection in
// Sanity and it joins its box without a deploy.
//
// One impurity to know about: country Switzerland is 11 stories, 10 of them
// the traverse and one the Triftbrücke footbridge day trip. Tagging those 10
// into the collection and dropping `countries` below is what makes the box
// exact — a content job, not a code one.
//
// Counts come from the same `cards` the grid filters, so the number on a box
// is exactly what clicking it shows — there is no second figure to go stale —
// and a trip with no stories doesn't render at all.
//
// Not localised: the trip names are proper nouns, but the notes under them
// stay English on /de, /es, /fr and /lt until there's a translation pass.
const TRIPS = [
  {
    key: "alpine-passes-trail",
    eyebrow: "Switzerland",
    title: "Alpine Passes Trail",
    note: "Hut-to-hut traverse",
    collections: ["Alpine Passes Trail"],
    countries: ["Switzerland"],
  },
  {
    key: "nz-south-island",
    eyebrow: "New Zealand",
    title: "NZ South Island",
    note: "10-day roadtrip",
    countries: ["New Zealand"],
  },
  {
    key: "mongol-rally",
    eyebrow: "Central Asia",
    title: "Mongol Rally",
    note: "Overland rally",
    countries: [
      "Iran",
      "Turkmenistan",
      "Uzbekistan",
      "Tajikistan",
      "Kyrgyzstan",
      "Kazakhstan",
    ],
  },
  {
    key: "seven-summits",
    // The climbs have no single country — the destination doc files them
    // under "7 Summits" itself.
    eyebrow: "Worldwide",
    title: "7 Summits",
    note: "Climbing project",
    countries: ["7 Summits"],
  },
];

function matchesTrip(card, trip) {
  if (!trip) return true;
  const tagged = card.collections || [];
  if ((trip.collections || []).some((name) => tagged.includes(name))) return true;
  return (trip.countries || []).includes(card.country);
}

function cardHaystack(card) {
  return [
    card.title,
    card.geoLabel,
    card.durationLabel,
    card.activityLabel,
    card.categoryDurationLine,
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
          {card.geoLabel || " "}
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

// Height of the sticky site header on md and up (h-20 plus its hairline
// border) — the hover panel hangs flush off its bottom edge, so any gap here
// is a gap the pointer has to cross without the panel closing under it.
const HEADER_HEIGHT = 81;

// Grace period before the panel closes. Without it, the pointer travelling
// from the header search into the panel crosses the header's own edge, fires
// mouseleave, and the panel disappears out from under it.
const CLOSE_DELAY_MS = 180;

export default function InspireBrowse({ cards, lang = "en", initialContinent = "" }) {
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [continentFilter, setContinentFilter] = useState(continentBucket(initialContinent));
  const [tripFilter, setTripFilter] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const closeTimer = useRef(null);
  const cardRef = useRef(null);
  const dict = getDict(lang);
  const t = dict.inspireList;

  // The header search is this card's stand-in, so it appears exactly when the
  // card goes under the header — which is where the story cards begin
  // (founder 2026-08-17). Same handover the home hero performs; a scroll
  // threshold would fire while the heading and trip boxes were still on
  // screen and two search boxes would sit there together.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // A passive scroll listener rather than an IntersectionObserver: the
    // header measures its own scroll the same way, and this only fires the
    // event when the answer actually flips, so the header re-renders twice
    // per visit rather than on every frame of the scroll.
    let visible = null;
    const announce = (next) => {
      if (next === visible) return;
      visible = next;
      window.dispatchEvent(
        new CustomEvent("page-search-visible", { detail: next }),
      );
    };
    const measure = () =>
      announce(el.getBoundingClientRect().bottom > HEADER_HEIGHT);
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      // Leaving the page hands the header back its own rules; without this
      // the search would stay pinned on wherever the reader lands next.
      window.dispatchEvent(
        new CustomEvent("page-search-visible", { detail: true }),
      );
    };
  }, []);

  // The header search is the trigger (founder 2026-08-17). SiteHeader reports
  // hover through a window event rather than importing anything from this
  // page — the same loose coupling the hero search already uses to tell the
  // header whether to show itself.
  const openPanel = () => {
    clearTimeout(closeTimer.current);
    setPanelOpen(true);
  };
  const closePanel = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanelOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    const onHover = (e) => (e.detail ? openPanel() : closePanel());
    const onKey = (e) => {
      if (e.key === "Escape") {
        clearTimeout(closeTimer.current);
        setPanelOpen(false);
      }
    };
    window.addEventListener("header-search-hover", onHover);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("header-search-hover", onHover);
      document.removeEventListener("keydown", onKey);
      clearTimeout(closeTimer.current);
    };
  }, []);

  // Style lists what the loaded stories actually carry, so a pill never
  // promises a filter that matches nothing. Duration (the journey category)
  // had a row here too until 2026-08-17; the field still feeds the search
  // haystack, so typing "expedition" finds those stories.
  const activities = useMemo(
    () => [...new Set(cards.map((c) => c.activityLabel).filter(Boolean))].sort(),
    [cards],
  );
  const countries = useMemo(
    () => [...new Set(cards.map((c) => c.country).filter(Boolean))].sort(),
    [cards],
  );

  const tripCounts = useMemo(() => {
    const counts = new Map();
    for (const trip of TRIPS) {
      counts.set(trip.key, cards.filter((c) => matchesTrip(c, trip)).length);
    }
    return counts;
  }, [cards]);
  const activeTrip = TRIPS.find((trip) => trip.key === tripFilter) || null;

  const filtered = useMemo(() => {
    const matched = cards.filter(
      (c) =>
        matchesSearch(c, search) &&
        (!activityFilter || c.activityLabel === activityFilter) &&
        (!countryFilter || c.country === countryFilter) &&
        (!continentFilter || continentBucket(c.continentSlug) === continentFilter) &&
        matchesTrip(c, activeTrip),
    );
    return sortRecentFirst(matched);
  }, [cards, search, activityFilter, countryFilter, continentFilter, activeTrip]);

  // A trip and a continent are two ways of slicing the same library, so
  // picking a trip drops the continent; combining them mostly produces an
  // empty grid (Mongol Rally ∩ Europe) with no obvious way back out.
  const selectTrip = (key) => {
    setTripFilter((current) => (current === key ? "" : key));
    setContinentFilter("");
  };

  // Every pill is a toggle: clicking the active one clears that facet, so a
  // row of pills needs no separate "All" chip to escape from.
  const pillClass = (isActive) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "border-brand-ink bg-brand-ink text-white"
        : "border-brand-line bg-white text-slate-700 hover:border-slate-300"
    }`;
  const facetLabelClass = "shrink-0 text-[13px] font-medium text-slate-500";
  const toggle = (setter) => (value) =>
    setter((current) => (current === value ? "" : value));

  // Rendered twice — once in the page, once in the panel the header search
  // drops — so the input needs a per-instance id to keep its label pointing
  // at the right field. Both copies read and write the same state, so
  // whichever one you type in, the other agrees.
  const filterRows = (instanceId) => {
    const searchId = `${instanceId}-search`;
    return (
      <>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label htmlFor={searchId} className="sr-only">
            {t.searchPlaceholder}
          </label>
          {/* The white pill with the Brandy Search button, not a grey field
              with a magnifier (founder 2026-08-17). */}
          <div className="flex min-w-[15rem] flex-1 items-center gap-2 rounded-full bg-white p-1.5 shadow-md ring-1 ring-slate-200">
            <input
              id={searchId}
              type="search"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 md:px-5 md:text-base"
            />
            <button
              type="button"
              onClick={() => document.getElementById(searchId)?.blur()}
              className="shrink-0 rounded-full bg-brand-terracotta px-4 py-3 text-sm font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 md:px-6 md:text-base"
            >
              {t.searchButton}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
          {activities.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className={facetLabelClass}>{t.filterStyle}</span>
              {activities.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggle(setActivityFilter)(value)}
                  aria-pressed={activityFilter === value}
                  className={pillClass(activityFilter === value)}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            {/* Only shows when the reader arrived from a home-page link like
                "See all in Africa": there is no continent control on this
                page, so without a way to dismiss it the filter would be a
                dead end. */}
            {continentFilter ? (
              <button
                type="button"
                onClick={() => setContinentFilter("")}
                className="flex shrink-0 items-center gap-2 rounded-full border border-brand-ink bg-brand-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-ink/90"
              >
                {continentTabLabel(continentFilter)}
                <span aria-hidden="true" className="text-white/60">
                  ✕
                </span>
                <span className="sr-only">Clear continent filter</span>
              </button>
            ) : null}
            {countries.length ? (
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                aria-label={dict.guideList.filterCountry}
                className="h-10 max-w-full cursor-pointer truncate rounded-full border border-brand-line bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none"
              >
                <option value="">{dict.guideList.allCountries}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            ) : null}
            <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
              {filtered.length} {filtered.length === 1 ? t.story : t.stories}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-10">
      {/* Hovering the header's "Where to next?" drops the whole filter box
          (founder 2026-08-17). Fixed, not sticky, so it hangs off the header
          wherever the reader has scrolled to, and z-40 puts it over the story
          cards — under z-50, which is the header's own. Desktop only: the
          header search it hangs from is itself md-and-up. */}
      {panelOpen ? (
        <div
          className="fixed inset-x-0 z-40 hidden px-6 md:block"
          style={{ top: `${HEADER_HEIGHT}px` }}
          onMouseEnter={openPanel}
          onMouseLeave={closePanel}
        >
          <div className="mx-auto max-w-7xl rounded-b-[28px] border border-t-0 border-brand-line bg-white p-4 shadow-card-hover md:p-5">
            {filterRows("inspire-header")}
          </div>
        </div>
      ) : null}

      <section className="w-full min-w-0 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRIPS.filter((trip) => tripCounts.get(trip.key) > 0).map((trip) => {
            const count = tripCounts.get(trip.key);
            const isActive = tripFilter === trip.key;
            return (
              <button
                key={trip.key}
                type="button"
                onClick={() => selectTrip(trip.key)}
                aria-pressed={isActive}
                className={`flex min-h-[190px] flex-col justify-between rounded-3xl bg-gradient-to-b from-slate-800 to-brand-ink p-5 text-left shadow-card transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover ${
                  isActive ? "ring-2 ring-brand-terracotta" : ""
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-bone/90">
                  {trip.eyebrow}
                </span>
                <span>
                  <span className="block font-serif font-supersoft text-[22px] font-normal leading-snug text-white">
                    {trip.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-white/60">
                    {count} {count === 1 ? t.story : t.stories} · {trip.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="w-full min-w-0 space-y-6">
        {/* Sits under the trip boxes (founder 2026-08-17), where it heads the
            browse block rather than the boxes. The home hero's "Skip the
            research. Take the trip" treatment — DM Sans 24px, uppercase,
            0.2em tracking. font-sans and font-normal are both spelled out to
            override the global h2 rule, which would otherwise supply the
            serif at 300; the capitals come from CSS, not the dictionary, so
            the string stays readable for translators. */}
        <h2 className="font-sans text-[24px] font-normal uppercase leading-tight tracking-[0.2em]">
          {t.heading}
        </h2>

        {/* Search + facets in one frame (founder mockup 2026-08-17). Duration
            is the story's journey category, Style its activity category —
            our own vocabulary, not a hand-written list, so a facet appears
            only once a story carries it and the rows track the library. */}
        <div
          ref={cardRef}
          className="rounded-[28px] border border-brand-line bg-white p-4 shadow-card md:p-5"
        >
          {filterRows("inspire")}
        </div>
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
              onClick={() => setSearch("")}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {t.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {filtered.map((card) => (
              <StoryCard key={card.id} card={card} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

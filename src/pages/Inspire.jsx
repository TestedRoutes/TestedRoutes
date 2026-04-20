/**
 * Inspire — travel stories from `assets/public/Content/Inspire/`.
 *
 * ## Step 1 — Reading story data (confirmed)
 * - **Static HTTP:** `loadInspireStories()` fetches `stories-manifest.json`, then each
 *   `Meta-*.txt` (JSON), optional `Story-*.{md,txt}`, and builds photo URLs from manifest
 *   `photos` or metadata. Regenerate the manifest after adding folders:
 *   `node scripts/build-inspire-manifest.mjs` (12 story roots in this repo at last run).
 * - **Vite:** pass `{ useViteGlob: true }` to scan with `import.meta.glob` (no manifest).
 *
 * ## Live static site
 * `inspire.html` + `inspire-app.jsx` mirror this UI for the current no-bundler setup.
 *
 * @see ../utils/loadInspireStories.js
 * @see ../hooks/useInspireBrowseState.js
 */
import * as React from "react";
import InspireStoryCard from "../components/inspire/InspireStoryCard.jsx";
import { useInspireBrowseState, INSPIRE_FACET_UI, INSPIRE_PAGE_SIZE } from "../hooks/useInspireBrowseState.js";

const collections = [
  {
    title: "Swiss Alpine Days",
    intro:
      "Structured day trips from Zurich that combine alpine scenery, transport logic, and realistic pacing.",
    examples: ["Triftbrücke", "Stoos Ridge", "Mount Rigi", "Säntis"],
    href: "destinations/switzerland/",
  },
  {
    title: "Self-Guided Country Routes",
    intro: "Longer routes built around flow, logistics, and what actually works on the ground.",
    examples: ["Iceland Ring Road", "South Island New Zealand", "Switzerland by train"],
    href: "inspire.html",
  },
  {
    title: "Extreme Experiences",
    intro: "The experiences that shape how routes are designed and tested in the real world.",
    examples: ["Running with the bulls", "Shark diving", "Volcano boarding", "Skydiving & paragliding"],
    href: "inspire.html",
  },
  {
    title: "Expedition Routes",
    intro: "Long-form journeys shaped by overland logistics, difficult borders, and uncertainty.",
    examples: ["Mongol Rally", "Africa overland route", "Mauritania iron ore train"],
    href: "inspire.html",
  },
];

function aboutAsset(filename) {
  return "/About%20me/" + encodeURIComponent(filename);
}

const extremeExperiences = [
  { label: "Running with the bulls — Spain", file: "Pamplona 2019.jpg" },
  { label: "Shark diving — Fiji", file: "Sharks Fiji 2025.jpg" },
  { label: "Volcano boarding — Nicaragua", file: "Volcano Nicaragua 2019.jpg" },
  { label: "Skydiving & paragliding", file: "Paragliding.jpg" },
  { label: "Ice climbing & glacier travel", file: "Ice climbing Italy 2019.jpg" },
  { label: "Riding the iron ore train — Mauritania", file: "Iron Ore train Mauritania 2023.jpg" },
  { label: "Summit pushes above 6,000 m", file: "Alaska 2019 v2.jpg" },
  { label: "Remote border crossings — West Africa", file: "Africa Rally - Makoko Nigeria 2025.jpg" },
];

const categoryChips = ["Switzerland", "New Zealand", "Expeditions", "Mountains", "Extreme Experiences", "Route Ideas"];

const ACTIVITY_GROUPS = [
  { key: "Summit", label: "Mountains & Summits", buckets: ["Summit"] },
  { key: "Hike", label: "Hikes & Trails", buckets: ["Hike"] },
  { key: "Expedition", label: "Expeditions", buckets: ["Expedition"] },
  { key: "RoadTrip", label: "Road Trips", buckets: ["Road Trip"] },
  { key: "Water", label: "Water & Ocean", buckets: ["Diving", "Swimming"] },
  { key: "Extreme", label: "Extreme Experiences", buckets: ["Extreme Sport"] },
];

function StoryScrollCard({ story, contentLoaderMod }) {
  const slug = story.slug || "";
  const href = slug ? `inspire-story.html?slug=${encodeURIComponent(slug)}` : null;
  const title = story.title || "";
  const display = contentLoaderMod?.getInspireFeaturedCardDisplay?.(story) || {};
  const { geoLabel, categoryDurationLine, difficultyLabel, hasGuide, excerpt } = display;
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href || undefined}
      className="flex-none snap-start w-[75vw] max-w-[280px] sm:w-64 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {story.heroPhoto ? (
          <img src={story.heroPhoto} alt={title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No photo</div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        {geoLabel ? <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{geoLabel}</p> : null}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{title}</p>
          {hasGuide ? (
            <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Guide</span>
          ) : null}
        </div>
        {categoryDurationLine ? <p className="text-[11px] text-slate-500">{categoryDurationLine}</p> : null}
        {excerpt ? <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500">{excerpt}</p> : null}
        {difficultyLabel ? <p className="mt-0.5 text-[10px] font-medium text-slate-400">{difficultyLabel}</p> : null}
      </div>
    </Tag>
  );
}

function GroupedScrollRow({ groupLabel, stories, contentLoaderMod }) {
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateArrows = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  React.useEffect(() => { updateArrows(); }, [updateArrows]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a,div")?.offsetWidth || 240;
    el.scrollBy({ left: dir * (cardWidth + 12), behavior: "smooth" });
  };

  if (!stories.length) return null;
  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex items-baseline gap-3">
        <p className="text-xl font-semibold text-slate-900">{groupLabel}</p>
        <span className="text-sm text-slate-400">{stories.length}</span>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="no-scrollbar flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
        >
          {stories.map((story) => (
            <StoryScrollCard key={story.id} story={story} contentLoaderMod={contentLoaderMod} />
          ))}
        </div>
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="absolute -left-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="absolute -right-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SiteHeaderOrFallback() {
  if (typeof window !== "undefined" && typeof window.SiteHeader === "function") {
    return React.createElement(window.SiteHeader);
  }
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 text-sm">
        <a href="index.html" className="font-semibold text-slate-900">
          Pikelis Travel
        </a>
        <a href="destinations.html" className="text-slate-600 hover:text-slate-900">
          Destinations
        </a>
        <a href="guides.html" className="text-slate-600 hover:text-slate-900">
          Guides
        </a>
        <a href="inspire.html" className="font-semibold text-slate-900">
          Inspire
        </a>
        <a href="about.html" className="text-slate-600 hover:text-slate-900">
          About
        </a>
      </nav>
    </header>
  );
}

const Footer = () => (
  <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
    <p>© 2026 Pikelis Travel. All rights reserved.</p>
    <div className="flex items-center gap-4">
      <span>Contact</span>
      <span>Terms</span>
      <span>Privacy</span>
    </div>
  </footer>
);

function InspireEmptyBlock({ title, description, children }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-5 py-9 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-8 sm:py-11">
      <p className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>
      {children ? <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}

function FeaturedStoryHero({ stories, ready }) {
  const featured = React.useMemo(() => {
    if (!stories || !stories.length) return null;
    return [...stories].sort((a, b) => {
      const da = a.date || "";
      const db = b.date || "";
      return db.localeCompare(da);
    })[0];
  }, [stories]);

  const country = featured?.metadata?.geography?.country || "";
  const continent = featured?.metadata?.geography?.continent || "";
  const location = [country, continent].filter(Boolean).join(", ");
  const tags = featured?.metadata?.classification?.activity_tags?.slice(0, 3) || [];
  const storyHref = featured ? `inspire-story.html?story=${encodeURIComponent(featured.slug)}` : "guides.html";

  return (
    <section className="grid w-full min-w-0 gap-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:gap-6 sm:p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8 md:pb-8">
      <a
        href={featured ? storyHref : undefined}
        className="group relative aspect-[4/3] min-h-[11rem] w-full overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[3/2] sm:min-h-0 sm:rounded-3xl md:aspect-auto md:h-64"
      >
        {featured?.heroPhoto ? (
          <>
            <img
              src={featured.heroPhoto}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            {location ? (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                {location}
              </span>
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">
            {ready ? "No photo available" : "Loading…"}
          </div>
        )}
      </a>

      <div className="flex flex-col justify-between gap-5 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.5rem]">Inspire</p>
          {featured ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Latest story</p>
              <p className="text-[15px] font-semibold leading-snug text-slate-800 sm:text-base">{featured.title}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed text-slate-500">
                Real journeys — built from 15 years of independent travel across 140 countries.
              </p>
            </>
          ) : (
            <p className="text-[15px] leading-relaxed text-slate-600 sm:text-sm">
              Real journeys behind the guides — built from 15 years of independent travel across 140 countries.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {featured ? (
            <a
              href={storyHref}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Read story →
            </a>
          ) : null}
          <a
            href="guides.html"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Explore Guides
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   loadModule?: () => Promise<Record<string, unknown>>,
 *   loadStoriesOptions?: Record<string, unknown>,
 * }} [props]
 */
export default function InspirePage(props = {}) {
  const browse = useInspireBrowseState({
    loadModule: props.loadModule,
    loadStoriesOptions: props.loadStoriesOptions,
  });

  const {
    contentStories,
    contentStoriesReady,
    contentLoaderMod,
    searchInput,
    setSearchInput,
    sortKey,
    setSortKey,
    facetSelection,
    visibleCount,
    setVisibleCount,
    visibleStories,
    facetOptions,
    facetFilteredStories,
    pagedStories,
    hasMoreStories,
    hasActiveFilters,
    toggleFacet,
    clearFacetSelection,
  } = browse;

  const groupedStories = React.useMemo(() => {
    if (!contentLoaderMod || !facetFilteredStories.length) return [];
    const projectFn = contentLoaderMod.projectInspireStoryFacetValues;
    if (typeof projectFn !== "function") return [];
    const assigned = new Set();
    const result = [];
    for (const g of ACTIVITY_GROUPS) {
      const matched = facetFilteredStories.filter((story) => {
        if (assigned.has(story.id)) return false;
        const vals = projectFn(story);
        const acts = vals.activity || [];
        return g.buckets.some((b) => acts.includes(b));
      });
      if (matched.length) {
        matched.forEach((s) => assigned.add(s.id));
        result.push({ key: g.key, label: g.label, stories: matched });
      }
    }
    const others = facetFilteredStories.filter((s) => !assigned.has(s.id));
    if (others.length) result.push({ key: "Other", label: "More Stories", stories: others });
    return result;
  }, [contentLoaderMod, facetFilteredStories]);

  const getOptsForDim = (dim) => {
    if (!facetOptions) return [];
    if (dim === "country" && facetSelection.continent?.length > 0 && contentLoaderMod) {
      const projectFn = contentLoaderMod.projectInspireStoryFacetValues;
      const buildFn = contentLoaderMod.buildInspireFacetOptions;
      if (typeof projectFn === "function" && typeof buildFn === "function") {
        const continentFiltered = contentStories.filter((s) => {
          const vals = projectFn(s);
          return (vals.continent || []).some((c) => facetSelection.continent.includes(c));
        });
        return buildFn(continentFiltered).country || [];
      }
    }
    return facetOptions[dim] || [];
  };

  const renderHorizontalFacets = () => {
    if (!facetOptions) return null;
    return INSPIRE_FACET_UI.map(({ dim, label }) => {
      const opts = getOptsForDim(dim);
      if (!opts.length) return null;
      const activeCount = (facetSelection[dim] || []).length;
      return (
        <details key={dim} className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            {label}{activeCount ? ` (${activeCount})` : ""}
          </summary>
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-[11rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
            {opts.map((opt) => (
              <label
                key={`${dim}-${String(opt)}`}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="size-3.5 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-300/80"
                  checked={(facetSelection[dim] || []).includes(opt)}
                  onChange={() => toggleFacet(dim, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </details>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <SiteHeaderOrFallback />
      <main className="w-full pb-16 pt-6 text-slate-900 sm:pt-8">
        <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8 px-4 sm:gap-10 sm:px-6">
          <p className="w-full text-[10px] font-medium tabular-nums tracking-wide text-slate-400 sm:text-[11px]">
            {!contentStoriesReady ? "Loading stories…" : `Loaded ${contentStories.length} stories`}
          </p>

          <FeaturedStoryHero stories={contentStories} ready={contentStoriesReady} />

          <div className="flex w-full min-w-0 flex-col gap-3">
            <div className="w-full rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 md:p-6">
              <label htmlFor="inspire-journey-search" className="sr-only">
                Search journeys
              </label>
              <input
                id="inspire-journey-search"
                type="search"
                name="inspire-journey-search"
                autoComplete="off"
                placeholder="Search journeys…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:min-h-0 sm:text-sm"
              />
            </div>

            {contentStoriesReady && contentStories.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {renderHorizontalFacets()}
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => clearFacetSelection()}
                    className="rounded-full px-3 py-2 text-xs font-semibold text-slate-600 underline decoration-slate-400 decoration-1 underline-offset-4 transition hover:text-slate-900"
                  >
                    Clear all
                  </button>
                ) : null}
                <div className="ml-auto flex items-center gap-2.5">
                  <p className="text-sm font-medium tabular-nums text-slate-500">
                    {facetFilteredStories.length} stories
                  </p>
                  <label htmlFor="inspire-sort" className="text-xs font-semibold text-slate-600">
                    Sort
                  </label>
                  <select
                    id="inspire-sort"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="recent">Most recent</option>
                    <option value="popular">Popular</option>
                    <option value="oldest">Oldest</option>
                    <option value="alpha">Alphabetical</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </div>
              </div>
            ) : null}
          </div>

          <section className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {categoryChips.map((label) => (
              <span
                key={label}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold leading-snug tracking-wide text-slate-600"
              >
                {label}
              </span>
            ))}
          </section>

          <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Journeys I've actually done</p>
            <p className="max-w-xl text-sm text-slate-600">
              From <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Content/Inspire</code> via manifest + Meta JSON + Story markdown.
            </p>
          </div>

          <section className="w-full min-w-0">
            {!contentStoriesReady ? (
              <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-slate-200 sm:py-12">
                <div className="mx-auto h-1.5 max-w-[12rem] animate-pulse rounded-full bg-slate-200" />
                <p className="mt-5 text-sm font-medium text-slate-600">Loading journeys…</p>
                <p className="mt-1 text-xs text-slate-500">Fetching story cards from your content library.</p>
              </div>
            ) : !contentLoaderMod ? (
              <InspireEmptyBlock
                title="Stories unavailable"
                description="The journey loader could not start. Refresh the page, or try again in a moment."
              >
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </button>
              </InspireEmptyBlock>
            ) : contentStories.length === 0 ? (
              <InspireEmptyBlock
                title="No journeys loaded yet"
                description="Add folders under Content/Inspire and run node scripts/build-inspire-manifest.mjs from the repo root."
              >
                <a
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                  href="inspire.html"
                >
                  Refresh
                </a>
              </InspireEmptyBlock>
            ) : visibleStories.length === 0 ? (
              <InspireEmptyBlock
                title="No search results"
                description="Nothing in the current list matches those words. Try a shorter phrase or clear the search."
              >
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => setSearchInput("")}
                >
                  Clear search
                </button>
              </InspireEmptyBlock>
            ) : facetFilteredStories.length === 0 ? (
              <InspireEmptyBlock
                title="No matches for these filters"
                description="Relax one of the filter groups or reset them to browse the full set of journeys that match your search."
              >
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => clearFacetSelection()}
                >
                  Clear all filters
                </button>
              </InspireEmptyBlock>
            ) : (
              <>
                {!hasActiveFilters && !searchInput.trim() ? (
                  <div className="flex flex-col gap-10">
                    {groupedStories.map(({ key, label, stories }) => (
                      <GroupedScrollRow key={key} groupLabel={label} stories={stories} contentLoaderMod={contentLoaderMod} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                      {pagedStories.map((story) => (
                        <InspireStoryCard key={story.id} story={story} contentLoaderMod={contentLoaderMod} />
                      ))}
                    </div>
                    {hasMoreStories ? (
                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          onClick={() => setVisibleCount((c) => c + INSPIRE_PAGE_SIZE)}
                        >
                          Load more journeys
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </>
            )}
          </section>

          <section className="grid w-full min-w-0 gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
            {["140 countries", "15 years of independent planning", "5/7 summits completed", "Routes tested with family and friends"].map(
              (item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-semibold text-slate-700">
                  {item}
                </div>
              ),
            )}
          </section>

          <section className="space-y-6">
            <p className="text-xl font-semibold">Explore by type of journey</p>
            <div className="grid gap-6 md:grid-cols-2">
              {collections.map((collection) => (
                <div key={collection.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className="h-40 rounded-2xl bg-slate-100" />
                  <div className="mt-4 space-y-2">
                    <p className="text-lg font-semibold">{collection.title}</p>
                    <p className="text-sm text-slate-600">{collection.intro}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      {collection.examples.map((example) => (
                        <span key={example} className="rounded-full bg-slate-100 px-3 py-1">
                          {example}
                        </span>
                      ))}
                    </div>
                    <a
                      className="mt-3 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                      href={collection.href}
                    >
                      View collection
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-xl font-semibold">How I test the routes behind my guides</p>
              <p className="mt-2 text-sm text-slate-600">
                I don’t build routes from a desk. I test them in the field — through altitude, logistics, terrain, and
                real-world uncertainty.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {extremeExperiences.map((item) => (
                <div key={item.label} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <img
                    src={aboutAsset(item.file)}
                    alt={item.label}
                    className="h-36 w-full object-cover object-center"
                    loading="lazy"
                  />
                  <p className="p-3 text-center text-[11px] font-medium leading-snug text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">Ready to turn inspiration into a real route?</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white">
                Browse Guides
              </button>
              <button type="button" className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700">
                Explore Destinations
              </button>
            </div>
          </section>

          <Footer />
        </div>
      </main>

    </div>
  );
}

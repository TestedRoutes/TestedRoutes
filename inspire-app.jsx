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
    intro:
      "Longer routes built around flow, logistics, and what actually works on the ground.",
    examples: ["Iceland Ring Road", "South Island New Zealand", "Switzerland by train"],
    href: "inspire.html",
  },
  {
    title: "Extreme Experiences",
    intro:
      "The experiences that shape how routes are designed and tested in the real world.",
    examples: [
      "Running with the bulls",
      "Shark diving",
      "Volcano boarding",
      "Skydiving & paragliding",
    ],
    href: "inspire.html",
  },
  {
    title: "Expedition Routes",
    intro:
      "Long-form journeys shaped by overland logistics, difficult borders, and uncertainty.",
    examples: ["Mongol Rally", "Africa overland route", "Mauritania iron ore train"],
    href: "inspire.html",
  },
];

const extremeExperiences = [
  "Running with the bulls — Spain",
  "Shark diving — South Africa",
  "Volcano boarding — Nicaragua",
  "Skydiving & paragliding",
  "Ice climbing & glacier travel",
  "Riding the iron ore train — Mauritania",
  "Summit pushes above 6,000 m",
  "Remote border crossings — West Africa",
];

function SiteHeaderOrFallback() {
  if (typeof window !== "undefined" && typeof window.SiteHeader === "function") {
    return React.createElement(window.SiteHeader);
  }
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 text-sm">
        <a href="index.html" className="font-semibold text-slate-900">Pikelis Travel</a>
        <a href="destinations.html" className="text-slate-600 hover:text-slate-900">Destinations</a>
        <a href="guides.html" className="text-slate-600 hover:text-slate-900">Guides</a>
        <a href="inspire.html" className="font-semibold text-slate-900">Inspire</a>
        <a href="about.html" className="text-slate-600 hover:text-slate-900">About</a>
      </nav>
    </header>
  );
}

const Footer = () => window.SiteFooter ? React.createElement(window.SiteFooter) : null;

function InspireEmptyBlock({ title, description, children }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-5 py-9 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-8 sm:py-11">
      <p className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>
      {children ? <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}

const INSPIRE_FACET_UI = [
  { dim: "continent", label: "📍 Continent" },
  { dim: "country", label: "📍 Country" },
  { dim: "duration", label: "⏱️ Duration" },
  { dim: "activity", label: "🎯 Activity type" },
  { dim: "difficulty", label: "💪 Difficulty" },
  { dim: "suitableFor", label: "👨‍👩‍👧‍👦 Suitable for" },
  { dim: "season", label: "📅 Season" },
  { dim: "budget", label: "💰 Budget" },
  { dim: "guide", label: "📖 Guide status" },
];

const INSPIRE_PAGE_SIZE = 12;

const InspireStoryCardComponent =
  typeof window !== "undefined" && typeof window.InspireStoryCard === "function"
    ? window.InspireStoryCard
    : null;

function emptyInspireFacetSelection() {
  return {
    continent: [],
    country: [],
    duration: [],
    activity: [],
    difficulty: [],
    suitableFor: [],
    season: [],
    budget: [],
    guide: [],
  };
}

function InspirePage() {
  const [contentStories, setContentStories] = React.useState([]);

  const [contentStoriesReady, setContentStoriesReady] = React.useState(false);

  const [contentLoaderMod, setContentLoaderMod] = React.useState(null);

  const [searchInput, setSearchInput] = React.useState("");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const [sortKey, setSortKey] = React.useState("recent");

  const [facetSelection, setFacetSelection] = React.useState(emptyInspireFacetSelection);

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const [desktopFiltersOpen, setDesktopFiltersOpen] = React.useState(true);

  const [visibleCount, setVisibleCount] = React.useState(INSPIRE_PAGE_SIZE);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 260);

    return () => window.clearTimeout(t);
  }, [searchInput]);

  const allowHistorySync = React.useRef(false);

  React.useEffect(() => {
    const FQ = typeof window !== "undefined" ? window.inspireFilterQuery : null;
    if (!FQ || typeof FQ.parseFromSearch !== "function") return;
    const { facetSelection: parsedSel, searchInput: parsedQ } = FQ.parseFromSearch(window.location.search);
    if (parsedQ) setSearchInput(parsedQ);
    if (parsedSel && typeof parsedSel === "object") {
      const base = emptyInspireFacetSelection();
      const merged = { ...base };
      Object.keys(base).forEach((dim) => {
        const arr = parsedSel[dim];
        merged[dim] = Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
      });
      setFacetSelection(merged);
    }
    window.setTimeout(() => {
      allowHistorySync.current = true;
    }, 0);
  }, []);

  React.useEffect(() => {
    const FQ = typeof window !== "undefined" ? window.inspireFilterQuery : null;
    if (!allowHistorySync.current || !FQ || typeof FQ.replaceUrl !== "function") return;
    const t = window.setTimeout(() => {
      FQ.replaceUrl(facetSelection, searchInput);
    }, 400);
    return () => window.clearTimeout(t);
  }, [facetSelection, searchInput]);

  React.useEffect(() => {
    setVisibleCount(INSPIRE_PAGE_SIZE);
  }, [debouncedSearch, facetSelection, sortKey, contentStories.length]);

  const visibleStories = React.useMemo(() => {
    try {
      if (!contentStoriesReady || !contentLoaderMod) return [];
      const match = contentLoaderMod.matchesInspireStorySearch;
      if (typeof match !== "function") return contentStories;
      const q = debouncedSearch.trim();
      if (!q) return contentStories;
      return contentStories.filter((s) => match(s, q));
    } catch {
      return contentStories;
    }
  }, [contentStories, contentStoriesReady, contentLoaderMod, debouncedSearch]);

  const facetOptions = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.buildInspireFacetOptions !== "function") return null;
      return contentLoaderMod.buildInspireFacetOptions(contentStories);
    } catch {
      return null;
    }
  }, [contentLoaderMod, contentStories]);

  const facetFilteredStories = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.storyPassesInspireFacetSelection !== "function") {
        return visibleStories;
      }
      return visibleStories.filter((s) => contentLoaderMod.storyPassesInspireFacetSelection(s, facetSelection));
    } catch {
      return visibleStories;
    }
  }, [contentLoaderMod, visibleStories, facetSelection]);

  const displayedStories = React.useMemo(() => {
    try {
      if (!contentLoaderMod || typeof contentLoaderMod.sortInspireStoriesByKey !== "function") {
        return facetFilteredStories;
      }
      return contentLoaderMod.sortInspireStoriesByKey(facetFilteredStories, sortKey);
    } catch {
      return facetFilteredStories;
    }
  }, [contentLoaderMod, facetFilteredStories, sortKey]);

  const pagedStories = React.useMemo(
    () => displayedStories.slice(0, Math.min(visibleCount, displayedStories.length)),
    [displayedStories, visibleCount],
  );

  const hasMoreStories = displayedStories.length > pagedStories.length;

  const hasActiveFilters = React.useMemo(() => {
    try {
      if (contentLoaderMod && typeof contentLoaderMod.inspireFacetSelectionHasActive === "function") {
        return contentLoaderMod.inspireFacetSelectionHasActive(facetSelection);
      }
      return Object.values(facetSelection).some((arr) => Array.isArray(arr) && arr.length > 0);
    } catch {
      return false;
    }
  }, [contentLoaderMod, facetSelection]);

  const toggleFacet = React.useCallback((dim, value) => {
    setFacetSelection((prev) => {
      const cur = [...(prev[dim] || [])];
      const i = cur.indexOf(value);
      if (i >= 0) cur.splice(i, 1);
      else cur.push(value);
      return { ...prev, [dim]: cur };
    });
  }, []);

  const clearFacetSelection = React.useCallback(() => {
    setFacetSelection(emptyInspireFacetSelection());
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const inspireScript = document.querySelector('script[src*="inspire-app.jsx"]');
        const inspireAppUrl = inspireScript?.src
          ? new URL(inspireScript.src)
          : new URL("./inspire-app.jsx", window.location.href);
        const utilsBase = new URL("./src/utils/", inspireAppUrl);
        const dataHref = new URL("loadInspireStoriesData.js?v=5", utilsBase).href;
        const displayHref = new URL("inspireStoryDisplay.js?v=1", utilsBase).href;
        const [dataMod, displayMod] = await Promise.all([
          import(/* @vite-ignore */ dataHref),
          import(/* @vite-ignore */ displayHref),
        ]);

        if (cancelled) return;

        const mod = {
          ...displayMod,
          loadInspireStories: dataMod.loadInspireStories,
          loadStories: dataMod.loadStories,
          default: dataMod.default,
        };

        setContentLoaderMod(mod);

        const load = mod.loadInspireStories || mod.default;

        const list = await load();

        if (cancelled) return;

        setContentStories(list);
      } catch (e) {
        if (e instanceof Error) console.error("[loadInspireStories] failed", e.message);

        if (!cancelled) setContentStories([]);
      } finally {
        if (!cancelled) setContentStoriesReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderFacetGroups = () => {
    if (!facetOptions) return null;
    return INSPIRE_FACET_UI.map(({ dim, label }) => {
      const opts = facetOptions[dim] || [];
      if (!opts.length) return null;
      return (
        <details
          key={dim}
          className="group rounded-xl border border-slate-200 bg-slate-50/80 open:border-slate-200 open:bg-white open:shadow-sm"
        >
          <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100/80 [&::-webkit-details-marker]:hidden">
            {label}
          </summary>
          <div className="max-h-48 space-y-1.5 overflow-y-auto border-t border-slate-100 px-3 py-2.5">
            {opts.map((opt) => (
              <label
                key={`${dim}-${String(opt)}`}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg py-1 pl-0.5 pr-1 text-xs text-slate-700 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 size-3.5 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-300/80"
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
          {!contentStoriesReady
            ? "Loading stories…"
            : `Loaded ${contentStories.length} stories`}
        </p>

        <section className="grid w-full min-w-0 gap-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:gap-6 sm:p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8 md:pb-8">
          <div className="relative aspect-[4/3] min-h-[11rem] w-full overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[3/2] sm:min-h-0 sm:rounded-3xl md:aspect-auto md:h-64">
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">
              Featured hero image placeholder
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.5rem]">
                Inspire
              </h1>
              <p className="text-[15px] leading-relaxed text-slate-600 sm:text-sm">
                Real journeys behind the guides — built from 15 years of
                independent travel across 140 countries.
              </p>
              <p className="text-sm leading-relaxed text-slate-500">
                Routes tested in the real world, from Swiss alpine day trips to
                overland expeditions across continents.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Explore Guides
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                View Expeditions
              </button>
            </div>
          </div>
        </section>

        <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </button>
            <div className="hidden w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200 lg:block">
              <button
                type="button"
                className="flex w-full min-h-[44px] items-center justify-between px-3 py-2.5 text-left text-xs font-semibold text-slate-900 transition hover:bg-slate-50"
                onClick={() => setDesktopFiltersOpen((o) => !o)}
              >
                <span>Filters</span>
                <span aria-hidden className="text-slate-400">
                  {desktopFiltersOpen ? "−" : "+"}
                </span>
              </button>
              {desktopFiltersOpen ? (
                <div className="space-y-2.5 border-t border-slate-100 p-3 sm:p-3.5">
                  {renderFacetGroups()}
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={() => clearFacetSelection()}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Clear all filters
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <section className="w-full min-w-0 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 md:p-6">
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
          {contentStoriesReady && contentStories.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm font-medium tabular-nums text-slate-600">
                Showing {facetFilteredStories.length} stories
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => clearFacetSelection()}
                    className="rounded-full border border-transparent px-2 py-1 text-xs font-semibold text-slate-600 underline decoration-slate-400 decoration-1 underline-offset-4 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Clear all filters
                  </button>
                ) : null}
                <label htmlFor="inspire-sort" className="text-xs font-semibold text-slate-600">
                  Sort
                </label>
                <select
                  id="inspire-sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="min-h-[44px] min-w-[11rem] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:flex-none sm:min-h-0"
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
          </section>
        </div>


        <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Journeys I've actually done
          </p>
          <p className="max-w-xl text-sm text-slate-600">
            Cards load from <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">assets/public/Content/Inspire</code> via{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">stories-manifest.json</code>.
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
              description="Add folders to Content/Inspire and list them in stories-manifest.json with valid Meta-*.txt files. Cards will appear here automatically."
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
              description="Nothing in the current list matches those words. Try a shorter phrase, a place name, or clear the search to see everything again."
            >
              <button
                type="button"
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                }}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {pagedStories.map((story) =>
                  InspireStoryCardComponent ? (
                    <InspireStoryCardComponent
                      key={story.id}
                      story={story}
                      contentLoaderMod={contentLoaderMod}
                    />
                  ) : null,
                )}
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
        </section>

        <section className="grid w-full min-w-0 gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          {[
            "140 countries",
            "15 years of independent planning",
            "5/7 summits completed",
            "Routes tested with family and friends",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Explore by type of journey</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {collections.map((collection) => (
              <div
                key={collection.title}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="h-40 rounded-2xl bg-slate-100"></div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold">{collection.title}</h3>
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
            <h2 className="text-xl font-semibold">
              How I test the routes behind my guides
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              I don’t build routes from a desk. I test them in the field —
              through altitude, logistics, terrain, and real-world uncertainty.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {extremeExperiences.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-3 h-24 rounded-xl bg-slate-100"></div>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Ready to turn inspiration into a real route?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white">
              Browse Guides
            </button>
            <button className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700">
              Explore Destinations
            </button>
          </div>
        </section>
        <Footer />
        </div>
      </main>
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] max-w-[100vw] flex-col border-l border-slate-200 bg-[#f7f4ef] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
              <p className="text-sm font-semibold tracking-tight text-slate-900">Filters</p>
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] rounded-full text-xs font-semibold text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {renderFacetGroups()}
            </div>
            <div className="border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  clearFacetSelection();
                  setMobileFiltersOpen(false);
                }}
                className="min-h-[44px] w-full rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<InspirePage />);

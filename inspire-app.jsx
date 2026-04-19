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

const journeys = [
  {
    title: "Triftbrücke",
    category: "SWITZERLAND",
    slug: "triftbrucke",
    subtitle:
      "A big alpine day that feels like a mini-expedition — but is still completely doable from Zurich.",
    summary:
      "Sometimes the best hikes start with a simple plan: park the car and just walk.",
    coverImage:
      "/assets/public/20201018%20Triftbrucke/20201018_114417.jpg",
    coverAlt:
      "Triftbrücke suspension bridge above turquoise glacial water in the Bernese Alps",
    story: [
      "Sometimes the best hikes start with a simple plan: park the car and just walk.",
      "We reached the trailhead at 9:30 and skipped the gondola on purpose. If we were going to see Triftbrücke, we wanted to earn it properly. The climb is steady from the first steps, and within an hour the valley already feels far behind. One of those hikes where the landscape keeps getting bigger the higher you go.",
      "At 11:30 the bridge suddenly appeared above the turquoise glacier lake — hanging there between rock and ice like something unreal. The wind moved it slightly as we crossed, and for a moment it felt more like an expedition than a day trip from Zurich.",
      "15 km · 1,200 m ascent · 5.5 hours total",
      "A big alpine day, but completely doable — and exactly the kind of hike I keep suggesting when someone asks for something memorable without needing technical climbing skills.",
    ],
    effort:
      "A full mountain day on marked trails — steady climbing, exposed bridge crossing, and a long descent. Comfortable with heights helps.",
    guide:
      "The route plan covers timing, transport, what to carry, and how to structure the day so the climb and crossing feel controlled rather than rushed.",
    guideHref: "guides/trift-bridge-from-zurich.html",
    guideLabel: "View Guide",
    images: [
      "Triftbrücke suspension bridge",
      "Glacier valley approach",
      "Bridge crossing close-up",
      "Triftsee alpine landscape",
    ],
  },
  {
    title: "National Three Peaks Challenge",
    category: "UNITED KINGDOM",
    slug: "three-peaks-challenge",
    subtitle:
      "Three highest peaks. One day. 38 km of hiking, 750 km of driving between mountains, almost no sleep, and a finish with seven minutes to spare.",
    summary:
      "Three highest peaks. One day. Almost no sleep, 750 km of driving between mountains, and seven minutes to spare.",
    coverImage:
      "/assets/public/20231111%20Three%20Peaks%20Challenge/20231112_104207.jpg",
    coverAlt:
      "Sunlit rocky summit slopes on the National Three Peaks Challenge in the UK",
    galleryImages: [
      {
        src: "/assets/public/20231111%20Three%20Peaks%20Challenge/20231112_021731.jpg",
        alt: "Pre-dawn hours on the road during the National Three Peaks Challenge",
      },
      {
        src: "/assets/public/20231111%20Three%20Peaks%20Challenge/20231112_090239.jpg",
        alt: "Mountain trail and ridgeline in clear morning light between peaks",
      },
      {
        src: "/assets/public/20231111%20Three%20Peaks%20Challenge/20231111_154031.jpg",
        alt: "Late-afternoon light on rocky peaks during the cross-UK challenge",
      },
      {
        src: "/assets/public/20231111%20Three%20Peaks%20Challenge/20231112_135431.jpg",
        alt: "Mist and heavy weather on the upper slopes near the end of the challenge",
      },
    ],
    story: [
      "Climb the highest mountains of Scotland, England, and Wales in 24 hours. It sounds manageable on paper — until you realize it also means hundreds of kilometers of driving, almost no sleep, and no room for mistakes.",
      "We left London at 3:30 in the morning right after a birthday dinner and drove straight north with one essential stop for fish and chips somewhere along the way. By 12:53 we were standing at the base of Ben Nevis, starting the clock.",
      "The first climb felt surprisingly smooth. The weather was clear, the pace was strong, and reaching the highest point in Scotland just before sunset felt like the perfect start. For a moment it almost seemed too easy. We were ahead of schedule and already thinking this challenge might actually work. There was no time to stay long though — two mountains still waiting.",
      "Four hours later we arrived at Scafell Pike.",
      "That's where things became more interesting. No mobile reception. No map. Several peaks nearby that all looked roughly the same height. It took about half an hour just to figure out which direction to go before we could even start the second ascent. By midnight we were finally moving again, climbing through darkness with only headlamps lighting the path.",
      "Halfway up we reached snow and icy sections. The summit itself was completely invisible — just black sky in every direction. Somewhere up there we reached the top of England without seeing anything at all. At that point the challenge already felt very real. Two mountains done, but energy levels were dropping fast, and it was around 4:30 in the morning.",
      "All we really wanted was sleep.",
      "Instead, we got back into the car.",
      "We knew we had to begin the final climb by 8:30 if we wanted any chance of finishing within 24 hours. Somehow we reached the base of Snowdon ten minutes before the deadline. Starting the last ascent at 8:25 felt like a small victory already. The mood was still good, but the legs were definitely slower than the day before.",
      "About an hour into the climb the rain started. Then the wind picked up. Soon we were completely soaked and not even halfway to the summit. For the first time during the challenge we seriously considered turning around. But then we met hikers descending who told us the top was close.",
      "That was enough motivation to keep going.",
      "We reached the summit after 2 hours and 20 minutes. No views this time either — just fog, rain, and wind. Still, it meant the challenge was possible. Now everything depended on getting back down fast enough.",
      "Descending should have been easy, but wet rocks made the trail slippery and slow. There was no shelter anywhere on the mountain, just steady rain and the clock running. Local hikers passed us looking completely relaxed in the weather while we pushed the pace as much as we could with the last energy we had left.",
      "When the parking lot finally appeared, we checked the time.",
      "12:46.",
      "Seven minutes to spare.",
      "3,000 m ascent · 38 km hiking · 750 km driving between peaks · 1,250 km extra from and back to London · sleep: almost none",
      "It was chaotic, exhausting, slightly improvised at times — and one of the most memorable mountain challenges I've ever done. The kind of experience that sounds unrealistic before you start, and completely obvious afterwards. Just three mountains in one day. How hard can it be?",
    ],
    effort:
      "24 hours door-to-door: three national high points, night navigation under pressure, and a final climb in heavy rain with almost no sleep banked.",
    guide:
      "No standalone guide for this route yet — the story is the record of what broke, what held, and how tight the clock really was.",
    images: [],
  },
  {
    title: "Stoos Ridge from Zurich",
    category: "Switzerland",
    slug: "stoos-ridge",
    subtitle:
      "A clean panoramic ridge walk with constant views and a real sense of a mountain traverse.",
    summary:
      "One of the most scenic ridge walks in Switzerland, with big views and no technical difficulty.",
    story: [
      "The Stoos Ridge is one of the cleanest panoramic ridge walks in Switzerland that still works as a straightforward day trip.",
      "The route follows the ridge between Klingenstock and Fronalpstock with open views across Lake Lucerne and the surrounding mountains almost the entire way. It looks dramatic but remains comfortable for anyone used to marked alpine trails.",
      "What makes this walk especially useful in a Switzerland itinerary is how accessible it is compared with other ridge routes that appear similar on the map. You get the feeling of a real mountain traverse without needing special equipment or a full expedition day.",
      "This route fits well when the goal is a high-reward hiking day with consistent views from start to finish.",
    ],
    effort:
      "A moderate hike on marked mountain trails with steady uphill and downhill sections.",
    guide:
      "The guide explains how I usually structure the day and what to prepare in advance so the route works smoothly.",
    guideHref: "guides/stoos-ridge-from-zurich.html",
    guideLabel: "View Guide",
    images: [
      "Stoos ridge walkway",
      "Lake Lucerne panorama",
      "Klingenstock ridgeline",
    ],
  },
  {
    title: "Appenzell & Ebenalp from Zurich",
    category: "Switzerland",
    slug: "appenzell-ebenalp",
    subtitle:
      "A classic Swiss mountain day with village charm, cliffs, and a lake finish.",
    summary:
      "A classic Swiss mountain day with cable cars, cliffs, Aescher, and Seealpsee.",
    story: [
      "The Appenzell and Ebenalp route combines several different parts of a typical Swiss mountain landscape into one compact day.",
      "It starts with the village atmosphere of Appenzell, continues by cable car to Ebenalp, passes the Aescher guesthouse built into the rock face, and then leads down toward Seealpsee, one of the most beautiful alpine lakes in the region.",
      "What makes this route interesting is the variety. Instead of focusing on a single summit or viewpoint, the day includes village scenery, cliffs, mountain trails, and a proper alpine lake.",
      "Compared with some of the better-known areas in central Switzerland, the region also feels more local and less crowded.",
      "This works well for travelers who want a balanced mountain day with different landscapes rather than a single up-and-down hike.",
    ],
    effort:
      "A moderate hike on standard mountain trails with some steeper downhill sections.",
    guide:
      "The guide explains how I usually combine Appenzell, Ebenalp, Aescher, and Seealpsee into one smooth day without unnecessary transport changes.",
    guideHref: "guides/appenzell-ebenalp-from-zurich.html",
    guideLabel: "View Guide",
    images: [
      "Appenzell village start",
      "Aescher cliffside stop",
      "Seealpsee alpine lake",
    ],
  },
  {
    title: "Mount Rigi from Zurich",
    category: "Switzerland",
    summary:
      "A flexible mountain day combining train, boat, and panoramic viewpoints.",
  },
  {
    title: "Iceland Ring Road",
    category: "Country Route",
    summary:
      "A self-guided route built around landscapes, pacing, and weather logic.",
  },
  {
    title: "South Island New Zealand",
    category: "Country Route",
    summary: "A route shaped by road-trip flow, not just top sights.",
  },
  {
    title: "Mongol Rally",
    category: "Expedition",
    summary: "A self-organized crossing built around uncertainty and logistics.",
  },
  {
    title: "Africa Overland Route",
    category: "Expedition",
    summary: "Long-distance driving, difficult borders, and route adaptation.",
  },
  {
    title: "Seven Summits Journey",
    category: "Mountains",
    summary:
      "A long-term mountain goal built through logistics, acclimatization, and patience.",
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
  { dim: "continent", label: "Continent" },
  { dim: "country", label: "Country" },
  { dim: "duration", label: "Duration" },
  { dim: "activity", label: "Activity type" },
  { dim: "difficulty", label: "Difficulty" },
  { dim: "suitableFor", label: "Suitable for" },
  { dim: "season", label: "Season" },
  { dim: "budget", label: "Budget" },
  { dim: "guide", label: "Guide available" },
];

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
  const [activeStory, setActiveStory] = React.useState(null);

  const [contentStories, setContentStories] = React.useState([]);

  const [contentStoriesReady, setContentStoriesReady] = React.useState(false);

  const [contentLoaderMod, setContentLoaderMod] = React.useState(null);

  const [searchInput, setSearchInput] = React.useState("");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const [sortKey, setSortKey] = React.useState("recent");

  const [facetSelection, setFacetSelection] = React.useState(emptyInspireFacetSelection);

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const [desktopFiltersOpen, setDesktopFiltersOpen] = React.useState(true);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 260);

    return () => window.clearTimeout(t);
  }, [searchInput]);

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
        const mod = await import("./src/utils/loadInspireStories.js");

        if (cancelled) return;

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
      {React.createElement(window.SiteHeader)}
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-6 text-slate-900 sm:gap-12 sm:px-6 sm:pt-8">
        <p className="text-xs font-medium tracking-wide text-slate-500">
          {!contentStoriesReady
            ? "Loading stories…"
            : `Loaded ${contentStories.length} stories`}
        </p>

        <section className="grid gap-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:gap-6 sm:p-6 md:grid-cols-[1.15fr_0.85fr] md:p-8 md:pb-8">
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

        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </button>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200 lg:block">
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

          <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
            <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5 md:p-6">
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
                  <option value="oldest">Oldest</option>
                  <option value="alpha">Alphabetical</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
          ) : null}
            </section>


        <section className="space-y-5 sm:space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Featured journeys</p>
          </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {displayedStories.map((story) => {
                const {
                  geoLabel: geo,
                  categoryDurationLine: catDur,
                  difficultyLabel: diff,
                  hasGuide,
                  heroAlt,
                } = contentLoaderMod.getInspireFeaturedCardDisplay(story);

                const shellInteractive =
                  "group flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300/90";
                const shellStatic =
                  "flex h-full min-h-[19rem] flex-col overflow-hidden rounded-3xl bg-white opacity-[0.96] shadow-sm ring-1 ring-slate-200/90";

                const cardInner = (
                  <>
                    <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[16/10]">
                      {story.heroPhoto ? (
                        <img
                          src={story.heroPhoto}
                          alt={heroAlt}
                          className="h-full w-full object-cover object-center transition duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full min-h-[9.5rem] w-full items-center justify-center bg-slate-100 text-[11px] font-medium text-slate-400">
                          No photo
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2.5 p-5 sm:gap-3">
                      {geo ? (
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{geo}</p>
                      ) : null}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight text-slate-900">
                          {story.title}
                        </p>
                        {hasGuide ? (
                          <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Guide
                          </span>
                        ) : null}
                      </div>
                      {catDur ? (
                        <p className="text-sm leading-snug text-slate-600">{catDur}</p>
                      ) : null}
                      {diff ? (
                        <p className="mt-auto text-xs leading-snug text-slate-500">{diff}</p>
                      ) : null}
                    </div>
                  </>
                );

                const cardHref =
                  typeof contentLoaderMod.getInspireStoryListCardHref === "function"
                    ? contentLoaderMod.getInspireStoryListCardHref(story)
                    : "";

                return cardHref ? (
                  <a
                    key={story.id}
                    id={story.slug ? `featured-${story.slug}` : undefined}
                    href={cardHref}
                    className={`${shellInteractive} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400`}
                  >
                    {cardInner}
                  </a>
                ) : (
                  <div
                    key={story.id}
                    id={story.slug ? `featured-${story.slug}` : undefined}
                    className={`${shellStatic} cursor-default`}
                    aria-label="This story is not available to open yet"
                  >
                    {cardInner}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
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

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Journeys I've actually done</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <div
                key={journey.title}
                id={journey.slug ? `journey-${journey.slug}` : undefined}
                className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-100">
                  {journey.coverImage ? (
                    <img
                      src={journey.coverImage}
                      alt={journey.coverAlt || journey.title}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className="mt-4 flex flex-1 flex-col space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {journey.category}
                  </p>
                  <h3 className="text-lg font-semibold">{journey.title}</h3>
                  <p className="text-sm text-slate-600">
                    {journey.summary}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    <button
                      className={`rounded-full px-4 py-2 text-xs font-semibold ${
                        journey.story
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                      disabled={!journey.story}
                      onClick={() => setActiveStory(journey)}
                      type="button"
                    >
                      Read Story
                    </button>
                    {journey.guideHref ? (
                      <a
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                        href={journey.guideHref}
                      >
                        {journey.guideLabel || "View Guide"}
                      </a>
                    ) : (
                      <span className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
                        Guide in Progress
                      </span>
                    )}
                  </div>
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
            </p>
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
      {activeStory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-6 py-10">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {activeStory.category}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {activeStory.title}
                </p>
              </div>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                onClick={() => setActiveStory(null)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100">
                  {activeStory.coverImage ? (
                    <img
                      src={activeStory.coverImage}
                      alt={activeStory.coverAlt || activeStory.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-400">
                      {activeStory.images?.[0] || "Story hero image"}
                    </div>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeStory.galleryImages?.length
                    ? activeStory.galleryImages.map((shot) => (
                        <div
                          key={shot.src}
                          className="relative h-32 overflow-hidden rounded-2xl bg-slate-100"
                        >
                          <img
                            src={shot.src}
                            alt={shot.alt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))
                    : activeStory.images?.slice(1).map((label) => (
                        <div
                          key={label}
                          className="relative h-32 overflow-hidden rounded-2xl bg-slate-100"
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-slate-400">
                            {label}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    {activeStory.subtitle}
                  </p>
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  {activeStory.story?.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                <div className="space-y-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Effort level
                    </p>
                    <p className="mt-1">{activeStory.effort}</p>
                  </div>
                  {activeStory.guide ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {activeStory.guideHref ? "Guide available" : "Route notes"}
                      </p>
                      <p className="mt-1">{activeStory.guide}</p>
                    </div>
                  ) : null}
                </div>
                {activeStory.guideHref ? (
                  <a
                    className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white"
                    href={activeStory.guideHref}
                  >
                    {activeStory.guideLabel || "View Guide"}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<InspirePage />);

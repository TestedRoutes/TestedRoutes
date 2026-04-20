import * as React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { loadInspireStories } from "../utils/loadInspireStories.js";
import {
  getInspireFeaturedCardDisplay,
  projectInspireStoryFacetValues,
} from "../utils/inspireStoryDisplay.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

function markdownToSafeHtml(md) {
  if (typeof md !== "string" || !md.trim()) return "";
  try {
    const raw = marked.parse(md, { breaks: true, gfm: true });
    if (typeof raw !== "string") return "";
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
  } catch {
    return "";
  }
}

function readInspireStorySlugFromLocation() {
  try {
    const p = new URLSearchParams(window.location.search);
    let s = (p.get("slug") || "").trim();
    if (!s) return "";
    try { s = decodeURIComponent(s); } catch { /* keep s */ }
    return s;
  } catch {
    return "";
  }
}

function normSlug(s) {
  return String(s || "").trim().toLowerCase();
}

// Same grouping logic as Inspire.jsx – keep in sync if you update categories there
const ACTIVITY_GROUPS = [
  { key: "Mountains", label: "Mountains, Summits & Hiking", buckets: ["Summit", "Hike"], patterns: [/toubkal|three.?peaks|s.ntis|triftbr|alpine.?pass|appenzell|ebenalp|hike.*geneva/i] },
  { key: "Water",    label: "Water & Ocean",               buckets: ["Diving", "Swimming"], patterns: [/cebu|bohol|philippine/i] },
  { key: "Islands",  label: "Islands",                     buckets: [], patterns: [/tuvalu|bioko/i] },
  { key: "RoadTrip", label: "Road Trips",                  buckets: ["Road Trip"], patterns: [/morocco/i] },
  { key: "Expedition", label: "Expeditions",               buckets: ["Expedition"], patterns: [/nigeria|africa.?rally|crossing/i] },
  { key: "Weekend",  label: "Weekend Escapes",             buckets: [], patterns: [/diavolezza|montreux|jazz|bad.?ragaz|morcote|lugano/i] },
  { key: "Cities",   label: "City Trips",                  buckets: [], patterns: [/st[.\s]*gallen|luzern|lucerne|\bzurich\b|lausanne/i] },
  { key: "Extreme",  label: "Extreme Experiences",         buckets: ["Extreme Sport"], patterns: [] },
];

function findStoryGroup(story) {
  try {
    const vals = projectInspireStoryFacetValues(story);
    const acts = vals.activity || [];
    const text = `${story.title || ""} ${story.folderName || ""}`;
    for (const g of ACTIVITY_GROUPS) {
      const bucketMatch = g.buckets.some((b) => acts.includes(b));
      const patternMatch = g.patterns?.some((p) => p.test(text)) ?? false;
      if (bucketMatch || patternMatch) return g;
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Small reusable pieces ───────────────────────────────────────────────────

function GalleryImage({ src, alt }) {
  const [ok, setOk] = React.useState(true);
  if (!ok) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 text-[11px] font-medium text-slate-400">
        Unavailable
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/3] w-full rounded-2xl object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

function SimilarStoryCard({ story }) {
  const slug = story.slug || "";
  const href = slug ? `inspire-story.html?slug=${encodeURIComponent(slug)}` : null;
  const title = story.title || "";
  const display = getInspireFeaturedCardDisplay(story);
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

function SimilarStoriesRow({ stories, groupLabel }) {
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
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-slate-900">More from {groupLabel}</h2>
        <a
          href="inspire.html"
          className="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
        >
          See all →
        </a>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="no-scrollbar flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
        >
          {stories.map((s) => (
            <SimilarStoryCard key={s.id || s.slug} story={s} />
          ))}
        </div>
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="absolute -left-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="absolute -right-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition hover:shadow-xl active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InspireStoryPage() {
  const [urlSlug] = React.useState(() => readInspireStorySlugFromLocation());
  const [phase, setPhase] = React.useState(() => (urlSlug ? "loading" : "notfound"));
  const [story, setStory] = React.useState(null);
  const [allStories, setAllStories] = React.useState([]);

  React.useEffect(() => {
    if (!urlSlug) { setPhase("notfound"); setStory(null); return undefined; }
    let cancelled = false;
    (async () => {
      try {
        const list = await loadInspireStories();
        if (cancelled) return;
        const target = normSlug(urlSlug);
        const found = Array.isArray(list) ? list.find((x) => normSlug(x && x.slug) === target) : null;
        if (!found) { setStory(null); setPhase("notfound"); return; }
        setAllStories(Array.isArray(list) ? list : []);
        setStory(found);
        setPhase("ready");
      } catch {
        if (!cancelled) { setStory(null); setPhase("notfound"); }
      }
    })();
    return () => { cancelled = true; };
  }, [urlSlug]);

  React.useEffect(() => {
    if (phase === "ready" && story?.title) {
      document.title = `Pikelis Travel · ${story.title.trim()}`;
    } else {
      document.title = "Pikelis Travel · Story";
    }
  }, [phase, story]);

  // Display fields (geo, duration, difficulty, guide, excerpt – no date)
  const display = React.useMemo(() => {
    if (!story) return { geoLabel: "", categoryDurationLine: "", difficultyLabel: "", hasGuide: false, guideUrl: "", heroAlt: "Story", excerpt: "" };
    return getInspireFeaturedCardDisplay(story);
  }, [story]);

  const currentGroup = React.useMemo(() => (story ? findStoryGroup(story) : null), [story]);

  const similarStories = React.useMemo(() => {
    if (!story || !currentGroup || !allStories.length) return [];
    return allStories
      .filter((s) => {
        if (normSlug(s.slug) === normSlug(story.slug)) return false;
        const g = findStoryGroup(s);
        return g && g.key === currentGroup.key;
      })
      .slice(0, 8);
  }, [story, currentGroup, allStories]);

  const bodyHtml = React.useMemo(() => {
    if (!story || typeof story.storyContent !== "string") return "";
    return markdownToSafeHtml(story.storyContent);
  }, [story]);

  // Photos
  const photoUrls = story && Array.isArray(story.photos) ? story.photos.filter(Boolean) : [];
  const heroSrc = story?.heroPhoto || "";
  const galleryUrls = heroSrc && photoUrls[0] === heroSrc ? photoUrls.slice(1) : photoUrls.slice();

  // Best season from metadata (no year, just season names)
  const bestSeasonRaw =
    story?.metadata?.timing?.best_seasons ??
    story?.metadata?.timing?.seasons ??
    story?.metadata?.best_seasons;
  const bestSeasonLabel = Array.isArray(bestSeasonRaw)
    ? bestSeasonRaw.filter((x) => typeof x === "string" && x).join(", ")
    : typeof bestSeasonRaw === "string" ? bestSeasonRaw.trim() : "";

  const guideHref = display.guideUrl || "";

  // Mobile sticky bottom bar: slides up once the hero scrolls out of view
  const heroRef = React.useRef(null);
  const [showStickyBar, setShowStickyBar] = React.useState(false);
  React.useEffect(() => {
    if (!story) return;
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [story]);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <SiteHeader />

      {/* Loading */}
      {phase === "loading" ? (
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <div className="mx-auto h-1.5 max-w-[10rem] animate-pulse rounded-full bg-slate-200" />
          <p className="mt-5 text-sm font-medium text-slate-600">Loading this journey…</p>
          <p className="mt-1 text-xs text-slate-500">Resolving story content from your library.</p>
        </div>
      ) : null}

      {/* Not found */}
      {phase === "notfound" ? (
        <div className="mx-auto max-w-6xl px-6 py-20">
          <section className="rounded-[28px] border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-6 py-14 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-10">
            <p className="text-lg font-semibold tracking-tight text-slate-900">Story not found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              The link may be wrong, the story may have moved, or it is not in the manifest anymore.
            </p>
            <a
              href="inspire.html"
              className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to Inspire
            </a>
          </section>
        </div>
      ) : null}

      {/* Story ready */}
      {phase === "ready" && story ? (
        <>
          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <div ref={heroRef} className="relative w-full overflow-hidden bg-slate-800" style={{ minHeight: 440 }}>
            {heroSrc ? (
              <img
                src={heroSrc}
                alt={display.heroAlt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ minHeight: 440 }}
                loading="eager"
                decoding="async"
              />
            ) : null}
            {/* Gradient overlay – heavier at the bottom so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/92 via-slate-900/45 to-slate-900/10" />

            {/* Content positioned over the overlay */}
            <div
              className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14 md:pt-32"
              style={{ minHeight: 440 }}
            >
              {/* Breadcrumb */}
              <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-white/60" aria-label="Breadcrumb">
                <a href="inspire.html" className="transition hover:text-white">Inspire</a>
                {currentGroup ? (
                  <>
                    <span className="text-white/30">/</span>
                    <span className="text-white/50">{currentGroup.label}</span>
                  </>
                ) : null}
              </nav>

              {/* Title */}
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                {story.title}
              </h1>

              {/* Tagline – excerpt from story text */}
              {display.excerpt ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base line-clamp-2 md:line-clamp-none">
                  {display.excerpt}
                </p>
              ) : null}

              {/* Meta pills row – no dates */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {display.geoLabel ? (
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    📍 {display.geoLabel}
                  </span>
                ) : null}
                {display.categoryDurationLine ? (
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    ⏱ {display.categoryDurationLine}
                  </span>
                ) : null}
                {display.difficultyLabel ? (
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    💪 {display.difficultyLabel}
                  </span>
                ) : null}
                {guideHref ? (
                  <a
                    href={guideHref}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    📖 Full guide available ↓
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
            <div className="flex gap-8">

              {/* ── Left column: story body + gallery ── */}
              <div className="min-w-0 flex-1 flex flex-col gap-6 self-start">

                {/* Quick facts – mobile only (desktop sees sidebar) */}
                <div className="md:hidden rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quick Facts</p>
                  <dl className="flex flex-col gap-2.5">
                    {display.geoLabel ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📍</span>
                        <dd className="text-sm text-slate-700">{display.geoLabel}</dd>
                      </div>
                    ) : null}
                    {display.categoryDurationLine ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⏱</span>
                        <dd className="text-sm text-slate-700">{display.categoryDurationLine}</dd>
                      </div>
                    ) : null}
                    {display.difficultyLabel ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💪</span>
                        <dd className="text-sm text-slate-700">{display.difficultyLabel}</dd>
                      </div>
                    ) : null}
                    {bestSeasonLabel ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌤</span>
                        <dd className="text-sm text-slate-700">Best season: {bestSeasonLabel}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <a
                    href={guideHref || "guides.html"}
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    {guideHref ? "Read the full guide →" : "Browse all guides →"}
                  </a>
                </div>

                {/* Story body */}
                <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
                  {bodyHtml ? (
                    <div
                      className="inspire-story-prose max-w-none text-slate-800 [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-relaxed [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-slate-100 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                      dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">No story text yet</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Markdown will appear here when a Story-*.md file is available for this journey.
                      </p>
                    </div>
                  )}
                </section>

                {/* Gallery */}
                {galleryUrls.length ? (
                  <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Gallery</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {galleryUrls.map((url, i) => (
                        <GalleryImage key={`${i}-${url}`} src={url} alt={display.heroAlt} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              {/* ── Right column: sticky sidebar (desktop only) ── */}
              <div className="hidden w-72 shrink-0 md:block">
                <div className="sticky top-[88px] flex flex-col gap-4">

                  {/* Guide CTA card – specific guide if available, otherwise generic */}
                  <div className="rounded-[20px] bg-slate-900 p-6 text-white shadow-lg">
                    {guideHref ? (
                      <>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                          Planning this trip?
                        </p>
                        <p className="text-base font-semibold leading-snug">{story.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-white/60">
                          The full guide covers permits, gear, logistics, costs and everything you need to plan this yourself.
                        </p>
                        <a
                          href={guideHref}
                          className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Read the full guide →
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                          Turn inspiration into a plan
                        </p>
                        <p className="text-base font-semibold leading-snug">Pikelis Travel Guides</p>
                        <p className="mt-2 text-xs leading-relaxed text-white/60">
                          Route-tested guides built from 15 years of independent travel. PDF format, works offline.
                        </p>
                        <a
                          href="guides.html"
                          className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Browse all guides →
                        </a>
                      </>
                    )}
                  </div>

                  {/* Quick facts card */}
                  <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Quick Facts</p>
                    <dl className="flex flex-col gap-3">
                      {display.geoLabel ? (
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-base leading-none">📍</span>
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Location</dt>
                            <dd className="text-sm text-slate-700">{display.geoLabel}</dd>
                          </div>
                        </div>
                      ) : null}
                      {display.categoryDurationLine ? (
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-base leading-none">⏱</span>
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Journey</dt>
                            <dd className="text-sm text-slate-700">{display.categoryDurationLine}</dd>
                          </div>
                        </div>
                      ) : null}
                      {display.difficultyLabel ? (
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-base leading-none">💪</span>
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Difficulty</dt>
                            <dd className="text-sm text-slate-700">{display.difficultyLabel}</dd>
                          </div>
                        </div>
                      ) : null}
                      {bestSeasonLabel ? (
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-base leading-none">🌤</span>
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Best Season</dt>
                            <dd className="text-sm text-slate-700">{bestSeasonLabel}</dd>
                          </div>
                        </div>
                      ) : null}
                    </dl>
                  </div>

                </div>
              </div>
            </div>

            {/* ── Guide CTA – full-width block below story ── */}
            {guideHref ? (
              <div className="mt-10 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 md:flex md:items-center md:justify-between md:gap-8">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ready to plan?</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
                    Planning your own {story.title}?
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                    The full guide covers everything – permits, agencies, gear list, route logistics, costs and the key lessons from doing this for real.
                  </p>
                </div>
                <div className="mt-6 shrink-0 md:mt-0">
                  <a
                    href={guideHref}
                    className="inline-flex rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Read the guide →
                  </a>
                </div>
              </div>
            ) : null}

            {/* ── Similar stories ── */}
            {similarStories.length && currentGroup ? (
              <SimilarStoriesRow stories={similarStories} groupLabel={currentGroup.label} />
            ) : null}

            {/* ── Dark conversion block – matches guide page bottom ── */}
            <div className="mt-12 rounded-[28px] bg-[#1a1816] px-8 py-12 text-center text-white">
              <p className="font-serif text-2xl font-semibold leading-snug sm:text-3xl">
                Travel more.<br />Waste less time planning.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                Premium travel guides built from 15 years of independent travel across 140 countries.
              </p>
              <p className="mt-1 text-sm font-medium italic text-slate-300">"AI hasn't been there. I have."</p>
              <div className="mt-7 flex flex-col items-center gap-3">
                {guideHref ? (
                  <a
                    href={guideHref}
                    className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100"
                  >
                    Get the {story.title} guide →
                  </a>
                ) : (
                  <a
                    href="guides.html"
                    className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100"
                  >
                    Browse all guides →
                  </a>
                )}
                <p className="text-xs text-slate-500">PDF · Instant download · 30-day refund</p>
              </div>
            </div>
          </main>

          {/* ── Mobile sticky bottom bar – slides up after hero leaves view ── */}
          <div
            className={
              "fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200 bg-white/96 backdrop-blur-md transition-transform duration-300 " +
              (showStickyBar ? "translate-y-0" : "translate-y-full")
            }
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {guideHref ? "Planning this trip?" : "Ready to plan?"}
                </p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {guideHref ? story.title : "Pikelis Travel Guides"}
                </p>
              </div>
              <a
                href={guideHref || "guides.html"}
                className="shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                {guideHref ? "Get the guide →" : "Browse guides →"}
              </a>
            </div>
          </div>
        </>
      ) : null}

      <div className="mx-auto max-w-6xl px-6">
        <SiteFooter />
      </div>
    </div>
  );
}

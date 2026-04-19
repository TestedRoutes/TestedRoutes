import * as React from "react";

export default function InspireStoryCard({ story, contentLoaderMod }) {
  const {
    geoLabel: geo,
    categoryDurationLine: catDur,
    difficultyLabel: diff,
    guideUrl,
    heroAlt,
    excerpt,
  } = contentLoaderMod.getInspireFeaturedCardDisplay(story);

  const slug = typeof story.slug === "string" && story.slug.trim() ? story.slug.trim() : "";
  const exploreHref = slug ? `inspire-story.html?slug=${encodeURIComponent(slug)}` : "";
  const hasGuide = Boolean(guideUrl);

  const familyFriendly =
    story.metadata?.suitability?.family_friendly === true ||
    story.metadata?.suitability?.family_friendly === "true";

  return (
    <div
      id={story.slug ? `featured-${story.slug}` : undefined}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
    >
      {/* Hero image — fixed aspect ratio so all cards line up */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100">
        {story.heroPhoto ? (
          <img
            src={story.heroPhoto}
            alt={heroAlt}
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] font-medium text-slate-400">
            No photo
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5 gap-2">
        {geo && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            {geo}
          </p>
        )}

        <p className="line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight text-slate-900">
          {story.title}
        </p>

        {catDur && (
          <p className="text-sm leading-snug text-slate-600">{catDur}</p>
        )}

        {excerpt && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{excerpt}</p>
        )}

        {/* Tags row */}
        {(diff || familyFriendly) && (
          <div className="flex flex-wrap items-center gap-2">
            {diff && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <span aria-hidden>🥾</span>
                {diff}
              </span>
            )}
            {familyFriendly && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                <span aria-hidden>👨‍👩‍👧</span>
                Family
              </span>
            )}
          </div>
        )}

        {/* Action buttons — always pinned to bottom */}
        <div className="mt-auto flex gap-2 pt-3">
          {exploreHref ? (
            <a
              href={exploreHref}
              className="flex-1 rounded-xl bg-slate-900 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Explore
            </a>
          ) : (
            <span className="flex-1 cursor-default rounded-xl bg-slate-100 py-2 text-center text-sm font-medium text-slate-400">
              Explore
            </span>
          )}

          {hasGuide ? (
            <a
              href={guideUrl}
              className="flex-1 rounded-xl border border-slate-300 py-2 text-center text-sm font-medium text-slate-700 transition hover:border-slate-600 hover:text-slate-900"
            >
              Guide
            </a>
          ) : (
            <span
              className="flex-1 cursor-not-allowed rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-300"
              title="No guide available yet"
            >
              Guide
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

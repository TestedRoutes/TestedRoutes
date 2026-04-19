/**
 * Featured Inspire story card (React). Loaded before inspire-app.jsx; exposes `InspireStoryCard` on window.
 * @param {{ story: object, contentLoaderMod: object }} props
 */
function InspireStoryCard({ story, contentLoaderMod }) {
  const {
    geoLabel: geo,
    categoryDurationLine: catDur,
    difficultyLabel: diff,
    hasGuide,
    heroAlt,
    excerpt,
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
        {catDur ? <p className="text-sm leading-snug text-slate-600">{catDur}</p> : null}
        {excerpt ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{excerpt}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {diff ? (
            <span className="inline-flex items-center gap-1 text-xs leading-snug text-slate-500">
              <span aria-hidden>🥾</span>
              {diff}
            </span>
          ) : null}
          {story.metadata &&
          story.metadata.suitability &&
          (story.metadata.suitability.family_friendly === true ||
            story.metadata.suitability.family_friendly === "true") ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
              <span aria-hidden>👨‍👩‍👧</span>
              Family
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  const cardHref =
    typeof contentLoaderMod.getInspireStoryListCardHref === "function"
      ? contentLoaderMod.getInspireStoryListCardHref(story)
      : "";

  if (cardHref) {
    return (
      <a
        id={story.slug ? `featured-${story.slug}` : undefined}
        href={cardHref}
        className={`${shellInteractive} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400`}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <div
      id={story.slug ? `featured-${story.slug}` : undefined}
      className={`${shellStatic} cursor-default`}
      aria-label="This story is not available to open yet"
    >
      {cardInner}
    </div>
  );
}

window.InspireStoryCard = InspireStoryCard;

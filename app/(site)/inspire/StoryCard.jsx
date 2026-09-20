"use client";

import Link from "next/link";
import CardMediaCarousel, { buildMediaSlides } from "../../_components/CardMediaCarousel";

/**
 * The Inspire story card, as it was inside InspireBrowse until 2026-09-20.
 * Its own file so the gated reader's Inspire tab (a country's stories) shows
 * the same card as /inspire; the card shape comes from buildInspireCard in
 * inspireIndexPage.jsx. `t` is the inspireList dictionary.
 */
export default function StoryCard({ card, t }) {
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

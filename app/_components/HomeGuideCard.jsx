"use client";

import Link from "next/link";
import CardMediaCarousel, { PLAYABLE_VIDEO } from "./CardMediaCarousel";

export default function HomeGuideCard({ guide }) {
  const images = guide.images || (guide.image ? [guide.image] : []);
  const video = guide.video || (guide.videoUrl ? { url: guide.videoUrl } : null);
  const playableVideo =
    video?.url && PLAYABLE_VIDEO.test(video.url) ? video : null;
  const slides = [
    ...(playableVideo
      ? [{ type: "video", src: playableVideo.url, poster: playableVideo.poster || images[0] }]
      : []),
    ...images.map((src) => ({ type: "image", src })),
  ];

  const cardClass = `group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition${
    guide.coming_soon ? "" : " hover:-translate-y-1 hover:shadow-md"
  }`;

  // The whole card navigates to the guide page; the carousel arrows
  // preventDefault so swiping/paging never triggers navigation.
  const clickable = !guide.coming_soon && guide.href;
  const Wrapper = clickable ? Link : "div";
  const wrapperProps = clickable ? { href: guide.href } : {};

  return (
    <Wrapper {...wrapperProps} className={cardClass}>
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {guide.coming_soon ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Coming soon
            </span>
          </div>
        ) : (
          <CardMediaCarousel
            slides={slides}
            alt={guide.title}
            imgClassName="transition duration-300 group-hover:scale-105"
            eagerFirstSlide
          />
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {guide.category.toUpperCase()}
        </p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">
          {guide.duration} • {guide.meta}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-slate-900">From {guide.price}</span>
          {guide.coming_soon ? (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">
              Coming soon
            </span>
          ) : (
            <span className="rounded-full bg-brand-terracotta px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-brand-terracotta/90">
              View Guide
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

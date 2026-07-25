"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Photo carousel for destination hub pages.
 *
 * Sibling to the guide carousel, but tuned for a different job: guide slides
 * are portrait page exports at mixed ratios (fixed height, variable width),
 * while destination photos are a uniform landscape set straight off the trip.
 * So slides here share a fixed 4:3 frame — every source photo is already 4:3,
 * which means object-cover crops nothing and the rhythm stays even.
 *
 * Swipeable on mobile (scroll-snap), arrows on desktop, dots + caption.
 * Takes statically imported images so next/image can size and serve them.
 */
export default function PhotoCarousel({ slides }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(slides.length - 1, i)));
  }, [slides.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    // Move the indicator immediately rather than waiting for the scroll
    // event: the animation can be interrupted or coalesced, and an arrow
    // that leaves the dots behind reads as broken.
    setActive(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  if (!Array.isArray(slides) || slides.length < 2) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl bg-slate-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <figure key={i} className="w-full shrink-0 snap-center">
            <Image
              src={s.image}
              alt={s.alt}
              priority={i === 0}
              className="aspect-[4/3] w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </figure>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => goTo(active - 1)}
        className={`absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-card transition hover:bg-white md:flex ${active === 0 ? "pointer-events-none opacity-0" : ""}`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => goTo(active + 1)}
        className={`absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-card transition hover:bg-white md:flex ${active === slides.length - 1 ? "pointer-events-none opacity-0" : ""}`}
      >
        ›
      </button>

      {slides.some((s) => s.caption) ? (
        <p className="mt-3 text-center text-[13px] font-medium text-slate-600">
          {slides[active]?.caption || " "}
        </p>
      ) : null}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-slate-700" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

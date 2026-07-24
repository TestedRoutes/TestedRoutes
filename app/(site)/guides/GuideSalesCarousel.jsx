"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sales-page carousel (guide-page-build-spec block 2).
 * Swipeable on mobile (scroll-snap), arrows on desktop, dot indicators,
 * captions visible. Slides are either display-resolution page exports or
 * short muted trip clips (autoplay, loop — footage is the differentiator).
 */
export default function GuideSalesCarousel({ slides }) {
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
          <figure
            key={i}
            className="flex w-full shrink-0 snap-center flex-col items-center justify-center"
          >
            <div className="flex h-[420px] w-full items-center justify-center md:h-[560px]">
              {s.videoUrl ? (
                <video
                  src={s.videoUrl}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={i < 2 ? "auto" : "none"}
                  aria-label={s.alt}
                />
              ) : (
                <img
                  src={s.imageUrl}
                  alt={s.alt}
                  className="h-full w-auto max-w-full object-contain py-3"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          </figure>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
        className={`absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-card transition hover:bg-white md:flex ${active === 0 ? "pointer-events-none opacity-0" : ""}`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
        className={`absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-card transition hover:bg-white md:flex ${active === slides.length - 1 ? "pointer-events-none opacity-0" : ""}`}
      >
        ›
      </button>

      <div className="mt-3 flex items-center justify-center gap-3">
        <p className="text-[13px] font-medium text-slate-600">{slides[active]?.caption}</p>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-slate-700" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

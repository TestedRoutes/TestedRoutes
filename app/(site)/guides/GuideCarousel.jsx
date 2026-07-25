"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Guide media carousel — the single image surface on a guide page (there
 * are deliberately no other photos in the body copy).
 *
 * Swipeable on mobile (scroll-snap), arrows on desktop, dot indicators.
 * Slides are authored in Sanity in display order and mix display-resolution
 * page exports with short muted trip clips (autoplay, loop — real footage
 * is what the guides have and the competition does not). Everything is
 * portrait but at different ratios, so slides share a fixed HEIGHT and vary
 * in width, which keeps the rhythm even across pages, photos and video.
 */
export default function GuideCarousel({ slides }) {
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

  // Clips carry autoPlay/muted/loop and are left to the browser. Driving
  // play/pause from the active index was tried and reverted: pausing is
  // reliable but the paired play() is subject to autoplay policy, so a
  // clip could stay dark after the user scrolled back to it. Two muted
  // seven-second clips are cheap enough to simply let run.

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
            {/* Portrait media, so height drives the size. Desktop stays close
                to the mobile height and is capped against the viewport —
                a taller frame filled most of a laptop screen with one slide. */}
            <div className="flex h-[440px] max-h-[70vh] w-full items-center justify-center py-3 md:h-[500px] md:max-h-[58vh]">
              {s.videoUrl ? (
                <video
                  src={s.videoUrl}
                  data-slide={i}
                  className="h-full w-auto max-w-full rounded-lg object-contain"
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
                  className="h-full w-auto max-w-full rounded-lg object-contain"
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

      {slides.some((s) => s.caption) ? (
        <div className="mt-3 flex items-center justify-center gap-3">
          <p className="text-[13px] font-medium text-slate-600">
            {slides[active]?.caption || " "}
          </p>
        </div>
      ) : null}
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

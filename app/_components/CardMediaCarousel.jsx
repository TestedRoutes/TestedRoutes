"use client";

import { useEffect, useRef, useState } from "react";

// Only direct video files can autoplay inline; page links (YouTube, TikTok)
// would need an iframe, which is too heavy for a card.
export const PLAYABLE_VIDEO = /\.(mp4|webm|mov)(\?|#|$)/i;

// Shared slide recipe for cards and galleries. Each video keeps its authored
// position in the sequence (slot is 1-based, from the source filename like
// {ID}_3-detail.mp4); without a slot it leads. `videos` is [{ url, slot }];
// legacy single videoUrl/videoSlot still works as a fallback.
export function buildMediaSlides({ photos = [], videoUrl = null, videoSlot = null, videos = null }) {
  const slides = photos.map((src) => ({ type: "image", src }));
  const clips =
    Array.isArray(videos) && videos.length
      ? videos
      : videoUrl
        ? [{ url: videoUrl, slot: videoSlot }]
        : [];
  clips
    .filter((v) => v?.url && PLAYABLE_VIDEO.test(v.url))
    .sort((a, b) => (Number(a.slot) || 1) - (Number(b.slot) || 1))
    .forEach((v) => {
      // Slots are positions in the full media sequence, so inserting in
      // ascending order lands each clip at its authored index.
      const idx = Math.max(0, Math.min(slides.length, (Number(v.slot) || 1) - 1));
      slides.splice(idx, 0, { type: "video", src: v.url, poster: photos[0] });
    });
  return slides;
}

// Muted looping clip that plays only while at least half visible — swiping
// to another slide or scrolling the card away pauses it. No poster: the
// photo-to-first-frame swap reads as a jump, so the clip stays invisible
// (container bg shows) until it has frames, then fades in.
function CardVideo({ src, title }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Media events race hydration; poll readyState until frames exist.
    const poll = setInterval(() => {
      if (el.readyState >= 2) {
        setReady(true);
        clearInterval(poll);
      }
    }, 250);
    if (typeof IntersectionObserver === "undefined")
      return () => clearInterval(poll);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      clearInterval(poll);
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={title}
      className={`h-full w-full object-cover transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

// Swipeable media strip for cards: touch swipe via scroll-snap, hover arrows
// on desktop, dot indicators. Expects an absolutely-positioned/fixed-aspect
// parent. slides: [{ type: "image" | "video", src, poster? }].
export default function CardMediaCarousel({
  slides,
  alt,
  imgClassName = "",
  eagerFirstSlide = false,
}) {
  const [idx, setIdx] = useState(0);
  const stripRef = useRef(null);

  const scrollToIndex = (i) => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const target = (i + slides.length) % slides.length;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };
  const prev = (e) => {
    e.preventDefault();
    scrollToIndex(idx - 1);
  };
  const next = (e) => {
    e.preventDefault();
    scrollToIndex(idx + 1);
  };
  const onScroll = () => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(Math.min(Math.max(i, 0), slides.length - 1));
  };

  if (!Array.isArray(slides) || !slides.length) return null;

  return (
    <>
      <div
        ref={stripRef}
        onScroll={onScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={`${i}-${slide.src}`}
            className="h-full w-full shrink-0 snap-center overflow-hidden"
          >
            {slide.type === "video" ? (
              <CardVideo src={slide.src} poster={slide.poster} title={alt} />
            ) : (
              <img
                src={slide.src}
                alt={alt}
                loading={i === 0 && eagerFirstSlide ? undefined : "lazy"}
                decoding="async"
                className={`h-full w-full object-cover ${imgClassName}`}
              />
            )}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M10.72 3.22a.75.75 0 0 1 0 1.06L6.56 8l4.16 3.72a.75.75 0 1 1-1 1.12l-4.72-4.22a.75.75 0 0 1 0-1.12l4.72-4.22a.75.75 0 0 1 1.06-.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 text-slate-700"
            >
              <path
                fillRule="evenodd"
                d="M5.28 3.22a.75.75 0 0 0 0 1.06L9.44 8 5.28 11.72a.75.75 0 1 0 1 1.12l4.72-4.22a.75.75 0 0 0 0-1.12L6.28 3.28a.75.75 0 0 0-1 -.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

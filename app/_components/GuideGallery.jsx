"use client";

import { useEffect, useRef, useState } from "react";
import { buildMediaSlides } from "./CardMediaCarousel";

// Muted looping clip that downloads and plays only while at least half
// visible — off-screen carousel slides and mosaic tiles stay paused with
// nothing fetched. Without this every clip on the page autoplays at once,
// which janks scrolling on mobile (a story can carry 3+ clips).
function GalleryVideo({ src, className = "" }) {
  const ref = useRef(null);
  // No poster: a photo that swaps to the clip's first frame reads as a
  // visual "jump". The video stays invisible (container bg shows) until it
  // actually has frames, then fades in. preload="metadata" keeps layout
  // height stable in the natural-aspect feed without downloading the clip.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Media events race hydration in every direction, so don't rely on
    // them alone: poll readyState until the first frame exists.
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
        if (entry.isIntersecting) {
          if (el.readyState >= 2) setReady(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
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
      onLoadedData={() => setReady(true)}
      onCanPlay={() => setReady(true)}
      onPlaying={() => setReady(true)}
      className={`${className} transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function SlideMedia({ slide, alt, eager = false, className = "" }) {
  // object-center: every frame crops from the middle of the media, so the
  // same photo/clip serves the portrait mobile frame and the landscape
  // desktop tiles without separate renditions.
  if (slide.type === "video") {
    return (
      <GalleryVideo
        src={slide.src}
        className={`h-full w-full object-cover object-center ${className}`}
      />
    );
  }
  return (
    <img
      src={slide.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className={`h-full w-full object-cover object-center ${className}`}
    />
  );
}

/**
 * Story/guide media gallery. The video keeps its authored slot in the
 * sequence. Mobile: full-width swipe carousel with counter + dots.
 * Desktop: 1 large + 2x2 mosaic in sequence order, with an always-visible
 * "View all (N)" pill. Lightbox shows every photo.
 */
export default function GuideGallery({
  photos,
  videoUrl = null,
  videoSlot = null,
  videos = null,
  viewAllLabel = "View all",
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const stripRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!photos?.length) return null;

  const slides = buildMediaSlides({ photos, videoUrl, videoSlot, videos });
  // Desktop mosaic anchors on a photo: a 720p clip cropped to fill the big
  // tile reads as blurry mush, so a leading video swaps back to a small tile
  // and the first photo takes the big one. Mobile keeps the authored order.
  const desktopSlides = (() => {
    if (slides[0]?.type !== "video") return slides;
    const i = slides.findIndex((s) => s.type === "image");
    if (i < 1) return slides;
    const reordered = slides.slice();
    const [photo] = reordered.splice(i, 1);
    reordered.unshift(photo);
    return reordered;
  })();
  const total = slides.length;
  const label = `${viewAllLabel} (${total})`;

  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(Math.max(0, Math.min(i, slides.length - 1)));
  };

  return (
    <>
      {/* Mobile: full-width swipe carousel */}
      <div className="relative overflow-hidden rounded-xl md:hidden">
        {/* Portrait frame: vertical photos/clips fill it naturally and
            landscape ones center-crop, mirroring how the desktop mosaic
            treats verticals. */}
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex aspect-[3/4] w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <div
              key={`${slide.type}-${slide.src}`}
              onClick={slide.type === "image" ? () => setOpen(true) : undefined}
              className={`h-full w-full shrink-0 snap-center ${slide.type === "image" ? "cursor-pointer" : ""}`}
            >
              <SlideMedia slide={slide} alt="" eager={i === 0} />
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">
          {idx + 1}/{slides.length}
        </span>
        {slides.length > 1 ? (
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow ring-1 ring-slate-200"
        >
          {label}
        </button>
      </div>

      {/* Desktop: 1 large + 2x2 mosaic, sequence order preserved */}
      {/* 5 tiles: 1 large + 4 small, the small ones always equal.
          minmax(0,1fr) stops oversized media from stretching a track. */}
      <div
        className="relative hidden overflow-hidden rounded-xl md:grid"
        style={{
          gridTemplateColumns: "1.6fr minmax(0, 1fr) minmax(0, 1fr)",
          gridTemplateRows: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 4,
          height: 420,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block h-full w-full"
          style={{ gridRow: "1 / 3" }}
          aria-label="Open gallery"
        >
          <SlideMedia slide={desktopSlides[0]} alt="" eager />
        </button>
        {desktopSlides.slice(1, 5).map((slide) => (
          <button
            key={`${slide.type}-${slide.src}`}
            type="button"
            onClick={() => setOpen(true)}
            className="block h-full w-full"
            aria-label="Open gallery"
          >
            <SlideMedia slide={slide} alt="" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-slate-200 transition hover:bg-white"
        >
          <span aria-hidden>≡</span>
          <span>{label}</span>
        </button>
      </div>

      {/* Lightbox: full grid of every photo */}
      {open ? (
        <div
          className="fixed inset-0 z-[1200] flex items-start justify-center overflow-y-auto bg-slate-900/85 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="sticky top-2 z-10 ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
              aria-label="Close gallery"
            >
              ×
            </button>
            {/* One-by-one feed at natural aspect ratios — nothing cropped,
                videos in their authored spots. */}
            <div className="flex flex-col gap-4">
              {slides.map((slide, i) =>
                slide.type === "video" ? (
                  <GalleryVideo
                    key={`${i}-${slide.src}`}
                    src={slide.src}
                    className="w-full rounded-xl"
                  />
                ) : (
                  <img
                    key={`${i}-${slide.src}`}
                    src={slide.src}
                    alt=""
                    className="w-full rounded-xl"
                    loading="lazy"
                  />
                )
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

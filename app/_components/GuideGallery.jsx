"use client";

import { useEffect, useRef, useState } from "react";
import { buildMediaSlides } from "./CardMediaCarousel";

function SlideMedia({ slide, alt, eager = false, className = "" }) {
  if (slide.type === "video") {
    return (
      <video
        src={slide.src}
        poster={slide.poster}
        muted
        loop
        playsInline
        autoPlay
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <img
      src={slide.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className={`h-full w-full object-cover ${className}`}
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

  const slides = buildMediaSlides({ photos, videoUrl, videoSlot });
  const total = photos.length;
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
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex h-64 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
      <div
        className="relative hidden overflow-hidden rounded-xl md:grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
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
          <SlideMedia slide={slides[0]} alt="" eager />
        </button>
        {slides.slice(1, 5).map((slide) => (
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p) => (
                <img
                  key={p}
                  src={p}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

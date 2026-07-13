"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mosaic gallery: 1 big hero on the left, 4 smaller tiles on the right
 * (2x2). The bottom-right tile carries the "View all" overlay. Mobile
 * collapses to a full-width swipe carousel with a photo counter and a
 * view-all overlay. Clicking any tile or "View all" opens a lightbox
 * grid (the "all photos" view).
 */
const PLAYABLE_VIDEO = /\.(mp4|webm|mov)(\?|#|$)/i;

export default function GuideGallery({
  photos,
  videoUrl = null,
  viewAllLabel = "View all",
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const stripRef = useRef(null);

  const video = videoUrl && PLAYABLE_VIDEO.test(videoUrl) ? videoUrl : null;
  const slideCount = (photos?.length || 0) + (video ? 1 : 0);

  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(Math.max(0, Math.min(i, slideCount - 1)));
  };

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
  const main = photos[0];
  const rest = photos.slice(1, 5);
  const total = photos.length;

  return (
    <>
      {/* Mobile: full-width swipe carousel with counter + view-all overlay */}
      <div className="relative overflow-hidden rounded-xl md:hidden">
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex h-64 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {video ? (
            <video
              src={video}
              poster={main}
              muted
              loop
              playsInline
              autoPlay
              className="h-full w-full shrink-0 snap-center object-cover"
            />
          ) : null}
          {photos.map((p, i) => (
            <img
              key={p}
              src={p}
              alt=""
              onClick={() => setOpen(true)}
              className="h-full w-full shrink-0 cursor-pointer snap-center object-cover"
              loading={i === 0 && !video ? "eager" : "lazy"}
            />
          ))}
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">
          {idx + 1}/{slideCount}
        </span>
        {slideCount > 1 ? (
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {Array.from({ length: slideCount }, (_, i) => (
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
          {viewAllLabel}
        </button>
      </div>

      {/* Desktop: 1 large + 2x2 small mosaic */}
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
          aria-label="Open photo 1 of gallery"
        >
          {video ? (
            <video
              src={video}
              poster={main}
              muted
              loop
              playsInline
              autoPlay
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={main} alt="" className="h-full w-full object-cover" loading="eager" />
          )}
        </button>
        {rest.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => setOpen(true)}
            className="relative block h-full w-full"
            aria-label={`Open photo ${i + 2} of gallery`}
          >
            <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
            {i === rest.length - 1 ? (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-slate-200">
                <span aria-hidden>≡</span>
                <span>View all</span>
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Lightbox: full grid of every photo */}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/85 p-4 sm:p-8"
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

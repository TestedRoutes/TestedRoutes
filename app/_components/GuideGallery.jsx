"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function GuideGallery({ photos }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const stripRef = useRef(null);
  const total = photos?.length || 0;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % Math.max(total, 1)),
    [total],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1)),
    [total],
  );

  // Arrow keys advance the hero when the lightbox is closed.
  useEffect(() => {
    if (open || total < 2) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, open, total]);

  // Lightbox: lock body scroll + Escape closes.
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

  // Keep the active thumbnail in view as the user advances.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector(`[data-thumb="${index}"]`);
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  if (!total) return null;
  const current = photos[index];

  return (
    <>
      <div className="space-y-3">
        {/* Hero image with navigation arrows */}
        <div className="relative overflow-hidden rounded-xl bg-slate-100">
          <img
            src={current}
            alt=""
            className="block aspect-[3/2] w-full object-cover"
            loading="eager"
          />
          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-900 shadow ring-1 ring-slate-200 transition hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-slate-900 shadow ring-1 ring-slate-200 transition hover:bg-white"
              >
                ›
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white">
                {index + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow ring-1 ring-slate-200 transition hover:bg-white"
              >
                <span aria-hidden>≡</span>
                <span>View all {total}</span>
              </button>
            </>
          ) : null}
        </div>

        {/* Thumbnail strip */}
        {total > 1 ? (
          <div
            ref={stripRef}
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1"
          >
            {photos.map((p, i) => {
              const isActive = i === index;
              return (
                <button
                  key={p}
                  type="button"
                  data-thumb={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-lg transition ${
                    isActive
                      ? "ring-2 ring-slate-900"
                      : "opacity-60 ring-1 ring-slate-200 hover:opacity-100"
                  }`}
                >
                  <img
                    src={p}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
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
              {photos.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setOpen(false);
                  }}
                  className="block overflow-hidden rounded-xl"
                >
                  <img
                    src={p}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

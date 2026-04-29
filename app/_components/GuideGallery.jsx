"use client";

import { useEffect, useState } from "react";

/**
 * Mosaic gallery: 1 big hero on the left, 4 smaller tiles on the right
 * (2x2). The bottom-right tile carries the "View all" overlay. Mobile
 * collapses to a horizontal swipe row. Clicking any tile or "View all"
 * opens a lightbox grid; clicking a tile inside the lightbox doesn't do
 * anything special (the lightbox is the "all photos" view).
 */
export default function GuideGallery({ photos }) {
  const [open, setOpen] = useState(false);

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
      {/* Mobile: horizontal swipe row */}
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-xl pb-1">
          {photos.slice(0, 5).map((p, i) => (
            <img
              key={p}
              src={p}
              alt=""
              onClick={() => setOpen(true)}
              className="h-52 w-[80vw] shrink-0 cursor-pointer snap-start rounded-xl object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow ring-1 ring-slate-200"
        >
          View all {total} photos
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
          <img src={main} alt="" className="h-full w-full object-cover" loading="eager" />
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

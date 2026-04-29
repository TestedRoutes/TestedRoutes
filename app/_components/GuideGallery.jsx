"use client";

import { useEffect, useState } from "react";

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
              className="h-52 w-[80vw] shrink-0 snap-start rounded-xl object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        {total > 5 ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow ring-1 ring-slate-200"
          >
            View all {total} photos
          </button>
        ) : null}
      </div>

      {/* Desktop: mosaic with View all overlay on last tile */}
      <div
        className="relative hidden overflow-hidden rounded-xl md:grid"
        style={{
          gridTemplateColumns: "1.6fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 4,
          height: 420,
        }}
      >
        <img
          src={main}
          alt=""
          className="h-full w-full object-cover"
          style={{ gridRow: "1 / 3" }}
        />
        {rest.map((p, i) => (
          <div key={p} className="relative h-full w-full">
            <img src={p} alt="" className="h-full w-full object-cover" loading="lazy" />
            {i === rest.length - 1 ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`View all ${total} photos`}
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md ring-1 ring-slate-200 transition hover:bg-white"
              >
                <span aria-hidden>≡</span>
                <span>View all</span>
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Lightbox-style full grid */}
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

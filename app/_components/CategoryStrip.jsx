"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function CategoryStrip({ items, onItemClick }) {
  const interactive = typeof onItemClick === "function";
  const scrollRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 320);
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="-mx-4 overflow-x-auto scroll-smooth px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <div className="grid grid-flow-col grid-rows-2 gap-3 [grid-auto-columns:240px] sm:gap-4 sm:[grid-auto-columns:260px]">
          {items.map((item) => {
            const innerContent = (
              <>
                <img
                  src={item.src}
                  alt=""
                  className="h-16 w-20 shrink-0 object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 items-center px-4">
                  <span className="text-sm font-semibold leading-snug text-slate-800">
                    {item.label}
                  </span>
                </div>
              </>
            );

            if (interactive) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onItemClick(item.label)}
                  className="flex items-stretch overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300/90"
                >
                  {innerContent}
                </button>
              );
            }
            return (
              <div
                key={item.label}
                className="flex items-stretch overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                {innerContent}
              </div>
            );
          })}
        </div>
      </div>

      {canPrev ? (
        <button
          type="button"
          onClick={() => scroll("prev")}
          aria-label="Scroll categories left"
          className="absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 sm:flex"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          onClick={() => scroll("next")}
          aria-label="Scroll categories right"
          className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 sm:flex"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

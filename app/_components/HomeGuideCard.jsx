"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomeGuideCard({ guide }) {
  const images = guide.images || (guide.image ? [guide.image] : []);
  const [idx, setIdx] = useState(0);
  const prev = (e) => {
    e.preventDefault();
    setIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.preventDefault();
    setIdx((i) => (i + 1) % images.length);
  };

  const cardClass = `group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition${
    guide.coming_soon ? "" : " hover:-translate-y-1 hover:shadow-md"
  }`;

  return (
    <div className={cardClass}>
      <div className="relative h-44 w-full overflow-hidden">
        {guide.coming_soon ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Coming soon
            </span>
          </div>
        ) : (
          <>
            <img
              src={images[idx]}
              alt={guide.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white"
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
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {guide.category.toUpperCase()}
        </p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">
          {guide.duration} • {guide.meta}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-slate-900">From {guide.price}</span>
          {guide.coming_soon ? (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">
              Coming soon
            </span>
          ) : guide.href ? (
            <Link
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              href={guide.href}
            >
              View Guide
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              View Guide
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

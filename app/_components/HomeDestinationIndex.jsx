import Link from "next/link";
import { getCountryOutline } from "../_lib/countryOutlines";
import { getFlagColors } from "../_lib/flagColors";

// Continent cards indexing the guide catalogue by country (founder
// 2026-08-08: this section sells guides now — the per-country inspire-story
// links moved out). Each country row carries a line-drawn contour and its
// flag colors as tiny bars; the link is the guide count. Server component
// on purpose: countryOutlines is ~1MB of path data that must never reach
// the client bundle.
export default function HomeDestinationIndex({ continents = [] }) {
  if (!continents.length) return null;

  return (
    <section className="space-y-10">
      {/* Same header pair as the "Discover the latest guides" section:
          Fraunces display heading with the Mynerve section line (flat 32px,
          founder 2026-08-08) underneath. A handwriting face needs its own
          case and spacing, so the uppercase + wide tracking come off. */}
      <div className="space-y-3 text-center">
        <h2 className="font-serif font-light leading-tight text-brand-ink text-3xl md:text-5xl lg:text-[72px]">
          Browse by destination
        </h2>
        <p className="font-script text-[32px] leading-tight text-slate-500">
          Have you been here before?
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {continents.map((c) => (
          <div
            key={c.slug}
            className="flex flex-col rounded-[28px] bg-white p-6 shadow-card ring-1 ring-brand-line md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Brandy full stop, echoing the "tested routes." wordmark. */}
              <h3 className="font-serif text-2xl font-light text-brand-ink">
                {c.name}
                <span className="text-brand-terracotta">.</span>
              </h3>
              <span className="mt-1 shrink-0 rounded-full bg-slate-50 px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500 ring-1 ring-brand-line">
                {c.count} {c.count === 1 ? "Guide" : "Guides"}
              </span>
            </div>
            <ul className="mt-6 divide-y divide-slate-100">
              {c.entries.map((entry) => {
                const outline = getCountryOutline(entry.country);
                const flag = getFlagColors(entry.country);
                return (
                  <li
                    key={entry.country}
                    className="flex items-start gap-5 py-4 first:pt-0 last:pb-0"
                  >
                    {/* Contour in Coffee Bean; non-scaling-stroke keeps the
                        line weight even though every country's viewBox is a
                        different scale. Countries the map doesn't know keep
                        the slot so rows stay aligned. */}
                    <span className="mt-0.5 flex h-12 w-14 shrink-0 items-center justify-center">
                      {outline ? (
                        <svg
                          viewBox={outline.viewBox}
                          className="max-h-12 w-14 text-brand-ink"
                          aria-hidden="true"
                        >
                          <path
                            d={outline.d}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <div className="min-w-0 space-y-1.5">
                      <span className="flex items-center gap-2.5">
                        {/* Detail text: DM Sans medium, Brandy as the
                            highlight color (styleguide V3). */}
                        <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-terracotta">
                          {entry.country}
                        </span>
                        {flag ? (
                          <span className="flex gap-[3px]" aria-hidden="true">
                            {flag.map((color, i) => (
                              <span
                                key={i}
                                className="h-2 w-3 rounded-[2px] ring-1 ring-brand-line"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </span>
                        ) : null}
                      </span>
                      {/* Guide titles, same list treatment the section used
                          for inspire stories (founder 2026-08-08); overflow
                          past the cap links to the pre-filtered browser. */}
                      <ul className="space-y-1.5">
                        {entry.guides.map((g) => (
                          <li key={g.href}>
                            <Link
                              href={g.href}
                              className="font-sans text-[15px] leading-snug text-slate-700 underline decoration-transparent underline-offset-4 transition hover:decoration-slate-400"
                            >
                              {g.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {entry.count > entry.guides.length ? (
                        <Link
                          href={`/guides?q=${encodeURIComponent(entry.country)}`}
                          className="inline-block font-sans text-sm font-medium text-brand-terracotta transition hover:text-brand-terracotta/80"
                        >
                          All {entry.count} {entry.country} guides →
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-8">
              <Link
                href={`/guides?q=${encodeURIComponent(c.name)}`}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-terracotta px-5 py-2.5 font-sans text-sm tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90"
              >
                See all in {c.name} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

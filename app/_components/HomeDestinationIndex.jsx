import Link from "next/link";

// Continent cards, each listing a few countries with their most recent
// story — a text index of where the site has actually been.
export default function HomeDestinationIndex({ continents = [] }) {
  if (!continents.length) return null;

  return (
    <section className="space-y-10">
      {/* Mynerve regular at 32pt. A handwriting face needs its own case and
          spacing, so the uppercase + wide tracking come off. */}
      <p className="text-center font-script text-[24pt] leading-tight text-slate-500 md:text-[32pt]">
        Have you been here before?
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {continents.map((c) => (
          <div
            key={c.slug}
            className="flex flex-col rounded-[28px] bg-white p-6 shadow-card ring-1 ring-brand-line md:p-8"
          >
            {/* Brandy full stop, echoing the "tested routes." wordmark. */}
            <h3 className="font-serif text-2xl font-light text-brand-ink">
              {c.name}
              <span className="text-brand-terracotta">.</span>
            </h3>
            <ul className="mt-6 space-y-4">
              {c.entries.map((entry) => (
                <li
                  key={entry.href}
                  className="grid gap-1 sm:grid-cols-[128px_1fr] sm:gap-4"
                >
                  {/* Detail text: DM Sans medium, Brandy as the highlight
                      color (TR-font-system.pdf / styleguide V3). */}
                  <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-terracotta">
                    {entry.country}
                  </span>
                  <Link
                    href={entry.href}
                    className="font-sans text-[15px] leading-snug text-slate-700 underline decoration-transparent underline-offset-4 transition hover:decoration-slate-400"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Link
                href={`/inspire?continent=${c.slug}`}
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

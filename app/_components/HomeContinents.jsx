import Link from "next/link";

// Full-bleed chooser on a flat Taupe Grey block: one pill per continent that
// actually has published stories. Each lands on the Inspire index pre-filtered.
export default function HomeContinents({ continents = [], children }) {
  if (!continents.length && !children) return null;

  return (
    // Taupe Grey #5F524D (styleguide V3) rather than Coffee Bean.
    <section className="relative isolate overflow-hidden bg-brand-taupe">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center md:py-24">
        <h2 className="font-serif font-light leading-tight text-white text-4xl md:text-6xl lg:text-7xl">
          Choose your adventure
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {continents.map((c) => (
            <Link
              key={c.slug}
              href={`/inspire?continent=${c.slug}`}
              className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 font-sans text-sm tracking-[0.05em] text-white/90 transition hover:border-white/50 hover:bg-white/20 hover:text-white"
            >
              {c.name}
              <span className="ml-2 text-xs tabular-nums text-white/50">{c.count}</span>
            </Link>
          ))}
        </div>

        {/* Activity tiles sit under the continents; they filter the guide
            grid further up the page. */}
        {children ? <div className="mt-10 text-left">{children}</div> : null}
      </div>
    </section>
  );
}

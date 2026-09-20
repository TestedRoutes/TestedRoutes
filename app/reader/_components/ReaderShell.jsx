import ReaderRail from "./ReaderRail";

/**
 * The gated reader chrome: rail on the left at laptop width, tab bar on the
 * phone, the page beside or below it. Laptop first (founder, 2026-09-20:
 * build for the website on laptops, then simplify to mobile), so the
 * desktop layout is the design and the phone one is its collapse, not the
 * other way round.
 */
export default function ReaderShell({ country, children }) {
  const c = country.country;
  return (
    <div className="min-h-screen md:flex">
      <ReaderRail
        country={c.slug}
        title={c.title}
        subtitle={c.subtitle}
        placeCount={country.places.length}
        verified={c.verified}
      />
      <main className="w-full min-w-0 flex-1 px-4 pb-24 pt-5 md:px-10 md:pt-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

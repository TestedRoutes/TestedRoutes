// Instant paint between clicking a link and the server render arriving.
// Every page in this group renders per request (the currency decision,
// Decisions #23), so without a loading boundary a navigation shows nothing
// at all until the whole RSC payload lands — the site read as frozen. The
// header and footer live in the layout and stay interactive; this fills
// only the content area. Deliberately generic: a centered pulse, no fake
// page shapes, because this boundary covers every route without its own
// loading file, and a wrong-shaped skeleton is worse than a neutral one.
export default function SiteLoading() {
  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center bg-brand-parchment">
      <div className="flex flex-col items-center gap-4" aria-label="Loading" role="status">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-300" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
      </div>
    </main>
  );
}

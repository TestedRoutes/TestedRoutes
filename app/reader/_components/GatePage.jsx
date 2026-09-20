/**
 * What an ungated visitor sees: a 200, not a 403 — kinder to someone who
 * follows an old link, and the same page that will later carry the buy CTA,
 * the public sample day and the "lost your link?" recovery form. For the
 * prototype it carries the preview-key form only.
 */
export default function GatePage({ slug, configured }) {
  const to = `/reader/${slug}`;
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-brand-terracotta">
        TestedRoutes · reader
      </p>
      <h1 className="mt-2 text-3xl leading-tight">This guide opens with a key.</h1>
      <p className="mt-3 text-slate-600">
        The reader is a private prototype. Paste the preview key you were
        given to open it on this device; it stays open for thirty days.
      </p>
      {configured ? (
        <form action="/reader/unlock" method="get" className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="to" value={to} />
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600" htmlFor="key">
            Preview key
          </label>
          <input
            id="key"
            name="key"
            type="password"
            autoComplete="off"
            required
            className="rounded-lg border border-brand-line bg-white px-4 py-3 text-base outline-none focus:border-brand-terracotta"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-flame px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white"
          >
            Open the guide
          </button>
        </form>
      ) : (
        <p className="mt-6 rounded-lg border border-brand-line bg-white px-4 py-3 text-sm text-slate-600">
          This deploy has no <code>READER_PREVIEW_SECRET</code> configured, so
          the gate cannot open. Add it in the Vercel environment for this
          branch and redeploy.
        </p>
      )}
      <p className="mt-8 text-xs text-slate-500">
        Not for search engines, not linked from the site. Guide content is
        copyright TestedRoutes.
      </p>
    </main>
  );
}

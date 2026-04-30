import Link from "next/link";

export const metadata = {
  title: "Page not found · TestedRoutes",
  description:
    "We couldn't find the page you were looking for. Browse our guides or head back to the homepage.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="font-['Georgia',serif] text-3xl font-semibold text-slate-900 md:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-md text-base text-slate-600">
        The link may be broken, the page may have moved, or it may never have
        existed. The map says &quot;here be dragons&quot; – which on the
        ground usually means &quot;take the next turn back.&quot;
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/guides"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse guides
        </Link>
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        If you arrived here from a TestedRoutes link, please tell us so we can
        fix it: {" "}
        <Link className="underline hover:text-slate-700" href="/contact">
          /contact
        </Link>
        .
      </p>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "You're in · TestedRoutes",
  description: "Newsletter subscription confirmed.",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmedPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Subscription confirmed</p>
      <h1 className="text-3xl font-semibold text-slate-900">You&apos;re in. Welcome aboard.</h1>
      <p className="text-base text-slate-600">
        You&apos;ll get an email when the next field-tested route is published. Until then, feel
        free to wander.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          href="/inspire"
        >
          Read the stories
        </Link>
        <Link
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          href="/guides"
        >
          Browse guides
        </Link>
      </div>
    </main>
  );
}

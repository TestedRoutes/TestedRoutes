import Link from "next/link";

export const metadata = {
  title: "Thank you · TestedRoutes",
  description: "Your guide is on its way.",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order confirmed</p>
      <h1 className="text-3xl font-semibold text-slate-900">Thank you for your purchase</h1>
      <p className="text-base text-slate-600">
        Your guide is on the way to your inbox. The email contains a personal,
        signed download link – keep it, you can re-download from it anytime.
      </p>
      <p className="text-sm text-slate-500">
        Didn&apos;t see it after a few minutes? Check spam, or reach out to{" "}
        <a className="underline" href="mailto:hello@testedroutes.com">
          hello@testedroutes.com
        </a>
        .
      </p>
      <Link
        className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        href="/guides"
      >
        Browse more guides
      </Link>
    </main>
  );
}

import Link from "next/link";
import { loadGuides } from "../../../_lib/loadGuides";
import { getRequestCurrency } from "../../../_lib/currency";

export const metadata = {
  title: "Thank you · TestedRoutes",
  description: "Your guide is on its way.",
  robots: { index: false, follow: false },
};

function GuideCard({ guide }) {
  return (
    <Link
      href={guide.href}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-slate-300"
    >
      <div className="h-40 w-full overflow-hidden bg-slate-100">
        {guide.image ? (
          <img
            src={guide.image}
            alt={guide.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-4 text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{guide.category}</p>
        <h3 className="text-base font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">
          {guide.duration ? `${guide.duration} • ` : ""}PDF guide
        </p>
        {guide.price ? (
          <p className="pt-1 text-sm font-semibold text-slate-900">From {guide.price}</p>
        ) : null}
      </div>
    </Link>
  );
}

export default async function ThanksPage() {
  const currency = await getRequestCurrency();
  const allGuides = await loadGuides(currency);
  const moreGuides = allGuides.slice(0, 3);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Order confirmed</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Check your email
        </h1>
        <p className="max-w-xl text-base text-slate-600">
          Your guide PDF is on its way – usually within a minute. Look for an
          email from{" "}
          <span className="font-medium text-slate-900">TestedRoutes via Polar</span>{" "}
          with an <span className="font-medium text-slate-900">Access purchase</span>{" "}
          button. The link is personal and re-usable, so keep the email – you can
          re-download anytime.
        </p>
        <p className="text-sm text-slate-500">
          Nothing after a few minutes? Check your spam folder, or email{" "}
          <a className="underline hover:text-slate-700" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </p>
      </section>

      {moreGuides.length > 0 ? (
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">More guides to explore</h2>
            <Link
              className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
              href="/guides"
            >
              See all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreGuides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

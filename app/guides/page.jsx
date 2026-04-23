import Link from "next/link";
import { loadGuides } from "../_lib/loadGuides";

export const metadata = {
  title: "Guides · Pikelis Travel",
  description:
    "Every guide is a real route, tested in the field. Buy once, follow step by step.",
};

function GuideCard({ guide }) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="h-44 w-full overflow-hidden rounded-t-3xl bg-slate-100">
        {guide.image ? (
          <img
            src={guide.image}
            alt={guide.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{guide.category}</p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">
          {guide.duration ? `${guide.duration} • ` : ""}PDF guide
        </p>
        {guide.purchases ? (
          <p className="text-xs text-slate-500">{guide.purchases} purchased</p>
        ) : null}
        <div className="flex items-center justify-between pt-2">
          {guide.price ? (
            <span className="text-sm font-semibold text-slate-900">From {guide.price}</span>
          ) : (
            <span />
          )}
          <Link
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            href={guide.href}
          >
            View Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function GuidesPage() {
  const guides = await loadGuides();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Guides</h1>
          <span className="text-xs text-slate-500">
            {guides.length} {guides.length === 1 ? "guide" : "guides"}
          </span>
        </div>
        {guides.length === 0 ? (
          <p className="text-sm text-slate-500">
            No guides found. Add entries to stories-manifest.json.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

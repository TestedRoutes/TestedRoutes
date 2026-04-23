import * as React from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { loadGuides } from "../utils/loadGuides.js";

function GuideCard({ guide }) {
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="h-44 w-full overflow-hidden rounded-t-3xl bg-slate-100">
        {imgOk ? (
          <img
            src={guide.image}
            alt={guide.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
          />
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{guide.category}</p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">{guide.duration} • {guide.meta}</p>
        <p className="text-xs text-slate-500">{guide.purchases} purchased</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-slate-900">From {guide.price}</span>
          <a
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            href={guide.href}
          >
            View Guide
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GuidesPage() {
  const [guides, setGuides] = React.useState([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    loadGuides()
      .then((list) => setGuides(list))
      .catch(() => setGuides([]))
      .finally(() => setReady(true));
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Guides</h1>
            <span className="text-xs text-slate-500">{ready ? `${guides.length} guides` : "Loading…"}</span>
          </div>
          {!ready ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="h-44 rounded-t-3xl bg-slate-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                    <div className="h-5 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : guides.length === 0 ? (
            <p className="text-sm text-slate-500">No guides found. Add entries to guides-manifest.json.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          )}
        </section>
      </main>
      <div className="mx-auto max-w-6xl px-6">
        <SiteFooter />
      </div>
    </div>
  );
}

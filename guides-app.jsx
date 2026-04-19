const Footer = () => window.SiteFooter ? React.createElement(window.SiteFooter) : null;

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

function GuidesPage() {
  const guides = Array.isArray(window.GUIDES) ? window.GUIDES : [];
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      {React.createElement(window.SiteHeader)}
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Guides</h1>
            <span className="text-xs text-slate-500">Switzerland · Zurich day trips</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.href} guide={g} />
            ))}
          </div>
        </section>
      </main>
      <div className="mx-auto max-w-6xl px-6">
        <Footer />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GuidesPage />);

import * as React from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { GUIDES } from "../data/guides.js";

const destinationRail = [
  { label: "Switzerland", href: "guides.html" },
  { label: "Day Trips", href: "guides.html" },
  { label: "Road Trips", href: "guides.html" },
  { label: "Adventure", href: "guides.html" },
  { label: "Expedition Routes", href: "guides.html" },
  { label: "Rally Guides", href: "guides.html" },
  { label: "Bungee", href: "guides.html" },
  { label: "Hiking", href: "guides.html" },
  { label: "Everest Preparation", href: "guides.html" },
];

const searchSuggestions = [
  { label: "Switzerland — Country", href: "destinations/switzerland/" },
  { label: "Zurich — Starting point in Switzerland", href: "destinations/switzerland/?start=zurich" },
  { label: "Triftbrücke from Zurich — Guide", href: "guides/trift-bridge-from-zurich.html" },
  { label: "Stoos Ridge from Zurich — Guide", href: "guides/stoos-ridge-from-zurich.html" },
  { label: "Appenzell & Ebenalp from Zurich — Guide", href: "guides/appenzell-ebenalp-from-zurich.html" },
  { label: "Mount Rigi from Zurich — Guide", href: "guides/mount-rigi-from-zurich.html" },
  { label: "Säntis from Zurich — Guide", href: "guides/santis-from-zurich.html" },
  { label: "Flims & Caumasee from Zurich — Guide", href: "guides/flims-caumasee-from-zurich.html" },
  { label: "Day trips from Zurich — Guide collection", href: "destinations/switzerland/?length=daytrip&start=zurich" },
];

const resolveDestinationSearch = (query) => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  const guideMatches = {
    trift: "guides/trift-bridge-from-zurich.html",
    stoos: "guides/stoos-ridge-from-zurich.html",
    appenzell: "guides/appenzell-ebenalp-from-zurich.html",
    ebenalp: "guides/appenzell-ebenalp-from-zurich.html",
    rigi: "guides/mount-rigi-from-zurich.html",
    "säntis": "guides/santis-from-zurich.html",
    santis: "guides/santis-from-zurich.html",
    flims: "guides/flims-caumasee-from-zurich.html",
    caumasee: "guides/flims-caumasee-from-zurich.html",
  };

  const directGuide = Object.keys(guideMatches).find((term) => normalized.includes(term));
  if (directGuide) return guideMatches[directGuide];

  const destinationMatches = ["switzerland", "swiss", "zurich", "geneva", "lucerne", "interlaken"];
  const hasSwitzerland = destinationMatches.some((term) => normalized.includes(term));
  if (!hasSwitzerland) return null;

  let length = null;
  if (normalized.includes("weekend")) {
    length = "weekend";
  } else if (normalized.includes("day trip") || normalized.includes("day trips") || normalized.includes("daytrip") || normalized.includes("1 day")) {
    length = "daytrip";
  } else if (normalized.includes("expedition")) {
    length = "expedition";
  } else if (normalized.includes("2 week") || normalized.includes("two week") || normalized.includes("14 day")) {
    length = "2weeks";
  } else if (normalized.includes("5-7") || normalized.includes("week")) {
    length = "week";
  }

  let start = null;
  if (normalized.includes("zurich")) start = "zurich";
  else if (normalized.includes("geneva")) start = "geneva";
  else if (normalized.includes("lucerne")) start = "lucerne";
  else if (normalized.includes("interlaken")) start = "interlaken";

  const params = new URLSearchParams();
  if (length) params.set("length", length);
  if (start) params.set("start", start);

  const queryString = params.toString();
  return `/destinations/switzerland/${queryString ? `?${queryString}` : ""}`;
};

const SearchBar = () => {
  const [query, setQuery] = React.useState("");
  const suggestions = searchSuggestions.filter((item) =>
    query ? item.label.toLowerCase().includes(query.toLowerCase()) : false
  );

  const handleSubmit = () => {
    const destinationUrl = resolveDestinationSearch(query);
    if (destinationUrl) window.location.href = destinationUrl;
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
          <span className="h-2 w-2 rounded-full bg-slate-900"></span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") handleSubmit(); }}
            placeholder="Search destinations or guides"
            className="w-full bg-transparent text-sm text-slate-600 outline-none"
          />
        </div>
        <button
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          onClick={handleSubmit}
        >
          Search Guides
        </button>
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {suggestions.map((item) => (
            <a key={item.label} href={item.href} className="block px-4 py-3 text-xs text-slate-600 hover:bg-slate-50">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const GuideCard = ({ guide }) => {
  const images = guide.images || (guide.image ? [guide.image] : []);
  const [idx, setIdx] = React.useState(0);
  const prev = (e) => { e.preventDefault(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.preventDefault(); setIdx((i) => (i + 1) % images.length); };

  return (
    <div className={`group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition${guide.coming_soon ? "" : " hover:-translate-y-1 hover:shadow-md"}`}>
      <div className="relative h-44 w-full overflow-hidden">
        {guide.coming_soon ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">Coming soon</span>
          </div>
        ) : (
          <>
            <img
              src={images[idx]}
              alt={guide.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            {images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-slate-700"><path fillRule="evenodd" d="M10.72 3.22a.75.75 0 0 1 0 1.06L6.56 8l4.16 3.72a.75.75 0 1 1-1 1.12l-4.72-4.22a.75.75 0 0 1 0-1.12l4.72-4.22a.75.75 0 0 1 1.06-.06z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={next} aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm hover:bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-slate-700"><path fillRule="evenodd" d="M5.28 3.22a.75.75 0 0 0 0 1.06L9.44 8 5.28 11.72a.75.75 0 1 0 1 1.12l4.72-4.22a.75.75 0 0 0 0-1.12L6.28 3.28a.75.75 0 0 0-1 -.06z" clipRule="evenodd" /></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, i) => (
                    <span key={i} className={`block h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{guide.category.toUpperCase()}</p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">{guide.duration} • {guide.meta}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-slate-900">From {guide.price}</span>
          {guide.coming_soon ? (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">Coming soon</span>
          ) : guide.href ? (
            <a className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white" href={guide.href}>
              View Guide
            </a>
          ) : (
            <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              View Guide
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DestinationRail = () => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {destinationRail.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        {item.label}
      </a>
    ))}
  </div>
);

const AboutMe = () => (
  <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[220px_1fr] md:gap-8">
    <div className="h-44 w-full rounded-2xl bg-slate-100"></div>
    <div className="mt-6 space-y-4 md:mt-0">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About Me</p>
      <div className="grid gap-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">140 countries visited</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">15 years planning trips independently for myself, family, and friends</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">Mission: help people travel more and waste less time planning</span>
        </div>
      </div>
    </div>
  </section>
);

const SupportMention = () => (
  <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">Need help refining your route?</p>
      <p className="text-xs text-slate-500">Add personal support after purchasing any guide.</p>
    </div>
    <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span>Personal Trip Session</span>
        <span className="font-semibold text-slate-900">€99</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span>Trip Setup Assistance</span>
        <span className="font-semibold text-slate-900">€249</span>
      </div>
    </div>
  </section>
);

export default function HomepageConcepts() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <section className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Travel more. Waste less time planning.
            </h1>
            <p className="text-sm leading-snug text-slate-600">
              Premium travel guides built from 15 years of independent travel across 140 countries — every route personally tested.
            </p>
          </div>
          <SearchBar />
          <DestinationRail />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Browse guides</h2>
            <button className="text-xs font-semibold text-slate-600">View all</button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.title} guide={guide} />
            ))}
          </div>
        </section>

        <SupportMention />
        <AboutMe />
        <div className="mx-auto w-full max-w-6xl">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}

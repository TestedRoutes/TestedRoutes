function markdownToSafeHtml(md) {
  if (typeof md !== "string" || !md.trim()) return "";
  try {
    if (typeof marked === "undefined" || typeof marked.parse !== "function") return "";
    const raw = marked.parse(md, { breaks: true, gfm: true });
    if (typeof raw !== "string") return "";
    if (typeof DOMPurify !== "undefined" && typeof DOMPurify.sanitize === "function") {
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    }
    return "";
  } catch {
    return "";
  }
}

function readInspireStorySlugFromLocation() {
  try {
    const p = new URLSearchParams(window.location.search);
    let s = (p.get("slug") || "").trim();
    if (!s) return "";
    try {
      s = decodeURIComponent(s);
    } catch {
      /* keep s */
    }
    return s;
  } catch {
    return "";
  }
}

function formatStoryDateLabel(iso) {
  if (!iso || typeof iso !== "string") return "";
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.trim();
  try {
    const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
    if (!Number.isFinite(d.getTime())) return iso.slice(0, 10);
    return new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeZone: "UTC" }).format(d);
  } catch {
    return iso.slice(0, 10);
  }
}

function normSlug(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

const Footer = () => window.SiteFooter ? React.createElement(window.SiteFooter) : null;

function GalleryImage({ src, alt }) {
  const [ok, setOk] = React.useState(true);
  if (!ok) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 text-[11px] font-medium text-slate-400">
        Unavailable
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/3] w-full rounded-2xl object-cover"
      loading="lazy"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

function HeroImage({ src, alt }) {
  const [ok, setOk] = React.useState(true);
  if (!src || !ok) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
        No hero image
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="eager"
      decoding="async"
      onError={() => setOk(false)}
    />
  );
}

function InspireStoryPage() {
  const [urlSlug] = React.useState(() => readInspireStorySlugFromLocation());

  const [phase, setPhase] = React.useState(() => (urlSlug ? "loading" : "notfound"));

  const [story, setStory] = React.useState(null);

  const [helpers, setHelpers] = React.useState(null);

  React.useEffect(() => {
    if (!urlSlug) {
      setPhase("notfound");
      setStory(null);
      setHelpers(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("./src/utils/loadInspireStories.js");
        if (cancelled) return;
        setHelpers(mod);
        const load = mod.loadInspireStories || mod.default;
        const list = await load();
        if (cancelled) return;
        const target = normSlug(urlSlug);
        const found = Array.isArray(list) ? list.find((x) => normSlug(x && x.slug) === target) : null;
        if (!found) {
          setStory(null);
          setPhase("notfound");
          return;
        }
        setStory(found);
        setPhase("ready");
      } catch {
        if (!cancelled) {
          setStory(null);
          setPhase("notfound");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urlSlug]);

  React.useEffect(() => {
    if (phase === "ready" && story && typeof story.title === "string" && story.title.trim()) {
      document.title = `Pikelis Travel · ${story.title.trim()}`;
    } else {
      document.title = "Pikelis Travel · Story";
    }
  }, [phase, story]);

  const bodyHtml = React.useMemo(() => {
    if (!story || typeof story.storyContent !== "string") return "";
    return markdownToSafeHtml(story.storyContent);
  }, [story]);

  const geoLabel =
    helpers && typeof helpers.getInspireStoryGeoLabel === "function" && story
      ? helpers.getInspireStoryGeoLabel(story.metadata || {})
      : "";

  const guideHref =
    helpers && typeof helpers.getInspireStoryGuideUrl === "function" && story
      ? helpers.getInspireStoryGuideUrl(story.metadata || {})
      : "";

  const heroSrc = story && story.heroPhoto ? story.heroPhoto : "";
  const photoUrls = story && Array.isArray(story.photos) ? story.photos.filter((u) => typeof u === "string" && u) : [];
  const galleryUrls =
    heroSrc && photoUrls[0] === heroSrc ? photoUrls.slice(1) : photoUrls.slice();

  const dateLabel = story ? formatStoryDateLabel(typeof story.date === "string" ? story.date : "") : "";

  const heroAlt =
    helpers && typeof helpers.getInspireStoryHeroAlt === "function" && story
      ? helpers.getInspireStoryHeroAlt(story)
      : "Story";

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      {React.createElement(window.SiteHeader)}
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <div>
          <a
            href="inspire.html"
            className="text-xs font-semibold text-slate-600 underline decoration-slate-400 decoration-1 underline-offset-4 transition hover:text-slate-900"
          >
            Back to Inspire
          </a>
        </div>

        {phase === "loading" ? (
          <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-slate-200 sm:py-14">
            <div className="mx-auto h-1.5 max-w-[10rem] animate-pulse rounded-full bg-slate-200" />
            <p className="mt-5 text-sm font-medium text-slate-600">Loading this journey…</p>
            <p className="mt-1 text-xs text-slate-500">Resolving story content from your library.</p>
          </div>
        ) : null}

        {phase === "notfound" ? (
          <section className="rounded-[28px] border border-dashed border-slate-300/70 bg-gradient-to-b from-white to-slate-50/95 px-6 py-12 text-center shadow-sm ring-1 ring-slate-200/60 sm:px-10 sm:py-14">
            <p className="text-lg font-semibold tracking-tight text-slate-900">Story not found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              The link may be wrong, the story may have moved, or it is not in your manifest anymore.
            </p>
            <a
              href="inspire.html"
              className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to Inspire
            </a>
          </section>
        ) : null}

        {phase === "ready" && story ? (
          <>
            <header className="space-y-3 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              {geoLabel ? (
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{geoLabel}</p>
              ) : null}
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{story.title}</h1>
              {dateLabel ? <p className="text-sm text-slate-500">{dateLabel}</p> : null}
            </header>

            <section className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative aspect-[21/9] w-full min-h-[200px] bg-slate-100 md:aspect-[2.4/1]">
                <HeroImage src={heroSrc} alt={heroAlt} />
              </div>
            </section>

            {galleryUrls.length ? (
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Gallery</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryUrls.map((url, i) => (
                    <GalleryImage key={`${i}-${url}`} src={url} alt={heroAlt} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              {bodyHtml ? (
                <div
                  className="inspire-story-prose max-w-none text-slate-800 [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-relaxed [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-slate-100 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">No story text yet</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Markdown will appear here when a Story-*.md file is available for this journey.
                  </p>
                </div>
              )}
            </section>

            {guideHref ? (
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Guide</h2>
                <a
                  href={guideHref}
                  className="mt-3 inline-flex rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white"
                >
                  Open guide
                </a>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
      <div className="mx-auto max-w-6xl px-6">
        <Footer />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<InspireStoryPage />);

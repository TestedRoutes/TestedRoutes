import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { loadInspireStories } from "../../../_lib/loadInspireStories";
import {
  getInspireFeaturedCardDisplay,
  getInspireStoryHeroAlt,
  getInspireStoryGuideUrl,
} from "../../../_lib/inspireStoryDisplay";
import NewsletterForm from "../../../_components/NewsletterForm";

export async function generateStaticParams() {
  const stories = await loadInspireStories();
  return stories.map((s) => ({ slug: s.slug }));
}

async function findStory(slug) {
  const stories = await loadInspireStories();
  return stories.find((s) => s.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await findStory(slug);
  if (!story) return {};
  const seo = story.metadata?.seo || {};
  const title = `${seo.meta_title || story.title} · TestedRoutes`;
  const description =
    seo.meta_description ||
    story.metadata?.hero?.subtitle ||
    story.title;
  const image = story.heroPhoto || "/images/triftbrucke-hero.jpg";
  const canonical = `/inspire/${story.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [{ url: image, alt: story.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function renderMarkdown(md) {
  if (typeof md !== "string" || !md.trim()) return "";
  try {
    return marked.parse(md, { breaks: true, gfm: true });
  } catch {
    return "";
  }
}

function resolveGuideHref(metadata) {
  const guideUrl = getInspireStoryGuideUrl(metadata);
  if (!guideUrl) return null;
  // Convert "guides/foo.html" → "/guides/foo"
  if (guideUrl.startsWith("guides/")) {
    return `/${guideUrl.replace(/\.html$/, "")}`;
  }
  if (guideUrl.startsWith("/guides/")) {
    return guideUrl.replace(/\.html$/, "");
  }
  return guideUrl;
}

export default async function InspireStoryPage({ params }) {
  const { slug } = await params;
  const story = await findStory(slug);
  if (!story) notFound();

  const display = getInspireFeaturedCardDisplay(story) || {};
  const heroAlt = getInspireStoryHeroAlt(story) || story.title;
  const guideHref = resolveGuideHref(story.metadata);
  const bodyHtml = renderMarkdown(story.storyContent);

  const heroPhoto = story.heroPhoto;
  const galleryUrls =
    Array.isArray(story.photos) && heroPhoto && story.photos[0] === heroPhoto
      ? story.photos.slice(1)
      : Array.isArray(story.photos)
        ? story.photos.slice()
        : [];

  const bestSeasonRaw =
    story.metadata?.timing?.best_seasons ??
    story.metadata?.timing?.seasons ??
    story.metadata?.best_seasons;
  const bestSeasonLabel = Array.isArray(bestSeasonRaw)
    ? bestSeasonRaw.filter((x) => typeof x === "string" && x).join(", ")
    : typeof bestSeasonRaw === "string"
      ? bestSeasonRaw.trim()
      : "";

  return (
    <>
      <div className="relative w-full overflow-hidden bg-slate-800" style={{ minHeight: 440 }}>
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt={heroAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ minHeight: 440 }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/92 via-slate-900/45 to-slate-900/10" />

        <div
          className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14 md:pt-32"
          style={{ minHeight: 440 }}
        >
          <nav
            className="mb-4 flex items-center gap-2 text-xs font-medium text-white/60"
            aria-label="Breadcrumb"
          >
            <Link href="/inspire" className="transition hover:text-white">
              Inspire
            </Link>
          </nav>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {story.title}
          </h1>

          {display.excerpt ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              {display.excerpt}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {display.geoLabel ? (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                📍 {display.geoLabel}
              </span>
            ) : null}
            {display.categoryDurationLine ? (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                ⏱ {display.categoryDurationLine}
              </span>
            ) : null}
            {display.difficultyLabel ? (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                💪 {display.difficultyLabel}
              </span>
            ) : null}
            {guideHref ? (
              <Link
                href={guideHref}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                📖 Full guide available ↓
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6 self-start">
            {/* Mobile quick facts */}
            <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200 md:hidden">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Quick Facts
              </p>
              <dl className="flex flex-col gap-2.5">
                {display.geoLabel ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📍</span>
                    <dd className="text-sm text-slate-700">{display.geoLabel}</dd>
                  </div>
                ) : null}
                {display.categoryDurationLine ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⏱</span>
                    <dd className="text-sm text-slate-700">{display.categoryDurationLine}</dd>
                  </div>
                ) : null}
                {display.difficultyLabel ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">💪</span>
                    <dd className="text-sm text-slate-700">{display.difficultyLabel}</dd>
                  </div>
                ) : null}
                {bestSeasonLabel ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌤</span>
                    <dd className="text-sm text-slate-700">Best season: {bestSeasonLabel}</dd>
                  </div>
                ) : null}
              </dl>
              <Link
                href={guideHref || "/guides"}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                {guideHref ? "Read the full guide →" : "Browse all guides →"}
              </Link>
            </div>

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              {bodyHtml ? (
                <div
                  className="inspire-story-prose max-w-none text-slate-800 [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-relaxed [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">No story text yet</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Story markdown will appear here when a Story-*.md file is available.
                  </p>
                </div>
              )}
            </section>

            {galleryUrls.length ? (
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Gallery
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryUrls.map((url, i) => (
                    <img
                      key={`${i}-${url}`}
                      src={url}
                      alt={heroAlt}
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-[88px] flex flex-col gap-4">
              <div className="rounded-[20px] bg-slate-900 p-6 text-white shadow-lg">
                {guideHref ? (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      Planning this trip?
                    </p>
                    <p className="text-base font-semibold leading-snug">{story.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      The full guide covers permits, gear, logistics, costs and everything you need
                      to plan this yourself.
                    </p>
                    <Link
                      href={guideHref}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Read the full guide →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      Turn inspiration into a plan
                    </p>
                    <p className="text-base font-semibold leading-snug">TestedRoutes Guides</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      Route-tested guides built from 15 years of independent travel. PDF format,
                      works offline.
                    </p>
                    <Link
                      href="/guides"
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Browse all guides →
                    </Link>
                  </>
                )}
              </div>

              {/* Quick facts (desktop) */}
              <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Quick Facts
                </p>
                <dl className="flex flex-col gap-2.5">
                  {display.geoLabel ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <dd className="text-sm text-slate-700">{display.geoLabel}</dd>
                    </div>
                  ) : null}
                  {display.categoryDurationLine ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⏱</span>
                      <dd className="text-sm text-slate-700">{display.categoryDurationLine}</dd>
                    </div>
                  ) : null}
                  {display.difficultyLabel ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💪</span>
                      <dd className="text-sm text-slate-700">{display.difficultyLabel}</dd>
                    </div>
                  ) : null}
                  {bestSeasonLabel ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🌤</span>
                      <dd className="text-sm text-slate-700">Best season: {bestSeasonLabel}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </aside>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <NewsletterForm variant="story" source="story-end" />
        </div>
      </main>
    </>
  );
}

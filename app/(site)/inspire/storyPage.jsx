import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { loadInspireStories } from "../../_lib/loadInspireStories";
import { fetchStoryTranslations } from "../../_lib/sanityStory";
import { loadGuides } from "../../_lib/loadGuides";
import { getRequestCurrency } from "../../_lib/currency";
import {
  getInspireFeaturedCardDisplay,
  getInspireStoryHeroAlt,
  getInspireStoryGuideUrl,
} from "../../_lib/inspireStoryDisplay";
import { getDict, localePath } from "../../_lib/i18n";
import NewsletterForm from "../../_components/NewsletterForm";

export async function findStory(lang, slug) {
  const stories = await loadInspireStories(lang);
  return stories.find((s) => s.slug === slug) || null;
}

function renderMarkdown(md) {
  if (typeof md !== "string" || !md.trim()) return "";
  try {
    return marked.parse(md, { breaks: true, gfm: true });
  } catch {
    return "";
  }
}

const PROSE_CLASS =
  "inspire-story-prose max-w-none text-slate-800 [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_p]:leading-relaxed [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

// Split rendered story HTML near the middle so a guide CTA can sit between
// the two halves. Prefers an <h2> boundary; most stories are plain prose,
// so it falls back to a top-level <p> boundary (tracking blockquote/list
// depth so the cut never lands inside a nested element).
function splitHtmlAtMid(html) {
  if (typeof html !== "string" || !html) return [html, ""];
  const headings = [];
  const topLevelParas = [];
  const re = /<(\/?)(blockquote|ul|ol|h2|p)[\s>]/g;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    const closing = m[1] === "/";
    const tag = m[2];
    if (tag === "h2") {
      if (!closing) headings.push(m.index);
    } else if (tag === "p") {
      if (!closing && depth === 0) topLevelParas.push(m.index);
    } else {
      depth += closing ? -1 : 1;
    }
  }
  let candidates = headings.filter((i) => i > 0);
  if (!candidates.length && topLevelParas.length >= 6) {
    candidates = topLevelParas.filter((i) => i > 0);
  }
  if (!candidates.length) return [html, ""];
  const mid = html.length / 2;
  let best = candidates[0];
  for (const i of candidates) {
    if (Math.abs(i - mid) < Math.abs(best - mid)) best = i;
  }
  return [html.slice(0, best), html.slice(best)];
}

function MidStoryGuideCta({ title, guideHref, t }) {
  return (
    <aside className="my-8 rounded-[20px] bg-slate-900 p-6 text-white shadow-lg">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
        {t.planningTrip}
      </p>
      <p className="text-base font-semibold leading-snug">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/60">{t.planningBody}</p>
      <Link
        href={guideHref}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        {t.readFullGuide}
      </Link>
    </aside>
  );
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

// A story either pins one guide (its own guide reference, or a same-slug
// guide) or — for shared stories like "Blue Lagoon" that belong to every
// Iceland guide — offers all guides for its destination country.
async function resolveGuideTargets(story, lang, currency) {
  const guides = await loadGuides(currency, lang);

  const direct = resolveGuideHref(story.metadata);
  if (direct) {
    return { guideHref: localePath(lang, direct), guideOptions: [] };
  }
  const slugMatch = guides.find((g) => g.slug === story.slug);
  if (slugMatch) {
    return {
      guideHref: localePath(lang, slugMatch.href || `/guides/${slugMatch.slug}`),
      guideOptions: [],
    };
  }

  const country = story.metadata?.geography?.country;
  const matches = country
    ? guides.filter((g) => g.metadata?.geography?.country === country)
    : [];
  if (matches.length === 1) {
    return { guideHref: localePath(lang, matches[0].href), guideOptions: [] };
  }
  if (matches.length > 1) {
    return {
      guideHref: null,
      guideOptions: matches.slice(0, 3).map((g) => ({
        title: g.title,
        duration: g.duration || "",
        price: g.price || "",
        href: localePath(lang, g.href),
      })),
    };
  }
  return { guideHref: null, guideOptions: [] };
}

// Compact list of guide choices, used wherever the single-guide CTA
// would otherwise sit.
function GuideOptionRows({ options, dark = false }) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {options.map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className={
            dark
              ? "flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-2.5 text-left transition hover:bg-white/20"
              : "flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-2.5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
          }
        >
          <span className="min-w-0">
            <span
              className={`block truncate text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}
            >
              {g.title}
            </span>
            {g.duration ? (
              <span className={`block text-xs ${dark ? "text-white/60" : "text-slate-500"}`}>
                {g.duration}
              </span>
            ) : null}
          </span>
          <span
            className={`shrink-0 text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}
          >
            {g.price || "→"}
          </span>
        </Link>
      ))}
    </div>
  );
}

// hreflang alternates across every published language version of the story.
async function storyLanguageAlternates(story, lang, slug) {
  const languages = {};
  try {
    const translations = await fetchStoryTranslations(story.metadata?.story_id);
    for (const tr of translations) {
      if (!tr.slug) continue;
      languages[tr.language] = localePath(tr.language, `/inspire/${tr.slug}`);
    }
    if (languages.en) languages["x-default"] = languages.en;
  } catch {
    // Sanity hiccup — fall back to just the canonical.
  }
  if (!Object.keys(languages).length) {
    languages[lang] = localePath(lang, `/inspire/${slug}`);
  }
  return languages;
}

export async function buildStoryMetadata(lang, slug) {
  const story = await findStory(lang, slug);
  if (!story) return {};
  const seo = story.metadata?.seo || {};
  const title = `${seo.meta_title || story.title} · TestedRoutes`;
  const description =
    seo.meta_description || story.metadata?.hero?.subtitle || story.title;
  const image = story.heroPhoto || "/images/triftbrucke-hero.jpg";
  const canonical = localePath(lang, `/inspire/${story.slug}`);
  const languages = await storyLanguageAlternates(story, lang, slug);

  return {
    title,
    description,
    alternates: { canonical, languages },
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

export default async function StoryPage({ lang, slug }) {
  const story = await findStory(lang, slug);
  if (!story) notFound();

  const t = getDict(lang).story;
  const display = getInspireFeaturedCardDisplay(story) || {};
  const heroAlt = getInspireStoryHeroAlt(story) || story.title;
  const currency = await getRequestCurrency();
  const { guideHref, guideOptions } = await resolveGuideTargets(
    story,
    lang,
    currency,
  );
  const hasGuideOptions = guideOptions.length > 0;
  const bodyHtml = renderMarkdown(story.storyContent);
  const [bodyFirst, bodySecond] = guideHref
    ? splitHtmlAtMid(bodyHtml)
    : [bodyHtml, ""];

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

  const inspireHome = localePath(lang, "/inspire");
  const inspireLabel = getDict(lang).nav.inspire;

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
          className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14 md:pt-32"
          style={{ minHeight: 440 }}
        >
          <nav
            className="mb-4 flex items-center gap-2 text-xs font-medium text-white/60"
            aria-label="Breadcrumb"
          >
            <Link href={inspireHome} className="transition hover:text-white">
              {inspireLabel}
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
                📖 {t.fullGuideChip}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6 self-start">
            {/* Mobile quick facts */}
            <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200 md:hidden">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {t.quickFacts}
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
                    <dd className="text-sm text-slate-700">
                      {t.bestSeason} {bestSeasonLabel}
                    </dd>
                  </div>
                ) : null}
              </dl>
              {hasGuideOptions ? (
                <>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t.guidesForTrip}
                  </p>
                  <GuideOptionRows options={guideOptions} />
                </>
              ) : (
                <Link
                  href={guideHref || localePath(lang, "/guides")}
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  {guideHref ? t.readFullGuide : t.browseAllGuides}
                </Link>
              )}
            </div>

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              {bodyHtml ? (
                <>
                  <div
                    className={PROSE_CLASS}
                    dangerouslySetInnerHTML={{ __html: bodyFirst }}
                  />
                  {guideHref && bodySecond ? (
                    <>
                      <MidStoryGuideCta title={story.title} guideHref={guideHref} t={t} />
                      <div
                        className={PROSE_CLASS}
                        dangerouslySetInnerHTML={{ __html: bodySecond }}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">No story text yet</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Story markdown will appear here when a Story-*.md file is available.
                  </p>
                </div>
              )}
            </section>

            {(guideHref || hasGuideOptions) && bodyHtml ? (
              <section className="rounded-[28px] bg-brand-terracotta p-8 text-center text-white">
                <p className="font-serif text-2xl font-semibold leading-tight">
                  {t.endCtaTitle}
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
                  {t.endCtaBody}
                </p>
                {guideHref ? (
                  <Link
                    href={guideHref}
                    className="mt-5 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    {t.readFullGuide}
                  </Link>
                ) : (
                  <div className="mx-auto mt-5 w-full max-w-md text-left">
                    <GuideOptionRows options={guideOptions} dark />
                  </div>
                )}
              </section>
            ) : null}

            {galleryUrls.length ? (
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t.gallery}
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
                      {t.planningTrip}
                    </p>
                    <p className="text-base font-semibold leading-snug">{story.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {t.planningBody}
                    </p>
                    <Link
                      href={guideHref}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      {t.readFullGuide}
                    </Link>
                  </>
                ) : hasGuideOptions ? (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {t.planningTrip}
                    </p>
                    <p className="text-base font-semibold leading-snug">{t.guidesForTrip}</p>
                    <GuideOptionRows options={guideOptions} dark />
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {t.turnInspiration}
                    </p>
                    <p className="text-base font-semibold leading-snug">{t.guidesCardTitle}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {t.guidesCardBody}
                    </p>
                    <Link
                      href={localePath(lang, "/guides")}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      {t.browseAllGuides}
                    </Link>
                  </>
                )}
              </div>

              {/* Quick facts (desktop) */}
              <div className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {t.quickFacts}
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
                      <dd className="text-sm text-slate-700">
                        {t.bestSeason} {bestSeasonLabel}
                      </dd>
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { loadInspireStories } from "../../_lib/loadInspireStories";
import { fetchStoryTranslations } from "../../_lib/sanityStory";
import { loadGuides } from "../../_lib/loadGuides";
import { getRequestCurrency } from "../../_lib/currency";
import {
  getInspireFeaturedCardDisplay,
  getInspireStoryGuideUrl,
} from "../../_lib/inspireStoryDisplay";
import { getDict, localePath } from "../../_lib/i18n";
import GuideGallery from "../../_components/GuideGallery";
import Byline from "../../_components/Byline";

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

// Story markdown often opens with the story title (as a heading, bold line
// or plain line) — the page already renders the title as its h1, so drop
// the duplicate first line when it matches.
function stripLeadingTitle(md, title) {
  if (typeof md !== "string" || !title) return md;
  const m = md.match(/^\s*(?:#{1,3}\s+)?(?:\*\*)?(.+?)(?:\*\*)?\s*(?:\n+|$)/);
  if (m && m[1].trim().toLowerCase() === title.trim().toLowerCase()) {
    return md.slice(m[0].length);
  }
  return md;
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

function MidStoryGuideCta({ guideHref, t }) {
  return (
    <aside className="my-8 rounded-[20px] bg-brand-ink p-6 text-white shadow-lg">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
        {t.planningTrip}
      </p>
      <p className="text-sm leading-relaxed text-white/80">{t.planningBody}</p>
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
  const currency = await getRequestCurrency();
  const { guideHref, guideOptions } = await resolveGuideTargets(
    story,
    lang,
    currency,
  );
  const hasGuideOptions = guideOptions.length > 0;
  const bodyHtml = renderMarkdown(stripLeadingTitle(story.storyContent, story.title));
  const [bodyFirst, bodySecond] = guideHref
    ? splitHtmlAtMid(bodyHtml)
    : [bodyHtml, ""];

  const photos = Array.isArray(story.photos) ? story.photos : [];

  const inspireHome = localePath(lang, "/inspire");
  const inspireLabel = getDict(lang).nav.inspire;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        {/* Guide-style header: breadcrumb + title above the media, never on it. */}
        <nav
          className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
          aria-label="Breadcrumb"
        >
          <Link href={inspireHome} className="hover:text-slate-600">
            {inspireLabel}
          </Link>
          <span>›</span>
          <span className="text-slate-600">{story.title}</span>
        </nav>

        <div className="mb-4">
          {display.geoLabel ? (
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {display.geoLabel}
            </p>
          ) : null}
          <h1 className="mt-1 text-[32px] font-semibold leading-tight text-slate-900">
            {story.title}
          </h1>
          {story.metadata?.hero?.subtitle ? (
            <p className="mt-1 max-w-2xl text-[15px] text-slate-500">
              {story.metadata.hero.subtitle}
            </p>
          ) : null}
          <Byline lang={lang} />
        </div>

        {photos.length ? (
          <div className="mb-8">
            <GuideGallery
              photos={photos}
              videoUrl={story.videoUrl}
              viewAllLabel={getDict(lang).guide.viewAllPhotos}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6 self-start">
            {/* Mobile guide CTA */}
            {guideHref || hasGuideOptions ? (
              <div className="rounded-[20px] bg-brand-ink p-5 text-white shadow-lg md:hidden">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  {t.planningTrip}
                </p>
                {guideHref ? (
                  <>
                    <p className="text-sm leading-relaxed text-white/80">{t.planningBody}</p>
                    <Link
                      href={guideHref}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      {t.readFullGuide}
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold leading-snug">{t.guidesForTrip}</p>
                    <GuideOptionRows options={guideOptions} dark />
                  </>
                )}
              </div>
            ) : null}

            <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              {bodyHtml ? (
                <>
                  <div
                    className={PROSE_CLASS}
                    dangerouslySetInnerHTML={{ __html: bodyFirst }}
                  />
                  {guideHref && bodySecond ? (
                    <>
                      <MidStoryGuideCta guideHref={guideHref} t={t} />
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

          </div>

          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-[88px] flex flex-col gap-4">
              <div className="rounded-[20px] bg-brand-ink p-6 text-white shadow-lg">
                {guideHref ? (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {t.planningTrip}
                    </p>
                    <p className="text-xs leading-relaxed text-white/70">
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
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

import Link from "next/link";
import { loadInspireStories } from "../../_lib/loadInspireStories";
import { fetchStoryCount } from "../../_lib/sanityStory";
import {
  getInspireFeaturedCardDisplay,
  getInspireStoryHeroAlt,
  getInspireStorySortDateMillis,
  getInspireStoryGuideUrl,
  inspireStoryHasGuide,
} from "../../_lib/inspireStoryDisplay";
import { LOCALES, getDict, localePath } from "../../_lib/i18n";
import InspireBrowse from "./InspireBrowse";
import { aboutAsset, getCategoryItems } from "../../_lib/categoryPills";

const EN_DESCRIPTION =
  "Travel stories and journey ideas from 15 years of independent trips across 140 countries – the field work behind every guide.";

// Structure (examples, images, links) is shared; titles/intros come from
// the dictionary so the arrays stay index-aligned with dict.collections.
const COLLECTION_STRUCTURE = [
  {
    examples: ["Triftbrücke", "Stoos Ridge", "Mount Rigi", "Säntis"],
    href: "/destinations/switzerland",
  },
  {
    examples: ["Iceland Ring Road", "South Island New Zealand", "Switzerland by train"],
    href: "/inspire",
  },
  {
    examples: ["Running with the bulls", "Shark diving", "Volcano boarding", "Skydiving & paragliding"],
    href: "/inspire",
  },
  {
    examples: ["Mongol Rally", "Africa overland route", "Mauritania iron ore train"],
    href: "/inspire",
  },
];

const EXTREME_FILES = [
  "Running with bulls Pamplona 2019.jpg",
  "Sharks Fiji 2025.jpg",
  "Nicaragua boarding 2019.jpg",
  "Paragliding.jpg",
  "Ice climbing Italy 2019.jpg",
  "Iron Ore train Mauritania 2023.jpg",
  "Summits Alaska 2019 v2.jpg",
  "Makoko Nigeria 2025.jpg",
];

// Card click always means "more information": the story page. The story's
// hero chip, mid-story and end CTAs are the paths to the guide, so browsing
// and buying stay two distinct, predictable actions.
function resolveCardHref(story, lang) {
  const metadata = story.metadata || {};
  if (story.slug) return localePath(lang, `/inspire/${story.slug}`);
  // No story page yet — fall back to the linked guide if there is one.
  const guideUrl = getInspireStoryGuideUrl(metadata);
  if (guideUrl) {
    return guideUrl.startsWith("guides/")
      ? `/${guideUrl.replace(/\.html$/, "")}`
      : guideUrl;
  }
  return null;
}

// Card-width renditions (hero first), capped at five slides.
function buildCardPhotos(story) {
  const photos = Array.isArray(story.cardPhotos) && story.cardPhotos.length
    ? story.cardPhotos
    : Array.isArray(story.photos)
      ? story.photos
      : [];
  return photos.slice(0, 5);
}

function buildCard(story, lang) {
  const display = getInspireFeaturedCardDisplay(story) || {};
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    heroPhoto: story.heroPhoto,
    photos: buildCardPhotos(story),
    videoUrl: story.videoUrl || null,
    heroAlt: getInspireStoryHeroAlt(story) || story.title,
    geoLabel: display.geoLabel || "",
    categoryDurationLine: display.categoryDurationLine || "",
    difficultyLabel: display.difficultyLabel || "",
    hasGuide: !!(display.hasGuide ?? inspireStoryHasGuide(story)),
    excerpt: display.excerpt || "",
    familyFriendly:
      story.metadata?.suitability?.family_friendly === true ||
      story.metadata?.suitability?.family_friendly === "true",
    href: resolveCardHref(story, lang),
    dateMillis: getInspireStorySortDateMillis(story) || 0,
  };
}

// hreflang alternates only for locales that actually have stories.
async function inspireLanguageAlternates() {
  const counts = await Promise.all(
    LOCALES.map(async (l) => [l, await fetchStoryCount(l)]),
  );
  const withContent = counts.filter(([, c]) => c > 0).map(([l]) => l);
  const languages = {};
  for (const l of withContent) languages[l] = localePath(l, "/inspire");
  if (withContent.includes("en")) languages["x-default"] = "/inspire";
  return { withContent, languages };
}

export async function buildInspireIndexMetadata(lang) {
  const t = getDict(lang);
  const { withContent, languages } = await inspireLanguageAlternates();
  const isEmpty = lang !== "en" && !withContent.includes(lang);
  return {
    title: `${t.nav.inspire} · TestedRoutes`,
    description:
      lang === "en"
        ? EN_DESCRIPTION
        : `${t.inspireList.title} – ${t.inspireList.subtitle}`,
    alternates: {
      canonical: localePath(lang, "/inspire"),
      languages,
    },
    // Keep untranslated locale lists out of the index until content lands.
    ...(isEmpty ? { robots: { index: false } } : {}),
  };
}

export default async function InspireIndexPage({ lang = "en" }) {
  const t = getDict(lang).inspireList;
  const stories = await loadInspireStories(lang);
  const cards = stories.map((s) => buildCard(s, lang));

  return (
    <main className="w-full pb-16 pt-6 text-slate-900 sm:pt-8">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-8 px-4 sm:gap-10 sm:px-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
            {t.title}
          </h1>
          <p className="text-sm leading-snug text-slate-600">{t.subtitle}</p>
        </div>

        {lang !== "en" && cards.length === 0 ? (
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-dashed border-slate-300/70 bg-white px-6 py-10 text-center shadow-sm ring-1 ring-slate-200/60">
            <p className="text-base font-semibold text-slate-900">{t.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              {t.emptyBody}
            </p>
            <Link
              href="/inspire"
              className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {t.emptyLink}
            </Link>
          </div>
        ) : (
          <InspireBrowse cards={cards} categoryItems={getCategoryItems()} lang={lang} />
        )}

        <section className="grid w-full min-w-0 gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          {t.credibility.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-semibold text-slate-700"
            >
              {item}
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <p className="text-xl font-semibold">{t.collectionsHeading}</p>
          <div className="grid gap-6 md:grid-cols-2">
            {t.collections.map((collection, i) => (
              <div
                key={collection.title}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="h-40 rounded-2xl bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <p className="text-lg font-semibold">{collection.title}</p>
                  <p className="text-sm text-slate-600">{collection.intro}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {COLLECTION_STRUCTURE[i].examples.map((example) => (
                      <span key={example} className="rounded-full bg-slate-100 px-3 py-1">
                        {example}
                      </span>
                    ))}
                  </div>
                  <Link
                    className="mt-3 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                    href={
                      COLLECTION_STRUCTURE[i].href === "/inspire"
                        ? localePath(lang, "/inspire")
                        : COLLECTION_STRUCTURE[i].href
                    }
                  >
                    {t.viewCollection}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xl font-semibold">{t.howITestTitle}</p>
            <p className="mt-2 text-sm text-slate-600">{t.howITestBody}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.extremeLabels.map((label, i) => (
              <div
                key={label}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <img
                  src={aboutAsset(EXTREME_FILES[i])}
                  alt={label}
                  className="h-36 w-full object-cover object-center"
                  loading="lazy"
                />
                <p className="p-3 text-center text-[11px] font-medium leading-snug text-slate-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">{t.ctaTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{t.ctaBody}</p>
          </div>
          <Link
            href="/guides"
            className="shrink-0 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            {t.browseGuides}
          </Link>
        </section>
      </div>
    </main>
  );
}

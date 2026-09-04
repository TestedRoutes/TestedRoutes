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
import { continentBucket } from "../../_lib/continents";
import InspireBrowse from "./InspireBrowse";

const EN_DESCRIPTION =
  "Travel stories and journey ideas from 15 years of independent trips across 140 countries – the field work behind every guide.";

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

function prettyCategory(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const words = raw.replace(/[-_]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function buildCard(story, lang) {
  const display = getInspireFeaturedCardDisplay(story) || {};
  const cls = story.metadata?.classification || {};
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    heroPhoto: story.heroPhoto,
    photos: buildCardPhotos(story),
    videoUrl: story.videoUrl || null,
    videoSlot: story.videoSlot || null,
    videos: Array.isArray(story.videos) ? story.videos : [],
    heroAlt: getInspireStoryHeroAlt(story) || story.title,
    geoLabel: display.geoLabel || "",
    country: story.metadata?.geography?.country || "",
    // Bucketed (the Americas share one tab) so the tab row matches /guides.
    continentSlug: continentBucket(story.metadata?.geography?.continent),
    categoryLabel: prettyCategory(cls.journey_category || cls.activity_category),
    // Style pills: the activity category names the pill; the tags let a
    // story sit under more than one.
    styleLabel: cls.activity_category_name || "",
    styles: [cls.activity_category_name, ...(Array.isArray(cls.activity_tags) ? cls.activity_tags : [])].filter(Boolean),
    // Collection names, for the journey band (app/_lib/inspireJourneys.js).
    collections: [cls.primary_collection, ...(Array.isArray(cls.all_collections) ? cls.all_collections : [])].filter(Boolean),
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

export default async function InspireIndexPage({ lang = "en", continent = "", q = "" }) {
  const t = getDict(lang).inspireList;
  const stories = await loadInspireStories(lang);
  const cards = stories.map((s) => buildCard(s, lang));
  // Home links in per continent ("See all in Africa"); ignore a slug that
  // no story matches so a stale link still shows the full index.
  const wantedContinent = continentBucket(continent);
  const activeContinent = cards.some((c) => c.continentSlug === wantedContinent)
    ? wantedContinent
    : "";

  return (
    // Flat Parchment here instead of the site's Bone-to-Parchment wash: the
    // card grid reads cleaner against one tone than against a gradient.
    <main className="min-h-screen w-full bg-brand-parchment pb-16 text-slate-900">
      {/* Dark top (founder mockup 2026-09-04): SiteHeader goes Coffee Bean on
          this page and this band continues it, so the page opens on one dark
          block before the filter panel on Parchment. The two lines are the
          same copy as before, left-aligned (founder 2026-09-03). */}
      <div className="bg-brand-ink text-brand-cream">
        <div className="mx-auto w-full max-w-7xl space-y-1.5 px-6 py-6 md:space-y-2 md:py-16">
          <h1 className="font-serif font-normal leading-[1.1] text-brand-cream text-2xl md:text-[26px] lg:text-5xl">
            {t.title}
          </h1>
          <p className="font-serif text-sm font-light text-brand-cream/70 md:text-2xl">{t.subtitle}</p>
        </div>
      </div>
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-10 px-6 pt-6 md:pt-12">

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
          <InspireBrowse
            cards={cards}
            lang={lang}
            initialSearch={q}
            initialContinent={activeContinent}
          />
        )}

        <section className="flex flex-col items-start gap-4 rounded-[28px] bg-brand-terracotta p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-serif text-xl font-normal leading-tight">{t.ctaTitle}</p>
            <p className="mt-1 text-sm text-white/70">{t.ctaBody}</p>
          </div>
          <Link
            href={localePath(lang, "/guides")}
            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {t.browseGuides}
          </Link>
        </section>
      </div>
    </main>
  );
}

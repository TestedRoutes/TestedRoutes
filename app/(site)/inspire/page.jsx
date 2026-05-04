import Link from "next/link";
import { loadInspireStories } from "../../_lib/loadInspireStories";
import {
  getInspireFeaturedCardDisplay,
  getInspireStoryHeroAlt,
  getInspireStoryListCardHref,
  getInspireStorySortDateMillis,
  inspireListPrimaryDestinationIsGuide,
  getInspireStoryGuideUrl,
  inspireStoryHasGuide,
} from "../../_lib/inspireStoryDisplay";
import InspireBrowse from "./InspireBrowse";
import { aboutAsset, getCategoryItems } from "../../_lib/categoryPills";

export const metadata = {
  title: "Inspire · TestedRoutes",
  description:
    "Travel stories and journey ideas from 15 years of independent trips across 140 countries – the field work behind every guide.",
};

const COLLECTIONS = [
  {
    title: "Swiss Alpine Days",
    intro:
      "Structured day trips from Zurich that combine alpine scenery, transport logic, and realistic pacing.",
    examples: ["Triftbrücke", "Stoos Ridge", "Mount Rigi", "Säntis"],
    href: "/destinations/switzerland",
  },
  {
    title: "Self-Guided Country Routes",
    intro: "Longer routes built around flow, logistics, and what actually works on the ground.",
    examples: ["Iceland Ring Road", "South Island New Zealand", "Switzerland by train"],
    href: "/inspire",
  },
  {
    title: "Extreme Experiences",
    intro: "The experiences that shape how routes are designed and tested in the real world.",
    examples: ["Running with the bulls", "Shark diving", "Volcano boarding", "Skydiving & paragliding"],
    href: "/inspire",
  },
  {
    title: "Expedition Routes",
    intro: "Long-form journeys shaped by overland logistics, difficult borders, and uncertainty.",
    examples: ["Mongol Rally", "Africa overland route", "Mauritania iron ore train"],
    href: "/inspire",
  },
];

const EXTREME_EXPERIENCES = [
  { label: "Running with the bulls – Spain", file: "Running with bulls Pamplona 2019.jpg" },
  { label: "Shark diving – Fiji", file: "Sharks Fiji 2025.jpg" },
  { label: "Volcano boarding – Nicaragua", file: "Nicaragua boarding 2019.jpg" },
  { label: "Skydiving & paragliding", file: "Paragliding.jpg" },
  { label: "Ice climbing & glacier travel", file: "Ice climbing Italy 2019.jpg" },
  { label: "Riding the iron ore train – Mauritania", file: "Iron Ore train Mauritania 2023.jpg" },
  { label: "Summit pushes above 6,000 m", file: "Summits Alaska 2019 v2.jpg" },
  { label: "Remote border crossings – West Africa", file: "Makoko Nigeria 2025.jpg" },
];

// Rewrite old .html paths to clean Next.js routes.
// Returns a clean URL or null if the story has no destination yet.
function resolveCardHref(story) {
  const metadata = story.metadata || {};
  const guideUrl = getInspireStoryGuideUrl(metadata);
  // Guide-primary stories link to the guide page (post-Phase 4 clean URL).
  if (guideUrl && inspireListPrimaryDestinationIsGuide(metadata)) {
    return guideUrl.startsWith("guides/")
      ? `/${guideUrl.replace(/\.html$/, "")}`
      : guideUrl;
  }
  // Default: inspire story detail page.
  if (story.slug) return `/inspire/${story.slug}`;
  // Fallback to guide if no slug.
  if (guideUrl) {
    return guideUrl.startsWith("guides/")
      ? `/${guideUrl.replace(/\.html$/, "")}`
      : guideUrl;
  }
  return null;
}

function buildCard(story) {
  const display = getInspireFeaturedCardDisplay(story) || {};
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    heroPhoto: story.heroPhoto,
    heroAlt: getInspireStoryHeroAlt(story) || story.title,
    geoLabel: display.geoLabel || "",
    categoryDurationLine: display.categoryDurationLine || "",
    difficultyLabel: display.difficultyLabel || "",
    hasGuide: !!(display.hasGuide ?? inspireStoryHasGuide(story)),
    excerpt: display.excerpt || "",
    familyFriendly:
      story.metadata?.suitability?.family_friendly === true ||
      story.metadata?.suitability?.family_friendly === "true",
    href: resolveCardHref(story),
    dateMillis: getInspireStorySortDateMillis(story) || 0,
  };
}

export default async function InspirePage() {
  const stories = await loadInspireStories();
  const cards = stories.map(buildCard);

  return (
    <main className="w-full pb-16 pt-6 text-slate-900 sm:pt-8">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8 px-4 sm:gap-10 sm:px-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
            Real journeys. Real lessons
          </h1>
          <p className="text-sm leading-snug text-slate-600">
            Stories to spark your next trip
          </p>
        </div>

        <InspireBrowse cards={cards} categoryItems={getCategoryItems()} />

        <section className="grid w-full min-w-0 gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
          {[
            "140+ countries",
            "15+ years of independent planning",
            "5/7 summits completed",
            "Routes tested in real trips",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-semibold text-slate-700"
            >
              {item}
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <p className="text-xl font-semibold">Explore by type of journey</p>
          <div className="grid gap-6 md:grid-cols-2">
            {COLLECTIONS.map((collection) => (
              <div
                key={collection.title}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="h-40 rounded-2xl bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <p className="text-lg font-semibold">{collection.title}</p>
                  <p className="text-sm text-slate-600">{collection.intro}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {collection.examples.map((example) => (
                      <span key={example} className="rounded-full bg-slate-100 px-3 py-1">
                        {example}
                      </span>
                    ))}
                  </div>
                  <Link
                    className="mt-3 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                    href={collection.href}
                  >
                    View collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xl font-semibold">How I test the routes behind my guides</p>
            <p className="mt-2 text-sm text-slate-600">
              I don't build routes from a desk. I test them in the field – through altitude,
              logistics, terrain, and real-world uncertainty.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXTREME_EXPERIENCES.map((item) => (
              <div
                key={item.label}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <img
                  src={aboutAsset(item.file)}
                  alt={item.label}
                  className="h-36 w-full object-cover object-center"
                  loading="lazy"
                />
                <p className="p-3 text-center text-[11px] font-medium leading-snug text-slate-600">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Ready to turn inspiration into a real route?</p>
            <p className="mt-1 text-sm text-slate-500">
              Premium guides built from 15 years of independent travel across 140 countries.
            </p>
          </div>
          <Link
            href="/guides"
            className="shrink-0 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Browse Guides →
          </Link>
        </section>
      </div>
    </main>
  );
}

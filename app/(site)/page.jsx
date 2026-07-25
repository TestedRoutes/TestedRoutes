import Link from "next/link";
import Image from "next/image";
import HomeHero from "../_components/HomeHero";
import HomeBrowse from "../_components/HomeBrowse";
import HomeCategoryTiles from "../_components/HomeCategoryTiles";
import HomeContinents from "../_components/HomeContinents";
import HomeDestinationIndex from "../_components/HomeDestinationIndex";
import HomeGuideRequest from "../_components/HomeGuideRequest";
import { loadGuides, toGuideCard } from "../_lib/loadGuides";
import { loadInspireStories } from "../_lib/loadInspireStories";
import { getInspireStorySortDateMillis } from "../_lib/inspireStoryDisplay";
import { continentSlug, prettyGeo } from "../_lib/continents";
import { getRequestCurrency } from "../_lib/currency";
import { getCategoryItems } from "../_lib/categoryPills";
import { PORTRAIT } from "../_lib/aboutImages";
import { getDict } from "../_lib/i18n";

// TEMPORARY: the grid is four columns and only three guides are published,
// so the Triftbrücke card is repeated to fill the row. Neither Triftbrücke
// card offers a Buy button — GuideListCard keys the button off these two
// fields — so the duplicate cannot take money. Remove all of this once a
// fourth guide ships.
function prepareHomeCards(cards) {
  const noBuy = cards.map((c) =>
    c.slug?.includes("trift") ? { ...c, polarProductId: null, guidePdfUrl: null } : c,
  );
  const trift = noBuy.find((c) => c.slug?.includes("trift"));
  return trift ? [...noBuy, { ...trift, slug: `${trift.slug}-filler` }] : noBuy;
}

// Continent → country index for the two geography sections. Only stories
// that carry both a continent and a country and have a page of their own
// make it in; each country contributes its most recent story.
function buildContinentIndex(stories, { countriesPerCard = 3 } = {}) {
  const byContinent = new Map();

  for (const story of stories) {
    const geo = story.metadata?.geography || {};
    const name = prettyGeo(geo.continent);
    const country = prettyGeo(geo.country);
    if (!name || !country || !story.slug) continue;

    const slug = continentSlug(geo.continent);
    if (!byContinent.has(slug)) {
      byContinent.set(slug, { slug, name, count: 0, countries: new Map() });
    }
    const continent = byContinent.get(slug);
    continent.count += 1;

    const date = getInspireStorySortDateMillis(story) || 0;
    const current = continent.countries.get(country);
    if (!current || date > current.date) {
      continent.countries.set(country, {
        country,
        title: story.title,
        href: `/inspire/${story.slug}`,
        date,
      });
    }
  }

  return [...byContinent.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: c.count,
      entries: [...c.countries.values()]
        .sort((a, b) => b.date - a.date)
        .slice(0, countriesPerCard),
    }));
}

export default async function HomePage() {
  const currency = await getRequestCurrency();
  const [allGuides, stories] = await Promise.all([
    loadGuides(currency),
    loadInspireStories("en"),
  ]);
  const searchableGuides = allGuides.map((g) => ({
    title: g.title,
    slug: g.slug,
    category: g.category,
    href: g.href,
  }));
  const guideCards = prepareHomeCards(allGuides.map(toGuideCard));
  const continents = buildContinentIndex(stories);

  return (
    <main className="flex w-full flex-col">
      <HomeHero guides={searchableGuides} />

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div className="mb-10 space-y-3 text-center">
          {/* 18pt = 24px. */}
          <p className="font-sans text-[24px] uppercase leading-tight tracking-[0.2em] text-slate-500">
            AI has not been there. I have
          </p>
          {/* Fraunces 72pt Supersoft Light (globals.css) at 54pt = 72px. */}
          <h2 className="font-serif font-light leading-tight text-brand-ink text-3xl md:text-5xl lg:text-[72px]">
            Discover the latest guides
          </h2>
        </div>
        <HomeBrowse cards={guideCards} t={getDict("en").guideList} />
      </section>

      <HomeContinents continents={continents}>
        <HomeCategoryTiles items={getCategoryItems()} />
      </HomeContinents>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 md:gap-20 md:py-24">
        <HomeDestinationIndex continents={continents} />

        <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[260px_1fr] md:gap-8">
          <Image
            src={PORTRAIT}
            alt="Paulius on the road"
            sizes="(min-width: 768px) 260px, 100vw"
            className="h-44 w-full rounded-2xl object-cover object-center md:h-full md:max-h-[320px]"
          />
          <div className="mt-6 space-y-5 md:mt-0">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About me</p>
              <h2 className="font-serif text-xl font-light leading-tight text-brand-ink md:text-[32px]">
                Fifteen years on the road.
              </h2>
              <p className="font-serif font-supersoft text-base font-light leading-relaxed text-slate-600">
                Real trips. Real routes. Not desk research, not aggregated reviews.
              </p>
            </div>
            <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="font-semibold text-slate-900">140 countries</span> travelled
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="font-semibold text-slate-900">500+ trips</span> documented over 15 years
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="font-semibold text-slate-900">5 of 7 Summits</span> climbed
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="font-semibold text-slate-900">4 Africa Rally</span> expeditions
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:col-span-2">
                <span className="font-semibold text-slate-900">100+ bucket-list experiences</span> completed
              </li>
            </ul>
            <Link
              className="inline-flex text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500"
              href="/about"
            >
              Read the full story →
            </Link>
          </div>
        </section>

        <HomeGuideRequest />
      </div>
    </main>
  );
}

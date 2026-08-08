import Link from "next/link";
import Image from "next/image";
import HomeHero from "../_components/HomeHero";
import HomeBrowse from "../_components/HomeBrowse";
import HomeAdventureGrid from "../_components/HomeAdventureGrid";
import HomeDestinationIndex from "../_components/HomeDestinationIndex";
import HomeGuideRequest from "../_components/HomeGuideRequest";
import { loadGuides, toGuideCard } from "../_lib/loadGuides";
import { continentSlug, prettyGeo } from "../_lib/continents";
import { getRequestCurrency } from "../_lib/currency";
import { getCategoryItems } from "../_lib/categoryPills";
import { ABOUT_IMAGES } from "../_lib/aboutImages";
import { getDict } from "../_lib/i18n";

// Continent → country index of the guide catalogue for the destination
// cards (founder 2026-08-08: those cards sell guides now, not stories).
// Each country lists its guides by title — same structure the section had
// when it listed inspire stories — capped per country; the component links
// any overflow to the guide browser pre-searched to the country (the
// search haystack includes geography, so ?q=<country> lands filtered and
// user-clearable).
function buildGuideGeoIndex(guides, { countriesPerCard = 4, guidesPerCountry = 3 } = {}) {
  const byContinent = new Map();

  for (const g of guides) {
    const geo = g.metadata?.geography || {};
    const name = prettyGeo(geo.continent);
    const country = prettyGeo(geo.country);
    if (!name || !country || !g.href) continue;

    const slug = continentSlug(geo.continent);
    if (!byContinent.has(slug)) {
      byContinent.set(slug, { slug, name, count: 0, countries: new Map() });
    }
    const continent = byContinent.get(slug);
    continent.count += 1;

    const entry = continent.countries.get(country) || {
      country,
      count: 0,
      guides: [],
    };
    entry.count += 1;
    if (entry.guides.length < guidesPerCountry) {
      entry.guides.push({ title: g.title, href: g.href });
    }
    continent.countries.set(country, entry);
  }

  return [...byContinent.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: c.count,
      entries: [...c.countries.values()]
        .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country))
        .slice(0, countriesPerCard),
    }));
}

export default async function HomePage() {
  const currency = await getRequestCurrency();
  const allGuides = await loadGuides(currency);
  const searchableGuides = allGuides.map((g) => ({
    title: g.title,
    slug: g.slug,
    category: g.category,
    href: g.href,
  }));
  const guideCards = allGuides.map(toGuideCard);
  const guideGeo = buildGuideGeoIndex(allGuides);

  return (
    <main className="flex w-full flex-col">
      <HomeHero guides={searchableGuides} />

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-16 md:pt-20">
        <div className="mb-10 space-y-3 text-center">
          {/* Fraunces 72pt Supersoft Light (globals.css) at 54pt = 72px. */}
          <h2 className="font-serif font-light leading-tight text-brand-ink text-3xl md:text-5xl lg:text-[72px]">
            Discover the latest guides
          </h2>
          {/* Mynerve regular under the heading (founder 2026-08-08). A
              handwriting face needs its own case and spacing, so the
              uppercase + wide tracking come off. All Mynerve section lines
              sit at a flat 32px (founder 2026-08-08). */}
          <p className="font-script text-[32px] leading-tight text-slate-500">
            AI has not been there. I have
          </p>
        </div>
        {/* "Choose your adventure" v2 (founder mockup 2026-08-08) rides
            into the grid as an interlude after the first two rows of cards
            — photo cards on the plain canvas instead of the old taupe pill
            band, still driving the grid over the same window events. The
            explicit key matters: server-created elements arrive frozen on
            the client, so React key-checks them among siblings. */}
        <HomeBrowse
          cards={guideCards}
          t={getDict("en").guideList}
          interlude={
            // Full-page-width Taupe Grey #5F524D band (founder 2026-08-08),
            // breaking out of the max-w container like the guides-page bands.
            <div
              key="choose-your-adventure"
              className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-taupe py-12 md:py-16"
            >
              <div className="mx-auto w-full max-w-7xl px-6">
                <HomeAdventureGrid items={getCategoryItems()} cards={guideCards} />
              </div>
            </div>
          }
        />
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 md:gap-20 md:py-24">
        <HomeDestinationIndex continents={guideGeo} />

        {/* About band (founder mockup 2026-08-08, v2 — replaces the
            scrapbook layout from earlier the same day): a wide on-the-road
            photo with the heading over it, then the intro paragraph and
            fact list on the #DCDACD palette background (the brand-bone
            token; tailwind.config.js has the bone/parchment names swapped
            relative to styleguide V3). */}
        <section className="overflow-hidden rounded-[28px] bg-brand-bone">
          <div className="relative h-[280px] md:h-[360px]">
            <Image
              src={ABOUT_IMAGES["Why I do this.jpg"]}
              alt="Standing on the Edge of the World cliffs outside Riyadh, Saudi Arabia"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover object-[50%_55%]"
            />
            {/* Bright desert sky — the heading needs its own floor. */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8">
              <h2 className="font-serif text-3xl font-light leading-tight text-white md:text-5xl">
                Fifteen years on the road
                <span className="text-brand-terracotta">.</span>
              </h2>
              <p className="mt-1 font-serif font-supersoft text-lg font-light text-white/90 md:text-2xl">
                Real trips. Real routes.
              </p>
            </div>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <p className="max-w-3xl text-lg leading-relaxed text-slate-700 md:text-[22px]">
              Every route here comes from trips I have planned and tested
              myself across more than 140 countries, from day hikes in
              Switzerland to overland travel through West Africa.
            </p>
            <ul className="mt-6 grid max-w-3xl gap-x-10 gap-y-2.5 text-base text-slate-700 sm:grid-cols-2">
              <li className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="text-brand-terracotta">•</span>
                140 countries and counting
              </li>
              <li className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="text-brand-terracotta">•</span>
                5 of 7 Summits climbed
              </li>
              <li className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="text-brand-terracotta">•</span>
                4× Africa Rally, one blown gearbox
              </li>
              <li className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="text-brand-terracotta">•</span>
                500+ trips in the notebooks
              </li>
            </ul>
            <Link
              className="mt-8 inline-flex border-b-2 border-brand-terracotta pb-0.5 font-sans text-base font-bold text-slate-900 transition hover:text-brand-terracotta"
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

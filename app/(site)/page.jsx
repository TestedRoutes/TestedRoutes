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
import { ABOUT_IMAGES } from "../_lib/aboutImages";
import { getDict } from "../_lib/i18n";

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
  const guideCards = allGuides.map(toGuideCard);
  const continents = buildContinentIndex(stories);
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
        <HomeBrowse cards={guideCards} t={getDict("en").guideList} />
      </section>

      <HomeContinents continents={continents}>
        <HomeCategoryTiles items={getCategoryItems()} />
      </HomeContinents>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 md:gap-20 md:py-24">
        <HomeDestinationIndex continents={guideGeo} />

        {/* Scrapbook About block (founder mockup 2026-08-08): flat on the
            canvas instead of a white card — handwritten notes, a dotted
            route doodle, and two taped-down polaroids from the archive.
            Captions describe the actual photos; the mockup's placeholder
            captions named places we have no shots of. */}
        <section className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-script text-[32px] leading-tight text-slate-500">
                about me – the person behind the maps
              </p>
              <h2 className="font-serif text-3xl font-light leading-tight text-brand-ink md:text-5xl">
                Fifteen years on the road
                <span className="text-brand-terracotta">.</span>
              </h2>
              <p className="font-serif font-supersoft text-base font-light leading-relaxed text-slate-600">
                Real trips. Real routes. Not desk research, not aggregated reviews.
              </p>
            </div>

            {/* The count ticking up: superseded totals struck through in
                the margin, the live number full-size. */}
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-script text-xl text-slate-400 line-through decoration-slate-400/70 decoration-2">
                127
              </span>
              <span className="font-script text-xl text-slate-400 line-through decoration-slate-400/70 decoration-2">
                138
              </span>
              <span className="font-serif text-7xl font-light leading-none text-brand-ink md:text-[96px]">
                140
              </span>
              <span className="font-script text-xl text-brand-terracotta md:text-2xl">
                countries, so far
              </span>
            </p>

            <ul className="space-y-2 font-script text-lg leading-snug text-slate-700">
              <li>5 of 7 Summits climbed</li>
              <li className="pl-5">4× Africa Rally, one blown gearbox</li>
              <li className="pl-2">500+ trips in the notebooks since 2011</li>
            </ul>

            <Link
              className="inline-flex border-b-2 border-brand-terracotta pb-0.5 font-sans text-sm font-bold text-slate-900 transition hover:text-brand-terracotta"
              href="/about"
            >
              Read the full story →
            </Link>
          </div>

          <div className="relative mt-12 md:mt-0">
            {/* Dotted route doodle wandering up toward the photos, with
                little travel glyphs along the way. Decorative only. */}
            <svg
              viewBox="0 0 400 300"
              aria-hidden="true"
              className="absolute -left-24 top-8 -z-10 hidden w-[420px] text-brand-terracotta lg:block"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M 10 240 C 90 290, 170 270, 220 200 S 300 80, 385 40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0.5 9"
              />
              {/* paper plane */}
              <g transform="translate(52 244) rotate(-15)" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M0 6 L18 0 L8 14 Z M8 14 L7 8 L18 0" />
              </g>
              {/* camper van */}
              <g transform="translate(150 258)" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M1 10 V3 Q1 1 3 1 H14 L19 5 V10 H1 Z M12 1 V5 H19" />
                <circle cx="5.5" cy="11" r="2" />
                <circle cx="14.5" cy="11" r="2" />
              </g>
              {/* bicycle */}
              <g transform="translate(238 178)" strokeWidth="1.5" strokeLinejoin="round">
                <circle cx="4" cy="11" r="4" />
                <circle cx="16" cy="11" r="4" />
                <path d="M4 11 L8 4 H13 L16 11 M8 4 L10 11 H4 M12 2 H15" />
              </g>
              {/* sailboat */}
              <g transform="translate(320 88)" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M9 0 V10 M9 1 L16 10 H9 M2 12 H18 L15 16 H5 Z" />
              </g>
            </svg>

            <figure className="relative ml-auto w-[78%] max-w-[340px] rotate-2 bg-white p-3 pb-4 shadow-card">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-3 bg-brand-bone/80"
              />
              <Image
                src={ABOUT_IMAGES["Mt Cook - NZ 2026.jpg"]}
                alt="Aoraki / Mt Cook, New Zealand"
                sizes="(min-width: 768px) 340px, 78vw"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="mt-3 text-right font-script text-base text-slate-700">
                Mt Cook, last January. Still cold.
              </figcaption>
            </figure>

            <figure className="relative -mt-14 w-[62%] max-w-[280px] -rotate-3 bg-white p-3 pb-4 shadow-card">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-6 w-20 -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-brand-bone/80"
              />
              <Image
                src={ABOUT_IMAGES["Iron Ore train Mauritania 2023.jpg"]}
                alt="Riding the iron-ore train through the Sahara, Mauritania"
                sizes="(min-width: 768px) 280px, 62vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="mt-3 font-script text-base text-slate-700">
                the iron-ore train, Mauritania
              </figcaption>
            </figure>

            <p className="mt-8 text-right font-script text-lg md:text-xl">
              <Link
                href="/guides"
                className="text-brand-terracotta transition hover:text-brand-flame"
              >
                Where to next?
              </Link>
            </p>
          </div>
        </section>

        <HomeGuideRequest />
      </div>
    </main>
  );
}

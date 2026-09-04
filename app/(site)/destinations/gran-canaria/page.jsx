import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import miradorSignpostAtDusk from "../../../../content/countries/canary-islands/destination/generated/web/mirador-signpost-at-dusk.jpg";
import duneJumpAtSunset from "../../../../content/countries/canary-islands/destination/generated/web/dune-jump-at-sunset.jpg";
import puertoDeMoganMorning from "../../../../content/countries/canary-islands/destination/generated/web/puerto-de-mogan-morning.jpg";
import artenaraCaveBalcony from "../../../../content/countries/canary-islands/destination/generated/web/artenara-cave-balcony.jpg";
import guayadequeCactusSlope from "../../../../content/countries/canary-islands/destination/generated/web/guayadeque-cactus-slope.jpg";
import slotCanyonWide from "../../../../content/countries/canary-islands/destination/generated/web/slot-canyon-wide.jpg";
import barrancoWallLookout from "../../../../content/countries/canary-islands/destination/generated/web/barranco-wall-lookout.jpg";
import caveWindowOverTheRidges from "../../../../content/countries/canary-islands/destination/generated/web/cave-window-over-the-ridges.jpg";
import roqueNubloUpClose from "../../../../content/countries/canary-islands/destination/generated/web/roque-nublo-up-close.jpg";
import dunesSunsetWalker from "../../../../content/countries/canary-islands/destination/generated/web/dunes-sunset-walker.jpg";
import centralMassifPanorama from "../../../../content/countries/canary-islands/destination/generated/web/central-massif-panorama-gran-canaria.jpg";
import guayadequeRavine from "../../../../content/countries/canary-islands/destination/generated/web/guayadeque-ravine.jpg";
import maspalomasDuneRipples from "../../../../content/countries/canary-islands/destination/generated/web/maspalomas-dune-ripples.jpg";
import playaDeLasNievesCliffs from "../../../../content/countries/canary-islands/destination/generated/web/playa-de-las-nieves-cliffs.jpg";
import granCanariaInteriorTracks from "../../../../content/countries/canary-islands/destination/generated/web/gran-canaria-interior-tracks.jpg";
import pineRingedReservoir from "../../../../content/countries/canary-islands/destination/generated/web/pine-ringed-reservoir-gran-canaria.jpg";
import roqueNubloBalconyPanorama from "../../../../content/countries/canary-islands/destination/generated/web/roque-nublo-balcony-panorama.jpg";
import puertoDeLasNievesHarbour from "../../../../content/countries/canary-islands/destination/generated/web/puerto-de-las-nieves-harbour.jpg";

/*
 * Scope note (destination playbook §7): island-level decision page. The
 * archipelago hub owns WHICH island; this page owns whether Gran Canaria is
 * worth it, how long, when, and how the island is structured. Guide-only and
 * absent: the slot canyon's access pin/parking mechanics, within-day
 * sequencing, venue and bed picks. The published stories are the outer
 * boundary - the canyon's timing game and flash-flood rule, the Roque Nublo
 * late-afternoon logic and the early-heat rule in the ravines all come from
 * them. The Gran Canaria 7D SKU is PLANNED (wave 3), not built - no "the
 * guide carries X"; pointer pass owed at SKU publish.
 */

const STORY_SLUGS = [
  "gran-canaria-roque-nublo",
  "gran-canaria-barranco-las-vacas",
  "gran-canaria-guayadeque-caves",
  "tenerife-vs-gran-canaria-island",
  "tenerife-gc-winter-sun-europe",
  "canaries-four-islands-ferry",
];

export const metadata = {
  title:
    "Gran Canaria: how many days you need, and why the interior wins · TestedRoutes",
  description:
    "How many days Gran Canaria needs, whether it is worth visiting, when to go – and why the mountain interior, not the beach strip, is the island's real product.",
  alternates: { canonical: "/destinations/gran-canaria" },
  openGraph: {
    type: "article",
    url: "/destinations/gran-canaria",
    title: "Gran Canaria: how many days you need, and why the interior wins",
    description:
      "The road-trip island of the Canaries, tested: a viewpoint every few bends, cave villages, a slot canyon, a stone giant, and desert dunes at the bottom.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The winter-sun season and the island's high season: shirt-sleeve afternoons on the south coast and a swimmable sea while home is grey. We tested mid-November - full sightseeing days, warm evenings by the dunes, and an interior that runs brown after the long summer."],
  ["April to June", "The interior at its greenest and the mountain roads at their best. The lull between the winter escape and the summer holidays keeps the miradors quiet."],
  ["July and August", "Hottest and busiest, with the south coast at full family capacity. The mountain interior stays cooler than the coast and is the smart place to spend the middle of the day."],
  ["September and October", "The warmest sea of the year and the thinnest crowds - the quiet sweet spot for a swimming-first trip."],
  ["What I would pick", "November to February for the winter-escape magic, accepting the browner interior - that is the tested version. Late spring if the mountain half matters most, paying with a cooler sea."],
];

const HOW_LONG = [
  ["A long weekend", "Winter sun on the south coast plus one interior day. It works, but the interior day will be the one you remember, and you will wish you had planned two."],
  ["Five days", "The bottom of the sensible range: the mountain interior, the southeast ravines, the dunes and a rest day fit - tightly."],
  ["Seven days", "Comfortable. The interior twice (it deserves it), the ravine day, the north coast, and beach days that are actually restful rather than scheduled."],
  ["Pairing islands", "Gran Canaria pairs naturally with Tenerife by ferry - we did exactly that, and the contrast is the trip. The archipelago page compares all four islands if you are still choosing."],
];

const REGIONS = [
  {
    name: "The mountain interior",
    image: centralMassifPanorama,
    alt: "The central massif of Gran Canaria, ridge behind ridge with Roque Bentayga on the skyline",
    body: "The island's real product: hairpin roads that produce a mirador every few bends, villages like Artenara living half inside the rock, pine forest around high reservoirs, and the stone giant of Roque Nublo crowning the middle. This is where the driving hours go, and where they pay best.",
  },
  {
    name: "Guayadeque and the southeast",
    image: guayadequeRavine,
    alt: "The steep red walls of the Barranco de Guayadeque above a railed path, Gran Canaria",
    body: "Deep ravines cut the island's east, and two of its most particular sights hide in them: a valley where houses and restaurants are carved into the rock, and a little slot canyon whose terracotta curves pass for a pocket Arizona. Neither takes long; both are unlike anywhere else on the island.",
  },
  {
    name: "The dunes and the south",
    image: maspalomasDuneRipples,
    alt: "Rippled sand dunes running toward the resort strip and mountains at Maspalomas, Gran Canaria",
    body: "Maspalomas is the resort machine, and directly beside it lies the reason to come anyway: a field of true desert dunes rolling to the lighthouse, doing a full Sahara impression at sunset. The strip is the base and the warmth; the dunes are the show.",
  },
  {
    name: "The north coast and Agaete",
    image: playaDeLasNievesCliffs,
    alt: "The dark pebble beach of Playa de las Nieves under high cliffs at Agaete, Gran Canaria",
    body: "Quieter, greener at the edges, and more local: Agaete's harbour village under big cliffs, a dark-pebble beach worth a swim after a mountain day, and Gáldar's old streets nearby. Also the island's ferry corner - Tenerife is a short crossing from this coast.",
  },
];

const CAROUSEL = [
  { image: puertoDeMoganMorning, alt: "Sailboats in the marina of Puerto de Mogán under its headland, Gran Canaria", caption: "Puerto de Mogán, the first base" },
  { image: granCanariaInteriorTracks, alt: "Dirt tracks winding through the bare mountain interior of Gran Canaria, palms in the foreground", caption: "The interior, mid-drive" },
  { image: pineRingedReservoir, alt: "A reservoir ringed by pines below bare ridges in the Gran Canaria mountains", caption: "Pine country, around the reservoirs" },
  { image: artenaraCaveBalcony, alt: "A cave-house balcony at Artenara with plants, corn and a kettle over the mountain view, Gran Canaria", caption: "A balcony inside the rock, Artenara" },
  { image: guayadequeCactusSlope, alt: "Cactus on the steep slopes of the Barranco de Guayadeque, Gran Canaria", caption: "Guayadeque, ravine country" },
  { image: slotCanyonWide, alt: "A figure in red between the curved walls of the Barranco de las Vacas slot canyon, Gran Canaria", caption: "The little slot canyon" },
  { image: barrancoWallLookout, alt: "The founder sitting on a stone wall above a barranco panorama, Gran Canaria", caption: "Mirador country, southeast" },
  { image: caveWindowOverTheRidges, alt: "The mountain heart of Gran Canaria seen through a cave window near Roque Nublo", caption: "A window in the rock" },
  { image: roqueNubloUpClose, alt: "Roque Nublo and El Fraile up close, a walker tiny at the base, Gran Canaria", caption: "The stone giant, up close" },
  { image: roqueNubloBalconyPanorama, alt: "A hiker on the balcony rocks beside Roque Nublo, ridges fading behind, Gran Canaria", caption: "The balcony rocks, past the monolith" },
  { image: puertoDeLasNievesHarbour, alt: "Boats in the harbour of Puerto de las Nieves under the Agaete cliffs, Gran Canaria", caption: "Puerto de las Nieves, Agaete" },
  { image: dunesSunsetWalker, alt: "A walker on a Maspalomas dune ridge at sunset, Gran Canaria", caption: "Maspalomas, at closing time" },
];

// §8: no tier totals. The ONE figure is the flight pair, echoed once in the FAQ.
const COSTS = [
  ["Lean", "A self-catering base away from the strip, supermarket picnics for the mountain days, and an island whose best material - the miradors, the dunes, the ravines - charges nothing"],
  ["Core", "Small hotels or a south-coast base plus an interior night, restaurant dinners, and the few paid bookings that exist here"],
  ["Splurge", "The resort tier along the southern coast - money buys the pool landscape and the spa, not access"],
];

const TIPS = [
  ["At the slot canyon, timing beats fame.", "Barranco de las Vacas went from secret to Instagram queue in a few years - on a busy afternoon twenty people share fifty metres of rock. Early on a weekday morning it is still close to the place we had entirely to ourselves. And skip it outright if rain is possible in the mountains: slot canyons flash-flood fast."],
  ["Do the ravines early, the dunes late.", "By mid-morning the heat is already running the show in Guayadeque - we walked at ten and were glad we had not started later. The dunes work the opposite way: late afternoon light turns Maspalomas into the Sahara, and sunset there is the best free show on the island."],
  ["Walk to Roque Nublo's feet - and past them.", "Everyone photographs the monolith from the miradors; far fewer take the short walk up, and almost nobody continues onto the balcony rocks just beyond, where the whole mountainous heart of the island opens up. On clear days Teide floats on the horizon one island over."],
];

const FAQ = [
  ["How many days do you need in Gran Canaria?", "Five to seven. Five covers the mountain interior, the southeast ravines and the dunes at a brisk pace; seven makes the trip comfortable and gives the interior the second day it deserves. A long weekend works only as winter sun plus a single interior day - which will promptly convince you the island needed more."],
  ["Is Gran Canaria worth visiting?", "Yes - as a road-trip island above all. Nothing here matches Teide next door, and it does not matter: the density per driving hour is the best in the archipelago. Mirador after mirador, cave villages, a slot canyon, the Roque Nublo walk, and desert dunes at the bottom of it all. If your idea of a trip is a car, corners and variety, this is the Canary island to pick."],
  ["Gran Canaria or Tenerife?", "Drivers, hikers and viewpoint collectors: Gran Canaria - more variety per kilometre, fewer coaches. First visit for the biggest single sights: Tenerife. We drove both on the same trip and wrote the comparison up properly - and since a ferry links them, pairing both in one week is barely more logistics than choosing."],
  ["What is Roque Nublo, and is the hike hard?", "A stone monolith the height of a city block, standing on a plateau at the island's heart - and no, the walk is one of the easiest big-reward hikes we know: well under an hour each way from the road, through pines and onto open rock. The move most people miss is continuing onto the neighbouring balcony rocks for the full panorama."],
  ["Is the Barranco de las Vacas slot canyon worth it?", "Yes, with expectations set: it is roughly fifty metres of wave-curved terracotta rock, a pocket edition of Arizona's famous canyons, and it takes half an hour. It is no longer a secret - expect company and a queue for the photo rock at busy times, go early on a weekday, and stay away entirely when mountain rain is possible."],
  ["Are the Maspalomas dunes free, and worth the stop?", "Free, open, and genuinely worth building an evening around - a real dune field rolling to a lighthouse, big enough to lose the crowds in, doing a convincing Sahara impression at sunset. Walk in barefoot, keep to the marked routes where posted, and give it the golden hour rather than midday."],
  ["Do you need a car in Gran Canaria?", "For the island this page describes, absolutely. The coast strips survive without one, but the entire interior - the miradors, Artenara, Roque Nublo, the ravines - is drive-to, and the mountain roads are the attraction as much as the destinations. Budget more time than the map says; nothing up there is straight for a hundred metres."],
  ["Is Gran Canaria warm enough to swim in winter?", "Yes - the south coast runs shirt-sleeve warm through winter and the Atlantic sits around 19 to 20 °C: refreshing, entirely swimmable on a sunny afternoon. We swam at Playa de las Nieves after a mountain day in mid-November. The interior is its own cooler, windier country - pack a layer for the miradors."],
  ["Is Las Palmas worth visiting?", "We can only answer honestly: we passed through it to the ferry and did not test it, so this page will not pretend. The island we can vouch for is the interior, the ravines, the dunes and the Agaete coast - and a week fills completely without the capital."],
  ["Is Gran Canaria expensive?", "No. Return flights from most of western and northern Europe typically come in under €150 with sale fares far lower, and on the ground prices sit at or below mainland-Spain levels. The bed is the only line with real range - winter is the high season here. The best of the island is free."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchContent() {
  try {
    return await client.fetch(
      `{
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && slug.current in $slugs && (language == "en" || !defined(language))] | order(publishedDate desc){
          title, "slug": slug.current, subtitle, heroImage
        }
      }`,
      { slugs: STORY_SLUGS },
    );
  } catch {
    return { stories: [] };
  }
}

function storyImage(heroImage, width = 800) {
  if (!heroImage?.asset) return null;
  try {
    return urlFor(heroImage).width(width).fit("max").auto("format").quality(80).url();
  } catch {
    return null;
  }
}

export default async function GranCanariaDestinationPage() {
  const { stories } = await fetchContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Gran Canaria: how many days you need, and why the interior wins",
        description:
          "How many days Gran Canaria needs, whether it is worth visiting, when to go – and why the mountain interior, not the beach strip, is the island's real product.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Gran Canaria" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/gran-canaria",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/destinations" className="hover:text-slate-600">
          Destinations
        </Link>
        <span>›</span>
        <Link href="/destinations/canary-islands" className="hover:text-slate-600">
          Canary Islands
        </Link>
        <span>›</span>
        <span className="text-slate-600">Gran Canaria</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Canary Islands · Spain
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Gran Canaria
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, when to go, and why the mountain interior –
          not the beach strip – is the island's real product.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            {/* Hero = the founder's gran-canaria/hero.jpeg pick (re-cull 2026-09-04). */}
            <Image
              src={miradorSignpostAtDusk}
              alt="A trail signpost at a mirador over Gran Canaria's mountain heart at dusk"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Gran Canaria worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Gran Canaria opened our four-island November run, and it is
                the island that first argued me out of my Canaries prejudice.
                On paper it is the number-two island, the one with the resort
                strip at the bottom. In the car it turned out to be a machine
                for producing viewpoints: hairpin roads, palm gorges, the
                highest village on the island with houses built into the
                rock, and mirador after mirador of bare, sculpted terrain.
                Nothing here matches Teide one island over - and it does not
                matter, because the density per driving hour is the best in
                the archipelago.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do is drive, walk and stare, in that order.
                One day belongs to the mountain interior: Tejeda, Artenara
                and its cave houses, the pine forests, and the short walk to
                the feet of Roque Nublo, the stone giant that keeps appearing
                in the windscreen all day before you finally stand under it.
                Another belongs to the southeast: a ravine where the island
                still lives in caves - houses, storerooms, whole restaurants
                dug into the rock - and a little slot canyon in terracotta
                curves that we once had entirely to ourselves. And every day
                can end the same way: barefoot in the Maspalomas dunes, where
                the sunset does a convincing impression of the Sahara.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest version of the reputation: yes, the south coast is
                a resort machine, and no, you should not fight it - use it.
                It is the reliable warmth, the easy bed, the evening pool.
                The trick of Gran Canaria is that the crowds concentrate
                themselves so completely along that strip that a rental car
                makes the rest of the island feel half-discovered, even in
                high season. We were there in November: full sightseeing
                days, warm evenings, an interior running brown after the
                summer - greener in spring - and not one regret about
                choosing the number-two island first.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                No closed season - the month picks your trade-offs. The coast
                and the mountains run different weather on the same day.
              </p>
              <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
                <div className="divide-y divide-slate-100">
                  {WHEN_TO_GO.map(([label, text]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-[200px_1fr] md:gap-4"
                    >
                      <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="text-[14px] text-slate-900">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeading>How long to stay</SectionHeading>
              <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
                <div className="divide-y divide-slate-100">
                  {HOW_LONG.map(([label, text]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-[220px_1fr] md:gap-4"
                    >
                      <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                      <p className="text-[14px] text-slate-900">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Choosing between islands rather than within one? The{" "}
                <Link
                  href="/destinations/canary-islands"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Canary Islands page
                </Link>{" "}
                compares all four.
              </p>
            </section>

            <section className="space-y-6">
              <SectionHeading>The island, in four parts</SectionHeading>
              <div className="grid gap-6 sm:grid-cols-2">
                {REGIONS.map((region) => (
                  <article
                    key={region.name}
                    className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card"
                  >
                    <Image
                      src={region.image}
                      alt={region.alt}
                      className="aspect-[4/3] w-full object-cover"
                      sizes="(max-width: 640px) 100vw, 380px"
                    />
                    <div className="space-y-2 p-5">
                      <h3 className="font-serif text-xl text-brand-ink">{region.name}</h3>
                      <p className="text-[14px] leading-relaxed text-slate-700">{region.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Gran Canaria's airport sits on the east coast with direct
                flights from all over Europe year-round - one of the densest
                winter-sun networks on the continent. This is Spain: euros,
                EU roaming, Schengen rules, and a clock level with London,
                one hour behind Madrid.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Rent a car - the whole case for this island is drive-to. The
                mountain roads are magnificent and slow; treat map times as
                optimistic, and treat the driving itself as part of the
                sightseeing rather than the cost of it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Ferries connect the island onward - Tenerife from the Agaete
                corner in the northwest, Fuerteventura from Las Palmas. We
                arrived by air, left by ferry, and carried the same rental
                car across every crossing of a four-island trip. Which
                pairings are worth it is the archipelago page's question.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the line every alternative loses to: return
                flights from most of western and northern Europe typically
                come in under €150, and sale fares go far lower. On the
                ground, prices sit at or below mainland-Spain levels - and
                the island's best material is free.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
                <table className="w-full min-w-[480px] text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3 font-semibold">Style</th>
                      <th className="px-5 py-3 font-semibold">What that looks like</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-900">
                    {COSTS.map(([style, looks]) => (
                      <tr key={style}>
                        <td className="px-5 py-3 font-medium align-top">{style}</td>
                        <td className="px-5 py-3 text-slate-700">{looks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The bed is the only line with real range, and winter - the
                high season here - is when it moves most. The car and the
                fuel stay cheap in every month.
              </p>
            </section>

            <section className="space-y-5">
              <SectionHeading>Tested tips</SectionHeading>
              <div className="space-y-4">
                {TIPS.map(([title, body]) => (
                  <div key={title} className="rounded-2xl border border-brand-line bg-white p-5">
                    <p className="text-[14px] font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-700">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="relative overflow-hidden rounded-[28px]">
              {/* Closing image = the founder's gran-canaria/last.jpg pick. */}
              <Image
                src={duneJumpAtSunset}
                alt="The founder mid-jump on a Maspalomas dune crest at sunset, Gran Canaria"
                className="h-[420px] w-full object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            <section className="space-y-4">
              <SectionHeading>FAQ</SectionHeading>
              <div className="overflow-hidden rounded-2xl border border-brand-line bg-white divide-y divide-slate-100">
                {FAQ.map(([question, answer]) => (
                  <details key={question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
                      <span>{question}</span>
                      <span aria-hidden className="text-slate-400 transition group-open:rotate-180">
                        ▾
                      </span>
                    </summary>
                    <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{answer}</div>
                  </details>
                ))}
              </div>
            </section>

            {stories?.length ? (
              <section className="space-y-4">
                <SectionHeading>Stories from Gran Canaria</SectionHeading>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story) => (
                    <Link
                      key={story.slug}
                      href={`/inspire/${story.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      {storyImage(story.heroImage) ? (
                        <img
                          src={storyImage(story.heroImage)}
                          alt={story.title}
                          className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-[4/3] w-full bg-slate-100" />
                      )}
                      <div className="flex flex-1 flex-col gap-1 p-4">
                        <p className="font-serif text-base font-medium leading-snug text-slate-900 group-hover:text-slate-700">
                          {story.title}
                        </p>
                        {story.subtitle ? (
                          <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">
                            {story.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

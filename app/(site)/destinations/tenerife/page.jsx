import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import roquesDeGarciaAboveClouds from "../../../../content/countries/canary-islands/destination/generated/web/roques-de-garcia-above-the-clouds.jpg";
import teideConeClearMorning from "../../../../content/countries/canary-islands/destination/generated/web/teide-cone-clear-morning.jpg";
import taganangaAndTheAnagaCoast from "../../../../content/countries/canary-islands/destination/generated/web/taganana-and-the-anaga-coast.jpg";
import garachicoRoqueAndLavaPools from "../../../../content/countries/canary-islands/destination/generated/web/garachico-roque-and-lava-pools.jpg";
import losGigantesMarinaUnderCliffs from "../../../../content/countries/canary-islands/destination/generated/web/los-gigantes-marina-under-cliffs.jpg";
import mascaGorgeToTheSea from "../../../../content/countries/canary-islands/destination/generated/web/masca-gorge-to-the-sea.jpg";
import mascaVillageInItsGorge from "../../../../content/countries/canary-islands/destination/generated/web/masca-village-in-its-gorge.jpg";
import anagaLaurelForestRoad from "../../../../content/countries/canary-islands/destination/generated/web/anaga-laurel-forest-road.jpg";
import anagaCliffsBreakingWave from "../../../../content/countries/canary-islands/destination/generated/web/anaga-cliffs-breaking-wave.jpg";
import garachicoTownAndRoque from "../../../../content/countries/canary-islands/destination/generated/web/garachico-town-and-roque.jpg";
import garachicoPlazaDragonTrees from "../../../../content/countries/canary-islands/destination/generated/web/garachico-plaza-dragon-trees.jpg";
import roqueCinchadoAndTeide from "../../../../content/countries/canary-islands/destination/generated/web/roque-cinchado-and-teide.jpg";
import costaAdejeVillaTerrace from "../../../../content/countries/canary-islands/destination/generated/web/costa-adeje-villa-terrace.jpg";
import losGigantesFromPlayaDeLosGuios from "../../../../content/countries/canary-islands/destination/generated/web/los-gigantes-from-playa-de-los-guios.jpg";

/*
 * Scope note (destination playbook §7): island-level decision page. The
 * archipelago hub (/destinations/canary-islands) owns WHICH island; this page
 * owns whether Tenerife is worth it, how long, when, and which side to stay
 * on. Guide-only and absent: Teide's booking platform/fee/slot mechanics,
 * within-day sequencing, venue and bed picks, ferry timetables. The published
 * inspire stories are the free tier's outer boundary (the Teide sell-out
 * trap, the cloud-layer drive, the old-town evenings come from them).
 *
 * The Tenerife 7D SKU is PLANNED (wave 2) and not built - no sentence may say
 * "the guide carries X". Pointer pass over FAQ + how-long owed at SKU publish,
 * including scoping the guide fetch to this island's SKUs.
 *
 * Stories are fetched by an explicit slug list (STORY_SLUGS) - all Canary
 * stories reference the one destination-canary-islands doc; per-island
 * destination docs are deferred to the SKU era. New Tenerife stories must be
 * added to the list here.
 */

const STORY_SLUGS = [
  "tenerife-gc-hiking-teide-spain",
  "tenerife-vs-gran-canaria-island",
  "tenerife-gc-winter-sun-europe",
  "canaries-four-islands-ferry",
];

export const metadata = {
  title:
    "Tenerife: how many days you need, and which side to stay on · TestedRoutes",
  description:
    "How many days Tenerife needs, whether it is worth visiting, north or south coast, when to go – and what Teide's sell-out means for your dates. Tested in November.",
  alternates: { canonical: "/destinations/tenerife" },
  openGraph: {
    type: "article",
    url: "/destinations/tenerife",
    title: "Tenerife: how many days you need, and which side to stay on",
    description:
      "The biggest Canary island, tested: Teide above the clouds, the Anaga laurel ridges, old towns, and the honest split between the sunny south and the greener north.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "Winter sun is the island's franchise: shirt-sleeve afternoons on the south coast and a swimmable sea while the rest of Europe is grey. Two honest caveats from testing November - the north keeps more cloud than the brochure admits, and up on Teide it is a different season entirely, sometimes with snow on the peak."],
  ["April to June", "The green months. The north and the Anaga ridges are at their best, the mountain roads are clear, and the crowds dip between the winter escape and the summer holidays."],
  ["July and August", "Hottest, busiest, most family-priced. The south runs at full capacity; the high caldera is at its most reliable for a clear Teide day."],
  ["September and October", "The sea at its warmest and the summer crowds gone - the quiet sweet spot if swimming matters more than green hillsides."],
  ["What I would pick", "For the winter-escape magic, November to February and a south-coast base, accepting cloudier days if you cross north. For hiking and the green north, late spring - paying with a cooler sea and none of the midwinter smugness."],
];

const HOW_LONG = [
  ["A long weekend", "Works as winter sun plus one Teide day, and that is all it works as. You will drive past most of what makes this island the archipelago's number one, and the Teide booking risk (see the FAQ) sits badly on a schedule with no spare day."],
  ["Five days", "The length most itineraries pick and the sources call barely enough - we agree. Teide, Anaga, the west coast and a couple of coast days fit, but only if nothing goes wrong, and on this island the wind sometimes votes."],
  ["Seven days", "Right. A full Teide day with a weather margin, the Anaga ridges, Masca and the west, the north-coast towns, the old capitals, and beach days between them - without the trip feeling like a checklist."],
  ["Pairing islands", "Tenerife pairs naturally with Gran Canaria by ferry - the two-island week is barely more logistics than choosing between them. For that decision, the archipelago page is the place to start."],
];

const REGIONS = [
  {
    name: "Teide and the caldera",
    image: roquesDeGarciaAboveClouds,
    alt: "The Roques de García spires over the Llano de Ucanca, with cloud spilling over the caldera rim, Tenerife",
    body: "Spain's highest peak rises out of a caldera that is a full day on its own: a moonscape of lava plains, rock spires and mine-like ridges above the cloud layer. The drive up is half the event. Access to the summit itself is rationed and sells out - the one part of a Tenerife trip that has to be decided early.",
  },
  {
    name: "Anaga and the northeast",
    image: taganangaAndTheAnagaCoast,
    alt: "Green Anaga ridges dropping to Taganana's villages and a deep blue sea, Tenerife",
    body: "The oldest corner of the island and the greenest thing in the Canaries: laurel forest over knife-edge ridges, roads that tunnel through moss, and steep drops to black-sand coves where the Atlantic arrives with real force. It feels a continent away from the south coast, and it is barely an hour's drive.",
  },
  {
    name: "The north coast towns",
    image: garachicoRoqueAndLavaPools,
    alt: "Garachico's offshore roque and natural lava pools under heavy surf, Tenerife",
    body: "Garachico with its lava pools and cobbled centre, Icod and its ancient dragon tree, La Orotava's balconied old town, La Laguna's grid of colonial streets. This is the historic, Spanish, lived-in Tenerife most visitors never meet - greener, cloudier, and the best argument for spending a night away from the resorts.",
  },
  {
    name: "The southwest coast",
    image: losGigantesMarinaUnderCliffs,
    alt: "The marina of Los Gigantes sitting directly beneath its sheer cliff wall, Tenerife",
    body: "The sunshine machine. Costa Adeje and its neighbours hold the resorts, the reliable warmth and the easy beach days; Los Gigantes closes the coast with a wall of sea cliffs that dwarfs the town beneath. Use it as the warm base it is - just do not mistake it for the island.",
  },
];

const CAROUSEL = [
  { image: mascaVillageInItsGorge, alt: "The rooftops of Masca village under its rock spire, the gorge falling to a silver sea, Tenerife", caption: "Masca, at the end of the switchbacks" },
  { image: anagaLaurelForestRoad, alt: "A wet road tunnelling through moss-covered laurel forest in the Anaga mountains, Tenerife", caption: "The laurel-forest road, Anaga" },
  { image: anagaCliffsBreakingWave, alt: "A wave breaking hard against the rocks under dark Anaga cliffs, Tenerife", caption: "The Atlantic, arriving at Anaga" },
  { image: garachicoTownAndRoque, alt: "Garachico town and its offshore roque under an evening sky, Tenerife", caption: "Garachico, from above" },
  { image: garachicoPlazaDragonTrees, alt: "Garachico's plaza with palms and old trees in front of the church tower, Tenerife", caption: "Plaza evening, Garachico" },
  { image: roqueCinchadoAndTeide, alt: "The leaning Roque Cinchado with the cone of Teide rising behind, Tenerife", caption: "Roque Cinchado, Teide behind" },
  { image: costaAdejeVillaTerrace, alt: "A villa pool terrace with palms at dusk in Costa Adeje, Tenerife", caption: "The south coast, doing its job" },
  { image: losGigantesFromPlayaDeLosGuios, alt: "The sheer cliff wall of Los Gigantes above the black sand of Playa de los Guíos, Tenerife", caption: "Los Gigantes, from the black sand" },
];

// §8: no tier totals. The ONE figure is the flight pair, echoed once in the FAQ.
const COSTS = [
  ["Lean", "A self-catering apartment away from the resort strips, supermarket picnics for the driving days, and the island's best material - the caldera, Anaga, the coast walks - for free or near it"],
  ["Core", "Small hotels split between the south coast and an old-town night or two, restaurant dinners, and the short list of paid bookings that gate the headline sights"],
  ["Splurge", "The resort tier Costa Adeje is famous for - money buys the sea view and the spa, not access, because nothing on Tenerife is gated behind wealth"],
];

const TIPS = [
  ["Book Teide the moment your dates are fixed, and pack a plan B you would enjoy.", "The cable car and the summit slots sell out far in advance, and wind cancellations come with no next-day fallback - ours died exactly that way. The caldera below the peak is a full day on its own, so a cancelled ride is only a cancelled day if you failed to plan for the possibility."],
  ["Expect two climates in one day.", "The trade clouds pile against the northern slopes while the south bakes; driving to Teide we climbed through the cloud layer and came out above a white sea. Pack for the mountain even when the beach forecast is perfect - and if the north looks grey from your south-coast breakfast, it often is, and it is still worth crossing."],
  ["Give the old towns an evening, not a drive-through.", "La Laguna, La Orotava and Garachico read as quick photo stops on most itineraries. They are at their best after the day-trippers leave - we ended days in them on purpose, and those evenings outrank most of the island's paid attractions."],
];

const FAQ = [
  ["How many days do you need in Tenerife?", "Seven, honestly. Five is the number most itineraries pick and it is barely enough - Teide, Anaga, Masca and the west coast fit, but with no weather margin on an island where wind cancellations are real. A week gives the volcano a spare day, the north its evenings, and the beach days room to breathe. A long weekend only makes sense as winter sun plus one caldera day."],
  ["Is Tenerife worth visiting?", "Yes - it is the big-ticket island of the Canaries, and nothing else in the archipelago matches its single sights. Teide above the clouds is the most impressive thing in the islands, the Anaga laurel ridges are the greenest, and the old towns are actual historic towns, not decoration. The honest caveat: the resort south is exactly what its reputation says. Treat it as the warm base, rent a car, and the island behind it is superb."],
  ["Tenerife or Gran Canaria?", "First visit, one island, biggest sights: Tenerife. Drivers and viewpoint collectors who want variety per kilometre and thinner crowds: Gran Canaria. We drove both on the same trip and wrote the comparison up properly - and the real answer is that a ferry links them, so pairing them in one week is barely more logistics than choosing."],
  ["Should I stay in the north or the south of Tenerife?", "South for the weather, north for the island - and the strong move is both. The south coast is the reliable winter warmth and the easy beach machine; the north holds the historic towns, the green mountains and most of the character, with more cloud on its side of the ledger. We based south and slept north twice, and that split is the one we would repeat."],
  ["Can you climb Mount Teide?", "Yes, but access is rationed and it bites: the final summit trail needs a permit with capped daily numbers - now paid - and both it and the cable car sell out well ahead of busy dates. Wind shuts the cable car with no next-day fallback, which is how we lost our slot. Decide early that Teide matters, book before anything else in the trip, and plan the caldera below as a day you would enjoy anyway."],
  ["Is Tenerife warm enough to swim in winter?", "Yes, on the south and west coasts - shirt-sleeve afternoons and an Atlantic around 19 to 20 °C in midwinter, refreshing rather than warm. We swam in late November without heroics. The north sea is rougher and the mountain interior is a different season entirely; in midwinter there can be snow around the peak while the beaches work on the coast below."],
  ["Do you need a car in Tenerife?", "For the island this page describes, yes. Buses serve the coasts respectably, but Teide, Anaga, Masca and the north-coast towns are drive-to places, and rentals are cheap. Budget real time: the mountain roads are hairpin engineering, and map estimates flatter them badly."],
  ["Is Masca worth it?", "Yes - the village hangs in a gorge between rock spires with the sea glinting at the bottom, and the switchback road in is an event in itself. Treat the drive with respect and the viewpoint stops with patience, and fold it into a west-coast day rather than treating it as a detour."],
  ["Is the south of Tenerife all resorts?", "The strip itself, yes - concrete, all-inclusive wristbands and imported sand, doing exactly what it promises. But it occupies a few kilometres of coast: Los Gigantes' cliff wall stands at the end of it, the west-coast villages keep their harbours, and the interior begins ten minutes inland. The south is a base, not a verdict."],
  ["Is Tenerife expensive?", "No. Return flights from most of western and northern Europe typically come in under €150 with sale fares far lower, and on the ground prices sit at or below mainland-Spain levels. The bed is the only line with real range - winter is high season here and the resort coast prices accordingly. The best of the island, from the caldera to Anaga, is free."],
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

export default async function TenerifeDestinationPage() {
  const { stories } = await fetchContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Tenerife: how many days you need, and which side to stay on",
        description:
          "How many days Tenerife needs, whether it is worth visiting, north or south coast, when to go – and what Teide's sell-out means for your dates. Tested in November.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Tenerife" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/tenerife",
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
        <span className="text-slate-600">Tenerife</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Canary Islands · Spain
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Tenerife
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, which side to stay on, and when to go – the
          biggest Canary island, tested from the caldera to the coast.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            {/* Hero = the founder's Tenerife-hero.jpg pick (cull-folder convention, 2026-09-04). */}
            <Image
              src={teideConeClearMorning}
              alt="The bare cone of Mount Teide under deep blue sky, seen across the caldera scrub, Tenerife"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Tenerife worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Tenerife was the island everyone I knew kept flying to, which
                is precisely why I put it off for years. Then we drove it for
                four days as part of a four-island November run, and the
                verdict is uncomplicated: it is the big-ticket island of the
                Canaries, and the single sights here outrank anything else in
                the archipelago. You drive up through the cloud layer and come
                out above a white sea with Spain's highest peak in the
                windscreen. That moment alone settles the worth-it question.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you do splits into four different islands wearing one
                name. There is the volcano: Teide and its caldera, a moonscape
                of lava plains and rock spires that fills a day even when - as
                happened to us - the wind cancels the cable car. There is the
                green island: the Anaga range in the northeast, laurel forest
                over knife-edge ridges, roads that tunnel through moss and
                fall to black-sand coves. There is the old island: La Laguna,
                La Orotava, Garachico and its lava pools, proper historic
                towns that nobody associates with Tenerife until they stand
                in one. And there is the sunshine machine of the south coast,
                which is exactly what its reputation promises - and ten
                minutes deep.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest structure of the trip: base yourself where the
                weather is, spend your days where the island is. The trade
                clouds pile on the northern slopes, so the north is greener
                and greyer while the south bakes; we based in Costa Adeje and
                slept twice in the north-coast towns, and that split - south
                for warmth, north for character - is the one decision we
                would repeat exactly. Everything else follows from it.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Tenerife works all year - the month decides the trade-offs,
                not whether the trip happens. Remember it holds three climates
                at once: coast, cloud belt, and high mountain.
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
                Deciding between islands rather than within one? Start from
                the{" "}
                <Link
                  href="/destinations/canary-islands"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Canary Islands page
                </Link>
                , which compares all four.
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
                Tenerife has two airports, and which one you land at matters
                more than people expect: Tenerife South sits by the resort
                coast and takes most international traffic; Tenerife North,
                by La Laguna, serves mainland Spain and inter-island hops.
                Both work - just make the rental-car booking match. This is
                Spain, so euros, EU roaming and Schengen rules apply, and the
                clock runs level with London, an hour behind Madrid.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, rent a car. The coast strips manage without
                one, but everything this page praises is drive-to, and the
                mountain roads - Masca's switchbacks, the Anaga ridge road,
                the climb to the caldera - are engineered as one continuous
                hairpin. Map time estimates flatter them; add margin.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Ferries link Santa Cruz and Los Cristianos to the neighbouring
                islands - we arrived by sea from Fuerteventura and left by
                sea to Gran Canaria, with the rental car along for the ride.
                Which crossings are worth taking, and which quietly burn a
                day, is the multi-island question the archipelago page deals
                with.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the line every alternative loses to: return
                flights from most of western and northern Europe typically
                come in under €150, and sale fares go far lower. On the
                ground, prices sit at or below mainland-Spain levels - and
                the best of the island is free.
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
                The bed is the only line with real range, and winter - high
                season here - is when it moves most. The paid bookings that
                gate the headline sights are few, cheap, and entirely about
                booking early rather than paying more.
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
              <Image
                src={mascaGorgeToTheSea}
                alt="The Masca gorge falling away to the sea, with the switchback road stitched across its wall, Tenerife"
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
                <SectionHeading>Stories from Tenerife</SectionHeading>
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

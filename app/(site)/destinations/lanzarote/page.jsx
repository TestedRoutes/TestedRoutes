import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import laGeriaCraterVines from "../../../../content/countries/canary-islands/destination/generated/web/la-geria-crater-vines.jpg";
import timanfayaLavaField from "../../../../content/countries/canary-islands/destination/generated/web/timanfaya-lava-field.jpg";
import jameosDelAguaPool from "../../../../content/countries/canary-islands/destination/generated/web/jameos-del-agua-pool.jpg";
import elGolfoGreenLagoon from "../../../../content/countries/canary-islands/destination/generated/web/el-golfo-green-lagoon.jpg";
import papagayoCovesGoldenHour from "../../../../content/countries/canary-islands/destination/generated/web/papagayo-coves-golden-hour.jpg";
import losHervideros from "../../../../content/countries/canary-islands/destination/generated/web/los-hervideros-lava-coast.jpg";
import timanfayaRoadIntoTheCones from "../../../../content/countries/canary-islands/destination/generated/web/timanfaya-road-into-the-cones.jpg";
import timanfayaParkSign from "../../../../content/countries/canary-islands/destination/generated/web/timanfaya-park-sign.jpg";
import timanfayaSmokingVent from "../../../../content/countries/canary-islands/destination/generated/web/timanfaya-smoking-vent.jpg";
import lagomarPoolInTheRock from "../../../../content/countries/canary-islands/destination/generated/web/lagomar-pool-in-the-rock.jpg";
import jardinDeCactusQuarry from "../../../../content/countries/canary-islands/destination/generated/web/jardin-de-cactus-quarry.jpg";
import jameosCaveRestaurant from "../../../../content/countries/canary-islands/destination/generated/web/jameos-cave-restaurant.jpg";
import salinasDeJanubioSaltPans from "../../../../content/countries/canary-islands/destination/generated/web/salinas-de-janubio-salt-pans.jpg";
import herviderosLavaArch from "../../../../content/countries/canary-islands/destination/generated/web/hervideros-lava-arch.jpg";

/*
 * Scope note (destination playbook §7): island-level decision page. The
 * archipelago hub owns WHICH island; this page owns whether Lanzarote is
 * worth it, how long, when. Guide-only and absent: the Manrique multi-site
 * ticket logic, within-day sequencing, venue and bed picks, ferry
 * timetables. The published Mars story is the outer boundary (the smoking
 * ground and bus-loop expectation, the Papagayo repeat, the Punta Mujeres
 * dip all come from it). The Lanzarote & Fuerteventura 7D SKU is PLANNED
 * (wave 3), not built - no "the guide carries X"; pointer pass owed at SKU
 * publish.
 */

const STORY_SLUGS = [
  "lanzarote-looks-mars",
  "canaries-four-islands-ferry",
  "tenerife-gc-winter-sun-europe",
];

export const metadata = {
  title:
    "Lanzarote: is it worth visiting, and how many days you need · TestedRoutes",
  description:
    "Whether Lanzarote is worth visiting, how many days it needs, and when to go – the volcanic island César Manrique designed, tested over three days in November.",
  alternates: { canonical: "/destinations/lanzarote" },
  openGraph: {
    type: "article",
    url: "/destinations/lanzarote",
    title: "Lanzarote: is it worth visiting, and how many days you need",
    description:
      "Smoking ground, vines in craters, turquoise pools in lava tubes – the strangest and most underrated of the four big Canary Islands, tested.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The winter-sun season: warm afternoons, a swimmable sea, and the volcanic landscapes at their most photogenic in low light. This is when we went, and when the island's high season runs."],
  ["April to June", "Quieter and mild - the lull between the winter escape and the summer holidays, with long light on the lava fields."],
  ["July and August", "Hottest and busiest, with the trade winds at full strength. The island still works; the beaches share themselves."],
  ["September and October", "The warmest sea and the thinnest crowds - the quiet sweet spot for a swimming-first trip."],
  ["What I would pick", "Winter, without hesitation - Lanzarote is the rare place where the landscape needs no greenery, so the brown months cost nothing and the low winter light flatters the black fields and white villages."],
];

const HOW_LONG = [
  ["A long weekend", "Feasible - the island is compact - but it compresses the strangeness into a checklist. Timanfaya, one Manrique site and a sunset fit; the island deserves the slower version."],
  ["Five days", "The core trip: the fire country, the Manrique sites at an unhurried pace, the west coast morning, the northern cap, and beach time at Papagayo."],
  ["Seven days", "Comfortable, with pool days between the sightseeing and time to repeat what earns repeating - our best sunset here got a second visit."],
  ["Pairing islands", "Lanzarote pairs naturally with Fuerteventura - a short ferry connects them, which is what makes the two one trip. The archipelago page compares all four islands if you are still choosing."],
];

const REGIONS = [
  {
    name: "Timanfaya and the fire country",
    image: timanfayaLavaField,
    alt: "A black lava field with a red ash apron running to the volcano cones of Timanfaya, Lanzarote",
    body: "The ground here still smokes. Timanfaya's lava fields have not yet decided to become soil, the demonstration geysers erupt on cue, and the road in runs between cones like a line drawn on another planet. It is the literal half of the island's Mars argument, and the reason the comparison is not marketing.",
  },
  {
    name: "The Manrique north",
    image: jameosDelAguaPool,
    alt: "The turquoise pool of Jameos del Agua with a leaning palm and black lava rim, Lanzarote",
    body: "César Manrique built into the lava instead of over it, and his projects are the island's connective tissue: a turquoise pool inside a collapsed lava tube, a house folded into the rock, a cactus garden in an old quarry. The north also holds the lava caves, the cliff-top view over La Graciosa, and natural pools for the end of the day.",
  },
  {
    name: "The west coast",
    image: elGolfoGreenLagoon,
    alt: "The green lagoon of El Golfo behind its black beach, under a red volcanic crater wall, Lanzarote",
    body: "A morning of pure geology: a green lagoon sitting behind a black beach, the sea detonating through the rock arches at Los Hervideros, and salt flats laid out like a colour chart at Janubio. Short distances, huge contrasts, no infrastructure required.",
  },
  {
    name: "Papagayo and the south",
    image: papagayoCovesGoldenHour,
    alt: "The turquoise coves and red headlands of Punta del Papagayo at golden hour, Lanzarote",
    body: "The island's beach headline: a string of turquoise coves under bare headlands at its southern tip, with the ferry port and resort base of Playa Blanca beside them. We watched the sunset here twice on one trip - it earned the repeat.",
  },
];

const CAROUSEL = [
  { image: timanfayaRoadIntoTheCones, alt: "The park road running straight into the red and black volcano cones of Timanfaya, Lanzarote", caption: "The road into the fire country" },
  { image: timanfayaParkSign, alt: "The Timanfaya national park sign with its fire-devil emblem on a lava wall, Lanzarote", caption: "Timanfaya's fire devil" },
  { image: timanfayaSmokingVent, alt: "Steam erupting from a vent in the rocks during the geyser demonstration at Timanfaya, Lanzarote", caption: "The ground, making its point" },
  { image: lagomarPoolInTheRock, alt: "A turquoise pool folded into red rock with palms at Lagomar, Lanzarote", caption: "Lagomar, folded into the rock" },
  { image: jameosCaveRestaurant, alt: "Tables set inside the red-lit lava cave of Jameos del Agua, Lanzarote", caption: "Dinner tables, inside a lava tube" },
  { image: jardinDeCactusQuarry, alt: "The cactus garden filling an old quarry with a windmill on the rim, Guatiza, Lanzarote", caption: "The cactus garden, in its quarry" },
  { image: salinasDeJanubioSaltPans, alt: "The salt pans of Janubio mirroring the sky on Lanzarote's west coast", caption: "Janubio, the salt colour chart" },
  { image: herviderosLavaArch, alt: "Surf churning through a black lava arch at Los Hervideros, Lanzarote", caption: "Los Hervideros, up close" },
];

// §8: no tier totals. The ONE figure is the flight pair, echoed once in the FAQ.
const COSTS = [
  ["Lean", "A self-catering base in a white village, supermarket picnics, and a coastline of free geology - the lagoon, the arches, the salt flats and the coves cost nothing"],
  ["Core", "Small hotels, restaurant dinners, and the Manrique sites and park entries that are this island's short paid list"],
  ["Splurge", "The resort tier around Playa Blanca and Costa Teguise - money buys the pool and the sea view, not access"],
];

const TIPS = [
  ["Set your Timanfaya expectations: it is a show, not a hike.", "The ground genuinely smokes and the water poured into a tube comes back as a geyser seconds later - but you see the heart of the park from a coach loop, not on foot. Go for the spectacle and the landscape, and you will leave amazed; go expecting a trail day and you will leave frustrated."],
  ["Give Papagayo a second evening.", "The sunset from the southern headlands was the best of our whole four-island trip - good enough that we rearranged a later day to come back. If you only budget one evening for it and the sky delivers, you will wish you had our schedule."],
  ["End big days in the natural pools.", "The lava coast keeps sheltered natural swimming pools - Punta Mujeres is strung with them - and a dip there after a full driving day is the island's best free luxury. Bring swimwear in the car as a default."],
];

const FAQ = [
  ["Is Lanzarote worth visiting?", "Emphatically yes - it was the surprise of our four-island trip and it is the most underrated of the big Canaries. It is the closest Europe gets to another planet: ground that still smokes, vines growing in dug-out craters, turquoise pools inside lava tubes - the whole island filtered through one designer's eye. Everyone we knew kept flying to Tenerife. Lanzarote is the island we came home evangelising about."],
  ["How many days do you need in Lanzarote?", "Five is the core trip: Timanfaya, the Manrique sites, the west-coast morning, the northern cap and proper beach time. Seven is comfortable and lets you repeat what earns repeating. A long weekend covers the icons but flattens the strangeness into a checklist - possible, not recommended."],
  ["What is Timanfaya, and can you walk in it?", "A national park over the lava fields of the island's great eruptions, where the ground still holds enough heat to turn a bucket of water into a geyser. The core is visited by coach loop rather than on foot - a protection measure, and honestly the right expectation to arrive with: it is a demonstration and a landscape, not a hiking day."],
  ["What is special about César Manrique's sites?", "One artist essentially art-directed an island: houses and galleries folded into lava bubbles, a concert cave and a turquoise pool inside a collapsed lava tube, a cactus garden planted in an old quarry. They are the reason Lanzarote looks designed rather than developed - white walls, black rock, green plants, at full contrast - and they are attractions in their own right, not add-ons."],
  ["Is the green lagoon at El Golfo real?", "Real, and genuinely green - a half-crater holding an algae-coloured lagoon behind a black sand beach, under red cliffs. It is a short walk from the car park, pairs with the Los Hervideros arches and the Janubio salt flats into one west-coast morning, and asks nothing of you but the stop."],
  ["Can you visit La Graciosa from Lanzarote?", "Yes - the eighth island sits just off the northern tip, reachable by a short boat hop, with sand streets and almost no cars. Honesty first: we saw it only from the Mirador del Río clifftop, laid out below like a scale model, and did not cross - so this page will not pretend to have tested it. It is on the return list."],
  ["Is Lanzarote windy?", "Yes, by design - the trade winds are part of the island's climate, strongest in high summer. In practice it means fresh evenings, kite-friendly coasts, and the occasional plan adjusted rather than a trip spoiled. We had November: warm days, breezy headlands, no complaints."],
  ["Do you need a car in Lanzarote?", "Yes. The island is compact and the roads are excellent, but the whole point - the fire country, the west-coast geology, the Manrique sites, the northern cap - is a drive-to circuit, and rentals are cheap. Distances are short; you will still fill the days."],
  ["Is Lanzarote good in winter?", "Very - arguably the best of the four big islands in winter, because its appeal never depended on greenery. The volcanic landscapes photograph best in low winter light, the sea stays swimmable at around 19 to 20 °C, and the afternoons run shirt-sleeve warm. Winter is the island's high season for a reason."],
  ["Is Lanzarote expensive?", "No. Return flights from most of western and northern Europe typically come in under €150 with sale fares far lower, and prices on the ground sit at or below mainland-Spain levels. The paid list is short - the park and the Manrique sites - and the geology is free."],
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

export default async function LanzaroteDestinationPage() {
  const { stories } = await fetchContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Lanzarote: is it worth visiting, and how many days you need",
        description:
          "Whether Lanzarote is worth visiting, how many days it needs, and when to go – the volcanic island César Manrique designed, tested over three days in November.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Lanzarote" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/lanzarote",
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
        <span className="text-slate-600">Lanzarote</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Canary Islands · Spain
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Lanzarote
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth visiting, how many days it needs, and when to go – the
          strangest of the four big Canary Islands, and the most underrated.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={laGeriaCraterVines}
              alt="Thousands of dug-out craters with single vines behind stone walls in the black ash of La Geria, Lanzarote"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Lanzarote worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Lanzarote rearranged my expectations more than any island on
                our four-island November run. We came off the ferry in the
                late afternoon, drove to the southern tip, and the first
                sunset at Papagayo set the tone - we later rearranged a whole
                day just to see it again. But the island's real argument
                starts inland, where the ground is still busy: in Timanfaya
                the wind howls over lava fields that have not yet decided to
                become soil, thin smoke rises out of the earth, and a bucket
                of water poured into a tube comes back as a geyser.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Then there is the part no other volcanic island has: a
                designer. César Manrique built into the lava rather than over
                it, and his projects run through the island like connective
                tissue - a turquoise pool inside a collapsed lava tube, a
                restaurant in the cave beside it, a house folded so
                improbably into the rock that I kept checking it was real, a
                cactus garden planted in an old quarry. Even the agriculture
                went alien: in La Geria every vine grows in its own dug-out
                crater behind a curved stone wall, thousands of green dots
                ordered across black ash. It looks like land art and
                functions as a vineyard.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you do, practically: one day for the fire country, one
                for the Manrique north with the cliff-top view over La
                Graciosa and an evening dip in the natural pools, one morning
                for the west coast's green lagoon, sea arches and salt flats
                - and beach time at Papagayo stitched between. Three full
                days and a first-evening sunset never repeated a landscape.
                The friends who kept flying to Tenerife never mentioned this
                island. I have not stopped mentioning it since.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                No closed season, and less seasonal than its greener
                neighbours - the landscape here does not depend on rain.
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
                Lanzarote's airport sits by Arrecife with direct flights from
                all over Europe year-round. This is Spain: euros, EU roaming,
                Schengen rules, and a clock level with London. The island is
                the most compact of the big four - nothing is far.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Rent a car; the island is a circuit of short, excellent roads
                and the sights are spread deliberately around it. Ferries
                link Playa Blanca to Fuerteventura - a short hop that is what
                makes the two islands one trip - and we carried our rental
                car across on it in both directions.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the line every alternative loses to: return
                flights from most of western and northern Europe typically
                come in under €150, and sale fares go far lower. On the
                ground, prices sit at or below mainland-Spain levels.
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
                high season - is when it moves most. The short paid list of
                park and Manrique entries is about booking sensibly, not
                spending more.
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
                src={losHervideros}
                alt="Waves breaking white against the black lava coast of Los Hervideros, volcano cones on the skyline, Lanzarote"
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
                <SectionHeading>Stories from Lanzarote</SectionHeading>
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

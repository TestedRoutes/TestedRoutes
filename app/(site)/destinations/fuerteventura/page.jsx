import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import cofeteThroughTheCactus from "../../../../content/countries/canary-islands/destination/generated/web/cofete-through-the-cactus.jpg";
import grandesPlayasTurquoise from "../../../../content/countries/canary-islands/destination/generated/web/grandes-playas-turquoise.jpg";
import betancuriaChurchAndPalms from "../../../../content/countries/canary-islands/destination/generated/web/betancuria-church-and-palms.jpg";
import cofeteGoldenHourFromTheMirador from "../../../../content/countries/canary-islands/destination/generated/web/cofete-golden-hour-from-the-mirador.jpg";
import lavaFieldAndVolcano from "../../../../content/countries/canary-islands/destination/generated/web/lava-field-and-volcano-fuerteventura.jpg";
import jandiaCoastDeepBlue from "../../../../content/countries/canary-islands/destination/generated/web/jandia-coast-deep-blue.jpg";
import sicasumbreWindingRoad from "../../../../content/countries/canary-islands/destination/generated/web/sicasumbre-winding-road.jpg";
import morroVelosaPanorama from "../../../../content/countries/canary-islands/destination/generated/web/morro-velosa-panorama.jpg";
import molinoDeAntiguaWindmill from "../../../../content/countries/canary-islands/destination/generated/web/molino-de-antigua-windmill.jpg";
import groundSquirrelsLaOliva from "../../../../content/countries/canary-islands/destination/generated/web/ground-squirrels-la-oliva.jpg";
import corralejoDuneRoad from "../../../../content/countries/canary-islands/destination/generated/web/corralejo-dune-road.jpg";
import grandesPlayasCorralejo from "../../../../content/countries/canary-islands/destination/generated/web/grandes-playas-corralejo.jpg";
import villaWinterUnderTheRidge from "../../../../content/countries/canary-islands/destination/generated/web/villa-winter-under-the-ridge.jpg";

/*
 * Scope note (destination playbook §7): island-level decision page. The
 * archipelago hub owns WHICH island; this page owns whether Fuerteventura is
 * worth it, how long, when, and which end to base on. Guide-only and absent:
 * the Cofete road head and drive mechanics, within-day sequencing, venue and
 * bed picks, ferry timetables. The published Cofete story is the outer
 * boundary (the unpaved road, respect-the-sea, Villa Winter as legend). The
 * Lanzarote & Fuerteventura 7D SKU is PLANNED (wave 3), not built - no "the
 * guide carries X"; pointer pass owed at SKU publish.
 */

const STORY_SLUGS = [
  "fuerteventura-cofete-wild-beach",
  "canaries-four-islands-ferry",
  "tenerife-gc-winter-sun-europe",
];

export const metadata = {
  title:
    "Fuerteventura: how many days you need, and which end to stay on · TestedRoutes",
  description:
    "How many days Fuerteventura needs, whether it is worth visiting, north or south base, when to go – the beach island of the Canaries, tested in November.",
  alternates: { canonical: "/destinations/fuerteventura" },
  openGraph: {
    type: "article",
    url: "/destinations/fuerteventura",
    title: "Fuerteventura: how many days you need, and which end to stay on",
    description:
      "The biggest sands in the Canaries at Corralejo, the wildest beach of all at Cofete, and a bare interior that feels like another continent – tested.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "Winter sun with the biggest beaches in the archipelago to spread out on - warm afternoons, a swimmable sea, and the dunes at their photogenic best in low light. Our November days here were pool-and-beach weather throughout."],
  ["April to June", "Mild, quieter, and as green as this dry island gets - which is not very; Fuerteventura's look barely changes with the seasons."],
  ["July and August", "Hottest and windiest - which is the point for the wind-sports crowd that treats this island as a European capital of the sport, and a tax for everyone else. Busiest on the northern beaches."],
  ["September and October", "The warmest sea of the year, softer wind, thinner crowds - the best pure swimming window."],
  ["What I would pick", "Winter for the escape (that is the tested version), early autumn if swimming is the whole point. The island's bare look costs nothing in any month - it is the Canaries' most season-proof landscape after Lanzarote."],
];

const HOW_LONG = [
  ["A long weekend", "Fine as pure beach - Corralejo's sands absorb days effortlessly. You will not see the wild south, and the wild south is the best thing here."],
  ["Five days", "The core trip: the northern dunes, the interior villages, and the full southern day out to Cofete - with a rest day where it lands."],
  ["Seven days", "Both ends properly: a northern base and a southern night, the interior in between, and beach days that are chosen rather than scheduled."],
  ["Pairing islands", "Fuerteventura pairs naturally with Lanzarote - a short ferry connects them, which is what makes the two one trip. We also used the island as the hinge of a four-island run. The archipelago page compares the options."],
];

const REGIONS = [
  {
    name: "Corralejo and the dune north",
    image: grandesPlayasTurquoise,
    alt: "Turquoise water and white sand at Grandes Playas de Corralejo, Fuerteventura",
    body: "The biggest, easiest sands in the archipelago: a dune field rolling straight into turquoise water, a road that runs through it like a line drawn on sand, and the resort town beside it. This is the Fuerteventura most visitors get, and as beach machines go it is a superb one.",
  },
  {
    name: "Betancuria and the interior",
    image: betancuriaChurchAndPalms,
    alt: "The white church of Betancuria with palms over its plaza, Fuerteventura",
    body: "The island's bare heart: winding roads over hills that feel Martian, a stargazing mirador, the tiny town that used to be the capital, and an old colonial house whose car park is run by a colony of ground squirrels. Short on sights by big-island standards, long on atmosphere - and completely unlike the coasts.",
  },
  {
    name: "Jandía and Cofete",
    image: cofeteGoldenHourFromTheMirador,
    alt: "Cofete beach and the Jandía mountain wall at golden hour, from the mirador wall, Fuerteventura",
    body: "The wild end. Behind the Jandía ridge, at the end of an unpaved road, lies Cofete: kilometres of empty sand under a mountain wall, a lonely villa with an unresolved wartime legend, and an ocean that demands respect rather than swimming. The single best thing on the island, and the least developed.",
  },
  {
    name: "The volcano country",
    image: lavaFieldAndVolcano,
    alt: "A black lava field running to a bare volcano cone, Fuerteventura",
    body: "Between the coasts, old cones and lava fields stripe the island - crossed rather than visited, and constantly composing themselves in the windscreen. The drives here are the connective tissue of any Fuerteventura trip, and better than connective tissue usually gets.",
  },
];

const CAROUSEL = [
  { image: corralejoDuneRoad, alt: "The road running through the Corralejo dunes toward a volcano cone, Fuerteventura", caption: "The dune road, Corralejo" },
  { image: grandesPlayasCorralejo, alt: "The white sand of Grandes Playas running empty toward a volcano cone, Corralejo, Fuerteventura", caption: "Grandes Playas, mid-morning" },
  { image: sicasumbreWindingRoad, alt: "A road winding through the bare volcanic hills at Sicasumbre, Fuerteventura", caption: "The interior, doing its Mars impression" },
  { image: morroVelosaPanorama, alt: "The bare valleys of central Fuerteventura from the Morro Velosa viewpoint", caption: "Morro Velosa, over the bare middle" },
  { image: molinoDeAntiguaWindmill, alt: "The white windmill of Molino de Antigua over its cactus garden, Fuerteventura", caption: "Molino de Antigua" },
  { image: groundSquirrelsLaOliva, alt: "Two ground squirrels on a stone wall in front of a bare volcanic plain at La Oliva, Fuerteventura", caption: "The car-park squirrels of La Oliva" },
  { image: villaWinterUnderTheRidge, alt: "The lonely white Villa Winter with its round tower under the Jandía mountains at Cofete, Fuerteventura", caption: "Villa Winter, alone at Cofete" },
  { image: cofeteThroughTheCactus, alt: "Cofete beach and the Jandía mountain wall seen past a candelabra cactus, Fuerteventura", caption: "Cofete, past the cactus" },
];

// §8: no tier totals. The ONE figure is the flight pair, echoed once in the FAQ.
const COSTS = [
  ["Lean", "A self-catering base near the dunes, supermarket picnics for the driving days, and beaches - the island's whole product - that charge nothing"],
  ["Core", "Small hotels or a resort base plus a southern night, restaurant dinners, and almost no paid attractions to budget for at all"],
  ["Splurge", "The big-resort tier by the northern beaches - we tried it for two nights as a change of register; money buys the pool landscape, not access"],
];

const TIPS = [
  ["Treat Cofete as a day, and the sea there with respect.", "The drive over the ridge is unpaved, the arrival view is the best on the island, and the ocean is the open Atlantic with a serious reputation - we swam carefully or not at all. Go for the walking and the staring, give it a full day with the lighthouse and the villa, and it will outrank every easy beach you have ever queued for."],
  ["Give the interior its half-day.", "It reads as empty on the map and it is the opposite in the windscreen: the Sicasumbre mirador, Betancuria's plaza, the Morro Velosa panorama and the squirrel car park at La Oliva chain into the island's most underrated hours - and the roads between them are the best drives here."],
  ["The dune road is a sight, not a transfer.", "The road through the Corralejo dunes runs sand-to-sand with a volcano ahead and turquoise water beside it. Drive it slowly, stop where stopping is allowed, and walk into the dune field at least once - most people save the dunes for their last day and regret the arithmetic."],
];

const FAQ = [
  ["Is Fuerteventura worth visiting?", "Yes - if beaches are anywhere near the centre of your trip, it is the best island in the archipelago for them: the biggest easy sands in the north, and at Cofete the wildest beach in the Canaries full stop. The honest caveat is the flip side: it has the least variety of the four big islands. Come for coastline and space, not for a sight-per-hour circuit."],
  ["How many days do you need in Fuerteventura?", "Five to seven. Five covers the northern dunes, the interior and the full southern day to Cofete; seven lets you base at both ends and choose beach days instead of scheduling them. A pure beach long-weekend works too - but you would leave without Cofete, which is like leaving a concert before the headliner."],
  ["Fuerteventura or Lanzarote?", "Beaches: Fuerteventura, without question. Sights and strangeness: Lanzarote - the fire country, the Manrique sites, the west-coast geology. They sit a short ferry apart, which is what makes the honest answer both: the pairing is the archipelago's most natural two-island week, and it is the trip we would sell you."],
  ["Is Playa de Cofete worth it, and can you swim there?", "Worth it beyond argument - kilometres of empty sand under a mountain wall, reached over an unpaved road, with a lonely villa and its unresolved wartime legend at the far end. Swimming is the caveat: this is the open Atlantic with serious currents, and we swam carefully or not at all. It is a walking-and-staring beach first, and better for it."],
  ["Are the Corralejo dunes worth the stop?", "Yes - a genuine dune field rolling into turquoise water, big enough that the crowds thin fifty metres from the car. The road through it is a sight in itself, and the beaches along it are the easiest great swimming on the island."],
  ["Should I stay in the north or the south of Fuerteventura?", "North for infrastructure and the easy sands - Corralejo is the natural base, with the ferry to Lanzarote beside it. South for the wild end and Cofete. On five days, base north and give the south one full day; on seven, split the nights and you will resent no drives."],
  ["Is Fuerteventura windy?", "Yes - the name is not an accident, and summer trades make the island a European wind-sports capital. For everyone else the wind is a feature to plan around rather than a spoiler: our November was breezy at the headlands and calm enough everywhere that mattered. If dead-calm beach days are the whole brief, aim for early autumn."],
  ["Do you need a car in Fuerteventura?", "Yes. The island is big, the distances are real, and its two best things - the interior drives and Cofete - are unreachable without one. Note the Cofete approach is unpaved: ordinary care, not heroics, and factor the slow kilometres into the day."],
  ["Is Fuerteventura warm enough to swim in winter?", "Yes - the sheltered northern beaches run shirt-sleeve warm on winter afternoons and the sea sits around 19 to 20 °C: refreshing, entirely swimmable. We spent whole November days by pool and beach here. Cofete is the exception in every season - see above."],
  ["Is Fuerteventura expensive?", "No. Return flights from most of western and northern Europe typically come in under €150 with sale fares far lower, prices on the ground sit at or below mainland-Spain levels, and the island's product - sand, sea and space - is free. Even the splurge tier is really just a bigger pool."],
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

export default async function FuerteventuraDestinationPage() {
  const { stories } = await fetchContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Fuerteventura: how many days you need, and which end to stay on",
        description:
          "How many days Fuerteventura needs, whether it is worth visiting, north or south base, when to go – the beach island of the Canaries, tested in November.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Fuerteventura" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/fuerteventura",
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
        <span className="text-slate-600">Fuerteventura</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Canary Islands · Spain
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Fuerteventura
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, which end to stay on, and when to go – the
          beach island of the Canaries, from the easy sands to the wild ones.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={cofeteThroughTheCactus}
              alt="Cofete beach and the Jandía mountain wall seen past a candelabra cactus, Fuerteventura"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Fuerteventura worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fuerteventura announced itself before we left the port: we
                came off an early ferry from Gran Canaria and the island
                immediately felt like a different country - flatter, barer,
                windblown, all beaches and horizon. On a four-island November
                run it played two roles: the easy one, two resort nights by
                Corralejo's enormous sands as a deliberate change of
                register, and the wild one, the day we drove over the Jandía
                ridge on an unpaved road and came out above Cofete.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Those two beaches are the island's argument in one sentence.
                Grandes Playas de Corralejo is the biggest, easiest sand in
                the archipelago - dunes rolling into turquoise water, a road
                running through them like a drawn line. Cofete is its
                opposite and its superior: kilometres of empty shore under a
                mountain wall, one tiny hamlet, a lonely villa with a
                wartime legend nobody has settled, and an ocean you treat
                with respect rather than a lilo. Between the two lies the
                interior almost everyone skips: bare Martian hills, the old
                capital at Betancuria, a stargazing mirador, and a colonial
                house whose car park is run by ground squirrels.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest ledger: this is the least varied of the four big
                islands - no Teide, no Manrique, no mountain villages - and
                the most coastline-per-day of any of them. If your trip is
                built around sand, sea, space and a car, Fuerteventura is
                the right island; if you need a sight per hour, its
                neighbour across the short ferry is the better half of the
                pairing, and the two together are the archipelago's most
                natural two-island week.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                No closed season, minimal seasonal change in the landscape -
                the wind is the variable that matters here.
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
                Fuerteventura's airport sits by Puerto del Rosario with
                direct flights from all over Europe year-round. This is
                Spain: euros, EU roaming, Schengen rules, and a clock level
                with London, one hour behind Madrid.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Rent a car - the island is the second largest in the
                archipelago and its best material sits at opposite ends of
                it. The main roads are fast and empty; the Cofete approach is
                unpaved and slow, and part of the experience rather than an
                obstacle to it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Ferries make this island the archipelago's natural hinge: a
                short hop connects Corralejo to Lanzarote - we crossed it in
                both directions with the same rental car - and longer
                crossings link toward Gran Canaria and Tenerife. The
                pairings question belongs to the archipelago page.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the line every alternative loses to: return
                flights from most of western and northern Europe typically
                come in under €150, and sale fares go far lower. On the
                ground, prices sit at or below mainland-Spain levels - and
                the island's product is free by nature.
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
                The bed is the only line with real range - winter is the high
                season - and the almost total absence of paid attractions
                keeps every other line flat.
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
                src={jandiaCoastDeepBlue}
                alt="The deep blue Jandía coast under the mountain ridge, Fuerteventura"
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
                <SectionHeading>Stories from Fuerteventura</SectionHeading>
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

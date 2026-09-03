import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import roquesDeGarciaAboveClouds from "../../../../content/countries/canary-islands/destination/generated/web/roques-de-garcia-above-the-clouds.jpg";
import teideConeClearMorning from "../../../../content/countries/canary-islands/destination/generated/web/teide-cone-clear-morning.jpg";
import roqueNubloAndElFraile from "../../../../content/countries/canary-islands/destination/generated/web/roque-nublo-and-el-fraile.jpg";
import cofeteAndTheJandiaWall from "../../../../content/countries/canary-islands/destination/generated/web/cofete-and-the-jandia-wall.jpg";
import elGolfoGreenLagoon from "../../../../content/countries/canary-islands/destination/generated/web/el-golfo-green-lagoon.jpg";
import maspalomasDunesSunset from "../../../../content/countries/canary-islands/destination/generated/web/maspalomas-dunes-sunset.jpg";
import puertoDeMoganMarina from "../../../../content/countries/canary-islands/destination/generated/web/puerto-de-mogan-marina.jpg";
import granCanariaInteriorTracks from "../../../../content/countries/canary-islands/destination/generated/web/gran-canaria-interior-tracks.jpg";
import maspalomasDuneRipples from "../../../../content/countries/canary-islands/destination/generated/web/maspalomas-dune-ripples.jpg";
import groundSquirrelsLaOliva from "../../../../content/countries/canary-islands/destination/generated/web/ground-squirrels-la-oliva.jpg";
import grandesPlayasCorralejo from "../../../../content/countries/canary-islands/destination/generated/web/grandes-playas-corralejo.jpg";
import villaWinterUnderTheRidge from "../../../../content/countries/canary-islands/destination/generated/web/villa-winter-under-the-ridge.jpg";
import papagayoCovesGoldenHour from "../../../../content/countries/canary-islands/destination/generated/web/papagayo-coves-golden-hour.jpg";
import timanfayaLavaField from "../../../../content/countries/canary-islands/destination/generated/web/timanfaya-lava-field.jpg";
import laGeriaCraterVines from "../../../../content/countries/canary-islands/destination/generated/web/la-geria-crater-vines.jpg";
import jameosDelAguaPool from "../../../../content/countries/canary-islands/destination/generated/web/jameos-del-agua-pool.jpg";
import mascaVillageInItsGorge from "../../../../content/countries/canary-islands/destination/generated/web/masca-village-in-its-gorge.jpg";
import taganangaAndTheAnagaCoast from "../../../../content/countries/canary-islands/destination/generated/web/taganana-and-the-anaga-coast.jpg";
import cloudPouringIntoTheCaldera from "../../../../content/countries/canary-islands/destination/generated/web/cloud-pouring-into-the-caldera.jpg";
import losGigantesFromPlayaDeLosGuios from "../../../../content/countries/canary-islands/destination/generated/web/los-gigantes-from-playa-de-los-guios.jpg";

const HERO_IMAGE = roquesDeGarciaAboveClouds;
const HERO_ALT =
  "The Roques de García spires over the Llano de Ucanca, with cloud spilling over the caldera rim of Teide National Park, Tenerife";
const MIDPAGE_IMAGE = maspalomasDunesSunset;
const MIDPAGE_ALT =
  "Sunset over the dune ridges of Maspalomas with the lighthouse on the horizon, Gran Canaria";

/*
 * Scope note (destination playbook §7): this page sells the DECISION - which
 * island, how many days, when, whether to pair islands at all. Everything
 * operational stays out: ferry timetables and crossing durations, the
 * inter-island chain order (that sequencing IS the 14-day SKU's core
 * product), Teide's booking platform, fees and slot mechanics, venue names
 * for meals and beds, road-head and parking specifics. The published inspire
 * stories are the free tier's outer boundary - the Teide sell-out trap, the
 * slot-canyon timing game and the alternate push/pool rhythm come from them
 * and the page may repeat those; it may not go past them.
 *
 * FOUR GUIDE SKUs ARE PLANNED (Tenerife 7D, Gran Canaria 7D, Lanzarote &
 * Fuerteventura 7D, Canary Islands 14D) and NONE is live yet, so no sentence
 * here may say "the guide carries X" - mechanics are asserted to exist,
 * unreferenced. A pointer pass over the FAQ and the how-long section is owed
 * the day the first SKU publishes.
 *
 * The Canary Islands are a Spanish archipelago, not a country - Article
 * schema uses about: Place, and the trip covered only the four big eastern
 * and central islands. La Palma, La Gomera, El Hierro and La Graciosa are
 * untested and the page says so rather than padding cards from stock (§11).
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Canary Islands: which island to pick, and how many days you need · TestedRoutes",
  description:
    "Which Canary Island fits you – Tenerife, Gran Canaria, Lanzarote or Fuerteventura – how many days each needs, when to go, and why the answer might be a ferry, not a choice.",
  alternates: { canonical: "/destinations/canary-islands" },
  openGraph: {
    type: "article",
    url: "/destinations/canary-islands",
    title: "Canary Islands: which island to pick, and how many days you need",
    description:
      "Four islands tested on one trip: the volcano island, the road-trip island, the one that looks like Mars, and the beach island – and how they pair by ferry.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The winter-sun season, and the archipelago's whole point: shirt-sleeve afternoons on the south coasts and a sea you can actually swim in while the rest of Europe is grey. This is the Canaries' high season – demand runs opposite to the Mediterranean's – and it is when we went."],
  ["April to June", "The interiors at their greenest after the winter rains, walking weather in the mountains, and a lull between the winter and summer crowds. The sea is at its coolest in spring – fine for a swim, not the bathwater some expect."],
  ["July and August", "Hottest, busiest and most family-priced, with the trade winds at full strength – a gift on the windsurf coasts, a tax everywhere else. The islands still work; you just share them."],
  ["September and October", "The sea at its warmest all year and the summer crowds gone. If swimming matters more to you than green mountains, this is the quiet sweet spot."],
  ["What I would pick", "Depends what you are buying. For guaranteed warmth in the dead of winter, November to February – that is the trip we tested, and you accept interiors that run brown after the long summer. For green mountains and hiking weather, late spring – and you pay for it with a cooler sea and none of the winter-escape magic."],
];

const HOW_LONG = [
  ["A long weekend", "Works for exactly one thing: winter sun on one island's south coast. It does not reach the interior, and the interior is where every one of these islands keeps its best material – you would fly home believing the resort strip was the island."],
  ["A week, one island", "The default, and honestly filled by any of the four. Tenerife and Gran Canaria in particular are bigger on the inside: a week of full days disappears into one island without repeating a landscape."],
  ["A week, two islands", "The upgrade most people never consider. Neighbouring islands sit a short ferry apart, and the contrast between any two is the best thing the archipelago sells – you double the trip for the price of a boat ticket."],
  ["Two weeks, all four", "What we did: Gran Canaria, Fuerteventura, Lanzarote and Tenerife in one November run, with a single rental car that rolled on and off every ferry with us. Every landing felt like a new country. Push days alternate with pool days, because boats do not tax your energy the way airports do."],
];

const REGIONS = [
  {
    name: "Tenerife",
    image: teideConeClearMorning,
    alt: "The bare cone of Mount Teide under a deep blue sky, seen across the caldera scrub, Tenerife",
    body: "The big-ticket island. Teide rises out of the cloud layer at its centre, the green Anaga range drops to black-sand coves in the north, and proper old Spanish towns fill the space between coasts. Nothing else in the archipelago matches its single sights – if you are coming once, for the postcard, this is the postcard.",
  },
  {
    name: "Gran Canaria",
    image: roqueNubloAndElFraile,
    alt: "Roque Nublo and El Fraile standing over the plateau with pine forest dropping away behind, Gran Canaria",
    body: "The road-trip island. Its mountainous heart produces a viewpoint every few bends, villages live half inside the rock at Artenara, a stone giant crowns the central plateau, and the Maspalomas dunes close the day as a pocket Sahara. The highest variety per driving hour of the four, with thinner crowds than its famous neighbour.",
  },
  {
    name: "Lanzarote",
    image: elGolfoGreenLagoon,
    alt: "The green lagoon of El Golfo behind its black beach, under a red volcanic crater wall, Lanzarote",
    body: "The strange one, and the most underrated. The ground still smokes in Timanfaya, vines grow in dug-out craters in black ash, and one designer's lifetime of work folds pools and gardens into the lava itself. White walls, black rock, green water: the whole island runs on three colours at full contrast.",
  },
  {
    name: "Fuerteventura",
    image: cofeteAndTheJandiaWall,
    alt: "The wild sweep of Cofete beach under the Jandía mountain wall, seen from the pass, Fuerteventura",
    body: "The beach island. The biggest, easiest sands in the archipelago in the north, the wildest beach of all hiding behind a mountain ridge in the south, and a bare, windblown interior that feels like a different continent. The least variety of the four and the best coastline – know which trade you are making.",
  },
];

/* Trip photos in journey order: Gran Canaria, Fuerteventura, Lanzarote, Tenerife. */
const CAROUSEL = [
  { image: puertoDeMoganMarina, alt: "Sailboats and the white village of Puerto de Mogán beneath its cliff, Gran Canaria", caption: "Puerto de Mogán, the first base" },
  { image: granCanariaInteriorTracks, alt: "Dirt tracks winding through the bare mountain interior of Gran Canaria, palms in the foreground", caption: "Gran Canaria's interior, mid-drive" },
  { image: maspalomasDuneRipples, alt: "Rippled sand dunes running toward the resort strip and mountains at Maspalomas, Gran Canaria", caption: "Maspalomas, doing its Sahara impression" },
  { image: groundSquirrelsLaOliva, alt: "Two ground squirrels on a stone wall in front of a bare volcanic plain at La Oliva, Fuerteventura", caption: "The car-park squirrels of La Oliva" },
  { image: grandesPlayasCorralejo, alt: "The white sand of Grandes Playas running empty toward a volcano cone, Corralejo, Fuerteventura", caption: "Grandes Playas, the easy Fuerteventura" },
  { image: villaWinterUnderTheRidge, alt: "The lonely white Villa Winter with its round tower under the Jandía mountains at Cofete, Fuerteventura", caption: "Villa Winter, alone at Cofete" },
  { image: papagayoCovesGoldenHour, alt: "The turquoise coves and headlands of Papagayo at golden hour, Lanzarote", caption: "Papagayo, straight off the ferry" },
  { image: timanfayaLavaField, alt: "A black lava field with a red ash apron running to the volcano cones of Timanfaya, Lanzarote", caption: "Timanfaya, where the ground still smokes" },
  { image: laGeriaCraterVines, alt: "Thousands of dug-out craters with single vines behind stone walls in the black ash of La Geria, Lanzarote", caption: "La Geria: a vineyard on Mars" },
  { image: jameosDelAguaPool, alt: "The turquoise pool of Jameos del Agua with a leaning palm and black lava rim, Lanzarote", caption: "Jameos del Agua, Manrique's lava pool" },
  { image: mascaVillageInItsGorge, alt: "The rooftops of Masca village under its rock spire, with the gorge falling to a silver sea, Tenerife", caption: "Masca, at the end of the switchbacks" },
  { image: taganangaAndTheAnagaCoast, alt: "The green ridges of the Anaga mountains dropping to Taganana's villages and a deep blue sea, Tenerife", caption: "Taganana, on the Anaga coast" },
  { image: cloudPouringIntoTheCaldera, alt: "Cloud pouring over the caldera rim onto dark lava in Teide National Park, Tenerife", caption: "The cloud layer, from above" },
  { image: losGigantesFromPlayaDeLosGuios, alt: "The sheer cliff wall of Los Gigantes above the black sand of Playa de los Guíos, Tenerife", caption: "Los Gigantes, the day's coda" },
];

// Deliberately no tier totals (destination playbook §8). The ONE figure on
// this page is the flight pair, labelled as what getting there costs. The
// same figure is echoed once in the FAQ (§6) and nowhere else.
const COSTS = [
  ["Lean", "A self-catering apartment away from the resort strips, supermarket picnics for the driving days, and the landscapes for free – the dunes, the miradors, the trails and the lava coasts charge nothing"],
  ["Core", "Small hotels and casas rurales that change with each island, restaurant dinners, and the short list of paid bookings that gate the headline sights"],
  ["Splurge", "The resort-and-villa tier the islands are famous for. Worth knowing: money here buys the sea view, the spa and the breakfast spread – it does not buy access, because nothing in the Canaries is gated behind wealth"],
];

const TIPS = [
  ["Book Teide the moment your dates are fixed, and pack a plan B you would enjoy.", "The cable car and the summit slots sell out far in advance, and the wind cancels rides with no next-day fallback – ours died exactly that way. The saving grace: the caldera below the peak is a full day on its own, so a cancelled ride is not a cancelled day if you planned for the possibility."],
  ["Do not pick one island.", "The single best move we made was refusing to choose. Neighbouring islands are a short ferry apart, no two of the four repeat a landscape, and boat days cost you almost no energy – so sightseeing islands and pool islands can alternate. One island is a holiday; two or more is a trip."],
  ["At the famous small sights, timing beats fame.", "Gran Canaria's little slot canyon went from secret to Instagram queue in a few years – on a busy afternoon twenty people share fifty metres of rock. Early on a weekday morning it is still close to the place we had to ourselves. And skip any slot canyon outright if rain is possible in the mountains: they flash-flood fast."],
];

const FAQ = [
  ["Which Canary Island is best?", "The one that matches what you want, because the four big islands genuinely do different jobs. Tenerife is the big-ticket island: Teide above the clouds, the Anaga range, proper historic towns – if you are coming once for the postcard, come here. Gran Canaria is the road-trip island: the highest density of viewpoints, gorges and mountain villages per driving hour, plus desert dunes at the bottom. Lanzarote is the strange one, volcanic ground still smoking and an island-wide design experiment, and it is the most underrated of the four. Fuerteventura is the beach island: the biggest sands, the emptiest interior, the most wind. The honest upgrade: pick two that sit near each other and take the ferry between them."],
  ["Tenerife or Gran Canaria – which should I choose?", "First visit, one island, biggest single sights: Tenerife – nothing on Gran Canaria matches Teide, and the historic towns are better. Drivers, hikers and viewpoint collectors: Gran Canaria – less famous, fewer coaches, and more variety per kilometre of mountain road. We drove both on the same trip, and the real answer is that the ferry makes the question obsolete: pairing them in one week is barely more logistics than choosing between them."],
  ["How many days do you need in the Canary Islands?", "A week for one island – any of the four big ones honestly fills seven days once you leave the coast. Two islands fit a week if you accept highlights rather than depth. The full four-island run is a two-week trip; we did it in fourteen days with ferries between islands and never once ran out of new landscapes. A long weekend only makes sense as pure winter sun on one south coast."],
  ["When is the best time to visit the Canaries?", "There is no bad month, which is the archipelago's superpower – the season question is really a trade. Winter, November to March, is the headline act: warm afternoons and a swimmable sea while the rest of Europe is cold, which is why winter is the islands' high season. Spring is greenest in the mountain interiors, autumn has the warmest sea and the thinnest crowds, and high summer is hottest, windiest and most crowded. We tested November and would take it again."],
  ["Are the Canary Islands warm enough to swim in winter?", "Yes – with honest fine print. Southern coasts run shirt-sleeve warm through the winter, and the Atlantic sits around 19 to 20 °C in midwinter: refreshing rather than bathwater, and entirely swimmable on a sunny afternoon. We swam in the Atlantic repeatedly in late November – off beaches and in natural lava pools. Evenings want a light jacket, and the mountain interiors are their own colder, windier country – pack for both altitudes."],
  ["Can you island-hop the Canary Islands?", "Yes, and it is the best version of the trip. Neighbouring islands are linked by frequent car ferries, so a two-island week is barely harder than a one-island one. The catch is geography: the archipelago is wide, the far pairings burn most of a day at sea or are better flown, and not every sequence works. Which islands pair well – and which crossings to refuse – is exactly the kind of thing worth getting from someone who has run the chain."],
  ["Do you need a car in the Canary Islands?", "For the trip this page describes, yes, on every island. The coasts are served well enough without one, but the interiors are the point – the mountain roads, the miradors, the trailheads and the empty corners are all drive-to places, and rental cars here are cheap by European standards. The one caveat: mountain roads are relentlessly winding, so distances take longer than they look."],
  ["Can you climb Mount Teide?", "Yes – Spain's highest peak is walkable, and there is a cable car most of the way up – but access is rationed and it bites. The final summit trail needs a permit with capped daily numbers, the permit now costs money, and both it and the cable car sell out well ahead of busy dates. Wind shuts the cable car with no next-day fallback, which is how we lost our slot. Decide early that Teide matters to you, book before anything else in the trip, and plan the caldera below as a day you would enjoy anyway – it is genuinely one of the best landscapes in Spain."],
  ["Is Lanzarote worth visiting?", "Emphatically yes, and it was the surprise of our four-island trip. It is the closest Europe gets to another planet: ground that still smokes in Timanfaya, vines growing in dug-out craters, turquoise pools inside lava tubes – and the whole island filtered through one designer's eye, built into the lava rather than over it. Everyone we knew kept flying to Tenerife. Lanzarote is the one we came home evangelising about."],
  ["Are the Canary Islands expensive?", "No – this is one of the cheapest warm-winter trips a European can buy. Return flights from most of western and northern Europe typically come in under €150 and sale fares go far lower; that is what getting there costs, not what the trip costs. On the ground, prices sit at or below mainland-Spain levels, rental cars are cheap, and the best landscapes are free. The bed is the only line with real range, and winter – the islands' high season – is when it moves most."],
  ["Are the Canary Islands part of Spain – do I need a visa or different money?", "They are Spain, and the practicalities are as easy as Europe gets: euros, EU roaming, Schengen rules, no border formalities on flights from the mainland or most of Europe. Two quirks worth knowing: the islands keep their own clock, one hour behind mainland Spain and level with London, and they are a special tax zone, which is part of why the duty-free shops and the fuel are noticeably cheap."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// Four Canary SKUs are planned (Tenerife 7D, Gran Canaria 7D, Lanzarote &
// Fuerteventura 7D, Canary Islands 14D); none is live yet. The fetch takes
// all guides so each SKU appears as its own card with no code change; until
// then the guide sections and the BuyBox do not render.
const GUIDE_BLURBS = {};

async function fetchCanaryContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "canary-islands" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "canary-islands" && (language == "en" || !defined(language))] | order(publishedDate desc){
          title, "slug": slug.current, subtitle, heroImage
        }
      }`,
    );
  } catch {
    return { guides: [], stories: [] };
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

export default async function CanaryIslandsDestinationPage() {
  const { guides, stories } = await fetchCanaryContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "Canary Islands: which island to pick, and how many days you need",
        description:
          "Which Canary Island fits you – Tenerife, Gran Canaria, Lanzarote or Fuerteventura – how many days each needs, when to go, and why the answer might be a ferry, not a choice.",
        datePublished: "2026-09-03",
        dateModified: "2026-09-03",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Canary Islands" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/canary-islands",
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
        <span className="text-slate-600">Canary Islands</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Spain · Atlantic &amp; volcanic islands
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Canary Islands
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Which island to pick, how many days you need, and when to go – four
          islands tested on one trip, and the ferry logic that beats choosing.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={HERO_IMAGE}
              alt={HERO_ALT}
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Are the Canary Islands worth it, and what do you actually do
                there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                I dismissed the Canaries for years. The reputation is package
                tourism, everyone I knew kept flying to the same island, and I
                had quietly filed the whole archipelago under nothing special,
                just some islands. Then we went and did it our way – all four
                big islands in one two-week November run, linked by ferry, one
                island at a time – and I came home owing the place an apology.
                No two islands repeat a landscape. Every single landing felt
                like arriving in a new country.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do depends on which island you are standing
                on, and that is the point. This is a volcano archipelago that
                happens to have beaches, not the other way around: you drive
                above the cloud layer to Spain's highest peak, walk to a stone
                monolith at the heart of Gran Canaria, watch the ground smoke
                in Lanzarote's lava fields and swim in turquoise pools inside
                collapsed lava tubes. Between the volcanoes there are mountain
                roads that produce a viewpoint every few bends, villages built
                into cave walls, dunes that pass for the Sahara at sunset, an
                island-length wild beach behind a mountain ridge, and old
                Spanish colonial towns that nobody associates with the
                Canaries until they stand in one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest version of the reputation: the resort belts are
                exactly what you fear, concrete and all-inclusive wristbands,
                and they are also easy to leave. They occupy a few kilometres
                of south coast per island; the interiors behind them are close
                to empty even in high season. That is the real trick of the
                Canaries – the crowds concentrate themselves so thoroughly
                that a rental car makes the islands feel undiscovered. Two
                more truths from November: the interiors run brown after the
                long summer, greener in spring, and the wind is a genuine
                actor here – it shapes the dunes, powers the windsurf coasts,
                and occasionally cancels your best-laid mountain plans.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                So the question is not really whether the Canaries are worth
                it. It is which Canaries you are buying: the volcano island,
                the road-trip island, the one that looks like Mars, or the
                beach island. Picking wrong is the only real way to ruin this
                trip – and refusing to pick, pairing two islands with a ferry,
                is the best upgrade the archipelago sells.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                There is no closed season. The islands sell reliable warmth
                all year, so the month you pick decides the trade-offs, not
                whether the trip works.
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
              <p className="text-[15px] leading-relaxed text-slate-700">
                The unit of planning here is the island, not the day. Decide
                how many islands you are buying, and the length follows.
              </p>
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
              {guide ? (
                <p className="text-[15px] leading-relaxed text-slate-700">
                  <strong>Guide:</strong>{" "}
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="font-medium text-brand-terracotta underline underline-offset-2"
                  >
                    {guide.title}
                  </Link>{" "}
                  – the tested version of this trip, planned end to end.
                </p>
              ) : null}
            </section>

            <section className="space-y-6">
              <SectionHeading>The islands</SectionHeading>
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
              <p className="text-[15px] leading-relaxed text-slate-700">
                Four more islands exist – La Palma, La Gomera, El Hierro and
                little La Graciosa – and this page does not cover them,
                because we have not tested them. They are the greener, quieter,
                further-flung end of the archipelago, they need their own boat
                or flight legs, and they are on the return list rather than in
                these cards.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Each of the four big islands has its own international airport
                with direct flights from all over Europe, year-round – this is
                one of the continent's densest low-cost networks, which is
                exactly why the islands work as a winter escape. Practicalities
                are as easy as travel gets for Europeans: this is Spain, so
                euros, EU roaming and Schengen rules apply, with one charming
                quirk – the Canaries keep their own clock, level with London
                and an hour behind Madrid.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, rent a car on every island you visit. The
                coastal strips manage without one, but everything this page
                praises – the mountain roads, the miradors, the trailheads,
                the empty corners – is drive-to, and rentals here are cheap
                and everywhere. Budget real time for the mountain roads: they
                are engineered as one continuous hairpin, and map estimates
                flatter them.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Between islands, neighbours are linked by frequent car
                ferries – we took one rental car across every crossing of a
                four-island trip – and the longer jumps are better flown, on
                short and frequent inter-island flights. The planning trap is
                the geography: the archipelago is wide, some pairings work
                beautifully and some quietly burn a day of your holiday at
                sea. Which crossings to take and which to refuse is the heart
                of a multi-island plan.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the line every alternative loses to: return
                flights from most of western and northern Europe typically
                come in under €150, and sale fares go far lower. That is what
                reaching the islands costs, not what the trip costs – but it
                sets the tone, because no other warm-in-winter destination
                starts this cheap. On the ground, prices sit at or below
                mainland-Spain levels, and the best of the archipelago – the
                dunes, the miradors, the trails, the lava coasts – is free.
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
                The bed is the only line with real range, and the seasons move
                it in the opposite direction to the Mediterranean: winter is
                the high season here, and the resort coasts price accordingly.
                The car, the fuel and the food stay cheap in every month –
                which is why two people can run this trip lean without it
                feeling lean.
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
                src={MIDPAGE_IMAGE}
                alt={MIDPAGE_ALT}
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

            {guides?.length ? (
              <section className="space-y-4">
                <SectionHeading>Guides for this destination</SectionHeading>
                {guides.map((g) => {
                  const price = Array.isArray(g.prices)
                    ? g.prices.find((p) => p?.currency === "EUR")
                    : null;
                  return (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row"
                    >
                      {storyImage(g.heroImage) ? (
                        <img
                          src={storyImage(g.heroImage)}
                          alt={g.title}
                          className="aspect-[4/3] w-full object-cover sm:w-64"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="flex flex-1 flex-col gap-2 p-6">
                        <p className="font-serif text-xl leading-snug text-brand-ink group-hover:text-slate-700">
                          {g.title}
                        </p>
                        <p className="text-[14px] leading-relaxed text-slate-700">
                          {GUIDE_BLURBS[g.slug] ?? g.subtitle}
                        </p>
                        <p className="mt-auto pt-2 text-sm font-semibold text-slate-900">
                          {g.durationDisplay}
                          {price ? ` · €${price.amount}` : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </section>
            ) : null}

            {stories?.length ? (
              <section className="space-y-4">
                <SectionHeading>Stories from the Canary Islands</SectionHeading>
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

        {guide ? (
          <BuyBox
            price={guidePrice ? `€${guidePrice.amount}` : null}
            pdfHref={`/guides/${guide.slug}`}
          />
        ) : null}
      </div>
    </main>
  );
}

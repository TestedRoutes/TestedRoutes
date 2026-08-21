import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import islandBeachPavilion from "../../../../content/countries/fiji/destination/generated/web/island-beach-pavilion.jpg";
import yasawaBeachWalk from "../../../../content/countries/fiji/destination/generated/web/yasawa-beach-walk.jpg";
import portDenarauMarina from "../../../../content/countries/fiji/destination/generated/web/port-denarau-marina.jpg";
import yasawaRidgeReef from "../../../../content/countries/fiji/destination/generated/web/yasawa-ridge-reef.jpg";
import sharkDiveKuata from "../../../../content/countries/fiji/destination/generated/web/shark-dive-kuata.jpg";
import sawaILauLimestone from "../../../../content/countries/fiji/destination/generated/web/sawa-i-lau-limestone.jpg";
import tavoroFalls from "../../../../content/countries/fiji/destination/generated/web/tavoro-falls.jpg";
import nadiTempleCeiling from "../../../../content/countries/fiji/destination/generated/web/nadi-temple-ceiling.jpg";
import resortTransferBoat from "../../../../content/countries/fiji/destination/generated/web/resort-transfer-boat.jpg";
import islandBayResortBeach from "../../../../content/countries/fiji/destination/generated/web/island-bay-resort-beach.jpg";
import activitiesBoard from "../../../../content/countries/fiji/destination/generated/web/activities-board.jpg";
import sawaILauCavePool from "../../../../content/countries/fiji/destination/generated/web/sawa-i-lau-cave-pool.jpg";
import blueLagoonBeach from "../../../../content/countries/fiji/destination/generated/web/blue-lagoon-beach.jpg";
import beachBonfireSunset from "../../../../content/countries/fiji/destination/generated/web/beach-bonfire-sunset.jpg";
import taveuniRainforest from "../../../../content/countries/fiji/destination/generated/web/taveuni-rainforest.jpg";
import rainbowReefCorals from "../../../../content/countries/fiji/destination/generated/web/rainbow-reef-corals.jpg";
import sunsetBeachWalk from "../../../../content/countries/fiji/destination/generated/web/sunset-beach-walk.jpg";
import bulaBed from "../../../../content/countries/fiji/destination/generated/web/bula-bed.jpg";
import loungingUnderThatch from "../../../../content/countries/fiji/destination/generated/web/lounging-under-thatch.jpg";

/*
 * Scope note (destination playbook v5 §7): this page sells the DECISION -
 * whether Fiji, which islands, how long, when. All execution belongs to the
 * paid guides and is deliberately absent: no timetable times, no fares or
 * venue prices, no booking mechanics or lead times, no named hotel or
 * restaurant picks, no within-day sequencing. The one published figure is the
 * §8 unavoidable cost (the boat pass up the islands, ~€250 pp); if a second
 * amount appears on this page, §8 has failed. The teaser budget draws only on
 * facts the six published Fiji inspire stories already give away: Denarau's
 * reclaimed grey sand, the hop-on pass system and book-beds-in-order rule,
 * the resorts meeting the catamaran offshore, the kava ceremony, the shark
 * dive's kneel-behind-the-wall shape, Sawa-i-Lau's honest modesty, the Great
 * White Wall's tide dependence, and the small-plane luggage limits. The test
 * before every edit: could a reader run a day of the trip from this page?
 * If yes, cut until they cannot.
 */

export const metadata = {
  title: "Fiji: which islands to pick, and how long you need · TestedRoutes",
  description:
    "Whether Fiji is worth it, which islands to pick, how many days you need, when to go and what it costs – tested on the ground from Nadi to the Yasawas and Taveuni.",
  alternates: { canonical: "/destinations/fiji" },
  openGraph: {
    type: "article",
    url: "/destinations/fiji",
    title: "Fiji: which islands to pick, and how long you need",
    description:
      "Two completely different Fijis – the mainland base and the islands you came for. Which islands to pick, how long you need, and when to go.",
  },
};

const WHEN_TO_GO = [
  ["May to October", "The dry season and the easy answer: cooler, clearer water, reliable beach days, and the manta channel feeding at its best. This is also the southern-winter escape window, so July and August are the busiest stretch of it."],
  ["November to April", "The wet season, and the South Pacific cyclone season. Plenty of days are still glorious, but the rain comes in real quantities and what it takes is reef light, dive visibility and beach hours. The consolation is green: Taveuni's waterfalls run hardest in exactly these months."],
  ["December and January", "A special case: holiday pricing, full boats and full resorts. Fiji at its most social, and its most expensive."],
  ["What I would pick", "May, June or September – dry-season certainty without the July-to-August crowds or the holiday premium. Going in the wet season instead is a real saving and a real gamble: we honeymooned in December and it worked, but it cost us rain days, and you should book knowing that trade."],
];

const HOW_LONG = [
  ["A stopover (1 day)", "Nadi is the Pacific's transit hub, and a day between flights is genuinely usable: the mud pools, the painted temple, a first taste of the islands. Better than the lounge, and honest about being a taste rather than a trip."],
  ["A week", "The Yasawas done properly: three island stops on the hop-on boat pass, sharks and mantas without a licence, and none of it needing a resort package. The budget-friendliest real Fiji trip."],
  ["Ten days", "The islands plus Taveuni – the chain's beaches and reefs, then the rainforest and the soft-coral diving that made Fiji's name. The most-searched Fiji length, because it is the one that covers both Fijis."],
  ["Two weeks", "The honeymoon shape: the islands at two nights each so no stop is rushed, the mainland used as a base at each end, and Taveuni given the days its reef deserves. This is the length our guide runs."],
];

const REGIONS = [
  {
    name: "Nadi & Denarau, the base",
    image: portDenarauMarina,
    alt: "Yachts and catamarans moored at the Port Denarau marina under a blue sky",
    body: "Where every Fiji trip starts and restocks: the airport, the marina the island boats leave from, and a strip of big resorts built for pools rather than beaches. Treat it as the base it is – the one real sight in Nadi town is the painted Hindu temple – and spend the saved days out on the water.",
  },
  {
    name: "The Yasawa chain",
    image: yasawaRidgeReef,
    alt: "Looking down a green Yasawa island ridge to turquoise reef water and an offshore islet",
    body: "A line of dry, sandy volcanic islands running north of the mainland – the Fiji of the postcards. One catamaran runs the whole chain daily, each resort has its own bay, and every arrival happens off a beach. The rhythm is slow on purpose: the boat sets it, not you.",
  },
  {
    name: "The water",
    image: sharkDiveKuata,
    alt: "A diver watching sharks pass an arm's length away in clear blue water",
    body: "The chain's real headline is under the surface: shark dives run daily off the southern islands, a manta channel feeds mid-chain, and the house reefs start where the sand ends. Almost all of it is open to snorkellers – the licence matters far less here than people assume.",
  },
  {
    name: "The Blue Lagoon & the caves",
    image: sawaILauLimestone,
    alt: "A small boat by limestone rocks in clear turquoise water in the northern Yasawas",
    body: "The top of the chain holds the lagoon the films borrowed – pale, shallow, genuinely that colour – and Sawa-i-Lau, a limestone island with sea caves you swim into. A fun half-morning rather than a wonder of the world, and better for being honest about it.",
  },
  {
    name: "Taveuni, the Garden Island",
    image: tavoroFalls,
    alt: "Tavoro waterfall dropping into its green pool in Taveuni's rainforest",
    body: "A short flight east and a different country: rainforest instead of dry hills, waterfalls stepping up through the Bouma forest, and offshore the soft-coral reef that made Fiji's diving reputation. It is forest, not beach – which is exactly why it pairs so well with the islands.",
  },
];

/* Trip photos, roughly in trip order: the mainland, up the chain, then Taveuni. */
const CAROUSEL = [
  { image: nadiTempleCeiling, alt: "The painted Dravidian ceiling of the Sri Siva Subramaniya temple in Nadi", caption: "The painted temple, Nadi" },
  { image: resortTransferBoat, alt: "A small resort boat on turquoise water, a red ensign at the stern", caption: "The resort boat comes out to meet you" },
  { image: islandBayResortBeach, alt: "An island resort beach with thatched umbrellas and calm green-blue water", caption: "An island bay in the Yasawas" },
  { image: loungingUnderThatch, alt: "Feet up under a thatched beach shelter looking onto white sand and sea", caption: "The job description, mid-chain" },
  { image: activitiesBoard, alt: "A chalkboard listing the day's island activities at a Yasawa resort", caption: "The board is the programme" },
  { image: sawaILauCavePool, alt: "Green seawater inside the limestone chambers of the Sawa-i-Lau caves", caption: "Inside Sawa-i-Lau" },
  { image: blueLagoonBeach, alt: "Palms over white sand with an island offshore at the top of the Yasawa chain", caption: "The top of the chain" },
  { image: beachBonfireSunset, alt: "A bonfire burning on the sand at sunset under a leaning palm", caption: "A bonfire night" },
  { image: bulaBed, alt: "A resort bed made up with BULA spelled in leaves and hibiscus flowers", caption: "Bula, everywhere, twice a day" },
  { image: taveuniRainforest, alt: "Rainforest running to the coast on Taveuni", caption: "Taveuni is forest, not beach" },
  { image: rainbowReefCorals, alt: "Hard corals and reef fish in clear blue water on the Rainbow Reef", caption: "The Rainbow Reef" },
  { image: sunsetBeachWalk, alt: "A figure walking an island beach at sunset", caption: "Sunset comes fast, all year" },
];

// Deliberately no tier totals here (§8). The guide costs all three levels out
// line by line; a free page that publishes totals anchors the reader on a big
// number before they know what is optional inside it.
const COSTS = [
  ["Lean", "Fan-cooled island bures with the meal plan folded in, the boat pass, and the snorkelling that starts off every beach – the islands at backpacker rates without feeling like a compromise"],
  ["Core", "Air-conditioned island rooms, the paid trips that earn their place – the sharks, the mantas, the caves – and proper mainland beds at each end"],
  ["Splurge", "The adults-only islands, the all-inclusives, and the flown-in private resorts – Fiji's top end is genuinely world-class, and it books out first"],
];

const TIPS = [
  ["Book the boat pass and the island beds together, in order.", "The islands run on one daily catamaran and a hop-on pass, and the pass covers transport only – every stop needs a bed booked before you step off. Missing the day's boat strands you, so the pass and the beds are one booking decision, not two. The guide sequences the whole thing."],
  ["Read the activities board the moment you land.", "Every island resort chalks up its own week – village visits, kava nights, snorkel runs, dive trips – and almost none of it is online. The board on the wall is the programme; plans made from home are guesses."],
  ["Say yes when the kava bowl comes round.", "Clap once, drink it down, let your mouth go numb, stay for the singing. It is the most Fijian hour you will spend, it costs nothing, and it is the one thing on every island that is not staged for you."],
  ["Pack for the small planes, not the long-haul allowance.", "The hops east and the island shortcuts run strict luggage limits, and the mainland hotels will store what you leave behind. Pack light from home and the whole trip fits every leg; pack heavy and you will be repacking in a lobby."],
  ["Do not build a December trip around the mantas.", "They feed in the channel May to October. Out of season the channel is still the best snorkelling in the chain – but that is a different promise, and a honeymoon booked for the rays should be booked for their season."],
];

const FAQ = [
  ["Is Fiji good for a honeymoon?", "Yes – it might be the best-value honeymoon in the South Pacific, but the answer depends on which Fiji you book. One resort island for two weeks is the default and wastes what makes Fiji special: the variety. The honeymoon that works runs the island chain – a few stops, each with its own bay, reef and rhythm – then flies east to the rainforest. Two completely different Fijis in one trip."],
  ["Which part of Fiji should you stay in?", "Out on the islands, not the mainland. Denarau, the resort strip by the airport, is built on reclaimed mangrove – the sand is grey, the water is murky, and everyone swims in the pools. It earns its place as a base: land there, catch the boats, come back to fly. The Fiji you are picturing – white sand, clear water, singing as the boat comes in – starts an hour offshore."],
  ["How many days do you need in Fiji?", "A week covers the Yasawa islands properly. Ten days adds Taveuni and its reef, and is the most-searched length for a reason. Two weeks is the honeymoon shape – the same trip at a pace where no island is rushed. A single day between flights is genuinely usable too, because Nadi is the region's transit hub."],
  ["Is Fiji expensive?", "Less than its reputation, if you skip the package. Getting up the islands and back – the hop-on catamaran pass that is the trip's spine – runs about €250 per person, and that is what moving around costs, not what the trip costs. The real range sits in the bed you pick and the meal plan that rides with it: the same island often runs from a fan-cooled bure to a villa. The guide prices every bed at every stop, line by line."],
  ["When is the best time to visit Fiji?", "May to October – the dry season, with clearer water and the mantas feeding. July and August are the busiest of it, and December and January carry holiday pricing on top of the wet. The wet season is a real gamble that sometimes pays: cheaper, greener, waterfalls at full volume, and rain that can close a pool for days."],
  ["How does island hopping work in Fiji?", "One catamaran runs the island chain daily, and a multi-day hop-on pass lets you get off at an island, stay, and catch the boat onward. The boats never dock – each resort sends its own boat out to collect you. The catch: the pass covers transport only, so every island needs a bed booked before you board, in order. Getting that sequence right is half of what the guide is for."],
  ["Can you enjoy Fiji without a dive licence?", "Completely. The reef-shark snorkel, the manta channel, the cave swim and every house reef need nothing but a mask – boats take you out and guides lead you round. The licence buys exactly one thing worth wanting: the deep soft-coral walls off Taveuni. If that is the dream, get certified before you fly, not during the honeymoon."],
  ["Fiji or Samoa – which is better?", "Different trips. Fiji is the islands-and-boats holiday: hundreds of islands, dive boats, resort bays, a pass that strings them together. Samoa is two big islands you drive yourself, with tourism a footnote. For a honeymoon or an island-hopping trip, Fiji; for one rental car and a culture with no crowds, Samoa."],
  ["Is Fiji safe?", "Yes – Fiji is one of the Pacific's easiest countries to travel, and the welcome is famous for a reason. The real risks are practical: the November-to-April cyclone season (forecasts give days of warning, and insurance that covers weather is the answer), strong sun, and coral underfoot. There is no malaria."],
  ["What is the Great White Wall?", "Fiji's most famous dive: a sheer drop-off near Taveuni blanketed in white soft coral, reached through a tunnel in the reef. The catch is the tide – the corals only open and glow when the current feeds them, so the day and the hour matter more than the site. It is deep, for certified divers only, and the reason our itinerary keeps a flexible day beside it."],
  ["Do you need a car in Fiji?", "No. The islands run on boats, the mainland runs on taxis and transfers, and nothing in a normal trip needs a wheel in your hands. The one exception is Taveuni, where a driver for the day or a hire car is how you reach the falls and the coastal walks – arranged there, not planned from home."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchFijiContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "fiji" && (language == "en" || !defined(language))] | order(durationDays asc){
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "fiji" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function FijiDestinationPage() {
  const { guides, stories } = await fetchFijiContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Fiji: which islands to pick, and how long you need",
        description:
          "Whether Fiji is worth it, which islands to pick, how many days you need, when to go and what it costs.",
        datePublished: "2026-08-21",
        dateModified: "2026-08-21",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Fiji" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/fiji",
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
        <span className="text-slate-600">Fiji</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Oceania · Melanesia
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Fiji
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Which islands to pick, and how long you need – there are two
          completely different Fijis, and one boat timetable runs the good one.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={islandBeachPavilion}
              alt="A thatched pavilion and red ti plants on a white-sand island beach in Fiji"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Fiji worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fiji is the South Pacific's default for a reason: hundreds of
                islands, water in colours you stop trusting on other people's
                photos, and a bula culture that is warm even by Pacific
                standards. But there are two completely different Fijis, and
                most first-timers book the wrong one. The mainland around Nadi
                is the airport, the marina and a strip of big resorts on
                reclaimed grey sand – a base, not a destination. The Fiji you
                are picturing starts an hour offshore, and getting out to it is
                the whole game.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do out there: hop the island chain on the
                daily catamaran, each stop its own bay and reef; kneel on the
                seabed while sharks work past you; drop everything when the
                drum announces the mantas; swim into limestone caves; and
                drink kava in a circle when the bowl comes round. Fly east and
                Fiji changes country entirely – rainforest, waterfalls you
                swim beneath, and the soft-coral reef that made its diving
                famous. Almost none of it needs a licence, a tour package or a
                wheel in your hands.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two honest caveats. Fiji runs on boats and boards: one
                catamaran a day sets the itinerary, resorts feed you on meal
                plans, and the week's programme is chalked on a wall when you
                arrive – if you fight that rhythm the trip frays, and if you
                ride it the trip is effortless. And the wet season is real:
                we honeymooned here through it, loved it, and lost days to
                weather a drier month would have kept.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fiji is warm all year – the real split is wet against dry, and
                the two halves of the country want opposite weather.
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
                The honest spread runs from a layover to two weeks, and the
                decision inside it is which of the two Fijis you are buying
                days for – the islands, or the islands plus the rainforest.
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
                  is the two-week version done for you: the islands at two
                  nights each, Taveuni's reef given real days, and every
                  booking in the order it has to be made.
                </p>
              ) : null}
            </section>

            <section className="space-y-6">
              <SectionHeading>Fiji, by what you came for</SectionHeading>
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
                Everything lands at Nadi, on the main island's west coast –
                the Pacific's transit hub, with direct flights from the US
                west coast, Australia and New Zealand, and one-stop routes
                from Europe through those gateways. Entry is a visitor permit
                on arrival for most passports, and Fiji is not a malaria
                zone. The airport-to-resort leg is minutes, not hours, which
                is why even a one-day stopover here actually works.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the water, one catamaran runs the island chain daily, each
                way, and a hop-on pass strings the stops together. The boats
                never dock – each resort sends its own boat out, bags and
                all, usually with singing waiting on the sand. The full run
                to the top of the chain takes the better part of five hours,
                which is exactly why an itinerary's island order matters, and
                why there is a flying shortcut worth knowing about for the
                way back.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Eastward, small planes hop to the outer islands on strict
                luggage limits – we learned that one the hard way and left
                half our bags on the mainland, which turns out to be the
                system working. On Taveuni itself there are no taxis waiting
                anywhere; a driver for the day or a small hire car, arranged
                on the island, is how the falls and the coast get reached.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Cheaper than its honeymoon reputation, if you build the trip
                yourself instead of buying it as a package. The one cost
                nobody island-hopping avoids is the boat: the hop-on
                catamaran pass that is the trip's spine runs about €250 per
                person. That is what getting up the islands costs, not what
                the trip costs – the swims, the reefs and the kava are free
                or nearly so, and the real money sits in one decision:
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
                The bed is the line with all the range – often on the same
                island – and the meal plan that rides with it is the half of
                the bill people forget to compare. Holiday-season December
                and January move every rate up. Figures here assume the dry
                season, two sharing, per person.
              </p>
              {guide ? (
                <p className="text-[15px] leading-relaxed text-slate-700">
                  The{" "}
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="font-medium text-brand-terracotta underline underline-offset-2"
                  >
                    guide
                  </Link>{" "}
                  prices the whole trip at three honest levels, line by line
                  – every bed at every stop, every activity per person, and
                  the transport legs against the real distances – so you can
                  set the honeymoon at the level you want instead of
                  guessing.
                </p>
              ) : null}
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
                src={yasawaBeachWalk}
                alt="A long white-sand island beach with palms, walkers and boats offshore in the Yasawas"
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
                          Everything this page deliberately leaves out: all 14
                          days hour by hour, the boat timetable and the pass
                          maths decoded, every bed at every stop priced with a
                          QR link, the dive days planned against the flying
                          clock, a three-tier budget line by line, and the
                          companion Google map with every pin.
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
                <SectionHeading>Stories from Fiji</SectionHeading>
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

import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import beachFalesWhiteSand from "../../../../content/countries/samoa/destination/generated/web/beach-fales-white-sand.jpg";
import toSuaOceanTrench from "../../../../content/countries/samoa/destination/generated/web/to-sua-ocean-trench.jpg";
import southEastCoastBeach from "../../../../content/countries/samoa/destination/generated/web/south-east-coast-beach.jpg";
import sopoagaFallsGorge from "../../../../content/countries/samoa/destination/generated/web/sopoaga-falls-gorge.jpg";
import lagoonShallows from "../../../../content/countries/samoa/destination/generated/web/lagoon-shallows.jpg";
import tagaLavaShelf from "../../../../content/countries/samoa/destination/generated/web/taga-lava-shelf.jpg";
import sopoagaFallsSign from "../../../../content/countries/samoa/destination/generated/web/sopoaga-falls-sign.jpg";
import founderAtSopoaga from "../../../../content/countries/samoa/destination/generated/web/founder-at-sopoaga-falls.jpg";
import palmIsletAtDusk from "../../../../content/countries/samoa/destination/generated/web/palm-islet-at-dusk.jpg";
import fishingBoatsSavaii from "../../../../content/countries/samoa/destination/generated/web/fishing-boats-savaii.jpg";
import alofaagaBlowhole from "../../../../content/countries/samoa/destination/generated/web/alofaaga-blowhole.jpg";
import afuAauFalls from "../../../../content/countries/samoa/destination/generated/web/afu-aau-falls.jpg";
import ladySamoaBus from "../../../../content/countries/samoa/destination/generated/web/lady-samoa-bus.jpg";
import newYearResortPool from "../../../../content/countries/samoa/destination/generated/web/new-year-resort-pool.jpg";
import villageRoad from "../../../../content/countries/samoa/destination/generated/web/village-road.jpg";
import beachFalePavilion from "../../../../content/countries/samoa/destination/generated/web/beach-fale-pavilion.jpg";
import coconutPalms from "../../../../content/countries/samoa/destination/generated/web/coconut-palms.jpg";
import muPagoaFalls from "../../../../content/countries/samoa/destination/generated/web/mu-pagoa-falls.jpg";
import rainforestRidge from "../../../../content/countries/samoa/destination/generated/web/rainforest-ridge.jpg";
import sunsetOverTheSea from "../../../../content/countries/samoa/destination/generated/web/sunset-over-the-sea.jpg";

/*
 * Scope note (destination playbook v5 §7): this page sells the DECISION -
 * whether Samoa is worth the flights, how long, which islands, when. All
 * execution belongs to the paid guide and is deliberately absent here: no
 * fares (the ferry math above all - it is the SKU's most valuable fact), no
 * venue prices or opening windows, no clock times, no booking mechanics or
 * lead times, no named hotel/restaurant picks, no within-day sequencing. The
 * one published figure is the §8 unavoidable cost (getting around, ~€130 pp
 * for the week); if a second amount appears on this page, §8 has failed.
 * No Samoa inspire story is published yet, so the teaser budget here is the
 * strictest of any hub: structural insights at headline level only (the
 * Sunday rule, the two-islands decision, the midnight landings). The test
 * before every edit: could a reader run a day of the trip from this page?
 * If yes, cut until they cannot.
 */

export const metadata = {
  title: "Samoa: how many days you need, and which islands to pick · TestedRoutes",
  description:
    "Whether Samoa is worth the trip, how many days you need, Upolu vs Savai'i, when to go and what it costs – tested on the ground across both islands.",
  alternates: { canonical: "/destinations/samoa" },
  openGraph: {
    type: "article",
    url: "/destinations/samoa",
    title: "Samoa: how many days you need, and which islands to pick",
    description:
      "Two islands, one rental car and a ferry between them – how long Samoa really takes, when to go, and why Sunday shapes the week more than the weather.",
  },
};

const WHEN_TO_GO = [
  ["May to October", "The dry season and the right answer. Days run warm and humid with less rain, the reef swims are at their clearest, and the roads and falls are at their friendliest. June to August is also the southern-winter escape window, so it is the busiest stretch."],
  ["November to April", "The wet season – and the South Pacific cyclone season. Plenty of days are still lovely, and squalls often pass inside an hour, but the rain is real and the risk window is genuine."],
  ["December and January", "A special case: the holiday period fills flights, beds and the ferry with returning Samoan families, and prices peak. The islands are at their most alive – church choirs, feasts, fireworks – but nothing about the trip is quiet or cheap."],
  ["What I would pick", "May or September – dry-season conditions without the June-to-August crowds or the holiday premium. If the choice is only ever school holidays, take July and book the beds early; if you want Samoa at full volume and can pay for it, the New Year is unforgettable – I crossed into one there."],
];

const HOW_LONG = [
  ["A stopover (1–2 days)", "Enough for Apia and one south-coast day, and better than skipping Samoa – but the flights land in the small hours, so the first night is gone before it starts, and two days spends most of its hours arriving and leaving."],
  ["Five days", "Upolu done properly: the capital, the waterfalls, To-Sua, the beaches and the reef swims, without ever boarding the ferry. The honest version of the shorter trip – it misses Savai'i entirely, and that is the trade."],
  ["A week", "The full trip: Upolu at its own pace, then across the strait to Savai'i for the lava fields, the blowholes and the slowest island in Polynesia. This is the length the country is actually shaped for – and the crossing is the one piece of logistics most itineraries get wrong."],
  ["Two weeks", "A slower version of the week, plus the trips this route deliberately leaves out – Manono island, the climb to Mount Silisili, even the hop to American Samoa. A different holiday, not a longer day."],
];

const REGIONS = [
  {
    name: "The beaches",
    image: lagoonShallows,
    alt: "Clear turquoise shallows off a Samoan beach, fales along the shore",
    body: "Samoa's sand is the South Pacific postcard without the resort wall in front of it: long white crescents backed by village greens, open-sided fales instead of sunbeds, and an island or two on the horizon. The famous stretch faces sunrise in the south-east, and most mornings you will share it with more dogs than people.",
  },
  {
    name: "The waterfalls",
    image: sopoagaFallsGorge,
    alt: "Sopo'aga Falls dropping into a green jungle gorge on Upolu",
    body: "Upolu's volcanic interior throws rivers off its edges everywhere: garden lookouts over hundred-metre ribbons, roadside gorges, and falls you swim beneath. Nearly every one sits on family land with a small gate and a big welcome – the custom is part of the visit, not an obstacle to it.",
  },
  {
    name: "The lagoon",
    image: toSuaOceanTrench,
    alt: "To-Sua Ocean Trench from the rim, the ladder down to swimmers in the green pool",
    body: "The swimming here is the quiet headline: a sinkhole you descend into by ladder, giant clams below a village flag, wild turtles grazing seagrass in waist-deep water, and a blue hole on the capital's own doorstep. None of it needs a boat, a tank or a tour – a mask and the tide table are the whole kit.",
  },
  {
    name: "Savai'i",
    image: muPagoaFalls,
    alt: "Mu Pagoa falls dropping over the lava edge into the sea on Savai'i",
    body: "The bigger, emptier island across the strait, and the reason to take the full week: a coast of black lava where the sea fires through blowholes, a church buried to its windows by the 1905 eruption, and villages living the fa'a Samoa with almost no tourism around them. Fewer visitors cross than you would believe.",
  },
];

/* Trip photos, roughly in trip order: Upolu first, then the Savai'i day, then the west. */
const CAROUSEL = [
  { image: sopoagaFallsSign, alt: "Two travellers at the Sopo'aga Falls sign above the gorge", caption: "Sopo'aga Falls" },
  { image: southEastCoastBeach, alt: "An empty white-sand beach on Upolu's south-east coast, green cliffs behind and an island offshore", caption: "The south-east coast" },
  { image: coconutPalms, alt: "A coconut grove over a village green on Upolu", caption: "Village palms, Upolu" },
  { image: palmIsletAtDusk, alt: "A tiny palm islet just offshore in evening light", caption: "An islet at dusk" },
  { image: sunsetOverTheSea, alt: "Sunset over the sea from Upolu's coast", caption: "South-coast sunset" },
  { image: fishingBoatsSavaii, alt: "Fishing boats moored in the harbour on Savai'i", caption: "The Savai'i wharf" },
  { image: tagaLavaShelf, alt: "Black lava shelf running to the sea at Taga on Savai'i", caption: "The lava shelf at Taga" },
  { image: alofaagaBlowhole, alt: "An Alofaaga blowhole firing seawater high above the lava shelf, a person tiny beside it", caption: "The Alofaaga blowholes" },
  { image: afuAauFalls, alt: "Twin falls into the green swimming pool at Afu Aau", caption: "Afu Aau falls, Savai'i" },
  { image: ladySamoaBus, alt: "A yellow Lady Samoa wooden island bus parked under palms", caption: "An island bus" },
  { image: villageRoad, alt: "A sealed village road through green gardens on Upolu", caption: "A village road" },
  { image: beachFalePavilion, alt: "A thatched beach fale on white sand", caption: "A beach fale" },
  { image: rainforestRidge, alt: "Rainforest ridges in Upolu's interior", caption: "The green interior" },
  { image: newYearResortPool, alt: "A resort pool under palms at night", caption: "New Year's Eve, first in the world" },
];

// Deliberately no tier totals here (§8). The guide costs all three levels out
// line by line; a free page that publishes totals anchors the reader on a big
// number before they know what is optional inside it.
const COSTS = [
  ["Lean", "Beach fales with dinner and breakfast folded in, market lunches, and every sight still on the route – the swims and waterfalls barely register on any budget"],
  ["Core", "The route as written: proper hotel beds each night, restaurant dinners, and the crossings done the comfortable way"],
  ["Splurge", "Over-water dinners, the island resort, and villas on the lagoon – Samoa's top end is small, and it books out first"],
];

const TIPS = [
  ["Plan the week around Sunday, not the weather.", "Sunday is the structural fact of a Samoan week: shops shut, kitchens thin out, and the villages turn to church and the long to'ona'i lunch. It is one of the most beautiful things about the country – white-dressed congregations, singing you can hear from the road – and a terrible day for errands. The guide plans the whole week so Sunday lands where it does no harm."],
  ["Decide about Savai'i before you book anything.", "The second island is the fork in the whole trip: skip it and five days is enough; take it and the week needs to be built around the crossing, which is exactly the piece most itineraries fumble. Decide first, then book – not the other way round."],
  ["Treat the village gates as the system working.", "Nearly every fall, pool and beach sits on customary family land, and the small cash gate fee is the legitimate custom that keeps it open, mowed and welcoming – not a scam, however a review site frames it. Budget for the custom, carry small notes, and pay it cheerfully."],
];

const FAQ = [
  ["Is Samoa worth visiting?", "Yes – emphatically, and it is strange how few people go. Samoa is the South Pacific with its culture intact: a sinkhole you swim inside, waterfalls off every road, wild turtles in waist-deep water, black lava coasts, and villages that run on custom rather than tourism. It costs less than Fiji or French Polynesia once you are there, and outside the holiday weeks you will have most of it nearly to yourself."],
  ["How many days do you need in Samoa?", "A week, if Samoa is the destination rather than a stopover – that covers both islands at the pace the country moves at. Five days does Upolu properly and skips the ferry entirely. Fewer than four short-changes the flights: they land in the small hours, so a first night is always spent arriving."],
  ["Samoa or Fiji – which is better?", "Different trips. Fiji is the islands-and-resorts holiday: hundreds of islands, dive boats, island-hopping passes. Samoa is two big islands you drive yourself – waterfalls, reef swims and living villages, with tourism a footnote rather than the economy. If you want a resort and a boat schedule, take Fiji; if you want one rental car, one culture and no crowds, Samoa is the better week."],
  ["Do you need to visit both Upolu and Savai'i?", "Upolu alone is a genuinely good five days – To-Sua, the falls and the beaches are all there. But Savai'i is the older, emptier Samoa, with the lava fields and the blowholes, and it is the difference between visiting a country and visiting its main island. The catch is the strait between them: the crossing is the one piece of logistics most itineraries get wrong, and doing it the clever way is a fair chunk of what the guide is for."],
  ["When is the best time to visit Samoa?", "May to October, the dry season. June to August is busiest; May and September give the same weather more quietly. November to April is the wet and cyclone season – often still lovely, genuinely riskier. December and January are their own thing: peak prices and full boats, but Samoa at its most alive."],
  ["Is Samoa safe?", "Yes – serious crime against visitors is rare, and the welcome is real. The hazards are practical instead: unlit roads and free-roaming dogs after dark (night falls fast year-round, so days end early by design), strong sun, dengue mosquitoes at dusk, and tap water that wants filtering. Respect village custom – cover shoulders and knees away from the beach, and pause if a village is holding its evening prayer."],
  ["Can you drive in Samoa?", "Yes, and it is the way to see the islands: sealed coastal roads, low speed limits, and no traffic to speak of outside Apia. Samoa drives on the LEFT – it switched sides in 2009 – and pigs, dogs and children share every village road, so the pace is gentle by design. The buses are beautiful and not a plan: they run to market in the morning and back after lunch, and that is roughly the whole timetable."],
  ["What is To-Sua Ocean Trench?", "Samoa's signature swim: a collapsed lava tube thirty metres deep, ringed by gardens, with a ladder down into a green seawater pool the ocean feeds from below. It is on every list for a reason, and it rewards arriving before the day-trip vans – the guide builds its day around exactly that."],
  ["What happens in Samoa on Sundays?", "Most of the country closes: shops shut, many sights and kitchens rest, and the villages spend the day at church and the to'ona'i family lunch. It is Samoa at its most Samoan, and the day most itineraries break on. Plan the week so Sunday is a beach or pool day, never the errands day – the guide's whole seven days are arranged around it."],
  ["Is Samoa expensive to visit?", "The trip itself is reasonable once the long-haul flights are paid. Getting around – the rental car for the week, its fuel, and the inter-island crossing with Savai'i's driving done for you – comes to about €130 per person for two sharing, and most of what you come for is free or nearly so. That €130 is what moving around costs, not what the trip costs: the real range sits in the beds, from open-sided beach fales to lagoon villas, and that choice is yours. The guide prices the whole week at three honest levels, line by line."],
  ["Is American Samoa the same country?", "No – it is a separate US territory an hour's flight east, with different money, different entry rules and a different feel. The independent state of Samoa (these two islands) is the one this page is about. If you are curious anyway, it makes a genuine side trip – but it is a different trip, not a day out."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchSamoaContent() {
  try {
    return await client.fetch(
      `{
        "guide": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "samoa" && (language == "en" || !defined(language))][0]{
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "samoa" && (language == "en" || !defined(language))] | order(publishedDate desc){
          title, "slug": slug.current, subtitle, heroImage
        }
      }`,
    );
  } catch {
    return { guide: null, stories: [] };
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

export default async function SamoaDestinationPage() {
  const { guide, stories } = await fetchSamoaContent();
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Samoa: how many days you need, and which islands to pick",
        description:
          "Whether Samoa is worth the trip, how many days you need, Upolu vs Savai'i, when to go and what it costs.",
        datePublished: "2026-08-15",
        dateModified: "2026-08-15",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Samoa" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/samoa",
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
        <span className="text-slate-600">Samoa</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Oceania · Polynesia
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Samoa
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, and which islands to pick – two islands, one
          rental car, and a week where Sunday matters more than the weather.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={founderAtSopoaga}
              alt="The founder at the Sopo'aga Falls lookout, the fall dropping into its jungle gorge behind"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Samoa worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Samoa is what people imagine when they say the South Pacific,
                minus the crowds that usually come with it: two big green
                volcanic islands, white-sand villages, waterfalls off every
                road, and a lagoon you can swim in almost anywhere. It gets a
                fraction of Fiji's visitors because it has a fraction of
                Fiji's resorts – which is precisely the appeal. Tourism here
                is a guest of village life, not the other way round.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: descend a ladder into To-Sua, a
                thirty-metre sinkhole the ocean fills through the lava; swim
                beneath waterfalls and over giant clams; share waist-deep
                water with wild turtles; watch the sea fire through blowholes
                on Savai'i's black coast; and drive quiet coastal roads
                between villages where every church is painted and every
                green is mowed. Apia, the small capital, holds the markets,
                the cathedral and the harbour – a morning's pleasure, not the
                point of the trip.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two honest caveats. This is a self-drive, cash-carrying,
                village-custom country – if you want a resort where everything
                is arranged and billed to the room, Fiji does that better.
                And the week has a rhythm you must plan with rather than
                against: Sunday closes nearly everything, and night falls
                fast all year on unlit roads, so days end early by design.
                Work with both and Samoa is one of the easiest wonderful
                trips in the Pacific.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Samoa is warm and humid all year – the real seasons are wet
                and dry, and the dry one (May to October) is the answer for
                this trip.
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
              <p className="text-[15px] leading-relaxed text-slate-700">
                Whatever the month, the calendar that actually shapes the
                week is the week itself: Sunday closes most of the country
                for church and the long to'ona'i lunch, and the ferry runs a
                skeleton that day. A good Samoa itinerary is built around
                that fact – the guide's seven days are.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>How long to stay</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest spread runs from a stopover to two weeks, and the
                decision inside it is really one question: are you crossing
                to Savai'i or not?
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
                  is the week done for you: all seven days hour by hour, the
                  ferry crossed the clever way, and every booking in the
                  order it has to be made.
                </p>
              ) : null}
            </section>

            <section className="space-y-6">
              <SectionHeading>The islands, by what you came for</SectionHeading>
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
                Everything lands at Faleolo, on Upolu's north-west coast, and
                the long-haul routes run through Auckland, Fiji and Australia.
                Two facts shape the plan more than the fares: the main flights
                land in the small hours, so the first night is spent arriving
                – and not every route flies every day, so the trip's start day
                is chosen for you more than most places. Entry is visa-free
                for EU, UK, US, NZ and Australian passports.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, Samoa is a self-drive country: sealed coast
                roads, gentle speed limits, and a rental 2WD is all the route
                needs. It drives on the left – it famously switched sides in
                2009 – and village roads are shared with pigs, dogs and
                children, so the pace is slow on purpose. The wooden island
                buses are wonderful to look at and not a transport plan.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Between the islands runs the ferry across the Apolima Strait –
                the one piece of Samoan logistics with real teeth. Its
                timetable is published monthly and marked tentative, Sundays
                run a skeleton service, and holiday sailings fill. There is a
                clever way to cross that most itineraries miss entirely; it is
                the spine of the guide's Savai'i days, and the single best
                reason to take tested information along.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Once the long-haul flights are paid, Samoa is one of the
                Pacific's reasonable trips – it is the getting there that
                costs, not the being there. For two people sharing, moving
                around for the whole week – the rental car and its fuel, plus
                the inter-island crossing with Savai'i's driving done for you
                – comes to about €130 per person. That is what getting around
                costs, not what the trip costs; nearly everything you come
                for is free or a small village gate fee, and the real money
                sits in one decision:
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
                The bed is the line with all the range – everything from an
                open-sided fale on the sand to a villa over the lagoon – and
                holiday-season December and January move every rate up.
                Figures here assume the dry season, two sharing.
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
                  costs the whole week out at all three levels, line by line –
                  fifteen hotels in bands across both islands, every activity
                  per person, the car, the ferry and the taxi against the real
                  distances – so you can set the trip at the level you want
                  instead of guessing.
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
                src={beachFalesWhiteSand}
                alt="White sand, a young palm and open beach fales on a Samoan beach, swimmers in the turquoise shallows"
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

            {guide ? (
              <section className="space-y-4">
                <SectionHeading>Guides for this destination</SectionHeading>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row"
                >
                  {storyImage(guide.heroImage) ? (
                    <img
                      src={storyImage(guide.heroImage)}
                      alt={guide.title}
                      className="aspect-[4/3] w-full object-cover sm:w-64"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="font-serif text-xl leading-snug text-brand-ink group-hover:text-slate-700">
                      {guide.title}
                    </p>
                    <p className="text-[14px] leading-relaxed text-slate-700">
                      Everything this page deliberately leaves out: all seven
                      days hour by hour, the ferry crossed the clever way with
                      every step of it worked out, fifteen hotels and nine
                      restaurants each with a QR link, a three-tier budget line
                      by line, and the companion Google map with every pin.
                    </p>
                    <p className="mt-auto pt-2 text-sm font-semibold text-slate-900">
                      {guide.durationDisplay}
                      {guidePrice ? ` · €${guidePrice.amount}` : ""}
                    </p>
                  </div>
                </Link>
              </section>
            ) : null}

            {stories?.length ? (
              <section className="space-y-4">
                <SectionHeading>Stories from Samoa</SectionHeading>
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

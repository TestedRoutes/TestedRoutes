import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import dakarFromMonument from "../../../../content/countries/senegal/destination/generated/web/dakar-from-renaissance-monument.jpg";
import beachWalkDakarCoast from "../../../../content/countries/senegal/destination/generated/web/beach-walk-dakar-coast.jpg";
import colonialBalconiesSaintLouis from "../../../../content/countries/senegal/destination/generated/web/colonial-balconies-saint-louis.jpg";
import pontFaidherbeSaintLouis from "../../../../content/countries/senegal/destination/generated/web/pont-faidherbe-saint-louis.jpg";
import dakarRooftopsFromTheHill from "../../../../content/countries/senegal/destination/generated/web/dakar-rooftops-from-the-hill.jpg";
import africanRenaissanceMonument from "../../../../content/countries/senegal/destination/generated/web/african-renaissance-monument.jpg";
import mosqueeDeLaDivinite from "../../../../content/countries/senegal/destination/generated/web/mosquee-de-la-divinite.jpg";
import fishingPiroguesDakarBeach from "../../../../content/countries/senegal/destination/generated/web/fishing-pirogues-dakar-beach.jpg";
import lacRosePiroguesMoored from "../../../../content/countries/senegal/destination/generated/web/lac-rose-pirogues-moored.jpg";
import lacRoseShore from "../../../../content/countries/senegal/destination/generated/web/lac-rose-shore.jpg";
import roadsideBaobab from "../../../../content/countries/senegal/destination/generated/web/roadside-baobab.jpg";
import villageStreetMarket from "../../../../content/countries/senegal/destination/generated/web/village-street-market.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Senegal is worth it, whether it is safe, how long, when. Everything
 * operational (border paperwork mechanics and who to send documents to, ferry
 * booking, fares, named beds and restaurants, within-day sequencing) belongs
 * to the two planned guide SKUs and is deliberately absent. The only
 * execution-flavoured facts here are ones a published inspire story already
 * gives away: the lake's colour, the Goree ferry queue we abandoned, the
 * temporary-import paper at Diama, and the uneventful Casamance crossing.
 * NOTE: no Senegal guide SKU is live yet (a 7-day Senegal and a 7-day Senegal
 * & Gambia are planned), so no answer may say "the guide carries X" -
 * mechanics are asserted to exist, unreferenced. When the SKUs publish, do a
 * pointer pass over the FAQ and the how-long section. The test before any
 * edit: could a reader run a day of this trip from this page? If yes, cut
 * until they cannot.
 */

export const metadata = {
  title:
    "Senegal: is it safe, is it worth visiting, and how many days you need · TestedRoutes",
  description:
    "Whether Senegal is safe, whether it is worth it, how long to stay and when to go – Dakar, the colonial north, Casamance, and the pink lake that is not always pink.",
  alternates: { canonical: "/destinations/senegal" },
  openGraph: {
    type: "article",
    url: "/destinations/senegal",
    title: "Senegal: is it safe, is it worth visiting, and how many days you need",
    description:
      "Dakar and its monument, colonial Saint-Louis on its river island, baobab country and the lake famous for a colour it does not always have.",
  },
};

const WHEN_TO_GO = [
  ["November to February", "The season, and it is not close. Dry, warm days and cool nights, the coast at its best and the roads at their easiest. It is also when the lake stands its best chance of showing colour, because the pink depends on the water staying salty."],
  ["March to June", "Hotter every week, and dusty. Still workable – we crossed at the end of May and drove the whole country without weather ever being the problem – but the middle of the day starts making the decisions for you."],
  ["July to October", "The rains. Green, dramatic, far fewer visitors, and the season when unpaved side roads turn unreliable. The coast still works; the deeper you go, the more the sky sets the schedule."],
  ["A date to know about", "Dakar hosts the Youth Olympic Games from 31 October to 13 November 2026, across Dakar, Diamniadio and Saly. Expect beds and flights around those dates to price and fill like a different country. Go then for the atmosphere, or deliberately avoid the fortnight – either is a good decision, but make it on purpose."],
  ["What I would pick", "Late November or early December: the dry season open, the heat gone, and the Youth Olympic surge behind you. If I wanted it cheaper and emptier I would take late June and accept hot middays and a real chance of early rain – the trip still works, you just start earlier and rest at noon."],
];

const HOW_LONG = [
  ["Three or four days", "Dakar and its edges: the monument, the coast road, the markets, and the lake north of the city. Enough to like the place and to see why the capital is not the whole story – not enough to leave it."],
  ["A week", "The trip most people should take: Dakar, north to Saint-Louis for the colonial river island, the lake, and the baobab country running south. It is the length the country is shaped for, and the one we would build a guide around."],
  ["Two weeks", "Senegal plus The Gambia, the way we drove it – a second country inside one trip, the river crossing that joins them, and the road south into Casamance. More borders, more paperwork, and a genuinely different holiday from the week-long version."],
];

const REGIONS = [
  {
    name: "Dakar and Cap-Vert",
    image: dakarRooftopsFromTheHill,
    alt: "Dakar's low rooftops spreading below the hill of the African Renaissance Monument",
    body: "The capital sits on a peninsula that runs further west than anywhere else on the continent, and it is loud, hot and immediately likeable. The African Renaissance Monument stands above it all and can be climbed from the inside; the coast below carries fishing beaches, a mosque built almost in the Atlantic, and the ferry pier for Gorée. It is a city to give a full day, not an afternoon on the way somewhere.",
  },
  {
    name: "Saint-Louis and the north",
    image: colonialBalconiesSaintLouis,
    alt: "A row of balconied colonial buildings with peeling paint on the island of Saint-Louis",
    body: "The old French colonial capital sits on a narrow island in the Senegal River, reached over an iron bridge, and it wears its history on its facades – balconies, shutters, paint that gave up decades ago. After the desert to the north it feels like an easy town, and that is the point. Restaurants, an evening walk, and the river on both sides of you.",
  },
  {
    name: "The lake and the coast north of Dakar",
    image: lacRosePiroguesMoored,
    alt: "Painted pirogues moored along the shallow shore of Lac Rose near Dakar",
    body: "Lac Rose – Lake Retba – is the famous one, a shallow salt lake ringed with souvenir stalls and wooden boats, and the reason most itineraries come north out of the city. Whether it is pink when you arrive is a separate question, and one worth checking before you drive out. The coast either side of it is working shoreline: salt, fishing and long empty sand.",
  },
  {
    name: "The road south",
    image: villageStreetMarket,
    alt: "A village street market beside the road in southern Senegal, stalls and traffic",
    body: "South of Dakar the country flattens into the Senegal everyone pictures: single-lane tarmac, roadside markets, and baobabs standing alone in dry fields with the road bending around them. This is where most of the driving happens on a longer trip, and where the trip stops being about sights and starts being about the country between them.",
  },
];

/* Trip photos, roughly north to south: the river island, the capital, the lake, the road. */
const CAROUSEL = [
  { image: pontFaidherbeSaintLouis, alt: "The iron Pont Faidherbe crossing the Senegal River at Saint-Louis", caption: "The bridge onto the island, Saint-Louis" },
  { image: colonialBalconiesSaintLouis, alt: "Balconied colonial buildings on the island of Saint-Louis", caption: "Saint-Louis wears its history" },
  { image: africanRenaissanceMonument, alt: "The bronze African Renaissance Monument above Dakar with visitors on the steps", caption: "The African Renaissance Monument, Dakar" },
  { image: dakarRooftopsFromTheHill, alt: "Dakar spreading below the hill, seen from the monument", caption: "Dakar from the hill" },
  { image: mosqueeDeLaDivinite, alt: "The white twin-minaret Mosquee de la Divinite at the edge of the Atlantic below the Mamelles", caption: "Mosquee de la Divinite, seen from above" },
  { image: fishingPiroguesDakarBeach, alt: "Painted fishing pirogues drawn up on a beach in Dakar", caption: "The working shore, Dakar" },
  { image: beachWalkDakarCoast, alt: "Two travellers walking a sandy beach on the Dakar coast", caption: "The coast below the city" },
  { image: lacRosePiroguesMoored, alt: "Painted pirogues moored at the shallow edge of Lac Rose", caption: "Lac Rose, the boats" },
  { image: lacRoseShore, alt: "The pale shallow shore of Lac Rose under a flat sky", caption: "The far shore of the lake" },
  { image: roadsideBaobab, alt: "A large baobab standing beside the tarmac road in southern Senegal", caption: "Baobab country, on the road south" },
  { image: villageStreetMarket, alt: "A busy village street market beside the main road in Senegal", caption: "The road is the market" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Small guesthouses, eating where the taxis stop, shared transport between towns, and the sights that cost nothing – which along this coast is most of them"],
  ["Core", "Decent guesthouses and small hotels, a hired car or a driver for the days that need one, and the paid visits taken without thinking about it"],
  ["Splurge", "Senegal does sell comfort, mostly on the coast south of Dakar: resort beds, a private driver, and somebody else handling the logistics. It buys ease rather than access – the country itself is the same either way"],
];

const TIPS = [
  ["Check the lake's colour before you drive out to it.", "Lac Rose is sold everywhere on its pink, and the pink is not permanent – it depends on the water staying extremely salty, and flooding has knocked it out for long stretches. When we went it was green, and no angle or boat ride changed that. Look for a photograph taken in the last week or two, not the one on the poster, and decide with that in front of you."],
  ["Gorée has a queue, and the queue is the trip.", "The island is the thing everyone puts first, and the only way over is the ferry. We joined the line and stood in it for two hours without getting aboard, then gave the afternoon back to the city. It is not a stop to slot in between two other plans – give it its own half-day, early, or accept that it may not happen."],
  ["Bring the paperwork for the car, and expect it to take a while.", "If you are driving in rather than flying, the vehicle paperwork is the part that eats the day, not the passport stamp – and once you have it, keep it: it gets asked for again on the road and at the next border. Every land crossing we used ran on human time rather than posted opening hours."],
  ["Read the advisory for the south, then read what it actually says.", "Casamance, the strip below The Gambia, carries warnings that the rest of the country does not, and they are worth respecting. What they describe is a region with a long-running local conflict, not a closed road: we crossed it on the main road in daylight and nothing happened. Check your government's current advice before you plan around it either way."],
];

const FAQ = [
  ["Is Senegal safe to visit?", "For most of the country, yes – Senegal is one of the more relaxed places to travel in West Africa, and Western governments treat it that way, with normal-precautions advice for the bulk of it. The exception is Casamance in the south, below The Gambia, where a long-running separatist conflict keeps a stay-on-main-roads warning attached. We drove the coast, the capital, the north and the Casamance road, and the risks we actually managed day to day were traffic and heat. Read your own government's current advice before booking, and let it outrank this page."],
  ["Is Senegal worth visiting?", "Yes, and it is an easier yes than most of the countries around it. You get a capital with real weight to it, a colonial river island in the north, an Atlantic coastline that works for fishing towns and resorts alike, and baobab country in between – with infrastructure that mostly does what it says. It is not an untouched-frontier destination and it does not pretend to be. It is the West African country to choose first."],
  ["How many days do you need in Senegal?", "A week is the right answer: Dakar, north to Saint-Louis, the lake, and the road south. Three or four days covers the capital and its edges honestly but leaves the country unvisited. Two weeks lets you add The Gambia and the drive into Casamance, which is a different and more demanding trip. The country scales cleanly – the only thing that does not compress is the driving."],
  ["When is the best time to visit Senegal?", "November to February. Dry, warm, cool at night, and the season when everything from the coast to the interior roads is at its easiest. March to June gets progressively hotter, and July to October is the rainy season – greener and quieter, with unpaved roads that stop being predictable. One date to note: Dakar hosts the Youth Olympic Games from 31 October to 13 November 2026, which will move prices and availability across Dakar, Diamniadio and Saly."],
  ["Is Lac Rose still pink?", "Not reliably, and it was not pink when we stood on its shore – it was green. The colour comes from algae that need extremely salty water, and flooding diluted the lake badly enough to switch the pink off for a long period; reports since say some of it returns in the dry months. It remains a pleasant enough afternoon with boats and souvenir markets, but go because you want to see the lake, not because you are promised a colour. Check a recent photograph before you commit the drive."],
  ["Is Gorée Island worth visiting?", "We cannot tell you from the island itself – and that is the honest answer. Gorée is the sight every list puts first, a short ferry from Dakar and a place of real historical weight. We queued two hours for that ferry on an ordinary weekday in late May, never got aboard, and spent the afternoon back in the city instead. So take this as the one thing we can prove: the queue is real and it can eat a half-day. If Gorée matters to you, build the day around it rather than fitting it in."],
  ["Is Dakar worth visiting?", "Yes, and it deserves a full day rather than an airport transfer. The African Renaissance Monument is the anchor – you can go up inside it, and the view over the peninsula is the reason to, though the interior is visibly neglected and does not feel especially cared for. Beyond it there is the coast road, a mosque standing almost in the Atlantic, markets, and the ferry pier for Gorée. It is a working capital rather than a pretty one, and it is better for that."],
  ["Is Casamance safe?", "It carries the warnings the rest of Senegal does not, and those warnings are about a long-running local conflict rather than a closed region. We drove across it on the main road in daylight to collect a visa in Ziguinchor, and nothing happened – ordinary traffic, road construction, villages. That is one uneventful crossing and it should be weighed as exactly that. Stay on the main roads, travel in daylight, and read your government's current advice before you plan the leg."],
  ["Senegal or The Gambia?", "Senegal if you are choosing one: it is bigger, more varied, and holds the capital, the colonial north and the coast. The Gambia is a narrow country along its river, easy to reach, and strong on birdlife, river trips and beach resorts. The more interesting answer is both – they share a border you can drive, and the two tourism boards now actively sell the combination. We did it in one trip, and the river crossing between them is genuinely part of the experience."],
  ["Do you need a visa for Senegal?", "Most Western passports do not need one for a short tourist stay – you arrive and get stamped. Rules change, so verify against an official source close to your travel date rather than a forum thread. If you are bringing a vehicle rather than flying, the car's paperwork is a separate and much slower process from your own."],
  ["Is Senegal expensive?", "Getting there is the line that matters: return flights from western Europe run about €400 when booked ahead, and that is the figure to plan around. On the ground it is inexpensive by European standards – simple beds and food cost little, transport is cheap, and most of what you came to look at is free. The coast south of Dakar is where the money can go if you want it to, because that is where the resorts are."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Senegal guide SKU is live yet (a 7-day Senegal and a 7-day Senegal &
// Gambia are planned). The fetch takes all guides so each future SKU appears
// as its own card with no code change; until then the guide sections and the
// BuyBox simply do not render.
const GUIDE_BLURBS = {};

async function fetchSenegalContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "senegal" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "senegal" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function SenegalDestinationPage() {
  const { guides, stories } = await fetchSenegalContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Senegal: is it safe, is it worth visiting, and how many days you need",
        description:
          "Whether Senegal is safe, whether it is worth it, how long to stay and when to go – Dakar, the colonial north, Casamance, and the pink lake that is not always pink.",
        datePublished: "2026-09-02",
        dateModified: "2026-09-02",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Senegal" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/senegal",
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
        <span className="text-slate-600">Senegal</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North & West Africa · The Atlantic coast
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Senegal
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it safe, is it worth it, and how long you need – for Dakar, the
          colonial river island in the north, and the lake that is not always
          pink.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={dakarFromMonument}
              alt="Dakar spreading below the hill of the African Renaissance Monument, Senegal"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Senegal worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                We arrived in Senegal out of Mauritania, after a week of desert
                and a border crossing that took most of a day, and the change
                was immediate: trees, traffic, restaurants, a country that felt
                like it had somewhere to be. That contrast probably flatters it.
                It also explains why Senegal is the West African country to
                choose first – it gives you the region without asking for the
                same tolerance the countries around it do.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: give Dakar a full day and climb inside the
                monument standing over it; drive north to Saint-Louis and walk a
                colonial island at dusk with the river on both sides; go out to
                the salt lake north of the capital and see what colour it is
                that week; and then drive – past baobabs standing alone in dry
                fields, through villages where the market has spilled onto the
                tarmac. The famous island of Gorée sits off Dakar, and getting
                onto its ferry is a real part of the plan rather than a
                formality.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats: the headline sights are fewer than the
                brochures suggest, and one of the most famous – the pink lake –
                may not be pink at all. Dakar is hot, loud and not built to
                charm you. The south carries travel advisories the rest of the
                country does not. And the distances are real: on a week-long
                trip, a good share of the days are driving days. None of that is
                a reason to skip it. It is a reason to arrive expecting a
                country rather than a set of photographs.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The dry season is the answer, and the only complication in the
                near term is a fortnight of sport in the capital.
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
                Senegal scales cleanly around its driving: the capital is the
                core, the north is the reason to stretch to a week, and adding
                The Gambia turns it into a two-country trip.
              </p>
              <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
                <div className="divide-y divide-slate-100">
                  {HOW_LONG.map(([label, text]) => (
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
              <SectionHeading>The regions</SectionHeading>
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
                Casamance, the green strip south of The Gambia, is the region
                this page cannot show you: we drove its main road to reach
                Guinea-Bissau and photographed almost none of it. It is the part
                of Senegal that carries travel advisories, and the part with a
                coastline people go out of their way for.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Dakar – Blaise Diagne is the main international airport
                and one of the better-connected in West Africa, with direct
                routes from several European cities. Overland, Senegal sits
                between Mauritania in the north and The Gambia and Guinea-Bissau
                in the south, and all three borders are drivable; that is how we
                arrived and left. Most Western passports need no visa for a
                short tourist stay, but verify close to travel.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground the main roads are properly surfaced and ordinary
                cars manage them without drama – this is not a country that
                demands a 4x4. What it demands is time: the distances between
                Dakar, Saint-Louis and the south are long enough that a week-long
                trip spends real days behind the windscreen. Shared taxis and
                buses cover the same routes cheaply if you would rather not
                drive.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two things worth knowing before you go. If you bring your own
                vehicle across a land border, the car's paperwork is slower and
                more expensive than your own entry, and you will be asked for it
                again on the road. And the ferry to Gorée is the one piece of
                transport in the country that can quietly cost you an afternoon –
                treat it as a plan, not a detail.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the unavoidable line: return flights from
                western Europe run about €400 booked ahead. That is what reaching
                Senegal costs, not what the trip costs – on the ground this is an
                inexpensive country, and most of what you came for is free to
                stand in front of. The rest is a choice about how you sleep and
                move:
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
                The line with real range is the bed, and it swings hardest on the
                coast south of the capital, where the resorts are. Everywhere
                else the beds are modest and priced accordingly. Transport is
                cheap however you take it; the thing that costs you on this trip
                is time, not money.
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
                src={beachWalkDakarCoast}
                alt="Walking a sandy beach on the Dakar coast, Senegal, with palms behind"
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
                <SectionHeading>Stories from Senegal</SectionHeading>
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

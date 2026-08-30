import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";

import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

/* Fixed page slots: hero, one card per island, mid-page banner. */
import sourceDargentFromWater from "../../../../content/countries/seychelles/destination/generated/web/source-dargent-from-water.jpg";
import maheHikeView from "../../../../content/countries/seychelles/destination/generated/web/mahe-hike-view.jpg";
import anseGeorgetteSunset from "../../../../content/countries/seychelles/destination/generated/web/anse-georgette-sunset.jpg";
import sourceDargentSunrise from "../../../../content/countries/seychelles/destination/generated/web/source-dargent-sunrise.jpg";
import curieuseTortoises from "../../../../content/countries/seychelles/destination/generated/web/curieuse-tortoises.jpg";
import rafflesPool from "../../../../content/countries/seychelles/destination/generated/web/raffles-pool.jpg";

/* Carousel — the rest of the trip, in island order. */
import beauVallon from "../../../../content/countries/seychelles/destination/generated/web/beau-vallon.jpg";
import gardenHillPool from "../../../../content/countries/seychelles/destination/generated/web/garden-hill-pool.jpg";
import anseMajorTrail from "../../../../content/countries/seychelles/destination/generated/web/anse-major-trail.jpg";
import anseLazioRocks from "../../../../content/countries/seychelles/destination/generated/web/anse-lazio-rocks.jpg";
import anseGeorgetteDay from "../../../../content/countries/seychelles/destination/generated/web/anse-georgette-day.jpg";
import anseGeorgetteHandstand from "../../../../content/countries/seychelles/destination/generated/web/anse-georgette-handstand.jpg";
import rafflesTortoises from "../../../../content/countries/seychelles/destination/generated/web/raffles-tortoises.jpg";
import stPierreIsland from "../../../../content/countries/seychelles/destination/generated/web/st-pierre-island.jpg";
import sourceDargentSunset from "../../../../content/countries/seychelles/destination/generated/web/source-dargent-sunset.jpg";
import ansePierrot from "../../../../content/countries/seychelles/destination/generated/web/anse-pierrot.jpg";
import sourceDargentKayak from "../../../../content/countries/seychelles/destination/generated/web/source-dargent-kayak.jpg";
import batCurry from "../../../../content/countries/seychelles/destination/generated/web/bat-curry.jpg";

/* Scope note (destination playbook §7): this page sells the DECISION — whether
   to go, how long, when — and stops there. Execution stays in the paid guide:
   no venue fares or entry fees, no timing rules, no booking mechanics or
   within-day sequencing, and exactly ONE currency figure on the whole page
   (the unavoidable inter-island ferry total; the SKU price rendered from
   Sanity is the sanctioned second). This hub predates §7 and was audited and
   cut against it on 2026-08-30 — do not reintroduce helpful specifics here;
   they are what the guide sells. */
export const metadata = {
  title: "Seychelles: what to actually do, and how long you need · TestedRoutes",
  description:
    "I spent a week across four Seychelles islands. What is worth your time, how many days you need, when to go, what it costs, and the things I would do differently.",
  alternates: { canonical: "/destinations/seychelles" },
  openGraph: {
    type: "article",
    url: "/destinations/seychelles",
    title: "Seychelles: what to actually do, and how long you need",
    description:
      "Seven days across four Seychelles islands: what is worth your time, how long to stay, when to go, what it costs.",
  },
};

const WHEN_TO_GO = [
  ["May to October", "The reliable choice. Southeast trade winds, less rain. Some east-facing beaches collect seaweed."],
  ["November to April", "Northwest winds, hotter, wetter, but calmer water on the east side and better snorkelling visibility in places."],
  ["July and August", "The peak. Everything books out earlier and the famous beaches fill fastest."],
  ["What I would pick", "Late May, or September. Peak-season weather without peak-season prices and queues."],
];

const HOW_LONG = [
  ["Five days, four nights", "One island, probably Mahé or Praslin, plus one boat day. You will see good beaches and miss the country."],
  ["Seven days, seven nights", "The sweet spot, and what I would recommend to almost anyone. Enough for three islands plus a boat day to Curieuse, with each island given long enough to become itself rather than a stop."],
  ["Ten to twelve days", "Add the bird islands, or simply slow down further and spend more time doing nothing, which Seychelles rewards."],
];

const ISLANDS = [
  {
    name: "Mahé",
    image: maheHikeView,
    alt: "Green ridges dropping to a sheltered cove on the coast of Mahé, Seychelles",
    body: "The main island and the only one with an international airport. Mountainous, green, and much bigger than people expect, with a road over the interior that climbs through cloud forest into viewpoints over the whole inner island chain. Good for the first and last days: a coastal trail to a cove with no road access, a proper capital with a spice market, and beaches that are quieter than the famous names elsewhere. Rent a car here. You will want it.",
  },
  {
    name: "Praslin",
    image: anseGeorgetteSunset,
    alt: "Sunset over the water and granite boulders at Anse Georgette, Praslin, Seychelles",
    body: "Half an hour by fast ferry from Mahé, and the reason most people come is the forest. Vallée de Mai is UNESCO-listed and the only place the coco de mer palm grows wild, producing the largest seed in the plant kingdom. It is also home to the endemic black parrot. The beaches on Praslin are the postcard ones: one of them regularly ranks among the best in the world, another takes some arranging to reach, which is exactly why it stays quiet.",
  },
  {
    name: "La Digue",
    image: sourceDargentSunrise,
    alt: "Granite boulders and a palm above the sand at Anse Source d'Argent, La Digue, Seychelles",
    body: "The smallest of the three main islands, fifteen minutes from Praslin, and the one everybody remembers. It runs on bicycles. There are almost no cars, so the whole island moves at bike speed, and bike speed turns out to be exactly right. Anse Source d'Argent is here, the pink granite boulders you have seen a hundred times without knowing the name. So is the wild eastern side, where the surf comes in hard, the crowds thin out, and the beaches get emptier the further you walk.",
  },
  {
    name: "Curieuse",
    image: curieuseTortoises,
    alt: "Free-roaming giant Aldabra tortoises on Curieuse Island, Seychelles",
    body: "A day trip by boat, not a base. A national park island off Praslin with free-roaming giant Aldabra tortoises, some over a hundred years old, walking around loose on the beach where you land. Mangrove boardwalk across to the far shore, small reef sharks in the shallows, and a barbecue lunch under the trees. It is the one day of the trip where the wildlife, not the beach, is the point.",
  },
];

/* Trip photos in island order: Mahé, Praslin, the boat day, La Digue. */
const CAROUSEL = [
  { image: beauVallon, alt: "Beau Vallon beach and the green ridge behind it, Mahé, Seychelles", caption: "Beau Vallon, Mahé" },
  { image: gardenHillPool, alt: "Infinity pool looking out over Beau Vallon bay and the mountains of Mahé, Seychelles", caption: "Above Beau Vallon, Mahé" },
  { image: anseMajorTrail, alt: "Forested ridges and granite slabs on the Anse Major trail, Mahé, Seychelles", caption: "The Anse Major trail, Mahé" },
  { image: anseLazioRocks, alt: "Granite boulders and overhanging palms at the end of Anse Lazio, Praslin, Seychelles", caption: "Anse Lazio, Praslin" },
  { image: anseGeorgetteDay, alt: "Standing on a rock in the shallows under a high sun at Anse Georgette, Praslin, Seychelles", caption: "Anse Georgette, Praslin" },
  { image: anseGeorgetteHandstand, alt: "A handstand on the sand at sunset beside a Seychelles flag, Anse Georgette, Praslin", caption: "Anse Georgette at sunset" },
  { image: rafflesTortoises, alt: "Two giant Aldabra tortoises feeding on leaves in the shade, Praslin, Seychelles", caption: "Giant tortoises, Praslin" },
  { image: stPierreIsland, alt: "The granite islet of St. Pierre with a boat moored in turquoise water, Seychelles", caption: "St. Pierre, off Praslin" },
  { image: sourceDargentSunset, alt: "Sunset over the sea from the granite shore of Anse Source d'Argent, La Digue, Seychelles", caption: "Source d'Argent at sunset" },
  { image: sourceDargentKayak, alt: "Holding a coconut from a kayak in front of the granite boulders of Source d'Argent, La Digue", caption: "Kayaking Source d'Argent" },
  { image: ansePierrot, alt: "Sitting on granite boulders on the wild coast at Anse Pierrot, La Digue, Seychelles", caption: "Anse Pierrot, La Digue" },
  { image: batCurry, alt: "A plate of fruit bat curry at an outdoor table, Seychelles", caption: "Fruit bat curry, found at last" },
];

/* Levels are DESCRIBED, never priced (playbook §8): the tier bands live in
   the guide's cost breakdown. The page's one allowed figure is the ferry
   total in the section intro. */
const COSTS = [
  ["Lean", "Guesthouses, takeaway lunches, the free beaches, few paid activities"],
  ["Core", "Best-value hotels, mixed meals out, the full activity list, rental cars"],
  ["Splurge", "Top-tier resorts, private pools, helicopter transfers"],
];

const TIPS = [
  ["Set the alarm for Source d'Argent.", "By mid-morning the most photographed beach on earth is full of day-trippers who came over specifically for it. Get there before sunrise and you get four empty coves and the granite turning from grey to gold to pink while you stand in it. We did it two mornings in a row. The first visitors did not appear until nine."],
  ["Ferries, not hotels, are the real constraint.", "Ferry seats, not rooms, are what actually run out in season – I watched people get left standing on the dock. The guide carries the booking order and the deadlines."],
  ["The best food is not in the restaurants.", "The standout meal of the week was a local takeaway counter with thousands of reviews, five minutes by bike, eaten at a shaded table. Fruit bat curry is a real Creole dish and worth chasing, though it took me two days of asking to find a place that had it on."],
  ["Walk past the first wild beach.", "On the eastern side of La Digue, each cove is emptier than the last. Most people stop at the first one they reach. Twenty minutes more on foot buys you a beach to yourself, but the currents there are serious, so swim only where locals are swimming."],
];

const FAQ = [
  ["Is Seychelles worth the money?", "Yes, if you treat the splurges as optional. The costly parts are hotels and restaurant food. The beaches, which are the reason to come, are free or close to it, and simple guesthouses and takeaway counters are genuinely good rather than a compromise. Do it that way and it is expensive in the way a special trip should be, not in the way that ruins one."],
  ["How many days do you need in Seychelles?", "Seven days and seven nights is the number I would give anyone. It covers three islands plus a boat day without rushing. Five days works for one island and one excursion. Under four, you are paying long-haul airfare to sit on a single beach."],
  ["Which island should I stay on?", "All three, in sequence. If you can only pick one, La Digue for atmosphere, Praslin for the balance of beaches and forest, Mahé for variety and convenience. Splitting your nights is the whole point of coming here."],
  ["Do you need to rent a car?", "On Mahé and Praslin, yes: it is cheaper than taxis and the good beaches are spread out. On La Digue, no. Bicycles are the transport and there is essentially nowhere to drive."],
  ["Are the ferries rough?", "They can be. The Mahé to Praslin crossing takes about an hour and is exposed. If you are prone to seasickness, get some pills from home or sit outside, low and toward the back, and look at the horizon. The Praslin to La Digue hop is short enough not to matter."],
  ["Do you need a visa for Seychelles?", "No visa for EU, UK and US passport holders, but an online travel authorisation is mandatory before departure, and the application has a couple of catches worth knowing about ahead – the guide walks through them. Apply well ahead of the flight."],
  ["Is Seychelles safe, and are there health requirements?", "It is a straightforward country to travel independently. Malaria-free, no required vaccinations, tap water generally fine at hotels. The real hazards are sun and current, not crime or disease."],
  ["Can you do Seychelles without an organised tour?", "Yes, and you should. Ferries, rental cars and bicycles cover everything except the boat day to Curieuse, which needs a licensed operator. That is the only part of the trip we did not arrange ourselves on the day."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

/*
 * Seychelles has one guide SKU today, but the hub inherited the `[0]` fetch
 * that bit Iceland and Samoa the day their second SKU published: hard-coded
 * primary sales copy rendered over whichever guide happened to sort first.
 * So the fetch takes all guides - a future second SKU appears as its own
 * card with no code change - and the 7-day four-island week is resolved by
 * slug as the hub's primary, since the inline guide sentences and the
 * BuyBox describe that version specifically.
 */
const WEEK_SLUG = "seychelles-7-days";

// Card blurbs per SKU, keyed by guide slug. Scope boundary (destination
// playbook §7): each blurb sells what this page deliberately withholds -
// mechanics are asserted to exist, never demonstrated. No fares, clock
// times, booking channels or within-day sequencing. Unknown future SKUs
// fall back to the guide's own subtitle.
const GUIDE_BLURBS = {
  [WEEK_SLUG]:
    "Seven days, four islands, day by day. Ferry timings and booking deadlines, hotel picks at three price levels per island, restaurant list, full cost breakdown at lean, core and splurge, packing list, and the companion Google map with every pin.",
};

async function fetchSeychellesContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "seychelles" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "seychelles" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function SeychellesDestinationPage() {
  const { guides, stories } = await fetchSeychellesContent();
  const guide = guides?.find((g) => g.slug === WEEK_SLUG) ?? guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Seychelles: what to actually do, and how long you need",
        description:
          "Seven days across four Seychelles islands: what is worth your time, how long to stay, when to go, what it costs.",
        datePublished: "2026-07-24",
        dateModified: "2026-07-24",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Seychelles" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/seychelles",
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
        <span className="text-slate-600">Seychelles</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          East &amp; Southern Africa · Indian Ocean
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Seychelles
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          What to actually do, and how long you need – from seven days across
          Mahé, Praslin, Curieuse and La Digue.
        </p>
        <Byline lang="en" />
      </header>

      {/* Content left, guide buy box right — same shape as the guide page, so
          the hero and the body share one column edge instead of the hero
          spanning full width above a narrower, centred body. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
      <div className="relative mb-12 overflow-hidden rounded-[28px]">
        <Image
          src={sourceDargentFromWater}
          alt="The granite boulders of Anse Source d'Argent seen from the water, La Digue, Seychelles"
          priority
          className="h-[320px] w-full object-cover md:h-[460px]"
          sizes="(max-width: 768px) 100vw, 830px"
        />
      </div>

      <div className="space-y-14">
        <section className="space-y-4">
          <SectionHeading>
            Is Seychelles worth it, and what do you actually do there
          </SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Yes, with one condition: treat it as an island-hopping country, not
            a single resort. I spent a week across four islands, Mahé,
            Praslin, La Digue and a boat day to Curieuse, and the trip only
            worked because it moved. Most people book 7 days on one island, see
            three beaches, and come home saying it was beautiful but expensive.
            It is beautiful. The expense is mostly optional.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            What you actually do here: you swim on beaches that regularly top
            the world lists and cost nothing to walk onto, you walk into the
            only forest on earth where coco de mer grows, you share a protected
            island with giant tortoises that nobody fenced in, and you spend two
            days on an island where bicycles replaced cars. The distances are
            short. The ferry hops are under an hour, sometimes fifteen minutes.
            Nothing about the country is hard except the sea between the
            islands, which can be rough.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The country is malaria-free, English and Creole are both spoken,
            cards work almost everywhere, and no country I have taken a wife to
            has produced fewer logistical arguments. Of 140 countries, this is
            one of the very few where the postcard version and the real version
            are the same photograph, provided you get up early enough to take
            it.
          </p>
        </section>

        <section className="space-y-4">
          <SectionHeading>When to go</SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The clean window is May to October: drier, cooler, steadier trade
            winds, and the sea is generally kinder for the ferry crossings.
            Temperatures barely move all year, around 28 degrees, so season is
            about wind, rain and seaweed rather than heat.
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
            UV is punishing year-round, and it does not feel punishing until the
            evening. That is the one thing people underestimate here.
          </p>
        </section>

        <section className="space-y-4">
          <SectionHeading>How long to stay</SectionHeading>
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
          <p className="text-[15px] leading-relaxed text-slate-700">
            Seven days, seven nights sounds like a race across four islands. It
            is not, because the hops are short and the islands are small. We
            came home feeling like we had been somewhere, not like we had run a
            relay.
          </p>
          {guide ? (
            <p className="text-[15px] leading-relaxed text-slate-700">
              <strong>Guide:</strong>{" "}
              <Link
                href={`/guides/${guide.slug}`}
                className="font-medium text-brand-terracotta underline underline-offset-2"
              >
                {guide.title}
              </Link>{" "}
              covers the seven-day version day by day, with the ferry timings,
              the booking deadlines and the hotel picks per island.
            </p>
          ) : null}
        </section>

        <section className="space-y-6">
          <SectionHeading>The islands</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2">
            {ISLANDS.map((island) => (
              <article
                key={island.name}
                className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card"
              >
                <Image
                  src={island.image}
                  alt={island.alt}
                  className="aspect-[4/3] w-full object-cover"
                  sizes="(max-width: 640px) 100vw, 380px"
                />
                <div className="space-y-2 p-5">
                  <h3 className="font-serif text-xl text-brand-ink">{island.name}</h3>
                  <p className="text-[14px] leading-relaxed text-slate-700">{island.body}</p>
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
            International flights land on Mahé only. From there the country runs
            on two ferry routes: a fast catamaran between Mahé and Praslin, and
            a short hop between Praslin and La Digue, both running several times
            a day. There is a helicopter option that is dramatically faster and
            dramatically more expensive.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The ferries sell out in high season, and I watched people get left
            standing on the dock without tickets as they had assumed these
            would be available on the spot. The crossings can
            be genuinely rough. On more than one hop I sat outside, stared at a
            fixed point on the horizon, and concentrated on not embarrassing
            myself while locals scrolled their phones. Get pills against sea
            sickness.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            On land: rent a car on Mahé and Praslin, and do not rent one on La
            Digue because there is nowhere to drive it. Bicycles are the
            transport there. Driving is on the left (like the UK), roads are
            narrow and steep in places, and some rental companies ask for an
            international driving permit, so get one at home.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Paperwork is light. No visa for EU, UK or US travellers, but an
            online travel authorisation is mandatory before you fly – apply
            well ahead, and know the application has a couple of catches the
            guide walks through.
          </p>
        </section>

        <section className="space-y-4">
          <SectionHeading>What it costs</SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Once you are here, the one cost nobody can avoid is moving between
            the islands: the three ferry legs of the seven-day route – Mahé to
            Praslin, the short hop to La Digue, and the direct boat back – come
            to roughly €140 per person. That is what the island-hopping costs,
            not what the trip costs. Everything above it is a decision, and the
            decisions run in three styles:
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
                    <td className="px-5 py-3 font-medium">{style}</td>
                    <td className="px-5 py-3 text-slate-700">{looks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The expensive part is structural: almost everything that is not
            caught locally is shipped in, so restaurant food carries the
            freight, and the top hotels cost what top hotels cost anywhere. But
            the splurges are choices, not requirements. We mixed a few nights at
            the top end with simple, well-rated guesthouses we liked just as
            much, drove ourselves instead of taking taxis, and ate our best meal
            of the entire trip at a takeaway counter for the price of a coffee
            at home.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            The beaches, which are the thing people fly here for, are almost all
            free – even the most photographed beach on earth charges only a
            small entry fee. The guide costs the whole week out line by line at
            all three levels, every night, every crossing, every activity, so
            you can build the trip at the level you actually want instead of
            guessing at a number.
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
            src={rafflesPool}
            alt="Sitting with a coconut beside an infinity pool above the sea, Praslin, Seychelles"
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
            <SectionHeading>Stories from Seychelles</SectionHeading>
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

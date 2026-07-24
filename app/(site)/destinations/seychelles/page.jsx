import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";

import beauVallonFromAbove from "../../../../content/destinations/seychelles/beau-vallon-from-above.jpg";
import graniteBouldersBeach from "../../../../content/destinations/seychelles/granite-boulders-beach.jpg";
import curieuseTortoises from "../../../../content/destinations/seychelles/curieuse-tortoises.jpg";
import anseMajorTrail from "../../../../content/destinations/seychelles/anse-major-trail.jpg";
import mahePalmBeach from "../../../../content/destinations/seychelles/mahe-palm-beach.jpg";
import beauVallonSunset from "../../../../content/destinations/seychelles/beau-vallon-sunset.jpg";

export const metadata = {
  title: "Seychelles: what to actually do, and how long you need · TestedRoutes",
  description:
    "I spent eight days across four Seychelles islands. What is worth your time, how many days you need, when to go, what it costs, and the things I would do differently.",
  alternates: { canonical: "/destinations/seychelles" },
  openGraph: {
    type: "article",
    url: "/destinations/seychelles",
    title: "Seychelles: what to actually do, and how long you need",
    description:
      "Eight days across four Seychelles islands: what is worth your time, how long to stay, when to go, what it costs.",
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
  ["Eight days, seven nights", "The sweet spot, and what I would recommend to almost anyone. Enough for three islands plus a boat day to Curieuse, with each island given long enough to become itself rather than a stop."],
  ["Ten to twelve days", "Add the bird islands, or simply slow down further and spend more time doing nothing, which Seychelles rewards."],
];

const ISLANDS = [
  {
    name: "Mahé",
    image: anseMajorTrail,
    alt: "Coastal trail above a cove on Mahé, Seychelles",
    body: "The main island and the only one with an international airport. Mountainous, green, and much bigger than people expect, with a road over the interior that climbs through cloud forest into viewpoints over the whole inner island chain. Good for the first and last days: a coastal trail to a cove with no road access, a proper capital with a spice market, and beaches that are quieter than the famous names elsewhere. Rent a car here. You will want it.",
  },
  {
    name: "Praslin",
    image: graniteBouldersBeach,
    alt: "Granite boulders and clear water on a Praslin beach, Seychelles",
    body: "Half an hour by fast ferry from Mahé, and the reason most people come is the forest. Vallée de Mai is UNESCO-listed and the only place the coco de mer palm grows wild, producing the largest seed in the plant kingdom. It is also home to the endemic black parrot. The beaches on Praslin are the postcard ones: one of them regularly ranks among the best in the world, another is reached only through a resort with a reservation made days in advance.",
  },
  {
    name: "La Digue",
    image: mahePalmBeach,
    alt: "A leaning palm over sand and shallow water, Seychelles",
    body: "The smallest of the three main islands, fifteen minutes from Praslin, and the one everybody remembers. It runs on bicycles. There are almost no cars, so the whole island moves at bike speed, and bike speed turns out to be exactly right. Anse Source d'Argent is here, the pink granite boulders you have seen a hundred times without knowing the name. So is the wild eastern side, where the surf comes in hard, the crowds thin out, and the beaches get emptier the further you walk.",
  },
  {
    name: "Curieuse",
    image: curieuseTortoises,
    alt: "Free-roaming giant Aldabra tortoises on Curieuse Island, Seychelles",
    body: "A day trip by boat, not a base. A national park island off Praslin with free-roaming giant Aldabra tortoises, some over a hundred years old, walking around loose on the beach where you land. Mangrove boardwalk across to the far shore, small reef sharks in the shallows, and a barbecue lunch under the trees. It is the one day of the trip where the wildlife, not the beach, is the point.",
  },
];

const COSTS = [
  ["Lean", "€200 to €250", "Guesthouses, takeaway lunches, ferries, few paid activities"],
  ["Core", "€380 to €420", "Best-value hotels, mixed meals out, full activity list, rental cars"],
  ["Splurge", "€1,000+", "Top-tier resorts, private pools, helicopter transfers"],
];

const TIPS = [
  ["Set the alarm for Source d'Argent.", "By mid-morning the most photographed beach on earth is full of day-trippers who came over specifically for it. Get there before sunrise and you get four empty coves and the granite turning from grey to gold to pink while you stand in it. We did it two mornings in a row. The first visitors did not appear until nine."],
  ["Stay late on Source d'Argent.", "Crowds disappear once the sun starts setting in. You will experience dramatic colors. No worries, you can exit L'Union Estate any time."],
  ["Book ferries before hotels.", "Ferry availability, not room availability, is what actually constrains a Seychelles itinerary in season. Lock the crossings first and build the nights around them."],
  ["The best food is not in the restaurants.", "The standout meal of eight days was a local takeaway counter with thousands of reviews, five minutes by bike, eaten at a shaded table. Fruit bat curry is a real Creole dish and worth chasing, though it took me two days of asking to find a place that had it on."],
  ["Rent the bike for your whole stay on La Digue, not by the day.", "The island rewards riding it before dawn and after dark, and the daily rate makes you calculate rather than just go."],
  ["Walk past the first wild beach.", "On the eastern side of La Digue, each cove is emptier than the last. Most people stop at the first one they reach. Twenty minutes more on foot buys you a beach to yourself, but the currents there are serious, so swim only where locals are swimming."],
  ["Cover up between eleven and three.", "Reef-safe SPF, a long-sleeve rash guard, and water you carry with you. Several of the best beaches have no shop at all."],
];

const FAQ = [
  ["Is Seychelles worth the money?", "Yes, if you treat the splurges as optional. The costly parts are hotels and restaurant food. The beaches, which are the reason to come, are free or close to it, and simple guesthouses and takeaway counters are genuinely good rather than a compromise. Do it that way and it is expensive in the way a special trip should be, not in the way that ruins one."],
  ["How many days do you need in Seychelles?", "Eight days and seven nights is the number I would give anyone. It covers three islands plus a boat day without rushing. Five days works for one island and one excursion. Under four, you are paying long-haul airfare to sit on a single beach."],
  ["Which island should I stay on?", "All three, in sequence. If you can only pick one, La Digue for atmosphere, Praslin for the balance of beaches and forest, Mahé for variety and convenience. Splitting your nights is the whole point of coming here."],
  ["Do you need to rent a car?", "On Mahé and Praslin, yes: it is cheaper than taxis and the good beaches are spread out. On La Digue, no. Bicycles are the transport and there is essentially nowhere to drive."],
  ["Are the ferries rough?", "They can be. The Mahé to Praslin crossing takes about an hour and is exposed. If you are prone to seasickness, get some pills from home or sit outside, low and toward the back, and look at the horizon. The Praslin to La Digue hop is short enough not to matter."],
  ["Do you need a visa for Seychelles?", "No visa for EU, UK and US passport holders, but an online travel authorisation is mandatory before departure and your accommodation must appear on the country's certified list. Apply well ahead of the flight."],
  ["Is Seychelles safe, and are there health requirements?", "It is a straightforward country to travel independently. Malaria-free, no required vaccinations, tap water generally fine at hotels. The real hazards are sun and current, not crime or disease."],
  ["Can you do Seychelles without an organised tour?", "Yes, and you should. Ferries, rental cars and bicycles cover everything except the boat day to Curieuse, which needs a licensed operator. That is the only part of the trip we did not arrange ourselves on the day."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchSeychellesContent() {
  try {
    return await client.fetch(
      `{
        "guide": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "seychelles" && (language == "en" || !defined(language))][0]{
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "seychelles" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function SeychellesDestinationPage() {
  const { guide, stories } = await fetchSeychellesContent();
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
          "Eight days across four Seychelles islands: what is worth your time, how long to stay, when to go, what it costs.",
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
          What to actually do, and how long you need – from eight days across
          Mahé, Praslin, Curieuse and La Digue.
        </p>
        <Byline lang="en" />
      </header>

      <div className="relative mb-12 overflow-hidden rounded-[28px]">
        <Image
          src={beauVallonFromAbove}
          alt="Beau Vallon bay and the green hills of Mahé, Seychelles"
          priority
          className="h-[320px] w-full object-cover md:h-[460px]"
          sizes="(max-width: 1280px) 100vw, 1232px"
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-14">
        <section className="space-y-4">
          <SectionHeading>
            Is Seychelles worth it, and what do you actually do there
          </SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Yes, with one condition: treat it as an island-hopping country, not
            a single resort. I spent eight days across four islands, Mahé,
            Praslin, La Digue and a boat day to Curieuse, and the trip only
            worked because it moved. Most people book a week on one island, see
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
            Eight days, seven nights sounds like a race across four islands. It
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
              covers the eight-day version day by day, with the ferry timings,
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
          <SectionHeading>Getting there and around</SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            International flights land on Mahé only. From there the country runs
            on two ferry routes: a fast catamaran between Mahé and Praslin, and
            a short hop between Praslin and La Digue, both running several times
            a day. There is a helicopter option that is dramatically faster and
            dramatically more expensive.
          </p>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Book the ferries before you fly. They sell out in high season, and I
            watched people get left standing on the dock without tickets as they
            had assumed these would be available on the spot. The crossings can
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
            online travel authorisation is mandatory before you fly, and your
            accommodation has to be on the certified list or the authorisation
            can be held up. Sort that before you book hotels, not after.
          </p>
        </section>

        <section className="space-y-4">
          <SectionHeading>What it costs</SectionHeading>
          <p className="text-[15px] leading-relaxed text-slate-700">
            Excluding international flights, per couple, per day:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
            <table className="w-full min-w-[480px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3 font-semibold">Style</th>
                  <th className="px-5 py-3 font-semibold">Per day for two</th>
                  <th className="px-5 py-3 font-semibold">What that looks like</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-900">
                {COSTS.map(([style, price, looks]) => (
                  <tr key={style}>
                    <td className="px-5 py-3 font-medium">{style}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{price}</td>
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
            free. The most photographed beach on earth costs about nine euros to
            enter. That is the whole entry fee for the headline attraction of
            the country.
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
            src={beauVallonSunset}
            alt="Sunset over Beau Vallon beach with anchored sailboats, Seychelles"
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
                  Eight days, four islands, day by day. Ferry timings and
                  booking deadlines, hotel picks at three price levels per
                  island, restaurant list, full cost breakdown at lean, core and
                  splurge, packing list, and the companion Google map with every
                  pin.
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
    </main>
  );
}

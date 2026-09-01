import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import whiteDuneTidalPool from "../../../../content/countries/western-sahara/destination/generated/web/white-dune-tidal-pool.jpg";
import sunsetOverTheAtlantic from "../../../../content/countries/western-sahara/destination/generated/web/sunset-over-the-atlantic.jpg";
import emptyDesertHighway from "../../../../content/countries/western-sahara/destination/generated/web/empty-desert-highway.jpg";
import dakhlaBayPromenade from "../../../../content/countries/western-sahara/destination/generated/web/dakhla-bay-promenade.jpg";
import kiteBeachFromBluff from "../../../../content/countries/western-sahara/destination/generated/web/kite-beach-from-bluff.jpg";
import sunsetSandFlatsFigure from "../../../../content/countries/western-sahara/destination/generated/web/sunset-sand-flats-figure.jpg";
import sahrawiTentsBeachTrack from "../../../../content/countries/western-sahara/destination/generated/web/sahrawi-tents-beach-track.jpg";
import sahrawiCampShade from "../../../../content/countries/western-sahara/destination/generated/web/sahrawi-camp-shade.jpg";
import rallyCarBeachSand from "../../../../content/countries/western-sahara/destination/generated/web/rally-car-beach-sand.jpg";
import camelsBesideTheRoad from "../../../../content/countries/western-sahara/destination/generated/web/camels-beside-the-road.jpg";
import dakhlaArrivalFlags from "../../../../content/countries/western-sahara/destination/generated/web/dakhla-arrival-flags.jpg";
import dakhlaPalmBoulevard from "../../../../content/countries/western-sahara/destination/generated/web/dakhla-palm-boulevard.jpg";
import dakhlaMosqueSquare from "../../../../content/countries/western-sahara/destination/generated/web/dakhla-mosque-square.jpg";
import dakhlaMarketDatesStall from "../../../../content/countries/western-sahara/destination/generated/web/dakhla-market-dates-stall.jpg";
import lagoonHotelPool from "../../../../content/countries/western-sahara/destination/generated/web/lagoon-hotel-pool.jpg";
import infinityPoolLagoon from "../../../../content/countries/western-sahara/destination/generated/web/infinity-pool-lagoon.jpg";
import sahraouiVillageSign from "../../../../content/countries/western-sahara/destination/generated/web/sahraoui-village-sign.jpg";
import goldenHourDesertTrack from "../../../../content/countries/western-sahara/destination/generated/web/golden-hour-desert-track.jpg";
import tropicOfCancerSign from "../../../../content/countries/western-sahara/destination/generated/web/tropic-of-cancer-sign.jpg";
import convoyOnTheHighwayDawn from "../../../../content/countries/western-sahara/destination/generated/web/convoy-on-the-highway-dawn.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION -
 * whether to come, whether it is safe, how long, when. Everything
 * operational (which kite camp, lagoon logistics, checkpoint/fiche
 * mechanics, fuel planning, named beds and restaurants, border procedure)
 * belongs to the planned Dakhla guide SKU and is deliberately absent. The
 * only execution-flavoured facts here are ones a published inspire story
 * already gives away (fill up at every fuel station; sand is slower than
 * snow; the town is quiet and the life is on the water). NOTE: no guide SKU
 * is live yet, so no answer may say "the guide carries X" - mechanics are
 * asserted to exist, unreferenced. When the Dakhla SKU publishes, do a
 * pointer pass over the FAQ and the how-long section. The test before any
 * edit: could a reader run a day of the trip from this page? If yes, cut
 * until they cannot.
 *
 * Political note: Western Sahara is a disputed territory. This page takes
 * no position - it states who controls the visited side, keeps place
 * framing neutral, and sticks to what a visitor experiences. Keep it that
 * way in every edit.
 */

export const metadata = {
  title:
    "Western Sahara: can you visit, is it safe, and is Dakhla worth it · TestedRoutes",
  description:
    "Whether you can visit Western Sahara, how safe the Atlantic side is, and what Dakhla actually offers – the kite lagoon, the white dune, and a thousand kilometres of empty desert road.",
  alternates: { canonical: "/destinations/western-sahara" },
  openGraph: {
    type: "article",
    url: "/destinations/western-sahara",
    title: "Western Sahara: can you visit, is it safe, and is Dakhla worth it",
    description:
      "The kite lagoon at the end of the road, the white dune, and the emptiest sealed drive in Africa – what a visit to Western Sahara actually looks like.",
  },
};

const WHEN_TO_GO = [
  ["April to June", "The sweet spot. The trade wind is already working for the kite crowd, the desert has not hit full summer heat, and the coast stays mild – Dakhla's ocean air keeps it temperate when the interior cooks."],
  ["July to September", "Peak wind. The lagoon is at its strongest and busiest, and the coast remains bearable while inland Sahara is brutal. Come for the wind, plan around it if you are not here for it."],
  ["October to March", "The quiet season. Winds ease, resorts thin out, days stay warm and nights get properly cool. The desert drive is at its most pleasant – this is when I would do the overland run."],
  ["What I would pick", "For Dakhla itself: May or June, taking the livelier lagoon and the odds of wind with it. For the drive south: winter, trading the kite scene for cool mornings and empty roads. The coast is forgiving year-round; the choice is really about wind."],
];

const HOW_LONG = [
  ["A long weekend", "The Dakhla trip: fly in, the lagoon, the white dune, the town's market and promenade, seafood, out. This is the trip the place is built for, and it does not need more days – it needs the right ones."],
  ["A week", "The kite trip. A week here is for the wind: daily sessions on the flat lagoon – lessons if you are new, your own kit if you are not – with the dune, the town and the empty beaches filling the light-wind days. If you are not kiting, the long weekend is the better-sized trip."],
  ["The overland transit", "Two long driving days as part of a Morocco-to-Mauritania crossing – roughly a thousand kilometres of sealed, empty desert road. A completely different trip: the emptiness is the sight, and Dakhla is the rest stop you will remember."],
];

const REGIONS = [
  {
    name: "The long road south",
    image: emptyDesertHighway,
    alt: "The empty desert highway seen over the car bonnet, a dune encroaching from the left",
    body: "One sealed road runs the length of the territory, and almost nothing shares it with you: drifting sand, camels, checkpoints, fuel stations that feel like events, and a sticker-covered sign where it crosses the Tropic of Cancer. This is one of the emptiest drives you can do on tarmac anywhere, and it is most people's reason to be here at all.",
  },
  {
    name: "Dakhla town",
    image: dakhlaBayPromenade,
    alt: "Dakhla's stone seafront promenade curving along the turquoise bay toward town",
    body: "A working Saharan port at the end of a forty-kilometre spit: a fish market, a proper souk, palm boulevards and a seafront promenade above flat turquoise water. It is not a town you sightsee – it is a town that works for a living, and eating well here is easy.",
  },
  {
    name: "The lagoon and the white dune",
    image: kiteBeachFromBluff,
    alt: "Kites in the air over Dakhla's flat lagoon, seen from the bluff above the beach",
    body: "The reason Dakhla is on the world's map: a shallow, flat-water lagoon with trade wind across it most of the year, kite camps strung along the shore, and a white dune rising straight out of the tidal flats. You do not need to kite for it to be worth the trip – the watching is half the show.",
  },
  {
    name: "The empty coast",
    image: sunsetSandFlatsFigure,
    alt: "A lone figure on vast tidal sand flats at sunset",
    body: "Between the road and the Atlantic there are beaches with nobody on them for hours in either direction – tidal flats, low dunes, fishing camps, wind. This is where the territory feels like the edge of the map, and where its scale stops being a number and becomes a feeling.",
  },
];

/* Trip photos, roughly in route order: the border beach day, the drive, Dakhla, the lagoon, the drive south. */
const CAROUSEL = [
  { image: sahrawiTentsBeachTrack, alt: "A sand track running past Sahrawi tents toward the beach", caption: "The track to the coast" },
  { image: sahrawiCampShade, alt: "A Sahrawi camp by the beach, figures resting in the shade of a tent wall", caption: "Shade, the local currency" },
  { image: rallyCarBeachSand, alt: "A rally car with a roof box parked on soft beach sand", caption: "Soft sand, hard lessons" },
  { image: camelsBesideTheRoad, alt: "A camel and calf beside the empty desert road", caption: "Roadside company" },
  { image: dakhlaArrivalFlags, alt: "Rally cars parked beneath a row of Moroccan flags on Dakhla's seafront", caption: "Arrival in Dakhla" },
  { image: dakhlaPalmBoulevard, alt: "A palm-lined boulevard in Dakhla at midday", caption: "The palm boulevard" },
  { image: dakhlaMosqueSquare, alt: "A white mosque and minaret above a quiet square in Dakhla", caption: "Dakhla's quiet squares" },
  { image: dakhlaMarketDatesStall, alt: "A vendor at a dates and dried-fruit stall in Dakhla's market", caption: "The market does the talking" },
  { image: dakhlaBayPromenade, alt: "The stone promenade curving along Dakhla's turquoise bay", caption: "The bay promenade" },
  { image: kiteBeachFromBluff, alt: "Kites over the flat lagoon seen from the bluff above the beach", caption: "The lagoon at work" },
  { image: lagoonHotelPool, alt: "A lagoon-side hotel pool with palms and the Atlantic beyond", caption: "The lagoon-side option" },
  { image: infinityPoolLagoon, alt: "Feet up at an infinity pool overlooking the turquoise lagoon", caption: "The reward position" },
  { image: sahraouiVillageSign, alt: "The Sahraoui Village sign with a camel silhouette in the dunes", caption: "Signs of the peninsula" },
  { image: goldenHourDesertTrack, alt: "A car climbing a desert track at golden hour", caption: "Golden hour off the tarmac" },
  { image: tropicOfCancerSign, alt: "The sticker-covered Tropic of Cancer sign photographed at night", caption: "The Tropic of Cancer, by torchlight" },
  { image: convoyOnTheHighwayDawn, alt: "The rally convoy parked on the highway shoulder at dawn", caption: "Dawn start, southbound" },
];

// Deliberately no tier totals here (destination playbook §8). The one number
// on this page is the unavoidable one - the flight - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "A guesthouse in town, meals where the fishermen eat, the free sights – the dune, the beaches, the promenade – and the bus-and-taxi layer that locals use"],
  ["Core", "A lagoon-side kite camp or a good town hotel, seafood dinners, and a car for the days that want one – the dune at sunset, the empty coast"],
  ["Splurge", "The lagoon resorts proper: kite tuition, pools above the water, everything arranged. Dakhla's ceiling is a real resort ceiling – unusual for the Sahara – but it stays a fraction of what the same week costs on famous water elsewhere"],
];

const TIPS = [
  ["The town is quiet on purpose – the life is on the water.", "Do not judge Dakhla by its streets. It is a working port with a good market, but the energy is at the lagoon: kites, camps, long lunches watching the wind work. Go straight to the water and the place makes sense."],
  ["Sand is not snow.", "The white dune is worth climbing for where it sits – between open desert and still water – but if you try to board down it expecting a ski run, you will be disappointed. Go for the dune, the light and the drive around it, not the ride."],
  ["Fill up whenever you see fuel.", "On the road south, fuel stations are far enough apart that each one is an event. We topped up at every working pump whether the tank needed it or not, and that rule never cost us anything but minutes."],
];

const FAQ = [
  ["Can tourists visit Western Sahara?", "Yes. The Atlantic side – the coastal strip with Laâyoune, Boujdour and Dakhla and the sealed highway connecting them – is open, administered by Morocco, and travelled every day by tourists, overlanders and a growing kite-surf crowd. What is off-limits is the east: the militarised berm that divides the territory and everything beyond it. Stay on the Atlantic side, as effectively all visitors do, and visiting is straightforward."],
  ["Is Western Sahara safe to visit?", "Check your government's travel advice first and let it outrank everything, this page included. Western advisories draw a hard line at the berm – no travel within roughly 30 km of it or beyond it, where landmines are a real hazard – and treat the Atlantic corridor much like southern Morocco: go, with normal care. That corridor is where we drove for three days: police checkpoints were frequent and polite, towns felt calm, and the real daily risks were road ones – distance, wind, sand and fuel. Re-read the advisory close to travel; it moves faster than any guidebook."],
  ["Is Dakhla worth visiting?", "Yes – for the water, not the town. Dakhla is a working Saharan port beside one of the best flat-water kite lagoons anywhere, and it works best as a purpose trip: wind, the white dune, seafood, big skies. The town itself is pleasant but thin as a sightseeing destination – we found the streets quiet and the lagoon alive, and that is the right way around to expect it."],
  ["How do you get to Dakhla?", "By air, easily: direct budget flights from Paris run year-round, Madrid joins seasonally, and domestic connections run via Casablanca. By road, seriously: Dakhla sits at the end of a forty-kilometre spit, a thousand-kilometre drive south of Morocco proper – a real overland leg that is its own reason to come. There is no practical third option."],
  ["When is the kitesurfing season in Dakhla?", "The wind works most of the year – the lagoon claims around 300 windy days – but it is strongest and most reliable from April to October, peaking in high summer. Winter brings lighter, less certain wind and quieter camps. If kiting is the point of the trip, aim for the season; if it is not, winter's calm is a feature."],
  ["Do you need to kitesurf to enjoy Dakhla?", "No. We did not kite and the lagoon still carried the trip: the white dune above the tidal flats, the watching – which is genuinely good – the market, the seafood, and the desert light morning and evening. Kiting gives the trip a spine; it is not the entry fee."],
  ["How many days do you need in Dakhla?", "A long weekend covers the trip Dakhla is built for: the lagoon, the dune, the town, the light. A week adds calm rather than sights, which is exactly what some people fly in for. If you are driving through overland, even one night makes it the best rest stop between Morocco and Mauritania."],
  ["Can you drive through Western Sahara from Morocco to Mauritania?", "Yes – it is the standard overland route down the Atlantic coast, and the road is sealed the whole way. Count roughly a thousand kilometres of desert highway through the territory, two long driving days, with checkpoints throughout and fuel stops far enough apart to plan around. We drove it as part of a rally: easy road, serious distances, and emptiness that becomes the point."],
  ["What is the political situation – and does it affect a visit?", "Western Sahara is a disputed territory: Morocco administers the Atlantic side that visitors travel, and the territory east of the militarised berm is beyond it. This page takes no side. On the ground, the visited strip runs on Moroccan administration – dirhams, Moroccan paperwork, Moroccan flags – and a visitor who stays on the Atlantic side experiences a calm, functioning coast. The dispute is real; for travellers who respect the geography, it stays in the background."],
  ["Is Western Sahara expensive?", "Getting there is cheaper than it has any right to be – direct returns from Paris to Dakhla start around €150, and that is the trip's one unavoidable line. On the ground the town side is inexpensive; the kite resorts price like resorts, and they are the budget's only real decision. Everything the territory does best – the dune, the beaches, the emptiness – is free."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Western Sahara guide SKU is live yet (one is approved: the Dakhla
// weekend). The fetch takes all guides so each future SKU appears as its own
// card with no code change; until then the guide sections and the BuyBox
// simply do not render.
const GUIDE_BLURBS = {};

async function fetchWesternSaharaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "western-sahara" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "western-sahara" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function WesternSaharaDestinationPage() {
  const { guides, stories } = await fetchWesternSaharaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Western Sahara: can you visit, is it safe, and is Dakhla worth it",
        description:
          "Whether you can visit Western Sahara, how safe the Atlantic side is, and what Dakhla actually offers – the kite lagoon, the white dune, and a thousand kilometres of empty desert road.",
        datePublished: "2026-09-01",
        dateModified: "2026-09-01",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Place", name: "Western Sahara" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/western-sahara",
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
        <span className="text-slate-600">Western Sahara</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North & West Africa · The Atlantic Sahara
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Western Sahara
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Can you visit, is it safe, and is Dakhla worth the trip – for the
          kite lagoon, the white dune, and the emptiest sealed drive in
          Africa.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={whiteDuneTidalPool}
              alt="A horseshoe tidal pool ringed by white sand beneath the dune near Dakhla, a lone figure at its rim"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Western Sahara worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Western Sahara is mostly emptiness – and that is the honest
                pitch, not the caveat. A disputed territory the size of
                Britain with a single sealed highway down its Atlantic edge,
                it offers three things in quantities almost nowhere else can:
                space, wind and light. We crossed it end to end on our West
                Africa rally expecting a transit, and it gave us some of the
                trip's best days.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: drive a desert highway where fuel
                stations are events and camels have right of way, mess about
                on beaches with nobody on them for hours in either direction,
                and land in Dakhla – a working port at the end of a
                forty-kilometre spit, beside a flat turquoise lagoon that has
                quietly become one of the kitesurfing capitals of the world.
                Climb the white dune that rises straight out of the tidal
                flats, eat seafood that was swimming that morning, watch the
                kites until the light goes.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats: this is not a sightseeing destination –
                there are no monuments, no old towns, no museums worth the
                word. The distances are serious, the wind is constant, and
                the territory's eastern half is off-limits behind a
                militarised line. You come for water, desert and emptiness,
                or you do not come. We think the first option is badly
                underrated.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The coast is mild all year – the ocean does for Western
                Sahara what altitude does for other deserts. The real
                calendar here is the wind's.
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
                Western Sahara scales by intent: Dakhla is a fly-in trip, the
                territory is a drive-through, and both are legitimate.
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
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly to Dakhla: direct budget flights from Paris run
                year-round, Madrid joins in season, and Casablanca connects
                the domestic network. Or arrive by road as part of the
                Atlantic-coast overland route – Western Sahara is the long
                middle of every Morocco-to-Mauritania crossing, and the
                highway is sealed the whole way.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground the territory is one road and the places on it.
                Any normal car handles the highway; the peninsula around
                Dakhla adds sand tracks where judgment matters more than
                horsepower. Checkpoints are frequent, polite and part of the
                rhythm – build slack for them rather than frustration. And
                the emptiness is real: distances between services are long
                enough that fuel, water and daylight all deserve a plan.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the surprise: direct returns from Paris to
                Dakhla start around €150. That is what reaching the territory
                costs, not what the trip costs – but on the ground this is an
                inexpensive place by any resort-destination standard. The
                shape of the spend is a decision:
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
                The line with real range is the bed: town guesthouse to
                lagoon resort is the whole spread of the budget. Most of what
                the territory does best costs nothing to stand in front of.
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
                src={sunsetOverTheAtlantic}
                alt="The sun setting over the Atlantic seen from dark dunes on the Western Sahara coast"
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
                <SectionHeading>Stories from Western Sahara</SectionHeading>
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

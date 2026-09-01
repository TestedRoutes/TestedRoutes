import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import ridingEmptyOreWagons from "../../../../content/countries/mauritania/destination/generated/web/riding-empty-ore-wagons.jpg";
import adrarPlateauVista from "../../../../content/countries/mauritania/destination/generated/web/adrar-plateau-vista.jpg";
import pirogueLandingSurf from "../../../../content/countries/mauritania/destination/generated/web/pirogue-landing-surf.jpg";
import ouadaneRuinsPalmBelt from "../../../../content/countries/mauritania/destination/generated/web/ouadane-ruins-palm-belt.jpg";
import stuckInTheDunes from "../../../../content/countries/mauritania/destination/generated/web/stuck-in-the-dunes.jpg";
import zoueratOreWagonsCrew from "../../../../content/countries/mauritania/destination/generated/web/zouerat-ore-wagons-crew.jpg";
import rallyCarsFlagDunes from "../../../../content/countries/mauritania/destination/generated/web/rally-cars-flag-dunes.jpg";
import nightOnTheOre from "../../../../content/countries/mauritania/destination/generated/web/night-on-the-ore.jpg";
import insideTheRichat from "../../../../content/countries/mauritania/destination/generated/web/inside-the-richat-structure.jpg";
import hiluxCrewDesert from "../../../../content/countries/mauritania/destination/generated/web/hilux-crew-desert.jpg";
import climbingOreWagon from "../../../../content/countries/mauritania/destination/generated/web/climbing-ore-wagon.jpg";
import railheadWaitDusk from "../../../../content/countries/mauritania/destination/generated/web/railhead-wait-dusk.jpg";
import adrarCanyonRoadGroup from "../../../../content/countries/mauritania/destination/generated/web/adrar-canyon-road-group.jpg";
import terjitCanyonDescent from "../../../../content/countries/mauritania/destination/generated/web/terjit-canyon-descent.jpg";
import ouadaneStoneLane from "../../../../content/countries/mauritania/destination/generated/web/ouadane-stone-lane.jpg";
import adrarMesaSunset from "../../../../content/countries/mauritania/destination/generated/web/adrar-mesa-sunset.jpg";
import rallyCarDesertHighway from "../../../../content/countries/mauritania/destination/generated/web/rally-car-desert-highway.jpg";
import cityTrafficOldMercedes from "../../../../content/countries/mauritania/destination/generated/web/city-traffic-old-mercedes.jpg";
import donkeyCartFishBeach from "../../../../content/countries/mauritania/destination/generated/web/donkey-cart-fish-beach.jpg";
import camelCrossingRoad from "../../../../content/countries/mauritania/destination/generated/web/camel-crossing-road.jpg";
import desertHighwayDawn from "../../../../content/countries/mauritania/destination/generated/web/desert-highway-dawn.jpg";
import rallyCarsDawnRoad from "../../../../content/countries/mauritania/destination/generated/web/rally-cars-dawn-road.jpg";
import desertDinnerWithHosts from "../../../../content/countries/mauritania/destination/generated/web/desert-dinner-with-hosts.jpg";
import rallyCarsOnOreWagons from "../../../../content/countries/mauritania/destination/generated/web/rally-cars-on-ore-wagons.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION -
 * whether Mauritania is worth it, how safe it is, how long, when. Everything
 * operational (train boarding mechanics, what to bring aboard, Eye-of-Sahara
 * operator arrangements, fares, sequencing, named beds) belongs to the two
 * planned guide SKUs and is deliberately absent. The only execution-flavoured
 * facts here are ones a published inspire story already gives away (the
 * ouguiya redenomination trap, the no-timetable train, the hired-4x4 rule for
 * the Eye). NOTE: no guide SKU is live yet, so no answer may say "the guide
 * carries X" - mechanics are asserted to exist, unreferenced. When the SKUs
 * publish, do a pointer pass over the FAQ and the how-long section. The test
 * before any edit: could a reader run a day of the trip from this page? If
 * yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Mauritania: is it worth visiting, is it safe, and how many days you need · TestedRoutes",
  description:
    "Whether Mauritania is worth it, how safe it is, when to go and what getting there costs – the iron-ore train, the Eye of the Sahara, and the desert between them.",
  alternates: { canonical: "/destinations/mauritania" },
  openGraph: {
    type: "article",
    url: "/destinations/mauritania",
    title: "Mauritania: is it worth visiting, is it safe, and how many days you need",
    description:
      "The iron-ore train, the Eye of the Sahara, oasis canyons and caravan-town ruins – and almost no other tourists at any of it.",
  },
};

const WHEN_TO_GO = [
  ["November to February", "The season. The Sahara at its most humane – warm days, cold clear nights, and every part of the trip workable, from the coast to the deep desert."],
  ["March, April and October", "The shoulders. The heat is building or fading, and the trip tilts toward dawn starts and long shaded middays – doable, but the margins shrink."],
  ["May to September", "Honestly, no. We crossed in late May and the interior was brutal by mid-morning; summer only deepens it. The desert's flip side holds all year – the night we rode the ore train was genuinely cold."],
  ["What I would pick", "December or January for full days in the desert, accepting holiday-season flight prices; late November if I wanted the same weather cheaper and quieter, accepting a small risk of the last warm spell. Either way the desert sets the clock: early starts, shade at noon."],
];

const HOW_LONG = [
  ["Three to four days", "The capital plus the Adrar: the oasis canyons, the caravan-town ruins, desert nights. Enough to understand why people fall for the country – not enough for its two signature rides."],
  ["Five to seven days", "The right amount: the Adrar and the Eye of the Sahara on a hired 4x4, and the iron-ore train ridden once, in one direction. Both need slack built around them – neither runs on your schedule."],
  ["Two weeks or more", "The overland crossing – in from Morocco, out to Senegal, the way we did it as part of a rally. A different, magnificent trip that is mostly about the driving, the borders and the distance."],
];

const REGIONS = [
  {
    name: "The Atlantic coast",
    image: pirogueLandingSurf,
    alt: "A painted wooden pirogue landing through the surf, fishermen hauling it up the sand",
    body: "The ocean edge of the Sahara: fishing beaches where painted wooden pirogues land through the surf and the catch moves up the sand in donkey carts, and the road south running between dunes and water. Both cities – Nouadhibou and Nouakchott – live off this coast, and Nouakchott's Port de Pêche at landing hour is the best free theatre in the country.",
  },
  {
    name: "The Adrar",
    image: ouadaneRuinsPalmBelt,
    alt: "The stone ruins of Ouadane on the hillside with the green palm belt below",
    body: "Mauritania's heart: a plateau of mesas and canyons holding the oases and the old caravan towns. Terjit's palms fill a crack in bare rock, Ouadane's stone ruins stand above a belt of green, and the roads between them are the country at its most beautiful. A first trip should spend most of its days here.",
  },
  {
    name: "The deep desert",
    image: stuckInTheDunes,
    alt: "Two cars stopped in soft dune sand, one dug in to the axles",
    body: "Beyond the last tarmac the Sahara starts properly: dune fields, black-rock plains, and the Richat Structure – the 40 km 'Eye of the Sahara' famous from orbit. Nothing out here is casual; the ground eats ordinary cars, and every visit runs on a local driver's judgment. Which is exactly why you will have it to yourself.",
  },
  {
    name: "The iron-ore north",
    image: zoueratOreWagonsCrew,
    alt: "Travellers in blue headscarves lined up along empty iron-ore wagons at Zouerat",
    body: "Zouerat, Choum and the railway that hauls the country's economy to the sea – up to three kilometres of open wagons per train, and the ride on top of the ore that people now cross the world for. The towns exist for the mine and the line; the emptiness between them is the point.",
  },
];

/* Trip photos, roughly in route order: border to coast, capital, Adrar, train, Eye, the desert crossing. */
const CAROUSEL = [
  { image: rallyCarsDawnRoad, alt: "Cars parked on the empty desert highway at dawn", caption: "First light on the road south" },
  { image: desertHighwayDawn, alt: "A straight desert highway at dawn seen over the car bonnet", caption: "The road to Nouakchott" },
  { image: camelCrossingRoad, alt: "A camel crossing the tarmac road in front of the car", caption: "Right of way" },
  { image: donkeyCartFishBeach, alt: "A donkey cart between beached wooden pirogues at Nouakchott's Port de Pêche", caption: "Port de Pêche, Nouakchott" },
  { image: cityTrafficOldMercedes, alt: "Battered old Mercedes sedans in slow Nouakchott traffic", caption: "The national car, Nouakchott" },
  { image: rallyCarsOnOreWagons, alt: "Rally cars loaded onto flatcars of the iron-ore railway", caption: "The cars ride the train too" },
  { image: adrarMesaSunset, alt: "The sun setting behind a flat-topped mesa in the Adrar", caption: "Adrar sunset" },
  { image: terjitCanyonDescent, alt: "Walking down into the palm-filled canyon of Terjit oasis", caption: "Into Terjit" },
  { image: adrarCanyonRoadGroup, alt: "The group resting on a canyon pass road wall in the Adrar", caption: "The pass above the canyon" },
  { image: ouadaneStoneLane, alt: "A dry-stone lane in the old town of Ouadane with a palm behind", caption: "Ouadane's old lanes" },
  { image: climbingOreWagon, alt: "A traveller climbing the ladder of an iron-ore wagon", caption: "Learning the wagons" },
  { image: railheadWaitDusk, alt: "A lone figure on the rails at dusk waiting for the ore train", caption: "Waiting for the train" },
  { image: nightOnTheOre, alt: "The group lying on the iron ore inside a wagon at night", caption: "The night on the ore" },
  { image: hiluxCrewDesert, alt: "The crew riding in the open bed of a Hilux in the desert", caption: "How you reach the Eye" },
  { image: insideTheRichat, alt: "A lone figure on a black-rock ridge inside the Richat Structure", caption: "Inside the Eye of the Sahara" },
  { image: desertDinnerWithHosts, alt: "Dinner on a mat at night with local hosts in the desert", caption: "Dinner in the desert" },
  { image: stuckInTheDunes, alt: "Digging a car out of soft dune sand", caption: "The desert collects its toll" },
  { image: rallyCarsFlagDunes, alt: "The crew celebrating on their cars with a Lithuanian flag in the dunes", caption: "Made it across" },
];

// Deliberately no tier totals here (destination playbook §8). The one number
// on this page is the unavoidable one - the flight pair - and it is labelled
// as what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Simple guesthouses, eating where the drivers eat, shared seats in the desert, and the free sights – which in Mauritania is most of them"],
  ["Core", "Proper guesthouses and auberges, a hired 4x4 with driver for the desert days, and the train ridden with the right kit"],
  ["Splurge", "Mauritania barely sells luxury. The ceiling is a better guesthouse, a private car and driver, and someone cooking for you – comfort here is bought in people, not in stars"],
];

const TIPS = [
  ["Know which money you are being quoted.", "Mauritania knocked a zero off its currency in 2018, and plenty of people still quote prices in the old ouguiya – ten times the real figure. Ask which one you are hearing and do the division before agreeing to anything. We learned this the memorable way; the full story is further down this page."],
  ["The train is real, and so is the ore.", "The iron-ore train keeps no timetable you can plan around, the ride people come for is on top of the open wagons, and the only warm thing aboard on a desert night is the ore itself. It is the best thing we did in the country and it rewards exactly the preparation it demands – ride it on tested information, not on a forum thread."],
  ["The advisory is the current document.", "Western governments mark eastern Mauritania near the Mali border as do-not-travel and most of the tourist west as check-first. Read your government's travel advice before booking and again before flying – and wherever you drive, stay on the driven tracks. Off them, the desert is nobody's guarantee."],
];

const FAQ = [
  ["Is Mauritania worth visiting?", "Yes – if the Sahara itself is the draw. This is the desert without the resort layer: an iron-ore train you ride on top of, a 40 km crater famous from space, oasis canyons, caravan-town ruins, and almost no other tourists at any of it. The first local we met who spoke English called it 'the best country in the world', and while that verdict took a currency mix-up to feel literally true, Mauritania ended up the favourite country of our whole West Africa rally. It is an experience destination, not a comfort one – and the experiences exist nowhere else."],
  ["Is Mauritania safe to visit?", "Check your government's travel advice first, and let it outrank everything – this page included. Western advisories mark eastern Mauritania near the Mali border as do-not-travel, and most of the tourist west – the coast, Nouakchott, the Adrar – as travel-with-heightened-care. We drove the western spine as part of a rally and met warmth everywhere; the risks we actually managed day to day were road ones: heat, sand, fuel and distance. Two rules stand regardless: near the northern border, stay on the driven tracks – old ordnance is a real hazard off them – and re-read the advisory just before you fly, because it moves faster than any guidebook."],
  ["Can you really ride the iron-ore train?", "Yes. It is a working freight line, not a tourist service: no timetable you can plan around and no tickets in any normal sense – a battered passenger carriage sometimes rides along, but the experience is the top of the train: you wait by the rails in the desert and climb onto the ore when it stops. People cross the world to do exactly that. We rode it through a cold Sahara night and it is the single best reason this country is on this site. It punishes casual attempts and rewards prepared ones; know how the boarding, the kit and the getting-off work before you stand at those rails."],
  ["Can you visit the Eye of the Sahara?", "Yes – and almost nobody does. Know what you are visiting: the rings are so wide that the famous shape never appears from the ground – what you get instead is a mountain rising at the centre, long curved ridges, and desert scenery that is a reward of its own. The prize is standing in the centre of a thing millions recognise from space, having crossed hours of sand and rock to do it; when we were there, the local check-in count stood at about a hundred and seventy. Getting there is the filter – ordinary cars do not survive the route, so the visit runs on a hired 4x4 with a local driver who knows the ground."],
  ["Can you fly over the Eye of the Sahara?", "Not on any tour we could find. When we checked there was no airfield at the structure and no balloon or scenic-flight operator offering the view – the famous image lives in satellite photos. The realistic way to see the shape from above is a window seat on a regular passenger plane whose route crosses the Adrar. On the ground the visit is the opposite experience, and the better one: you stand inside the thing the rest of the world only looks down at."],
  ["How many days do you need in Mauritania?", "Five to seven for the trip most people imagine: the Adrar's oases and caravan towns, the Eye of the Sahara, and the iron-ore train. Three to four covers the Adrar without the two big rides. The full overland crossing – Morocco to Senegal – is a two-week trip and a different kind of holiday. Whatever the number, leave slack around the train: it does not run on your schedule, so your schedule has to bend around it."],
  ["When is the best time to visit Mauritania?", "November to February. Winter is the Sahara at its most humane: warm days, cold nights, everything on the trip workable. By late spring the interior is brutal by mid-morning – we crossed in May and would not recommend it to anyone with a choice. The desert plays both sides of the thermometer all year: whatever the season, days cook and nights bite."],
  ["Do you need a 4x4 in Mauritania?", "Not for the spine of the country. The tarmac between Nouakchott and the Adrar is a normal road, and ordinary cars run it daily – our street-legal Subarus did. You need a real 4x4, with a local driver, for exactly one thing most visitors want: the Eye of the Sahara and the deep-desert ground around it. Hire that capability for the days that need it instead of carrying it all trip."],
  ["Do you need a visa for Mauritania?", "Most Western passports can obtain a visa on arrival – it exists, it works, and it is how we entered at the land border. Rules and fees move, so verify against an official source close to travel, not a forum thread. And allow real time at any Mauritanian border: paperwork here is a human process, not a machine one."],
  ["Is Mauritania expensive?", "Getting there is the expensive part – return flights from Europe run about €700, and that is the number to plan around. The country itself is cheap: beds are modest and priced to match, food is simple and costs little, and most of what you came for – the desert, the ruins, the coast – is free to look at. The two paid pillars of a good trip are the hired 4x4 days and the train ride done properly. Budget flights-first and the rest follows."],
  ["What should I know about money in Mauritania?", "That there are two of it. The ouguiya was redenominated in 2018 – one zero dropped – and many people still quote prices in the old money, ten times the real figure. Ask which one you are hearing and do the division before agreeing to anything. Then plan your cash down to the end of the trip: the ouguiya is effectively worthless outside the country, and changing leftovers back later is a workaround, not a transaction."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Mauritania guide SKU is live yet (two are planned: the iron-ore train
// weekend and the Eye of the Sahara short week). The fetch takes all guides so
// each future SKU appears as its own card with no code change; until then the
// guide sections and the BuyBox simply do not render.
const GUIDE_BLURBS = {};

async function fetchMauritaniaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "mauritania" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "mauritania" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function MauritaniaDestinationPage() {
  const { guides, stories } = await fetchMauritaniaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Mauritania: is it worth visiting, is it safe, and how many days you need",
        description:
          "Whether Mauritania is worth it, how safe it is, when to go and what getting there costs – the iron-ore train, the Eye of the Sahara, and the desert between them.",
        datePublished: "2026-09-01",
        dateModified: "2026-09-01",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Mauritania" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/mauritania",
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
        <span className="text-slate-600">Mauritania</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North & West Africa · The Sahara
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Mauritania
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth it, is it safe, and how many days you need – for the
          iron-ore train, the Eye of the Sahara, and the desert that makes
          both possible.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={ridingEmptyOreWagons}
              alt="Travellers riding on top of an empty iron-ore wagon rake through the desert, Mauritania"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Mauritania worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Mauritania was the country nobody in our rally convoy expected
                anything from, and it became the favourite of the whole trip.
                The first local we met who spoke English called it "the best
                country in the world" – and though it took a currency mix-up
                for that to feel literally true for an afternoon, the verdict
                held. This is the Sahara with no resort layer over it: real
                desert, real towns, real work, and visitors so rare that
                nothing has been rebuilt to face them.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: ride on top of a three-kilometre iron-ore
                train through a desert night, stand in the centre of a crater
                the rest of the world only knows from satellite photos, walk
                stone caravan towns that emptied centuries ago and have no
                ticket booth, cool off in an oasis wedged into a canyon, and
                watch painted pirogues land through the Atlantic surf. Between
                all of it runs the emptiness itself – mesas, dunes and long
                straight tarmac – which is not the gap between the sights but
                half the reason to come.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats: this is a hard-travel country, not a
                comfortable one. Parts of it are under Western travel
                advisories and the paperwork runs at a human pace; comfort
                tops out at a good guesthouse; and the desert is indifferent
                to your plans – heat, sand, fuel and distance are the real
                daily risks. None of that is a reason to stay away. It is the
                reason the train, the Eye and the ruins still feel the way
                they do.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Winter, clearly. This trip is the Sahara, and the Sahara
                decides: November to February is the season when every part
                of it works.
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
                Mauritania scales cleanly: the Adrar is the core, the train
                and the Eye are the reasons to stretch, and the full coast-to-
                border crossing is its own kind of trip.
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
                Fly into Nouakchott – Paris is the main gateway, nonstop or
                via Casablanca – or arrive overland from Morocco in the north
                or Senegal in the south, the way the overlanders do. Most
                Western passports can get a visa on arrival; verify the
                current rules against an official source close to travel, and
                budget patience at every border.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground the country splits in two. The tarmac spine –
                the coast road and the highway up into the Adrar – is normal
                driving in a normal car. The deep desert is not: the Eye of
                the Sahara and the ground around it run on a hired 4x4 with a
                local driver, and the train ride starts wherever the train
                decides to stop. The practical shape of a good trip is a
                normal car (or shared transport) for the spine, plus hired
                capability for the days that need it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The rules that matter everywhere: carry cash and know which
                ouguiya a price is quoted in; fuel up whenever a working pump
                appears, because whole stretches can be dry at once; and stay
                on driven tracks near the northern border, where old ordnance
                remains a real hazard off them. None of these complicate the
                trip once you plan around them.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the only big unavoidable line: return flights
                from Europe run about €700. That is what reaching Mauritania
                costs, not what the trip costs – because on the ground this is
                one of the cheapest destinations on this site. Most of what
                you come for is free to stand in front of; the rest is a
                decision:
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
                The line with real range is the hired 4x4 and driver for the
                desert days – it is also the line most worth paying, because
                the driver is the difference between visiting the deep desert
                and being stuck in it. Beds are modest everywhere and never
                the budget's problem.
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
                src={adrarPlateauVista}
                alt="The empty Adrar plateau stretching to the horizon, Mauritania"
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
                <SectionHeading>Stories from Mauritania</SectionHeading>
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

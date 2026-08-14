import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";

import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

/* Fixed page slots: hero, one card per part of the atoll, mid-page banner.
   Rearranged by the founder 2026-08-13: hero is the narrowest-point road, the
   former hero (leaning palm) moved to the banner slot. */
import narrowestPointRoad from "../../../../content/countries/tuvalu/destination/generated/web/narrowest-point-road.jpg";
import leaningPalm from "../../../../content/countries/tuvalu/destination/generated/web/leaning-palm-lagoon.jpg";
import tuvaluRdSign from "../../../../content/countries/tuvalu/destination/generated/web/tuvalu-rd-sign.jpg";
import runwayCentreline from "../../../../content/countries/tuvalu/destination/generated/web/runway-centreline-standing.jpg";
import isletBeachFromWater from "../../../../content/countries/tuvalu/destination/generated/web/islet-beach-from-water.jpg";
import southernSpitLowTide from "../../../../content/countries/tuvalu/destination/generated/web/southern-spit-low-tide.jpg";
import northRoadDawnRun from "../../../../content/countries/tuvalu/destination/generated/web/north-road-dawn-run.jpg";

/* Carousel — the rest of the trip, in trip order. */
import fijiLinkAtr from "../../../../content/countries/tuvalu/destination/generated/web/fiji-link-atr.jpg";
import atrParkedApron from "../../../../content/countries/tuvalu/destination/generated/web/atr-parked-apron.jpg";
import tugboatWreck from "../../../../content/countries/tuvalu/destination/generated/web/tugboat-wreck.jpg";
import governmentBuilding from "../../../../content/countries/tuvalu/destination/generated/web/government-building-palms.jpg";
import villageRoadRedSkiff from "../../../../content/countries/tuvalu/destination/generated/web/village-road-red-skiff.jpg";
import kidsCyclingCoralFlat from "../../../../content/countries/tuvalu/destination/generated/web/kids-cycling-coral-flat.jpg";
import causewayContainers from "../../../../content/countries/tuvalu/destination/generated/web/causeway-containers.jpg";
import whiteSandSpit from "../../../../content/countries/tuvalu/destination/generated/web/white-sand-spit.jpg";
import boatBowIslet from "../../../../content/countries/tuvalu/destination/generated/web/boat-bow-islet.jpg";
import isletSandbar from "../../../../content/countries/tuvalu/destination/generated/web/islet-sandbar.jpg";
import isletDriftwood from "../../../../content/countries/tuvalu/destination/generated/web/islet-driftwood.jpg";
import isletPalmsShade from "../../../../content/countries/tuvalu/destination/generated/web/islet-palms-shade.jpg";
import isletStormLight from "../../../../content/countries/tuvalu/destination/generated/web/islet-storm-light.jpg";
import isletWindblown from "../../../../content/countries/tuvalu/destination/generated/web/islet-windblown.jpg";
import isletOpenOcean from "../../../../content/countries/tuvalu/destination/generated/web/islet-open-ocean.jpg";
import southSpitIslet from "../../../../content/countries/tuvalu/destination/generated/web/south-spit-islet.jpg";
import palmTunnelRoad from "../../../../content/countries/tuvalu/destination/generated/web/palm-tunnel-road.jpg";
import atollFromAir from "../../../../content/countries/tuvalu/destination/generated/web/atoll-from-air.jpg";

export const metadata = {
  title: "Tuvalu: how to visit the world's least-visited country · TestedRoutes",
  description:
    "Fewer than 4,000 people a year see Tuvalu. How to get there via Fiji, how many days the flight gap gives you, what it costs, and what you actually do on Funafuti.",
  alternates: { canonical: "/destinations/tuvalu" },
  openGraph: {
    type: "article",
    url: "/destinations/tuvalu",
    title: "Tuvalu: how to visit the world's least-visited country",
    description:
      "How to get to Tuvalu via Fiji, how many days the flight gap gives you, what it costs, and what you actually do on Funafuti.",
  },
};

const WHEN_TO_GO = [
  ["May to October", "The dry season and the sensible window: less rain, steadier weather, and the lagoon at its calmest."],
  ["June to September", "The best of it. This is when the guide's plan was tested."],
  ["November to April", "The wet season, and cyclone season within it. Flights and the lagoon both get less predictable."],
  ["What I would pick", "Any dry-season flight pair that fits your Fiji routing. There is no high season to dodge - fewer than 4,000 visitors a year means nothing here is ever crowded."],
];

const HOW_LONG = [
  ["Two full days", "What one flight gap gives you, and enough for the whole of Funafuti: the town, the runway at dusk, a boat day across the lagoon and the island's far tips. This is the trip the guide plans hour by hour."],
  ["Five to seven days", "Two flight gaps, or one long one. The extra days do not add sights - they add pace, a second boat morning, and the chance the weather rolls a day without costing you the trip."],
  ["Longer", "Only worth it if you are chasing the outer atolls, which means the government ferry: days at sea each way, word-of-mouth schedules, and genuine expedition territory."],
];

const REGIONS = [
  {
    name: "Vaiaku, the capital",
    image: tuvaluRdSign,
    alt: "Standing at the TUVALU RD street sign in Vaiaku at dusk",
    body: "The whole apparatus of a nation in a village: the government building is the tallest thing in the country, the falekaupule meeting hall is the heart of it, and the one hotel faces the lagoon sunset. Everything is under ten minutes on foot, including the honour-system prison and a swimming beach with a shipwreck on it.",
  },
  {
    name: "The runway",
    image: runwayCentreline,
    alt: "Standing alone on the centreline of Funafuti's runway",
    body: "A third of the island is airstrip, there is no fence, and planes land a few times a week. The rest of the time it is the town square: football and volleyball as the heat drops, families walking the centreline, kids on bikes. Crossings close when the ATR appears - the guide builds the rule into departure day.",
  },
  {
    name: "The lagoon islets",
    image: isletBeachFromWater,
    alt: "A lagoon islet's white beach and palms seen from the water, nobody on it",
    body: "Tepuka, Te Afualiku and Fualifeke sit on the lagoon's western rim: white sand, leaning palms, and nobody on any of them. There is no tour and no website - a local boat is arranged in person, and the wet 30-minute crossing is half the fun. This is the best thing the country has.",
  },
  {
    name: "The southern spit",
    image: southernSpitLowTide,
    alt: "The rubble spit at low tide running out toward the islet off Fongafale's southern tip",
    body: "South of town the island narrows to a quiet tail: reef on both sides, almost no traffic, and a tidal islet off the end that connects and disconnects with the water. The classic early-morning run or walk before the day warms up.",
  },
  {
    name: "The ocean side and the north",
    image: northRoadDawnRun,
    alt: "Running the palm-lined north road at dawn, Funafuti",
    body: "The lagoon side is calm and swimmable; the ocean side is reef shelf and surf, best at dawn. North of town the road runs through a green tunnel of palms to Tengako's quiet beaches - about 10 km each way, made for a hired bicycle or scooter, past the point where the island narrows to roughly 60 metres.",
  },
];

/* Trip photos in trip order: arrival, town, the boat day, the north, departure. */
const CAROUSEL = [
  { image: fijiLinkAtr, alt: "The Fiji Airways ATR 72 on the apron - the only way into Tuvalu", caption: "The only way in: the ATR from Fiji" },
  { image: atrParkedApron, alt: "The ATR parked at Funafuti's airstrip under big clouds", caption: "Landed - the strip and the terminal" },
  { image: tugboatWreck, alt: "A rusting tugboat beached on the lagoon shore", caption: "The tugboat wreck north of town" },
  { image: governmentBuilding, alt: "The three-storey government building of Tuvalu behind palms in Vaiaku", caption: "The tallest building in the country" },
  { image: villageRoadRedSkiff, alt: "The village main road with a red skiff parked beside it", caption: "Boats live in front yards here" },
  { image: kidsCyclingCoralFlat, alt: "Two kids cycling across the bare coral flat under a huge sky", caption: "The coral flat at low tide" },
  { image: causewayContainers, alt: "The geotube causeway with shipping containers stacked beside it", caption: "The causeway - everything arrives by ship" },
  { image: whiteSandSpit, alt: "The white sand spit north of the village, wide and empty", caption: "The beach north of the village" },
  { image: boatBowIslet, alt: "The bow of an open boat pointed at a lagoon islet", caption: "Crossing the lagoon by open boat" },
  { image: isletSandbar, alt: "A tree-topped islet and its white sandbar in Funafuti's lagoon", caption: "The islets - sand, palms, nobody" },
  { image: isletDriftwood, alt: "Driftwood on an empty islet beach with palms leaning overhead", caption: "Tepuka's beach, footprints ours only" },
  { image: isletPalmsShade, alt: "Palms leaning over an empty islet beach", caption: "Shade where you find it" },
  { image: isletStormLight, alt: "A lagoon islet under dramatic storm light", caption: "The lagoon's weather moods" },
  { image: isletWindblown, alt: "A windblown islet seen from its own beach", caption: "The windward side" },
  { image: isletOpenOcean, alt: "A lone islet in deep-blue open ocean", caption: "How small it all is" },
  { image: southSpitIslet, alt: "The tree-topped islet off the southern tip of Fongafale across the shallows", caption: "The tidal islet off the southern tip" },
  { image: palmTunnelRoad, alt: "The north road running through a green tunnel of palms", caption: "The green tunnel to Tengako" },
  { image: atollFromAir, alt: "The whole Funafuti atoll ring seen from the plane window", caption: "The country, from the climb-out" },
];

const TIPS = [
  ["Arrange the boat on day one, not on boat day.", "The lagoon islets are the best thing in the country and there is no operator, no website and no counter. Ask at the hotel desk and around town on the afternoon you land. AUD 150-250 for the boat, fuel included, is a fair quote - it is per boat, not per head, so four people nearly halve the day."],
  ["Land carrying the trip in cash.", "Australian dollars run the island. The first ATMs only arrived in 2025, card acceptance is new and patchy, and the bank keeps short weekday hours across the runway. Mixed notes, agreed prices, exact change."],
  ["Plan around Sunday before you book the flights.", "The island keeps Sunday strictly: shops shut, boats rest, and no amount of money changes it. If your flight gap includes a Sunday, put the boat day on the weekday and keep Sunday for the walk south. A boat can still be found - start asking Saturday morning and accept a later start."],
  ["Sit left flying in, right flying out.", "The atoll approach is the best aerial view of the trip: a ring of coral holding a lagoon. Two and a half hours over open ocean each way, and the window seat costs nothing."],
  ["Expect the evening pause.", "Around 18:45 the island stops for evening devotion - about fifteen minutes. Not everyone observes it, but if police wave you off the road, wait it out. It is a custom, not an inconvenience."],
  ["Keep a buffer night in Fiji.", "Weather holds the ATR in Suva more often than it cancels. Nothing on Funafuti needs rebooking - the hotel will have you back - but an onward flight booked for the same evening is asking for trouble."],
  ["Walk the runway at dusk.", "When the heat drops, the airstrip becomes the island's living room: football, volleyball, families on the centreline. Join in. It is the single most Tuvaluan hour of the trip."],
];

const FAQ = [
  ["What is the least visited country in the world?", "Tuvalu, by most counts: fewer than 4,000 visitors a year. It is a nine-island nation of about 11,000 people in the central Pacific, and its capital atoll Funafuti is the only part with flights, so almost every visit is a visit to Funafuti."],
  ["Is Tuvalu worth visiting?", "Yes, if the appeal is the place itself rather than sights. There is one hotel, one restaurant and no tourism industry - what you get instead is a runway that turns into the town square at dusk, empty lagoon islets arranged by handshake, and a country you can genuinely walk end to end. If you need resorts and menus, no."],
  ["How do you get to Tuvalu?", "Fly Fiji Airways from Suva, about three times a week on a rotating schedule - roughly 2.5 hours over open ocean. There is no other scheduled way in. Book the flight pair first: the gap between two flights is your trip length, and everything else follows from it."],
  ["How many days do you need in Tuvalu?", "Two full days covers Funafuti properly: the town and runway on day one, the lagoon islets and the island's far tips on day two. That is exactly what one flight gap gives you. More days add pace and weather margin, not sights."],
  ["How much does a trip to Tuvalu cost?", "The unavoidable part is the flight pair from Fiji: about EUR 785 per person return. On the island the money is small - a double room around AUD 100 a night, meals modest, the boat shared per boat, bikes about AUD 10 a day. The guide itemises all of it in AUD and EUR."],
  ["Do you need a visa for Tuvalu?", "Most passports get a 30-day visitor permit stamped on arrival - free for many nationalities, a fee for some. Check yours before flying; you will also need a passport valid six months beyond arrival and an onward ticket, which is checked at Suva check-in."],
  ["Can you pay by card in Tuvalu?", "Barely. Cash runs the island: Australian dollars, carried in with you. The first ATMs arrived in 2025 and card acceptance is new and patchy, so treat any card as a backup, not a plan."],
  ["Is there internet in Tuvalu?", "Slower and scarcer than you are used to. No eSIM works; a local TTC SIM from the airport kiosk is the reliable option, cash only, and some hosts share Starlink Wi-Fi for a small daily fee. Download offline maps before you fly."],
  ["What happens in Tuvalu on Sunday?", "The island keeps it: shops shut, boats rest, and the day belongs to church. Plan anything that needs hiring or arranging for a weekday. There is also a daily pause - around 18:45 the island stops for evening devotion for about fifteen minutes."],
  ["Is Tuvalu sinking?", "The risk is real - the country's highest natural ground is only a few metres above the sea - and Tuvalu is actively raising land: the Coastal Adaptation Project has pumped a new stretch of reclaimed land along Funafuti's lagoon shore, which is now the island's best open space for an evening walk. For a visitor the practical effect is simple: this is a place to see deliberately, not eventually."],
  ["Is Tuvalu safe?", "Very. The prison runs on an honour system and mostly stands empty, which says most of it. The real hazards are sun, heat and current: no shade on the water, a reef-shelf ocean side that is not for swimming, and one hospital - bring your own medications."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchTuvaluContent() {
  try {
    return await client.fetch(
      `{
        "guide": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "tuvalu" && (language == "en" || !defined(language))][0]{
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "tuvalu" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function TuvaluDestinationPage() {
  const { guide, stories } = await fetchTuvaluContent();
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Tuvalu: how to visit the world's least-visited country",
        description:
          "How to get to Tuvalu via Fiji, how many days the flight gap gives you, what it costs, and what you actually do on Funafuti.",
        datePublished: "2026-08-13",
        dateModified: "2026-08-13",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Tuvalu" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/tuvalu",
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
        <span className="text-slate-600">Tuvalu</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Oceania &amp; Pacific · Central Pacific
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Tuvalu
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How to visit the world&apos;s least-visited country – from two days on
          Funafuti, arranged the way the island actually works.
        </p>
        <Byline lang="en" />
      </header>

      {/* Content left, guide buy box right — same shape as the guide page. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={narrowestPointRoad}
              alt="The road at Fongafale's narrowest point with the lagoon and the open Pacific on either side"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Tuvalu worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fewer than 4,000 people a year see Tuvalu, which makes it, by
                most counts, the least-visited country on earth. I went on my
                honeymoon – we were the only honeymooners in the country – and
                the honest answer to &quot;is it worth it&quot; is yes, provided
                you want the place and not a product. There is no tourism
                industry to meet you. That is the appeal.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: you walk a capital that is really a
                village, swim at a beach with a shipwreck on it, and watch a
                third of the country – the runway – turn into the town square
                at dusk, when the heat drops and half the island comes out to
                play on the tarmac. You cross the lagoon in an open boat to
                islets with nobody on them, and you ride the one road north
                through a green tunnel of palms to beaches locals keep for the
                weekend. None of it is staged, because there is nobody to stage
                it for.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The constraint that shapes everything is the flight schedule:
                about three services a week from Fiji, so the gap between two
                flights is your trip, whether that suits you or not. Beds are
                few enough to count, one restaurant works, cash runs the
                island, and the best day of the trip is arranged by asking
                around town rather than by booking anything. Know that going
                in, and the country rewards you for it.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Temperatures barely move all year – 29 to 31 degrees and humid
                – so season is about rain and wind, not heat. The dry season is
                the window; the wet season brings squalls and, at its heart,
                cyclone risk.
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
                In Tuvalu this question answers itself: the flight schedule
                decides, and you choose which gap to buy.
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
                  plans the two-day version hour by hour, with the boat-day
                  playbook, the three beds in booking order and the runway
                  rules built in.
                </p>
              ) : null}
            </section>

            <section className="space-y-6">
              <SectionHeading>One atoll, five places</SectionHeading>
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
                One route in: Fiji Airways from Suva, about three times a week,
                roughly 2.5 hours over open ocean in an ATR turboprop. The
                weekdays rotate by season and the occasional rotation runs via
                Nadi, so confirm the days when you book rather than assuming
                them. Fly into Fiji, connect to Suva, and treat the Tuvalu pair
                as the first booking of the whole trip – everything else hangs
                off it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground there is nothing to rent with four wheels, and no
                need: the terminal is minutes on foot from every bed in town.
                Lodges hire scooters for about AUD 20 a day and bicycles for
                about AUD 10, hitching a short lift is normal and free, and one
                road runs the island end to end – you cannot get lost. The
                lagoon boat is the exception: no operator exists, so it is
                arranged in person on day one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Paperwork is light: a 30-day visitor permit stamped on arrival
                for most passports, a passport valid six months beyond the trip,
                and an onward ticket, which is checked at Suva check-in. Save
                the hotel&apos;s booking reply offline – confirmation emails are
                how things are done, and the connectivity to re-download one is
                not guaranteed.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The unavoidable part is the flights: the Suva–Funafuti return
                runs about <strong>EUR 785 per person</strong>, and it dwarfs
                every other line. That is what getting there costs, not what
                the trip costs – because once you land, Tuvalu is one of the
                cheapest countries you will ever stand in.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the island the money is small and mostly cash: a double room
                at the hotel around AUD 100 a night, guesthouses less, meals
                modest, bikes about AUD 10 a day. The boat day is priced per
                boat rather than per head, so a shared boat nearly halves the
                best day of the trip. There is no lean-versus-splurge decision
                to make here – the island offers one level, and it is
                inexpensive. The guide itemises the whole trip in AUD and EUR,
                per person, including the flight pair.
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
                src={leaningPalm}
                alt="A palm leaning over the turquoise shallows of a lagoon islet, Funafuti, Tuvalu"
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
                      Two days and a fly-out morning, hour by hour. The boat-day
                      playbook with a fair price to agree, the three beds in
                      booking order with QR links, the full cost breakdown in
                      AUD and EUR, and the companion Google map with every pin.
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
                <SectionHeading>Stories from Tuvalu</SectionHeading>
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

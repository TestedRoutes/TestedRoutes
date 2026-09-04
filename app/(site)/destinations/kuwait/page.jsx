import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import marinaPierNight from "../../../../content/countries/kuwait/destination/generated/web/marina-pier-at-night.jpg";
import winterCampLit from "../../../../content/countries/kuwait/destination/generated/web/winter-camp-lit-in-the-desert.jpg";
import soukFoodCourtyard from "../../../../content/countries/kuwait/destination/generated/web/souk-food-courtyard.jpg";
import dhowPortHulls from "../../../../content/countries/kuwait/destination/generated/web/dhow-port-wooden-hulls.jpg";
import desertDuskCar from "../../../../content/countries/kuwait/destination/generated/web/desert-dusk-from-the-car.jpg";
import soukTeaLane from "../../../../content/countries/kuwait/destination/generated/web/souk-tea-house-lane.jpg";
import fishMarketHall from "../../../../content/countries/kuwait/destination/generated/web/fish-market-hall.jpg";
import safatSquare from "../../../../content/countries/kuwait/destination/generated/web/safat-square-fountains.jpg";
import grandMosque from "../../../../content/countries/kuwait/destination/generated/web/grand-mosque-from-the-street.jpg";
import founderDhow from "../../../../content/countries/kuwait/destination/generated/web/founder-at-the-wooden-dhow.jpg";
import marinaYachts from "../../../../content/countries/kuwait/destination/generated/web/marina-yachts-and-skyline.jpg";
import bayFromAbove from "../../../../content/countries/kuwait/destination/generated/web/bay-and-coast-road-from-above.jpg";
import founderTowers from "../../../../content/countries/kuwait/destination/generated/web/founder-below-kuwait-towers.jpg";
import skylineCauseway from "../../../../content/countries/kuwait/destination/generated/web/skyline-from-the-causeway.jpg";
import desertSunsetHighway from "../../../../content/countries/kuwait/destination/generated/web/desert-sunset-over-the-highway.jpg";
import marinaFlagpoleNight from "../../../../content/countries/kuwait/destination/generated/web/marina-flagpole-at-night.jpg";
import waterfrontArcadeNight from "../../../../content/countries/kuwait/destination/generated/web/waterfront-arcade-at-night.jpg";
import nightSkylineMarina from "../../../../content/countries/kuwait/destination/generated/web/night-skyline-from-the-marina.jpg";

/*
 * Scope note (founder decision, 2026-08-14): this page sells the DECISION -
 * whether Kuwait is worth a stop, how long, when. Everything operational
 * (booking mechanics, fares, opening windows, within-day sequencing, primary
 * picks, fallbacks) belongs to the paid guide and is deliberately absent
 * here. FAQ answers open with the decision half of the answer, then refer to
 * the guide for the mechanics. The only execution-flavoured facts allowed
 * are ones a published inspire story already gives away (the visa-expiry
 * trap, "nobody walks"). When editing, the test is: could a reader run a
 * day of the trip from this page? If yes, cut until they cannot.
 */

export const metadata = {
  title: "Kuwait: is it worth a stop, and how long you actually need · TestedRoutes",
  description:
    "Whether Kuwait is worth visiting, how long you need, when to go, and what it costs – from the layover version to the two-day trip with a Bronze-Age island and the desert at dusk.",
  alternates: { canonical: "/destinations/kuwait" },
  openGraph: {
    type: "article",
    url: "/destinations/kuwait",
    title: "Kuwait: is it worth a stop, and how long you actually need",
    description:
      "The city in a day, the island and the desert on day two, and why the day of the week matters more than the month.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The season. Mild, walkable days, cool evenings with a sea wind, and the desert filling up with the winter tent camps – they exist from about mid-November to mid-March, and after dark they are the best thing in the country."],
  ["April and October", "The shoulders. Hot but workable. The camps are gone or going, so the desert half of the trip loses its payoff."],
  ["May to September", "No. Summer runs past 45 °C, life moves indoors, and walking the old town – most of day one – stops being pleasant at all."],
  ["What I would pick", "December or January for the camps at their fullest, accepting jacket weather in the evenings; late February if you want the mildest walking days and can live without the busiest tent season. Either way, the day of the week matters more than the month – see below."],
];

const HOW_LONG = [
  ["Under 24 hours", "The city, and it genuinely fits – the old souk, the dhow harbour and the towers make one of the better layover days anywhere. How well it fits depends on which weekday you land and what you do in what order, which is exactly what the guide times out."],
  ["Two days", "The version almost nobody takes, and the reason to stay a night: a boat to Failaka island – Bronze-Age ruins, a tank graveyard from 1990, an abandoned town – then the desert at dusk, when the winter camps switch their lights on. Day one is the city; day two is a different country."],
  ["Three or more", "Honestly, no. The remaining museums fill half a day at most, and the rest of the country is desert you have already seen, oil infrastructure you cannot photograph, and border towns with nothing in them. Kuwait is a superb stop and a poor holiday – two days is the right amount."],
];

const REGIONS = [
  {
    name: "The old town",
    image: soukFoodCourtyard,
    alt: "The open-air food courtyard of Souk Al-Mubarakiya under its timber roof, tables and heaters between the trees",
    body: "Souk Al-Mubarakiya is two hundred years of market under one roof – perfume, oud, gold, dates and spices, tea brewed over coals in the lanes, and free museums hidden inside it. The Grand Mosque and the Liberation Tower stand over the same few streets. This is the half of Kuwait that feels its age, and you will have much of it to yourself.",
  },
  {
    name: "The waterfront",
    image: dhowPortHulls,
    alt: "Wooden dhows moored hull to hull at the dhow harbour, white rocks in the foreground",
    body: "The city faces the Gulf along one long corniche: hundreds of working wooden dhows moored hull to hull, a fish market with the catch coming in under blue mosaics, and Kuwait Towers – the country's postcard – with the whole bay visible from the sphere. Nobody walks in Kuwait, so the best promenade in the Gulf is usually empty.",
  },
  {
    name: "The desert and the island",
    image: desertDuskCar,
    alt: "The desert highway at dusk from the car, power lines running to the horizon",
    body: "Cross the bay and the desert begins: empty ground, big sky, and – in winter – whole villages of lit tents appearing at dusk, the country's favourite tradition. Offshore sits Failaka, a Bronze-Age Greek trading post turned 1990 battlefield, reachable by boat and visited by almost nobody. Together they are the second day, and the reason the stop becomes a trip.",
  },
];

/* Trip photos, roughly in route order: old town, waterfront, towers, bay, desert, night. */
const CAROUSEL = [
  { image: soukTeaLane, alt: "Men drinking tea on benches in a lane of Souk Al-Mubarakiya", caption: "Tea in the souk lanes" },
  { image: fishMarketHall, alt: "The fish market hall with the day's catch on the counters", caption: "The fish market" },
  { image: safatSquare, alt: "The fountains of Safat Square with the Liberation Tower behind", caption: "Safat Square" },
  { image: grandMosque, alt: "The Grand Mosque of Kuwait from the street, palms along its wall", caption: "The Grand Mosque" },
  { image: founderDhow, alt: "The founder in front of the wooden dhow at the maritime museum", caption: "The maritime museum's dhow" },
  { image: marinaYachts, alt: "Yachts at Souq Sharq marina with the skyline behind", caption: "Souq Sharq marina" },
  { image: bayFromAbove, alt: "The bay and the coast road seen from the Kuwait Towers sphere", caption: "The bay from the towers" },
  { image: founderTowers, alt: "The founder below Kuwait Towers with the sun behind the spheres", caption: "Below Kuwait Towers" },
  { image: skylineCauseway, alt: "The Kuwait City skyline across the water from the causeway", caption: "The skyline from the causeway" },
  { image: desertSunsetHighway, alt: "Sunset over the desert highway north of the bay", caption: "The desert road at sunset" },
  { image: marinaFlagpoleNight, alt: "The marina flagpole at night with the lit skyline behind", caption: "The marina after dark" },
  { image: waterfrontArcadeNight, alt: "A lit waterfront arcade at night", caption: "The waterfront at night" },
  { image: nightSkylineMarina, alt: "The night skyline from the marina, towers lit along the water", caption: "The night skyline" },
];

// Deliberately no tier totals here. The guide costs all three levels out line
// by line; publishing totals on a free page gives away the research and
// anchors a reader on a number before they know what is optional inside it.
const COSTS = [
  ["Lean", "A budget room, eating where the city eats, and none of the paid bookings – most of the trip is free to look at"],
  ["Core", "The route as written: a mid-range hotel, the boat, the towers, and proper dinners"],
  ["Splurge", "A waterfront five-star, both museums, and dinner inside a full-size wooden dhow"],
];

const TIPS = [
  ["Check the visa expiry, not the approval.", "My e-visa, approved months ahead, had expired before I ever used it – Kuwait issues them with their own clock running. Visa on arrival saved the day, but check the dates before you fly and spare yourself the airport arithmetic."],
  ["Plan around Friday, not the weather.", "The Kuwaiti weekend is Friday and Saturday, and Friday closes more of the country than you expect – so a European Saturday-Sunday city break lands on the two worst days. Put the city day on a weekday. The guide plans both days around what is actually open when."],
  ["Leave the duty-free at your departure airport.", "Kuwait is completely dry and none may be brought in – bottles are seized on arrival. Dinner is the whole evening out here, and the country runs perfectly well on juice, tea and the best fruit cocktails in the Gulf."],
];

const FAQ = [
  ["Is Kuwait worth visiting?", "Yes – for a day or two, and on purpose. It is the Gulf without the theme park: a real old souk, a working dhow harbour, one iconic tower, and a desert culture that still actually happens every winter. It gets written off as a layover because the city genuinely fits in a day; the mistake is thinking that is all there is. The second day – a Bronze-Age island by boat and the tent camps lighting up at dusk – is the part almost nobody sees."],
  ["Is Kuwait safe to visit?", "The city itself is calm and low-crime, and I travelled it recently without issue. But check your government's travel advice before you book and again before you fly – conditions in the wider region have changed quickly, and advisories move faster than guidebooks. The UK's is at gov.uk/foreign-travel-advice/kuwait. Two hard local rules: never photograph government, military or oil sites, and never drive off-road in the desert, where landmines from 1990 remain."],
  ["How many days do you need in Kuwait?", "One day covers the city properly – the souk, the harbour and the towers. Two days is the right trip: the second buys you Failaka island and the desert at dusk, which is a different country from the first day. More than two adds little; Kuwait is a superb stop and a poor holiday. The guide is built around the two-day version, with the city day planned so it works as a standalone layover."],
  ["What can you do on a Kuwait layover?", "A lot – the city is about twenty minutes from the airport, visas are straightforward for most passports, and the old town, the harbour and the towers make one of the better layover days anywhere. Whether your hours land well depends on the weekday and the order you do things in, and that is precisely what the guide times out, landing to boarding."],
  ["Can you drink alcohol in Kuwait?", "No. Alcohol is illegal to sell, serve, carry or import anywhere in the country, including hotel bars, and duty-free bottles are seized at the airport. Dinner culture fills the gap – restaurants are the whole evening out, and tables turn late."],
  ["When is the best time to visit Kuwait?", "November to March. Winter days are mild with cool evenings, and the desert tent camps – the best thing in the country after dark – exist from about mid-November to mid-March. Summer regularly passes 45 °C and is genuinely not usable for this trip. Whatever the month, put the city day on a weekday: the Kuwaiti weekend is Friday and Saturday, and Friday closes more than you expect."],
  ["Do you need a car in Kuwait?", "Yes, or someone driving one. Kuwait is built around cars and car parks; distances between sights are short but unwalkable in aggregate, and there is no metro. A rental is the cheap answer and a driver-guide for the day is the comfortable one – the guide prices both, covers the paperwork that rental desks actually ask for, and says which one suits which traveller."],
  ["Can you visit Failaka island?", "Yes – a half-day by passenger boat from the city, and the reason to stay a second day: Bronze-Age Greek ruins, a tank graveyard left from 1990, and a whole abandoned town. The crossings are tide-dependent and most listings are wrong about how the tickets actually work, so this is the one part of the trip worth doing on tested information – the guide carries the confirmation step, the ticket rule and the island logistics."],
  ["What days is the weekend in Kuwait?", "Friday and Saturday – the working week is Sunday to Thursday. That one fact shapes the whole trip: Friday closes much of what a visitor comes for, and hotel prices run opposite to Europe's, higher midweek than at the weekend. The guide plans both days around it."],
  ["Do you need a visa for Kuwait?", "Most Western passports get a visa on arrival or an e-visa ahead of time. The trap is the e-visa's expiry: Kuwait issues them valid from approval, not from travel, so one approved months early can be dead before you fly – mine was. Check the expiry date, not just the approval."],
  ["What are the winter desert camps?", "From about mid-November to mid-March, Kuwaiti families move out to licensed tent camps in the desert – generators, satellite dishes and strings of lights included – to live, for a season, the way their grandparents did. After dark the desert on both sides of the road fills with lit villages of tents. It is the country's favourite tradition, it empties the city at weekends, and seen at dusk it is the best free sight in Kuwait. The guide times day two so you reach it exactly as the light goes."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

/*
 * Kuwait has one guide SKU today, but the hub inherited the `[0]` fetch that
 * bit Iceland and Samoa the day their second SKU published: hard-coded
 * primary sales copy rendered over whichever guide happened to sort first.
 * So the fetch takes all guides - a future second SKU appears as its own
 * card with no code change - and the 2-day weekend is resolved by slug as
 * the hub's primary, since the inline guide sentences and the BuyBox
 * describe that version specifically.
 */
const WEEKEND_SLUG = "kuwait-2-days";

// Card blurbs per SKU, keyed by guide slug. Scope boundary (destination
// playbook §7): each blurb sells what this page deliberately withholds -
// mechanics are asserted to exist, never demonstrated. No fares, clock
// times, booking channels or within-day sequencing. Unknown future SKUs
// fall back to the guide's own subtitle.
const GUIDE_BLURBS = {
  [WEEKEND_SLUG]:
    "Everything this page deliberately leaves out: both days hour by hour, the ferry procedure and its confirmation step, every booking in the order it has to be made, nine hotels and nine restaurants each with a QR link, a three-tier budget, and the companion Google map with every pin.",
};

async function fetchKuwaitContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "kuwait" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "kuwait" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function KuwaitDestinationPage() {
  const { guides, stories } = await fetchKuwaitContent();
  const guide =
    guides?.find((g) => g.slug === WEEKEND_SLUG) ?? guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Kuwait: is it worth a stop, and how long you actually need",
        description:
          "Whether Kuwait is worth visiting, how long you need, when to go, what it costs, and how the layover version compares with the two-day trip.",
        datePublished: "2026-08-14",
        dateModified: "2026-08-14",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Kuwait" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/kuwait",
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
        <span className="text-slate-600">Kuwait</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Middle East · The Gulf
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Kuwait
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth a stop, and how long you actually need – from the layover
          version to the two days with a Bronze-Age island and the desert at dusk.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={marinaPierNight}
              alt="The wooden pier at Souq Sharq marina at night, the lit skyline behind"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Kuwait worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Kuwait gets written off as a transit lounge, and that is exactly
                why it works. There are no tour groups, no queue for anything,
                and no theme-park version of Arabia – what there is, is a real
                two-hundred-year-old souk, a harbour full of working wooden
                dhows, a fish market with the catch coming in under blue
                mosaics, and one iconic tower with the whole bay below it. I had
                the lanes of the old market nearly to myself on a Sunday
                morning.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: walk the old town while the rest of the
                city drives, drink tea brewed over coals in the souk, ride the
                sphere of Kuwait Towers, and then – if you take the second day
                almost nobody takes – cross to a Bronze-Age island by boat and
                watch the desert switch its lights on at dusk. The trip runs on
                a car, because Kuwait is built around cars and you will often
                be the only pedestrian in the capital. Treat that as part of
                the experience rather than a flaw and the city is a pleasure.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two honest caveats. The country is completely dry – no alcohol
                anywhere, including your hotel – and dinner culture fills the
                evening instead. And this is a stop, not a holiday: one to two
                days is the right amount, which is precisely what makes it such
                good value in hours. Check your government's travel advice
                before booking; the region has moved quickly and the advisory,
                not the guidebook, is the current document.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Winter, without much debate. Kuwait in summer runs past 45 °C
                and the trip in this shape stops working; November to March is
                mild, walkable and – crucially – the season when the desert
                camps exist at all.
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
                The calendar that actually decides the trip is the week, not
                the year: the Kuwaiti weekend is Friday and Saturday, and
                Friday closes more of the country than a visitor expects. Put
                the city day on a weekday – the guide plans both days around
                what is open when.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>How long to stay</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                This is the question Kuwait answers more cleanly than almost
                anywhere: the city fits in a day, the country fits in two, and
                a third is a day too many.
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
                  is the two-day version done for you: both days hour by hour,
                  every booking in the order it has to be made, and the desert
                  timed so you reach the camps exactly as the light goes.
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
                Everything lands at Kuwait International, about twenty minutes
                south of the centre, and most Western passports enter easily –
                with one trap worth knowing: Kuwait's e-visas run their
                validity from approval, not from travel, so one approved months
                early can expire before you fly. Check the expiry date, not
                the approval.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground this is a driving country, and there are exactly
                two ways to do it: a rental car, or a driver-guide for the day.
                Both work; they suit different travellers and different
                budgets, and the rental comes with paperwork that catches
                people at the desk. The guide prices both options, covers what
                the desks actually ask for, and says which to pick.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Day two adds a boat – the tide-dependent crossing to Failaka –
                and one of the world's longest sea bridges, which puts the
                desert twenty minutes from downtown. The rules that matter
                everywhere: alcohol is illegal and duty-free is seized on
                arrival; photographing government, military or oil sites is a
                criminal offence; and the desert is strictly a stay-on-tarmac
                country – landmines and unexploded ordnance remain from 1990.
                None of these complicate the trip in practice.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Kuwait is one of the cheapest trips on this site to actually
                execute, because the two things that usually dominate – getting
                around, and getting in – barely register. For two people
                sharing, the car for both days plus every kilometre of fuel
                comes to roughly €30 each; petrol is so cheap that the whole
                trip's driving costs less than one airport coffee. Almost
                everything you look at – the souk, the harbour, the desert at
                dusk – is free. That €30 is what the driving costs, not what
                the trip costs; the rest is a decision:
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
                The hotel is the only line with real range, and it moves on a
                lever most visitors point the wrong way: rates follow the
                working week rather than the weekend, so the same room costs
                more midweek. The paid activities are few enough to count on
                one hand.
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
                  costs all three levels out line by line – nine hotels in
                  three bands, every activity per person, the car and the fuel
                  against the real distance – so you can build the trip at the
                  level you actually want instead of guessing.
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
                src={winterCampLit}
                alt="A winter tent camp lit up in the dark desert, seen from the road"
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
                <SectionHeading>Stories from Kuwait</SectionHeading>
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

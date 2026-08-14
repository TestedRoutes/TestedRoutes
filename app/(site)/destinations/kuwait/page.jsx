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
import towersIntoSun from "../../../../content/countries/kuwait/destination/generated/web/kuwait-towers-into-the-sun.jpg";
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
  ["November to March", "The season. Days of 18–22 °C, cool evenings with a sea wind, and the desert filling up with the winter tent camps – they exist from about mid-November to mid-March, and after dark they are the best thing in the country."],
  ["April and October", "The shoulders. Hot but workable, into the mid-30s. The camps are gone or going, so the desert half of the trip loses its payoff."],
  ["May to September", "No. Summer runs past 45 °C, life moves indoors, and walking the old town – most of day one – stops being pleasant at all."],
  ["What I would pick", "December or January for the camps at their fullest, accepting jacket weather in the evenings; late February if you want the mildest walking days and can live without the busiest tent season. Either way, the day of the week matters more than the month – see below."],
];

const HOW_LONG = [
  ["Under 24 hours", "The city, and it genuinely fits. The old market at Mubarakiya, Safat Square and the Liberation Tower, the dhow harbour, the fish market, Souq Sharq marina, then a ticket up Kuwait Towers for the panorama. I was done by four with hours to spare. This is the layover version, and it is a better layover than almost any airport offers."],
  ["Two days", "The version almost nobody takes, and the reason to stay a night: a morning boat to Failaka island – Bronze-Age ruins, a tank graveyard from 1990 and an abandoned town, twenty kilometres offshore – then back over the bay for the desert at dusk, when the winter camps switch their lights on. Day one covers the city properly; day two is a different country."],
  ["Three or more", "Honestly, no. The remaining museums and the Avenues mall fill half a day more at most, and the rest of the country is desert you have already seen, oil infrastructure you cannot photograph, and border towns with nothing in them. Kuwait is a superb stop and a poor holiday – two days is the right amount."],
];

const REGIONS = [
  {
    name: "The old town",
    image: soukFoodCourtyard,
    alt: "The open-air food courtyard of Souk Al-Mubarakiya under its timber roof, tables and heaters between the trees",
    body: "Souk Al-Mubarakiya is two hundred years of market under one roof – perfume, oud, gold, dates, spices, and free museums hidden inside it. Around it sit Safat Square, the Liberation Tower standing over the old town, and the Grand Mosque, which you enter on a free guided tour that runs Sunday to Thursday only. Lunch is the souk's open courtyard around the mosque of Al-Bahar: grills, flat bread from stone ovens, and tea brewed over coals.",
  },
  {
    name: "The waterfront",
    image: dhowPortHulls,
    alt: "Wooden dhows moored hull to hull at the dhow harbour, white rocks in the foreground",
    body: "The Gulf Road string of sights that fills an afternoon: the dhow harbour with hundreds of wooden ships moored hull to hull, the fish market with the day's catch coming in under blue mosaics, Sadu House and its weaving, the Vintage Ship, Al-Bahhar village for souvenirs, and Souq Sharq marina with its footbridge viewpoint. Nobody walks in Kuwait, so you will often have the promenade to yourself.",
  },
  {
    name: "Kuwait Towers and the corniche",
    image: towersIntoSun,
    alt: "Kuwait Towers against the low winter sun, palms and the promenade below",
    body: "The three towers are the country's postcard, and the viewing sphere turns once every thirty minutes at 123 metres. Go up in the last hour of light – sunset runs from about 16:50 in December to 18:10 in late March – and the whole bay arranges itself below you. The corniche promenade underneath is the city's best walk, which in Kuwait means you may be the only person on it.",
  },
  {
    name: "Across the bay",
    image: desertDuskCar,
    alt: "The desert highway at dusk from the car, power lines running to the horizon",
    body: "Day two's country. A morning ferry from Marina Crescent crosses to Failaka island – a Bronze-Age Greek trading post, a tank graveyard left from 1990 and a whole abandoned town. Back on the mainland, the 36-kilometre causeway crosses the bay to Subiya, where the desert begins: highways, power lines, empty ground, and – from mid-November to mid-March – the winter tent camps that light up at dusk and explain where the whole city goes at weekends.",
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
  ["Lean", "A budget room in Sharq, eating in the souk and the fish market, and none of the paid bookings – most of the trip is free to look at"],
  ["Core", "The route as written: a mid-range hotel, the Failaka ferry, the towers, and proper dinners"],
  ["Splurge", "A waterfront five-star, both museums, and dinner inside a full-size wooden dhow"],
];

const TIPS = [
  ["Check the visa expiry, not the approval.", "My e-visa, approved months ahead, had expired before I ever used it – Kuwait issues them with their own clock running. Visa on arrival saved the day in about forty-five minutes, but check the dates before you fly and spare yourself the airport arithmetic."],
  ["Plan around Friday, not the weather.", "The Kuwaiti weekend is Friday and Saturday. On Friday there are no mosque tours, Sadu House is shut and the souk trades in the evening only – so a European Saturday-Sunday city break hits the two worst days in the country. Put the city day on any Sunday to Thursday and everything in it is open."],
  ["Confirm the Failaka ferry before you fly.", "Sailing times shift with the tides and are posted a month at a time. Message the operator on WhatsApp before you book anything else, then buy the ticket in person at the Marina office – on the day works, the evening before is safer, and bring a passport copy because the coast guard asks."],
  ["Go up the towers in the last hour of light.", "The sphere turns once every thirty minutes, and the difference between noon and the golden hour is the difference between a view and the photo you keep. Sunset runs 16:50 to 18:10 across the season, and tickets are sold at the base only."],
  ["Get the International Driving Permit at home.", "Rental desks ask for one alongside your licence, and it can only be issued in your home country – there is no fixing it after you land. Driving itself is easy: fast, wide roads, loose lane discipline, and speed cameras everywhere, with fines that start at KD 70."],
  ["Leave the duty-free at your departure airport.", "Alcohol is illegal everywhere in Kuwait and none may be brought in – bottles are seized at the airport. Dinner is the whole evening out here, and the country runs perfectly well on juice, tea and the best fruit cocktails in the Gulf."],
  ["Stay on the tarmac in the desert.", "Landmines and unexploded ordnance remain in the Kuwaiti desert from 1990. The camps and the dusk light are all visible from the road – there is no reason to drive off it, and the official advice is blunt: do not."],
];

const FAQ = [
  ["Is Kuwait worth visiting?", "Yes – for a day or two, and on purpose. It is the Gulf without the theme park: a real old souk, a working dhow harbour, one iconic tower, and a desert culture that still actually happens every winter. It gets written off as a layover because the city genuinely fits in a day; the mistake is thinking that is all there is. The second day – a Bronze-Age island by boat and the tent camps lighting up at dusk – is the part almost nobody sees."],
  ["Is Kuwait safe to visit?", "The city itself is calm and low-crime, and I travelled it recently without issue. But check your government's travel advice before you book and again before you fly – conditions in the wider region have changed quickly, and advisories move faster than guidebooks. The UK's is at gov.uk/foreign-travel-advice/kuwait. Two hard local rules: never photograph government, military or oil sites, and never drive off-road in the desert, where landmines from 1990 remain."],
  ["How many days do you need in Kuwait?", "One day covers the city properly – the souk, the mosque, the harbour, the fish market and the towers, done by late afternoon. Two days is the right trip: the second buys you Failaka island by ferry and the desert at dusk, which is a different country from the first day. More than two adds little; Kuwait is a superb stop and a poor holiday."],
  ["What can you do on a Kuwait layover?", "With eight clear hours you can do the old town and the towers: visa on arrival takes about forty-five minutes, the Grand Mosque tour needs booking ahead and runs Sunday to Thursday, the souk and the dhow harbour are free, and Kuwait Towers stays open to 23:00. The city is twenty minutes from the airport with no traffic. It is one of the better layover cities anywhere – provided it is not a Friday."],
  ["Can you drink alcohol in Kuwait?", "No. Alcohol is illegal to sell, serve, carry or import anywhere in the country, including hotel bars, and duty-free bottles are seized at the airport. Dinner culture fills the gap – restaurants are the whole evening out, and tables turn late."],
  ["When is the best time to visit Kuwait?", "November to March. Winter days run 18–22 °C with cool evenings, and the desert tent camps – the best thing in the country after dark – exist from about mid-November to mid-March. Summer regularly passes 45 °C and is genuinely not usable for this trip. Whatever the month, put the city day on a Sunday to Thursday: the Kuwaiti weekend closes the mosque tours and half the old town."],
  ["Do you need a car in Kuwait?", "Yes, or someone driving one. Kuwait is built around cars and car parks; distances between sights are short but unwalkable in aggregate, and there is no metro. A rental with an International Driving Permit is the cheap answer. The upgrade is a driver-guide for the day at around €170 per person – in a city where parking eats time, someone else driving turns a logistics day into a sightseeing one."],
  ["Can you visit Failaka island?", "Yes, by passenger ferry from Marina Crescent – about forty minutes and KD 15 return. Sailings shift with the tides and are posted a month at a time, so confirm your date by WhatsApp first and buy the ticket in person a day ahead with a passport copy. On the island, a three-dinar bus tour covers the Bronze-Age Greek ruins, the tank graveyard and the abandoned town; there are no taxis and one kitchen."],
  ["What days is the weekend in Kuwait?", "Friday and Saturday. The working week is Sunday to Thursday, which is when everything in a city itinerary is open – mosque tours, Sadu House, the souk on full hours. Friday is the day to avoid arriving: no mosque tours, museums shut, and the souk trades evenings only. Hotel prices run opposite to Europe's, higher midweek than at the weekend."],
  ["Do you need a visa for Kuwait?", "Most Western passports get a visa on arrival – about forty-five minutes in the queue – or an e-visa ahead of time. The trap is the e-visa's expiry: Kuwait issues them valid from approval, not from travel, so one approved months early can be dead before you fly. Check the expiry date, not just the approval."],
  ["What are the winter desert camps?", "From about mid-November to mid-March, Kuwaiti families move out to licensed tent camps in the desert – generators, satellite dishes and strings of lights included – to live, for a season, the way their grandparents did. After dark the desert on both sides of the road fills with lit villages of tents. It is the country's favourite tradition, it empties the city at weekends, and seen from the road at dusk it is the best free sight in Kuwait."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchKuwaitContent() {
  try {
    return await client.fetch(
      `{
        "guide": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "kuwait" && (language == "en" || !defined(language))][0]{
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "kuwait" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function KuwaitDestinationPage() {
  const { guide, stories } = await fetchKuwaitContent();
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
                city drives, eat in the souk's open courtyard where tea is
                brewed over coals, ride the sphere of Kuwait Towers at the last
                light, and then – if you take the second day almost nobody takes
                – cross to a Bronze-Age island by boat and watch the desert
                switch its lights on at dusk. The trip runs on a rental car,
                because Kuwait is built around cars and you will often be the
                only pedestrian in the capital. Treat that as part of the
                experience rather than a flaw and the city is a pleasure.
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
                Friday closes the mosque tours, Sadu House and the souk's
                daytime hours. Put the city day on any Sunday to Thursday and
                everything in it is open.
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
                  covers the two-day version hour by hour – the city day, the
                  Failaka ferry playbook, and the desert timed so you reach the
                  camps exactly as the light goes.
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
                south of the centre. Most Western passports get a visa on
                arrival in about forty-five minutes, or an e-visa ahead of time
                – with one trap worth knowing: Kuwait's e-visas run their
                validity from approval, not from travel, so one approved months
                early can expire before you fly. Check the expiry date, not the
                approval. Terminal 1 is closed, so confirm which terminal your
                airline actually uses.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Pick the rental car up at the airport and the trip runs itself
                from there. You drive on the right, the roads are wide and
                fast, lane discipline is loose, and speed cameras are
                everywhere – fines start at KD 70, so set the cruise control
                and forget about it. Rental desks ask for an International
                Driving Permit alongside your licence, and it can only be
                issued in your home country. If you would rather not drive at
                all, taxis cover the city (KD 7–8 from the airport) and a
                driver-guide for a full day runs around €170 per person – the
                one upgrade that turns a logistics day into a sightseeing one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Day two adds two more vehicles: a passenger ferry to Failaka –
                forty minutes, KD 15 return, times posted monthly because they
                move with the tides – and the 36-kilometre causeway across the
                bay, one of the longest sea bridges in the world, which puts
                the desert twenty minutes from downtown.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The rules that matter: alcohol is illegal everywhere and
                duty-free is seized on arrival; photographing government,
                military or oil installations is a criminal offence; and the
                desert is strictly a stay-on-tarmac country – landmines and
                unexploded ordnance remain from 1990. None of these complicate
                the trip in practice. Cards work almost everywhere; carry some
                dinars in small notes for the souk and the island bus.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Kuwait is one of the cheapest trips on this site to actually
                execute, because the two things that usually dominate – getting
                around, and getting in – barely register. For two people
                sharing, the car for both days plus every kilometre of fuel
                comes to roughly €30 each. Petrol is so cheap that the whole
                trip's driving costs less than one airport coffee, and almost
                everything you look at – the souk, the harbour, the mosque
                tour, the desert at dusk – is free. That €30 is what the
                driving costs, not what the trip costs; the rest is a
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
                The hotel is the only line with real range – the same night
                runs from a €40 budget room in Sharq to €350+ on the
                waterfront, and everything else in the country is either cheap
                or free. Two levers move the total: hotel rates follow the
                working week rather than the weekend, so Sunday to Thursday
                nights cost more than Friday and Saturday; and the paid
                activities are few enough to count on one hand – the ferry,
                the towers, and the museums if it rains.
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
                  costs all three levels out line by line – hotel bands by
                  night, every activity per person, the ferry, the car and the
                  fuel against the real distance – so you can build the trip at
                  the level you want instead of guessing.
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
                      Both days hour by hour: the city day built around the
                      mosque-tour booking, the Failaka ferry playbook with the
                      WhatsApp confirmation step, the desert timed to reach the
                      camps at dusk, nine hotels and nine restaurants each with
                      a QR link, a three-tier budget, and the companion Google
                      map with every pin.
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

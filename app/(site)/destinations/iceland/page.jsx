import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import ringRoadEmptyHighway from "../../../../content/countries/iceland/destination/generated/web/ring-road-empty-highway.jpg";
import reykjanesCoastline from "../../../../content/countries/iceland/destination/generated/web/reykjanes-coastline.jpg";
import keridCraterLake from "../../../../content/countries/iceland/destination/generated/web/kerid-crater-lake.jpg";
import reynisfjaraSeaStacks from "../../../../content/countries/iceland/destination/generated/web/reynisfjara-sea-stacks.jpg";
import jokulsarlonIcebergs from "../../../../content/countries/iceland/destination/generated/web/jokulsarlon-icebergs.jpg";
import hverirGeothermal from "../../../../content/countries/iceland/destination/generated/web/hverir-geothermal.jpg";
import snaefellsnesBasaltCliffs from "../../../../content/countries/iceland/destination/generated/web/snaefellsnes-basalt-cliffs.jpg";
import seljalandsfossBehind from "../../../../content/countries/iceland/destination/generated/web/seljalandsfoss-behind.jpg";
import skogafoss from "../../../../content/countries/iceland/destination/generated/web/skogafoss.jpg";
import dettifoss from "../../../../content/countries/iceland/destination/generated/web/dettifoss.jpg";
import dyrholaeyArch from "../../../../content/countries/iceland/destination/generated/web/dyrholaey-arch.jpg";
import fjadrargljufurCanyon from "../../../../content/countries/iceland/destination/generated/web/fjadrargljufur-canyon.jpg";
import vitiCraterLake from "../../../../content/countries/iceland/destination/generated/web/viti-crater-lake.jpg";
import icelandicHorse from "../../../../content/countries/iceland/destination/generated/web/icelandic-horse.jpg";
import turfHouses from "../../../../content/countries/iceland/destination/generated/web/turf-houses.jpg";
import hallgrimskirkja from "../../../../content/countries/iceland/destination/generated/web/hallgrimskirkja.jpg";
import sunVoyager from "../../../../content/countries/iceland/destination/generated/web/sun-voyager.jpg";
import blueLagoon from "../../../../content/countries/iceland/destination/generated/web/blue-lagoon.jpg";
import arnarstapiStatue from "../../../../content/countries/iceland/destination/generated/web/arnarstapi-statue.jpg";
import blackCoastMidnight from "../../../../content/countries/iceland/destination/generated/web/black-coast-midnight.jpg";

export const metadata = {
  title: "Iceland: how many days you need, and what it actually costs · TestedRoutes",
  description:
    "How many days you need for Iceland, whether the Ring Road is worth it, when to go, what a week really costs, and whether you need a 4x4. Written from two trips.",
  alternates: { canonical: "/destinations/iceland" },
  openGraph: {
    type: "article",
    url: "/destinations/iceland",
    title: "Iceland: how many days you need, and what it actually costs",
    description:
      "The Ring Road, the south coast and the layover version: how long each needs, when to go, and what it costs.",
  },
};

const WHEN_TO_GO = [
  ["June to August", "The Ring Road season. Every road open, the highland buses running, and light that never really goes. Also the busiest and the most expensive."],
  ["May and September", "The shoulder. Most of the country is open, prices soften, and the famous stops are noticeably quieter. September brings back proper darkness, so the lights become possible again."],
  ["October to April", "Northern lights season, but the full loop stops being a casual plan. Short daylight, real winter driving, and roads that close without much warning."],
  ["What I would pick", "Late June or early September. Either gives you the whole road with fewer people on it."],
];

const HOW_LONG = [
  ["Under 24 hours", "A layover. Reykjanes and the lagoons sit minutes from the airport, or the city if you would rather. Do not try to add the Golden Circle to a short connection."],
  ["Three to five days", "The south coast. Waterfalls, black sand, the glacier lagoon if you push to five. This is the highest-value short trip in the country and most people should take it over a rushed loop."],
  ["Seven days, eight on the ground", "The full Ring Road, done properly. Long driving days, but nothing is doubled back on and every region gets its turn. This is the trip the guide is built around. Snaefellsnes can be squeezed in at this length, but only by dropping something like the Silfra snorkel or the whale boat, or by adding real driving to days that are already full."],
  ["Ten days or more", "The loop with Snaefellsnes added properly, or the same loop at a pace that lets you stop when you feel like it. Add the Westfjords and you are into two weeks."],
];

const REGIONS = [
  {
    name: "Reykjanes and Reykjavík",
    image: reykjanesCoastline,
    alt: "Sea cliffs and Atlantic surf on the Reykjanes peninsula, Iceland",
    body: "Where you land and, for a lot of people, where the trip quietly starts and ends. The peninsula is a lava field with a coastline: bird cliffs, steaming ground at Gunnuhver, the bridge between two continental plates, and the young lava from the Fagradalsfjall eruptions. The lagoons are here too. Reykjavík is forty minutes further and small enough to walk in an afternoon – a church you can ride a lift up, a sculpture on the waterfront, and the hot-dog stand everybody photographs.",
  },
  {
    name: "The Golden Circle",
    image: keridCraterLake,
    alt: "The red rim and green crater lake of Kerid, on the Golden Circle, Iceland",
    body: "Three stops in a loop from Reykjavík: the rift valley at Thingvellir where the Atlantic plates pull apart and the old parliament met for eight hundred years, the geyser that still goes off every few minutes, and Gullfoss dropping into its canyon. It is the busiest corner of the country because it is the easiest, and it is genuinely good anyway. A crater lake and a snorkel between two continents are the usual additions.",
  },
  {
    name: "The south coast",
    image: reynisfjaraSeaStacks,
    alt: "Black sand and the Reynisdrangar sea stacks at Reynisfjara, south Iceland",
    body: "The stretch that sells Iceland. Two big waterfalls within an hour of each other, one you can walk behind. Black sand at Reynisfjara with basalt columns and the stacks offshore, where the waves are genuinely dangerous and the signs are not decoration. Then the canyon at Fjadrargljufur and the run east toward the glaciers. If you only have three days in the country, spend them here.",
  },
  {
    name: "The glacier coast and the east",
    image: jokulsarlonIcebergs,
    alt: "Icebergs drifting on the Jökulsárlón glacier lagoon, southeast Iceland",
    body: "Skaftafell is where you walk on a glacier with a guide and crampons, and it is worth the half day. Further on, the lagoon: icebergs calving off the tongue, drifting out to sea and washing back onto black sand across the road. Past that the country empties out. The east fjords are long, quiet driving with almost nobody on the road, and honestly they are the stretch that impressed me least after the south – worth a few unplanned stops rather than a planned day. If you are short of time, this is the first place to take it from.",
  },
  {
    name: "Mývatn and the north",
    image: hverirGeothermal,
    alt: "Orange mineral ground and steam vents at the Hverir geothermal field, north Iceland",
    body: "The strangest landscape on the route. Hverir is orange earth, boiling mud and steam coming out of the ground at the roadside. Nearby there is a crater lake, a lava field you can walk into, and a geothermal lagoon that is the quieter answer to the Blue Lagoon. Dettifoss is an hour north on a sealed road – Europe's most powerful waterfall, felt through your feet. Húsavík on the coast is the whale town, and the boats mostly find them.",
  },
  {
    name: "The west and Snæfellsnes",
    image: snaefellsnesBasaltCliffs,
    alt: "Basalt sea cliffs on the Snæfellsnes peninsula, west Iceland",
    body: "The last leg of the loop runs through farmland, a lava cave you can climb into, and Europe's highest-flow hot spring. Snaefellsnes hangs off the west coast and is often called Iceland in miniature: a glacier-topped volcano, black beaches, fishing villages and the mountain everybody has photographed. It needs a day of its own rather than a detour. My honest view, having driven the full loop first, is that it does not hold up against the south – so the seven-day route leaves it out, and the longer version puts it back for people who want it.",
  },
];

/* Trip photos, roughly in route order: south coast, glaciers, north, west, city. */
const CAROUSEL = [
  { image: seljalandsfossBehind, alt: "Seljalandsfoss falling in a curtain with the path running behind it, south Iceland", caption: "The waterfall you can walk behind" },
  { image: skogafoss, alt: "Skógafoss dropping sixty metres with people small at its base, south Iceland", caption: "Skógafoss, south coast" },
  { image: dyrholaeyArch, alt: "The stone arch at Dyrhólaey with black beach stretching away behind it", caption: "The Dyrhólaey arch" },
  { image: fjadrargljufurCanyon, alt: "The serpentine green walls of Fjaðrárgljúfur canyon, south Iceland", caption: "Fjaðrárgljúfur canyon" },
  { image: blackCoastMidnight, alt: "Black sand coast under the pale light of an Icelandic summer night", caption: "Midnight on the south coast" },
  { image: dettifoss, alt: "Dettifoss thundering into the Jökulsárgljúfur canyon, north Iceland", caption: "Dettifoss, from the sealed west bank" },
  { image: vitiCraterLake, alt: "The turquoise crater lake of Víti at Krafla, north Iceland", caption: "Víti crater, Krafla" },
  { image: icelandicHorse, alt: "An Icelandic horse with a long blond mane at a roadside fence", caption: "Icelandic horse" },
  { image: turfHouses, alt: "A row of grass-roofed turf houses set into a green bank", caption: "Turf houses" },
  { image: arnarstapiStatue, alt: "The stone Bárður statue above the coast at Arnarstapi, Snæfellsnes", caption: "Arnarstapi, Snæfellsnes" },
  { image: blueLagoon, alt: "Bathers in the pale blue geothermal water of the Blue Lagoon, Reykjanes", caption: "The Blue Lagoon" },
  { image: hallgrimskirkja, alt: "The stepped concrete facade of Hallgrímskirkja rising over Reykjavík", caption: "Hallgrímskirkja, Reykjavík" },
  { image: sunVoyager, alt: "The Sun Voyager sculpture on the Reykjavík waterfront", caption: "Sun Voyager, Reykjavík" },
];

const COSTS = [
  ["Lean", "~€3,200", "Guesthouses and hostels, cooking most meals, the free stops only"],
  ["Core", "~€5,500", "Mid-range hotels, dinners out, the main paid activities, a 2WD rental"],
  ["Splurge", "€9,200+", "Top hotels, a 4WD you do not need, every activity and lagoon upgrade"],
];

const TIPS = [
  ["Both hands on the car door. Every time.", "Wind ripping a door backwards is the one damage no rental insurance covers, and it is the most common expensive mistake visitors make. It costs nothing to hold the door with both hands each time you open it, all week."],
  ["You do not need a 4x4 for the Ring Road.", "Route 1 is paved the whole way round, and every stop on a standard summer itinerary is reachable in a 2WD. The 4x4 is for F-roads into the highlands, which your rental contract almost certainly forbids in a 2WD anyway. Take the money and spend it on a night you will remember."],
  ["Take the sealed west bank to Dettifoss.", "Road 862 on the west side is paved to the car park. The east bank is rough gravel and gets you no better view. People do the east side because a map told them it was shorter."],
  ["Kitchens close early outside Reykjavík.", "Nine in the evening is normal and ten is late. Book the day's dinner at breakfast and check the hours the same morning, because a long driving day plus a shut kitchen is how people end up eating fuel-station hot dogs twice."],
  ["Carry one credit card with a PIN.", "Unmanned fuel pumps want a PIN, not a signature and not a phone. The country is otherwise effectively cashless – we did not use a single note in a week."],
  ["A head net beats repellent at Mývatn.", "The midges there mostly do not bite, they simply swarm your face in their thousands. Repellent has limited effect on that. A three-euro head net solves it completely and looks ridiculous, which is a fair trade."],
  ["Check road.is and vedur.is every morning.", "Roads, weather and eruption status all change daily. Two minutes with coffee is the whole discipline. Use safetravel.is for active alerts if you are heading anywhere remote."],
];

const FAQ = [
  ["How many days do you need in Iceland?", "Seven days, eight on the ground, is the shortest the full Ring Road works without rushing every stop. Three to five days is plenty for the south coast, which is the highest-value short trip in the country and the better choice if that is all the time you have. Under two days, stay near Reykjavík and the Reykjanes peninsula rather than trying to cover ground."],
  ["Is Iceland expensive?", "Yes, but the expensive parts are largely optional. Excluding flights, a week for two runs about €3,200 lean, €5,500 at a normal comfortable level, and €9,200 or more if you take every upgrade. Fuel, hotels and restaurant meals are what cost; the landscape itself is free. Cooking some of your own meals and skipping the 4x4 moves the number more than anything else."],
  ["Do you need a 4x4 in Iceland?", "Not for the Ring Road in summer. Route 1 is paved the whole way and every standard stop is reachable in a 2WD. You need a 4x4 only for the F-roads into the highlands, and most 2WD rental contracts forbid those outright. In winter the calculation changes, but so does the whole trip."],
  ["What are F-roads, and can I drive them?", "Mountain roads into the interior, marked with an F on maps and signs. They are unpaved, often involve river crossings, open only in high summer, and are prohibited in a 2WD rental – driving one voids your insurance entirely. Nothing on a normal summer itinerary requires an F-road."],
  ["Should you drive the Ring Road clockwise or anticlockwise?", "Clockwise, meaning the south coast first. The south is the densest, most photographed stretch, and doing it while you are fresh is better than arriving there tired at the end of a loop. It also puts the long empty east-fjord driving in the middle, where it belongs."],
  ["Can you see the northern lights in summer?", "No. Between mid-June and mid-July it never gets properly dark, so there is no sky to see them against. The lights need darkness, which means roughly September to April. If they are the reason you are going, do not go in summer."],
  ["When is the best time to visit Iceland?", "June to August for the full loop, with everything open and endless light. May and September give you most of the same access with fewer people and lower prices. October to April is northern-lights season, but short days and winter driving make the whole loop a much more serious undertaking."],
  ["Do you need to book accommodation in advance?", "In summer, yes. The Ring Road runs through small towns with limited beds, and the good places in Vík, Mývatn and Höfn go months ahead. The activities that sell out are the whale boats, glacier walks and Silfra snorkel – book those before the hotels if you have a fixed date in mind."],
  ["Is the Blue Lagoon worth it, and are there alternatives?", "It is genuinely pleasant and genuinely the most expensive way to sit in warm water in Iceland. The pricing moves with demand and can swing by half between slots. Sky Lagoon near Reykjavík, Mývatn's geothermal lagoon in the north, and the Forest Lagoon near Akureyri all cost less and are quieter. Every town also has a public pool for a few euros."],
  ["Do you need a visa for Iceland?", "Iceland is in the Schengen area: no visa for EU travellers, and the standard 90-day entry applies to UK and US passport holders. Your passport should be valid three months beyond departure, and no vaccinations are required. Entry rules do change, so check before you fly."],
  ["Can you do Iceland without an organised tour?", "Yes, and self-driving is the normal way to do it. The only things you cannot arrange yourself on the day are the glacier walk, the Silfra snorkel and the whale boat, all of which need a licensed operator. Everything else is a car, a map and the opening hours."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

async function fetchIcelandContent() {
  try {
    return await client.fetch(
      `{
        "guide": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "iceland" && (language == "en" || !defined(language))][0]{
          title, "slug": coalesce(guide.pageSlug, slug.current), durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "iceland" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function IcelandDestinationPage() {
  const { guide, stories } = await fetchIcelandContent();
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Iceland: how many days you need, and what it actually costs",
        description:
          "How many days Iceland needs, whether the Ring Road is worth it, when to go, what a week costs, and whether you need a 4x4.",
        datePublished: "2026-08-09",
        dateModified: "2026-08-09",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Iceland" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/iceland",
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
        <span className="text-slate-600">Iceland</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Europe · North Atlantic
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Iceland
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, and what it actually costs – from the full
          Ring Road, the south coast, and the version that fits a layover.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={ringRoadEmptyHighway}
              alt="An empty stretch of Iceland's Route 1 running toward distant mountains"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Iceland worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Yes, with one condition: treat it as a driving country. Almost
                everything worth seeing sits on or just off one paved ring, and
                the trip works in direct proportion to how honestly you plan the
                driving. People who book a week and then try to see the whole
                island end up watching most of it through a windscreen.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do here: you stand under waterfalls big enough
                to feel through the ground, walk on a glacier with crampons and a
                guide, watch icebergs drift out of a lagoon and wash back onto
                black sand, put your face in a rift between two continental
                plates, and sit in hot water while it rains. In between you drive
                across lava fields where nothing at all happens for an hour at a
                time, which is a large part of why people love it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The practical side is easy. English is spoken everywhere, cards
                work for everything, the water out of the tap is among the best
                in the world, and nothing on a normal itinerary requires a guide,
                a permit or a 4x4. The two things that genuinely catch people out
                are the wind and the cost, and both are manageable once you know.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Summer and winter are almost different countries. June to August
                gives you every road open and light that never fully goes –
                between mid-June and mid-July it does not get properly dark at
                all, which quietly doubles how much you can fit into a day.
                Winter trades that for northern lights and a much more serious
                drive.
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
                Whatever month you pick, the weather does not stay picked. Four
                seasons in a day is not a slogan here, it is a packing
                instruction.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>How long to stay</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                This is the question that decides the whole trip, and the honest
                answer is that the Ring Road needs seven days. Fewer than that
                and you are choosing a region instead – which is usually the
                better trip anyway.
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
                  covers the seven-day version hour by hour, with the bookings
                  that sell out, the six bases that stop you doubling back, and
                  what to cut on the days that run long.
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
                Everything international lands at Keflavík, about forty-five
                minutes from Reykjavík and right next to the Reykjanes lava
                fields – which is why a layover here is more worthwhile than a
                layover almost anywhere else. Pick the car up at the airport and
                drive from there.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Route 1, the Ring Road, is paved for its entire length around the
                island and is the spine of any itinerary. The road itself is a
                little over 1,300 km, but that number misleads people when they
                budget fuel and driving hours: nothing worth stopping for sits
                exactly on the tarmac. Once you add the Golden Circle, Dettifoss,
                the whale harbour at Húsavík and the rest, a real week comes out
                closer to 2,300 km. A standard 2WD handles all of it. The 4x4
                upsell exists for F-roads into the highlands, which are unpaved,
                seasonal, and prohibited in a 2WD rental – take one in the wrong
                car and your insurance is void.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two habits do most of the work. Check road.is and vedur.is each
                morning, because conditions genuinely change overnight. And treat
                wind as the real hazard: it rips car doors backwards off their
                hinges, which is the one damage rental insurance never covers.
                Both hands on the door, every time, all week.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fuel is mostly unmanned pumps that want a chip-and-PIN card, so
                bring one that has a PIN rather than relying on a phone. Beyond
                that the country is effectively cashless and paperwork is light:
                Schengen rules, no vaccinations, and an EU, UK or US driving
                licence is accepted as it is.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                For two people, for a week on the ground, excluding international
                flights:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
                <table className="w-full min-w-[480px] text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3 font-semibold">Style</th>
                      <th className="px-5 py-3 font-semibold">Week for two</th>
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
                The gap between the first row and the last is almost entirely
                hotels, restaurant meals and the car. Nothing in the landscape
                charges admission: the waterfalls, the black beaches, the lava
                fields and the canyons are all free, and a handful of car parks
                take a small fee. The paid attractions worth the money are the
                ones you cannot do alone – the glacier walk, the Silfra snorkel,
                the whale boat.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two levers move the total more than anything else: skipping the
                4x4 you do not need, and cooking some of your own meals. Do both
                and a comfortable trip lands much closer to the lean column than
                the reputation suggests. Below that lean column there is one more
                step – bring a tent and camp, which is how I first did the loop
                as a student. It works, and it is a different trip from the one
                planned here.
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
                src={jokulsarlonIcebergs}
                alt="Icebergs drifting on the Jökulsárlón glacier lagoon under a bright sky"
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
                      The full loop hour by hour: six bases picked so you never
                      double back, every booking that sells out and how far ahead
                      it goes, a costed budget at three comfort levels, restaurant
                      picks with the kitchen-closing times that catch people out,
                      and the companion Google map with every pin.
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
                <SectionHeading>Stories from Iceland</SectionHeading>
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

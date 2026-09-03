import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import colobusTroopFeedingBijilo from "../../../../content/countries/gambia/destination/generated/web/colobus-troop-feeding-bijilo.jpg";
import ferryRailCrossingBanjul from "../../../../content/countries/gambia/destination/generated/web/ferry-rail-crossing-banjul.jpg";
import ferryDeckMidriver from "../../../../content/countries/gambia/destination/generated/web/ferry-deck-midriver.jpg";
import kachikallyPoolWeed from "../../../../content/countries/gambia/destination/generated/web/kachikally-pool-weed.jpg";
import colobusTroopPath from "../../../../content/countries/gambia/destination/generated/web/colobus-troop-path.jpg";
import creeksideShipLamin from "../../../../content/countries/gambia/destination/generated/web/creekside-ship-lamin.jpg";
import excursionBoatCreek from "../../../../content/countries/gambia/destination/generated/web/excursion-boat-creek.jpg";
import paintedBaobabLamin from "../../../../content/countries/gambia/destination/generated/web/painted-baobab-lamin.jpg";
import kachikallyClearingCrocs from "../../../../content/countries/gambia/destination/generated/web/kachikally-clearing-crocs.jpg";
import crewMeetsTroopBijilo from "../../../../content/countries/gambia/destination/generated/web/crew-meets-troop-bijilo.jpg";
import tanjiLandingHour from "../../../../content/countries/gambia/destination/generated/web/tanji-landing-hour.jpg";
import thatchedLodgeFlameTree from "../../../../content/countries/gambia/destination/generated/web/thatched-lodge-flame-tree.jpg";
import stillCreekDugout from "../../../../content/countries/gambia/destination/generated/web/still-creek-dugout.jpg";
import laminJettyPirogues from "../../../../content/countries/gambia/destination/generated/web/lamin-jetty-pirogues.jpg";
import beachPalmsFromSurf from "../../../../content/countries/gambia/destination/generated/web/beach-palms-from-surf.jpg";
import beachEveningStrip from "../../../../content/countries/gambia/destination/generated/web/beach-evening-strip.jpg";
import founderInTheAtlanticSurf from "../../../../content/countries/gambia/destination/generated/web/founder-in-the-atlantic-surf.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION -
 * whether The Gambia is worth it, how safe it is, how long, when. Everything
 * operational (ferry boarding mechanics and fares, venue entry prices and
 * hours, river-trip arrangements and operators, day sequencing, named beds
 * and restaurants) belongs to the planned 2-day SKU ("Banjul & the Smiling
 * Coast in 2 Days") and is deliberately absent. The SKU is small (~15
 * hard-won facts), so the teaser budget here is at its strictest: the only
 * execution-flavoured facts on this page are ones a published inspire story
 * already gives away (the ferry's two-ticket system, the land border's
 * prescription-medication check, the fed-crocodiles explanation at
 * Kachikally). NOTE: no guide SKU is live yet, so no sentence may say "the
 * guide carries X" - mechanics are asserted to exist, unreferenced. POINTER
 * PASS OWED: when the 2-day SKU publishes, revisit the FAQ and the how-long
 * section to point at it. The test before any edit: could a reader run a
 * day of the trip from this page alone? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "The Gambia: is it safe, how many days, and is it more than the beach · TestedRoutes",
  description:
    "Whether The Gambia is worth visiting, how safe it is, when to go and what getting there costs – the river, the crocodile pool, the monkey forest and the fish market behind the beach resorts.",
  alternates: { canonical: "/destinations/gambia" },
  openGraph: {
    type: "article",
    url: "/destinations/gambia",
    title: "The Gambia: is it safe, how many days, and is it more than the beach",
    description:
      "Africa's smallest mainland country: a river with a coastline attached, crocodiles you can touch, wild monkey troops beside the hotel strip – and the honest answers on safety and timing.",
  },
};

const WHEN_TO_GO = [
  ["November to February", "The season. Dry, sunny and warm without being punishing – this is when the winter-sun charters run and every part of the trip works, coast and river alike. November adds a bonus: the land is still green from the rains and the migratory birds have arrived."],
  ["March to May", "The late dry season. Still rainless, hotter by the week, and much quieter as the charter season winds down. We crossed in late May and the days were hot but entirely workable – the country compensates with room to breathe."],
  ["June to October", "The rains. Green, humid, dramatic skies, and the fewest visitors – but downpours can eat afternoons and the upcountry dirt roads suffer. A trip built around the coast still functions; one built around moving does not."],
  ["What I would pick", "November, for the green landscape, the birdlife and pre-season prices – accepting that a stray late shower is possible. December to February buys full certainty and the liveliest coast, at high-season flight and bed prices. Either way the middle of the day is for shade or water."],
];

const HOW_LONG = [
  ["A day in port", "Cruise ships call at Banjul, and a single day covers the capital and the crocodile pool at Bakau honestly. It is a taste – the river, the forest and the fish market all fall outside it."],
  ["Two days", "The surprising sweet spot, and the shape we tested: one day for the capital, the crocodiles, the monkey forest and Tanji's fish market at sunset; one day on the river in the mangrove creeks. The Gambia is Africa's smallest mainland country – two days genuinely cover its signatures."],
  ["A week", "The winter-sun pattern: a base on the Atlantic strip, beach as the default, and the country's signatures taken as unhurried day trips with river time doubled. This is how most visitors do it, and the country suits the rhythm."],
  ["Two countries", "The Gambia is a river inside Senegal, and the two combine into one loop – Dakar, the ferry crossing, the Casamance road – the way we drove it. That is a full week of a very different, border-hopping character."],
];

const REGIONS = [
  {
    name: "Banjul and the river mouth",
    image: ferryRailCrossingBanjul,
    alt: "Passengers at the ferry rail crossing the Gambia River mouth toward Banjul",
    body: "The capital sits on an island where the river meets the Atlantic, and the ferry from Barra is its true front door – cars, cargo and half the country's daily business crossing the green water together. Banjul itself is one of Africa's smallest capitals: arcaded streets, Arch 22, and a quiet that surprises people who expect a capital to roar.",
  },
  {
    name: "The Atlantic strip",
    image: beachPalmsFromSurf,
    alt: "Palm-lined beach seen from the surf on The Gambia's Atlantic coast",
    body: "The Senegambia strip and its neighbouring beaches are the country's engine room of tourism – palm-backed sand, hotels of every ambition, and the winter-sun crowd that flies in from November. It earns its popularity: the beach is genuinely good, and everything else on this page starts within an hour of it.",
  },
  {
    name: "The creeks",
    image: excursionBoatCreek,
    alt: "A boatman poling a covered excursion boat along a mangrove creek near Lamin",
    body: "Behind the coast the river frays into mangrove channels around Lamin and Makasutu, and this is the country at its most itself: oyster beds on the roots, dugouts parked in root tunnels, and whole communities living off – and literally on – what the water provides. The best single day The Gambia offers.",
  },
  {
    name: "Bakau's wild pockets",
    image: kachikallyClearingCrocs,
    alt: "Crocodiles resting on the sand clearing under trees at Kachikally, Bakau",
    body: "Two of West Africa's strangest wildlife encounters sit minutes from the hotel strip: Kachikally, a sacred pool where crocodiles rest loose on the sand and visitors walk among them, and Bijilo's coastal forest, where endangered red colobus and bold green vervet troops hold the paths. Neither needs a safari budget – or a fence.",
  },
  {
    name: "The fishing coast",
    image: tanjiLandingHour,
    alt: "Crowds on the beach at Tanji fish market at sunset, pirogues offshore",
    body: "South of the resorts the coast goes back to work. Tanji is its loud heart – the country's biggest fish landing, where pirogues come in through the surf at sunset and the whole beach becomes a market under a wheeling layer of gulls. No performance, no tickets: just the sea's economy at rush hour.",
  },
];

/* Trip photos, roughly in route order: the crossing, Banjul side, Bakau and
   Bijilo, Tanji at sunset, then the river day and the strip at evening. */
const CAROUSEL = [
  { image: ferryRailCrossingBanjul, alt: "Women and children at the ferry rail, Banjul across the green water", caption: "Crossing to Banjul" },
  { image: ferryDeckMidriver, alt: "The loaded ferry deck mid-river, cars and trucks packed together", caption: "The deck at mid-river" },
  { image: kachikallyPoolWeed, alt: "The weed-covered green pool at Kachikally with a crocodile on its rim", caption: "The pool under the weed, Kachikally" },
  { image: colobusTroopPath, alt: "A troop of red colobus monkeys sitting on the sand path in Bijilo forest", caption: "The welcome committee, Bijilo" },
  { image: crewMeetsTroopBijilo, alt: "The rally crew standing on the forest path facing a troop of monkeys", caption: "Meeting the locals" },
  { image: tanjiLandingHour, alt: "The beach at Tanji crowded at landing hour, gulls over the water", caption: "Tanji at landing hour" },
  { image: creeksideShipLamin, alt: "A ship-shaped concrete structure under palms by the creeks near Lamin", caption: "By the creeks, Lamin" },
  { image: excursionBoatCreek, alt: "A covered excursion boat poled along a mangrove creek", caption: "Setting out on the river day" },
  { image: stillCreekDugout, alt: "A dugout canoe on a still mangrove creek", caption: "The creeks at rest" },
  { image: laminJettyPirogues, alt: "Excursion pirogues moored in rows at the Lamin jetty", caption: "The Lamin jetty" },
  { image: paintedBaobabLamin, alt: "A baobab trunk covered in painted signs near Lamin", caption: "The signed baobab" },
  { image: beachPalmsFromSurf, alt: "The palm-lined beach seen from inside the surf", caption: "The Atlantic, finally" },
  { image: beachEveningStrip, alt: "Evening swimmers and palms on the beach along the hotel strip", caption: "Evening on the strip" },
];

// Deliberately no tier totals here (destination playbook §8). The one number
// on this page is the unavoidable one - the flight pair - and it is labelled
// as what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Guesthouses off the strip, shared taxis, eating where the fishermen eat, and the free sights – the beach, the market beaches and the capital cost nothing to walk"],
  ["Core", "A good hotel on or near the strip, negotiated drivers for the day trips, the river day done properly by boat, and dinner out every night"],
  ["Splurge", "The ceiling is a river lodge deep in the creeks or the strip's best beachfront – The Gambia sells comfort and setting rather than luxury, and its ceiling is refreshingly low"],
];

const TIPS = [
  ["At the Barra ferry, ask for the VIP ticket.", "The Banjul crossing runs on two kinds of ticket, and the queue that matters is the one you cannot see when you buy. VIP cars board first – every VIP car, including the ones that arrive after you. We learned this holding the wrong ticket, with deck space for one car of our two; the full story is further down this page."],
  ["Coming overland, mind the medicine bag.", "At the land border from Senegal, officers checked our car for prescription medication – bringing it in is restricted, and the search is real. If your trip runs on prescriptions, check the current rules before you cross rather than at the barrier."],
  ["The advisory is the current document.", "Western governments mark The Gambia at their milder caution tiers – petty crime around the tourist areas is the headline risk, and election seasons can bring protests. Read your government's travel advice before booking and again before flying; near the southern border, stay on the main roads."],
];

const FAQ = [
  ["Is The Gambia worth visiting?", "Yes – and for more than the beach it is famous for. This is Africa's smallest mainland country, a river with a coastline attached, and its size is the gift: in two days we crossed it by ferry, walked among loose crocodiles at a sacred pool, stood in a wild monkey troop beside the hotel strip, watched the country's biggest fish market land its catch at sunset, and spent a day in the mangrove creeks where villages are built on oyster shells. Nowhere else packs that much into so little distance. What it is not: a big-game safari destination – the wildlife here is smaller, closer and stranger."],
  ["Is The Gambia safe to visit?", "Check your government's travel advice first and let it outrank everything, this page included. Western advisories generally place The Gambia at their milder caution tiers – the headline risks are petty street crime around Banjul and the tourist areas, so the standard rules apply: don't flash valuables, take care on beaches after dark. Election periods can bring protests worth avoiding, and near the southern border the long-running Casamance situation on the Senegalese side means staying on main roads. We drove in, around and out without a single threatening moment – the warmth of the reception is what we remember."],
  ["Is The Gambia more than beach resorts?", "Much more, and the more is minutes away. The resorts sit on one short stretch of coast; behind them the river frays into mangrove creeks where oyster collectors live on islands built from their own shells, a sacred pool at Bakau lets you walk among crocodiles, an endangered colobus troop holds the forest paths next to the hotel pools, and Tanji's beach becomes the country's loudest workplace every sunset. The beach is the base, not the point."],
  ["How many days do you need in The Gambia?", "Two days genuinely cover the signatures – the capital, the crocodile pool, the monkey forest, the fish market at sunset, and a full day on the river – because the country is Africa's smallest on the mainland and everything sits within an hour of the coast. Most visitors come for a week of winter sun and take those same signatures as unhurried day trips, which the country suits equally well. Combining with Senegal turns it into a two-country week."],
  ["When is the best time to visit The Gambia?", "November to February – dry, sunny, warm without being punishing, and the season every charter flies for. November is the connoisseur's pick: the land is still green from the rains, the birds have arrived, and prices are pre-season. June to October is the rainy season, which keeps the country green and the crowds away but can eat afternoons whole. We crossed in late May, at the hot end of the dry season – workable, and wonderfully quiet."],
  ["Do you need a visa for The Gambia?", "Most UK, EU and ECOWAS passports enter visa-free for up to 90 days, which makes this one of West Africa's easiest doors. Rules move, so verify against an official source close to travel. Arriving overland from Senegal involves real border process – allow time and patience for it."],
  ["Can you combine The Gambia with Senegal?", "Yes, and it is one of West Africa's natural loops – The Gambia is a river running through the middle of Senegal, so Dakar, the ferry crossing at the river mouth and the Casamance road south combine into a single circuit. We drove exactly that loop. The border crossings are a real part of the experience: doable, human-paced, and worth going in prepared – our border story below tells you what that felt like."],
  ["Can you really touch the crocodiles at Kachikally?", "Yes. Kachikally in Bakau is a sacred pool – a fertility shrine kept by one family for generations – where tens of crocodiles rest loose on the sand and visitors walk among them and touch them. The keepers' explanation is that well-fed crocodiles have no reason to bother anyone; ours held, and the animals behaved like furniture with teeth. Whether that arithmetic suits you is a personal decision – our story from the pool below lets you feel it out before you commit."],
  ["Is The Gambia expensive?", "Getting there is the biggest line: return flights from the UK and Europe run about €500 in season, less on deals – and that is what reaching the country costs, not what the trip costs. On the ground The Gambia is one of the cheaper destinations on this site: beds span honest guesthouses to strip hotels, food is inexpensive everywhere, and most of the signatures cost little or nothing to stand in front of. The river day by boat is the one line genuinely worth paying for."],
  ["What language and money does The Gambia use?", "English is the official language – a real planning advantage over the francophone neighbours – and the currency is the dalasi. It is a cash country outside the bigger hotels: plan your withdrawals around the coast and the capital, where the working ATMs live, rather than expecting them upcountry."],
  ["Is The Gambia good for a winter-sun holiday?", "It is one of the best-value winter-sun runs from Europe: six hours' flying, no jet lag to speak of, eight hours of sun a day in the season, and a warm dry coast from November to February. The difference from the Canaries or Egypt is what waits behind the beach – take even one of the day trips on this page and the holiday becomes a travel story."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Gambia guide SKU is live yet (one is planned: "Banjul & the Smiling
// Coast in 2 Days"). The fetch takes all guides so each future SKU appears
// as its own card with no code change; until then the guide sections and
// the BuyBox simply do not render.
const GUIDE_BLURBS = {};

async function fetchGambiaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "gambia" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "gambia" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function GambiaDestinationPage() {
  const { guides, stories } = await fetchGambiaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "The Gambia: is it safe, how many days, and is it more than the beach",
        description:
          "Whether The Gambia is worth visiting, how safe it is, when to go and what getting there costs – the river, the crocodile pool, the monkey forest and the fish market behind the beach resorts.",
        datePublished: "2026-09-02",
        dateModified: "2026-09-02",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "The Gambia" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/gambia",
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
        <span className="text-slate-600">The Gambia</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North & West Africa · The Smiling Coast
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          The Gambia
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it safe, how many days you need, and whether there is more than
          the beach – for Africa's smallest mainland country, which is really
          a river with a coastline attached.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={colobusTroopFeedingBijilo}
              alt="A troop of red colobus monkeys sitting in a circle to feed on the sandy path in Bijilo forest"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is The Gambia worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The Gambia is Africa's smallest mainland country, and the map
                explains everything: it is a river, with a country wrapped
                two dozen kilometres thick around each bank, and one short
                Atlantic coastline where nearly everything a visitor touches
                happens to sit. We arrived the memorable way – by ferry
                across the river mouth, on a rally driving from Gibraltar to
                Guinea – and the crossing remains the best introduction the
                country could design for itself.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do: walk among loose crocodiles at a sacred
                pool a few streets behind the hotel strip, stand inside a
                wild troop of endangered red colobus in a coastal forest,
                watch the country's biggest fish market land its catch on the
                beach at sunset, and – the best of it – take a boat into the
                mangrove creeks, where oyster collectors wear old jeans
                against the shells and live on islands their own harvest
                built. All of it fits inside two days, because nothing is
                more than an hour from the coast. The beach, which is what
                the charters come for, is the base camp rather than the
                point.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats: this is a poor country with a petty-crime
                advisory around its tourist areas, and the standard
                precautions genuinely apply. It is not a safari destination –
                no big five, no great herds; the wildlife here is smaller,
                closer and stranger. And in high summer the rains run the
                calendar. None of that dents the case. English-speaking,
                visa-free for most European passports, six hours from the UK:
                West Africa does not offer an easier first handshake.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The dry season runs roughly November to May, and the winter
                half of it is the sweet spot – this is a country whose
                weather cooperates with a European escape.
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
                The country's size sets the scale honestly: the signatures
                fit in a weekend, and a week adds depth rather than
                distance.
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
                Fly into Banjul – in the November-to-April season the
                winter-sun routes run direct from the UK and several European
                cities, and scheduled connections run year-round via the
                regional hubs. Most UK, EU and ECOWAS passports enter
                visa-free for up to 90 days; verify the current rules
                against an official source close to travel. The overland
                arrival from Senegal – the way we came – is its own small
                adventure, ferry included, and our border story below covers
                what to expect of it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, distances are the country's best feature:
                everything on this page sits within about an hour of the
                coast. Green tourist taxis and negotiated day drivers do the
                work, the river day runs by boat from the creekside jetties,
                and the Banjul–Barra ferry stitches the two banks together.
                English as the official language makes all of it easier to
                arrange in person than almost anywhere else in West Africa.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The rules that matter: it is a cash country outside the
                bigger hotels, so plan withdrawals around the coast and the
                capital rather than upcountry; carry patience at the borders
                if you come overland; and check the advisory close to travel,
                especially around election season.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the biggest line: return flights from the UK
                and Europe run about €500 in season, less on deals. That is
                what reaching The Gambia costs, not what the trip costs –
                because on the ground this is one of the cheaper destinations
                on this site. The shape of the spending is a decision:
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
                The bed is the line with real range – everything else is
                modest. The spending most worth doing is the river day by
                boat: it is the country's best experience and the one thing
                you cannot walk to.
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
                src={founderInTheAtlanticSurf}
                alt="The founder in the surf off the Atlantic strip, palms and the beach hotels behind"
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
                <SectionHeading>Stories from The Gambia</SectionHeading>
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

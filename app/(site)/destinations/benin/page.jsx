import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import airlinerOnTheSand from "../../../../content/countries/benin/destination/generated/web/airliner-on-the-sand-cotonou.jpg";
import womenOnTheGanvieJetty from "../../../../content/countries/benin/destination/generated/web/women-on-the-ganvie-jetty.jpg";
import piroguesAlongTheGanvieWaterfront from "../../../../content/countries/benin/destination/generated/web/pirogues-along-the-ganvie-waterfront.jpg";
import theArchAndItsIronColumns from "../../../../content/countries/benin/destination/generated/web/the-arch-and-its-iron-columns-ouidah.jpg";
import paintedPirogueOnCotonouBeach from "../../../../content/countries/benin/destination/generated/web/painted-pirogue-on-cotonou-beach.jpg";
import pythonRoundTheNeck from "../../../../content/countries/benin/destination/generated/web/python-round-the-neck-ouidah.jpg";
import porteDuNonRetour from "../../../../content/countries/benin/destination/generated/web/porte-du-non-retour-ouidah.jpg";
import theEmptyBeachBeyondTheArch from "../../../../content/countries/benin/destination/generated/web/the-empty-beach-beyond-the-arch.jpg";
import thatchedHutsOnTheLagoonEdge from "../../../../content/countries/benin/destination/generated/web/thatched-huts-on-the-lagoon-edge.jpg";
import polingAPirogueToGanvie from "../../../../content/countries/benin/destination/generated/web/poling-a-pirogue-to-ganvie.jpg";
import firstSightOfGanvie from "../../../../content/countries/benin/destination/generated/web/first-sight-of-ganvie-from-the-water.jpg";
import passengerPirogueOnTheLagoon from "../../../../content/countries/benin/destination/generated/web/passenger-pirogue-on-the-lagoon.jpg";
import fishEnclosureOnLakeNokoue from "../../../../content/countries/benin/destination/generated/web/fish-enclosure-on-lake-nokoue.jpg";
import basketsOfBoneFetishMarket from "../../../../content/countries/benin/destination/generated/web/baskets-of-bone-cotonou-fetish-market.jpg";
import palmsInTheSandCotonou from "../../../../content/countries/benin/destination/generated/web/palms-in-the-sand-cotonou-beach.jpg";

/*
 * MEDIA - the founder's cull, 2026-09-12. His markers in
 * content/countries/benin/destination/_shortlist-run1/: hero.jpg = the
 * airliner on the sand (also the /destinations index card), last.jpg = the
 * women on the Ganvie jetty (the full-width break before the FAQ), plus 13
 * kept frames - one of them a portrait (the python round the neck) that he
 * added from the temple story's pool; it is centre-cropped to 4:3 with an
 * upward bias so the face and the snake survive the slot. Renditions live in
 * content/countries/benin/destination/generated/web/ at 1660 px WIDE, cut
 * AFTER the cull (media selection v9). Ten carousel slides rather than the
 * usual 12-18: that is what he kept, and a short carousel is his call, never
 * padded from the un-chosen candidates.
 *
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Benin is worth going to, which parts, how long, when. Everything operational
 * is absent.
 *
 * A BENIN SKU IS PLANNED, so the §7 line is the STRICT small-SKU teaser
 * budget: one or two tested facts, and only ones a PUBLISHED story already
 * gives away. Withheld by name:
 *   - Ganvie boat hire, the guide arrangement, and what the trip costs.
 *   - The Ouidah circuit order and how long each stop takes.
 *   - Cotonou beds and moto-taxi fares.
 *   - E-visa AMOUNTS and durations. The existence of the e-visa is page-legal;
 *     the price list is not.
 *   - The carnet-de-passage requirement from Benin southward - the reason the
 *     cars stopped here - which is a vehicle-import mechanic and the guide's.
 *
 * THE ONE FIGURE (§8) is the flight - about €600 return from western Europe -
 * labelled as what getting there costs. It appears in the costs section and
 * once in an FAQ answer so the schema carries it. Nothing else here carries an
 * amount.
 *
 * WHAT WAS NOT VISITED, and this one has already bitten once. The founder's
 * saved pins covered Abomey and Porto-Novo; he confirmed on 2026-09-11 that he
 * visited NEITHER ("Abomey i did not visit. Porto novo we did not visit").
 * Two of the five places the pins suggested were never seen. So:
 *   - No Abomey or Porto-Novo region card, and no sentence implying either was
 *     seen. They are named at DECISION level only, explicitly as not visited.
 *   - The north - Pendjari, the Atakora, the Somba country - likewise. The
 *     trip was entirely southern: lagoon, coast road, old slave port.
 *   - Do not reason from the pins. A saved place is research, not evidence.
 *
 * THE FESTIVAL IS LOAD-BEARING. "When is the Benin voodoo festival" is the
 * biggest query this country has. The answer is the 10 January public holiday,
 * plus the expanded Vodun Days festival at Ouidah that has run each January
 * since 2024 (8-10 January in 2026). HE WAS NOT THERE - he came 3-4 February
 * 2024, about three and a half weeks after the first edition. No surface may
 * blur that. Saying plainly that we missed it is more citable than pretending.
 *
 * TRIP RECENCY: Benin is changing faster than anywhere else on this coast.
 * Several national museums were under construction at the time of the trip,
 * and royal treasures looted by France have been returned. The page dates
 * itself for that reason.
 *
 * VOICE: Vodun is a living religion with millions of practitioners and a
 * national holiday, not a curiosity. Describe what is there. "Voodoo" and
 * "Vodun" are its own names and are fine; primitive, superstition, witchcraft
 * and their neighbours do not ship.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title: "Benin: is it worth visiting, when the voodoo festival is, and how long you need · TestedRoutes",
  description:
    "Whether Benin is worth visiting, how long you need and when the Ouidah voodoo festival falls – Ganvié on its lagoon, the slave route at Ouidah and the Temple of Pythons, with safety, season and what getting there costs.",
  alternates: { canonical: "/destinations/benin" },
  openGraph: {
    type: "article",
    url: "/destinations/benin",
    title: "Benin: is it worth visiting, when the voodoo festival is, and how long you need",
    description:
      "A lake town of 37,000 people built to be beyond reach, the door the slave ships loaded from, and a temple of live pythons across the road from a basilica. Two days, and the best country on this coast.",
  },
};

const WHEN_TO_GO = [
  ["November to February", "The dry season and the obvious window: hot, bright, and the lagoon and coast road at their easiest. The harmattan blows dust down from the Sahara from December into February, which softens the light and settles on everything. This is also when the country's biggest event falls."],
  ["Early January, specifically", "The 10 January Vodun holiday, and the expanded Vodun Days festival built around it at Ouidah, which has run every January since 2024 and drew tens of thousands to a town of forty thousand. If you have any flexibility at all, this is the date to plan around – and if crowds are what you are avoiding, it is the date to plan away from. We came three and a half weeks late and missed it entirely."],
  ["March to April", "The hottest stretch of the year on the coast, and the run-up to the rains. Humid, heavy, and the least comfortable time to be walking around Cotonou."],
  ["May to October", "The wet half, in two parts: the main rains from roughly May into July, a drier gap in August, and a shorter second season through September and October. The south stays entirely functional; it is the unpaved north that changes character."],
  ["What I would pick", "The second week of January, for the festival and the dry roads together – knowing that Ouidah will be full and that accommodation will need to be settled a long way ahead. If you want the same country quietly, late November does everything except the festival."],
];

const HOW_LONG = [
  ["Two days", "Enough, genuinely, for the southern circuit that makes Benin worth the flight: the lagoon town of Ganvié, the old slave port at Ouidah with its python temple, and a morning in Cotonou. That is what we had, it is a tight two days, and it was the best two days of a month on this coast."],
  ["Four or five days", "The same circuit without rushing, plus the royal towns inland – Abomey, where the Royal Palaces of Dahomey are a UNESCO World Heritage site, and Porto-Novo, which is the official capital despite Cotonou being the city everyone means. We did not reach either, so treat this row as what the map offers rather than as a recommendation we can stand behind."],
  ["A week or more", "What the north needs: the Atakora hills, the Somba compounds, and Pendjari, one of the better-regarded wildlife parks in West Africa. Note that the far north carries much stronger security warnings than the coast, and check the current advice before you plan anything up there. We went nowhere near it."],
  ["What we actually had", "Two days, at the very end of a rally from Guinea, because the roads had held and nothing had broken badly enough to cost us the time. Benin was not on the original plan at all. It ended up being the country we were most glad we had added."],
];

const REGIONS = [
  {
    name: "The lagoon and Ganvié",
    image: piroguesAlongTheGanvieWaterfront,
    alt: "Dozens of wooden pirogues moored below the stilt houses on the waterfront at Ganvié, Benin",
    body: "Half an hour north of Cotonou, Lake Nokoué holds a town of some thirty-seven thousand people built entirely on stilts over the water – the largest lake village in Africa, and often called the Venice of Africa, which undersells how strange it is. It is there because generations ago people moved onto the water to escape slave raiders who by custom would not follow them there, and the refuge simply never ended. Everything works by boat: a floating market where craft raft up to trade, children paddling themselves to school from about the age of six, and a family needing three canoes to function.",
  },
  {
    name: "Ouidah",
    image: theArchAndItsIronColumns,
    alt: "The Porte du Non-Retour memorial arch with its iron sculpture columns on the beach at Ouidah, Benin",
    body: "The old slave port, on the coast road between the Togo border and Cotonou, and the emotional centre of a trip to Benin. A memorial route runs roughly four kilometres from the square where people were auctioned down to the Porte du Non-Retour, an arch standing on an empty beach where the ships loaded. Ouidah is also the heart of Vodun: the Temple of Pythons, holding around sixty live pythons sacred to the deity Dan, sits directly across the road from the basilica, which tells you most of what you need to know about how the two religions live here.",
  },
  {
    name: "Cotonou and the coast",
    image: paintedPirogueOnCotonouBeach,
    alt: "A painted wooden fishing pirogue hauled up on the sand of the beach west of Cotonou, Benin",
    body: "Not the official capital – that is Porto-Novo – but the city everyone means: the port, the airport, the enormous Dantokpa market, and a population that moves on the back of motorbikes. The landmark to know is the Amazon Monument, thirty metres and a hundred and fifty tonnes of bronze raised in 2022 to the all-female regiment of the Kingdom of Dahomey. West of the centre the Route des Pêches runs along the beach toward Ouidah, being paved and developed as we passed, with an abandoned airliner parked on the sand partway along it.",
  },
];

// "From the trip", in the order the two days ran: Ouidah on the morning of the
// drive in from Togo, Ganvié that afternoon, Cotonou the next day. Captions
// name only what the frame shows.
const CAROUSEL = [
  { image: pythonRoundTheNeck, alt: "A visitor with a royal python draped round the neck in the doorway of the Temple of Pythons, Ouidah, Benin", caption: "A royal python round the neck at the temple door, Ouidah" },
  { image: porteDuNonRetour, alt: "The Porte du Non-Retour memorial arch seen from the landward approach, with the haze of the sea through its opening, Ouidah, Benin", caption: "The Porte du Non-Retour from the landward side" },
  { image: theEmptyBeachBeyondTheArch, alt: "An empty stretch of sand with a single thatched shelter and a few palms fading into haze, the beach at Ouidah, Benin", caption: "The beach beyond the arch" },
  { image: thatchedHutsOnTheLagoonEdge, alt: "Thatched huts and moored boats on the marshy edge of a lagoon outside Ouidah, Benin", caption: "Lagoon-edge huts outside Ouidah, on the road east" },
  { image: polingAPirogueToGanvie, alt: "A man standing in a wooden pirogue with a long pole near the jetty at the Ganvié landing, Benin", caption: "At the jetty, before the crossing to Ganvié" },
  { image: firstSightOfGanvie, alt: "Stilt houses on the lagoon with paddlers passing on the open water at Ganvié, Benin", caption: "Ganvié from the water" },
  { image: passengerPirogueOnTheLagoon, alt: "A long wooden passenger pirogue with a canopy, full of people, under way on Lake Nokoué, Benin", caption: "A loaded passenger pirogue, the lagoon's public transport" },
  { image: fishEnclosureOnLakeNokoue, alt: "A small thatched hut on stilts ringed by reed fencing on open water, a fish enclosure on Lake Nokoué, Benin", caption: "A fish enclosure on Lake Nokoué" },
  { image: basketsOfBoneFetishMarket, alt: "Woven baskets of dried animal bone and a yellow tub of pieces on a concrete ledge at the fetish market, Cotonou, Benin", caption: "Baskets of bone at the fetish market, Cotonou" },
  { image: palmsInTheSandCotonou, alt: "Young palms planted in the sand with people sitting between them on the beach west of Cotonou, Benin", caption: "Palms planted in the sand west of Cotonou" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Small hotels in Cotonou and Ouidah, shared taxis along the coast road, motorbike taxis in the city, eating at the roadside. Benin is inexpensive at this level and the infrastructure for it exists"],
  ["Core", "A comfortable hotel in Cotonou or on the coast, and a car with a driver for the days you are moving between the lagoon, Ouidah and the city – which is what turns a tight two days into a comfortable one"],
  ["Splurge", "A small number of international-standard hotels in the capital and a growing set of beach places along the Route des Pêches, which is being developed hard. The ceiling is rising here faster than anywhere else on this coast"],
];

const TIPS = [
  ["Two days really is enough for the good part.", "This is unusual and worth saying plainly: the southern circuit – the lagoon, Ouidah, Cotonou – fits into two days without feeling rushed, because everything is within an hour or so of everything else. Benin is the country on this coast with the best ratio of remarkable things to driving hours, and it is why we added it at the end of a trip rather than at the start of one."],
  ["Ouidah is on the road, not a detour.", "It sits on the coast road between the Togo border and Cotonou, so if you are coming along the coast from Lomé you pass it on the way in rather than doubling back from the capital. We stopped there on the drive from Togo, before we had seen anything else in the country, which turned out to be the right order for reasons nobody plans for."],
  ["Decide about the January festival on purpose.", "The Vodun holiday falls on 10 January and the expanded festival at Ouidah has run around it every year since 2024, pulling tens of thousands of people – including large delegations from Haiti, Brazil, Cuba and the United States – into a small town. It is either the reason to come or the fortnight to avoid, and both are good decisions. What is not a good decision is finding out about it after you have booked."],
  ["Cotonou moves on motorbikes, and that is how you should see it.", "The way you cross this city is to stand at the edge of the road until a man on a scooter slows down, say where you are going and get on the back. It is the most efficient and least reassuring transport I have used, and it gave us more of the city in an hour than three days of driving through capitals had managed – because you are in the traffic rather than sealed off from it."],
];

const FAQ = [
  ["Is Benin worth visiting?", "Yes, and of the countries we crossed on one long drive down this coast it was the one we were most glad we had added – which is telling, because it was not on the plan at all. We only went because the roads had held and we had days in hand. What it has, in a very small area, is a town of thirty-seven thousand people built on stilts over a lagoon to escape slave raiders; the old slave port at Ouidah with the memorial route running down to the door the ships loaded from; a temple of live pythons across the road from a basilica; and a capital that moves entirely on the back of motorbikes. The ratio of remarkable things to driving hours is the best on this coast."],
  ["How many days do you need in Benin?", "Two, for the southern circuit that is the reason to come: the lagoon at Ganvié, Ouidah, and Cotonou. That is what we had and it did not feel rushed, because everything is within about an hour of everything else. Four or five days would let you add the royal towns inland – Abomey, whose Royal Palaces are UNESCO-listed, and Porto-Novo, the official capital – though we reached neither, so that is the map's recommendation rather than ours. A week or more is what the north needs, and the north carries security warnings the coast does not."],
  ["When is the voodoo festival in Benin, and can you attend?", "10 January is the national Vodun holiday, and it has been marked in Ouidah for decades. Since 2024 the government has built an expanded multi-day festival around it – Vodun Days – which in 2026 ran from 8 to 10 January and has drawn tens of thousands of visitors, including large delegations from Haiti, Brazil, Cuba and the United States. It is public, it is meant to be attended, and it is centred on Ouidah rather than the capital. We should be straight that we did not see it: we were in Benin at the beginning of February, about three and a half weeks after the first edition, and we missed it entirely. If the festival is why you are coming, build the trip around the second week of January and book a long way ahead – it is a town of forty thousand absorbing a crowd many times that."],
  ["What is Ganvié, and is it worth the trip?", "It is a town of around thirty-seven thousand people built on stilts over Lake Nokoué, north of Cotonou – the largest lake village in Africa, and the thing most people mean when they say the Venice of Africa. It is worth the trip, and the reason it exists is the reason it stays with you: generations ago people moved out onto the water to escape raiders supplying the Atlantic slave trade, who by custom would not follow them onto it, and the refuge became permanent. It is not a preserved site. There is a floating market where boats raft up to trade, a school, churches, a mosque, and children who paddle themselves to class alone from about the age of six. You see it from a boat, because there is no other way to see it."],
  ["Is Benin safe to visit?", "Check your own government's current advice and let it outrank this page, but the southern part of the country – which is where essentially all visitors go – has generally been rated at the middle of the caution scale, Level 2 in US terms at the time of our trip. The important qualification is geographic: the far north, near the Burkina Faso and Niger borders, carries much stronger warnings because of the jihadist insurgency spilling south across the Sahel, and that includes the approaches to Pendjari. The coastal strip is a different proposition. Our own two days involved nothing more alarming than the traffic, which is genuinely the main risk here."],
  ["When is the best time to visit Benin?", "November to February, the dry season, with the harmattan haze as the trade-off from December into February. Early January is the single best window if you want the Vodun festival, and the single worst if you want Ouidah quiet. The main rains fall from roughly May into July, with a drier gap in August and a shorter wet season in September and October; the south keeps working throughout, and it is the unpaved north where the season decides what is possible. We came at the start of February and the conditions were ideal – and three and a half weeks too late for the festival."],
  ["What is the Temple of Pythons in Ouidah?", "A working Vodun temple in the centre of Ouidah holding around sixty live royal pythons, which are sacred to Dan, one of the principal Vodun deities. The snakes are non-venomous and are handled; visitors are usually given the chance to have one placed around their neck, and they are periodically released into the town to feed and then collected again, which is a genuine local custom rather than a story told to tourists. What makes the place worth describing properly is where it sits: directly opposite the Basilica of the Immaculate Conception, across a normal street. Two religions facing each other at a road junction, both of them full."],
  ["What is the Door of No Return at Ouidah?", "It is a memorial arch standing on the beach at Ouidah, at the end of a route of roughly four kilometres running from the square in town where enslaved people were auctioned down to the shore where they were put onto the ships. The route is marked by monuments and memorials along its length, and the arch at the end is deliberately placed on an empty stretch of sand with nothing beyond it but the Atlantic. Ouidah was one of the principal embarkation ports of the Atlantic slave trade, and roughly a million people are estimated to have been shipped from this coast. It is not a sight to be fitted between other things. Give it the morning."],
  ["Is Cotonou worth visiting?", "For a day, and mainly as a way of seeing how the country actually works rather than for a list of sights. It is the economic capital rather than the official one – Porto-Novo holds that title – and it holds the port, the airport, and Dantokpa, one of the largest markets in West Africa. The landmark to know is the Amazon Monument, thirty metres of bronze raised in 2022 to the all-female regiment of the Kingdom of Dahomey. The best way to see it is the way everyone else does, on the back of a motorbike taxi, which is cheap, quick and gives you more of the city in an hour than a car does in a day."],
  ["Is Benin the same as Benin City in Nigeria?", "No, and the confusion is entirely reasonable. Benin City is in southern Nigeria and was the capital of the historical Kingdom of Benin – the Edo kingdom the Benin Bronzes came from. The Republic of Benin is a separate country a few hundred kilometres west, which was called Dahomey until 1975 and took its new name from the Bight of Benin, the stretch of coast rather than the kingdom. The two are not related in any political sense. Confusingly, the Republic of Benin has its own royal history, the Kingdom of Dahomey, whose palaces at Abomey are UNESCO-listed and whose treasures were looted by France and have in recent years been returned."],
  ["Do you need a visa for Benin?", "Most visitors do, and Benin runs one of the more painless systems in the region: an e-visa applied for entirely online before travel, issued within a few days. A yellow fever vaccination certificate is a genuine entry requirement rather than a formality. If you are bringing your own vehicle, the paperwork for the car is a separate and much larger problem than the paperwork for you – Benin is the point on this coast where the requirements tighten, and it is the reason our cars stopped here rather than carrying on east."],
  ["Is Benin expensive?", "Getting there is the cost that matters: return flights from western Europe run about €600 booked ahead, most practically direct from Paris or Brussels. That is what reaching Benin costs, not what the trip costs. On the ground it is inexpensive by any European measure, and because the circuit is compact you are not spending much on distance either. The currency is the West African CFA franc, pegged to the euro, so prices are easy to read if you are coming from Europe. The one caveat is that the coast west of Cotonou is being developed fast and the upper end of the market is rising with it."],
  ["Can you combine Benin with Togo and Ghana?", "Yes, and it is the natural shape of a trip here – Ghana, Togo and Benin run end to end along the Gulf of Guinea, and we drove the whole thing in two elderly estate cars. Coming from the west you cross from Togo onto the coast road and pass Ouidah on your way to Cotonou, which means the slave port arrives before the capital rather than as a day trip from it. As a circuit the three countries are about ten days: five for Ghana, one or two for Togo, two for Benin. Doing it by bus and shared taxi is straightforward; bringing a vehicle is a different order of difficulty, and the paperwork rather than the roads is what costs you."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Benin guide SKU is live yet - one is planned. The fetch takes all guides
// so the SKU appears as its own card with no code change; until then the guide
// sections and the BuyBox do not render, and no sentence here may say "the
// guide carries X". When the SKU lands, do the pointer pass over the how-long
// section and the FAQ.
const GUIDE_BLURBS = {};

async function fetchBeninContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "benin" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "benin" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function BeninDestinationPage() {
  const { guides, stories } = await fetchBeninContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Benin: is it worth visiting, when the voodoo festival is, and how long you need",
        description:
          "Whether Benin is worth visiting, how long you need and when the Ouidah voodoo festival falls – Ganvié on its lagoon, the slave route at Ouidah and the Temple of Pythons.",
        datePublished: "2026-09-12",
        dateModified: "2026-09-12",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Benin" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/benin",
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
        <span className="text-slate-600">Benin</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North &amp; West Africa · The Gulf of Guinea
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Benin
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth it, how long you need, and when the voodoo festival
          actually falls – for the country we added at the end and wished we
          had started with.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={airlinerOnTheSand}
              alt="A three-engined airliner parked on the sand with a boarding staircase at its door and palms behind, on the beach west of Cotonou, Benin"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Benin worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Benin was not on our plan. We added it at the end of a month
                driving down the West African coast because the roads had held,
                nothing had broken badly enough to cost us the days, and it was
                the next country along. Of the seven we crossed, it is the one
                we were most glad we had gone to – and the ratio of remarkable
                things to hours in a car is the best on this coast by a distance.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                In an area you could drive across in a morning there is a town
                of thirty-seven thousand people standing on stilts over a
                lagoon, built there because raiders supplying the Atlantic slave
                trade would not follow people onto water. There is the old slave
                port at Ouidah, where a memorial route runs four kilometres from
                the auction square down to an arch on an empty beach. There is a
                temple holding sixty live pythons directly across the road from
                a basilica. And there is Cotonou, a working port capital that
                moves almost entirely on the back of motorbikes.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Vodun is not a sideshow here, which is the thing most coverage
                gets wrong. It is a recognised religion with a national public
                holiday on 10 January, millions of practitioners, and a
                relationship with Beninese Christianity that is a great deal
                more comfortable than outsiders expect – the python temple and
                the basilica face each other across an ordinary street and both
                are busy. Benin is where Vodun crossed the Atlantic from, which
                is why delegations come back from Haiti, Brazil and Cuba for the
                January festival.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two honest limits. We had two days and saw the south only – no
                Abomey, no Porto-Novo, and nothing at all of the north or
                Pendjari, so anything on this page about those is the map
                talking rather than us. And we missed the festival by three and
                a half weeks, which is annoying enough that the dates are
                written out properly below so you do not do the same.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Unusually, the season here is a secondary question. The primary
                one is whether you want to be in Ouidah in the second week of
                January, and there is a good case either way.
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
                Benin is compact, and the good part of it is more compact still.
                That makes the honest answer shorter than you would guess.
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

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
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
                There are three cards here because we saw three places. Two
                more exist that we did not reach and will not pretend to
                describe: Abomey, a couple of hours inland, where the Royal
                Palaces of the Kingdom of Dahomey are a UNESCO World Heritage
                site and where the royal treasures returned by France are now
                held; and Porto-Novo, the official capital, which almost nobody
                treats as one. Further north again are the Atakora hills, the
                Somba compounds and Pendjari – a serious wildlife park, in a
                region that carries much heavier security warnings than the
                coast. All of that is research. The south is what we can speak
                for.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One note on timing, because Benin is changing faster than
                anywhere else on this coast. When we passed through, several
                national museums were still building sites, the returned Dahomey
                treasures were newly back in the country, and the beach road
                west of Cotonou was being paved into a resort strip. A trip
                report from this coast dates quickly, and this one is from early
                in that cycle.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Cotonou. Paris and Brussels both have direct services
                and most other routings connect through another African hub; the
                flight is around six hours from northwest Europe plus any
                connection. Most visitors need a visa, and Benin's is one of the
                easier ones in the region – applied for entirely online in
                advance. A yellow fever certificate is a genuine entry
                requirement.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Once here, the southern circuit is short enough that transport
                is barely a constraint: Ouidah, the lagoon and the capital sit
                within about an hour of one another along one road. Cotonou
                itself runs on motorbike taxis, which is how you should see it.
                For the days you are moving between towns, a car with a driver
                is the arrangement that makes two days feel unhurried. Coming
                overland from Togo is entirely normal and puts Ouidah on the way
                in.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                French is the working language of everything official; Fon and
                Yoruba are the widely spoken national languages in the south.
                The currency is the West African CFA franc, pegged to the euro,
                and outside the better hotels this is a cash country.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the part nobody
                can avoid: return flights from western Europe run about €600
                booked ahead, most practically direct from Paris or Brussels.
                That is what reaching Benin costs, not what the trip costs. On
                the ground the country is inexpensive by any European measure,
                and because the circuit is compact you are not paying much for
                distance either:
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
                The one date that changes the arithmetic is the January
                festival, when a town of forty thousand absorbs a crowd many
                times its size and everything within reach of Ouidah prices
                accordingly. Either commit to it early or come at a different
                time of year – the worst outcome is arriving in the second week
                of January without having meant to.
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
                src={womenOnTheGanvieJetty}
                alt="Women in matching printed cloth gathered on the wooden jetty at the Ganvié landing on Lake Nokoué, Benin"
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
                <SectionHeading>Stories from Benin</SectionHeading>
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

            <section className="space-y-4">
              <SectionHeading>The rest of the drive</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Benin was the last of seven countries on one drive down the West
                African coast that began in{" "}
                <Link
                  href="/destinations/guinea"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Guinea
                </Link>
                . Immediately west are{" "}
                <Link
                  href="/destinations/togo"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Togo
                </Link>
                , which is honestly a day, and{" "}
                <Link
                  href="/destinations/ghana"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Ghana
                </Link>
                , which needs five and which came last on our list. The three
                together are one road and about ten days. We left the cars in a
                yard here, which is why the following year's drive started in
                Benin rather than ending in it.
              </p>
            </section>
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

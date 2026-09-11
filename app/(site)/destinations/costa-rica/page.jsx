import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

/* IMAGES — cut 2026-09-11 from the founder's cull of
 * content/countries/costa-rica/destination/_shortlist-run1/ (destination
 * playbook §11, media playbook Phase 4 ¶ and ‡): his markers were honoured as
 * slot assignments — hero.jpg is the hero, last.jpg the closing full-width —
 * and the rest fill the region cards and the carousel. 1660 px wide, q85.
 * Three portrait frames (coffee cherries, the waterfall, the bathers) were
 * centre-cropped to 4:3 at export because the carousel renders 4:3 with
 * object-cover, and the crops were looked at before shipping. One frame is
 * NOT from the hub cull: the wildlife card's sloth comes from the founder's
 * cull of the see-sloths story pool (his own frame, kept by him), because the
 * hub pool carried no animal at all and the card is the country's headline
 * argument. Six kept frames were not cut because no slot needed them (the
 * stone-edged Tabacón pool, the Monteverde viewpoint with the figure, the
 * beach at dusk on 9 Jan, the hotel pool at night, the pool at dusk, and the
 * blue-lit San José square) — they stay in _shortlist-run1 for a re-cull. */
import arenalConeOverTheLodgePool from "../../../../content/countries/costa-rica/destination/generated/web/arenal-cone-over-the-lodge-pool.jpg";
import tabaconPoolAndCascade from "../../../../content/countries/costa-rica/destination/generated/web/tabacon-pool-and-cascade.jpg";
import monteverdeHangingBridge from "../../../../content/countries/costa-rica/destination/generated/web/monteverde-hanging-bridge.jpg";
import pacificSunsetThroughThePalms from "../../../../content/countries/costa-rica/destination/generated/web/pacific-sunset-through-the-palms.jpg";
import caribbeanBeachPalmsAndRocks from "../../../../content/countries/costa-rica/destination/generated/web/caribbean-beach-palms-and-rocks.jpg";
import irazuCraterLake from "../../../../content/countries/costa-rica/destination/generated/web/irazu-crater-lake.jpg";
import slothHangingInTheCanopy from "../../../../content/countries/costa-rica/destination/generated/web/sloth-hanging-in-the-canopy.jpg";
import teatroNacionalSanJoseAtNight from "../../../../content/countries/costa-rica/destination/generated/web/teatro-nacional-san-jose-at-night.jpg";
import coffeeCherriesOnTheBush from "../../../../content/countries/costa-rica/destination/generated/web/coffee-cherries-on-the-bush.jpg";
import newYearBonfiresOnJacoBeach from "../../../../content/countries/costa-rica/destination/generated/web/new-year-bonfires-on-jaco-beach.jpg";
import tallShipOffTheCaribbeanCoast from "../../../../content/countries/costa-rica/destination/generated/web/tall-ship-off-the-caribbean-coast.jpg";
import laFortunaWaterfall from "../../../../content/countries/costa-rica/destination/generated/web/la-fortuna-waterfall.jpg";
import arenalLodgePondAndLake from "../../../../content/countries/costa-rica/destination/generated/web/arenal-lodge-pond-and-lake.jpg";
import tabaconHotRiverCascades from "../../../../content/countries/costa-rica/destination/generated/web/tabacon-hot-river-cascades.jpg";
import bathersInTheTabaconRiver from "../../../../content/countries/costa-rica/destination/generated/web/bathers-in-the-tabacon-river.jpg";
import lakeArenalFromTheMonteverdeRoad from "../../../../content/countries/costa-rica/destination/generated/web/lake-arenal-from-the-monteverde-road.jpg";
import monteverdeRidgesFromTheRoad from "../../../../content/countries/costa-rica/destination/generated/web/monteverde-ridges-from-the-road.jpg";
import waterfallOnTheMonteverdeTrail from "../../../../content/countries/costa-rica/destination/generated/web/waterfall-on-the-monteverde-trail.jpg";
import pacificSunsetSwimmer from "../../../../content/countries/costa-rica/destination/generated/web/pacific-sunset-swimmer.jpg";
import infinityPoolOverThePacific from "../../../../content/countries/costa-rica/destination/generated/web/infinity-pool-over-the-pacific.jpg";
import manuelAntonioBayAtDusk from "../../../../content/countries/costa-rica/destination/generated/web/manuel-antonio-bay-at-dusk.jpg";
import manuelAntonioBeachUmbrellas from "../../../../content/countries/costa-rica/destination/generated/web/manuel-antonio-beach-umbrellas.jpg";
import sanJoseMarketStall from "../../../../content/countries/costa-rica/destination/generated/web/san-jose-market-stall.jpg";
import bananasAtASanJoseMarket from "../../../../content/countries/costa-rica/destination/generated/web/bananas-at-a-san-jose-market.jpg";
import bronzeFiguresSanJose from "../../../../content/countries/costa-rica/destination/generated/web/bronze-figures-san-jose.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION – whether
 * Costa Rica is worth what it costs, how many days, which coast, when to go,
 * whether it is safe. Everything operational (drive legs and their real times,
 * which lodge, which park entrance, ticket prices, booking mechanics, day
 * sequencing) is deliberately absent.
 *
 * NO GUIDE SKU EXISTS YET. Two are planned – a 7-day Arenal + Manuel Antonio
 * loop (wave 3) and a 14-day coast-to-coast (wave 4) – and neither is built.
 * So no sentence here may say "the guide carries X": mechanics are asserted to
 * exist, unreferenced. A pointer pass over the FAQ and the how-long section is
 * OWED the day the first SKU publishes.
 *
 * THE ONE FIGURE (§8) is the flight, ~€650 return from western Europe, and it
 * is labelled as what getting there costs. Costa Rica's whole story is that it
 * is expensive, which makes it exactly the page where a second number would do
 * the most damage: the founder's objection to Iceland's tier totals ("when
 * people see 3k or 9k, they will not buy the guide") applies double here. The
 * "roughly twice its neighbours" line is a CHARACTERISATION, not a price, and
 * it is page-legal because the published Cost story makes it. The specific
 * amounts behind it (the waterfall fee, the raft, the beach day) are in the
 * source file and stay there – the story itself deliberately omits them.
 *
 * TRIP RECENCY: the source trip is Dec 2019 – Jan 2020, six-plus years old.
 * Every price, opening, road and operator on this page needs full
 * re-verification at SKU build. Written to be durable: seasons, geography and
 * the value judgement age well; nothing here depends on a 2019 timetable.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Costa Rica: is it worth the money, how long you need, and which coast · TestedRoutes",
  description:
    "Whether Costa Rica is worth what it charges, how many days you actually need, which coast to pick and when to go – from a first-timer's loop that rated it second of three Central American countries.",
  alternates: { canonical: "/destinations/costa-rica" },
  openGraph: {
    type: "article",
    url: "/destinations/costa-rica",
    title:
      "Costa Rica: is it worth the money, how long you need, and which coast",
    description:
      "The polished, expensive one. What genuinely earns its price here, what trades on a reputation it no longer deserves, and how to choose between the two coasts.",
  },
};

const WHEN_TO_GO = [
  ["December to April", "The dry season, and it is dry on the Pacific side and in the Central Valley rather than everywhere. This is peak: the most reliable weather of the year, the highest prices, and the busiest parks. Christmas and Easter are the two weeks when the whole country is booked out and priced accordingly."],
  ["May to August", "The green season starting. Mornings are usually clear and the rain arrives in the afternoon, which is far more workable than \"rainy season\" suggests – you get your morning, you sit out the storm, the landscape is greener and the rates drop hard. The best value the country offers."],
  ["September and October", "The single most useful thing to know about Costa Rican weather: the two coasts are on opposite schedules. These are the wettest, least pleasant months on the Pacific – and the driest, best window of the year on the Caribbean. A trip that would be a washout at Manuel Antonio can be the right trip at Puerto Viejo in exactly the same fortnight."],
  ["November", "The turn. The Pacific dries out through the month and the crowds have not arrived yet, which makes late November one of the two best-value windows in the calendar."],
  ["What I would pick", "Late November or early December, for dry Pacific weather before the peak-season pricing lands – you pay for that with a real chance of a wet week if the season turns late. If I wanted the Caribbean side I would ignore all of the above and go in September or October, accept that half the country is soaked, and have Puerto Viejo and Cahuita at their best and cheapest."],
];

const HOW_LONG = [
  ["Under a week", "Not worth the flight from Europe, and it is worth saying so plainly. Between the transatlantic legs and the drive out of San José, a five-day trip is two days of travelling and three of hurrying. If this is all you have, it is a better week somewhere closer."],
  ["One week", "Enough for one coast plus the volcanoes-and-cloud-forest spine in the middle, and that is the honest ceiling. A week means choosing a coast rather than touring the country – the people who try to do both spend the week in the car, on roads that are consistently slower than the map suggests."],
  ["Ten days to two weeks", "The version that works. Both coasts become possible, the middle stops being a corridor you rush through, and you can afford to lose a day to weather without the whole plan collapsing. If you are flying from Europe, this is the trip to aim at."],
  ["Three weeks or more", "Now the remoter parts open up – the Osa Peninsula and Corcovado, Tortuguero, the far north-west – and the pace stops being the point. This is a lot of country for its size, but only once you have given up on seeing it in a fortnight."],
];

const REGIONS = [
  {
    name: "Arenal and La Fortuna",
    image: arenalConeOverTheLodgePool,
    alt: "Arenal volcano's cone under a cap of cloud, above a lodge garden and pool near La Fortuna, Costa Rica",
    body: "The one region I would tell anyone not to cut. A textbook volcanic cone standing over a small town, rainforest trails around its base, waterfalls in the hills, and hot springs fed by the mountain itself – including a river running warm over the rock rather than a pool with a gate on it. It is the part of the country where the price and the thing you get for it line up most convincingly, and it works in bad weather, which most of Costa Rica does not.",
  },
  {
    name: "Monteverde and the cloud forest",
    image: monteverdeHangingBridge,
    alt: "A red suspension bridge running through the canopy of the Monteverde cloud forest, Costa Rica",
    body: "High, cool, permanently damp forest hung with moss, reached by a climb that takes far longer than the distance implies. Hanging bridges, ziplines and canopy walkways are the standard way to see it. Manage your expectations on the walking: if you arrive from serious hiking country this is a gentle stroll through pretty forest rather than a challenge, and the marketing around it works hard.",
  },
  {
    name: "The Pacific coast",
    image: pacificSunsetThroughThePalms,
    alt: "Sunset over the Pacific seen through palms on Costa Rica's coast",
    body: "The side the brochures sell and most itineraries default to: surf towns, the wildlife crowds of Manuel Antonio, resorts, paved access and English on every menu. It is easy and it is busy, and the polish is priced in. Sunsets here are genuinely superb. The beaches are good rather than secret, and this is the coast where the gap between what you pay and what you get opens widest.",
  },
  {
    name: "The Caribbean coast",
    image: caribbeanBeachPalmsAndRocks,
    alt: "Palms and dark rocks on a Caribbean beach in Costa Rica, blue water beyond",
    body: "A different country in feel. Afro-Caribbean food, music and pace, jungle pushing right down to the sand, reef and wildlife within a short walk of each other at Cahuita, fewer resorts and more small places. It is wetter, scrappier and less arranged for you, and your money goes noticeably further. It also runs on the opposite weather calendar to the Pacific, which is what makes it the answer for half the year.",
  },
  {
    name: "The Central Valley",
    image: irazuCraterLake,
    alt: "The crater lake of Irazú volcano under bare grey volcanic slopes, Costa Rica",
    body: "Where you land and where the country actually lives. San José is a working capital rather than a sight and most visitors are right to leave it quickly, but the valley around it is not: drive-up volcano craters, coffee grown on the slopes, and a plantation tour that turns out to be one of the better things you can spend money on here. Treat it as the first and last day of the trip rather than a destination.",
  },
  {
    name: "The wildlife, everywhere",
    image: slothHangingInTheCanopy,
    alt: "A sloth hanging from a branch among the leaves on a rainforest trail near La Fortuna, Costa Rica",
    body: "The strongest argument the country makes, and the one that is not really regional. Sloths, monkeys, macaws, toucans and frogs are not confined to the famous parks – they turn up on ordinary trails, around town edges and above hotel pools. What changes your hit rate is not picking the perfect park but going early, moving slowly, and walking near someone whose eye is trained. That is the skill Costa Rica rewards.",
  },
];

/* Trip photos, the founder's cull, in the order the trip ran. Captions name a
 * place only where the frame or the trip record settles it; the rest stay
 * neutral (destination playbook §11, the Mauritania rule). */
const CAROUSEL = [
  { image: teatroNacionalSanJoseAtNight, alt: "The lit façade of the Teatro Nacional in San José at night", caption: "San José's Teatro Nacional, the first night" },
  { image: coffeeCherriesOnTheBush, alt: "Red coffee cherries in clusters on a coffee bush", caption: "Coffee cherries, red on the bush" },
  { image: newYearBonfiresOnJacoBeach, alt: "Bonfires burning on a dark beach with people around them at Jacó on New Year's Eve", caption: "New Year's Eve on the sand at Jacó" },
  { image: tallShipOffTheCaribbeanCoast, alt: "A three-masted tall ship on a grey sea off Costa Rica's Caribbean coast", caption: "A tall ship off the Caribbean coast" },
  { image: laFortunaWaterfall, alt: "A tall waterfall dropping through forest into a gorge near La Fortuna", caption: "The waterfall below La Fortuna" },
  { image: arenalLodgePondAndLake, alt: "A lodge pond in a lawn with Lake Arenal and hills behind", caption: "The lodge pond, Lake Arenal beyond" },
  { image: tabaconHotRiverCascades, alt: "The hot river at Tabacón stepping down through planted jungle in small cascades", caption: "Tabacón: hot water, running over the rock" },
  { image: bathersInTheTabaconRiver, alt: "People sitting in the falling water of the hot river at Tabacón", caption: "Sitting in the falls" },
  { image: lakeArenalFromTheMonteverdeRoad, alt: "Lake Arenal and green hills seen from the road towards Monteverde", caption: "Lake Arenal, on the road to Monteverde" },
  { image: monteverdeRidgesFromTheRoad, alt: "Steep forested ridges running away into haze at Monteverde", caption: "Cloud-forest ridges, Monteverde" },
  { image: waterfallOnTheMonteverdeTrail, alt: "A small waterfall beside a trail in the Monteverde cloud forest", caption: "A small fall beside the cloud-forest trail" },
  { image: pacificSunsetSwimmer, alt: "The sun setting over the Pacific with a swimmer in the shallows", caption: "The Pacific does sunsets properly" },
  { image: infinityPoolOverThePacific, alt: "An infinity pool and palms looking out over the Pacific under a blue sky", caption: "Morning over the Pacific" },
  { image: manuelAntonioBayAtDusk, alt: "A calm bay and forested headland at Manuel Antonio in low evening light", caption: "The bay below the point, at dusk" },
  { image: manuelAntonioBeachUmbrellas, alt: "Umbrellas and people on the beach at Manuel Antonio with the forested point behind", caption: "Manuel Antonio's beach on an ordinary day" },
  { image: sanJoseMarketStall, alt: "A market stall in San José stacked with vegetables, garlic and fruit", caption: "A San José market, on the last morning" },
  { image: bananasAtASanJoseMarket, alt: "Bunches of green bananas hanging and stacked at a San José market", caption: "Green bananas by the ton" },
  { image: bronzeFiguresSanJose, alt: "A group of bronze figures standing on a pavement in central San José", caption: "San José, in bronze" },
];

// Deliberately no tier totals (destination playbook §8). The ONE figure on
// this page is the flight, labelled as what getting there costs. On a country
// whose defining trait is that it is expensive, a second number turns this
// section back into a budget and the page stops selling anything.
const COSTS = [
  ["Lean", "Public buses, which are excellent and cost almost nothing; eating at sodas, the small family restaurants where Costa Ricans actually eat; hostels and cabinas; and being ruthless about which paid attractions you say yes to. This is the version where the country stops feeling overpriced, because you have stopped buying the overpriced parts"],
  ["Core", "A hire car, which is what most people come for and what unlocks the country; mid-range lodges with something to look at from the balcony; and a handful of guided walks, which are the paid experiences that most reliably repay their price. Expect accommodation and tours to take most of the budget"],
  ["Splurge", "Costa Rica has a genuine high end and it is priced at international rather than Central American rates: eco-lodges in their own reserves, private guides, small-plane hops that turn a six-hour drive into forty minutes. It buys comfort and time, and time is the one it is actually worth paying for here"],
];

const TIPS = [
  ["Judge the price against what you get, not against the neighbours.", "The country runs roughly twice the cost of its Central American neighbours, and most of the time it earns that – the infrastructure works, the roads are signed, the water is drinkable, the guiding is professional. What stings is the narrower case where you pay a premium and receive something ordinary: a walk through pleasant forest sold as an extraordinary experience, an activity that turns out to be a standard day out. The fix is not a smaller budget, it is being selective. Say yes to fewer things and pay properly for them."],
  ["Learn to look up before you pay someone to point.", "Sloths are the animal people most want and most often miss, and the reason is that they barely move and their fur grows algae until it matches the branch exactly. The famous parks earned their reputation, but the variable that actually decides your day is technique: go in the morning, stop scanning the path and start reading the high forks of the trees for a lump that does not fit, and walk near a trained eye at least once so yours learns the shape. After the first one you find them yourself, anywhere."],
  ["The ocean is the real hazard here, not the crime.", "Rip currents are the leading cause of accidental death for visitors to Costa Rica after road accidents – ahead of snakes, ahead of crime, ahead of every adventure activity in the country combined – and they kill on beaches that look completely benign. Many of the best-looking Pacific beaches have no lifeguard. Ask locally before you swim rather than reading the water yourself, and treat an empty beach as information rather than as luck."],
];

const FAQ = [
  ["Is Costa Rica worth visiting?", "Yes, but go in knowing what it is. Costa Rica is the polished, easy, safe-feeling country in Central America, with genuinely world-class wildlife and an infrastructure that works – and it charges accordingly, roughly twice what its neighbours do. Where that money buys something special, which is most of the wildlife, the volcano-and-hot-springs country around Arenal, the coffee and the better restaurants, it is worth it. Where it buys a pleasant walk in ordinary forest sold as an extraordinary experience, it is not. Ranked against Nicaragua and Panama on the same trip, it came second: better run than either, and less alive than Nicaragua."],
  ["Is Costa Rica expensive?", "Yes, and often on a par with western Europe or the United States rather than with its neighbours, which is what catches people out. Getting there is the unavoidable line – return flights from western Europe run about €650 booked ahead – and that is what reaching the country costs, not what the trip costs. On the ground, accommodation and paid activities are what move the number; buses and sodas are cheap, and the green season knocks a large slice off room rates. The honest warning is about value rather than price: the country has worked out that visitors will pay, and a few headline experiences are priced on reputation rather than on what they deliver."],
  ["How many days do you need in Costa Rica?", "Ten days to two weeks if you are flying from Europe. One week is the realistic minimum and it forces a choice: one coast plus the volcano-and-cloud-forest middle, not the whole country. Under a week is not worth the flight – you spend two days travelling and three hurrying. Three weeks opens up the Osa Peninsula and Tortuguero, which is where the country stops feeling like a circuit."],
  ["Pacific or Caribbean coast – which should I pick?", "Pacific if it is your first trip to the tropics and you want it easy: surf towns, Manuel Antonio's wildlife, paved access, English everywhere, and reliably good sunsets. Caribbean if \"catered\" reads as a downside – Puerto Viejo and Cahuita are slower, Afro-Caribbean in food and music, jungle right down to the sand, and cheaper for what you get. The deciding factor for a lot of people is the calendar rather than the character: the two coasts have opposite weather, so September and October are the worst weeks of the year on the Pacific and the best on the Caribbean. In one week you do one of them properly, not both."],
  ["When is the best time to visit Costa Rica?", "December to April for the Pacific side and the Central Valley – that is the dry season, and it is also the peak, at peak prices. May to August is the green season and much better than it sounds: clear mornings, afternoon storms, greener country and materially cheaper rooms. And the fact almost nobody leads with – the Caribbean coast runs on the opposite schedule, so September and October, the wettest months on the Pacific, are the driest and best on the Caribbean side. Pick the coast first, then the month, not the other way round."],
  ["Is Costa Rica safe?", "Yes by the standards of the region, and the risk is probably not the one you are expecting. The country sits at the milder end of the advisory scale, with petty theft the common problem – opportunistic, and worst around beaches, parked cars and crowded areas. The genuine danger is the sea: rip currents are the leading cause of accidental death among visitors after road accidents, ahead of crime and every adventure activity combined, and they occur on beaches with no lifeguard and no warning sign. Drive carefully, do not leave anything in a parked car, and ask locally before you swim."],
  ["Do you need a car in Costa Rica?", "For most itineraries, yes – it is the difference between seeing the country and seeing a few bus stations. Distances are short on the map and long in practice, and having your own wheels is what makes the volcano country, the cloud forest and the coasts fit into one trip. The exception is a genuine budget trip: the public bus network is comprehensive, extremely cheap and used by everyone, and if you are staying put in two or three places rather than touring you may not need to hire anything at all."],
  ["Where can you see sloths in Costa Rica?", "The two parks with the big reputation are Manuel Antonio on the Pacific and Cahuita on the Caribbean, and they have earned it – if you want to load the dice, start there. But sloths are not really about the location. They are common, and they are almost invisible because they barely move and their fur grows algae that matches the bark. What changes your odds is how you look: go in the morning, read the high forks of the trees for a lump that does not belong, and walk near a guide at least once so your eye learns the shape. We saw ours on an ordinary rainforest trail near La Fortuna, not in either famous park."],
  ["Do you need a visa for Costa Rica?", "Most European, UK and North American passports do not – entry is visa-free for up to 90 days as a tourist. The requirement that actually catches people is proof of onward travel: if you arrive on a one-way ticket, the airline is likely to ask for evidence that you are leaving, and that check happens at the departure gate rather than at Costa Rican immigration. Confirm your own nationality's terms against an official source close to your travel date."],
  ["Costa Rica or Nicaragua – which is better?", "Different products. Costa Rica is polished, easy, safe-feeling and expensive; Nicaragua is rougher, cheaper by a wide margin, and more alive. Done back to back on the same trip, crossing overland from one to the other, Nicaragua was the more memorable of the two and Costa Rica the more comfortable. The complication is that this is no longer purely a travel question: Nicaragua's political situation has hardened considerably since that trip and now carries elevated advisories, which is covered on its own page. If you want low-friction wildlife and infrastructure that works, the answer is Costa Rica."],
  ["Is Costa Rica good for a first trip to the tropics?", "It is close to the ideal one, and this is what the price actually buys. The wildlife shows up without you having to work for it, the roads are signed, tap water is drinkable, guides are professional and English is widely spoken, and nothing about the country asks you to be an experienced traveller. The trade is that it can feel processed – packaged, ticketed and smoothed down for a steady flow of visitors. If that is a downside for you, you are probably not on your first trip to the tropics."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// Two Costa Rica SKUs are planned (a 7-day loop, wave 3; a 14-day coast-to-
// coast, wave 4) and neither is built. The fetch takes all guides so each
// appears as its own card with no code change; until then the guide sections
// and the BuyBox do not render.
const GUIDE_BLURBS = {};

async function fetchCostaRicaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "costa-rica" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "costa-rica" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function CostaRicaDestinationPage() {
  const { guides, stories } = await fetchCostaRicaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "Costa Rica: is it worth the money, how long you need, and which coast",
        description:
          "Whether Costa Rica is worth what it charges, how many days you actually need, which coast to pick and when to go.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Costa Rica" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/costa-rica",
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
        <span className="text-slate-600">Costa Rica</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Americas · Central America
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Costa Rica
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Whether it is worth what it charges, how many days you need, which
          coast to pick, and the one thing about the weather that decides both.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={arenalConeOverTheLodgePool}
              alt="Arenal volcano's cone under a cap of cloud, above a lodge garden and pool near La Fortuna, Costa Rica"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Costa Rica worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                I came into Costa Rica overland from Nicaragua, at the end of
                three weeks that also took in Panama, which is a useful way to
                arrive because it removes any doubt about what this country is.
                It is the polished one. The roads are signed, the water is
                drinkable, the guides know what they are doing, and every
                experience has been packaged, ticketed and smoothed down for a
                steady flow of visitors. After Nicaragua that is a genuine
                relief for about a day and a half, and then you start noticing
                the bill.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Costa Rica costs roughly twice what its neighbours do, and my
                honest verdict is that most of the time it earns that and
                sometimes it very clearly does not. What earns it: the wildlife,
                which is the best argument the country has and turns up on
                ordinary trails rather than only in famous parks; the volcano
                country around Arenal, with hot water running over the rock in
                the jungle, which was the single best day of the Costa Rican
                leg; the coffee; and the better restaurants. What did not: more
                than one headline activity sold as extraordinary that turned out
                to be a pleasant, standard day out. I paid premium prices twice
                for something entirely ordinary and remember both.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The country's real problem is geography, and almost nobody warns
                you about it before you book. Costa Rica is small on a map and
                long in practice: between the two coasts sit volcanoes, cloud
                forest and roads that turn a short distance into most of a day.
                A week here is a choice between coasts, not a tour of both, and
                the people who try to see everything spend their holiday in the
                car. Decide which coast you are coming for before you decide
                anything else, because that one call reorganises the entire
                trip – including, as it turns out, which months you should be
                looking at.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Would I send someone here? Yes, and specifically as a first trip
                to the tropics, where everything the country is good at counts
                double and the price buys real peace of mind. If you have
                travelled a lot and the word "catered" makes you wince, you will
                get more out of Nicaragua next door for a third of the money –
                with a much more complicated set of caveats attached, which are
                on its own page. Ranked across the three countries on that trip,
                Costa Rica came second: better run than either of the others,
                and less alive than Nicaragua.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One structural fact does most of the work here: the Pacific and
                the Caribbean coasts run on opposite weather calendars. Pick the
                coast first and the month follows from it, and the months
                everyone tells you to avoid turn out to be the right ones for
                half the country.
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
                The honest version of this question is not how much you can see
                but how much driving you are willing to do. Every extra
                destination costs more road than the map admits, and that is
                what sets the floor.
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
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two regions are missing from those cards because we did not
                reach them, and both are the sort of place that changes a trip.
                The Osa Peninsula and Corcovado, in the far south-west, are what
                people mean when they say Costa Rica still has genuinely wild
                country; Tortuguero, on the northern Caribbean, is a roadless
                grid of canals reached by boat or small plane and is where the
                turtles nest. Neither fits a fortnight that also does the
                volcanoes and a coast, which is exactly why they stay quiet.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Almost everyone flies into San José, and from western Europe
                that means one stop – Madrid is the shortest connection, with
                Frankfurt, Amsterdam and Paris also feeding the route. Liberia,
                in the north-west, is the second international airport and is
                the better arrival if your whole trip is the northern Pacific
                coast. Overland, the country sits between Nicaragua to the north
                and Panama to the south, and both borders are ordinary bus
                crossings; that is how we arrived and left, and it is a genuinely
                cheap way to combine two or three countries. Most European, UK
                and North American passports enter visa-free for 90 days, with
                proof of onward travel the requirement that trips people up.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, plan around drive times rather than distances.
                Roads across the middle of the country are mountainous, slow and
                in places unpaved, and a journey that looks like two hours on a
                map can eat most of a day. A hire car is what makes the country
                work for a touring trip, and a higher-clearance vehicle is worth
                it in the green season and on the climb to Monteverde. If you
                are not touring, the public bus network is comprehensive, used by
                everyone and costs a fraction of anything else – the two modes
                suit genuinely different trips rather than different budgets.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The one thing worth planning around rather than reacting to is
                the crossing between coasts. It is the longest, slowest leg in
                most itineraries and the one people underestimate, and it is the
                reason a one-week trip has to pick a side.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the unavoidable line: return flights from
                western Europe run about €650 booked ahead. That is what reaching
                Costa Rica costs, not what the trip costs – and on a country with
                this reputation, the price of the trip is genuinely a decision
                rather than a given. The country is expensive by Central American
                standards and comparable to western Europe or the United States
                at the top end, but the range between the cheapest honest version
                and the comfortable one is enormous:
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
                Two levers move the total more than anything else. The first is
                the season: green-season room rates are dramatically below
                peak, and the weather they buy is far more workable than the
                phrase "rainy season" implies. The second is how many paid
                attractions you say yes to – that is the line with real range
                here, and it is also where the country's value problem lives.
                Being selective about tickets is worth more than being frugal
                about beds.
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
                src={tabaconPoolAndCascade}
                alt="Sitting in a hot pool above a cascade at the Tabacón hot springs, below Arenal volcano, Costa Rica"
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
                <SectionHeading>Stories from Costa Rica</SectionHeading>
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
              <SectionHeading>The rest of the trip</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Costa Rica was the middle country of three, crossed overland in
                the same three weeks. Its neighbours make very different cases
                for themselves, and the comparison is most of the reason to read
                all three:{" "}
                <Link
                  href="/destinations/nicaragua"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Nicaragua
                </Link>{" "}
                to the north, cheaper and rawer and now considerably more
                complicated, and{" "}
                <Link
                  href="/destinations/panama"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Panama
                </Link>{" "}
                to the south, which is worth a narrow trip rather than a broad
                one.
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

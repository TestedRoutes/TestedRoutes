import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import redRoadTowardTheFouta from "../../../../content/countries/guinea/destination/generated/web/red-road-toward-the-fouta.jpg";
import foutaDjallonGreenValley from "../../../../content/countries/guinea/destination/generated/web/fouta-djallon-green-valley.jpg";
import roundHutsVillageMorning from "../../../../content/countries/guinea/destination/generated/web/round-huts-village-morning.jpg";
import conakryCoastFromTheRoad from "../../../../content/countries/guinea/destination/generated/web/conakry-coast-from-the-road.jpg";
import threeCarsOnTheRedRoad from "../../../../content/countries/guinea/destination/generated/web/three-cars-on-the-red-road.jpg";
import drivingTheDirtRoadIn from "../../../../content/countries/guinea/destination/generated/web/driving-the-dirt-road-in.jpg";
import villageAndBigTreeAtDawn from "../../../../content/countries/guinea/destination/generated/web/village-and-big-tree-at-dawn.jpg";
import cattleOnTheFloodedFlats from "../../../../content/countries/guinea/destination/generated/web/cattle-on-the-flooded-flats.jpg";
import carsBelowTheEscarpment from "../../../../content/countries/guinea/destination/generated/web/cars-below-the-escarpment.jpg";
import thatchedHutsOnTheRidge from "../../../../content/countries/guinea/destination/generated/web/thatched-huts-on-the-ridge.jpg";
import redRoadAndBlueHills from "../../../../content/countries/guinea/destination/generated/web/red-road-and-blue-hills.jpg";
import mudBrickVillageHouses from "../../../../content/countries/guinea/destination/generated/web/mud-brick-village-houses.jpg";
import theCarUpOnTheJack from "../../../../content/countries/guinea/destination/generated/web/the-car-up-on-the-jack.jpg";
import underTheCarFuelTank from "../../../../content/countries/guinea/destination/generated/web/under-the-car-fuel-tank.jpg";
import villageChildrenCrowdingIn from "../../../../content/countries/guinea/destination/generated/web/village-children-crowding-in.jpg";
import theVillageSquareFillsUp from "../../../../content/countries/guinea/destination/generated/web/the-village-square-fills-up.jpg";
import salvagedPartsAndThePlate from "../../../../content/countries/guinea/destination/generated/web/salvaged-parts-and-the-plate.jpg";
import asleepOnCarSeats from "../../../../content/countries/guinea/destination/generated/web/asleep-on-car-seats.jpg";
import foutaDjallonFromTheRoad from "../../../../content/countries/guinea/destination/generated/web/fouta-djallon-from-the-road.jpg";
import theFinishLineConakry from "../../../../content/countries/guinea/destination/generated/web/the-finish-line-conakry.jpg";
import conakryShoreAndMarket from "../../../../content/countries/guinea/destination/generated/web/conakry-shore-and-market.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Guinea is worth it, how safe it really is, how long, when. Everything
 * operational (border paperwork mechanics, vehicle hire and drivers, named
 * beds, fuel strategy, within-day sequencing) is deliberately absent.
 * NOTE: no Guinea guide SKU exists or is planned, so no sentence may say "the
 * guide carries X" - mechanics are asserted to exist, unreferenced. If a SKU is
 * ever built, do a pointer pass over the FAQ and the how-long section.
 * HONESTY NOTE, and it shapes the whole page: the founder crossed Guinea in
 * four days at the end of the 2023 rally and made NO real stops - turned around
 * before Mali town, back to Koundara, then Labe to Conakry (founder confirmed
 * 2026-09-03). So this hub does not pretend to have seen the country. It says
 * what the roads are, what the Fouta Djallon is, and that a week is the honest
 * minimum - which is a stronger and more citable answer than a thin sights
 * list. Do not add a sight we did not stand at. The maps.me bookmarks pinning
 * Kinkon, Kambadaga and Dalaba are saved research, not visits - the founder was
 * asleep on the Labe road while the driver passed waterfalls and decided not to
 * wake anyone.
 * ONE EXCEPTION, founder-confirmed 2026-09-03: Conakry itself WAS seen properly,
 * at the start of the 2024 rally rather than in 2023 - Madina market, the Musee
 * national de Guinee and the Grande Mosquee Faycal. Those three may be named
 * here. Nothing beyond naming them, until he describes what they were like.
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Guinea: is it safe, is it worth visiting, and what the roads are really like · TestedRoutes",
  description:
    "Whether Guinea is safe and worth visiting, how long you need, when to go and what getting there costs – the Fouta Djallon highlands, Conakry, and the roads that decide the whole trip.",
  alternates: { canonical: "/destinations/guinea" },
  openGraph: {
    type: "article",
    url: "/destinations/guinea",
    title: "Guinea: is it safe, is it worth visiting, and what the roads are really like",
    description:
      "The water tower of West Africa, a capital in the rain, and one of the hardest-driving countries on the continent – with honest answers on safety, season and time.",
  },
};

const WHEN_TO_GO = [
  ["December to March", "The season, and it is not a close call. Conakry records essentially no rain in January, February or March, the air is at its clearest, and every road on the map is at its best. If you have one window, this is it."],
  ["April to mid-May", "Still dry, and getting hot and heavy as the monsoon builds. The country is browner than the photographs and the haze sits low, but the roads still behave and you will have the place largely to yourself."],
  ["Mid-May to mid-November", "The rains, and they are not a formality – July and August can each drop more than a metre of rain on the capital. Everything green becomes spectacular and everything unpaved becomes a negotiation. We crossed at the very end of May, right on the turn, and even then the ground was already holding water."],
  ["What I would pick", "January or February, for dry roads and clean light, accepting the harmattan haze that can flatten a long view. If you want the highlands green and the waterfalls actually running, take late October or early November instead – the rains have eased, the country is at its best, and you accept that a dirt road can still stop you."],
];

const HOW_LONG = [
  ["A stopover", "Conakry and straight back out. A day covers the capital's three set pieces – Madina market, the national museum and the Grande Mosquée Fayçal – along with the Atlantic and the traffic, but none of the reason you came to Guinea. Fine if a flight routing forces it. Not a trip."],
  ["A week", "Enough to reach the Fouta Djallon and stay there – the plateaus, the waterfalls, the villages – and still get back to the coast without spending the week in a vehicle. This is the shape almost everyone should take, and it is the one we could not manage."],
  ["Two weeks", "The Fouta Djallon properly, plus a second region: the forested southeast toward Nzérékoré, or the long run east to Kankan and the upper Niger. Distances here are measured in hours rather than kilometres, and two weeks is where the country stops fighting you."],
  ["What we actually had", "Four days, driving, at the end of a rally from Gibraltar. We crossed a rope border, lost a car, and reached Conakry at three in the morning. It was enough to learn the roads and nowhere near enough to see the country – which is exactly why the honest answer above is a week."],
];

const REGIONS = [
  {
    name: "The Fouta Djallon",
    image: foutaDjallonGreenValley,
    alt: "Green wooded valley falling away from a flat-topped escarpment in the Fouta Djallon, Guinea",
    body: "The highland heart of the country, and the reason to come: sandstone plateaus between roughly 500 and 1,500 metres, cut by gorges and waterfalls, noticeably cooler and greener than the coast. The World Bank calls it the water tower of West Africa, because the Niger, the Senegal and the Gambia rivers all rise here. It is the part of Guinea that rewards a week and punishes a weekend.",
  },
  {
    name: "The northern borderlands",
    image: roundHutsVillageMorning,
    alt: "A large mango tree over a village of round thatched houses at sunrise near Koundara, Guinea",
    body: "The country you enter through if you come overland from Guinea-Bissau or Senegal: Koundara, the long red laterite roads, and villages of round thatched houses under enormous shade trees. Brick and cement thin out, mud and straw take over, and the traffic becomes donkeys. Almost nobody visits this corner deliberately, which is most of its charm.",
  },
  {
    name: "Conakry and the coast",
    image: conakryCoastFromTheRoad,
    alt: "Tarpaulin stalls and low houses along the shore of Conakry with the Atlantic behind, Guinea",
    body: "The capital sits on a long thin peninsula pushed out into the Atlantic, which makes it one of the more geographically odd cities in West Africa and does nothing for its traffic. It is loud, wet in season, and not the reason you come – but it holds a half-day easily: the sprawl of Madina market, the Musée national de Guinée, and the Grande Mosquée Fayçal. Every flight lands here and every road ends here, and the water is never far from the road.",
  },
];

/* Trip photos in route order: over the border, the long red roads toward the
   Fouta, the day the car died, the village that emptied itself onto the road,
   then the highlands and the run down to the coast. */
const CAROUSEL = [
  { image: drivingTheDirtRoadIn, alt: "View from inside a rally car driving a red dirt road in Guinea, another car ahead", caption: "Over the border, on a road nobody has resurfaced" },
  { image: villageAndBigTreeAtDawn, alt: "Round thatched houses and a large tree silhouetted at dawn, northern Guinea", caption: "First light, on the Koundara road" },
  { image: cattleOnTheFloodedFlats, alt: "A white cow grazing beside standing water on green flats, northern Guinea", caption: "The rains had already started" },
  { image: carsBelowTheEscarpment, alt: "Three rally cars parked on a red dirt road with a long escarpment behind, Guinea", caption: "On the road toward Mali town" },
  { image: thatchedHutsOnTheRidge, alt: "Thatched houses on a cleared ridge with hills beyond, Fouta Djallon foothills, Guinea", caption: "A ridge village, foothills of the Fouta" },
  { image: redRoadAndBlueHills, alt: "A red laterite road running toward blue hills under a wide sky, Guinea", caption: "The highlands, still ahead" },
  { image: mudBrickVillageHouses, alt: "Mud-brick houses with thatched roofs and a mango tree in a village, Guinea", caption: "Mud brick, thatch and shade" },
  { image: theCarUpOnTheJack, alt: "A rally car jacked up under trees with the crew standing around it, Guinea", caption: "The day the fuel tank went" },
  { image: underTheCarFuelTank, alt: "The underside of a jacked-up car showing the fuel tank and a bottle catching fuel", caption: "Three holes, and a bottle underneath" },
  { image: villageChildrenCrowdingIn, alt: "Village children smiling and crowding towards the camera, Guinea", caption: "The village that had looked empty" },
  { image: theVillageSquareFillsUp, alt: "A crowd of children and adults filling a red-earth village square around parked cars, Guinea", caption: "The square, filling up" },
  { image: salvagedPartsAndThePlate, alt: "Salvaged car parts, tools and a Lithuanian number plate laid out on a kerb, Guinea", caption: "Stripped for parts, plate and all" },
  { image: asleepOnCarSeats, alt: "Two of the crew asleep on car seats laid on the ground in a mechanics' yard, Guinea", caption: "Asleep on the seats, in the mechanics' yard" },
  { image: foutaDjallonFromTheRoad, alt: "Wide green valleys and plateau edges of the Fouta Djallon seen from the roadside, Guinea", caption: "The Fouta Djallon, from the Labé road" },
  { image: theFinishLineConakry, alt: "The rally crew and two Subarus with a Lithuanian flag under palms in Conakry, Guinea", caption: "The finish line, Conakry" },
  { image: conakryShoreAndMarket, alt: "Stalls, low houses and the Atlantic along the shore in Conakry, Guinea", caption: "Where the road runs out" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Small local hotels and auberges, shared taxis and the bush taxis between towns, eating where the drivers eat. Guinea has almost no backpacker infrastructure, so lean here means local rather than cheap-for-tourists"],
  ["Core", "A decent hotel in Conakry and the regional towns, and – the line that actually decides this trip – a hired 4x4 with a driver who knows the roads, which turns an ordeal into a journey"],
  ["Splurge", "The ceiling is low and mostly sits in the capital: a handful of international-standard hotels on the Atlantic. Outside Conakry there is very little to spend money on, and that is part of the appeal"],
];

const TIPS = [
  ["The road decides the trip, not the distance.", "Guinea is the country where a map lies to you most. Two roads run from Koundara down to Conakry – one 570 km, one 660 km – and both of them took us twenty-one hours. Plan in hours and halve your ambitions: a leg that looks like a morning is the whole day and part of the night."],
  ["Carry two warning triangles, not one.", "Police stopped us many times and not one officer asked for the vehicle import paper we had failed to obtain. What they asked for, again and again, was two warning triangles, a fire extinguisher and a first-aid kit. That is the check that actually happens."],
  ["Arrive in Conakry in daylight if you possibly can.", "We reached the city at three in the morning after two nights of driving, and the advisories are blunt about why that is a bad idea: armed robbery and carjacking are real risks in the capital, and the airport is named specifically as a place where foreigners are targeted. If your flight lands late, have the transfer arranged before you fly."],
  ["The advisory is the current document, and Guinea's is not a mild one.", "Western governments place Guinea well above the caution level they give its neighbours – violent crime in Conakry, political tension that can escalate quickly, and essentially no emergency services outside a couple of private clinics. Read your government's travel advice before booking, and again before flying."],
];

const FAQ = [
  ["Is Guinea safe to visit?", "Read your government's travel advice first and let it outrank this page. Guinea sits meaningfully higher on the caution scale than its West African neighbours: the UK advises a high degree of caution, violent crime including armed robbery and carjacking is a genuine risk in Conakry, foreigners are specifically flagged as targets around the airport, political tension can escalate without much warning, and there is no functioning emergency service to call – medical help means getting yourself to a private clinic in the capital. That is the honest picture. What we experienced across four days of driving, including two nights on the road and repeated stops by armed men at checkpoints, was hassle and requests for tips rather than threat, and a great deal of ordinary kindness from people who had no reason to offer it. Both of those things are true at once."],
  ["Is Guinea worth visiting?", "Yes, if you want a country with almost no tourism infrastructure and you are willing to pay for that in hours on the road. The draw is the Fouta Djallon: a highland region of plateaus and waterfalls that the World Bank calls the water tower of West Africa, because the Niger, the Senegal and the Gambia rivers all rise there. It is green, cool by West African standards, and almost entirely unvisited. What Guinea is not is an easy country, a beach country, or a place you see much of in a few days. If you want West Africa with the edges sanded off, its neighbours do that better."],
  ["Which Guinea is this – how is it different from Guinea-Bissau and Equatorial Guinea?", "This is Guinea, sometimes written Guinea-Conakry after its capital: the largest of the three, and French-speaking. Guinea-Bissau is a much smaller Portuguese-speaking country on the coast to the northwest. Equatorial Guinea is Spanish-speaking, oil-rich and mostly on an island, over two thousand kilometres away in Central Africa. They share the name because Europeans called that whole stretch of West African coast Guinea for centuries before any of these countries existed, and three different colonial powers each ended up holding a piece of it. Our story below tells the full version, and corrects the explanation you will usually be given."],
  ["What are the roads like in Guinea?", "They are the trip. Some of the main routes are asphalt and merely bad; others degrade into potholes deep enough that everyone drives on the verge, or stop being drivable at all. We spent five hours covering a hundred kilometres on one road, then found it simply ended in holes we could not cross. Both of the routes from the northern border down to Conakry took twenty-one hours, whichever one we picked. There is no road-condition service to consult – there is what other travellers say, and what you find. If you are driving yourself, budget generously and do not plan to arrive anywhere after dark."],
  ["How many days do you need in Guinea?", "A week is the honest minimum for a real trip, and it should be built around the Fouta Djallon rather than the capital. Two weeks lets you add the southeast or the upper Niger without living in the car. We had four days and left knowing we had seen the roads rather than the country, which is the most useful thing we can tell you about it."],
  ["When is the best time to visit Guinea?", "December to March. Conakry records essentially no rain at all in January, February and March, and that is what makes the difference on unpaved roads. The rains run from roughly mid-May to mid-November and are genuinely heavy – July and August can each bring over a metre of rain to the capital. Late October into early November is the connoisseur's window: the rains have eased, the highlands are still green, and the waterfalls are still running."],
  ["Do you need a visa for Guinea?", "Most visitors do, and it is arranged online in advance through the government's own portal rather than on arrival. Apply through the official government site rather than an agency – there are a great many intermediaries charging a premium for the same document. A yellow fever vaccination certificate is a real requirement here rather than a formality: Guinea is an endemic country, and the vaccine has to be given at least ten days before you travel."],
  ["Is Ebola still a risk in Guinea?", "No, and the confusion is worth clearing up because it costs Guinea a lot of visitors. The West African epidemic that began here ended in 2016, and a small flare-up in 2021 was contained within months. The Ebola outbreak in the news at the moment is in the Democratic Republic of Congo, on the other side of the continent – roughly five thousand kilometres away, in an entirely different region. The health precautions that actually matter for a trip to Guinea are the ordinary tropical ones: yellow fever vaccination, malaria prophylaxis, and care with water."],
  ["Is Guinea expensive?", "Getting there is the one unavoidable cost: return flights from western Europe run about €600 booked ahead, mostly routing through Paris, Brussels or Casablanca. That is what reaching Guinea costs, not what the trip costs. On the ground it is inexpensive by any European measure, with one real exception – transport. This is a country where hiring a capable vehicle and a driver who knows the roads is not a luxury upgrade, and it is where a realistic budget actually goes."],
  ["What is the Fouta Djallon, and is it worth the journey?", "It is the highland region filling the middle of the country: sandstone plateaus between roughly 500 and 1,500 metres, cut by waterfalls, cooler and greener than anywhere near the coast, and the source of three of West Africa's great rivers. It is the single best reason to come to Guinea, and it is the thing we did not get to. We were driving toward the highest ground in it when a gearbox ended the attempt, and we crossed the region afterwards without stopping. Take the week we did not have."],
  ["Can you combine Guinea with its neighbours overland?", "It borders six countries, and we came in from Guinea-Bissau and, on a later trip, left south into Sierra Leone. Both crossings worked. What they are not is quick or predictable: these are small posts that see very few private vehicles, the roads immediately either side of a border are usually the worst roads of the day, and the process is unhurried in a way you have to accept rather than fight. Our border story below is the honest version of how that feels."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Guinea guide SKU exists or is planned. The fetch takes all guides so that
// any future SKU appears as its own card with no code change; until then the
// guide sections and the BuyBox simply do not render.
const GUIDE_BLURBS = {};

async function fetchGuineaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "guinea" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "guinea" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function GuineaDestinationPage() {
  const { guides, stories } = await fetchGuineaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Guinea: is it safe, is it worth visiting, and what the roads are really like",
        description:
          "Whether Guinea is safe and worth visiting, how long you need, when to go and what getting there costs – the Fouta Djallon highlands, Conakry, and the roads that decide the whole trip.",
        datePublished: "2026-09-03",
        dateModified: "2026-09-03",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Guinea" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/guinea",
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
        <span className="text-slate-600">Guinea</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North &amp; West Africa · The Fouta Djallon
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Guinea
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it safe, is it worth it, and how long you need – for the country
          that holds the water tower of West Africa behind some of the hardest
          roads on the continent.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={redRoadTowardTheFouta}
              alt="A red laterite road running downhill toward the blue hills of the Fouta Djallon, Guinea"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Guinea worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Guinea is the country almost nobody means when they say Guinea,
                and the one with the most to look at. Behind a short, wet
                Atlantic coast the land climbs into the Fouta Djallon – a
                highland of sandstone plateaus and waterfalls that the World
                Bank calls the water tower of West Africa, because the Niger,
                the Senegal and the Gambia rivers all begin there. It is green,
                cool by the standards of this latitude, and visited by almost
                nobody.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you actually do is drive, and then walk. The Fouta is a
                region of waterfall valleys, plateau edges and Peul villages
                where the reward is having it to yourself, and the price is the
                road that gets you there. There is no circuit, no tourist
                infrastructure to speak of, and no way to see the country
                quickly. Conakry, where every flight lands, is a working
                capital on a long thin peninsula – worth half a day rather than
                a trip.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats are two. Guinea sits higher on every
                government's caution scale than its neighbours, and the roads
                are genuinely punishing – we crossed the country in four days
                at the end of a rally from Gibraltar, lost a car to them, and
                arrived in Conakry at three in the morning having seen the
                roads rather than the country. That is exactly why the answer
                further down this page is a week, not a long weekend.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Guinea has one of the sharper wet and dry splits in West
                Africa, and it decides everything – because what the rain
                affects is the road.
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
                Measure this trip in hours rather than kilometres and the
                answer becomes obvious quickly.
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
                Two more regions exist that we have no business describing: the
                forested southeast around Nzérékoré, where Guinea meets Liberia
                and Côte d'Ivoire, and the drier savannah east toward Kankan on
                the upper Niger. Both are long journeys from anywhere, and both
                are why two weeks beats one.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Conakry. The practical routings from Europe go through
                Paris, Brussels or Casablanca, and the flight is a little under
                seven hours from the French capital plus the connection. Most
                visitors need a visa, arranged online in advance through the
                government's own portal, and a yellow fever certificate is a
                genuine entry requirement rather than a formality. Overland
                arrival is entirely possible – we came in from Guinea-Bissau
                and left south into Sierra Leone on a later trip – but these
                are small, slow posts and the roads either side of them are the
                worst of the day.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, the vehicle is the trip. Shared bush taxis
                connect the towns cheaply and slowly; a hired 4x4 with a driver
                who knows the surface is the difference between reaching the
                Fouta Djallon and spending your week finding out you cannot.
                Self-driving is possible and we did it, but the roads punish
                ordinary cars badly enough that we finished the country with
                two of the three we started with.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Guinea's currency is the franc and it is a cash country outside
                the better Conakry hotels. French is the working language of
                everything official, and away from the capital it is the only
                one that will get you far.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the part nobody
                can avoid: return flights from western Europe run about €600
                booked ahead. That is what reaching Guinea costs, not what the
                trip costs. On the ground the country is inexpensive by any
                European measure, and the rest is a choice about how you sleep
                and – far more importantly here – how you move:
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
                Unusually for this site, the bed is not the line with real
                range here – transport is. Beds are modest almost everywhere
                and priced accordingly; what varies by a factor of several is
                whether you are moving in a shared taxi or in something built
                for the surface. Spend there, and the rest of Guinea is cheap.
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
                src={threeCarsOnTheRedRoad}
                alt="Three rally cars parked along a red dirt road with the crew and a Lithuanian flag, Guinea"
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
                <SectionHeading>Stories from Guinea</SectionHeading>
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

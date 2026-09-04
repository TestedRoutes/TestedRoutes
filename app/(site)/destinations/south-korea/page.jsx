import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import hanRiverSunsetFromBanpo from "../../../../content/countries/south-korea/destination/generated/web/han-river-sunset-from-banpo.jpg";
import bukchonRooftopsFromTheHanok from "../../../../content/countries/south-korea/destination/generated/web/bukchon-rooftops-from-the-hanok.jpg";
import seoulAtNightFromNamsan from "../../../../content/countries/south-korea/destination/generated/web/seoul-at-night-from-namsan.jpg";
import peaceGondolaOverTheImjin from "../../../../content/countries/south-korea/destination/generated/web/peace-gondola-over-the-imjin.jpg";
import theMudPoolDaecheonBeach from "../../../../content/countries/south-korea/destination/generated/web/the-mud-pool-daecheon-beach.jpg";
import sunsetStepsUnderBanpoBridge from "../../../../content/countries/south-korea/destination/generated/web/sunset-steps-under-banpo-bridge.jpg";
import sungnyemunGateAndTowers from "../../../../content/countries/south-korea/destination/generated/web/sungnyemun-gate-and-towers.jpg";
import deoksugungStoneHall from "../../../../content/countries/south-korea/destination/generated/web/deoksugung-stone-hall.jpg";
import insadongTeahouse from "../../../../content/countries/south-korea/destination/generated/web/insadong-teahouse.jpg";
import jogyesaLanterns from "../../../../content/countries/south-korea/destination/generated/web/jogyesa-lanterns.jpg";
import secretGardenPond from "../../../../content/countries/south-korea/destination/generated/web/secret-garden-pond.jpg";
import namsangolHanokCourtyard from "../../../../content/countries/south-korea/destination/generated/web/namsangol-hanok-courtyard.jpg";
import theHanokRoom from "../../../../content/countries/south-korea/destination/generated/web/the-hanok-room.jpg";
import theLastTrainImjingak from "../../../../content/countries/south-korea/destination/generated/web/the-last-train-imjingak.jpg";
import intoNorthKoreaFromTheHill from "../../../../content/countries/south-korea/destination/generated/web/into-north-korea-from-the-hill.jpg";
import throneHallCourtyardGyeongbokgung from "../../../../content/countries/south-korea/destination/generated/web/throne-hall-courtyard-gyeongbokgung.jpg";
import myeongdongAtDusk from "../../../../content/countries/south-korea/destination/generated/web/myeongdong-at-dusk.jpg";
import theBbqTable from "../../../../content/countries/south-korea/destination/generated/web/the-bbq-table.jpg";
import nSeoulTowerAtNight from "../../../../content/countries/south-korea/destination/generated/web/n-seoul-tower-at-night.jpg";
import daecheonBeach from "../../../../content/countries/south-korea/destination/generated/web/daecheon-beach.jpg";
import yedanghoBridge from "../../../../content/countries/south-korea/destination/generated/web/yedangho-bridge.jpg";
import gangnamBearKStarRoad from "../../../../content/countries/south-korea/destination/generated/web/gangnam-bear-k-star-road.jpg";
import teaAndSweetsInsadong from "../../../../content/countries/south-korea/destination/generated/web/tea-and-sweets-insadong.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Seoul is worth a long weekend, how many days, when, and whether the DMZ and
 * the mud festival deserve a day each. Everything operational belongs to the
 * planned guide and is deliberately absent: hanbok rental prices and shops,
 * palace and Secret Garden ticket mechanics, tour operators and fares, transit
 * card mechanics and fares, restaurant and hanok names, and any within-day
 * sequencing. The planned SKU is "Seoul in 2 Days: A Weekend Itinerary" - a
 * TWO-DAY product, roughly fifteen hard-won facts, so the teaser budget here
 * is the strict one. The only execution-flavoured facts on the page are ones a
 * published inspire story already gives away (hanbok = free palace entry; the
 * meat-and-heater dinner; "do not come in July").
 * NOTE: the SKU is approved but NOT built, so no sentence may say "the guide
 * carries X" - mechanics are asserted to exist, unreferenced. When the SKU
 * publishes, do a pointer pass over the FAQ and the how-long section.
 * HONESTY NOTE, and it shapes the page: the founder had four days, 25-29 July
 * 2024, a long weekend from Hong Kong booked around the Boryeong Mud Festival.
 * He saw Seoul (the old city on foot, a hanok night in Bukchon, a hanbok
 * afternoon at Gyeongbokgung, Myeongdong, N Seoul Tower, the Han River at
 * sunset, a glimpse of Gangnam), one DMZ tour, and one day at the mud festival
 * with the Yedangho bridge on the way back. He did NOT see Busan, Jeju,
 * Gyeongju or the mountains, and this page says so rather than pretending.
 * Do not add a sight we did not stand at. Dongdaemun / the city wall WERE seen
 * and judged "not worth the detour" - that verdict is his and may stay.
 * The test before any edit: could a reader run a day of the weekend from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "South Korea: how many days Seoul needs, when to go, and whether the DMZ is worth a day · TestedRoutes",
  description:
    "Whether Seoul is worth a long weekend, how many days you need, when to go and what getting there costs – the palaces in a hanbok, the DMZ, the July mud festival, and the honest limits of a four-day trip.",
  alternates: { canonical: "/destinations/south-korea" },
  openGraph: {
    type: "article",
    url: "/destinations/south-korea",
    title: "South Korea: how many days Seoul needs, when to go, and whether the DMZ is worth a day",
    description:
      "A capital that fits a weekend, a border you can look across, and a mud festival two hours down the coast – with honest answers on season, days and cost.",
  },
};

const WHEN_TO_GO = [
  ["April to May", "Spring, and the season most people mean when they say Korea: cherry blossom in early April, mild days, dry skies. It is also the busiest window at the palaces, and prices know it."],
  ["Late June to August", "The monsoon first – roughly late June to the second half of July, when a single month can bring Seoul most of a year of London's rain – and then a wet heat that does not break at night. We came at the end of July and it was a sauna from the airport onward. Only one thing justifies it: the mud festival on the west coast, which runs for a couple of weeks from late July and cannot be moved."],
  ["Late September to early November", "The other peak, and the better one. Clear air, cool mornings, the palaces and the mountains behind them turning red and gold through October. If you can pick, pick this."],
  ["December to February", "Cold, dry and bright, often well below freezing. The palace courtyards are close to empty, flights are at their cheapest, and the city is built for it – heated floors, hot food, warm metro. A good second choice for a Seoul-only weekend."],
  ["What I would pick", "October, for the certainty: dry, clear and cool, and the one trade is company at the famous sights. If the mud festival is the point, then late July, eyes open, and plan the rest of the days around shade and air-conditioning – which is what we did, and it was still a good trip."],
];

const HOW_LONG = [
  ["A layover", "Honestly, no. Incheon is a proper distance from the centre, and a short connection buys you the airport, a train and one palace with your bag. If you have a full day, it becomes a real visit – but plan it as a day, not a layover."],
  ["A weekend", "The right size for Seoul's core, and the shape almost everyone should take first: the old city on foot with the palaces and the hanok villages, tea in Insadong, Myeongdong after dark, and the view from Namsan. The city is dense, the metro is superb, and two days used well feel like four. This is the trip the planned guide is built around."],
  ["Four days", "The weekend plus one day at the DMZ, which is the day trip the whole peninsula is arranged around, and one more: in July, the mud festival on the coast; in any other month, a second Seoul day that goes slower. This is what we had, from Hong Kong, and it was enough to feel we had seen the city rather than changed trains in it."],
  ["A week or more", "Seoul plus the country: Busan and the south coast, Gyeongju's tombs and temples, Jeju by air, the mountains of Seoraksan. All of it is a fast train away, and none of it is something we have tested, so this page makes no promises about it. What we can say is that a long weekend does not do justice to South Korea – the country is compact and the next adventure is always only a few hours off."],
];

const REGIONS = [
  {
    name: "The old city",
    image: bukchonRooftopsFromTheHanok,
    alt: "Tiled hanok rooftops in Bukchon at morning with N Seoul Tower and the city's office towers behind, South Korea",
    body: "Five Joseon palaces sit inside the modern centre, and between two of them the hanok villages – whole neighbourhoods of tiled-roof houses – climb the hillside with the skyline stacked behind them. The old city is walkable end to end, the palaces are free if you turn up in a hanbok, and the teahouses of Insadong are where the walking stops. This is the part of Seoul that makes the trip.",
  },
  {
    name: "The city after dark",
    image: seoulAtNightFromNamsan,
    alt: "Seoul at night from Namsan, city lights running to the horizon under a cloudy sky, South Korea",
    body: "Seoul's second act starts when the signs come on. Myeongdong is a thousand lit signs and a thousand snacks, the barbecue places run up five floors, and N Seoul Tower on its hill shows you a city that does not seem to end in any direction. On the river, the locals sit on the steps under the bridges to watch the sun go down over Gangnam.",
  },
  {
    name: "The DMZ",
    image: peaceGondolaOverTheImjin,
    alt: "A peace gondola cabin crossing the Imjin River above green rice fields near the DMZ, Paju, South Korea",
    body: "An hour north of the capital the peninsula stops. Imjingak, on the edge of the civilian control line, is a heavy place of ribbons and memorials and a bullet-riddled train; beyond it are the tunnel the North dug under the border, a hill with a clear view across the river into North Korea, and a gondola over the Imjin to an old American base. Visited on a guided tour, always, and back in the city by mid-afternoon.",
  },
  {
    name: "The west coast",
    image: theMudPoolDaecheonBeach,
    alt: "A crowded mud pool ringed by inflatables under a blue sky at the Boryeong Mud Festival, Daecheon Beach, South Korea",
    body: "Daecheon Beach at Boryeong is a wide, sandy stretch on the Yellow Sea a couple of hours south of Seoul, and for two weeks every July it becomes the mud festival: pools, slides, a mud prison and team games, with the sea right there to rinse off in. The rest of the year it is a Korean seaside town. Inland, Yedangho's long suspension bridge crosses a lake dotted with floating houses.",
  },
];

/* Trip photos: the old city on foot, the hanok night, the DMZ, the hanbok
   afternoon, Myeongdong and the tower, then the mud festival and the river. */
const CAROUSEL = [
  { image: sungnyemunGateAndTowers, alt: "Sungnyemun, the old south gate of Seoul, boxed in by glass office towers", caption: "Sungnyemun gate, the first thing you walk to" },
  { image: deoksugungStoneHall, alt: "The stone neoclassical Seokjojeon hall and fountain inside Deoksugung palace, Seoul", caption: "Deoksugung, the palace with a European wing" },
  { image: insadongTeahouse, alt: "The wooden interior of a traditional teahouse in Insadong, Seoul", caption: "An Insadong teahouse" },
  { image: teaAndSweetsInsadong, alt: "Tea and a plate of Korean sweets on a wooden teahouse table, Insadong, Seoul", caption: "No idea what I ordered. Ordered it again." },
  { image: jogyesaLanterns, alt: "The main hall of Jogyesa temple under rows of coloured lanterns, Seoul", caption: "Jogyesa, in the middle of the city" },
  { image: secretGardenPond, alt: "Buyongji pond and its pavilion in the Secret Garden of Changdeokgung palace, Seoul", caption: "The Secret Garden, with a guide only" },
  { image: namsangolHanokCourtyard, alt: "A hanok courtyard with tiled roofs at Namsangol Hanok Village, Seoul", caption: "Namsangol, calm and right in the centre" },
  { image: theHanokRoom, alt: "A traditional hanok room with paper sliding doors, a low round table and a wooden daybed, Bukchon, Seoul", caption: "The hanok night" },
  { image: theLastTrainImjingak, alt: "The rusted, bullet-riddled steam locomotive displayed at Imjingak, near the DMZ, South Korea", caption: "The last train, Imjingak" },
  { image: intoNorthKoreaFromTheHill, alt: "The Imjin River and the hills of North Korea seen from an observatory on the South Korean side", caption: "Across the river: North Korea" },
  { image: throneHallCourtyardGyeongbokgung, alt: "The Geunjeongjeon throne hall courtyard at Gyeongbokgung palace with visitors in hanbok, Seoul", caption: "Gyeongbokgung, in a hanbok" },
  { image: myeongdongAtDusk, alt: "Myeongdong shopping street at dusk with lit signs and crowds, Seoul", caption: "Myeongdong, signs coming on" },
  { image: theBbqTable, alt: "A Korean barbecue table with a round grill, tongs and side dishes, Myeongdong, Seoul", caption: "Meat and a heater, no instructions" },
  { image: nSeoulTowerAtNight, alt: "N Seoul Tower lit blue at night above pine trees on Namsan, Seoul", caption: "N Seoul Tower after dark" },
  { image: daecheonBeach, alt: "Daecheon Beach at Boryeong, sand, umbrellas and the Yellow Sea, South Korea", caption: "Daecheon Beach, where the mud comes off" },
  { image: yedanghoBridge, alt: "The Yedangho suspension bridge over a lake with floating houses, Yesan, South Korea", caption: "Yedangho, on the way back" },
  { image: gangnamBearKStarRoad, alt: "A GangnamDol bear statue in sunglasses on K-Star Road at night, Gangnam, Seoul", caption: "Gangnam, briefly" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "A guesthouse or hostel bed in the old city, street food and the little side-dish places for most meals, the metro for everything. Seoul is one of the cheaper big Asian capitals to eat in, and the palaces cost next to nothing"],
  ["Core", "A mid-range hotel around Jongno or Myeongdong, barbecue dinners, a hanbok for an afternoon, and a guided tour for the DMZ, which is the one day you cannot do alone"],
  ["Splurge", "A night in a traditional hanok house, the tasting-menu end of Korean food, a private guide for the border day. The ceiling here is real but not high; Seoul does not punish you for spending less"],
];

const TIPS = [
  ["Wear a hanbok and the palaces are free.", "Rent the traditional dress near Gyeongbokgung and every grand palace lets you in without a ticket – and, more to the point, you stop being a person photographing the place and become, a little, part of it. In July the costume holds heat like a duvet. Do it anyway."],
  ["The day of the week decides which palace you see.", "Gyeongbokgung closes on Tuesdays and the other palaces on Mondays, and the DMZ sites are shut on Mondays too. On a weekend-sized trip that one fact sets which day is the palace day and which is the border day before you look at anything else."],
  ["Do not come in July expecting anything but a sauna.", "Late June to August is monsoon, then heat that does not break at night. We did it because the mud festival only happens then, and it was still a good trip – but if the festival is not your reason, take October or April and get the same city in clear air."],
];

const FAQ = [
  ["Is South Korea worth visiting?", "Yes, and Seoul alone justifies the flight. It is a capital where five royal palaces and whole neighbourhoods of traditional houses sit inside a modern mega-city, where the metro makes a weekend feel like four days, and where the food is cheap, communal and better than the raw-meat posters on the restaurant doors suggest. Add a border you can look across and, in July, a beach festival built entirely around mud, and it is one of the better long weekends in Asia. What we cannot vouch for is the rest of the country – Busan, Gyeongju, Jeju – because four days did not reach it."],
  ["How many days do you need in Seoul?", "Two full days for the city itself, four if you add the DMZ and one more day trip. Two days used well cover the old city on foot – the palaces, the hanok villages, tea in Insadong – plus Myeongdong after dark and the view from Namsan. The third day is the DMZ, which the whole peninsula is arranged around. The fourth is the mud festival in July or a slower second city day in any other month. A week lets you leave Seoul, but that is a different trip and one we have not tested."],
  ["Is a weekend in Seoul enough?", "For the city, yes – it is the right size for a first visit. The good things sit close together, the metro is excellent, and a weekend built on the old city and the evening city leaves you feeling you saw Seoul rather than changed trains in it. It is not enough for the DMZ as well; that costs a third day, and it is the day worth adding."],
  ["When is the best time to visit Seoul?", "October, then April. Autumn gives clear, dry air and the palaces backed by red hillsides; spring gives cherry blossom and mild days but bigger crowds. Late June to August is monsoon followed by heavy, humid heat – we were there at the end of July and it was a sauna – and the only reason to accept it is the mud festival, which cannot be moved. Winter is cold, bright and empty, and a fair choice for a Seoul-only weekend."],
  ["Is Seoul safe?", "Yes – it is one of the safest big cities anywhere, with low violent crime and a metro you can ride at midnight without a thought. Check your government's travel advice before you book, as always, and you will find it says much the same. The North Korean border makes headlines and does not affect a visit; the DMZ is visited on controlled tours and the atmosphere there is tense on purpose."],
  ["Do you need a visa for South Korea?", "Most Western passports do not, for stays of up to 90 days. There is normally an online travel authorisation to apply for beforehand, the K-ETA, but Korea has suspended that requirement for visitors from 22 countries – including the UK, the US, Germany, France, Spain and most of western Europe – until the end of 2026, so at the time of writing you simply fly in. Check the current rule for your passport before booking, because the exemption has a date on it."],
  ["Is the DMZ worth visiting from Seoul?", "Yes, and it is the one thing here you cannot do on your own. You go on a guided tour, they are all much the same, and the day is a strange, heavy one: the Bridge of Freedom and a bullet-riddled train at Imjingak, a walk into a tunnel the North dug under the border, a hilltop with a clear look across the river at North Korea and its flag, and a gondola over the Imjin to a former American base. You are back in the centre by mid-afternoon, which is the oddest part. It is not a fun day out. It is one you do not forget."],
  ["Is Seoul expensive?", "Getting there is the one unavoidable cost: return flights from western Europe run about €600 booked ahead, and sale prices go well under that. That is what reaching Korea costs, not what the trip costs. On the ground Seoul is cheaper than Tokyo, Singapore or Hong Kong for a visitor – street food and barbecue are cheap, the metro is cheap, the palaces are almost free – and the bed is the only line with real range."],
  ["Is the Boryeong Mud Festival worth it?", "Yes, if a stupid, joyful day is your idea of a good one. It runs for about two weeks from late July at Daecheon Beach, a couple of hours south of Seoul on the west coast: mud pools, mud slides, a mud prison and team games, with the sea right there to rinse off in. Most of the crowd are teenagers and their parents, which changes nothing. It is not deep or cultural, it is a day trip from the capital, and it is the reason to accept July."],
  ["Can you wear a hanbok at the palaces, and is it really free?", "Yes on both counts. Anyone properly dressed in hanbok – the full traditional dress, not a jacket over jeans – enters Seoul's grand palaces free, a policy that has run for years, and rental shops cluster around Gyeongbokgung's gate. The better reason to do it is how it feels: walking the throne-hall courtyard in costume moves you from watching the place to being in it. Emperor Pau-Lee, our founder's palace name for the afternoon, explored every corner."],
  ["Does Google Maps work in South Korea?", "Not for directions – it will show you where things are but will not route you on foot or by car, for legal reasons that have nothing to do with you. Every local uses one of two Korean map apps instead, and they work in English well enough. Install one before you land; it is the single most useful thing on your phone in Seoul."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// The Seoul 2-day SKU is approved but not built. The fetch takes all guides so
// that the SKU appears as its own card with no code change the day it
// publishes; until then the guide sections and the BuyBox simply do not render.
// When it does publish, add its slug here with a blurb that sells what this
// page withheld (the day plan, the palace-day/border-day logic, the beds, the
// DMZ operator choice, the hanbok mechanics).
const GUIDE_BLURBS = {};

async function fetchSouthKoreaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "south-korea" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "south-korea" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function SouthKoreaDestinationPage() {
  const { guides, stories } = await fetchSouthKoreaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "South Korea: how many days Seoul needs, when to go, and whether the DMZ is worth a day",
        description:
          "Whether Seoul is worth a long weekend, how many days you need, when to go and what getting there costs – the palaces in a hanbok, the DMZ, the July mud festival, and the honest limits of a four-day trip.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "South Korea" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/south-korea",
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
        <span className="text-slate-600">South Korea</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Asia · Seoul and the DMZ
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          South Korea
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days Seoul needs, when to go, and whether a day at the DMZ is
          worth it – from a long weekend that was hot, fast and better than it
          had any right to be.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={hanRiverSunsetFromBanpo}
              alt="Sunset over the Han River from Banpo, the Sebitseom floating islands on the left and the city skyline in silhouette, Seoul, South Korea"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is South Korea worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Seoul is the rare capital that rewards a weekend more than a
                week. Five royal palaces and whole neighbourhoods of tiled-roof
                hanok houses sit inside a mega-city of glass and neon, close
                enough together to walk between, and a metro that is fast,
                clean and legible makes the rest of the city feel small. You
                arrive expecting scale and find density instead – the good
                things are all within reach of each other.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you do is walk the old city – the palaces, ideally in a
                rented hanbok, which gets you in free and changes how the place
                feels; the hanok villages on the hill; the teahouses of
                Insadong – and then let the evening city take over: Myeongdong
                under its thousand signs, a barbecue dinner where the staff
                show you what to do, the view from Namsan. Then you leave the
                city for a day. North, the DMZ is the day trip the whole
                peninsula is arranged around, and the closest anyone gets to
                looking into North Korea. In July, and only in July, the mud
                festival on the west coast is a second day out that is stupid
                in the best possible way.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two honest caveats. We had four days in late July, a long
                weekend from Hong Kong booked around that festival, and July in
                Seoul is a sauna: monsoon first, then a wet heat that does not
                break at night. And four days reached Seoul, the border and the
                coast, not the country – Busan, Gyeongju and Jeju are all a
                fast train or a short flight away and all untested by us, so
                this page does not pretend to know them. A long weekend does
                not do justice to South Korea. It does do justice to Seoul.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Korea has four real seasons and two of them are the answer. The
                other two are the monsoon and the deep freeze, and the trip
                changes shape in both.
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
                Seoul is a two-day city with a three-day answer, and the extra
                day is the border.
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
                The rest of the country – Busan and the south coast, Gyeongju's
                royal tombs, Jeju island, the granite of Seoraksan – is where a
                week goes, and where we have not yet been. When we have, it
                will be here.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Incheon, a little under twelve hours nonstop from
                western Europe and served from most of its big hubs. A train
                runs from the airport into the city in around an hour. Most
                Western passports enter visa-free for up to 90 days, and the
                online travel authorisation Korea normally asks for is
                suspended for visitors from 22 countries until the end of
                2026 – check the rule for your passport when you book, because
                that suspension has a date on it.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                In the city you walk and you ride the metro, which is one of
                the world's best and signed in English throughout; a rechargeable
                transit card covers metro, bus and the odd taxi. Nobody rents a
                car for Seoul. The day trips are different: the DMZ can only be
                visited on a guided tour, and the mud festival is easiest on
                one, though a train and a bus get you there too.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Cards work almost everywhere and cash is rarely needed. The one
                thing to sort before landing is your map app – Google Maps will
                not give you directions in Korea, and the two local apps that
                will are what every local uses. English gets you through the
                metro and the tourist centre; a menu in Myeongdong may still be
                a guess, which is part of the fun.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the part nobody
                can avoid: return flights from western Europe run about €600
                booked ahead, and sale prices go well under. That is what
                reaching Korea costs, not what the trip costs. On the ground,
                Seoul is cheaper than the other big Asian capitals for a
                visitor – food, transport and the palaces are all inexpensive –
                and the rest is a choice about how you sleep and how you do the
                border day:
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
                The bed is the only line with real range. Everything else in
                Seoul – the barbecue, the metro, the palaces, the tea – costs
                much the same whichever style you travel in, which is why a
                lean weekend here feels nothing like a compromise.
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
                src={sunsetStepsUnderBanpoBridge}
                alt="People sitting on the riverside steps under Banpo bridge at sunset, Han River, Seoul"
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
                <SectionHeading>Stories from South Korea</SectionHeading>
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

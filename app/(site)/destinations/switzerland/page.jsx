import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import Byline from "../../../_components/Byline";
import PhotoCarousel from "../../../_components/PhotoCarousel";
import {
  SectionHeading,
  RowTable,
  CostTable,
  TipsList,
  FaqList,
  GuideCards,
  StoryGrid,
  HubBreadcrumb,
  RegionCards,
  buildHubJsonLd,
} from "../../../_components/DestinationHubSections";
import { DESTINATION_SLUGS } from "../../../_lib/destinations";
import { SWISS_REGIONS, regionForGuide } from "../../../_lib/swissRegions";

// TODO(images): the founder has not culled Switzerland photographs yet, so
// this page ships with every image slot empty and renders without them
// (hero, closing photo, the eight region cards, the carousel). When the
// renditions land in content/countries/switzerland/destination/generated/web/
// (1660 px wide, JPEG q85, kebab-case after what the photo shows - playbook
// §11), add the static imports here and fill the slots below. Wanted:
//
//   import heroImage      from ".../web/<hero>.jpg";          // HERO
//   import closingImage   from ".../web/<closing>.jpg";       // full-width, before the FAQ
//   import zurichCard     from ".../web/<zurich>.jpg";        // REGION_IMAGES.zurich
//   import lucerneCard    from ".../web/<lucerne>.jpg";       // REGION_IMAGES.lucerne
//   import interlakenCard from ".../web/<interlaken>.jpg";    // REGION_IMAGES.interlaken
//   import zermattCard    from ".../web/<zermatt>.jpg";       // REGION_IMAGES.zermatt
//   import genevaCard     from ".../web/<geneva>.jpg";        // REGION_IMAGES.geneva
//   import luganoCard     from ".../web/<lugano>.jpg";        // REGION_IMAGES.lugano
//   import stMoritzCard   from ".../web/<st-moritz>.jpg";     // REGION_IMAGES["st-moritz"]
//   import appenzellCard  from ".../web/<appenzell>.jpg";     // REGION_IMAGES.appenzell
//   ~12 carousel frames                                       // CAROUSEL, with captions
//
// A region with no founder photograph keeps a text-only card (never a stock
// frame); the /destinations index card reuses the hero (playbook §11), so
// the index import lands in the same commit as the hero.
const HERO = null; // { image: heroImage, alt: "…" }
const CLOSING = null; // { image: closingImage, alt: "…" }
const REGION_IMAGES = {}; // { zurich: { image: zurichCard, alt: "…" }, … }
const CAROUSEL = []; // [{ image, alt, caption }, …]

/*
 * Scope note (destination playbook §7, §1a): this is the COUNTRY page of a
 * multi-page destination. It owns the questions only a country page can
 * answer - WHICH region, how many days in the country, whether a rail pass
 * pays, where to base, car or no car, when to go - and stays thin on
 * everything a regional page (/destinations/<region>, planned) will own:
 * whether Zermatt is worth it, how long Interlaken needs, which lift on which
 * day. Guide-only and absent: fares per leg, booking channels and lead
 * times, clock times, hut and hotel names, within-day sequencing, the
 * companion-map pins.
 *
 * LIVE SKUs (eight, all short): the Triftbrücke day trip from Zürich and
 * seven two-day Alpine Passes Trail stages (Simplon Pass → Evolène in four
 * guides, St. Moritz → Turra in three). A two-day SKU is ~15 hard-won facts,
 * so the teaser budget is the strict one: the tested tips carry only what a
 * published Swiss story already gives away (beds on the trail go months
 * ahead and a village can be full; the multi-stage push hurts more than it
 * needs to; the Trift walk's distance and climb). NO week-long Swiss SKU
 * exists - the 7-day and 10-day rows below sell hardest and may point at
 * nothing, so no sentence on this page says "the guide carries X" except
 * about the eight live guides.
 *
 * Voice: TestedRoutes' founder lived in Zürich for ten years, and the page
 * is written from that - in the guide voice (voice card v2: no "I" or "we",
 * en-dash, CHF, numbers with units). Region cards describe character, never
 * contents or order.
 *
 * FACTS: the one figure (the visitors' Swiss Half Fare Card, one month) was
 * verified on the Swiss Travel System / SBB pages on 2026-09-11 - see
 * HALF_FARE_CARD_CHF and content/countries/switzerland/destination/research/facts.md. Everything
 * else is generic public knowledge at decision level; nothing here names a
 * venue, a fare per leg or a time.
 *
 * The test before any edit: could a reader run a day of a Swiss trip from
 * this page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Switzerland: how many days you need, and whether a rail pass pays · TestedRoutes",
  description:
    "How many days Switzerland needs, whether the Swiss Travel Pass or the Half Fare Card pays, Zürich or Geneva as a base, car or no car, when to go, and which region suits a first visit – from ten years of living in Zürich.",
  alternates: { canonical: "/destinations/switzerland" },
  openGraph: {
    type: "article",
    url: "/destinations/switzerland",
    title: "Switzerland: how many days you need, and whether a rail pass pays",
    description:
      "Which region, how many days, which rail pass, where to base and whether to rent a car – the country decisions, answered from ten years of living in Zürich.",
  },
};

const WHEN_TO_GO = [
  ["June to September", "The hiking season, and the season most people mean when they say Switzerland. High passes are usually clear of snow from late June or July, the mountain lifts run their full timetable, and the huts are open. It is also when the famous places are busiest and beds are scarcest – the trade for green meadows and open trails is company on them."],
  ["December to March", "Ski season in the mountains and a real winter in the cities: Christmas markets, fog on the plateau, blue sky above the fog line. Almost everything above the valleys is for skiers and winter walkers; the high hiking routes are closed."],
  ["April, May, October, November", "The shoulder, and two different shoulders. Spring has full rivers, blossom on the lakes and snow still on the passes – lakes and cities yes, high hiking no. Late autumn is quiet, clear and short of daylight, with many mountain lifts shut for maintenance between the seasons. Both are cheaper and emptier, and both need the mountain plans checked before anything is booked."],
  ["What to pick", "For the walking the guides are built around, July to mid-September, accepting crowds at the headline sights and beds that go early. For the cities, the lakes and a lower bill, late May or late September, accepting that the highest passes may be closed at one end and the lifts shut at the other."],
];

const HOW_LONG = [
  ["Three days", "One base and one mountain. Zürich or Lucerne with a day on a nearby summit, or the Triftbrücke day trip and two city days. Enough to see why people come, not enough to see the Alps change character – the Valais and the Engadin are a different country from the lakes, and three days do not reach them."],
  ["Five days", "One base plus one move: the lake cities and one Alpine region – the Jungfrau, Zermatt or the Engadin – properly, with a weekend hike in the middle. This is the shape the two-day trail guides fit inside. What it misses is the French and Italian sides of the country entirely."],
  ["Seven days", "The first length that lets the country show its range: a city, a lake, one big mountain region and one language change – German-speaking lakes to the French-speaking Valais, or the Engadin to Ticino. Seven days is where a rail pass starts to pay and where the trains become the trip rather than the transfer. It still means choosing: two of the Alpine regions, not all of them."],
  ["Ten days", "The best-value length. Three regions at a pace that allows a rest day and a weather day, which in the Alps is not a luxury – the pass that is in cloud on Tuesday is clear on Thursday. Ten days cover the classic loop of lakes, Bernese Oberland, Valais and one of Ticino or the Engadin, with a two-day trail stage or two inside it."],
  ["Two weeks", "The whole country, or one long walk. Either the grand tour with every region and no rushing, or a multi-stage traverse of the Alpine Passes Trail, which is how the founder's own weeks in the mountains were spent. The honest note from those weeks: walked back to back, the stages hurt more than they need to, and the published stories say so. Two weeks split into weekends with rest between is the better version."],
];

const WHERE_TO_BASE = [
  ["Zürich", "The default, and the right one for a first visit: the biggest airport, the centre of the rail network, a lake and an old town of its own, and day trips in every direction – the Triftbrücke, Lucerne, Appenzell and the Rhine Falls are all a morning train away. Its weakness is that it is a city, not the Alps: every mountain is a return journey."],
  ["Geneva", "Right for a French-speaking trip and for the west: Lausanne, the Lavaux vineyards and Montreux along the lake, and the Valais up the Rhône. It is the wrong base for the German-speaking heartland – Lucerne and the Bernese Oberland are a long way east – and the city itself is more international than Swiss."],
  ["Lucerne", "The postcard base: a lake, a covered wooden bridge, and two mountains – Rigi and Pilatus – with lifts straight out of town. Smaller and prettier than Zürich, an hour from its airport, and central enough that the Bernese Oberland and Zürich are each about an hour away. The best base for a trip of five days or less that wants mountains without moving hotels."],
  ["Interlaken", "The base for the Jungfrau region and nothing else. Between two lakes, at the foot of the Eiger, Mönch and Jungfrau, with the mountain railways starting from the town – if the trip is about the high Bernese Oberland, base here and forget the cities. It is a functional town rather than a beautiful one; the villages above it are the reason to come."],
];

const RAIL_PASSES = [
  ["Swiss Travel Pass", "Consecutive days of unlimited travel on the national trains, buses, lake boats and city transport, with most museums included and a discount on most mountain lifts. Right for a trip that moves every day or two across the country – the seven- and ten-day shapes above – and for anyone who wants to stop thinking about tickets. Wrong for a trip that sits in one base and takes two or three long journeys."],
  ["Half Fare Card", "One card, one month for visitors, half price on nearly every train, bus, boat and mountain lift in the country. Right for a base-and-day-trips trip, for anything over a week, and for the mountain lifts, which are the expensive part of a Swiss day and which the Travel Pass only discounts. Residents buy the year-long version; the founder carried one for ten years, for what that is worth."],
  ["Saver Day Pass", "A day of unlimited travel at a fixed price that rises as the date approaches. Right for the one or two heavy travel days of a trip that is otherwise local – the long transfer between regions, the day that crosses the whole country – when the dates are fixed early. Wrong for anything spontaneous, because the cheap ones are gone weeks ahead."],
  ["No pass at all", "Right for a three-day trip that takes one or two journeys, and for anyone arriving by car. Beyond that, full fares in Switzerland are among the highest in Europe, and one of the three above almost always pays."],
];

// Region cards, in the registry's order. Character, not contents (§7): at
// most three named places per card, nothing about order or logistics. The
// card links to the region's own hub only when that page exists (hub: true
// in swissRegions.js AND its slug in DESTINATION_SLUGS); until then it is a
// plain card, and the guide cards below carry the same grouping.
const REGION_BLURBS = {
  zurich:
    "The base most trips start from and the one the founder lived in for ten years. A lake with swimming spots along its whole shore, an old town on both banks of the river, and the centre of the rail network, which is the point: Lucerne, Appenzell, the Rhine Falls and the Bernese Oberland are each a morning train away. Not the Alps – the view of them from the lakefront is the closest it gets.",
  lucerne:
    "The lake country at the heart of Switzerland. A covered wooden bridge, a lakefront that faces the Alps, and two mountains – Rigi and Pilatus – with rack railways and lifts that start from the town or the boat. The most reliable way to stand on a Swiss summit within an hour of leaving a city, and the region the paddle steamers were built for.",
  interlaken:
    "The high Bernese Oberland: the Eiger, Mönch and Jungfrau above a valley of waterfalls, car-free villages on ledges, and a railway that ends in the ice. The most dramatic mountain scenery reachable without a rope, and the busiest. Further east, the Triftbrücke hangs above a glacier lake at the end of a proper hike – the one day-trip guide from Zürich covers it.",
  zermatt:
    "The Matterhorn's valley and the canton around it. Zermatt is car-free and the mountain is visible from the village street; the Valais beyond it is the driest, sunniest corner of Switzerland, with the highest peaks and the emptiest passes. The Alpine Passes Trail crosses it from Simplon Pass to Evolène over six passes and one language change, in four of the live two-day guides.",
  geneva:
    "The French-speaking west. Lake Geneva runs from an international city at one end to the Château de Chillon at the other, with the Lavaux vineyard terraces stepping down to the water between them. Wine, lakeside towns, the Rhône valley up to the Valais – a different Switzerland in accent, food and pace, and the natural entry for anyone flying in from the west.",
  lugano:
    "The Italian-speaking south. Palms on the lakefront, a piazza culture, risotto and grotti under the trees, and mountains that rise straight from the lake with funiculars to their tops. Reached through the world's longest rail tunnel from the north, and worth the change of language: the light, the food and the temperature all shift within one train ride.",
  "st-moritz":
    "The Engadin: a high valley of lakes at about 1,800 m, larch forests that turn gold in October, and the Bernina peaks at its head. St. Moritz is the famous name; the villages along the valley are the reason to stay. The Alpine Passes Trail starts here and walks west over its first five stages towards Splügen, in three of the live two-day guides.",
  appenzell:
    "The rolling east, and the most Swiss-looking Switzerland: painted village houses, farms on green hills, and the Alpstein massif behind them with Säntis on top and cliff-face paths below. Close enough to Zürich for a day, different enough to feel like a region of its own – and the place to see the country's traditions still being practised rather than performed.",
};

// §8: no tier totals. The ONE figure is the visitors' Swiss Half Fare Card -
// the part of a Swiss trip that unlocks everything else - and it is labelled
// as what unlocking the trains costs, not what the trip costs. It is echoed
// once in the FAQ (§6). Verified 2026-09-11: CHF 150, valid one month, sold
// only to non-residents (Swiss Travel System / sbb.ch; the residents' annual
// Half Fare travelcard is CHF 190 in year one and stays out of the copy so
// the page carries one amount). Source register:
// content/countries/switzerland/destination/research/facts.md.
const HALF_FARE_CARD_CHF = 150;

const COSTS = [
  ["Lean", "Hostels and mountain huts, supermarket picnics on the trail, a Half Fare Card to cut the trains and lifts, and the mountains themselves – which, once you are on the path, are free. Switzerland rewards the lean traveller more than its reputation suggests, because the best of it is walked"],
  ["Core", "Small hotels and a hut night or two, one restaurant meal a day, the rail pass that fits the trip, and the mountain lifts taken without counting. The bill is driven by the beds and the lifts, and both are what the guides choose for you"],
  ["Splurge", "The grand hotels of St. Moritz and Zermatt, the panoramic trains in first class, a private guide for the high routes. The ceiling is as high as anywhere in the world – and it buys comfort and views, never access, because nothing here is gated behind money"],
];

// Teaser budget (§7): two-day SKUs, so only facts the published Swiss
// stories already give away. Beds-and-plan-B: "Simplon Pass to Saas Fee: no
// room at the inn in Gspon" and "Six passes, four days". Pace: "Six passes,
// four days" and "Five stages, four days". Trift numbers: "Triftbrucke:
// Switzerland's scariest footbridge".
const TIPS = [
  ["Beds on the trail go months ahead, and a village can be full.", "The Alpine Passes Trail stages end in villages with a handful of beds and huts with a few dozen, and the published stories tell both halves: beds booked months out, and an evening in Gspon with every room taken and a gondola as the plan B. Decide the dates early, and carry a fallback that does not mean giving up the day – the two-day guides are built around exactly that."],
  ["Walk the trail as weekends, not as one push.", "The founder linked six stages in four days once, and five stages in four days another year, and both stories say the same thing: walked back to back, it hurts more than it needs to, and half the group stopped early. Each guide is one two-day stage with a train in and a train out. Take them one weekend at a time and the mountains are the same."],
  ["The Triftbrücke is a hike, not a photo stop.", "Skip the small cable car and the walk to the bridge and back is about 15 km with 1,200 m of ascent, around 5.5 h – a full Alpine day that needs no technical skill and fits between a morning and an evening train from Zürich. Plan it as the day, not as a detour on the way somewhere else."],
];

const FAQ = [
  ["Is Switzerland worth visiting?", "Yes – it is the most reliable mountain trip in Europe, and the reliability is the point. The trains run to the minute and go up the mountains, the paths are signed to the hour, the huts have hot food, and the scenery starts at the airport. The honest caveats: it is expensive by any European measure, the famous places are crowded from July to September, and it is not a country for anyone who wants to be surprised by chaos. For a first Alpine trip, or a trip where things simply have to work, there is nowhere better."],
  ["How many days do you need in Switzerland?", "Seven for a first visit that wants both a city and the Alps; ten to add a third region and a weather day. Three days work as one base and one mountain – Zürich or Lucerne with a summit day, or a Triftbrücke day trip – and five add one Alpine region properly. The Alps change character every hundred kilometres – the Bernese Oberland, the Valais, the Engadin and Ticino are four different places – so the days go into regions, not sights. The live guides are the short pieces of that: a day trip and seven two-day trail stages, each one weekend."],
  ["Is the Swiss Travel Pass worth it?", "For a trip that moves every day or two, yes; for a base-and-day-trips trip, usually no – the Half Fare Card wins. The Travel Pass buys unlimited trains, buses, boats and city transport plus most museums, and only a discount on most mountain lifts, which are the expensive part of a Swiss mountain day. The Half Fare Card halves nearly everything, lifts included, for a month. Count the moves: three or more long journeys in a week and the Pass pays; fewer, and the card does. Fixed dates with one or two heavy travel days can use a Saver Day Pass instead, bought early."],
  ["Zürich or Geneva?", "Zürich, unless the trip is French-speaking or western. Zürich has the bigger airport, the centre of the rail network and the German-speaking heartland – Lucerne, the Bernese Oberland, Appenzell – within an hour or two. Geneva suits Lake Geneva, the Lavaux vineyards and the Valais up the Rhône, and a trip that wants the French side. Both are cities rather than Alpine towns; for a trip of five days or less that wants mountains from the hotel window, base in Lucerne or Interlaken instead."],
  ["Do you need a car in Switzerland?", "No, and for most trips a car is a cost, not a convenience. The trains reach every town and most villages, the yellow post buses reach the rest, and the mountain resorts – Zermatt, Wengen, Mürren – are car-free anyway, so the car waits in a valley car park. Rent one only for a trip built around remote valleys or a family with a lot of luggage. The one thing a car gives back is the high passes as drives, which the trains cross by tunnel; for everything else the network is the better car, and the guides are written for it."],
  [
    "Is Switzerland expensive?",
    `Yes – expect prices well above the rest of Europe for beds, restaurants and lifts. The number worth knowing is the one that unlocks the trains: a Swiss Half Fare Card costs CHF ${HALF_FARE_CARD_CHF} per person for a month and halves nearly every fare and mountain lift from the first day. That is what unlocking the trains costs, not what the trip costs. The bed and the lifts are the lines with real range; the mountains themselves, once you are on the path, cost nothing, which is why a lean Swiss trip on foot is a better trip than a lean one in a city.`,
  ],
  ["When is the best time to visit Switzerland?", "July to mid-September for the mountains, when the high passes are clear and the lifts and huts are open; that is when the trail guides are walked. Late May and late September are quieter and cheaper, with the risk of snow on the highest routes at one end and lifts closed for maintenance at the other. December to March is a different trip – skiing, winter walking, Christmas markets and fog on the plateau with sun above it. April and November are the months to avoid for the Alps: too late for snow, too early for paths."],
  ["Which region of Switzerland is best for first-timers?", "The Bernese Oberland around Interlaken, or Lucerne and its lake, depending on the trip. The Jungfrau region has the most dramatic scenery reachable without effort – three famous peaks, waterfalls, car-free villages on ledges – and is the busiest for exactly that reason. Lucerne gives a lake city with two summits an hour from the hotel and is easier on a short trip. The Valais around Zermatt is the one for the Matterhorn and the emptiest walking; the Engadin and Ticino are for a second visit, or for a first one that wants fewer people and a different language."],
  ["Can you see the Matterhorn from Zermatt without hiking?", "Yes – it is visible from the village street on any clear day, and the rack railway and lifts out of Zermatt put you at viewpoints facing it with no walking at all. The mountain makes its own weather and is often in cloud by midday, so a morning is the better bet. Hiking is optional in Zermatt; for the passes of the Valais beyond it, the two-day trail guides are where the walking starts."],
  ["Is Switzerland good in winter if you don't ski?", "Yes, with the trip built for it. Winter walking trails are groomed and signed in every resort, sledge runs come down from the lift stations, the lakes and cities keep their Christmas markets and fondue through the season, and the sun above the plateau fog is the reason people ride a lift up on a grey morning. What winter takes away is the high hiking – every pass the trail guides cross is closed – and most of the mountain huts. Go for the villages, the winter paths and the trains, not for a summer trip in the cold."],
];

// Card blurbs per SKU, keyed by guide page slug. Each sells what this page
// withholds - mechanics asserted to exist, never demonstrated. No fares,
// clock times, hut names or sequencing. A guide without a blurb falls back
// to its own subtitle.
const APT_BLURB =
  "One weekend stage of the Alpine Passes Trail, both days timed, with the train in and the bus out, the beds and the hut booking that gate it, the pass-day weather rules, and the companion Google map with every pin.";
const GUIDE_BLURBS = {
  "trift-bridge-from-zurich":
    "The day timed from Zürich and back: which train, whether to take the small cable car, where the climb bites, the bridge and the glacier lake, and the companion map.",
  "simplon-pass-to-saas-fee": APT_BLURB,
  "saas-fee-to-gruben": APT_BLURB,
  "gruben-to-grimentz": APT_BLURB,
  "grimentz-to-evolene": APT_BLURB,
  "st-moritz-to-alp-flix": APT_BLURB,
  "alp-flix-to-ausserferrera": APT_BLURB,
  "ausserferrera-to-turra": APT_BLURB,
};

// Destination-scoped fetch (playbook §12); the Sanity destination doc is
// destination-switzerland and every Swiss guide and story references it.
async function fetchSwitzerlandContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "switzerland" && (language == "en" || !defined(language))]{
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "switzerland" && (language == "en" || !defined(language))] | order(publishedDate desc){
          title, "slug": slug.current, subtitle, heroImage
        }
      }`,
    );
  } catch {
    return { guides: [], stories: [] };
  }
}

function regionHref(region) {
  return region.hub && DESTINATION_SLUGS.includes(region.slug)
    ? `/destinations/${region.slug}`
    : undefined;
}

/**
 * Guides grouped under their region, in the registry's order and each
 * region's trail order. A live guide no region claims lands in a trailing
 * "Elsewhere in Switzerland" group so it is never silently dropped; the
 * checker (npm run check:swiss-hubs) flags that state as an error.
 */
function groupGuidesByRegion(guides) {
  const bySlug = new Map(guides.map((g) => [g.slug, g]));
  const groups = SWISS_REGIONS.map((region) => ({
    region,
    guides: region.guideSlugs.map((slug) => bySlug.get(slug)).filter(Boolean),
  })).filter((group) => group.guides.length);
  const orphans = guides.filter((g) => !regionForGuide(g.slug));
  if (orphans.length) {
    groups.push({
      region: { slug: "elsewhere", label: "Elsewhere in Switzerland", hub: false },
      guides: orphans,
    });
  }
  return groups;
}

export default async function SwitzerlandDestinationPage() {
  const { guides, stories } = await fetchSwitzerlandContent();
  const guideGroups = groupGuidesByRegion(guides ?? []);

  const regionCards = SWISS_REGIONS.map((region) => ({
    name: region.label,
    blurb: REGION_BLURBS[region.slug],
    image: REGION_IMAGES[region.slug]?.image ?? null,
    alt: REGION_IMAGES[region.slug]?.alt ?? "",
    href: regionHref(region),
  }));

  const jsonLd = buildHubJsonLd({
    headline: "Switzerland: how many days you need, and whether a rail pass pays",
    description: metadata.description,
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    url: "https://testedroutes.com/destinations/switzerland",
    about: { "@type": "Country", name: "Switzerland" },
    faq: FAQ,
  });

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HubBreadcrumb
        trail={[{ href: "/destinations", label: "Destinations" }, { label: "Switzerland" }]}
      />

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Europe · The Alps
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Switzerland
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How many days you need, whether a rail pass pays, where to base
          yourself and whether to rent a car – the country decisions, from
          ten years of living in Zürich.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          {HERO ? (
            <div className="relative mb-12 overflow-hidden rounded-[28px]">
              <Image
                src={HERO.image}
                alt={HERO.alt}
                priority
                className="h-[320px] w-full object-cover md:h-[460px]"
                sizes="(max-width: 768px) 100vw, 830px"
              />
            </div>
          ) : null}

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Switzerland worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Switzerland is the mountain trip that works. The trains leave
                on the minute and run up the mountains, the paths are signed
                with walking times that are honest, the huts serve hot food at
                2,500 m, and the scenery starts before the airport train has
                left the terminal. Nowhere else in Europe puts this much of the
                Alps within reach of someone with a weekend, a rail ticket and
                a pair of hiking shoes – and that reach is what the country is
                for.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What you do is choose a region and walk it. The Alps change
                character every hundred kilometres: the Bernese Oberland is the
                postcard, three famous peaks over a valley of waterfalls; the
                Valais is drier, higher and emptier, with the Matterhorn at one
                end and passes almost nobody crosses; the Engadin is a high
                valley of lakes and larch; Ticino is palms, piazzas and Italian.
                Between the mountains sit the lake cities – Zürich, Lucerne,
                Geneva, Lugano – which are where the trips start and where the
                trains meet. A Swiss trip is one or two of those regions done
                properly, with the train as the way between them, not a tour of
                all of them.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats. It is expensive – beds, restaurants and
                mountain lifts all cost more than almost anywhere else in
                Europe – and the famous places are crowded from July to
                September. Neither changes the verdict. The best of the country
                is the walking, which is free once you are on the path, and the
                crowds thin out within an hour of any lift station. This page
                is written from ten years of living in Zürich and walking out
                of it most weekends; the live guides are those weekends, one
                day trip and seven two-day stages of the Alpine Passes Trail.
              </p>
            </section>

            <section className="space-y-6">
              <SectionHeading>Which region</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Eight regions, four languages, and the answer to most planning
                questions is which two of these the trip is for. Each will have
                its own page as its guides arrive; the cards say what a region
                is, not what to do in it.
              </p>
              <RegionCards regions={regionCards} />
            </section>

            <section className="space-y-4">
              <SectionHeading>How long to stay</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Days go into regions, not sights. Shortest first, each row
                honest about what it misses.
              </p>
              <RowTable rows={HOW_LONG} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Does a rail pass pay</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Three products cover nearly every visitor, and the decision is
                about the shape of the trip – how many moves, how many lifts –
                not about any single fare. Count the long journeys and the
                mountain days before choosing.
              </p>
              <RowTable rows={RAIL_PASSES} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Where to base yourself</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One base for a short trip, two for a week. The four that most
                people choose between, and who each one is right for.
              </p>
              <RowTable rows={WHERE_TO_BASE} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Car or no car</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                No car, for almost every trip. The trains reach every town and
                most villages, the yellow post buses reach the rest, and the
                famous mountain resorts – Zermatt, Wengen, Mürren – are
                car-free, so a rental waits in a valley car park while the
                trip happens above it. Parking in the cities is scarce and
                priced to discourage, and the motorway needs a vignette. The
                guides are written for the network: every stage starts at a
                station or a bus stop and ends at one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Rent a car for two kinds of trip only: a family or a group with
                a lot of luggage moving between remote valleys, or a trip built
                around the high passes as drives – the Furka, Grimsel, Susten
                and their neighbours – which the trains cross by tunnel and
                never see. Even then, the car earns its keep on those days and
                costs money on the others.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Switzerland has two seasons that work and two shoulders that
                need checking. The mountains decide: the same trip in July and
                in November is two different countries.
              </p>
              <RowTable rows={WHEN_TO_GO} />
            </section>

            {CAROUSEL.length ? (
              <section className="space-y-4">
                <SectionHeading>From the trips</SectionHeading>
                <PhotoCarousel slides={CAROUSEL} />
              </section>
            ) : null}

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Zürich for the German-speaking centre and east, Geneva
                for the French-speaking west; both airports have a railway
                station underneath them and trains straight into the national
                timetable. By rail, Switzerland is a few hours from Paris,
                Milan, Munich and Frankfurt, which for a European trip beats
                the airports on both time and comfort. Switzerland is in
                Schengen but not the EU: passport rules follow Schengen, the
                currency is the Swiss franc, and cards work almost everywhere.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Around the country you take the train, and one national
                timetable covers every train, bus, boat and most lifts, so a
                single search plans a whole day. The network's habit of
                connecting on the same platform a few minutes apart is what
                makes a mountain day from a city possible. Four languages –
                German, French, Italian and Romansh – change with the region,
                and English gets you through all of them.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the one that
                unlocks the rest of the country: the visitors' Swiss Half Fare
                Card costs CHF {HALF_FARE_CARD_CHF} per person for a month and
                halves nearly every train, bus, boat and mountain lift from the
                first day. That is what unlocking the trains costs, not what the
                trip costs. Beyond it, the bill is a choice about how you
                sleep and how many lifts you ride:
              </p>
              <CostTable rows={COSTS} />
              <p className="text-[15px] leading-relaxed text-slate-700">
                The bed and the lifts are the only lines with real range. The
                walking, the lakes, the villages and the views cost the same
                whichever style you travel in, which is why a lean Swiss trip
                on foot is the version that feels least like a compromise.
              </p>
            </section>

            <section className="space-y-5">
              <SectionHeading>Tested tips</SectionHeading>
              <TipsList tips={TIPS} />
            </section>

            {CLOSING ? (
              <div className="relative overflow-hidden rounded-[28px]">
                <Image
                  src={CLOSING.image}
                  alt={CLOSING.alt}
                  className="h-[420px] w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ) : null}

            <section className="space-y-4">
              <SectionHeading>FAQ</SectionHeading>
              <FaqList faq={FAQ} />
            </section>

            {guideGroups.length ? (
              <section className="space-y-8">
                <SectionHeading>Guides for Switzerland</SectionHeading>
                {guideGroups.map(({ region, guides: regionGuides }) => {
                  const href = regionHref(region);
                  return (
                    <div key={region.slug} className="space-y-4">
                      <h3 className="font-serif text-xl text-brand-ink">
                        {href ? (
                          <Link href={href} className="hover:text-slate-700">
                            {region.label}
                          </Link>
                        ) : (
                          region.label
                        )}
                      </h3>
                      <GuideCards guides={regionGuides} blurbs={GUIDE_BLURBS} />
                    </div>
                  );
                })}
              </section>
            ) : null}

            <StoryGrid stories={stories} heading="Stories from Switzerland" />
          </div>
        </div>
      </div>
    </main>
  );
}

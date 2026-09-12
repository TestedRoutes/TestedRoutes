import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import akodessawaTableOfSkullsAndSkins from "../../../../content/countries/togo/destination/generated/web/akodessawa-table-of-skulls-and-skins.jpg";
import lomeRooftopsAndTheBeach from "../../../../content/countries/togo/destination/generated/web/lome-rooftops-and-the-beach-from-above.jpg";
import pirogueUnderPole from "../../../../content/countries/togo/destination/generated/web/pirogue-under-pole-on-lake-togo.jpg";
import theOldPierOnLomeBeach from "../../../../content/countries/togo/destination/generated/web/the-old-pier-on-lome-beach.jpg";
import akodessawaMarketYard from "../../../../content/countries/togo/destination/generated/web/akodessawa-market-yard.jpg";
import aNamedStallAtAkodessawa from "../../../../content/countries/togo/destination/generated/web/a-named-stall-at-akodessawa.jpg";
import colonnadeOfCarvedFigures from "../../../../content/countries/togo/destination/generated/web/colonnade-of-carved-figures-lome.jpg";
import carvedFiguresInsideTheMuseum from "../../../../content/countries/togo/destination/generated/web/carved-figures-inside-the-museum.jpg";
import independenceMonumentAndPool from "../../../../content/countries/togo/destination/generated/web/independence-monument-and-pool-lome.jpg";
import independenceMonumentPlaza from "../../../../content/countries/togo/destination/generated/web/independence-monument-plaza-lome.jpg";
import palaisDeLomeFacade from "../../../../content/countries/togo/destination/generated/web/palais-de-lome-facade.jpg";
import palaisDeLomeParkTowardTheSea from "../../../../content/countries/togo/destination/generated/web/palais-de-lome-park-toward-the-sea.jpg";
import lilyPondLome from "../../../../content/countries/togo/destination/generated/web/lily-pond-lome.jpg";
import theLongEmptyBeachLome from "../../../../content/countries/togo/destination/generated/web/the-long-empty-beach-lome.jpg";
import boatsAndFiguresOnTheLakeShore from "../../../../content/countries/togo/destination/generated/web/boats-and-figures-on-the-lake-shore.jpg";
import dugoutsOnTheTogovilleShore from "../../../../content/countries/togo/destination/generated/web/dugouts-on-the-togoville-shore.jpg";
import goalOnTheSandLakeTogo from "../../../../content/countries/togo/destination/generated/web/goal-on-the-sand-lake-togo.jpg";
import alongAWallInTogoville from "../../../../content/countries/togo/destination/generated/web/along-a-wall-in-togoville.jpg";
import benchesFacingTheCross from "../../../../content/countries/togo/destination/generated/web/benches-facing-the-cross-togoville.jpg";
import theCrewOnThePalaisBalcony from "../../../../content/countries/togo/destination/generated/web/the-crew-on-the-palais-de-lome-balcony.jpg";

/*
 * MEDIA. Cut 2026-09-12 from the founder's cull of
 * content/countries/togo/destination/_shortlist-run1/ (his hero.jpg is the
 * Akodessawa table, his last.jpg the crew on the Palais de Lomé balcony,
 * which closes the carousel), at 1660 px WIDE, q85, into
 * content/countries/togo/destination/generated/web/. Two portraits are
 * deliberate 4:3 crops. One of his additions - a photograph of a textile
 * artwork inside the Palais exhibition - was left out on purpose: a founder
 * photo of somebody else's artwork is a reproduction, not a founder original.
 * The lily-pond caption stays place-neutral: the frame sits between the
 * Palais and the beach on the timeline but nothing names the park.
 *
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Togo is worth a stop, how long it actually needs, when to come. Everything
 * operational is absent.
 *
 * STRICT SMALL-SKU TEASER BUDGET, even though no Togo SKU is planned on its
 * own. A Gulf-of-Guinea circuit SKU would cover Togo, and a page cannot be
 * clawed back once it is indexed. Withheld by name:
 *   - The laissez-passer / passavant and visa-on-arrival amounts and channels
 *     at the land border, and the plan's note that "nobody cares".
 *   - The Togoville boat hire and what it costs.
 *   - The 24/7 opening of the Ghana-Togo post, and the state of the road on
 *     the Togo side. Border mechanics are the guide's, not the hub's.
 *   - Fares, entry prices, opening windows, day sequencing, named beds.
 *
 * THE ONE FIGURE (§8) is the flight - about €650 return from western Europe -
 * labelled as what getting there costs. It appears in the costs section and
 * once in an FAQ answer so the schema carries it. Nothing else here carries an
 * amount.
 *
 * VOICE RULE, binding, and it is this country's traffic. Akodessawa is a
 * WORKING RELIGIOUS MARKET with real customers, not a freak show. Describe
 * what is there. His discomfort is reported as his, never as a verdict on a
 * faith. Words that do not ship: primitive, superstition, witchcraft, barbaric
 * and their neighbours. "Voodoo" and "Vodun" are the religion's own names and
 * are fine. The load-bearing detail is that the buyers were locals doing
 * ordinary business on an ordinary Friday - that is what separates the honest
 * version from the shock version everyone else publishes, and it stays.
 *
 * THE HONESTY LINE: one and a half days, Lome and Togoville, NOTHING NORTH.
 * Koutammakou, Kpalime and Fazao are research, named at decision level and
 * framed explicitly as not visited. Under §11 they get no region card. The
 * whole GEO play here is telling a circuit planner the truth - Togo is a day,
 * not a leg - so do not let a later edit pad it into a week we did not do.
 *
 * SUPERLATIVES ARE CLAIMS. Akodessawa is "billed as" the largest of its kind,
 * attributed, never asserted flat. Togo's population is cited to the UN
 * figure; Worldometer differs by over a million.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title: "Togo: is it worth visiting, and why one day is the honest answer · TestedRoutes",
  description:
    "How long Togo actually needs, whether it is worth a stop on the Gulf of Guinea circuit, and what one day in Lomé buys – the fetish market, the lake crossing to Togoville, safety, season and what getting there costs.",
  alternates: { canonical: "/destinations/togo" },
  openGraph: {
    type: "article",
    url: "/destinations/togo",
    title: "Togo: is it worth visiting, and why one day is the honest answer",
    description:
      "A sliver of a country between Ghana and Benin, and the best thing in it is a boat with no engine. What one day in Togo actually buys.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The dry season and the straightforward choice. Hot, bright, and everything within reach of the coast behaves. From December into February the harmattan blows dust down from the Sahara, which mutes the light and coats everything – it is the price of the most reliable window of the year."],
  ["April to mid-July", "The main rains on the coast, and they are heavy. The country turns green, the hills inland come into their own, and unpaved roads become an open question. Lomé itself keeps working; the north is a different calculation."],
  ["August to September", "A genuine drier gap on the coast in August before a shorter wet season returns in September and October. The quietest time to be here, and the greenest the south gets without being actually wet."],
  ["What I would pick", "The first half of February, which is when we came, and I would not change it. The coast was hot and dry, the lake was flat enough to pole a boat across, and the haze had mostly gone. If you are pushing north to the hills or to Koutammakou, take the end of the rains in late October instead."],
];

const HOW_LONG = [
  ["One day", "The honest answer for most people, and the thing nobody will tell you. Lomé is a compact, walkable, low-rise capital and a single day covers the market, the restored palace on the seafront, the museums and enough of the city to know what it is. If Togo is a stop on a longer drive, this is what it needs."],
  ["Two days", "A day for the capital and a day for Lake Togo, which is the better of the two. The lake is under two metres deep and the boats that cross it have no engines – the captain stands and poles. Togoville on the far shore is a small, strange, quiet place and it is the thing I would send anyone to Togo for."],
  ["A week or more", "What the country would need to be a destination rather than a stop: the hills around Kpalimé, the Fazao forest, and the fortified Batammariba compounds of Koutammakou in the far north, which UNESCO lists and which is the one genuinely famous thing Togo has. We did not go north at all, so everything in this row is research rather than experience."],
  ["What we actually had", "A day and a half – in after dark from Ghana, one full day for Lomé and Togoville, and out at five the next morning toward Benin. It was enough to see the south properly and it is why this page says a day rather than a week."],
];

const REGIONS = [
  {
    name: "Lomé and the coast",
    image: lomeRooftopsAndTheBeach,
    alt: "Lomé's low rooftops and the long beach beside the city, seen from above, Togo",
    body: "One of the few capitals in the world sitting directly on an international border – the Ghana frontier is at the western edge of the city – which gives Lomé an odd, permeable feel. It is low-rise, hot, and moves almost entirely on motorbikes. The standouts are the Palais de Lomé, built in 1905 as the German governor's residence and reopened at the end of 2019 after a long restoration as an exhibition space and park, and the Musée International d'Art d'Afrique du Golfe de Guinée. And then there is Akodessawa, billed as the largest fetish market in the world, which is not a museum and not a show.",
  },
  {
    name: "Lake Togo and Togoville",
    image: pirogueUnderPole,
    alt: "A loaded wooden boat being poled across the shallow water of Lake Togo, Togo",
    body: "An hour or so east of the capital, a shallow lagoon separates the coast road from the old royal village of Togoville. The lake is less than two metres deep, so the boats that cross it carry no engine at all: the captain stands in the stern and poles, and the crossing takes as long as it takes. The far shore has no jetty, so the last few metres are done on somebody's back. Togoville is where the German protectorate treaty was signed in the 1880s, and where Pope John Paul II came in 1985 – a visit the village will still tell you about.",
  },
];

/* Trip photos in the order the day ran: the market first thing, the museum,
   the monument, the Palais, the beach, then the lake and Togoville in the
   afternoon. The founder's last.jpg closes it. */
const CAROUSEL = [
  { image: akodessawaMarketYard, alt: "The open yard of Akodessawa fetish market with a carved figure on a plinth, Lomé, Togo", caption: "Akodessawa's yard, with the carved figure on its plinth" },
  { image: aNamedStallAtAkodessawa, alt: "A signed stall of dried animal parts under a thatched roof at Akodessawa fetish market, Lomé, Togo", caption: "A named stall – a business, not a set" },
  { image: colonnadeOfCarvedFigures, alt: "Tall carved wooden figures along the colonnade of a museum with people sitting beneath them, Lomé, Togo", caption: "The colonnade of carved figures" },
  { image: carvedFiguresInsideTheMuseum, alt: "Three large carved wooden figures against a stone wall inside a museum, Lomé, Togo", caption: "Inside, the same tradition at close range" },
  { image: independenceMonumentAndPool, alt: "The Independence Monument and its reflecting pool with a tower behind, Lomé, Togo", caption: "The Independence Monument and its pool" },
  { image: independenceMonumentPlaza, alt: "The wide empty paved plaza running toward the Independence Monument, Lomé, Togo", caption: "The plaza, wide and empty" },
  { image: palaisDeLomeFacade, alt: "The white facade of the Palais de Lomé behind trees and a sandy drive, Togo", caption: "The Palais de Lomé, the old governor's residence" },
  { image: palaisDeLomeParkTowardTheSea, alt: "A long lawn and pool running from a balustrade toward the sea in the Palais de Lomé park, Togo", caption: "The Palais park, running down toward the sea" },
  { image: lilyPondLome, alt: "A pond covered in water lilies under trees, Lomé, Togo", caption: "A lily pond in the city" },
  { image: theLongEmptyBeachLome, alt: "A long empty sandy beach with the city's towers at the far end, Lomé, Togo", caption: "The long empty beach, the city at one end" },
  { image: boatsAndFiguresOnTheLakeShore, alt: "Wooden boats and a few figures on the sandy shore of Lake Togo in flat afternoon light", caption: "The lake shore, afternoon" },
  { image: dugoutsOnTheTogovilleShore, alt: "Dugout canoes drawn up in the shallows of Lake Togo at dusk, Togoville, Togo", caption: "Dugouts drawn up on the Togoville shore" },
  { image: goalOnTheSandLakeTogo, alt: "A football goal with a torn net on the sand beside Lake Togo, Togoville, Togo", caption: "A goal on the sand beside the lake" },
  { image: alongAWallInTogoville, alt: "Children sitting along the base of an ochre wall in Togoville, Togo", caption: "Along a wall in Togoville" },
  { image: benchesFacingTheCross, alt: "Rows of open-air benches facing a cross and a stage at the papal site, Togoville, Togo", caption: "The benches facing the cross, where the village still talks about the pope" },
  { image: theCrewOnThePalaisBalcony, alt: "The rally crew on the balcony of the Palais de Lomé under a Togolese flag, Togo", caption: "The crew on the Palais de Lomé balcony" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Small local hotels in Lomé, shared taxis and motorbike taxis, eating at the roadside. Togo is cheap at this level and there is very little tourist mark-up to avoid"],
  ["Core", "A proper hotel on or near the Lomé seafront and a car with a driver for the day you go east to the lake. This is where most visitors land and it is not expensive"],
  ["Splurge", "A handful of international-standard hotels in the capital and a small number of beach places along the coast. The ceiling is low, and spending more here buys comfort rather than access"],
];

const TIPS = [
  ["Plan Togo as a day, and it becomes a good day.", "The failure mode here is treating a small country as a small version of a big one. Togo is a sliver – roughly a hundred kilometres of coast and six hundred kilometres of interior running north – and the south is genuinely a day. Given a day it is compact, cheap and rewarding. Given three days without going north, it runs out."],
  ["Akodessawa is a working market, and going in knowing that changes the visit.", "It sells the raw materials of a living religion: dried and preserved animals, bones, plants, figures, the things a practitioner needs. A priest is there to prepare and activate what you buy. The thing that stays with me is not the stock, it is that the people buying were locals doing ordinary Friday business, not an audience. It smells of what it is and it is not a comfortable hour. Go if you want to understand something about the country; do not go to be shocked, and do not photograph people who have not agreed to it."],
  ["Everything moves on two wheels.", "Lomé runs on motorbike taxis to a degree that takes a day to get used to. They are quick, cheap and everywhere, and they are also the reason road safety is the most real risk on a Togolese trip. If you are not comfortable on the back of one, taxis exist, but you will be waiting."],
  ["The best thing in Togo is not in the capital.", "Nobody plans a trip around a lagoon crossing, and the poled boat to Togoville is the thing I would send anyone here for. It costs almost nothing, it takes the better part of a morning, and it is the one part of the country that does not feel like a stop on the way to Benin."],
];

const FAQ = [
  ["Is Togo worth visiting?", "Yes, as a day or two rather than a destination – and that is not a criticism so much as a description. Togo is a narrow country between Ghana and Benin, and the southern end of it, which is what almost everyone sees, is one compact capital and one shallow lagoon. What makes it worth stopping for is that both are unusual: Lomé holds Akodessawa, billed as the largest fetish market in the world and very much a working one, plus a restored German colonial palace on the seafront; and an hour east a boat with no engine is poled across Lake Togo to the old royal village of Togoville. The far north, which we did not reach, is where the country's one internationally famous sight is – the Batammariba compounds of Koutammakou, a UNESCO World Heritage site – and that would make it a week rather than a day."],
  ["How many days do you need in Togo?", "One, if you are passing through on the coast, and that is the honest answer most sources will not give you. A single day in Lomé covers the market, the palace, the museums and the feel of the city. Two days lets you add Lake Togo and Togoville, which is the better half of the trip. Anything more only makes sense if you are going north to Kpalimé, Fazao or Koutammakou, and that is a week-long proposition in its own right. We had a day and a half and left having seen the south properly."],
  ["What is the Akodessawa fetish market, and should you visit?", "It is a market in Lomé supplying the materials of Vodun practice – dried and preserved animals, skulls, bones, plants, carved figures – with priests on site who prepare and activate what is bought. Sources date it to the seventeenth century and it is widely billed as the largest of its kind in the world. It is not a museum, an exhibit or a tourist attraction dressed as one: the people buying there are locals doing ordinary business. Should you go? If you want to understand a country where a large minority follows traditional religion, yes. It is confronting – the smell is the part nobody warns you about – and it deserves to be approached as somebody else's church rather than as a curiosity. Ask before photographing anyone."],
  ["Is Togo safe to visit?", "Check your government's current advice and let it outrank this page. Togo has generally sat at the middle of the caution scale – the US had it at Level 2, exercise increased caution, at the time of our trip – with two specific carve-outs worth knowing: the far north near the Burkina Faso border, where the regional jihadist insurgency reaches, and demonstrations in the capital, which can flare around political events. The south, which is what this page covers, was calm and ordinary. The realistic risk on a normal Togolese trip is the traffic, not crime: this is a country that moves on motorbikes."],
  ["When is the best time to visit Togo?", "November to March, the dry season. The trade-off is the harmattan haze from December into February, which dulls the light and puts dust over everything. The main rains run from April into mid-July with a shorter wet season in September and October, and there is a real drier gap on the coast in August. We went in early February and the conditions were as good as they get: hot, dry, and the lake flat enough to pole a boat across."],
  ["Do you need a visa for Togo?", "Most visitors do, and it is one of the more accommodating systems in the region – there is an online e-visa, and visas are also issued on arrival at the airport and at land borders. A yellow fever vaccination certificate is a genuine entry requirement. Entry rules in this part of West Africa change with some regularity, so confirm against your own foreign ministry before you travel rather than against a page written months ago."],
  ["Is Togo expensive?", "No, and getting there is the one cost that matters: return flights from western Europe run about €650 booked ahead, most practically through Paris or Brussels, or on the regional carrier via another West African hub. That is what reaching Togo costs, not what the trip costs. On the ground it is one of the cheaper countries on this coast – food, transport and beds are all modest, and because there is very little tourism there is very little tourist pricing. The currency is the West African CFA franc, which is pegged to the euro, so prices are easy to read if you are coming from Europe."],
  ["What is there to do in Lomé?", "More than a city this size usually offers, and you can do it in a day. Akodessawa fetish market is the one people come for. The Palais de Lomé is the one that surprised us: the German governor's residence from 1905, closed for decades and reopened at the end of 2019 after a full restoration, now an exhibition space with gardens running down toward the sea. The Musée International d'Art d'Afrique du Golfe de Guinée is the other serious collection in town. Add the independence monument, the seafront, and the grand marché, and you have the city – which is a walkable, low-rise, motorbike-driven place quite unlike Accra or Cotonou."],
  ["What is Togoville, and is it worth the trip?", "It is an old royal village on the far shore of Lake Togo, about an hour east of the capital, and it was the best half-day we had in the country. The lake is less than two metres deep, so the crossing is made in a wooden boat with no engine – the captain stands and poles it across, and it takes the time it takes. There is no landing stage on the far side, so somebody carries you the last few metres. The village is where the treaty establishing the German protectorate was signed in the 1880s, it has a Vodun tradition sitting alongside a strong Catholic one, and Pope John Paul II visited in 1985, which the village has not stopped talking about. It is quiet, strange and entirely unlike the capital."],
  ["Why is Togo French-speaking if it was a German colony?", "Because it was divided. German Togoland was taken by British and French forces during the First World War and split between them under League of Nations mandates. The British-administered western strip voted to join the Gold Coast and became part of Ghana at independence; the French-administered east became independent Togo in 1960. That is why the border with Ghana runs where it does, why French is the working language, and why you will find German colonial architecture in a francophone capital. It is also why the history you get told in Lomé depends quite a lot on who is telling it."],
  ["Can you combine Togo with Ghana and Benin?", "Yes, and it is the natural way to see it – Ghana, Togo and Benin sit end to end along the Gulf of Guinea, with Lomé about three hours from the Ghanaian border and Cotonou about the same again to the east. We drove the whole stretch. Togo is the short leg in the middle: a day, or two if you take the lake. Doing it by bus and shared taxi is straightforward and extremely common. Bringing your own vehicle is a different order of problem, and it is the paperwork rather than the roads that costs you the time."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Togo guide SKU exists. A Gulf-of-Guinea circuit SKU would cover this
// country; the fetch takes all guides so that it would appear as its own card
// with no code change. Until then the guide sections and the BuyBox do not
// render, and no sentence on this page may say "the guide carries X".
const GUIDE_BLURBS = {};

async function fetchTogoContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "togo" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "togo" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function TogoDestinationPage() {
  const { guides, stories } = await fetchTogoContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Togo: is it worth visiting, and why one day is the honest answer",
        description:
          "How long Togo actually needs, whether it is worth a stop on the Gulf of Guinea circuit, and what one day in Lomé buys – the fetish market, the lake crossing to Togoville, safety and season.",
        datePublished: "2026-09-12",
        dateModified: "2026-09-12",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Togo" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/togo",
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
        <span className="text-slate-600">Togo</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North &amp; West Africa · The Gulf of Guinea
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Togo
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth stopping for, how long it actually needs, and what one
          day in Lomé buys – for the narrowest country on the Gulf of Guinea.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={akodessawaTableOfSkullsAndSkins}
              alt="A table of dried animal skulls, skins and bones under a thatched roof at Akodessawa fetish market, Lomé, Togo"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Togo worth it, and how long does it really need
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Togo is a strip of a country: about a hundred kilometres of
                Atlantic coast at the bottom, six hundred kilometres of interior
                running north, and roughly 8.7 million people in it by the UN's
                count. Almost everyone who comes sees the bottom fifty
                kilometres of it, and the useful thing this page can tell you is
                that the bottom fifty kilometres is a day. Not a disappointing
                day – a good one. But a day.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What that day holds is unusual for a capital this size. Lomé is
                low-rise, walkable and sits directly against the Ghanaian
                border, which gives it a permeable, in-between quality. It holds
                Akodessawa, widely billed as the largest fetish market in the
                world and emphatically a working one, where the people buying
                are locals rather than visitors. It holds the Palais de Lomé,
                the German governor's residence from 1905, shut for decades and
                reopened at the end of 2019 after a full restoration. And it
                moves, more or less entirely, on the back of motorbikes.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The best thing in the country is an hour east of all that, and
                it is a boat. Lake Togo is under two metres deep, so the craft
                that cross it have no engines – the captain stands in the stern
                and poles. There is no landing on the far side, so somebody
                carries you the last few metres onto the shore at Togoville, an
                old royal village with a Vodun tradition, a Catholic one, and a
                papal visit it has never got over. That crossing is the reason
                to give Togo two days rather than one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What this page cannot tell you about is the north. We did not go
                – we came in after dark from Ghana, spent one full day in the
                south, and left at five the next morning for Benin. The famous
                thing in Togo, the fortified Batammariba compounds of
                Koutammakou that UNESCO lists, is up there, along with the hills
                at Kpalimé and the Fazao forest. That is a week, and it is
                somebody else's trip report.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The southern coast runs two rainy seasons and a dust season, and
                for a one- or two-day stop the practical question is simply
                whether the light is any good.
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
                This is the whole reason the page exists, so it is worth being
                blunt: if Togo is a stop on the coastal circuit, it is one day,
                or two if you take the lake.
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
                There are only two cards here because there were only two
                regions in our trip. Togo's other half runs north from the
                coastal plain into hills and then savannah: Kpalimé and the
                waterfalls and coffee country around it, the Fazao-Malfakassa
                forest, and in the far northeast the fortified Batammariba
                compounds of Koutammakou, a UNESCO World Heritage site and the
                one thing in Togo that is internationally famous. We saw none of
                it, so it gets research rather than a card. Note as well that
                the far north, near the Burkina Faso border, is where the
                region's security problems actually reach – check the current
                advice before planning anything up there.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Lomé's airport is a real regional hub – it is the home base of
                ASKY, which flies to a long list of West and Central African
                capitals – and from Europe the practical routes are Paris or
                Brussels direct, or a connection through another African hub.
                Most visitors need a visa; Togo offers an e-visa and also issues
                on arrival, including at land borders, and a yellow fever
                certificate is a genuine entry requirement.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Once you are here, the country is small enough that getting
                around is barely a question in the south. Lomé runs on motorbike
                taxis to an extent that is startling at first; shared taxis
                cover the coast road east and west, and the border with Ghana is
                at the edge of the city. A car with a driver for the day you go
                to the lake is the one arrangement worth making. Going north is
                a different proposition and needs its own planning.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                French is the working language of everything official and is
                what you will need; Ewé and Kabiyé are the two main national
                languages. The currency is the West African CFA franc, pegged to
                the euro, and Togo is a cash country outside the better hotels.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the part nobody
                can avoid: return flights from western Europe run about €650
                booked ahead. That is what reaching Togo costs, not what the
                trip costs. On the ground this is one of the cheaper countries
                on the coast, and because almost nobody visits, there is very
                little tourist pricing to work around:
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
                Because the trip is short, the flight dominates the budget to an
                unusual degree – which is the argument for arriving overland from
                Ghana or Benin rather than flying to Togo specifically. As a leg
                of a coastal circuit it costs almost nothing. As a standalone
                destination it is expensive per day, not because the country is,
                but because there are not many days in it.
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
                src={theOldPierOnLomeBeach}
                alt="An old wooden pier running out into the surf from the sandy beach at Lomé, Togo"
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
                <SectionHeading>Stories from Togo</SectionHeading>
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
                Togo was the sixth of seven countries on one drive down the West
                African coast that began in{" "}
                <Link
                  href="/destinations/guinea"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Guinea
                </Link>
                . It sits between{" "}
                <Link
                  href="/destinations/ghana"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Ghana
                </Link>
                , which needs about five days and came last on our list, and{" "}
                <Link
                  href="/destinations/benin"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Benin
                </Link>
                , which we added at the end and which was the best of the three.
                Taken as a circuit, the three are one road and about ten days.
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

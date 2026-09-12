import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import capeCoastTownFromTheFort from "../../../../content/countries/ghana/destination/generated/web/cape-coast-town-and-harbour-from-the-fort.jpg";
import capeCoastCastleCourtyard from "../../../../content/countries/ghana/destination/generated/web/cape-coast-castle-courtyard.jpg";
import stiltHousesOverTheLilies from "../../../../content/countries/ghana/destination/generated/web/stilt-houses-over-the-lilies.jpg";
import riverAndGreenHillsOnTheRoadEast from "../../../../content/countries/ghana/destination/generated/web/river-and-green-hills-on-the-road-east.jpg";
import blackStarGateIndependenceSquare from "../../../../content/countries/ghana/destination/generated/web/black-star-gate-independence-square.jpg";
import memorialAvenueAndFlagGateway from "../../../../content/countries/ghana/destination/generated/web/memorial-avenue-and-flag-gateway-accra.jpg";
import nzulezoAtFirstLight from "../../../../content/countries/ghana/destination/generated/web/nzulezo-at-first-light.jpg";
import nzulezoBoardwalkAndColouredHouses from "../../../../content/countries/ghana/destination/generated/web/nzulezo-boardwalk-and-coloured-houses.jpg";
import walkingTheNzulezoBoardwalk from "../../../../content/countries/ghana/destination/generated/web/walking-the-nzulezo-boardwalk.jpg";
import cannonOnTheRampart from "../../../../content/countries/ghana/destination/generated/web/cannon-on-the-rampart-cape-coast.jpg";
import fishingBeachBelowTheCastle from "../../../../content/countries/ghana/destination/generated/web/fishing-beach-below-the-castle.jpg";
import theHilltopFortAboveCapeCoast from "../../../../content/countries/ghana/destination/generated/web/the-hilltop-fort-above-cape-coast.jpg";
import crocodileOnTheGrass from "../../../../content/countries/ghana/destination/generated/web/crocodile-on-the-grass.jpg";
import buttressedTreeKakum from "../../../../content/countries/ghana/destination/generated/web/buttressed-tree-kakum.jpg";
import wallOfPastPresidents from "../../../../content/countries/ghana/destination/generated/web/wall-of-past-presidents-accra.jpg";
import stateCarOnTheRedCarpet from "../../../../content/countries/ghana/destination/generated/web/state-car-on-the-red-carpet.jpg";
import crewAndCarsAtTheBlackStarGate from "../../../../content/countries/ghana/destination/generated/web/crew-and-cars-at-the-black-star-gate.jpg";
import accraBoulevardInTheHaze from "../../../../content/countries/ghana/destination/generated/web/accra-boulevard-in-the-haze.jpg";
import palmsOnTheAccraShore from "../../../../content/countries/ghana/destination/generated/web/palms-on-the-accra-shore.jpg";
import eveningOnTheAccraShore from "../../../../content/countries/ghana/destination/generated/web/evening-on-the-accra-shore.jpg";
import botiInTheDrySeason from "../../../../content/countries/ghana/destination/generated/web/boti-in-the-dry-season.jpg";
import wliFallsRunning from "../../../../content/countries/ghana/destination/generated/web/wli-falls-running.jpg";
import canopyWalkwayWithTheFlag from "../../../../content/countries/ghana/destination/generated/web/canopy-walkway-with-the-flag-kakum.jpg";

/*
 * MEDIA. Cut 2026-09-12 from the founder's cull of
 * content/countries/ghana/destination/_shortlist-run1/ (he renamed his hero
 * frame to hero.jpg and added last.jpg, which closes the carousel), at
 * 1660 px WIDE, q85, into content/countries/ghana/destination/generated/web/.
 * The one portrait (Wli) is a deliberate 4:3 crop biased to the lower half
 * so the water column and the pool survive; everything else is a 4:3
 * horizontal straight off the phone. Two captions are kept place-neutral on
 * purpose (the river on the road east, the crocodile) because the founder
 * has not named the spot - a neutral caption is unfinished, a wrong one is a
 * factual error on a trust product (destination playbook §11).
 *
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Ghana is worth going to at all, which parts, how long, when. Everything
 * operational is deliberately absent.
 *
 * A GHANA SKU IS PLANNED, so the §7 line is the STRICT small-SKU teaser
 * budget: one or two tested facts, and only ones a PUBLISHED story already
 * gives away. Withheld by name, so nobody re-discovers them as a kindness:
 *   - THE ELUBO TRAP. The temporary import permit runs ~50-70 Cedi at the
 *     friendly northern posts and up to €550 at Elubo on the coast, so you
 *     cross north instead. That is the single most valuable operational fact
 *     in the whole leg and it arrives disguised as a courtesy. It does not
 *     belong on a free surface. Do not add it.
 *   - The carnet-de-passage transit arrangement and what it cost. The border
 *     story publishes the experience; §8 outranks story cover, so the amount
 *     may not be echoed here.
 *   - Visa cost and channel, fares, entry prices, opening windows, day
 *     sequencing, named beds.
 *
 * THE ONE FIGURE (§8) is the flight - about €550 return from western Europe -
 * labelled as what getting there costs, not what the trip costs. It appears
 * twice on purpose (the costs section and the FAQ answer, so the schema
 * carries it) and nothing else on this page carries an amount. If you are
 * adding a number, you are breaking the page.
 *
 * BRAND SAFETY - five binding rules, inherited from
 * content/countries/ghana/inspire/2024_ghana_source-shared.md, and the first
 * three are greppable by design:
 *   1. "Country of no return" NEVER ships, anywhere - title, slug, body or
 *      metadata. It is a pun on the Door of No Return at a slave-trade
 *      memorial.
 *   2. "#SlowAndCorrupt" never labels the country or its people. The
 *      corruption observation attaches to the two dated events he lived.
 *   3. "Less advanced than Ivory Coast" does not ship. The page-legal
 *      observation underneath it is that retail here is hundreds of small
 *      stalls selling much the same goods.
 *   4. CAPE COAST AND THE VERDICT NEVER SHARE A PARAGRAPH, SECTION OR STORY.
 *      This is why the opening section talks about "the coast west of Accra"
 *      and names no fort: the castles are handled in The regions and in the
 *      FAQ, with the weight they need and nowhere near the sentence about
 *      being disappointed. Do not "improve" the opening by naming them, and
 *      do not strip the deferral either.
 *   5. The verdict is declared up front, every negative is attached to
 *      something specific he did, and the whole thing converts into a
 *      recommendation - go narrow, five days, coast and Volta. That is the
 *      Panama treatment and it is the reason this page is publishable at all.
 *
 * SKU ALIGNMENT (§14): the planned Ghana SKU must be the narrow coastal one
 * this page recommends, not a full-country tour. The hub argues against a
 * Ghana grand tour and FOR a short sharp trip, which is the product. If a
 * full-country SKU is ever built instead, this page has to be re-argued.
 *
 * THE NORTH IS NOT TESTED. Mole, Larabanga, Paga, Tamale: research, named at
 * decision level and framed explicitly as not visited, the same treatment
 * Panama's hub gives San Blas. Under §11 they get no region card. Do not let
 * a later edit upgrade them to firsthand.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title: "Ghana: how many days you need, what is worth it and what to skip · TestedRoutes",
  description:
    "How long you need in Ghana, whether it is worth visiting and what to skip – an honest verdict from four days driving the coast, the far west and the Volta hills, with safety, season and what getting there costs.",
  alternates: { canonical: "/destinations/ghana" },
  openGraph: {
    type: "article",
    url: "/destinations/ghana",
    title: "Ghana: how many days you need, what is worth it and what to skip",
    description:
      "Ghana came last on our list of the countries we crossed that month – and the narrow version of the trip is genuinely worth flying for. Which parts, how long, and when.",
  },
};

const WHEN_TO_GO = [
  ["November to March", "The dry season, and the season almost everyone should pick. Roads behave, the coast is hot and bright, and nothing you have planned gets rearranged by weather. The cost is the harmattan: from December into February a dust haze blows down off the Sahara, flattens long views and settles on everything. We were there at the very end of it."],
  ["April to mid-July", "The main rains, and they are the reason the country looks the way it does in photographs. Everything green becomes extraordinary and every waterfall actually runs. Unpaved roads stop being predictable and the humidity on the coast is serious."],
  ["August to September", "A genuine lull on the coast – southern Ghana gets a short drier gap in August before the minor rains return through September and October. Quiet, green, and the least crowded window of the year."],
  ["What I would pick", "Late October or early November, and I say that having gone in February. The rains have eased, the roads are back, the haze has not arrived and the waterfalls are still running – which matters more here than anywhere, because we reached one in the dry season and found it barely there. If you want certainty rather than water, January and February deliver it."],
];

const HOW_LONG = [
  ["Two or three days", "Accra and one thing near it. Honest, and not much of a trip – the capital is the weakest part of the country and the good material starts a few hours west. Fine if you are here for work and have a weekend attached to it."],
  ["Four or five days", "The coast west of Accra: the forts, the rainforest canopy behind them, and the lagoon village in the far west near the Côte d'Ivoire border. This is the narrow trip, it is the one I would actually recommend, and it is the version of Ghana that earns a long-haul flight."],
  ["A week", "Add the Volta east – the hills along the Togo border, the waterfalls, the lake. Greener and cooler than the coast, almost nobody goes, and it is where the country stops feeling like a drive between sights."],
  ["Two weeks", "The north as well: Mole and its elephants, the old mud-and-stick mosques, the savannah up toward Burkina Faso. We did not go, so this is the honest limit of what we can tell you – it is a long way up and it is a different country when you get there."],
  ["What we actually had", "Four days, driving, in the middle of a rally from Guinea to Benin. Six hours of the first one went on the border. That is why the recommendation above is narrow rather than comprehensive: we saw what four days buys, and four days buys the coast."],
];

const REGIONS = [
  {
    name: "The central coast",
    image: capeCoastCastleCourtyard,
    alt: "The whitewashed courtyard and upper storeys of Cape Coast Castle under a hazy sky, Ghana",
    body: "Two European forts a dozen kilometres apart, both UNESCO World Heritage: Elmina, built by the Portuguese in 1482 and the first European trading post anywhere on the Gulf of Guinea, and Cape Coast, the largest of the coast's slave-trade fortresses. They are not sightseeing. They are the reason a great many people come to Ghana at all, and they need a day rather than a stop. Half an hour inland the rainforest starts, with a canopy walkway strung forty metres up through it, and below the fort walls a working fishing beach carries on exactly as it always has.",
  },
  {
    name: "The far west",
    image: stiltHousesOverTheLilies,
    alt: "Wooden stilt houses standing over water lilies, Nzulezo, Ghana",
    body: "The quiet corner between Takoradi and the Côte d'Ivoire border, and the least-visited thing on this list. Nzulezo is a village of around five hundred people built entirely on stilts over Lake Tadane, reached by boat through creek and swamp – founded, the village says, by people hiding from enemies who would not follow them onto water. The wetland around it is the largest of its kind in the country. It is a long way west of everything else and worth the detour.",
  },
  {
    name: "The Volta east",
    image: riverAndGreenHillsOnTheRoadEast,
    alt: "A wide river below green forested hills on the road east into Ghana's Volta region",
    body: "The strip of hills running up the Togo border, and the greenest, coolest part of southern Ghana. Wli is the headline – an eighty-metre upper cascade generally counted the tallest in West Africa, though Owu in Nigeria disputes it – reached on a flat walk through forest rather than a climb. Boti is the other name you will see, and it is a rainy-season proposition rather than a year-round one. The region is also how you leave for Togo.",
  },
  {
    name: "Accra",
    image: blackStarGateIndependenceSquare,
    alt: "The Black Star Gate above the empty parade ground of Independence Square, Accra",
    body: "The capital is a working West African city of several million, and it is not why you come. What it does well is memory: Ghana gives prime ground to its past presidents, and the Nkrumah memorial park and the vast parade ground at Independence Square are genuinely impressive pieces of civic space. What surprised us was how empty the monumental quarter felt on an ordinary weekday, and how quickly it gives way to traffic, dust and mile after mile of small stalls selling much the same goods. Half a day, deliberately.",
  },
];

/* Trip photos in the order the four days ran: the far west at dawn, the
   castle coast, the rainforest, Accra, then the two waterfalls on the way
   out to Togo. The founder's last.jpg closes it. */
const CAROUSEL = [
  { image: nzulezoAtFirstLight, alt: "Wooden stilt houses over a still lake in morning haze, Nzulezo, Ghana", caption: "Nzulezo at first light" },
  { image: nzulezoBoardwalkAndColouredHouses, alt: "A timber boardwalk between painted stilt houses with the open lake beyond, Nzulezo, Ghana", caption: "The village street is a boardwalk" },
  { image: walkingTheNzulezoBoardwalk, alt: "A woman walking the boardwalk between stilt houses and moored dugouts, Nzulezo, Ghana", caption: "Ordinary morning, on the water" },
  { image: cannonOnTheRampart, alt: "An iron cannon on the whitewashed rampart of Cape Coast Castle pointing out to sea, Ghana", caption: "The rampart at Cape Coast" },
  { image: fishingBeachBelowTheCastle, alt: "Wooden fishing boats and stalls on the beach directly below the castle walls, Cape Coast, Ghana", caption: "A working beach under a memorial" },
  { image: theHilltopFortAboveCapeCoast, alt: "A small round hilltop fort on dry grass above Cape Coast town, Ghana", caption: "The hilltop fort above the town" },
  { image: crocodileOnTheGrass, alt: "A crocodile lying on green grass beside a pond, Ghana", caption: "A crocodile on the lawn, the morning before Kakum" },
  { image: buttressedTreeKakum, alt: "The rally crew standing between the huge buttress roots of a rainforest tree at Kakum, Ghana", caption: "The tree that gives the forest its scale" },
  { image: wallOfPastPresidents, alt: "An outdoor wall of portraits of Ghana's past presidents beside a Black Star, Accra", caption: "The country puts its presidents on the wall" },
  { image: stateCarOnTheRedCarpet, alt: "A preserved blue state car on a red carpet behind a rope inside a museum, Accra, Ghana", caption: "A state car, kept on its carpet" },
  { image: crewAndCarsAtTheBlackStarGate, alt: "The rally crew and two decal-covered cars in front of the Black Star Gate, Accra, Ghana", caption: "Both cars at the Black Star Gate" },
  { image: accraBoulevardInTheHaze, alt: "A wide divided boulevard running toward tower blocks in harmattan haze, Accra, Ghana", caption: "Accra in the harmattan" },
  { image: palmsOnTheAccraShore, alt: "Coconut palms leaning over a sandy beach and the Atlantic, Accra, Ghana", caption: "Palms on the Accra shore" },
  { image: eveningOnTheAccraShore, alt: "A railing above the beach at dusk with a tower block beyond, Accra, Ghana", caption: "The end of the Accra day" },
  { image: botiInTheDrySeason, alt: "The rally crew standing on the dry sandy floor of the Boti gorge below a thin thread of water, Ghana", caption: "Boti in the dry season, and the crew where the pool should be" },
  { image: wliFallsRunning, alt: "Wli Falls dropping as a single white column down a cliff crowded with trees, Volta Region, Ghana", caption: "Wli, running in February" },
  { image: canopyWalkwayWithTheFlag, alt: "The rally crew holding a Lithuanian flag on a rope bridge above the rainforest canopy at Kakum, Ghana", caption: "Forty metres up, with the flag" },
];

// Deliberately no tier totals here (destination playbook §8). The one number on
// this page is the unavoidable one - the flight pair - and it is labelled as
// what getting there costs, not what the trip costs.
const COSTS = [
  ["Lean", "Small local hotels, shared taxis and tro-tros between towns, eating where the drivers eat. Ghana has more of this infrastructure than most of its neighbours, and it works"],
  ["Core", "A decent hotel on the coast and in the capital, and a car with a driver for the days you are covering ground – which is where the real difference in this country is bought"],
  ["Splurge", "Beach resorts west of Accra and international-standard hotels in the capital. The ceiling is higher than anywhere else on this stretch of coast, and almost none of it is near the things worth seeing"],
];

const TIPS = [
  ["The waterfall season is not the road season, and you have to choose.", "We reached Boti at the wrong end of the dry season and found almost no water in it, which is exactly what the rains are for. Wli was still running and still worth the trip. If waterfalls are the reason you are going, go at the end of the rains in October, and accept that a dirt road can stop you. If reliability matters more, go in January and treat any water you find as a bonus."],
  ["Budget a day for the border, not an hour.", "Driving in took us six hours, and almost none of it was paperwork. Nobody was hostile and nothing was dangerous; we simply were not being processed, and there was no hurry to explain why. What broke it was the anti-corruption telephone numbers Ghana's customs service posts on the wall of the hall – we started calling them and knocking on managers' doors, and we were through in twenty minutes. Those numbers are real and they work."],
  ["Measure this country in hours, not kilometres.", "The coast road west of Accra is asphalt and still slow, the Volta run is longer than the map suggests, and four hundred kilometres is a full day with stops. Plan half of what looks reasonable and you will enjoy twice as much of it."],
  ["The castles are the day, not a stop on it.", "Cape Coast and Elmina are memorials to the Atlantic slave trade, and the visit is a guided walk through holding cells and out through the door the ships were loaded from. People arrive expecting a fort and leave quiet. Give it the time it needs and do not schedule something cheerful immediately afterwards."],
];

const FAQ = [
  ["Is Ghana worth visiting?", "Yes, narrowly – and I should declare the bias before anything else, because Ghana came last on our list of the countries we crossed on that drive and none of us was keen to go back. That verdict is about a shape of trip rather than about the country: we crossed it in four days, spent six hours of the first at the border, and gave the capital a day it did not repay. What Ghana genuinely has is a short, strong run west of Accra – the two UNESCO slave-trade forts on the central coast, a rainforest canopy walkway behind them, and a stilt village in the far west that almost nobody reaches – plus a green strip of hills and waterfalls on the Togo border. Flown for on its own and done in five days, that is a good trip. Toured comprehensively over a fortnight, it is the thing that made us say Ghana was our least favourite of seven countries."],
  ["How many days do you need in Ghana?", "Five is the answer I would give almost everyone: four on the coast west of Accra and one to get to it. A week lets you add the Volta hills on the eastern border, which is the part we liked best after the coast and the part fewest visitors see. Two weeks is what the north needs – Mole, the old mud mosques, the savannah – and we did not go there, so treat that as research rather than a recommendation. Under three days you are looking at Accra and one thing near it, and Accra is the weakest part of the country."],
  ["Is Ghana safe to visit?", "Check your own government's current advice and let it outrank this page, but Ghana is one of the calmer countries in the region and is usually rated as such – the US placed it at Level 2, exercise increased caution, when we went, the same level it gives a great deal of Europe. The realistic risks are ordinary ones: petty theft and street crime in Accra, particularly after dark, and road safety, which is by a distance the most dangerous part of a Ghanaian trip. Our own trouble was bureaucratic rather than physical. We spent six hours at the land border being told nothing, and we left with a tracking device fitted under a passenger seat. That is a frustration and an expense; it was never a threat."],
  ["When is the best time to visit Ghana?", "November to March for certainty: dry roads, reliable days, and the trade-off being the harmattan haze that blows dust down from the Sahara between December and February. Late October or early November is the better window if you can take it – the rains have just eased, the country is still green, and the waterfalls are still running. The main rains fall from April into mid-July, with a short drier gap in August and a minor wet season through September and October. Nothing closes in the rains; what changes is whether an unpaved road is a road."],
  ["Cape Coast or Elmina – which castle should you visit?", "If you have one day, Cape Coast. It is the larger of the two, it is the one with the fuller interpretation, and it is generally described as the largest of the fortresses built on this coast for the Atlantic slave trade. Elmina is the older by a wide margin – the Portuguese built it in 1482, making it the first European trading post anywhere on the Gulf of Guinea – and it is the more architecturally striking of the two, standing over a working fishing harbour. They sit about a dozen kilometres apart and both are UNESCO World Heritage, so doing both in a day is possible. Whether you should is a different question: one of these visits is a great deal to absorb and two is more than most people want."],
  ["Is Cape Coast Castle worth visiting, and what is it actually like?", "It is the single most worthwhile thing we did in Ghana, and it is not a pleasant morning. The visit is a guided walk through the castle: the holding cells below ground where captured people were held before being loaded, the cells used for those who resisted, the governor's quarters directly above, and the doorway onto the beach known as the Door of No Return, through which people were taken out to the ships. The building is whitewashed and beautiful and sits over a busy fishing beach, which makes the contrast harder rather than easier. Give it a half day, go with the guide rather than alone, and do not stack anything light immediately after it."],
  ["Is Wli Falls the highest waterfall in West Africa?", "It is generally counted as such, and that claim is worth stating carefully rather than flatly. Wli, in the Volta region on the Togo border, drops in two stages – an upper cascade of roughly eighty metres and a lower one of around sixty-five – and most Ghanaian and international sources describe it as the tallest in West Africa. Owu Falls in Nigeria is the standing rival claim, and measurements of both vary by source. What is not in dispute is that the lower fall is reached on an easy walk through forest rather than a climb, that it runs all year, and that it was one of the highlights of our trip."],
  ["Are Ghana's waterfalls worth it, and when do they actually run?", "Wli runs year-round and is worth the journey east on its own. Boti, the other name you will see on every list, really does need the rains – we got there in the dry season and there was barely water in it, which is not a complaint about the place so much as a fact about the calendar. The distinction matters when you are planning: if your trip is built around waterfalls, aim for the end of the rains in October rather than the middle of the dry season, and if your dates are fixed in January or February, plan around Wli and treat everything else as a bonus."],
  ["Do you need a visa for Ghana?", "Most visitors do, but the answer now depends on your passport. In May 2026 Ghana became the first country on the continent to open fee-free entry to every African passport holder – still an online application through the government e-visa portal, but with the fee removed. Travellers from Europe, the UK and North America still need a visa, and it is arranged in advance rather than on arrival. A yellow fever vaccination certificate is a real entry requirement here rather than a formality, and it has to be given at least ten days before you travel. If you are driving your own vehicle in, the paperwork for the car is an entirely separate problem from the paperwork for you, and it is the one that will cost you the day."],
  ["Is Ghana expensive?", "Getting there is the one unavoidable cost: return flights from western Europe run about €550 booked ahead, through Brussels, Amsterdam, Paris, Istanbul or Casablanca. That is what reaching Ghana costs, not what the trip costs. On the ground it is inexpensive by any European measure, and by the standards of the region it is well supplied – there are real hotels, real restaurants and a functioning bus network, which is not true everywhere on this coast. The line where money actually changes the trip is transport: a car and a driver for the days you are covering ground turns a week of long, hot hours into a week of seeing things."],
  ["Is Accra worth visiting?", "For half a day, and not as the point of the trip. What the capital does well is civic memory – Ghana gives prime ground to its past presidents, and the Nkrumah memorial park and the enormous parade ground at Independence Square are impressive pieces of public space, quiet enough on an ordinary weekday to be slightly eerie. What surrounds them is a hot, dusty, heavily trafficked city of several million where retail happens in tens of thousands of small stalls rather than in shops, and where getting anywhere takes longer than it should. We expected more of it than we got. Everything we would tell you to fly for is west or east of it."],
  ["Can you drive into Ghana, and combine it with Togo and Benin?", "Yes, and it is a natural piece of road – Ghana, Togo and Benin sit end to end along the Gulf of Guinea, and the whole stretch from the Côte d'Ivoire border to Cotonou is a few long days of driving. We did exactly that in two elderly estate cars. What you should know is that taking a vehicle across these borders is a different order of difficulty from crossing on foot or by bus: the paperwork for the car is where the hours go, the arrangements vary sharply between one post and another, and the difference between the right crossing and the wrong one is measured in hundreds of euros. If you are not bringing a vehicle, the same route by bus and shared taxi is straightforward and people do it constantly."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Ghana guide SKU is live yet - one is planned. The fetch takes all guides
// so that the SKU appears as its own card with no code change; until then the
// guide sections and the BuyBox simply do not render. When the SKU lands, do
// the pointer pass: the how-long section and the FAQ both need a sentence that
// says the guide carries the mechanics this page withholds.
const GUIDE_BLURBS = {};

async function fetchGhanaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "ghana" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "ghana" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function GhanaDestinationPage() {
  const { guides, stories } = await fetchGhanaContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Ghana: how many days you need, what is worth it and what to skip",
        description:
          "How long you need in Ghana, whether it is worth visiting and what to skip – an honest verdict from four days driving the coast, the far west and the Volta hills.",
        datePublished: "2026-09-12",
        dateModified: "2026-09-12",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Ghana" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/ghana",
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
        <span className="text-slate-600">Ghana</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North &amp; West Africa · The Gulf of Guinea
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Ghana
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          How long you need, what earns the trip and what to skip – from four
          days driving the coast, the far west and the hills on the Togo
          border.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={capeCoastTownFromTheFort}
              alt="Cape Coast town and its harbour full of painted fishing boats, seen from the castle above, Ghana"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Ghana worth it, and what is actually worth your days
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                I should declare the bias first. Of the seven countries we
                crossed on one drive down the West African coast, Ghana came
                last, and none of us was keen to go back. That is an unusual
                thing for a travel page to open with, so it is worth being
                precise about what it is a verdict on – because it is a verdict
                about a shape of trip, not about a country.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Three specific things produced it. Driving in took six hours at
                a land border where almost none of the delay was paperwork. The
                capital took a day and gave very little of it back. And the
                distances between the good parts are longer than they look, so
                a fortnight spent touring Ghana comprehensively is largely a
                fortnight spent in a car. None of that is a statement about
                Ghanaians, who were as straightforward and as generous as
                anyone on that drive.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Now the useful half, which is the recommendation the verdict
                converts into: <strong>go narrow</strong>. Ghana has a short,
                genuinely strong run west of Accra – the two UNESCO forts on the
                central coast, a rainforest canopy walkway strung forty metres
                up behind them, and a stilt village on a lagoon in the far west
                that almost nobody reaches. Add the green hills and waterfalls
                on the Togo border and you have a week that is worth a long-haul
                flight. Skip the grand tour, give the capital half a day, and
                Ghana stops being the country we liked least and becomes a very
                good five days.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One thing on this page is deliberately not squeezed into that
                argument. The forts on the central coast are memorials to the
                Atlantic slave trade rather than sights to be weighed against a
                drive, and they are dealt with below and in their own story,
                where there is room for them.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Southern Ghana runs two rainy seasons and a dust season, and
                the choice between them is a real trade – because the thing the
                rain decides is whether the waterfalls exist.
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
                The honest answer is shorter than most itineraries you will be
                sold, and that is the most useful thing on this page.
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
                One region is missing from that list on purpose. Northern Ghana
                – Mole and its elephants, the old mud-and-stick mosque at
                Larabanga, the savannah running up to Burkina Faso – is a
                genuinely different country from the coast, and we did not go
                there. It is the part of Ghana we would add if we went back, and
                everything we could tell you about it would be research rather
                than experience.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Accra. It is one of the better-connected airports in
                West Africa, with direct services from Brussels, Amsterdam,
                Paris, London, Istanbul and Casablanca among others, and the
                flight is around six and a half hours from northwest Europe.
                Most visitors need a visa, arranged in advance rather than on
                arrival, and a yellow fever certificate is a genuine entry
                requirement rather than a formality.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, Ghana is better supplied than most of its
                neighbours. Intercity coaches actually run to a timetable,
                shared minibuses fill in everywhere else, and domestic flights
                cover the long haul north to Tamale. For the coastal trip this
                page recommends, a car with a driver is what changes the week –
                the distances are modest on paper and slow in practice, and the
                good things are spread along two hundred kilometres of road.
                Driving yourself is entirely possible; bringing your own vehicle
                across a land border is a different and much larger undertaking.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                English is the official language and is spoken widely, which
                makes Ghana markedly easier to travel in than its
                French-speaking neighbours on either side. The currency is the
                cedi, mobile money is everywhere, and cards work in the cities
                and nowhere else.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One number is worth publishing, because it is the part nobody
                can avoid: return flights from western Europe run about €550
                booked ahead. That is what reaching Ghana costs, not what the
                trip costs. On the ground the country is inexpensive by any
                European measure, and the rest is a choice about how you sleep
                and how you move:
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
                The line worth spending on is the car. Beds on the coast range
                from basic to resort and the difference is comfort rather than
                access; the difference between covering the coast in a hired
                vehicle and covering it in shared transport is whether you see
                three things in a day or one.
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
                src={memorialAvenueAndFlagGateway}
                alt="A paved memorial avenue lined with lanterns leading to a gateway in Ghana's colours, Accra"
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
                <SectionHeading>Stories from Ghana</SectionHeading>
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
                Ghana was the fifth of seven countries crossed on one drive down
                the West African coast, from{" "}
                <Link
                  href="/destinations/guinea"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Guinea
                </Link>{" "}
                to the Nigerian border. Immediately east are{" "}
                <Link
                  href="/destinations/togo"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Togo
                </Link>
                , which is honestly a single day, and{" "}
                <Link
                  href="/destinations/benin"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Benin
                </Link>
                , which we added at the end because the roads had held – and
                which turned out to be the best of the three.
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

import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

/* IMAGES — cut 2026-09-11 from the founder's cull of
 * content/countries/nicaragua/destination/_shortlist-run1/ (destination
 * playbook §11, media playbook Phase 4 ¶): he kept 22 of the 40 candidates,
 * seven of them his own additions, and every one of the 22 is used — hero,
 * four region cards, the closing full-width and a 17-frame carousel in trip
 * order. 1660 px wide, q85, all landscape so nothing needed cropping. No
 * street-of-painted-houses frame survived his cull, so the Granada card
 * carries the stone church façade instead; no descent frame exists in the
 * hub pool (the volcano-boarding story carries the ride), and no mural.
 * Two GoPro clips he kept have no slot on a hub (PhotoCarousel is photos
 * only) and stay in _shortlist-run1. */
import masayaCraterGlowAtNight from "../../../../content/countries/nicaragua/destination/generated/web/masaya-crater-glow-at-night.jpg";
import leonCathedralWhiteRoof from "../../../../content/countries/nicaragua/destination/generated/web/leon-cathedral-white-roof.jpg";
import leonRoofAtSunset from "../../../../content/countries/nicaragua/destination/generated/web/leon-cathedral-roof-at-sunset.jpg";
import leonCathedralAtDusk from "../../../../content/countries/nicaragua/destination/generated/web/leon-cathedral-at-dusk.jpg";
import granadaChurchFacade from "../../../../content/countries/nicaragua/destination/generated/web/granada-church-facade.jpg";
import onTheWallAboveLakeNicaragua from "../../../../content/countries/nicaragua/destination/generated/web/on-the-wall-above-lake-nicaragua.jpg";
import isletWithPalms from "../../../../content/countries/nicaragua/destination/generated/web/islet-with-palms.jpg";
import granadaCathedralFromTheSquare from "../../../../content/countries/nicaragua/destination/generated/web/granada-cathedral-from-the-square.jpg";
import volcanoesAcrossLakeNicaragua from "../../../../content/countries/nicaragua/destination/generated/web/volcanoes-across-lake-nicaragua.jpg";
import busOnTheLakeShore from "../../../../content/countries/nicaragua/destination/generated/web/bus-on-the-lake-shore.jpg";
import cerroNegroFromTheRoad from "../../../../content/countries/nicaragua/destination/generated/web/cerro-negro-from-the-road.jpg";
import climbingCerroNegro from "../../../../content/countries/nicaragua/destination/generated/web/climbing-cerro-negro.jpg";
import boardOnTheBlackSlope from "../../../../content/countries/nicaragua/destination/generated/web/board-on-the-black-slope.jpg";
import jumpingOnCerroNegro from "../../../../content/countries/nicaragua/destination/generated/web/jumping-on-cerro-negro.jpg";
import onTopOfCerroNegro from "../../../../content/countries/nicaragua/destination/generated/web/on-top-of-cerro-negro.jpg";
import managuaSandinoSilhouette from "../../../../content/countries/nicaragua/destination/generated/web/managua-sandino-silhouette.jpg";
import lakefrontMonumentManagua from "../../../../content/countries/nicaragua/destination/generated/web/lakefront-monument-managua.jpg";
import managuaTreesOfLife from "../../../../content/countries/nicaragua/destination/generated/web/managua-trees-of-life.jpg";
import airlinerOnTheManaguaLakefront from "../../../../content/countries/nicaragua/destination/generated/web/airliner-on-the-managua-lakefront.jpg";
import managuaAndTheLakeFromTiscapa from "../../../../content/countries/nicaragua/destination/generated/web/managua-and-the-lake-from-tiscapa.jpg";
import tiscapaLagoon from "../../../../content/countries/nicaragua/destination/generated/web/tiscapa-lagoon.jpg";
import treesOfLifeLitAtNight from "../../../../content/countries/nicaragua/destination/generated/web/trees-of-life-lit-at-night.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION – whether
 * Nicaragua is safe, whether it is worth going, how long, when. Everything
 * operational (tour operators, fares, opening windows, which bed, day
 * sequencing) is deliberately absent.
 *
 * NO GUIDE SKU EXISTS and none is planned. All Nicaragua stories are Brand
 * tier with links_to_guide = none. So no sentence here may say "the guide
 * carries X": mechanics are asserted to exist, unreferenced.
 *
 * THE HONESTY PROBLEM THAT DEFINES THIS PAGE. The founder drove Nicaragua in
 * four days over Christmas 2019 and ranked it first of three countries. Almost
 * everything he liked is still there. What has changed is the STATE, and it
 * has changed a great deal: the US moved to Level 3 Reconsider Travel and
 * names a serious risk of wrongful detention; the constitution was amended in
 * January 2026 to prohibit dual nationality, with some dual nationals stripped
 * of Nicaraguan citizenship; authorities may seize property, and may search
 * phones and social media for anti-government content; public photography is
 * restricted, camera equipment is controlled at the border and drones are
 * illegal. This page must therefore do something none of the other hubs has to
 * do: separate an enthusiastic first-hand account of the PLACE from a sober
 * current account of the STATE, and let the reader weigh them separately.
 * Neither half may be quietly softened to make the other read better.
 *
 * Do NOT let a later edit merge those two registers. The trip section is 2019
 * and says so. The safety section is current at build (2026-09-04) and WILL
 * move – re-check FCDO, US State and Canada before any reprint or SKU, and see
 * the recheck register.
 *
 * MASAYA: the headline sight has physically changed. A landslide inside the
 * Santiago crater in March 2024 buried the open lava lake; visitors since then
 * report incandescence from a vent rather than the exposed churning lake the
 * founder saw. The page names this explicitly and the FAQ answers it. Do not
 * restore any sentence promising a lava lake.
 *
 * §7 SWEEP, 2026-09-04, recorded because the rule cuts both ways and the next
 * editor will not know this happened. The inspire story `2019_nicaragua-safe`
 * was RETIRED before publication (founder decision: let the hub answer "is
 * Nicaragua safe", because a frozen first-person account cannot stay current
 * about an advisory and a hub can). Retiring a story normally strips the page
 * of whatever was page-legal only under its cover. Here NOTHING comes off, and
 * that is a judgement, not an oversight: the first Tested tip and the safety
 * FAQ are decision-level de-risking, which §7 lists as page-legal in its own
 * right ("Safety, legality, advisory"), not borrowed story cover. They contain
 * no booking mechanics, no fares, no sequencing and no named picks, and there
 * is no Nicaragua SKU for them to cannibalise. Do not strip them thinking they
 * lost their licence - and equally, do not treat this as permission to add
 * anything operational.
 *
 * THE ONE FIGURE (§8) is the flight, ~€700 return from western Europe, and it
 * is labelled as what getting there costs. Nothing else on the page carries an
 * amount – the tourist-card fee and the tour prices live in the stories and
 * stay there.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Nicaragua: is it safe in 2026, is it worth going, and how long you need · TestedRoutes",
  description:
    "Whether Nicaragua is safe now, what has actually changed since the country was Central America's best-value trip, how many days you need and what is still there – volcanoes, colonial cities and a lava crater that no longer looks the way it did.",
  alternates: { canonical: "/destinations/nicaragua" },
  openGraph: {
    type: "article",
    url: "/destinations/nicaragua",
    title:
      "Nicaragua: is it safe, is it worth going, and how long you need",
    description:
      "The country I liked most in Central America, and the one whose honest answer has changed most since. What is still true, and what is not.",
  },
};

const WHEN_TO_GO = [
  ["December to April", "The dry season, and the obvious answer. Hot, reliably rainless, and the window when the volcano country and the unpaved roads are at their most predictable. Christmas and New Year are busy in Granada and on the Pacific beaches; the rest of it is quiet by any regional standard."],
  ["December, specifically", "What we did, and the weather was flawless – dry, hot, clear enough to see volcanoes lined up along the horizon from a rooftop in León. The Christmas week has a genuine festive charge to it in the colonial cities, which is a real reason to pick it over January."],
  ["May to November", "The green season. Rain arrives mostly in the afternoon rather than all day, the country turns green, and prices soften from an already low base. The costs are unpaved roads, less reliable views of the things you came to see, and a hurricane season on the Caribbean side that is genuinely disruptive rather than a formality."],
  ["The surf calendar", "Different from everything above. The Pacific breaks work year-round, and the offshore winds that make them famous run strongest through the dry season – so the surf answer and the sightseeing answer point at the same months for once."],
  ["What I would pick", "Late November into early December: dry weather already established, and ahead of the Christmas rush in Granada. You pay for that with a slightly higher chance of a late-season shower. If the trip is mainly about the Pacific beaches, February and March are the stronger months, and you accept a hotter, dustier interior in exchange."],
];

const HOW_LONG = [
  ["Three or four days", "What we had, and it is enough for one thing only: the volcano corridor between Managua, Masaya, León and Granada. That is a genuinely good short trip, because the three best sights in the country are close together and none of them takes a full day. It is not enough to see Nicaragua, and it leaves out both coasts entirely."],
  ["A week", "The version I would recommend. The corridor above, plus either Ometepe – the island of two volcanoes in Lake Nicaragua – or the Pacific surf coast around San Juan del Sur. This is the shortest trip that has a rest in it rather than only a schedule."],
  ["Ten days to two weeks", "Now the north opens up: Estelí, the coffee highlands, the cigar factories and the cloud forest above them. This is the part of Nicaragua that most itineraries skip and the part that has the least tourism in it, which is precisely the point for some people."],
  ["Longer, and the Caribbean side", "The Corn Islands and the Pearl Cays are a different country in language, food and feel, reached by a flight or a long haul overland. They need their own week and their own weather window, and nobody should try to bolt them onto a Pacific-side trip."],
];

const REGIONS = [
  {
    name: "The volcano corridor",
    image: masayaCraterGlowAtNight,
    alt: "Orange volcanic glow rising from the dark Santiago crater at Masaya volcano at night, Nicaragua",
    body: "A line of volcanoes runs down the Pacific side of the country and the road runs with it, which is why Nicaragua delivers so much in so little distance. Masaya is the famous one because you can drive to the rim of an active crater and look down into it after dark; Cerro Negro, near León, is a young black cinder cone that people ride down on wooden boards. Between them is more accessible live volcano than most countries manage in total.",
  },
  {
    name: "León",
    image: leonCathedralWhiteRoof,
    alt: "A white dome and turret on the rooftop of León cathedral, the largest in Central America, against the low sun, Nicaragua",
    body: "A hot, loud, lived-in university city that most itineraries treat as a stopover, and the base for the volcano-boarding trips. The reason to stop is the cathedral, the largest in Central America, which lets you climb out onto its roof – a rolling white landscape of domes and bell towers you walk barefoot, with volcanoes on the horizon. The streets below carry the country's revolutionary history in murals that read as record rather than decoration.",
  },
  {
    name: "Granada and Lake Nicaragua",
    image: granadaChurchFacade,
    alt: "The weathered stone façade and twin bell towers of a colonial church in Granada, Nicaragua",
    body: "The colonial showpiece and the easiest place in the country to like: a grid of low painted houses and churches on the shore of Central America's largest lake, with music and food filling the streets after dark. Offshore lie Las Isletas, 365 tiny islands scattered across the water when Mombacho volcano blew much of its cone into the lake. It is the gentle, green, horizontal version of volcanic Nicaragua, and it pairs well with the smoke and heat of the corridor.",
  },
  {
    name: "Managua",
    image: managuaSandinoSilhouette,
    alt: "The black silhouette of Sandino standing above Managua on the hill of Tiscapa, Nicaragua",
    body: "The capital was the one part of the country I did not warm to, and most itineraries treat it as an airport with a city attached. It is worth an hour rather than a day, and the hour is best spent on the hill at Tiscapa, where a giant black cutout of Sandino stands over the whole city on the site of a dictator's palace. Down at the lakefront, the government's steel Trees of Life stand in rows, lit at night. Both tell you more about how the country is governed than any museum would.",
  },
];

/* Trip photos, the founder's cull, in the order the trip ran: Granada and
 * the lake, León, Cerro Negro, Managua. Captions name a place only where the
 * frame or the trip record settles it (destination playbook §11). */
const CAROUSEL = [
  { image: onTheWallAboveLakeNicaragua, alt: "Sitting on a brick wall above the trees and water of Lake Nicaragua at Granada", caption: "Granada, the lake behind" },
  { image: isletWithPalms, alt: "A small islet crowded with palms in the grey water of Lake Nicaragua, seen from a boat", caption: "One of the 365" },
  { image: granadaCathedralFromTheSquare, alt: "The yellow cathedral of Granada with red domes behind the trees of the square", caption: "Granada's cathedral, from the square" },
  { image: volcanoesAcrossLakeNicaragua, alt: "Waves on Lake Nicaragua with two volcanic cones on the far shore", caption: "Volcanoes across the lake" },
  { image: busOnTheLakeShore, alt: "A bus parked on the grassy shore of Lake Nicaragua under heavy cloud, volcanoes beyond", caption: "The lake shore, and the bus" },
  { image: leonCathedralAtDusk, alt: "León cathedral lit at dusk with people sitting in the square in front of it", caption: "León's cathedral, after the roof" },
  { image: cerroNegroFromTheRoad, alt: "A dirt road through scrub towards the black cone of Cerro Negro, Nicaragua", caption: "Cerro Negro, from the approach" },
  { image: climbingCerroNegro, alt: "Walkers with boards climbing the loose black slope of Cerro Negro", caption: "Up the black slope" },
  { image: boardOnTheBlackSlope, alt: "A man carrying a yellow wooden board on the black ash of Cerro Negro, the plain below", caption: "Board in hand" },
  { image: jumpingOnCerroNegro, alt: "A man jumping with arms and legs spread on the summit of Cerro Negro against a blue sky", caption: "Before the descent" },
  { image: onTopOfCerroNegro, alt: "A man standing on a rock with arms raised on the summit of Cerro Negro, the plain far below", caption: "On top" },
  { image: lakefrontMonumentManagua, alt: "An equestrian monument on the Managua lakefront flying three flags under a cloudy sky", caption: "The Managua lakefront" },
  { image: managuaTreesOfLife, alt: "Rows of coloured steel Trees of Life sculptures on the lakefront in Managua", caption: "The Trees of Life, Managua" },
  { image: airlinerOnTheManaguaLakefront, alt: "A parked airliner on display among palm shelters on the Managua lakefront", caption: "A parked airliner, on the lakefront" },
  { image: managuaAndTheLakeFromTiscapa, alt: "Managua's low green skyline and Lake Managua with volcanoes on the far shore, from the hill at Tiscapa", caption: "Managua from Tiscapa, the lake beyond" },
  { image: tiscapaLagoon, alt: "The round crater lagoon of Tiscapa ringed by trees, with Managua beyond", caption: "The Tiscapa lagoon" },
  { image: treesOfLifeLitAtNight, alt: "Coloured Trees of Life lit at night beside a Managua road, seen from a car", caption: "The Trees, lit" },
];

// Deliberately no tier totals (destination playbook §8). The ONE figure on
// this page is the flight, labelled as what getting there costs.
const COSTS = [
  ["Lean", "Chicken buses, which are decommissioned US school buses and cost a dollar or two for hours of travel; hostels and family guesthouses; and eating where people eat. Nicaragua at this level is one of the cheapest countries in the Americas and does not feel like a hardship, because there is very little premium version to miss"],
  ["Core", "A hire car, which is what turns the volcano corridor from a series of bus rides into a trip; comfortable colonial hotels in Granada or León, which are handsome and still inexpensive; and saying yes to the guided activities without thinking about it, because they cost a fraction of what the same thing costs one border south"],
  ["Splurge", "There is a ceiling and it is low by international standards. What money buys here is a boutique colonial hotel, a private guide, a lodge on Ometepe or a beach house on the Pacific – comfort and setting rather than luxury, at prices that would be mid-range almost anywhere else"],
];

const TIPS = [
  ["Free movement by day, indoors after dark – that was the rule that worked.", "On the ground the country felt calm and welcoming, and moving around the cities and the countryside during daylight was never a problem. At night we simply did not wander, and that combination is the practical rule I would still give anyone. The specific cautions were narrow rather than general: Managua is where to be most careful, taxis at night are the recognised weak point, and land border crossings attract men who grab your bag and then press you for a tip. Petty opportunism, not violence, is what you are actually managing."],
  ["Assume your camera is a customs question, not a given.", "This one is newer than our trip and it matters more than any of the above, because it can end a photography trip before it starts. Public photography is restricted – police, military, installations and government buildings are explicitly off limits – and the import of professional cameras, lenses and audio gear is controlled, with equipment held at the border without prior approval. Drones are illegal outright. If your trip is built around pictures, resolve this before you fly rather than at the airport."],
  ["The lava lake is not what it was, and nobody updates the photographs.", "The image that sells Masaya – a wide, churning, exposed lake of molten rock – is the one we saw and is not what is currently there. A landslide inside the Santiago crater in March 2024 buried the open lake, and since then visitors have reported a red glow from a vent rather than the lake itself. It is still an active crater you can drive to the lip of and look into after dark, which is remarkable enough. Go for that, and treat every photograph you have seen as historical."],
];

const FAQ = [
  ["Is Nicaragua safe to travel in 2026?", "It depends entirely on which risk you mean, and the honest answer has two halves that point in different directions. As a place to move around, Nicaragua has long been one of the safer countries in Central America for ordinary crime, and the main tourist areas – Granada, León, the Pacific beaches, Estelí – have a consistent record. My own experience, driving it over Christmas 2019, was that daytime movement was completely comfortable and the sensible rule was simply not to wander at night. What has changed since, and changed sharply, is the state rather than the street. The United States rates Nicaragua Level 3, Reconsider Travel, and specifically warns its nationals of a serious risk of wrongful detention; Canada advises a high degree of caution. Authorities may search phones and social media for anti-government content, may seize property, and restrict photography in public. So: low ordinary risk, materially elevated political and legal risk. Check your own government's current advice as part of booking rather than as a formality – this is a situation that moves."],
  ["Why do governments warn about travel to Nicaragua?", "Politics, not crime. Since the 2018 unrest the government has steadily closed civic space: independent media outlets have been shut and journalists driven into exile, and in January 2026 the constitution was amended to prohibit dual nationality, with some dual nationals having their Nicaraguan citizenship revoked. Advisories now flag arbitrary enforcement of local laws, the risk of wrongful detention – particularly for US nationals – and property seizure without legal process. None of that is a description of danger on the street, which is what the word \"safe\" usually means to a traveller. It is a description of a legal environment with very little recourse in it, and the two need weighing separately."],
  ["Can you take photographs in Nicaragua?", "Not freely, and this is the practical restriction most likely to affect a visitor. Photographing police, military personnel, military installations and government buildings is prohibited, and public photography more generally is restricted enough that penalties are possible. Beyond that, the import of professional photographic and video equipment – cameras, lenses, lighting, audio – is controlled, and gear can be held at customs without prior authorisation. Drones are illegal. A phone taking holiday pictures of a volcano is not the issue; a camera bag that looks professional, or a lens pointed at anything official, is."],
  ["Is Nicaragua worth visiting?", "On what is actually there, yes, and it was my favourite of the three Central American countries I crossed on one trip. It is dramatically cheaper than Costa Rica, more alive, and has not been sanded smooth for visitors: colonial cities with music in the streets, an unbroken line of volcanoes down the Pacific side, an active crater you can drive to the lip of, a young cinder cone people ride down on planks, and 365 islands scattered across a lake by an eruption. Very little of that has changed. Whether it is worth it for you is now partly a political question rather than only a travel one, and that is a judgement to make with the current advisories open rather than on the strength of anyone's photographs, mine included."],
  ["How many days do you need in Nicaragua?", "A week is the right answer; four days is the workable minimum. The country's great advantage is compactness – Managua, Masaya, León and Granada sit close together along one volcanic corridor, and the three best things in the country are all inside it, so a short trip is genuinely productive rather than a rush. A week adds either Ometepe, the island of two volcanoes in Lake Nicaragua, or the Pacific surf coast. Ten days or more gets you into the northern highlands, which almost nobody visits. The Caribbean side and the Corn Islands are effectively a separate trip."],
  ["Can you still see lava at Masaya volcano?", "You can still see volcanic glow, but not the lava lake the photographs show. Masaya is one of very few places on earth where you drive to the rim of an active crater, park facing downhill in case of evacuation, and look straight down into it – and until recently what you looked down at was an exposed, churning lake of molten rock. A landslide inside the Santiago crater in March 2024 buried it, and reports since describe incandescence from a vent instead: a real red glow, visible after dark, but not the open lake. Go at night, expect a short visit because the crater gasses constantly, and set your expectations from that rather than from any image you have seen."],
  ["Is volcano boarding on Cerro Negro still running?", "Yes. Cerro Negro, near León, is one of the youngest volcanoes in the world and still active, though it has not erupted since 1999. The trip is a walk of roughly forty minutes up a shadeless black slope carrying a wooden board, then a ride back down the cinder in a boiler suit and goggles. It is the single most distinctive thing to do in Nicaragua and remains the main reason travellers stop in León. It is faster than it looks from the top – the people ahead of you crawling down are not evidence that you cannot pick up speed."],
  ["When is the best time to visit Nicaragua?", "December to April, the dry season. That is when the roads are predictable, the volcano views are clear and the Pacific beaches are at their best, and it is when we went – hot, dry and clear enough to see a line of cones on the horizon from a rooftop in León. May to November is the green season: rain concentrated in the afternoons rather than all day, cheaper still, and greener, at the cost of unpaved roads and a genuinely disruptive hurricane season on the Caribbean coast."],
  ["Do you need a visa for Nicaragua?", "Most European, UK and North American passports do not need a visa for stays of up to 90 days, but everyone buys a tourist card on arrival, and passports generally need six months' validity. The important caveat is that entry rules here changed in 2026 and now require prior authorisation from immigration in Managua for a widened list of nationalities, so the rules are less stable than the visa-free headline suggests. Confirm your own nationality's position against an official source close to your travel date, and do not rely on a forum post or on this page."],
  ["Is Nicaragua cheap?", "Yes, strikingly so, and it is the clearest contrast with Costa Rica next door. Getting there is the unavoidable line – return flights from western Europe run about €700 booked ahead, with no direct routes, so everything connects through Madrid, Panama City or the United States. That is what reaching the country costs, not what the trip costs. On the ground, beds, food, transport and guided activities all run at a fraction of Costa Rican prices for something comparable, and there is very little premium tier to be tempted by."],
  ["Nicaragua or Costa Rica – which one?", "As travel: Nicaragua, if you want character and value and do not mind rough edges; Costa Rica, if you want easy, comfortable and well organised and are willing to pay roughly double for it. Doing them back to back, crossing overland from one into the other, Nicaragua was the more memorable by some distance. As a decision today that is no longer the whole comparison, because Costa Rica carries a mild advisory and Nicaragua carries a serious one for reasons that have nothing to do with how the country feels to walk around. If the political situation is a dealbreaker for you, the answer is Costa Rica, and that is a legitimate way to decide it."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Nicaragua guide SKU exists and none is planned. The fetch takes all
// guides so any future SKU appears as its own card with no code change; until
// then the guide sections and the BuyBox do not render.
const GUIDE_BLURBS = {};

async function fetchNicaraguaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "nicaragua" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "nicaragua" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function NicaraguaDestinationPage() {
  const { guides, stories } = await fetchNicaraguaContent();
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
          "Nicaragua: is it safe, is it worth going, and how long you need",
        description:
          "Whether Nicaragua is safe now, what has changed since it was Central America's best-value trip, how many days you need and what is still there.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Nicaragua" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/nicaragua",
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
        <span className="text-slate-600">Nicaragua</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Americas · Central America
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Nicaragua
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it safe, is it worth going, and how long you need – for the country
          I liked most in Central America and the one whose honest answer has
          changed most since.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={masayaCraterGlowAtNight}
              alt="Orange volcanic glow rising out of the dark Santiago crater at Masaya volcano at night, Nicaragua"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Nicaragua worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                I need to split this answer in two, because the two halves have
                moved in opposite directions and running them together would
                mislead you either way. The first half is what the country is
                like, and on that I am unambiguous: of the three Central
                American countries I crossed on one trip, Nicaragua was my
                favourite by a distance. It was genuine, rustic, laid back and
                dirt cheap, with colonial architecture in the cities and
                volcanoes wherever you looked. The second half is what the state
                has become since, and that has hardened considerably. Both
                things are true and neither cancels the other.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Take the country first. Nicaragua's unfair advantage is that
                everything worth seeing sits close together along one volcanic
                corridor on the Pacific side, so a short trip is genuinely
                productive rather than a scramble. In four days we stood at the
                rim of an active crater after dark and looked down at glowing
                lava; rode wooden boards down the black ash cone of Cerro Negro,
                one of the youngest volcanoes on earth; walked barefoot across
                the brilliant white roof of the largest cathedral in Central
                America as the sun went down over a line of volcanoes; and took
                a boat out through 365 islands that a volcano threw into a lake.
                Not one of those is a full day. That density is the thing to
                understand about Nicaragua.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                It is also, still, extraordinarily good value. Coming from Costa
                Rica, where I twice paid premium prices for something entirely
                ordinary, the contrast was almost comic: the same class of
                activity for a fraction of the money, and a country that has not
                been packaged and ticketed to within an inch of its life. The
                lowlight was Managua, which is a capital to move through rather
                than stay in. Everything else exceeded what I expected.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Now the honest caveat, and it is a large one. My trip was over
                Christmas 2019, and since then Nicaragua's government has closed
                down most of the country's civic space. Independent media have
                been shut and journalists exiled; the constitution was changed in
                January 2026 to prohibit dual nationality, and some dual
                nationals have had their Nicaraguan citizenship revoked; the
                United States now rates the country Level 3 and warns its
                nationals of a serious risk of wrongful detention. Photography in
                public is restricted and camera equipment is controlled at the
                border. None of that describes danger in the street, which is
                what people usually mean when they ask whether a country is safe,
                and it does not make the volcanoes less good. It does mean the
                decision to come is now partly a political one, and that anyone
                telling you it is simply fine – or simply off limits – is
                skipping the part where you weigh it yourself.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The dry season is the answer and there is not much argument
                inside it. The only real trade is between the reliability of the
                weather and how much company you want in Granada.
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
                Nicaragua rewards a short trip better than almost anywhere else
                in the region, because its best sights are stacked along one
                corridor and none of them eats a day. The question is really
                what you add after that corridor is done.
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
                Four more regions get no card here for the reason this site
                gives cards at all: we did not reach them, so there are no
                photographs and nothing first-hand to say. Ometepe is the island
                of two volcanoes in Lake Nicaragua, one active and one with a
                crater lake at its summit, reached by ferry – we saw its cones
                across the water from the shore and got no closer. The Pacific
                surf coast around San Juan del Sur has breaks that work all year
                and a reputation among surfers that long predates the country's
                tourism. The northern highlands around Estelí are coffee and
                cigar country, cooler and greener than the volcanic corridor and
                almost empty of visitors. And the Caribbean side – Bluefields,
                the Corn Islands, the Pearl
                Cays – is a different country in language, food and feel, and
                needs its own week rather than a detour.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                There are no direct flights from Europe. Managua is reached with
                one stop – Madrid is the shortest connection, and Panama City
                and the US hubs carry most of the rest of the traffic – which is
                part of why Nicaragua costs more to reach than its neighbours
                and less to be in. Overland it is straightforward and cheap: the
                country sits between Honduras to the north and Costa Rica to the
                south, and international buses run the Pan-American through it
                all day. We flew in from Panama and left by bus into Costa Rica,
                which is a common and easy way to combine the three. Most
                European, UK and North American passports enter visa-free for 90
                days with a tourist card bought on arrival, but entry rules were
                tightened in 2026 and now require prior authorisation for a
                widened list of nationalities – verify your own case rather than
                assuming.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground the roads along the Pacific corridor are decent
                and the distances are genuinely short, which is what makes a
                four-day trip viable. A hire car turns the corridor into a
                proper road trip; without one, the bus network is thorough,
                extremely cheap and the way the country actually moves, with
                repainted US school buses on the local routes and air-conditioned
                express services between the cities. In Managua specifically,
                taxis at night are the recognised weak point, and having
                somewhere you trust arrange the car is the standard precaution
                rather than an over-cautious one.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                One piece of admin is worth resolving before you fly rather than
                on arrival: camera equipment. Professional photographic and
                video gear is controlled at the border and can be held without
                prior authorisation, drones are illegal, and photographing
                police, military or government buildings is prohibited. For a
                phone and a compact camera this is a non-issue. For anything
                that looks like a working kit, it is the first thing to sort out.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the unavoidable line: return flights from
                western Europe run about €700 booked ahead, and because there is
                no direct route that figure is stubborn – it is the one part of
                a Nicaragua trip that is not cheap. That is what reaching the
                country costs, not what the trip costs. Once you land, this is
                one of the least expensive countries in the Americas, and the
                gap between the styles below is narrower than almost anywhere:
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
                The line with real range is transport: hiring a car is the
                single biggest discretionary cost in a Nicaragua trip and can
                easily exceed everything else combined, while the bus network
                does the same journeys for pocket change. Everything else – beds,
                food, the guided activities that are the whole reason to come –
                is cheap enough that being frugal about it saves little and costs
                you the trip.
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
                src={leonRoofAtSunset}
                alt="The white domed roof of León cathedral and the city beyond it at sunset, Nicaragua"
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
                <SectionHeading>Stories from Nicaragua</SectionHeading>
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
                Nicaragua was the middle stop of three countries crossed
                overland in the same three weeks, and the comparison is most of
                the point:{" "}
                <Link
                  href="/destinations/costa-rica"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Costa Rica
                </Link>{" "}
                straight over the southern border, polished and roughly twice
                the price, and{" "}
                <Link
                  href="/destinations/panama"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Panama
                </Link>{" "}
                beyond it, which came last of the three and still has one
                genuinely excellent trip inside it.
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

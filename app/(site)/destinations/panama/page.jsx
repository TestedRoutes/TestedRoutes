import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

/* IMAGES - cut at 1660 px wide from the founder's cull (destination playbook
 * SS11, media playbook Phase 4), AFTER it rather than before. He kept 15 of the
 * 40 candidates placed, added 7 of his own from the full archive, and named two
 * of them by slot: hero.jpg and last.JPG. Both are honoured - the island and its
 * water opens the page, and the diver alone in empty water closes it, sitting
 * directly under the Coiba tip it illustrates. Filenames describe what the
 * photograph shows, never the intake number. */
import islandAndClearWater from "../../../../content/countries/panama/destination/generated/web/island-and-clear-water-bocas.jpg";
import diverInEmptyWater from "../../../../content/countries/panama/destination/generated/web/diver-in-empty-water-coiba.jpg";
import overWaterCabins from "../../../../content/countries/panama/destination/generated/web/over-water-cabins-punta-caracol.jpg";
import cascoViejoPlaza from "../../../../content/countries/panama/destination/generated/web/casco-viejo-plaza-under-the-trees.jpg";
import mirafloresLockWithTanker from "../../../../content/countries/panama/destination/generated/web/miraflores-lock-with-tanker.jpg";
import pacificBeachBoatsAtSunset from "../../../../content/countries/panama/destination/generated/web/pacific-beach-boats-at-sunset.jpg";
import skylineAtSunrise from "../../../../content/countries/panama/destination/generated/web/panama-city-skyline-at-sunrise.jpg";
import skylineFromAnconHill from "../../../../content/countries/panama/destination/generated/web/skyline-from-ancon-hill.jpg";
import einsteinHead from "../../../../content/countries/panama/destination/generated/web/einstein-head-panama-city.jpg";
import rooflessChurchRuin from "../../../../content/countries/panama/destination/generated/web/casco-viejo-roofless-church-ruin.jpg";
import equestrianStatue from "../../../../content/countries/panama/destination/generated/web/equestrian-statue-casco-viejo.jpg";
import amadorBenchAndSkyline from "../../../../content/countries/panama/destination/generated/web/amador-causeway-bench-and-skyline.jpg";
import founderWithSkyline from "../../../../content/countries/panama/destination/generated/web/founder-with-the-skyline-behind.jpg";
import mirafloresControlHouse from "../../../../content/countries/panama/destination/generated/web/miraflores-lock-control-house.jpg";
import forestedHillsOnTheDrive from "../../../../content/countries/panama/destination/generated/web/forested-hills-on-the-drive.jpg";
import santaCatalinaSeawall from "../../../../content/countries/panama/destination/generated/web/santa-catalina-painted-seawall.jpg";
import infinityPoolAtSunset from "../../../../content/countries/panama/destination/generated/web/infinity-pool-at-sunset-santa-catalina.jpg";
import bocasTownFromTheDock from "../../../../content/countries/panama/destination/generated/web/bocas-town-from-the-dock.jpg";
import stiltHousesOverWater from "../../../../content/countries/panama/destination/generated/web/stilt-houses-over-the-water-bocas.jpg";
import puntaCaracolHammockDeck from "../../../../content/countries/panama/destination/generated/web/punta-caracol-hammock-deck.jpg";
import zapatillaBeachAndPalms from "../../../../content/countries/panama/destination/generated/web/zapatilla-beach-and-palms.jpg";
import emptyBeachAndIslet from "../../../../content/countries/panama/destination/generated/web/empty-beach-and-islet-coiba.jpg";
/*
 * Scope note (destination playbook §7): this page sells the DECISION – whether
 * Panama is worth going to at all, which parts, how long, when. Everything
 * operational (fares, opening windows, booking mechanics, which boat, which
 * bed, day sequencing) is deliberately absent.
 *
 * NO GUIDE SKU EXISTS and none is planned. All Panama stories are Brand tier
 * with links_to_guide = none. So no sentence here may say "the guide carries
 * X": mechanics are asserted to exist, unreferenced.
 *
 * BRAND-SAFETY LINE, inherited from the shared source file and load-bearing.
 * The founder ranked Panama LAST of every country he has visited, and his
 * original trip review carried framing about the country and its people that
 * is unpublishable and off-brand. That framing is excluded from this page by
 * design and must not be reintroduced by anyone summarising "his honest take".
 * The house rule is ALTERNATIVES, NOT WARNINGS: the honest verdict here is
 * "do it narrow" – one focused day in the capital, the heart of the trip in
 * Bocas, skip the rest without guilt – and that is a recommendation, not a
 * complaint. Keep the negative judgements attached to specific things he
 * actually did (Coiba, the mainland drives) and never to the country or its
 * people in general.
 *
 * SAN BLAS IS NOT TESTED. Guna Yala was not visited on this trip; it is the
 * part the founder would add next time. Every sentence about it is written as
 * research and framed as untested, the same treatment Guinea-Bissau's hub
 * gives the Bijagós. There are no founder photographs of it, so under §11 it
 * gets no region card either. Do not let a later edit upgrade it to
 * first-hand.
 *
 * THE ONE FIGURE (§8) is the flight, ~€600 return from western Europe, and it
 * is labelled as what getting there costs. Nothing else here carries an
 * amount. Panama uses the US dollar, so USD is the correct on-the-ground
 * currency to NAME – but naming a currency is page-legal and quoting a price
 * in it is not.
 *
 * TRIP RECENCY: the source trip is Dec 2019 – Jan 2020. The canal's second set
 * of locks at Agua Clara opened in 2016 and is now a real "which one" question
 * for visitors; the founder saw Miraflores only, and the page says so.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Panama: is it worth visiting, how long you need, and what to skip · TestedRoutes",
  description:
    "Whether Panama is worth visiting, and the honest answer that it is – narrowly. One day in the capital for the canal and the old town, the heart of the trip in Bocas del Toro, and the parts that did not earn their place.",
  alternates: { canonical: "/destinations/panama" },
  openGraph: {
    type: "article",
    url: "/destinations/panama",
    title: "Panama: is it worth visiting, how long you need, and what to skip",
    description:
      "The country that came last on a three-week Central American trip, and still has one genuinely excellent week inside it. Go narrow.",
  },
};

const WHEN_TO_GO = [
  ["Mid-December to April", "The dry season on the Pacific side, and the straightforward answer for the capital, the canal and the Pacific coast. Hot, sunny and reliable, with the Christmas and New Year fortnight the busiest and priciest of the year. This is when we went, and the weather on the Pacific side was never a factor."],
  ["The Caribbean does not follow that", "Bocas del Toro sits on the other side of the mountains and keeps its own calendar – it can rain there in the middle of the Pacific dry season, and its more settled spells tend to fall around September and October and again in February and March. Nowhere in Panama is reliably dry for a whole week, and the archipelago least of all."],
  ["May to November", "The green season on the Pacific: rain concentrated into the afternoon rather than spread through the day, a greener country and lower rates. Perfectly workable for the capital and the canal, less so for a trip built around beaches and boats."],
  ["Wind, if you are going for it", "Kitesurfing on the Pacific runs on the dry-season trade winds, roughly December through April, which is the same window as the good weather. Diving conditions and the humidity are the other seasonal variables, and both are gentler outside the high summer."],
  ["What I would pick", "January or February. The Pacific side is at its most dependable, the Christmas rush is over, and the Caribbean has as good a chance as it ever offers. You pay for that by accepting that a wet day or two in Bocas is part of the deal in any month – build a spare day into the island leg rather than trying to out-plan the weather."],
];

const HOW_LONG = [
  ["Two or three days", "The capital and the canal, and honestly that is a decent short trip if Panama is a stopover rather than a destination. One focused day covers both of the things in Panama City worth your time. The problem is that this version misses the part of the country that actually justifies the flight."],
  ["A week", "The right length, spent narrowly. One day in the capital, then straight to Bocas del Toro for the rest of it. That sounds unbalanced and it is deliberate: the archipelago is where Panama is genuinely good, it runs at a pace that punishes a short visit, and one night there is a waste. Give it three or four unhurried days."],
  ["Ten days to two weeks", "Room to add a second island group – San Blas is the one I would choose, though I have not been – or the Boquete highlands for coffee and cloud forest, which is the mainland's best case for itself. This is also the length at which a slower overland approach from Costa Rica starts to make sense."],
  ["Longer, touring the mainland", "The version I would not repeat. Panama's mainland is a single spine road with long, hot drives strung along it, and the more of it you see the more the trip dilutes. If you have three weeks in this region, my honest advice is to spend the extra time in a neighbouring country rather than deeper in this one."],
];

const REGIONS = [
  {
    name: "Bocas del Toro",
    image: overWaterCabins,
    alt: "Green cabins on stilts over clear water, joined by a yellow walkway, at Punta Caracol in Bocas del Toro, Panama",
    body: "The reason to come, and the part of the country that looks nothing like the rest of it. A Caribbean archipelago of low jungle-green islands, painted wooden towns built out over the water, and sea running from pale aqua to deep blue. Boats do the work cars do elsewhere. Days are spent island-hopping between sandbars, snorkelling stops and beaches, and the whole place operates at a deliberately horizontal pace that only rewards you if you match it.",
  },
  {
    name: "Panama City and Casco Viejo",
    image: cascoViejoPlaza,
    alt: "A shaded plaza in Casco Viejo, Panama City, with market stalls under the trees and white colonial buildings behind",
    body: "A capital of two halves that face each other across a bay. Casco Viejo is the old colonial quarter – narrow streets, painted facades, half-ruined churches, boutique hotels in restored houses – a district that went from gang-controlled no-go zone to UNESCO-protected showpiece inside a generation, and now feels a touch too finished. Behind it stands a wall of glass towers that would not look out of place in an American city. Few capitals lay out their contradictions so plainly.",
  },
  {
    name: "The canal",
    image: mirafloresLockWithTanker,
    alt: "A tanker sitting in the Miraflores lock chamber on the Panama Canal, green banks and rails around it",
    body: "The country's headline sight, and worth knowing what it is before you build a day around it. Unless you book a full transit, seeing the canal means standing on a viewing platform while a ship rises between gates – a working waterway rather than a viewpoint, impressive as an idea more than as a view. There are now two places to do it: the original locks near the capital, and the larger post-2016 locks on the Atlantic side, where the ships are far bigger. We saw the first only.",
  },
  {
    name: "The Pacific coast",
    image: pacificBeachBoatsAtSunset,
    alt: "Fishing boats pulled up on a grey-sand Pacific beach at sunset in Panama",
    body: "Surf towns, empty grey-sand beaches, kitesurfing where the dry-season wind funnels down the coast, and the boats out to Coiba – a former prison island turned national park with a formidable reputation among divers. It is a long, hot drive from anywhere. This is the stretch of Panama that most rewards knowing exactly what you want from it, and most punishes going on spec, which is what we did.",
  },
];

/* Trip photos, the founder's cull: the capital first, then the Pacific, then
   the islands the trip is really about. */
const CAROUSEL = [
  { image: skylineAtSunrise, alt: "Panama City glass towers catching the sun at sunrise, seen from a rooftop", caption: "The capital, first thing" },
  { image: skylineFromAnconHill, alt: "The Panama City skyline seen across jungle from the green slope of Ancon Hill", caption: "The same skyline, from the hill" },
  { image: einsteinHead, alt: "A large stone Einstein head on a grass roundabout in Panama City", caption: "Einstein, on a roundabout" },
  { image: rooflessChurchRuin, alt: "The roofless brick shell of a colonial church in Casco Viejo", caption: "Not everything got rebuilt" },
  { image: equestrianStatue, alt: "An equestrian statue in a Casco Viejo plaza with a white colonial building behind it", caption: "Casco Viejo, at midday" },
  { image: amadorBenchAndSkyline, alt: "A red bench on the Amador Causeway facing the bay and the distant skyline", caption: "The causeway bench" },
  { image: founderWithSkyline, alt: "The founder on the Amador Causeway with the Panama City skyline across the water", caption: "Across the bay" },
  { image: mirafloresControlHouse, alt: "The white control house at the Miraflores locks on the Panama Canal", caption: "The lock house" },
  { image: forestedHillsOnTheDrive, alt: "Forested hills and a green valley under cloud on the drive across Panama", caption: "The mainland, at speed" },
  { image: santaCatalinaSeawall, alt: "A painted seawall backed by palms at Santa Catalina on the Pacific coast", caption: "Santa Catalina" },
  { image: infinityPoolAtSunset, alt: "An infinity pool at sunset looking out over islands on Panama Pacific coast", caption: "The Pacific, at the end of a day" },
  { image: bocasTownFromTheDock, alt: "A wooden dock and boats with the stilt town of Bocas del Toro behind", caption: "Bocas town, from the dock" },
  { image: stiltHousesOverWater, alt: "Wooden houses built out over the water in Bocas del Toro", caption: "Built out over the water" },
  { image: puntaCaracolHammockDeck, alt: "A hammock and lounger on a thatched deck over the sea at Punta Caracol", caption: "The pace, roughly" },
  { image: zapatillaBeachAndPalms, alt: "Palms and turquoise water at a beach in the Zapatilla cays, Bocas del Toro", caption: "Zapatillas" },
  { image: emptyBeachAndIslet, alt: "An empty white-sand beach with a small forested islet offshore at Coiba", caption: "Coiba, above the waterline" },
];

// Deliberately no tier totals (destination playbook §8). The ONE figure on
// this page is the flight, labelled as what getting there costs.
const COSTS = [
  ["Lean", "Hostels and guesthouses, the buses that run the Pan-American, shared boat tours in Bocas where the prices are fixed and low, and eating away from the restored streets of the old town. Panama at this level is inexpensive without being austere – the archipelago in particular is one of the better-value places in the Caribbean"],
  ["Core", "A hire car for the mainland, which is the only way to make the Pacific side work; a decent hotel in Casco Viejo, where the restored colonial buildings are the whole point; and the boat days in Bocas taken without counting them. This is the version most people should budget for"],
  ["Splurge", "There is a real high end here and it is mostly on the water: over-water cabins on stilts reached only by boat, private launches instead of shared ones, and the fly-in island packages out to Guna Yala. What money buys in Panama is water access and privacy, not luxury in the conventional sense"],
];

const TIPS = [
  ["Go narrow, and do not feel bad about it.", "The mistake with Panama is treating it as a country to tour rather than one to cherry-pick. There is a genuinely good trip in here and it is a narrow one: a single focused day in the capital for the canal and the old town, then the heart of the trip out in Bocas del Toro. The long mainland loop and the day out to Coiba took time I would rather have spent in the islands. Cut hard, commit to the archipelago, and Panama is a good week. Try to see all of it and you will end up rating it the way I did."],
  ["Set your expectations on the canal before you go, not while standing there.", "It is the first thing anyone mentions about Panama and it is worth seeing once, but know what seeing it involves: unless you book a full transit, you are on a viewing platform watching a ship rise between gates while a commentary explains the engineering. It is a working waterway, not a viewpoint. What stayed with me was not the ships but the history behind them – the canal opened in 1914 after more than thirty years of work and a death toll in the tens of thousands, a great many of them from mosquitoes rather than accidents. Go for that, and give it a couple of hours rather than a day."],
  ["A famous dive site is a forecast, not a promise.", "Coiba is sold as one of the Pacific's great dive destinations, and I made the long trip out there and had one of the most disappointing days in the water of my life. The visibility was fine. There was simply nothing to look at – almost no marine life the entire day. Plenty of divers rave about the place and I do not doubt them; what is in the water swings hard with the season, the day and plain luck. If you go, ask hard about recent sightings before you pay, and have something else planned for the day. Do not build a leg of the trip around it."],
];

const FAQ = [
  ["Is Panama worth visiting?", "Yes, but only if you are ruthless about where you spend your days – and I say that as someone who ranked it last of the countries on a three-week Central American trip. A lot of Panama underwhelmed me: the long, hot drives down the mainland spine, the Pacific coast, the famous dive trip out to Coiba. What is genuinely worth the journey is Bocas del Toro, the Caribbean archipelago, plus one focused day in the capital for the canal and the colonial old town. Do it that way and it is a good week. Try to tour the whole country and you may come away as flat as I did. The verdict is go narrow, not do not go."],
  ["Is the Panama Canal worth visiting?", "Once, and give it a couple of hours rather than a day. Unless you book a full transit – which takes four to eight hours and is a different proposition entirely – seeing the canal means standing on a viewing platform watching a container ship rise between the lock gates while a commentary explains the engineering. It is a working waterway rather than a beautiful sight, and the appeal is more intellectual than visual. What lands hardest is the history: it opened in 1914 after more than three decades of work and tens of thousands of deaths, many of them from disease rather than accidents. If you love engineering, it will land. If you are hoping to be moved by a view, it may not."],
  ["Miraflores or Agua Clara – which side of the canal should you visit?", "Miraflores, near Panama City, is the original set of locks and the easy choice: close to the capital, with a large visitor centre and museum, and it is what most people mean by visiting the canal. Agua Clara, on the Atlantic side near Colón, serves the expanded locks that opened in 2016 and takes the much larger Neopanamax ships, so the vessels are considerably more impressive and the crowds thinner – at the cost of a long trip across the isthmus. We saw Miraflores only. If the scale of the ships is the thing you actually care about, the newer locks are the better answer."],
  ["How many days do you need in Panama?", "A week, spent narrowly: one day in Panama City for the canal and Casco Viejo, then three or four unhurried days in Bocas del Toro. That split looks lopsided and it is intentional – the capital genuinely does not need a second day, and the archipelago punishes a short visit because the whole appeal is the pace. Two or three days works if Panama is a stopover and the canal is the point. Ten days lets you add San Blas or the Boquete highlands."],
  ["Is Bocas del Toro worth it?", "It is the best thing in the country and the part I would build the trip around. A Caribbean archipelago of low green islands and clear water, reached the slow way – over the mountains from the Pacific side, then a boat across from the mainland – which is part of why arriving feels like a reward. Days are spent island-hopping by boat between sandbars, beaches and snorkelling stops; tours are cheap and prices fixed. Two honest caveats: the humidity after dark is genuinely unpleasant and nobody warns you about it, and the archipelago's popularity has grown a great deal since we visited, with tap water and infrastructure the standing local problem. Give it three days, not one."],
  ["Are the San Blas islands worth visiting?", "By every account yes, and this is the part of Panama I cannot vouch for personally – we ran out of time and did not go, and it is top of my own list for a return trip. What is established: San Blas, properly Guna Yala, is an archipelago of hundreds of islands run autonomously by the Guna people, most of them uninhabited, with no resorts and very little signal. Access is by 4x4 and boat over a notoriously rough road, or by small plane, and visits run through Guna-managed packages rather than independent hotels. Treat everything in this answer as research rather than as tested advice, which is the distinction this site exists to keep."],
  ["Is Panama safe?", "Broadly yes for the places a visitor actually goes, with two well-defined exceptions that are nowhere near them. Panama sits at the milder end of the advisory scale on account of ordinary crime, and the tourist districts of the capital – Casco Viejo and the modern financial quarter – have a heavy police presence. The exceptions are the Darién region on the Colombian border and parts of the Mosquito Gulf, which carry the most severe warnings on account of organised crime and trafficking routes, and neither is anywhere near a normal itinerary. Practically: do not resist a robbery, do not display valuables, avoid demonstrations, and treat the capital at night the way you would any large city."],
  ["When is the best time to visit Panama?", "Mid-December to April for the Pacific side, the capital and the canal – that is the dry season, and it is reliable. The catch is that Bocas del Toro and the Caribbean coast run on their own calendar and can rain in the middle of the Pacific dry season, with their better spells tending to fall around September and October and again in February and March. No month is dry across the whole country. If your trip is mostly the archipelago, build in a spare day rather than trying to pick a perfect week."],
  ["Do you need a visa for Panama?", "Most European, UK and North American passports do not for tourist stays – entry is visa-free, typically for 90 days or more, with a passport valid six months and proof of onward travel the requirements that are actually checked. Rules differ by nationality and change, so confirm your own case against an official source close to your travel date rather than relying on this page."],
  ["Is Coiba diving worth it?", "Honestly, it is a gamble rather than a guarantee, and mine did not come off. Coiba is a former prison island turned national park with a serious reputation – a biodiversity hotspot where divers report whale sharks and big pelagic life – and I went out with high expectations and had one of the most disappointing days in the water of my life. The visibility was fine; there was just nothing there, almost no marine life the whole day, after a long drive down the coast and a long boat ride out. Marine life is the variable, and it swings with the season, the day and luck. Ask hard about recent sightings before you pay, and do not make it the reason you come to this coast."],
  ["Is Panama expensive?", "Middling for the region, and cheaper than Costa Rica for most things. Getting there is the unavoidable line – return flights from western Europe run about €600 booked ahead, with direct routes from Madrid, Amsterdam, Paris and Frankfurt, which is unusual for Central America and one of Panama's real advantages. That is what reaching the country costs, not what the trip costs. On the ground Panama uses the US dollar, which makes budgeting simple and prices legible; boat tours in Bocas are cheap and fixed, the capital's restored old town is where the money goes, and the genuine high end is over-water lodging rather than conventional luxury."],
  ["Panama or Costa Rica – which one?", "Costa Rica if you want wildlife, infrastructure and an easy first trip to the tropics, and are prepared to pay roughly double for it. Panama if you want Caribbean islands at a fair price and are willing to run a narrow itinerary rather than a tour. They are not really competing for the same trip: Costa Rica is a country you travel around, and Panama, on my experience of it, is a country you go to one part of. The two are also easy to combine – the land border near Bocas del Toro is a routine crossing, and that is how we arrived."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Panama guide SKU exists and none is planned. The fetch takes all guides
// so any future SKU appears as its own card with no code change; until then
// the guide sections and the BuyBox do not render.
const GUIDE_BLURBS = {};

async function fetchPanamaContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "panama" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "panama" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function PanamaDestinationPage() {
  const { guides, stories } = await fetchPanamaContent();
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
          "Panama: is it worth visiting, how long you need, and what to skip",
        description:
          "Whether Panama is worth visiting, how many days you need, and the narrow itinerary that makes it a good trip.",
        datePublished: "2026-09-04",
        dateModified: "2026-09-04",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Panama" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/panama",
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
        <span className="text-slate-600">Panama</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Americas · Central America
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Panama
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it worth visiting, how long you need, and what to skip – the
          country that came last on a three-week trip and still has one
          genuinely good week inside it.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={islandAndClearWater}
              alt="A palm-covered island ringed by white sand and clear green water in Bocas del Toro, Panama"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Panama worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                I should declare the bias immediately: of every country I have
                travelled in, Panama is the one that has settled lowest in my
                own ranking, and I am not going to pretend otherwise on its own
                page. A great deal of it left me flat. The mainland is a single
                spine road with long, hot drives strung along it. The Pacific
                coast did not do much for me. Coiba, the island dive trip that
                every guidebook sells as world-class, produced one of the worst
                days in the water of my life – fine visibility, and almost no
                marine life to look at.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                And I would still tell you to go, because the mistake I made is
                the one the itineraries encourage: treating Panama as a country
                to tour rather than one to cherry-pick. There is a genuinely
                good trip in here. It is just a narrow one, and the whole skill
                is cutting away everything that does not earn its place.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Here is the version I would do. Give Panama City exactly one
                day, for the two things that justify it. The first is the canal:
                stand at the locks, watch a ship rise between the gates, and let
                the scale and the brutal history land – it is more impressive as
                an idea than as a view, and it is still worth seeing once. The
                second is Casco Viejo, the restored colonial old town, best
                walked in the evening when the heat drops and the old stone sits
                lit against a wall of finance towers across the bay. Old
                colonial quarter in the foreground, a skyline that looks
                transplanted from Miami behind it: few cities lay out their
                contradictions so plainly. One day covers both comfortably. I
                would not give the city a second.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Then leave the mainland entirely and go to Bocas del Toro. This
                is where Panama delivers – a Caribbean archipelago of low green
                islands and water in three shades of blue, reached the slow way
                over the mountains and then by boat, and run at a pace that only
                works if you match it. Sleep out on the water if the budget
                allows. Give it three unhurried days rather than one. If I had
                more time I would add San Blas, the Guna-run archipelago
                everyone raves about, which I have not been to and cannot vouch
                for. What I would not repeat is the mainland loop or the day out
                to Coiba. Do it narrow and Panama is a good week; try to see all
                of it and you will probably end up agreeing with my ranking.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Panama's two coasts do not share a calendar, and the one you
                care about depends on which trip you are taking. The dry season
                answer applies to the capital and the Pacific; the archipelago
                is its own question.
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
                Unusually for a country page, the useful question here is not
                how long but how much to leave out. Every extra length below
                should go into the islands rather than into more of the
                mainland.
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
                Two regions get no card because we did not reach them. San Blas,
                properly Guna Yala, is the Caribbean archipelago run
                autonomously by the Guna people – hundreds of islands, almost no
                infrastructure by design, and the place almost everyone who has
                been describes in the same dreamy terms. It is the top of my own
                list for a return, and nothing on this page about it is tested.
                The Boquete highlands, up near the Costa Rican border, are the
                mainland's best case for itself: coffee, cloud forest and cool
                air, and the one part of the interior I would give a second look.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Panama City is the best-connected airport in Central America and
                one of the few in the region with direct flights from Europe –
                Madrid, Amsterdam, Paris and Frankfurt all fly it, and the
                national carrier's hub means onward connections across the
                Americas are unusually good. That is a real advantage over its
                neighbours and one reason Panama works as a first or last stop
                on a longer trip. Overland, the Costa Rican border near Bocas
                del Toro is a routine crossing, which is how we arrived. Most
                European, UK and North American passports enter visa-free, with
                onward travel and passport validity the things actually checked.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the mainland there is essentially one road, the
                Pan-American, and everything strings off it. Surfaces on the
                main route are decent, secondary roads are potholed, and traffic
                in the capital is heavy enough to be a planning factor rather
                than an annoyance. A hire car makes the Pacific side possible;
                without one, long-distance buses cover the same spine cheaply.
                The one thing to know before you commit to a driving itinerary
                is that the distances are genuinely long and genuinely hot, and
                they are the part of Panama I would most happily give up.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Bocas del Toro is a different transport question and the switch
                is abrupt: you drive over the mountains, leave the car on the
                mainland, and cross the last stretch by boat. Once you are in
                the archipelago there are no roads worth the name and boats do
                everything cars do elsewhere. Budget the crossing as its own
                half-day at each end rather than as the tail of a driving day.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the unavoidable line: return flights from
                western Europe run about €600 booked ahead, and unusually for
                this region a good number of them are direct. That is what
                reaching Panama costs, not what the trip costs. On the ground
                the country uses the US dollar, which makes prices legible and
                budgeting simple, and it sits comfortably below Costa Rica for
                most things:
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
                The line with real range is where you sleep in Bocas. A room in
                town and a cabin built on stilts over the sea are different
                orders of spending, and that single decision sets what the trip
                costs more than anything else. Boat days, food and transport are
                all cheap and stay cheap; the mainland car, if you take one, is
                the other lever – and the honest advice on this page is that you
                may not need it at all.
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
                src={diverInEmptyWater}
                alt="A diver alone in empty teal water off Coiba island, Panama, bubbles rising past the mask"
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
                <SectionHeading>Stories from Panama</SectionHeading>
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
                Panama was one of three countries crossed overland in the same
                three weeks, and it came last of them – which is only useful
                information alongside the other two:{" "}
                <Link
                  href="/destinations/costa-rica"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Costa Rica
                </Link>{" "}
                immediately north, polished and expensive, and{" "}
                <Link
                  href="/destinations/nicaragua"
                  className="font-medium text-brand-terracotta underline underline-offset-2"
                >
                  Nicaragua
                </Link>{" "}
                beyond it, which was my favourite of the three and now comes
                with a much longer list of caveats.
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

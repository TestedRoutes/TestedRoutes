import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";
import PhotoCarousel from "../../../_components/PhotoCarousel";

import colonialStreetPalmsBissauVelho from "../../../../content/countries/guinea-bissau/destination/generated/web/colonial-street-palms-bissau-velho.jpg";
import colonialStreetCrossingBissau from "../../../../content/countries/guinea-bissau/destination/generated/web/colonial-street-crossing-bissau.jpg";
import bissauRooftopsAtSunset from "../../../../content/countries/guinea-bissau/destination/generated/web/bissau-rooftops-at-sunset.jpg";
import colonialStreetWideBissau from "../../../../content/countries/guinea-bissau/destination/generated/web/colonial-street-wide-bissau.jpg";
import redDirtStreetBissauVelho from "../../../../content/countries/guinea-bissau/destination/generated/web/red-dirt-street-bissau-velho.jpg";
import piroguesOnTheMud from "../../../../content/countries/guinea-bissau/destination/generated/web/pirogues-on-the-mud-at-low-tide.jpg";
import piroguesAndThePort from "../../../../content/countries/guinea-bissau/destination/generated/web/pirogues-and-the-port-bissau.jpg";
import sunsetColonialRoofline from "../../../../content/countries/guinea-bissau/destination/generated/web/sunset-over-the-colonial-roofline.jpg";
import derelictBlockAtSunset from "../../../../content/countries/guinea-bissau/destination/generated/web/derelict-block-at-sunset-bissau.jpg";
import longRedColonialBuilding from "../../../../content/countries/guinea-bissau/destination/generated/web/long-red-colonial-building-bissau.jpg";
import fortRampAndFlag from "../../../../content/countries/guinea-bissau/destination/generated/web/fort-ramp-and-flag-bissau.jpg";
import bissauRooftopsTowerBlock from "../../../../content/countries/guinea-bissau/destination/generated/web/bissau-rooftops-tower-block.jpg";
import tidalCreekDugoutCanoe from "../../../../content/countries/guinea-bissau/destination/generated/web/tidal-creek-and-dugout-canoe.jpg";
import villageOfMudAndThatch from "../../../../content/countries/guinea-bissau/destination/generated/web/village-of-mud-and-thatch.jpg";
import roundHutsDryGround from "../../../../content/countries/guinea-bissau/destination/generated/web/round-huts-across-dry-ground.jpg";
import thatchedVillageLateLight from "../../../../content/countries/guinea-bissau/destination/generated/web/thatched-village-late-light.jpg";
import lilyPondUnderBigTrees from "../../../../content/countries/guinea-bissau/destination/generated/web/lily-pond-under-big-trees.jpg";
import causewayInTheRain from "../../../../content/countries/guinea-bissau/destination/generated/web/causeway-in-the-rain.jpg";
import azulejoTilePanel from "../../../../content/countries/guinea-bissau/destination/generated/web/azulejo-tile-panel-bissau.jpg";
import bissauCitySign from "../../../../content/countries/guinea-bissau/destination/generated/web/bissau-city-sign.jpg";

/*
 * Scope note (destination playbook §7): this page sells the DECISION - whether
 * Guinea-Bissau is safe, whether it is worth going at all, how long, when.
 * Everything operational (visa fees and where to pay them, border fees, bed
 * and food picks, within-day sequencing) is deliberately absent.
 *
 * VISA SCOPE, tightened 2026-09-03: the consulate story was RETIRED by the
 * founder before publication (see inspire/_retired/). §7 lets this page carry
 * anything a PUBLISHED story gives away - so when that story went, its
 * specifics went with it. The consulate town, the cash detail and the
 * half-hour duration were all removed from the tip and the FAQ. What remains
 * is the "it exists" half §7 permits: a visa is required, there was no e-visa
 * and nothing at the border when we crossed, sort it before the frontier,
 * verify the current channel. Do not put the specifics back unless a story
 * carrying them is actually published.
 *
 * NO GUIDE SKU EXISTS and none is currently planned - two days on the ground,
 * a Level 3 advisory and a transitional government are a poor basis for a
 * sellable itinerary (founder decision pending, flag F5 in the shared source
 * file). So no sentence here may say "the guide carries X": mechanics are
 * asserted to exist, unreferenced. If a SKU is ever published, do a pointer
 * pass over the FAQ and the how-long section.
 *
 * HONESTY LINE, load-bearing on this page: the founder drove across
 * Guinea-Bissau in two days and never reached the Bijagos. The archipelago is
 * the country's headline draw and the page has to name it, but every sentence
 * about it is written as research and framed as untested - the same treatment
 * Senegal's hub gives Goree. Do not let a later edit quietly upgrade the
 * islands to first-hand. There are no founder photographs of them, so under
 * §11 they get no region card either.
 *
 * POLITICAL NOTE: the army took power in November 2025 and a transitional
 * government followed. Advisory tiers on this page were read at build
 * (2026-09-03) and WILL move - re-check FCDO / State / Canada before any
 * reprint or SKU, and see the recheck register.
 *
 * The test before any edit: could a reader run a day of this trip from this
 * page? If yes, cut until they cannot.
 */

export const metadata = {
  title:
    "Guinea-Bissau: is it safe, what is actually there, and how long you need · TestedRoutes",
  description:
    "Whether Guinea-Bissau is safe after the coup, whether it is worth going, how long to stay and when – an empty Portuguese old town, a road east, and the islands we did not reach.",
  alternates: { canonical: "/destinations/guinea-bissau" },
  openGraph: {
    type: "article",
    url: "/destinations/guinea-bissau",
    title:
      "Guinea-Bissau: is it safe, what is actually there, and how long you need",
    description:
      "One of the least visited countries on earth: a Portuguese colonial capital with nobody in it, a day-long road east, and the Bijagos archipelago offshore.",
  },
};

const WHEN_TO_GO = [
  ["November to February", "The season. Dry, warm, and as close to comfortable as this coast gets, with the roads at their most predictable and the sea calm enough for the islands to be reachable. If you are going once, go now."],
  ["February, specifically", "Carnival. Bissau's is the country's big national event, a Portuguese-African hybrid with neighbourhood parades and traditional masks, and it lands in the best weather of the year. It is the one date that makes the capital a destination rather than a stop."],
  ["March to May", "Still dry, getting hot, and steadily emptier. We crossed at the end of May and the weather was never the problem – but the heat starts running your day, and the light goes flat in the middle of it."],
  ["June to October", "The rains, and they are serious here. Green, dramatic, and hard on unpaved roads in a country where the paved ones are already failing. Island crossings get less reliable as the sea gets rougher."],
  ["What I would pick", "Late January into February, for the dry weather with Carnival at the end of it – you pay for that with company and higher bed prices in the capital. If I wanted the country to myself I would take late November instead, accept that nothing is going on, and spend the difference on getting out to the islands."],
];

const HOW_LONG = [
  ["Two days", "What we did, and it is honestly a transit. Long enough for the old town in an evening and a full day's drive across the interior, which tells you what the country looks like and nothing about what it does. If you are driving through, this works. If you flew here, it does not."],
  ["Four or five days", "The capital properly, plus time to get out to the archipelago and back. This is the shortest version that justifies the flight, because the islands are the reason most people come and they are not a day trip from Bissau."],
  ["A week or more", "The islands at their own pace – several of them, with the boat legs that connect them, and the tolerance for a schedule that is set by tides and weather rather than by you. This is the trip the country is actually shaped for, and it is the one we cannot yet tell you about first-hand."],
];

const REGIONS = [
  {
    name: "Bissau and the old town",
    image: colonialStreetCrossingBissau,
    alt: "A crossing in Bissau's old town between two-storey colonial buildings with balconies and shutters",
    body: "The capital comes in two halves. Bissau Velho is the quarter the Portuguese built and the city subsequently left – a few streets of ochre and rose facades with the render failing, palms over packed red dirt, and almost nobody in them at dusk. Nothing in it has been restored. The other half is the market district, where the crowds, the shops and the noise all are. There is also a fort, a monument, a National Assembly and a tidal waterfront. The whole capital takes an evening.",
  },
  {
    name: "The road east and the villages",
    image: villageOfMudAndThatch,
    alt: "A village of round mud-walled houses with conical thatched roofs beside a red laterite road",
    body: "Inland the country changes character completely. Cement and tin give way to mud walls and conical thatch, cars give way to donkeys, and the roadside fills with small shops in every village of any size – far busier than the emptiness of the capital's old town would lead you to expect. This is most of Guinea-Bissau by area, and it is seen almost entirely from a car window.",
  },
  {
    name: "The tidal coast",
    image: piroguesOnTheMud,
    alt: "Long painted fishing pirogues lying over on grey mud at low tide in Bissau",
    body: "The whole coast is mangrove, creek and estuary, and the tide is the thing that runs it. At low water the harbour at Bissau becomes a mudflat with painted boats lying over on their sides and the port cranes stranded behind them; inland the same water reaches a long way up through the mangroves. It is not a beach coastline. It is a working, shifting, amphibious one.",
  },
];

/* Trip photos: the old town first, then the water, then the road east. */
const CAROUSEL = [
  { image: colonialStreetCrossingBissau, alt: "Colonial buildings at a crossing in Bissau's old town", caption: "Bissau Velho, at the crossing" },
  { image: colonialStreetWideBissau, alt: "A wide street of colonial buildings in Bissau with parked cars", caption: "The old town, wider" },
  { image: redDirtStreetBissauVelho, alt: "Palms leaning over a red dirt street lined with decaying colonial facades", caption: "Palms over the red dirt" },
  { image: azulejoTilePanel, alt: "A blue and white Portuguese tile panel showing a harvest scene under palms, on a wall in Bissau", caption: "Tiles that outlasted the empire" },
  { image: longRedColonialBuilding, alt: "A long red colonial building with a tiled roof in Bissau", caption: "The long red building" },
  { image: fortRampAndFlag, alt: "The ramp up to Bissau's fort with a flag flying above it", caption: "The fort, from the ramp" },
  { image: sunsetColonialRoofline, alt: "Sunset behind the colonial roofline at a junction in Bissau", caption: "Sunset on the roofline" },
  { image: derelictBlockAtSunset, alt: "A derelict modernist block standing at a junction in Bissau at sunset", caption: "Not everything empty is old" },
  { image: piroguesOnTheMud, alt: "Painted pirogues lying over on the mud at low tide", caption: "Low tide takes the harbour with it" },
  { image: piroguesAndThePort, alt: "Fishing pirogues on the mudflats with the cranes of Bissau's port behind", caption: "The port, waiting for water" },
  { image: bissauRooftopsTowerBlock, alt: "Bissau's red-tiled rooftops at sunset with a tower block beyond", caption: "Rooftops, from above" },
  { image: bissauCitySign, alt: "Multicoloured letters spelling BISSAU at a roundabout in the capital", caption: "Arrival, more or less" },
  { image: tidalCreekDugoutCanoe, alt: "A dugout canoe on the mud of a tidal creek running through mangroves", caption: "Mangrove country, east of the capital" },
  { image: causewayInTheRain, alt: "Cars stopped on a causeway over tidal flats in the rain", caption: "A tidal crossing, in the rain" },
  { image: villageOfMudAndThatch, alt: "Round mud houses with thatched roofs beside a red laterite road", caption: "Mud and thatch, inland" },
  { image: roundHutsDryGround, alt: "Round thatched huts standing across dry open ground", caption: "The interior, mid-morning" },
  { image: lilyPondUnderBigTrees, alt: "A pond covered in lilies under big trees with an animal drinking at the edge", caption: "Shade and water, on the road east" },
  { image: thatchedVillageLateLight, alt: "A thatched village under big trees in late afternoon light", caption: "Late light, near the border" },
];

// Deliberately no tier totals (destination playbook §8). The ONE figure on
// this page is the flight, and it is labelled as what getting there costs.
// Nothing else on the page carries an amount - the visa and border fees live
// in the inspire stories and stay there.
const COSTS = [
  ["Lean", "Simple guesthouses, eating where people actually eat, shared transport between towns, and a country where almost nothing charges admission because almost nothing is set up to"],
  ["Core", "A decent hotel in the capital, a hired car or a driver for the days that need one, and the boat legs out to the archipelago taken without agonising over them"],
  ["Splurge", "There is a ceiling here and it is low. What money buys in Guinea-Bissau is one of the handful of island lodges, plus somebody else arranging the boats and the permits – it buys access and reliability, not luxury"],
];

const TIPS = [
  ["The visa is a stop on your route, not a form to fill in.", "When we crossed there was no online application and nothing issued at the border, which between them turn the visa into somewhere you have to physically go before you arrive. Overland that means a consulate in a neighbouring country, and the errand itself is trivial – the planning is not, because it fixes a point on your route ahead of the frontier rather than after it. Check the current channel before you plan around it: this is exactly the sort of thing that changes without announcement."],
  ["If you are driving, carry two warning triangles, not one.", "Police stops on the road in from the border were frequent, and every one of them worked through the same short list: the car's import paper, a fire extinguisher, a first aid kit, and triangles – plural. A car that produces all of it immediately ends the conversation early. This eases off the further you get from the frontier."],
  ["Give the capital both halves, not just the photogenic one.", "Bissau Velho is the quarter every write-up shows you, and at dusk it is close to deserted – nothing restored, nothing arranged for visitors, no stalls, no guides, no cafés with boards outside. It is the best hour the capital has, and it is also only half the city. The market district a few minutes away is where the crowds, the shops and the noise live. Seeing one without the other gives you a badly wrong impression of the place in either direction."],
];

const FAQ = [
  ["Is Guinea-Bissau safe to visit?", "Treat it as a genuinely elevated-risk destination and check the current advice before you book – this is not a country where a page written months ago should be your source. The army took power in November 2025 and a transitional government followed, and the advisories moved with it: the US currently says reconsider travel, and Canada advises a high degree of caution overall plus avoiding non-essential travel within 20 km of the Senegal border, where banditry linked to the Casamance conflict is the concern. Landmines from the independence and civil-war eras remain a real hazard outside the capital, with Bafatá, Oio, Biombo, Quinara and Tombali named as the worst regions; Bissau itself is declared mine-free. Our own two days, driving in from Senegal well before the coup, involved no threat more serious than repeated police stops looking for a reason to be paid. That is one calm crossing in a calmer period, and it should be weighed as exactly that."],
  ["Is Guinea-Bissau worth visiting?", "For most travellers, not on its own – and that is the honest answer. It is worth visiting if you are already crossing West Africa overland, or if the Bijagós archipelago is the specific thing you want, because the islands are genuinely unusual and now carry a UNESCO World Heritage listing. What it does not have is a spread of sights: the mainland offers one small colonial quarter, a long drive, and a country that receives fewer visitors in a year than a single European city does in a busy weekend. Come for the archipelago or come because you are passing. Do not come expecting a circuit."],
  ["How many days do you need in Guinea-Bissau?", "Four or five if you have flown in, because that is the shortest trip that gets you out to the islands and back. Two days covers the capital's old town in an evening and one full day's drive across the interior, which is what we did and is fine as transit but does not justify a flight on its own. A week or more is the version the country is really shaped for, spent among the islands at the pace the boats and tides allow."],
  ["Do you need a visa for Guinea-Bissau?", "Almost certainly yes, and the thing to plan around is where you get it rather than how hard it is. When we crossed there was no online application and nothing issued at the border, so unless your nationality is exempt the visa has to be collected in person beforehand – at an embassy or consulate at home, or, coming overland, at one in a neighbouring country. That is the part worth knowing: it fixes a point on your route before the frontier, and it is the step most likely to catch out anyone planning to drive in. Visa channels here change without announcement, so confirm your own case against an official source close to your travel date rather than a forum post."],
  ["What is the difference between Guinea, Guinea-Bissau and Equatorial Guinea?", "Three different colonial powers left three countries with almost the same name. Guinea – often called Guinea-Conakry after its capital – was French and is the largest. Guinea-Bissau was Portuguese and added its capital's name to tell itself apart. Equatorial Guinea was Spanish, sits far away in Central Africa rather than West Africa, and is the only African country with Spanish as an official language. Guinea-Bissau is the small one on the Atlantic between Senegal and Guinea, and it is the only one of the three where you will hear Portuguese and its creole."],
  ["Are the Bijagós Islands worth visiting, and how do you get there?", "By every account yes, and this is the part of the country we cannot vouch for first-hand – we were crossing overland and did not have the time, so we drove past and out the far side. What is established: it is a cluster of scores of islands off the coast, listed by UNESCO as a World Heritage site in 2025, holding West Africa's saltwater hippos along with sacred forests and a distinctive Bijagó culture. Bubaque is the administrative centre and the island with a mainland ferry connection; Orango is the one associated with the hippos. Access runs on boats, weather and a small number of lodges rather than on a timetable you can rely on, so it needs its own days rather than an afternoon. If you are flying to Guinea-Bissau at all, this is what you are flying for."],
  ["When is the best time to visit Guinea-Bissau?", "November to February. That is the dry season at its most comfortable, with the roads at their best and the sea calm enough for island crossings to be dependable. February also brings Carnival, which is the country's largest national celebration and mixes Portuguese carnival tradition with masked processions from different regions and neighbourhoods. June to October is the rainy season – green and dramatic, but hard on roads that are already poor and less reliable for getting out to the islands."],
  ["What is the political situation in Guinea-Bissau?", "Unsettled. The army seized power in November 2025 following the presidential election, suspended the electoral process and installed a transitional government, in a country that has seen repeated coups and attempted coups since independence. Practically, that means demonstrations and disruption are plausible at short notice and that advisory levels have been revised upward. It does not mean the country is closed. It means you check your own government's current advice as part of booking rather than as a formality, and you keep some flexibility in the plan."],
  ["What is there to see in Bissau?", "Two halves, and an evening covers both. Bissau Velho is the old Portuguese town – a few streets of colonial buildings with the render failing and nothing restored, a surviving panel of Portuguese tiles, a fort, and a waterfront that turns to mudflats when the tide goes out; the Presidential Palace and the independence monument stand at its edge. What makes it memorable is not the architecture, which is modest, but how empty it is at dusk. The other half is the market district a few minutes away, which is where the crowds and the commerce actually are. Most write-ups describe the colonial streets and never mention the market, which gives a badly lopsided picture of the city."],
  ["Can you drive in Guinea-Bissau, and what are the roads like?", "You can, and the surface is the thing to plan around rather than the distance. Roads are reasonable close to the capital and get steadily worse away from it – there is asphalt on the main routes east, but with potholes deep enough that traffic simply abandons the tarmac for the dirt beside it. Our crossing from Bissau to the eastern border took about eight hours for a distance that looks like half that on a map. Expect frequent police checks near the frontier, avoid driving at night, and note that road banditry is flagged by several advisories."],
  ["Is Guinea-Bissau expensive?", "Getting there is the line that matters: return flights from western Europe run about €600, and essentially everything routes through Lisbon, where TAP flies to Bissau nonstop about four times a week. That is what reaching the country costs, not what the trip costs. On the ground it is inexpensive – beds and food are cheap outside the island lodges, and almost nothing charges admission, because almost nothing is set up to. The one line with real range is the archipelago, where a lodge and its boats are a different order of spending from anything on the mainland."],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// No Guinea-Bissau guide SKU exists and none is currently planned (flag F5).
// The fetch takes all guides so any future SKU appears as its own card with no
// code change; until then the guide sections and the BuyBox do not render.
const GUIDE_BLURBS = {};

async function fetchGuineaBissauContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "guinea-bissau" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "guinea-bissau" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function GuineaBissauDestinationPage() {
  const { guides, stories } = await fetchGuineaBissauContent();
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
          "Guinea-Bissau: is it safe, what is actually there, and how long you need",
        description:
          "Whether Guinea-Bissau is safe after the coup, whether it is worth going, how long to stay and when – an empty Portuguese old town, a road east, and the islands we did not reach.",
        datePublished: "2026-09-03",
        dateModified: "2026-09-03",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about: { "@type": "Country", name: "Guinea-Bissau" },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/guinea-bissau",
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
        <span className="text-slate-600">Guinea-Bissau</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          North &amp; West Africa · The Atlantic coast
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Guinea-Bissau
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Is it safe, what is actually there, and how long you need – for one of
          the least visited countries on earth, its empty Portuguese old town,
          and the archipelago offshore.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative mb-12 overflow-hidden rounded-[28px]">
            <Image
              src={colonialStreetPalmsBissauVelho}
              alt="Palms leaning over a red dirt street of decaying colonial buildings in Bissau Velho, Guinea-Bissau"
              priority
              className="h-[320px] w-full object-cover md:h-[460px]"
              sizes="(max-width: 768px) 100vw, 830px"
            />
          </div>

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Guinea-Bissau worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                We crossed Guinea-Bissau in two days, driving down the coast
                from Senegal and out the eastern side into Guinea, and I want
                to be straight about what that does and does not qualify me to
                tell you. It qualifies me on the mainland: the capital, the road
                east, the villages, the police stops, the paperwork. It does not
                qualify me on the Bijagós, the archipelago that is the country's
                real draw, because we never got out there. Most of what follows
                is first-hand. The islands are the part where I am reading the
                same sources you are, and I have marked that clearly.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The single most useful thing I can tell you about the capital
                is that it has two halves and the guidebooks only describe one.
                Bissau Velho is the Portuguese quarter, and it is going quietly
                to pieces – a few streets of ochre and rose facades with iron
                balconies and failing render, palms over packed red dirt, a
                panel of blue-and-white tiles still on a wall. Nothing in it
                has been preserved; the only stretch being rebuilt is the road
                around the main hotel. At dusk it reads like an old European
                town set down on the West African coast, with almost nobody in
                it. The other half is the market, minutes away, and that is
                where the entire city actually is: shops, stalls, traffic,
                crowds. See only the first and you will report that Bissau is a
                beautiful ruin. You will be wrong by half.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Beyond that, the mainland is a drive. The waterfront empties to
                mudflats when the tide goes out and leaves the fishing boats
                lying on their sides. Inland, cement houses give way to mud and
                thatch and cars give way to donkeys, and every village of any
                size has a roadside market busier than anything in the colonial
                quarter – including Bafatá, the second city, which we crossed
                without finding a reason to stop.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest caveats are large. This is a country with a
                transitional government installed by the army, elevated travel
                advisories, landmines still being cleared outside the capital,
                and very limited medical care. The sights are few and the roads
                are bad enough that distances double. Almost nothing is set up
                for visitors, which is precisely what some people are looking
                for and precisely what will ruin the trip for others. Go because
                you want the archipelago, or because you are already crossing
                West Africa and this is on the way. Those are the two good
                reasons, and they are enough.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The dry season is the answer, and the only real decision inside
                it is whether you want Carnival or solitude.
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
                Everything here turns on whether you are reaching the islands.
                The mainland is short; the archipelago is not, and it does not
                compress.
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
                The Bijagós archipelago is the region this page cannot show you.
                Scores of islands lie off this coast, listed by UNESCO in 2025,
                holding sacred forests, a distinctive island culture and West
                Africa's saltwater hippos – and for most visitors they are the
                entire reason to come. We did not have the time. We drove
                across the country and out the far side of it instead, so there
                is not a single photograph of them here and not one sentence
                about them we can vouch for personally. If you are flying in
                rather than passing through, do not repeat that: the islands
                are the trip, and the mainland is the way to them.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>From the trip</SectionHeading>
              <PhotoCarousel slides={CAROUSEL} />
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Fly into Bissau – Osvaldo Vieira is the country's international
                airport, and the practical route from Europe is Lisbon, which
                TAP serves nonstop about four times a week. Regional connections
                run from Dakar and Casablanca. Overland, Guinea-Bissau sits
                between Senegal to the north and Guinea to the south-east and
                both borders are drivable; that is how we arrived and left. A
                visa is required for most nationalities, and when we crossed it could
                be obtained neither online nor at the border – so it is an errand
                to complete somewhere on the way in, not at the frontier.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                On the ground, plan around surfaces rather than distances. Roads
                are decent near the capital and deteriorate steadily away from
                it, to the point where traffic drives on the dirt beside the
                tarmac because the tarmac is worse. A crossing that looks like a
                half-day on the map can take a full one. Ordinary cars manage
                the main routes, slowly; night driving is widely advised
                against, and several governments flag road banditry. Shared
                transport covers the same routes for very little money.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Reaching the islands is a separate transport question from
                reaching the country, and the one most itineraries
                underestimate. Boats out to the archipelago run to weather,
                tides and demand rather than to a timetable you can book around
                from home, so give that leg its own days at both ends.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Getting there is the unavoidable line: return flights from
                western Europe run about €600, almost always through Lisbon.
                That is what reaching Guinea-Bissau costs, not what the trip
                costs – on the ground this is an inexpensive country, and there
                is very little to pay for because there is very little arranged
                to pay for. The rest is a choice about how you sleep and how you
                move:
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
                The line with real range is the archipelago. A lodge out on the
                islands, with its boats and its logistics, sits in a different
                bracket from anything on the mainland, and it is the single
                decision that sets what this trip costs. Everything else –
                beds in the capital, food, fuel, transport – is cheap and stays
                cheap.
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
                src={bissauRooftopsAtSunset}
                alt="The red-tiled rooftops of Bissau at sunset, Guinea-Bissau"
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
                <SectionHeading>Stories from Guinea-Bissau</SectionHeading>
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

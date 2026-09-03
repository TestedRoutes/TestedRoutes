import Image from "next/image";
import Link from "next/link";
import { HIDDEN_DESTINATION_SLUGS } from "../../_lib/destinations";

import seychellesHero from "../../../content/countries/seychelles/destination/generated/web/source-dargent-from-water.jpg";
import icelandHero from "../../../content/countries/iceland/destination/generated/web/svartifoss-wide.jpg";
import tuvaluHero from "../../../content/countries/tuvalu/destination/generated/web/narrowest-point-road.jpg";
import kuwaitHero from "../../../content/countries/kuwait/destination/generated/web/marina-pier-at-night.jpg";
import samoaHero from "../../../content/countries/samoa/destination/generated/web/founder-at-sopoaga-falls.jpg";
import fijiHero from "../../../content/countries/fiji/destination/generated/web/island-beach-pavilion.jpg";
import mauritaniaHero from "../../../content/countries/mauritania/destination/generated/web/riding-empty-ore-wagons.jpg";
import westernSaharaHero from "../../../content/countries/western-sahara/destination/generated/web/white-dune-tidal-pool.jpg";
import gambiaHero from "../../../content/countries/gambia/destination/generated/web/kunta-kinteh-ferry-midriver.jpg";
import senegalHero from "../../../content/countries/senegal/destination/generated/web/dakar-from-renaissance-monument.jpg";
import guineaHero from "../../../content/countries/guinea/destination/generated/web/village-and-mango-tree-at-dawn.jpg";
import guineaBissauHero from "../../../content/countries/guinea-bissau/destination/generated/web/colonial-street-palms-bissau-velho.jpg";
import canaryIslandsHero from "../../../content/countries/canary-islands/destination/generated/web/papagayo-coves-golden-hour.jpg";
import tenerifeHero from "../../../content/countries/canary-islands/destination/generated/web/teide-cone-clear-morning.jpg";
import granCanariaHero from "../../../content/countries/canary-islands/destination/generated/web/roque-nublo-and-el-fraile.jpg";
import lanzaroteHero from "../../../content/countries/canary-islands/destination/generated/web/la-geria-crater-vines.jpg";
import fuerteventuraHero from "../../../content/countries/canary-islands/destination/generated/web/cofete-through-the-cactus.jpg";

export const metadata = {
  title: "Destinations · TestedRoutes",
  description: "Self-guided travel routes across the countries and regions I have personally tested.",
  alternates: { canonical: "/destinations" },
};

const DESTINATIONS = [
  {
    name: "Iceland",
    href: "/destinations/iceland",
    region: "Europe · North Atlantic",
    blurb:
      "How many days you need, what a week really costs, and whether you need a 4x4 – the Ring Road, the south coast, and the layover version.",
    image: icelandHero,
    alt: "Svartifoss falling between dark basalt columns into a green gorge, Iceland",
  },
  {
    name: "Seychelles",
    href: "/destinations/seychelles",
    region: "East & Southern Africa",
    blurb:
      "Four islands in seven days: what is worth your time, when to go, what it costs, and the tested route between them.",
    image: seychellesHero,
    alt: "Granite boulders at Anse Source d'Argent seen from the water, Seychelles",
  },
  {
    name: "Tuvalu",
    href: "/destinations/tuvalu",
    region: "Oceania & Pacific",
    blurb:
      "The world's least-visited country: how to get there via Fiji, what the flight gap gives you, and two days on Funafuti that actually work.",
    image: tuvaluHero,
    alt: "The road at Fongafale's narrowest point with the lagoon and the open Pacific on either side",
  },
  {
    name: "Kuwait",
    href: "/destinations/kuwait",
    region: "Middle East · The Gulf",
    blurb:
      "Is it worth a stop, and how long you actually need – the city in a day, a Bronze-Age island and the desert at dusk on day two.",
    image: kuwaitHero,
    alt: "The wooden pier at Souq Sharq marina at night, the lit Kuwait City skyline behind",
  },
  {
    name: "Samoa",
    href: "/destinations/samoa",
    region: "Oceania & Pacific",
    blurb:
      "How many days you need and which islands to pick – two islands, one rental car, and a week where Sunday matters more than the weather.",
    image: samoaHero,
    alt: "The founder at the Sopo'aga Falls lookout, the fall dropping into its jungle gorge behind",
  },
  {
    name: "Fiji",
    href: "/destinations/fiji",
    region: "Oceania & Pacific",
    blurb:
      "Which islands to pick and how long you need – there are two completely different Fijis, and one boat timetable runs the good one.",
    image: fijiHero,
    alt: "A thatched pavilion and red ti plants on a white-sand island beach in Fiji",
  },
  {
    name: "Mauritania",
    href: "/destinations/mauritania",
    region: "North & West Africa · The Sahara",
    blurb:
      "Is it worth it and is it safe – the iron-ore train ridden on the ore, the Eye of the Sahara, and a desert with almost no other tourists.",
    image: mauritaniaHero,
    alt: "Travellers riding on top of an empty iron-ore wagon rake through the desert, Mauritania",
  },
  {
    name: "Western Sahara",
    href: "/destinations/western-sahara",
    region: "North & West Africa · The Atlantic Sahara",
    blurb:
      "Can you visit and is it safe – Dakhla's kite lagoon, the white dune, and a thousand kilometres of the emptiest sealed road in Africa.",
    image: westernSaharaHero,
    alt: "A horseshoe tidal pool ringed by white sand beneath the dune near Dakhla, a lone figure at its rim",
  },
  {
    name: "The Gambia",
    href: "/destinations/gambia",
    region: "North & West Africa · The Smiling Coast",
    blurb:
      "Is it safe and is there more than the beach – crocodiles you can touch, wild monkey troops beside the hotel strip, and a river day in the mangrove creeks.",
    image: gambiaHero,
    alt: "The Kunta Kinteh ferry crossing the green water of the Gambia River mouth",
  },
  {
    name: "Senegal",
    href: "/destinations/senegal",
    region: "North & West Africa · The Atlantic coast",
    blurb:
      "Is it safe and is it worth it – Dakar and its monument, colonial Saint-Louis on its river island, and the lake that is not always pink.",
    image: senegalHero,
    alt: "Dakar spreading below the hill of the African Renaissance Monument, Senegal",
  },
  {
    name: "Guinea",
    href: "/destinations/guinea",
    region: "North & West Africa · The Fouta Djallon",
    blurb:
      "Is it safe and is it worth it – the water tower of West Africa, a capital at the end of a peninsula, and roads that decide the whole trip.",
    image: guineaHero,
    alt: "A large mango tree over a village of round thatched houses at sunrise near Koundara, Guinea",
  },
  {
    name: "Guinea-Bissau",
    href: "/destinations/guinea-bissau",
    region: "North & West Africa · The Atlantic coast",
    blurb:
      "Is it safe and is there anything to see – an empty Portuguese old town, a day-long road east, and the archipelago that is the real reason to come.",
    image: guineaBissauHero,
    alt: "Palms leaning over a red dirt street of decaying colonial buildings in Bissau Velho, Guinea-Bissau",
  },
  {
    name: "Canary Islands",
    href: "/destinations/canary-islands",
    region: "Spain · Atlantic & volcanic islands",
    blurb:
      "Which island to pick and how many days you need – four islands that feel like four countries, winter swimming included, and the ferry move that beats choosing.",
    image: canaryIslandsHero,
    alt: "The turquoise coves and red headlands of Punta del Papagayo at golden hour, Lanzarote",
  },
  {
    name: "Tenerife",
    href: "/destinations/tenerife",
    region: "Canary Islands · Spain",
    blurb:
      "How many days you need and which side to stay on – Teide above the clouds, the Anaga laurel ridges, old towns, and the honest north–south split.",
    image: tenerifeHero,
    alt: "The bare cone of Mount Teide under deep blue sky, seen across the caldera scrub, Tenerife",
  },
  {
    name: "Gran Canaria",
    href: "/destinations/gran-canaria",
    region: "Canary Islands · Spain",
    blurb:
      "How many days you need and why the interior wins – a viewpoint every few bends, cave villages, a slot canyon, and desert dunes at the bottom.",
    image: granCanariaHero,
    alt: "Roque Nublo and El Fraile standing over the plateau with pine forest dropping away behind, Gran Canaria",
  },
  {
    name: "Lanzarote",
    href: "/destinations/lanzarote",
    region: "Canary Islands · Spain",
    blurb:
      "Is it worth visiting and how many days you need – smoking ground, vines in craters, turquoise pools in lava tubes. The underrated one.",
    image: lanzaroteHero,
    alt: "Thousands of dug-out craters with single vines behind stone walls in the black ash of La Geria, Lanzarote",
  },
  {
    name: "Fuerteventura",
    href: "/destinations/fuerteventura",
    region: "Canary Islands · Spain",
    blurb:
      "How many days you need and which end to stay on – the biggest easy sands in the Canaries, and the wildest beach of all behind a mountain wall.",
    image: fuerteventuraHero,
    alt: "Cofete beach and the Jandía mountain wall seen past a candelabra cactus, Fuerteventura",
  },
  {
    name: "Switzerland",
    href: "/destinations/switzerland",
    region: "Switzerland & the Alps",
    blurb:
      "Day trips, weekend trips and multi-day itineraries across the Alps, all doable without a tour.",
    image: null,
    alt: null,
  },
];

export default function DestinationsPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 pt-12">
      <header>
        <h1 className="font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Destinations
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          The countries and regions behind the guides – planning pages built
          from trips I have actually taken.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Hidden hubs (see _lib/destinations.js) keep their card data here
            so un-hiding is a one-line change; they just don't render. */}
        {DESTINATIONS.filter(
          (d) => !HIDDEN_DESTINATION_SLUGS.includes(d.href.split("/").pop()),
        ).map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {d.image ? (
              <Image
                src={d.image}
                alt={d.alt}
                className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 font-serif text-2xl text-slate-400">
                {d.name}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-1.5 p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {d.region}
              </p>
              <p className="font-serif text-xl leading-snug text-brand-ink group-hover:text-slate-700">
                {d.name}
              </p>
              <p className="text-[13px] leading-relaxed text-slate-600">{d.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

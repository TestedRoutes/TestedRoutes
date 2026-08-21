import Image from "next/image";
import Link from "next/link";

import seychellesHero from "../../../content/countries/seychelles/destination/generated/web/source-dargent-from-water.jpg";
import icelandHero from "../../../content/countries/iceland/destination/generated/web/svartifoss-wide.jpg";
import tuvaluHero from "../../../content/countries/tuvalu/destination/generated/web/narrowest-point-road.jpg";
import kuwaitHero from "../../../content/countries/kuwait/destination/generated/web/marina-pier-at-night.jpg";
import samoaHero from "../../../content/countries/samoa/destination/generated/web/founder-at-sopoaga-falls.jpg";
import fijiHero from "../../../content/countries/fiji/destination/generated/web/island-beach-pavilion.jpg";

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
        {DESTINATIONS.map((d) => (
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

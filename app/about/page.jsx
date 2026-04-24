import Link from "next/link";

export const metadata = {
  title: "About Me · Pikelis Travel",
  description:
    "Paulius Pikelis – 15+ years of independent travel across 140+ countries. Every route in these guides is personally tested, from day hikes to overland expeditions.",
};

function aboutAsset(filename) {
  return "/About%20me/" + encodeURIComponent(filename);
}

const ROAD_EXPEDITIONS = [
  { title: "Mongol Rally", file: "Mongol rally.jpg", alt: "Convoy vehicles on a long-distance rally stage across open terrain" },
  { title: "Africa Rally", file: "Africa rally - Desert 2023.jpg", alt: "Desert driving during the Africa Rally" },
  { title: "Australia Rally", file: "Australia.JPG", alt: "Remote dirt route and wide landscape during a long-distance rally stage" },
];

const MOUNTAINS = [
  { caption: "Aconcagua (6,961 m) – Argentina", file: "7_Summits_Aconcagua 2017.jpg", alt: "High-altitude ascent day on Aconcagua in the Andes, Argentina" },
  { caption: "Denali (6,190 m) – USA", file: "7_Summits_Denali 2022.jpg", alt: "Glacier and ridge terrain on a Denali expedition in Alaska, USA" },
  { caption: "Kilimanjaro (5,895 m) – Tanzania", file: "7_Summits_Kilimanjaro 2016.jpg", alt: "Dawn light on the approach to Kilimanjaro summit, Tanzania" },
];

const EXTREME_EXPERIENCES = [
  { label: "Running with the bulls - Spain", file: "Running with bulls Pamplona 2019.jpg", alt: "Running of the bulls street scene in Pamplona, Spain" },
  { label: "Shark diving - Fiji", file: "Sharks Fiji 2025.jpg", alt: "Shark diving in clear blue water off Fiji" },
  { label: "Volcano boarding - Nicaragua", file: "Nicaragua boarding 2019.jpg", alt: "Boarding down volcanic ash slopes in Nicaragua" },
  { label: "Paragliding - Brazil", file: "Paragliding.jpg", alt: "Paragliding over coastal hills in Brazil" },
  { label: "Ice climbing - Italy", file: "Ice climbing Italy 2019.jpg", alt: "Ice climbing on a frozen waterfall in the Italian Alps" },
  { label: "Summits above 6,000 m - Alaska", file: "Summits Alaska 2019 v2.jpg", alt: "Summits above 6,000 m in Alaska (Denali expedition)" },
  { label: "Iron ore train - Mauritania", file: "Iron Ore train Mauritania 2023.jpg", alt: "Riding the iron ore train across the Mauritanian desert" },
  { label: "Remote places - Makoko, Nigeria", file: "Makoko Nigeria 2025.jpg", alt: "Makoko stilt community and waterways in Lagos, Nigeria" },
];

export default function AboutMePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold md:text-4xl">About Me</h1>
          <p className="text-sm leading-relaxed text-slate-600">
            I do not build guides from desk research or generic itineraries. Every route
            here comes from trips I have planned and tested myself across more than 140
            countries, from day hikes in Switzerland to overland travel through West
            Africa.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            After more than 15 years of independent trip planning, I know where travel
            plans usually fail:
          </p>
          <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>connections that do not work</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>unrealistic travel timings</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>routes that look simple on paper but break once the journey starts</li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">
            These guides are designed to help you avoid exactly that.
          </p>
          <Link
            className="inline-flex text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500"
            href="/guides"
          >
            Explore the guides →
          </Link>
        </div>
        <img
          src={aboutAsset("About me2.jpg")}
          alt="Portrait of the author on the road"
          className="h-auto max-h-none w-full rounded-[18px] object-cover object-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:h-full md:min-h-[320px] md:max-h-[420px]"
          loading="lazy"
        />
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {["140+ countries visited", "15+ years planning trips", "Only real routes tested"].map((item) => (
            <div key={item} className="rounded-2xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200">
              {item}
            </div>
          ))}
        </div>
        <div className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              This map shows where I have planned trips myself.
            </h2>
            <p className="text-sm text-slate-600">
              Traveling across regions changes how you think about routes. Over time, you learn:
            </p>
            <ul className="space-y-1 text-sm text-slate-600">
              <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>which border crossings slow trips down</li>
              <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>which connections save hours</li>
              <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>how to combine destinations into routes that flow naturally</li>
              <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>how to turn ideas on a map into journeys that actually work</li>
            </ul>
            <p className="text-sm text-slate-600">This perspective shapes how each guide is structured.</p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
            <img
              src={aboutAsset("Countries_visited v2.jpg")}
              alt="World map highlighting countries where trips were planned and tested in person"
              className="h-full min-h-[11rem] w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Why these guides work better in real life</h2>
          <p className="text-sm text-slate-600">
            These guides are built the way real trips actually happen, not as lists of
            attractions, but as clear routes you can follow step by step.
          </p>
          <p className="text-sm text-slate-600">
            Each guide focuses on what travellers usually struggle with most:
          </p>
          <ul className="space-y-1 text-sm text-slate-600">
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>how to get there</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>how long things actually take</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>what is worth skipping</li>
            <li className="flex gap-2"><span className="mt-0.5 shrink-0 text-slate-400">•</span>how to combine stops efficiently in one day</li>
          </ul>
          <p className="text-sm text-slate-600">
            The result is a route you can follow with confidence, not just inspiration on a page.
          </p>
        </div>
        <img
          src={aboutAsset("Why these guides work.jpg")}
          alt="Why these guides work better in real life"
          className="h-44 w-full rounded-2xl object-cover object-center shadow-sm ring-1 ring-slate-200"
          loading="lazy"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Road expeditions I've completed myself</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ROAD_EXPEDITIONS.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <img
                src={aboutAsset(item.file)}
                alt={item.alt}
                className="h-44 w-full rounded-2xl object-cover object-center"
                loading="lazy"
              />
              <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Mountains climbed</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {MOUNTAINS.map((item) => (
            <div key={item.caption} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <img
                src={aboutAsset(item.file)}
                alt={item.alt}
                className="h-44 w-full rounded-2xl object-cover object-center"
                loading="lazy"
              />
              <p className="mt-3 text-sm font-semibold text-slate-900">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">How I test the routes behind my guides</h2>
        <p className="text-sm text-slate-600">
          I don't design itineraries from a desk. I test destinations in the field - often
          through unusual, high-adventure, or logistically difficult experiences.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXTREME_EXPERIENCES.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <img
                src={aboutAsset(item.file)}
                alt={item.alt}
                className="h-36 w-full rounded-2xl object-cover object-center"
                loading="lazy"
              />
              <p className="mt-2 text-center text-[11px] font-medium leading-snug text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Why I do this</h2>
          <p className="text-sm text-slate-600">
            Independent travel should feel exciting, not overwhelming.
          </p>
          <p className="text-sm text-slate-600">
            I create guides that turn complex trips into clear, practical steps that are easy to follow.
          </p>
          <p className="text-sm text-slate-600">
            So you spend less time planning and more time exploring.
          </p>
        </div>
        <img
          src={aboutAsset("Why I do this.jpg")}
          alt="Why I do this – turning travel experience into practical guides"
          className="h-44 w-full rounded-2xl object-cover object-center shadow-sm ring-1 ring-slate-200"
          loading="lazy"
        />
      </section>

      <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Ready to travel more and plan less?</h2>
        <Link
          href="/guides"
          className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Browse Guides
        </Link>
      </section>
    </main>
  );
}

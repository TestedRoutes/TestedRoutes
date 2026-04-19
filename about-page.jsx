/** Public folder images (filenames may contain spaces). */

function aboutAsset(filename) {

  return "assets/public/" + encodeURIComponent(filename);

}



function SiteHeaderOrFallback() {
  if (typeof window !== "undefined" && typeof window.SiteHeader === "function") {
    return React.createElement(window.SiteHeader);
  }
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 text-sm">
        <a href="index.html" className="font-semibold text-slate-900">Pikelis Travel</a>
        <a href="guides.html" className="text-slate-600 hover:text-slate-900">Guides</a>
        <a href="inspire.html" className="text-slate-600 hover:text-slate-900">Inspire</a>
        <a href="about.html" className="font-semibold text-slate-900">About Me</a>
      </nav>
    </header>
  );
}

function AboutMePage() {

  return (

    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">

      <SiteHeaderOrFallback />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">

        <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">

          <div className="space-y-4">

            <h1 className="text-3xl font-semibold md:text-4xl">About Me</h1>

            <p className="text-sm leading-relaxed text-slate-600">

              I don't build guides from desk research or generic itineraries.

              Every route here comes from trips I've planned and tested myself

              across 140+ countries - from simple day hikes in Switzerland to

              overland routes through West Africa.

            </p>

            <p className="text-sm leading-relaxed text-slate-600">

              After 15+ years planning trips independently, I know where travel

              plans usually break: connections that don't work, stops that take

              longer than expected, and routes that look good on paper but fail in

              real life.

            </p>

            <p className="text-sm leading-relaxed text-slate-600">

              These guides are built to avoid exactly that.

            </p>

            <a

              className="inline-flex text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500"

              href="guides.html"

            >

              Explore the guides →

            </a>

          </div>

          <img

            src={aboutAsset("About me.jpg")}

            alt="Portrait of the author on the road"

            className="h-auto max-h-none w-full rounded-[18px] object-cover object-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:h-full md:min-h-[320px] md:max-h-[420px]"

            loading="lazy"

          />

        </section>



        <section className="space-y-4">

          <div className="grid gap-4 md:grid-cols-3">

            {[

              "140+ countries visited",

              "15+ years planning trips",

              "Only real routes tested",

            ].map((item) => (

              <div

                key={item}

                className="rounded-2xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"

              >

                {item}

              </div>

            ))}

          </div>

          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-start">

            <div className="space-y-3">

              <h2 className="text-lg font-semibold text-slate-900">

                This map shows where I've planned trips myself.

              </h2>

              <p className="text-sm text-slate-600">

                Traveling across regions changes how you think about routes. You

                learn which border crossings are slow, which transport shortcuts

                actually save time, and how to combine places into something that

                works as a real trip - not just a list on a map.

              </p>

              <p className="text-sm text-slate-600">

                That's the experience behind these guides.

              </p>

            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

              <img

                src={aboutAsset("Countries_visited.jpg")}

                alt="World map highlighting countries where trips were planned and tested in person"

                className="h-full min-h-[11rem] w-full object-cover object-center"

                loading="lazy"

              />

            </div>

          </div>

        </section>



        <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">

          <div className="space-y-3">

            <h2 className="text-lg font-semibold text-slate-900">

              Why these guides work better in real life

            </h2>

            <p className="text-sm text-slate-600">

              These guides are built the way real trips actually happen — not as

              lists of attractions, but as clear routes you can follow step by

              step.

            </p>

            <p className="text-sm text-slate-600">

              Each guide focuses on what travelers usually struggle with most:

              how to get there, how long things really take, what to skip, and how

              to combine stops efficiently in one day.

            </p>

            <p className="text-sm text-slate-600">

              The goal is simple: help you spend less time planning and more time

              experiencing the place.

            </p>

          </div>

          <img

            src={aboutAsset("Matterhorn 2020.jpg")}

            alt="Alpine scenery near the Matterhorn on a high-mountain trip"

            className="h-44 w-full rounded-2xl object-cover object-center shadow-sm ring-1 ring-slate-200"

            loading="lazy"

          />

        </section>



        <section className="space-y-4">

          <h2 className="text-lg font-semibold text-slate-900">

            Road expeditions I've completed myself

          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            {[

              {

                title: "Mongol Rally",

                file: "Africa Rally 2023.jpg",

                alt: "Convoy vehicles on a long-distance rally stage across open terrain",

              },

              {

                title: "Africa Rally",

                file: "Africa rally - Desert 2023.jpg",

                alt: "Desert driving during the Africa Rally",

              },

              {

                title: "Australia Rally",

                file: "Mountain biking 2025.jpg",

                alt: "Remote dirt route and wide landscape during a long-distance rally stage",

              },

            ].map((item) => (

              <div

                key={item.title}

                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"

              >

                <img

                  src={aboutAsset(item.file)}

                  alt={item.alt}

                  className="h-44 w-full rounded-2xl object-cover object-center"

                  loading="lazy"

                />

                <p className="mt-3 text-sm font-semibold text-slate-900">

                  {item.title}

                </p>

              </div>

            ))}

          </div>

        </section>



        <section className="space-y-4">

          <h2 className="text-lg font-semibold text-slate-900">

            Mountains climbed

          </h2>

          <div className="grid gap-3 md:grid-cols-3">

            {[

              {

                caption: "Aconcagua (6,961 m) — Argentina",

                file: "7_Summits_Aconcagua 2017.jpg",

                alt: "High-altitude ascent day on Aconcagua in the Andes, Argentina",

              },

              {

                caption: "Denali (6,190 m) — USA",

                file: "7_Summits_Denali 2022.jpg",

                alt: "Glacier and ridge terrain on a Denali expedition in Alaska, USA",

              },

              {

                caption: "Kilimanjaro (5,895 m) — Tanzania",

                file: "7_Summits_Kilimanjaro 2016.jpg",

                alt: "Dawn light on the approach to Kilimanjaro summit, Tanzania",

              },

            ].map((item) => (

              <div

                key={item.caption}

                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"

              >

                <img

                  src={aboutAsset(item.file)}

                  alt={item.alt}

                  className="h-44 w-full rounded-2xl object-cover object-center"

                  loading="lazy"

                />

                <p className="mt-3 text-sm font-semibold text-slate-900">

                  {item.caption}

                </p>

              </div>

            ))}

          </div>

        </section>



        <section className="space-y-4">

          <h2 className="text-lg font-semibold text-slate-900">

            How I test the routes behind my guides

          </h2>

          <p className="text-sm text-slate-600">

            I don't design itineraries from a desk. I test destinations in the

            field - often through unusual, high-adventure, or logistically

            difficult experiences.

          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[

              {

                label: "Running with the bulls - Spain",

                file: "Pamplona 2019.jpg",

                alt: "Running of the bulls street scene in Pamplona, Spain",

              },

              {

                label: "Shark diving - Fiji",

                file: "Sharks Fiji 2025.jpg",

                alt: "Shark diving in clear blue water off Fiji",

              },

              {

                label: "Volcano boarding - Nicaragua",

                file: "Nicaragua boarding 2019.jpg",

                alt: "Boarding down volcanic ash slopes in Nicaragua",

              },

              {

                label: "Paragliding - Brazil",

                file: "Paragliding.jpg",

                alt: "Paragliding over coastal hills in Brazil",

              },

              {

                label: "Ice climbing - Italy",

                file: "Ice climbing Italy 2019.jpg",

                alt: "Ice climbing on a frozen waterfall in the Italian Alps",

              },

              {

                label: "Summits above 6,000 m - Alaska",

                file: "Alaska 2019 v2.jpg",

                alt: "Summits above 6,000 m in Alaska (Denali expedition)",

              },

              {

                label: "Iron ore train - Mauritania",

                file: "Iron Ore train Mauritania 2023.jpg",

                alt: "Riding the iron ore train across the Mauritanian desert",

              },

              {

                label: "Remote places - Makoko, Nigeria",

                file: "Africa Rally - Makoko Nigeria 2025.jpg",

                alt: "Makoko stilt community and waterways in Lagos, Nigeria",

              },

            ].map((item) => (

              <div

                key={item.label}

                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"

              >

                <img

                  src={aboutAsset(item.file)}

                  alt={item.alt}

                  className="h-36 w-full rounded-2xl object-cover object-center"

                  loading="lazy"

                />

                <p className="mt-2 text-center text-[11px] font-medium leading-snug text-slate-600">

                  {item.label}

                </p>

              </div>

            ))}

          </div>

        </section>



        <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">

          <div className="space-y-3">

            <h2 className="text-lg font-semibold text-slate-900">Why I do this</h2>

            <p className="text-sm text-slate-600">

              I want to help more people travel independently without wasting

              days or weeks on chaotic planning.

            </p>

            <p className="text-sm text-slate-600">

              Good travel should feel exciting - not overwhelming.

            </p>

            <p className="text-sm text-slate-600">

              These guides are my way of turning years of firsthand experience

              into something practical, simple, and useful for other travelers.

            </p>

          </div>

          <img

            src={aboutAsset("Mt Cook - NZ 2026.jpg")}

            alt="Aoraki Mount Cook region in New Zealand at golden hour"

            className="h-44 w-full rounded-2xl object-cover object-center shadow-sm ring-1 ring-slate-200"

            loading="lazy"

          />

        </section>



        <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">

          <h2 className="text-lg font-semibold text-slate-900">

            Ready to travel more and plan less?

          </h2>

          <button className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold text-white">

            Browse Guides

          </button>

        </section>

      </main>

    </div>

  );

}



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<AboutMePage />);



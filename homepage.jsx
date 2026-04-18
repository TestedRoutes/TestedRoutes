const destinationRail = [
  { label: "Switzerland", href: "guides.html" },
  { label: "Day Trips", href: "guides.html" },
  { label: "Road Trips", href: "guides.html" },
  { label: "Adventure", href: "guides.html" },
  { label: "Expedition Routes", href: "guides.html" },
  { label: "Rally Guides", href: "guides.html" },
  { label: "Bungee", href: "guides.html" },
  { label: "Hiking", href: "guides.html" },
  { label: "Everest Preparation", href: "guides.html" },
];

const guides = [
  {
    category: "Day Trip",
    title: "Triftbrücke from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "412",
    price: "€12.99",
    href: "guides/trift-bridge-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Day Trip",
    title: "Stoos Ridge from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "358",
    price: "€9.99",
    href: "guides/stoos-ridge-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Day Trip",
    title: "Appenzell & Ebenalp from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "396",
    price: "€12.99",
    href: "guides/appenzell-ebenalp-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Day Trip",
    title: "Mount Rigi from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "441",
    price: "€9.99",
    href: "guides/mount-rigi-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Day Trip",
    title: "Säntis from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "304",
    price: "€12.99",
    href: "guides/santis-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Day Trip",
    title: "Flims & Caumasee from Zurich",
    duration: "1 day",
    meta: "Mobile guide + PDF",
    purchases: "287",
    price: "€9.99",
    href: "guides/flims-caumasee-from-zurich.html",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
];

const searchSuggestions = [
  { label: "Switzerland — Country", href: "destinations/switzerland/" },
  {
    label: "Zurich — Starting point in Switzerland",
    href: "destinations/switzerland/?start=zurich",
  },
  {
    label: "Triftbrücke from Zurich — Guide",
    href: "guides/trift-bridge-from-zurich.html",
  },
  {
    label: "Stoos Ridge from Zurich — Guide",
    href: "guides/stoos-ridge-from-zurich.html",
  },
  {
    label: "Appenzell & Ebenalp from Zurich — Guide",
    href: "guides/appenzell-ebenalp-from-zurich.html",
  },
  { label: "Mount Rigi from Zurich — Guide", href: "guides/mount-rigi-from-zurich.html" },
  { label: "Säntis from Zurich — Guide", href: "guides/santis-from-zurich.html" },
  {
    label: "Flims & Caumasee from Zurich — Guide",
    href: "guides/flims-caumasee-from-zurich.html",
  },
  {
    label: "Day trips from Zurich — Guide collection",
    href: "destinations/switzerland/?length=daytrip&start=zurich",
  },
];

const resolveDestinationSearch = (query) => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return null;
  }

  const guideMatches = {
    trift: "guides/trift-bridge-from-zurich.html",
    stoos: "guides/stoos-ridge-from-zurich.html",
    appenzell: "guides/appenzell-ebenalp-from-zurich.html",
    ebenalp: "guides/appenzell-ebenalp-from-zurich.html",
    rigi: "guides/mount-rigi-from-zurich.html",
    "säntis": "guides/santis-from-zurich.html",
    santis: "guides/santis-from-zurich.html",
    flims: "guides/flims-caumasee-from-zurich.html",
    caumasee: "guides/flims-caumasee-from-zurich.html",
  };

  const directGuide = Object.keys(guideMatches).find((term) =>
    normalized.includes(term)
  );
  if (directGuide) {
    return guideMatches[directGuide];
  }

  const destinationMatches = [
    "switzerland",
    "swiss",
    "zurich",
    "geneva",
    "lucerne",
    "interlaken",
  ];

  const hasSwitzerland = destinationMatches.some((term) =>
    normalized.includes(term)
  );

  if (!hasSwitzerland) {
    return null;
  }

  let length = null;
  if (normalized.includes("weekend")) {
    length = "weekend";
  } else if (
    normalized.includes("day trip") ||
    normalized.includes("day trips") ||
    normalized.includes("daytrip") ||
    normalized.includes("1 day")
  ) {
    length = "daytrip";
  } else if (normalized.includes("expedition")) {
    length = "expedition";
  } else if (
    normalized.includes("2 week") ||
    normalized.includes("two week") ||
    normalized.includes("14 day")
  ) {
    length = "2weeks";
  } else if (normalized.includes("5-7") || normalized.includes("week")) {
    length = "week";
  }

  let start = null;
  if (normalized.includes("zurich")) {
    start = "zurich";
  } else if (normalized.includes("geneva")) {
    start = "geneva";
  } else if (normalized.includes("lucerne")) {
    start = "lucerne";
  } else if (normalized.includes("interlaken")) {
    start = "interlaken";
  }

  const params = new URLSearchParams();
  if (length) {
    params.set("length", length);
  }
  if (start) {
    params.set("start", start);
  }

  const queryString = params.toString();
  return `/destinations/switzerland/${queryString ? `?${queryString}` : ""}`;
};

const SearchBar = () => {
  const [query, setQuery] = React.useState("");
  const suggestions = searchSuggestions.filter((item) =>
    query ? item.label.toLowerCase().includes(query.toLowerCase()) : false
  );

  const handleSubmit = () => {
    const destinationUrl = resolveDestinationSearch(query);
    if (destinationUrl) {
      window.location.href = destinationUrl;
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
          <span className="h-2 w-2 rounded-full bg-slate-900"></span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Search destinations or guides"
            className="w-full bg-transparent text-sm text-slate-600 outline-none"
          />
        </div>
        <button
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          onClick={handleSubmit}
        >
          Search Guides
        </button>
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {suggestions.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const GuideCard = ({ guide }) => (
  <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
    <div className="h-44 w-full overflow-hidden">
      <img
        src={guide.image}
        alt={guide.title}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div className="space-y-3 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {guide.category.toUpperCase()}
      </p>
      <p className="text-lg font-semibold text-slate-900">{guide.title}</p>
      <p className="text-sm text-slate-600">
        {guide.duration} • {guide.meta}
      </p>
      {guide.purchases ? (
        <p className="text-xs text-slate-500">{guide.purchases} purchased</p>
      ) : null}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-semibold text-slate-900">
          From {guide.price}
        </span>
        {guide.href ? (
          <a
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            href={guide.href}
          >
            View Guide
          </a>
        ) : (
          <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            View Guide
          </button>
        )}
      </div>
    </div>
  </div>
);

const DestinationRail = () => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {destinationRail.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        {item.label}
      </a>
    ))}
  </div>
);

const AboutMe = () => (
  <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[220px_1fr] md:gap-8">
    <div className="h-44 w-full rounded-2xl bg-slate-100"></div>
    <div className="mt-6 space-y-4 md:mt-0">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        About Me
      </p>
      <div className="grid gap-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">
            140 countries visited
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">
            15 years planning trips independently for myself, family, and
            friends
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="font-semibold text-slate-900">
            Mission: help people travel more and waste less time planning
          </span>
        </div>
      </div>
    </div>
  </section>
);

const SupportMention = () => (
  <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-900">
        Need help refining your route?
      </p>
      <p className="text-xs text-slate-500">
        Add personal support after purchasing any guide.
      </p>
    </div>
    <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span>Personal Trip Session</span>
        <span className="font-semibold text-slate-900">€99</span>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span>Trip Setup Assistance</span>
        <span className="font-semibold text-slate-900">€249</span>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="flex flex-col gap-4 border-t border-slate-200 py-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
    <p>© 2026 Pikelis Travel. All rights reserved.</p>
    <div className="flex items-center gap-4">
      <span>Contact</span>
      <span>Terms</span>
      <span>Privacy</span>
    </div>
  </footer>
);

const addOnOptions = [
  {
    id: "session",
    label: "Personal Trip Session",
    price: "€99",
    description: "60-minute video call to refine itinerary and logistics.",
  },
  {
    id: "setup",
    label: "Trip Setup Assistance",
    price: "€249",
    description:
      "Hotel shortlist, booking sequence, transport timing, and reservations.",
  },
];

const addOnVisibility = {
  "Day Trip": [],
  "Weekend Getaway": ["session"],
  "Standard Trip": ["session", "setup"],
  Expedition: ["session", "setup"],
};

const GuidePurchasePanel = ({ title, price, tier }) => {
  const visibleAddOns = addOnVisibility[tier];
  const isExpedition = tier === "Expedition";

  return (
    <section className="space-y-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {tier}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{price}</p>
      </div>
      {visibleAddOns.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-900">
            Enhance your trip
          </p>
          {isExpedition ? (
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
              Recommended add-ons
            </p>
          ) : null}
          <div className="space-y-3">
            {addOnOptions
              .filter((option) => visibleAddOns.includes(option.id))
              .map((option) => (
                <label
                  key={option.id}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <input type="checkbox" className="mt-1 h-4 w-4" />
                  <span className="flex-1">
                    <span className="flex items-center justify-between font-semibold text-slate-900">
                      {option.label} <span>{option.price}</span>
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Optional support is available after purchase.
        </p>
      )}
      <p className="text-xs text-slate-500">
        These guides are designed to be simple, realistic, and easy to follow.
        If my 60-year-old parents can use them confidently, most travelers can
        too.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white">
          Buy Guide
        </button>
        <button className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700">
          Buy Guide + Add-ons
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Built from 15 years of independent trip planning experience. Based on
        firsthand travel across 140 countries. Reviewed and updated quarterly.
        Refund available if the guide is not useful for your trip.
      </div>
      <a className="text-xs font-semibold text-slate-600" href="inspire.html">
        See the trip behind this guide
      </a>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Includes: hotel shortlist support, booking strategy, transport timing,
        activity prioritization, and reservation planning help.
      </div>
    </section>
  );
};

const PostPurchaseSession = () => (
  <section className="space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        Book your session
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">
        Schedule your Personal Trip Session
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Choose a time after checkout. We will refine your itinerary together.
      </p>
    </div>
    <button className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm font-semibold text-slate-500">
      Calendly / Cal.com button placeholder
    </button>
    <div className="grid gap-3 text-xs text-slate-600 md:grid-cols-2">
      {[
        "Destination",
        "Travel dates",
        "Trip length",
        "Budget",
        "Travel style",
        "Current itinerary draft",
        "Main questions",
      ].map((field) => (
        <div
          key={field}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          {field}
        </div>
      ))}
    </div>
  </section>
);
function HomepageConcepts() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-900">
      {React.createElement(window.SiteHeader)}
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <section className="space-y-3">
          <div className="space-y-1">
            <p className="text-2xl font-semibold leading-tight md:text-3xl">
              Travel more. Waste less time planning.
            </p>
            <p className="text-sm leading-snug text-slate-600">
              Premium travel guides built from 15 years of independent travel across 140 countries — every route personally tested.
            </p>
          </div>
          <SearchBar />
          <DestinationRail />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Browse guides</p>
            <button className="text-xs font-semibold text-slate-600">
              View all
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {guides.map((guide) => (
              <GuideCard key={guide.title} guide={guide} />
            ))}
          </div>
        </section>

        <SupportMention />
        <AboutMe />
        <Footer />
      </main>
    </div>
  );
}

const GuideDetailExample = () => (
  <div className="mx-auto max-w-3xl space-y-6 bg-[#f7f4ef] p-6 text-slate-900">
    <GuidePurchasePanel
      title="Mongol Rally Expedition Route"
      price="€79.99"
      tier="Expedition"
    />
    <PostPurchaseSession />
  </div>
);

const ImagePlaceholder = ({ label }) => (
  <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-slate-400">
    {label}
  </div>
);

const AboutMePage = () => (
  <div className="bg-[#f7f4ef] text-slate-900">
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-10">
      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-3xl font-semibold md:text-4xl">About Me</p>
          <p className="text-sm text-slate-600">
            I've been planning trips independently for myself, my family, and
            friends for more than 15 years.
          </p>
          <p className="text-sm text-slate-600">
            Today, I turn that experience into premium travel guides designed
            to help people travel more and waste less time planning.
          </p>
          <p className="text-sm text-slate-600">
            These are real routes built from firsthand travel - not generic
            itineraries.
          </p>
        </div>
        <ImagePlaceholder label="Portrait placeholder - mountain or expedition photo" />
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "140 countries",
            "15 years planning trips",
            "Built for real travelers",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <img
            src="/assets/c__Users_pauli_AppData_Roaming_Cursor_User_workspaceStorage_d20496b7a806f32edfc4160436733656_images_image-9bd2bb29-3040-46c6-93af-e6a1a6066871.png"
            alt="Visited countries map"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">
            Why these guides are different
          </p>
          <p className="text-sm text-slate-600">
            I build guides the same way I plan trips in real life: around
            logistics, pacing, memorable experiences, and what actually works on
            the ground.
          </p>
          <p className="text-sm text-slate-600">
            If my 60-year-old parents can follow these routes confidently, most
            travelers can too.
          </p>
        </div>
        <ImagePlaceholder label="Route planning / train window / map placeholder" />
      </section>

      <section className="space-y-4">
        <p className="text-lg font-semibold text-slate-900">
          Expedition routes I've organized myself
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Mongol Rally",
            "Africa overland route",
            "West Africa remote crossings",
          ].map((title) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <ImagePlaceholder label={`${title} placeholder`} />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-lg font-semibold text-slate-900">
          Mountain and expedition experience
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          {["Aconcagua", "Denali", "Kilimanjaro", "Elbrus", "Kosciuszko"].map(
            (peak) => (
              <span
                key={peak}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {peak}
              </span>
            )
          )}
        </div>
        <p className="text-sm text-slate-600">
          I also prepared extensively for an Everest expedition - an experience
          that deepened my approach to logistics, preparation, and route
          structure.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {["Summit placeholder", "Glacier placeholder", "Crampons placeholder"].map(
            (label) => (
              <ImagePlaceholder key={label} label={label} />
            )
          )}
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-lg font-semibold text-slate-900">
          How I test the routes behind my guides
        </p>
        <p className="text-sm text-slate-600">
          I don't design itineraries from a desk. I test destinations in the
          field - often through unusual, high-adventure, or logistically
          difficult experiences.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Running with the bulls - Spain",
            "Shark diving - South Africa",
            "Volcano boarding - Nicaragua",
            "Skydiving and paragliding",
            "Ice climbing and glacier travel",
            "Summits above 6,000 m",
            "Iron ore train - Mauritania",
            "Remote border crossings - West Africa",
          ].map((label) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex h-36 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-slate-400">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-900">Why I do this</p>
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
        <ImagePlaceholder label="Traveler planning route placeholder" />
      </section>

      <section className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <p className="text-lg font-semibold text-slate-900">
          Ready to travel more and plan less?
        </p>
        <button className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold text-white">
          Browse Guides
        </button>
      </section>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<HomepageConcepts />);

import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import Byline from "../../../_components/Byline";
import BuyBox from "../../../_components/BuyBox";

/*
 * IMAGES — none yet, deliberately. The founder's cull had not happened when
 * this page was written (2026-09-11), and the brand book bans stock: the
 * Switzerland hub is hidden and 307-redirected today precisely because it
 * still carries Unsplash placeholders. So every image slot here is guarded
 * and simply does not render, rather than showing a placeholder.
 *
 * When the cull lands, add static imports from
 * content/countries/liechtenstein/destination/generated/web/ (1660 px WIDE,
 * not long edge — srcset selection is width-based; q85), set `image` on each
 * REGIONS entry, fill HERO and CLOSING, and restore the "From the trip"
 * carousel (import PhotoCarousel and a CAROUSEL array, ordered BY ALTITUDE —
 * valley, terrace, high ground — never by route or trip date, both of which
 * reconstruct a day and break §7).
 *
 * The one frame to hold a slot for: the border sign inside the old covered
 * wooden bridge at Vaduz–Sevelen, reading LIECHTENSTEIN | SCHWEIZ. It is the
 * hero candidate, because it makes "nothing announces the border" something
 * the page can show rather than assert.
 */

/*
 * Scope note (destination playbook §7; founder rulings 2026-09-11).
 *
 * This page sells the DECISION — whether Liechtenstein is worth going to,
 * whether a day is enough, when, and what reaching it costs. Everything
 * operational belongs to the (unbuilt) day-trip SKU and is deliberately
 * absent: bus numbers and which train they meet, any ticket product, any
 * clock at all, how to reach Gaflei without a car, walking times and
 * turnaround rules, named beds and meals, museum admissions, Malbun lift
 * prices, parking.
 *
 * The operating rule, sharper than the house version, because on a 160 km²
 * country "useful" and "the whole guide" nearly coincide: the page owns WHAT
 * and WHETHER, the guide owns WHEN and IN WHAT ORDER. The page may therefore
 * name every sight and give every verdict, provided it never states a clock
 * time or leg duration, never puts two things in sequence, never names a
 * ticket product, and never names a bed or a meal. Review test: could a
 * reader build a TIMETABLE from this page? Not "a day" — a timetable.
 *
 * §8: exactly ONE figure, and it is CHF 52, the Saver Day Pass — verified at
 * sbb.ch 2026-09-11, and verified to cover the LIEmobil buses on the
 * Liechtenstein side, so one purchase carries a reader from Zürich to Vaduz
 * and back. A point-to-point fare was rejected: Swiss fares are dynamic and
 * sources gave CHF 21–24, CHF 31 plus a CHF 6 bus, and CHF 41 "anytime" for
 * the same one-way trip, so any rounded figure would be a round-number lie.
 * Swiss passes reprice every January — RECHECK each December.
 *
 * That one string appears in four places — the cost section and the three FAQ
 * answers about money and getting there, because §6 wants the figure inside
 * the Question nodes, which is what schema exposes. One FIGURE, repeated; a
 * SECOND, different currency amount anywhere on the rendered page means §8 has
 * failed. Verified on the rendered page 2026-09-11: four hits, all "CHF 52".
 *
 * NO SKU EXISTS YET. No sentence may say "the guide carries X" — mechanics
 * are asserted to exist, unreferenced. POINTER PASS OWED the day the
 * Liechtenstein Day Trip from Zurich SKU publishes: revisit FAQ #2, FAQ #3
 * and the HOW_LONG rows for "a day" and "a day and a night".
 *
 * THREE NAMED HIGHLIGHTS ARE RESEARCH, NOT TESTED, and the page says so
 * wherever it names them (the San Blas / Bijagós treatment):
 *   — Malbun: "never been up there" (founder, 2026-09-11). It gets NO region
 *     card for that reason — §11, a region with no founder photographs gets
 *     no card. Do not reinstate one.
 *   — The Fürstensteig: "no" (founder, 2026-09-11). He has been on the high
 *     ground at Gaflei, 1,597 m, on the Via Alpina, but not on that path. No
 *     copy may describe its wire ropes or exposure first-hand.
 *   — The Liechtenstein Trail: not walked. It takes about three days with
 *     nights out and he has never stayed longer than one night in the
 *     country.
 * The Unterland gets no card either, for the same photographic reason; it is
 * carried in text only.
 *
 * RECENCY IS AN ASSET HERE and the page says so. Unlike Costa Rica, whose
 * source trip is six years old, the founder lived eighty minutes away for a
 * decade and visited across many years and several seasons. No blanket
 * staleness caveat is needed.
 */

export const metadata = {
  title: "Liechtenstein: is it worth visiting, and is a day enough · TestedRoutes",
  description:
    "Whether Liechtenstein is worth visiting, whether a day from Zürich is enough, how you get there with no airport, and what it costs – from many visits an hour and twenty away.",
  alternates: { canonical: "/destinations/liechtenstein" },
  openGraph: {
    type: "article",
    url: "/destinations/liechtenstein",
    title: "Liechtenstein: is it worth visiting, and is a day enough",
    description:
      "A castle you cannot enter, a border you cannot feel, and a country that only pays off above the valley floor.",
  },
};

const WHEN_TO_GO = [
  ["June to October", "The season, and the only one that opens the whole country. The high paths above the valley are clear, the huts are working, and the walking – which is the real reason to come – is available. Hot in the valley, which matters less than you would think, because you should not be spending the day down there."],
  ["December to March", "A smaller country. The high ground is shut, the valley is grey, and what remains is the capital and its museums, which is an afternoon. Malbun, the one ski area, runs in winter – I have not been up there, so take that as a fact about the country rather than a recommendation from me."],
  ["April to May, and November", "The trap, and worth naming. Too late or too early for snow, too early or too late for the high paths. The country shrinks to the valley floor, which is exactly the version that makes people say there is nothing here."],
  ["15 August", "The one date that changes the trip. National Day: the country's own holiday, with a ceremony at the castle, a festival in Vaduz and fireworks. Either come for it deliberately or avoid it deliberately, but do not arrive on it by accident."],
  ["What I would pick", "Late September, and I would trade for it both ways. You give up the long hut season and some certainty about the weather; you get clear air, the high paths still open, and a valley that has stopped being hot. If you need certainty instead, take July and accept company on the good paths."],
];

const HOW_LONG = [
  ["A couple of hours", "No – and this row is the honest one. It is what most visitors do: photograph the castle from below, buy the souvenir stamp, get back on the coach. It is also precisely why the country has the reputation it has. You will leave agreeing that there is nothing there, and the evidence you collected will support you."],
  ["A day", "Yes, and it is the correct size rather than a compromise – provided the day goes up. Long enough to get above the valley floor, where the country stops being ordinary; short enough that the travelling does not eat it. Spend the day at the bottom and you have bought the two-hour version at six times the length."],
  ["A day and a night", "The upgrade that changes the country's character. The valley empties when the coaches leave, and a morning that begins up in the mountains rather than down at the station is a different place. It misses nothing structural, and it is the version worth paying for."],
  ["A weekend", "Only with a reason, and on this ground the reason is a long day up high. Without one, the second day starts repeating the first. This is not a country that rewards slack time."],
  ["Longer than that", "No. Liechtenstein cannot fill a week on its own. It can be a base for a wider corner of the Alps, or the frame for walking its length end to end on the 75 km trail that links all eleven municipalities – but a week spent trying to see Liechtenstein is a week spent seeing it three times."],
  ["What I have actually done", "Many visits across a decade, from eighty minutes away, in several seasons – and never once a stay longer than a single night. The best of them were single days aimed at exactly one thing. That record is both the authority behind this page and, read honestly, its verdict."],
];

/*
 * THREE cards, not five. Malbun and the Unterland were cut because the
 * founder has no photographs of either (§11), and Malbun because he has never
 * been at all. Both are carried in text instead. Guinea shipped three cards
 * for the same reason.
 *
 * The organising axis is ALTITUDE, not geography, and that is deliberate:
 * Liechtenstein is not spread out, it is stacked, and on a country this small
 * any set of place-cards can be read as an itinerary. Bands cannot — they are
 * alternatives at a single choice point. Never re-cut these as a route, and
 * keep the section intro's "you do not do these in an order" line.
 */
const REGIONS = [
  {
    name: "The valley floor",
    image: null,
    alt: "Vaduz's main street below the castle on its crag, the Rhine valley behind",
    body: "The working country: prosperous, industrial, entirely ordinary. Banks and precision manufacturing, roundabouts, a short pedestrian strip of museums in Vaduz, Schaan next door doing the actual business, Balzers at the southern end under its castle. This is the part that disappoints, and it is the only part a coach stop shows you. Worth an hour, worth knowing about, not worth the trip on its own.",
  },
  {
    name: "The terrace",
    image: null,
    alt: "Triesenberg's houses on the shelf above the Rhine valley, looking across to the mountains",
    body: "Four hundred metres up, a shelf of villages where a German carried over the mountains in the Middle Ages is still spoken – Triesenberg has its own Walser dialect, and Masescha and Silum sit above it. The air changes, the accent changes and the view opens, and it takes about twenty minutes of climbing to get there. This is where the country stops being a strip of the Rhine valley and starts being itself.",
  },
  {
    name: "The high ground",
    image: null,
    alt: "The Rhine valley seen from the shelf at Gaflei, a long wall of mountains on the far side",
    body: "Above the terrace the ground goes to rock and the Austrian border runs along the crest. From the shelf at Gaflei, at 1,597 m, the whole valley lies underneath with a wall of mountains on the far side, and the ruin of Schalun – the Wildschloss – stands on a crag below. The famous path up here is the Fürstensteig, cut into the cliff in the 1890s and secured with wire ropes; it is seasonal, it has been closed by rockfall, and it needs a head for heights. I have not walked it. I have walked the ground it starts from, and that alone is the best thing the country owns.",
  },
];

// Deliberately no tier totals. Publishing them gives away the research and
// anchors a reader on a large number before they know what is optional inside
// it. Levels described, never priced.
const COSTS = [
  ["Lean", "Go up on your own legs and eat what you carried. The country's best things have no ticket at all, which makes the lean version genuinely close to free once the fare is paid"],
  ["Core", "The bus network instead of the climb, lunch somewhere up on the terrace, and a museum on a wet afternoon"],
  ["Splurge", "A night at altitude, and the Prince's own wine with dinner. Note what the splurge here actually buys: not a better room, but more hours"],
];

/*
 * Two tips, not seven. §7's teaser budget scales down with the SKU, and the
 * only planned SKU is a day trip — perhaps fifteen hard-won facts, so
 * publishing eight of them would halve the product. Both of these are facts a
 * published inspire story already gives away, which is the only thing that
 * makes them page-legal.
 */
const TIPS = [
  ["Do not let Vaduz stand for the country.", "Almost everyone who reports that Liechtenstein is dull is reporting on Vaduz, and on that evidence they are right – it is prosperous, tidy and an hour or two uses it up. The slope directly behind the town is where the argument changes. A plan that begins and ends on the valley floor will send you home agreeing with the internet."],
  ["The passport stamp is a souvenir, not an entry stamp.", "You can have Liechtenstein stamped into your passport at the tourist office in Vaduz. It is officially sanctioned and it does not invalidate the document – but there is no border control between Switzerland and Liechtenstein and has not been for a century, so there is nothing at the frontier to stamp anything. What you are buying is a country selling proof of a border it deliberately removed."],
];

const FAQ = [
  [
    "Is Liechtenstein worth visiting?",
    "Yes – but only if you go up. The valley floor is an ordinary, prosperous strip of the Rhine valley, and it is the only part a coach stop shows you, which is why so many people come home calling it boring. Four hundred metres above the shops there is a shelf of villages with their own dialect, and above that a rock crest with the Austrian border along it. None of that is visible from the bottom and all of it is reachable in a morning. Stay low and you will agree with the internet; start climbing and it becomes one of the strangest small places in the Alps.",
  ],
  [
    "Is Liechtenstein worth a day trip from Zürich?",
    "Yes, and a day is the right size for it – short enough that the travelling does not eat the day, big enough that a day is not a token. Reaching it is the one unavoidable cost and it is small: a Saver Day Pass is CHF 52 in second class booked ahead, and it covers both the Swiss trains to the border and the buses on the Liechtenstein side. The train-and-bus pairing that actually connects, and the order a day should run in, are the mechanics – they exist and they matter, and they are not on this page.",
  ],
  [
    "How many days do you need in Liechtenstein?",
    "One, and for most people one is the correct answer rather than a compromise. Two only with a reason – a long day up high. A week, no: the country cannot fill one on its own, and a week spent trying to see Liechtenstein is a week spent seeing it three times. In a decade of visiting from eighty minutes away I never once stayed longer than a single night.",
  ],
  [
    "Is Liechtenstein part of Switzerland?",
    "No – it is a sovereign country, a principality with its own prince, parliament and laws. The reason almost everyone asks is that nothing on the ground says otherwise: Liechtenstein has been in a customs union with Switzerland for a century, it uses the Swiss franc, and there is no border control arriving from the Swiss side. You cross a bridge over the Rhine and you are in a different country, with no barrier, no booth and nobody asking anything.",
  ],
  [
    "Is Liechtenstein in the EU?",
    "No. It is in the European Economic Area, in EFTA, and in the Schengen area – three memberships that people routinely collapse into one – and it is not a member of the European Union. In practice that combination is invisible to a visitor: Schengen rules govern your entry, and the Swiss franc governs your wallet.",
  ],
  [
    "Do you need a visa or a passport for Liechtenstein?",
    "There is no separate Liechtenstein visa. It is a Schengen state, so whatever permitted you to enter Switzerland or Austria covers this too, and for most European, British and American passports that means nothing at all to arrange. Carry your passport anyway, even though nobody at the border is going to ask for it – because there is nobody at the border.",
  ],
  [
    "Does Liechtenstein have an airport, and how do you get there?",
    "No – Liechtenstein has no airport, which catches people out, because almost every other country on a European itinerary has one. You arrive by land: a train to a border station and a bus across. From the Swiss side the gateways are Sargans and Buchs, both on the main line and both reachable direct from Zürich; from the Austrian side it is Feldkirch. A Saver Day Pass at CHF 52 covers the whole return including the buses. Which bus meets which train is the part that decides whether a day works, and that is guide territory.",
  ],
  [
    "Is Liechtenstein expensive?",
    "Swiss prices for anything you buy, and close to free for the day itself. The customs union and the franc mean that at the till it simply is Switzerland, so a coffee costs what a coffee costs in Zürich – but almost nothing you came for charges admission. The castle you cannot enter anyway, the paths above the valley are public rights of way, and the bridge over the Rhine is a bridge. The unavoidable line is reaching the country, which is CHF 52 for a Saver Day Pass. The only line with real range after that is the bed: there are very few in the country and they are priced like Switzerland's.",
  ],
  [
    "Can you visit Vaduz Castle?",
    "No. It is the Prince's home and it is closed to the public – you can walk up to the walls and look, and the view of it from the town below is genuinely good, but you are not going inside. This is worth knowing before you build a day around it, because the castle is the image that sells the country and it is the one thing you cannot actually do.",
  ],
  [
    "What is there to do in Liechtenstein besides Vaduz?",
    "Walk, mostly – the country's real asset is the ground above the valley rather than the capital below it. The Fürstensteig is the famous path, cut into the cliff in the 1890s, wire-rope secured and seasonal; the Liechtenstein Trail runs 75 km through all eleven municipalities and takes about three days; and Malbun is the one small ski area. Being straight with you: I have walked the high ground around Gaflei, and I have not walked the Fürstensteig, the full trail, or been up to Malbun at all – so treat those three as facts about the country rather than recommendations from me.",
  ],
  [
    "Can you get a Liechtenstein passport stamp?",
    "Yes, but it is a souvenir, not an entry stamp. It is sold over a counter at the tourist office in Vaduz, it is officially sanctioned and it does not invalidate the document – but there is no border control to stamp anything, so what you are buying is a country selling proof of a frontier it deliberately removed. Worth two minutes if you collect them. Not worth building the visit around, which is the trap: a lot of people come for the stamp, photograph the castle and leave, and then report that the country is empty.",
  ],
  [
    "Is Liechtenstein worth visiting in winter?",
    "It becomes a smaller country. The high paths shut, the valley turns grey, and what is left is the capital and its museums, which is an afternoon rather than a day. Malbun runs as a small family ski area through the winter – I have never been up there, so that is a fact about the country and not a recommendation. If the walking is what brings you, come between June and October instead.",
  ],
  [
    "Can you walk across the whole of Liechtenstein?",
    "Yes, twice over. The Liechtenstein Trail runs 75 km through all eleven municipalities, links 135 marked points of interest, opened for the country's three hundredth birthday, and takes roughly three days – it is a walking holiday rather than a hiking one, and most of it follows the valley and the lower slopes. Separately, and more strangely: one of the six long-distance trails that cross Switzerland end to end starts here. The Via Alpina runs from Vaduz to Montreux, and its first stage walks you out of Liechtenstein and into Switzerland in a single day.",
  ],
];

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

// Empty until the day-trip SKU publishes. The fetch is left un-scoped on
// purpose, so the guide section and the BuyBox appear with no code change the
// moment the doc is written.
const GUIDE_BLURBS = {};

async function fetchLiechtensteinContent() {
  try {
    return await client.fetch(
      `{
        "guides": *[_type == "story" && status == "published" && guide.hasGuide == true && destination->slug.current == "liechtenstein" && (language == "en" || !defined(language))] | order(durationDays desc){
          title, "slug": coalesce(guide.pageSlug, slug.current), subtitle, durationDisplay, heroImage,
          "prices": coalesce(guide.customPrices, guide.pricingTier->prices)
        },
        "stories": *[_type == "story" && status == "published" && guide.hasGuide != true && destination->slug.current == "liechtenstein" && (language == "en" || !defined(language))] | order(publishedDate desc){
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

export default async function LiechtensteinDestinationPage() {
  const { guides, stories } = await fetchLiechtensteinContent();
  const guide = guides?.[0] ?? null;
  const guidePrice = Array.isArray(guide?.prices)
    ? guide.prices.find((p) => p?.currency === "EUR")
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Liechtenstein: is it worth visiting, and is a day enough",
        description:
          "Whether Liechtenstein is worth visiting, whether a day is enough, how you get there with no airport, what it costs, and why the valley floor is the worst of it.",
        datePublished: "2026-09-11",
        dateModified: "2026-09-11",
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        // Country, not AdministrativeArea: the schema is a statement, and the
        // page's highest-volume question is "is it part of Switzerland?".
        // sameAs disambiguates the entity, which matters more here than on any
        // other hub for exactly that reason.
        about: {
          "@type": "Country",
          name: "Liechtenstein",
          sameAs: [
            "https://en.wikipedia.org/wiki/Liechtenstein",
            "https://www.wikidata.org/wiki/Q347",
          ],
        },
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://testedroutes.com/destinations/liechtenstein",
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
        <span className="text-slate-600">Liechtenstein</span>
      </nav>

      <header className="mb-8">
        <p className="text-[12px] uppercase tracking-[0.1em] text-slate-500">
          Switzerland &amp; the Alps · The Rhine valley
        </p>
        <h1 className="mt-1 font-bold md:font-medium leading-tight text-slate-900 text-3xl md:text-5xl">
          Liechtenstein
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-500">
          Whether the sixth-smallest country in the world is worth your day – and
          why the two-hour version is the reason people say there is nothing here.
        </p>
        <Byline lang="en" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          {/* Hero slot — see the IMAGES note at the top of this file. */}

          <div className="space-y-14">
            <section className="space-y-4">
              <SectionHeading>
                Is Liechtenstein worth it, and what do you actually do there
              </SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The first time I went, we stopped on the way to somewhere else.
                We were driving to Austria, Vaduz was roughly on the route, so we
                pulled in, walked around the capital, photographed the castle on
                its crag from below and got back in the car. I left thinking what
                you would expect me to think: a tidy main street, some banks, a
                castle you cannot go into. Nothing here. I lived eighty minutes
                away for a decade after that and kept going back, and the verdict
                turned out to be fair on the evidence and completely wrong.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Liechtenstein is not spread out, it is stacked. The valley floor
                is the least interesting layer of it and it is the only one a bus
                stop shows you. Four hundred metres above the shops there is a
                shelf of villages where people still speak a German their
                ancestors carried over the mountains in the Middle Ages. Above
                that the ground goes to rock, the Austrian border runs along the
                crest, and a ruined castle called Schalun stands on a crag with
                the whole Rhine valley underneath it. What you actually do here
                is climb out of the bottom layer, and it takes about twenty
                minutes.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The honest limits. It will not fill a week – this is a country
                you take seriously for one day, not casually for three.
                Everything you buy is priced like Switzerland, because at the
                till it effectively is Switzerland. The castle stays shut
                whatever you do, because the Prince lives in it. And there is
                genuinely not much to do down in the valley, which is the
                complaint people make and the reason they make it.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>When to go</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Liechtenstein has two seasons that work and two that do not, and
                the split is about altitude rather than temperature: the months
                that open the high ground are the months worth coming for,
                because the high ground is the country.
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
                This is the question the country answers most cleanly, and the
                answer is smaller than people expect: a day, done properly. The
                interesting part is that the difference between four hours and
                thirty hours here is not a matter of degree – it is the whole
                decision.
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
                  is the day done for you, in the order it has to run.
                </p>
              ) : null}
            </section>

            <section className="space-y-6">
              <SectionHeading>The country, by altitude</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Liechtenstein is three bands stacked on top of each other rather
                than a set of places spread out across a map. You do not do these
                in an order – you choose which of them your day is about, and
                that choice decides which country you saw.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {REGIONS.map((region) => (
                  <article
                    key={region.name}
                    className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card"
                  >
                    {region.image ? (
                      <Image
                        src={region.image}
                        alt={region.alt}
                        className="aspect-[4/3] w-full object-cover"
                        sizes="(max-width: 640px) 100vw, 380px"
                      />
                    ) : null}
                    <div className="space-y-2 p-5">
                      <h3 className="font-serif text-xl text-brand-ink">{region.name}</h3>
                      <p className="text-[14px] leading-relaxed text-slate-700">{region.body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Two parts of the country are missing from that list on purpose.
                Malbun, the one small ski area, sits in a bowl at the eastern end
                and I have never been up there. The Unterland – the northern half,
                flat and quiet, which was a separate territory until it and Vaduz
                were joined into one principality – sees almost no visitors, and I
                have not walked it either. Both are real and both are named here;
                neither gets sold to you by someone who has not seen them.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>Getting there and around</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Liechtenstein has no airport. You arrive by land, which in
                practice means a train to a border station and a bus across: from
                the Swiss side the gateways are Sargans and Buchs, both on the
                main line and both direct from Zürich, and from the Austrian side
                it is Feldkirch. Driving works too, and the country is small
                enough to cross in well under an hour.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                The part that surprises people is that nothing happens at the
                border. There has been a customs union with Switzerland for a
                century and there is no control on the Swiss side – no barrier, no
                booth, nobody asking anything. You cross a bridge over the Rhine
                and you are in a different country, and if you were not reading
                the sign you would not know. Two things follow: the money is Swiss
                francs, so whatever you have been using all week keeps working;
                and the paperwork is Schengen paperwork, so there is no separate
                Liechtenstein visa to arrange.
              </p>
              <p className="text-[15px] leading-relaxed text-slate-700">
                What does not work is treating it as an airport-to-airport
                destination. It is a place you reach from somewhere else, and that
                is most of its character.
              </p>
            </section>

            <section className="space-y-4">
              <SectionHeading>What it costs</SectionHeading>
              <p className="text-[15px] leading-relaxed text-slate-700">
                Liechtenstein is expensive to consume and cheap to experience, and
                the second half surprises people. Everything you buy is priced
                like Switzerland, because the customs union and the franc mean
                that at the till it simply is Switzerland. But almost nothing you
                came for charges admission: the castle you cannot enter anyway,
                the paths above the valley are public rights of way, and the
                bridge over the Rhine is a bridge. The one line nobody can avoid
                is reaching the country, and it is small – a Saver Day Pass is
                <strong> CHF 52</strong> in second class booked ahead, and it
                covers the Swiss trains to the border and the buses on the
                Liechtenstein side. That is what getting there costs, not what the
                trip costs; the rest is a decision:
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
                The bed is the only line with real range. There are very few of
                them in the country and they are priced like Switzerland's, so
                whether you stay the night is the decision that moves your total –
                not the meals, and certainly not the sights. Which is why the
                splurge here buys more hours rather than a better room.
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

            {/* Closing full-width photo slot — see the IMAGES note at the top. */}

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
                <SectionHeading>Stories from Liechtenstein</SectionHeading>
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

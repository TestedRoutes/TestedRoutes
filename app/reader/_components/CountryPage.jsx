import Image from "next/image";
import Link from "next/link";
import { getRequestCurrency } from "../../_lib/currency";
import { photoFor } from "../_lib/photos";
import { readerPaths, placeIndex, dayBadge, daySpan, titleCase, categoryLabel, directionsHref, longDate } from "../_lib/format";
import { pinsForMap } from "../_lib/serialise";
import { countryPrice, routesWithCommerce } from "../_lib/commerce";
import RouteMap from "./RouteMap";
import RoutesChooser from "./RoutesChooser";
import ReaderBuyBox from "./ReaderBuyBox";
import Timeline from "./Timeline";
import Callout from "./Callout";
import PlaceFacts from "./PlaceFacts";
import AffiliateSlot from "./AffiliateSlot";

/**
 * The country guide page. Two states from one component:
 *
 *   owned=false  the storefront — what every ungated URL under
 *                /reader/<country> renders (a 200, never a 403): hero, map
 *                preview with the sample pins live and the rest greyed, the
 *                routes chooser, the open sample day, kept-current, the buy
 *                box. The free layer of the destination page plus the four
 *                paid-layer sections.
 *   owned=true   the reader's Overview tab: the same hero and chooser with
 *                the buy box gone and every route open.
 *
 * Titles follow search intent ("Fiji Itinerary"); the brand claim lives in
 * the subtitle.
 */
const FAQ = [
  ["Is Fiji good for a honeymoon?", "Yes – it might be the best-value honeymoon in the South Pacific, but the answer depends on which Fiji you book. One resort island for two weeks is the default and wastes what makes Fiji special: the variety. The honeymoon that works runs the island chain – a few stops, each with its own bay, reef and rhythm – then flies east to the rainforest."],
  ["How many days do you need in Fiji?", "A week covers the Yasawa islands properly. Ten days adds Taveuni and its reef, and is the most-searched length for a reason. Two weeks is the honeymoon shape – the same trip at a pace where no island is rushed. A single day between flights is genuinely usable too, because Nadi is the region's transit hub."],
  ["When is the best time to visit Fiji?", "May to October – the dry season, with clearer water and the mantas feeding. July and August are the busiest of it, and December and January carry holiday pricing on top of the wet."],
];

export default async function CountryPage({ data, owned }) {
  const c = data.country;
  const currency = await getRequestCurrency();
  const price = countryPrice(c, currency);
  const routes = await routesWithCommerce(data.routes, currency);
  const hero = photoFor(c.slug, c.heroPhoto);
  const places = placeIndex({ places: data.places });

  const samplePins = new Set(data.sample.pins);
  const previewPins = pinsForMap(c.slug, data.places, {
    muted: owned ? new Set() : new Set(data.places.map((p) => p.pinId).filter((id) => !samplePins.has(id))),
    link: owned,
  });
  const samplePage = data.sample.page;
  const sampleRoute = data.sample.route;
  const samplePlace = data.places.find((p) => samplePins.has(p.pinId) && p.photoRef) || data.places.find((p) => samplePins.has(p.pinId));
  const samplePhoto = samplePlace ? photoFor(c.slug, samplePlace.photoRef) : null;

  return (
    <div className={owned ? "" : "min-h-screen"}>
      {!owned ? (
        <header className="border-b border-brand-line">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
            <Link href="/" className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-ink">TestedRoutes</Link>
            <Link href="/destinations/fiji" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">All of Fiji →</Link>
          </div>
        </header>
      ) : null}

      <div className={owned ? "" : "mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12"}>
        <div className={owned ? "" : "grid gap-10 lg:grid-cols-[1fr_20rem]"}>
          <div className="min-w-0">
            {/* Hero */}
            <section className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-terracotta">
                  {owned ? "Your guide" : "Tested itineraries"}
                </p>
                <h1 className="mt-2 text-4xl leading-[1.05] md:text-5xl">{c.title}</h1>
                {c.subtitle ? <p className="mt-3 text-lg leading-snug text-slate-700">{c.subtitle}</p> : null}
                {c.creatorLine ? <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.1em] text-slate-500">{c.creatorLine}</p> : null}
                {c.intro ? <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{c.intro}</p> : null}
              </div>
              {hero ? (
                <Image src={hero} alt={c.heroAlt || ""} placeholder="blur" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/3] w-full rounded-2xl object-cover" priority />
              ) : (
                <div className="aspect-[4/3] w-full rounded-2xl bg-brand-bone" />
              )}
            </section>

            {/* Map preview */}
            <section className="mt-10">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl">{owned ? "Every tested place" : "The map"}</h2>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {data.places.length} tested places{owned ? "" : ` · ${samplePins.size} open`}
                </p>
              </div>
              <div className="mt-3 h-[360px] md:h-[440px]">
                <RouteMap pins={previewPins} height="100%" maxZoom={9} />
              </div>
              {!owned ? (
                <p className="mt-2 text-sm text-slate-600">The grey pins open with the guide, each with a photo, what to expect, how to get there and how long it takes.</p>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Tap a pin to open its card. The full grid with filters is under <Link href={readerPaths.spots(c.slug)} className="font-bold text-brand-terracotta">Spots</Link>.</p>
              )}
            </section>

            {/* Routes chooser */}
            <section className="mt-10">
              <h2 className="text-2xl">Routes through Fiji</h2>
              <p className="mt-1 text-sm text-slate-600">Every route shares the same tested places. Pick the length that fits the trip you are actually taking.</p>
              <div className="mt-4">
                <RoutesChooser country={c.slug} routes={routes} owned={owned} />
              </div>
            </section>

            {/* Sample day (storefront only) */}
            {!owned && samplePage && sampleRoute ? (
              <section className="mt-10">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
                  Sample · {sampleRoute.sku.title.replace(":", " ·")} · {dayBadge(samplePage)}
                  {daySpan(samplePage) ? ` · ${daySpan(samplePage)}` : ""}
                </p>
                <h2 className="mt-1 text-3xl leading-tight">{titleCase(samplePage.title)}</h2>
                {samplePage.subtitle ? <p className="mt-2 text-[17px] leading-snug text-slate-700">{samplePage.subtitle}</p> : null}
                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1fr]">
                  <div>
                    <p className="mb-4 font-script text-lg text-brand-terracotta">the plan</p>
                    <Timeline country={null} page={samplePage} places={places} />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {samplePage.callouts.map((co, i) => (
                      <Callout key={i} callout={co} />
                    ))}
                    {samplePlace ? (
                      <article className="mt-2 rounded-2xl border border-brand-line bg-white/70 p-4">
                        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">One place card</p>
                        {samplePhoto ? (
                          <Image src={samplePhoto} alt={samplePlace.name} placeholder="blur" sizes="(min-width: 768px) 30vw, 100vw" className="mt-2 aspect-[4/3] w-full rounded-xl object-cover" />
                        ) : null}
                        <h3 className="mt-3 text-xl leading-tight">{samplePlace.name}</h3>
                        <p className="mt-0.5 font-sans text-[11px] text-slate-500">{categoryLabel(samplePlace.category)}{samplePlace.region ? ` · ${samplePlace.region}` : ""}</p>
                        {samplePlace.description ? <p className="mt-2 text-sm text-slate-700">{samplePlace.description}</p> : null}
                        <PlaceFacts attributes={samplePlace.attributes} />
                        <div className="mt-3 flex flex-wrap gap-2">
                          {directionsHref(samplePlace) ? (
                            <a href={directionsHref(samplePlace)} target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">Directions →</a>
                          ) : null}
                          <AffiliateSlot goSlug={samplePlace.goSlug} label={samplePlace.category === "stay" ? "Check rates" : "Book"} />
                        </div>
                      </article>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Kept current */}
            <section className="mt-10 rounded-2xl border border-brand-line bg-white/70 p-5 md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-xl">Kept current</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Last verified on the ground {longDate(c.verified) || "—"}. When a boat timetable, a price or a booking rule changes, the guide changes with it; the version you open is always the current one.
                </p>
              </div>
              {sampleRoute?.contentHash ? (
                <p className="mt-3 shrink-0 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500 md:ml-6 md:mt-0">content {sampleRoute.contentHash.slice(0, 8)}</p>
              ) : null}
            </section>

            {!owned ? (
              <>
                <section className="mt-10">
                  <h2 className="text-2xl">What is inside</h2>
                  <ul className="mt-3 grid gap-2 text-[15px] text-slate-700 md:grid-cols-2">
                    {[
                      `${data.places.length} tested places, each with a photo, what to expect and how to get there`,
                      "Hour-by-hour timelines for every day of every route",
                      "The bookings checklist with lead times, in the order to make them",
                      "The pack list for boats and small planes",
                      "Stays by tier at every stop, with the tested pick named",
                      "Directions to every pin from wherever you stand",
                    ].map((t) => (
                      <li key={t} className="flex gap-2"><span aria-hidden className="text-brand-terracotta">✓</span><span>{t}</span></li>
                    ))}
                  </ul>
                </section>
                <section className="mt-10">
                  <h2 className="text-2xl">Questions</h2>
                  <dl className="mt-3 divide-y divide-brand-line">
                    {FAQ.map(([q, a]) => (
                      <div key={q} className="py-3">
                        <dt className="font-sans text-[15px] font-bold">{q}</dt>
                        <dd className="mt-1 text-[15px] leading-relaxed text-slate-700">{a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <p className="mt-10 text-xs text-slate-500">
                  Prefer the route pages? <Link href="/guides/fiji-honeymoon-14-days" className="underline">Fiji 14-Day Honeymoon Itinerary</Link> · <Link href="/destinations/fiji" className="underline">Fiji, the decision page</Link>
                </p>
              </>
            ) : (
              <section className="mt-8 flex flex-wrap gap-2">
                {[["spots", "Spots"], ["itineraries", "Itineraries"], ["bookings", "Bookings"], ["pack", "Pack"], ["tips", "Tips"]].map(([k, l]) => (
                  <Link key={k} href={readerPaths[k](c.slug)} className="rounded-full bg-white/70 px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-slate-700 hover:bg-white">{l} →</Link>
                ))}
              </section>
            )}
          </div>

          {!owned ? (
            <div id="get-the-guide" className="scroll-mt-6 lg:sticky lg:top-6 lg:self-start">
              <ReaderBuyBox
                country={c.slug}
                priceLabel={price?.label || null}
                priceAmount={price?.amount ?? null}
                priceCurrency={price?.currency || null}
                checkoutHref={null}
                unlockTo={readerPaths.country(c.slug)}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Phone: the buy box sits at the end of a long page, so a compact bar
          keeps the price and the button in reach; it jumps to the box. */}
      {!owned && price ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-line bg-brand-parchment/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <a href="#get-the-guide" className="flex items-center justify-between gap-3">
            <span>
              <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">The full guide</span>
              <span className="block text-xl font-semibold text-slate-900">{price.label}</span>
            </span>
            <span className="rounded-full bg-brand-flame px-5 py-2.5 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-white">Get the guide</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}

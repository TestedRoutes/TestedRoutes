import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestCurrency } from "../../../../../../_lib/currency";
import { hasReaderAccess } from "../../../../_lib/access";
import { loadReaderCountry } from "../../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../../_lib/track";
import { routesWithCommerce } from "../../../../_lib/commerce";
import { photoFor } from "../../../../_lib/photos";
import { categoryLabel, dayBadge, dayChip, dayHref, placeIndex, readerPaths, routePinsInOrder, titleCase, CATEGORY } from "../../../../_lib/format";
import DayChips from "../../../../_components/DayChips";
import RouteOverviewMap from "../../../../_components/RouteOverviewMap";
import LockedBox from "../../../../_components/LockedBox";

/** The distinct places of a day page, in stop order. */
function dayStops(page, places) {
  const seen = new Set();
  const out = [];
  for (const s of page.slots) {
    if (!s.pinId || seen.has(s.pinId)) continue;
    const place = places.get(s.pinId);
    if (!place) continue;
    seen.add(s.pinId);
    out.push({ place, title: s.title });
  }
  return out;
}

/**
 * The itinerary overview (founder's mock, 2026-09-20): left, the route's
 * eyebrow, title and one line, the day chips, then one card per day with
 * its stops as photo tiles ("name · category • time") and the day's one-line
 * summary; right, the whole route on a map that stays put while the days
 * scroll, every stop pinned "1a, 1b, 2a…" and a chip per day to show one
 * day alone. Photos and names are the shop window, so every day shows its
 * tiles; without access only the sample day links through, the others say
 * "With the guide". The route's price sits top right and buys through the
 * same checkout as its card.
 */
export default async function ReaderItinerary({ params }) {
  const { country, sku: skuSlug } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const route = data.routes.find((r) => r.slug === skuSlug && r.sku);
  if (!route) notFound();
  const sku = route.sku;
  const owned = await hasReaderAccess();
  const sampleDay = data.sample.routeSlug === skuSlug ? data.sample.day : null;
  trackReaderView(country, "itinerary", { route: skuSlug, access: owned });

  const places = placeIndex({ places: data.places });
  const order = routePinsInOrder(sku);
  const dayOpen = (page) => owned || (sampleDay != null && page.dayFrom <= sampleDay && sampleDay <= page.dayTo);
  const [commerce] = owned ? [null] : await routesWithCommerce([route], await getRequestCurrency());

  // Pins in trip order, "1a, 1b, 2a…": the day number and the stop's letter
  // within it. A place that recurs on a later day gets a pin per day.
  const pins = [];
  for (const page of sku.days) {
    dayStops(page, places).forEach(({ place }, i) => {
      if (place.lat == null || place.lng == null) return;
      pins.push({
        id: `${place.pinId}-${page.dayFrom}`,
        day: page.dayFrom,
        name: place.name,
        sub: `${dayBadge(page)} · ${categoryLabel(place.category)}`,
        lat: place.lat,
        lng: place.lng,
        kind: "number",
        label: `${page.dayFrom}${String.fromCharCode(97 + i)}`,
        photoUrl: null,
        href: dayOpen(page) ? readerPaths.spot(country, place.pinId) : null,
      });
    });
  }
  const dayChipsForMap = sku.days.map((d) => ({ dayFrom: d.dayFrom, label: `Day ${dayChip(d)}`, title: titleCase(d.title) }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <Link href={readerPaths.itineraries(country)} className="rounded-full bg-white px-4 py-2 font-sans text-[13px] font-semibold text-brand-ink ring-1 ring-brand-line hover:bg-brand-ink/5">← Itineraries</Link>
          {commerce?.priceLabel ? (
            commerce.checkoutHref ? (
              <a href={commerce.checkoutHref} className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-brand-terracotta hover:text-brand-ink">{commerce.priceLabel}</a>
            ) : (
              <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">{commerce.priceLabel}</span>
            )
          ) : null}
        </div>
        <p className="mt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {data.country.name} • {route.days} days • {order.length} stops
        </p>
        <h2 className="mt-1 text-3xl leading-tight md:text-4xl">{route.title}</h2>
        {route.who ? <p className="mt-2 text-[15px] leading-snug text-slate-600">{route.who}</p> : null}
        <hr className="my-5 border-brand-line" />
        <DayChips country={country} sku={sku} current={null} />

        <ol className="mt-4 grid gap-4">
          {sku.days.map((page) => {
            const stops = dayStops(page, places);
            const open = dayOpen(page);
            const stub = page.slots.length === 0;
            const head = (
              <span className="flex items-baseline gap-3">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{dayBadge(page)}</span>
                <span className="text-xl">{titleCase(page.title)}</span>
              </span>
            );
            return (
              <li key={page.dayFrom} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brand-line">
                <div className="flex items-baseline justify-between gap-3">
                  {open && !stub ? (
                    <Link href={dayHref(country, skuSlug, page)} className="group min-w-0 hover:text-brand-terracotta">{head}</Link>
                  ) : (
                    <div className="min-w-0">{head}</div>
                  )}
                  <span className="shrink-0 font-sans text-[11px] text-slate-500">
                    {stub ? "Pending" : !open ? "With the guide" : `${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
                  </span>
                </div>
                {stops.length ? (
                  <ul className="mt-3 grid grid-cols-3 gap-2">
                    {stops.map(({ place, title }) => {
                      const photo = photoFor(country, place.photoRef);
                      const tile = (
                        <>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-parchment ring-1 ring-inset ring-brand-line">
                            {photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={photo.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-3xl text-brand-terracotta/70">{CATEGORY[place.category]?.glyph || "◎"}</span>
                            )}
                          </div>
                          <p className="mt-2 truncate font-sans text-[13px] font-semibold text-slate-900">{place.name || title}</p>
                          <p className="truncate font-sans text-[11px] text-slate-500">
                            {categoryLabel(place.category)}{place.attributes?.time_short ? ` • ${place.attributes.time_short}` : ""}
                          </p>
                        </>
                      );
                      return (
                        <li key={place.pinId} className="min-w-0">
                          {open ? <Link href={readerPaths.spot(country, place.pinId)} className="block hover:text-brand-terracotta">{tile}</Link> : tile}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {page.subtitle ? <p className="mt-3 text-[13px] leading-snug text-slate-600">{page.subtitle}</p> : null}
              </li>
            );
          })}
        </ol>
        {!owned ? (
          <div className="mt-8">
            <LockedBox data={data} what={`${route.title}: every day timed hour by hour, with its stops and bookings.`} />
          </div>
        ) : null}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="h-[380px] overflow-hidden rounded-2xl ring-1 ring-brand-line lg:h-[calc(100vh-8rem)]">
          <RouteOverviewMap pins={pins} days={dayChipsForMap} maxZoom={10} />
        </div>
      </div>
    </div>
  );
}

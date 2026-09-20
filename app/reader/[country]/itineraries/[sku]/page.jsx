import Link from "next/link";
import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../_lib/track";
import { dayBadge, dayHref, placeIndex, readerPaths, routePinsInOrder, stopNumbers, titleCase, CATEGORY } from "../../../_lib/format";
import { pinsForMap } from "../../../_lib/serialise";
import DayChips from "../../../_components/DayChips";
import RouteMap from "../../../_components/RouteMap";

/**
 * The itinerary overview, the Rexby itinerary page in the brand's clothes:
 * left, what you will do and every day as a stop list; right, the whole
 * route on one map with the trip line and the stops numbered in trip order.
 * A day heading opens the hour rail.
 */
export default async function ReaderItinerary({ params }) {
  const { country, sku: skuSlug } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const route = data.routes.find((r) => r.slug === skuSlug && r.sku);
  if (!route) notFound();
  const sku = route.sku;
  trackReaderView(country, "itinerary", { route: skuSlug });

  const places = placeIndex({ places: data.places });
  const order = routePinsInOrder(sku);
  const numbered = new Map(order.map((pin, i) => [pin, i + 1]));
  const optional = new Set(sku.skuPlaces.filter((j) => j.role === "extra" || j.role === "detour").map((j) => j.pinId));
  const pins = pinsForMap(country, data.places.filter((p) => numbered.has(p.pinId) || optional.has(p.pinId)), { numbered });
  const line = order.map((pin) => places.get(pin)).filter((p) => p?.lat != null).map((p) => [p.lat, p.lng]);

  return (
    <>
      <Link href={readerPaths.itineraries(country)} className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">← Itineraries</Link>
      <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">{route.days} days · {order.length} stops</p>
          <h1 className="mt-1 text-3xl leading-tight">{route.title}</h1>
          {route.who ? <p className="mt-2 text-[16px] leading-snug text-slate-700">{route.who}</p> : null}
          {sku.sku.subtitle ? <p className="mt-2 text-[14px] text-slate-600">{sku.sku.subtitle}</p> : null}
          <div className="mt-5">
            <DayChips country={country} sku={sku} current={null} />
          </div>
          <ol className="mt-4 divide-y divide-brand-line">
            {sku.days.map((page) => {
              const nums = stopNumbers(page);
              return (
                <li key={page.dayFrom} className="py-4">
                  <Link href={dayHref(country, skuSlug, page)} className="group flex items-baseline justify-between gap-3">
                    <span>
                      <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">{dayBadge(page)}</span>
                      <span className="ml-2 text-xl group-hover:text-brand-terracotta">{titleCase(page.title)}</span>
                    </span>
                    <span className="shrink-0 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 group-hover:text-brand-terracotta">
                      {page.slots.length ? "Open the day →" : "Pending"}
                    </span>
                  </Link>
                  {page.slots.length ? (
                    <ul className="mt-2 space-y-1">
                      {page.slots.map((s, i) => {
                        const place = s.pinId ? places.get(s.pinId) : null;
                        return (
                          <li key={i} className="flex items-center gap-2 text-[14px] text-slate-700">
                            <span aria-hidden className="w-5 text-center text-slate-400">{CATEGORY[place?.category]?.glyph || "·"}</span>
                            {place ? (
                              <Link href={readerPaths.spot(country, place.pinId)} className="hover:text-brand-terracotta">{s.title}</Link>
                            ) : (
                              <span>{s.title}</span>
                            )}
                            {nums[i] ? <span className="font-sans text-[10px] font-bold text-brand-terracotta">{nums[i]}</span> : null}
                            {place && optional.has(place.pinId) ? <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-slate-500">Optional</span> : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[13px] text-slate-500">{page.subtitle}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="h-[380px] lg:h-[calc(100vh-6rem)]">
            <RouteMap pins={pins} line={line} height="100%" maxZoom={10} />
          </div>
          <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500">Numbered in trip order · dots are optional extras</p>
        </div>
      </div>
    </>
  );
}

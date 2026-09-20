import Link from "next/link";
import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../../../_lib/track";
import { dayBadge, dayHref, daySpan, placeIndex, pageForDay, readerPaths, stopNumbers, titleCase } from "../../../../../_lib/format";
import { pinsForMap } from "../../../../../_lib/serialise";
import DayChips from "../../../../../_components/DayChips";
import DayView from "../../../../../_components/DayView";
import Timeline from "../../../../../_components/Timeline";
import StopList from "../../../../../_components/StopList";
import Callout from "../../../../../_components/Callout";
import RouteMap from "../../../../../_components/RouteMap";

/**
 * One day: chips, header, the hour rail (with the stop-list toggle), the
 * deck's callouts, prev/next; the day's map beside it on a laptop, under it
 * on a phone. /day/<n> resolves to the page covering calendar day n.
 */
export default async function ReaderDay({ params }) {
  const { country, sku: skuSlug, n } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const route = data.routes.find((r) => r.slug === skuSlug && r.sku);
  if (!route) notFound();
  const sku = route.sku;
  const page = pageForDay(sku, n);
  if (!page) notFound();
  trackReaderView(country, "day", { route: skuSlug, day: page.dayFrom });

  const idx = sku.days.indexOf(page);
  const prev = idx > 0 ? sku.days[idx - 1] : null;
  const next = idx < sku.days.length - 1 ? sku.days[idx + 1] : null;
  const span = daySpan(page);
  const places = placeIndex({ places: data.places });
  const stub = page.slots.length === 0;
  const optional = new Set(sku.skuPlaces.filter((j) => j.role === "extra" || j.role === "detour").map((j) => j.pinId));

  const nums = stopNumbers(page);
  const numbered = new Map();
  page.slots.forEach((s, i) => { if (nums[i]) numbered.set(s.pinId, nums[i]); });
  const dayPlaces = data.places.filter((p) => numbered.has(p.pinId));
  const pins = pinsForMap(country, dayPlaces, { numbered });
  const line = page.slots.filter((s) => s.pinId && places.get(s.pinId)?.lat != null).map((s) => { const p = places.get(s.pinId); return [p.lat, p.lng]; });

  return (
    <>
      <DayChips country={country} sku={sku} current={page} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="min-w-0">
          <header>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
              {route.title} · {dayBadge(page)}{span ? ` · ${span}` : ""}
            </p>
            <h1 className="mt-1 text-3xl leading-tight">{titleCase(page.title)}</h1>
            {page.subtitle ? <p className="mt-2 text-[17px] leading-snug text-slate-700">{page.subtitle}</p> : null}
          </header>

          {stub ? (
            <div className="mt-6 rounded-xl border border-dashed border-brand-ink/25 px-4 py-6 text-center">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">Timeline pending</p>
              <p className="mt-1 text-sm text-slate-500">This day renders once the deck extraction runs. Day 2 shows the finished shape.</p>
            </div>
          ) : (
            <section className="mt-6">
              <DayView
                rail={<Timeline country={country} page={page} places={places} />}
                list={<StopList country={country} page={page} places={places} optionalPins={optional} />}
              />
            </section>
          )}

          {page.callouts.length ? (
            <section className="mt-7 flex flex-col gap-2.5">
              {page.callouts.map((c, i) => <Callout key={i} callout={c} />)}
            </section>
          ) : null}

          <nav className="mt-9 flex justify-between gap-4 border-t border-brand-line pt-4 font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
            {prev ? (
              <Link href={dayHref(country, skuSlug, prev)} className="text-slate-600 hover:text-brand-terracotta">← {dayBadge(prev)} · {titleCase(prev.title)}</Link>
            ) : (
              <Link href={readerPaths.itinerary(country, skuSlug)} className="text-slate-600 hover:text-brand-terracotta">← Overview</Link>
            )}
            {next ? (
              <Link href={dayHref(country, skuSlug, next)} className="text-right text-slate-600 hover:text-brand-terracotta">{dayBadge(next)} · {titleCase(next.title)} →</Link>
            ) : null}
          </nav>
        </div>
        <div className="lg:sticky lg:top-8 lg:self-start">
          {pins.length ? (
            <>
              <div className="h-[320px] lg:h-[calc(100vh-6rem)]">
                <RouteMap pins={pins} line={line} height="100%" maxZoom={12} />
              </div>
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500">Stops numbered as on the rail</p>
            </>
          ) : (
            <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-brand-ink/25 text-sm text-slate-500">No located stops on this page yet</div>
          )}
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../../../_lib/access";
import { loadReaderCountry } from "../../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../../_lib/track";
import { photoFor } from "../../../../_lib/photos";
import { categoryLabel, directionsHref, readerPaths, distanceKm, kmLabel } from "../../../../_lib/format";
import { pinsForMap } from "../../../../_lib/serialise";
import PlaceFacts from "../../../../_components/PlaceFacts";
import AffiliateSlot from "../../../../_components/AffiliateSlot";
import RouteMap from "../../../../_components/RouteMap";
import SaveButton from "../../../../_components/SaveButton";
import LockedBox from "../../../../_components/LockedBox";

/** SKU code "fiji-14d" → the places.yaml skus key "14D". */
const skuKey = (sku) => sku.sku.skuCode.split("-").pop().toUpperCase();

/**
 * One place card: photo, what it is, the practical facts, where it sits in
 * each route, a small map, what is nearby, Directions, the bookmark and the
 * affiliate slot. Locked for visitors without access unless it is a sample
 * pin: they see the photo, the name and the buy box.
 */
export default async function ReaderSpot({ params }) {
  const { country, pin } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const place = data.places.find((p) => p.pinId === pin);
  if (!place) notFound();
  const owned = await hasReaderAccess();
  const open = owned || data.sample.pins.includes(pin);
  trackReaderView(country, "spot", { pin, access: owned });

  const photo = photoFor(country, place.photoRef);
  const back = (
    <Link href={readerPaths.places(country)} className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">← Places</Link>
  );

  if (!open) {
    return (
      <>
        {back}
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            {photo ? (
              <Image src={photo} alt={place.name} placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full rounded-2xl object-cover" priority />
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl bg-brand-bone" />
            )}
            <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
              {categoryLabel(place.category)}{place.region ? ` · ${place.region}` : ""}
            </p>
            <h1 className="mt-1 text-3xl leading-tight">{place.name}</h1>
          </div>
          <LockedBox data={data} what={`${place.name}: what to expect, how to get there, how long it takes, and where it sits in the route.`} />
        </div>
      </>
    );
  }

  const dir = directionsHref(place);
  const appearances = data.routes
    .filter((r) => r.sku)
    .map((r) => ({ route: r, entry: place.skus?.[skuKey(r.sku)] }))
    .filter((x) => x.entry);
  const nearby =
    place.lat != null
      ? data.places
          .filter((p) => p.pinId !== place.pinId && p.lat != null)
          .map((p) => ({ p, d: distanceKm(place, p) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 5)
      : [];
  const pins = pinsForMap(country, [place, ...nearby.map((n) => n.p)], { link: true }).map((x) =>
    x.id === place.pinId ? { ...x, kind: x.photoUrl ? "photo" : "number", label: "●" } : { ...x, kind: "dot" },
  );

  return (
    <>
      {back}
      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1fr]">
        <div>
          <div className="relative">
            {photo ? (
              <Image src={photo} alt={place.name} placeholder="blur" sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3] w-full rounded-2xl object-cover" priority />
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl bg-brand-bone" />
            )}
            <SaveButton country={country} pinId={place.pinId} size={44} className="absolute right-4 top-4" />
          </div>
          <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
            {categoryLabel(place.category)}{place.region ? ` · ${place.region}` : ""}
            {place.attributes?.time_short ? ` · ${place.attributes.time_short}` : ""}
          </p>
          <h1 className="mt-1 text-3xl leading-tight">{place.name}</h1>
          {place.description ? <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{place.description}</p> : null}
          <PlaceFacts attributes={place.attributes} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {dir ? (
              <a href={dir} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-ink px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-brand-cream">Directions →</a>
            ) : null}
            <AffiliateSlot goSlug={place.goSlug} label={place.category === "stay" ? "Check rates" : "Book"} />
          </div>
        </div>
        <div>
          <div className="h-[280px]">
            <RouteMap pins={pins} height="100%" maxZoom={12} />
          </div>
          {appearances.length ? (
            <section className="mt-5">
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">In the routes</h2>
              <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
                {appearances.map(({ route, entry }) => {
                  const page = entry.day != null ? route.sku.days.find((d) => d.dayFrom <= entry.day && entry.day <= d.dayTo) : null;
                  const href = page ? readerPaths.day(country, route.slug, page.dayFrom) : readerPaths.itinerary(country, route.slug);
                  return (
                    <li key={route.slug} className="px-3.5 py-2.5">
                      <Link href={href} className="font-sans text-[14px] font-bold hover:text-brand-terracotta">{route.title}</Link>
                      <p className="mt-0.5 font-sans text-[12px] text-slate-600">
                        {entry.day != null ? `Day ${entry.day}` : "Anytime"}
                        {entry.order != null ? ` · stop ${entry.order}` : ""}
                        {entry.role && entry.role !== "route" ? ` · ${entry.role}` : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
          {nearby.length ? (
            <section className="mt-5">
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Nearby</h2>
              <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
                {nearby.map(({ p, d }) => (
                  <li key={p.pinId} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                    <Link href={readerPaths.spot(country, p.pinId)} className="min-w-0 font-sans text-[14px] font-bold hover:text-brand-terracotta">{p.name}</Link>
                    <span className="shrink-0 font-sans text-[12px] tabular-nums text-slate-500">{categoryLabel(p.category)} · {kmLabel(d)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

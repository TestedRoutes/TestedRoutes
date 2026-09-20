import Link from "next/link";
import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { groupBy, placeIndex, directionsHref, readerPaths } from "../../_lib/format";
import AffiliateSlot from "../../_components/AffiliateSlot";

/**
 * Tips: the deck's prose pages as cards — stays by tier at every stop with
 * "Check rates →" (the affiliate slot), activities with their price, and
 * the fixed sections (costs, paperwork, good to know) as the extraction
 * fills them. Food, Do and Tips filters over one grid come with more
 * content; for now the sections stack.
 */
const TIER_MARK = { budget: "€", mid: "€€", splurge: "€€€" };

export default async function ReaderTips({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "tips");
  const places = placeIndex({ places: data.places });
  const routes = data.routes.filter((r) => r.sku);
  const stays = routes.flatMap((r) => r.sku.stayPicks.map((p) => ({ ...p, route: r })));
  const activities = routes.flatMap((r) => r.sku.activityRows.map((a) => ({ ...a, route: r })));
  const prose = routes.flatMap((r) => r.sku.sections.filter((s) => s.type !== "pack" && s.type !== "legal").map((s) => ({ ...s, route: r })));

  return (
    <>
      <h1 className="text-3xl leading-tight">Tips</h1>
      <p className="mt-1 text-slate-600">{stays.length} tested stays · by stop</p>

      {groupBy(stays, (p) => p.blockHeading).map(([heading, picks]) => (
        <section key={heading} className="mt-6">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">{heading}</h2>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {picks.map((p, i) => {
              const place = p.pinId ? places.get(p.pinId) : null;
              const dir = place ? directionsHref(place) : null;
              return (
                <article key={i} className="rounded-xl border border-brand-line bg-white/70 px-3.5 py-3">
                  {place ? (
                    <Link href={readerPaths.spot(country, place.pinId)} className="font-sans text-[15px] font-bold leading-tight hover:text-brand-terracotta">{p.name}</Link>
                  ) : (
                    <p className="font-sans text-[15px] font-bold leading-tight">{p.name}</p>
                  )}
                  <p className="mt-0.5 font-sans text-xs text-slate-600">{place?.region ? `${place.region} · ` : ""}{TIER_MARK[p.tier] || ""} {p.tierLabel || p.tier}</p>
                  {p.body ? <p className="mt-1.5 text-sm leading-snug text-slate-700">{p.body}</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <AffiliateSlot goSlug={p.goSlug || place?.goSlug} label="Check rates" />
                    {dir ? <a href={dir} target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">Directions →</a> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {activities.length ? (
        <section className="mt-8">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">Activities</h2>
          <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
            {activities.map((a, i) => {
              const place = a.pinId ? places.get(a.pinId) : null;
              return (
                <li key={i} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="font-sans text-[15px] font-bold leading-tight">{a.name}</p>
                    {a.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{a.note}</p> : null}
                    <div className="mt-1.5"><AffiliateSlot goSlug={a.goSlug || place?.goSlug} label="Book" /></div>
                  </div>
                  {a.priceLabel ? <span className="shrink-0 font-sans text-xs font-bold text-slate-700">{a.priceLabel}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {prose.map((s, i) => (
        <section key={i} className="mt-8">
          <h2 className="text-xl">{s.payload?.title || s.type.replace(/_/g, " ")}</h2>
          {s.payload?.intro ? <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{s.payload.intro}</p> : null}
          {s.payload?.body ? <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{s.payload.body}</p> : null}
        </section>
      ))}
    </>
  );
}

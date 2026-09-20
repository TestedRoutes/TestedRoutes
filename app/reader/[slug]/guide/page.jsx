import { notFound } from "next/navigation";
import { loadReaderSku } from "../../_lib/loadReaderSku";
import { groupBy, placeIndex, directionsHref } from "../../_lib/format";

/**
 * The Guide tab: the tested stays by stop, then activities. The canvas
 * adds Food, Do and Tips filters over the same grid; those render once the
 * extraction fills food_picks, cost_items and the prose sections.
 */
const TIER_MARK = { budget: "€", mid: "€€", splurge: "€€€" };

export default async function ReaderGuide({ params }) {
  const { slug } = await params;
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  const places = placeIndex(sku);
  const blocks = groupBy(sku.stayPicks, (p) => p.blockHeading);
  return (
    <>
      <h1 className="text-3xl leading-tight">The guide</h1>
      <p className="mt-1 text-slate-600">{sku.stayPicks.length} tested stays · by stop</p>

      {blocks.map(([heading, picks]) => (
        <section key={heading} className="mt-6">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
            {heading}
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {picks.map((p, i) => {
              const place = p.pinId ? places.get(p.pinId) : null;
              const dir = place ? directionsHref(place) : null;
              return (
                <article key={i} className="rounded-xl border border-brand-line bg-white/70 px-3.5 py-3">
                  <p className="font-sans text-[15px] font-bold leading-tight">{p.name}</p>
                  <p className="mt-0.5 font-sans text-xs text-slate-600">
                    {place?.region ? `${place.region} · ` : ""}
                    {TIER_MARK[p.tier] || ""} {p.tierLabel || p.tier}
                  </p>
                  {p.body ? <p className="mt-1.5 text-sm leading-snug text-slate-700">{p.body}</p> : null}
                  {dir ? (
                    <a
                      href={dir}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta"
                    >
                      Directions →
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {sku.activityRows.length ? (
        <section className="mt-6">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
            Activities
          </h2>
          <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
            {sku.activityRows.map((a, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="font-sans text-[15px] font-bold leading-tight">{a.name}</p>
                  {a.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{a.note}</p> : null}
                </div>
                {a.priceLabel ? (
                  <span className="shrink-0 font-sans text-xs font-bold text-slate-700">{a.priceLabel}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

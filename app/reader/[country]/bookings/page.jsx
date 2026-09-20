import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { groupBy, placeIndex, directionsHref } from "../../_lib/format";
import AffiliateSlot from "../../_components/AffiliateSlot";

/**
 * Bookings: every reservation rule of every open route, grouped as
 * authored, with lead time, criticality and the affiliate slot ("Book →"
 * through /go/<alias>) where the rule or its place carries one.
 */
const CRIT = { must: "bg-brand-terracotta", should: "bg-brand-taupe", nice: "bg-brand-bone" };

export default async function ReaderBookings({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "bookings");
  const places = placeIndex({ places: data.places });
  const routes = data.routes.filter((r) => r.sku && r.sku.reservationRules.length);
  return (
    <>
      <h1 className="text-3xl leading-tight">Bookings</h1>
      <p className="mt-1 text-slate-600">What to arrange, earliest first. Lead times are from the trip, not from a brochure.</p>
      {routes.map((r) => (
        <section key={r.slug} className="mt-6">
          {routes.length > 1 ? <h2 className="text-xl">{r.title}</h2> : null}
          {groupBy(r.sku.reservationRules, (x) => x.group).map(([group, rules]) => (
            <div key={group} className="mt-4">
              <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">{group || "Bookings"}</h3>
              <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
                {rules.map((rule, i) => {
                  const place = rule.pinId ? places.get(rule.pinId) : null;
                  const dir = place ? directionsHref(place) : null;
                  const go = rule.goSlug || place?.goSlug || null;
                  return (
                    <li key={i} className="flex gap-3 px-3.5 py-3">
                      <span aria-hidden="true" className={"mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full " + (CRIT[rule.criticality] || CRIT.should)} />
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-[15px] font-bold leading-tight">{rule.label}</p>
                        {rule.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{rule.note}</p> : null}
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                          <AffiliateSlot goSlug={go} label="Book" />
                          {dir ? <a href={dir} target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">Directions →</a> : null}
                        </div>
                      </div>
                      {rule.leadTimeLabel ? (
                        <span className="shrink-0 self-start rounded-full bg-brand-ink/5 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-slate-700">{rule.leadTimeLabel}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

import { notFound } from "next/navigation";
import { loadReaderSku } from "../../_lib/loadReaderSku";
import { groupBy, placeIndex, directionsHref } from "../../_lib/format";

/**
 * The reservations surface (the Bookings-tab pattern from the canvas):
 * every reservation_rule with its lead time, grouped as authored. Static in
 * this round; the check-off state (device-local, no accounts) comes with
 * the pack list in the next one.
 */
const CRIT = {
  must: "bg-brand-terracotta",
  should: "bg-brand-taupe",
  nice: "bg-brand-bone",
};

export default async function ReaderBookings({ params }) {
  const { slug } = await params;
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  const places = placeIndex(sku);
  const groups = groupBy(sku.reservationRules, (r) => r.group);
  return (
    <>
      <h1 className="text-3xl leading-tight">Bookings</h1>
      <p className="mt-1 text-slate-600">{sku.reservationRules.length} to arrange, earliest first.</p>
      {groups.map(([group, rules]) => (
        <section key={group} className="mt-6">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
            {group || "Bookings"}
          </h2>
          <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
            {rules.map((r, i) => {
              const place = r.pinId ? places.get(r.pinId) : null;
              const dir = place ? directionsHref(place) : null;
              return (
                <li key={i} className="flex gap-3 px-3.5 py-3">
                  <span
                    aria-hidden="true"
                    className={"mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full " + (CRIT[r.criticality] || CRIT.should)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[15px] font-bold leading-tight">{r.label}</p>
                    {r.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{r.note}</p> : null}
                    {dir ? (
                      <a
                        href={dir}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta"
                      >
                        Directions →
                      </a>
                    ) : null}
                  </div>
                  {r.leadTimeLabel ? (
                    <span className="shrink-0 self-start rounded-full bg-brand-ink/5 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-slate-700">
                      {r.leadTimeLabel}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

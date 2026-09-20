import Link from "next/link";
import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../../../_lib/access";
import { loadReaderCountry } from "../../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../../_lib/track";
import { groupBy, placeIndex, directionsHref, readerPaths } from "../../../../_lib/format";
import AffiliateSlot from "../../../../_components/AffiliateSlot";
import LockedBox from "../../../../_components/LockedBox";

/**
 * The bookings checklist, written for someone who has never seen the
 * guide: what this list is, what each group means, and every row as
 * what · when · why · Book. Lead times are from the trip.
 */
const GROUP_INTRO = {
  "before you fly": "Reserve these from home; they set the shape of the trip.",
  "day 2 to day 13": "Reserve these before you leave too; they are dated to specific days.",
  "arrange on the ground": "Nothing to do in advance; ask when you arrive.",
};
const CRIT = { must: ["Must", "bg-brand-terracotta text-white"], should: ["Should", "bg-brand-taupe text-white"], nice: ["Nice", "bg-brand-bone text-brand-ink"] };

function groupIntro(group) {
  const g = String(group || "").toLowerCase();
  const key = Object.keys(GROUP_INTRO).find((k) => g.startsWith(k));
  return key ? GROUP_INTRO[key] : null;
}

export default async function ReaderBookings({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "bookings", { access: owned });
  const back = (
    <Link href={readerPaths.tips(country)} className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">← Travel tips</Link>
  );
  if (!owned) {
    return (
      <>
        {back}
        <h2 className="mt-3 text-3xl leading-tight">What to book, and when</h2>
        <p className="mt-2 max-w-2xl text-[16px] text-slate-700">
          Everything you must reserve for this trip, earliest first, with the lead time each one needs and the reason. The lead times are from the trip, not from a brochure.
        </p>
        <div className="mt-6"><LockedBox data={data} what="The bookings checklist for every route." /></div>
      </>
    );
  }
  const places = placeIndex({ places: data.places });
  const routes = data.routes.filter((r) => r.sku && r.sku.reservationRules.length);
  return (
    <>
      {back}
      <h2 className="mt-3 text-3xl leading-tight">What to book, and when</h2>
      <p className="mt-2 max-w-2xl text-[16px] text-slate-700">
        Everything you must reserve for this trip, earliest first, with the lead time each one needs and the reason. The lead times are from the trip, not from a brochure.
      </p>
      {routes.map((r) => (
        <section key={r.slug} className="mt-8">
          {routes.length > 1 ? <h3 className="text-xl">{r.title}</h3> : null}
          {groupBy(r.sku.reservationRules, (x) => x.group).map(([group, rules]) => (
            <div key={group} className="mt-6">
              <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-slate-500">{group || "Bookings"}</p>
              {groupIntro(group) ? <p className="mt-1 text-[14px] text-slate-600">{groupIntro(group)}</p> : null}
              <ol className="mt-3 grid gap-3 md:grid-cols-2">
                {rules.map((rule, i) => {
                  const place = rule.pinId ? places.get(rule.pinId) : null;
                  const dir = place ? directionsHref(place) : null;
                  const go = rule.goSlug || place?.goSlug || null;
                  const [critLabel, critClass] = CRIT[rule.criticality] || CRIT.should;
                  return (
                    <li key={i} className="flex flex-col rounded-3xl bg-white p-5 shadow-card ring-1 ring-brand-line">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-slate-500">What</p>
                          <h4 className="mt-0.5 font-sans text-[17px] font-semibold leading-tight">{rule.label}</h4>
                        </div>
                        <span className={"shrink-0 rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] " + critClass}>{critLabel}</span>
                      </div>
                      <dl className="mt-3 grid grid-cols-[4rem_1fr] gap-x-3 gap-y-1.5 text-[14px]">
                        <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-slate-500 pt-0.5">When</dt>
                        <dd className="text-slate-800">{rule.leadTimeLabel ? `${rule.leadTimeLabel} before you fly` : "On the ground"}</dd>
                        {rule.note ? (
                          <>
                            <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-slate-500 pt-0.5">Why</dt>
                            <dd className="text-slate-700">{rule.note}</dd>
                          </>
                        ) : null}
                      </dl>
                      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                        <AffiliateSlot goSlug={go} label="Book" />
                        {place ? <Link href={readerPaths.spot(country, place.pinId)} className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">The spot →</Link> : null}
                        {dir ? <a href={dir} target="_blank" rel="noopener noreferrer" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">Directions →</a> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

import { notFound } from "next/navigation";
import { loadReaderSku } from "../_lib/loadReaderSku";
import DayCard from "../_components/DayCard";

/**
 * Overview: day-by-day selection, the direction-D app screen. Photo day
 * cards in order, then the trip map entry (a placeholder tile until the
 * map round lands — it says so rather than pretending).
 */
export default async function ReaderOverview({ params }) {
  const { slug } = await params;
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  const sample = sku.sku.sampleDay;
  const stubs = sku.days.filter((d) => d.slots.length === 0).length;
  return (
    <>
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
        Your guide
      </p>
      <h1 className="mt-1 text-3xl leading-tight">{sku.sku.title.split(":").pop().trim()}</h1>
      {sku.sku.subtitle ? <p className="mt-1 text-slate-600">{sku.sku.subtitle}</p> : null}

      <div className="mt-5 flex flex-col gap-2.5">
        {sku.days.map((d) => (
          <DayCard
            key={d.dayFrom}
            sku={sku}
            page={d}
            sample={sample != null && d.dayFrom <= sample && sample <= d.dayTo}
          />
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-brand-ink/25 px-4 py-5 text-center">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
          Trip map
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Every pin of the guide on one map, tap for directions. Next round.
        </p>
      </div>

      {stubs ? (
        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          Prototype note: {stubs} of {sku.days.length} day pages are title-only
          until the deck extraction runs; Day 2 is complete and Day 1 partial.
        </p>
      ) : null}
    </>
  );
}

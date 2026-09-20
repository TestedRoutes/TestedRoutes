import Link from "next/link";
import { CATEGORY, readerPaths, stopNumbers } from "../_lib/format";

/**
 * The stop-list view of a day: every move as a row with its stop number,
 * category glyph and the "optional" mark where the join says so — the
 * Rexby planner shape, for readers who want to see the day before they
 * commit to its hours.
 */
export default function StopList({ country, page, places, optionalPins }) {
  const numbers = stopNumbers(page);
  return (
    <ol className="divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
      {page.slots.map((s, i) => {
        const place = s.pinId ? places.get(s.pinId) : null;
        const n = numbers[i];
        return (
          <li key={i} className="flex items-center gap-3 px-3.5 py-2.5">
            <span className="w-11 shrink-0 font-sans text-xs font-bold tabular-nums text-slate-600">{s.timeLabel}</span>
            <span
              aria-hidden="true"
              className={
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-bold " +
                (n ? "bg-brand-terracotta text-white" : "text-slate-400")
              }
            >
              {n || CATEGORY[place?.category]?.glyph || "·"}
            </span>
            <span className="min-w-0 flex-1">
              {place ? (
                <Link href={readerPaths.spot(country, place.pinId)} className="font-sans text-[15px] font-bold leading-tight hover:text-brand-terracotta">
                  {s.title}
                </Link>
              ) : (
                <span className="font-sans text-[15px] font-bold leading-tight">{s.title}</span>
              )}
              {place?.pinId && optionalPins?.has(place.pinId) ? (
                <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.1em] text-slate-500">Optional</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

import Link from "next/link";
import { directionsHref, readerPaths, stopNumbers } from "../_lib/format";

/**
 * The executable day: an hour rail with timed moves, never a stop list.
 * This is the differentiator the architecture doc protects ("the reader
 * must render it as a timeline, never flatten it to a stop list"). Pinned
 * moves carry their stop number in Brandy so the numbers match the day map;
 * legs and meals hang off the rail unnumbered.
 */
export default function Timeline({ country, page, places }) {
  const numbers = stopNumbers(page);
  return (
    <ol className="relative ml-[3.75rem] border-l border-brand-ink/15">
      {page.slots.map((slot, i) => {
        const n = numbers[i];
        const place = slot.pinId ? places.get(slot.pinId) : null;
        const dir = place ? directionsHref(place) : null;
        return (
          <li key={i} className="relative pb-6 pl-5 last:pb-0">
            <span className="absolute -left-[3.75rem] top-0.5 w-11 text-right font-sans text-xs font-bold tabular-nums tracking-wide text-slate-600">
              {slot.timeLabel}
            </span>
            <span
              aria-hidden="true"
              className={
                "absolute top-1 flex items-center justify-center rounded-full border-2 border-brand-parchment " +
                (n
                  ? "-left-[13px] h-6 w-6 bg-brand-terracotta text-[11px] font-bold text-white"
                  : "-left-[7px] h-3 w-3 bg-brand-taupe")
              }
            >
              {n || ""}
            </span>
            <h3 className={"font-sans text-[15px] font-bold leading-tight " + (n ? "pl-1" : "")}>
              {place && country ? (
                <Link href={readerPaths.spot(country, place.pinId)} className="hover:text-brand-terracotta">
                  {slot.title}
                </Link>
              ) : (
                slot.title
              )}
            </h3>
            {slot.body ? (
              <p className={"mt-1 text-[15px] leading-snug text-slate-700 " + (n ? "pl-1" : "")}>
                {slot.body}
              </p>
            ) : null}
            {dir ? (
              <a
                href={dir}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block pl-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-terracotta"
              >
                Directions →
              </a>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

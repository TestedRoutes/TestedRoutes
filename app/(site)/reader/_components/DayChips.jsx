import Link from "next/link";
import { dayChip, dayHref } from "../_lib/format";

/**
 * The horizontal day strip: Overview, then one chip per day page. The
 * active chip is ink, the rest white with a hairline (founder's itinerary
 * mock, 2026-09-20); `current` null means the overview is the active one.
 */
export default function DayChips({ country, sku, current }) {
  const slug = sku.sku.slug;
  const chip = (on) =>
    "shrink-0 rounded-full px-3.5 py-1.5 font-sans text-[13px] font-semibold tabular-nums transition-colors " +
    (on ? "bg-brand-ink text-brand-cream" : "bg-white text-slate-700 ring-1 ring-brand-line hover:bg-brand-ink/5");
  return (
    <nav aria-label="Days" className="-mx-4 flex gap-2 overflow-x-auto overflow-y-hidden px-4 pb-1">
      <Link href={`/reader/${country}/itineraries/${slug}`} aria-current={current ? undefined : "page"} className={chip(!current)}>
        Overview
      </Link>
      {sku.days.map((d) => (
        <Link
          key={d.dayFrom}
          href={dayHref(country, slug, d)}
          aria-current={current?.dayFrom === d.dayFrom ? "page" : undefined}
          className={chip(current?.dayFrom === d.dayFrom)}
        >
          Day {dayChip(d)}
        </Link>
      ))}
    </nav>
  );
}

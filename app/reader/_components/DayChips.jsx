import Link from "next/link";
import { dayChip, dayHref } from "../_lib/format";

/** The horizontal day strip: ALL DAYS, then one chip per day page. */
export default function DayChips({ sku, current }) {
  const slug = sku.sku.slug;
  const chip = (on) =>
    "shrink-0 rounded-full px-3 py-1 font-sans text-xs font-bold tabular-nums tracking-wide transition-colors " +
    (on ? "bg-brand-terracotta text-white" : "bg-white/70 text-slate-700 hover:bg-white");
  return (
    <nav aria-label="Days" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
      <Link href={`/reader/${slug}`} className={chip(false)}>
        All days
      </Link>
      {sku.days.map((d) => (
        <Link
          key={d.dayFrom}
          href={dayHref(slug, d)}
          aria-current={current?.dayFrom === d.dayFrom ? "page" : undefined}
          className={chip(current?.dayFrom === d.dayFrom)}
        >
          {dayChip(d)}
        </Link>
      ))}
    </nav>
  );
}

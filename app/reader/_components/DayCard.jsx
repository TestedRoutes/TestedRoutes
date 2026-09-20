import Link from "next/link";
import { dayBadge, dayHref, titleCase } from "../_lib/format";

/**
 * Overview card, direction D: a photo tile (grey until the per-day photo
 * pass fills photoRef — the canvas note: "grey tiles mark days without a
 * photo"), the badge, the title, one line of what the day is.
 */
export default function DayCard({ sku, page, sample }) {
  const moves = page.slots.length;
  return (
    <Link
      href={dayHref(sku.sku.slug, page)}
      className="group flex gap-3 rounded-xl border border-brand-line bg-white/70 p-2.5 transition-colors hover:bg-white"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-bone">
        <span className="absolute bottom-1.5 left-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink/60">
          {dayBadge(page)}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
          {dayBadge(page)}
          {sample ? " · sample day" : ""}
        </p>
        <h2 className="mt-0.5 text-xl leading-tight">{titleCase(page.title)}</h2>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-slate-600">
          {page.subtitle}
          {moves ? ` · ${moves} moves` : ""}
        </p>
      </div>
      <span aria-hidden="true" className="self-center pr-1 text-slate-400 group-hover:text-brand-terracotta">
        →
      </span>
    </Link>
  );
}

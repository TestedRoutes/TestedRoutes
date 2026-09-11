/**
 * Sticky day navigation for the reader — the Overview / Day 1 / Day 2 chip
 * row (the pattern buyers already know from every itinerary product). Server
 * component: plain links, no state; the active chip is derived from the URL.
 */
import Link from "next/link";

export default function DayChips({ slug, days, active }) {
  const chip = (href, label, isActive, key) => (
    <Link
      key={key}
      href={href}
      className={
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
        (isActive
          ? "border-brand-terracotta bg-brand-terracotta text-white"
          : "border-brand-line bg-white text-brand-taupe hover:border-brand-terracotta hover:text-brand-terracotta")
      }
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-20 -mx-4 mb-6 border-b border-brand-line bg-brand-parchment/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {chip(`/guides/${slug}/read`, "Overview", active === "overview", "ov")}
        {chip(`/guides/${slug}/read/map`, "Trip map", active === "map", "map")}
        {days.map((d) =>
          chip(
            `/guides/${slug}/read/day/${d.dayFrom}`,
            d.badge ?? `Day ${d.dayFrom}`,
            active === d.dayFrom,
            d.dayFrom,
          ),
        )}
      </div>
    </nav>
  );
}

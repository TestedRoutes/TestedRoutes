"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The reader's four surfaces, from the Reader Directions canvas (direction
 * D, app page): Itinerary · Bookings · Pack · Guide. The trip map joins as
 * a fifth tab in the map round; leaving it out now beats a dead tab.
 */
const TABS = [
  { slug: "", label: "Itinerary" },
  { slug: "bookings", label: "Bookings" },
  { slug: "pack", label: "Pack" },
  { slug: "guide", label: "Guide" },
];

function activeTab(pathname, base) {
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  const first = rest.split("/").filter(Boolean)[0] || "";
  // Day pages belong to the itinerary tab.
  return first === "day" ? "" : first;
}

export default function ReaderTabs({ slug }) {
  const base = `/reader/${slug}`;
  const active = activeTab(usePathname() || base, base);
  return (
    <nav aria-label="Guide sections" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2">
      {TABS.map((t) => {
        const on = active === t.slug;
        return (
          <Link
            key={t.slug}
            href={t.slug ? `${base}/${t.slug}` : base}
            aria-current={on ? "page" : undefined}
            className={
              "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors " +
              (on
                ? "bg-brand-ink text-brand-cream"
                : "text-slate-600 hover:bg-brand-ink/5 hover:text-slate-900")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

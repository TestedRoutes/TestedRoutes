"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { readerPaths, longDate } from "../_lib/format";

/**
 * The reader's navigation, in two shapes from one list: a left rail on
 * desktop (identity block, then the tabs stacked), a horizontal tab row on
 * the phone. Tab names follow the Rexby reference the founder chose
 * (Spots · Itineraries · Bookings · Pack · Tips) so the mental model and
 * the URL agree.
 */
const TABS = [
  { key: "itineraries", label: "Itineraries" },
  { key: "spots", label: "Spots" },
  { key: "bookings", label: "Bookings" },
  { key: "pack", label: "Pack" },
  { key: "tips", label: "Tips" },
];

function activeKey(pathname, base) {
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  return rest.split("/").filter(Boolean)[0] || "overview";
}

export default function ReaderRail({ country, title, subtitle, placeCount, verified }) {
  const base = readerPaths.country(country);
  const active = activeKey(usePathname() || base, base);
  const link = (key, label, on) => (
    <Link
      key={key}
      href={key === "overview" ? base : `${base}/${key}`}
      aria-current={on ? "page" : undefined}
      className={
        "shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors md:block md:rounded-lg md:px-3 md:py-2 md:text-[12px] md:tracking-[0.1em] " +
        (on
          ? "bg-brand-ink text-brand-cream"
          : "text-slate-600 hover:bg-brand-ink/5 hover:text-slate-900")
      }
    >
      {label}
    </Link>
  );
  return (
    <>
      {/* Phone: sticky top bar with a scrolling tab row. */}
      <header className="sticky top-0 z-20 border-b border-brand-line bg-brand-parchment/95 backdrop-blur md:hidden">
        <div className="px-4 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <Link href={base} className="truncate font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-terracotta">
              {title}
            </Link>
            <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.12em] text-slate-500">{placeCount} places</span>
          </div>
          <nav aria-label="Guide sections" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 pt-1">
            {link("overview", "Overview", active === "overview")}
            {TABS.map((t) => link(t.key, t.label, active === t.key))}
          </nav>
        </div>
      </header>

      {/* Desktop: the left rail. */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-brand-line md:px-5 md:py-6">
        <Link href={base} className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-terracotta">
          {title}
        </Link>
        {subtitle ? <p className="mt-2 text-[13px] leading-snug text-slate-600">{subtitle}</p> : null}
        <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500">
          {placeCount} tested places{verified ? ` · verified ${longDate(verified)}` : ""}
        </p>
        <nav aria-label="Guide sections" className="mt-6 flex flex-col gap-0.5">
          {link("overview", "Overview", active === "overview")}
          {TABS.map((t) => link(t.key, t.label, active === t.key))}
        </nav>
        <p className="mt-auto font-script text-sm text-slate-500">AI has not been there. I have.</p>
      </aside>
    </>
  );
}

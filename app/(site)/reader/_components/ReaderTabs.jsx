"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { readerPaths } from "../_lib/format";

/**
 * The four tabs from the founder's header mock (2026-09-20), as underlined
 * text: Itineraries · Places · Inspire · Travel tips. Itineraries is the
 * country root. Route and day pages count as Itineraries, place pages
 * (/spots/<pin>) as Places, the bookings and pack pages as Travel tips.
 */
const TABS = [
  { key: "", label: "Itineraries" },
  { key: "places", label: "Places" },
  { key: "inspire", label: "Inspire" },
  { key: "tips", label: "Travel tips" },
];

export default function ReaderTabs({ country }) {
  const base = readerPaths.country(country);
  const pathname = usePathname() || base;
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  const first = rest.split("/").filter(Boolean)[0] || "";
  const active = first === "itineraries" ? "" : first === "spots" ? "places" : first === "bookings" || first === "pack" ? "tips" : first;
  return (
    // overflow-y-hidden matters: an underline hanging a pixel below the row
    // gave Windows a vertical scrollbar whose arrows read as a control.
    <nav aria-label="Guide sections" className="-mx-4 flex overflow-x-auto overflow-y-hidden border-b border-brand-line px-4 md:mx-0 md:px-0">
      {TABS.map((t) => {
        const on = active === t.key;
        return (
          <Link
            key={t.key}
            href={t.key ? `${base}/${t.key}` : base}
            aria-current={on ? "page" : undefined}
            className={
              "shrink-0 border-b-2 px-6 py-3 font-sans text-[15px] transition-colors first:pl-2 " +
              (on ? "border-brand-ink font-semibold text-brand-ink" : "border-transparent text-slate-600 hover:text-brand-ink")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

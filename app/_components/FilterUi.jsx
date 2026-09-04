"use client";

// The filter-block pieces the browse pages share (/inspire and /guides).
//
// Founder 2026-09-04, after the Inspire panel went multi-column: "do the
// same now on Guides page. I want searches to have the same look and
// feel." The two blocks were near-identical Tailwind kept in two files,
// which is exactly how they drifted apart in the first place (one grew
// tickbox panels with counts while the other still had native selects).
// So the shared surface lives here: change a class once and both pages
// move together. Each page keeps its own state and data shaping - only
// the rendering is common.

// "Show {n} guides" → "Show 12 guides". The dictionaries carry the
// templates so each language can put the number where its grammar wants
// it. (It lives here rather than in _lib/i18n.js because that module
// pulls all five dictionaries into whatever imports it, and both callers
// are client components.)
export function fill(template, vars) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className={`h-2 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1.5 L6 6.5 L11 1.5" />
    </svg>
  );
}

export function ArrowIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12 H19 M13 6 L19 12 L13 18" />
    </svg>
  );
}

export function MagnifierIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" />
    </svg>
  );
}

// One rounded block holds the search capsule, the continent tabs, the
// control row and the status row (founder mockup 2026-09-03).
export const BLOCK_CLASS =
  "scroll-mt-24 rounded-[28px] bg-slate-100/70 p-3 ring-1 ring-brand-line md:p-4";
export const CAPSULE_CLASS =
  "flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-card ring-1 ring-brand-line";
export const SEARCH_INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-brand-ink outline-none placeholder:text-slate-400 md:px-5 md:text-base";
// Text from sm up, a round arrow at thumb size on phones.
export const SEARCH_BUTTON_CLASS =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-sm font-semibold text-white transition hover:bg-brand-terracotta/90 sm:w-auto sm:px-5 md:h-12 md:px-6 md:text-base";
// Control sizing: two per row at thumb size on phones, one compact row
// from sm up.
export const CONTROL_CLASS =
  "h-11 min-w-[calc(50%-0.25rem)] flex-1 rounded-full border text-sm font-semibold transition sm:h-9 sm:min-w-0 sm:max-w-44 sm:text-xs";
export const PANEL_CLASS =
  "absolute left-0 top-full z-20 mt-3 w-full overflow-hidden rounded-3xl bg-white shadow-card-hover ring-1 ring-brand-line";
export const EYEBROW_CLASS =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500";
// Two columns on a phone, three from lg - wide enough for the label, the
// count and a comfortable tick target, narrow enough that a long list
// still reads as a list.
export const TICK_LIST_CLASS =
  "grid max-h-[45vh] grid-cols-2 gap-x-3 gap-y-0.5 overflow-y-auto sm:gap-x-6 lg:grid-cols-3";

// The control-row pill: "Country: All", ink-filled while its panel is
// open or its filter is set.
export function FilterPill({ label, value, open, active, onClick, panelLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={panelLabel}
      className={`flex items-center justify-between gap-2 px-4 sm:px-3 ${CONTROL_CLASS} ${
        open || active
          ? "border-transparent bg-brand-ink text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      <span className="truncate">
        {label}: {value}
      </span>
      <Chevron open={open} />
    </button>
  );
}

// One tick row in a filter panel: box, label, count. Every panel on both
// pages renders through this, so a class changed for one lands in all.
export function CheckRow({ label, count, checked, onToggle }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl px-1 py-2 transition hover:bg-slate-50 sm:gap-3 sm:px-2">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 transition ${
          checked ? "bg-brand-ink text-white ring-brand-ink" : "bg-white ring-slate-300"
        }`}
      >
        {checked ? (
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 6.5 L5 9 L9.5 3.5" />
          </svg>
        ) : null}
      </span>
      {/* Two columns on a 375px phone leave ~100px for the name, so names
          wrap there instead of truncating (Equatorial Guinea, Nature &
          Wildlife); from sm up the column is wide enough to clip instead.
          break-words is for the ones that are a single long word with
          nowhere to wrap (Turkmenistan, Mountaineering) - without it they
          overflow the column and run under the count. */}
      <span
        className={`min-w-0 flex-1 break-words text-sm leading-tight sm:truncate sm:text-[15px] ${
          checked ? "font-bold text-brand-ink" : "text-slate-800"
        }`}
      >
        {label}
      </span>
      <span className="shrink-0 text-xs tabular-nums text-slate-400">{count}</span>
    </label>
  );
}

// rows: [{ key, label, count }]. `count` may be null for a row that is
// navigation only.
export function TickList({ rows, isChecked, onToggle, emptyLabel, className = "" }) {
  if (!rows.length) {
    return emptyLabel ? <p className="mt-6 text-sm text-slate-500">{emptyLabel}</p> : null;
  }
  return (
    <ul className={`${TICK_LIST_CLASS} ${className}`}>
      {rows.map((row) => (
        <li key={row.key}>
          <CheckRow
            label={row.label}
            count={row.count}
            checked={isChecked(row.key)}
            onToggle={() => onToggle(row.key)}
          />
        </li>
      ))}
    </ul>
  );
}

// Clear on the left, the live result count as the confirm button on the
// right - the panel's own footer, not the page's.
export function PanelFooter({ clearLabel, onClear, showLabel, onClose }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4 border-t border-brand-line pt-4">
      <button
        type="button"
        onClick={onClear}
        className="text-sm font-medium text-slate-500 underline underline-offset-4 transition hover:text-brand-ink"
      >
        {clearLabel}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full bg-brand-terracotta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-terracotta/90"
      >
        {showLabel}
      </button>
    </div>
  );
}

// Continent tabs with counts, active tab underlined in Brandy.
// rows: [{ key, label, count }] - the "All" row is just the row with an
// empty key, so both pages order it the same way.
export function ContinentTabs({ rows, active, onPick }) {
  return (
    <div className="border-b border-brand-line">
      <div className="flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rows.map((row) => {
          const on = active === row.key;
          return (
            <button
              key={row.key || "all"}
              type="button"
              onClick={() => onPick(row.key)}
              className={`-mb-px flex shrink-0 items-baseline gap-1.5 border-b-2 pb-3 font-sans text-base font-bold transition-colors ${
                on
                  ? "border-brand-terracotta text-brand-ink"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {row.label}
              <span
                className={`text-xs font-medium tabular-nums ${on ? "text-slate-500" : "text-slate-400"}`}
              >
                {row.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// The same rows again as the country panel's left rail (md and up), so
// the tab row and the rail are one state, picked from either place.
export function ContinentRail({ rows, active, onPick }) {
  return (
    <div className="hidden w-56 shrink-0 border-r border-brand-line bg-slate-50/70 p-4 md:block">
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => {
          const on = active === row.key;
          return (
            <button
              key={row.key || "all"}
              type="button"
              onClick={() => onPick(row.key)}
              className={`flex shrink-0 items-center justify-between gap-4 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                on ? "bg-brand-ink text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{row.label}</span>
              <span
                className={`text-xs font-medium tabular-nums ${on ? "text-white/70" : "text-slate-400"}`}
              >
                {row.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Status-row chip: one per active filter, click to drop it.
export function FilterChip({ label, onClear }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-2 rounded-full bg-brand-ink px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-ink/90"
    >
      {label}
      <span aria-hidden="true" className="text-white/60">
        ✕
      </span>
      <span className="sr-only">Clear filter</span>
    </button>
  );
}

"use client";

import { useSaved } from "../_lib/saved";

/**
 * The + / ✓ bookmark on a place card, strip card or place page. A bookmark
 * lives in this browser only (see _lib/saved.js); the label says so, because
 * the founder asked what the tick gives and whether it needs an account.
 */
export default function SaveButton({ country, pinId, size = 36, className = "" }) {
  const { has, toggle, ready } = useSaved(country);
  const on = ready && has(pinId);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Saved to my places on this device · tap to remove" : "Save to my places (kept on this device)"}
      title={on ? "Saved on this device" : "Save to my places (kept on this device)"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(pinId);
      }}
      style={{ width: size, height: size }}
      className={
        "flex items-center justify-center rounded-full border-2 border-white shadow-md transition " +
        (on ? "bg-brand-terracotta text-white" : "bg-brand-ink/70 text-white hover:bg-brand-ink") +
        " " +
        className
      }
    >
      <span aria-hidden className="font-sans text-base font-bold leading-none">{on ? "✓" : "+"}</span>
    </button>
  );
}

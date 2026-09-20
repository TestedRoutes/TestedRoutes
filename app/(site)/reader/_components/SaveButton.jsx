"use client";

import { useSaved } from "../_lib/saved";

/**
 * The + / ✓ bookmark on a place card, strip card or place page. A bookmark
 * lives in this browser only (see _lib/saved.js); the label says so, because
 * the founder asked what the tick gives and whether it needs an account.
 */
/**
 * `variant="pill"` is the labelled form ("+ Save" / "✓ Saved") for the map's
 * place sheet, where the mock puts the bookmark as a text pill; the default
 * is the round icon on cards and rows.
 */
export default function SaveButton({ country, pinId, size = 36, className = "", variant = "icon" }) {
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
      style={variant === "pill" ? undefined : { width: size, height: size }}
      className={
        (variant === "pill"
          ? "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-[13px] font-semibold ring-1 transition " +
            (on ? "bg-brand-terracotta text-white ring-brand-terracotta" : "bg-white text-brand-ink ring-brand-line hover:bg-brand-ink/5")
          : "flex items-center justify-center rounded-full border-2 border-white shadow-md transition " +
            (on ? "bg-brand-terracotta text-white" : "bg-brand-ink/70 text-white hover:bg-brand-ink")) +
        " " +
        className
      }
    >
      <span aria-hidden className={variant === "pill" ? "font-bold leading-none" : "font-sans text-base font-bold leading-none"}>{on ? "✓" : "+"}</span>
      {variant === "pill" ? <span>{on ? "Saved" : "Save"}</span> : null}
    </button>
  );
}

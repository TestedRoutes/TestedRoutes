"use client";

/**
 * Footer link that re-opens the Klaro consent modal so buyers can
 * change their choices at any time. Required by GDPR (consent must be
 * as easy to withdraw as it is to give).
 *
 * Falls back to a visually-hidden no-op if Klaro hasn't loaded yet
 * (e.g. JS disabled, or the banner script failed to load).
 */
export default function CookieSettingsButton({ className = "" }) {
  return (
    <button
      type="button"
      onClick={() => {
        // klaro.show(config, modal). Passing `true` for the second arg
        // opens the per-service modal directly instead of the bottom
        // banner, which is what buyers expect when clicking "Cookie
        // settings" — they want fine-grained toggles, not the banner.
        if (typeof window !== "undefined" && window.klaro) {
          window.klaro.show(undefined, true);
        }
      }}
      className={`cursor-pointer transition hover:text-slate-700 ${className}`}
    >
      Cookie settings
    </button>
  );
}

"use client";

import { useTransition } from "react";

const OPTIONS = [
  { value: "EUR", label: "EUR €" },
  { value: "USD", label: "USD $" },
  { value: "GBP", label: "GBP £" },
  { value: "CHF", label: "CHF" },
];

export default function CurrencySwitcher({ current = "EUR" }) {
  const [pending, startTransition] = useTransition();

  function setCurrency(next) {
    document.cookie = `tr_currency=${next}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`;
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className="sr-only">Currency</span>
      <select
        value={current}
        onChange={(e) => setCurrency(e.target.value)}
        disabled={pending}
        className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none disabled:opacity-60"
        aria-label="Currency"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

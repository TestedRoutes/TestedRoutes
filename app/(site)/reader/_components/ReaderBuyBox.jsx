"use client";

import { useState } from "react";

/**
 * The country guide's buy box. Real price, real button, and until a Polar
 * product exists for the country guide the click captures the buyer's
 * email through /api/reader/interest (Beehiiv list + a note to the founder
 * + an anonymous count). The founder fulfils by hand from that note; when
 * the Polar product exists, `checkoutHref` takes over and the email step
 * disappears. No "prototype" copy: this is the offer, priced.
 */
export default function ReaderBuyBox({ country, priceLabel, priceAmount, priceCurrency, checkoutHref, unlockTo }) {
  const [stage, setStage] = useState("idle"); // idle | email | sending | sent | error
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStage("sending");
    setError("");
    try {
      const res = await fetch("/api/reader/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, email, price: priceAmount, currency: priceCurrency, website: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not save that right now.");
      setStage("sent");
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }

  return (
    <aside className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">The full guide</p>
      {priceLabel ? <p className="mt-2 text-3xl font-semibold text-slate-900">{priceLabel}</p> : null}
      <p className="mt-1 text-xs text-slate-500">Every route, every place, the map, bookings and pack list. Kept current.</p>

      {stage === "sent" ? (
        <p className="mt-4 rounded-lg bg-brand-terracotta-soft px-4 py-3 text-sm text-slate-800">
          Thank you. Your access link is on its way to <strong>{email}</strong>; I send it personally.
        </p>
      ) : checkoutHref ? (
        <a
          href={checkoutHref}
          className="mt-4 block w-full rounded-full bg-brand-flame px-4 py-3 text-center font-sans text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-brand-flame/90"
        >
          Get the guide
        </a>
      ) : stage === "idle" ? (
        <button
          type="button"
          onClick={() => setStage("email")}
          className="mt-4 block w-full rounded-full bg-brand-flame px-4 py-3 text-center font-sans text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-brand-flame/90"
        >
          Get the guide
        </button>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
          <label htmlFor="reader-email" className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
            Where should the access link go?
          </label>
          <input
            id="reader-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-brand-line bg-white px-4 py-2.5 text-base outline-none focus:border-brand-terracotta"
          />
          <button
            type="submit"
            disabled={stage === "sending"}
            className="rounded-full bg-brand-flame px-4 py-3 font-sans text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-brand-flame/90 disabled:opacity-60"
          >
            {stage === "sending" ? "Sending…" : `Continue · ${priceLabel}`}
          </button>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </form>
      )}

      <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
        {["Tested in person, not compiled", "Updated when the ground changes", "Refund if it is not for you"].map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className="text-brand-terracotta">✓</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <details className="mt-4 text-xs text-slate-500">
        <summary className="cursor-pointer">Already have access?</summary>
        <form action="/reader/unlock" method="get" className="mt-2 flex gap-2">
          <input type="hidden" name="to" value={unlockTo} />
          <input name="key" type="password" autoComplete="off" required placeholder="Access key" className="min-w-0 flex-1 rounded-lg border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-terracotta" />
          <button type="submit" className="rounded-full bg-brand-ink px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-brand-cream">Open</button>
        </form>
      </details>
    </aside>
  );
}

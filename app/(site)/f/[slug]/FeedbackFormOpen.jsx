"use client";

import { useState } from "react";

// The open feedback form behind the QR printed in the guide PDF (#58) —
// FeedbackPrompt minus the buyer gate, per the 2026-05-02 founder decision:
// whoever scanned the code is holding the printed guide, and a companion on
// the trip may not be the buyer of record. Email is optional here; without
// it we can't reply, and the form says exactly that rather than demanding
// an address a trailhead submission may not want to type.
//
// English only, like the rest of the guide surface — guides are EN-only.
export default function FeedbackFormOpen({ guideSlug }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideSlug,
          email,
          name,
          message,
          website,
          source: "pdf-qr",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `error ${res.status}`);
      setState("sent");
    } catch (err) {
      setState("error");
      setError(String(err?.message || err));
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-brand-line bg-white p-5">
        <p className="text-sm font-medium text-brand-ink">
          Got it – thank you. A person reads this, and if what you spotted
          checks out, it fixes the guide for the next traveller.
        </p>
        {email ? (
          <p className="mt-1 text-xs text-slate-500">
            We typically reply within 24 hours.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-brand-line bg-white p-5"
    >
      {/* Honeypot: hidden from humans, tempting to bots. */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <textarea
        required
        minLength={10}
        maxLength={4000}
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What did you find, and where? The more specific, the faster we can verify and fix it."
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-ink outline-none placeholder:text-slate-400 focus:border-slate-400"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional – so we can reply)"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-ink outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-ink outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="mt-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-brand-terracotta px-5 py-2.5 text-xs font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

"use client";

import { useState } from "react";

// "Spotted something?" — the buyers-only feedback path on guide pages
// (Tracker #57), placed near the last-reviewed date because that's the
// promise it backs up: the date says "verified", this says "and if the
// ground disagrees, telling us fixes it". Submission is verified against
// the purchase registry server-side (email-hash match), so the form asks
// for the purchase email rather than carrying a token.
//
// English only, like the rest of the guide surface — guides are EN-only;
// localize when they are.
export default function FeedbackPrompt({ guideSlug }) {
  const [open, setOpen] = useState(false);
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
        body: JSON.stringify({ guideSlug, email, name, message, website }),
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
      <div className="mt-4 rounded-2xl border border-brand-line bg-white p-5">
        <p className="text-sm font-medium text-brand-ink">
          Got it – thank you. A person reads this, and we typically respond
          within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
        >
          Spotted something on the trip that doesn't match the guide? Tell us –
          we typically respond within 24h.
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-brand-line bg-white p-5"
        >
          <p className="text-sm font-medium text-brand-ink">
            Spotted something? A closed trail, a changed fare, a better option –
            tell us and it fixes the guide for the next traveller.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            For buyers of this guide – enter the email from your receipt so we
            can match your purchase.
          </p>

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

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email you bought with"
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
          <textarea
            required
            minLength={10}
            maxLength={4000}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What did you find, and where? The more specific, the faster we can verify and fix it."
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-brand-ink outline-none placeholder:text-slate-400 focus:border-slate-400"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-brand-terracotta px-5 py-2.5 text-xs font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90 disabled:opacity-50"
            >
              {state === "sending" ? "Sending…" : "Send it"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          {error ? (
            <p className="mt-3 text-sm text-red-700">{error}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}

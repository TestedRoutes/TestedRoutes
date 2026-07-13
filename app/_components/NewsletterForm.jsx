"use client";

import { useState } from "react";
import posthog from "posthog-js";

/**
 * Reusable Beehiiv signup form.
 *
 * Variants:
 *   "compact"  one-line inline (top banner) — dark on light, single row
 *   "footer"   stacked headline + form for the footer
 *   "story"    larger card for end-of-story placement on /inspire pages
 */
export default function NewsletterForm({ variant = "footer", source, headline, subhead }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          language: typeof navigator !== "undefined" ? navigator.language?.slice(0, 2) : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Try again?");
        return;
      }
      setStatus("success");
      setEmail("");
      posthog.capture("newsletter_signup", { source });
    } catch {
      setStatus("error");
      setMessage("Network error. Try again?");
    }
  }

  if (variant === "compact") {
    return (
      <form onSubmit={onSubmit} className="flex w-full items-center justify-center gap-2 text-sm">
        {status === "success" ? (
          <span className="text-brand-cream">Thanks – check your inbox to confirm.</span>
        ) : (
          <>
            <span className="hidden text-brand-cream/80 sm:inline">
              {headline || "Launching August 2026 – get notified:"}
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-44 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none disabled:opacity-50 sm:w-56"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-brand-cream px-4 py-1.5 text-xs font-semibold text-brand-ink transition hover:bg-white disabled:opacity-50"
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
            {status === "error" ? (
              <span className="hidden text-xs text-red-300 md:inline">{message}</span>
            ) : null}
          </>
        )}
      </form>
    );
  }

  if (variant === "story") {
    return (
      <section className="rounded-3xl bg-brand-ink p-8 text-brand-cream">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-cream/60">TestedRoutes Newsletter</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold">
          {headline || "Get the next guide first"}
        </h3>
        <p className="mt-2 text-sm text-brand-cream/80">
          {subhead || "One email when a new field-tested route is published. No spam, unsubscribe anytime."}
        </p>
        {status === "success" ? (
          <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm">
            Thanks – check your inbox to confirm your subscription.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-brand-cream px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-white disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" ? <p className="mt-3 text-xs text-red-300">{message}</p> : null}
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-slate-900">
        {headline || "TestedRoutes Newsletter"}
      </p>
      <p className="text-xs text-slate-500">
        {subhead || "Field-tested travel routes, in your inbox when they drop."}
      </p>
      {status === "success" ? (
        <p className="rounded-lg bg-slate-100 p-3 text-xs text-slate-700">
          Thanks – check your inbox to confirm.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-brand-terracotta px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-terracotta/90 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" ? <p className="text-xs text-red-600">{message}</p> : null}
    </div>
  );
}

"use client";

/**
 * What an unentitled visitor sees on any /read URL. Renders as a 200 on
 * purpose: the audience is a human — a buyer with a broken cookie, someone
 * forwarded a link, a shopper poking at the URL — and each of those wants a
 * next step, not a 403. Crawlers are handled by noindex, not by status codes.
 *
 * The recovery form always reports success identically whether or not the
 * email matched purchases — the endpoint is designed as a non-oracle, and
 * this copy must not undermine that by implying anything about the account.
 */
import { useState } from "react";
import Link from "next/link";

export default function ReadGate({ slug, title }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | sent | error

  async function recover(e) {
    e.preventDefault();
    if (!email || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/access/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <h1 className="font-serif text-2xl font-semibold text-brand-ink">This is the guide itself</h1>
      <p className="mb-[3pt] mt-3 text-brand-taupe">
        {title ? `“${title}”` : "This guide"} opens here for buyers – every correction we
        publish reaches this page the moment it lands.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href={`/guides/${slug}`}
          className="rounded-full bg-brand-flame px-6 py-2.5 font-semibold text-white shadow-card"
        >
          Get the guide
        </Link>
        <Link href={`/guides/${slug}/preview`} className="text-sm text-slate-600 underline">
          Read the free sample day first
        </Link>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8 text-left">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Already bought it?
        </h2>
        <p className="mb-[3pt] mt-1 text-sm text-slate-600">
          Your access link is in your purchase email. Lost it? Enter the email you bought
          with and we&apos;ll send a fresh one.
        </p>
        {state === "sent" ? (
          <p className="mt-3 text-sm text-slate-700">
            Done – if that address has purchases, the links are on their way. Check spam too.
          </p>
        ) : (
          <form onSubmit={recover} className="mt-3 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {state === "sending" ? "Sending…" : "Send link"}
            </button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-2 text-sm text-red-700">
            That didn&apos;t go through – try again, or write to hello@testedroutes.com.
          </p>
        )}
      </div>
    </div>
  );
}

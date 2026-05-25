"use client";

import { useState } from "react";
import posthog from "posthog-js";

export default function HomeGuideRequest() {
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/guide-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, destination, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Try again?");
        return;
      }
      setStatus("success");
      posthog.capture("guide_request", { destination });
      setEmail("");
      setDestination("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again?");
    }
  }

  return (
    <section className="rounded-[28px] bg-[#1a1816] p-6 text-[#f7f4ef] md:p-8">
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f7f4ef]/60">
            Looking for somewhere else?
          </p>
          <h2 className="font-['Georgia',serif] text-2xl font-semibold leading-tight md:text-3xl">
            Tell me where.
          </h2>
          <p className="text-sm leading-relaxed text-[#f7f4ef]/80">
            I read every request. If I take on that destination, I&apos;ll write.
          </p>
        </div>
        {status === "success" ? (
          <div className="rounded-2xl bg-white/10 px-5 py-6 text-sm leading-relaxed">
            <p className="font-semibold">Got it – thank you.</p>
            <p className="mt-1 text-[#f7f4ef]/80">
              Check your inbox to confirm. I&apos;ll write back personally if I&apos;m taking on that destination.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="hgr-website">Website</label>
              <input
                id="hgr-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="block w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none disabled:opacity-50"
            />
            <input
              type="text"
              required
              maxLength={200}
              placeholder="Where to? e.g. Madeira, 5 days"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={status === "loading"}
              className="block w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none disabled:opacity-50"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-[#f7f4ef]/60">
                One email per new guide. I&apos;ll write personally if I&apos;m building one for your destination.
              </p>
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-[#f7f4ef] px-5 py-2.5 text-sm font-semibold text-[#1a1816] transition hover:bg-white disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Send request"}
              </button>
            </div>
            {status === "error" ? (
              <p className="text-xs text-red-300">{message}</p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}

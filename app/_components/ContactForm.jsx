"use client";

import { useState } from "react";

const TOPICS = [
  { value: "general", label: "General inquiry" },
  { value: "refund", label: "Refund request" },
  { value: "privacy", label: "Privacy / data request (GDPR)" },
  { value: "partnership", label: "Partnership / press" },
  { value: "security", label: "Security disclosure" },
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  // Honeypot — invisible field, real humans never fill it.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Try again shortly.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setTopic("general");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again shortly.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm leading-relaxed text-emerald-900">
        <p className="font-semibold">Thanks – we&apos;ve got your message.</p>
        <p className="mt-1 text-emerald-900/80">
          We aim to reply within two business days. For privacy / data
          requests, we have up to one month under the GDPR but usually
          respond much sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from sighted users + screen readers */}
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
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your name
          </span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
            className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:opacity-50"
            placeholder="First Last"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:opacity-50"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          What can we help with?
        </span>
        <select
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={status === "loading"}
          className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none disabled:opacity-50"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Message
        </span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "loading"}
          className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:opacity-50"
          placeholder="What's on your mind?"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500">
          By sending this you agree to our{" "}
          <a href="/privacy" className="underline hover:text-slate-700">
            Privacy Policy
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>

      {status === "error" ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMsg}
        </p>
      ) : null}
    </form>
  );
}

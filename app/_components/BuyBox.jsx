"use client";

import Link from "next/link";
import { useState } from "react";

const TRUST_ITEMS = [
  { label: "Risk-free", rest: "30-day full refund" },
  { label: "One-time purchase", rest: "No subscription" },
  { label: "Works offline", rest: "Save to phone" },
];

export default function BuyBox({
  price,
  checkoutHref,
  pdfHref,
  linksHref,
  hasAffiliateLinks,
  essentialBookings,
}) {
  const bookings = Array.isArray(essentialBookings) ? essentialBookings : [];
  const bookingCount = bookings.length;
  const [openLinks, setOpenLinks] = useState(true);
  const targetHref = checkoutHref || pdfHref || null;

  const handleBuy = (e) => {
    if (!targetHref) return;
    if (!openLinks || bookingCount === 0) {
      // Default browser navigation handles it
      return;
    }
    e.preventDefault();
    // Open all booking tabs in the same user gesture so popup blockers
    // allow them, then navigate the main tab to checkout last.
    bookings.forEach((url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
    window.location.href = targetHref;
  };

  const button = targetHref ? (
    <a
      href={targetHref}
      onClick={handleBuy}
      className="block w-full rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Get the Guide
    </a>
  ) : (
    <button
      type="button"
      disabled
      className="block w-full rounded-full bg-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-white"
    >
      Coming soon
    </button>
  );

  return (
    <aside className="h-fit rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200 md:sticky md:top-6 md:self-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        PDF Guide
      </p>
      {price ? (
        <p className="mt-2 text-3xl font-semibold text-slate-900">{price}</p>
      ) : null}
      <p className="mt-1 text-xs text-slate-500">Instant download</p>
      <div className="mt-4 space-y-2">
        {button}
        {hasAffiliateLinks && linksHref ? (
          <Link
            href={linksHref}
            className="block w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Get the links free
          </Link>
        ) : null}
      </div>
      {bookingCount > 0 ? (
        <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={openLinks}
            onChange={(e) => setOpenLinks(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span>
            Also open my{" "}
            <strong className="font-semibold">{bookingCount}</strong> booking{" "}
            {bookingCount === 1 ? "link" : "links"} (hotel, transport)
          </span>
        </label>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {TRUST_ITEMS.map(({ label, rest }) => (
          <li key={label} className="flex gap-2">
            <span aria-hidden className="mt-0.5 shrink-0 text-[#0f6e56]">✓</span>
            <span>
              <strong className="font-semibold text-slate-900">{label}</strong>
              <span className="text-slate-500"> · {rest}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

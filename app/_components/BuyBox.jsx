"use client";

import Link from "next/link";
import { useState } from "react";
// English only as the fallback: every current call site passes `t`, and
// importing getDict would put all five locale dictionaries in the client
// bundle where one suffices as a safety net.
import en from "../_lib/dicts/en";

export default function BuyBox({
  price,
  checkoutHref,
  pdfHref,
  linksHref,
  hasAffiliateLinks,
  essentialBookings,
  t: tProp,
}) {
  const t = tProp || en.guide;
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
      className="block w-full rounded-full bg-brand-terracotta px-4 py-2.5 text-center text-sm font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90"
    >
      {t.getGuide}
    </a>
  ) : (
    <button
      type="button"
      disabled
      className="block w-full rounded-full bg-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-white"
    >
      {t.comingSoonBtn}
    </button>
  );

  return (
    // Sticks below the header (md:h-20) rather than under it, matching the
    // 88px offset the Inspire story sidebar already uses.
    <aside className="h-fit rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200 md:sticky md:top-[88px] md:self-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {t.pdfGuideLabel}
      </p>
      {price ? (
        <p className="mt-2 text-3xl font-semibold text-slate-900">{price}</p>
      ) : null}
      <p className="mt-1 text-xs text-slate-500">{t.instantDownload}</p>
      <div className="mt-4 space-y-2">
        {button}
        {/* "Get the links free" removed 2026-07-27 (founder: revisit later).
            linksHref/hasAffiliateLinks props stay wired for the return. */}
      </div>
      {targetHref ? (
        <p className="mt-2 text-center text-xs text-slate-500">
          {t.refunds}{" "}
          <Link
            href="/refund-policy"
            className="underline decoration-slate-400 underline-offset-2 hover:text-slate-700"
          >
            {t.readPolicy}
          </Link>
          .
        </p>
      ) : null}
      {bookingCount > 0 ? (
        <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={openLinks}
            onChange={(e) => setOpenLinks(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span>
            {bookingCount === 1
              ? t.openBookingsOne
              : t.openBookingsMany.replace("{count}", String(bookingCount))}
          </span>
        </label>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {t.trust.map(({ label, rest }) => (
          <li key={label} className="flex gap-2">
            <span aria-hidden className="mt-0.5 shrink-0 text-[#943d21]">✓</span>
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

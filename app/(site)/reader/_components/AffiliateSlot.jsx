/**
 * The commercial slot on a place card, a stay pick, a reservation or an
 * activity: one link through /go/<alias>, where tracking-ID injection,
 * region routing and the anonymous click capture already live. The alias
 * is a frozen printed contract (it is what the PDF's QR codes carry), so
 * this renders nothing rather than guess when a row has none.
 */
export default function AffiliateSlot({ goSlug, label = "Book", className = "" }) {
  if (!goSlug) return null;
  return (
    <a
      href={`/go/${goSlug}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={
        "inline-flex items-center gap-1 rounded-full bg-brand-flame px-3.5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-brand-flame/90 " +
        className
      }
    >
      {label} →
    </a>
  );
}

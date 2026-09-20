/**
 * The deck's per-day boxes. `warning` carries the ⚠ glyph and the Brandy
 * edge the deck uses; `info` and `booking` sit quieter in Taupe. Body is
 * always an array of paragraphs in the canonical shape.
 */
export default function Callout({ callout }) {
  const warning = callout.kind === "warning";
  return (
    <aside
      className={
        "rounded-lg border bg-white/70 px-4 py-3 " +
        (warning ? "border-brand-terracotta/40" : "border-brand-line")
      }
    >
      <p
        className={
          "font-sans text-[11px] font-bold uppercase tracking-[0.14em] " +
          (warning ? "text-brand-terracotta" : "text-slate-600")
        }
      >
        {warning ? "⚠ " : ""}
        {callout.title}
      </p>
      {callout.body.map((para, i) => (
        <p key={i} className="mt-1.5 text-[15px] leading-snug text-slate-800">
          {para}
        </p>
      ))}
    </aside>
  );
}

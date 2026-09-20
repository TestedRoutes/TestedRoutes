/** The practical facts on a place card, from place.attributes, in a fixed order. */
const KEYS = [
  ["access", "Getting there"],
  ["time_needed", "Time"],
  ["cost_band", "Cost"],
  ["season", "Season"],
  ["parking", "Parking"],
  ["road", "Road"],
];

export default function PlaceFacts({ attributes }) {
  const rows = KEYS.filter(([k]) => attributes?.[k]);
  if (!rows.length) return null;
  return (
    <dl className="mt-4 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
      {rows.map(([k, label]) => (
        <div key={k} className="flex gap-3 px-3.5 py-2.5">
          <dt className="w-24 shrink-0 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
          <dd className="text-[14px] leading-snug text-slate-800">{attributes[k]}</dd>
        </div>
      ))}
    </dl>
  );
}

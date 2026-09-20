import { notFound } from "next/navigation";
import { loadReaderSku } from "../../_lib/loadReaderSku";
import { groupBy } from "../../_lib/format";

/** The pack list, grouped as authored (On you · In pack · In pocket). */
export default async function ReaderPack({ params }) {
  const { slug } = await params;
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  const intro = sku.sections.find((s) => s.type === "pack")?.payload;
  const groups = groupBy(sku.packItems, (p) => p.group);
  return (
    <>
      <h1 className="text-3xl leading-tight">{intro?.title || "Pack for this trip"}</h1>
      {intro?.intro ? <p className="mt-1 text-slate-600">{intro.intro}</p> : null}
      {groups.map(([group, items]) => (
        <section key={group} className="mt-6">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
            {group || "Pack"}
          </h2>
          <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70">
            {items.map((p, i) => (
              <li key={i} className="px-3.5 py-2.5">
                <p className="font-sans text-[15px] font-bold leading-tight">{p.label}</p>
                {p.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{p.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

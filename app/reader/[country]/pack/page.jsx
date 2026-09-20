import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { groupBy } from "../../_lib/format";

/** Pack: the list, grouped as authored (On you · In pack · In pocket), per open route. */
export default async function ReaderPack({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "pack");
  const routes = data.routes.filter((r) => r.sku && r.sku.packItems.length);
  return (
    <>
      {routes.map((r, ri) => {
        const intro = r.sku.sections.find((s) => s.type === "pack")?.payload;
        return (
          <section key={r.slug} className={ri ? "mt-10" : ""}>
            <h1 className="text-3xl leading-tight">{intro?.title || "Pack for this trip"}</h1>
            {intro?.intro ? <p className="mt-1 text-slate-600">{intro.intro}</p> : null}
            {routes.length > 1 ? <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.12em] text-slate-500">{r.title}</p> : null}
            {groupBy(r.sku.packItems, (p) => p.group).map(([group, items]) => (
              <div key={group} className="mt-6">
                <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">{group || "Pack"}</h2>
                <ul className="mt-2 divide-y divide-brand-line rounded-xl border border-brand-line bg-white/70 md:columns-2 md:gap-0 md:divide-y-0 md:[&>li]:break-inside-avoid md:[&>li]:border-b md:[&>li]:border-brand-line">
                  {items.map((p, i) => (
                    <li key={i} className="px-3.5 py-2.5">
                      <p className="font-sans text-[15px] font-bold leading-tight">{p.label}</p>
                      {p.note ? <p className="mt-0.5 text-sm leading-snug text-slate-600">{p.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}

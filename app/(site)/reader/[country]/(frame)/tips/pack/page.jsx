import Link from "next/link";
import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../../../_lib/access";
import { loadReaderCountry } from "../../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../../_lib/track";
import { groupBy, readerPaths } from "../../../../_lib/format";
import LockedBox from "../../../../_components/LockedBox";

/**
 * The pack list: the one line that explains it (15 kg on every domestic
 * hop), then one card per group with each item and its reason. Card grid
 * like the tips, not a two-column list.
 */
export default async function ReaderPack({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "pack", { access: owned });
  const routes = data.routes.filter((r) => r.sku && r.sku.packItems.length);
  const intro = routes[0]?.sku.sections.find((s) => s.type === "pack")?.payload;
  const back = (
    <Link href={readerPaths.tips(country)} className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600 hover:text-brand-terracotta">← Travel tips</Link>
  );
  return (
    <>
      {back}
      <h2 className="mt-3 text-3xl leading-tight">{intro?.title || "What to pack"}</h2>
      {intro?.intro ? <p className="mt-2 max-w-2xl text-[16px] text-slate-700">{intro.intro}</p> : null}
      {!owned ? (
        <div className="mt-6"><LockedBox data={data} what="The pack list, item by item, with the reason for each." /></div>
      ) : (
        routes.map((r) => (
          <div key={r.slug} className="mt-6 grid gap-6 md:grid-cols-3">
            {groupBy(r.sku.packItems, (p) => p.group).map(([group, items]) => (
              <section key={group} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-brand-line">
                <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-slate-500">{group || "Pack"}</p>
                <ul className="mt-4 divide-y divide-brand-line">
                  {items.map((p, i) => (
                    <li key={i} className="py-3 first:pt-0 last:pb-0">
                      <p className="font-sans text-[16px] font-semibold leading-tight text-slate-900">{p.label}</p>
                      {p.note ? <p className="mt-1 text-[14px] leading-snug text-slate-600">{p.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))
      )}
    </>
  );
}

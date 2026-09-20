import Link from "next/link";
import { notFound } from "next/navigation";
import { loadReaderSku } from "../../../_lib/loadReaderSku";
import { dayBadge, dayHref, daySpan, placeIndex, pageForDay, titleCase } from "../../../_lib/format";
import DayChips from "../../../_components/DayChips";
import Timeline from "../../../_components/Timeline";
import Callout from "../../../_components/Callout";

/**
 * One day page: the chip strip, the day header, the hour rail, the deck's
 * callouts, prev/next. /day/<n> resolves to the page covering calendar day
 * n, so /day/5 and /day/4 both show "Days 4–5" (the chip links use the
 * first day; both forms work from a typed URL).
 */
export default async function ReaderDay({ params }) {
  const { slug, n } = await params;
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  const page = pageForDay(sku, n);
  if (!page) notFound();

  const idx = sku.days.indexOf(page);
  const prev = idx > 0 ? sku.days[idx - 1] : null;
  const next = idx < sku.days.length - 1 ? sku.days[idx + 1] : null;
  const span = daySpan(page);
  const places = placeIndex(sku);
  const stub = page.slots.length === 0;

  return (
    <>
      <DayChips sku={sku} current={page} />

      <header className="mt-4">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
          {dayBadge(page)}
          {span ? ` · ${span}` : ""}
        </p>
        <h1 className="mt-1 text-3xl leading-tight">{titleCase(page.title)}</h1>
        {page.subtitle ? (
          <p className="mt-2 text-[17px] leading-snug text-slate-700">{page.subtitle}</p>
        ) : null}
      </header>

      {page.photoCaption ? (
        <figure className="mt-4">
          <div className="aspect-[4/3] w-full rounded-xl bg-brand-bone" />
          <figcaption className="mt-1.5 font-sans text-xs text-slate-500">{page.photoCaption}</figcaption>
        </figure>
      ) : null}

      {stub ? (
        <div className="mt-6 rounded-xl border border-dashed border-brand-ink/25 px-4 py-6 text-center">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
            Timeline pending
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This day renders once the deck extraction runs. Day 2 shows the finished shape.
          </p>
        </div>
      ) : (
        <section className="mt-6">
          <p className="mb-4 font-script text-lg text-brand-terracotta">the plan</p>
          <Timeline page={page} places={places} />
        </section>
      )}

      {page.callouts.length ? (
        <section className="mt-7 flex flex-col gap-2.5">
          {page.callouts.map((c, i) => (
            <Callout key={i} callout={c} />
          ))}
        </section>
      ) : null}

      <nav className="mt-9 flex justify-between gap-4 border-t border-brand-line pt-4 font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
        {prev ? (
          <Link href={dayHref(slug, prev)} className="text-slate-600 hover:text-brand-terracotta">
            ← {dayBadge(prev)} · {titleCase(prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={dayHref(slug, next)} className="text-right text-slate-600 hover:text-brand-terracotta">
            {dayBadge(next)} · {titleCase(next.title)} →
          </Link>
        ) : null}
      </nav>
    </>
  );
}

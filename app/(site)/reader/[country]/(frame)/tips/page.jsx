import Link from "next/link";
import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../../_lib/access";
import { loadReaderCountry } from "../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../_lib/track";
import LockedBox from "../../../_components/LockedBox";

/**
 * Travel tips, per the founder's mock: a grid of cards, eyebrow · title ·
 * one paragraph, authored in country.yaml `tips:`. A card can link to a
 * fuller page inside the reader (the bookings checklist, the pack list).
 * Without access the first two cards are open and the rest show the buy
 * box beneath a faded preview.
 */
const FREE_CARDS = 2;

export default async function ReaderTips({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "tips", { access: owned });
  const tips = data.tips;
  const visible = owned ? tips : tips.slice(0, FREE_CARDS);
  const locked = owned ? [] : tips.slice(FREE_CARDS);

  const card = (t, i, dim) => (
    <article key={i} className={"flex flex-col rounded-3xl bg-white p-7 shadow-card ring-1 ring-brand-line " + (dim ? "opacity-50" : "")}>
      {t.eyebrow ? <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-slate-500">{t.eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl leading-tight">{t.title}</h2>
      {t.body ? <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{dim ? t.body.split(". ")[0] + "." : t.body}</p> : null}
      {!dim && t.link ? (
        <Link href={`/reader/${country}/${t.link}`} className="mt-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-brand-terracotta">
          {t.linkLabel || "Read more"} →
        </Link>
      ) : null}
    </article>
  );

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((t, i) => card(t, i, false))}
        {locked.map((t, i) => card(t, `l${i}`, true))}
      </div>
      {locked.length ? (
        <div className="mt-8">
          <LockedBox data={data} what={`${locked.length} more tips, the bookings checklist and the pack list.`} />
        </div>
      ) : null}
    </>
  );
}

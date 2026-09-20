import Link from "next/link";
import { getRequestCurrency } from "../../../_lib/currency";
import { countryPrice } from "../_lib/commerce";
import { readerPaths } from "../_lib/format";
import ReaderBuyBox from "./ReaderBuyBox";

/**
 * What a visitor without access sees in place of paid content: one line
 * saying what is behind it, the buy box, and the way back to the free
 * sample. Rendered inline where the content would be, so a shared deep
 * link still lands somewhere that makes sense.
 */
export default async function LockedBox({ data, what }) {
  const c = data.country;
  const price = countryPrice(c, await getRequestCurrency());
  const sample = data.sample;
  return (
    <div className="grid gap-6 rounded-2xl border border-brand-line bg-white/60 p-6 md:grid-cols-[1fr_20rem] md:items-start">
      <div>
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">Part of the full guide</p>
        <h2 className="mt-1 text-2xl leading-tight">{what}</h2>
        <p className="mt-2 text-[15px] text-slate-700">
          The full guide opens every place, every day of every route, the bookings checklist and the pack list.
        </p>
        {sample.route && sample.page ? (
          <p className="mt-3 text-sm text-slate-600">
            Free to read first:{" "}
            <Link href={readerPaths.day(c.slug, sample.routeSlug, sample.page.dayFrom)} className="font-bold text-brand-terracotta">
              the sample day
            </Link>
            .
          </p>
        ) : null}
      </div>
      <ReaderBuyBox
        country={c.slug}
        priceLabel={price?.label || null}
        priceAmount={price?.amount ?? null}
        priceCurrency={price?.currency || null}
        checkoutHref={null}
        unlockTo={readerPaths.country(c.slug)}
      />
    </div>
  );
}

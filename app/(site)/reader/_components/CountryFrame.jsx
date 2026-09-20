import Link from "next/link";
import { getRequestCurrency } from "../../../_lib/currency";
import { longDate, readerPaths } from "../_lib/format";
import { countryPrice } from "../_lib/commerce";
import ReaderTabs from "./ReaderTabs";
import ReaderBuyBox from "./ReaderBuyBox";

/**
 * The country page frame, from the founder's mock: eyebrow (region · place
 * count · last reviewed), H1, intro, and on the right "Open the map" plus,
 * for visitors without access, "Get the guide · <price>". Then the three
 * tabs. The same frame serves the storefront and the reader; what differs
 * is what the pages below it unlock.
 *
 * The only date shown anywhere is "Last reviewed": when the content was
 * last reviewed, never when the founder travelled (his standing rule).
 */
export default async function CountryFrame({ data, owned, children }) {
  const c = data.country;
  const currency = await getRequestCurrency();
  const price = owned ? null : countryPrice(c, currency);
  const eyebrow = [c.regionLabel, `${data.places.length} tested places`, c.reviewed ? `Last reviewed ${longDate(c.reviewed)}` : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6">
      <header className="md:flex md:items-start md:justify-between md:gap-8">
        <div className="min-w-0 max-w-3xl">
          <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          {/* H1 is the country name; the search-intent title lives in the tab title and metadata. The hub's intro paragraph is not rendered here (founder: adds no value on this page). */}
          <h1 className="mt-2 text-5xl leading-none md:text-6xl">{c.name}</h1>
        </div>
        <div className="mt-5 flex shrink-0 flex-wrap items-center gap-2 md:mt-10 md:justify-end">
          <Link
            href={readerPaths.map(c.slug)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 font-sans text-[14px] font-semibold text-brand-cream transition hover:bg-brand-ink/90"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-brand-cream" /> Open the map
          </Link>
          {price ? (
            <a
              href="#get-the-guide"
              className="inline-flex items-center gap-2 rounded-full bg-brand-flame px-5 py-3 font-sans text-[14px] font-semibold text-white transition hover:bg-brand-flame/90"
            >
              Get the guide · {price.label}
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-8">
        <ReaderTabs country={c.slug} />
      </div>

      <div className="mt-8">{children}</div>

      {price ? (
        <section id="get-the-guide" className="mt-16 scroll-mt-6 grid gap-8 md:grid-cols-[1fr_22rem] md:items-start">
          <div>
            <h2 className="text-3xl leading-tight">Every route, every place, one map</h2>
            <ul className="mt-4 grid gap-2 text-[15px] text-slate-700">
              {[
                `${data.places.length} tested places with a photo, what to expect, how to get there and how long it takes`,
                "Hour-by-hour timelines for every day of every route",
                "The bookings checklist with lead times, in the order to make them",
                "The pack list for boats and small planes, and the tested stay at every stop",
              ].map((t) => (
                <li key={t} className="flex gap-2"><span aria-hidden className="text-brand-terracotta">✓</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <ReaderBuyBox
            country={c.slug}
            priceLabel={price.label}
            priceAmount={price.amount}
            priceCurrency={price.currency}
            checkoutHref={null}
            unlockTo={readerPaths.country(c.slug)}
          />
          <div className="fixed inset-x-0 bottom-14 z-30 border-t border-brand-line bg-brand-parchment/95 px-4 py-2.5 backdrop-blur md:hidden">
            <a href="#get-the-guide" className="flex items-center justify-between gap-3">
              <span>
                <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">The full guide</span>
                <span className="block text-xl font-semibold text-slate-900">{price.label}</span>
              </span>
              <span className="rounded-full bg-brand-flame px-5 py-2.5 font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-white">Get the guide</span>
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}

import Link from "next/link";
import { readerPaths } from "../_lib/format";

/**
 * "Routes through Fiji": one card per route in the authored order. This is
 * the chooser the test panel asked for — the honeymoon is one route among
 * four, not the whole product. Cards link into the reader only when the
 * route's sku.yaml exists; the rest are listed as coming, never hidden.
 *
 * Each available route also carries its own real buy button through the
 * existing Polar checkout (`checkoutHref`, resolved by the page from the
 * live guide document), so route-level buying intent lands on the same
 * `checkout_started` funnel as the sales pages from day one.
 */
export default function RoutesChooser({ country, routes, owned }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {routes.map((r) => {
        const available = Boolean(r.sku);
        const href = available ? readerPaths.itinerary(country, r.slug) : null;
        const days = r.sku ? r.sku.days : [];
        const strip = days.length ? days.map((d) => d.title.toLowerCase()).slice(0, 5).join(" · ") : null;
        return (
          <li key={r.slug} className={"flex flex-col rounded-2xl border border-brand-line bg-white/70 p-4 " + (available ? "" : "opacity-80")}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-terracotta">
                {r.days} {r.days === 1 ? "day" : "days"}
              </p>
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                {r.free ? "Free" : r.priceLabel || ""}
                {!available ? " · Coming" : ""}
              </p>
            </div>
            <h3 className="mt-1 text-xl leading-tight">{r.title}</h3>
            {r.who ? <p className="mt-1.5 text-[14px] leading-snug text-slate-700">{r.who}</p> : null}
            {strip ? <p className="mt-2 font-sans text-[12px] capitalize text-slate-500">{strip}</p> : null}
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {href ? (
                <Link href={href} className="rounded-full bg-brand-ink px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-brand-cream">
                  {owned || r.free ? "Open the route" : "See the route"}
                </Link>
              ) : null}
              {!owned && !r.free && r.checkoutHref ? (
                <a href={r.checkoutHref} className="rounded-full bg-brand-flame px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                  Get this route{r.priceLabel ? ` · ${r.priceLabel}` : ""}
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

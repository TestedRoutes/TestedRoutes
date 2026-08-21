import Link from "next/link";
// English only as the fallback: every current call site passes `t`, and
// importing getDict would put all five locale dictionaries in the client
// bundle where one suffices as a safety net.
import en from "../_lib/dicts/en";

// Mobile-only purchase bar pinned to the bottom of guide detail pages.
// MobileTabBar hides itself on these pages so the two never stack.
export default function StickyBuyBar({ price, checkoutHref, pdfHref, t: tProp }) {
  const t = tProp || en.guide;
  const href = checkoutHref || pdfHref;
  if (!href) return null;

  return (
    <>
      {/* In-flow spacer so the fixed bar never covers page content. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-brand-bone/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-5">
          <div className="leading-tight">
            {price ? (
              <p className="text-lg font-semibold text-slate-900">{price}</p>
            ) : null}
            <p className="text-[11px] text-slate-500">{t.pdfInstantDownload}</p>
          </div>
          <Link
            href={href}
            className="rounded-full bg-brand-terracotta px-6 py-2.5 text-sm font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90"
          >
            {t.getGuide}
          </Link>
        </div>
      </div>
    </>
  );
}

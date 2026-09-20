import Link from "next/link";
import ReaderTabs from "./ReaderTabs";

/**
 * The reader chrome: a sticky top bar with the guide's eyebrow and the four
 * section tabs, then the page. Phone-first (the canvas direction is "D on
 * the phone"); on wider screens the same column sits centred at a reading
 * width rather than stretching into a desktop layout — the desktop reader
 * is its own design decision, not a media query.
 */
export default function ReaderShell({ sku, children }) {
  const base = `/reader/${sku.sku.slug}`;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-brand-line bg-brand-parchment/95 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-4 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <Link
              href={base}
              className="truncate font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-terracotta"
            >
              {sku.sku.title.replace(":", " ·")}
            </Link>
            <span className="shrink-0 font-script text-sm text-slate-500">prototype</span>
          </div>
          <ReaderTabs slug={sku.sku.slug} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-5">{children}</main>
    </div>
  );
}

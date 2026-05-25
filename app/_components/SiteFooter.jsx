import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import CookieSettingsButton from "./CookieSettingsButton";

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-7xl border-t border-slate-200 px-6 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-sm">
          <NewsletterForm variant="footer" source="footer" />
        </div>
        <div className="flex flex-col gap-3 text-xs text-slate-500 md:items-end">
          <p>© {new Date().getFullYear()} TestedRoutes. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
            <Link href="/contact" className="transition hover:text-slate-700">
              Contact
            </Link>
            <Link href="/faq" className="transition hover:text-slate-700">
              FAQ
            </Link>
            <Link href="/legal-notice" className="transition hover:text-slate-700">
              Legal
            </Link>
            <Link href="/terms" className="transition hover:text-slate-700">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/refund-policy" className="transition hover:text-slate-700">
              Refunds
            </Link>
            <Link href="/accessibility" className="transition hover:text-slate-700">
              Accessibility
            </Link>
            <Link href="/security" className="transition hover:text-slate-700">
              Security
            </Link>
            <Link href="/affiliate-disclosure" className="transition hover:text-slate-700">
              Affiliate disclosure
            </Link>
            <Link href="/sitemap" className="transition hover:text-slate-700">
              Sitemap
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
      <p className="mt-8 text-[11px] leading-relaxed text-slate-500 md:text-center">
        We independently review everything we recommend. When you buy through
        our links, we may earn a small commission at no extra cost to you.{" "}
        <Link href="/affiliate-disclosure" className="underline hover:text-slate-700">
          More on how this works
        </Link>
        .
      </p>
    </footer>
  );
}

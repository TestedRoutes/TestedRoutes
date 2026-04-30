import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import CookieSettingsButton from "./CookieSettingsButton";

export default function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-slate-200 px-6 py-10 md:flex-row md:items-start md:justify-between">
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
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}

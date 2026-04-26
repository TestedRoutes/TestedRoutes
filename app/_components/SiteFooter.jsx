import NewsletterForm from "./NewsletterForm";

export default function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-slate-200 px-6 py-10 md:flex-row md:items-start md:justify-between">
      <div className="md:max-w-sm">
        <NewsletterForm variant="footer" source="footer" />
      </div>
      <div className="flex flex-col gap-3 text-xs text-slate-500 md:items-end">
        <p>© {new Date().getFullYear()} TestedRoutes. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@testedroutes.com"
            className="transition hover:text-slate-700"
          >
            Contact
          </a>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}

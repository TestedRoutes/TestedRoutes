import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "./_components/CookieConsent";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ef] font-sans text-slate-900">
        {children}
        {/* Vercel Web Analytics — cookie-free, GDPR-compliant by design,
            no consent banner needed. Ships ~1.7KB tracker. Acts as a
            sanity-check overlap with PostHog. */}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}

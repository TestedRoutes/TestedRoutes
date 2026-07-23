import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, DM_Sans } from "next/font/google";
import CookieConsent from "./_components/CookieConsent";

// Brand typography (TR-fonts and colors.docx, 2026-07): Fraunces headings +
// DM Sans body. Capraia was dropped for cost — revisiting it is a Q2 2027
// decision; if it ever lands, swap Fraunces for next/font/local (keep
// --font-serif).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  // Load the optical-size axis so headings can pin the 72pt display cut
  // ("Fraunces 72pt Light" in the styleguide) - see globals.css @layer base.
  axes: ["opsz"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-brand-cream font-sans text-brand-ink">
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

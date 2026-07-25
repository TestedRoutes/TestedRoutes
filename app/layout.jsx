import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, DM_Sans, Mynerve } from "next/font/google";
import CookieConsent from "./_components/CookieConsent";

// Brand typography (TR-fonts and colors.docx, 2026-07): Fraunces headings +
// DM Sans body. Capraia was dropped for cost — revisiting it is a Q2 2027
// decision; if it ever lands, swap Fraunces for next/font/local (keep
// --font-serif).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  // Load the optical-size + softness axes so headings can pin the
  // "Fraunces 72pt SuperSoft Light" cut (TR-font-system.pdf) - see globals.css.
  axes: ["opsz", "SOFT"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
// "quotes / small details" in the brand type system (TR-font-system.pdf).
// Mynerve ships a single regular weight.
const mynerve = Mynerve({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${mynerve.variable}`}
    >
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

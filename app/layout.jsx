import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Fraunces, DM_Sans } from "next/font/google";
import CookieConsent from "./_components/CookieConsent";

// Designer spec pairs Capraia (headings) with DM Sans (body). Capraia is a
// commercial font with no files in the repo yet — Fraunces stands in as the
// serif. Once the licensed .woff2 files arrive, drop them in app/_fonts/ and
// swap Fraunces for next/font/local pointing at them (keep --font-serif).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
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

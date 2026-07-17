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
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        {/* TEMPORARY: AvantLink site-ownership verification (application
            1625133, 2026-07-17). Remove once verified — see
            https://classic.avantlink.com verification instructions. */}
        <script
          type="text/javascript"
          src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=ee226dc3b041a69412e250717f8be15fce3e91d9"
        ></script>
      </head>
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

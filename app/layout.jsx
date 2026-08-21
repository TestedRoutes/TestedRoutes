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

// Site-wide Organization + WebSite JSON-LD (Action Tracker #244, from the
// 2026-08-19 SEO review). Google currently ranks the LT company registry
// above the site for the brand name because the registry has authority and
// mentions it; this is the machine-readable claim that testedroutes.com IS
// the organization — name, logo, founder, and the seven registered social
// profiles tying it together. Page-level JSON-LD (guides, hubs, FAQ) keeps
// its own inline publisher objects; the @id anchors here let those migrate
// to references later without a flag day. The logo lives in public/ rather
// than as a hashed static import because this URL is quoted outside the
// site (Google's cache, LLM citations) and must survive rebuilds.
const SITE_ORIGIN = "https://testedroutes.com";
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "TestedRoutes",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/brand/TR-logo-vertical.svg`,
      },
      founder: {
        "@type": "Person",
        name: "Paulius Pikelis",
        url: `${SITE_ORIGIN}/about`,
      },
      // The seven registered @testedroutes handles (Action Tracker #120) —
      // the same set guidePage.jsx pins on the author byline.
      sameAs: [
        "https://www.instagram.com/testedroutes/",
        "https://www.tiktok.com/@testedroutes",
        "https://www.youtube.com/@testedroutes",
        "https://www.pinterest.com/testedroutes/",
        "https://x.com/testedroutes/",
        "https://www.linkedin.com/company/testedroutes/",
        "https://www.threads.com/@testedroutes/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "TestedRoutes",
      url: SITE_ORIGIN,
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      inLanguage: ["en", "de", "es", "fr", "lt"],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${mynerve.variable}`}
    >
      <body className="bg-brand-cream font-sans text-brand-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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

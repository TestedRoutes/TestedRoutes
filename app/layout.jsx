import "./globals.css";
import ConstructionBanner from "./_components/ConstructionBanner";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

const SITE_URL = "https://pikelistravel.com";
const DEFAULT_OG = "/images/triftbrucke-hero.jpg";
const DEFAULT_DESCRIPTION =
  "Premium travel guides built from 15 years of independent travel across 140 countries – every route personally tested by Paulius Pikelis.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pikelis Travel",
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Pikelis Travel",
    url: SITE_URL,
    title: "Pikelis Travel",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG,
        width: 1200,
        height: 630,
        alt: "Pikelis Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pikelis Travel",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ef] font-sans text-slate-900">
        <ConstructionBanner />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

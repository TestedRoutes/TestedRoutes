import "./globals.css";
import ConstructionBanner from "./_components/ConstructionBanner";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

export const metadata = {
  title: "Pikelis Travel",
  description:
    "Premium travel guides built from 15 years of independent travel across 140 countries – every route personally tested by Paulius Pikelis.",
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

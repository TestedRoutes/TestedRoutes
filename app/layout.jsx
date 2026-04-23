import "./globals.css";

export const metadata = {
  title: "Pikelis Travel",
  description:
    "Premium travel guides built from 15 years of independent travel across 140 countries – every route personally tested by Paulius Pikelis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ef] font-sans text-slate-900">{children}</body>
    </html>
  );
}

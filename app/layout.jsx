import "./globals.css";
import CookieConsent from "./_components/CookieConsent";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ef] font-sans text-slate-900">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

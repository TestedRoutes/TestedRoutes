import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f4ef] font-sans text-slate-900">{children}</body>
    </html>
  );
}

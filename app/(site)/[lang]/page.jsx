import { notFound } from "next/navigation";
import { ALT_LOCALES, localePath } from "../../_lib/i18n";
import HomePage from "../page";

// Localized home: same content as the English home for now (chrome
// translates via the path prefix). noindex until the body is translated,
// so search engines never see English copy on a /de URL.
export function generateStaticParams() {
  return ALT_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return {
    alternates: { canonical: "/" },
    robots: { index: false },
  };
}

export default async function LocalizedHomePage({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) notFound();
  return <HomePage />;
}

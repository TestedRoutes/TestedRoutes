import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../_lib/i18n";
import InspireIndexPage, {
  buildInspireIndexMetadata,
} from "../../inspire/inspireIndexPage";

export function generateStaticParams() {
  return ALT_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return buildInspireIndexMetadata(lang);
}

export default async function LocalizedInspirePage({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) {
    // Paused locale (locale.js): redirect, don't 404 — see [lang]/page.jsx.
    if (PAUSED_LOCALES.includes(lang)) redirect("/inspire");
    notFound();
  }
  return <InspireIndexPage lang={lang} />;
}

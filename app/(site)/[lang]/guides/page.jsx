import { notFound } from "next/navigation";
import { ALT_LOCALES } from "../../../_lib/i18n";
import GuidesIndexPage, {
  buildGuidesIndexMetadata,
} from "../../guides/guidesIndexPage";

export function generateStaticParams() {
  return ALT_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return buildGuidesIndexMetadata(lang);
}

export default async function LocalizedGuidesPage({ params, searchParams }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) notFound();
  const { q = "" } = (await searchParams) || {};
  return <GuidesIndexPage lang={lang} q={q} />;
}

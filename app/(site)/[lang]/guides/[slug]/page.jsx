import { notFound } from "next/navigation";
import { ALT_LOCALES } from "../../../../_lib/i18n";
import { loadGuides } from "../../../../_lib/loadGuides";
import GuidePage, { buildGuideMetadata } from "../../../guides/guidePage";

export async function generateStaticParams() {
  const params = [];
  for (const lang of ALT_LOCALES) {
    const guides = await loadGuides(undefined, lang);
    params.push(...guides.map((g) => ({ lang, slug: g.slug })));
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return buildGuideMetadata(lang, slug);
}

export default async function LocalizedGuidePage({ params }) {
  const { lang, slug } = await params;
  if (!ALT_LOCALES.includes(lang)) notFound();
  return <GuidePage lang={lang} slug={slug} />;
}

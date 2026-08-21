import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../../_lib/i18n";
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
  if (!ALT_LOCALES.includes(lang)) {
    // Paused locale (locale.js): redirect, don't 404. Guides were always
    // served from the English documents, so the bare slug is the same page.
    if (PAUSED_LOCALES.includes(lang)) redirect(`/guides/${slug}`);
    notFound();
  }
  return <GuidePage lang={lang} slug={slug} />;
}

import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../../_lib/i18n";
import { loadInspireStories } from "../../../../_lib/loadInspireStories";
import StoryPage, { buildStoryMetadata } from "../../../inspire/storyPage";

export async function generateStaticParams() {
  const params = [];
  for (const lang of ALT_LOCALES) {
    const stories = await loadInspireStories(lang);
    params.push(...stories.map((s) => ({ lang, slug: s.slug })));
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return buildStoryMetadata(lang, slug);
}

export default async function LocalizedInspireStoryPage({ params }) {
  const { lang, slug } = await params;
  if (!ALT_LOCALES.includes(lang)) {
    // Paused locale (locale.js): redirect, don't 404. The bare slug is safe
    // as the target: no translated story doc ever landed in Sanity (verified
    // 2026-08-21), so any slug that resolved under /de|es|fr|lt was the
    // English one.
    if (PAUSED_LOCALES.includes(lang)) redirect(`/inspire/${slug}`);
    notFound();
  }
  return <StoryPage lang={lang} slug={slug} />;
}

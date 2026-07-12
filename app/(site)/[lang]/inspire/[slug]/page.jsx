import { notFound } from "next/navigation";
import { ALT_LOCALES } from "../../../../_lib/i18n";
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
  if (!ALT_LOCALES.includes(lang)) notFound();
  return <StoryPage lang={lang} slug={slug} />;
}

import { loadInspireStories } from "../../../_lib/loadInspireStories";
import StoryPage, { buildStoryMetadata } from "../storyPage";

export async function generateStaticParams() {
  const stories = await loadInspireStories("en");
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildStoryMetadata("en", slug);
}

export default async function InspireStoryPage({ params }) {
  const { slug } = await params;
  return <StoryPage lang="en" slug={slug} />;
}

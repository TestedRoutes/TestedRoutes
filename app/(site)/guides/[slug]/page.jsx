import { loadGuides } from "../../../_lib/loadGuides";
import GuidePage, { buildGuideMetadata } from "../guidePage";

export async function generateStaticParams() {
  const guides = await loadGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildGuideMetadata("en", slug);
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  return <GuidePage lang="en" slug={slug} />;
}

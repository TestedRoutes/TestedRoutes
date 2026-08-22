import { loadGuides } from "../../../_lib/loadGuides";
import GuidePage, { buildGuideMetadata } from "../guidePage";

// No generateStaticParams here on purpose. The (site) layout reads
// cookies()/headers() for currency, so no route in this group is ever
// actually served statically - declaring params only made Next attempt
// on-demand static renders for segments outside the list, and those
// renders died on the layout's cookies() call: junk single-segment URLs
// (crawler probes like /wp-admin) returned 500, and unknown slugs
// returned the not-found body with a 200. Rendering dynamically lets
// notFound()/redirect() answer with their real status codes.
// (Sentry JAVASCRIPT-NEXTJS-F/G, fixed 2026-08-23.)

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildGuideMetadata("en", slug);
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  return <GuidePage lang="en" slug={slug} />;
}

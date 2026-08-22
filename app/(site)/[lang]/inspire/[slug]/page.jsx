import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../../_lib/i18n";
import { loadInspireStories } from "../../../../_lib/loadInspireStories";
import StoryPage, { buildStoryMetadata } from "../../../inspire/storyPage";

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
  const { lang, slug } = await params;
  if (!ALT_LOCALES.includes(lang)) {
  // Decided here, before streaming: (site)/loading.jsx makes every page
  // under it stream, so a notFound()/redirect() thrown in the page body
  // arrives after the 200 header has flushed. generateMetadata runs first.
    if (PAUSED_LOCALES.includes(lang)) redirect(`/inspire/${slug}`);
    notFound();
  }
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

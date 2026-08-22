import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../../_lib/i18n";
import { loadGuides } from "../../../../_lib/loadGuides";
import GuidePage, { buildGuideMetadata } from "../../../guides/guidePage";

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

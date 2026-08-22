import { notFound, redirect } from "next/navigation";
import { ALT_LOCALES, PAUSED_LOCALES } from "../../../_lib/i18n";
import InspireIndexPage, {
  buildInspireIndexMetadata,
} from "../../inspire/inspireIndexPage";

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
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) return {};
  return buildInspireIndexMetadata(lang);
}

export default async function LocalizedInspirePage({ params }) {
  const { lang } = await params;
  if (!ALT_LOCALES.includes(lang)) {
    // Paused locale (locale.js): redirect, don't 404 — see [lang]/page.jsx.
    if (PAUSED_LOCALES.includes(lang)) redirect("/inspire");
    notFound();
  }
  return <InspireIndexPage lang={lang} />;
}

import { notFound, redirect } from "next/navigation";
import { hasReaderAccess } from "../_lib/access";
import { loadReaderCountry, readerCountryForSku } from "../_lib/loadReaderSku";
import { trackReaderView } from "../_lib/track";
import CountryPage from "../_components/CountryPage";
import ReaderShell from "../_components/ReaderShell";

/**
 * Everything under /reader/<country> is gated here, once, for the whole
 * subtree: pages never check access themselves.
 *
 * Ungated visitors get the country guide page (the storefront) whatever URL
 * they arrived on — a 200 with the sample, the routes and the price, never
 * a 403 or a bare key form. That is the page a shared link, an old email or
 * a search result should land on.
 *
 * A legacy /reader/<sku> URL (the first prototype's shape) redirects into
 * its country's reader so nothing already sent to a phone breaks.
 *
 * Paid content, so: no indexing, no caching, no listing. `robots` here plus
 * the /reader/ disallow in app/robots.js are courtesies — the gate is the
 * protection, not the robots file.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  return {
    title: data ? `${data.country.title} · TestedRoutes` : "Guide reader · TestedRoutes",
    description: data?.country.subtitle || undefined,
    robots: { index: false, follow: false, nocache: true, noarchive: true },
  };
}

export default async function ReaderCountryLayout({ children, params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) {
    const owner = await readerCountryForSku(country);
    if (owner) redirect(`/reader/${owner}/itineraries/${country}`);
    notFound();
  }
  const access = await hasReaderAccess();
  if (!access) {
    trackReaderView(country, "storefront", { access: false });
    return <CountryPage data={data} owned={false} />;
  }
  return <ReaderShell country={data}>{children}</ReaderShell>;
}

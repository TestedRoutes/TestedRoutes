import { notFound, redirect } from "next/navigation";
import { loadReaderCountry, readerCountryForSku } from "../_lib/loadReaderSku";

/**
 * /reader/<country>: resolves the country once for the whole subtree. There
 * is no gate swap here any more — every page renders for everyone and
 * decides per section what is open (the sample day, the sample pins, the
 * tips grid's first cards) and what shows the buy box instead. Pages ask
 * hasReaderAccess() themselves; the layout only guarantees the country
 * exists.
 *
 * A legacy /reader/<sku> URL (the first prototype's shape) redirects into
 * its country's itinerary so nothing already sent to a phone breaks.
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
  return children;
}

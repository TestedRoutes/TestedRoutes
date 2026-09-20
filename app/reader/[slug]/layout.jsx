import { notFound } from "next/navigation";
import { hasReaderAccess, readerConfigured } from "../_lib/access";
import { loadReaderSku } from "../_lib/loadReaderSku";
import GatePage from "../_components/GatePage";
import ReaderShell from "../_components/ReaderShell";

/**
 * Everything under /reader/<slug> is gated here, once, for the whole
 * subtree: pages never check access themselves. The gate renders as a 200
 * page (see GatePage) rather than a 403.
 *
 * Paid content, so: no indexing, no caching, no listing. `robots` here plus
 * the /reader/ disallow in app/robots.js are courtesies — the secrecy is
 * the gate, not the robots file. The sitemap and llms-full.txt never reach
 * into this tree.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Guide reader · TestedRoutes",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function ReaderLayout({ children, params }) {
  const { slug } = await params;
  if (!(await hasReaderAccess())) {
    return <GatePage slug={slug} configured={readerConfigured()} />;
  }
  const sku = await loadReaderSku(slug);
  if (!sku) notFound();
  return <ReaderShell sku={sku}>{children}</ReaderShell>;
}

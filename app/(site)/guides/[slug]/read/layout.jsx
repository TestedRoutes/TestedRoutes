/**
 * Layout for the gated guide reader (/guides/<slug>/read/*).
 *
 * Deliberately does NOT gate: App Router layouts see no searchParams and
 * cannot set cookies, so the entitlement check lives in each page
 * (requireGuideAccess) and the token→cookie exchange in /api/access/claim.
 * What the layout does own is the crawl posture: every reader URL is
 * noindexed here once, and vercel.json adds the X-Robots-Tag header on the
 * same paths (belt and braces — the header survives non-HTML responses).
 * Reader URLs are also deliberately absent from app/sitemap.js and
 * llms-full.txt; the secrecy is the auth, but there is no reason to hand
 * crawlers a map of the paid surface either.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function ReadLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      {children}
    </div>
  );
}

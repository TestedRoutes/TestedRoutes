import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import MobileTabBar from "../_components/MobileTabBar";
import PostHogProvider from "../_components/PostHogProvider";
import { getRequestCurrency } from "../_lib/currency";
import { fetchGuideNavEntries } from "../_lib/sanityStory";
import { LOCALES, getDict } from "../_lib/i18n";

// Header + tab bar are client components that resolve their locale from the
// pathname, so they need nav labels for every locale — but importing the
// dictionaries client-side costs ~48 KB on every page. The nav sub-dicts are
// a few hundred bytes, so the server resolves all five and passes them down.
const NAV_DICTS = Object.fromEntries(LOCALES.map((l) => [l, getDict(l).nav]));


const SITE_URL = "https://testedroutes.com";
const DEFAULT_OG = "/images/og-default.jpg";
const DEFAULT_DESCRIPTION =
  "Premium travel guides built from 15 years of independent travel across 140 countries – every route personally tested by Paulius Pikelis.";

// No `alternates` here on purpose. Next merges metadata shallowly down the
// tree, so a canonical set at layout level is inherited verbatim by every
// page that does not define its own — which had /about, /faq, /terms and a
// dozen others all telling Google their canonical URL was the homepage.
// Canonicals live on each page; a page without one emits none, which is
// safe, while an inherited wrong one is active SEO damage.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TestedRoutes",
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    // No `url` either — same inheritance trap as `alternates` above.
    type: "website",
    siteName: "TestedRoutes",
    title: "TestedRoutes",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG,
        width: 1200,
        height: 630,
        alt: "TestedRoutes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TestedRoutes",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG],
  },
};

export default async function SiteLayout({ children }) {
  const currency = await getRequestCurrency();
  // This fetch runs on every page, including ones that never touch Sanity
  // (legal pages, contact, about) — so it asks for the slim nav projection
  // (title/slug/category), not the full catalogue the header search would
  // throw away. If it throws, the whole site is down — so degrade to an
  // empty header search instead of propagating. Content pages that
  // genuinely need Sanity still surface their own errors.
  let searchableGuides = [];
  try {
    searchableGuides = await fetchGuideNavEntries();
  } catch (err) {
    console.error("[site-layout] header guide list failed to load:", err);
  }
  return (
    <PostHogProvider>
      <SiteHeader currency={currency} guides={searchableGuides} navDicts={NAV_DICTS} />
      {children}
      <SiteFooter />
      <MobileTabBar navDicts={NAV_DICTS} />
    </PostHogProvider>
  );
}

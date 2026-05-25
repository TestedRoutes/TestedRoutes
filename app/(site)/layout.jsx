import ConstructionBanner from "../_components/ConstructionBanner";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import PostHogProvider from "../_components/PostHogProvider";
import { getRequestCurrency } from "../_lib/currency";
import { loadGuides } from "../_lib/loadGuides";


const SITE_URL = "https://testedroutes.com";
const DEFAULT_OG = "/images/triftbrucke-hero.jpg";
const DEFAULT_DESCRIPTION =
  "Premium travel guides built from 15 years of independent travel across 140 countries – every route personally tested by Paulius Pikelis.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TestedRoutes",
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "TestedRoutes",
    url: SITE_URL,
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
  const allGuides = await loadGuides();
  const searchableGuides = allGuides.map((g) => ({
    title: g.title,
    slug: g.slug,
    category: g.category,
    href: g.href,
  }));
  return (
    <PostHogProvider>
      <ConstructionBanner />
      <SiteHeader currency={currency} guides={searchableGuides} />
      {children}
      <SiteFooter />
    </PostHogProvider>
  );
}

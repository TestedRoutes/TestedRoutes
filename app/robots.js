export const dynamic = "force-static";

const SITE_URL = "https://testedroutes.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /go/* is a 302 redirector for short campaign links. No content
        // to index; keeps Google focused on canonical /guides/<slug> pages.
        // /api/* are server endpoints, never indexed.
        // /studio/* is the embedded Sanity Studio — editor UI only.
        disallow: ["/go/", "/api/", "/studio/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

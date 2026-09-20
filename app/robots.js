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
        // /reader/* is the gated guide reader: paid content behind a key,
        // never indexed. The gate is the protection; this is the courtesy.
        disallow: ["/go/", "/api/", "/studio/", "/reader/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

import {createClient} from "@sanity/client";

// Companion map for the 5-day Upolu SKU. Mirrors create-samoa-map-links.mjs
// (the 7-day map): one affiliateLink per site language, all pointing at the
// same English My Maps view, because there is one map and the /go/ slug is
// what gets printed. Viewer URL only - the founder's /edit link is never
// registered or printed (playbook 7).
const c = createClient({
  projectId: "y3gc8dx6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const URL = "https://www.google.com/maps/d/viewer?mid=1IShZPbTKllx3Y8G9VsHNX6tvp-Av2IE";

for (const lang of ["en", "lt", "de", "fr", "es"]) {
  const slug = `samoa-upolu-5d-map-${lang}`;
  const existing = await c.fetch(
    '*[_type=="affiliateLink" && slug.current==$slug][0]{_id, url}', {slug});
  if (existing) {
    console.log(slug, "-> already exists", existing._id, existing.url);
    continue;
  }
  const doc = await c.create({
    _type: "affiliateLink",
    label: `Samoa 5-day Upolu companion map (${lang.toUpperCase()})`,
    slug: {_type: "slug", current: slug},
    scope: "guide",
    category: "tickets",
    program: "other",
    url: URL,
  });
  console.log(slug, "-> created", doc._id);
}

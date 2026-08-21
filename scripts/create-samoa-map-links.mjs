import {createClient} from "@sanity/client";

const c = createClient({
  projectId: "y3gc8dx6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const URL = "https://www.google.com/maps/d/viewer?mid=1dCnoDPctbgeGW6YyNQ5rJr5sIgIdas8";

for (const lang of ["en", "lt", "de", "fr", "es"]) {
  const slug = `samoa-upolu-savaii-7d-map-${lang}`;
  const existing = await c.fetch(
    '*[_type=="affiliateLink" && slug.current==$slug][0]{_id, url}', {slug});
  if (existing) {
    console.log(slug, "-> already exists", existing._id, existing.url);
    continue;
  }
  const doc = await c.create({
    _type: "affiliateLink",
    label: `Samoa 7-day Upolu & Savai'i companion map (${lang.toUpperCase()})`,
    slug: {_type: "slug", current: slug},
    scope: "guide",
    category: "tickets",
    program: "other",
    url: URL,
  });
  console.log(slug, "-> created", doc._id);
}

// List story docs that carry a guide object (slug + title), for tooling.
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const docs = await client.fetch(
  `*[defined(guide)]{_id, _type, title, "slug": slug.current}`,
);
for (const d of docs) console.log(`${d._type}  ${d.slug}  |  ${d.title}`);

// Align the Trift guide page text with deck v3 (variants bullet, effort,
// access, last-reviewed, not-suitable dupe). Patches draft + published.
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

for (const id of ["story-triftbrucke-from-zurich", "drafts.story-triftbrucke-from-zurich"]) {
  const doc = await client.fetch(`*[_id == $id][0]{primaryStats, whatYouGet, notSuitableSales, lastReviewedDate}`, { id });
  if (!doc) { console.log("missing", id); continue; }

  const primaryStats = (doc.primaryStats || []).map((s) => {
    if (s.label === "Effort") return { ...s, value: "~3 h hike · 5.6 km return (with gondola)" };
    if (s.label === "Access") return { ...s, value: "Car ~2 h · Public transport ~3 h from Zürich" };
    return s;
  });

  const whatYouGet = (doc.whatYouGet || []).map((s) =>
    /route variants/i.test(s)
      ? "Trail map, elevation profile, and a companion Google Map with every pin"
      : s,
  );

  const notSuitable = [
    "If you have a fear of heights or exposed bridge crossings",
    "For most dogs – the moving bridge deck spooks them",
  ];

  await client.patch(id).set({
    primaryStats,
    whatYouGet,
    notSuitableSales: notSuitable,
    lastReviewedDate: "2026-07-27",
  }).commit();
  console.log("patched", id, "| was reviewed:", doc.lastReviewedDate);
}

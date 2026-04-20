import { loadInspireStories } from "./loadInspireStoriesData.js";

const STORIES_BASE = "/Content/Stories/";

function encodeFolder(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

export async function loadGuides() {
  const stories = await loadInspireStories({ basePath: STORIES_BASE });

  return stories
    .filter((s) => {
      const g = s.metadata?.guide;
      return g && (g.has_guide === true || g.has_guide === "true");
    })
    .map((s) => {
      const g = s.metadata.guide;
      const folderPath = `${STORIES_BASE}${encodeFolder(s.folderName)}/`;
      const pdfHref = g.guide_pdf ? `${folderPath}${encodeURIComponent(g.guide_pdf)}` : null;
      const timing = s.metadata?.timing || {};
      const diff = s.metadata?.difficulty || {};
      return {
        slug: s.slug,
        title: s.title,
        category: s.metadata?.classification?.journey_category?.replace(/_/g, " ") || "Guide",
        country: s.metadata?.geography?.country || "",
        duration: timing.duration_display || `${timing.duration_days || ""} day${timing.duration_days !== 1 ? "s" : ""}`.trim(),
        difficulty: diff.overall_level || "",
        price: g.guide_price ? `€${g.guide_price}` : "",
        currency: g.guide_currency || "EUR",
        image: s.heroPhoto || null,
        href: g.guide_page || pdfHref || null,
        pdfHref,
        meta: "PDF guide",
        storySlug: s.slug,
        excerpt: typeof s.storyContent === "string" ? s.storyContent.slice(0, 200).trim() : "",
      };
    });
}

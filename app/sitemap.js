import { loadGuides } from "./_lib/loadGuides";
import { loadInspireStories } from "./_lib/loadInspireStories";

export const dynamic = "force-static";

const SITE_URL = "https://testedroutes.com";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: "/", changeFrequency: "weekly", priority: 1.0 },
    { url: "/about", changeFrequency: "monthly", priority: 0.7 },
    { url: "/destinations", changeFrequency: "weekly", priority: 0.6 },
    { url: "/destinations/switzerland", changeFrequency: "weekly", priority: 0.8 },
    { url: "/guides", changeFrequency: "weekly", priority: 0.9 },
    { url: "/inspire", changeFrequency: "weekly", priority: 0.8 },
  ];

  const [guides, stories] = await Promise.all([loadGuides(), loadInspireStories()]);

  const guideRoutes = guides.map((g) => ({
    url: `/guides/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const storyRoutes = stories.map((s) => ({
    url: `/inspire/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: s.date ? new Date(s.date) : now,
  }));

  return [...staticRoutes, ...guideRoutes, ...storyRoutes].map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: r.lastModified || now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

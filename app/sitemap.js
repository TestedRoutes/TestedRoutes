import { loadGuides } from "./_lib/loadGuides";
import { loadInspireStories } from "./_lib/loadInspireStories";
import { ALT_LOCALES, localePath } from "./_lib/i18n";

export const dynamic = "force-static";

const SITE_URL = "https://testedroutes.com";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: "/", changeFrequency: "weekly", priority: 1.0 },
    { url: "/about", changeFrequency: "monthly", priority: 0.7 },
    { url: "/destinations", changeFrequency: "weekly", priority: 0.6 },
    { url: "/destinations/switzerland", changeFrequency: "weekly", priority: 0.8 },
    { url: "/destinations/seychelles", changeFrequency: "weekly", priority: 0.8 },
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

  // Localized Inspire + Guides: only languages with published content.
  const localizedRoutes = [];
  for (const lang of ALT_LOCALES) {
    const localized = await loadInspireStories(lang);
    if (localized.length) {
      localizedRoutes.push({
        url: localePath(lang, "/inspire"),
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const s of localized) {
        localizedRoutes.push({
          url: localePath(lang, `/inspire/${s.slug}`),
          changeFrequency: "monthly",
          priority: 0.6,
          lastModified: s.date ? new Date(s.date) : now,
        });
      }
    }
    const localizedGuides = await loadGuides(undefined, lang);
    if (localizedGuides.length) {
      localizedRoutes.push({
        url: localePath(lang, "/guides"),
        changeFrequency: "weekly",
        priority: 0.8,
      });
      for (const g of localizedGuides) {
        localizedRoutes.push({
          url: localePath(lang, `/guides/${g.slug}`),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  return [...staticRoutes, ...guideRoutes, ...storyRoutes, ...localizedRoutes].map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: r.lastModified || now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

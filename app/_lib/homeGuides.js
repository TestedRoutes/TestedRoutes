// Hardcoded cards for the homepage "Browse guides" rail.
// Kept separate from the metadata-driven catalog (/guides) because this rail
// intentionally shows coming-soon placeholders alongside the real guides.

const STORY_BASE = "/Content/Stories/2020%2010%2018%20Triftbrucke%20from%20Zurich/";

export const HOME_GUIDES = [
  {
    category: "Day Trip",
    title: "Triftbrücke from Zurich",
    duration: "1 day",
    meta: "PDF guide",
    price: "€12.99",
    href: "/guides/trift-bridge-from-zurich",
    images: [
      `${STORY_BASE}Hero-triftfrucke.jpg`,
      `${STORY_BASE}20201018_100027.jpg`,
      `${STORY_BASE}20201018_111328.jpg`,
      `${STORY_BASE}20201018_114042.jpg`,
      `${STORY_BASE}20201018_130613.jpg`,
    ],
  },
  { category: "Day Trip", title: "Simplon Pass from Zurich", duration: "1 day", meta: "PDF guide", price: "€9.99", coming_soon: true },
  { category: "Day Trip", title: "Stoos Ridge from Zurich", duration: "1 day", meta: "PDF guide", price: "€9.99", coming_soon: true },
  { category: "Day Trip", title: "Appenzell & Ebenalp from Zurich", duration: "1 day", meta: "PDF guide", price: "€12.99", coming_soon: true },
  { category: "Day Trip", title: "Mount Rigi from Zurich", duration: "1 day", meta: "PDF guide", price: "€9.99", coming_soon: true },
  { category: "Day Trip", title: "Säntis from Zurich", duration: "1 day", meta: "PDF guide", price: "€12.99", coming_soon: true },
  { category: "Day Trip", title: "Flims & Caumasee from Zurich", duration: "1 day", meta: "PDF guide", price: "€9.99", coming_soon: true },
];

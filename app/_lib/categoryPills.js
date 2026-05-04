// Shared category pill data + asset helper used on Home and Inspire pages.
// Placeholder images — to be replaced with category-specific photos later.
const CATEGORY_PILLS = [
  { label: "Hiking", file: "Toubkal 2025.jpg" },
  { label: "Mountaineering", file: "7_Summits_Denali 2022.jpg" },
  { label: "Skiing", file: "Summits Alaska 2019 v2.jpg" },
  { label: "Diving", file: "Sharks Fiji 2025.jpg" },
  { label: "Rafting", file: "Rafting Zambia 2019.jpg" },
  { label: "Kayaking", file: "Milford Sound - NZ 2025.jpg" },
  { label: "Via Ferrata", file: "Ice climbing Italy 2019.jpg" },
  { label: "Bungee", file: "Victoria falls 2019.jpg" },
  { label: "Seven Summits", file: "7_Summits_Kilimanjaro 2016.jpg" },
  { label: "Africa Rally", file: "Africa Rally - Guinea 2024.jpg" },
  { label: "Safari", file: "Africa rally - Desert 2023.jpg" },
  { label: "Roadtrips", file: "Mongol rally.jpg" },
  { label: "Switzerland", file: "Matterhorn 2020.jpg" },
  { label: "Iceland", file: "Mt Cook - NZ 2026.jpg" },
];

export function aboutAsset(filename) {
  return "/About%20me/" + encodeURIComponent(filename);
}

export function getCategoryItems() {
  return CATEGORY_PILLS.map((item) => ({
    label: item.label,
    src: aboutAsset(item.file),
  }));
}

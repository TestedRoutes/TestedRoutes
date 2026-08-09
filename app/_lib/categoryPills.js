// Shared category pill data used on Home, Guides and Inspire pages.
// Thumbnails live in content/category-pills/ — 640px web-sized copies
// generated from the content/about originals; regenerate there if a
// pill photo changes. Placeholder images — to be replaced with
// category-specific photos later.
import toubkal from "../../content/category-pills/Toubkal 2025.jpg";
import denali from "../../content/category-pills/7_Summits_Denali 2022.jpg";
// 1280px copy (founder swap 2026-08-08) — wider than the older 640px pills
// because the adventure cards render large now.
import skiing from "../../content/category-pills/skiing.jpg";
import sharksFiji from "../../content/category-pills/Sharks Fiji 2025.jpg";
import raftingZambia from "../../content/category-pills/Rafting Zambia 2019.jpg";
import milfordSound from "../../content/category-pills/Milford Sound - NZ 2025.jpg";
import iceClimbing from "../../content/category-pills/Ice climbing Italy 2019.jpg";
import victoriaFalls from "../../content/category-pills/Victoria falls 2019.jpg";
import kilimanjaro from "../../content/category-pills/7_Summits_Kilimanjaro 2016.jpg";
import africaRallyGuinea from "../../content/category-pills/Africa Rally - Guinea 2024.jpg";
import africaRallyDesert from "../../content/category-pills/Africa rally - Desert 2023.jpg";
import mongolRally from "../../content/category-pills/Mongol rally.jpg";
import matterhorn from "../../content/category-pills/Matterhorn 2020.jpg";
import mtCook from "../../content/category-pills/Mt Cook - NZ 2026.jpg";

const CATEGORY_PILLS = [
  { label: "Hiking", image: toubkal },
  { label: "Mountaineering", image: denali },
  { label: "Skiing", image: skiing },
  { label: "Diving", image: sharksFiji },
  { label: "Rafting", image: raftingZambia },
  { label: "Kayaking", image: milfordSound },
  { label: "Via Ferrata", image: iceClimbing },
  { label: "Bungee", image: victoriaFalls },
  { label: "Seven Summits", image: kilimanjaro },
  { label: "Africa Rally", image: africaRallyGuinea },
  { label: "Safari", image: africaRallyDesert },
  { label: "Roadtrips", image: mongolRally },
  { label: "Switzerland", image: matterhorn },
  { label: "Iceland", image: mtCook },
];

export function getCategoryItems() {
  return CATEGORY_PILLS.map((item) => ({
    label: item.label,
    src: item.image.src,
  }));
}

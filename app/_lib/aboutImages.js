// Static imports for the founder/About photos in content/about/. Importing
// through the bundler (instead of serving public/ files verbatim) lets
// next/image generate right-sized WebP variants per device.
// Keys are the original filenames so page-level data arrays stay readable.
import aboutMe2 from "../../content/about/About me2.jpg";
import countriesVisited from "../../content/about/Countries_visited v2.jpg";
import whyTheseGuidesWork from "../../content/about/Why these guides work.jpg";
import whyIDoThis from "../../content/about/Why I do this.jpg";
import mongolRally from "../../content/about/Mongol rally.jpg";
import africaRally1 from "../../content/about/Africa Rally_1.jpg";
import australia from "../../content/about/Australia 2-edited.JPG";
import aconcagua from "../../content/about/7_Summits_Aconcagua 2017.jpg";
import denali from "../../content/about/7_Summits_Denali 2022.jpg";
import kilimanjaro from "../../content/about/7_Summits_Kilimanjaro 2016.jpg";
import bullsPamplona from "../../content/about/Running with bulls Pamplona 2019.jpg";
import sharksFiji from "../../content/about/Sharks Fiji 2025.jpg";
import nicaraguaBoarding from "../../content/about/Nicaragua boarding 2019.jpg";
import paragliding from "../../content/about/Paragliding.jpg";
import iceClimbing from "../../content/about/Ice climbing Italy 2019.jpg";
import summitsAlaska from "../../content/about/Summits Alaska 2019 v2.jpg";
import ironOreTrain from "../../content/about/Iron Ore train Mauritania 2023.jpg";
import makoko from "../../content/about/Makoko Nigeria 2025.jpg";
import mtCook from "../../content/about/Mt Cook - NZ 2026.jpg";

export const ABOUT_IMAGES = {
  "About me2.jpg": aboutMe2,
  "Countries_visited v2.jpg": countriesVisited,
  "Why these guides work.jpg": whyTheseGuidesWork,
  "Why I do this.jpg": whyIDoThis,
  "Mongol rally.jpg": mongolRally,
  "Africa Rally_1.jpg": africaRally1,
  "Australia 2-edited.JPG": australia,
  "7_Summits_Aconcagua 2017.jpg": aconcagua,
  "7_Summits_Denali 2022.jpg": denali,
  "7_Summits_Kilimanjaro 2016.jpg": kilimanjaro,
  "Running with bulls Pamplona 2019.jpg": bullsPamplona,
  "Sharks Fiji 2025.jpg": sharksFiji,
  "Nicaragua boarding 2019.jpg": nicaraguaBoarding,
  "Paragliding.jpg": paragliding,
  "Ice climbing Italy 2019.jpg": iceClimbing,
  "Summits Alaska 2019 v2.jpg": summitsAlaska,
  "Iron Ore train Mauritania 2023.jpg": ironOreTrain,
  "Makoko Nigeria 2025.jpg": makoko,
  "Mt Cook - NZ 2026.jpg": mtCook,
};

export const PORTRAIT = aboutMe2;

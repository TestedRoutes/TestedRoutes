// The four "journeys" on the Inspire browse band (founder mockup
// 2026-09-04): each is a filter over the story cards, not a Sanity
// document. Sanity's collection docs are too patchy to drive this — only
// Alpine Passes Trail is a real collection; the South Island, the Mongol
// Rally and the 7 Summits are a country, a set of countries and the
// "7 Summits" destination respectively — so the matching rule lives here
// and the copy (eyebrow, title, blurb) lives in each dictionary's
// `inspireList.journeys`, in this order. Counts are computed live from the
// cards, so the band never claims stories that are not on the page.
//
// Card photos come from the founder's About set (content/about, static
// imports so next/image sizes them). A journey without an `image` falls
// back to the hero of its newest story.
import alpinePassesTrail from "../../content/about/Alpine passes trail.jpg";
import milfordSound from "../../content/about/Milford Sound - NZ 2025.jpg";
import mongolRally from "../../content/about/Mongol rally.jpg";
import aconcagua from "../../content/about/7_Summits_Aconcagua 2017.jpg";
import africaRally from "../../content/about/Africa Rally - Sierra Leone 2024.jpg";

export const INSPIRE_JOURNEYS = [
  {
    key: "alpine-passes-trail",
    match: { collection: "Alpine Passes Trail" },
    image: alpinePassesTrail,
  },
  { key: "nz-south-island", match: { countries: ["New Zealand"] }, image: milfordSound },
  {
    key: "mongol-rally",
    match: {
      countries: ["Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Uzbekistan"],
    },
    image: mongolRally,
  },
  // One multi-year overland drive down the west coast of Africa, not a
  // collection: the 2023 leg ran Gibraltar to Guinea, the 2024 leg Guinea to
  // Benin, and later legs carry on toward the Congo. Every inspire story
  // filed under these nine countries came off it - checked folder by folder
  // on 2026-09-12, all 2023/2024-prefixed. MOROCCO IS DELIBERATELY ABSENT:
  // one of its sixteen stories is rally material and the other fifteen are
  // not, so including it would drag an unrelated country's library in here.
  // "Africa Rally" is in the list because the leg-anchor stories are filed
  // under that as their country, and journeyMatches tests card.country.
  // Country strings are the Sanity destination docs' own `country` values -
  // note "Gambia", not "The Gambia".
  //
  // This card is also the STRUCTURAL replacement for the rally-link sentence
  // that used to close every story (founder ruling 2026-09-12, it read as a
  // tic). The cluster is carried by this card, the hubs' story lists and the
  // leg anchors' own links - not by a line of boilerplate in fifteen pieces.
  {
    key: "africa-rally",
    match: {
      countries: [
        "Western Sahara",
        "Mauritania",
        "Senegal",
        "Gambia",
        "Guinea-Bissau",
        "Guinea",
        "Ghana",
        "Togo",
        "Benin",
        "Africa Rally",
      ],
    },
    image: africaRally,
  },
  { key: "seven-summits", match: { countries: ["7 Summits"] }, image: aconcagua },
];

export function journeyMatches(journey, card) {
  const { collection, countries } = journey.match;
  if (collection && Array.isArray(card.collections) && card.collections.includes(collection)) {
    return true;
  }
  if (countries && countries.includes(card.country)) return true;
  return false;
}

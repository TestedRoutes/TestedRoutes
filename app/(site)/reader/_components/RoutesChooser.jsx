"use client";

import GuideListCard from "../../guides/GuideListCard";
import en from "../../../_lib/dicts/en";

/**
 * Itineraries, on the site's own guide card (founder: "use the same cards
 * as for guides"). Every route arrives already shaped by the page — a live
 * guide document's card (`toGuideCard`) with its href pointed into the
 * reader, or a card in the same frame built from the country hero for a
 * route whose guide is still coming — so this only lays them out.
 */
export default function RoutesChooser({ cards, lang = "en" }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((g) => (
        <GuideListCard key={g.slug} guide={g} t={en.guideList} lang={lang} />
      ))}
    </div>
  );
}

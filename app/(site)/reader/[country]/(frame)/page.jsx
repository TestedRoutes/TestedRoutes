import { notFound } from "next/navigation";
import { getRequestCurrency } from "../../../../_lib/currency";
import { hasReaderAccess } from "../../_lib/access";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { routeCards } from "../../_lib/commerce";
import { photoFor } from "../../_lib/photos";
import RoutesChooser from "../../_components/RoutesChooser";

/** Itineraries: the country root and the landing tab, every route on the site's guide card. */
export default async function ReaderItineraries({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "itineraries", { access: owned });
  const hero = photoFor(country, data.country.heroPhoto);
  const cards = await routeCards(country, data.routes, await getRequestCurrency(), {
    heroSrc: hero ? hero.src : null,
    ownedHrefOnly: owned,
  });
  return (
    <>
      <p className="mb-6 max-w-2xl text-[15px] text-slate-600">
        Every route through the same tested places. Days are timed; stops are the places.
      </p>
      <RoutesChooser cards={cards} />
    </>
  );
}

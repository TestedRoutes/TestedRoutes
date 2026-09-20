import { notFound } from "next/navigation";
import { getRequestCurrency } from "../../../../_lib/currency";
import { hasReaderAccess } from "../../_lib/access";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { placeForClient } from "../../_lib/serialise";
import { countryPrice } from "../../_lib/commerce";
import { readerPaths } from "../../_lib/format";
import MapPage from "../../_components/MapPage";

/** The full-screen map, outside the frame: every pin, the photo strip, bookmarks. */
export default async function ReaderMap({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "map", { access: owned });
  const sample = new Set(data.sample.pins);
  const places = data.places.map((p) => placeForClient(country, p, { locked: !owned && !sample.has(p.pinId) }));
  const price = owned ? null : countryPrice(data.country, await getRequestCurrency());
  return (
    <MapPage
      country={country}
      title={data.country.title.replace(/ itinerary$/i, "")}
      places={places}
      backHref={readerPaths.country(country)}
      buyHref={price ? `${readerPaths.country(country)}#get-the-guide` : null}
      priceLabel={price?.label || null}
    />
  );
}

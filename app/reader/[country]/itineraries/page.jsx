import { notFound } from "next/navigation";
import { getRequestCurrency } from "../../../_lib/currency";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { routesWithCommerce } from "../../_lib/commerce";
import RoutesChooser from "../../_components/RoutesChooser";

/** Itineraries: the routes chooser with every route open. */
export default async function ReaderItineraries({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "itineraries");
  const routes = await routesWithCommerce(data.routes, await getRequestCurrency());
  return (
    <>
      <h1 className="text-3xl leading-tight">Itineraries</h1>
      <p className="mt-1 text-slate-600">Every route through the same tested places. Days are timed; stops are the places.</p>
      <div className="mt-5">
        <RoutesChooser country={country} routes={routes} owned />
      </div>
    </>
  );
}

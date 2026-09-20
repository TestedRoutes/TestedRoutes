import { notFound } from "next/navigation";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import { trackReaderView } from "../../_lib/track";
import { placeForClient } from "../../_lib/serialise";
import PlaceGrid from "../../_components/PlaceGrid";

/** Spots: every tested place in the country, photo-first, with filters. */
export default async function ReaderSpots({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "spots");
  const places = data.places.map((p) => placeForClient(country, p));
  return (
    <>
      <h1 className="text-3xl leading-tight">Spots</h1>
      <p className="mt-1 text-slate-600">Every place in the guide, tested in person. Tap one for the card.</p>
      <div className="mt-5">
        <PlaceGrid country={country} places={places} />
      </div>
    </>
  );
}

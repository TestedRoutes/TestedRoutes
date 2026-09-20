import Link from "next/link";
import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../../_lib/access";
import { loadReaderCountry } from "../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../_lib/track";
import { placeForClient } from "../../../_lib/serialise";
import { readerPaths } from "../../../_lib/format";
import PlaceGrid from "../../../_components/PlaceGrid";

/**
 * Places — the second tab (Itineraries is the country root since the
 * founder's header mock of 2026-09-20). Every place shows as a
 * card for everyone (names and photos are the shop window); without
 * access, the cards outside the sample set carry a lock and their pages
 * show the buy box.
 */
export default async function ReaderPlaces({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  trackReaderView(country, "places", { access: owned });
  const sample = new Set(data.sample.pins);
  const places = data.places.map((p) => placeForClient(country, p, { locked: !owned && !sample.has(p.pinId) }));
  return (
    <>
      <PlaceGrid country={country} places={places} mapHref={readerPaths.map(country)} />
      {!owned ? (
        <p className="mt-6 text-sm text-slate-600">
          {sample.size} places are open to read now; the rest open with the guide.{" "}
          <Link href="#get-the-guide" className="font-bold text-brand-terracotta">Get the guide</Link>
        </p>
      ) : null}
    </>
  );
}

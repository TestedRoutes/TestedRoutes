"use client";

/**
 * Per-day route map for the reader: the day's places as numbered pins in
 * itinerary order, the route drawn as a line through the route-role pins.
 *
 * Google Maps when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured (the
 * intended state — buyers live in Google Maps, and the founder's standing
 * rule is Google over OSM); the site's existing Leaflet/OSM component as the
 * fallback so the reader keeps working while the key is pending.
 *
 * `fill` makes the map stretch to its parent (the desktop split layout);
 * otherwise it renders as a fixed-height card (mobile, preview).
 *
 * Antimeridian note (Leaflet path only): Fiji straddles 180°, so a day mixing
 * +179.x and -179.x longitudes would make Leaflet fit bounds the long way
 * around the planet — western pins get +360, same convention as the story
 * routePoints. Google's LatLngBounds handles the seam itself.
 */
import LocationMapClient from "../../../../_components/LocationMapClient";
import GoogleDayMap from "./GoogleDayMap";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

function unwrapAntimeridian(pins) {
  const hasEast = pins.some((p) => p.lng > 90);
  const hasWest = pins.some((p) => p.lng < 0);
  if (!(hasEast && hasWest)) return pins;
  return pins.map((p) => (p.lng < 0 ? { ...p, lng: p.lng + 360 } : p));
}

export default function ReadDayMap({ pins, routeCount, zoom = 10, fill = false }) {
  const usable = (pins ?? []).filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number",
  );
  if (!usable.length) return null;
  const leaflet = unwrapAntimeridian(usable);
  const routePins = leaflet.slice(0, routeCount ?? leaflet.length);
  return (
    <div
      className={
        "overflow-hidden border-brand-line " +
        (fill ? "h-full w-full" : "h-[340px] rounded-xl border shadow-card")
      }
    >
      {GOOGLE_KEY ? (
        <GoogleDayMap
          pins={usable}
          routeCount={routeCount ?? usable.length}
          apiKey={GOOGLE_KEY}
          mapId={GOOGLE_MAP_ID}
        />
      ) : (
        <LocationMapClient
          destinations={leaflet}
          points={routePins.length > 1 ? routePins.map((p) => [p.lat, p.lng]) : undefined}
          zoom={zoom}
        />
      )}
    </div>
  );
}

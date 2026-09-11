"use client";

/**
 * Google Maps day map for the reader — numbered brand pins over the familiar
 * Google basemap, with the day's route drawn as a line through them in
 * itinerary order (straight geodesic segments, not turn-by-turn: the line
 * says "this is the day's shape", the per-day "open in Google Maps" link is
 * where real navigation happens; Directions API calls per page view would be
 * cost without benefit).
 *
 * Needs NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Maps JavaScript API enabled).
 * ReadDayMap falls back to the Leaflet/OSM component while the key is absent.
 * AdvancedMarker requires a map id; NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID overrides
 * the demo one when the founder creates a styled map in the console.
 */
import { useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

const BRANDY = "#943d21";

function RouteLayer({ pins, routeCount }) {
  const map = useMap();

  useEffect(() => {
    if (!map || pins.length === 0) return;
    if (pins.length === 1) {
      map.setCenter({ lat: pins[0].lat, lng: pins[0].lng });
      map.setZoom(13);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    for (const p of pins) bounds.extend({ lat: p.lat, lng: p.lng });
    map.fitBounds(bounds, 48);
  }, [map, pins]);

  useEffect(() => {
    // The line connects only the route-role pins (the first routeCount
    // entries — pinsForDay puts route before extras/detours), so options
    // never redraw the day's shape.
    if (!map || routeCount < 2) return;
    const line = new window.google.maps.Polyline({
      path: pins.slice(0, routeCount).map((p) => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor: BRANDY,
      strokeOpacity: 0.75,
      strokeWeight: 3,
      map,
    });
    return () => line.setMap(null);
  }, [map, pins, routeCount]);

  return null;
}

export default function GoogleDayMap({ pins, routeCount, apiKey, mapId }) {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId={mapId || "DEMO_MAP_ID"}
        defaultCenter={{ lat: pins[0].lat, lng: pins[0].lng }}
        defaultZoom={10}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        className="h-full w-full"
      >
        <RouteLayer pins={pins} routeCount={routeCount ?? pins.length} />
        {pins.map((p, i) => (
          <AdvancedMarker key={i} position={{ lat: p.lat, lng: p.lng }} title={p.name}>
            <div
              className={
                "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-md " +
                (i < (routeCount ?? pins.length) ? "bg-brand-terracotta" : "bg-brand-taupe")
              }
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {i + 1}
            </div>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}

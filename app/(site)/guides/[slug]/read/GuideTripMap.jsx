"use client";

/**
 * The whole guide on one map — the surface that replaces the companion Google
 * My Maps for buyers (founder, 2026-08-31: "My Maps is really difficult to
 * use, that is why we are doing this"). Every located pin of the SKU renders;
 * tapping one opens a card with the place's facts and a Directions link that
 * routes FROM THE BUYER'S CURRENT LOCATION (destination-only dir URL) — the
 * on-trip gesture, unlike the day pages' leg-by-leg planning links.
 *
 * Pins: a place with a photo renders as a circular photo marker (the design
 * direction's "pictures per point"); one without falls back to a colored dot
 * carrying its day number. Role drives color — route pins brandy, everything
 * optional taupe — so the plan reads at a glance and options never shout.
 *
 * Google Maps only: this page's whole point is the familiar basemap. Without
 * the key the page still works through the server-rendered day-grouped list
 * below the map slot; this component just renders nothing.
 */
import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

function FitAll({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !pins.length) return;
    const bounds = new window.google.maps.LatLngBounds();
    for (const p of pins) bounds.extend({ lat: p.lat, lng: p.lng });
    map.fitBounds(bounds, 40);
  }, [map, pins]);
  return null;
}

function directionsUrl(p) {
  return (
    "https://www.google.com/maps/dir/?" +
    new URLSearchParams({ api: "1", destination: `${p.lat},${p.lng}` }).toString()
  );
}

export default function GuideTripMap({ pins }) {
  const [selected, setSelected] = useState(null);
  if (!GOOGLE_KEY || !pins?.length) return null;

  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-2xl border border-brand-line shadow-card">
      <APIProvider apiKey={GOOGLE_KEY}>
        <Map
          mapId={GOOGLE_MAP_ID || "DEMO_MAP_ID"}
          defaultCenter={{ lat: pins[0].lat, lng: pins[0].lng }}
          defaultZoom={9}
          gestureHandling="greedy"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          className="h-full w-full"
        >
          <FitAll pins={pins} />
          {pins.map((p, i) => (
            <AdvancedMarker
              key={i}
              position={{ lat: p.lat, lng: p.lng }}
              title={p.name}
              onClick={() => setSelected(selected === i ? null : i)}
              zIndex={selected === i ? 1000 : p.role === "route" ? 100 : 10}
            >
              {p.photoUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="h-11 w-11 rounded-full border-[3px] border-white object-cover shadow-md"
                  />
                  {p.day ? (
                    <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-terracotta px-0.5 text-[10px] font-bold text-white">
                      {p.day}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div
                  className={
                    "flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white px-1 text-[11px] font-bold text-white shadow-md " +
                    (p.role === "route" ? "bg-brand-terracotta" : "bg-brand-taupe")
                  }
                >
                  {p.day ?? "·"}
                </div>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {selected != null ? (
        <div className="absolute inset-x-3 bottom-3 flex items-start gap-3 border border-brand-line bg-white p-4 shadow-card-hover">
          {pins[selected].photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pins[selected].photoUrl}
              alt={pins[selected].name}
              className="h-16 w-16 flex-shrink-0 object-cover"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="mb-[3pt] mt-0 font-serif text-lg font-semibold text-brand-ink">
              {pins[selected].name}
            </p>
            <p className="mb-[3pt] mt-0 text-xs font-semibold uppercase tracking-wide text-brand-taupe">
              {pins[selected].day ? `Day ${pins[selected].day} · ` : ""}
              {pins[selected].role === "route" ? "On the route" : pins[selected].role}
            </p>
            {pins[selected].description ? (
              <p className="mb-[3pt] mt-1 line-clamp-2 text-sm text-brand-taupe">
                {pins[selected].description}
              </p>
            ) : null}
            <div className="mt-2 flex items-center gap-4">
              <a
                href={directionsUrl(pins[selected])}
                target="_blank"
                rel="noreferrer"
                className="bg-brand-terracotta px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
              >
                Directions
              </a>
              {pins[selected].goSlug ? (
                <a
                  href={`/go/${pins[selected].goSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-brand-terracotta underline"
                >
                  Book / info
                </a>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-lg text-brand-taupe"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}

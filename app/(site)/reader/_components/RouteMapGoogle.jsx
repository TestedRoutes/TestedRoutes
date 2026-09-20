"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Polyline, useMap } from "@vis.gl/react-google-maps";

/**
 * The reader's map on Google Maps (founder rule, 2026-09-20: Google Maps
 * always, never OpenStreetMap). Same pin vocabulary the pages already use:
 *   number  a Brandy circle with the stop number — route stops on a day
 *   photo   a circular photo — a place with photoRef, the Rexby-style pin
 *   dot     a small Taupe dot — the rest of the pool ("what is near me")
 *   muted   a faint dot — the storefront preview of locked pins
 *   me      the visitor's own position (Show my location)
 *
 * Needs NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Maps JavaScript API enabled) and,
 * for the HTML markers, a Map ID: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, with
 * Google's DEMO_MAP_ID as the development fallback. RouteMap.jsx renders a
 * placeholder instead of this component when the key is absent, so a
 * missing key is visible, never a blank box.
 *
 * Longitudes past 180 (Taveuni is stored as 180.12 so the YAML plane is
 * continuous) are normalised here; the route line is geodesic so a leg
 * across the antimeridian takes the short way, not round the world.
 */
const BRANDY = "#943d21";
const TAUPE = "#5f524d";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

const norm = (lng) => (lng > 180 ? lng - 360 : lng < -180 ? lng + 360 : lng);

function PinBody({ pin }) {
  if (pin.kind === "me") {
    // The visitor's own position: the blue dot every map app taught people.
    return (
      <div style={{ width: 22, height: 22, borderRadius: 9999, background: "#1a73e8", border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(26,115,232,.25), 0 2px 6px rgba(0,0,0,.35)" }} />
    );
  }
  if (pin.kind === "number") {
    return (
      <div style={{ width: 26, height: 26, borderRadius: 9999, background: BRANDY, border: "2px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", font: `700 11px/1 ${FONT}` }}>
        {pin.label}
      </div>
    );
  }
  if (pin.kind === "photo" && pin.photoUrl) {
    return (
      <div style={{ width: 44, height: 44, borderRadius: 9999, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.4)", overflow: "hidden", background: "#dcdacd" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pin.photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
  const muted = pin.kind === "muted";
  const size = muted ? 10 : 14;
  return (
    <div style={{ width: size, height: size, borderRadius: 9999, background: muted ? "#a3988a" : TAUPE, opacity: muted ? 0.55 : 1, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
  );
}

/** Fit the view to every pin and the line once the map exists; clamp zoom. */
function FitBounds({ points, maxZoom }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length || typeof google === "undefined") return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(Math.min(11, maxZoom));
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);
    const once = google.maps.event.addListenerOnce(map, "idle", () => {
      if (map.getZoom() > maxZoom) map.setZoom(maxZoom);
    });
    return () => google.maps.event.removeListener(once);
  }, [map, points, maxZoom]);
  return null;
}

/** Pan to the selected pin when the selection comes from outside (the strip). */
function PanTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
  }, [map, target]);
  return null;
}

export default function RouteMapGoogle({ apiKey, mapId, pins, line, height = 420, maxZoom = 11, rounded = true, selectedId, onSelect, fitOnce = true }) {
  const controlled = selectedId !== undefined;
  const [openLocal, setOpenLocal] = useState(null);
  const open = controlled ? selectedId : openLocal;
  const setOpen = (id) => {
    if (onSelect) onSelect(id);
    if (!controlled) setOpenLocal(id);
  };
  const located = (pins || []).filter((p) => p.lat != null && p.lng != null).map((p) => ({ ...p, lng: norm(p.lng) }));
  if (!located.length) return null;
  const path = (line || []).map(([lat, lng]) => ({ lat, lng: norm(lng) }));
  const points = [...located.map((p) => ({ lat: p.lat, lng: p.lng })), ...path];
  const selected = open ? located.find((p) => p.id === open) || null : null;

  return (
    <div style={{ height, width: "100%", borderRadius: rounded ? 12 : 0, overflow: "hidden" }}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={mapId}
          defaultCenter={{ lat: located[0].lat, lng: located[0].lng }}
          defaultZoom={9}
          maxZoom={maxZoom}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
          clickableIcons={false}
          style={{ width: "100%", height: "100%" }}
        >
          <FitBounds points={points} maxZoom={maxZoom} />
          {controlled && selected ? <PanTo target={{ lat: selected.lat, lng: selected.lng }} /> : null}
          {path.length > 1 ? (
            <Polyline path={path} geodesic strokeColor={BRANDY} strokeOpacity={0.8} strokeWeight={3} />
          ) : null}
          {located.map((p) => (
            <AdvancedMarker
              key={p.id}
              position={{ lat: p.lat, lng: p.lng }}
              zIndex={p.kind === "number" || p.kind === "photo" ? 500 : 0}
              onClick={p.kind === "muted" ? undefined : () => setOpen(p.id)}
              title={p.name}
            >
              <PinBody pin={p} />
            </AdvancedMarker>
          ))}
          {selected ? (
            <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setOpen(null)} pixelOffset={[0, -18]}>
              <div style={{ font: `13px/1.4 ${FONT}`, color: "#1f0d07", minWidth: 140 }}>
                <strong>{selected.name}</strong>
                {selected.sub ? <div style={{ color: TAUPE }}>{selected.sub}</div> : null}
                {selected.href ? (
                  <a href={selected.href} style={{ color: BRANDY, fontWeight: 700 }}>Open →</a>
                ) : null}
              </div>
            </InfoWindow>
          ) : null}
        </Map>
      </APIProvider>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Webpack/Turbopack mangles Leaflet's default marker URLs; reset them to
// the CDN-hosted assets so markers render without us bundling the PNGs.
const ICON_BASE = "https://unpkg.com/leaflet@1.9.4/dist/images";
const defaultIcon = L.icon({
  iconUrl: `${ICON_BASE}/marker-icon.png`,
  iconRetinaUrl: `${ICON_BASE}/marker-icon-2x.png`,
  shadowUrl: `${ICON_BASE}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function pinIcon(color) {
  const html = `<span style="display:inline-block;width:20px;height:20px;border-radius:9999px;background:${color};border:3px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></span>`;
  return L.divIcon({
    className: "tr-map-pin",
    html,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const START_ICON = pinIcon("#0f6e56");
const FINISH_ICON = pinIcon("#1f2937");
const DEST_ICON = pinIcon("#b04a3a");

export default function LocationMap({ start, destination, finish, points, zoom = 9 }) {
  const markers = [];
  if (start) markers.push({ ...start, icon: START_ICON });
  if (destination) markers.push({ ...destination, icon: DEST_ICON });
  if (finish) markers.push({ ...finish, icon: FINISH_ICON });

  if (markers.length === 0) return null;

  const center = markers[0];
  const polyline = points && points.length > 1 ? points : null;

  // Auto-fit bounds when there are 2+ markers; otherwise just centre on the one.
  function FitBounds() {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
      } else {
        map.setView([center.lat, center.lng], zoom);
      }
    }, [map]);
    return null;
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", minHeight: 320, borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds />
      {markers.map((m, i) => (
        <Marker key={`${m.lat}-${m.lng}-${i}`} position={[m.lat, m.lng]} icon={m.icon || defaultIcon} />
      ))}
      {polyline ? (
        <Polyline
          positions={polyline.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: "#1f2937", weight: 3, opacity: 0.7, dashArray: "6 6" }}
        />
      ) : null}
    </MapContainer>
  );
}


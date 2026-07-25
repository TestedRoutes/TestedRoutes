"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const START_COLOR = "#943d21";
const DEST_COLOR = "#1f0d07";

// Round badge for start / finish — shows a single letter inside a coloured
// circle with a white border, like a station marker. Anchored at centre.
function badgeIcon(label, color, size = 30) {
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:3px solid #ffffff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    ">${label}</div>`;
  return L.divIcon({
    className: "tr-map-pin",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Drop pin for the destination — teardrop shape carrying the TR emblem
// (public/brand/tr-emblem-white.svg). Multi-stop routes get a small ordinal
// bubble so the map still matches the numbered timeline list. Anchored at
// the tip of the drop so the pin points at the actual lat/lng.
function dropPinIcon(label, color, { showNumber = true } = {}) {
  const bubble =
    showNumber && label
      ? `<div style="
          position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;
          border-radius:9999px;background:${START_COLOR};border:2px solid #ffffff;
          display:flex;align-items:center;justify-content:center;
          color:#ffffff;font-size:9px;font-weight:700;padding:0 2px;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        ">${label}</div>`
      : "";
  const html = `
    <div style="position:relative;width:38px;height:50px">
      <svg width="38" height="50" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 12.5 18 30 18 30s18-17.5 18-30C36 8.06 27.94 0 18 0z" fill="${color}"/>
        <image href="/brand/tr-emblem-white.svg" x="8" y="8" width="20" height="20"/>
      </svg>
      ${bubble}
    </div>
  `;
  return L.divIcon({
    className: "tr-map-pin",
    html,
    iconSize: [38, 50],
    iconAnchor: [19, 50],
  });
}

const START_ICON = badgeIcon("S", START_COLOR);
const FINISH_ICON = badgeIcon("F", START_COLOR);

function isCoincident(a, b) {
  if (!a || !b) return false;
  return Math.abs(a.lat - b.lat) < 0.0001 && Math.abs(a.lng - b.lng) < 0.0001;
}

export default function LocationMap({ start, destinations, finish, points, zoom = 8 }) {
  const dests = Array.isArray(destinations) ? destinations : [];
  const markers = [];
  if (start) markers.push({ ...start, icon: START_ICON });
  dests.forEach((d, i) => {
    // Preserve "TR" branding when the legacy single-destination fallback is
    // active; use ordinal numbers when the new routeStops array drives it.
    // Single-destination guides need no ordinal — the emblem alone reads
    // as the destination pin; multi-stop routes keep numbers to match the
    // timeline list.
    const multi = dests.length > 1;
    markers.push({
      ...d,
      icon: dropPinIcon(String(i + 1), DEST_COLOR, { showNumber: multi && !d.legacy }),
    });
  });
  if (finish) {
    // If the finish is coincident with the start (round trip), nudge it a few
    // hundred metres so both badges are visually distinguishable.
    const adjusted = isCoincident(start, finish)
      ? { ...finish, lng: finish.lng + 0.012 }
      : finish;
    markers.push({ ...adjusted, icon: FINISH_ICON });
  }

  if (markers.length === 0) return null;

  const center = markers[0];
  const polyline = points && points.length > 1 ? points : null;

  function FitBounds() {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        // Generous padding so all markers sit comfortably inside the viewport
        // and so the user sees enough surrounding context.
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 9 });
      } else {
        map.setView([center.lat, center.lng], zoom);
      }
    }, [map]);
    return null;
  }

  // On touch devices a one-finger drag inside the map pans the map and
  // traps the page scroll. Disable dragging there — pinch zoom and the
  // +/- buttons still work, and the page scrolls straight past the map.
  const touchDevice = L.Browser.mobile;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      dragging={!touchDevice}
      style={{ height: "100%", width: "100%", minHeight: 320, borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds />
      {markers.map((m, i) => (
        <Marker
          key={`${m.lat}-${m.lng}-${i}`}
          position={[m.lat, m.lng]}
          icon={m.icon}
        />
      ))}
      {polyline ? (
        <Polyline
          positions={polyline.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: START_COLOR, weight: 3, opacity: 0.85 }}
        />
      ) : null}
    </MapContainer>
  );
}

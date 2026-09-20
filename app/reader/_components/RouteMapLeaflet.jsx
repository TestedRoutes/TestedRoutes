"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * The reader's map, Leaflet on OpenStreetMap tiles (the site's existing
 * choice; no Google key is wired). Three pin kinds, decided by the caller:
 *   number  a Brandy circle with the stop number — route stops on a day
 *   photo   a circular photo — a place with photoRef, the Rexby-style pin
 *   dot     a small Taupe dot — the rest of the pool ("what is near me")
 *   muted   a faint dot — the storefront preview of locked pins
 * Longitudes past 180 come straight from the data (Taveuni is stored as
 * 180.12 so the fit-bounds plane is continuous); Leaflet renders them fine.
 */
const BRANDY = "#943d21";
const TAUPE = "#5f524d";

function numberIcon(n) {
  return L.divIcon({
    className: "tr-map-pin",
    html: `<div style="width:26px;height:26px;border-radius:9999px;background:${BRANDY};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font:700 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}
function photoIcon(src) {
  return L.divIcon({
    className: "tr-map-pin",
    html: `<div style="width:44px;height:44px;border-radius:9999px;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);overflow:hidden;background:#dcdacd"><img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"/></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}
function dotIcon(muted) {
  const size = muted ? 10 : 14;
  return L.divIcon({
    className: "tr-map-pin",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${muted ? "#a3988a" : TAUPE};opacity:${muted ? 0.55 : 1};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function iconFor(pin) {
  if (pin.kind === "number") return numberIcon(pin.label);
  if (pin.kind === "photo" && pin.photoUrl) return photoIcon(pin.photoUrl);
  return dotIcon(pin.kind === "muted");
}

export default function RouteMapLeaflet({ pins, line, height = 420, maxZoom = 11, rounded = true }) {
  const located = (pins || []).filter((p) => p.lat != null && p.lng != null);
  if (!located.length) return null;
  const boundsSource = line && line.length > 1 ? [...located.map((p) => [p.lat, p.lng]), ...line] : located.map((p) => [p.lat, p.lng]);
  const bounds = boundsSource.length > 1 ? L.latLngBounds(boundsSource) : null;
  const viewProps = bounds
    ? { bounds, boundsOptions: { padding: [48, 48], maxZoom } }
    : { center: [located[0].lat, located[0].lng], zoom: 11 };
  const touchDevice = L.Browser.mobile;
  return (
    <MapContainer
      {...viewProps}
      scrollWheelZoom={false}
      dragging={!touchDevice}
      style={{ height, width: "100%", borderRadius: rounded ? 12 : 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {line && line.length > 1 ? (
        <Polyline positions={line} pathOptions={{ color: BRANDY, weight: 3, opacity: 0.8 }} />
      ) : null}
      {located.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={iconFor(p)} zIndexOffset={p.kind === "number" || p.kind === "photo" ? 500 : 0}>
          {p.kind !== "muted" ? (
            <Popup>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              {p.sub ? <><br /><span style={{ color: TAUPE }}>{p.sub}</span></> : null}
              {p.href ? <><br /><a href={p.href} style={{ color: BRANDY, fontWeight: 700 }}>Open →</a></> : null}
            </Popup>
          ) : null}
        </Marker>
      ))}
    </MapContainer>
  );
}

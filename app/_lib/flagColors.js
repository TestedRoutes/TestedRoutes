// Stylised flag swatches for the home continent cards: each country gets
// its flag's main colors as tiny bars next to the name, not a real flag
// render — matches the line-drawn contour treatment (founder 2026-08-08).
// Keyed by lowercased display name (prettyGeo output), colors in the order
// they appear on the flag. Countries missing here simply render no bars,
// so extending the map is optional housekeeping, not a launch blocker.
const FLAG_COLORS = {
  austria: ["#ED2939", "#FFFFFF", "#ED2939"],
  ecuador: ["#FFDD00", "#0072CE", "#EF3340"],
  "equatorial guinea": ["#3E9A00", "#FFFFFF", "#E32118", "#0073CE"],
  fiji: ["#68BFE5", "#012169", "#FFFFFF"],
  france: ["#0055A4", "#FFFFFF", "#EF4135"],
  germany: ["#000000", "#DD0000", "#FFCE00"],
  greece: ["#0D5EAF", "#FFFFFF"],
  iceland: ["#02529C", "#FFFFFF", "#DC1E35"],
  italy: ["#008C45", "#F4F9FF", "#CD212A"],
  japan: ["#FFFFFF", "#BC002D"],
  kuwait: ["#007A3D", "#FFFFFF", "#CE1126", "#000000"],
  lithuania: ["#FDB913", "#006A44", "#C1272D"],
  nepal: ["#DC143C", "#003893"],
  "new zealand": ["#012169", "#C8102E", "#FFFFFF"],
  norway: ["#BA0C2F", "#FFFFFF", "#00205B"],
  portugal: ["#046A38", "#DA291C", "#FFE900"],
  seychelles: ["#003F87", "#FCD856", "#D62828", "#FFFFFF", "#007A3D"],
  slovenia: ["#FFFFFF", "#005CE5", "#ED1C24"],
  spain: ["#AA151B", "#F1BF00", "#AA151B"],
  switzerland: ["#DA291C", "#FFFFFF"],
  tajikistan: ["#CC0000", "#FFFFFF", "#006600"],
  tanzania: ["#1EB53A", "#FCD116", "#00A3DD", "#000000"],
  uzbekistan: ["#0099B5", "#FFFFFF", "#1EB53A", "#CE1126"],
};

export function getFlagColors(country) {
  const key = String(country || "").trim().toLowerCase();
  return FLAG_COLORS[key] || null;
}

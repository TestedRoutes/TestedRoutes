#!/usr/bin/env python3
"""
TestedRoutes static map generator.

Reads a YAML config of waypoints, fetches OpenTopoMap tiles, and renders
a branded PNG suitable for guide PDFs.

Usage:
    python make_map.py guides/santis.yaml
    python make_map.py guides/santis.yaml output/santis.png

Reproducibility:
- Tile cache in .tile_cache/ — same coordinates produce identical maps.
- Configs in YAML — version-controllable.
- Brand styling pinned (colors, fonts, dimensions).
"""

import math
import os
import sys
import time
from pathlib import Path

import requests
import yaml
from PIL import Image, ImageDraw, ImageFont

from routing import get_segments, detect_gpx_source, haversine

# Make stdout/stderr UTF-8 safe on Windows consoles (cp1252 default).
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# -- Brand --
# Brandy (styleguide V3) for route + waypoints; titles set in the Fraunces
# 72pt SuperSoft cut on a plain white plate, matching the deck's map labels.
ACCENT = "#943D21"
BG = "#FAF7F2"
TEXT = "#1A1A1A"
SUBTLE = "#7A7468"
WHITE = "#FFFFFF"

# -- Output sizing --
# Slide 6 image box ≈ 16:9. 1600×900 px gives a sharp result at 100% in PowerPoint.
OUT_W = 1600
OUT_H = 900

# -- Tile source --
# Default is OpenTopoMap (hiking detail). A guide yaml can set `tiles: osm`
# for the standard green OSM carto look (used on country-scale overview maps).
TILE_PROVIDERS = {
    "opentopo": {
        "url": "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        "subdomains": ["a", "b", "c"],
        "attribution": "© OpenStreetMap contributors · OpenTopoMap (CC-BY-SA)",
    },
    "osm": {
        "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        "subdomains": [""],
        "attribution": "© OpenStreetMap contributors",
    },
}
TILE_PROVIDER = "opentopo"  # overridden per-render from config `tiles:`
TILE_SIZE = 256
DISCLAIMER = "Schematic waypoint overview – not for navigation"
USER_AGENT = "TestedRoutes Map Generator (https://testedroutes.com)"

CACHE_DIR = Path(__file__).parent / ".tile_cache"


# === Web Mercator projection ===

def lonlat_to_pixel(lon, lat, zoom):
    """Lon/lat → global pixel coords at given zoom level."""
    n = 2.0 ** zoom * TILE_SIZE
    x = (lon + 180.0) / 360.0 * n
    lat_rad = math.radians(lat)
    y = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    return x, y


# === Tile fetching ===

def fetch_tile(z, x, y):
    """Fetch a single tile, with disk caching. Returns RGB Image or None."""
    n = 2 ** z
    if not (0 <= x < n and 0 <= y < n):
        return None
    provider = TILE_PROVIDERS[TILE_PROVIDER]
    cache_name = "opentopomap" if TILE_PROVIDER == "opentopo" else TILE_PROVIDER
    cache_path = CACHE_DIR / f"{cache_name}-{z}-{x}-{y}.png"
    if cache_path.exists():
        return Image.open(cache_path).convert("RGB")
    subdomains = provider["subdomains"]
    subdomain = subdomains[(x + y) % len(subdomains)]
    url = provider["url"].format(s=subdomain, z=z, x=x, y=y)
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
        r.raise_for_status()
    except Exception as e:
        print(f"  ! Tile fetch failed ({z}/{x}/{y}): {e}", file=sys.stderr)
        return None
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_bytes(r.content)
    time.sleep(0.4)  # Be respectful of OpenTopoMap servers
    return Image.open(cache_path).convert("RGB")


# === Zoom selection ===

def best_zoom(points, padding=0.20):
    """Pick the highest zoom level where the bbox + padding fits inside the canvas.

    `points` is a list of dicts with 'lat'/'lon' OR a list of (lat, lon) tuples.
    """
    if not points:
        return 12, (0, 0, 0, 0)
    if isinstance(points[0], dict):
        lats = [p["lat"] for p in points]
        lons = [p["lon"] for p in points]
    else:
        lats = [p[0] for p in points]
        lons = [p[1] for p in points]
    min_lat, max_lat = min(lats), max(lats)
    min_lon, max_lon = min(lons), max(lons)

    lat_pad = max((max_lat - min_lat) * padding, 0.005)
    lon_pad = max((max_lon - min_lon) * padding, 0.005)

    bbox = (min_lon - lon_pad, min_lat - lat_pad,
            max_lon + lon_pad, max_lat + lat_pad)

    for zoom in range(17, 5, -1):
        x_min, _ = lonlat_to_pixel(bbox[0], 0, zoom)
        x_max, _ = lonlat_to_pixel(bbox[2], 0, zoom)
        _, y_min = lonlat_to_pixel(0, bbox[3], zoom)
        _, y_max = lonlat_to_pixel(0, bbox[1], zoom)
        if (x_max - x_min) <= OUT_W and (y_max - y_min) <= OUT_H:
            return zoom, bbox
    return 8, bbox


# === Drawing helpers ===

def find_font(size, bold=False):
    """Cross-platform font resolution. Falls back to PIL default."""
    candidates = [
        f"C:/Windows/Fonts/{'arialbd' if bold else 'arial'}.ttf",
        f"/Library/Fonts/Arial{' Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/liberation/LiberationSans{'-Bold' if bold else '-Regular'}.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def find_serif_font(size):
    """Brand display serif for titles: Fraunces SuperSoft, Georgia fallback.
    Fraunces is installed per-user, so look under LOCALAPPDATA first."""
    user_fonts = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Windows\Fonts")
    candidates = [
        user_fonts + r"\Fraunces_72pt_SuperSoft-Light.ttf",
        user_fonts + r"\Fraunces_72pt-Light.ttf",
        "C:/Windows/Fonts/Fraunces_72pt_SuperSoft-Light.ttf",
        "C:/Windows/Fonts/georgia.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return find_font(size, bold=True)


def _draw_legend(draw, waypoints, position="top-right"):
    """Top-right side legend pairing marker numbers with waypoint names."""
    title_text = "WAYPOINTS"
    title_font = find_font(20, bold=True)
    item_font = find_font(20, bold=False)
    num_font = find_font(16, bold=True)

    title_bb = draw.textbbox((0, 0), title_text, font=title_font)
    title_w = title_bb[2] - title_bb[0]
    title_h = title_bb[3] - title_bb[1]

    num_r = 14
    gap_after_num = 12
    line_spacing = 10
    pad_x = 20
    pad_y = 16

    # Measure name column width
    item_h = 0
    max_name_w = 0
    for wp in waypoints:
        bb = draw.textbbox((0, 0), wp["name"], font=item_font)
        max_name_w = max(max_name_w, bb[2] - bb[0])
        item_h = max(item_h, bb[3] - bb[1])
    row_h = max(item_h, num_r * 2)

    box_w = max(title_w, num_r * 2 + gap_after_num + max_name_w) + pad_x * 2
    box_h = (
        pad_y
        + title_h + 8 + 1 + 8  # title + gap + sep + gap
        + len(waypoints) * row_h
        + (len(waypoints) - 1) * line_spacing
        + pad_y
    )

    if position == "top-right":
        x0 = OUT_W - box_w - 20
        y0 = 20
    else:  # bottom-left fallback
        x0 = 20
        y0 = OUT_H - box_h - 20

    draw.rectangle([x0, y0, x0 + box_w, y0 + box_h],
                   fill=WHITE, outline=ACCENT, width=2)
    draw.text((x0 + pad_x, y0 + pad_y), title_text, fill=TEXT, font=title_font)

    sep_y = y0 + pad_y + title_h + 8
    draw.line([(x0 + pad_x, sep_y), (x0 + box_w - pad_x, sep_y)],
              fill="#E8E2D6", width=1)

    cur_y = sep_y + 8
    for i, wp in enumerate(waypoints, start=1):
        cx = x0 + pad_x + num_r
        cy = cur_y + row_h // 2
        draw.ellipse((cx - num_r, cy - num_r, cx + num_r, cy + num_r), fill=ACCENT)
        num_text = str(i)
        nbb = draw.textbbox((0, 0), num_text, font=num_font)
        nw = nbb[2] - nbb[0]
        nh = nbb[3] - nbb[1]
        draw.text((cx - nw // 2, cy - nh // 2 - 2), num_text,
                  fill=WHITE, font=num_font)
        name_x = cx + num_r + gap_after_num
        name_y = cur_y + (row_h - item_h) // 2
        draw.text((name_x, name_y), wp["name"], fill=TEXT, font=item_font)
        cur_y += row_h + line_spacing


def draw_dashed_line(draw, p1, p2, color, width=5, dash=18, gap=10):
    """Draw a dashed line segment from p1 to p2."""
    x1, y1 = p1
    x2, y2 = p2
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    if length == 0:
        return
    ux, uy = dx / length, dy / length
    pos = 0.0
    drawing = True
    while pos < length:
        seg = dash if drawing else gap
        end = min(pos + seg, length)
        if drawing:
            sx, sy = x1 + ux * pos, y1 + uy * pos
            ex, ey = x1 + ux * end, y1 + uy * end
            draw.line([(sx, sy), (ex, ey)], fill=color, width=width)
        pos = end
        drawing = not drawing


# === Main render ===

def render_map(config, config_path, output_path):
    waypoints = config["waypoints"]
    title = config.get("title", "")

    global TILE_PROVIDER
    TILE_PROVIDER = (config.get("tiles") or "opentopo").lower()
    if TILE_PROVIDER not in TILE_PROVIDERS:
        TILE_PROVIDER = "opentopo"

    print(f"Generating map: {title or '(untitled)'}")
    print(f"  Waypoints: {len(waypoints)}")

    # Resolve route into walk + transport segments
    segments = get_segments(config, config_path)
    walk_segs = [s for s in segments if s["transport"] == "walk"]
    transport_segs = [s for s in segments if s["transport"] != "walk"]
    is_authoritative = all(s["is_authoritative"] for s in walk_segs) if walk_segs else False
    walk_mode = walk_segs[0]["mode"] if walk_segs else "(no walk segments)"

    print(f"  Walk: {walk_mode} ({sum(len(s['coords']) for s in walk_segs)} points)")
    if transport_segs:
        modes = ", ".join(s["transport"] for s in transport_segs)
        print(f"  Transport: {modes}")

    # Frame on union of all segment coords + waypoints so nothing is clipped
    bbox_points = [(w["lat"], w["lon"]) for w in waypoints]
    for s in segments:
        bbox_points.extend(s["coords"])
    bbox_points.extend((c["lat"], c["lon"]) for c in config.get("cities", []))
    # Optional per-guide framing overrides: `padding:` loosens/tightens the
    # auto-fit margin (default 0.20), `zoom:` pins the level outright.
    zoom, bbox = best_zoom(bbox_points, padding=float(config.get("padding", 0.20)))
    if config.get("zoom"):
        zoom = int(config["zoom"])
    print(f"  Zoom: {zoom}")

    # Center the canvas on the bbox center
    center_lon = (bbox[0] + bbox[2]) / 2
    center_lat = (bbox[1] + bbox[3]) / 2
    cx, cy = lonlat_to_pixel(center_lon, center_lat, zoom)

    left = cx - OUT_W / 2
    top = cy - OUT_H / 2

    tx_min = int(left // TILE_SIZE)
    tx_max = int((left + OUT_W) // TILE_SIZE)
    ty_min = int(top // TILE_SIZE)
    ty_max = int((top + OUT_H) // TILE_SIZE)
    n_tiles = (tx_max - tx_min + 1) * (ty_max - ty_min + 1)
    print(f"  Tiles: {n_tiles}")

    # Stitch tile mosaic
    canvas = Image.new("RGB", (OUT_W, OUT_H), BG)
    for tx in range(tx_min, tx_max + 1):
        for ty in range(ty_min, ty_max + 1):
            tile = fetch_tile(zoom, tx, ty)
            if tile is None:
                continue
            paste_x = int(tx * TILE_SIZE - left)
            paste_y = int(ty * TILE_SIZE - top)
            canvas.paste(tile, (paste_x, paste_y))

    draw = ImageDraw.Draw(canvas, "RGBA")

    def project(lat, lon):
        x, y = lonlat_to_pixel(lon, lat, zoom)
        return (int(x - left), int(y - top))

    # Snap each waypoint to the nearest point on the walking trail so the
    # numbered dots actually sit on the route. If a waypoint is well off the
    # walk (e.g. the funicular base), keep its original coords.
    SNAP_THRESHOLD_M = 1500
    walk_coords = []
    for s in segments:
        if s["transport"] == "walk":
            walk_coords.extend(s["coords"])
    snapped_waypoints = []
    for w in waypoints:
        sw = dict(w)
        if walk_coords:
            best_d = float("inf")
            best = None
            for lat, lon in walk_coords:
                d = haversine(w["lat"], w["lon"], lat, lon)
                if d < best_d:
                    best_d = d
                    best = (lat, lon)
            if best and best_d <= SNAP_THRESHOLD_M:
                sw["lat"], sw["lon"] = best
        snapped_waypoints.append(sw)

    waypoint_points = [project(w["lat"], w["lon"]) for w in snapped_waypoints]

    # Render each segment in its own style.
    # Walk segments — solid red (or dashed red if interpolated)
    # Transport segments — dark navy with white halo, dashed (you didn't walk it)
    TRANSPORT_COLOR = "#2C3A4A"  # brand dark navy, contrasts with red trail
    for seg in segments:
        seg_points = [project(lat, lon) for lat, lon in seg["coords"]]
        if seg["transport"] == "walk":
            if seg["is_authoritative"]:
                for i in range(len(seg_points) - 1):
                    draw.line([seg_points[i], seg_points[i + 1]],
                              fill=ACCENT, width=4)
            else:
                for i in range(len(seg_points) - 1):
                    draw_dashed_line(draw, seg_points[i], seg_points[i + 1],
                                     ACCENT, width=5)
        else:
            # White halo for legibility against busy terrain, then the dashed line
            for i in range(len(seg_points) - 1):
                draw_dashed_line(draw, seg_points[i], seg_points[i + 1],
                                 WHITE, width=8, dash=14, gap=8)
            for i in range(len(seg_points) - 1):
                draw_dashed_line(draw, seg_points[i], seg_points[i + 1],
                                 TRANSPORT_COLOR, width=5, dash=14, gap=8)

    points = waypoint_points  # markers go on waypoints, regardless of route source

    # Context cities — dark dots with labelled white plates (template style).
    # Config: `cities: [{name, lat, lon, label: left|right}]`. Not part of the
    # route; purely for orientation on country-scale overview maps.
    CITY_COLOR = "#3A3A3A"
    city_font = find_font(20, bold=True)
    for c in config.get("cities", []):
        x, y = project(c["lat"], c["lon"])
        r = 9
        draw.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=WHITE)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=CITY_COLOR)
        label = c["name"]
        bb = draw.textbbox((0, 0), label, font=city_font)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        if c.get("label", "left") == "right":
            lx = x + r + 10
        else:
            lx = x - r - 10 - tw
        ly = y - th // 2 - 4
        draw.rectangle((lx - 6, ly - 2, lx + tw + 6, ly + th + 8), fill=WHITE)
        draw.text((lx, ly), label, fill=TEXT, font=city_font)

    # Markers — small numbered dots, names go in the side legend
    marker_font = find_font(16, bold=True)
    marker_r = 13

    for i, pt in enumerate(points, start=1):
        x, y = pt
        # White ring
        draw.ellipse((x - marker_r - 2, y - marker_r - 2,
                      x + marker_r + 2, y + marker_r + 2), fill=WHITE)
        # Accent disc
        draw.ellipse((x - marker_r, y - marker_r,
                      x + marker_r, y + marker_r), fill=ACCENT)
        # Number
        text = str(i)
        bb = draw.textbbox((0, 0), text, font=marker_font)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        draw.text((x - tw // 2, y - th // 2 - 2), text, fill=WHITE, font=marker_font)

    # Side legend (top-right) — numbered list of waypoints
    _draw_legend(draw, snapped_waypoints)

    # Title plate (top-left): plain white plate, brand serif, no border —
    # the format the deck uses for map labels.
    if title:
        # Fraunces has no arrow glyph; the plate convention uses en dashes.
        title = title.replace(" → ", " – ").replace("→", "–")
        title_font = find_serif_font(40)
        bb = draw.textbbox((0, 0), title, font=title_font)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        pad_x, pad_y = 28, 16
        plate_w = tw + pad_x * 2
        plate_h = th + pad_y * 2
        draw.rectangle([20, 20, 20 + plate_w, 20 + plate_h], fill=WHITE)
        draw.text((20 + pad_x - bb[0], 20 + pad_y - bb[1]), title,
                  fill="#1F0D07", font=title_font)

    # Disclaimer + attribution (stacked bottom-right)
    disclaimer = "Schematic – not for navigation" if is_authoritative else DISCLAIMER

    # Build attribution lines.
    # Always include basemap attribution (OSM/OpenTopoMap).
    # If GPX is from a recognized source, add the required source reference.
    attr_lines = []
    gpx_cfg = config.get("gpx")
    if gpx_cfg:
        paths = gpx_cfg if isinstance(gpx_cfg, list) else [gpx_cfg]
        fulls = [(config_path.parent / p).resolve() for p in paths]
        src = detect_gpx_source(fulls)
        if src == "schweizmobil":
            attr_lines.append(
                "Route: Federal Roads Office, Canton, SwitzerlandMobility Foundation"
            )
    attr_lines.append(TILE_PROVIDERS[TILE_PROVIDER]["attribution"])

    attr_font = find_font(13, bold=False)
    disc_font = find_font(14, bold=True)

    bb_d = draw.textbbox((0, 0), disclaimer, font=disc_font)
    dw, dh = bb_d[2] - bb_d[0], bb_d[3] - bb_d[1]

    line_metrics = []
    for line in attr_lines:
        bb = draw.textbbox((0, 0), line, font=attr_font)
        line_metrics.append((line, bb[2] - bb[0], bb[3] - bb[1]))

    box_w_inner = max(dw, max(w for _, w, _ in line_metrics))
    pad = 8
    line_gap = 4
    box_h_inner = dh + sum(line_gap + h for _, _, h in line_metrics)
    box_x0 = OUT_W - box_w_inner - pad * 2 - 4
    box_y0 = OUT_H - box_h_inner - pad * 2 - 4
    draw.rectangle(
        [box_x0, box_y0, OUT_W - 4, OUT_H - 4],
        fill=(255, 255, 255, 230),
    )
    # Disclaimer (bold, dark)
    draw.text((OUT_W - dw - pad - 4, box_y0 + pad - 2),
              disclaimer, fill=TEXT, font=disc_font)
    # Attribution lines (muted)
    cur_y = box_y0 + pad + dh + line_gap - 2
    for line, w, h in line_metrics:
        draw.text((OUT_W - w - pad - 4, cur_y),
                  line, fill=SUBTLE, font=attr_font)
        cur_y += h + line_gap

    # DPI metadata sized so PowerPoint places the image at 18.8 cm wide.
    place_dpi = OUT_W / (18.8 / 2.54)
    canvas.save(output_path, "PNG", optimize=True, dpi=(place_dpi, place_dpi))
    print(f"  Saved: {output_path}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    config_path = Path(sys.argv[1])
    if not config_path.exists():
        print(f"Config not found: {config_path}", file=sys.stderr)
        sys.exit(1)

    config = yaml.safe_load(config_path.read_text(encoding="utf-8"))

    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2])
    elif "output" in config:
        output_path = config_path.parent / config["output"]
    else:
        output_path = Path(__file__).parent / "output" / (config_path.stem + ".png")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    render_map(config, config_path, output_path)


if __name__ == "__main__":
    main()

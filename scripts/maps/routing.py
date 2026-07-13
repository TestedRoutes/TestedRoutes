#!/usr/bin/env python3
"""
Route geometry resolution for TestedRoutes maps + profiles.

Three ways to get the actual trail polyline, in priority order:

1. GPX file        — set `gpx: ../gpx/<file>.gpx` in the config
                     (from SchweizMobil, Komoot, your own GPS, etc.)
2. Routing engine  — set `routing: brouter-mountain` (no API key) or
                     `routing: foot-hiking` (needs ORS_API_KEY env var)
3. Interpolation   — fallback: straight lines between waypoints
                     (the original behaviour)

Used by make_map.py and make_profile.py.
"""

import hashlib
import math
import os
import sys
import time
from pathlib import Path

import requests


SAMPLE_POINTS = 200  # for the interpolation fallback
USER_AGENT = "TestedRoutes Map Generator (https://testedroutes.com)"
CACHE_DIR = Path(__file__).parent / ".route_cache"


# === Geometry helpers ===

def haversine(lat1, lon1, lat2, lon2):
    """Great-circle distance in metres."""
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# === GPX source detection (for attribution) ===

def detect_gpx_source(paths):
    """Inspect GPX files' creator metadata. Returns a source label or None.

    Used to drive the correct legal attribution (e.g. SchweizMobil's licence
    requires crediting FEDRO + canton + SwitzerlandMobility Foundation).
    """
    if isinstance(paths, (str, Path)):
        paths = [paths]
    for path in paths:
        try:
            with open(path, encoding="utf-8") as f:
                head = f.read(2000)
        except OSError:
            continue
        head_lc = head.lower()
        if "schweizmobil" in head_lc or "switzerlandmobility" in head_lc:
            return "schweizmobil"
        if "komoot" in head_lc:
            return "komoot"
        if "strava" in head_lc:
            return "strava"
    return None


# === Mode 1: GPX file(s) ===

def parse_gpx_file(paths):
    """Parse one or more GPX files. Returns list of (lat, lon).

    `paths` may be a single Path/str or a list — multiple files are
    concatenated in order, so a multi-stage trip can keep one GPX per stage.
    """
    if isinstance(paths, (str, Path)):
        paths = [paths]
    try:
        import gpxpy
    except ImportError:
        print("! GPX support requires gpxpy. Run: pip install gpxpy", file=sys.stderr)
        sys.exit(1)
    coords = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            gpx = gpxpy.parse(f)
        had_track = False
        for track in gpx.tracks:
            for seg in track.segments:
                for pt in seg.points:
                    coords.append((pt.latitude, pt.longitude))
                    had_track = True
        if not had_track:
            for route in gpx.routes:
                for pt in route.points:
                    coords.append((pt.latitude, pt.longitude))
    return coords


def parse_gpx_with_elevation(paths):
    """Parse one or more GPX files including the <ele> elevation field.

    Returns list of (lat, lon, elev_meters_or_None). Useful when SchweizMobil
    or other sources include elevation in the GPX — avoids needing an API
    elevation lookup.
    """
    if isinstance(paths, (str, Path)):
        paths = [paths]
    try:
        import gpxpy
    except ImportError:
        print("! GPX support requires gpxpy. Run: pip install gpxpy", file=sys.stderr)
        sys.exit(1)
    coords = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            gpx = gpxpy.parse(f)
        had_track = False
        for track in gpx.tracks:
            for seg in track.segments:
                for pt in seg.points:
                    coords.append((pt.latitude, pt.longitude, pt.elevation))
                    had_track = True
        if not had_track:
            for route in gpx.routes:
                for pt in route.points:
                    coords.append((pt.latitude, pt.longitude, pt.elevation))
    return coords


# === Mode 2a: BRouter (no API key, community OSM routing) ===

BROUTER_URL = "https://brouter.de/brouter"
BROUTER_PROFILES = {
    "brouter": "hiking-beta",
    "brouter-hiking": "hiking-beta",
    "brouter-mountain": "hiking-mountain",
    "hiking-beta": "hiking-beta",
    "hiking-mountain": "hiking-mountain",
}

def query_brouter(waypoints, profile_alias="brouter-mountain"):
    """Route via brouter.de. Returns list of (lat, lon)."""
    profile = BROUTER_PROFILES.get(profile_alias, profile_alias)
    lonlats = "|".join(f"{w['lon']:.6f},{w['lat']:.6f}" for w in waypoints)

    # Cache key — same waypoints + profile yields same route
    key = hashlib.sha1(f"brouter:{profile}:{lonlats}".encode()).hexdigest()[:12]
    cache_path = CACHE_DIR / f"brouter-{key}.gpx"
    if cache_path.exists():
        return parse_gpx_file(cache_path)

    print(f"  Querying BRouter ({profile}) ...")
    params = {"lonlats": lonlats, "profile": profile, "format": "gpx"}
    r = requests.get(BROUTER_URL, params=params, timeout=90,
                     headers={"User-Agent": USER_AGENT})
    if r.status_code != 200 or not r.text.strip().startswith("<?xml"):
        raise RuntimeError(f"BRouter request failed: HTTP {r.status_code} · {r.text[:200]}")
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(r.text, encoding="utf-8")
    return parse_gpx_file(cache_path)


# === Mode 2b: OpenRouteService (free key) ===

ORS_URL = "https://api.openrouteservice.org/v2/directions/{profile}/geojson"
ORS_PROFILES = {
    "ors": "foot-hiking",
    "openrouteservice": "foot-hiking",
    "foot-hiking": "foot-hiking",
    "foot-walking": "foot-walking",
}

def query_ors(waypoints, profile_alias="foot-hiking"):
    """Route via OpenRouteService. Requires ORS_API_KEY env var."""
    profile = ORS_PROFILES.get(profile_alias, profile_alias)
    api_key = os.environ.get("ORS_API_KEY")
    if not api_key:
        print("! ORS routing requires ORS_API_KEY env var.", file=sys.stderr)
        print("  Sign up free: https://openrouteservice.org/dev/#/signup", file=sys.stderr)
        sys.exit(1)

    coords = [[w["lon"], w["lat"]] for w in waypoints]
    key = hashlib.sha1(f"ors:{profile}:{coords}".encode()).hexdigest()[:12]
    cache_path = CACHE_DIR / f"ors-{key}.json"
    if cache_path.exists():
        import json
        geojson = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        print(f"  Querying OpenRouteService ({profile}) ...")
        url = ORS_URL.format(profile=profile)
        r = requests.post(
            url, json={"coordinates": coords},
            headers={"Authorization": api_key, "Content-Type": "application/json"},
            timeout=60,
        )
        r.raise_for_status()
        geojson = r.json()
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(r.text, encoding="utf-8")

    line = geojson["features"][0]["geometry"]["coordinates"]
    return [(lat, lon) for lon, lat in line]


# === Mode 3: Straight-line interpolation (fallback) ===

def interpolate_waypoints(waypoints, n_points=SAMPLE_POINTS):
    """Generate ~n_points evenly-spaced points along the waypoint path."""
    pts = [(w["lat"], w["lon"]) for w in waypoints]
    segments = [haversine(*pts[i], *pts[i + 1]) for i in range(len(pts) - 1)]
    total = sum(segments)
    if total == 0:
        return pts
    coords = [pts[0]]
    for i, seg_len in enumerate(segments):
        n = max(2, int(n_points * seg_len / total))
        a, b = pts[i], pts[i + 1]
        for j in range(1, n + 1):
            t = j / n
            coords.append((a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])))
    return coords


# === Walk-segment routing ===

def _route_walk(waypoints, config, config_path):
    """Resolve a walking sub-route between consecutive walk waypoints.

    Returns (coords, mode, is_authoritative)."""
    # GPX takes priority — assume the GPX(s) cover the whole walk.
    # Accepts either a single string path or a list of paths.
    gpx_path = config.get("gpx")
    if gpx_path:
        paths = gpx_path if isinstance(gpx_path, list) else [gpx_path]
        fulls = [(config_path.parent / p).resolve() for p in paths]
        for f in fulls:
            if not f.exists():
                print(f"! GPX file not found: {f}", file=sys.stderr)
                sys.exit(1)
        names = ", ".join(f.name for f in fulls)
        return parse_gpx_file(fulls), f"GPX track ({names})", True

    routing = (config.get("routing") or "").lower()
    if routing.startswith("brouter") or routing in ("hiking-beta", "hiking-mountain"):
        return (query_brouter(waypoints, routing or "brouter-mountain"),
                f"BRouter ({BROUTER_PROFILES.get(routing, routing)})", True)
    if routing in ("ors", "openrouteservice", "foot-hiking", "foot-walking"):
        return (query_ors(waypoints, routing),
                f"OpenRouteService ({ORS_PROFILES.get(routing, routing)})", True)

    return interpolate_waypoints(waypoints), "Interpolated between waypoints", False


# === Public entry point ===

def get_segments(config, config_path):
    """Resolve the route into a list of segments.

    Each segment is a dict:
        {
          "transport": "walk" | "cable-car" | "funicular" | "bus" | "train" | ...,
          "coords":    [(lat, lon), ...],   # polyline
          "from":      waypoint dict,        # start waypoint
          "to":        waypoint dict,        # end waypoint
          "mode":      str,                  # human label
          "is_authoritative": bool,
        }

    Walking segments are routed via GPX/BRouter/ORS or fall back to
    interpolation. Transport segments (`arrive_by != 'walk'` on the
    destination waypoint) are kept as straight lines and are NOT routed.
    """
    waypoints = config.get("waypoints", [])
    if len(waypoints) < 2:
        return []

    segments = []
    walk_run = [waypoints[0]]

    def flush_walk_run():
        if len(walk_run) >= 2:
            coords, mode, is_auth = _route_walk(walk_run, config, config_path)
            segments.append({
                "transport": "walk",
                "coords": coords,
                "waypoints": list(walk_run),
                "from": walk_run[0],
                "to": walk_run[-1],
                "mode": mode,
                "is_authoritative": is_auth,
            })

    for i in range(1, len(waypoints)):
        w = waypoints[i]
        arrive_by = (w.get("arrive_by") or "walk").lower()
        if arrive_by == "walk":
            walk_run.append(w)
        else:
            flush_walk_run()
            prev = waypoints[i - 1]
            segments.append({
                "transport": arrive_by,
                "coords": [(prev["lat"], prev["lon"]), (w["lat"], w["lon"])],
                "waypoints": [prev, w],
                "from": prev,
                "to": w,
                "mode": arrive_by,
                "is_authoritative": True,
            })
            walk_run = [w]

    flush_walk_run()
    return segments


def get_route(config, config_path):
    """Backward-compatible single-polyline accessor.

    Concatenates all segment coords. Only use when transport-mode
    distinction doesn't matter for the caller. Returns
    (coords, mode_label, is_authoritative).
    """
    segments = get_segments(config, config_path)
    if not segments:
        waypoints = config.get("waypoints", [])
        return interpolate_waypoints(waypoints), "Interpolated between waypoints", False

    all_coords = []
    for seg in segments:
        if all_coords and seg["coords"]:
            # Avoid duplicating the joining point
            if all_coords[-1] == seg["coords"][0]:
                all_coords.extend(seg["coords"][1:])
            else:
                all_coords.extend(seg["coords"])
        else:
            all_coords.extend(seg["coords"])
    walk_modes = [s["mode"] for s in segments if s["transport"] == "walk"]
    is_auth = all(s["is_authoritative"] for s in segments)
    label = walk_modes[0] if walk_modes else "transport-only"
    return all_coords, label, is_auth

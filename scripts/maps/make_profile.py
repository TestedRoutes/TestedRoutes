#!/usr/bin/env python3
"""
TestedRoutes elevation profile generator.

Reads a YAML config, looks up elevations along the route via the
Open-Meteo Elevation API (Copernicus DEM, free, no API key), and renders
a branded PNG profile.

Modes:
- GPX track  — set `elevation.gpx: ../gpx/<file>.gpx` in the config
- Interpolated — falls back to straight-line sampling between waypoints

Usage:
    python make_profile.py guides/santis.yaml
    python make_profile.py guides/santis.yaml output/santis-profile.png
"""

import hashlib
import json
import math
import sys
import time
from pathlib import Path

import matplotlib.pyplot as plt
import requests
import yaml

from routing import get_segments, haversine, parse_gpx_with_elevation, detect_gpx_source

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# -- Brand --
ACCENT = "#943D21"  # Brandy (styleguide V3)
BG = "#FAF7F2"
TEXT = "#1A1A1A"
SUBTLE = "#7A7468"
GRID = "#E8E2D6"

# -- Output sizing (matches slide 6 elevation strip ratio) --
OUT_W = 1600
OUT_H = 600

# -- API --
ELEVATION_API = "https://api.open-meteo.com/v1/elevation"
USER_AGENT = "TestedRoutes Map Generator (https://testedroutes.com)"
SAMPLE_POINTS = 200  # for interpolated mode
ASCENT_THRESHOLD_M = 5  # ignore noise below this when summing ascent/descent

DISCLAIMER = "Schematic waypoint overview – not for navigation"
ATTRIBUTION = "Source: Open-Meteo Elevation API · Copernicus DEM"


CACHE_DIR = Path(__file__).parent / ".elev_cache"


def fetch_elevations(coords):
    """Query Open-Meteo Elevation API. Cached by coord-list hash; backs off on 429."""
    # Cache by exact coord list — re-runs are instant
    key_str = ";".join(f"{lat:.5f},{lon:.5f}" for lat, lon in coords)
    key = hashlib.sha1(key_str.encode()).hexdigest()[:16]
    cache_path = CACHE_DIR / f"elev-{key}.json"
    if cache_path.exists():
        print(f"  Elevations from cache ({len(coords)} points)")
        return json.loads(cache_path.read_text(encoding="utf-8"))

    BATCH = 100
    SLEEP_BETWEEN = 1.5
    out = []
    n_batches = (len(coords) + BATCH - 1) // BATCH
    for batch_idx in range(n_batches):
        i = batch_idx * BATCH
        batch = coords[i:i + BATCH]
        params = {
            "latitude": ",".join(f"{lat:.6f}" for lat, _ in batch),
            "longitude": ",".join(f"{lon:.6f}" for _, lon in batch),
        }
        for attempt in range(6):
            r = requests.get(
                ELEVATION_API, params=params, timeout=30,
                headers={"User-Agent": USER_AGENT},
            )
            if r.status_code == 429:
                wait = 5 * (attempt + 1)
                print(f"    [batch {batch_idx + 1}/{n_batches}] rate-limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            r.raise_for_status()
            break
        else:
            raise RuntimeError("Open-Meteo rate-limit retries exhausted; try again in a minute")
        out.extend(r.json()["elevation"])
        if batch_idx + 1 < n_batches:
            time.sleep(SLEEP_BETWEEN)

    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps(out), encoding="utf-8")
    return out


def compute_stats(elevations, threshold=ASCENT_THRESHOLD_M):
    """Sum ascent/descent above noise threshold; return totals + max + min."""
    ascent = descent = 0.0
    last = elevations[0]
    for e in elevations[1:]:
        diff = e - last
        if abs(diff) >= threshold:
            if diff > 0:
                ascent += diff
            else:
                descent += -diff
            last = e
    return ascent, descent, max(elevations), min(elevations)


def render_profile(config, config_path, output_path):
    title = config.get("title", "")
    waypoints = config.get("waypoints", [])

    # Resolve into segments; profile only uses the walking ones
    segments = get_segments(config, config_path)
    walk_segs = [s for s in segments if s["transport"] == "walk"]
    if not walk_segs:
        print("! No walking segments to profile.", file=sys.stderr)
        sys.exit(1)
    is_authoritative = all(s["is_authoritative"] for s in walk_segs)
    mode = walk_segs[0]["mode"]
    transport_modes = [s["transport"] for s in segments if s["transport"] != "walk"]

    # Concatenate walk segments into a single polyline (avoiding duplicate endpoints)
    coords = []
    for s in walk_segs:
        if coords and s["coords"] and coords[-1] == s["coords"][0]:
            coords.extend(s["coords"][1:])
        else:
            coords.extend(s["coords"])

    print(f"  Walk: {mode} ({len(coords)} points)")
    if transport_modes:
        print(f"  Transport (excluded from profile): {', '.join(transport_modes)}")

    # If GPX is the source AND it carries <ele> values, use those directly.
    # Falls back to Open-Meteo only when GPX is missing or has no elevations.
    elevations = None
    elev_source = ATTRIBUTION  # default: Open-Meteo / Copernicus
    route_source_line = None   # additional attribution line for trail data
    gpx_paths_cfg = config.get("gpx")
    if gpx_paths_cfg and mode.startswith("GPX"):
        paths = gpx_paths_cfg if isinstance(gpx_paths_cfg, list) else [gpx_paths_cfg]
        fulls = [(config_path.parent / p).resolve() for p in paths]
        gpx_data = parse_gpx_with_elevation(fulls)
        if gpx_data and all(e is not None for _, _, e in gpx_data):
            coords = [(lat, lon) for lat, lon, _ in gpx_data]
            elevations = [e for _, _, e in gpx_data]
            elev_source = "Elevations from GPX <ele>"
            print(f"  {elev_source} ({len(elevations)} points)")

        # Source-specific attribution
        src = detect_gpx_source(fulls)
        if src == "schweizmobil":
            route_source_line = (
                "Route: Federal Roads Office, Canton, SwitzerlandMobility Foundation"
            )
            elev_source = "Elevations: Federal Office of Topography (swisstopo)"

    if elevations is None:
        print(f"  Querying Open-Meteo Elevation API ...")
        elevations = fetch_elevations(coords)

    # Cumulative distance
    distances_km = [0.0]
    for i in range(1, len(coords)):
        d = haversine(*coords[i - 1], *coords[i])
        distances_km.append(distances_km[-1] + d / 1000)

    total_km = distances_km[-1]
    ascent, descent, max_e, min_e = compute_stats(elevations)
    print(f"  {total_km:.1f} km · +{ascent:.0f} m · -{descent:.0f} m · max {max_e:.0f} m · min {min_e:.0f} m")

    # Only show waypoints that are part of a walking segment AND lie close
    # to the actual route polyline. The proximity filter is essential when
    # a single config produces multiple per-stage profiles: waypoints from
    # other stages are off this stage's GPX and should be omitted here.
    PROFILE_WP_MAX_DIST_M = 500
    walking_waypoints = []   # list of waypoint dicts
    walking_indices = []     # corresponding 1-based index in `waypoints`
    seen = set()
    all_waypoints = config.get("waypoints", [])
    for s in walk_segs:
        for wp in s.get("waypoints", [s["from"], s["to"]]):
            key = (wp.get("name"), wp["lat"], wp["lon"])
            if key in seen:
                continue
            # Distance to nearest route point
            best_d = float("inf")
            for lat, lon in coords:
                d = haversine(wp["lat"], wp["lon"], lat, lon)
                if d < best_d:
                    best_d = d
                    if best_d < 50:
                        break
            if best_d > PROFILE_WP_MAX_DIST_M:
                continue   # not on this profile's route
            seen.add(key)
            walking_waypoints.append(wp)
            for j, w in enumerate(all_waypoints, start=1):
                if (w.get("name"), w["lat"], w["lon"]) == key:
                    walking_indices.append(j)
                    break
            else:
                walking_indices.append(len(walking_waypoints))

    waypoint_distances = []
    if is_authoritative:
        # Snap each waypoint to nearest point on the walking polyline
        for w in walking_waypoints:
            best_i = 0
            best_d = float("inf")
            for i, (lat, lon) in enumerate(coords):
                d = haversine(w["lat"], w["lon"], lat, lon)
                if d < best_d:
                    best_d = d
                    best_i = i
            waypoint_distances.append(distances_km[best_i])
    else:
        # Straight-line: cumulative haversine
        cum = 0.0
        waypoint_distances.append(0.0)
        for i in range(len(walking_waypoints) - 1):
            d = haversine(
                walking_waypoints[i]["lat"], walking_waypoints[i]["lon"],
                walking_waypoints[i + 1]["lat"], walking_waypoints[i + 1]["lon"],
            )
            cum += d / 1000
            waypoint_distances.append(cum)

    # --- Plot ---
    fig, ax = plt.subplots(figsize=(OUT_W / 100, OUT_H / 100), dpi=100)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    fill_bottom = min_e - 50
    ax.fill_between(distances_km, fill_bottom, elevations,
                    color=ACCENT, alpha=0.13, zorder=2)
    ax.plot(distances_km, elevations, color=ACCENT, linewidth=2.5, zorder=3)

    # Waypoint markers — numbered red dots placed on the elevation curve.
    # Numbers match the map's legend (uses original index from full waypoints).
    if waypoint_distances:
        for d_km, w, idx_num in zip(waypoint_distances, walking_waypoints, walking_indices):
            # Find elevation at this distance
            idx = min(range(len(distances_km)),
                      key=lambda j: abs(distances_km[j] - d_km))
            e_at_wp = elevations[idx]

            # Subtle vertical guide line
            ax.axvline(d_km, color=SUBTLE, linewidth=0.6,
                       linestyle=":", alpha=0.5, zorder=1)

            # Small numbered marker on the curve
            ax.text(
                d_km, e_at_wp, str(idx_num),
                ha="center", va="center",
                fontsize=10, fontweight="bold", color="white", zorder=10,
                bbox=dict(boxstyle="circle,pad=0.35",
                          facecolor=ACCENT, edgecolor="white", linewidth=1.5),
            )

    # Title: brand serif on a plain white plate, matching the map plates.
    if title:
        import os
        from matplotlib.font_manager import FontProperties
        user_fonts = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Windows\Fonts")
        serif = None
        for p in (user_fonts + r"\Fraunces_72pt_SuperSoft-Light.ttf",
                  user_fonts + r"\Fraunces_72pt-Light.ttf",
                  "C:/Windows/Fonts/georgia.ttf"):
            if os.path.exists(p):
                # size must live on the FontProperties: set_title's fontsize
                # is ignored when fontproperties is supplied.
                serif = FontProperties(fname=p, size=26)
                break
        title = title.replace(" → ", " – ").replace("→", "–")
        ax.set_title(title, fontsize=26, fontproperties=serif,
                     color="#1F0D07", loc="left", pad=18,
                     bbox=dict(facecolor="white", edgecolor="none",
                               boxstyle="square,pad=0.55"))

    # Stats line — ascent/descent are only trustworthy when the route follows
    # the actual trail (GPX or routed). Straight-line mode picks up phantom
    # ascent/descent from terrain bumps the trail goes around.
    # Official stage stats (SchweizMobil) may be supplied per profile entry
    # (stats_ascent / stats_descent / stats_max) to replace the GPX-derived
    # sums: the guide's snapshot numbers and the profile footer must match.
    ascent_d = config.get("stats_ascent", ascent)
    descent_d = config.get("stats_descent", descent)
    max_d = config.get("stats_max", max_e)
    if is_authoritative:
        stats = (
            f"→ {total_km:.0f} km     "
            f"↗ {ascent_d:.0f} m     "
            f"↘ {descent_d:.0f} m     "
            f"▲ {max_d:.0f} m     "
            f"▽ {min_e:.0f} m"
        )
    else:
        stats = (
            f"→ {total_km:.0f} km     "
            f"▲ {max_e:.0f} m     "
            f"▽ {min_e:.0f} m"
        )
    ax.text(0.5, -0.22, stats, transform=ax.transAxes,
            ha="center", fontsize=16, color=TEXT, fontweight="bold")

    # Legend row: pair marker numbers with names
    if walking_waypoints:
        legend = "    ".join(
            f"({idx}) {w['name']}"
            for idx, w in zip(walking_indices, walking_waypoints)
        )
        ax.text(0.5, -0.35, legend, transform=ax.transAxes,
                ha="center", fontsize=13, color=TEXT)

    # Disclaimer + attribution
    disclaimer = (
        "Schematic – not for navigation"
        if is_authoritative else DISCLAIMER
    )
    ax.text(0.99, -0.46, disclaimer, transform=ax.transAxes,
            ha="right", fontsize=9, color=TEXT, fontweight="bold")

    # Build attribution lines
    if route_source_line:
        ax.text(0.99, -0.52, route_source_line,
                transform=ax.transAxes, ha="right",
                fontsize=8, color=SUBTLE, style="italic")
        ax.text(0.99, -0.58, elev_source,
                transform=ax.transAxes, ha="right",
                fontsize=8, color=SUBTLE, style="italic")
    else:
        ax.text(0.99, -0.52, f"{mode} · {elev_source}",
                transform=ax.transAxes, ha="right",
                fontsize=8, color=SUBTLE, style="italic")

    # Style
    ax.set_xlabel("km", color=TEXT, fontsize=11)
    ax.set_ylabel("m", color=TEXT, fontsize=11)
    ax.tick_params(colors=TEXT, labelsize=10)
    ax.grid(True, axis="y", color=GRID, linewidth=0.8, zorder=0)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color(SUBTLE)

    # Pad a little below the curve for headroom
    ax.set_ylim(min_e - 50, max_e + (max_e - min_e) * 0.30)

    plt.tight_layout()
    plt.savefig(output_path, facecolor=BG, dpi=100, bbox_inches="tight")
    # Re-stamp DPI metadata so PowerPoint places the image at 18.8 cm wide.
    from PIL import Image as _Image
    with _Image.open(output_path) as _img:
        _w = _img.width
        _img.save(output_path, dpi=(_w / (18.8 / 2.54),) * 2)
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

    profiles_list = config.get("profiles")
    if profiles_list:
        # Multi-profile mode: render one PNG per entry. Each profile entry
        # overrides title/gpx/output; everything else (waypoints, routing) inherits.
        if len(sys.argv) >= 3:
            print("! Multi-profile config: ignoring CLI output path argument", file=sys.stderr)
        for i, prof in enumerate(profiles_list, start=1):
            sub = {k: v for k, v in config.items() if k != "profiles"}
            sub.update(prof)
            sub.pop("routing", None) if prof.get("gpx") else None  # GPX wins
            output_rel = prof.get("output") or f"../output/{config_path.stem}-stage{i}-profile.png"
            output = (config_path.parent / output_rel).resolve()
            output.parent.mkdir(parents=True, exist_ok=True)
            print(f"Generating profile [{i}/{len(profiles_list)}]: {sub.get('title', '(untitled)')}")
            render_profile(sub, config_path, output)
        return

    if len(sys.argv) >= 3:
        output = Path(sys.argv[2])
    else:
        output = Path(__file__).parent / "output" / (config_path.stem + "-profile.png")

    output.parent.mkdir(parents=True, exist_ok=True)
    print(f"Generating profile: {config.get('title', '(untitled)')}")
    render_profile(config, config_path, output)


if __name__ == "__main__":
    main()

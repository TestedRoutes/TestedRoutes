# TestedRoutes map + elevation profile generator

Two scripts that share one YAML config per guide:

- `make_map.py` — branded route map (OpenStreetMap / OpenTopoMap tiles)
- `make_profile.py` — branded elevation profile (Open-Meteo Elevation API,
  Copernicus DEM)

Both render to PNG, sized for slide 6 of the guide PPTX.

## Setup

One-time:

```
pip install -r requirements.txt
```

## Usage

```
python make_map.py     guides/santis.yaml
python make_profile.py guides/santis.yaml
```

Output goes wherever the YAML's `output:` field points. Convention:
keep each guide's PNGs (and source GPX) in `output/<Guide Folder>/`,
e.g. `output/St Moritz - Alp Flix/st-moritz-alp-flix.png`. Drop each
PNG into the matching slot in slide 6 of the guide PPTX.

## Config format

Each guide gets its own YAML in `guides/`:

```yaml
title: "Wasserauen → Säntis"
output: "../output/santis.png"

waypoints:
  - {name: Wasserauen, lat: 47.2858, lon: 9.4283}
  - {name: Ebenalp,    lat: 47.2892, lon: 9.3981}
  - {name: Mesmer,     lat: 47.2535, lon: 9.3625}
  - {name: Säntis,     lat: 47.2495, lon: 9.3434}
```

`waypoints` is the only required field. Numbered markers are drawn in
the order listed, connected by a dashed accent-red line.

### Finding coordinates

Easiest way: open https://www.openstreetmap.org, right-click a point,
choose *Show address*. Lat/lon shown at the top. Or use any of the
hiking apps you already have (SchweizMobil, Komoot) and read off the
GPS coordinates.

## Reproducibility

- **Tile cache** in `.tile_cache/` — same coordinates always render the
  same map. First run fetches tiles (a few seconds); subsequent runs
  are near-instant.
- **Configs in YAML** — version-controllable, easy to diff.
- **Brand styling pinned** in the script: accent `#B83A2B`, cream
  `#FAF7F2`, Arial labels.
- **Output 1600 × 900 px** — sized for slide 6's image box.

## Brand styling

Defined at the top of `make_map.py`:

| Element | Value |
|---|---|
| Accent (markers, route line) | `#B83A2B` |
| Background fallback | `#FAF7F2` |
| Marker labels | `#1A1A1A` on white with red border |
| Attribution text | `#7A7468` |
| Output size | 1600 × 900 px |

To change, edit the constants at the top of the script.

## Attribution

OpenTopoMap tiles are derivative of OpenStreetMap data. The script
always prints attribution in the bottom-right corner of every map:

> © OpenStreetMap contributors · OpenTopoMap (CC-BY-SA)

This satisfies the licence requirement (ODbL + CC-BY-SA) for commercial
use in published guides. Don't remove it.

## Tile policy

OpenTopoMap's tile servers have rate limits. The script:

- Sets a `User-Agent` identifying TestedRoutes
- Sleeps 0.4 s between fresh tile fetches
- Rotates across `a/b/c.tile.opentopomap.org` subdomains
- Caches every tile so re-runs hit zero servers

For a typical guide map (single-digit number of tiles), this is
well within fair use.

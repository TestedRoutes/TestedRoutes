"""
TestedRoutes photo culler.

Walks a trip folder, scores each JPG (sharpness + AI aesthetic + dedup + CLIP defect filter),
optionally splits multi-location folders by GPS (or time-gap fallback), and copies the
top 20 shortlist + top 7 hero shots to renamed files for downstream Lightroom + InDesign use.

Usage:
    python cull.py --src "D:/2019-2020 - Zurich/2020 10 18 - Triftbrucke" --slug triftbruecke \\
        --out "C:/Users/pauli/Desktop/TestedRoutes_pictures"

Output (single-location case):
    <out>/<source folder name>/
        picks_20/<slug>_01.jpg ... <slug>_20.jpg
        picks_7/<slug>_hero.jpg, <slug>_01.jpg ... <slug>_06.jpg
        scores.csv

Output (multi-location case, e.g. two hikes in one folder):
    <out>/<source folder name>/
        location_1/picks_20/, picks_7/, scores.csv     (largest cluster)
        location_2/picks_20/, picks_7/, scores.csv
        locations.csv                                   (cluster summary)
"""

from __future__ import annotations

import argparse
import csv
import math
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

import cv2
import imagehash
import numpy as np
import torch
from PIL import Image
from PIL.ExifTags import GPSTAGS, TAGS

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

JPG_EXTS = {".jpg", ".jpeg"}
PICKS_SHORTLIST = 20
PICKS_HEROES = 7
DEDUP_HAMMING = 8
DIVERSITY_HAMMING = 16
MIN_TIME_GAP_MIN = 5         # heroes should be at least this many minutes apart (relaxed if not enough survive)
WEIGHT_AESTHETIC = 0.45
WEIGHT_SHARPNESS = 0.10
WEIGHT_HORIZON = 0.15        # rewards straight horizons; 0 if no horizon detected
WEIGHT_EXPOSURE = 0.20       # rewards good brightness + contrast; penalizes blown-out / underexposed
WEIGHT_SATURATION = 0.10     # mild bonus for colorful shots; not a hard penalty for muted ones
WEIGHT_DEFECT = 3.0          # multiplied against a cosine margin in [-0.20, +0.20]
DEFECT_HARD_REJECT = 0.025   # cosine margin: defect prompt beats good prompt by 2.5% cosine
HORIZON_FULL_TILT_DEG = 8.0  # tilt at which horizon_score drops to 0; 0deg = full score
GPS_CLUSTER_M = 500          # only used when --split-locations is passed
TIME_GAP_HOURS = 3.0         # only used when --split-locations is passed

DEFECT_PROMPTS = [
    "a photo with a finger or thumb covering the camera lens",
    "a photo accidentally taken of a hand or finger",
    "a photo with a large blurry obstruction in front of the lens",
    "a photo that is mostly out of focus or motion-blurred beyond recognition",
    "a photo where the lens is partially blocked by an object",
    "a photo with electrical wires or power lines crossing the frame",
    "a photo with cables, wires, or fences blocking the view",
    "a photo with a lamp post, traffic sign, or pole obstructing the subject",
    "a photo ruined by ugly clutter in the foreground",
    "a photo with overhead wires or ski-lift cables in the sky",
]
GOOD_PROMPTS = [
    "a well-composed travel or landscape photograph",
    "a clear sharp photograph of a scene",
    "a beautiful unobstructed view",
]


# ---------- helpers ----------

def list_jpgs(folder: Path) -> list[Path]:
    return sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in JPG_EXTS)


def _sharpness_from_gray(gray) -> float:
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _horizon_tilt_from_gray(gray) -> float | None:
    h, w = gray.shape
    scale = 1024.0 / max(h, w) if max(h, w) > 1024 else 1.0
    if scale != 1.0:
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)))
    edges = cv2.Canny(gray, 50, 150)
    min_len = gray.shape[1] // 4
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi / 180, threshold=100,
                            minLineLength=min_len, maxLineGap=10)
    if lines is None:
        return None
    angles: list[float] = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
        if angle > 90:
            angle -= 180
        elif angle <= -90:
            angle += 180
        if abs(angle) <= 25:
            angles.append(abs(angle))
    if len(angles) < 3:
        return None
    return float(np.median(angles))


def _exposure_from_gray(gray) -> float:
    mean = float(gray.mean())
    std = float(gray.std())
    if mean < 30 or mean > 230:
        brightness_ok = 0.0
    elif mean < 60:
        brightness_ok = (mean - 30) / 30.0
    elif mean > 200:
        brightness_ok = (230 - mean) / 30.0
    else:
        brightness_ok = 1.0
    contrast_ok = min(1.0, std / 50.0)
    return 0.5 * brightness_ok + 0.5 * contrast_ok


def _saturation_from_color(color_bgr) -> float:
    hsv = cv2.cvtColor(color_bgr, cv2.COLOR_BGR2HSV)
    sat = float(hsv[:, :, 1].mean()) / 255.0
    return min(1.0, sat * 2.0)


def cheap_features(path: Path) -> dict | None:
    """Decode the image ONCE (cv2 color + PIL), derive all cheap features.

    Roughly 4-5x faster than calling sharpness/horizon/exposure/saturation/phash separately,
    because each of those used to re-decode the JPEG. On an external HDD the savings are huge.
    """
    color = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if color is None:
        return None
    gray = cv2.cvtColor(color, cv2.COLOR_BGR2GRAY)
    with Image.open(path) as im:
        ph = imagehash.phash(im)
        try:
            exif = im._getexif() or {}
        except Exception:
            exif = {}

    # Parse EXIF inline (avoids re-opening for extract_exif).
    gps_raw, ts_raw = None, None
    for tid, val in exif.items():
        tag = TAGS.get(tid, tid)
        if tag == "GPSInfo":
            gps_raw = val
        elif tag == "DateTimeOriginal":
            ts_raw = val
    gps = None
    if gps_raw:
        g = {GPSTAGS.get(k, k): v for k, v in gps_raw.items()}
        if "GPSLatitude" in g and "GPSLongitude" in g:
            try:
                def _to_deg(v):
                    return float(v[0]) + float(v[1]) / 60 + float(v[2]) / 3600
                lat = _to_deg(g["GPSLatitude"])
                if g.get("GPSLatitudeRef") == "S":
                    lat = -lat
                lon = _to_deg(g["GPSLongitude"])
                if g.get("GPSLongitudeRef") == "W":
                    lon = -lon
                gps = (lat, lon)
            except Exception:
                gps = None
    taken_at = None
    if ts_raw:
        try:
            taken_at = datetime.strptime(ts_raw, "%Y:%m:%d %H:%M:%S")
        except Exception:
            taken_at = None

    return {
        "sharpness": _sharpness_from_gray(gray),
        "phash": ph,
        "gps": gps,
        "taken_at": taken_at,
        "horizon_tilt": _horizon_tilt_from_gray(gray),
        "exposure": _exposure_from_gray(gray),
        "saturation": _saturation_from_color(color),
    }


def horizon_score(tilt_deg: float | None) -> float:
    """0..1, higher = straighter. 0.5 (neutral) if no horizon could be detected."""
    if tilt_deg is None:
        return 0.5
    return max(0.0, 1.0 - tilt_deg / HORIZON_FULL_TILT_DEG)




def phash(path: Path) -> imagehash.ImageHash:
    with Image.open(path) as im:
        return imagehash.phash(im)


def extract_exif(path: Path) -> tuple[tuple[float, float] | None, datetime | None]:
    """Return (gps, taken_at). Either may be None if missing or unparseable."""
    try:
        with Image.open(path) as im:
            exif = im._getexif() or {}
    except Exception:
        return None, None

    gps_raw = None
    timestamp_raw = None
    for tid, val in exif.items():
        tag = TAGS.get(tid, tid)
        if tag == "GPSInfo":
            gps_raw = val
        elif tag == "DateTimeOriginal":
            timestamp_raw = val

    gps = None
    if gps_raw:
        g = {GPSTAGS.get(k, k): v for k, v in gps_raw.items()}
        if "GPSLatitude" in g and "GPSLongitude" in g:
            try:
                def to_deg(v):
                    return float(v[0]) + float(v[1]) / 60 + float(v[2]) / 3600
                lat = to_deg(g["GPSLatitude"])
                if g.get("GPSLatitudeRef") == "S":
                    lat = -lat
                lon = to_deg(g["GPSLongitude"])
                if g.get("GPSLongitudeRef") == "W":
                    lon = -lon
                gps = (lat, lon)
            except Exception:
                gps = None

    taken_at = None
    if timestamp_raw:
        try:
            taken_at = datetime.strptime(timestamp_raw, "%Y:%m:%d %H:%M:%S")
        except Exception:
            taken_at = None

    return gps, taken_at


def haversine_m(p1: tuple[float, float], p2: tuple[float, float]) -> float:
    R = 6371000.0
    lat1, lon1 = math.radians(p1[0]), math.radians(p1[1])
    lat2, lon2 = math.radians(p2[0]), math.radians(p2[1])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def dedupe(items: list[dict], threshold: int) -> list[dict]:
    kept: list[dict] = []
    for item in sorted(items, key=lambda x: -x["sharpness"]):
        if not any((item["phash"] - k["phash"]) < threshold for k in kept):
            kept.append(item)
    return kept


def diverse_top_n(items: list[dict], n: int, phash_threshold: int, min_time_gap_min: float) -> list[dict]:
    """Pick n items with strong temporal spread + visual diversity.

    Strategy: time-bucket candidates into n equal slots across the trip's time range,
    pick the highest-scoring photo from each slot (rejecting visual near-duplicates).
    This guarantees that heroes cover the whole trip rather than clustering in one moment.

    Falls back to a simple pHash-only diverse pick when:
      - too few photos have timestamps to bucket meaningfully, or
      - the trip's time span is shorter than n * min_time_gap_min minutes (no spread possible).

    Items must already be sorted by score descending.
    """

    def pHash_diverse_pick() -> list[dict]:
        """Greedy fallback: best score first, skip visual near-duplicates."""
        chosen: list[dict] = []
        for item in items:
            if len(chosen) >= n:
                break
            if any((item["phash"] - c["phash"]) < phash_threshold for c in chosen):
                continue
            chosen.append(item)
        if len(chosen) < n:
            for item in items:
                if item in chosen or len(chosen) >= n:
                    continue
                chosen.append(item)
        return chosen

    timed = [it for it in items if it.get("taken_at") is not None]
    if len(timed) < n:
        return pHash_diverse_pick()

    earliest = min(it["taken_at"] for it in timed)
    latest = max(it["taken_at"] for it in timed)
    span_min = (latest - earliest).total_seconds() / 60.0
    if span_min < n * min_time_gap_min:
        # Trip too short to enforce spread - fall back to pHash diversity.
        return pHash_diverse_pick()

    bucket_size_min = span_min / n
    buckets: list[list[dict]] = [[] for _ in range(n)]
    for it in items:
        ts = it.get("taken_at")
        if ts is None:
            continue
        offset_min = (ts - earliest).total_seconds() / 60.0
        idx = min(int(offset_min / bucket_size_min), n - 1)
        buckets[idx].append(it)

    selected: list[dict] = []
    for bucket in buckets:
        for cand in sorted(bucket, key=lambda x: -x["score"]):
            if any((cand["phash"] - s["phash"]) < phash_threshold for s in selected):
                continue
            selected.append(cand)
            break

    # Fill empty-bucket slots from the best-scoring leftovers.
    if len(selected) < n:
        for cand in items:
            if cand in selected:
                continue
            if any((cand["phash"] - s["phash"]) < phash_threshold for s in selected):
                continue
            selected.append(cand)
            if len(selected) >= n:
                break

    return selected[:n]


def normalize(values: list[float]) -> list[float]:
    if not values:
        return []
    arr = np.array(values, dtype=float)
    if arr.max() == arr.min():
        return [0.5] * len(values)
    return ((arr - arr.min()) / (arr.max() - arr.min())).tolist()


# ---------- clustering ----------

def cluster_by_gps(items: list[dict], threshold_m: float) -> list[list[dict]]:
    """Union-find clustering by haversine distance."""
    n = len(items)
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for i in range(n):
        for j in range(i + 1, n):
            if haversine_m(items[i]["gps"], items[j]["gps"]) < threshold_m:
                pi, pj = find(i), find(j)
                if pi != pj:
                    parent[pi] = pj

    buckets: dict[int, list[dict]] = {}
    for i, it in enumerate(items):
        buckets.setdefault(find(i), []).append(it)
    return list(buckets.values())


def cluster_by_time(items: list[dict], gap_hours: float) -> list[list[dict]]:
    """Sort by timestamp, split when consecutive gap exceeds threshold."""
    timed = [it for it in items if it.get("taken_at")]
    if not timed:
        return [items]
    timed.sort(key=lambda x: x["taken_at"])
    clusters: list[list[dict]] = [[timed[0]]]
    for prev, cur in zip(timed, timed[1:]):
        delta_h = (cur["taken_at"] - prev["taken_at"]).total_seconds() / 3600
        if delta_h >= gap_hours:
            clusters.append([cur])
        else:
            clusters[-1].append(cur)
    untimed = [it for it in items if not it.get("taken_at")]
    if untimed:
        clusters[0].extend(untimed)
    return clusters


def split_into_locations(items: list[dict], args) -> tuple[list[list[dict]], str]:
    """Try GPS first, then time-gap fallback. Returns (clusters, method_label).

    Auto-split is OFF by default. Pass --split-locations to enable.
    """
    if not args.split_locations:
        return [items], "disabled (default)"

    with_gps = [it for it in items if it.get("gps")]
    if len(with_gps) >= 2 and len(with_gps) >= 0.5 * len(items):
        clusters = cluster_by_gps(with_gps, args.gps_threshold_m)
        without_gps = [it for it in items if not it.get("gps")]
        if without_gps:
            clusters.sort(key=lambda c: -len(c))
            clusters[0].extend(without_gps)
        clusters.sort(key=lambda c: -len(c))
        if len(clusters) > 1:
            return clusters, f"GPS (>{args.gps_threshold_m:.0f}m apart)"
        return clusters, "GPS (single cluster)"

    clusters = cluster_by_time(items, args.time_gap_hours)
    clusters.sort(key=lambda c: -len(c))
    if len(clusters) > 1:
        return clusters, f"time gap (>={args.time_gap_hours:.1f}h)"
    return clusters, "time gap (single cluster)"


def gps_centroid(items: list[dict]) -> tuple[float, float] | None:
    coords = [it["gps"] for it in items if it.get("gps")]
    if not coords:
        return None
    return (sum(c[0] for c in coords) / len(coords), sum(c[1] for c in coords) / len(coords))


def time_range(items: list[dict]) -> tuple[datetime, datetime] | None:
    times = [it["taken_at"] for it in items if it.get("taken_at")]
    if not times:
        return None
    return min(times), max(times)


# ---------- expensive model loaders ----------

def load_aesthetic_metric():
    import pyiqa  # noqa: WPS433

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"  Loading aesthetic model (nima) on {device}...", flush=True)
    return pyiqa.create_metric("nima", device=device, as_loss=False)


def load_clip_defect_detector():
    """Load HuggingFace CLIP and return a per-image defect scorer.

    Uses the full forward (`model(**inputs)`) pattern rather than `get_text_features`,
    which is more stable across transformers major versions and returns
    `logits_per_image` directly (a temperature-scaled cosine similarity).
    """
    from transformers import CLIPModel, CLIPProcessor  # noqa: WPS433

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_name = "openai/clip-vit-base-patch32"
    print(f"  Loading CLIP defect detector ({model_name}) on {device}...", flush=True)
    model = CLIPModel.from_pretrained(model_name).to(device)
    processor = CLIPProcessor.from_pretrained(model_name)
    model.eval()

    prompts = DEFECT_PROMPTS + GOOD_PROMPTS
    n_defect = len(DEFECT_PROMPTS)

    def score(path: Path) -> float:
        with Image.open(path) as im:
            img = im.convert("RGB")
        inputs = processor(text=prompts, images=img, return_tensors="pt", padding=True).to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            # logits_per_image = cosine_sim * exp(logit_scale), where exp(logit_scale) ~ 100.
            # Divide it back so the defect score is a true cosine margin in [-2, +2]
            # (typically [-0.10, +0.10] in practice). Otherwise thresholds would have to
            # be set per CLIP variant, which is brittle.
            temperature = model.logit_scale.exp().item()
            cosines = (outputs.logits_per_image.squeeze(0) / temperature).cpu().tolist()
        return float(max(cosines[:n_defect]) - max(cosines[n_defect:]))

    return score


# ---------- per-cluster pipeline ----------

def process_cluster(items: list[dict], out_dir: Path, slug: str, label: str, args) -> None:
    print(f"\n--- {label} ({len(items)} photos) ---")
    deduped = dedupe(items, args.dedup)
    print(f"  Dedup: {len(items)} → {len(deduped)} survivors")

    sharp_norm = normalize([it["sharpness"] for it in deduped])
    aest_norm = normalize([it["aesthetic"] for it in deduped])
    for it, sn, an in zip(deduped, sharp_norm, aest_norm):
        h_score = horizon_score(it.get("horizon_tilt"))
        it["horizon_score"] = h_score
        defect_penalty = args.weight_defect * max(0.0, it["defect"])
        base = (
            args.weight_aesthetic * an
            + args.weight_sharpness * sn
            + args.weight_horizon * h_score
            + args.weight_exposure * it["exposure"]
            + args.weight_saturation * it["saturation"]
        )
        it["score"] = base - defect_penalty
        it["hard_rejected"] = it["defect"] >= args.defect_hard_reject
        if it["hard_rejected"]:
            it["score"] -= 10.0
    deduped.sort(key=lambda x: -x["score"])

    rejected = [it for it in deduped if it["hard_rejected"]]
    if rejected:
        print(f"  Hard-rejected (defect_score >= {args.defect_hard_reject}): {len(rejected)}")

    top_shortlist = deduped[:PICKS_SHORTLIST]
    top_heroes = diverse_top_n(top_shortlist, PICKS_HEROES, args.diversity, args.min_time_gap_minutes)
    print(f"  Top {len(top_shortlist)}, then top {len(top_heroes)} heroes (min time gap {args.min_time_gap_minutes} min).")

    if args.dry_run:
        for i, it in enumerate(top_shortlist, 1):
            tag = " (hero)" if it in top_heroes else ""
            print(f"    {i:2d}. {it['path'].name}  score={it['score']:.3f}  aest={it['aesthetic']:.3f}  sharp={it['sharpness']:.0f}  defect={it['defect']:+.3f}{tag}")
        return

    out_shortlist = out_dir / f"picks_{PICKS_SHORTLIST}"
    out_heroes = out_dir / f"picks_{PICKS_HEROES}"
    out_shortlist.mkdir(parents=True, exist_ok=True)
    out_heroes.mkdir(parents=True, exist_ok=True)

    for i, it in enumerate(top_shortlist, 1):
        shutil.copy2(it["path"], out_shortlist / f"{slug}_{i:02d}.jpg")
    for i, it in enumerate(top_heroes):
        name = f"{slug}_hero.jpg" if i == 0 else f"{slug}_{i:02d}.jpg"
        shutil.copy2(it["path"], out_heroes / name)

    audit = out_dir / "scores.csv"
    rank_in_shortlist = {it["path"]: i for i, it in enumerate(top_shortlist, 1)}
    hero_set = {it["path"] for it in top_heroes}
    with audit.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["rank", "in_shortlist", "in_heroes", "filename", "score", "aesthetic", "sharpness", "horizon_tilt_deg", "horizon_score", "exposure", "saturation", "defect", "hard_rejected", "taken_at"])
        for r, it in enumerate(deduped, 1):
            w.writerow([
                r,
                rank_in_shortlist.get(it["path"], ""),
                "yes" if it["path"] in hero_set else "",
                it["path"].name,
                f"{it['score']:.4f}", f"{it['aesthetic']:.4f}", f"{it['sharpness']:.1f}",
                f"{it['horizon_tilt']:.2f}" if it.get("horizon_tilt") is not None else "",
                f"{it['horizon_score']:.3f}",
                f"{it['exposure']:.3f}",
                f"{it['saturation']:.3f}",
                f"{it['defect']:.4f}",
                "yes" if it["hard_rejected"] else "",
                it["taken_at"].isoformat() if it.get("taken_at") else "",
            ])
    print(f"  → {out_dir}")


# ---------- top-level ----------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--src", required=True, help="Source trip folder (contains JPGs).")
    parser.add_argument("--slug", required=True, help="Trip slug used for output filenames (e.g. triftbruecke).")
    parser.add_argument("--out", help="Output base folder. Per-trip subfolder mirrors source folder name.")

    parser.add_argument("--dedup", type=int, default=DEDUP_HAMMING, help=f"pHash dedup threshold (default {DEDUP_HAMMING}).")
    parser.add_argument("--diversity", type=int, default=DIVERSITY_HAMMING, help=f"pHash spread for the 7 picks (default {DIVERSITY_HAMMING}).")
    parser.add_argument("--min-time-gap-minutes", type=float, default=MIN_TIME_GAP_MIN, help=f"Heroes should be at least this many minutes apart in EXIF DateTimeOriginal (default {MIN_TIME_GAP_MIN}). Relaxed automatically if too few survive.")

    parser.add_argument("--weight-aesthetic", type=float, default=WEIGHT_AESTHETIC)
    parser.add_argument("--weight-sharpness", type=float, default=WEIGHT_SHARPNESS)
    parser.add_argument("--weight-horizon", type=float, default=WEIGHT_HORIZON, help=f"Reward for straight horizons (default {WEIGHT_HORIZON}). Set to 0 to disable.")
    parser.add_argument("--weight-exposure", type=float, default=WEIGHT_EXPOSURE, help=f"Reward for healthy brightness/contrast (default {WEIGHT_EXPOSURE}).")
    parser.add_argument("--weight-saturation", type=float, default=WEIGHT_SATURATION, help=f"Reward for colourful images (default {WEIGHT_SATURATION}).")
    parser.add_argument("--weight-defect", type=float, default=WEIGHT_DEFECT)
    parser.add_argument("--defect-hard-reject", type=float, default=DEFECT_HARD_REJECT)
    parser.add_argument("--with-defect-filter", action="store_true", help="Enable CLIP defect detection (slow: adds ~1-2s/image). Off by default since v2.")

    parser.add_argument("--split-locations", action="store_true", help="Auto-split into multiple location_N/ subfolders by GPS, then time-gap fallback. Off by default.")
    parser.add_argument("--gps-threshold-m", type=float, default=GPS_CLUSTER_M, help=f"GPS clustering radius in meters (default {GPS_CLUSTER_M}).")
    parser.add_argument("--time-gap-hours", type=float, default=TIME_GAP_HOURS, help=f"Time gap in hours that triggers a new cluster (default {TIME_GAP_HOURS}).")

    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    src = Path(args.src)
    if not src.is_dir():
        print(f"ERROR: not a directory: {src}", file=sys.stderr)
        return 2

    out_base = Path(args.out) / src.name if args.out else src.parent / f"_culled_{src.name}"

    jpgs = list_jpgs(src)
    if not jpgs:
        print(f"ERROR: no JPGs in {src}", file=sys.stderr)
        return 2
    print(f"\n=== {src.name} ===")
    print(f"Found {len(jpgs)} JPGs.")

    t0 = time.time()
    items: list[dict] = []
    for i, p in enumerate(jpgs, 1):
        if i % 25 == 1 or i == len(jpgs):
            print(f"  [{i:3d}/{len(jpgs)}] {p.name}", flush=True)
        try:
            features = cheap_features(p)
            if features is None:
                print(f"    skipped (cv2 could not read {p.name})")
                continue
            features["path"] = p
            items.append(features)
        except Exception as e:
            print(f"    skipped ({e})")
    print(f"Stage 1 (cheap features) done in {time.time() - t0:.1f}s")

    n_gps = sum(1 for it in items if it["gps"])
    n_time = sum(1 for it in items if it["taken_at"])
    print(f"  EXIF: {n_gps}/{len(items)} have GPS, {n_time}/{len(items)} have timestamp")

    clusters, method = split_into_locations(items, args)
    print(f"\nLocation split via {method}: {len(clusters)} cluster(s)")
    for i, c in enumerate(clusters, 1):
        centroid = gps_centroid(c)
        trange = time_range(c)
        bits = [f"location_{i}: {len(c)} photos"]
        if centroid:
            bits.append(f"centroid {centroid[0]:.5f},{centroid[1]:.5f} (https://maps.google.com/?q={centroid[0]},{centroid[1]})")
        if trange:
            bits.append(f"time {trange[0].strftime('%H:%M')}–{trange[1].strftime('%H:%M')}")
        print("  " + " | ".join(bits))

    t1 = time.time()
    aesthetic_metric = load_aesthetic_metric()
    for i, item in enumerate(items, 1):
        print(f"  [{i:3d}/{len(items)}] {item['path'].name} – aesthetic", flush=True)
        try:
            item["aesthetic"] = float(aesthetic_metric(str(item["path"])).item())
        except Exception as e:
            print(f"    aesthetic failed ({e}); using 0")
            item["aesthetic"] = 0.0
    print(f"Stage 2 (aesthetic) done in {time.time() - t1:.1f}s")

    if not args.with_defect_filter:
        for it in items:
            it["defect"] = 0.0
        print("Stage 2.5 (defect filter) skipped (default; pass --with-defect-filter to enable)")
    else:
        t2 = time.time()
        defect_score_fn = load_clip_defect_detector()
        for i, item in enumerate(items, 1):
            print(f"  [{i:3d}/{len(items)}] {item['path'].name} – defect", flush=True)
            try:
                item["defect"] = defect_score_fn(item["path"])
            except Exception as e:
                print(f"    defect failed ({e}); using 0")
                item["defect"] = 0.0
        print(f"Stage 2.5 (defect filter) done in {time.time() - t2:.1f}s")

    if not args.dry_run:
        out_base.mkdir(parents=True, exist_ok=True)
        if len(clusters) > 1:
            with (out_base / "locations.csv").open("w", newline="", encoding="utf-8") as fh:
                w = csv.writer(fh)
                w.writerow(["location", "photo_count", "centroid_lat", "centroid_lon", "time_start", "time_end", "split_method"])
                for i, c in enumerate(clusters, 1):
                    centroid = gps_centroid(c) or ("", "")
                    trange = time_range(c)
                    w.writerow([
                        f"location_{i}", len(c), centroid[0], centroid[1],
                        trange[0].isoformat() if trange else "",
                        trange[1].isoformat() if trange else "",
                        method,
                    ])

    for i, cluster in enumerate(clusters, 1):
        cluster_out = out_base if len(clusters) == 1 else out_base / f"location_{i}"
        process_cluster(cluster, cluster_out, args.slug, f"location_{i}" if len(clusters) > 1 else "single location", args)

    print(f"\nDone in {time.time() - t0:.1f}s.")
    print(f"  Output → {out_base}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

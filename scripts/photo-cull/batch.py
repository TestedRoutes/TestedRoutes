"""
Run cull.py over every immediate subfolder of a parent directory.

Each subfolder is treated as one trip. The slug is derived from the folder name
(everything after the last " - ", lowercased, slugified). Trips that already have
a picks_7/ folder with 7 hero files are skipped, so the batch is resumable.

Usage:
    python batch.py --src-root "D:/_For_Guides-Switzerland/1. Hike/_Day_hike" \\
        --out "C:/Users/pauli/Desktop/TestedRoutes_pictures"

Optional:
    --dry-run        list trips + slugs, don't run cull
    --force          re-process even if output already exists
    --only "<name>"  only process subfolders whose name contains this substring (repeatable)
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import time
import unicodedata
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CULL_PY = Path(__file__).parent / "cull.py"
PYTHON = Path(__file__).parent / ".venv" / "Scripts" / "python.exe"
JPG_EXTS = {".jpg", ".jpeg"}


def slugify(folder_name: str) -> str:
    """`2020 10 18 - Triftbrucke hike` → `triftbrucke-hike`."""
    tail = folder_name.rsplit(" - ", 1)[-1]
    normalised = unicodedata.normalize("NFKD", tail).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^\w\s-]", "", normalised.lower())
    slug = re.sub(r"\s+", "-", slug.strip())
    return slug or "trip"


def has_jpgs(folder: Path) -> bool:
    return any(p.suffix.lower() in JPG_EXTS for p in folder.iterdir() if p.is_file())


def already_done(out_root: Path, src_folder: Path) -> bool:
    """Treat as done if a picks_7 folder anywhere under <out_root>/<src.name>/ has 7 files."""
    out_dir = out_root / src_folder.name
    if not out_dir.exists():
        return False
    for picks_7 in out_dir.rglob("picks_7"):
        if picks_7.is_dir() and sum(1 for _ in picks_7.iterdir()) >= 7:
            return True
    return False


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--src-root", required=True, help="Parent folder containing trip subfolders.")
    p.add_argument("--out", required=True, help="Output base folder.")
    p.add_argument("--dry-run", action="store_true", help="Just list what would run.")
    p.add_argument("--force", action="store_true", help="Re-process trips that already have output.")
    p.add_argument("--only", action="append", default=[], help="Process only subfolders whose name contains this substring (repeatable).")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    src_root = Path(args.src_root)
    out_root = Path(args.out)
    if not src_root.is_dir():
        print(f"ERROR: not a directory: {src_root}", file=sys.stderr)
        return 2
    if not CULL_PY.exists():
        print(f"ERROR: cull.py not found at {CULL_PY}", file=sys.stderr)
        return 2
    if not PYTHON.exists():
        print(f"ERROR: venv python not found at {PYTHON}", file=sys.stderr)
        return 2

    trips = sorted(p for p in src_root.iterdir() if p.is_dir() and not p.name.startswith("_"))
    if args.only:
        trips = [t for t in trips if any(s.lower() in t.name.lower() for s in args.only)]
    if not trips:
        print(f"No trip subfolders matched in {src_root}")
        return 0

    plan = []
    for t in trips:
        if not has_jpgs(t):
            plan.append((t, slugify(t.name), "skip (no jpgs)"))
            continue
        if not args.force and already_done(out_root, t):
            plan.append((t, slugify(t.name), "skip (already done)"))
            continue
        plan.append((t, slugify(t.name), "run"))

    print(f"\nFound {len(trips)} trip subfolder(s) in {src_root}")
    width = max(len(t.name) for t in trips) + 2
    for t, slug, action in plan:
        print(f"  [{action:22}] {t.name:<{width}} → slug: {slug}")

    if args.dry_run:
        return 0

    to_run = [(t, slug) for t, slug, action in plan if action == "run"]
    if not to_run:
        print("\nNothing to do.")
        return 0

    print(f"\nRunning cull on {len(to_run)} trip(s).\n")
    t_start = time.time()
    failures: list[tuple[Path, int]] = []

    for i, (trip, slug) in enumerate(to_run, 1):
        print(f"\n{'=' * 70}")
        print(f"[{i}/{len(to_run)}] {trip.name}  →  slug={slug}")
        print(f"{'=' * 70}")
        cmd = [
            str(PYTHON), str(CULL_PY),
            "--src", str(trip),
            "--slug", slug,
            "--out", str(out_root),
        ]
        result = subprocess.run(cmd, check=False)
        if result.returncode != 0:
            print(f"\n!! [{trip.name}] failed with exit code {result.returncode}")
            failures.append((trip, result.returncode))

    elapsed = time.time() - t_start
    print(f"\n\n{'=' * 70}")
    print(f"BATCH DONE in {elapsed/60:.1f} min ({elapsed:.0f}s).")
    print(f"  Processed: {len(to_run)}")
    print(f"  Failed:    {len(failures)}")
    for trip, rc in failures:
        print(f"    - {trip.name} (exit {rc})")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())

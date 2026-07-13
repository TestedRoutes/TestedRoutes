#!/usr/bin/env python3
"""
TestedRoutes - batch publisher for Inspire stories.

Reads the Content Plan masterfile, and for every row whose Status is
"To be published":
  1. locates content/inspire/{country}/{ID}/
  2. extracts {ID}_story*.docx -> generated/{ID}_story_en.md
  3. converts photos/ masters -> generated/{ID}_*.jpg (<=2560px, q85)
  4. cuts the first video -> generated/{ID}_teaser.mp4 (7s, 720p, muted)
  5. drafts {ID}_meta_en.yaml (plan fields + Claude-proposed fields)
  6. runs scripts/publish-to-sanity.mjs on the folder
  7. writes the ledger + review CSV, and sets the row's Status to
     "Published" in the masterfile.

Rows with any other status are never touched.

Usage:
  python scripts/batch_publish.py --plan "<path to xlsx>" [--dry-run]
      [--only ID]... [--limit N]
"""
import argparse
import csv
import glob
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import openpyxl
import yaml
from PIL import Image

# Windows consoles default to cp1252, which can't print ✓ etc.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

REPO = Path(__file__).resolve().parents[1]
INSPIRE = REPO / "content" / "inspire"
LEDGER_PATH = INSPIRE / "publish-ledger.json"
REVIEW_DIR = INSPIRE / "_review"

REGION_CONTINENT = {
    "Americas": None,
    "Asia": "Asia",
    "Atlantic & volcanic islands": "Europe",
    "East & Southern Africa": "Africa",
    "Extreme & Summits (cross-region)": None,
    "Middle East & Gulf": "Asia",
    "Nordics & Baltics": "Europe",
    "North & West Africa": "Africa",
    "Oceania & Pacific": "Oceania",
    "Southern Europe": "Europe",
    "Switzerland & the Alps": "Europe",
}

TRIP_LENGTHS = ["Day", "Weekend", "Week+", "Rally", "Expedition"]
DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Demanding", "Expert"]
ACTIVITIES = [
    "Hiking", "Skiing", "Rafting", "Via Ferrata", "Mountaineering", "Diving",
    "Kayaking", "Bungee", "Seven Summits", "Africa Rally", "Safari", "Roadtrip",
]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

DOCX_META_KEYS = {
    "id", "slug", "title", "type", "region", "country", "angle", "guide_wave",
    "links_to_guide", "status", "target_query", "meta_description", "series",
    "source", "pics", "notes",
}

CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")


def load_env_local():
    env = REPO / ".env.local"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^([A-Z_][A-Z0-9_]*)=(.*)$", line.strip())
        if m:
            v = m.group(2).strip().strip('"').strip("'")
            os.environ.setdefault(m.group(1), v)


def find_ffmpeg():
    cand = glob.glob(
        os.path.expandvars(
            r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*\**\bin\ffmpeg.exe"
        ),
        recursive=True,
    )
    if cand:
        return cand[0]
    return "ffmpeg"  # hope it's on PATH


def read_plan(plan_path):
    wb = openpyxl.load_workbook(plan_path, read_only=True, data_only=True)
    ws = wb["Inspire"]
    rows = []
    for r in ws.iter_rows(min_row=2, values_only=True):
        if r[2] is None:
            continue
        rows.append({
            "region": str(r[0] or "").strip(),
            "country": str(r[1] or "").strip(),
            "id": str(r[2]).strip(),
            "title": str(r[3] or "").strip(),
            "angle": str(r[4] or "").strip(),
            "note": str(r[5] or "").strip(),
            "guide_wave": str(r[6] or "").strip(),
            "status": str(r[7] or "").strip(),
            "links_to_guide": str(r[9] or "").strip(),
            "source": str(r[10] or "").strip(),
            "series": str(r[12] or "").strip(),
        })
    wb.close()
    return rows


def find_story_folder(story_id):
    hits = glob.glob(str(INSPIRE / "*" / story_id))
    return Path(hits[0]) if hits else None


def extract_docx(docx_path, plan_title):
    """Return (docx_meta: dict, body_markdown: str)."""
    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
    paras = []
    for pm in re.finditer(r"<w:p[ >].*?</w:p>", xml, re.S):
        block = pm.group(0)
        text = "".join(
            m.group(1) for m in re.finditer(r"<w:t[^>]*>(.*?)</w:t>", block, re.S)
        )
        text = (
            text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
            .replace("&apos;", "'").replace("&quot;", '"').strip()
        )
        if text:
            paras.append(text)

    meta = {}
    body = []
    for p in paras:
        km = re.match(r"^([a-z_]+):\s*(.*)$", p)
        if km and km.group(1) in DOCX_META_KEYS:
            meta[km.group(1)] = km.group(2).strip()
            continue
        # skip a leading repeat of the title (any heading/plain form)
        if not body and plan_title and p.strip().lower() == plan_title.strip().lower():
            continue
        body.append(p)
    return meta, "\n\n".join(body).strip()


def convert_images(folder, story_id):
    gen = folder / "generated"
    gen.mkdir(exist_ok=True)
    out = []
    photos = sorted((folder / "photos").glob("*"))
    for p in photos:
        if p.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        dst = gen / (p.stem + ".jpg")
        if not dst.exists() or dst.stat().st_mtime < p.stat().st_mtime:
            img = Image.open(p)
            img = img.convert("RGB")
            if img.width > 2560:
                img = img.resize((2560, round(img.height * 2560 / img.width)), Image.LANCZOS)
            img.save(dst, "JPEG", quality=85, optimize=True)
        out.append(dst.name)
    return out


def cut_teaser(folder, story_id, ffmpeg):
    vids = [
        p for p in sorted((folder / "photos").glob("*"))
        if p.suffix.lower() in (".mp4", ".mov", ".webm")
    ]
    if not vids:
        return None
    dst = folder / "generated" / f"{story_id}_teaser.mp4"
    if dst.exists() and dst.stat().st_mtime >= vids[0].stat().st_mtime:
        return dst.name
    cmd = [
        ffmpeg, "-y", "-v", "error", "-ss", "0.5", "-t", "7", "-i", str(vids[0]),
        "-vf", "scale=-2:720,fps=24", "-c:v", "libx264", "-preset", "slow",
        "-crf", "27", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
        str(dst),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"    ! teaser failed: {r.stderr.strip()[:200]}")
        return None
    return dst.name


def claude_meta(row, docx_meta, body, photo_names):
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return {}
    prompt = f"""You draft metadata for a travel story on testedroutes.com. Respond with ONLY a JSON object, no prose.

Story title: {row['title']}
Country: {row['country']} | Region: {row['region']} | Angle: {row['angle']}
Editorial note: {row['note']}
Existing meta description candidate: {docx_meta.get('meta_description', '(none)')}
Target query: {docx_meta.get('target_query', '(none)')}
Photos: {', '.join(photo_names[:6])}

Story text:
{body[:4000]}

Return JSON with exactly these keys:
- "place": the specific place the story happens (e.g. "La Digue", "Darvaza"), or null if none is clearly identifiable. Never just repeat the country.
- "subtitle": one sentence, max 90 chars, factual, in the story's voice. Use en-dash (–) never em-dash.
- "hero_alt": alt text for the hero photo, max 120 chars, descriptive, includes place and country.
- "meta_description": max 160 chars, improves on the candidate if one exists. En-dash only.
- "keywords": 4-6 lowercase search phrases.
- "months": array of months from {MONTHS} when this trip is doable, ONLY if the story or common knowledge makes it clear; else [].
- "trip_length": one of {TRIP_LENGTHS} or null if unclear.
- "difficulty": one of {DIFFICULTIES} or null if not applicable (e.g. essays/lists).
- "activity": array drawn ONLY from {ACTIVITIES}; [] if none apply.

Never invent facts not supported by the text. Prefer null/[] over guessing."""
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps({
            "model": CLAUDE_MODEL,
            "max_tokens": 900,
            "messages": [{"role": "user", "content": prompt}],
        }).encode(),
        headers={
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
            text = "".join(b.get("text", "") for b in data.get("content", []))
            jm = re.search(r"\{.*\}", text, re.S)
            return json.loads(jm.group(0)) if jm else {}
        except Exception as e:  # noqa: BLE001
            if attempt == 1:
                print(f"    ! claude meta failed: {e}")
                return {}
    return {}


def prettify(value):
    v = (value or "").strip()
    if not v:
        return v
    if re.fullmatch(r"[a-z0-9-]+", v):
        return " ".join(w.capitalize() for w in v.split("-"))
    return v


def build_meta(row, docx_meta, ai, story_id):
    slug = re.sub(r"^\d{4}_", "", story_id)
    year = re.match(r"^(\d{4})_", story_id)
    meta = {
        "id": story_id,
        "storyId": story_id,
        "slug": slug,
        "title": row["title"],
        "status": "published",
        "language": "en",
        "author": "Paulius Pikelis",
        "destination": prettify(row["country"]),
        "continent": REGION_CONTINENT.get(row["region"]),
        "place": ai.get("place"),
        "subtitle": ai.get("subtitle"),
        "heroAlt": ai.get("hero_alt"),
        "publishedDate": f"{year.group(1)}-01-01" if year else None,
        "date_approximate": bool(year),
        "months": ai.get("months") or [],
        "trip_length": ai.get("trip_length"),
        "difficulty": ai.get("difficulty"),
        "activity": ai.get("activity") or [],
        "seo": {
            "metaTitle": row["title"],
            "metaDescription": ai.get("meta_description") or docx_meta.get("meta_description"),
            "keywords": ai.get("keywords") or [],
        },
        "plan": {
            "region": row["region"],
            "angle": row["angle"],
            "guide_wave": row["guide_wave"],
            "links_to_guide": row["links_to_guide"],
            "series": row["series"] or None,
            "source": row["source"],
            "note": row["note"],
            "target_query": docx_meta.get("target_query"),
        },
    }
    return meta


def content_hash(folder, story_id):
    h = hashlib.md5()
    for name in [f"{story_id}_meta_en.yaml"]:
        p = folder / name
        if p.exists():
            h.update(p.read_bytes())
    gen = folder / "generated"
    if gen.exists():
        for p in sorted(gen.glob("*")):
            h.update(p.name.encode())
            h.update(str(p.stat().st_size).encode())
    return h.hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plan", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", action="append", default=[])
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    load_env_local()
    ffmpeg = find_ffmpeg()

    rows = [r for r in read_plan(args.plan) if r["status"].lower() == "to be published"]
    if args.only:
        rows = [r for r in rows if r["id"] in args.only]
    if args.limit:
        rows = rows[: args.limit]
    print(f"stories to publish: {len(rows)}  (dry-run={args.dry_run})")

    ledger = json.loads(LEDGER_PATH.read_text()) if LEDGER_PATH.exists() else {}
    published, failed = [], []
    review_rows = []

    for i, row in enumerate(rows, 1):
        sid = row["id"]
        print(f"\n[{i}/{len(rows)}] {sid}")
        folder = find_story_folder(sid)
        if not folder:
            print("    ! folder not found"); failed.append((sid, "folder not found")); continue

        docx_candidates = sorted(folder.glob("*story*.docx")) + sorted(folder.glob("*story*.md"))
        if not docx_candidates:
            print("    ! no story file"); failed.append((sid, "no story file")); continue

        try:
            src = docx_candidates[0]
            if src.suffix == ".docx":
                docx_meta, body = extract_docx(src, row["title"])
            else:
                docx_meta, body = {}, src.read_text(encoding="utf-8")
            if len(body) < 200:
                print(f"    ! story too short ({len(body)} chars)"); failed.append((sid, "story too short")); continue

            gen = folder / "generated"
            gen.mkdir(exist_ok=True)
            (gen / f"{sid}_story_en.md").write_text(body + "\n", encoding="utf-8")

            photos = convert_images(folder, sid)
            teaser = cut_teaser(folder, sid, ffmpeg)
            print(f"    media: {len(photos)} photos{', teaser' if teaser else ''}")

            meta_path = folder / f"{sid}_meta_en.yaml"
            if meta_path.exists():
                meta = yaml.safe_load(meta_path.read_text(encoding="utf-8"))
                print("    meta: existing file kept")
            else:
                ai = claude_meta(row, docx_meta, body, photos)
                meta = build_meta(row, docx_meta, ai, sid)
                meta_path.write_text(
                    yaml.safe_dump(meta, sort_keys=False, allow_unicode=True, width=100),
                    encoding="utf-8",
                )
                print(f"    meta: drafted (place={meta.get('place')}, trip_length={meta.get('trip_length')})")

            cmd = ["node", "--env-file=.env.local", "scripts/publish-to-sanity.mjs", str(folder)]
            if args.dry_run:
                cmd.append("--dry-run")
            r = subprocess.run(
                cmd, capture_output=True, text=True, cwd=REPO,
                encoding="utf-8", errors="replace",
            )
            ok = r.returncode == 0 and ("✓ Published" in r.stdout or "Dry run complete" in r.stdout)
            if not ok:
                tail = (r.stdout + r.stderr).strip().splitlines()[-8:]
                print("    ! publish failed:\n      " + "\n      ".join(tail))
                failed.append((sid, "publish failed"))
                continue

            print("    ✓ published" if not args.dry_run else "    ✓ dry-run ok")
            published.append(sid)
            review_rows.append({
                "id": sid,
                "title": row["title"],
                "place": meta.get("place"),
                "subtitle": meta.get("subtitle"),
                "meta_description": (meta.get("seo") or {}).get("metaDescription"),
                "months": ",".join(meta.get("months") or []),
                "trip_length": meta.get("trip_length"),
                "difficulty": meta.get("difficulty"),
                "activity": ",".join(meta.get("activity") or []),
                "url": f"https://testedroutes.com/inspire/{meta.get('slug')}",
            })
            if not args.dry_run:
                ledger[sid] = {
                    "slug": meta.get("slug"),
                    "publishedAt": datetime.now(timezone.utc).isoformat(),
                    "hash": content_hash(folder, sid),
                    "langs": ["en"],
                }
        except Exception as e:  # noqa: BLE001
            print(f"    ! error: {e}")
            failed.append((sid, str(e)))

    if not args.dry_run and published:
        LEDGER_PATH.write_text(json.dumps(ledger, indent=1), encoding="utf-8")

    if review_rows:
        REVIEW_DIR.mkdir(exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d-%H%M")
        rp = REVIEW_DIR / f"publish-review-{stamp}.csv"
        with rp.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=list(review_rows[0].keys()))
            w.writeheader()
            w.writerows(review_rows)
        print(f"\nreview sheet: {rp}")

    # masterfile write-back: only on real publishes
    if not args.dry_run and published:
        try:
            wb = openpyxl.load_workbook(args.plan)
            ws = wb["Inspire"]
            done = set(published)
            for r in ws.iter_rows(min_row=2):
                if r[2].value and str(r[2].value).strip() in done:
                    r[7].value = "Published"
            wb.save(args.plan)
            print(f"masterfile updated: {len(done)} rows -> Published")
        except PermissionError:
            alt = str(args.plan).replace(".xlsx", "_PUBLISHED-UPDATE.xlsx")
            wb.save(alt)
            print(f"! masterfile locked (open in Excel?) - wrote {alt} instead")

    print(f"\ndone: {len(published)} published, {len(failed)} failed")
    for sid, why in failed:
        print(f"  FAILED {sid}: {why}")


if __name__ == "__main__":
    main()

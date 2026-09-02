#!/usr/bin/env python3
"""One-time extraction: Fiji 14-day deck sources -> sku.yaml.

Reads the deck-builder content modules (fiji_days.py, fiji_content.py,
fiji_content_b.py) by importing them directly - they are plain dict literals
with no pptx imports - and writes the structured authoring file
content/countries/fiji/guides/fiji-honeymoon-14-days/sku.yaml.

Why the hand-written maps below exist: the deck modules key everything by
PowerPoint SHAPE ID, not by meaning. Which id is a heading, which is a body,
which triple forms one reservation row - that lives in the template and in
build_deck.py's wiring, not in the data. The maps were built by dumping every
id -> text pairing and reading it against the shipped deck (DECK-COPY-v4.md is
the page-by-page reference). If a future deck edit moves content to new shape
ids, this script's output will visibly lose that content - which is fine,
because this is a ONE-TIME migration tool: after the first successful run,
sku.yaml is the authoring truth and this script retires. It stays in the repo
as the record of how the migration was done (and as the starting point for the
other three Fiji SKUs, whose decks reuse the same template).

Day pages come from fiji_days.DAYS (build_deck.py iterates D.DAYS - the DAY*
dicts in fiji_content.py are an earlier generation and are ignored here).
Day photos are NOT recoverable from these modules: the day dicts carry only a
caption string; the caption -> image-file wiring lives in build_deck.py's photo
pass. photo_caption is extracted, photo_ref stays absent until photos are
attached to the reader deliberately.
"""

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
GUIDE_DIR = ROOT / "content" / "countries" / "fiji" / "guides" / "fiji-honeymoon-14-days"
BUILD_DIR = GUIDE_DIR / "build"
OUT = GUIDE_DIR / "sku.yaml"

sys.path.insert(0, str(BUILD_DIR))
import fiji_days as D  # noqa: E402
import fiji_content as C  # noqa: E402
import fiji_content_b as B  # noqa: E402

WARN = []


def first(d, key, default=None):
    v = d.get(key)
    if isinstance(v, list):
        return v[0] if v else default
    return v if v is not None else default


def all_of(d, key):
    v = d.get(key)
    if v is None:
        return []
    return list(v) if isinstance(v, list) else [v]


def joined(d, key, sep=" "):
    return sep.join(s for s in all_of(d, key) if s).strip() or None


# --- days -------------------------------------------------------------------

def parse_badge(badge):
    """["DAY","1"] -> ("DAY 1", 1, 1); ["DAYS","4-5"] -> ("DAYS 4-5", 4, 5)."""
    label = " ".join(badge)
    nums = badge[1]
    if "-" in nums:
        a, b = nums.split("-", 1)
        return label, int(a), int(b)
    return label, int(nums), int(nums)


def parse_slot(label, body):
    """"Day 4 · 08:00 · Title" / "10:00 · Title · with dots" -> parts.

    A slot title may itself contain " · " (e.g. "Night · the Hilton"), so only
    the leading day/time prefixes are peeled off; the rest joins back together.
    """
    parts = [p.strip() for p in label.split("·")]
    day_number = None
    time_label = None
    if parts and parts[0].lower().startswith("day ") and parts[0][4:].strip().isdigit():
        day_number = int(parts[0][4:].strip())
        parts = parts[1:]
    if parts and len(parts[0]) in (4, 5) and ":" in parts[0]:
        time_label = parts[0]
        parts = parts[1:]
    title = " · ".join(parts).strip()
    slot = {"title": title}
    if time_label:
        slot["time"] = time_label
    if day_number:
        slot["day"] = day_number
    if body:
        slot["body"] = body
    return slot


def extract_days():
    days = []
    for page_group, key in enumerate(sorted(D.DAYS), start=1):
        d = D.DAYS[key]
        badge, day_from, day_to = parse_badge(all_of(d, 33))
        rail = d.get("_rail") or []
        day = {
            "day_from": day_from,
            "day_to": day_to,
            "page_group": page_group,
            "title": first(d, 31),
            "subtitle": first(d, 32),
            "badge": badge,
            "photo_caption": first(d, 94),
        }
        if rail:
            day["rail_start"] = int(rail[0].split(":")[0])
            day["rail_end"] = int(rail[-1].split(":")[0])
        slots = []
        for a, b in D.SLOTS:
            label, body = first(d, a), first(d, b)
            if not label:
                WARN.append(f"day page {key}: slot id {a} empty")
                continue
            slots.append(parse_slot(label, body))
        day["slots"] = slots
        callouts = []
        for t, bo in D.CALLOUTS:
            title, body = first(d, t), all_of(d, bo)
            if not title:
                continue
            kind = "info"
            if title.startswith("⚠"):
                kind, title = "warning", title.lstrip("⚠").strip()
            callouts.append({"kind": kind, "title": title, "body": body})
        day["callouts"] = callouts
        days.append(day)
    return days


# --- picks ------------------------------------------------------------------

STAY_TIERS = ["budget", "mid", "splurge"]  # deck labels them Budget/Mid/Comfort


def extract_stays():
    picks, sections = [], []
    for page in (C.HOTELS1, C.HOTELS2):
        for heading, tier_labels, names, bodies in page["_blocks"]:
            for i in range(3):
                picks.append({
                    "block_heading": heading,
                    "tier": STAY_TIERS[i],
                    "tier_label": tier_labels[i],
                    "name": names[i],
                    "body": bodies[i],
                })
        sections.append({
            "title": first(page, 9),
            "intro": first(page, 10),
            "footnotes": [s for s in all_of(page, 22) if s] + all_of(page, 23),
        })
    return picks, sections


def extract_food():
    picks = []
    for blk in C.RESTAURANTS["_blocks"]:
        area = blk[1]
        tier_labels, names, bodies = blk[5], blk[6], blk[7]
        for i in range(len(names)):
            picks.append({
                "area": area,
                "tier_label": tier_labels[i],
                "name": names[i],
                "body": "\n".join(bodies[i]) if isinstance(bodies[i], list) else bodies[i],
            })
    section = {
        "title": first(C.RESTAURANTS, 8),
        "intro": first(C.RESTAURANTS, 9),
        "footnotes": [s for s in all_of(C.RESTAURANTS, 115) if s] + all_of(C.RESTAURANTS, 117),
    }
    return picks, section


# --- costs ------------------------------------------------------------------

COST_HEADLINE = [("lean", 33, 32, 17), ("core", 29, 28, 34), ("splurge", 30, 31, 6)]
# Matrix rows: (label id, lean id, core id, splurge id)
COST_MATRIX = [(42, 43, 44, 45), (46, 47, 48, 49), (50, 51, 52, 53), (54, 55, 56, 57),
               (58, 59, 60, 61), (62, 63, 64, 65), (66, 67, 68, 69), (70, 71, 72, 73)]


def extract_costs():
    items = []
    for tier, lid, pid, nid in COST_HEADLINE:
        items.append({
            "section": "headline",
            "tier": tier,
            "label": first(B.COSTS, lid),
            "price_label": first(B.COSTS, pid),
            "note": first(B.COSTS, nid),
        })
    for lid, lean, core, splurge in COST_MATRIX:
        label = first(B.COSTS, lid)
        if not label:
            WARN.append(f"COSTS: matrix label id {lid} empty")
            continue
        for tier, vid in (("lean", lean), ("core", core), ("splurge", splurge)):
            items.append({
                "section": "detail",
                "tier": tier,
                "label": label,
                "price_label": first(B.COSTS, vid),
            })
    section = {
        "title": first(B.COSTS, 12),
        "intro": first(B.COSTS, 13),
        "extra_costs": {"heading": first(B.COSTS, 15), "items": all_of(B.COSTS, 19)},
        "not_included": {"heading": first(B.COSTS, 22), "items": all_of(B.COSTS, 23)},
        "footnote": first(B.COSTS, 20),
        "detail_page": {
            "title": first(B.COSTS_DETAIL, 46),
            "intro": first(B.COSTS_DETAIL, 50),
            "beds_heading": first(B.COSTS_DETAIL, 9),
            "beds": [
                {"label": first(B.COSTS_DETAIL, a), "value": first(B.COSTS_DETAIL, b)}
                for a, b in ((10, 13), (19, 20), (21, 22), (23, 24), (33, 34))
            ],
            "activities_heading": first(B.COSTS_DETAIL, 27),
            "summary_heading": first(B.COSTS_DETAIL, 28),
            "footnote": first(B.COSTS_DETAIL, 12),
        },
    }
    return items, section


# --- reservations -----------------------------------------------------------

# (group heading id, criticality, [(label id, note id, lead id), ...])
RESERVATION_GROUPS = [
    (8, "must", [(14, 15, 11), (6, 19, 17), (22, 4, 36)]),
    (16, "should", [(73, 74, 58), (75, 76, 79), (77, 78, 80), (25, 27, 29)]),
    (18, "nice", [(5, 20, 24), (30, 32, 33)]),
]


def extract_reservations():
    rules = []
    for gid, crit, rows in RESERVATION_GROUPS:
        group = first(B.RESERVATIONS, gid)
        for lid, nid, leadid in rows:
            label = joined(B.RESERVATIONS, lid)
            if not label:
                WARN.append(f"RESERVATIONS: label id {lid} empty")
                continue
            rules.append({
                "group": group,
                "criticality": crit,
                "label": label,
                "note": joined(B.RESERVATIONS, nid, sep=" · "),
                "lead_time_label": first(B.RESERVATIONS, leadid),
            })
    return rules


# --- pack, activities -------------------------------------------------------

PACK_GROUPS = [(6, 12), (20, 21), (22, 23)]


def extract_pack():
    items = []
    for gid, iid in PACK_GROUPS:
        group = first(B.PACK, gid)
        for label in all_of(B.PACK, iid):
            items.append({"group": group, "label": label})
    return items


def extract_activities():
    return [{"name": name, "price_label": price} for name, price in B.ACTIVITY_ROWS]


# --- narrative sections ------------------------------------------------------

def grouped(dic, title_id, intro_id, groups):
    """Generic {title, intro, groups: [{heading, items: [{label, body}...]}]}."""
    out = {"title": first(dic, title_id), "intro": first(dic, intro_id), "groups": []}
    for heading_id, pairs in groups:
        g = {"heading": first(dic, heading_id), "items": []}
        for lab, bod in pairs:
            if bod is None:
                for s in all_of(dic, lab):
                    g["items"].append({"body": s})
            else:
                g["items"].append({
                    "label": joined(dic, lab),
                    "body": joined(dic, bod, sep=" · "),
                })
        out["groups"].append(g)
    return out


def extract_sections(stay_secs, food_sec, cost_sec):
    s = []

    snap = C.SNAPSHOT
    s.append({"type": "snapshot", "payload": {
        "title": first(snap, 38), "intro": first(snap, 8), "body": first(snap, 17),
        "facts": [
            {"label": all_of(snap, 18)[i], "value": first(snap, 19 + i)}
            for i in range(len(all_of(snap, 18)))
        ],
    }})

    s.append({"type": "route_overview", "payload": {
        "title": first(C.ROUTE, 7), "intro": first(C.ROUTE, 8),
        "map_title": first(C.ROUTE, 50), "map_strapline": first(C.ROUTE, 87),
        "blocks_heading": first(C.ROUTE, 6), "blocks": all_of(C.ROUTE, 13),
    }})

    s.append({"type": "islands", "payload": grouped(
        C.ISLANDS, 39, 41, [(3, [(7, None)]), (35, [(37, None)])])})
    s.append({"type": "getting_around", "payload": grouped(
        C.GETTING, 39, 41, [(3, [(7, None)]), (35, [(37, None)])])})

    when = C.WHEN
    s.append({"type": "when_to_go", "payload": {
        "title": first(when, 46), "intro": first(when, 50),
        "items": [
            {"heading": first(when, h), "subtitle": all_of(when, b)[0] if all_of(when, b) else None,
             "body": all_of(when, b)[1] if len(all_of(when, b)) > 1 else None}
            for h, b in ((52, 53), (55, 56), (58, 59), (61, 62), (64, 65), (67, 68))
        ],
    }})

    for hl in (C.HL13, C.HL45, C.HL67, C.HL89, C.HL1113):
        s.append({"type": "highlights", "payload": {
            "title": first(hl, C.HL_TITLE), "subtitle": first(hl, C.HL_SUB),
            "badge": " ".join(all_of(hl, C.HL_BADGE)),
            "tiles": [{"name": n, "body": b} for n, b in hl["_tiles"]],
        }})

    for sec in stay_secs:
        s.append({"type": "stays", "payload": sec})
    s.append({"type": "food", "payload": food_sec})
    s.append({"type": "costs", "payload": cost_sec})

    s.append({"type": "pack", "payload": {
        "title": first(B.PACK, 7), "intro": first(B.PACK, 8)}})

    s.append({"type": "paperwork", "payload": grouped(B.PAPERWORK, 7, 8, [
        (6, [(12, None)]), (20, [(21, None)]), (22, [(23, None)]),
        (24, [(25, None)]), (26, [(29, None)]), (27, [(28, None)]),
        (950, [(951, None)]),
    ])})

    ess = B.ESSENTIALS
    s.append({"type": "essentials", "payload": {
        "title": first(ess, 9), "intro": first(ess, 10),
        "items": [
            {"label": joined(ess, lab), "body": first(ess, bod), "timing": first(ess, tim)}
            for lab, bod, tim in ((73, 74, 58), (75, 6, 8), (77, 78, 80), (3, 5, 18))
        ],
    }})

    gtk = B.GOODTOKNOW
    s.append({"type": "good_to_know", "payload": grouped(gtk, 46, 50, [
        (9, [(10, 13), (19, 20), (21, 22), (33, 34), (35, 36)]),
        (27, [(23, 24), (25, 26)]),
        (28, [(42, None)]),
        (29, [(43, None)]),
    ]) | {"footer": first(gtk, 12)}})

    bey = B.BEYOND
    s.append({"type": "beyond", "payload": grouped(bey, 46, 50, [
        (9, [(10, 13), (19, 20), (21, 22)]),
        (27, [(23, 24), (25, 26)]),
        (28, [(33, 34), (35, 36), (37, 38)]),
    ]) | {"note": first(bey, 42), "footer": first(bey, 12)}})

    s.append({"type": "legal", "payload": {"credit": first(B.LEGAL, 18)}})

    for i, sec in enumerate(s):
        sec["sort"] = i
    return s


def main():
    if OUT.exists():
        sys.exit(f"{OUT.relative_to(ROOT)} already exists - this is a one-time "
                 f"migration tool and sku.yaml is now the authoring truth. "
                 f"Delete the file first if you really mean to re-extract.")

    days = extract_days()
    covered = set()
    for d in days:
        covered.update(range(d["day_from"], d["day_to"] + 1))
    expected = set(range(1, 15))
    if not expected <= covered:
        sys.exit(f"day coverage {sorted(covered)} does not include 1..14")
    if covered - expected - {15}:
        sys.exit(f"unexpected days beyond 1..15: {sorted(covered - expected)}")

    stay_picks, stay_secs = extract_stays()
    food_picks, food_sec = extract_food()
    cost_items, cost_sec = extract_costs()

    doc = {
        "slug": "fiji-honeymoon-14-days",
        "country": "fj",
        "sku_code": "fiji-14d",
        "structure_type": "week_guide",
        "duration_days": 14,
        # Arrival day: real content, none of the trip's signature moves
        # (guide.js sample rule). Founder can repoint.
        "sample_day": 1,
        "title": "Fiji: 14-Day Honeymoon",
        "subtitle": first(C.COVER, 4),
        "days": days,
        "stay_picks": stay_picks,
        "food_picks": food_picks,
        "cost_items": cost_items,
        "reservation_rules": extract_reservations(),
        "pack_items": extract_pack(),
        "activity_rows": extract_activities(),
        "sections": extract_sections(stay_secs, food_sec, cost_sec),
    }

    for w in WARN:
        print(f"  warn: {w}")
    header = ("# Extracted from the deck build modules by scripts/extract_fiji_deck.py\n"
              "# (one-time migration, 2026-08-30). This file is now the authoring truth\n"
              "# for the structured guide content: edit it and run `npm run publish:sku`.\n"
              "# Git is its history.\n")
    OUT.write_text(
        header + yaml.safe_dump(doc, sort_keys=False, allow_unicode=True, width=100),
        encoding="utf-8", newline="\n")
    n_slots = sum(len(d["slots"]) for d in days)
    print(f"wrote {OUT.relative_to(ROOT)}: {len(days)} day pages, {n_slots} slots, "
          f"{len(stay_picks)} stays, {len(food_picks)} food, {len(cost_items)} cost rows, "
          f"{len(doc['reservation_rules'])} reservations, {len(doc['pack_items'])} pack, "
          f"{len(doc['activity_rows'])} activities, {len(doc['sections'])} sections")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""sync_map_links.py - register guide companion-map redirects in Sanity.

sync_go_links.py cannot make these. It builds one affiliateLink per country-master
row, and a companion map is not a pin, so it has no row by design. Without this
the map slugs would live only in the CURATED dict in app/go/[slug]/route.js -
and a slug living only in code cannot be re-pointed from Studio and dies if that
edit is ever reverted. Sanity resolves first, so these docs are what actually
answers a scan.

Map slugs are guide-scoped AND language-scoped:

    {country}-{route}-{duration}-map-{lang}

Register the full language set the moment the first deck in that guide is
printed, even though the translated maps do not exist yet - every language
aliases the English map until a translated one is made. A deck ships long before
its translated map, and a slug shared across languages could only be undone by
reprinting the PDF. Re-point an individual language in Studio later; nothing
here needs re-running for that.

Adding a guide: append one MAPS entry. Slugs are derived, so a typo in one
language is not possible.

  python scripts/sync_map_links.py                 # dry run
  python scripts/sync_map_links.py --live
  python scripts/sync_map_links.py --live --prefix iceland-reykjanes-1d

Env (.env.local): NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
                  SANITY_API_WRITE_TOKEN
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

API_VERSION = "2026-04-24"

# Languages the site ships (app/_lib/i18n.js). Registering all of them up front
# is the whole point - see the module docstring.
LANGS = ["en", "lt", "de", "fr", "es"]

# (slug prefix, editor-facing label, Google My Maps mid)
#
# Only the mid is stored, never the /edit URL the founder supplies: an edit link
# in a printed QR hands every reader write access to the master map.
MAPS = [
    ("iceland-7d-map", "Iceland 7-day Ring Road companion map",
     "1By0oiIG4vTBy-5NorrCBvuyhXXbfAjg"),
    ("iceland-south-coast-5d-map", "Iceland 5-day South Coast companion map",
     "1LHV8hb50hJQFCObsvZKKpwG6vPrXwsU"),
    ("iceland-reykjanes-1d-map", "Iceland Reykjanes 1-day layover companion map",
     "1gOs0-oEKpjFWfWEgh6g2Vb1cWwLIfV0"),
]

VIEWER = "https://www.google.com/maps/d/viewer?mid=%s"
NOTE = ("Companion Google My Map, guide- and language-scoped "
        "({country}-{route}-{duration}-map-{lang}). Languages without a "
        "translated map alias the English one; re-point this doc when a "
        "translated map exists. Managed by scripts/sync_map_links.py - a map has "
        "no country-master row, so sync_go_links cannot manage it.")


def load_env(path=".env.local"):
    if not os.path.exists(path):
        sys.exit(f"{path} not found - run from the repo root")
    for line in open(path, encoding="utf-8"):
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if m:
            os.environ.setdefault(m.group(1), m.group(2).strip().strip('"'))


def sanity(path, token, project, method="GET", body=None):
    url = f"https://{project}.api.sanity.io/v{API_VERSION}/{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"Authorization": f"Bearer {token}",
                 "Content-Type": "application/json",
                 "User-Agent": "TestedRoutes-sync-map-links/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true")
    ap.add_argument("--prefix", help="only this map prefix (default: all)")
    a = ap.parse_args()

    load_env()
    project = os.environ.get("NEXT_PUBLIC_SANITY_PROJECT_ID")
    dataset = os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production")
    token = os.environ.get("SANITY_API_WRITE_TOKEN")
    if not project or not token:
        sys.exit("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required")

    maps = [m for m in MAPS if not a.prefix or m[0] == a.prefix]
    if not maps:
        sys.exit("no map matches --prefix %s (known: %s)"
                 % (a.prefix, ", ".join(m[0] for m in MAPS)))

    planned = [("%s-%s" % (prefix, lang), "%s (%s)" % (label, lang.upper()),
                VIEWER % mid)
               for prefix, label, mid in maps for lang in LANGS]

    existing = sanity(
        f"data/query/{dataset}?query=" + urllib.parse.quote(
            '*[_type=="affiliateLink"]{_id,"slug":slug.current,url}'),
        token, project)["result"]
    by_slug = {e["slug"]: e for e in existing if e.get("slug")}

    creates, updates, unchanged = [], [], 0
    for slug, label, url in planned:
        cur = by_slug.get(slug)
        if not cur:
            creates.append((slug, label, url))
        elif (cur.get("url") or "") != url:
            updates.append((slug, label, url, cur))
        else:
            unchanged += 1

    print("\nsync_map_links  •  %s\n" % ("LIVE" if a.live else "DRY RUN"))
    for slug, label, url in creates:
        print("  + create  %-34s -> %s" % (slug, url))
    for slug, label, url, cur in updates:
        print("  ~ update  %-34s %s -> %s" % (slug, (cur.get("url") or "")[:30], url))
    if unchanged:
        print("  = %d already correct" % unchanged)

    if not a.live:
        print("\nDry run - nothing written. Re-run with --live to apply.")
        return

    muts = []
    for slug, label, url in creates:
        muts.append({"create": {
            "_type": "affiliateLink", "label": label,
            "slug": {"_type": "slug", "current": slug},
            "scope": "guide", "category": "tickets",
            "url": url, "program": "other", "notes": NOTE,
        }})
    for slug, label, url, cur in updates:
        muts.append({"patch": {"id": cur["_id"],
                               "set": {"url": url, "label": label, "notes": NOTE}}})
    if not muts:
        print("\nNothing to write.")
        return
    res = sanity(f"data/mutate/{dataset}", token, project, method="POST",
                 body={"mutations": muts})
    print("\nWrote %d document(s)." % len(res.get("results", [])))


if __name__ == "__main__":
    main()

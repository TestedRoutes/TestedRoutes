#!/usr/bin/env python3
"""Retire the superseded Iceland affiliateLink docs.

NOT run as part of the QR reprint job, on purpose. Deleting these is
irreversible, and until the route.js CURATED change is deployed they are the only
thing keeping a pre-reprint PDF's map and Drangar/Black Crust QRs resolving. Run
this after that deploy is live.

Three groups, in increasing order of caution:

  superseded   PinID renames whose new slug is now printed and swept clean. The
               reprinted PDFs no longer reference these at all.
  never-printed  slugs no deck has ever printed (the -hotels pair and the
               base-* set superseded by PinID renames).
  safety-net   the bare map slugs and unsuffixed venue slugs that the
               PREVIOUS PDFs print. Only safe once no pre-reprint PDF is in
               circulation. Requires --include-safety-net.

  python retire_stale_links.py                            # dry run
  python retire_stale_links.py --live
  python retire_stale_links.py --live --include-safety-net
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

SUPERSEDED = [
    "iceland-messinn-farewell-dinner",
    "iceland-grillmarkadurinn-the-blowout",
    "iceland-sudur-vik-dinner",
    "iceland-glacier-walk-skaftafell-tour-base",
    "iceland-akureyri-lunch-greifinn",
]
NEVER_PRINTED = [
    "iceland-7d-hotels",
    "iceland-south-coast-5d-hotels",
    "iceland-base-reykjavik",
    "iceland-base-vik",
    "iceland-base-egilsstadir",
    "iceland-base-myvatn-reykjahlid",
    "iceland-base-skaftafell-freysnes",
    "iceland-base-varmaland",
    "iceland-sky-lagoon-plan-b",
]
SAFETY_NET = [
    "iceland-7d-map",
    "iceland-south-coast-5d-map",
    "iceland-drangar",
    "iceland-black-crust",
]


def load_env(path=".env.local"):
    for line in open(path, encoding="utf-8"):
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if m:
            os.environ.setdefault(m.group(1), m.group(2).strip().strip('"'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true")
    ap.add_argument("--include-safety-net", action="store_true")
    a = ap.parse_args()

    load_env()
    project = os.environ["NEXT_PUBLIC_SANITY_PROJECT_ID"]
    dataset = os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production")
    token = os.environ["SANITY_API_WRITE_TOKEN"]

    groups = [("superseded", SUPERSEDED), ("never-printed", NEVER_PRINTED)]
    if a.include_safety_net:
        groups.append(("safety-net", SAFETY_NET))

    want = [s for _, g in groups for s in g]
    lst = ",".join('"%s"' % s for s in want)
    url = (f"https://{project}.api.sanity.io/v{API_VERSION}/data/query/{dataset}?query="
           + urllib.parse.quote('*[_type=="affiliateLink" && slug.current in [%s]]'
                                '{_id,"slug":slug.current}' % lst))
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    found = json.loads(urllib.request.urlopen(req, timeout=60).read())["result"]
    by_slug = {f["slug"]: f["_id"] for f in found}

    print("\nretire_stale_links  •  %s\n" % ("LIVE" if a.live else "DRY RUN"))
    ids = []
    for name, g in groups:
        print("  %s:" % name)
        for s in g:
            if s in by_slug:
                print("    - delete  %-46s %s" % (s, by_slug[s]))
                ids.append(by_slug[s])
            else:
                print("    = absent  %s" % s)
    if not a.include_safety_net:
        print("\n  safety-net group SKIPPED (%d docs) - pass --include-safety-net once the"
              % len(SAFETY_NET))
        print("  route.js CURATED deploy is live and no pre-reprint PDF is in circulation.")

    if not a.live:
        print("\nDry run - nothing deleted.")
        return
    if not ids:
        print("\nNothing to delete.")
        return

    body = {"mutations": [{"delete": {"id": i}} for i in ids]}
    mu = urllib.request.Request(
        f"https://{project}.api.sanity.io/v{API_VERSION}/data/mutate/{dataset}",
        data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(mu, timeout=120).read())
    print("\nDeleted %d document(s)." % len(res.get("results", [])))


if __name__ == "__main__":
    main()

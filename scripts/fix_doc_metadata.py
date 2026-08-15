#!/usr/bin/env python3
"""Set the document properties on every guide deck and every guide PDF.

Why this exists
---------------
The whole guide library descends, by cloning, from one PowerPoint file that a
designer built for us. Cloning carries the *file's* document properties along
with the slides, so every deck and every PDF exported from one shipped with:

    Title    PowerPoint Presentation
    Author   Kristina Pavlovaite
    Subject  (empty)
    Keywords (empty)

Those four fields are not cosmetic. The PDF is the product: the buyer sees
Title and Author in their browser tab, in the Acrobat/Preview title bar, in
macOS Finder's info panel, and in the file's Windows properties. Search engines
and LLM crawlers read /Title and /Keywords off a PDF too, which matters for the
discoverability plan. So a paid TestedRoutes guide was introducing itself as an
untitled PowerPoint written by someone who does not work here.

This script rewrites those four fields to, per guide:

    Title    the SKU title
    Author   TestedRoutes
    Subject  the customer-facing subtitle
    Keywords that guide's search terms

Where the strings come from
---------------------------
Sanity, not a copy of Sanity. Each published guide's story doc already holds
`title`, `subtitle` and `keywords` - the exact strings the sales page renders -
so the script queries them at run time and a later edit in the Studio flows
through on the next run. Only guides with no story doc yet (see LOCAL_SKUS
below) carry their strings here, each with its source noted.

Two deliberate transforms are applied on the way in:

  * Subject drops the spaced dash. Sanity subtitles are written for the web,
    where "mistakes - and a real budget" is fine; the deck rule since
    2026-07-28 is that a spaced dash is never punctuation inside a guide, so
    the dash becomes a comma. This reproduces, character for character, the
    Subject already sitting on the three Iceland decks that were fixed by hand
    - which is how we know it is the intended house form.

  * Keywords join with ", ". Sanity stores them as an array; both OOXML
    cp:keywords and the PDF /Keywords entry are single strings.

What it does NOT touch: the PDF's /Producer and /Creator (those name the
exporting application, which is true and useful), the deck's revision count,
and the created/modified timestamps. `cp:lastModifiedBy` DOES get set to
TestedRoutes - it is the same personal-name leak as Author, one field over, and
it shows in Windows' properties panel next to it.

Durability
----------
Fixing the .pptx is the half that lasts. PowerPoint's "Export to PDF" copies
Title, Author, Subject and Keywords out of the deck's core properties into the
PDF's Info dictionary, so once a deck is right, every future re-export of it is
right for free. The master template in "TR - Documents/4. Guides" is fixed for
the same reason one step earlier: it is the file every future guide is cloned
from, so cleaning it stops the defaults being reintroduced.

The PDFs already sitting on disk still have to be patched directly, because
they were exported before their deck was fixed.

What this does NOT reach: the copy buyers download
--------------------------------------------------
This script fixes files on disk. A buyer never receives one. The chain is

    local PDF -> Sanity guide.pdf asset -> Polar downloadables benefit -> buyer

so the shipped copy only changes when the fixed PDF is re-uploaded to Sanity
and `npm run sync:polar` pushes it onto the benefit (that script already
compares the live PDF's SHA-256 against the stored file and replaces it when
they differ - so it is one command, not a rebuild).

Checked 2026-08-14: all 12 published guides were still serving
"PowerPoint Presentation / Kristina Pavlovaite" to buyers, and the local PDFs
were verified page-for-page identical to the shipped ones - i.e. a re-upload
would have changed metadata only. The founder's call was to leave the shipped
copies alone for now and let the correction ride along the next time each
guide's PDF is re-uploaded for an unrelated revision. So: whenever you re-upload
a guide PDF, run this script over it first, and the fix propagates for free.

Reversibility
-------------
Every previous value is written to scripts/doc-metadata-backup.json before
anything is modified, and `--restore` puts them all back. The guide binaries
are gitignored (content/countries/** in .gitignore), so that file is the only
undo there is - do not delete it.

Usage
-----
    python scripts/fix_doc_metadata.py --dry-run
    python scripts/fix_doc_metadata.py
    python scripts/fix_doc_metadata.py --only tuvalu
    python scripts/fix_doc_metadata.py --restore

Needs SANITY_API_WRITE_TOKEN (read is enough, but that is the token we have) in
.env.local, which the script reads itself - so it runs as plain `python`, not
`node --env-file`. Local-only, like every other content script here.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import tempfile
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

REPO = Path(__file__).resolve().parent.parent

# The three trees the library actually lives in: the per-guide content packages
# in the repo, the founder's flat folder of shippable exports, and the master
# template that new guides are cloned from.
ROOTS = [
    REPO / "content" / "countries",
    Path(r"C:\Users\pauli\Desktop\TR - Guides"),
    Path(r"C:\Users\pauli\Desktop\TR - Documents\4. Guides"),
]

BACKUP = REPO / "scripts" / "doc-metadata-backup.json"

AUTHOR = "TestedRoutes"

# ---------------------------------------------------------------------------
# Guides with no story doc in Sanity yet. Everything else is fetched live.
# ---------------------------------------------------------------------------

LOCAL_SKUS = {
    # Built, not yet published. Title and subtitle verbatim from the Content
    # Plan v54 Guides sheet; keywords written here because the Content Plan has
    # no keywords column and there is no story doc to carry them yet. When the
    # guide is published, delete this entry - the Sanity fetch takes over.
    "iceland-layover-reykjavik-blue-lagoon": {
        "title": "Iceland Layover: Reykjavik and Blue Lagoon in 1 Day",
        "subtitle": "Lava fields, a lagoon and the city - sized to the hours you actually have.",
        "keywords": [
            "Iceland", "layover", "stopover", "Keflavik", "Reykjavik",
            "Blue Lagoon", "Reykjanes", "24 hours", "itinerary", "self-drive",
        ],
    },
    # Built 2026-08-13, publish blocked on go-links and fee verification. Title
    # and subtitle verbatim from meta.yaml, which took them from the Content
    # Plan. Keywords drawn from the guide's own verified fact base (meta.yaml
    # reservations + research/) - Mubarakiya, the dhow harbour, Failaka, the
    # towers - never from memory.
    "kuwait-2-days": {
        "title": "Kuwait in 2 Days: A Weekend Itinerary",
        "subtitle": "The underrated Gulf city - the old souk, the dhow harbour and the towers on day one, a Bronze-Age island on day two.",
        "keywords": [
            "Kuwait itinerary", "Kuwait City", "2 days in Kuwait",
            "Souk Al-Mubarakiya", "Kuwait Towers", "Failaka Island",
            "Grand Mosque Kuwait", "Kuwait weekend break",
            "things to do in Kuwait", "Kuwait travel guide",
        ],
    },
    # Lithuanian translation of the Ring Road deck, not published. The strings
    # already on the deck were typed without Lithuanian diacritics ("7 dienu
    # kelione aplink sala"); corrected here, since this is a customer-facing
    # field in the reader's own language.
    "iceland-ring-road-7-days-lt": {
        "title": "Islandija: 7 dienų kelionė aplink salą",
        "subtitle": "Visas ratas be klaidų, su tikru biudžetu.",
        "keywords": [
            "Islandija", "Ring Road", "kelionė", "maršrutas", "7 dienos",
            "Islandijos žiedas", "kelionė automobiliu",
        ],
    },
    # Not a SKU - the file every new guide is cloned from. It gets a neutral
    # on-brand Title precisely because that Title is what an author inherits
    # and might forget to change: "TestedRoutes Guide" is a harmless default in
    # a way that "PowerPoint Presentation" is not. Subject and Keywords stay
    # empty so nothing false is inherited.
    "_master-template": {
        "title": "TestedRoutes Guide",
        "subtitle": "",
        "keywords": [],
    },
}

# ---------------------------------------------------------------------------
# Which file belongs to which guide.
#
# Matched by path fragment against the file's path, longest fragment first, so
# the "_LT" decks win over the folder they sit in. Working copies (v1, v2, v3,
# "- Copy", the hiddenQR build) map to their SKU too: they are the same deck,
# and leaving a stale author on the file someone re-exports from is how this
# problem comes back.
# ---------------------------------------------------------------------------

FILE_MAP = [
    # Iceland
    ("iceland-ring-road-7-days\\testedroutes_iceland_guide_7_days_ring_road_lt", "iceland-ring-road-7-days-lt"),
    ("tr - guides\\testedroutes_iceland_guide_7_days_ring_road", "iceland-ring-road-7-days"),
    ("iceland-ring-road-7-days", "iceland-ring-road-7-days"),
    ("iceland-south-coast-5-days", "iceland-south-coast-5-days"),
    ("guides\\testedroutes_iceland_guide_5_days_south_coast - copy", "iceland-south-coast-5-days"),
    ("tr - guides\\testedroutes_iceland_guide_5_days_south_coast", "iceland-south-coast-5-days"),
    ("iceland-layover-reykjavik-blue-lagoon", "iceland-layover-reykjavik-blue-lagoon"),
    ("tr - guides\\testedroutes_iceland_guide_1_day_reykjavik_blue_lagoon", "iceland-layover-reykjavik-blue-lagoon"),
    # Kuwait
    ("kuwait-2-days", "kuwait-2-days"),
    # Seychelles
    ("seychelles-7-days", "seychelles-1-week"),
    # Switzerland - Alpine Passes Trail, plus the Trift day trip
    ("apt-1-2-st-moritz-to-alp-flix", "st-moritz-to-alp-flix"),
    ("apt-3-4-alp-flix-to-ausserferrera", "alp-flix-to-ausserferrera"),
    ("apt-5-6-ausserferrera-to-turra", "ausserferrera-to-turra"),
    ("apt-18-19-simplon-pass-to-saas-fee", "simplon-pass-to-saas-fee"),
    ("apt-20-21-saas-fee-to-gruben", "saas-fee-to-gruben"),
    ("apt-22-23-gruben-to-grimentz", "gruben-to-grimentz"),
    ("apt-24-25-grimentz-to-evolene", "grimentz-to-evolene"),
    ("trift-bridge-from-zurich", "triftbrucke-from-zurich"),
    # Samoa (the 5-day sibling folder stays unmatched until its SKU exists)
    ("samoa-upolu-savaii-7-days", "samoa-upolu-savaii-7-days"),
    # Tuvalu
    ("tuvalu-2-days", "tuvalu-2-days"),
    ("tr - guides\\testedroutes_tuvalu_guide_2_days", "tuvalu-2-days"),
    # The master template
    ("testedroutes-guide-master-file", "_master-template"),
]

# ---------------------------------------------------------------------------
# Sanity
# ---------------------------------------------------------------------------

GROQ = """*[_type == "story" && guide.hasGuide == true && !(_id in path("drafts.**"))]{
  "slug": slug.current, title, subtitle, keywords
}"""


def read_env(path: Path) -> dict:
    env = {}
    if not path.exists():
        return env
    # Read as UTF-8 and never write this file back - see the mojibake rule.
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def fetch_sanity_skus() -> dict:
    env = read_env(REPO / ".env.local")
    project = env.get("NEXT_PUBLIC_SANITY_PROJECT_ID") or os.environ.get("NEXT_PUBLIC_SANITY_PROJECT_ID")
    dataset = env.get("NEXT_PUBLIC_SANITY_DATASET") or os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production")
    token = env.get("SANITY_API_WRITE_TOKEN") or os.environ.get("SANITY_API_WRITE_TOKEN")
    if not (project and token):
        sys.exit("Missing Sanity credentials - this script only runs locally, with .env.local present.")

    url = (
        f"https://{project}.api.sanity.io/v2024-01-01/data/query/{dataset}"
        f"?query={urllib.parse.quote(GROQ)}"
    )
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.load(resp)

    skus = {}
    for row in payload.get("result", []):
        slug = row.get("slug")
        if not slug:
            continue
        skus[slug] = {
            "title": row.get("title") or "",
            "subtitle": row.get("subtitle") or "",
            "keywords": row.get("keywords") or [],
        }
    return skus


# ---------------------------------------------------------------------------
# The two transforms
# ---------------------------------------------------------------------------


def deck_subject(subtitle: str) -> str:
    """Web subtitle -> deck Subject.

    A dash with spaces either side is punctuation on the website and banned
    inside a guide, so it becomes a comma. Hyphens inside words ("Saas-Fee",
    "self-drive", "7-Day") have no spaces and are untouched.
    """
    out = subtitle
    for dash in (" - ", " \u2013 ", " \u2014 "):
        out = out.replace(dash, ", ")
    return out.strip()


def join_keywords(keywords) -> str:
    return ", ".join(k.strip() for k in keywords if k and k.strip())


# ---------------------------------------------------------------------------
# PPTX
# ---------------------------------------------------------------------------

CORE_NS = {
    "cp": "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "dcmitype": "http://purl.org/dc/dcmitype/",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
}

import xml.etree.ElementTree as ET  # noqa: E402  (after the namespace table, for readability)


def _q(prefix: str, tag: str) -> str:
    return "{%s}%s" % (CORE_NS[prefix], tag)


def read_pptx_props(path: Path) -> dict:
    with zipfile.ZipFile(path) as z:
        if "docProps/core.xml" not in z.namelist():
            return {}
        root = ET.fromstring(z.read("docProps/core.xml"))
    out = {}
    for key, prefix, tag in (
        ("title", "dc", "title"), ("creator", "dc", "creator"),
        ("subject", "dc", "subject"), ("keywords", "cp", "keywords"),
        ("lastModifiedBy", "cp", "lastModifiedBy"),
    ):
        el = root.find(_q(prefix, tag))
        out[key] = (el.text or "") if el is not None else ""
    return out


def build_core_xml(original: bytes, props: dict) -> bytes:
    """Rewrite core.xml, keeping every element we do not own.

    `props` holds the four final strings plus the author - already transformed
    by the caller, so that --restore can push the old values straight back
    without deck_subject() rewriting them a second time.

    The elements are emitted in the order the OOXML schema declares them.
    PowerPoint tolerates any order - the hand-fixed Iceland decks have
    dc:subject last - but a strict validator does not, and writing them in
    order costs nothing.
    """
    root = ET.fromstring(original)
    existing = {}
    for child in root:
        existing[child.tag] = child

    new_values = {
        _q("dc", "title"): props["title"],
        _q("dc", "subject"): props["subject"],
        _q("dc", "creator"): props["creator"],
        _q("cp", "keywords"): props["keywords"],
        _q("cp", "lastModifiedBy"): props["lastModifiedBy"],
    }

    order = [
        ("dc", "title"), ("dc", "subject"), ("dc", "creator"),
        ("cp", "keywords"), ("dc", "description"), ("cp", "lastModifiedBy"),
        ("cp", "revision"), ("dcterms", "created"), ("dcterms", "modified"),
        ("cp", "category"), ("cp", "contentStatus"),
    ]

    parts = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n'
        '<cp:coreProperties '
        + " ".join(f'xmlns:{p}="{u}"' for p, u in CORE_NS.items())
        + ">"
    ]

    emitted = set()
    for prefix, tag in order:
        qname = _q(prefix, tag)
        if qname in new_values:
            text = new_values[qname]
            attrs = ""
        elif qname in existing:
            el = existing[qname]
            text = el.text or ""
            attrs = "".join(
                ' %s="%s"' % (_shorten(k), xml_escape(v)) for k, v in el.attrib.items()
            )
        else:
            continue
        emitted.add(qname)
        parts.append(f"<{prefix}:{tag}{attrs}>{xml_escape(text)}</{prefix}:{tag}>")

    # Anything unexpected that was already in the file is preserved verbatim
    # rather than silently dropped.
    for qname, el in existing.items():
        if qname in emitted:
            continue
        parts.append(ET.tostring(el, encoding="unicode"))

    parts.append("</cp:coreProperties>")
    return "".join(parts).encode("utf-8")


def _shorten(qname: str) -> str:
    """{ns}local -> prefix:local, for the handful of attributes core.xml uses."""
    if not qname.startswith("{"):
        return qname
    uri, local = qname[1:].split("}", 1)
    for prefix, u in CORE_NS.items():
        if u == uri:
            return f"{prefix}:{local}"
    return local


def write_pptx_props(path: Path, props: dict) -> None:
    """Repack the deck with a new core.xml.

    A .pptx is a zip, and only one small part changes, but zip entries cannot
    be edited in place - so every entry is copied across to a new archive with
    its original compression setting and timestamp, and the result replaces the
    original only after it opens cleanly and every part is accounted for. A
    failure part-way leaves the original untouched.
    """
    tmp_fd, tmp_name = tempfile.mkstemp(suffix=".pptx", dir=str(path.parent))
    os.close(tmp_fd)
    tmp = Path(tmp_name)
    try:
        with zipfile.ZipFile(path) as src:
            names = src.namelist()
            with zipfile.ZipFile(tmp, "w") as dst:
                for info in src.infolist():
                    data = src.read(info.filename)
                    if info.filename == "docProps/core.xml":
                        data = build_core_xml(data, props)
                    # Same compression as the original entry: media inside a
                    # deck is usually stored, and re-deflating it would bloat
                    # both the file and the runtime for no gain.
                    out = zipfile.ZipInfo(info.filename, date_time=info.date_time)
                    out.compress_type = info.compress_type
                    out.external_attr = info.external_attr
                    out.internal_attr = info.internal_attr
                    out.create_system = info.create_system
                    dst.writestr(out, data)

        with zipfile.ZipFile(tmp) as check:
            if check.testzip() is not None:
                raise RuntimeError("repacked archive failed its CRC check")
            if set(check.namelist()) != set(names):
                raise RuntimeError("repacked archive lost or gained a part")
            ET.fromstring(check.read("docProps/core.xml"))

        shutil.move(str(tmp), str(path))
    finally:
        if tmp.exists():
            tmp.unlink()


# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------

XMP_TEMPLATE = """<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">{title}</rdf:li></rdf:Alt></dc:title>
   <dc:creator><rdf:Seq><rdf:li>{author}</rdf:li></rdf:Seq></dc:creator>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">{subject}</rdf:li></rdf:Alt></dc:description>
   <pdf:Keywords>{keywords}</pdf:Keywords>
   <xmp:CreatorTool>{creator_tool}</xmp:CreatorTool>
   <pdf:Producer>{producer}</pdf:Producer>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>"""


def read_pdf_props(path: Path) -> dict:
    import fitz

    with fitz.open(str(path)) as doc:
        md = doc.metadata or {}
        return {
            "title": md.get("title") or "",
            "creator": md.get("author") or "",
            "subject": md.get("subject") or "",
            "keywords": md.get("keywords") or "",
        }


# Strings that must not survive anywhere in the bytes of a shipped PDF.
STALE_NEEDLES = (b"Kristina", b"Pavlovaite", b"PowerPoint Presentation")


def pdf_has_stale_bytes(path: Path) -> bool:
    """Is the old metadata still physically in the file?

    Setting the Info dictionary is not the same as removing the old one. A PDF
    is append-only by design, so an incremental save leaves the superseded Info
    object AND the superseded XMP packet sitting in the file, unreferenced by
    the cross-reference table. No viewer shows them - but `strings guide.pdf`
    does, and so does any metadata-forensics tool. "Needs to disappear" means
    the bytes are gone, not merely unlinked, so this is treated as work
    outstanding and repaired by a full rewrite.
    """
    data = path.read_bytes()
    return any(n in data for n in STALE_NEEDLES)


def write_pdf_props(path: Path, props: dict) -> None:
    """Set the Info dictionary and the XMP packet.

    Both, not one: the Info dictionary is what Windows, most browsers and most
    crawlers read, while Acrobat and macOS prefer the XMP packet when a file
    carries one - and these files do, because PowerPoint writes one on export.
    Fixing only the Info dictionary would leave Kristina's name showing in
    Acrobat, which is exactly the symptom we are here to remove.
    """
    import fitz

    doc = fitz.open(str(path))
    try:
        page_count = doc.page_count
        md = dict(doc.metadata or {})
        producer = md.get("producer") or ""
        creator_tool = md.get("creator") or ""

        md.update({
            "title": props["title"],
            "author": props["creator"],
            "subject": props["subject"],
            "keywords": props["keywords"],
        })
        doc.set_metadata(md)

        doc.set_xml_metadata(XMP_TEMPLATE.format(
            title=xml_escape(props["title"]),
            author=xml_escape(props["creator"]),
            subject=xml_escape(props["subject"]),
            keywords=xml_escape(props["keywords"]),
            creator_tool=xml_escape(creator_tool),
            producer=xml_escape(producer),
        ))

        # A full rewrite with garbage collection, NOT an incremental save.
        # Incremental is cheaper and leaves the page content byte-identical,
        # but it can only append - so the old Info dictionary and old XMP
        # packet stay in the file naming the template author. garbage=4 drops
        # every object the cross-reference table no longer points at, which is
        # the only way those bytes actually leave. Written to a sibling temp
        # file and moved into place, so a failure leaves the original intact.
        tmp_fd, tmp_name = tempfile.mkstemp(suffix=".pdf", dir=str(path.parent))
        os.close(tmp_fd)
        tmp = Path(tmp_name)
        try:
            doc.save(str(tmp), garbage=4, deflate=True, clean=True)
            doc.close()
            # Verify before replacing: same pages, and no stale bytes left.
            check = fitz.open(str(tmp))
            pages = check.page_count
            check.close()
            if pages != page_count:
                raise RuntimeError(f"page count changed {page_count} -> {pages}")
            leftover = [n.decode() for n in STALE_NEEDLES if n in tmp.read_bytes()]
            if leftover:
                raise RuntimeError(f"stale strings survived the rewrite: {leftover}")
            shutil.move(str(tmp), str(path))
        finally:
            if tmp.exists():
                tmp.unlink()
    finally:
        if not doc.is_closed:
            doc.close()


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------


def collect_files() -> list:
    files = []
    for root in ROOTS:
        if not root.exists():
            print(f"  ! missing root, skipped: {root}")
            continue
        for p in sorted(root.rglob("*")):
            # ~$ files are Office lock stubs, not documents: unreadable while
            # the founder has the deck open, and never worth touching anyway.
            if p.name.startswith("~$"):
                continue
            if p.is_file() and p.suffix.lower() in (".pptx", ".pdf"):
                files.append(p)
    return files


def sku_key_for(path: Path) -> str | None:
    key = str(path).lower()
    # Longest fragment first so "..._ring_road_lt" beats "iceland-ring-road...".
    for fragment, sku in sorted(FILE_MAP, key=lambda kv: -len(kv[0])):
        if fragment in key:
            return sku
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="show the plan, change nothing")
    ap.add_argument("--only", help="substring filter on the file path")
    ap.add_argument("--restore", action="store_true", help="put back the values in the backup file")
    args = ap.parse_args()

    if args.restore:
        return restore(args)

    print("Fetching guide strings from Sanity ...")
    skus = fetch_sanity_skus()
    print(f"  {len(skus)} published guides")
    skus.update(LOCAL_SKUS)

    files = collect_files()
    if args.only:
        files = [f for f in files if args.only.lower() in str(f).lower()]
    print(f"{len(files)} deck/PDF files found\n")

    backup = {}
    if BACKUP.exists():
        backup = json.loads(BACKUP.read_text(encoding="utf-8"))

    unmapped, changed, already = [], 0, 0

    for path in files:
        key = sku_key_for(path)
        if key is None:
            unmapped.append(path)
            continue
        sku = skus.get(key)
        if sku is None:
            print(f"  ! no strings for '{key}': {path.name}")
            continue

        is_pptx = path.suffix.lower() == ".pptx"
        current = read_pptx_props(path) if is_pptx else read_pdf_props(path)
        target = {
            "title": sku["title"],
            "creator": AUTHOR,
            "subject": deck_subject(sku["subtitle"]),
            "keywords": join_keywords(sku["keywords"]),
            "lastModifiedBy": AUTHOR,
        }

        # lastModifiedBy only exists in a deck; a PDF has no equivalent field.
        compare = ("title", "creator", "subject", "keywords")
        if is_pptx:
            compare += ("lastModifiedBy",)
        differs = any(current.get(k, "") != target[k] for k in compare)

        # A PDF whose displayed fields are already right can still be carrying
        # the old ones as dead objects - see pdf_has_stale_bytes().
        stale_bytes = (not is_pptx) and pdf_has_stale_bytes(path)
        if not (differs or stale_bytes):
            already += 1
            continue

        print(f"  {path}")
        for field in compare:
            was, now = current.get(field, ""), target[field]
            if was != now:
                print(f"      {field:9} {was!r}")
                print(f"      {' ' * 9} -> {now!r}")
        if stale_bytes and not differs:
            print("      (fields already correct; rewriting to drop the "
                  "superseded Info/XMP objects still in the bytes)")

        if args.dry_run:
            changed += 1
            continue

        backup.setdefault(str(path), current)
        BACKUP.write_text(json.dumps(backup, ensure_ascii=False, indent=2), encoding="utf-8")

        if is_pptx:
            write_pptx_props(path, target)
        else:
            write_pdf_props(path, target)
        changed += 1

    print()
    print(f"{'would change' if args.dry_run else 'changed'}: {changed}")
    print(f"already correct: {already}")
    if unmapped:
        print(f"\nNOT MAPPED to any guide ({len(unmapped)}) - left untouched:")
        for p in unmapped:
            print(f"  {p}")
    return 0


def restore(args) -> int:
    if not BACKUP.exists():
        sys.exit("No backup file - nothing to restore.")
    backup = json.loads(BACKUP.read_text(encoding="utf-8"))
    for path_str, saved in backup.items():
        path = Path(path_str)
        if args.only and args.only.lower() not in path_str.lower():
            continue
        if not path.exists():
            print(f"  ! gone, skipped: {path}")
            continue
        # The backup holds the exact strings that were on the file, so they go
        # straight back - no deck_subject(), no keyword joining.
        props = {
            "title": saved.get("title", ""),
            "creator": saved.get("creator", ""),
            "subject": saved.get("subject", ""),
            "keywords": saved.get("keywords", ""),
            "lastModifiedBy": saved.get("lastModifiedBy", ""),
        }
        print(f"  restoring {path}")
        if args.dry_run:
            continue
        if path.suffix.lower() == ".pptx":
            write_pptx_props(path, props)
        else:
            write_pdf_props(path, props)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""
rename_story_id.py - rename an Inspire story's ID on disk.

Renames the story folder, every file carrying the ID prefix (at any depth),
the ID/slug keys inside {ID}_meta_*.yaml, and the publish-ledger entry. Text
substitutions listed with --replace are applied to the generated markdown and
to the text runs inside the .docx sources, so a later batch_publish re-run
does not resurrect the old wording.

The Sanity side is NOT touched here - publish-to-sanity derives the document
_id from the slug, so a renamed story needs its old document deleted and a new
one created (see rename-story-doc.mjs).

Usage:
  python scripts/rename_story_id.py --old 2026_x-eight-days --new 2026_x-seven-days \
      [--replace "eight days=seven days"]... [--dry-run]
"""
import argparse
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO = Path(__file__).resolve().parents[1]
COUNTRIES = REPO / "content" / "countries"
LEDGER = COUNTRIES / "publish-ledger.json"


def find_folder(story_id):
    hits = [p for p in COUNTRIES.glob(f"*/inspire/{story_id}") if p.is_dir()]
    hits += [p for p in COUNTRIES.glob(f"*/{story_id}") if p.is_dir()]
    return hits[0] if hits else None


def apply_text(text, pairs):
    for old, new in pairs:
        text = text.replace(old, new)
        # Match the source's own capitalisation of the leading word.
        text = text.replace(old[0].upper() + old[1:], new[0].upper() + new[1:])
    return text


def rewrite_docx(path, pairs, dry_run):
    """Substitute inside <w:t> runs only, leaving all other XML untouched."""
    with zipfile.ZipFile(path) as z:
        items = {n: z.read(n) for n in z.namelist()}
    xml = items["word/document.xml"].decode("utf-8")

    hits = 0

    def sub_run(m):
        nonlocal hits
        inner = apply_text(m.group(2), pairs)
        if inner != m.group(2):
            hits += 1
        return f"{m.group(1)}{inner}</w:t>"

    new_xml = re.sub(r"(<w:t(?:\s[^>]*)?>)(.*?)</w:t>", sub_run, xml, flags=re.S)
    if hits and not dry_run:
        items["word/document.xml"] = new_xml.encode("utf-8")
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for name, data in items.items():
                z.writestr(name, data)
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--old", required=True)
    ap.add_argument("--new", required=True)
    ap.add_argument("--replace", action="append", default=[],
                    help='text substitution "old=new", repeatable')
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    pairs = []
    for r in a.replace:
        old, _, new = r.partition("=")
        pairs.append((old, new))

    folder = find_folder(a.old)
    target = find_folder(a.new)
    if not folder and not target:
        sys.exit(f"story folder not found: {a.old}")

    if folder and target:
        sys.exit(f"both {a.old} and {a.new} exist - resolve by hand")

    if folder:
        target = folder.with_name(a.new)
        print(f"{'[dry-run] ' if a.dry_run else ''}{folder.relative_to(REPO)}\n     -> {target.name}")
        if not a.dry_run:
            # Windows refuses the directory rename whenever any process holds
            # a handle on it (Explorer, an indexer, a dev server). Fall back to
            # moving the contents into a fresh directory.
            try:
                folder.rename(target)
            except PermissionError:
                target.mkdir(exist_ok=True)
                for child in list(folder.iterdir()):
                    shutil.move(str(child), str(target / child.name))
                shutil.rmtree(folder, ignore_errors=True)
                print("  (directory was locked - moved contents instead)")
        work = folder if a.dry_run else target
    else:
        # Resume: the directory is already renamed, the rest is not done yet.
        print(f"{a.new} already in place - completing the remaining steps")
        work = target

    # Files carrying the ID prefix, deepest first so parents stay valid.
    renamed = 0
    for p in sorted(work.rglob("*"), key=lambda p: -len(p.parts)):
        if p.is_file() and p.name.startswith(a.old):
            dst = p.with_name(p.name.replace(a.old, a.new, 1))
            renamed += 1
            if not a.dry_run:
                p.rename(dst)
    print(f"  {renamed} file(s) renamed")

    # Text files: ID references and the requested substitutions.
    touched = 0
    for p in work.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in (".yaml", ".yml", ".md", ".txt", ".csv"):
            continue
        text = p.read_text(encoding="utf-8")
        # Both forms: the full ID and the bare slug it derives from
        # (meta files carry "slug: x-eight-days" without the year prefix).
        old_slug = re.sub(r"^\d{4}_", "", a.old)
        new_slug = re.sub(r"^\d{4}_", "", a.new)
        new_text = apply_text(
            text.replace(a.old, a.new).replace(old_slug, new_slug), pairs
        )
        if new_text != text:
            touched += 1
            if not a.dry_run:
                p.write_text(new_text, encoding="utf-8")
    print(f"  {touched} text file(s) updated")

    if pairs:
        for p in work.rglob("*.docx"):
            if p.name.startswith("~$"):
                continue
            hits = rewrite_docx(p, pairs, a.dry_run)
            if hits:
                print(f"  {p.name}: {hits} run(s) rewritten")

    if LEDGER.exists():
        ledger = json.loads(LEDGER.read_text(encoding="utf-8"))
        if a.old in ledger:
            entry = ledger.pop(a.old)
            entry["slug"] = re.sub(r"^\d{4}_", "", a.new)
            ledger[a.new] = entry
            if not a.dry_run:
                LEDGER.write_text(json.dumps(ledger, indent=1), encoding="utf-8")
            print("  publish-ledger entry moved")

    print("done" if not a.dry_run else "dry run - nothing written")


if __name__ == "__main__":
    main()

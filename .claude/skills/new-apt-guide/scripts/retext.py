# -*- coding: utf-8 -*-
"""Paragraph-level PPTX retexting for the APT deck-clone workflow.

Usage: import this module, set `M` to a mapping
    {(slide_file, shape_cNvPr_id, paragraph_index): "new text", ...}
then call main(unpacked_dir). Sets the first run's text (preserving its rPr),
blanks the other runs, and reports any target it could not find.
"""
from lxml import etree
import sys

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'

M = {}

def main(root='unpacked'):
    byfile = {}
    for (f, sid, pi), txt in M.items():
        byfile.setdefault(f, []).append((sid, pi, txt))
    total, misses = 0, []
    for f, items in byfile.items():
        path = root + '/ppt/slides/' + f
        tree = etree.parse(path)
        shapes = {}
        for sp in tree.iter('{%s}sp' % P):
            nv = sp.find('.//{%s}cNvPr' % P)
            if nv is not None:
                shapes[int(nv.get('id'))] = sp
        for sid, pi, txt in items:
            sp = shapes.get(sid)
            if sp is None:
                misses.append((f, sid, pi, 'no shape')); continue
            paras = sp.findall('.//{%s}p' % A)
            if pi >= len(paras):
                misses.append((f, sid, pi, 'no para')); continue
            ts = [t for t in (r.find('{%s}t' % A) for r in paras[pi].findall('{%s}r' % A)) if t is not None]
            if not ts:
                misses.append((f, sid, pi, 'no runs')); continue
            ts[0].text = txt
            ts[0].set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
            for t in ts[1:]:
                t.text = ''
            total += 1
        tree.write(path, xml_declaration=True, encoding='UTF-8', standalone=True)
    print('applied %d replacements' % total)
    for m in misses:
        print('MISS', m)
    return misses

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'unpacked')

# APT weekend-deck shape map (A4 portrait)

> **Card-image note (2026-08, PR #58):** square deck exports are for social only —
> the site's carousel slides 1-2 must be the A4 portrait renders of the PDF's
> pages 1-2 (cover + route snapshot). `set-guide-carousel.mjs` now hard-rejects
> the wrong shape at upload (`--allow-shape` overrides); `npm run reexport:cards`
> regenerates slides 1-2 + cover straight from the sellable PDF.

## ⚠ Structure change — founder field feedback, 2026-08-03 (after hiking stages 24+25)

The Grimentz–Evolène deck is now the structural reference for hiking guides, NOT the older 15-slide clones:

1. **Slide order:** cover · snapshot · route · **Getting there & back** · Day 1 · Day 2 · good to know · costs · know before · pack · reservations · if things change · difficulty · legal — transport comes BEFORE Day 1, and there is **no STAY slide** (14 slides).
2. **STAY slide is retired.** Its load-bearing facts fold into Day 1's evening timeline blocks (dinner time, sockets, order-water-at-dinner) and the existing back-matter slots (booking constraint → good-to-know callout + reservations trio; prices → costs; phones → know-before contacts; liner → pack list).
3. **Lift shortcuts go ON the day slide.** If a gondola/funicular can cut part of a stage, it gets a visible right-column box on that day's slide ("CUT THE CLIMB"), not just a back-matter reference block. Three-box right-column geometry that renders cleanly (EMU, A4): box A (LATEST TO START) y=5148164 h=1700000 body h=1160000 · box B (CUT THE CLIMB) y=6998164 h=1340000, title at y+289226, body at y+663405 h=560000 (2-line budget ~62 chars) · box C (FOOD & WATER) y=8488164 h=1610000 (3-line body ~100 chars). Clone the FOOD & WATER sp trio (rect+title+body) for box B.
4. **Pack list is terse.** Bare items only ("Trekking poles", "30 L pack"), no rationale clauses; sub-line carries the one ethos sentence ("Go light: you carry everything.").
5. Slide numbers come from slide-master `slidenum` fields — deleting a slide renumbers automatically. Delete = sldIdLst entry + presentation rels + slide xml/rels files + [Content_Types] override; orphaned media is harmless.
6. **GPX is the source of truth for ALL stats** (founder, 2026-08-04 — supersedes the 08-03 official-numbers rule): make_profile.py's computed footer numbers (5 m noise threshold) are copied VERBATIM — no rounding — into the snapshot, day headers, cover teasers, and any prose climb/descent figures ("1,438 m in one go"). Do not use SchweizMobil official numbers and do not set the stats_* yaml overrides (the mechanism exists but stays unused). Exception: published landmark elevations in prose keep their real values (the hut stays "2,985 m") — only climb/descent/distance/highest stats are GPX-derived. Rationale: official numbers only exist for SchweizMobil routes; GPX works for every route.
7. **Pack list columns are categorical, not wear-vs-carry**: Clothing / Gear & food / Money & documents (founder, 2026-08-04 — "On you / In pack / In pocket" made items appear twice and put sunscreen "on you"). Each item appears once with its TOTAL quantity ("2 synthetic t-shirts + 2 shorts", "2 pairs underwear + 2 pairs socks"). Water floor is 2 L — never print less. Use official SAC terms: "sleeping-bag liner" (silk or cotton), not "silk trekking sheet".
8. Never write "Valais" (or any canton) as a rail destination — name the stations ("Zürich ⇄ Sierre/Sion").
9. **QR pics are clickable**: every template QR pic carries `<a:hlinkClick r:id>` in its cNvPr. When cloning QR pics across decks, the hyperlink rIds come along and dangle — PowerPoint then refuses to open the file (XML still parses). Re-point every cloned hlinkClick at a fresh external hyperlink rel targeting its go/ URL. Cross-check: every `r:embed`/`r:id` referenced in the slide must exist in its .rels.

The per-shape ids below still apply to each surviving slide (they were measured on the 15-slide clones; the Grimentz–Evolène deck's Day-1/Day-2 slides are files slide5/slide7 pre-deletion, slide5/slide6 by index after).

## Original shape map (measured on the Simplon → Saas-Fee-Gruben clones)

Measured on the Simplon → Saas-Fee-Gruben clones. Shape cNvPr ids are stable when you clone the deck; re-dump to confirm before writing the mapping:

```python
# dump: python - <<'EOF'  (run inside the unzipped deck dir)
import glob, re, os
from lxml import etree
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
P='{http://schemas.openxmlformats.org/presentationml/2006/main}'
for f in sorted(glob.glob('unpacked/ppt/slides/slide*.xml'), key=lambda p:int(re.search(r'(\d+)',p).group())):
    t=etree.parse(f); print('='*20, os.path.basename(f))
    for sp in t.iter(P+'sp'):
        nv=sp.find('.//'+P+'cNvPr')
        for i,pa in enumerate(sp.findall('.//'+A+'p')):
            txt=''.join(r.text or '' for r in pa.iter(A+'t'))
            if txt.strip(): print(f"  id={nv.get('id')} [{i}] {txt!r}")
EOF
```

## Slide-by-slide targets (slide, shape id, paragraph)

Header shape per slide (text `{TITLE} | 2-DAY HIKE`): s2:5, s3:3, s4:3, s5:3, s6:3, s7:3, s8:3, s9:3, s10:4, s11:4, s12:20, s13:3, s14:3, s15:7.

- **s1 cover**: 3 title (≤19 chars), 5 series line, 4 subtitle, 6/8/10 teasers (2 short lines each, ≤20 chars/line), 12 "2 DAYS".
- **s2 snapshot**: 8 sub, 17 "Why this trip" (~60 words), 19-26 stat values (Distance/Ascent/Descent/Highest/Days/Walking/Difficulty/Season).
- **s3 route**: 8 sub, 56 map-QR caption.
- **s4 day 1 / s6 day 2 (timeline)**: 31 title, 32 sub (para0 ≤65 chars = 1 line) + stats (para1 ≤62 chars, format `20 km / 12 mi · ↑1,300 m/4,270 ft · ↓1,450 m/4,760 ft · 9 hrs`), 94 photo caption, 38/40 LATEST TO START, 71/72 FOOD & WATER (s4) / LAST BUS (s6). Hour rail = 13 label shapes ids 95,97,...,119. **Event blocks sit at FIXED hour offsets from the rail start** — s4: +0(48/49), +1(50/51), +4(52/53), +5(76/77), +9(57/58), +11(63/64); s6: +0, +1, +4, +5, +9, +10. Pick the rail start so events land near real times. First-slot bodies (49) must stay ONE line (~45 chars) or the separator line strikes through line 2.
- **s5 stay**: 31 title (≤18 chars — the village name alone works), 32 sub, 49 intro (~200 chars max), 50/51 hotel, 52/53 Food (dinner venues live HERE only), 57/58 Evening, 76/77 Water, 71/72 ACCESS & SIGNAL (paras 0 and 2), 94 side label, 38/40 call-out card (title ≤14 chars; use the trip's hard constraint, e.g. BOOK THE BUS).
- **s7 getting there**: 46 title, 50 sub, 28 train table (para0 head + 4 `City\t~2 h 10` rows — literal tab), 30 car table (+ para6 parking note), 8 two cards (paras 0/1 and 3/4), 12 bottom note (≤3 rendered lines: para0 ~140 chars + para1 ~80).
- **s8 good to know**: 9 lift block title + rows 10/13, 19/20, 21/22, 33/34; 27 "Buses & trains" + rows 23/24, 25/26 (+ cloned rows 200/201, 203/204, 210/211, 213/214 with separators 202/205/212/215 — row pitch 299,967 EMU, label+value ≤ ~70 chars total per row); 28/42 miss-the-bus; 29/43 emergency; 46 title, 50 sub, 12 bottom callout.
- **s9 costs**: 13 sub (headline savings number), rows: 42 hotel label + 84/85/93 values; 46 picnics; 50 (paras 0/1) train+local transport labels + 88/89 + 95(para1); 96(para1)/97 car rental; 25/26 fuel+parking; totals 28/31/32 (top tiles) and 11/24/41 (bottom row) — keep tiles and totals identical; 19 extra-costs bullets (3), 23 left-out bullets, 20 bottom note (para1 = Half-fare line). Recompute every total after any line change.
- **s10 know before**: 12 weather bullets (5 paras: MeteoSwiss codes on 1-2), 21 trail conditions (4), 23 food/water (4), 25 money/signal (3), 29 not-suitable (2), 28 contacts (2 phone lines).
- **s11 pack**: 8 sub, 12 on-you (6 bullets), 21 in-pack (7), 23 in-pocket (5).
- **s12 reservations**: name/desc/when trios — Book&Download: 14/15/11, 102/103/104, 6/19/17 (SBB), 108/109/110; Apps: 25/26/27, 3/5/16; Backup: 97/98, 87/88, 54/55, 92/93. Name lines ≤ ~12 chars each or they overlap the description.
- **s13 if things change**: 6 cards, titles 52/55/58/61/64/67, bodies 53/56/59/62/65/68 (title-body paragraph pairs 0-5). Budget ≈ 12 rendered lines per card (~35 chars/line); titles must name day + checkpoint.
- **s14 difficulty scale**: 50 source line ("This route reaches T3, ..."). Highlight row: see traps.
- **s15 legal**: header only — the legal block is canonical, do not edit.

## Image slots (media files, by rels of the template)

| slot | file | size | notes |
|---|---|---|---|
| route map (s3) | image23.png | 1600×900 | direct swap from make_map.py |
| profile day 1 / day 2 (s3) | image24/25.png | 1589×465 | resize LANCZOS |
| Switzerland overview (s7) | image33.png | 1600×900 native | pic 'Switzerland map' has srcRect l="4560" (=4.56% — **srcRect units are 1/1000 of a percent**) fitting 16:9 into the 1.697 frame |
| QRs (s12) | image38-47.png, map QR image26.png | 660×660 | shape names `QR ...` map to media via slide12 rels — verify the mapping, slots may have changed roles |
| photos | image15-22, 28-30 | various | placeholders — founder swaps |

## Measured budgets added on the Gruben-Grimentz clone (2026-07-29)

- Day-title band (s4/s6 shape 31) fits ~18 chars including the arrow: `GRUBEN → WEISSHORN` fits, 20 chars (`WEISSHORN → GRIMENTZ`) wraps onto the subtitle. Drop the day's start point before shrinking anything (`DOWN TO GRIMENTZ`).
- The +4 timeline slot (52/53) is NARROWER than slot 1: body budget ~33 chars, one line ('Lunch at the tarn below the pass.' fits; 42 chars wrapped and the separator struck line 2).
- s6 shape 40 (LATEST TO START) has ONE paragraph, unlike s4 shape 40 which has two — merge both sentences into para 0.
- s9 Train/Local-transport label rows ship tightly wrapped in the template itself; keep 50[1] ≤ ~36 chars so it stays one line.
- s12 trio descriptions ≤ 2 rendered lines (~30 chars) or they collide with the "when" line below.
- QR regeneration: render qrcode with box_size 15 (native ≤ 660) and only UPSCALE to 660 — a NEAREST downscale drops whole module rows. One payload (`ggr-hotel-stluc`) produced an EC-M pattern cv2 could not decode at ANY scale; bumping that slot to ERROR_CORRECT_Q fixed it. Machine-decode every slot after generation.
- No validate.py exists in the repo: validate by re-zipping from inside the unpacked dir, diffing the zip inventory against the template, and lxml-parsing every .xml/.rels part.
- Overpass main endpoint (overpass-api.de) 504s regularly; overpass.kumi.systems mirror answered first try.

- Restoring user-deleted QR pics (2026-08-06, Saas-Fee-Gruben): the grey `QRbg-*` rects stay behind when a QR pic is deleted and their POSITIONS are the slot truth (their names go stale across clones — `QRbg-ssf-car` sat under the Bus column). Clone a surviving QR pic element, re-point embed + hlink rels, and place at the bg-rect xy. QA: crop each QR from the COM-rendered PNG and cv2-decode it — proves both payload AND slot assignment in one step.
- QR click behavior is viewer-controlled and NOT fixable (founder decision 2026-08-06: leave as is): PDF links have no new-tab concept — Chrome/Edge open same-tab, Firefox/Acrobat/phones don't. Don't add tip copy and don't try PDF-JavaScript wrappers (browser viewers ignore PDF JS, links would go dead).
- Full QR audit = FOUR layers (2026-08-06, Gruben-Grimentz): (1) cv2-decode the rendered pixels per slot, (2) check the pic hlinkClick rels — regenerated QR IMAGES can hide stale cloned HYPERLINKS (all 11 ggr QR pics still click-linked to ssf-* URLs), (3) curl the dev server for a 302 per alias, (4) curl -L each redirect TARGET for liveness — ggr-bus's turtmanntal.ch page 404'd after a site rebuild (fix in route.js, printed QRs unaffected; stable replacement: turtmanntal.ch/infocenter/). Pic shape names and rel names lie across clones; only positions, payloads and rels-file targets are truth.
- Cover photo legibility (2026-08-07, Grimentz-Evolène): the cover's lower half carries the subtitle + three teaser columns in white/orange over the photo, with no scrim shape in the template — a bright sunlit foreground (grass, rock) makes them unreadable. Either pick a vertical with a naturally dark bottom (the Saas-Fee cover's shaded street) or bake a gradient scrim into the JPEG before embedding (transparent above ~50% height, ramping to ~60% near-black at the bottom edge; PIL composite, reads as natural shadow). Pre-crop the photo to the exact page ratio (7559675:10692000) and the template's stretch/fillRect drops it in with no srcRect math.
- Cover pic geometry (2026-08-07, stages 1-6 photo pass): s1's photo pic carries **rot="5400000"** (90° CW) with a LANDSCAPE frame (10707117×7559673 at off -1573723,1550362) plus a srcRect crop — so the media must be the intended portrait cover **pre-rotated 90° CCW** (landscape pixels), or it renders sideways. Cleanest recipe: crop the photo to A4 portrait + bake the scrim, strip the srcRect from the pic, store `portrait.rotate(90, expand)` as the media. Collage/day frames have no rotation — plain 4:3 media drops in.
- Photo slots are the empty `rect` sps: snapshot slide has a 6-frame collage (1× 4464000×3348000 + 5× 2175428×1630800), day slides one 2844800×2134800 frame above caption shape 94 — all 4:3, so uncropped 4000×3000 phone photos drop straight in (append pic at spTree end, frames don't overlap text).

- Hour rails are fully retextable (2026-08-07, stages 1-6 triple build): the 13 label shapes (ids 95-119, step 2) take any start hour — the Savognin long day ran 06:00-18:00. QA rule: after the first render, check every printed clock time against the FIXED slot offsets (s5: +0/+1/+4/+5/+9/+11; s6: +0/+1/+4/+5/+9/+10) — anchor the timeline on the exit chain whose real time lands in the +9/+10 slots and sell the earlier bus in LAST BUS instead.
- Difficulty highlight row move (T3→T2) as pure transplant (ran twice, zero corruption): move boxed row's ln* into target row's tcPr front (original order), old above-row's lnB up one row, old below-row's lnT up one row, assert one *Fill per touched cell.
- Cover-title sizes measured: 19 wide caps = 44pt (Grimentz), 22 chars = 40pt (St. Moritz/Ausserferrera builds), 25 chars = 36pt (Alp Flix build). Set the run's rPr sz, never resize the shape.

## Traps (each cost real time)

- Retext at paragraph level: set first run's `<a:t>`, blank the rest, `xml:space="preserve"` on the first. Never rebuild rPr children.
- Difficulty-table highlight: move the border box by copying tcPr between rows, but the boxed row's tcPr ALREADY contains a schemeClr solidFill — appending a second fill makes PowerPoint call the file corrupt while XSD validation passes.
- `validate.py --original <template>` after every repack; render QA via PowerPoint COM (`Export(...,"PNG",1240,1754)`); LibreOffice does not work on this machine. PDF via COM `SaveAs(path, 32)`.
- Zip from INSIDE the unpacked dir; delete the old pptx first.
- Fix overflow by shortening copy. Re-render after every text fix — longer text overflows silently.
- Cover title (s1 id 3, Grimentz-Evolène clone): budgets are glyph-width, not char-count — 19 wide caps ("GRIMENTZ TO EVOLÈNE") overflow at 48pt where 18 narrower ones fit. Fix: set that run's rPr sz to 4400; never resize the shape. Contract day titles to match the profile-plate titles ("GRIMENTZ → THE HUT" / "Day 1: Grimentz to the hut") so deck, profiles and bailout cards share one contraction.
- Timeline event TITLES fit ~32 chars one line ("Lunch on the plateau (from home)" fits; 37 chars wrapped onto the body and the separator struck it).

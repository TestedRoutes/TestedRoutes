---
name: new-apt-guide
description: Produce a complete TestedRoutes weekend-hike guide for the next Alpine Passes Trail stages - research, maps, deck (PPTX+PDF), QR go-links, companion-map master workbook and My Maps exports. Use this whenever the user asks to build, create, or start a new APT guide, a guide "for stages N and M", "the next stages", a Gruben-to-Grimentz / Grimentz-to-Evolene guide, or to clone the previous weekend-hike deck for a new route. Also use it when the user drops GPX files for new Alpine Passes Trail stages and asks for a guide.
---

# New Alpine Passes Trail weekend guide

This skill runs the guide-production pipeline proven on APT-20-21 (Saas Fee to Gruben). Work top to bottom; each phase feeds the next. The founder reviews between phases - deliver the deck PDF before building the master workbook unless told to run straight through.

## Read these first (rules of the house)

1. `C:\Users\pauli\Desktop\TR - Documents\4. Guides\TestedRoutes_guide-production-playbook_v3.md` - and v2 in the same folder for the sections v3 marks "unchanged" (deck-clone workflow 6c, weekend structure 6d, review checklist 7). Use the highest version number present in the folder.
2. `C:\Users\pauli\Desktop\TR - Documents\4. Guides\TestedRoutes_map_system_v5.docx` (highest version) - master schema, Map roles, icon vocabulary, export spec.
3. [references/deck-shape-map.md](references/deck-shape-map.md) - the template deck's shape inventory, char budgets, image slots and known traps. Read it before touching the PPTX.

The non-negotiables that caused rework last time: no invented venue names (web-verify everything, founder links win); no spaced en-dash anywhere in deck copy; "hiking shoes" never "boots"; the FULL hike is always the plan and lifts are options; dinner venues named once on the Stay page; food packed from home; year-round content (no exact sun times); at most one price/fact left unverified without an explicit TODO.

## Inputs to confirm before starting

- Stage numbers + GPX files (founder usually drops `6 Alpine Passes Trail - Stage N.gpx` in the guide folder; if missing, ask - do not synthesize a track).
- Official title, pattern: `{START} TO {END}` (e.g. SAAS FEE TO GRUBEN), used verbatim everywhere.
- Any founder venue/share links for hotels or restaurants on the route.

Folder: `content/countries/switzerland/guides/APT-{stages}-{slug}/` with `map/` (GPX, master, exports/) and `final/` (deck, PDF). Go-link alias prefix: first letters of start+end (ssf-, sfg-, ggr-...); check `app/go/[slug]/route.js` CURATED for collisions.

## Phase 1 - Route research

- SchweizMobil stage pages (`schweizmobil.ch/en/hiking-in-switzerland/route-6/stage-N`) are a JS app: WebFetch returns empty - use the Browser pane (`preview_start {url}` + `get_page_text`). Capture: km, ascent/descent, official time, description, warnings (exposure, no catering, guardian dogs), lift/bus shortcuts.
- Launch a background research agent for venues + transport with the never-invent rule: hotels (primary + backups), restaurants, cable cars (fares, seasons, rail-pass validity), every bus/train leg in and out, MeteoSwiss postcodes, SAC T-grade, season window. Require source URLs; mark anything unverifiable UNVERIFIED.
- Find the trip's **hard constraint** (last bus, reservation-only service, seasonal closure) - the whole deck flexes around it. Phone-booked services exist in these valleys (Turtmanntal bus: seats by phone ≥1 h ahead); word them "book seats by phone", never "reserve tickets".
- Compute GPX stats per stage and for any lift-assisted variant (`scripts/maps/make_profile.py` prints them). Use official SchweizMobil figures on day headers, GPX for cross-checks.

## Phase 2 - Trip design

Apply playbook 6d: Day 1 = early train from Zürich (breakfast on board) + full stage + one hotel night; Day 2 = full stage + home the same evening. Build the timeline around the hard constraint with explicit turnback checkpoints ("Past 14:00 and not at X: turn back"). Decide the six bailout cards (weather / exhausted / late / snow / fully booked / bus missed) with day + checkpoint named in every title.

## Phase 3 - Maps and profiles

Create `scripts/maps/guides/{slug}.yaml` (route map from GPX + waypoints incl. every named checkpoint, one profile per day) and `{slug}-overview.yaml` (`tiles: osm`, `cities:` Bern/Basel/Genève, `arrive_by` transport chain + solid GPX walk leg). Run:

```
python scripts/maps/make_map.py scripts/maps/guides/{slug}.yaml
python scripts/maps/make_profile.py scripts/maps/guides/{slug}.yaml
python scripts/maps/make_map.py scripts/maps/guides/{slug}-overview.yaml
```

Copy the previous guide's yaml as the starting point. Inspect every PNG before embedding.

## Phase 4 - Deck

Template: the latest completed APT deck, currently
`content/countries/switzerland/guides/APT-20-21-saas-fee-to-gruben/final/TestedRoutes-Saas-Fee-Gruben-Weekend-Hike.pptx`.

1. Unzip to a scratch dir. Dump every shape's paragraphs (script in deck-shape-map.md) and diff against the reference inventory - shape ids are stable across clones.
2. Write ONE full replacement mapping keyed `(slide, shape-id, paragraph-index)` and apply with [scripts/retext.py](scripts/retext.py). Respect the char budgets in deck-shape-map.md - they are measured, not guesses.
3. Swap images: route map, two profiles, overview map (mind the srcRect), QR PNGs (generate with `qrcode`, encode `testedroutes.com/go/{alias}`, register every alias in route.js CURATED, decode-verify each PNG, curl the dev server for 302s). Photos stay as placeholders - flag them; the founder swaps from the archive.
4. Repack (zip from inside the dir), `validate.py --original <template>`, then render ALL slides via PowerPoint COM at 1240x1754 and inspect each one. Fix overflow by shortening copy, never by resizing shapes. Iterate until clean, then export the PDF via COM SaveAs(...,32) and deliver it with SendUserFile plus the TODO list (photos, phone verifications, companion-map go-link).

## Phase 5 - Companion-map master + exports

Copy the schema from the latest APT master (currently `APT-20-21-saas-fee-to-gruben/map/TestedRoutes_SaasFee-Gruben_Master_v4.xlsx`, 16 columns incl. Internal notes). Rules that bit us: geocode per playbook §3 (Nominatim venues, Overpass `aerialway=station`/`railway=station` NODES - never way centers; cable-car way ENDPOINTS give both stations; stream x trail min-distance for crossings); every exit-chain leg is its own pin; Detour/Skip rows are day-less; gondola stations belong to the day the founder says (ask if ambiguous). Export per-layer XLSX (`Day{N}_{Region}.xlsx` with Map role column, prefixed names; `Day{N+1}_Beyond-this-route-and-considered.xlsx` unprefixed). Icons live in `TR - Documents/4. Guides/TestedRoutes_map-icons/` (bus.png + cablecar.png exist). Give the founder the My Maps title `{TITLE IN CAPS} - 2 DAY HIKE | TestedRoutes` (founder-confirmed format, e.g. `GRIMENTZ TO EVOLÈNE - 2 DAY HIKE | TestedRoutes`) and the one-line description from map_system §6.

## Phase 6 - Media + publish (after the founder curates)

Runs once the founder has culled media and reviewed the deck. Detailed conventions live in project memory ([[media-selection-workflow]], [[testedroutes-guide-publish-workflow]]) - this is the order of operations:

1. **Media selection** (before curation): contact-sheet the F-drive originals, shortlist ~20-30 per destination with original filenames into `inspire/{ID}/photos/`, `guides/{slug}/deck-photos/` (1 vertical cover + horizontals), `guides/{slug}/photos/` (vertical). Founder culls to bare-numbered files.
2. **Deck photos + QRs**: insert photos into the deck's empty rects (snapshot collage + day slides); generate `{prefix}-*` QR PNGs (box_size 15, upscale to 660, decode-verify), restore/replace QR pics, COM-render QA + decode every QR from the renders, export the PDF.
3. **QR go-links**: `python scripts/sync_go_links.py --file "<guide master xlsx>" --live` (convert the workbook's My Maps edit URL to viewer form FIRST); curl-verify every /go/ 302 AND its destination status in production.
4. **Inspire story**: create `{ID}_story_en.md` (body only) + `{ID}_meta_en.yaml`; rename founder-numbered media to `{ID}_N` form; `python scripts/batch_publish.py --plan "<Content-Plan>" --only {ID}`. Inspire slug must differ from the guide slug.
5. **Guide SKU**: copy the newest `scripts/create-*-guide.mjs` (currently create-saas-fee-gruben-guide.mjs); weekend price CHF 9 / EUR 9 / USD 11 / GBP 9; wire the inspire doc into `similarStories`.
6. **Cards**: card folder = `1. cover.jpg` + `2. snapshot.jpg` (deck page renders, ALWAYS slides 1-2) + trip media from 3; videos pre-trimmed to 7 s, muted, **3:4 crop at 1200x1600** (match the photos or they render thinner); add the ALT block to set-guide-carousel.mjs, dry-run, then upload.
7. **Polar**: `POLAR_SYNC_ENABLED=1 node --env-file=.env.local scripts/sync-polar-products.mjs --guide=<slug>`; verify /guides/<slug> 200 and /api/checkout 302.
8. **Card re-export** (after the final PDF is published, before QA): `npm run reexport:cards -- --slug <slug>` re-renders carousel slides 1-2 and `guide.cover` straight from the sellable PDF (pages 1-2, always A4 portrait) — this is what keeps the browse card on the Seychelles inset-cover standard (`--dry-run` supported).

## Definition of done

Deck PDF delivered and every slide visually QA'd; all QR aliases registered and 302-verified; master v1 + day exports delivered; a TODO list naming exactly what still blocks print (photos, 20xx timetables, unverified prices, companion-map URL). Update the playbook and project memory with anything new this build taught.

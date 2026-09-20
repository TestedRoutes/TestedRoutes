# CLAUDE.md

Guidance for Claude Code sessions working in this repo.

## What this is

Next.js site (App Router, JS not TS) selling PDF travel guides, content in
Sanity (project `y3gc8dx6`, dataset `production` — publicly readable, which
is why the site's read client carries no token; writes need
`SANITY_API_WRITE_TOKEN`. Verified by anonymous query 2026-08-19; an earlier
note here claimed the dataset was private). Payments via Polar, deployed on
Vercel. Sanity Studio is embedded at `/studio`; schemas live in
`sanity/schemas/`.

## Guide card standard (decided 2026-08)

The browse-card look is the **Seychelles inset-cover treatment**: the card
leads with the guide deck's A4 portrait page-1 export rendered whole
("document look") on the neutral track, dots pinned to the card frame — NOT
a full-bleed cropped photo. Do not "fix" cards toward full-bleed; that
direction was tried and explicitly rejected by the founder.

How the pipeline enforces it:

- Sales carousel slides 1–2 are, by convention, the deck page-1/page-2
  exports; `shapeGuide` (`app/_lib/sanityStory.js`) always gives them the
  inset treatment. A `caption` on a slide marks later page exports (e.g. the
  sample day) for the same treatment; uncaptioned trip photos/clips fill the
  frame.
- The guide schema (`sanity/schemas/objects/guide.js`) requires `cover`
  (A4 page-1 export) and validates carousel slide 1: must be an image
  (error), warns when its shape isn't A4 portrait (~1:1.41). Asset refs
  encode pixel size (`image-<id>-<w>x<h>-<ext>`) — shape checks never need
  to fetch the asset.
- Card rendering path: `shapeGuide` → `toGuideCard` (`app/_lib/loadGuides.js`)
  → `GuideListCard` → `CardMediaCarousel` (contain vs cover per slide).

If a guide's card looks off-standard, the cause is almost always its assets
(square/social deck exports instead of A4), not the CSS. Fix:
`npm run reexport:cards` re-renders slides 1–2 and `cover` straight from
each guide's sellable PDF (pages 1–2, always A4) — `--dry-run` and
`--slug` supported. `set-guide-carousel.mjs` refuses non-A4 slides 1–2 at
upload time (`--allow-shape` overrides), so a square export can't come
back through the authoring flow either.

## Content scripts

`scripts/*.mjs` run locally with `node --env-file=.env.local …` and need
`SANITY_API_WRITE_TOKEN` — they cannot run in remote/sandbox sessions (no
`.env.local` there; token fetches are also how drafts get patched alongside
published docs).

**The publish pipeline makes no Anthropic API calls** (founder decision
2026-08-31). `batch_publish.py` requires each story's `{ID}_meta_en.yaml` to be
authored by the Claude Code session before the run — the session writes the
editorial fields (place, subtitle, heroAlt, metaDescription, keywords,
trip_length, …) with the story and contact sheets in front of it. A missing
meta fails that story and leaves a `.yaml.draft` scaffold to complete; the
field contract lives in the newest `TR-inspire-authoring_*.md`. Carousel authoring flow: curate a numbered folder
("1. cover.jpg", "2. snapshot.jpg", …), then `set-guide-carousel.mjs`
uploads it wholesale; alt text lives in that script's `ALT` map.

## Inspire story → guide tagging (2026-08-31)

Each inspire story declares the guides it sells for: a `guides:` list of
/guides/ slugs in its meta yaml (→ `relatedGuideSlugs` on the story doc).
The story page pins one slug as a named CTA, renders several as "Guides
for this trip" in the authored order; untagged stories fall back to the
country's guides ordered by `guide.purchasesCount` (top 3) — right for
genuinely shared stories ("every Iceland guide"), wrong for stage stories,
so tag anything specific. `npm run set:story-guides -- --story <slug>
--guides a,b` patches the field (published + drafts + translations)
without a full republish; `npm run check:inspire` is the drift checker
(errors on tags that match no live guide, warns on untagged stories the
fallback is choosing for; no token needed).

## Publishing a guide SKU

**One engine, `scripts/publish-guide.mjs`, plus one data module per SKU at
`scripts/guides/<slug>.mjs`. Do not write a new per-guide script** — that was
the old shape (13 near-identical ~345-line scripts, each cloned from the
newest sibling) and it retired on 2026-08-16.

```
npm run publish:guide -- --slug <slug> --dry-run
npm run publish:guide -- --slug <slug> --assets <dir>
npm run check:guides                      # drift: every module vs live Sanity
npm run ping:indexnow -- --all            # submit the sitemap to IndexNow
```

A real publish submits the guide's URL to IndexNow automatically (`--no-ping`
skips it). **Bing and Yandex participate; Google does not** — so this speeds up
the Bing side, which is what ChatGPT search runs on, and does nothing for
Google. Google's queue is worked by requesting indexing in Search Console and
by earning inbound links, neither of which a script can do. The key in
`scripts/ping-indexnow.mjs` must match the filename in `public/`; the script
refuses to submit when the key file is not reachable, because IndexNow answers
202 and *then* discards the batch, which is invisible otherwise.

`check:guides` is the thing that stops the modules rotting the way the scripts
did — it exits 1 when a module and its live document disagree. Drift is not
automatically a defect (a module you edited but have not published shows up
here too); it means the two disagree and you should know why. It shells out to
`publish-guide.mjs --json` rather than rebuilding the doc, so the checker cannot
drift from the publisher it checks.

To add a SKU, copy the nearest existing data module and replace the content.
Three things the engine does that are easy to undo by accident:

- **The story doc has several authors.** `guide.carousel`, `guide.cover`,
  `guide.polarProductId`, `guide.statusNote` and `similarStories` are written
  by other tools, so the engine merges over the live document rather than
  replacing it. The legacy scripts called `createOrReplace` with only their own
  fields; re-running one would have deleted the rest, and losing
  `polarProductId` alone takes the buy button out of service with no error
  anywhere. `--replace` opts back into replacement; you almost never want it.
- **Gallery `_key`s live in the data module, never derived.** They are an
  item's identity in Sanity. The two legacy lineages derived them differently
  (`file.replace(/\W/g,"")` vs `f.slice(9,15)`), so any single rule rewrites
  half the library's keys.
- **Assets resolve explicitly, and republishing needs no source files.** With
  no `--assets` directory the engine carries forward the assets already on the
  doc. Guide hero/gallery sources have not survived on disk in practice, so
  this is the normal path, not the fallback.

A guide may acknowledge a check it knowingly fails via `knownIssues`; the
failure becomes a warning that prints on every run. Say next to it why and
since when — an acknowledgement nobody can date is indistinguishable from a
mistake.

## Gated guide reader — prototype (2026-09-20)

`app/(site)/reader/<country>` is the country guide inside the site chrome:
Itineraries · Places · Inspire · Travel tips (that order, founder's header
mock 2026-09-20; Itineraries is the country root, the place grid is
`/places`, place pages keep `/spots/<pin>`, Inspire lists the country's
public stories on the `/inspire` card), "Open the map" to a full-screen
map with a photo strip, device-local bookmarks. Every page renders for everyone; the
sample day, the sample pins and the first tips are open, the rest shows the
buy box inline. Fiji only. Built **ahead of any billing or
public-site change** (founder decision 2026-09-20: a working prototype
first, then scope it down and measure), so the seams are deliberate:

- **Structure.** Two storefront shapes on one content model, chosen per
  country: a *country guide* (Rexby shape: one map, every tested place, the
  routes through it; Fiji, Kuwait, UAE and the other small catalogues) and a
  *catalogue of guides* (GetYourGuide shape, each guide priced; Switzerland,
  later Iceland). Only the country guide is built. Switzerland follows once
  Fiji shows checkout clicks.
- **Titles follow search intent.** Country page "Fiji Itinerary", route
  "Fiji 14-Day Honeymoon Itinerary"; the brand claim lives in the subtitle.
  The 14-day data module carries the new title; `check:guides` shows drift
  until the founder republishes locally, which is the intended signal.
- **Content.** `content/countries/<c>/country.yaml` (title, creator line,
  routes in order, `free: true` on the sample route, price list, verified
  date, sample day and pins) + `places.yaml` (with `photo_ref`,
  `attributes`, a normalised `category`) + `guides/<sku>/sku.yaml`. Builders:
  `db/skuFromYaml.js`, `db/countryFromYaml.js`; the DB loader mirrors the
  same shape (`attributes` is part of the hash, `photoRef` is scrubbed by
  `check:sku`). The Fiji files are a hand-seeded subset (headers say what is
  provisional; `FJ-P##` pins are remapped when the founder's import runs).
  `.gitignore` re-includes exactly these three YAML shapes.
- **Gate.** One preview key (`READER_PREVIEW_SECRET`) held as an HMAC in an
  httpOnly cookie scoped to `/reader`; `_lib/access.js` is the swap point
  for the purchase-token `requireGuideAccess`. Pages ask `hasReaderAccess()`
  per section; nothing is ever a 403. Legacy `/reader/<sku>`, `/spots`,
  `/bookings`, `/pack` URLs redirect.
- **Data path.** `_lib/loadReaderSku.js` wraps the YAML builders;
  swapping to `db/loadSku.js` is that file only. `outputFileTracingIncludes`
  in `next.config.mjs` ships the YAML with the Vercel function; remove it
  with the swap. The reader never imports the Sanity client at module
  level (it must render with no Sanity env); the route cards' prices and
  Polar checkout links come from a lazy `loadGuideBySlug` and degrade to
  nothing without it.
- **Measurement.** Real price, real "Get the guide": until a Polar product
  exists for the country guide, the click posts to `/api/reader/interest`
  (Beehiiv `interest_country`, a Resend note to the founder who sends the
  access link by hand, an anonymous `reader_buy_click`). Route cards buy
  through the existing `/api/checkout` (`checkout_started`). Every reader
  page captures an anonymous `reader_page_view` server-side
  (`_lib/track.js`); client PostHog never initialises here because the
  cookie banner is suppressed on `/reader`.
- **Affiliate slots** (`AffiliateSlot`) on place cards, stays, bookings and
  activities all go through `/go/<alias>`; an empty alias renders nothing.
  The seed has no aliases: they are filled from the live `affiliateLink`
  docs (the import script's check), never invented.
- **Itineraries use the site's `GuideListCard`** (founder: same cards as
  the guides), fed by `routeCards()` in `_lib/commerce.js`. **Travel tips**
  are cards authored in `country.yaml` `tips:`. Bookmarks are
  `_lib/saved.js` (localStorage per country).
- **Not in this round:** the Switzerland catalogue, the full Fiji
  extraction, Postgres, print, the sales-page map on Google.

`/reader/` is disallowed in robots and every reader page is `noindex` +
`no-store`; the gate is the protection.

## Dates on any surface

**"Last reviewed <day month year>" is the only date a reader, a card or a
page shows** (founder rule, repeated 2026-09-20). It is the date the content
was last reviewed, from `reviewed:` in `country.yaml`, formatted by
`longDate()`. Never "verified", "tested on", "on the ground" with a date,
or the founder's travel dates: when he travelled is not the buyer's
concern and reads as a staleness warning.

## Maps

**Google Maps only** (founder rule, 2026-09-20): never OpenStreetMap or
Leaflet on any new surface. The reader's map is
`app/(site)/reader/_components/RouteMapGoogle.jsx` on `@vis.gl/react-google-maps`
(`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`); it
renders a labelled placeholder without the key. The sales-page
`LocationMap.jsx` predates the rule and still draws Leaflet on OSM tiles;
it moves to Google Maps with the next public-site change.

## Conventions

- **Deliverables are append-only: publish a new version, never overwrite.**
  Anything the founder can open — a deck, an exported PDF, a workbook, a
  master, a copy document, map exports — gets the next version number on every
  write (`_v1` → `_v2`), within a session as much as across sessions. He edits
  these files by hand between rounds without saying so, and an overwrite
  destroys that work silently: the write succeeds, the checks pass, nobody
  finds out. Before writing, compare the previous version against what you
  produced; if it differs, he has been in it, so re-read his file as the new
  base. Scratch and intermediates are exempt. Full rule: guide playbook v13 §0a.
- Comments explain constraints and the "why", often at paragraph length —
  match that register; don't strip them.
- Verification in remote sessions: `next build` needs live Sanity env, so
  the Vercel preview deploy on the PR is the real build check; locally use
  `npx esbuild` parse checks (`--loader:.js=jsx` — plain `.js` files contain
  JSX in `app/`).

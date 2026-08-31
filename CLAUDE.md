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
published docs). Carousel authoring flow: curate a numbered folder
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

# CLAUDE.md

Guidance for Claude Code sessions working in this repo.

## What this is

Next.js site (App Router, JS not TS) selling PDF travel guides, content in
Sanity (project `y3gc8dx6`, dataset `production` — private, no anonymous
reads). Payments via Polar, deployed on Vercel. Sanity Studio is embedded at
`/studio`; schemas live in `sanity/schemas/`.

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

## Conventions

- Comments explain constraints and the "why", often at paragraph length —
  match that register; don't strip them.
- Verification in remote sessions: `next build` needs live Sanity env, so
  the Vercel preview deploy on the PR is the real build check; locally use
  `npx esbuild` parse checks (`--loader:.js=jsx` — plain `.js` files contain
  JSX in `app/`).

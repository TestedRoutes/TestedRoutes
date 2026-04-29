# TestedRoutes

## Environment variables

Set these in Vercel (Production + Preview) and in `.env.local` for development.

### Sanity

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional, defaults to `2026-04-24`)
- `SANITY_API_WRITE_TOKEN` — Editor role; used by the Polar webhook to bump
  purchase counts and by `npm run publish`
- `SANITY_REVALIDATE_SECRET` — shared secret for the Sanity → Next revalidation
  webhook (`/api/revalidate`)

### Beehiiv (newsletter)

- `BEEHIIV_API_KEY` — workspace API key from Beehiiv → Settings → API
- `BEEHIIV_PUBLICATION_ID` — V2 publication ID, starts with `pub_…`. Double
  opt-in is configured publication-side in Beehiiv (recommended on for GDPR);
  the *Opt in Redirect URL* should be set to
  `https://testedroutes.com/newsletter/confirmed`

### Polar (payments)

Two tokens — keep them separate so a leak of one doesn't escalate:

- `POLAR_ACCESS_TOKEN` — runtime token used by `/api/checkout`. Org token,
  minimum scopes: `checkouts:write`, `checkouts:read`, `products:read`.
  Lives in Vercel.
- `POLAR_SYNC_TOKEN` — script token for `npm run sync:polar`. Scopes:
  `products:write`, `benefits:write`, `files:write`, `organizations:read`.
  Stays in your local `.env.local`, not Vercel.
- `POLAR_WEBHOOK_SECRET` — set when creating the webhook endpoint in Polar;
  consumed by `/api/webhooks/polar`. Lives in Vercel.
- `POLAR_SERVER` — `sandbox` for testing, `production` when live. Used by
  both the checkout adapter and the sync script.
- `POLAR_SYNC_ENABLED` — must be `"1"` for the sync script to perform writes
  (safety flag). Anything else → dry-run.
- `NEXT_PUBLIC_SITE_URL` — e.g. `https://testedroutes.com`; used to build
  the Polar checkout `successUrl`.

## Pricing tiers

Guides don't carry prices directly — they reference a `pricingTier` document
that holds prices in EUR / USD / GBP / CHF. Eight tiers are seeded by
`npm run setup:pricing` (Quick trip, Day trip, Weekend trip, Week guide,
Multi-week, Rally, Expedition, Premium).

Editor flow:
- Pick a tier on each guide. The site shows the EUR price; Polar checkout
  shows the buyer's local currency (EUR/USD/GBP/CHF, geo-detected).
- Edit a tier's prices in Studio → re-run `sync:polar` → all guides on that
  tier get the new prices in Polar.
- For one-off pricing (e.g. the Premium tier or a promo), fill `customPrices`
  on the guide. It overrides the tier.

## Selling a guide end-to-end

```sh
# 1. One-time: seed pricing tiers + assign tiers to existing guides
npm run setup:pricing -- --dry-run     # preview
npm run setup:pricing                  # apply

# 2. Per guide in Sanity Studio: pick a tier, attach a PDF, set status=available
# 3. Sync to Polar (creates products, uploads PDFs, attaches benefits)
npm run sync:polar -- --dry-run        # preview
POLAR_SYNC_ENABLED=1 npm run sync:polar

# Single guide:
POLAR_SYNC_ENABLED=1 npm run sync:polar -- --guide=<slug>
```

The sync script:
- Reads guides where `hasGuide=true && status="available"`
- Skips and reports any guide missing PDF, prices, or EUR
- Creates Polar product + File Downloads benefit + uploads PDF; writes
  `polarProductId` back to Sanity
- Updates name and description on already-synced products (price /
  PDF replacement is intentionally not auto-handled — change in Polar
  dashboard or detach + resync if needed)

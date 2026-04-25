# PikelisTravel

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

### Polar (payments)

- `POLAR_ACCESS_TOKEN` — organization access token from the Polar dashboard
- `POLAR_WEBHOOK_SECRET` — set when creating the webhook endpoint in Polar;
  consumed by `/api/webhooks/polar`
- `POLAR_SERVER` — `sandbox` for testing, `production` when live
- `NEXT_PUBLIC_SITE_URL` — e.g. `https://pikelistravel.com`; used to build
  the Polar checkout `successUrl`

### Beehiiv (newsletter)

- `BEEHIIV_API_KEY` — workspace API key from Beehiiv → Settings → API
- `BEEHIIV_PUBLICATION_ID` — V2 publication ID, starts with `pub_…`. Double
  opt-in is configured publication-side in Beehiiv (recommended on for GDPR);
  the *Opt in Redirect URL* should be set to
  `https://pikelistravel.com/newsletter/confirmed`

### Wiring a guide for sale

1. Create the product in Polar (with the PDF as a *File Downloads* benefit)
2. Copy the product UUID into `guide.polarProductId` on the story in Sanity
3. Publish — the *Get the Guide* button on `/guides/[slug]` will now hit
   `/api/checkout?products=<id>` and redirect to Polar

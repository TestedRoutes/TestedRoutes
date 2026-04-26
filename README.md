# TestedRoutes

## Environment variables

Set these in Vercel (Production + Preview) and in `.env.local` for development.

### Sanity

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional, defaults to `2026-04-24`)
- `SANITY_API_WRITE_TOKEN` — Editor role; used by `npm run publish`
- `SANITY_REVALIDATE_SECRET` — shared secret for the Sanity → Next revalidation
  webhook (`/api/revalidate`)

### Beehiiv (newsletter)

- `BEEHIIV_API_KEY` — workspace API key from Beehiiv → Settings → API
- `BEEHIIV_PUBLICATION_ID` — V2 publication ID, starts with `pub_…`. Double
  opt-in is configured publication-side in Beehiiv (recommended on for GDPR);
  the *Opt in Redirect URL* should be set to
  `https://testedroutes.com/newsletter/confirmed`

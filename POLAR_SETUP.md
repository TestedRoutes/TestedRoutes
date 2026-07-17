# Polar production setup — 2026-07-17

Integration for org **testedroutes** (id `1229f0e6-9fd4-4dee-9243-dedf0875018c`),
dashboard: https://polar.sh/dashboard/testedroutes

> **This integration runs against the LIVE production Polar environment.**
> Products, discounts, and checkouts created here are real.

## Files created / changed

- `app/_lib/polar.js` — new: shared `@polar-sh/sdk` client (reads
  `POLAR_ACCESS_TOKEN` + `POLAR_SERVER`).
- `app/api/checkout/route.js` — rewritten from the `@polar-sh/nextjs`
  adapter to `polar.checkouts.create` + 302 redirect. Same path, same
  `?products=<id>` contract, same `/guides/thanks` success URL.
- `app/api/webhooks/polar/route.js` — rewritten to
  `validateEvent`/`WebhookVerificationError` from `@polar-sh/sdk/webhooks`.
  All business logic preserved (Sanity purchase-count bump + revalidate,
  Beehiiv buyer tagging); added a `customer.state_changed` TODO stub for
  the future subscription launch.
- `package.json` — removed `@polar-sh/nextjs` (SDK-direct everywhere now).

## Env keys (names only — values live in `.env.local` and Vercel)

- `POLAR_ACCESS_TOKEN` — production org token (products, checkouts,
  webhooks, discounts; read+write).
- `POLAR_SERVER` — `production` (the only switch between environments).
- `POLAR_WEBHOOK_SECRET` — signing secret of the production webhook
  endpoint (written automatically during provisioning).
- `POLAR_SYNC_TOKEN` — used by `scripts/sync-polar-products.mjs`.

## Provisioned in production

- Product: **Test Product**, €10 one-time — `4a14ae9a-d672-4c0f-ae74-c07bc8d67464`
- Webhook endpoint: `a1fe6764-471d-426b-a5ba-0b8345da2e5c` →
  `https://testedroutes.com/api/webhooks/polar`
  (events: `order.paid`, `order.refunded`, `customer.state_changed`; format raw)
- Discount for test checkouts: code `TESTFREE100` (100% off, once, max 5
  redemptions) — id `4eff93f4-f67f-4d00-82fb-03da275242db`

## Verify before merging / deploying

- [ ] `npm run build` passes (done 2026-07-17).
- [ ] Local checkout: `http://localhost:5173/api/checkout?products=4a14ae9a-d672-4c0f-ae74-c07bc8d67464`
      redirects to a **polar.sh** (not sandbox.polar.sh) checkout; enter
      `TESTFREE100` on the Polar page to complete without a charge.
- [ ] **Update Vercel env** (Production): `POLAR_ACCESS_TOKEN` (new prod
      token), `POLAR_SERVER=production`, `POLAR_WEBHOOK_SECRET` (value
      from `.env.local`). Until this is done the deployed site still
      talks to sandbox and the production webhook cannot verify.
- [ ] After deploy: complete one `TESTFREE100` order on production and
      confirm the webhook fires (purchase count bumps, buyer tagged in
      Beehiiv), then check the endpoint's delivery log in the Polar
      dashboard.
- [ ] Replace guide product IDs: the guides in Sanity still carry
      **sandbox** product IDs. Run `npm run sync:polar` (dry-run first)
      to create the real products in production and update Sanity.
- [ ] Archive the Test Product and delete/let-expire `TESTFREE100` once
      real products are live.

## Notes

- Customer portal: no app code needed — Polar hosts it and emails
  customers the link (order confirmations include access).
- Switching back to sandbox for experiments is env-only:
  `POLAR_SERVER=sandbox` + the sandbox token.

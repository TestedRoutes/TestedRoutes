// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://e53f598b00b8053babc9e372687d3fe9@o4511291487682560.ingest.de.sentry.io/4511291496923216",

  // 10% trace sampling. The setup default of 100% burns the free-tier quota
  // once real traffic arrives and adds instrumentation cost to every
  // request; a tenth is plenty to see latency shape. Errors are not
  // sampled - this only thins performance traces.
  tracesSampleRate: 0.1,

  // GDPR: do not send IPs, headers, or cookies. Consistent with PostHog ip=0 setting.
  sendDefaultPii: false,
});

// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://e53f598b00b8053babc9e372687d3fe9@o4511291487682560.ingest.de.sentry.io/4511291496923216",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // GDPR: do not send IPs, headers, or cookies. Consistent with PostHog ip=0 setting.
  sendDefaultPii: false,
});

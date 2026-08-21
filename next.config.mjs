import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  // Emit browser source maps so Sentry can upload them (fixes the 23
  // "could not determine a source map reference" build warnings and makes
  // client stack traces readable). Sentry deletes the .map files after
  // upload (see sourcemaps option below), so none deploy publicly.
  productionBrowserSourceMaps: true,
  // react-leaflet@4 trips "Map container is already initialized" under React 18
  // Strict Mode's double-mount in dev. Strict Mode has no effect on production
  // builds, so this only changes dev behaviour.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Localization is PAUSED (app/_lib/locale.js has the registry gate and the
  // re-enable story). Redirecting here rather than only in the /[lang] pages
  // gives a real 307 at the routing layer — a page-level redirect() streams
  // as HTTP 200 with a client-side hop because the page renders inside the
  // layout's Suspense boundary, which is a weaker signal for anything
  // indexed. temporary (307), never permanent: the prefixes come back when
  // localization resumes. Delete this block when it does.
  async redirects() {
    return ["de", "es", "fr", "lt"].flatMap((lang) => [
      { source: `/${lang}`, destination: "/", permanent: false },
      { source: `/${lang}/:path*`, destination: "/:path*", permanent: false },
    ]);
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "testedroutes",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  sourcemaps: {
    // Upload to Sentry, then strip the .map files from the deploy output so
    // source code is never publicly downloadable.
    deleteSourcemapsAfterUpload: true,
  },

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});

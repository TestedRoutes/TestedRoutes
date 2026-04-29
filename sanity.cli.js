import { defineCliConfig } from "sanity/cli";

// Values are intentionally hardcoded (not env-driven) because the
// Sanity CLI doesn't load .env.local the way Next.js does, and
// asserting env vars in the imported sanity/env.js makes "sanity
// deploy" fail with "CLI config cannot be loaded". Both project ID
// and dataset are public (committed to .env.local.example), so
// hardcoding them here is safe. The Next.js runtime keeps reading
// from process.env via sanity/env.js for misconfiguration safety.
export default defineCliConfig({
  api: {
    projectId: "y3gc8dx6",
    dataset: "production",
  },
});

import { defineCliConfig } from "sanity/cli";

// .ts file forces Sanity CLI's esbuild-register loader to transpile,
// which sidesteps the ESM/CJS interop break that occurs when this is a
// .js file in a "type": "module" project. Project ID + dataset are
// public; safe to commit.
export default defineCliConfig({
  api: {
    projectId: "y3gc8dx6",
    dataset: "production",
  },
});

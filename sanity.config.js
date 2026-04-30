import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

// Hardcoded so `sanity deploy` works without .env.local. The Sanity CLI
// (unlike Next.js) does not load .env.local — importing from sanity/env.js
// asserts on undefined env vars and breaks "CLI config cannot be loaded".
// These are public values; the Next.js runtime keeps using sanity/env.js
// for misconfig safety.
const projectId = "y3gc8dx6";
const dataset = "production";
const apiVersion = "2026-04-24";

export default defineConfig({
  name: "testedroutes",
  title: "TestedRoutes",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env.js";

export default defineCliConfig({
  api: { projectId, dataset },
});

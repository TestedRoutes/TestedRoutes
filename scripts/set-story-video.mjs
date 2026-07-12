#!/usr/bin/env node
/**
 * TestedRoutes — attach a card/teaser video to an existing Sanity story.
 *
 * Uploads the file as a Sanity file asset and sets hasVideo + videoUrl on
 * the story doc. The site's card carousels autoplay any direct .mp4/.webm
 * URL as the first slide, so keep clips short, muted and small (~5 MB —
 * e.g. ffmpeg: scale=-2:540, fps=24, crf 30, -an, +faststart).
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-story-video.mjs <storyDocId> <videoFile>
 *   node --env-file=.env.local scripts/set-story-video.mjs story-seychelles-la-digue-by-bike content/.../card-teaser.mp4
 */
import { createClient } from "next-sanity";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Same override-semantics loader as publish-to-sanity.mjs — --env-file
// alone won't override vars the parent process already set.
const envPath = path.resolve(".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.trim().match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

const [docId, videoArg] = process.argv.slice(2);
if (!docId || !videoArg) {
  console.error("Usage: node scripts/set-story-video.mjs <storyDocId> <videoFile>");
  process.exit(1);
}
const videoPath = path.resolve(videoArg);
if (!existsSync(videoPath)) {
  console.error(`✖ File not found: ${videoPath}`);
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const story = await client.fetch(`*[_id == $id][0]{_id, title}`, { id: docId });
if (!story) {
  console.error(`✖ No story with _id "${docId}"`);
  process.exit(1);
}

console.log(`Uploading ${path.basename(videoPath)} for "${story.title}"...`);
const asset = await client.assets.upload("file", createReadStream(videoPath), {
  filename: path.basename(videoPath),
});
await client.patch(docId).set({ hasVideo: true, videoUrl: asset.url }).commit();
console.log(`✓ Done. videoUrl: ${asset.url}`);

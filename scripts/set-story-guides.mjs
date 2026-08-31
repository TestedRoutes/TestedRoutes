#!/usr/bin/env node
/**
 * TestedRoutes — tag an inspire story with the guide(s) it sells for.
 *
 * Sets `relatedGuideSlugs` on the story doc and nothing else — a PATCH,
 * not createOrReplace, so carousel/cover/polarProductId and any Studio
 * edits survive (same posture as patch-affiliates.mjs). The story page
 * reads the tag as: one slug → pinned named CTA, several → "Guides for
 * this trip" list in the given order, none → country fallback.
 *
 * The authoring truth stays in the story's meta yaml (`guides:` list) —
 * publish-to-sanity.mjs writes the same field on a full republish. This
 * script exists because a full republish re-uploads assets and stomps
 * more than one field; tagging should be a one-field patch.
 *
 * Patches every doc sharing the slug's storyId (published + drafts +
 * translations), so a language version can't drift to different guides.
 *
 * Usage:
 *   npm run set:story-guides -- --story <story-slug> --guides slug-a,slug-b
 *   npm run set:story-guides -- --story <story-slug> --guides ""       # clear
 *   npm run set:story-guides -- --story <story-slug> --guides x --dry-run
 *
 * Guide slugs are validated against live guides (guide.pageSlug or story
 * slug). Unknown slugs abort — pass --allow-unpublished to tag a guide
 * that hasn't been published yet (check:inspire will keep flagging it
 * until the guide exists).
 */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/* ── env (matches patch-affiliates.mjs; `node --env-file` normally covers this,
      the manual load keeps `node scripts/…` invocations working too) ── */
function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = value;
    }
  }
}
loadEnvLocal();

function exit(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/* ── args ── */
const args = process.argv.slice(2);
function argValue(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
const STORY_SLUG = argValue("--story");
const GUIDES_ARG = argValue("--guides");
const DRY_RUN = args.includes("--dry-run");
const ALLOW_UNPUBLISHED = args.includes("--allow-unpublished");

if (!STORY_SLUG || GUIDES_ARG === undefined) {
  exit("Usage: --story <story-slug> --guides <slug,slug,...|\"\"> [--dry-run] [--allow-unpublished]");
}
const guideSlugs = GUIDES_ARG.split(",").map((s) => s.trim()).filter(Boolean);

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
if (!DRY_RUN && !TOKEN) exit("SANITY_API_WRITE_TOKEN is not set (required unless --dry-run)");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

async function main() {
  /* Validate the guide slugs against live guides before writing anything —
     a typo here would silently render as "tag matches nothing" on the page. */
  if (guideSlugs.length) {
    const liveGuides = await client.fetch(
      `*[_type == "story" && guide.hasGuide == true]{
        "pageSlug": coalesce(guide.pageSlug, slug.current), "slug": slug.current, title
      }`,
    );
    const known = new Set(liveGuides.flatMap((g) => [g.pageSlug, g.slug]));
    const unknown = guideSlugs.filter((s) => !known.has(s));
    if (unknown.length) {
      const msg = `No live guide matches: ${unknown.join(", ")}`;
      if (!ALLOW_UNPUBLISHED) exit(`${msg} (pass --allow-unpublished if the guide isn't published yet)`);
      console.warn(`⚠ ${msg} — writing anyway (--allow-unpublished)`);
    }
    for (const s of guideSlugs) {
      const g = liveGuides.find((x) => x.pageSlug === s || x.slug === s);
      console.log(`  guide: ${s}${g ? ` — ${g.title}` : " (unpublished)"}`);
    }
  } else {
    console.log("  guides: (clearing the tag)");
  }

  /* Every doc for this story: the slug match itself, plus anything sharing
     its storyId — drafts and translations included. */
  const bySlug = await client.fetch(
    `*[_type == "story" && slug.current == $slug]{_id, title, language, storyId, relatedGuideSlugs}`,
    { slug: STORY_SLUG },
  );
  if (!bySlug.length) exit(`No story doc has slug "${STORY_SLUG}"`);
  const storyIds = [...new Set(bySlug.map((d) => d.storyId).filter(Boolean))];
  const related = storyIds.length
    ? await client.fetch(
        `*[_type == "story" && storyId in $ids]{_id, title, language, storyId, relatedGuideSlugs}`,
        { ids: storyIds },
      )
    : [];
  const docs = [...new Map([...bySlug, ...related].map((d) => [d._id, d])).values()];

  for (const doc of docs) {
    const before = Array.isArray(doc.relatedGuideSlugs) ? doc.relatedGuideSlugs.join(", ") : "—";
    console.log(`\n${doc._id} (${doc.language || "en"}) — ${doc.title}`);
    console.log(`  relatedGuideSlugs: ${before} → ${guideSlugs.join(", ") || "—"}`);
    if (DRY_RUN) continue;
    if (guideSlugs.length) {
      await client.patch(doc._id).set({ relatedGuideSlugs: guideSlugs }).commit();
    } else {
      await client.patch(doc._id).unset(["relatedGuideSlugs"]).commit();
    }
    console.log("  ✓ patched");
  }
  if (DRY_RUN) console.log("\n(dry run — nothing written)");
  else console.log(`\n✓ Done. Mirror this in the story's meta yaml (guides: [${guideSlugs.join(", ")}]) so a republish keeps it.`);
}

main().catch((e) => exit(e.message || e));

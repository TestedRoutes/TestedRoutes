#!/usr/bin/env node
/**
 * One-shot seed + migration:
 *   1. Creates the 8 pricing tier documents (idempotent — won't overwrite).
 *   2. Assigns tiers to the existing 2 guides (Triftbrücke, Denali).
 *   3. Removes the legacy guide.price / guide.currency fields from those docs.
 *
 * After tiers exist, you maintain prices in Sanity Studio. Re-running this
 * script is safe — `createIfNotExists` skips existing tiers.
 *
 * Usage:
 *   npm run setup:pricing
 *   npm run setup:pricing -- --dry-run
 *
 * Env (from .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 */
import { createClient } from "next-sanity";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24";

if (!PROJECT_ID) exit("NEXT_PUBLIC_SANITY_PROJECT_ID is required");
if (!TOKEN && !DRY_RUN) exit("SANITY_API_WRITE_TOKEN is required (or pass --dry-run)");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: TOKEN,
});

/* ────────── tier seed data ────────── */

const TIERS = [
  {
    slug: "quick-trip",
    name: "Quick trip",
    displayOrder: 10,
    prices: [
      { currency: "EUR", amount: 2.99 },
      { currency: "USD", amount: 3.49 },
      { currency: "GBP", amount: 2.49 },
      { currency: "CHF", amount: 2.99 },
    ],
  },
  {
    slug: "day-trip",
    name: "Day trip",
    displayOrder: 20,
    prices: [
      { currency: "EUR", amount: 3.99 },
      { currency: "USD", amount: 4.49 },
      { currency: "GBP", amount: 3.49 },
      { currency: "CHF", amount: 3.99 },
    ],
  },
  {
    slug: "weekend-trip",
    name: "Weekend trip",
    displayOrder: 30,
    prices: [
      { currency: "EUR", amount: 7.99 },
      { currency: "USD", amount: 8.99 },
      { currency: "GBP", amount: 6.99 },
      { currency: "CHF", amount: 7.99 },
    ],
  },
  {
    slug: "week-guide",
    name: "Week guide",
    displayOrder: 40,
    prices: [
      { currency: "EUR", amount: 12.99 },
      { currency: "USD", amount: 13.99 },
      { currency: "GBP", amount: 10.99 },
      { currency: "CHF", amount: 12.99 },
    ],
  },
  {
    slug: "multi-week",
    name: "Multi-week",
    displayOrder: 50,
    prices: [
      { currency: "EUR", amount: 15.99 },
      { currency: "USD", amount: 17.99 },
      { currency: "GBP", amount: 13.99 },
      { currency: "CHF", amount: 15.99 },
    ],
  },
  {
    slug: "rally",
    name: "Rally",
    displayOrder: 60,
    prices: [
      { currency: "EUR", amount: 39.0 },
      { currency: "USD", amount: 42.0 },
      { currency: "GBP", amount: 33.0 },
      { currency: "CHF", amount: 39.0 },
    ],
  },
  {
    slug: "expedition",
    name: "Expedition",
    displayOrder: 70,
    prices: [
      { currency: "EUR", amount: 99.0 },
      { currency: "USD", amount: 109.0 },
      { currency: "GBP", amount: 84.0 },
      { currency: "CHF", amount: 99.0 },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    displayOrder: 80,
    // Premium has empty prices — guides on this tier MUST set customPrices.
    prices: [],
  },
];

/* ────────── existing-guide tier assignments ────────── */

// Story `slug.current` (NOT `guide.pageSlug`). Triftbrücke's slug is
// `triftbrucke-from-zurich`; the site shows it under `/guides/trift-bridge-from-zurich`
// because `guide.pageSlug` is set on the doc.
const GUIDE_TIER_ASSIGNMENTS = [
  { storySlug: "triftbrucke-from-zurich", tierSlug: "day-trip" },
  { storySlug: "denali-west-buttress-2022", tierSlug: "expedition" },
];

/* ────────── execution ────────── */

async function seedTiers() {
  console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}Seeding ${TIERS.length} pricing tiers…`);
  for (const tier of TIERS) {
    const _id = `pricingTier-${tier.slug}`;
    const doc = {
      _id,
      _type: "pricingTier",
      name: tier.name,
      slug: { _type: "slug", current: tier.slug },
      displayOrder: tier.displayOrder,
      prices: tier.prices.map((p) => ({
        _type: "priceEntry",
        _key: randomKey(),
        currency: p.currency,
        amount: p.amount,
      })),
    };
    if (DRY_RUN) {
      console.log(
        `  • ${tier.slug.padEnd(14)} ${tier.prices.length ? `${tier.prices.length} prices` : "manual"}`,
      );
      continue;
    }
    const result = await client.createIfNotExists(doc);
    const created = result._createdAt === result._updatedAt;
    console.log(
      `  ${created ? "✓ created" : "= exists "} ${tier.slug.padEnd(14)} ${tier.prices.length ? `(${tier.prices.length} prices)` : "(manual)"}`,
    );
  }
}

async function migrateExistingGuides() {
  console.log(
    `\n${DRY_RUN ? "[DRY RUN] " : ""}Assigning tiers to ${GUIDE_TIER_ASSIGNMENTS.length} existing guides…`,
  );
  for (const { storySlug, tierSlug } of GUIDE_TIER_ASSIGNMENTS) {
    const story = await client.fetch(
      `*[_type == "story" && slug.current == $slug][0]{ _id, "tier": guide.pricingTier->slug.current }`,
      { slug: storySlug },
    );
    if (!story?._id) {
      console.log(`  ! skipped ${storySlug}: not found in Sanity`);
      continue;
    }
    if (story.tier === tierSlug) {
      console.log(`  = already on ${tierSlug.padEnd(11)} ${storySlug}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`  → would set ${storySlug} → ${tierSlug} (drop legacy price/currency)`);
      continue;
    }
    await client
      .patch(story._id)
      .set({
        "guide.pricingTier": {
          _type: "reference",
          _ref: `pricingTier-${tierSlug}`,
        },
      })
      .unset(["guide.price", "guide.currency"])
      .commit();
    console.log(`  ✓ assigned  ${tierSlug.padEnd(11)} → ${storySlug}`);
  }
}

async function main() {
  console.log(`Sanity project ${PROJECT_ID} / ${DATASET}`);
  await seedTiers();
  await migrateExistingGuides();
  console.log("\nDone.\n");
}

function exit(msg) {
  console.error(`\n${msg}\n`);
  process.exit(1);
}

function randomKey() {
  return crypto.randomBytes(6).toString("hex");
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  process.exit(1);
});

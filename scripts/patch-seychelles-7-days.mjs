#!/usr/bin/env node
/**
 * Reposition the Seychelles guide from "a week / eight days" to "7 days"
 * (founder decision 2026-07-25: the product is 7 days / 7 nights and the
 * volume search term is "seychelles 7 day itinerary").
 *
 * The story slug stays `seychelles-1-week` — it is already wired into Polar
 * and the published page — while guide.pageSlug moves the public URL to
 * /guides/seychelles-7-days. loadGuideBySlug matches on either, so the old
 * URL keeps resolving and the canonical points at the new one.
 *
 * Usage: node --env-file=.env.local scripts/patch-seychelles-7-days.mjs
 */
import { createClient } from "next-sanity";
import crypto from "node:crypto";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-24",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(6).toString("hex");
const block = (text) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const TITLE = "Seychelles: four islands in 7 days";

const doc = await client.fetch('*[_id=="story-seychelles-1-week"][0]{primaryStats}');
const primaryStats = doc.primaryStats.map((s) =>
  s.label === "Duration" ? { ...s, value: "7 days, 7 nights" } : s,
);

await client
  .patch("story-seychelles-1-week")
  .set({
    title: TITLE,
    metaTitle: TITLE,
    eyebrow: "Seychelles · Island hopping · 7 days",
    subtitle:
      "7 days, 7 nights · Mahé, Praslin, Curieuse, La Digue · self-drive and ferries",
    durationDays: 7,
    durationDisplay: "7 days, 7 nights",
    primaryStats,
    // Chip on the Guides grid reads "Week"; the line beside it carries the
    // place and scope rather than the continent.
    journeyCategory: { _type: "reference", _ref: "category-journey-week" },
    "guide.pageSlug": "seychelles-7-days",
    "guide.cardLine": "Seychelles · 4 islands",
    metaDescription:
      "Four islands in seven days – Mahé, Praslin, Curieuse and La Digue: timed day plans, ferry timings, booking deadlines, hotel picks and real costs.",
    keywords: [
      "seychelles 7 day itinerary",
      "seychelles island hopping route",
      "seychelles one week itinerary",
      "mahe praslin la digue itinerary",
      "seychelles travel guide pdf",
    ],
    appearsInSearches: [
      "seychelles 7 day itinerary",
      "how many days do you need in Seychelles",
      "Seychelles itinerary without a tour",
      "Mahé Praslin La Digue ferry route",
    ],
    whyThisTrip: [
      "Most itineraries lock you to one resort island for a week – this route covers four islands in seven days without ever feeling rushed",
      "Every ferry, gate hour and booking deadline is already worked out, so you can book the whole trip in an evening",
      "Hotel and restaurant picks at three price levels on each island, from real visits",
      "The whole country runs on two ferry routes and a bicycle – no tour operator needed",
    ],
    body: [
      block(
        "Seven days, four islands. On paper it sounds like the kind of trip where you spend more time queuing for ferries than actually being anywhere. It was not – it is one of the best-paced trips we have done, and it never once felt rushed.",
      ),
      block(
        "We rode bicycles through the dark to reach the most photographed beach on earth before the sun did, and had four empty coves almost to ourselves while the granite turned from grey to gold to pink. We shared a beach with giant tortoises over a hundred years old, walked into the only forest where the coco de mer grows wild, and ate the best meal of the whole trip at a takeaway counter we reached by bike.",
      ),
      block(
        "What made it work was giving each island enough time to become itself – long enough on Mahé to drive the mountain roads and find the quiet beaches, long enough on Praslin for the jungle and the headline sand, and a proper couple of days on La Digue, which deserves them.",
      ),
      block(
        "This guide is that trip, rebuilt as the version I would book again – the same islands, the same mornings, the same tables, with everything we had to figure out already figured out.",
      ),
    ],
  })
  .commit();

console.log("patched story-seychelles-1-week:");
console.log(`  title       ${TITLE}`);
console.log("  url         /guides/seychelles-7-days (old slug still resolves)");
console.log("  duration    7 days, 7 nights");
console.log("  card line   Seychelles · 4 islands   (chip: Week)");

#!/usr/bin/env node
/**
 * One-shot (founder feedback round, 2026-07-24):
 *  - "Day plan" stat and hero day strip replaced by a plain Islands line
 *  - body ("My experience") rewritten from the inspire-story source texts:
 *    experiential only — no visit date, no guide internals (ferry timings,
 *    gate hours, tide notes stay behind the paywall)
 *
 * Usage: node --env-file=.env.local scripts/patch-seychelles-feedback-1.mjs
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

const doc = await client.fetch('*[_id=="story-seychelles-1-week"][0]{primaryStats}');
const stats = doc.primaryStats.map((s) =>
  s.label === "Day plan"
    ? { ...s, label: "Islands", value: "Mahé, Praslin, Curieuse, La Digue" }
    : s,
);

await client
  .patch("story-seychelles-1-week")
  .set({
    primaryStats: stats,
    "guide.dayStrip": "Islands: Mahé · Praslin · Curieuse · La Digue",
    body: [
      block(
        "Eight days, four islands. On paper it sounds like the kind of trip where you spend more time queuing for ferries than actually being anywhere. It was not – it is one of the best-paced trips we have done, and it never once felt rushed.",
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
console.log("patched: Islands stat, dayStrip, new experience body");

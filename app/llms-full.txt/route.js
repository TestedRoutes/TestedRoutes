/**
 * /llms-full.txt — the deep companion to /llms.txt (Tracker #67).
 *
 * llms.txt (hand-curated, in public/) is the map: what exists and where.
 * This file is the territory: the actual free content inlined as one
 * Markdown document, so an LLM can ingest the site in a single fetch
 * instead of crawling it. Included: every guide's sales-layer content
 * (the copy already free on its page — never the paid PDF), and every
 * Inspire story's full text (free content by design). Destination hubs
 * are hand-built pages, so they appear as links, not inline bodies.
 *
 * Generated from the same shaped catalogue the pages render, so it can
 * not drift from the site. Served with hourly revalidation on top of the
 * tagged Sanity data cache.
 */
import { loadGuides } from "../_lib/loadGuides";
import { loadInspireStories } from "../_lib/loadInspireStories";
import { VISIBLE_DESTINATION_SLUGS } from "../_lib/destinations";

export const revalidate = 3600;

const SITE = "https://testedroutes.com";

function guideSection(g) {
  const meta = g.metadata || {};
  const lines = [
    `## ${g.title}`,
    "",
    `URL: ${SITE}${g.href}`,
    `Type: paid guide (PDF + companion map)${g.duration ? ` · Duration: ${g.duration}` : ""}${g.price ? ` · Price: ${g.price}` : ""}`,
  ];
  const desc = meta.seo?.meta_description || meta.hero?.subtitle;
  if (desc) lines.push("", desc);
  const sales = g.salesPage || {};
  if (Array.isArray(sales.faq) && sales.faq.length) {
    lines.push("", "### Questions this guide answers");
    for (const f of sales.faq) {
      if (f?.question && f?.answer) lines.push("", `**${f.question}**`, "", f.answer);
    }
  }
  // The story body is the free on-page narrative, not the paid PDF.
  if (g.storyContent) lines.push("", g.storyContent.trim());
  return lines.join("\n");
}

function storySection(s) {
  const lines = [
    `## ${s.title}`,
    "",
    `URL: ${SITE}/inspire/${s.slug}`,
  ];
  const geo = s.metadata?.geography || {};
  const when = s.date ? ` · Published: ${s.date}` : "";
  lines.push(`Type: free story${geo.country ? ` · ${geo.country}` : ""}${when}`);
  if (s.storyContent) lines.push("", s.storyContent.trim());
  return lines.join("\n");
}

export async function GET() {
  const [guides, stories] = await Promise.all([loadGuides(), loadInspireStories()]);

  const doc = [
    "# TestedRoutes — full content",
    "",
    "> Printable PDF travel guides built from trips actually taken: an hour-by-hour plan, the bookings that gate the trip, honest costs, and a companion Google map. Skip the research. Take the trip.",
    "",
    "This file inlines the site's free content for LLM ingestion. The curated map",
    "of the site lives at https://testedroutes.com/llms.txt. What \"tested\" means:",
    "routes are grounded in the founder's own travel, and every venue, timing,",
    "fare and opening hour is verified against the operator before it ships.",
    "Guides state costs per person based on two people sharing, and durations",
    "never count the departure day (eight days on the ground is a \"7 Days\"",
    "guide). Each guide below shows its free sales-layer content; the paid PDF",
    "carries the hour-by-hour plan.",
    "",
    "Free destination hubs (hand-built pages, read them at their URLs):",
    // Derived from the registry so hidden hubs drop out and new hubs join
    // without anyone remembering this line exists.
    `${SITE}/destinations — plus ${VISIBLE_DESTINATION_SLUGS.map((s) => `/destinations/${s}`).join(", ")}.`,
    "",
    "# Guides (paid PDFs — free sales content below)",
    "",
    guides.map(guideSection).join("\n\n---\n\n"),
    "",
    "# Inspire (free stories, full text)",
    "",
    stories.map(storySection).join("\n\n---\n\n"),
    "",
  ].join("\n");

  return new Response(doc, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

# TestedRoutes — Partner Onboarding

Welcome. This guide walks you through publishing stories and guides on **testedroutes.com**. Once you've accepted the Sanity invite and logged in, you should be able to publish a full story in under an hour.

---

## Table of contents

1. [What you'll be doing](#what-youll-be-doing)
2. [Getting access](#getting-access)
3. [Tour of Sanity Studio](#tour-of-sanity-studio)
4. [Preparing a story offline (before opening Studio)](#preparing-a-story-offline-before-opening-studio)
5. [Creating your first story in Studio](#creating-your-first-story-in-studio)
6. [Adding photos](#adding-photos)
7. [Turning a story into a sellable guide](#turning-a-story-into-a-sellable-guide)
8. [Publishing and previewing](#publishing-and-previewing)
9. [Editing or unpublishing later](#editing-or-unpublishing-later)
10. [Conventions and things to avoid](#conventions-and-things-to-avoid)
11. [Troubleshooting](#troubleshooting)
12. [Reference: field glossary](#reference-field-glossary)

---

## What you'll be doing

TestedRoutes has two content types that live on the public site:

- **Inspire stories** (`testedroutes.com/inspire/<slug>`) — travel stories, personal accounts, photo essays. Every trip starts as a story.
- **Guides** (`testedroutes.com/guides/<slug>`) — stories that also include a paid PDF travel guide. Guides appear both on `/inspire` (as the story) and on `/guides` (as the purchasable guide).

**Key idea: a guide is just a story with a "Has guide" flag turned on.** You don't create two documents — you create one story and optionally attach guide details.

---

## Getting access

1. Check your email for a message from **Sanity** titled something like *"You're invited to the TestedRoutes project"*
2. Click the invite link
3. Create a Sanity account (or sign in if you already have one) — you can use Google / GitHub / email-password sign-up
4. You'll land in Studio at: **https://testedroutes.vercel.app/studio**
5. Bookmark that URL — it's where you'll work from now on

If the invite link expired or you can't find the email, ask Paulius to re-send it from https://www.sanity.io/manage/project/y3gc8dx6/members.

**Your role is "Editor":** you can create, edit, and publish all content. You cannot change project settings, billing, or invite other people. If you need any of that, ping Paulius.

---

## Tour of Sanity Studio

When you log in, you see a three-panel layout:

- **Left sidebar:** content type shortcuts — your entry points
- **Middle panel:** a list of documents in whichever section you picked
- **Right panel:** the currently-open document's editing form

### The left sidebar items you'll use most

| Section | What lives here |
|---|---|
| **Stories** | Every story — drafts and published. This is where you'll spend most of your time. |
| **Guides only** | Filtered view of stories where "Has guide" is turned on. Good for checking what's for sale. |
| **Drafts** | Stories that haven't been published yet. If you start writing something but aren't ready to publish, it goes here. |
| **Needs attention** | Stories flagged as needing review (by any editor). |
| **Destinations** | Countries and regions. You'll pick one when writing a story, and can create new ones if you visit somewhere that isn't in the list yet. |
| **Collections** | Editorial groupings like "Switzerland", "7 Summits", "Day Trips". A story can belong to one or many collections. |
| **Categories** | Journey types (day trip, expedition, road trip) + activity types (hiking, diving, climbing). |
| **Authors** | The byline list. Before writing your first story, create yourself here. |

### Top-right controls in the document view

- **Publish button** — pushes the current version live. Until you click this, nothing appears on the site.
- **Three-dot menu** — access version history, revert to an earlier version, delete, duplicate
- **Unpublish** — take a document off the live site without deleting it (you can republish later)

### Top-left search bar

Searches every document's title and body. Useful for finding existing stories to edit.

---

## Preparing a story offline (before opening Studio)

Prepare the slow-to-create pieces offline so your Studio time is just copy-paste + upload + structure.

### 1. Write the prose in a text app

Use anything you're comfortable with:

- **Apple Notes, Google Docs, Notion, Microsoft Word, plain text file** — all fine
- Write freely — no formatting needed beyond paragraph breaks and maybe a heading or two

Aim for **300–1500 words** depending on the story. The Triftbrücke existing story is about 230 words; the Denali story is 1200 words. Both work on the site.

**Style notes for TestedRoutes:**
- First-person POV ("I did the climb", "we drove")
- Specific details (real timings, real costs, real mistakes)
- Short paragraphs (2–4 sentences each)
- Plain language, no travel-blog clichés ("enchanting", "hidden gem", "unforgettable")

### 2. Organize your photos

Pick photos that earn their place — 5–15 is usually the sweet spot for a story.

- **One hero photo** — landscape format, wide, ideally shows the most iconic moment. Can be phone-camera or DSLR.
- **Gallery photos** — the rest. Any format (landscape, portrait, square) works.

**Filename hint:** naming them `01-arrival.jpg`, `02-trail.jpg`, `03-summit.jpg` etc. helps you remember the order, and you can just upload them in that order.

**No need to resize or compress.** Upload at original phone/camera resolution. Sanity handles all web optimization automatically.

**File size:** up to ~20MB per image is fine. A typical 12MP phone photo (3–8MB) works perfectly.

### 3. Decide on structured data

Have quick answers ready for:
- Country/region (will be a dropdown in Studio)
- Duration (e.g. "3 days", "half a day")
- Difficulty (easy / moderate / hard / very hard / extreme)
- Rough budget (cheap / moderate / expensive / luxury)
- What month/season is best

You'll fill these in Studio — they're mostly dropdowns and booleans.

### 4. If this story will have a paid PDF guide

Also prepare:
- The **PDF file itself** (finalized, ready to sell)
- A **price** (in EUR, USD, GBP, or CHF)
- "Why this trip" — 3–5 bullet points (sales hook)
- "Who this is for" — 3–5 bullet points
- "What you get" — 4–8 bullets describing what's inside the PDF
- "Difficulty at a glance" — 3–5 bullets

These are the sales-pitch fields on the guide landing page.

---

## Creating your first story in Studio

### Step 1: Create your Author document

Before your first story:

1. Click **Authors** in the left sidebar
2. Click the **+ (plus)** button at the top to create a new author
3. Fill in:
   - **Name** — your full name
   - **Slug** — autogenerated from your name, leave as-is unless you want something different
   - **Role** — pick **Partner**
   - **Avatar** — upload a photo of yourself (optional but nice for bylines)
   - **Short bio** — 1–3 sentences for the byline
   - **Location** — where you're based (e.g. "Zurich, Switzerland")
   - **Social links** — optional Instagram, YouTube, etc.
4. Click **Publish** (top-right)

You only need to do this once. All your future stories will reference this author.

### Step 2: Create a new Story

1. Click **Stories** in the left sidebar
2. Click **+ (plus)** at the top → **Create new Story**
3. You'll see tabs at the top of the form: **Content / Location / Details / Commerce / Classification / SEO / Relationships / Internal**

### Step 3: Fill the Content tab

The Content tab is what most stories need. Go through these fields top to bottom:

| Field | What to enter |
|---|---|
| **Title** | The story's headline, e.g. "Triftbrücke from Zurich" |
| **Slug** | Auto-generated from title — leave alone. This becomes the URL. |
| **Story ID** | Optional stable internal ID like `switzerland-triftbrucke-2020`. Use format `country-subject-year` if possible. |
| **Status** | Leave as **Draft** while writing. Change to **Published** when ready (or just click Publish later). |
| **Language** | `en` (English). Other options exist but aren't live on the site yet. |
| **Published date** | The date of the trip itself, not today. Used for chronological sorting. |
| **Last updated** | Leave blank — Sanity updates it when you publish. |
| **Author** | Pick yourself from the dropdown. |
| **Eyebrow** | Small uppercase label above the title on the page, e.g. `SWITZERLAND • DAY TRIP • HIKING` |
| **Subtitle** | One or two sentences shown under the title. The "hook". |
| **Hero image** | Upload the main photo. After upload, click the photo in Studio and drag the **green dot** to the most important subject (the "hotspot") — this tells Sanity to always keep that subject in-frame on mobile and thumbnails. Also add **Alt text** describing the photo for screen readers. |
| **Primary stats** | 3–6 at-a-glance stats shown with the hero. Each is a label + value, e.g. `Duration` → `1 day`. Use the **+ Add item** button. |
| **Body** | The story prose. See next section for details. |
| **Gallery (outside body)** | Extra photos that appear at the bottom of the story page, not inline with prose. Drag photos in; alt text is required. |

### Step 4: Write the body

The body is a rich editor — like Google Docs. Paste the prose you prepared offline into it.

**Formatting you can use:**
- **H2 / H3 headings** (from the style dropdown at top of the editor)
- **Bullet lists / numbered lists**
- **Bold, italic, inline code** (keyboard shortcuts work: Ctrl+B, Ctrl+I)
- **Links** — select text, click the link icon, paste URL
- **Block quotes** (style → Quote)

**Special content blocks you can drop in mid-body** (look for the **+** icon between paragraphs):
- **Image** — a single photo placed inline with prose
- **Gallery grid** — a row or grid of 2+ photos
- **Map** — an interactive map with pins (route waypoints, single points)
- **Stat block** — a row of at-a-glance stats mid-story
- **Callout** — a colored box for a tip, warning, insider secret, etc.
- **Pull quote** — a large emphasized quote

### Step 5: Fill the Location tab

- **Destination** — pick a country from the dropdown. If the country isn't listed, click **+ Create new** to add it (name, continent, short description, hero photo).
- **Regions** — optional specific regions within the country, e.g. `["Bern", "Bernese Oberland"]`
- **Nearest major city** — for trip planning context
- **Coordinates** — click the map picker to drop a pin at the central location of your trip
- **Starting point** — if different from the trip location (e.g. "Trailhead name" + coordinates)

### Step 6: Fill the Details tab

This tab has collapsible sections. Open and fill whichever apply:

- **Difficulty** — overall level, fitness required, technical skill, elevation gain, distance, etc.
- **Suitability** — family friendly, solo friendly, beginner friendly, recommended age, ideal group size
- **Timing** — duration in days/hours, best months, best seasons, weather dependency
- **Logistics** — transportation, accommodation, permits, equipment
- **Budget** — rough cost range, what to expect in each bucket (transport/food/etc.)
- **Differentiation** — unique selling points, what makes this trip special, scenic rating, adrenaline level

Don't worry about filling every field — Sanity hides empty fields on the live page. Fill what's honest.

### Step 7: Fill the Classification tab

- **Primary collection** — pick one, e.g. "Switzerland" or "7 Summits"
- **All collections** — optional additional collections (cross-tagging)
- **Journey category** — pick one, e.g. "Day trip" or "Expedition"
- **Activity category** — pick one, e.g. "Outdoor hiking" or "Mountain climbing"
- **Activity tags** — free-form tags used for search, e.g. `["suspension bridge hike", "alpine day hike"]`
- **Highlights** — bullet points of the best moments

### Step 8: Fill the SEO tab (if you care about search visibility)

- **Meta title** — what Google shows as the page title (max ~70 chars)
- **Meta description** — the snippet under the title in search results (max ~160 chars)
- **Keywords** — array of relevant search terms

If you skip this, the site falls back to the story title + subtitle — not ideal for SEO but acceptable.

### Step 9: Skip (or read) the Internal tab

Fields here are **admin-only**: maintenance notes, credibility facts, route coordinates, quality scores. You can fill them if you want, but they don't appear on the live page. Paulius uses them for content review.

---

## Adding photos

### Upload mechanics

- Drag-and-drop into any image field, OR click the field and pick from your computer
- Photos upload to Sanity's CDN automatically — no pre-processing needed
- Up to ~20MB per photo is fine (modern phone photos are 3–8MB)

### The hotspot (critical)

After uploading, **click the image thumbnail in Studio** to open the image editor. You'll see a **green dot** on the photo.

- **Drag the dot** to the subject of the photo (the face, the summit, the bridge — whatever the eye should land on)
- This tells Sanity: when you crop this for a thumbnail, a hero banner, or a mobile card, **always keep this point in-frame**
- Without setting a hotspot, Sanity uses the center of the photo by default — often wrong for travel shots

### Alt text (required on every photo)

The **Alt text** field is mandatory. It's what screen readers say aloud and what shows if the image fails to load. Write a short description:

- ✅ `Trift suspension bridge stretching across a rocky alpine gorge with snow-covered mountains behind`
- ❌ `bridge.jpg`
- ❌ `Picture of Switzerland`

Good alt text also helps SEO — Google reads it to understand what the image is.

### Caption (optional)

The **Caption** field shows under the image on the page. Use sparingly — only when the photo needs context the prose doesn't provide.

---

## Turning a story into a sellable guide

If this story has a **paid PDF guide** attached:

1. Go to the **Commerce** tab of the story
2. Under **Guide**, turn **Has guide** ON
3. Fill in:
   - **Guide status** — pick `Available for purchase`
   - **Guide PDF** — upload the PDF file
   - **Price** — the number (e.g. `12.99`)
   - **Currency** — EUR / USD / GBP / CHF
   - **Format** — default is `PDF`; you can add others
   - **Guide page slug** — leave blank unless you need the `/guides/<slug>` URL to differ from the story's slug (rare)
4. Below the Guide section, **Sales pitch fields appear** (they were hidden while "Has guide" was off). Fill them:
   - **Why this trip** — 3–5 bullets of the hook
   - **Who this is for** — 3–5 bullets of the ideal buyer
   - **What you get** — 4–8 bullets describing the PDF's contents
   - **Difficulty at a glance** — 3–5 bullets
   - **Not suitable (sales)** — honest disqualifiers

Once saved + published, the story appears on **both** `/inspire/<slug>` (story view) **and** `/guides/<slug>` (guide landing page with "Get the Guide" button).

---

## Publishing and previewing

### How publishing works

- **Draft** = exists only in Studio, not on the live site. Auto-saved as you type — you never lose work.
- **Publish** button (top-right) = push this version to the live site. Takes effect in ~20 seconds.
- You can **unpublish** a story later (it disappears from the site but stays in Studio).

### How the live site updates

When you click Publish:
1. Sanity sends a webhook to the site
2. The site's cache is invalidated for the affected page
3. Within 20–30 seconds, the page regenerates with your changes
4. Anyone visiting the page now sees the new version

No manual deploys. No waiting for a build. Publish = live.

### Previewing before publish

Studio currently doesn't have a live preview window. To check how something looks:

- Publish the story — it appears at `https://testedroutes.vercel.app/inspire/<slug>`
- If something's wrong, fix and republish — the site updates in 30 seconds
- If it's very wrong, unpublish from Studio

**Tip for risk-averse edits:** create a duplicate story with "DRAFT" in the title, publish it, check, delete it once you're happy. Awkward but works.

### Checking what's live right now

- `/inspire` — all published stories
- `/guides` — all published stories where "Has guide" is on
- `/inspire/<slug>` — individual story
- `/guides/<slug>` — individual guide landing page

---

## Editing or unpublishing later

### Editing a published story

1. Open the story in Studio
2. Make changes — Studio auto-saves your draft
3. Click **Publish** — live site updates in ~30 seconds

### Unpublishing (taking off the site without deleting)

1. Open the story
2. Three-dot menu (top-right) → **Unpublish**
3. Confirm

The story stays in Studio as a draft. Re-publish anytime.

### Viewing version history

Every edit is tracked.

1. Open the story
2. Three-dot menu → **Review changes** or **History**
3. See every saved version with timestamps
4. Revert to any earlier version

### Deleting a story permanently

1. Three-dot menu → **Delete**
2. Confirm

**This is irreversible.** Use unpublish instead if you're unsure.

---

## Conventions and things to avoid

### Do

- ✅ Create a new **destination** / **collection** / **category** document if the one you need doesn't exist
- ✅ Reference yourself as the **author** on every story you write
- ✅ Fill **alt text** on every image (it's required, Studio will warn you)
- ✅ Set the **hotspot** on hero images — phone users will thank you
- ✅ Keep story **slugs** in lowercase-hyphenated format (Studio does this by default)
- ✅ Ask Paulius if unsure about a structural change (new schema field, etc.)

### Don't

- ❌ Edit other people's author documents
- ❌ Delete destinations / collections / categories that other stories reference (Studio will warn you — if it does, stop and ask)
- ❌ Change a story's **slug** after publishing — this breaks any external links to it. If you really need to change the URL, ask Paulius first.
- ❌ Upload videos (not yet supported in the schema — we'll add this if/when needed)
- ❌ Fill the **Internal** tab with info meant to be public — those fields are for admin review only

---

## Troubleshooting

### "I published but don't see my story on the site"

1. Wait 30 seconds and hard-refresh the page (Ctrl+F5 / Cmd+Shift+R)
2. Check the story's **Status** field — must be `Published`, not `Draft`
3. Check the URL — does it match `/inspire/<your-slug>`? The slug is in the story's Slug field.
4. If still broken after 2 minutes, ping Paulius — likely a webhook delivery issue

### "I accidentally deleted something"

- If you deleted a **story** that was published: open Sanity dashboard → history tab → your change should be restorable
- If you deleted a **draft** you were writing: drafts are saved every few seconds; check Drafts list — might still be there

### "Studio is showing an error / won't load"

- Hard-refresh (Ctrl+F5 / Cmd+Shift+R)
- Try an incognito window
- Log out and back in
- If still broken, ping Paulius with a screenshot of the error

### "My image upload is stuck"

- Check your file size — Sanity times out around 20–30MB. Re-export smaller if needed.
- Check your internet — large phone photos on slow hotel wifi will fail
- Try dragging from Finder/Explorer instead of clicking the upload button, or vice versa

### "I can't find which story has a particular slug"

- Use the top search bar in Studio
- Or browse the **Stories** list and scroll
- Or sort by "Last updated" in the list view

---

## Reference: field glossary

### Story document — every field

#### Content tab
- `Title` — public-facing headline
- `Slug` — URL path, lowercase-hyphenated
- `Story ID` — stable internal identifier
- `Status` — Draft / Published / Archived
- `Language` — en / de / lt
- `Published date` — date of the trip itself (sort key)
- `Last updated` — auto-set by Sanity
- `Author` → reference to an Author document
- `Eyebrow` — small label above title
- `Subtitle` — 1–2 sentence hook
- `Hero image` — main banner photo
- `Primary stats` — 3–6 `{label, value}` pairs shown with hero
- `Body` — rich prose with inline blocks
- `Gallery (outside body)` — extra photos for a bottom-of-page grid
- `Has video` / `Video URL` — optional

#### Location tab
- `Destination` → reference to Destination
- `Regions` — array of strings
- `Nearest major city`, `Distance from city (km)`
- `Coordinates` — central GPS point
- `Starting point` — `{name, type, coordinates}`

#### Details tab
- Difficulty group: level, fitness, skill, elevation, altitude, distance, factors, disqualifiers
- Suitability group: family/solo/beginner/wheelchair friendly, min age, group size, audiences
- Timing group: days, hours, display, best months/seasons, avoid months, weather dependency
- Logistics group: transport, accommodation, permits, bookings, equipment
- Budget group: level, estimated cost range, cost breakdown, money-saving tips
- Differentiation group: unique selling points, crowd level, scenic rating, adrenaline level

#### Commerce tab
- `Guide` object: hasGuide, status, PDF file, price, currency, format, page slug
- Sales pitch (visible only when Has guide is on): why this trip, who this is for, what you get, difficulty at a glance, not suitable

#### Classification tab
- `Primary collection`, `All collections` — references
- `Journey category`, `Activity category` — references
- `Activity tags` — free-form strings
- `Journey style` — self-guided / guided / mixed
- `Highlights` — array of strings

#### SEO tab
- `Meta title`, `Meta description`, `Keywords`
- `Search tags`, `Search synonyms`, `Alternative names`, `Appears in searches`

#### Relationships tab
- `Similar stories`, `Combine with` — references to other stories
- `Combine description` — free text

#### Internal tab (admin-only)
- Credibility: times completed, most recent completion, tested by, verified facts, common mistakes, insider tips
- Route: mode, map zoom, route points
- Maintenance: last verified, verification frequency, next update due, route status, quality score, needs attention, attention notes
- `Featured on homepage` / `Feature priority`

---

## Questions?

Ping Paulius directly. If you're stuck for more than 10 minutes on something that should be obvious, it's probably a bug or unclear documentation — don't suffer in silence.

Once you've published your first few stories, you'll barely need this doc. The tabs become muscle memory fast.

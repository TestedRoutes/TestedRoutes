/**
 * Serves reader day photos — paid imagery that must not live on the public
 * Sanity CDN (the whole reason the private store exists). Entitlement is the
 * same cookie the reader set; the one exception is the sample day's photo,
 * which is marketing and serves ungated so /preview renders for everyone.
 *
 * Source of the bytes, for now: the guide's content folder on disk
 * (content/countries/<c>/guides/<slug>/generated/web-reader/), which exists
 * locally but is gitignored — so on a Vercel deploy these 404 until the
 * files move to private Blob storage (the planned home; this route then
 * swaps its read, keeping the URL shape). Local-first is deliberate: the
 * founder QAs the reader on this machine before anything deploys.
 */
import { readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { requireGuideAccess } from "../../../../_lib/guideAccess";
import { loadSampleDay } from "../../../../../db/loadSku";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAFE = /^[a-z0-9][a-z0-9._-]{0,80}$/i;
const COUNTRIES = path.join(process.cwd(), "content", "countries");

function findPhotoDir(slug) {
  if (!existsSync(COUNTRIES)) return null;
  for (const country of readdirSync(COUNTRIES)) {
    const dir = path.join(COUNTRIES, country, "guides", slug, "generated", "web-reader");
    if (existsSync(dir)) return dir;
  }
  return null;
}

export async function GET(request, { params }) {
  const { slug, file } = await params;
  if (!SAFE.test(slug) || !SAFE.test(file) || file.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  let entitled = Boolean(await requireGuideAccess(slug));
  if (!entitled) {
    const sample = await loadSampleDay(slug).catch(() => null);
    entitled = Boolean(sample && sample.day.photoRef === file);
  }
  if (!entitled) return new Response("Not found", { status: 404 });

  const dir = findPhotoDir(slug);
  if (!dir) return new Response("Not found", { status: 404 });
  const full = path.join(dir, file);
  if (!full.startsWith(dir)) return new Response("Not found", { status: 404 });

  let bytes;
  try {
    bytes = await readFile(full);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      // Private: the browser may keep it for the session, shared caches may not.
      "Cache-Control": "private, max-age=3600",
    },
  });
}

/**
 * Reader access for the PROTOTYPE: one shared preview key, not purchase
 * tokens. This is deliberate and temporary. The founder's decision
 * (2026-09-20) is to see a working reader on a phone before anything about
 * billing or the public site changes, so the gate here must involve neither:
 * no purchase docs, no Polar, no PURCHASE_TOKEN_SECRET.
 *
 * When the reader goes live, this module is the swap point: hasReaderAccess()
 * becomes the requireGuideAccess of the architecture doc (verify the v1
 * purchase token → purchase doc exists and is not revoked → slug matches),
 * and /reader/unlock becomes the ?token= landing that moves the token into
 * the same httpOnly cookie. Pages never see either mechanism; they ask this
 * one question.
 *
 * The cookie carries an HMAC of the key rather than the key itself, so a
 * leaked cookie does not hand out the key, and rotating READER_PREVIEW_SECRET
 * invalidates every cookie at once with nothing else to clean up.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const PREVIEW_COOKIE = "tr_reader_preview";
const COOKIE_DAYS = 30;

function secret() {
  return process.env.READER_PREVIEW_SECRET || null;
}

/** True when the gate can work at all (env var present on this deploy). */
export function readerConfigured() {
  return Boolean(secret());
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a ?? ""));
  const bb = Buffer.from(String(b ?? ""));
  return ab.length === bb.length && ab.length > 0 && timingSafeEqual(ab, bb);
}

/** The value a valid cookie holds: HMAC of a fixed label under the key. */
function cookieValue() {
  return createHmac("sha256", secret()).update("reader-preview").digest("hex");
}

/** Does a key typed into the gate (or passed on the unlock link) match? */
export function keyMatches(key) {
  const s = secret();
  return Boolean(s) && safeEqual(key, s);
}

/** Cookie attributes for the unlock handler. Scoped to /reader on purpose. */
export function accessCookie() {
  return {
    name: PREVIEW_COOKIE,
    value: cookieValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/reader",
    maxAge: COOKIE_DAYS * 24 * 60 * 60,
  };
}

/** The one question pages ask. Async because cookies() is, in Next 15. */
export async function hasReaderAccess() {
  if (!readerConfigured()) return false;
  const jar = await cookies();
  return safeEqual(jar.get(PREVIEW_COOKIE)?.value, cookieValue());
}

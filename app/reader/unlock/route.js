/**
 * GET /reader/unlock?key=<preview key>&to=/reader/<slug>
 *
 * Turns the preview key into the access cookie and sends the visitor on.
 * The key appears in a URL exactly once (this request) and is then only
 * ever in the cookie's HMAC — the same one-hop pattern the live ?token=
 * landing will use, so the shape survives the swap to purchase tokens.
 *
 * `to` is constrained to the reader itself: an open redirect on a gate
 * would be a phishing gift, prototype or not.
 */
import { NextResponse } from "next/server";
import { accessCookie, keyMatches } from "../_lib/access";

export const dynamic = "force-dynamic";

function safeTarget(to) {
  const t = String(to || "");
  return /^\/reader\/[a-z0-9-]+(\/[A-Za-z0-9\/-]*)?$/.test(t) ? t : "/reader";
}

export async function GET(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const to = safeTarget(url.searchParams.get("to"));
  const res = NextResponse.redirect(new URL(to, url.origin), 303);
  if (keyMatches(key)) {
    res.cookies.set(accessCookie());
  } else {
    res.headers.set("x-reader-unlock", "denied");
  }
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

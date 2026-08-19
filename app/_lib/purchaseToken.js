/**
 * Signed purchase tokens — the identity foundation of the trust system
 * (Tracker #55). One token per purchase, minted when Polar confirms an
 * order, carried in the buyer's confirmation email forever. No accounts,
 * no login: possession of the token is the proof of purchase.
 *
 * Design constraints that shaped this:
 * - Stateless signature, stateful revocation. The HMAC proves the token
 *   came from us without a lookup; the purchase document in Sanity (id
 *   purchase-<orderId>) is what makes a single token revocable without
 *   rotating the secret for everyone. Both checks must pass.
 * - The dataset is publicly readable, so nothing minted here may contain
 *   or imply the buyer's email. The token payload is order id + guide
 *   slug + issue date only; the purchase doc stores an HMAC hash of the
 *   email (enough to answer "find purchases for this address" later by
 *   hashing the query), never the address itself. Plaintext email lives
 *   only in Polar and Beehiiv, where it already does.
 * - Tokens are permanent by promise ("always-current PDF"), so there is
 *   deliberately no expiry field. Revocation is the only kill switch.
 *
 * Format: v1.<base64url payload JSON>.<base64url HMAC-SHA256>
 * Env: PURCHASE_TOKEN_SECRET — high-entropy string; rotating it revokes
 * every token ever issued, so treat it like the Polar webhook secret.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const VERSION = "v1";

function secret() {
  const s = process.env.PURCHASE_TOKEN_SECRET;
  if (!s) throw new Error("PURCHASE_TOKEN_SECRET is not configured");
  return s;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

function sign(payloadB64) {
  return createHmac("sha256", secret()).update(`${VERSION}.${payloadB64}`).digest();
}

export function mintPurchaseToken({ orderId, slug }) {
  if (!orderId || !slug) throw new Error("mintPurchaseToken needs orderId and slug");
  const payloadB64 = b64url(
    JSON.stringify({ o: String(orderId), s: String(slug), t: Date.now() }),
  );
  return `${VERSION}.${payloadB64}.${b64url(sign(payloadB64))}`;
}

/**
 * Signature check only — the caller still has to confirm the purchase doc
 * exists and is not revoked. Returns { orderId, slug, issuedAt } or null;
 * never throws on malformed input (tokens arrive from query strings).
 */
export function verifyPurchaseToken(token) {
  try {
    const [version, payloadB64, sigB64] = String(token || "").split(".");
    if (version !== VERSION || !payloadB64 || !sigB64) return null;
    const expected = sign(payloadB64);
    const provided = Buffer.from(sigB64, "base64url");
    if (provided.length !== expected.length) return null;
    if (!timingSafeEqual(provided, expected)) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload?.o || !payload?.s) return null;
    return { orderId: payload.o, slug: payload.s, issuedAt: payload.t || null };
  } catch {
    return null;
  }
}

/**
 * Deterministic email digest for the purchase registry. Keyed with the
 * same secret so the public dataset carries no rainbow-table-able plain
 * SHA of the address.
 */
export function hashBuyerEmail(email) {
  return createHmac("sha256", secret())
    .update(String(email || "").trim().toLowerCase())
    .digest("hex");
}

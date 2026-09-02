/**
 * App-runtime database client (route handlers and server components).
 *
 * Uses the stateless HTTP driver: one fetch per query, no connection pool to
 * manage, safe under serverless concurrency. The trade-off is that neon-http
 * does not support interactive transactions — db.transaction() throws. That is
 * fine here because the app only reads; the one writer (publish-sku.mjs) needs
 * real transactions and therefore uses the WebSocket driver
 * (drizzle-orm/neon-serverless + Pool) inside the script instead of this module.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

let _db;

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }
    _db = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return _db;
}

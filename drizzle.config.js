import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env.local on its own (Next.js does; the kit is a
// standalone CLI). Node >=20.12 ships loadEnvFile, so pull it in here rather
// than requiring every db:* npm script to carry --env-file.
if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // No .env.local (CI, remote session) — the kit will fail loudly below
    // when it finds no DATABASE_URL, which is the right failure.
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.js",
  // Kept even though we use `push` day to day: switching to generate+migrate
  // later is then a workflow change, not a config change.
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
});

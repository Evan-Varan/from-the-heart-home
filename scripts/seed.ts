// Seed script — runs against a local D1 database via wrangler.
//
// HOW TO RUN:
//   1. Make sure you have created the local D1 database:
//        wrangler d1 migrations apply portal --local
//   2. Execute this script through wrangler's exec binding (when wrangler
//      supports direct script execution), or use a small wrangler worker stub.
//
// RECOMMENDED LOCAL WORKFLOW:
//   npx wrangler d1 execute portal --local --file=./scripts/seed.sql
//
// For programmatic use, import createDb + seed and call from a test setup
// or a Cloudflare Worker HTTP handler (e.g., GET /api/seed?secret=<SEED_SECRET>
// behind an admin guard — see spec 05 for admin server functions).
//
// NOTE: This script cannot import Workers-only modules (D1Database) at runtime
// outside the Workers runtime. The seed logic lives in src/portal/db/seed.ts
// and is designed to be called from within the Workers environment.

import { createDb } from "../src/portal/db/index";
import { seed } from "../src/portal/db/seed";

// This export is consumed by a Cloudflare Worker handler that has access to
// the D1 binding. It is not executable directly via Node.js.
export async function runSeed(d1: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createDb(d1 as any);
  await seed(db);
  console.log("Seed complete.");
}

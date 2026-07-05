// Database client factory for the portal.
// Pass the D1 binding (from env) into createDb — this avoids module-level
// singletons which don't work in Cloudflare Workers.

import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

export type DB = ReturnType<typeof createDb>;

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

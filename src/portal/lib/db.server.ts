// D1 database accessor for portal server functions.
// Requires Cloudflare Workers runtime — use `wrangler dev` locally, not `npm run dev`.
import { env as cfEnv } from "cloudflare:workers";
import { createDb } from "@/portal/db";

export function getDb() {
  const d1 = cfEnv["DB"];
  if (!d1) {
    throw new Error(
      "D1 binding (DB) is not configured. Add the d1_databases binding to wrangler.jsonc and run `wrangler dev` for local development."
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createDb(d1 as any);
}

// Ambient type declaration for the cloudflare:workers native module.
// Available in Cloudflare Workers runtime (production and wrangler dev).
// Not available in the Vite dev server (npm run dev) — use wrangler dev for D1 features.
declare module "cloudflare:workers" {
  const env: Record<string, unknown>;
  export { env };
}

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

// In dev (npm run dev), cloudflare:workers is unavailable in Node.js.
// This plugin stubs the module and uses wrangler's getPlatformProxy to wire up real D1
// bindings so portal server functions work normally without switching to `wrangler dev`.
const cloudflareWorkerDevStub: Plugin = {
  name: "cloudflare-workers-dev-stub",
  apply: "serve",
  async configureServer(server) {
    try {
      const { getPlatformProxy } = await import("wrangler");
      const proxy = await getPlatformProxy({ persist: true });
      // Store bindings on globalThis so the stub module can reach them across
      // Vite's SSR module isolation boundary.
      (globalThis as Record<string, unknown>).__cfDevEnv = proxy.env;
      server.httpServer?.once("close", () => void proxy.dispose());
    } catch (err) {
      console.warn(
        "[portal] Cloudflare platform proxy unavailable — D1 calls will fail in dev.",
        err,
      );
    }
  },
  resolveId(id) {
    if (id === "cloudflare:workers") return "\0cloudflare:workers-stub";
  },
  load(id) {
    if (id === "\0cloudflare:workers-stub") {
      // globalThis.__cfDevEnv is populated by configureServer above.
      return `export const env = (globalThis).__cfDevEnv ?? {};`;
    }
  },
};

export default defineConfig({
  vite: {
    plugins: [cloudflareWorkerDevStub],
  },
});

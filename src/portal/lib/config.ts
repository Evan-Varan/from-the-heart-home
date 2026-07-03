// Client-safe config. Only values that are safe to expose in the browser.
// Set VITE_* vars in .dev.vars (local) or wrangler.jsonc vars (production).

export function getPublicConfig() {
  return {
    siteUrl: import.meta.env.VITE_PUBLIC_SITE_URL ?? "https://fromthehearttutoring.com",
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined,
  };
}

export type PublicConfig = ReturnType<typeof getPublicConfig>;

// Server-only — never import this file from client/browser code.

declare const process: { env: Record<string, string | undefined> };

function env(key: string): string | undefined {
  return process.env[key];
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export function getServerConfig() {
  return {
    appEnv: env("APP_ENV") ?? "development",
    siteUrl: env("PUBLIC_SITE_URL") ?? "https://fromthehearttutoring.com",

    resend: {
      apiKey: requireEnv("RESEND_API_KEY"),
      fromEmail:
        env("RESEND_FROM_EMAIL") ?? "From the Heart Tutoring <info@fromthehearttutoring.com>",
      contactToEmail: env("CONTACT_TO_EMAIL") ?? "info@fromthehearttutoring.com",
    },

    stripe: {
      secretKey: env("STRIPE_SECRET_KEY"),
      webhookSecret: env("STRIPE_WEBHOOK_SECRET"),
      publishableKey: env("STRIPE_PUBLISHABLE_KEY"),
    },

    twilio: {
      accountSid: env("TWILIO_ACCOUNT_SID"),
      authToken: env("TWILIO_AUTH_TOKEN"),
      fromPhone: env("TWILIO_FROM_PHONE"),
    },

    auth: {
      secret: env("AUTH_SECRET"),
    },
  };
}

export type ServerConfig = ReturnType<typeof getServerConfig>;

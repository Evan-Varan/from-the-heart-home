import { createStart } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

declare const process: {
  env: Record<string, string | undefined>;
};

const hasClerkServerConfig = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY,
);

export const startInstance = createStart(() => ({
  requestMiddleware: hasClerkServerConfig ? [clerkMiddleware()] : [],
}));

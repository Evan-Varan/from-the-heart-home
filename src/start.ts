import { createMiddleware, createStart } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

declare const process: {
  env: Record<string, string | undefined>;
};

const hasClerkServerConfig = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY,
);

const portalAuthMiddleware = createMiddleware().server(async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.searchParams.has("__clerk_handshake") && !url.pathname.startsWith("/portal")) {
    url.pathname = "/portal";
    throw new Response(null, {
      status: 307,
      headers: { Location: url.toString() },
    });
  }

  if (!url.pathname.startsWith("/portal")) {
    return next();
  }

  return clerkMiddleware()(request, next);
});

export const startInstance = createStart(() => ({
  requestMiddleware: hasClerkServerConfig ? [portalAuthMiddleware] : [],
}));

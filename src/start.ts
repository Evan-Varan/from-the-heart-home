import { createStart } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

declare const process: { env: Record<string, string | undefined> };

export const startInstance = createStart(() => {
  const hasClerkKeys = Boolean(
    process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY,
  );

  if (!hasClerkKeys) {
    return { requestMiddleware: [] };
  }

  return {
    requestMiddleware: [
      clerkMiddleware(({ url }) => {
        // Redirect __clerk_handshake to /portal on non-portal pages so the
        // marketing site never processes Clerk's cross-domain handshake directly.
        if (
          url.searchParams.has("__clerk_handshake") &&
          !url.pathname.startsWith("/portal")
        ) {
          const dest = new URL(url);
          dest.pathname = "/portal";
          throw new Response(null, {
            status: 307,
            headers: { Location: dest.toString() },
          });
        }
        return {};
      }),
    ],
  };
});

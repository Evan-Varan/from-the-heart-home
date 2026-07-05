import { createMiddleware, createStart } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

declare const process: { env: Record<string, string | undefined> };

// Catches Clerk HTTPErrors (e.g. cross-domain handshake rejection) and redirects
// to /portal/login instead of 500ing. Happens when dev keys are used on a
// production domain — real fix is a Clerk production instance with live keys.
const clerkErrorGuard = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    try {
      return await next();
    } catch (error) {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/portal")) {
        return new Response(null, {
          status: 307,
          headers: { Location: "/portal/login" },
        });
      }
      throw error;
    }
  },
);

export const startInstance = createStart(() => {
  const hasClerkKeys = Boolean(
    process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY,
  );

  if (!hasClerkKeys) {
    return { requestMiddleware: [] };
  }

  return {
    requestMiddleware: [
      clerkErrorGuard,
      clerkMiddleware(({ url }) => {
        // Redirect __clerk_handshake to /portal on non-portal pages so the
        // marketing site never processes Clerk's cross-domain handshake.
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

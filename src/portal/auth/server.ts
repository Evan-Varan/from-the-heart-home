import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import type { UserRole } from "@/portal/types";
import { getDb } from "@/portal/lib/db.server";
import { users } from "@/portal/db/schema";

type PortalAuthState = {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
};

function claimRole(claims: Record<string, unknown> | null | undefined): UserRole {
  return (claims?.metadata as { role?: UserRole } | undefined)?.role ?? "family";
}

export const getPortalAuthState = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortalAuthState> => {
    const { userId, sessionClaims } = await auth();
    if (!userId) return { userId: null, role: null, email: null };

    const claims = sessionClaims as Record<string, unknown> | null;
    const email = (claims?.email as string | null) ?? null;
    const jwtRole = claimRole(claims);

    // If the JWT still says "family" (the default), do a D1 lookup to catch
    // cases where Clerk publicMetadata wasn't updated at invite-accept time
    // (e.g., CLERK_SECRET_KEY wasn't configured yet).
    if (jwtRole === "family") {
      const db = getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.auth_provider_user_id, userId),
      });
      const dbRole = (user?.role as UserRole | undefined) ?? "family";
      return { userId, role: dbRole, email };
    }

    return { userId, role: jwtRole, email };
  },
);

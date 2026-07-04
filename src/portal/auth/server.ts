import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import type { UserRole } from "@/portal/types";

type PortalAuthState = {
  userId: string | null;
  role: UserRole | null;
};

function claimRole(claims: Record<string, unknown> | null | undefined): UserRole {
  return (claims?.metadata as { role?: UserRole } | undefined)?.role ?? "family";
}

export const getPortalAuthState = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortalAuthState> => {
    const { userId, sessionClaims } = await auth();

    return {
      userId,
      role: userId ? claimRole(sessionClaims as Record<string, unknown>) : null,
    };
  },
);

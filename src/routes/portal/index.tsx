import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";

export const Route = createFileRoute("/portal/")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();

    if (!userId) {
      throw redirect({ to: "/portal/login" });
    }

    if (role === "admin") throw redirect({ to: "/portal/admin" });
    if (role === "tutor") throw redirect({ to: "/portal/tutor" });
    throw redirect({ to: "/portal/dashboard" });
  },
  component: () => null,
});

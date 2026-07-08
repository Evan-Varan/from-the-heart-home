import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";

export const Route = createFileRoute("/portal/admin")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role !== "admin") throw redirect({ to: "/portal" });
  },
  component: () => <Outlet />,
});

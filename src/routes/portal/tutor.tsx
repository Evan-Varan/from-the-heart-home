import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";

export const Route = createFileRoute("/portal/tutor")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role !== "tutor" && role !== "admin") throw redirect({ to: "/portal" });
  },
  component: () => <Outlet />,
});

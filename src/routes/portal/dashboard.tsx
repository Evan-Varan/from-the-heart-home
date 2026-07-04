import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";

export const Route = createFileRoute("/portal/dashboard")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role !== "family" && role !== "admin") throw redirect({ to: "/portal" });
  },
  component: FamilyDashboard,
});

function FamilyDashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Family Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Your session schedule, tutor notes, and account details will appear here.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/portal/settings/account"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Account settings
        </Link>
        <Link
          to="/portal/logout"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}

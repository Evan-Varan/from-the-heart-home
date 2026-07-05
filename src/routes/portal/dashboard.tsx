import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <PortalShell pageTitle="Dashboard">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Dashboard"
          description="Your upcoming sessions and account overview."
          actions={
            <Button size="sm" asChild>
              <a href="/portal/schedule">Schedule a session</a>
            </Button>
          }
        />
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No upcoming sessions"
          description="Once you schedule sessions with a tutor, they'll appear here."
          action={
            <Button asChild>
              <a href="/portal/schedule">Book a session</a>
            </Button>
          }
        />
      </div>
    </PortalShell>
  );
}

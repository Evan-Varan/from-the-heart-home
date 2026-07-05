import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/tutor")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role !== "tutor" && role !== "admin") throw redirect({ to: "/portal" });
  },
  component: TutorDashboard,
});

function TutorDashboard() {
  return (
    <PortalShell pageTitle="Dashboard">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Dashboard"
          description="Your upcoming sessions, students, and schedule."
          actions={
            <Button variant="outline" size="sm" asChild>
              <a href="/portal/tutor/availability">Manage availability</a>
            </Button>
          }
        />
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title="No upcoming sessions"
          description="Confirmed sessions will appear here once families book with you."
        />
      </div>
    </PortalShell>
  );
}

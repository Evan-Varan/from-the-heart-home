import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/admin")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role !== "admin") throw redirect({ to: "/portal" });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <PortalShell pageTitle="Admin">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="Manage families, tutors, sessions, and billing."
          actions={
            <Button size="sm" asChild>
              <a href="/portal/admin/families">View families</a>
            </Button>
          }
        />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No families yet"
          description="Once families register through the portal, they'll appear here."
        />
      </div>
    </PortalShell>
  );
}

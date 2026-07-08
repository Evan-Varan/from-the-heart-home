import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/portal/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <PortalShell pageTitle="Admin">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Admin Dashboard"
          description="Manage families, tutors, sessions, and billing."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/portal/admin/tutors" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="pt-5 pb-4 flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Tutors</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage tutor profiles, subjects, and approval status.
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/portal/admin/invites" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="pt-5 pb-4 flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Invites</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Invite tutors and administrators to the portal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
          <Card className="opacity-50 h-full">
            <CardContent className="pt-5 pb-4 flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Families</p>
                <p className="text-xs text-muted-foreground mt-0.5">Coming in spec 12.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

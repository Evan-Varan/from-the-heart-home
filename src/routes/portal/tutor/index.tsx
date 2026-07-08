import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMyTutorProfile } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/portal/tutor/")({
  loader: () => getMyTutorProfile(),
  beforeLoad: async ({ context }) => {
    // If no tutor profile exists yet, send to profile setup
    void context;
  },
  component: TutorDashboard,
});

function TutorDashboard() {
  const profile = Route.useLoaderData();

  if (!profile) {
    return (
      <PortalShell pageTitle="Welcome">
        <div className="mx-auto max-w-lg pt-10">
          <EmptyState
            icon={<AlertCircle className="h-6 w-6" />}
            title="Set up your profile"
            description="Create your tutor profile to get started. An admin will review and activate your account."
            action={
              <Button asChild>
                <a href="/portal/tutor/profile">Create Profile</a>
              </Button>
            }
          />
        </div>
      </PortalShell>
    );
  }

  if (profile.status === "pending") {
    return (
      <PortalShell pageTitle="Dashboard">
        <div className="mx-auto max-w-2xl space-y-6">
          <PageHeader
            title="Dashboard"
            description="Your upcoming sessions and schedule."
          />
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile pending approval</AlertTitle>
            <AlertDescription>
              Your profile has been submitted and is awaiting review by an admin. You'll have full
              access once approved.{" "}
              <a href="/portal/tutor/profile" className="underline underline-offset-2">
                Edit your profile
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </PortalShell>
    );
  }

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

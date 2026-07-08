import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { getFamilyAccount } from "@/portal/api/family";
import { getTutors } from "@/portal/api/tutors";
import type { TutorData } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Video, MapPin } from "lucide-react";

export const Route = createFileRoute("/portal/tutors/")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    if (role === "family") {
      const account = await getFamilyAccount();
      if (!account || account.onboarding_status !== "ready") {
        throw redirect({ to: "/portal/dashboard" });
      }
    }
  },
  loader: () => getTutors(),
  component: TutorDirectoryPage,
});

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function TutorCard({ tutor }: { tutor: TutorData }) {
  const uniqueCategories = [...new Set(tutor.subjects.map((s) => s.category).filter(Boolean))];

  return (
    <a href={`/portal/tutors/${tutor.id}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="pt-5 pb-4 space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback>{initials(tutor.display_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{tutor.display_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {tutor.meeting_link && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Video className="h-3 w-3" />
                    Virtual
                  </span>
                )}
                {tutor.in_person_available === 1 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    In-Person
                  </span>
                )}
              </div>
            </div>
          </div>

          {tutor.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>
          )}

          {tutor.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tutor.subjects.slice(0, 5).map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs">
                  {s.name}
                </Badge>
              ))}
              {tutor.subjects.length > 5 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{tutor.subjects.length - 5}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}

function TutorDirectoryPage() {
  const tutors = Route.useLoaderData();

  return (
    <PortalShell pageTitle="Tutors">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Our Tutors"
          description="Browse available tutors and request a session."
        />
        {tutors.length === 0 ? (
          <EmptyState
            icon={<UserCheck className="h-6 w-6" />}
            title="No tutors available"
            description="Check back soon — we're adding tutors to the roster."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((t) => <TutorCard key={t.id} tutor={t} />)}
          </div>
        )}
      </div>
    </PortalShell>
  );
}

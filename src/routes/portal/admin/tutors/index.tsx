import { createFileRoute } from "@tanstack/react-router";
import { getAllTutorsAdmin } from "@/portal/api/tutors";
import type { TutorData } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export const Route = createFileRoute("/portal/admin/tutors/")({
  loader: () => getAllTutorsAdmin(),
  component: AdminTutorsPage,
});

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  pending: "secondary",
  inactive: "outline",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function TutorRow({ tutor }: { tutor: TutorData }) {
  return (
    <a href={`/portal/admin/tutors/${tutor.id}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="py-4 px-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="text-sm">{initials(tutor.display_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{tutor.display_name}</p>
                <Badge variant={STATUS_VARIANT[tutor.status] ?? "outline"} className="text-xs">
                  {tutor.status}
                </Badge>
              </div>
              {tutor.email && (
                <p className="text-xs text-muted-foreground mt-0.5">{tutor.email}</p>
              )}
              {tutor.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tutor.subjects.slice(0, 4).map((s) => (
                    <Badge key={s.id} variant="outline" className="text-xs">
                      {s.name}
                      {(s.grade_min != null || s.grade_max != null) && (
                        <span className="ml-1 text-muted-foreground">
                          G{s.grade_min ?? "?"}–{s.grade_max ?? "?"}
                        </span>
                      )}
                    </Badge>
                  ))}
                  {tutor.subjects.length > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{tutor.subjects.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function AdminTutorsPage() {
  const tutors = Route.useLoaderData();
  const pending = tutors.filter((t) => t.status === "pending");

  return (
    <PortalShell pageTitle="Tutors">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Tutors"
          description="Review profiles, assign subjects, and manage approval status."
        />

        {pending.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pending Approval ({pending.length})
            </p>
            {pending.map((t) => <TutorRow key={t.id} tutor={t} />)}
          </div>
        )}

        {tutors.length === 0 ? (
          <EmptyState
            icon={<UserCheck className="h-6 w-6" />}
            title="No tutors yet"
            description="Tutors will appear here once they create their profile."
          />
        ) : (
          <div className="space-y-2">
            {pending.length > 0 && (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                All Tutors ({tutors.length})
              </p>
            )}
            {tutors.map((t) => <TutorRow key={t.id} tutor={t} />)}
          </div>
        )}
      </div>
    </PortalShell>
  );
}

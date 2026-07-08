import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { getTutor, getTutorAvailabilityBlocks } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Video, MapPin, ChevronLeft, Clock } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const TIMEZONES: Record<string, string> = {
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Los_Angeles": "PT",
  "America/Anchorage": "AKT",
  "Pacific/Honolulu": "HT",
};

export const Route = createFileRoute("/portal/tutors/$tutorId")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
  },
  loader: async ({ params }) => {
    const [tutor, availability] = await Promise.all([
      getTutor({ data: { tutorId: params.tutorId } }),
      getTutorAvailabilityBlocks({ data: { tutorId: params.tutorId } }),
    ]);
    return { tutor, availability };
  },
  component: TutorDetailPage,
});

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function TutorDetailPage() {
  const { tutor, availability } = Route.useLoaderData();

  const byDay = DAY_ORDER.reduce<Record<number, typeof availability>>((acc, d) => {
    acc[d] = availability
      .filter((b) => b.day_of_week === d)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return acc;
  }, {} as Record<number, typeof availability>);

  const hasMeetingLink = !!tutor.meeting_link;
  const hasInPerson = tutor.in_person_available === 1;

  return (
    <PortalShell pageTitle={tutor.display_name}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <a
            href="/portal/tutors"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tutors
          </a>
        </div>

        {/* Header */}
        <Card>
          <CardContent className="pt-6 pb-5">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarFallback className="text-xl">{initials(tutor.display_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{tutor.display_name}</h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {hasMeetingLink && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      Virtual sessions
                    </span>
                  )}
                  {hasInPerson && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      In-person available
                    </span>
                  )}
                  {!hasMeetingLink && !hasInPerson && (
                    <span className="text-sm text-muted-foreground">Contact admin for session details.</span>
                  )}
                </div>
                {tutor.bio && (
                  <p className="mt-3 text-sm text-muted-foreground">{tutor.bio}</p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <Button className="w-full sm:w-auto" disabled>
              Request a Session
              <span className="ml-2 text-xs opacity-70">(Coming in Spec 06)</span>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Subjects */}
          {tutor.subjects.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Subjects</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {tutor.subjects.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{s.name}</Badge>
                      {s.category && (
                        <span className="text-xs text-muted-foreground">{s.category}</span>
                      )}
                    </div>
                    {(s.grade_min != null || s.grade_max != null) && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        Gr. {s.grade_min ?? "?"}–{s.grade_max ?? "?"}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Weekly Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {availability.length === 0 ? (
                <p className="text-sm text-muted-foreground">No availability listed yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {DAY_ORDER.filter((d) => (byDay[d]?.length ?? 0) > 0).map((day) => (
                    <div key={day} className="grid grid-cols-[3rem_1fr] gap-2 items-start">
                      <span className="text-xs font-medium text-muted-foreground pt-0.5">
                        {DAYS[day]}
                      </span>
                      <div className="space-y-0.5">
                        {byDay[day].map((b) => (
                          <p key={b.id} className="text-xs">
                            {b.start_time}–{b.end_time}{" "}
                            <span className="text-muted-foreground">
                              {TIMEZONES[b.timezone] ?? b.timezone}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}

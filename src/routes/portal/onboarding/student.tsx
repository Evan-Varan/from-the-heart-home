import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getPortalAuthState } from "@/portal/auth/server";
import { getFamilyAccount, updateOnboardingStatus } from "@/portal/api/family";
import { createStudent } from "@/portal/api/students";
import { getSubjects } from "@/portal/api/subjects";
import type { SubjectOption } from "@/portal/api/subjects";
import { OnboardingShell } from "@/portal/components/OnboardingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const GRADE_LEVELS = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "College / University",
  "Graduate / Post-Graduate",
  "Adult Learner",
];

export const Route = createFileRoute("/portal/onboarding/student")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    const account = await getFamilyAccount();
    if (!account) throw redirect({ to: "/portal/onboarding/" });
    if (account.onboarding_status === "ready") throw redirect({ to: "/portal/dashboard" });
  },
  loader: () => getSubjects(),
  component: OnboardingStudentStep,
});

function groupByCategory(subjects: SubjectOption[]): Record<string, SubjectOption[]> {
  return subjects.reduce<Record<string, SubjectOption[]>>((acc, s) => {
    const cat = s.category ?? "Other";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});
}

function OnboardingStudentStep() {
  const subjects = Route.useLoaderData();
  const navigate = useNavigate();
  const grouped = groupByCategory(subjects);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [school, setSchool] = useState("");
  const [goals, setGoals] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim()) { setError("Last name is required."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await createStudent({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          grade_level: gradeLevel || undefined,
          school: school.trim() || undefined,
          goals: goals.trim() || undefined,
          subject_ids: selectedSubjects.size > 0 ? [...selectedSubjects] : undefined,
        },
      });
      await updateOnboardingStatus({ data: { status: "payment_required" } });
      navigate({ to: "/portal/onboarding/payment" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <OnboardingShell step={2}>
      <Card>
        <CardHeader>
          <CardTitle>Add a Student</CardTitle>
          <CardDescription>
            Enter the details for the student you'd like to enroll. You can add more students later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger id="gradeLevel">
                  <SelectValue placeholder="Select grade…" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Lincoln Elementary"
              />
            </div>

            {subjects.length > 0 && (
              <div className="space-y-2">
                <Label>Subjects of Interest</Label>
                <div className="rounded-md border border-border p-3 max-h-52 overflow-y-auto space-y-4">
                  {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        {category}
                      </p>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                        {items.map((s) => (
                          <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedSubjects.has(s.id)}
                              onCheckedChange={() => toggleSubject(s.id)}
                            />
                            <span className="text-sm">{s.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedSubjects.size > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {[...selectedSubjects].map((id) => {
                      const s = subjects.find((x) => x.id === id);
                      return s ? (
                        <Badge key={id} variant="secondary">
                          {s.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="goals">
                Learning Goals{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What would you like this student to accomplish?"
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Saving…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </OnboardingShell>
  );
}

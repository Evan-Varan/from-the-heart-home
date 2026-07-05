import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getPortalAuthState } from "@/portal/auth/server";
import { getStudent, updateStudent, archiveStudent } from "@/portal/api/students";
import { getSubjects } from "@/portal/api/subjects";
import type { SubjectOption } from "@/portal/api/subjects";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { FormSection } from "@/portal/components/FormSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";

const GRADE_LEVELS = [
  "Pre-K", "Kindergarten",
  "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
  "6th Grade", "7th Grade", "8th Grade",
  "9th Grade", "10th Grade", "11th Grade", "12th Grade",
  "College / University", "Graduate / Post-Graduate", "Adult Learner",
];

export const Route = createFileRoute("/portal/students/$studentId")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
  },
  loader: async ({ params }) => {
    const [student, subjects] = await Promise.all([
      getStudent({ data: { studentId: params.studentId } }),
      getSubjects(),
    ]);
    return { student, subjects };
  },
  component: StudentEditPage,
});

function groupByCategory(subjects: SubjectOption[]): Record<string, SubjectOption[]> {
  return subjects.reduce<Record<string, SubjectOption[]>>((acc, s) => {
    const cat = s.category ?? "Other";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});
}

function StudentEditPage() {
  const { student, subjects } = Route.useLoaderData();
  const navigate = useNavigate();
  const grouped = groupByCategory(subjects);

  const [firstName, setFirstName] = useState(student.first_name);
  const [lastName, setLastName] = useState(student.last_name);
  const [gradeLevel, setGradeLevel] = useState(student.grade_level ?? "");
  const [school, setSchool] = useState(student.school ?? "");
  const [email, setEmail] = useState(student.email ?? "");
  const [phone, setPhone] = useState(student.phone ?? "");
  const [isAdult, setIsAdult] = useState(student.is_adult_student === 1);
  const [goals, setGoals] = useState(student.goals ?? "");
  const [learningChallenges, setLearningChallenges] = useState(student.learning_challenges ?? "");
  const [accommodations, setAccommodations] = useState(student.accommodations ?? "");
  const [parentNotes, setParentNotes] = useState(student.parent_notes ?? "");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set(student.subjects.map((s) => s.id)),
  );
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim()) { setError("Last name is required."); return; }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateStudent({
        data: {
          studentId: student.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          grade_level: gradeLevel || undefined,
          school: school.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          is_adult_student: isAdult,
          goals: goals.trim() || undefined,
          learning_challenges: learningChallenges.trim() || undefined,
          accommodations: accommodations.trim() || undefined,
          parent_notes: parentNotes.trim() || undefined,
          subject_ids: [...selectedSubjects],
        },
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await archiveStudent({ data: { studentId: student.id } });
      navigate({ to: "/portal/students/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setArchiving(false);
    }
  };

  return (
    <PortalShell pageTitle={`${student.first_name} ${student.last_name}`}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <a
            href="/portal/students"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Students
          </a>
          <PageHeader
            title={`${student.first_name} ${student.last_name}`}
            description="Update student information and subject interests."
            actions={
              <Badge variant={student.status === "active" ? "default" : "secondary"}>
                {student.status}
              </Badge>
            }
          />
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <FormSection title="Basic Information">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade…" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_LEVELS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="school">School</Label>
                  <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Lincoln Elementary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Adult Student</p>
                    <p className="text-xs text-muted-foreground">Student manages their own sessions</p>
                  </div>
                  <Switch checked={isAdult} onCheckedChange={setIsAdult} />
                </div>
              </FormSection>

              {subjects.length > 0 && (
                <FormSection title="Subjects">
                  <div className="rounded-md border border-border p-3 max-h-52 overflow-y-auto space-y-4">
                    {Object.entries(grouped).map(([category, items]) => (
                      <div key={category}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{category}</p>
                        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                          {items.map((s) => (
                            <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox checked={selectedSubjects.has(s.id)} onCheckedChange={() => toggleSubject(s.id)} />
                              <span className="text-sm">{s.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSection>
              )}

              <FormSection title="Learning Profile">
                <div className="space-y-1.5">
                  <Label htmlFor="goals">Goals</Label>
                  <Textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="What should this student accomplish?" rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="challenges">Learning Challenges</Label>
                  <Textarea id="challenges" value={learningChallenges} onChange={(e) => setLearningChallenges(e.target.value)} placeholder="Any learning differences or areas of difficulty…" rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accommodations">Accommodations</Label>
                  <Textarea id="accommodations" value={accommodations} onChange={(e) => setAccommodations(e.target.value)} placeholder="IEP accommodations, preferred teaching styles…" rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="parentNotes">Notes for Tutor</Label>
                  <Textarea id="parentNotes" value={parentNotes} onChange={(e) => setParentNotes(e.target.value)} placeholder="Anything else the tutor should know…" rows={3} />
                </div>
              </FormSection>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-green-600">Changes saved.</p>}

          <div className="flex items-center justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" className="text-destructive hover:text-destructive" disabled={student.status === "archived"}>
                  Archive Student
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive {student.first_name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will hide the student from active lists. You can contact support to restore them.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive} disabled={archiving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {archiving ? "Archiving…" : "Archive"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

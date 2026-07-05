import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getPortalAuthState } from "@/portal/auth/server";
import { getStudents, createStudent } from "@/portal/api/students";
import { getSubjects } from "@/portal/api/subjects";
import type { StudentData } from "@/portal/api/students";
import type { SubjectOption } from "@/portal/api/subjects";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";

const GRADE_LEVELS = [
  "Pre-K", "Kindergarten",
  "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
  "6th Grade", "7th Grade", "8th Grade",
  "9th Grade", "10th Grade", "11th Grade", "12th Grade",
  "College / University", "Graduate / Post-Graduate", "Adult Learner",
];

export const Route = createFileRoute("/portal/students/")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
  },
  loader: async () => {
    const [students, subjects] = await Promise.all([getStudents(), getSubjects()]);
    return { students, subjects };
  },
  component: StudentsPage,
});

function StudentCard({ student }: { student: StudentData }) {
  return (
    <a href={`/portal/students/${student.id}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">
                {student.first_name} {student.last_name}
              </p>
              {student.grade_level && (
                <p className="text-sm text-muted-foreground mt-0.5">{student.grade_level}</p>
              )}
              {student.school && (
                <p className="text-xs text-muted-foreground">{student.school}</p>
              )}
            </div>
            <Badge variant={student.status === "active" ? "default" : "secondary"} className="shrink-0">
              {student.status}
            </Badge>
          </div>
          {student.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {student.subjects.map((s) => (
                <Badge key={s.id} variant="outline" className="text-xs">
                  {s.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}

interface AddStudentFormProps {
  subjects: SubjectOption[];
  onSuccess: () => void;
  onCancel: () => void;
}

function AddStudentForm({ subjects, onSuccess, onCancel }: AddStudentFormProps) {
  const grouped = subjects.reduce<Record<string, SubjectOption[]>>((acc, s) => {
    const cat = s.category ?? "Other";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

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
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="add-firstName">First Name *</Label>
          <Input id="add-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="add-lastName">Last Name *</Label>
          <Input id="add-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="add-grade">Grade Level</Label>
        <Select value={gradeLevel} onValueChange={setGradeLevel}>
          <SelectTrigger id="add-grade">
            <SelectValue placeholder="Select grade…" />
          </SelectTrigger>
          <SelectContent>
            {GRADE_LEVELS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="add-school">School</Label>
        <Input id="add-school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Lincoln Elementary" />
      </div>

      {subjects.length > 0 && (
        <div className="space-y-2">
          <Label>Subjects of Interest</Label>
          <div className="rounded-md border border-border p-3 max-h-40 overflow-y-auto space-y-3">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{category}</p>
                <div className="grid grid-cols-2 gap-y-1.5">
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
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="add-goals">Learning Goals <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Textarea id="add-goals" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="What should this student accomplish?" rows={2} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Add Student"}</Button>
      </div>
    </form>
  );
}

function StudentsPage() {
  const { students, subjects } = Route.useLoaderData();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    router.invalidate();
  };

  return (
    <PortalShell pageTitle="Students">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Students"
          description="Manage student profiles and subject interests."
          actions={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Student</DialogTitle>
                  <DialogDescription>
                    Enter the student's details. You can edit more information on their profile page.
                  </DialogDescription>
                </DialogHeader>
                <AddStudentForm
                  subjects={subjects}
                  onSuccess={handleSuccess}
                  onCancel={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          }
        />

        {students.length === 0 ? (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No students yet"
            description="Add a student to get started scheduling sessions."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Student
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {students.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}

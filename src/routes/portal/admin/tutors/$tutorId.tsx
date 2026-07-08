import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getTutorAdmin, adminUpdateTutor } from "@/portal/api/tutors";
import { getSubjects } from "@/portal/api/subjects";
import type { TutorSubjectData } from "@/portal/api/tutors";
import type { SubjectOption } from "@/portal/api/subjects";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { FormSection } from "@/portal/components/FormSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/portal/admin/tutors/$tutorId")({
  loader: async ({ params }) => {
    const [tutor, subjects] = await Promise.all([
      getTutorAdmin({ data: { tutorId: params.tutorId } }),
      getSubjects(),
    ]);
    return { tutor, subjects };
  },
  component: AdminTutorEditPage,
});

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function groupByCategory(subjects: SubjectOption[]): Record<string, SubjectOption[]> {
  return subjects.reduce<Record<string, SubjectOption[]>>((acc, s) => {
    const cat = s.category ?? "Other";
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});
}

interface SubjectAssignment {
  subject_id: string;
  grade_min: number | null;
  grade_max: number | null;
}

function AdminTutorEditPage() {
  const { tutor, subjects } = Route.useLoaderData();
  const router = useRouter();
  const grouped = groupByCategory(subjects);

  const [displayName, setDisplayName] = useState(tutor.display_name);
  const [bio, setBio] = useState(tutor.bio ?? "");
  const [email, setEmail] = useState(tutor.email ?? "");
  const [phone, setPhone] = useState(tutor.phone ?? "");
  const [meetingLink, setMeetingLink] = useState(tutor.meeting_link ?? "");
  const [inPerson, setInPerson] = useState(tutor.in_person_available === 1);
  const [status, setStatus] = useState<"pending" | "active" | "inactive">(
    tutor.status as "pending" | "active" | "inactive",
  );
  const [hourlyRate, setHourlyRate] = useState(
    tutor.default_hourly_rate_cents != null ? String(tutor.default_hourly_rate_cents / 100) : "",
  );
  const [payRate, setPayRate] = useState(
    tutor.pay_reporting_rate_cents != null ? String(tutor.pay_reporting_rate_cents / 100) : "",
  );

  // Subject assignments: map subject_id → { grade_min, grade_max }
  const initialAssignments = tutor.subjects.reduce<Record<string, SubjectAssignment>>((acc, s) => {
    acc[s.subject_id] = { subject_id: s.subject_id, grade_min: s.grade_min, grade_max: s.grade_max };
    return acc;
  }, {});
  const [assignments, setAssignments] = useState<Record<string, SubjectAssignment>>(initialAssignments);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleSubject = (subjectId: string) => {
    setAssignments((prev) => {
      const next = { ...prev };
      if (next[subjectId]) {
        delete next[subjectId];
      } else {
        next[subjectId] = { subject_id: subjectId, grade_min: null, grade_max: null };
      }
      return next;
    });
  };

  const setGrade = (subjectId: string, field: "grade_min" | "grade_max", val: string) => {
    setAssignments((prev) => ({
      ...prev,
      [subjectId]: { ...prev[subjectId], [field]: val === "" ? null : Number(val) },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { setError("Display name is required."); return; }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminUpdateTutor({
        data: {
          tutorId: tutor.id,
          display_name: displayName.trim(),
          bio: bio.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          meeting_link: meetingLink.trim() || undefined,
          in_person_available: inPerson,
          status,
          default_hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
          pay_reporting_rate_cents: payRate ? Math.round(parseFloat(payRate) * 100) : null,
          subject_assignments: Object.values(assignments),
        },
      });
      setSaved(true);
      router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalShell pageTitle={tutor.display_name}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <a
            href="/portal/admin/tutors"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tutors
          </a>
          <PageHeader
            title={tutor.display_name}
            description="Edit tutor profile, subjects, and approval status."
            actions={
              <Badge
                variant={
                  status === "active" ? "default" : status === "pending" ? "secondary" : "outline"
                }
              >
                {status}
              </Badge>
            }
          />
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback>{initials(tutor.display_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{tutor.display_name}</p>
                  <p className="text-xs text-muted-foreground">Photo upload available in spec 10.</p>
                </div>
              </div>

              <FormSection title="Status">
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as "pending" | "active" | "inactive")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only active tutors appear in the family tutor directory.
                </p>
              </FormSection>

              <FormSection title="Profile">
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input id="meetingLink" type="url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://zoom.us/j/..." />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">In-Person Available</p>
                  <Switch checked={inPerson} onCheckedChange={setInPerson} />
                </div>
              </FormSection>

              {subjects.length > 0 && (
                <FormSection title="Subjects & Grade Ranges">
                  <div className="space-y-4 rounded-md border border-border p-3 max-h-72 overflow-y-auto">
                    {Object.entries(grouped).map(([category, items]) => (
                      <div key={category}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          {category}
                        </p>
                        <div className="space-y-2">
                          {items.map((s) => {
                            const assigned = !!assignments[s.id];
                            return (
                              <div key={s.id} className="space-y-1.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <Checkbox
                                    checked={assigned}
                                    onCheckedChange={() => toggleSubject(s.id)}
                                  />
                                  <span className="text-sm">{s.name}</span>
                                </label>
                                {assigned && (
                                  <div className="ml-6 flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground">Grade</Label>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={14}
                                      placeholder="Min"
                                      className="h-7 w-16 text-xs"
                                      value={assignments[s.id]?.grade_min ?? ""}
                                      onChange={(e) => setGrade(s.id, "grade_min", e.target.value)}
                                    />
                                    <span className="text-xs text-muted-foreground">–</span>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={14}
                                      placeholder="Max"
                                      className="h-7 w-16 text-xs"
                                      value={assignments[s.id]?.grade_max ?? ""}
                                      onChange={(e) => setGrade(s.id, "grade_max", e.target.value)}
                                    />
                                    <span className="text-xs text-muted-foreground">(0=K, 12=12th, 13=College)</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSection>
              )}

              <FormSection title="Pay Reporting (Internal)">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="hourlyRate">Default Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="payRate">Pay Reporting Rate ($)</Label>
                    <Input
                      id="payRate"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={payRate}
                      onChange={(e) => setPayRate(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Internal only — not shown to tutors or families.</p>
              </FormSection>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-green-600">Changes saved.</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getMyTutorProfile, upsertTutorProfile } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { FormSection } from "@/portal/components/FormSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/portal/tutor/profile")({
  loader: () => getMyTutorProfile(),
  component: TutorProfilePage,
});

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TutorProfilePage() {
  const profile = Route.useLoaderData();
  const navigate = useNavigate();
  const isNew = !profile;

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [meetingLink, setMeetingLink] = useState(profile?.meeting_link ?? "");
  const [inPerson, setInPerson] = useState(profile ? profile.in_person_available === 1 : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { setError("Display name is required."); return; }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await upsertTutorProfile({
        data: {
          display_name: displayName.trim(),
          bio: bio.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          meeting_link: meetingLink.trim() || undefined,
          in_person_available: inPerson,
        },
      });
      setSaved(true);
      if (isNew) {
        navigate({ to: "/portal/tutor/" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalShell pageTitle="My Profile">
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title={isNew ? "Create Your Profile" : "My Profile"}
          description={
            isNew
              ? "Fill in your details. An admin will review and activate your account."
              : "Update your public profile and contact information."
          }
          actions={
            profile && (
              <Badge variant={profile.status === "active" ? "default" : "secondary"}>
                {profile.status}
              </Badge>
            )
          }
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Photo placeholder — upload enabled in spec 10 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {displayName ? initials(displayName) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">Photo upload available soon.</p>
                </div>
              </div>

              <FormSection title="Basic Information">
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell families about your background, teaching style, and specialties…"
                    rows={4}
                  />
                </div>
              </FormSection>

              <FormSection title="Contact">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Session Details">
                <div className="space-y-1.5">
                  <Label htmlFor="meetingLink">Zoom / Google Meet Link</Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Your reusable meeting link for virtual sessions.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Available for In-Person Sessions</p>
                    <p className="text-xs text-muted-foreground">
                      Families can request in-person sessions with you.
                    </p>
                  </div>
                  <Switch checked={inPerson} onCheckedChange={setInPerson} />
                </div>
              </FormSection>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && !isNew && <p className="text-sm text-green-600">Profile saved.</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isNew ? "Submit Profile" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}

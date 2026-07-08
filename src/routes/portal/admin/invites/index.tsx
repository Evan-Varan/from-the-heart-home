import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { listInvites, createInvite } from "@/portal/api/invites";
import type { InviteData } from "@/portal/api/invites";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { EmptyState } from "@/portal/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, Copy, Check, UserPlus } from "lucide-react";

export const Route = createFileRoute("/portal/admin/invites/")({
  loader: () => listInvites(),
  component: AdminInvitesPage,
});

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  expired: "outline",
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1 text-xs">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

function InviteRow({ invite }: { invite: InviteData }) {
  const inviteUrl = `${window.location.origin}/portal/invite/${invite.token}`;
  return (
    <Card>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium">{invite.email}</p>
              <Badge variant="outline" className="text-xs capitalize">{invite.role}</Badge>
              <Badge variant={STATUS_VARIANT[invite.status] ?? "outline"} className="text-xs capitalize">
                {invite.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Invited by {invite.invited_by_name} · Expires{" "}
              {new Date(invite.expires_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {invite.accepted_at && (
                <> · Accepted {new Date(invite.accepted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
              )}
            </p>
          </div>
          {invite.status === "pending" && <CopyButton value={inviteUrl} />}
        </div>
      </CardContent>
    </Card>
  );
}

function InviteDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"tutor" | "admin">("tutor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }
    setSubmitting(true);
    setError(null);
    try {
      await createInvite({ data: { email: email.trim(), role } });
      setEmail("");
      setRole("tutor");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("tutor");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="inviteEmail">Email address</Label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inviteRole">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "tutor" | "admin")}>
              <SelectTrigger id="inviteRole">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              An invite link will be emailed to them. Links expire in 7 days.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminInvitesPage() {
  const invites = Route.useLoaderData();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSuccess = () => {
    setDialogOpen(false);
    router.invalidate();
  };

  const pending = invites.filter((i) => i.status === "pending");
  const past = invites.filter((i) => i.status !== "pending");

  return (
    <PortalShell pageTitle="Invites">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Invites"
          description="Send invite links to tutors and administrators."
          actions={
            <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              Invite Someone
            </Button>
          }
        />

        {invites.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-6 w-6" />}
            title="No invites sent yet"
            description="Use the button above to invite a tutor or administrator."
          />
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pending ({pending.length})
                </p>
                {pending.map((i) => <InviteRow key={i.id} invite={i} />)}
              </div>
            )}
            {past.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Past Invites
                </p>
                {past.map((i) => <InviteRow key={i.id} invite={i} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <InviteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </PortalShell>
  );
}

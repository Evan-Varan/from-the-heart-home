import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useClerk } from "@clerk/tanstack-react-start";
import { getPortalAuthState } from "@/portal/auth/server";
import { getInviteByToken, acceptInvite, getPortalUserEmail } from "@/portal/api/invites";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  tutor: "Tutor",
  admin: "Administrator",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  tutor: <UserCheck className="h-8 w-8 text-muted-foreground" />,
  admin: <ShieldCheck className="h-8 w-8 text-muted-foreground" />,
};

export const Route = createFileRoute("/portal/invite/$token")({
  loader: async ({ params }) => {
    const [invite, authState] = await Promise.all([
      getInviteByToken({ data: { token: params.token } }),
      getPortalAuthState(),
    ]);

    // Fetch the logged-in user's real email from Clerk so we can detect
    // wrong-account situations before they reach the accept button.
    // Returns null for users with no Clerk account context (shouldn't happen)
    // and for local dev environments where the Clerk API isn't available.
    const currentUserEmail = authState.userId ? await getPortalUserEmail() : null;

    return { invite, isLoggedIn: !!authState.userId, currentUserEmail };
  },
  component: InviteAcceptPage,
});

function InviteAcceptPage() {
  const { invite, isLoggedIn, currentUserEmail } = Route.useLoaderData();
  const { token } = Route.useParams();
  const { signOut } = useClerk();
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invite) {
    return <InviteShell><ErrorCard title="Invalid invite" description="This invite link is invalid or does not exist. Please check the link in your email or contact your administrator." /></InviteShell>;
  }

  if (invite.isAccepted) {
    return <InviteShell><ErrorCard title="Already accepted" description="This invite has already been used. If you need access, contact your administrator." /></InviteShell>;
  }

  if (invite.isExpired) {
    return <InviteShell><ErrorCard title="Invite expired" description="This invite link has expired. Please contact your administrator for a new one." /></InviteShell>;
  }

  if (accepted) {
    return (
      <InviteShell>
        <Card className="text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold">You're all set!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your role has been configured as a{" "}
                <strong>{ROLE_LABELS[invite.role] ?? invite.role}</strong>.
                Taking you to your portal…
              </p>
            </div>
          </CardContent>
        </Card>
      </InviteShell>
    );
  }

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);
    try {
      await acceptInvite({ data: { token } });
      setAccepted(true);
      // Full-page reload so the SSR auth check picks up the updated D1 role
      // without requiring a sign-out/sign-in cycle. The D1 fallback in
      // getPortalAuthState handles the case where the JWT hasn't refreshed yet.
      setTimeout(() => {
        window.location.href = "/portal";
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setAccepting(false);
    }
  };

  // If we know the signed-in user's email and it doesn't match the invite, block.
  const emailMismatch =
    isLoggedIn &&
    currentUserEmail !== null &&
    currentUserEmail.toLowerCase() !== invite.email.toLowerCase();

  return (
    <InviteShell>
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            {ROLE_ICONS[invite.role] ?? <UserCheck className="h-8 w-8 text-muted-foreground" />}
          </div>
          <CardTitle className="text-xl">You've been invited!</CardTitle>
          <CardDescription>
            <strong>{invite.inviterName}</strong> has invited you to join the From the Heart
            Tutoring portal as a{" "}
            <Badge variant="secondary" className="text-xs align-middle">
              {ROLE_LABELS[invite.role] ?? invite.role}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
            Invite sent to: <span className="font-medium text-foreground">{invite.email}</span>
          </div>

          {emailMismatch ? (
            <div className="space-y-3">
              <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                <p className="font-medium">Wrong account</p>
                <p className="mt-1">
                  You're signed in as <strong>{currentUserEmail}</strong>, but this invite was
                  sent to <strong>{invite.email}</strong>. Sign out and use the invited email to
                  continue.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut({ redirectUrl: `/portal/invite/${token}` })}
              >
                Sign Out
              </Button>
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-3">
              <Button className="w-full" onClick={handleAccept} disabled={accepting}>
                {accepting ? "Accepting…" : "Accept Invitation"}
              </Button>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <p className="text-xs text-muted-foreground text-center">
                You're signed in as <strong>{currentUserEmail ?? invite.email}</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <a href={`/portal/register?invite=${token}`}>Create your account</a>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Already have an account?{" "}
                <a href="/portal/login" className="underline underline-offset-2">
                  Sign in
                </a>
                , then return to this page to accept.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </InviteShell>
  );
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blush/40 via-cream to-background px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            From the Heart Tutoring
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-8 pb-8 text-center space-y-3">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

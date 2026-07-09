import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { shadcn } from "@clerk/ui/themes";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/portal")({
  head: () => ({
    ...buildSeo({
      title: "Student Portal | From the Heart Tutoring",
      description:
        "Student portal for From the Heart Tutoring families to schedule sessions and manage tutoring details.",
      path: "/portal",
      noindex: true,
    }),
  }),
  component: PortalLayout,
});

const PUBLIC_PATHS = ["/portal/login", "/portal/register", "/portal/invite", "/portal/forgot-password"];
const PENDING_INVITE_KEY = "pendingInviteToken";

function PortalRoot() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
      if (!isPublic) navigate({ to: "/portal/login" });
      return;
    }

    // After sign-in, check whether the user came via an invite link.
    // We store the token in sessionStorage before navigating to /register
    // so that even if Clerk's post-signup redirect doesn't land on the
    // invite page, we can still route them there to complete acceptance.
    const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY);
    if (pendingToken && !pathname.startsWith("/portal/invite")) {
      sessionStorage.removeItem(PENDING_INVITE_KEY);
      navigate({ to: "/portal/invite/$token", params: { token: pendingToken } });
    }
  }, [isLoaded, isSignedIn, pathname]);

  return (
    <div className="fixed inset-0 z-40 overflow-auto bg-background">
      <Outlet />
    </div>
  );
}

function PortalLayout() {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <PortalRoot />
    </ClerkProvider>
  );
}

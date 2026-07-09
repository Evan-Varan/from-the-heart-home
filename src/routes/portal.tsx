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

// Public portal paths that don't require an active session
const PUBLIC_PATHS = ["/portal/login", "/portal/register", "/portal/invite", "/portal/forgot-password"];

function PortalRoot() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (!isPublic) {
      navigate({ to: "/portal/login" });
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

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/tanstack-react-start";
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

function PortalLayout() {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <div className="fixed inset-0 z-40 overflow-auto bg-background">
        <Outlet />
      </div>
    </ClerkProvider>
  );
}

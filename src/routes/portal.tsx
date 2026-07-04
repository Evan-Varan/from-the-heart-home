import { createFileRoute, Outlet } from "@tanstack/react-router";
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
  return <Outlet />;
}

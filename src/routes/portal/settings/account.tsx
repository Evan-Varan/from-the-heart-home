import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserProfile } from "@clerk/tanstack-react-start";
import { getPortalAuthState } from "@/portal/auth/server";

export const Route = createFileRoute("/portal/settings/account")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
  },
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <UserProfile routing="path" path="/portal/settings/account" />
    </div>
  );
}

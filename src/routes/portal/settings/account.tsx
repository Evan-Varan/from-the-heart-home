import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserProfile } from "@clerk/tanstack-react-start";
import { getPortalAuthState } from "@/portal/auth/server";
import { PortalShell } from "@/portal/components/PortalShell";

export const Route = createFileRoute("/portal/settings/account")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
  },
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  return (
    <PortalShell pageTitle="Account Settings">
      <div className="mx-auto max-w-3xl">
        <UserProfile routing="path" path="/portal/settings/account" />
      </div>
    </PortalShell>
  );
}

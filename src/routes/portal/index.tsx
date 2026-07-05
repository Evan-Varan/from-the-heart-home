import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPortalAuthState } from "@/portal/auth/server";
import { getFamilyAccount } from "@/portal/api/family";

export const Route = createFileRoute("/portal/")({
  beforeLoad: async () => {
    const { userId, role } = await getPortalAuthState();

    if (!userId) {
      throw redirect({ to: "/portal/login" });
    }

    if (role === "admin") throw redirect({ to: "/portal/admin" });
    if (role === "tutor") throw redirect({ to: "/portal/tutor" });

    // Family role: check onboarding status
    const account = await getFamilyAccount();
    if (!account || account.onboarding_status === "started") {
      throw redirect({ to: "/portal/onboarding/" });
    }
    if (account.onboarding_status === "payment_required") {
      throw redirect({ to: "/portal/onboarding/payment" });
    }
    if (account.onboarding_status === "needs_admin_review") {
      throw redirect({ to: "/portal/dashboard" });
    }

    throw redirect({ to: "/portal/dashboard" });
  },
  component: () => null,
});

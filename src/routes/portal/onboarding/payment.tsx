import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getPortalAuthState } from "@/portal/auth/server";
import { getFamilyAccount, updateOnboardingStatus } from "@/portal/api/family";
import { OnboardingShell } from "@/portal/components/OnboardingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/portal/onboarding/payment")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    const account = await getFamilyAccount();
    if (!account) throw redirect({ to: "/portal/onboarding/" });
    if (account.onboarding_status === "ready") throw redirect({ to: "/portal/dashboard" });
  },
  component: OnboardingPaymentStep,
});

function OnboardingPaymentStep() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    setSubmitting(true);
    await updateOnboardingStatus({ data: { status: "ready" } });
    navigate({ to: "/portal/dashboard" });
  };

  return (
    <OnboardingShell step={3}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Setup</CardTitle>
          <CardDescription>Secure payment processing powered by Stripe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-8 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Payment setup coming soon</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                You'll be able to add a payment method before your first session. Our team will be
                in touch to complete this step.
              </p>
            </div>
          </div>
          <Button onClick={handleContinue} disabled={submitting} className="w-full">
            {submitting ? "Setting up your account…" : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </OnboardingShell>
  );
}

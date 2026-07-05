import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPortalAuthState } from "@/portal/auth/server";
import { getFamilyAccount, createFamilyAccount } from "@/portal/api/family";
import { OnboardingShell } from "@/portal/components/OnboardingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/portal/onboarding/")({
  beforeLoad: async () => {
    const { userId } = await getPortalAuthState();
    if (!userId) throw redirect({ to: "/portal/login" });
    const account = await getFamilyAccount();
    if (account?.onboarding_status === "ready") throw redirect({ to: "/portal/dashboard" });
    if (account?.onboarding_status === "payment_required") {
      throw redirect({ to: "/portal/onboarding/payment" });
    }
  },
  component: OnboardingStep1,
});

const ACCOUNT_TYPES = [
  {
    value: "parent_managed" as const,
    title: "Parent / Guardian",
    desc: "I manage tutoring sessions for my child or student.",
  },
  {
    value: "adult_student" as const,
    title: "Adult Student",
    desc: "I manage my own tutoring sessions.",
  },
];

function OnboardingStep1() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"parent_managed" | "adult_student">("parent_managed");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createFamilyAccount({
        data: { accountType, phone: phone.trim() || undefined },
      });
      navigate({ to: "/portal/onboarding/student" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <OnboardingShell step={1}>
      <Card>
        <CardHeader>
          <CardTitle>Set Up Your Account</CardTitle>
          <CardDescription>
            Tell us how you'll use the portal so we can personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                value={accountType}
                onValueChange={(v) => setAccountType(v as "parent_managed" | "adult_student")}
                className="space-y-2"
              >
                {ACCOUNT_TYPES.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                      accountType === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{opt.title}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone Number{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used only for session reminders via SMS if you opt in.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Saving…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </OnboardingShell>
  );
}

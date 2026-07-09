import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/portal/register/$")({
  validateSearch: (search: Record<string, unknown>) => ({
    invite: typeof search.invite === "string" ? search.invite : undefined,
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { invite } = Route.useSearch();
  const afterUrl = invite ? `/portal/invite/${invite}` : "/portal";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-blush/40 via-cream to-background px-4 py-16">
      <SignUp
        routing="path"
        path="/portal/register"
        signInUrl="/portal/login"
        forceRedirectUrl={afterUrl}
      />
    </div>
  );
}

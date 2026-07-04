import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/portal/login/$")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-blush/40 via-cream to-background px-4 py-16">
      <SignIn
        routing="path"
        path="/portal/login"
        signUpUrl="/portal/register"
        fallbackRedirectUrl="/portal"
      />
    </div>
  );
}

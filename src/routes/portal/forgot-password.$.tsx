import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";

// Clerk's embedded <SignIn /> handles the full password-reset flow inline.
// This route exists so the URL is bookmarkable / linkable.
export const Route = createFileRoute("/portal/forgot-password/$")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-blush/40 via-cream to-background px-4 py-16">
      <SignIn
        routing="path"
        path="/portal/forgot-password"
        signUpUrl="/portal/register"
        fallbackRedirectUrl="/portal"
      />
    </div>
  );
}

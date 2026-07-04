import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useClerk } from "@clerk/tanstack-react-start";
import { useEffect } from "react";

export const Route = createFileRoute("/portal/logout")({
  component: LogoutPage,
});

function LogoutPage() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => navigate({ to: "/portal/login" }));
  }, [signOut, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing out…</p>
    </div>
  );
}

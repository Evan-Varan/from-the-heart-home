import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopbar } from "./PortalTopbar";

interface PortalShellProps {
  children: ReactNode;
  pageTitle?: string;
}

export function PortalShell({ children, pageTitle }: PortalShellProps) {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset>
        <PortalTopbar pageTitle={pageTitle} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

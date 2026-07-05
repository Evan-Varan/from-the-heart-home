import { useUser } from "@clerk/tanstack-react-start";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleNav } from "./RoleNav";
import type { UserRole } from "@/portal/types";
import logoMark from "@/assets/logo-mark-small.webp";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarLogo() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <a
      href="/"
      className="flex items-center gap-2.5"
      aria-label="From the Heart Tutoring home"
    >
      <img
        src={logoMark}
        alt="From the Heart Tutoring"
        className="h-7 w-7 shrink-0 object-contain"
      />
      {!collapsed && (
        <span className="text-sm font-semibold text-foreground">
          Student Portal
        </span>
      )}
    </a>
  );
}

export function PortalSidebar() {
  const { user } = useUser();

  const role =
    ((user?.publicMetadata as { role?: string } | undefined)?.role as UserRole | undefined) ??
    "family";
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl = user?.imageUrl;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-12 flex-row items-center justify-start border-b border-border py-0 px-3">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <RoleNav role={role} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full"
              tooltip={displayName}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left leading-tight">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <a href="/portal/logout">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

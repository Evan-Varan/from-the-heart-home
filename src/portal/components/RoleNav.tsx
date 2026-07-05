import { useRouterState } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  Receipt,
  MessageSquare,
  FileText,
  Settings,
  CalendarDays,
  ClipboardList,
  User,
  BarChart3,
  BookMarked,
  Home,
} from "lucide-react";
import type { UserRole } from "@/portal/types";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

const familyNav: NavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Schedule", href: "/portal/schedule", icon: Calendar },
  { label: "Sessions", href: "/portal/sessions", icon: Clock },
  { label: "Students", href: "/portal/students", icon: GraduationCap },
  { label: "Tutors", href: "/portal/tutors", icon: Users },
  { label: "Invoices", href: "/portal/invoices", icon: Receipt },
  { label: "Messages", href: "/portal/messages", icon: MessageSquare },
  { label: "Files", href: "/portal/files", icon: FileText },
];

const tutorNav: NavItem[] = [
  { label: "Dashboard", href: "/portal/tutor", icon: LayoutDashboard, exact: true },
  { label: "Sessions", href: "/portal/tutor/sessions", icon: Clock },
  { label: "Availability", href: "/portal/tutor/availability", icon: CalendarDays },
  { label: "Students", href: "/portal/tutor/students", icon: GraduationCap },
  { label: "Messages", href: "/portal/tutor/messages", icon: MessageSquare },
  { label: "Session Log", href: "/portal/tutor/log", icon: ClipboardList },
  { label: "Profile", href: "/portal/tutor/profile", icon: User },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/portal/admin", icon: LayoutDashboard, exact: true },
  { label: "Families", href: "/portal/admin/families", icon: Home },
  { label: "Students", href: "/portal/admin/students", icon: GraduationCap },
  { label: "Tutors", href: "/portal/admin/tutors", icon: Users },
  { label: "Sessions", href: "/portal/admin/sessions", icon: Calendar },
  { label: "Booking Requests", href: "/portal/admin/booking-requests", icon: BookMarked },
  { label: "Invoices", href: "/portal/admin/invoices", icon: Receipt },
  { label: "Messages", href: "/portal/admin/messages", icon: MessageSquare },
  { label: "Reports", href: "/portal/admin/reports", icon: BarChart3 },
];

const settingsItem: NavItem = {
  label: "Settings",
  href: "/portal/settings/account",
  icon: Settings,
};

function navForRole(role: UserRole): NavItem[] {
  if (role === "tutor") return tutorNav;
  if (role === "admin") return adminNav;
  return familyNav;
}

interface RoleNavProps {
  role: UserRole;
}

export function RoleNav({ role }: RoleNavProps) {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const mainItems = navForRole(role);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item)}
                  tooltip={item.label}
                >
                  <a href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive(settingsItem)}
                tooltip={settingsItem.label}
              >
                <a href={settingsItem.href}>
                  <settingsItem.icon className="h-4 w-4" />
                  <span>{settingsItem.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

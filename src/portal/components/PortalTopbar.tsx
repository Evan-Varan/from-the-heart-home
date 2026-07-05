import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationMenu } from "./NotificationMenu";

interface PortalTopbarProps {
  pageTitle?: string;
}

export function PortalTopbar({ pageTitle }: PortalTopbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      {pageTitle && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-foreground">{pageTitle}</span>
        </>
      )}
      <div className="ml-auto flex items-center gap-1">
        <NotificationMenu />
      </div>
    </header>
  );
}

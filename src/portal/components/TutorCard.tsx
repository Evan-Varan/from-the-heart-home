import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TutorCardProps {
  name: string;
  displayName?: string;
  subjects?: string[];
  avatarUrl?: string;
  status?: "active" | "inactive";
  className?: string;
  onClick?: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TutorCard({
  name,
  displayName,
  subjects = [],
  avatarUrl,
  status = "active",
  className,
  onClick,
}: TutorCardProps) {
  return (
    <Card
      className={cn("gap-3 transition-shadow hover:shadow-md", onClick && "cursor-pointer", className)}
      onClick={onClick}
    >
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {initials(displayName ?? name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm">{displayName ?? name}</p>
          {status === "inactive" && (
            <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      {subjects.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {subjects.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

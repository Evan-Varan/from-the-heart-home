import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { AnyStatus } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  subject: string;
  tutorName: string;
  date: string;
  time: string;
  status: AnyStatus;
  durationMinutes?: number;
  className?: string;
}

export function SessionCard({
  subject,
  tutorName,
  date,
  time,
  status,
  durationMinutes,
  className,
}: SessionCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <p className="font-medium text-sm">{subject}</p>
          <p className="text-xs text-muted-foreground">{tutorName}</p>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {date} · {time}
          {durationMinutes ? ` · ${durationMinutes} min` : ""}
        </p>
      </CardContent>
    </Card>
  );
}

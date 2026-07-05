import { EmptyState } from "./EmptyState";
import { Calendar } from "lucide-react";

export function CalendarGrid() {
  return (
    <EmptyState
      icon={<Calendar className="h-6 w-6" />}
      title="Calendar coming soon"
      description="Session scheduling and calendar view will appear here."
    />
  );
}

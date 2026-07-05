import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
}

interface StudentSwitcherProps {
  students?: Student[];
  activeStudentId?: string;
  onSelect?: (studentId: string) => void;
}

export function StudentSwitcher({ students = [], activeStudentId, onSelect }: StudentSwitcherProps) {
  const active = students.find((s) => s.id === activeStudentId) ?? students[0];

  if (students.length === 0) return null;

  if (students.length === 1) {
    return (
      <span className="text-sm font-medium text-foreground">{active?.name}</span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 px-2 font-medium">
          {active?.name ?? "Select student"}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch student</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect?.(s.id)}
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          >
            {s.name}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

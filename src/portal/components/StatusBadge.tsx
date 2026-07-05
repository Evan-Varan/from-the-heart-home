import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SessionStatus =
  | "requested"
  | "pending_approval"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show"
  | "declined";

type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "past_due"
  | "void"
  | "uncollectible";

type AttendanceStatus =
  | "attended"
  | "student_no_show"
  | "tutor_no_show"
  | "late_cancellation"
  | "on_time_cancellation";

export type AnyStatus = SessionStatus | InvoiceStatus | AttendanceStatus;

const statusConfig: Record<AnyStatus, { label: string; className: string }> = {
  // Session
  requested: { label: "Requested", className: "bg-blue-50 text-blue-700 border-blue-200" },
  pending_approval: { label: "Pending Approval", className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed", className: "bg-slate-50 text-slate-600 border-slate-200" },
  canceled: { label: "Canceled", className: "bg-red-50 text-red-700 border-red-200" },
  no_show: { label: "No-show", className: "bg-red-50 text-red-700 border-red-200" },
  declined: { label: "Declined", className: "bg-red-50 text-red-700 border-red-200" },
  // Invoice
  draft: { label: "Draft", className: "bg-slate-50 text-slate-600 border-slate-200" },
  open: { label: "Open", className: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  past_due: { label: "Past Due", className: "bg-red-50 text-red-700 border-red-200" },
  void: { label: "Void", className: "bg-slate-50 text-slate-500 border-slate-200" },
  uncollectible: { label: "Uncollectible", className: "bg-slate-50 text-slate-500 border-slate-200" },
  // Attendance
  attended: { label: "Attended", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  student_no_show: { label: "Student No-show", className: "bg-red-50 text-red-700 border-red-200" },
  tutor_no_show: { label: "Tutor No-show", className: "bg-red-50 text-red-700 border-red-200" },
  late_cancellation: { label: "Late Cancellation", className: "bg-amber-50 text-amber-700 border-amber-200" },
  on_time_cancellation: { label: "On-time Cancellation", className: "bg-slate-50 text-slate-600 border-slate-200" },
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

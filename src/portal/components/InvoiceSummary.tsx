import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { AnyStatus } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface InvoiceSummaryProps {
  invoiceNumber: string;
  period: string;
  amountCents: number;
  status: AnyStatus;
  dueDate?: string;
  className?: string;
}

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function InvoiceSummary({
  invoiceNumber,
  period,
  amountCents,
  status,
  dueDate,
  className,
}: InvoiceSummaryProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{invoiceNumber}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">{formatCents(amountCents)}</p>
        <p className="text-xs text-muted-foreground">
          {period}
          {dueDate ? ` · Due ${dueDate}` : ""}
        </p>
      </CardContent>
    </Card>
  );
}

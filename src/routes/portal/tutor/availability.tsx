import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getMyAvailability,
  addAvailabilityBlock,
  updateAvailabilityBlock,
  deleteAvailabilityBlock,
} from "@/portal/api/tutors";
import type { AvailabilityBlockData } from "@/portal/api/tutors";
import { PortalShell } from "@/portal/components/PortalShell";
import { PageHeader } from "@/portal/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon–Sun display order

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
];

const LOCATION_TYPES = [
  { value: "virtual", label: "Virtual" },
  { value: "in_person", label: "In-Person" },
  { value: "either", label: "Either" },
];

export const Route = createFileRoute("/portal/tutor/availability")({
  loader: () => getMyAvailability(),
  component: AvailabilityPage,
});

function locationBadge(type: string) {
  if (type === "in_person") return <Badge variant="outline">In-Person</Badge>;
  if (type === "either") return <Badge variant="secondary">Either</Badge>;
  return <Badge variant="outline" className="text-primary border-primary/40">Virtual</Badge>;
}

interface BlockFormState {
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  location_type: "virtual" | "in_person" | "either";
}

function defaultForm(day: number): BlockFormState {
  return {
    day_of_week: day,
    start_time: "09:00",
    end_time: "11:00",
    timezone: "America/New_York",
    location_type: "virtual",
  };
}

interface BlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editBlock?: AvailabilityBlockData | null;
  defaultDay: number;
}

function BlockDialog({ open, onClose, onSave, editBlock, defaultDay }: BlockDialogProps) {
  const [form, setForm] = useState<BlockFormState>(
    editBlock
      ? {
          day_of_week: editBlock.day_of_week,
          start_time: editBlock.start_time,
          end_time: editBlock.end_time,
          timezone: editBlock.timezone,
          location_type: editBlock.location_type as "virtual" | "in_person" | "either",
        }
      : defaultForm(defaultDay),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlockFormState>(k: K, v: BlockFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editBlock) {
        await updateAvailabilityBlock({ data: { blockId: editBlock.id, ...form } });
      } else {
        await addAvailabilityBlock({ data: form });
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editBlock ? "Edit Block" : "Add Availability Block"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Day</Label>
            <Select
              value={String(form.day_of_week)}
              onValueChange={(v) => set("day_of_week", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_ORDER.map((d) => (
                  <SelectItem key={d} value={String(d)}>{DAYS[d]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="time"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Session Type</Label>
            <Select
              value={form.location_type}
              onValueChange={(v) => set("location_type", v as "virtual" | "in_person" | "either")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((lt) => (
                  <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AvailabilityPage() {
  const blocks = Route.useLoaderData();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBlock, setEditBlock] = useState<AvailabilityBlockData | null>(null);
  const [defaultDay, setDefaultDay] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const byDay = DAY_ORDER.reduce<Record<number, AvailabilityBlockData[]>>((acc, d) => {
    acc[d] = blocks
      .filter((b) => b.day_of_week === d)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return acc;
  }, {} as Record<number, AvailabilityBlockData[]>);

  const refresh = () => router.invalidate();

  const openAdd = (day: number) => {
    setEditBlock(null);
    setDefaultDay(day);
    setDialogOpen(true);
  };

  const openEdit = (block: AvailabilityBlockData) => {
    setEditBlock(block);
    setDialogOpen(true);
  };

  const handleDelete = async (blockId: string) => {
    setDeletingId(blockId);
    try {
      await deleteAvailabilityBlock({ data: { blockId } });
      refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const totalBlocks = blocks.length;

  return (
    <PortalShell pageTitle="Availability">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Weekly Availability"
          description="Set your recurring weekly schedule. Blocks repeat every week."
          actions={
            <Button size="sm" onClick={() => openAdd(1)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Block
            </Button>
          }
        />

        {totalBlocks === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No availability set yet. Add your first block to get started.
          </p>
        )}

        <div className="space-y-3">
          {DAY_ORDER.map((day) => {
            const dayBlocks = byDay[day] ?? [];
            return (
              <Card key={day}>
                <CardHeader className="py-3 px-4 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-semibold">{DAYS[day]}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => openAdd(day)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </CardHeader>
                {dayBlocks.length > 0 && (
                  <CardContent className="px-4 pb-3 pt-0 space-y-2">
                    {dayBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-medium tabular-nums">
                            {block.start_time} – {block.end_time}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {TIMEZONES.find((tz) => tz.value === block.timezone)?.label ?? block.timezone}
                          </span>
                          {locationBadge(block.location_type)}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(block)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this block?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {DAYS[block.day_of_week]} {block.start_time}–{block.end_time} will
                                  be removed from your schedule.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(block.id)}
                                  disabled={deletingId === block.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <BlockDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={refresh}
        editBlock={editBlock}
        defaultDay={defaultDay}
      />
    </PortalShell>
  );
}

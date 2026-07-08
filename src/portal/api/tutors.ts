import { createServerFn } from "@tanstack/react-start";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "@clerk/tanstack-react-start/server";
import { getDb } from "@/portal/lib/db.server";
import { users, tutors, tutor_subjects, tutor_availability_blocks, subjects } from "@/portal/db/schema";
import { assertAuthenticated, assertRole } from "@/portal/permissions";
import type { UserRole } from "@/portal/types";
import { recordAuditEvent } from "@/portal/api/audit";
import { ValidationError, NotFoundError, ForbiddenError, ConflictError } from "@/portal/lib/errors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TutorSubjectData {
  id: string;
  subject_id: string;
  name: string;
  category: string | null;
  grade_min: number | null;
  grade_max: number | null;
}

export interface TutorData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  photo_file_id: string | null;
  phone: string | null;
  email: string | null;
  meeting_link: string | null;
  in_person_available: number;
  default_hourly_rate_cents: number | null;
  pay_reporting_rate_cents: number | null;
  status: string;
  subjects: TutorSubjectData[];
}

export interface AvailabilityBlockData {
  id: string;
  tutor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  location_type: string;
  active: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getCurrentUser(db: ReturnType<typeof import("@/portal/lib/db.server").getDb>) {
  const { userId: clerkId } = await auth();
  assertAuthenticated(clerkId);
  const user = await db.query.users.findFirst({
    where: eq(users.auth_provider_user_id, clerkId),
  });
  if (!user) throw new ValidationError("User not found.");
  return user;
}

function mapTutorRow(
  row: typeof tutors.$inferSelect & {
    tutor_subjects?: (typeof tutor_subjects.$inferSelect & {
      subject?: typeof subjects.$inferSelect | null;
    })[];
  },
): TutorData {
  return {
    id: row.id,
    user_id: row.user_id,
    display_name: row.display_name,
    bio: row.bio ?? null,
    photo_file_id: row.photo_file_id ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    meeting_link: row.meeting_link ?? null,
    in_person_available: row.in_person_available,
    default_hourly_rate_cents: row.default_hourly_rate_cents ?? null,
    pay_reporting_rate_cents: row.pay_reporting_rate_cents ?? null,
    status: row.status,
    subjects: (row.tutor_subjects ?? []).map((ts) => ({
      id: ts.id,
      subject_id: ts.subject_id,
      name: ts.subject?.name ?? "",
      category: ts.subject?.category ?? null,
      grade_min: ts.grade_min ?? null,
      grade_max: ts.grade_max ?? null,
    })),
  };
}

// ---------------------------------------------------------------------------
// Tutor profile — tutor-facing
// ---------------------------------------------------------------------------

export const getMyTutorProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<TutorData | null> => {
    const db = getDb();
    const user = await getCurrentUser(db);

    const row = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    return row ? mapTutorRow(row) : null;
  },
);

export interface UpsertTutorProfileInput {
  display_name: string;
  bio?: string;
  phone?: string;
  email?: string;
  meeting_link?: string;
  in_person_available?: boolean;
}

export const upsertTutorProfile = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: UpsertTutorProfileInput }): Promise<TutorData> => {
    const input = ctx.data;
    if (!input.display_name?.trim()) throw new ValidationError("Display name is required.");

    const db = getDb();
    const user = await getCurrentUser(db);

    const existing = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
    });

    if (existing) {
      await db
        .update(tutors)
        .set({
          display_name: input.display_name.trim(),
          bio: input.bio?.trim() || null,
          phone: input.phone?.trim() || null,
          email: input.email?.trim() || null,
          meeting_link: input.meeting_link?.trim() || null,
          in_person_available: input.in_person_available ? 1 : 0,
        })
        .where(eq(tutors.id, existing.id));

      await recordAuditEvent(db, {
        actorId: user.id,
        entityType: "tutor",
        entityId: existing.id,
        eventType: "tutor.profile.updated",
        timestamp: new Date(),
      });
    } else {
      const tutorId = crypto.randomUUID();
      await db.insert(tutors).values({
        id: tutorId,
        user_id: user.id,
        display_name: input.display_name.trim(),
        bio: input.bio?.trim() || null,
        phone: input.phone?.trim() || null,
        email: input.email?.trim() || null,
        meeting_link: input.meeting_link?.trim() || null,
        in_person_available: input.in_person_available ? 1 : 0,
        status: "pending",
      });

      await recordAuditEvent(db, {
        actorId: user.id,
        entityType: "tutor",
        entityId: tutorId,
        eventType: "tutor.profile.submitted",
        timestamp: new Date(),
      });
    }

    const updated = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    return mapTutorRow(updated!);
  },
);

// ---------------------------------------------------------------------------
// Tutor profile — admin-facing
// ---------------------------------------------------------------------------

export const getAllTutorsAdmin = createServerFn({ method: "GET" }).handler(
  async (): Promise<TutorData[]> => {
    const db = getDb();
    const user = await getCurrentUser(db);
    assertRole(user.role as UserRole, "admin");

    const rows = await db.query.tutors.findMany({
      with: { tutor_subjects: { with: { subject: true } } },
    });
    return rows.map(mapTutorRow);
  },
);

export const getTutorAdmin = createServerFn({ method: "GET" }).handler(
  async (ctx: { data: { tutorId: string } }): Promise<TutorData> => {
    const db = getDb();
    const user = await getCurrentUser(db);
    assertRole(user.role as UserRole, "admin");

    const row = await db.query.tutors.findFirst({
      where: eq(tutors.id, ctx.data.tutorId),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    if (!row) throw new NotFoundError("Tutor not found.");
    return mapTutorRow(row);
  },
);

export interface AdminUpdateTutorInput {
  tutorId: string;
  display_name?: string;
  bio?: string;
  phone?: string;
  email?: string;
  meeting_link?: string;
  in_person_available?: boolean;
  status?: "pending" | "active" | "inactive";
  default_hourly_rate_cents?: number | null;
  pay_reporting_rate_cents?: number | null;
  // subjects: array of { subject_id, grade_min?, grade_max? }
  subject_assignments?: { subject_id: string; grade_min?: number | null; grade_max?: number | null }[];
}

export const adminUpdateTutor = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: AdminUpdateTutorInput }): Promise<TutorData> => {
    const { tutorId, subject_assignments, ...fields } = ctx.data;
    if (!tutorId) throw new ValidationError("Tutor ID is required.");

    const db = getDb();
    const user = await getCurrentUser(db);
    assertRole(user.role as UserRole, "admin");

    const existing = await db.query.tutors.findFirst({
      where: eq(tutors.id, tutorId),
    });
    if (!existing) throw new NotFoundError("Tutor not found.");

    const updates: Record<string, unknown> = {};
    if (fields.display_name !== undefined) updates.display_name = fields.display_name.trim();
    if (fields.bio !== undefined) updates.bio = fields.bio?.trim() || null;
    if (fields.phone !== undefined) updates.phone = fields.phone?.trim() || null;
    if (fields.email !== undefined) updates.email = fields.email?.trim() || null;
    if (fields.meeting_link !== undefined) updates.meeting_link = fields.meeting_link?.trim() || null;
    if (fields.in_person_available !== undefined) updates.in_person_available = fields.in_person_available ? 1 : 0;
    if (fields.status !== undefined) updates.status = fields.status;
    if (fields.default_hourly_rate_cents !== undefined) updates.default_hourly_rate_cents = fields.default_hourly_rate_cents;
    if (fields.pay_reporting_rate_cents !== undefined) updates.pay_reporting_rate_cents = fields.pay_reporting_rate_cents;

    if (Object.keys(updates).length > 0) {
      await db.update(tutors).set(updates).where(eq(tutors.id, tutorId));
    }

    if (subject_assignments !== undefined) {
      await db.delete(tutor_subjects).where(eq(tutor_subjects.tutor_id, tutorId));
      for (const sa of subject_assignments) {
        await db.insert(tutor_subjects).values({
          tutor_id: tutorId,
          subject_id: sa.subject_id,
          grade_min: sa.grade_min ?? null,
          grade_max: sa.grade_max ?? null,
        });
      }
    }

    await recordAuditEvent(db, {
      actorId: user.id,
      entityType: "tutor",
      entityId: tutorId,
      eventType: "tutor.admin.updated",
      metadata: { changes: Object.keys(updates) },
      timestamp: new Date(),
    });

    const updated = await db.query.tutors.findFirst({
      where: eq(tutors.id, tutorId),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    return mapTutorRow(updated!);
  },
);

// ---------------------------------------------------------------------------
// Tutor directory — family-facing (active tutors only)
// ---------------------------------------------------------------------------

export const getTutors = createServerFn({ method: "GET" }).handler(
  async (): Promise<TutorData[]> => {
    const db = getDb();
    const rows = await db.query.tutors.findMany({
      where: eq(tutors.status, "active"),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    return rows.map(mapTutorRow);
  },
);

export const getTutor = createServerFn({ method: "GET" }).handler(
  async (ctx: { data: { tutorId: string } }): Promise<TutorData> => {
    const db = getDb();
    const row = await db.query.tutors.findFirst({
      where: eq(tutors.id, ctx.data.tutorId),
      with: { tutor_subjects: { with: { subject: true } } },
    });
    if (!row) throw new NotFoundError("Tutor not found.");
    return mapTutorRow(row);
  },
);

// ---------------------------------------------------------------------------
// Availability blocks
// ---------------------------------------------------------------------------

export const getMyAvailability = createServerFn({ method: "GET" }).handler(
  async (): Promise<AvailabilityBlockData[]> => {
    const db = getDb();
    const user = await getCurrentUser(db);

    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
    });
    if (!tutor) return [];

    return db.query.tutor_availability_blocks.findMany({
      where: eq(tutor_availability_blocks.tutor_id, tutor.id),
    }) as Promise<AvailabilityBlockData[]>;
  },
);

export const getTutorAvailabilityBlocks = createServerFn({ method: "GET" }).handler(
  async (ctx: { data: { tutorId: string } }): Promise<AvailabilityBlockData[]> => {
    const db = getDb();
    return db.query.tutor_availability_blocks.findMany({
      where: and(
        eq(tutor_availability_blocks.tutor_id, ctx.data.tutorId),
        eq(tutor_availability_blocks.active, 1),
      ),
    }) as Promise<AvailabilityBlockData[]>;
  },
);

export interface AddAvailabilityBlockInput {
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  location_type: "virtual" | "in_person" | "either";
}

function timesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 < e2 && s2 < e1;
}

export const addAvailabilityBlock = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: AddAvailabilityBlockInput }): Promise<AvailabilityBlockData> => {
    const input = ctx.data;
    if (input.start_time >= input.end_time) throw new ValidationError("Start time must be before end time.");

    const db = getDb();
    const user = await getCurrentUser(db);

    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
    });
    if (!tutor) throw new NotFoundError("Tutor profile not found. Create your profile first.");

    // Check for overlapping active blocks on the same day
    const existing = await db.query.tutor_availability_blocks.findMany({
      where: and(
        eq(tutor_availability_blocks.tutor_id, tutor.id),
        eq(tutor_availability_blocks.day_of_week, input.day_of_week),
        eq(tutor_availability_blocks.active, 1),
      ),
    });
    for (const block of existing) {
      if (timesOverlap(input.start_time, input.end_time, block.start_time, block.end_time)) {
        throw new ConflictError(
          `This block overlaps with an existing block (${block.start_time}–${block.end_time}).`,
        );
      }
    }

    const blockId = crypto.randomUUID();
    await db.insert(tutor_availability_blocks).values({
      id: blockId,
      tutor_id: tutor.id,
      day_of_week: input.day_of_week,
      start_time: input.start_time,
      end_time: input.end_time,
      timezone: input.timezone,
      location_type: input.location_type,
      active: 1,
    });

    const created = await db.query.tutor_availability_blocks.findFirst({
      where: eq(tutor_availability_blocks.id, blockId),
    });
    return created as AvailabilityBlockData;
  },
);

export interface UpdateAvailabilityBlockInput {
  blockId: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  location_type?: "virtual" | "in_person" | "either";
  active?: boolean;
}

export const updateAvailabilityBlock = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: UpdateAvailabilityBlockInput }): Promise<AvailabilityBlockData> => {
    const { blockId, ...fields } = ctx.data;
    if (!blockId) throw new ValidationError("Block ID is required.");

    const db = getDb();
    const user = await getCurrentUser(db);

    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
    });
    if (!tutor) throw new NotFoundError("Tutor profile not found.");

    const block = await db.query.tutor_availability_blocks.findFirst({
      where: and(
        eq(tutor_availability_blocks.id, blockId),
        eq(tutor_availability_blocks.tutor_id, tutor.id),
      ),
    });
    if (!block) throw new NotFoundError("Availability block not found.");

    const newStart = fields.start_time ?? block.start_time;
    const newEnd = fields.end_time ?? block.end_time;
    const newDay = fields.day_of_week ?? block.day_of_week;

    if (newStart >= newEnd) throw new ValidationError("Start time must be before end time.");

    // Overlap check excluding the current block
    const others = await db.query.tutor_availability_blocks.findMany({
      where: and(
        eq(tutor_availability_blocks.tutor_id, tutor.id),
        eq(tutor_availability_blocks.day_of_week, newDay),
        eq(tutor_availability_blocks.active, 1),
        ne(tutor_availability_blocks.id, blockId),
      ),
    });
    for (const other of others) {
      if (timesOverlap(newStart, newEnd, other.start_time, other.end_time)) {
        throw new ConflictError(
          `This block overlaps with an existing block (${other.start_time}–${other.end_time}).`,
        );
      }
    }

    const updates: Record<string, unknown> = {};
    if (fields.day_of_week !== undefined) updates.day_of_week = fields.day_of_week;
    if (fields.start_time !== undefined) updates.start_time = fields.start_time;
    if (fields.end_time !== undefined) updates.end_time = fields.end_time;
    if (fields.timezone !== undefined) updates.timezone = fields.timezone;
    if (fields.location_type !== undefined) updates.location_type = fields.location_type;
    if (fields.active !== undefined) updates.active = fields.active ? 1 : 0;

    await db
      .update(tutor_availability_blocks)
      .set(updates)
      .where(eq(tutor_availability_blocks.id, blockId));

    const updated = await db.query.tutor_availability_blocks.findFirst({
      where: eq(tutor_availability_blocks.id, blockId),
    });
    return updated as AvailabilityBlockData;
  },
);

export const deleteAvailabilityBlock = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: { blockId: string } }): Promise<void> => {
    const db = getDb();
    const user = await getCurrentUser(db);

    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.user_id, user.id),
    });
    if (!tutor) throw new ForbiddenError();

    const block = await db.query.tutor_availability_blocks.findFirst({
      where: and(
        eq(tutor_availability_blocks.id, ctx.data.blockId),
        eq(tutor_availability_blocks.tutor_id, tutor.id),
      ),
    });
    if (!block) throw new NotFoundError("Availability block not found.");

    await db
      .delete(tutor_availability_blocks)
      .where(eq(tutor_availability_blocks.id, ctx.data.blockId));
  },
);

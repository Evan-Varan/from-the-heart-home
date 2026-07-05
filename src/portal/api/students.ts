import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/tanstack-react-start/server";
import { getDb } from "@/portal/lib/db.server";
import { users, family_accounts, students, student_subjects } from "@/portal/db/schema";
import { assertAuthenticated, assertFamilyAccess } from "@/portal/permissions";
import type { UserRole } from "@/portal/types";
import { recordAuditEvent } from "@/portal/api/audit";
import { ValidationError, NotFoundError } from "@/portal/lib/errors";

export interface StudentData {
  id: string;
  family_account_id: string;
  first_name: string;
  last_name: string;
  grade_level: string | null;
  school: string | null;
  email: string | null;
  phone: string | null;
  is_adult_student: number;
  goals: string | null;
  learning_challenges: string | null;
  accommodations: string | null;
  parent_notes: string | null;
  status: string;
  subjects: { id: string; name: string; category: string | null }[];
}

async function getActorAndAccount(db: ReturnType<typeof import("@/portal/lib/db.server").getDb>) {
  const { userId: clerkId } = await auth();
  assertAuthenticated(clerkId);

  const user = await db.query.users.findFirst({
    where: eq(users.auth_provider_user_id, clerkId),
  });
  if (!user) throw new ValidationError("User not found.");

  const account = await db.query.family_accounts.findFirst({
    where: eq(family_accounts.primary_user_id, user.id),
  });

  return { user, account };
}

export const getStudents = createServerFn({ method: "GET" }).handler(
  async (): Promise<StudentData[]> => {
    const db = getDb();
    const { user, account } = await getActorAndAccount(db);
    if (!account) return [];

    assertFamilyAccess(user.role as UserRole, user.id, account.primary_user_id);

    const rows = await db.query.students.findMany({
      where: eq(students.family_account_id, account.id),
      with: {
        student_subjects: {
          with: { subject: true },
        },
      },
    });

    return rows.map((s) => ({
      ...s,
      subjects: (s.student_subjects ?? []).map((ss) => ({
        id: ss.subject_id,
        name: ss.subject?.name ?? "",
        category: ss.subject?.category ?? null,
      })),
    }));
  },
);

export const getStudent = createServerFn({ method: "GET" }).handler(
  async (ctx: { data: { studentId: string } }): Promise<StudentData> => {
    const db = getDb();
    const { user, account } = await getActorAndAccount(db);
    if (!account) throw new NotFoundError("No family account found.");

    assertFamilyAccess(user.role as UserRole, user.id, account.primary_user_id);

    const row = await db.query.students.findFirst({
      where: and(
        eq(students.id, ctx.data.studentId),
        eq(students.family_account_id, account.id),
      ),
      with: {
        student_subjects: {
          with: { subject: true },
        },
      },
    });
    if (!row) throw new NotFoundError("Student not found.");

    return {
      ...row,
      subjects: (row.student_subjects ?? []).map((ss) => ({
        id: ss.subject_id,
        name: ss.subject?.name ?? "",
        category: ss.subject?.category ?? null,
      })),
    };
  },
);

export interface CreateStudentInput {
  first_name: string;
  last_name: string;
  grade_level?: string;
  school?: string;
  email?: string;
  phone?: string;
  is_adult_student?: boolean;
  goals?: string;
  learning_challenges?: string;
  accommodations?: string;
  parent_notes?: string;
  subject_ids?: string[];
}

export const createStudent = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: CreateStudentInput }): Promise<StudentData> => {
    const input = ctx.data;
    if (!input.first_name?.trim()) throw new ValidationError("First name is required.");
    if (!input.last_name?.trim()) throw new ValidationError("Last name is required.");

    const db = getDb();
    const { user, account } = await getActorAndAccount(db);
    if (!account) throw new ValidationError("No family account found. Complete onboarding first.");

    assertFamilyAccess(user.role as UserRole, user.id, account.primary_user_id);

    const studentId = crypto.randomUUID();
    await db.insert(students).values({
      id: studentId,
      family_account_id: account.id,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      grade_level: input.grade_level || null,
      school: input.school || null,
      email: input.email || null,
      phone: input.phone || null,
      is_adult_student: input.is_adult_student ? 1 : 0,
      goals: input.goals || null,
      learning_challenges: input.learning_challenges || null,
      accommodations: input.accommodations || null,
      parent_notes: input.parent_notes || null,
      status: "active",
    });

    if (input.subject_ids?.length) {
      for (const subjectId of input.subject_ids) {
        await db.insert(student_subjects).values({
          student_id: studentId,
          subject_id: subjectId,
        });
      }
    }

    await recordAuditEvent(db, {
      actorId: user.id,
      entityType: "user",
      entityId: studentId,
      eventType: "student.created",
      timestamp: new Date(),
    });

    return getStudent({ data: { studentId } });
  },
);

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  studentId: string;
}

export const updateStudent = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: UpdateStudentInput }): Promise<StudentData> => {
    const { studentId, subject_ids, ...fields } = ctx.data;
    if (!studentId) throw new ValidationError("Student ID is required.");

    const db = getDb();
    const { user, account } = await getActorAndAccount(db);
    if (!account) throw new NotFoundError("No family account found.");

    assertFamilyAccess(user.role as UserRole, user.id, account.primary_user_id);

    const existing = await db.query.students.findFirst({
      where: and(eq(students.id, studentId), eq(students.family_account_id, account.id)),
    });
    if (!existing) throw new NotFoundError("Student not found.");

    const updates: Record<string, unknown> = {};
    if (fields.first_name !== undefined) updates.first_name = fields.first_name.trim();
    if (fields.last_name !== undefined) updates.last_name = fields.last_name.trim();
    if (fields.grade_level !== undefined) updates.grade_level = fields.grade_level || null;
    if (fields.school !== undefined) updates.school = fields.school || null;
    if (fields.email !== undefined) updates.email = fields.email || null;
    if (fields.phone !== undefined) updates.phone = fields.phone || null;
    if (fields.is_adult_student !== undefined) updates.is_adult_student = fields.is_adult_student ? 1 : 0;
    if (fields.goals !== undefined) updates.goals = fields.goals || null;
    if (fields.learning_challenges !== undefined) updates.learning_challenges = fields.learning_challenges || null;
    if (fields.accommodations !== undefined) updates.accommodations = fields.accommodations || null;
    if (fields.parent_notes !== undefined) updates.parent_notes = fields.parent_notes || null;

    if (Object.keys(updates).length > 0) {
      await db.update(students).set(updates).where(eq(students.id, studentId));
    }

    if (subject_ids !== undefined) {
      await db.delete(student_subjects).where(eq(student_subjects.student_id, studentId));
      for (const subjectId of subject_ids) {
        await db.insert(student_subjects).values({ student_id: studentId, subject_id: subjectId });
      }
    }

    await recordAuditEvent(db, {
      actorId: user.id,
      entityType: "user",
      entityId: studentId,
      eventType: "student.updated",
      timestamp: new Date(),
    });

    return getStudent({ data: { studentId } });
  },
);

export const archiveStudent = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: { studentId: string } }): Promise<void> => {
    const db = getDb();
    const { user, account } = await getActorAndAccount(db);
    if (!account) throw new NotFoundError("No family account found.");

    assertFamilyAccess(user.role as UserRole, user.id, account.primary_user_id);

    const existing = await db.query.students.findFirst({
      where: and(
        eq(students.id, ctx.data.studentId),
        eq(students.family_account_id, account.id),
      ),
    });
    if (!existing) throw new NotFoundError("Student not found.");

    await db
      .update(students)
      .set({ status: "archived" })
      .where(eq(students.id, ctx.data.studentId));
  },
);

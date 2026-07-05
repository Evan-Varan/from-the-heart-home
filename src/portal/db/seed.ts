// Seed script for the From the Heart Tutoring portal database.
// Call seed(db) from a script or test to populate baseline data.
// It is safe to call multiple times — existing rows are skipped via OR IGNORE.

import type { DB } from "./index";
import {
  users,
  tutors,
  subjects,
  system_settings,
} from "./schema";

export async function seed(db: DB): Promise<void> {
  // -------------------------------------------------------------------------
  // System settings (idempotent — skip if key already exists)
  // -------------------------------------------------------------------------
  const defaultSettings = [
    { key: "default_hourly_rate_cents", value: "7000" },
    { key: "default_session_duration_minutes", value: "60" },
    { key: "cancellation_policy_hours", value: "24" },
    { key: "invoice_grouping", value: "weekly" },
    { key: "payment_block_threshold_cents", value: "0" },
  ];

  for (const setting of defaultSettings) {
    await db
      .insert(system_settings)
      .values({ ...setting, updated_at: Math.floor(Date.now() / 1000) })
      .onConflictDoNothing();
  }

  // -------------------------------------------------------------------------
  // Admin user (owner should update email/name after initial setup)
  // -------------------------------------------------------------------------
  const adminId = crypto.randomUUID();
  const existingAdmin = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, "admin@fromthehearttutoring.com"),
  });

  if (!existingAdmin) {
    await db.insert(users).values({
      id: adminId,
      auth_provider_user_id: "clerk_placeholder_admin",
      email: "admin@fromthehearttutoring.com",
      name: "Portal Admin",
      role: "admin",
      status: "active",
    });
  }

  // -------------------------------------------------------------------------
  // Example tutor user + tutor profile
  // -------------------------------------------------------------------------
  const existingTutorUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, "tutor@fromthehearttutoring.com"),
  });

  if (!existingTutorUser) {
    const tutorUserId = crypto.randomUUID();
    await db.insert(users).values({
      id: tutorUserId,
      auth_provider_user_id: "clerk_placeholder_tutor",
      email: "tutor@fromthehearttutoring.com",
      name: "Example Tutor",
      role: "tutor",
      status: "active",
    });

    await db.insert(tutors).values({
      user_id: tutorUserId,
      display_name: "Example Tutor",
      status: "active",
    });
  }

  // -------------------------------------------------------------------------
  // Common subjects
  // -------------------------------------------------------------------------
  const subjectList: Array<{ name: string; category: string }> = [
    { name: "Math", category: "Math" },
    { name: "Algebra", category: "Math" },
    { name: "Geometry", category: "Math" },
    { name: "Pre-Calculus", category: "Math" },
    { name: "Calculus", category: "Math" },
    { name: "Science", category: "Science" },
    { name: "Biology", category: "Science" },
    { name: "Chemistry", category: "Science" },
    { name: "Physics", category: "Science" },
    { name: "English", category: "English" },
    { name: "Writing", category: "English" },
    { name: "Reading", category: "English" },
    { name: "History", category: "Social Studies" },
    { name: "SAT Prep", category: "Test Prep" },
    { name: "ACT Prep", category: "Test Prep" },
    { name: "Spanish", category: "Language" },
  ];

  for (const subject of subjectList) {
    const existing = await db.query.subjects.findFirst({
      where: (s, { eq }) => eq(s.name, subject.name),
    });
    if (!existing) {
      await db.insert(subjects).values({
        name: subject.name,
        category: subject.category,
        active: 1,
      });
    }
  }
}

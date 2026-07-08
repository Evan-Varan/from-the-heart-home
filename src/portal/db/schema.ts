// Drizzle ORM schema for the From the Heart Tutoring portal.
// Database: Cloudflare D1 (SQLite). No arrays, no native enums — use TEXT.
// Booleans → INTEGER (0/1). Timestamps → INTEGER (unix seconds) or { mode: 'timestamp' }.
// UUIDs → crypto.randomUUID() (available in Workers runtime).

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  auth_provider_user_id: text("auth_provider_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  // 'family' | 'tutor' | 'admin'
  role: text("role").notNull(),
  // 'active' | 'pending' | 'disabled'
  status: text("status").notNull().default("pending"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// family_accounts
// ---------------------------------------------------------------------------
export const family_accounts = sqliteTable("family_accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  primary_user_id: text("primary_user_id")
    .notNull()
    .references(() => users.id),
  // 'parent_managed' | 'adult_student'
  account_type: text("account_type").notNull().default("parent_managed"),
  billing_email: text("billing_email"),
  billing_phone: text("billing_phone"),
  stripe_customer_id: text("stripe_customer_id"),
  // 'ok' | 'past_due' | 'blocked'
  billing_status: text("billing_status").notNull().default("ok"),
  // 'started' | 'payment_required' | 'ready' | 'needs_admin_review'
  onboarding_status: text("onboarding_status").notNull().default("started"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// students
// ---------------------------------------------------------------------------
export const students = sqliteTable("students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id")
    .notNull()
    .references(() => family_accounts.id),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  grade_level: text("grade_level"),
  school: text("school"),
  email: text("email"),
  phone: text("phone"),
  // INTEGER boolean: 0 = false, 1 = true
  is_adult_student: integer("is_adult_student").notNull().default(0),
  goals: text("goals"),
  learning_challenges: text("learning_challenges"),
  accommodations: text("accommodations"),
  parent_notes: text("parent_notes"),
  // 'active' | 'inactive' | 'archived'
  status: text("status").notNull().default("active"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// tutors
// ---------------------------------------------------------------------------
export const tutors = sqliteTable("tutors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  display_name: text("display_name").notNull(),
  bio: text("bio"),
  photo_file_id: text("photo_file_id"),
  phone: text("phone"),
  email: text("email"),
  meeting_link: text("meeting_link"),
  // INTEGER boolean
  in_person_available: integer("in_person_available").notNull().default(0),
  default_hourly_rate_cents: integer("default_hourly_rate_cents"),
  pay_reporting_rate_cents: integer("pay_reporting_rate_cents"),
  // 'pending' | 'active' | 'inactive'
  status: text("status").notNull().default("pending"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// subjects
// ---------------------------------------------------------------------------
export const subjects = sqliteTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category"),
  active: integer("active").notNull().default(1),
});

// ---------------------------------------------------------------------------
// student_subjects
// ---------------------------------------------------------------------------
export const student_subjects = sqliteTable("student_subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  student_id: text("student_id")
    .notNull()
    .references(() => students.id),
  subject_id: text("subject_id")
    .notNull()
    .references(() => subjects.id),
  notes: text("notes"),
});

// ---------------------------------------------------------------------------
// tutor_subjects
// ---------------------------------------------------------------------------
export const tutor_subjects = sqliteTable("tutor_subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  tutor_id: text("tutor_id")
    .notNull()
    .references(() => tutors.id),
  subject_id: text("subject_id")
    .notNull()
    .references(() => subjects.id),
  grade_min: integer("grade_min"),
  grade_max: integer("grade_max"),
  notes: text("notes"),
});

// ---------------------------------------------------------------------------
// tutor_availability_blocks
// ---------------------------------------------------------------------------
export const tutor_availability_blocks = sqliteTable(
  "tutor_availability_blocks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    tutor_id: text("tutor_id")
      .notNull()
      .references(() => tutors.id),
    // 0 = Sunday … 6 = Saturday
    day_of_week: integer("day_of_week").notNull(),
    // HH:MM
    start_time: text("start_time").notNull(),
    end_time: text("end_time").notNull(),
    timezone: text("timezone").notNull(),
    // 'virtual' | 'in_person' | 'either'
    location_type: text("location_type").notNull().default("virtual"),
    active: integer("active").notNull().default(1),
  },
);

// ---------------------------------------------------------------------------
// sessions
// ---------------------------------------------------------------------------
export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id")
    .notNull()
    .references(() => family_accounts.id),
  student_id: text("student_id")
    .notNull()
    .references(() => students.id),
  tutor_id: text("tutor_id")
    .notNull()
    .references(() => tutors.id),
  subject_id: text("subject_id").references(() => subjects.id),
  booking_request_id: text("booking_request_id"),
  // Unix timestamp (seconds)
  starts_at: integer("starts_at").notNull(),
  ends_at: integer("ends_at").notNull(),
  timezone: text("timezone").notNull(),
  // 'virtual' | 'in_person'
  location_type: text("location_type").notNull(),
  location: text("location"),
  meeting_link: text("meeting_link"),
  // 'requested'|'pending_approval'|'confirmed'|'completed'|'canceled'|'no_show'|'declined'
  status: text("status").notNull().default("requested"),
  price_cents: integer("price_cents"),
  duration_minutes: integer("duration_minutes"),
  // JSON snapshot of billing policy at time of booking
  billing_policy_snapshot: text("billing_policy_snapshot"),
  created_by_user_id: text("created_by_user_id"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// booking_requests
// ---------------------------------------------------------------------------
export const booking_requests = sqliteTable("booking_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id").notNull(),
  student_id: text("student_id").notNull(),
  requested_tutor_id: text("requested_tutor_id"),
  assigned_tutor_id: text("assigned_tutor_id"),
  subject_id: text("subject_id"),
  requested_starts_at: integer("requested_starts_at"),
  requested_ends_at: integer("requested_ends_at"),
  is_recurring: integer("is_recurring").notNull().default(0),
  recurrence_until: integer("recurrence_until"),
  requested_location_type: text("requested_location_type"),
  requested_location: text("requested_location"),
  // 'pending'|'accepted'|'declined'|'admin_assigned'|'canceled'
  status: text("status").notNull().default("pending"),
  message: text("message"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// session_attendance
// ---------------------------------------------------------------------------
export const session_attendance = sqliteTable("session_attendance", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  session_id: text("session_id")
    .notNull()
    .references(() => sessions.id),
  marked_by_user_id: text("marked_by_user_id"),
  // 'attended'|'student_no_show'|'tutor_no_show'|'canceled_late'|'canceled_on_time'
  state: text("state").notNull(),
  notes: text("notes"),
  // Unix timestamp
  marked_at: integer("marked_at"),
});

// ---------------------------------------------------------------------------
// session_notes
// ---------------------------------------------------------------------------
export const session_notes = sqliteTable("session_notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  session_id: text("session_id").notNull(),
  author_user_id: text("author_user_id").notNull(),
  notes: text("notes").notNull(),
  visible_to_family: integer("visible_to_family").notNull().default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// invoices
// ---------------------------------------------------------------------------
export const invoices = sqliteTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id").notNull(),
  stripe_invoice_id: text("stripe_invoice_id"),
  invoice_number: text("invoice_number"),
  // 'draft'|'open'|'paid'|'void'|'uncollectible'|'past_due'
  status: text("status").notNull().default("draft"),
  period_start: integer("period_start"),
  period_end: integer("period_end"),
  total_cents: integer("total_cents").notNull().default(0),
  due_at: integer("due_at"),
  autopay_enabled: integer("autopay_enabled").notNull().default(1),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// invoice_line_items
// ---------------------------------------------------------------------------
export const invoice_line_items = sqliteTable("invoice_line_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  invoice_id: text("invoice_id").notNull(),
  session_id: text("session_id"),
  description: text("description").notNull(),
  amount_cents: integer("amount_cents").notNull(),
  // 'scheduled_session'|'late_cancellation'|'no_show'|'on_time_cancellation'
  billing_reason: text("billing_reason").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// payment_methods
// ---------------------------------------------------------------------------
export const payment_methods = sqliteTable("payment_methods", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id").notNull(),
  stripe_payment_method_id: text("stripe_payment_method_id").notNull(),
  brand: text("brand"),
  last4: text("last4"),
  exp_month: integer("exp_month"),
  exp_year: integer("exp_year"),
  is_default: integer("is_default").notNull().default(0),
  status: text("status").notNull().default("active"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// payments
// ---------------------------------------------------------------------------
export const payments = sqliteTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id").notNull(),
  invoice_id: text("invoice_id"),
  stripe_payment_intent_id: text("stripe_payment_intent_id"),
  amount_cents: integer("amount_cents").notNull(),
  status: text("status").notNull(),
  paid_at: integer("paid_at"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// conversations
// ---------------------------------------------------------------------------
export const conversations = sqliteTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  family_account_id: text("family_account_id").notNull(),
  student_id: text("student_id"),
  tutor_id: text("tutor_id"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------
export const messages = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversation_id: text("conversation_id").notNull(),
  sender_user_id: text("sender_user_id").notNull(),
  body: text("body").notNull(),
  // Unix timestamp
  created_at: integer("created_at").notNull(),
  read_at: integer("read_at"),
});

// ---------------------------------------------------------------------------
// files
// ---------------------------------------------------------------------------
export const files = sqliteTable("files", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  uploaded_by_user_id: text("uploaded_by_user_id").notNull(),
  family_account_id: text("family_account_id"),
  student_id: text("student_id"),
  session_id: text("session_id"),
  r2_key: text("r2_key").notNull(),
  filename: text("filename").notNull(),
  content_type: text("content_type").notNull(),
  size_bytes: integer("size_bytes").notNull(),
  // 'family' | 'tutor' | 'admin'
  visibility: text("visibility").notNull().default("family"),
  // Unix timestamp
  created_at: integer("created_at").notNull(),
});

// ---------------------------------------------------------------------------
// notification_preferences
// ---------------------------------------------------------------------------
export const notification_preferences = sqliteTable(
  "notification_preferences",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    user_id: text("user_id").notNull(),
    email_enabled: integer("email_enabled").notNull().default(1),
    sms_enabled: integer("sms_enabled").notNull().default(1),
    session_reminders: integer("session_reminders").notNull().default(1),
    billing_alerts: integer("billing_alerts").notNull().default(1),
    message_alerts: integer("message_alerts").notNull().default(1),
    created_at: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
);

// ---------------------------------------------------------------------------
// notifications
// ---------------------------------------------------------------------------
export const notifications = sqliteTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull(),
  // 'email' | 'sms'
  channel: text("channel").notNull(),
  event_type: text("event_type").notNull(),
  // 'pending'|'sent'|'failed'|'skipped'
  status: text("status").notNull().default("pending"),
  provider_message_id: text("provider_message_id"),
  // JSON
  metadata: text("metadata"),
  // Unix timestamp
  created_at: integer("created_at").notNull(),
  sent_at: integer("sent_at"),
});

// ---------------------------------------------------------------------------
// audit_events
// ---------------------------------------------------------------------------
export const audit_events = sqliteTable("audit_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  actor_user_id: text("actor_user_id"),
  entity_type: text("entity_type").notNull(),
  entity_id: text("entity_id").notNull(),
  event_type: text("event_type").notNull(),
  // JSON
  metadata: text("metadata"),
  // Unix timestamp
  created_at: integer("created_at").notNull(),
});

// ---------------------------------------------------------------------------
// Relations (required for db.query.*.findMany({ with: {...} }))
// ---------------------------------------------------------------------------
export const studentsRelations = relations(students, ({ many }) => ({
  student_subjects: many(student_subjects),
}));

export const studentSubjectsRelations = relations(student_subjects, ({ one }) => ({
  student: one(students, {
    fields: [student_subjects.student_id],
    references: [students.id],
  }),
  subject: one(subjects, {
    fields: [student_subjects.subject_id],
    references: [subjects.id],
  }),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  student_subjects: many(student_subjects),
  tutor_subjects: many(tutor_subjects),
}));

export const tutorsRelations = relations(tutors, ({ many }) => ({
  tutor_subjects: many(tutor_subjects),
  tutor_availability_blocks: many(tutor_availability_blocks),
}));

export const tutorAvailabilityBlocksRelations = relations(tutor_availability_blocks, ({ one }) => ({
  tutor: one(tutors, {
    fields: [tutor_availability_blocks.tutor_id],
    references: [tutors.id],
  }),
}));

export const tutorSubjectsRelations = relations(tutor_subjects, ({ one }) => ({
  tutor: one(tutors, {
    fields: [tutor_subjects.tutor_id],
    references: [tutors.id],
  }),
  subject: one(subjects, {
    fields: [tutor_subjects.subject_id],
    references: [subjects.id],
  }),
}));

// ---------------------------------------------------------------------------
// portal_invites
// ---------------------------------------------------------------------------
export const portal_invites = sqliteTable("portal_invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  // 'tutor' | 'admin'
  role: text("role").notNull(),
  token: text("token").notNull().unique(),
  invited_by_user_id: text("invited_by_user_id")
    .notNull()
    .references(() => users.id),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  accepted_at: integer("accepted_at", { mode: "timestamp" }),
  accepted_user_id: text("accepted_user_id").references(() => users.id),
});

export const portalInvitesRelations = relations(portal_invites, ({ one }) => ({
  invited_by: one(users, {
    fields: [portal_invites.invited_by_user_id],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// system_settings
// ---------------------------------------------------------------------------
export const system_settings = sqliteTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updated_at: integer("updated_at"),
});

-- Migration: 0001_initial
-- From the Heart Tutoring portal — initial schema
-- Database: Cloudflare D1 (SQLite)
-- Run with: wrangler d1 migrations apply portal --local
--            wrangler d1 migrations apply portal --remote

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                      TEXT PRIMARY KEY NOT NULL,
  auth_provider_user_id   TEXT NOT NULL UNIQUE,
  email                   TEXT NOT NULL UNIQUE,
  name                    TEXT NOT NULL,
  phone                   TEXT,
  role                    TEXT NOT NULL,           -- 'family'|'tutor'|'admin'
  status                  TEXT NOT NULL DEFAULT 'pending', -- 'active'|'pending'|'disabled'
  created_at              INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_auth_provider_user_id ON users (auth_provider_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ---------------------------------------------------------------------------
-- family_accounts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS family_accounts (
  id                  TEXT PRIMARY KEY NOT NULL,
  primary_user_id     TEXT NOT NULL REFERENCES users(id),
  account_type        TEXT NOT NULL DEFAULT 'parent_managed', -- 'parent_managed'|'adult_student'
  billing_email       TEXT,
  billing_phone       TEXT,
  stripe_customer_id  TEXT,
  billing_status      TEXT NOT NULL DEFAULT 'ok',      -- 'ok'|'past_due'|'blocked'
  onboarding_status   TEXT NOT NULL DEFAULT 'started', -- 'started'|'payment_required'|'ready'|'needs_admin_review'
  created_at          INTEGER NOT NULL,
  updated_at          INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- students
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id                   TEXT PRIMARY KEY NOT NULL,
  family_account_id    TEXT NOT NULL REFERENCES family_accounts(id),
  first_name           TEXT NOT NULL,
  last_name            TEXT NOT NULL,
  grade_level          TEXT,
  school               TEXT,
  email                TEXT,
  phone                TEXT,
  is_adult_student     INTEGER NOT NULL DEFAULT 0, -- 0|1 boolean
  goals                TEXT,
  learning_challenges  TEXT,
  accommodations       TEXT,
  parent_notes         TEXT,
  status               TEXT NOT NULL DEFAULT 'active', -- 'active'|'inactive'|'archived'
  created_at           INTEGER NOT NULL,
  updated_at           INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_family_account_id ON students (family_account_id);

-- ---------------------------------------------------------------------------
-- tutors
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tutors (
  id                          TEXT PRIMARY KEY NOT NULL,
  user_id                     TEXT NOT NULL REFERENCES users(id),
  display_name                TEXT NOT NULL,
  bio                         TEXT,
  photo_file_id               TEXT,
  phone                       TEXT,
  email                       TEXT,
  meeting_link                TEXT,
  in_person_available         INTEGER NOT NULL DEFAULT 0, -- 0|1 boolean
  default_hourly_rate_cents   INTEGER,
  pay_reporting_rate_cents    INTEGER,
  status                      TEXT NOT NULL DEFAULT 'pending', -- 'pending'|'active'|'inactive'
  created_at                  INTEGER NOT NULL,
  updated_at                  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors (user_id);

-- ---------------------------------------------------------------------------
-- subjects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
  id        TEXT PRIMARY KEY NOT NULL,
  name      TEXT NOT NULL,
  category  TEXT,
  active    INTEGER NOT NULL DEFAULT 1
);

-- ---------------------------------------------------------------------------
-- student_subjects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_subjects (
  id          TEXT PRIMARY KEY NOT NULL,
  student_id  TEXT NOT NULL REFERENCES students(id),
  subject_id  TEXT NOT NULL REFERENCES subjects(id),
  notes       TEXT
);

-- ---------------------------------------------------------------------------
-- tutor_subjects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id          TEXT PRIMARY KEY NOT NULL,
  tutor_id    TEXT NOT NULL REFERENCES tutors(id),
  subject_id  TEXT NOT NULL REFERENCES subjects(id),
  grade_min   INTEGER,
  grade_max   INTEGER,
  notes       TEXT
);

-- ---------------------------------------------------------------------------
-- tutor_availability_blocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tutor_availability_blocks (
  id            TEXT PRIMARY KEY NOT NULL,
  tutor_id      TEXT NOT NULL REFERENCES tutors(id),
  day_of_week   INTEGER NOT NULL, -- 0=Sunday … 6=Saturday
  start_time    TEXT NOT NULL,    -- HH:MM
  end_time      TEXT NOT NULL,    -- HH:MM
  timezone      TEXT NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'virtual', -- 'virtual'|'in_person'|'either'
  active        INTEGER NOT NULL DEFAULT 1
);

-- ---------------------------------------------------------------------------
-- booking_requests
-- Must be defined before sessions so sessions can reference it by id.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_requests (
  id                      TEXT PRIMARY KEY NOT NULL,
  family_account_id       TEXT NOT NULL,
  student_id              TEXT NOT NULL,
  requested_tutor_id      TEXT,
  assigned_tutor_id       TEXT,
  subject_id              TEXT,
  requested_starts_at     INTEGER,
  requested_ends_at       INTEGER,
  is_recurring            INTEGER NOT NULL DEFAULT 0,
  recurrence_until        INTEGER,
  requested_location_type TEXT,
  requested_location      TEXT,
  status                  TEXT NOT NULL DEFAULT 'pending', -- 'pending'|'accepted'|'declined'|'admin_assigned'|'canceled'
  message                 TEXT,
  created_at              INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests (status);

-- ---------------------------------------------------------------------------
-- sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id                       TEXT PRIMARY KEY NOT NULL,
  family_account_id        TEXT NOT NULL REFERENCES family_accounts(id),
  student_id               TEXT NOT NULL REFERENCES students(id),
  tutor_id                 TEXT NOT NULL REFERENCES tutors(id),
  subject_id               TEXT REFERENCES subjects(id),
  booking_request_id       TEXT,
  starts_at                INTEGER NOT NULL,
  ends_at                  INTEGER NOT NULL,
  timezone                 TEXT NOT NULL,
  location_type            TEXT NOT NULL, -- 'virtual'|'in_person'
  location                 TEXT,
  meeting_link             TEXT,
  status                   TEXT NOT NULL DEFAULT 'requested', -- 'requested'|'pending_approval'|'confirmed'|'completed'|'canceled'|'no_show'|'declined'
  price_cents              INTEGER,
  duration_minutes         INTEGER,
  billing_policy_snapshot  TEXT, -- JSON
  created_by_user_id       TEXT,
  created_at               INTEGER NOT NULL,
  updated_at               INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions (student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor_id ON sessions (tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_starts_at ON sessions (starts_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions (status);

-- ---------------------------------------------------------------------------
-- session_attendance
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_attendance (
  id                TEXT PRIMARY KEY NOT NULL,
  session_id        TEXT NOT NULL REFERENCES sessions(id),
  marked_by_user_id TEXT,
  state             TEXT NOT NULL, -- 'attended'|'student_no_show'|'tutor_no_show'|'canceled_late'|'canceled_on_time'
  notes             TEXT,
  marked_at         INTEGER
);

-- ---------------------------------------------------------------------------
-- session_notes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_notes (
  id               TEXT PRIMARY KEY NOT NULL,
  session_id       TEXT NOT NULL,
  author_user_id   TEXT NOT NULL,
  notes            TEXT NOT NULL,
  visible_to_family INTEGER NOT NULL DEFAULT 1,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id                TEXT PRIMARY KEY NOT NULL,
  family_account_id TEXT NOT NULL,
  stripe_invoice_id TEXT,
  invoice_number    TEXT,
  status            TEXT NOT NULL DEFAULT 'draft', -- 'draft'|'open'|'paid'|'void'|'uncollectible'|'past_due'
  period_start      INTEGER,
  period_end        INTEGER,
  total_cents       INTEGER NOT NULL DEFAULT 0,
  due_at            INTEGER,
  autopay_enabled   INTEGER NOT NULL DEFAULT 1,
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_family_account_id ON invoices (family_account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);

-- ---------------------------------------------------------------------------
-- invoice_line_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id              TEXT PRIMARY KEY NOT NULL,
  invoice_id      TEXT NOT NULL,
  session_id      TEXT,
  description     TEXT NOT NULL,
  amount_cents    INTEGER NOT NULL,
  billing_reason  TEXT NOT NULL, -- 'scheduled_session'|'late_cancellation'|'no_show'|'on_time_cancellation'
  created_at      INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- payment_methods
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
  id                        TEXT PRIMARY KEY NOT NULL,
  family_account_id         TEXT NOT NULL,
  stripe_payment_method_id  TEXT NOT NULL,
  brand                     TEXT,
  last4                     TEXT,
  exp_month                 INTEGER,
  exp_year                  INTEGER,
  is_default                INTEGER NOT NULL DEFAULT 0,
  status                    TEXT NOT NULL DEFAULT 'active',
  created_at                INTEGER NOT NULL,
  updated_at                INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                        TEXT PRIMARY KEY NOT NULL,
  family_account_id         TEXT NOT NULL,
  invoice_id                TEXT,
  stripe_payment_intent_id  TEXT,
  amount_cents              INTEGER NOT NULL,
  status                    TEXT NOT NULL,
  paid_at                   INTEGER,
  created_at                INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id                TEXT PRIMARY KEY NOT NULL,
  family_account_id TEXT NOT NULL,
  student_id        TEXT,
  tutor_id          TEXT,
  created_at        INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id               TEXT PRIMARY KEY NOT NULL,
  conversation_id  TEXT NOT NULL,
  sender_user_id   TEXT NOT NULL,
  body             TEXT NOT NULL,
  created_at       INTEGER NOT NULL,
  read_at          INTEGER
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);

-- ---------------------------------------------------------------------------
-- files
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS files (
  id                  TEXT PRIMARY KEY NOT NULL,
  uploaded_by_user_id TEXT NOT NULL,
  family_account_id   TEXT,
  student_id          TEXT,
  session_id          TEXT,
  r2_key              TEXT NOT NULL,
  filename            TEXT NOT NULL,
  content_type        TEXT NOT NULL,
  size_bytes          INTEGER NOT NULL,
  visibility          TEXT NOT NULL DEFAULT 'family', -- 'family'|'tutor'|'admin'
  created_at          INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_files_family_account_id ON files (family_account_id);
CREATE INDEX IF NOT EXISTS idx_files_student_id ON files (student_id);

-- ---------------------------------------------------------------------------
-- notification_preferences
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_preferences (
  id               TEXT PRIMARY KEY NOT NULL,
  user_id          TEXT NOT NULL,
  email_enabled    INTEGER NOT NULL DEFAULT 1,
  sms_enabled      INTEGER NOT NULL DEFAULT 1,
  session_reminders INTEGER NOT NULL DEFAULT 1,
  billing_alerts   INTEGER NOT NULL DEFAULT 1,
  message_alerts   INTEGER NOT NULL DEFAULT 1,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id                  TEXT PRIMARY KEY NOT NULL,
  user_id             TEXT NOT NULL,
  channel             TEXT NOT NULL, -- 'email'|'sms'
  event_type          TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending', -- 'pending'|'sent'|'failed'|'skipped'
  provider_message_id TEXT,
  metadata            TEXT, -- JSON
  created_at          INTEGER NOT NULL,
  sent_at             INTEGER
);

-- ---------------------------------------------------------------------------
-- audit_events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_events (
  id            TEXT PRIMARY KEY NOT NULL,
  actor_user_id TEXT,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  metadata      TEXT, -- JSON
  created_at    INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- system_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
  key        TEXT PRIMARY KEY NOT NULL,
  value      TEXT NOT NULL,
  updated_at INTEGER
);

-- ---------------------------------------------------------------------------
-- Seed: system_settings defaults
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO system_settings (key, value, updated_at) VALUES
  ('default_hourly_rate_cents',        '7000',   strftime('%s', 'now')),
  ('default_session_duration_minutes', '60',     strftime('%s', 'now')),
  ('cancellation_policy_hours',        '24',     strftime('%s', 'now')),
  ('invoice_grouping',                 'weekly', strftime('%s', 'now')),
  ('payment_block_threshold_cents',    '0',      strftime('%s', 'now'));

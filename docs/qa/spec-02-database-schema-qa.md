# QA Plan: Spec 02 Database Schema

Use this plan after implementing or modifying Spec 02. The goal is to confirm migrations apply cleanly, all tables exist with the correct structure, seed data is correct, and no schema gaps exist that would block later specs.

## Preconditions

- Spec 01 is complete and passing QA.
- D1 database `portal` exists (ID `7141a90b-b575-40e1-a977-0bb56a50cdab`).
- Local migrations have been applied: `npm run db:migrate:local`.
- Production migrations have been applied: `npm run db:migrate:prod`.
- Build passes: `npm run build`.

## Command Checks

```bash
npm run build
```

Expected:

- Build succeeds with no TypeScript errors in `src/portal/db/`.
- No circular import errors involving `schema.ts` or `index.ts`.

## Migration Checks

### Local migration status

```bash
npx wrangler d1 migrations list portal --local
```

Expected:

- `0001_initial.sql` shows status `✅` (applied).
- No unapplied migrations remain.

### Production migration status

```bash
npx wrangler d1 migrations list portal --remote
```

Expected:

- `0001_initial.sql` shows status `✅` (applied).
- No unapplied migrations remain.

## Table Structure Checks

Run each query against the local database to confirm all tables exist.

### Confirm all 23 tables exist

```bash
npx wrangler d1 execute portal --local --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

Expected — these tables should all appear:

- audit_events
- booking_requests
- conversations
- d1_migrations *(wrangler internal)*
- family_accounts
- files
- invoice_line_items
- invoices
- messages
- notification_preferences
- notifications
- payment_methods
- payments
- session_attendance
- session_notes
- sessions
- student_subjects
- students
- subjects
- system_settings
- tutor_availability_blocks
- tutor_subjects
- tutors
- users

### Confirm indexes exist

```bash
npx wrangler d1 execute portal --local --command "SELECT name FROM sqlite_master WHERE type='index' ORDER BY name;"
```

Expected — at minimum these indexes should appear:

- idx_files_family_account_id
- idx_files_student_id
- idx_invoices_family_account_id
- idx_invoices_status
- idx_messages_conversation_id
- idx_booking_requests_status
- idx_sessions_starts_at
- idx_sessions_status
- idx_sessions_student_id
- idx_sessions_tutor_id
- idx_students_family_account_id
- idx_tutors_user_id
- idx_users_auth_provider_user_id
- idx_users_email

### Spot-check key table columns

```bash
npx wrangler d1 execute portal --local --command "PRAGMA table_info(users);"
```

Expected columns: id, auth_provider_user_id, email, name, phone, role, status, created_at, updated_at.

```bash
npx wrangler d1 execute portal --local --command "PRAGMA table_info(sessions);"
```

Expected columns: id, family_account_id, student_id, tutor_id, subject_id, booking_request_id, starts_at, ends_at, timezone, location_type, location, meeting_link, status, price_cents, duration_minutes, billing_policy_snapshot, created_by_user_id, created_at, updated_at.

```bash
npx wrangler d1 execute portal --local --command "PRAGMA table_info(system_settings);"
```

Expected columns: key, value, updated_at.

## Seed Data Checks

### System settings seeded by migration

```bash
npx wrangler d1 execute portal --local --command "SELECT key, value FROM system_settings ORDER BY key;"
```

Expected rows:

| key | value |
|-----|-------|
| cancellation_policy_hours | 24 |
| default_hourly_rate_cents | 7000 |
| default_session_duration_minutes | 60 |
| invoice_grouping | weekly |
| payment_block_threshold_cents | 0 |

### Subjects seeded

```bash
npx wrangler d1 execute portal --local --command "SELECT name, category FROM subjects ORDER BY name;"
```

Expected: 16 subjects including Math, Algebra, Geometry, Pre-Calculus, Calculus, Biology, Chemistry, Physics, English, Writing, Reading, History, SAT Prep, ACT Prep, Spanish, and Science.

## Idempotency Check

Run the migration a second time to confirm it does not fail or duplicate data.

```bash
npx wrangler d1 migrations apply portal --local
```

Expected:

- Output shows no new migrations to apply, or confirms `0001_initial.sql` is already applied.
- No duplicate rows in `system_settings` or `subjects`.

## Schema Integrity Checks

### Foreign key references are consistent

```bash
npx wrangler d1 execute portal --local --command "PRAGMA foreign_key_list(students);"
```

Expected: `family_account_id` references `family_accounts(id)`.

```bash
npx wrangler d1 execute portal --local --command "PRAGMA foreign_key_list(tutors);"
```

Expected: `user_id` references `users(id)`.

```bash
npx wrangler d1 execute portal --local --command "PRAGMA foreign_key_list(sessions);"
```

Expected: references to `family_accounts`, `students`, `tutors`, `subjects`.

### Manual insert and query round-trip

Insert a test user and read it back to confirm the schema accepts writes:

```bash
npx wrangler d1 execute portal --local --command "INSERT INTO users (id, auth_provider_user_id, email, name, role, status, created_at, updated_at) VALUES ('test-uuid-001', 'clerk_test_001', 'qa@test.local', 'QA User', 'family', 'active', unixepoch(), unixepoch());"
```

```bash
npx wrangler d1 execute portal --local --command "SELECT id, email, role, status FROM users WHERE email = 'qa@test.local';"
```

Expected: row returns with correct values.

Clean up after:

```bash
npx wrangler d1 execute portal --local --command "DELETE FROM users WHERE email = 'qa@test.local';"
```

## Production Safety Check

Confirm production was NOT seeded with test users (only system_settings defaults should exist):

```bash
npx wrangler d1 execute portal --remote --command "SELECT COUNT(*) as user_count FROM users;"
```

Expected: `0` — no users in production yet. Users are created through Clerk sign-up, not the seed script.

```bash
npx wrangler d1 execute portal --remote --command "SELECT key, value FROM system_settings ORDER BY key;"
```

Expected: the 5 system settings rows, matching local.

## Pass Criteria

Spec 02 passes QA when:

- Both local and remote migrations show `0001_initial.sql` as applied.
- All 23 tables exist in the local database.
- All required indexes exist.
- System settings contain the 5 expected default rows.
- Subjects table contains the expected subjects.
- A manual insert/query round-trip succeeds.
- Production has 0 users and correct system settings.
- `npm run build` passes with no schema-related TypeScript errors.

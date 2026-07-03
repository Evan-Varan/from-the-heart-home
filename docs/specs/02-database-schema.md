# Spec 02: Database Schema

## Product Context

The portal manages operational data for a tutoring business: families, students, tutors, schedules, billing, messages, files, and reports. The system should start fresh and does not need to migrate TutorBird history.

## Goal

Create the initial Cloudflare D1 relational schema and migrations needed by the portal.

## Manual Actions

- `ACCOUNT REQUIRED`: Create Cloudflare D1 databases for local/dev/prod or approve the implementer to create them with Wrangler.
- `OWNER REQUIRED`: Confirm whether seed users should use real admin/tutor emails or test-only emails.
- `PRODUCTION GATE`: Review production migrations before applying them.

## Dependencies

- Spec 00: Architecture Foundation
- Spec 01: Auth, Roles, And Permissions

## Database Requirements

Use Cloudflare D1 as the primary database. Use migrations checked into the repo. Use a typed query layer or ORM if selected in Spec 00.

All major tables should include:

- `id`
- `created_at`
- `updated_at`

Use soft-delete/history preservation where deletion would otherwise erase business history.

## Core Tables

### users

Stores local user profile and role linkage.

Fields:

- `id`
- `auth_provider_user_id`
- `email`
- `name`
- `phone`
- `role`: `family`, `tutor`, `admin`
- `status`: `active`, `pending`, `disabled`
- `created_at`
- `updated_at`

### family_accounts

Fields:

- `id`
- `primary_user_id`
- `account_type`: `parent_managed`, `adult_student`
- `billing_email`
- `billing_phone`
- `stripe_customer_id`
- `billing_status`: `ok`, `past_due`, `blocked`
- `onboarding_status`: `started`, `payment_required`, `ready`, `needs_admin_review`
- `created_at`
- `updated_at`

### students

Fields:

- `id`
- `family_account_id`
- `first_name`
- `last_name`
- `grade_level`
- `school`
- `email`
- `phone`
- `is_adult_student`
- `goals`
- `learning_challenges`
- `accommodations`
- `parent_notes`
- `status`: `active`, `inactive`, `archived`
- `created_at`
- `updated_at`

### tutors

Fields:

- `id`
- `user_id`
- `display_name`
- `bio`
- `photo_file_id`
- `phone`
- `email`
- `meeting_link`
- `in_person_available`
- `default_hourly_rate_cents`
- `pay_reporting_rate_cents`
- `status`: `pending`, `active`, `inactive`
- `created_at`
- `updated_at`

### subjects

Fields:

- `id`
- `name`
- `category`
- `active`

### student_subjects

Links students to requested subjects.

Fields:

- `id`
- `student_id`
- `subject_id`
- `notes`

### tutor_subjects

Links tutors to teachable subjects and grade ranges.

Fields:

- `id`
- `tutor_id`
- `subject_id`
- `grade_min`
- `grade_max`
- `notes`

### tutor_availability_blocks

Weekly recurring availability.

Fields:

- `id`
- `tutor_id`
- `day_of_week`
- `start_time`
- `end_time`
- `timezone`
- `location_type`: `virtual`, `in_person`, `either`
- `active`

### sessions

Fields:

- `id`
- `family_account_id`
- `student_id`
- `tutor_id`
- `subject_id`
- `booking_request_id`
- `starts_at`
- `ends_at`
- `timezone`
- `location_type`: `virtual`, `in_person`
- `location`
- `meeting_link`
- `status`: `requested`, `pending_approval`, `confirmed`, `completed`, `canceled`, `no_show`, `declined`
- `price_cents`
- `duration_minutes`
- `billing_policy_snapshot`
- `created_by_user_id`
- `created_at`
- `updated_at`

### booking_requests

Fields:

- `id`
- `family_account_id`
- `student_id`
- `requested_tutor_id`
- `assigned_tutor_id`
- `subject_id`
- `requested_starts_at`
- `requested_ends_at`
- `is_recurring`
- `recurrence_until`
- `requested_location_type`
- `requested_location`
- `status`: `pending`, `accepted`, `declined`, `admin_assigned`, `canceled`
- `message`
- `created_at`
- `updated_at`

### session_attendance

Fields:

- `id`
- `session_id`
- `marked_by_user_id`
- `state`: `attended`, `student_no_show`, `tutor_no_show`, `canceled_late`, `canceled_on_time`
- `notes`
- `marked_at`

### session_notes

Fields:

- `id`
- `session_id`
- `author_user_id`
- `notes`
- `visible_to_family`
- `created_at`
- `updated_at`

Initial scope should always make notes family-visible, but keep `visible_to_family` for future flexibility.

### invoices

Fields:

- `id`
- `family_account_id`
- `stripe_invoice_id`
- `invoice_number`
- `status`: `draft`, `open`, `paid`, `void`, `uncollectible`, `past_due`
- `period_start`
- `period_end`
- `total_cents`
- `due_at`
- `autopay_enabled`
- `created_at`
- `updated_at`

### invoice_line_items

Fields:

- `id`
- `invoice_id`
- `session_id`
- `description`
- `amount_cents`
- `billing_reason`: `scheduled_session`, `late_cancellation`, `no_show`, `on_time_cancellation`
- `created_at`

### payment_methods

Fields:

- `id`
- `family_account_id`
- `stripe_payment_method_id`
- `brand`
- `last4`
- `exp_month`
- `exp_year`
- `is_default`
- `status`
- `created_at`
- `updated_at`

### payments

Fields:

- `id`
- `family_account_id`
- `invoice_id`
- `stripe_payment_intent_id`
- `amount_cents`
- `status`
- `paid_at`
- `created_at`
- `updated_at`

### conversations

Fields:

- `id`
- `family_account_id`
- `student_id`
- `tutor_id`
- `created_at`
- `updated_at`

### messages

Fields:

- `id`
- `conversation_id`
- `sender_user_id`
- `body`
- `created_at`
- `read_at`

### files

Fields:

- `id`
- `uploaded_by_user_id`
- `family_account_id`
- `student_id`
- `session_id`
- `r2_key`
- `filename`
- `content_type`
- `size_bytes`
- `visibility`: `family`, `tutor`, `admin`
- `created_at`

### notification_preferences

Fields:

- `id`
- `user_id`
- `email_enabled`
- `sms_enabled`
- `session_reminders`
- `billing_alerts`
- `message_alerts`
- `created_at`
- `updated_at`

### notifications

Fields:

- `id`
- `user_id`
- `channel`: `email`, `sms`
- `event_type`
- `status`: `pending`, `sent`, `failed`, `skipped`
- `provider_message_id`
- `metadata`
- `created_at`
- `sent_at`

### audit_events

Fields:

- `id`
- `actor_user_id`
- `entity_type`
- `entity_id`
- `event_type`
- `metadata`
- `created_at`

### system_settings

Fields:

- `key`
- `value`
- `updated_at`

Include settings for default price, default session length, cancellation policy, invoice grouping, and payment block threshold.

## Indexes And Constraints

Add indexes for:

- `users.auth_provider_user_id`
- `users.email`
- `students.family_account_id`
- `tutors.user_id`
- `sessions.student_id`
- `sessions.tutor_id`
- `sessions.starts_at`
- `sessions.status`
- `booking_requests.status`
- `invoices.family_account_id`
- `invoices.status`
- `messages.conversation_id`
- `files.family_account_id`
- `files.student_id`

Prevent double-booking at the service layer. D1 may not provide the exact exclusion constraints needed for overlapping time ranges, so scheduling code must query overlapping confirmed/requested sessions before writes.

## Acceptance Criteria

- Migrations create all required initial tables.
- The app can run migrations locally.
- Seed data can create at least one admin, family, student, tutor, subject, and availability block.
- Schema supports all future specs without immediate table redesign.
- Historical sessions, invoices, messages, and files are preserved.

## Out Of Scope

- TutorBird data import
- Complex analytics warehouse
- Multi-business tenancy
- Group sessions
- Full-text search

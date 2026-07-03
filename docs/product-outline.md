# From the Heart Tutoring Student Portal Product Outline

Last updated: 2026-07-03

## Purpose

From the Heart Tutoring currently has a marketing site for one-on-one tutoring and a placeholder Student Portal. The Student Portal should become a full TutorBird replacement inside this same repo. It should let families schedule tutoring, keep payment methods on file, receive automated invoices, view tutor notes, message tutors, upload files, and manage student information. Tutors should manage availability, respond to booking requests, see student context, log attendance, and write session notes. Admins should manage the full operation.

The portal should support K-college tutoring, but the primary market is parents of middle and high school students. Students over 18 can register and manage their own account.

## Existing Repo Context

The current app is a React/TanStack Router/TanStack Start site deployed through Cloudflare Workers. It already includes:

- Marketing routes: `/`, `/about`, `/services`, `/pricing`, `/contact`, `/portal`
- A current `/portal` placeholder sign-in page
- A Resend-backed contact form implemented with TanStack Start server functions
- Cloudflare Worker config in `wrangler.jsonc`
- Tailwind and shadcn-style UI components

Recommended approach: keep the current TanStack Start + Cloudflare architecture for the first full-stack portal instead of migrating to Next.js. This avoids a rewrite and keeps hosting simple and inexpensive.

## Product Vision

The Student Portal is an all-in-one tutoring operations product:

- Family account management
- Student profiles and intake information
- Tutor discovery and comparison
- Tutor availability management
- One-time and recurring session scheduling
- Booking approvals by tutors or admins
- Stripe-based saved payment methods, autopay, and invoices
- Attendance tracking and parent-visible session notes
- Family/tutor messaging
- File uploads for homework, syllabi, test reviews, essays, and related material
- Admin operations for matching, approvals, scheduling, billing visibility, and reporting

The product should feel like a real operational portal, not a marketing landing page. It should be dense enough for repeated use, clear enough for parents, and simple enough for a small tutoring business to run daily.

## Primary Users

### Family Account

A family account is the main client account. It may represent:

- A parent managing one or more minor students
- A student over 18 managing their own tutoring and billing

Family accounts can:

- Complete onboarding and intake
- Add a payment method
- Manage multiple students
- View tutor profiles and availability after signup/payment setup
- Request one-time or recurring sessions
- Cancel sessions directly with billing notice
- View invoices, balances, and payment status
- View parent-visible session notes
- Message tutors
- Upload files
- Manage notification preferences

### Tutor

Tutors can:

- Maintain profile information
- Set weekly recurring availability blocks
- Store a reusable Zoom/Google Meet link
- Receive and accept/decline booking requests
- Reschedule confirmed sessions directly
- View parent and student contact info
- See relevant student profile information
- See payment status
- Track their monthly session log
- Mark attendance
- Add session notes visible to families
- Message families

### Admin

Admins can:

- Approve/manage tutor onboarding
- View new family registrations
- View pending booking requests
- Accept/decline/modify bookings
- Assign tutors manually
- Create sessions on behalf of users
- Edit/cancel/reschedule any session
- Edit student profiles
- View all messages
- View invoices and unpaid balances
- View dashboards and reports
- Preserve history for canceled/deleted records

Admin and billing admin are the same role for the initial product.

## Core Business Rules

### Tutoring

- Sessions are one-on-one only.
- Most sessions are virtual, but in-person sessions should be supported through an open `location` field.
- Tutor meeting links are stored manually on tutor profiles and attached to virtual sessions.
- A student can work with multiple tutors.
- The same student/tutor pair can have different subjects.

### Scheduling

- Families can book any available tutor after signup/payment setup.
- New families self-register and request first sessions.
- Tutors and admins receive notifications for approval.
- Either a tutor or admin can approve a booking.
- Admins can manually assign a different tutor than the one requested.
- Tutors publish weekly recurring availability blocks.
- Booking supports one-time and recurring weekly sessions.
- Month-out bookings should create future session records immediately.
- The system must prevent double-booking.
- Same-day booking should be blocked by default.
- Families can request times outside posted availability.
- Tutors can accept/decline booking requests.
- Tutors can reschedule confirmed sessions directly.
- Families can cancel confirmed sessions directly after seeing the billing consequence.

### Session Statuses

Use these session statuses:

- `requested`
- `pending_approval`
- `confirmed`
- `completed`
- `canceled`
- `no_show`
- `declined`

### Attendance States

Use these attendance states:

- `attended`
- `student_no_show`
- `tutor_no_show`
- `canceled_late`
- `canceled_on_time`

### Billing

- Default price is `$70/hour`.
- Price and session length should be configurable.
- Families must save a payment method before booking.
- Autopay should be supported.
- Invoices are generated automatically from scheduled sessions.
- Invoice grouping should be configurable, similar to TutorBird: per-session, weekly, monthly, or custom.
- Existing TutorBird payment history is not migrated.
- Portal starts fresh with new payment records.
- Unpaid balances should block future booking after a configured threshold.
- No admin override for payment blocks in the initial scope.
- Packages/prepaid credits are out of scope for now.
- Admins cannot manually adjust invoice line items in the initial scope.

Cancellation billing:

- Cancel more than 24 hours before session: no charge
- Cancel less than 24 hours before session: 50% charge
- No-show: full charge
- Admins may waive fees only if explicitly added in a later scope; do not build manual invoice adjustment initially

### Tutor Payment Reporting

Tutor payouts are tracked for reporting only. The portal does not pay tutors. The system should produce a monthly tutor session log that admins can use for payment outside the portal.

## Recommended Technical Architecture

### Frontend and Runtime

- Keep the current app in this repo.
- Continue using TanStack Start, TanStack Router, React, Tailwind, and existing UI components.
- Build `/portal` as the authenticated app entry.
- Use server functions or API routes within the same app for backend behavior.

### Database

Recommended: Cloudflare D1.

Reasoning:

- Fits the current Cloudflare Worker deployment.
- Keeps vendor count low.
- Supports relational scheduling, billing, users, roles, sessions, invoices, and messages well.
- Has a free tier suitable for early usage.

Use a relational schema. A lightweight ORM/query builder such as Drizzle can be introduced if useful, but the implementation spec should make that decision explicitly.

### File Storage

Recommended: Cloudflare R2.

Use R2 for uploaded homework, syllabi, essays, screenshots, and other portal files.

### Payments

Recommended: Stripe.

Use Stripe for:

- Customer records
- Saved payment methods
- Payment method setup before booking
- Invoice payment
- Autopay
- Payment failure webhooks

Keep local database records for portal-specific invoice grouping, session linkage, billing status, and audit history.

### Email

Recommended: continue using Resend.

The repo already has Resend contact form integration, so portal notifications should build on that pattern.

### SMS

Recommended: Twilio, optional by user preference.

Email should be the default notification channel. SMS should be available when users opt in and phone number/consent are present.

### Calendar Sync

External Google/Outlook calendar sync is deferred. The portal should have its own calendar views first.

### Environments

Define three environments:

- Local development
- Dev/staging for testing
- Production

Environment-specific config should include database bindings, R2 buckets, Stripe keys/webhook secrets, Resend key, Twilio credentials, public site URL, and auth secrets.

### Deployment

Use simple GitHub Actions deployment when ready. Avoid overcomplicated CI gates initially. Build verification is useful, but extensive test automation is not required at the first deployment spec stage.

## Route Map

Public/marketing routes remain mostly unchanged:

- `/`
- `/about`
- `/services`
- `/pricing`
- `/contact`
- `/portal`

Portal routes:

- `/portal` - unauthenticated sign-in/register landing or authenticated redirect
- `/portal/login`
- `/portal/register`
- `/portal/onboarding`
- `/portal/dashboard`
- `/portal/schedule`
- `/portal/sessions`
- `/portal/sessions/:sessionId`
- `/portal/students`
- `/portal/students/:studentId`
- `/portal/tutors`
- `/portal/tutors/:tutorId`
- `/portal/invoices`
- `/portal/invoices/:invoiceId`
- `/portal/messages`
- `/portal/files`
- `/portal/settings`

Tutor routes:

- `/portal/tutor`
- `/portal/tutor/sessions`
- `/portal/tutor/availability`
- `/portal/tutor/profile`
- `/portal/tutor/messages`
- `/portal/tutor/session-log`

Admin routes:

- `/portal/admin`
- `/portal/admin/families`
- `/portal/admin/students`
- `/portal/admin/tutors`
- `/portal/admin/sessions`
- `/portal/admin/booking-requests`
- `/portal/admin/invoices`
- `/portal/admin/messages`
- `/portal/admin/reports`
- `/portal/admin/settings`

## Data Model Summary

Core entities:

- `users`
- `family_accounts`
- `students`
- `tutors`
- `admin_profiles`
- `subjects`
- `student_subjects`
- `tutor_subjects`
- `tutor_availability_blocks`
- `sessions`
- `session_attendance`
- `session_notes`
- `booking_requests`
- `invoices`
- `invoice_line_items`
- `payment_methods`
- `payments`
- `messages`
- `conversation_participants`
- `files`
- `notification_preferences`
- `notifications`
- `audit_events`
- `system_settings`

Implementation specs contain the detailed schema expectations.

## Spec Build Order

Manual owner/vendor steps are tracked in [docs/specs/manual-actions.md](./specs/manual-actions.md). These include provider account setup, secrets, DNS/sender verification, Stripe business setup, production migration approval, and first production admin creation.

Build the portal in this order:

1. `00-architecture-foundation.md`
2. `01-auth-roles-permissions.md`
3. `02-database-schema.md`
4. `03-portal-ui-shell-design-system.md`
5. `04-family-onboarding-intake.md`
6. `05-tutor-profiles-availability.md`
7. `06-scheduling-booking-lifecycle.md`
8. `07-stripe-billing-invoicing.md`
9. `08-session-attendance-notes.md`
10. `09-messaging-notifications.md`
11. `10-file-uploads-r2.md`
12. `11-dashboards-reporting.md`
13. `12-admin-operations.md`
14. `13-environments-deployment.md`

Each spec is written to be implementation-ready and should include scope, out-of-scope items, data needs, routes, UI expectations, backend behavior, edge cases, and acceptance criteria.

## Explicitly Out Of Scope For Initial Portal

- TutorBird data migration
- External Google/Outlook calendar sync
- Automatic Zoom/Google Meet creation
- Group sessions
- Reviews/ratings
- Advanced progress tracking, milestones, test score analytics, or skill ratings
- Prepaid packages/session credits
- Admin invoice line-item adjustments
- Tutor payout execution through the portal
- Parent approval workflow for minor student accounts
- Separate minor student login
- Complex CI/test pipeline

## Risks And Decisions To Revisit

- D1 is recommended for simplicity with Cloudflare, but MongoDB remains possible if the team later prioritizes document modeling over vendor consolidation.
- Stripe invoice grouping needs careful design because the business wants TutorBird-like configurable billing.
- Blocking bookings for unpaid balances is intentionally strict because admin override was marked out of scope.
- Minors, student records, contact data, and learning-difference notes require careful access control even if no specific compliance program has been identified.
- Full portal at once is the product target, but implementation should still follow the spec order to avoid building features before auth, roles, schema, and portal shell are stable.

# Student Portal Spec Index

These specs describe the full-stack Student Portal for From the Heart Tutoring. They are ordered so each can be implemented after the previous dependencies are complete.

The portal is a TutorBird replacement built into the existing repo. Recommended architecture is TanStack Start on Cloudflare Workers, Cloudflare D1 for relational data, Cloudflare R2 for files, Stripe for billing, Resend for email, and optional Twilio for SMS.

## Implementation Order

Manual owner/vendor steps are tracked in [Manual Actions Checklist](./manual-actions.md). Before implementing a spec, check that file for any `OWNER REQUIRED`, `ACCOUNT REQUIRED`, `SECRET REQUIRED`, or `PRODUCTION GATE` items.

1. [00 - Architecture Foundation](./00-architecture-foundation.md)
2. [01 - Auth, Roles, And Permissions](./01-auth-roles-permissions.md)
3. [02 - Database Schema](./02-database-schema.md)
4. [03 - Portal UI Shell And Design System](./03-portal-ui-shell-design-system.md)
5. [04 - Family Onboarding And Intake](./04-family-onboarding-intake.md)
6. [05 - Tutor Profiles And Availability](./05-tutor-profiles-availability.md)
7. [06 - Scheduling And Booking Lifecycle](./06-scheduling-booking-lifecycle.md)
8. [07 - Stripe Billing And Invoicing](./07-stripe-billing-invoicing.md)
9. [08 - Session Attendance And Notes](./08-session-attendance-notes.md)
10. [09 - Messaging And Notifications](./09-messaging-notifications.md)
11. [10 - File Uploads With R2](./10-file-uploads-r2.md)
12. [11 - Dashboards And Reporting](./11-dashboards-reporting.md)
13. [12 - Admin Operations](./12-admin-operations.md)
14. [13 - Environments And Deployment](./13-environments-deployment.md)
15. [14 - Deferred Enhancements](./14-deferred-enhancements.md) — Google SSO, JWT template, Apple Sign-In, TutorBird migration

## Global Product Context

From the Heart Tutoring provides K-college one-on-one tutoring, primarily for parents of middle and high school students. Families currently use TutorBird, but the goal is to replace it with a custom Student Portal. The business model is pay per session, with default pricing at $70/hour, configurable pricing/session length, and automated invoices generated from scheduled sessions.

Core users:

- Families: parent account managing one or more students, or an adult student managing their own account
- Tutors: manage profile, availability, booking requests, session notes, attendance, and messages
- Admins: manage families, students, tutors, sessions, billing visibility, messages, reports, and settings

Initial portal scope:

- Family registration and intake
- Saved payment method before booking
- Tutor discovery/comparison after signup
- Weekly recurring tutor availability
- One-time and recurring bookings
- Tutor/admin booking approvals
- Session calendar and lifecycle
- Stripe invoices/autopay
- Attendance and parent-visible notes
- Family/tutor messaging
- File uploads
- Admin dashboards and operations

Global out of scope:

- TutorBird data migration
- External calendar sync
- Automatic meeting creation
- Group sessions
- Reviews/ratings
- Advanced progress tracking
- Packages/prepaid credits
- Tutor payout execution
- Admin invoice line-item editing
- Separate minor student logins

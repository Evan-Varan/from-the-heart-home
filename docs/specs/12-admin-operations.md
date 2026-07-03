# Spec 12: Admin Operations

## Product Context

Admins run the tutoring business. They need full operational control over families, students, tutors, sessions, booking approvals, invoices, messages, and settings.

## Goal

Implement admin workflows that make the portal usable as a TutorBird replacement.

## Dependencies

- Spec 04: Family Onboarding And Intake
- Spec 05: Tutor Profiles And Availability
- Spec 06: Scheduling And Booking Lifecycle
- Spec 07: Stripe Billing And Invoicing
- Spec 09: Messaging And Notifications
- Spec 11: Dashboards And Reporting

## Admin Capabilities

Admins can:

- View and manage family accounts
- View and edit student profiles
- View and manage tutors
- Approve tutor onboarding
- View pending booking requests
- Accept/decline bookings
- Assign a different tutor than requested
- Create sessions on behalf of families/tutors
- Edit, cancel, or reschedule any session
- View invoices and payment status
- View all messages
- View reports
- Manage system settings

## Routes

- `/portal/admin`
- `/portal/admin/families`
- `/portal/admin/families/:familyId`
- `/portal/admin/students`
- `/portal/admin/students/:studentId`
- `/portal/admin/tutors`
- `/portal/admin/tutors/:tutorId`
- `/portal/admin/booking-requests`
- `/portal/admin/sessions`
- `/portal/admin/sessions/:sessionId`
- `/portal/admin/invoices`
- `/portal/admin/messages`
- `/portal/admin/reports`
- `/portal/admin/settings`

## UI Requirements

### Admin Lists

Use table-based views with filters:

- Search
- Status
- Date range
- Tutor
- Student/family
- Payment status

### Family Detail

Show:

- Contact info
- Students
- Upcoming sessions
- Invoices/payment status
- Messages
- Files
- Audit/history summary

### Tutor Detail

Show:

- Profile
- Status
- Subjects/grade levels
- Availability
- Upcoming sessions
- Monthly session log
- Messages/conversation links

### Booking Request Queue

Show:

- Request details
- Family/student
- Subject
- Requested tutor
- Requested time
- Conflict warnings
- Accept
- Decline
- Assign different tutor

### Session Admin

Admins can:

- Create session
- Edit time/tutor/student/subject/location
- Cancel session
- Reschedule session
- Mark attendance
- View notes

### Settings

Admin settings should include:

- Default session price
- Default session duration
- Cancellation policy values
- Invoice grouping mode
- Payment block threshold
- Notification defaults

Do not build broad feature flags or a complex settings framework.

## Backend Requirements

- Admin services should reuse the same business rules as family/tutor flows.
- Admin actions should create audit events.
- Admin session edits should trigger relevant notifications.
- Admin-created sessions should still prevent double-booking.
- Admin billing views should reflect Stripe/local state but not allow line-item adjustment.

## Permissions

Only `admin` role can access admin routes and admin server functions.

## Edge Cases

- Admin assigns tutor with no availability block.
- Admin edits a session after invoice generation.
- Admin cancels a session inside the late-cancellation window.
- Admin creates session for family with blocked billing.
- Admin views messages without being a participant.

When edge cases affect billing, use existing billing rules and surface warnings. Do not implement manual invoice adjustment unless later scoped.

## Acceptance Criteria

- Admins can manage core entities from admin routes.
- Admins can handle booking approvals and tutor assignment.
- Admins can create/edit/reschedule/cancel sessions.
- Admins can view invoices/payment status.
- Admins can view all conversations.
- Admin settings control default pricing, duration, billing grouping, and cancellation policy.
- Admin actions are audited.

## Out Of Scope

- Admin invoice line-item editing
- Manual payment reconciliation beyond viewing Stripe state
- Admin impersonation
- Bulk CSV import/export
- Complex staff permission levels


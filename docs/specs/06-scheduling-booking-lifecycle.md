# Spec 06: Scheduling And Booking Lifecycle

## Product Context

Scheduling is the central problem the portal is meant to solve. Current scheduling involves too much back and forth before TutorBird becomes the source of truth. The new portal should let families request sessions from available tutor calendars, support recurring weekly bookings, and let tutors/admins approve requests.

## Goal

Implement one-time and recurring session booking, booking approvals, conflict prevention, cancellation, rescheduling, and session lifecycle rules.

## Pre-Spec Checklist

- Confirm Specs 02, 04, and 05 are complete enough for students, subjects, tutors, and availability.
- Confirm booking requires saved payment method, or use a temporary payment-ready flag until Spec 07 is complete.
- Confirm cancellation billing copy matches the current policy.
- Confirm same-day booking and double-booking rules are understood before implementation.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed scheduling/session files.
- Verify one-time booking request creation.
- Verify recurring weekly booking creates actual future session records.
- Verify tutor/admin approval and decline flows.
- Verify double-booking is blocked for tutor and student.
- Verify family cancellation displays the billing consequence before confirmation.
- Confirm Spec 07 can invoice from scheduled sessions and session status data.

## Dependencies

- Spec 02: Database Schema
- Spec 04: Family Onboarding And Intake
- Spec 05: Tutor Profiles And Availability

## Scheduling Rules

- Families, adult students, tutors, and admins can schedule within their permissions.
- Families can book any active available tutor after signup and payment setup.
- Families must have a saved payment method before booking.
- Sessions are one-on-one only.
- Booking supports one-time sessions and recurring weekly sessions.
- Month-out recurring bookings create actual session records immediately.
- Same-day booking is blocked by default.
- Double-booking must be prevented.
- Families may request times outside posted availability.
- Either tutor or admin can approve a booking request.
- Tutors can accept/decline booking requests.
- Admins can manually assign a different tutor than requested.
- Tutors can reschedule confirmed sessions directly.
- Families can cancel confirmed sessions directly after seeing billing consequences.

## Session Statuses

- `requested`
- `pending_approval`
- `confirmed`
- `completed`
- `canceled`
- `no_show`
- `declined`

## Booking Flow

Family scheduling flow:

1. Choose student
2. Choose subject
3. Choose tutor
4. Choose one-time or recurring weekly
5. Choose time from availability or request custom time
6. Review price, duration, cancellation policy, and payment method
7. Submit booking request
8. Tutor/admin receives notification
9. Tutor/admin accepts, declines, or admin assigns another tutor
10. Confirmed sessions appear on calendars

## Recurring Sessions

Recurring bookings should support:

- Weekly recurrence
- End date or count, defaulting to approximately one month out
- Actual session records created for each occurrence
- Conflict checking for each occurrence
- Partial failure handling before final submit

If one occurrence conflicts, show the conflict and let the user remove that occurrence or choose another time before submitting.

## Cancellation Policy

When a family cancels, show a confirmation notice:

- More than 24 hours before session: no charge
- Less than 24 hours before session: 50% charge
- No-show: full charge

The cancellation confirmation must state the expected billing result before the user confirms.

## Rescheduling

Families and tutors can reschedule their own confirmed sessions.

Rescheduling should:

- Check availability/conflicts
- Preserve session history through audit events
- Notify affected users
- Update billing details if duration/price changes

## Routes

Family:

- `/portal/schedule`
- `/portal/sessions`
- `/portal/sessions/:sessionId`

Tutor:

- `/portal/tutor/sessions`
- `/portal/tutor/sessions/:sessionId`

Admin:

- `/portal/admin/sessions`
- `/portal/admin/booking-requests`
- `/portal/admin/sessions/:sessionId`

## UI Requirements

### Schedule Builder

Use a guided flow:

- Student selector
- Subject selector
- Tutor selector with comparison cards
- Calendar/time picker
- Recurrence toggle
- Review panel
- Submit button

### Calendar Views

Provide:

- Upcoming sessions list
- Calendar-style view if practical
- Status badges
- Filters by student/tutor/status

### Booking Request Review

Show:

- Student
- Subject
- Tutor
- Date/time
- Location type/location
- Meeting link behavior
- Duration
- Price
- Cancellation policy
- Payment method summary

## Backend Requirements

- Generate bookable slots from tutor availability.
- Create booking requests.
- Create session records for one-time and recurring requests.
- Prevent overlapping sessions for same tutor and same student.
- Attach tutor meeting link to virtual sessions.
- Store open location field for in-person sessions.
- Send notifications on request, approval, decline, cancellation, and reschedule.
- Write audit events for lifecycle changes.

## Conflict Rules

Block if:

- Tutor already has a confirmed or pending session overlapping the requested time.
- Student already has a confirmed or pending session overlapping the requested time.
- Requested time violates minimum notice.
- Tutor is inactive.
- Family billing status blocks booking.
- No saved payment method exists.

## Acceptance Criteria

- Family can request one-time session.
- Family can request recurring weekly sessions about one month out.
- Tutor/admin can accept or decline.
- Admin can assign a different tutor.
- Confirmed sessions appear on family, tutor, and admin views.
- Double-booking is prevented.
- Cancellations show billing notice before confirmation.
- Rescheduling updates sessions and notifies affected users.

## Out Of Scope

- External Google/Outlook calendar sync
- Automatic meeting generation
- Group sessions
- Package/session-credit scheduling
- Complex waitlists

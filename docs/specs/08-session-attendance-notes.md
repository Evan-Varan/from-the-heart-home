# Spec 08: Session Attendance And Notes

## Product Context

Tutors should log whether a session happened and write a simple parent-visible note. The business does not need advanced progress tracking or private tutor notes in the initial portal.

## Goal

Implement attendance tracking and session notes for completed, canceled, and no-show sessions.

## Dependencies

- Spec 06: Scheduling And Booking Lifecycle
- Spec 07: Stripe Billing And Invoicing

## Attendance States

- `attended`
- `student_no_show`
- `tutor_no_show`
- `canceled_late`
- `canceled_on_time`

## Session Notes

Initial note format:

- General notes text box
- Attendance notes text box or combined notes if simpler

Notes are parent-visible. Do not build private tutor notes in the initial scope.

## User Stories

- As a tutor, I can mark attendance for my session.
- As a tutor, I can write session notes after a session.
- As a family, I can view session notes for my student.
- As an admin, I can view and edit attendance/notes if needed for operations.
- As the billing system, I can use attendance/cancellation states to apply the right billing rules.

## Routes

Family:

- `/portal/sessions/:sessionId`
- `/portal/students/:studentId`

Tutor:

- `/portal/tutor/sessions/:sessionId`
- `/portal/tutor/session-log`

Admin:

- `/portal/admin/sessions/:sessionId`

## UI Requirements

### Tutor Session Detail

Show:

- Student
- Subject
- Date/time
- Location/meeting link
- Payment status
- Attendance selector
- General notes text area
- Save button

### Family Session Detail

Show:

- Session status
- Attendance state
- Tutor note
- Date/time
- Subject
- Tutor
- Related invoice line item if available

### Tutor Session Log

Show monthly session log:

- Date
- Student
- Subject
- Duration
- Attendance state
- Billing status/payment status
- Notes completion state

This log supports admin payment calculations outside the portal.

## Backend Requirements

- Tutors can mark attendance only for their own sessions.
- Admins can mark/edit attendance for any session.
- Families can view notes for their own students only.
- Attendance changes should update session status when appropriate.
- Attendance changes should trigger invoice line recalculation or invoice creation behavior where applicable.
- Audit attendance and note changes.
- Notify families when a session note is posted.

## Status Behavior

- `attended` should generally move session to `completed`.
- `student_no_show` should generally move session to `no_show`.
- `tutor_no_show` should flag admin attention and should not bill the family automatically.
- `canceled_late` should preserve canceled status and bill 50%.
- `canceled_on_time` should preserve canceled status and bill $0.

## Edge Cases

- Tutor forgets to mark attendance.
- Attendance is changed after invoice generation.
- Tutor no-show should not charge family automatically.
- Session note is blank but attendance is marked.
- Family views note immediately after tutor saves it.

## Acceptance Criteria

- Tutor can mark attendance for own sessions.
- Tutor can write a general parent-visible note.
- Family can view notes for their own student.
- Admin can view all notes and attendance states.
- Attendance states connect correctly to billing rules.
- Tutor monthly session log is available.

## Out Of Scope

- Private tutor notes
- Ratings/reviews
- Advanced progress tracking
- Grades/test score tracking
- Tutor payout execution


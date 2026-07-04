# Spec 09: Messaging And Notifications

## Product Context

Families and tutors need a general conversation channel. Admins should be able to see all conversations. The system should send email notifications by default and optionally SMS based on user preferences.

## Goal

Implement family/tutor messaging and notification events for scheduling, billing, notes, and account activity.

## Pre-Spec Checklist

- Confirm Specs 01, 06, 07, and 08 expose the events that need notifications.
- Review [Manual Actions Checklist](./manual-actions.md), especially Resend, SMS, and consent items.
- Confirm whether SMS ships now or remains disabled behind preferences/config.
- Confirm sender name, reply-to behavior, and support inbox.

## Manual Actions

- `ACCOUNT REQUIRED`: Verify Resend sending domain/DNS if not already complete.
- `SECRET REQUIRED`: Add Resend API key for each environment.
- `OWNER REQUIRED`: Confirm sender name, reply-to behavior, and support inbox.
- `OWNER REQUIRED`: Decide whether SMS ships in the first production release or remains deferred.
- `ACCOUNT REQUIRED`: If SMS ships, configure Twilio phone number and any required messaging registration.
- `OWNER REQUIRED`: Approve SMS opt-in/consent language before enabling SMS.
- `SECRET REQUIRED`: Add Twilio credentials only if SMS is enabled.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed messaging/notification files.
- Verify family/tutor conversations enforce relationship permissions.
- Verify admins can view conversations without breaking participant permissions.
- Verify email notification sends in development/test mode.
- Verify SMS is skipped safely when disabled or missing credentials.
- Confirm notification failures do not block scheduling or billing workflows.
- Confirm Spec 10 can link files separately without message attachments.

## Dependencies

- Spec 01: Auth, Roles, And Permissions
- Spec 02: Database Schema
- Spec 06: Scheduling And Booking Lifecycle
- Spec 07: Stripe Billing And Invoicing
- Spec 08: Session Attendance And Notes

## Messaging Scope

Messaging is a general family/tutor conversation, not threaded per session. Conversations may be associated with a student and tutor.

Admins can view all messages.

## User Stories

- As a family, I can message my student's tutor.
- As a tutor, I can message a family I work with.
- As an admin, I can view all conversations.
- As a user, I can receive email notifications by default.
- As a user, I can opt into SMS notifications.

## Routes

Family:

- `/portal/messages`

Tutor:

- `/portal/tutor/messages`

Admin:

- `/portal/admin/messages`

Settings:

- `/portal/settings/notifications`

## UI Requirements

### Inbox

Show:

- Conversation list
- Student/tutor/family context
- Last message preview
- Unread indicator
- Timestamp

### Conversation View

Show:

- Message history
- Composer
- Participant names
- Related student context
- Admin-visible label if admin is viewing

### Notification Preferences

Allow users to toggle:

- Email notifications
- SMS notifications
- Session reminders
- Billing alerts
- Message alerts

SMS toggle should require a phone number and consent language.

## Notification Events

Send notifications for:

- New family registration
- Tutor approval needed
- Booking request created
- Booking accepted
- Booking declined
- Session rescheduled
- Session canceled
- Session reminder
- Invoice generated
- Payment failed
- Payment succeeded, if useful
- Session note posted
- New message

Email is the default channel. SMS sends only when enabled and phone is present.

## Email Provider

Use Resend. Follow the existing contact form pattern in `src/routes/contact.tsx`, but move reusable email utilities into portal notification modules rather than duplicating large email helper code.

## SMS Provider

Use Twilio for SMS when implemented.

SMS should be optional. If Twilio credentials are missing, skip SMS sends and log notification status as skipped/failed without breaking the core workflow.

## Backend Requirements

- Create conversation records for family/tutor pairs.
- Restrict conversation access by role and relationship.
- Store messages.
- Track unread/read state or at least `read_at`.
- Create notification records for event sends.
- Send email through Resend.
- Send SMS through Twilio only when enabled.
- Avoid duplicate notifications where possible.

## Permissions

- Families can only message tutors connected to their student/session.
- Tutors can only message relevant families.
- Admins can view all conversations.
- Admins may send messages if implemented, but passive visibility is sufficient for initial scope.

## Edge Cases

- User disables all notifications.
- User has SMS enabled but no phone.
- Provider send fails.
- Admin views a conversation without becoming a participant.
- Tutor is inactive but old messages remain visible.

## Acceptance Criteria

- Family/tutor conversations work.
- Messages persist and display in order.
- Admins can view all conversations.
- Email notifications are sent for core events.
- SMS preferences exist and SMS sends only when enabled/configured.
- Notification failures do not break booking or billing workflows.

## Out Of Scope

- Session-specific threaded messaging
- Attachments inside messages, unless file upload spec later links files separately
- Real-time websockets
- Push notifications
- Complex support-ticket workflows

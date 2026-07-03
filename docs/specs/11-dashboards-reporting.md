# Spec 11: Dashboards And Reporting

## Product Context

The portal should include personalized dashboards for families, tutors, and admins. Reporting should help the business operate without becoming a complex analytics product.

## Goal

Implement role-specific dashboards and practical reports for sessions, invoices, tutor logs, unpaid balances, and operational alerts.

## Dependencies

- Spec 06: Scheduling And Booking Lifecycle
- Spec 07: Stripe Billing And Invoicing
- Spec 08: Session Attendance And Notes
- Spec 09: Messaging And Notifications

## Family Dashboard

Show:

- Upcoming sessions
- Unpaid invoices/balance status
- Quick schedule button
- Recent messages
- Recent session notes
- Student cards

Family dashboard should prioritize immediate actions:

- Schedule session
- Pay invoice or fix payment method
- View next meeting link
- Read new tutor note/message

## Tutor Dashboard

Show:

- Today's sessions
- Pending booking requests
- Upcoming sessions
- Notes/attendance needing completion
- Recent messages
- Monthly session log summary

Tutor dashboard should make it obvious what needs action today.

## Admin Dashboard

Show:

- Pending booking approvals
- New family registrations
- Tutors needing approval
- Upcoming sessions
- Unpaid/past-due invoices
- Payment failures
- Tutor availability gaps
- Recent cancellations/no-shows

## Reports

Implement practical reports:

- Sessions by date range
- Tutor hours/session log by month
- Unpaid invoices
- Revenue by month
- Cancellation/no-show count
- Family/student activity

CSV export is deferred, but reports should be structured so CSV export can be added later.

## Routes

Family:

- `/portal/dashboard`

Tutor:

- `/portal/tutor`
- `/portal/tutor/session-log`

Admin:

- `/portal/admin`
- `/portal/admin/reports`

## UI Requirements

- Use concise cards for top metrics and action queues.
- Use tables for operational lists.
- Include date range filters where relevant.
- Empty states should include a clear next action.
- Avoid marketing-style hero sections.
- Mobile dashboards should prioritize the next action and upcoming sessions.

## Backend Requirements

- Build dashboard query services per role.
- Aggregate only necessary data.
- Enforce permissions in dashboard queries.
- Cache cautiously, if at all, because sessions and invoices change often.

## Metrics

Admin metrics:

- Upcoming sessions today/week
- Pending booking requests
- Past due invoice total
- Revenue this month
- Tutor sessions this month
- Cancellations/no-shows this month

Tutor metrics:

- Sessions this month
- Hours this month
- Notes due
- Pending requests

Family metrics:

- Upcoming sessions
- Open invoice total
- Recent completed sessions

## Acceptance Criteria

- Family, tutor, and admin dashboards render role-specific data.
- Dashboards link directly to relevant detail pages.
- Admin reports show operational metrics.
- Tutor session log supports monthly tutor payment review outside the portal.
- Permission checks prevent cross-account reporting leaks.

## Out Of Scope

- CSV export
- Advanced cohort analytics
- Forecasting
- Data warehouse
- Complex charting unless already useful from existing chart components


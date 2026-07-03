# Spec 03: Portal UI Shell And Design System

## Product Context

The marketing site is warm and parent-friendly. The portal should keep the brand, but the authenticated app should feel like a practical operations dashboard for families, tutors, and admins.

## Goal

Create the authenticated portal shell, navigation, responsive layout, and reusable UI patterns needed by all portal features.

## Dependencies

- Spec 00: Architecture Foundation
- Spec 01: Auth, Roles, And Permissions

## Design Principles

- Prioritize clear workflows over marketing presentation.
- Use the existing brand colors, logo, typography, and shadcn-style components.
- Keep dashboards scannable and calm.
- Avoid nested cards and oversized hero sections inside the portal.
- Use icons for common actions when available.
- Make tables, calendars, forms, empty states, loading states, and errors consistent.
- Ensure mobile layouts work for parents booking or paying from a phone.

## Portal Layout

### Desktop

Use an app shell with:

- Left sidebar or compact navigation rail
- Top bar with current section title, notifications, user menu
- Main content area with constrained readable width where appropriate
- Role-specific navigation

### Mobile

Use:

- Top bar
- Drawer/sheet navigation
- Sticky key actions where useful, such as "Schedule"
- Tables converted to cards or horizontally scrollable layouts

## Navigation

### Family Navigation

- Dashboard
- Schedule
- Sessions
- Students
- Tutors
- Invoices
- Messages
- Files
- Settings

### Tutor Navigation

- Dashboard
- Sessions
- Availability
- Students
- Messages
- Session Log
- Profile
- Settings

### Admin Navigation

- Dashboard
- Families
- Students
- Tutors
- Sessions
- Booking Requests
- Invoices
- Messages
- Reports
- Settings

## Shared Components

Build reusable portal components:

- `PortalShell`
- `PortalSidebar`
- `PortalTopbar`
- `RoleNav`
- `PageHeader`
- `ActionBar`
- `DataTable`
- `StatusBadge`
- `EmptyState`
- `LoadingPanel`
- `ErrorPanel`
- `ConfirmDialog`
- `FormSection`
- `CalendarGrid`
- `SessionCard`
- `InvoiceSummary`
- `TutorCard`
- `StudentSwitcher`
- `NotificationMenu`

## Status Badge Language

Session statuses:

- Requested
- Pending Approval
- Confirmed
- Completed
- Canceled
- No-show
- Declined

Invoice statuses:

- Draft
- Open
- Paid
- Past Due
- Void
- Uncollectible

Attendance states:

- Attended
- Student No-show
- Tutor No-show
- Late Cancellation
- On-time Cancellation

## Route Shell Behavior

- Public `/portal` should show login/register when unauthenticated.
- Authenticated `/portal` should redirect based on role.
- Protected pages should show a permission-safe "not found or no access" state when blocked.
- Loading states should not cause layout shifts.

## UI Acceptance Criteria

- Family, tutor, and admin users each see role-appropriate navigation.
- Portal shell works on desktop and mobile.
- There is a consistent page header/action pattern.
- Empty states tell users what action to take.
- Status badges are consistent across sessions, invoices, and attendance.
- Existing marketing site layout is not changed except for portal links if needed.

## Out Of Scope

- Full feature implementation for scheduling, billing, messaging, files, or dashboards
- Redesigning the marketing site
- Public booking flow outside `/portal`
- Advanced white-label theming


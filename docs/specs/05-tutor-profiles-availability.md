# Spec 05: Tutor Profiles And Availability

## Product Context

Families should be able to compare tutors after signup/payment setup. Tutors should manage their profile, subjects, grade ranges, reusable meeting link, and weekly recurring availability.

## Goal

Implement tutor profiles, tutor onboarding/admin approval, and weekly availability blocks.

## Manual Actions

- `OWNER REQUIRED`: Provide initial tutor names, bios, subjects, grade ranges, contact details, and profile photos if available.
- `OWNER REQUIRED`: Provide or confirm each tutor's Zoom/Google Meet link.
- `OWNER REQUIRED`: Confirm who internally can approve tutors.
- `OWNER REQUIRED`: Confirm whether tutor pay reporting rates should be populated during initial setup.

## Dependencies

- Spec 01: Auth, Roles, And Permissions
- Spec 02: Database Schema
- Spec 03: Portal UI Shell And Design System

## User Stories

- As a tutor, I can maintain my profile.
- As a tutor, I can define weekly recurring availability blocks.
- As a tutor, I can store my reusable Zoom/Google Meet link.
- As a family, I can compare tutors after I complete signup and payment setup.
- As an admin, I can approve tutor profiles and edit tutor details.

## Tutor Profile Fields

Required:

- Display name
- Email
- Phone
- Bio
- Subjects
- Grade levels
- Status: pending, active, inactive

Optional:

- Profile photo
- Meeting link
- In-person availability flag
- Internal pay reporting rate
- Default displayed hourly rate if used later

## Tutor Availability

Availability uses weekly recurring blocks.

Fields:

- Day of week
- Start time
- End time
- Timezone
- Location type: virtual, in-person, either
- Active/inactive

Availability blocks should be used by scheduling to generate open bookable slots. Do not create infinite future slot records. Generate available slots dynamically, then create real `sessions` when a booking is requested/confirmed.

## Routes

Tutor:

- `/portal/tutor/profile`
- `/portal/tutor/availability`

Family:

- `/portal/tutors`
- `/portal/tutors/:tutorId`

Admin:

- `/portal/admin/tutors`
- `/portal/admin/tutors/:tutorId`

## UI Requirements

### Tutor Profile Editor

Tutor can edit:

- Photo
- Bio
- Contact info
- Meeting link
- In-person availability

Admin can edit all tutor fields, including:

- Status
- Subject assignments
- Grade ranges
- Pay reporting fields

### Availability Editor

Use a weekly layout with blocks. Tutors should be able to:

- Add a block
- Edit a block
- Delete/deactivate a block
- Duplicate a block to another day if simple to implement

### Family Tutor Directory

Families can view:

- Tutor photo
- Name
- Bio preview
- Subjects
- Grade levels
- Availability preview
- Virtual/in-person indicator

Families can open a tutor detail page and start a booking request.

Tutor directory is visible only after signup and payment setup.

## Backend Requirements

- Store tutor profile fields.
- Store subject and grade-level capabilities.
- Store weekly availability blocks.
- Validate availability blocks do not overlap for the same tutor.
- Prevent inactive/pending tutors from receiving new public booking requests.
- Notify admins when a tutor completes onboarding and needs approval.

## Permissions

- Tutors can edit their own profile and availability.
- Tutors cannot approve themselves.
- Families can view active tutors only after payment setup.
- Admins can view and edit all tutors.

## Edge Cases

- Tutor has no meeting link: virtual sessions should show "meeting link pending" and notify tutor/admin.
- Tutor has overlapping availability blocks: block save.
- Tutor is inactive: hide from family booking.
- Tutor changes availability after sessions are confirmed: existing sessions remain unchanged.
- Timezone differences must not create wrong displayed times.

## Acceptance Criteria

- Tutors can create and update profiles.
- Admins can approve/activate tutors.
- Tutors can manage weekly recurring availability blocks.
- Families can view active tutor profiles after payment setup.
- Availability blocks are timezone-aware.
- Overlapping availability blocks are rejected.

## Out Of Scope

- External calendar sync
- Automatic Zoom/Google Meet creation
- Tutor reviews/ratings
- Tutor payout execution
- Complex vacation/blackout calendar, unless added in scheduling spec as simple session conflicts

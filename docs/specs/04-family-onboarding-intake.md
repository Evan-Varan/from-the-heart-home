# Spec 04: Family Onboarding And Intake

## Product Context

Families are the primary customers. A family account may manage multiple students. Adult students can register for themselves. Families should self-register, complete intake, add a payment method, and request their first session.

## Goal

Implement family registration/onboarding and student intake data collection.

## Pre-Spec Checklist

- Confirm Specs 01-03 are complete enough for authenticated family routes.
- Review [Manual Actions Checklist](./manual-actions.md), especially intake wording decisions.
- Confirm final intake fields, labels, and adult-student wording.
- Confirm payment-method setup can be stubbed or linked to Spec 07 if billing is not implemented yet.

## Manual Actions

- `OWNER REQUIRED`: Confirm final intake wording for learning challenges, accommodations, and parent notes.
- `OWNER REQUIRED`: Confirm whether adult-student onboarding needs different copy from parent-managed onboarding.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed onboarding/student files.
- Verify a family can create/edit at least one student profile.
- Verify adult-student onboarding does not require parent-only language.
- Verify tutors cannot edit student profiles.
- Verify admins can view/edit student intake details if admin shell is available, or document the admin follow-up.
- Confirm Spec 05 has enough student/subject data to connect tutor profiles and availability.

## Dependencies

- Spec 01: Auth, Roles, And Permissions
- Spec 02: Database Schema
- Spec 03: Portal UI Shell And Design System

## User Stories

- As a parent, I can create a family account.
- As an adult student, I can create my own account.
- As a parent, I can add one or more students.
- As a family, I can enter contact details, student goals, subjects, and learning notes.
- As a family, I am guided to add a payment method before booking.
- As an admin, I can see new family accounts and intake details.

## Onboarding Flow

1. Register account
2. Choose account type:
   - Parent managing student
   - Adult student
3. Enter primary contact info:
   - Name
   - Email
   - Phone
   - Notification preference defaults
4. Add student profile:
   - Student name
   - Grade level
   - School
   - Student email/phone if applicable
   - Subject(s)
   - Goals
   - Availability notes
   - Learning challenges
   - Accommodations or IEP/504-style notes if parent chooses to provide them
   - Parent notes
5. Add payment method through Stripe setup flow
6. Continue to first booking request

## Routes

- `/portal/register`
- `/portal/onboarding`
- `/portal/onboarding/student`
- `/portal/onboarding/payment`
- `/portal/students`
- `/portal/students/:studentId`

## UI Requirements

### Onboarding Progress

Show a simple progress indicator:

- Account
- Student
- Payment
- Schedule

### Student Form

The student form should support:

- Required basic identity fields
- Optional school and contact fields
- Multi-select subjects
- Long-form goals/notes
- Learning differences/accommodations text area
- Availability notes text area

### Student List

Family users should be able to:

- View all students in their family account
- Add another student
- Edit existing student profile
- Archive/inactivate a student if no longer tutoring

### Admin View

Admins should be able to:

- View new family accounts
- View intake details
- Edit student profile data
- See onboarding status

## Backend Requirements

- Create `family_accounts` records for family registrations.
- Create `students` records during onboarding.
- Create `student_subjects` links.
- Update `onboarding_status`.
- Create audit events for account creation and student profile changes.

## Permissions

- Families can manage only their own students.
- Tutors cannot edit student profiles.
- Tutors can view student profile context only for relevant/assigned sessions.
- Admins can edit any student profile.

## Edge Cases

- Family starts onboarding and leaves before adding payment method.
- Adult student should not be forced to enter parent-specific labels.
- Family adds multiple students with different subjects.
- Student has sensitive learning notes; access must be permission-checked.
- Family has no saved payment method and tries to schedule; redirect to payment step.

## Acceptance Criteria

- A new family can register and create a family account.
- A parent can add at least one student.
- An adult student can onboard without a separate parent.
- Intake fields are persisted.
- Families cannot access other families' students.
- Admins can view and edit intake data.
- Onboarding routes guide users toward adding a payment method and scheduling.

## Out Of Scope

- Separate logins for minor students
- Parent approval workflows
- Tutor edits to student profiles
- Advanced progress tracking
- Tutor matching automation

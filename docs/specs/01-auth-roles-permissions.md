# Spec 01: Auth, Roles, And Permissions

## Product Context

The Student Portal has three primary role groups: family, tutor, and admin. A family account can represent parents managing minor students or an adult student managing their own tutoring. Admin and billing admin are the same initial role.

Families must be authenticated before viewing tutor availability or booking sessions. Families must also add a payment method before booking.

## Goal

Implement authentication, account identity, role assignment, and permission checks for all portal areas.

## Pre-Spec Checklist

- Confirm Spec 00 is complete and `npm run build` passes.
- Review [Manual Actions Checklist](./manual-actions.md), especially the auth section.
- Confirm the auth provider and whether Google SSO ships now or later.
- Confirm local, dev/staging, and production callback/allowed domains are known.
- Confirm required auth secrets/API keys are available through local/provider configuration, not committed files.

## Manual Actions

- `OWNER REQUIRED`: Confirm the auth provider before implementation. Recommended default is Clerk if it works cleanly with Cloudflare/TanStack Start.
- `ACCOUNT REQUIRED`: Create/configure the auth provider project.
- `ACCOUNT REQUIRED`: Configure local, dev/staging, and production callback/allowed domains.
- `ACCOUNT REQUIRED`: Configure Google OAuth if Google sign-in is included immediately.
- `SECRET REQUIRED`: Store auth secrets/API keys outside the repo for each environment.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed auth/portal files.
- Run the full Spec 01 QA plan in [docs/qa/spec-01-auth-roles-permissions-qa.md](../qa/spec-01-auth-roles-permissions-qa.md).
- Verify unauthenticated users cannot access protected portal routes.
- Verify family, tutor, and admin test users land on the correct dashboard or placeholder route.
- Verify no auth secret, OAuth client secret, or provider private key was committed.
- Confirm Spec 02 manual actions are ready: D1 database creation/approval and seed-user decision.

## Dependencies

- Spec 00: Architecture Foundation

## Auth Approach

Use a simple managed auth provider if it fits the Cloudflare/TanStack Start runtime cleanly. Acceptable choices include Clerk, Auth.js, or another provider that supports password login and Google SSO.

Required auth capabilities:

- Password-based registration/login
- Optional Google SSO
- Secure session handling
- Password reset
- Email verification if supported
- Server-side user identity access in portal server functions

If the selected auth provider introduces significant runtime friction, document the reason and use the simplest secure alternative.

## Roles

Use these roles:

- `family`
- `tutor`
- `admin`

Future roles may be added later, but do not build a complex custom RBAC editor initially.

## Account Rules

- One family login can manage multiple students.
- Minor students do not have separate logins in the initial scope.
- Adult students can register as their own family/client account.
- Tutors have their own login.
- Admins have their own login.
- A user should not be able to self-assign tutor or admin roles.
- Admins approve or create tutor/admin access.

## Permission Matrix

| Capability                        | Family                         | Tutor                                | Admin                           |
| --------------------------------- | ------------------------------ | ------------------------------------ | ------------------------------- |
| View own dashboard                | Yes                            | Yes                                  | Yes                             |
| Manage own profile                | Yes                            | Yes                                  | Yes                             |
| Manage notification preferences   | Yes                            | Yes                                  | Yes                             |
| Manage family students            | Yes, own account               | No                                   | Yes                             |
| Edit student core profile         | Own students                   | No                                   | Yes                             |
| View student accommodations/notes | Own students                   | Assigned/relevant students           | Yes                             |
| View tutor profiles               | After signup/payment setup     | No                                   | Yes                             |
| Manage tutor profile              | No                             | Own profile                          | Yes                             |
| Manage tutor availability         | No                             | Own availability                     | Yes                             |
| Request sessions                  | Yes                            | Yes, for own calendar if needed      | Yes                             |
| Approve booking requests          | No                             | Own requests                         | Yes                             |
| Reschedule confirmed sessions     | Yes for own sessions           | Yes for own sessions                 | Yes                             |
| Cancel confirmed sessions         | Yes for own sessions           | Yes for own sessions                 | Yes                             |
| View invoices/payment status      | Own account                    | Relevant session payment status only | Yes                             |
| Manage payment methods            | Own account                    | No                                   | View only unless later expanded |
| Mark attendance                   | No                             | Own sessions                         | Yes                             |
| Write session notes               | No                             | Own sessions                         | Yes                             |
| View session notes                | Own students                   | Own sessions                         | Yes                             |
| Message users                     | Own tutor/family conversations | Own family conversations             | All                             |
| Upload files                      | Own account/student context    | Relevant sessions/students           | Yes                             |
| View reports                      | No                             | Own session log                      | Yes                             |

## Routes

Implement or prepare these auth routes:

- `/portal`
- `/portal/login`
- `/portal/register`
- `/portal/logout`
- `/portal/forgot-password`
- `/portal/settings/account`

Authenticated users visiting `/portal` should be redirected to their role-appropriate dashboard:

- Family: `/portal/dashboard`
- Tutor: `/portal/tutor`
- Admin: `/portal/admin`

## UI Requirements

### Login

- Email/password login
- Google sign-in option
- Forgot password link
- Link to registration
- Clear error states

### Register

Registration should allow:

- Parent/family account
- Adult student account

Do not allow public self-registration as tutor or admin.

### Account Settings

Users should be able to update:

- Name
- Email, if auth provider supports it
- Phone
- Notification preference defaults
- Password, if using password auth

## Backend Requirements

- Create or sync local `users` records after auth registration/login.
- Store local role assignments.
- Expose helper functions:
  - `requireUser()`
  - `requireRole(role)`
  - `canAccessFamilyAccount(user, familyAccountId)`
  - `canAccessStudent(user, studentId)`
  - `canAccessSession(user, sessionId)`
  - `canManageTutor(user, tutorId)`
  - `canViewInvoice(user, invoiceId)`

## Edge Cases

- Auth user exists but local user profile is missing: create/sync or show support-safe error.
- User has no role: send to pending/support screen.
- Tutor tries to access unrelated student: block.
- Family tries to access another family invoice: block.
- Admin disabled user: block login or portal access.

## Acceptance Criteria

- Password login works.
- Google SSO is available or explicitly documented as deferred if provider setup requires separate credentials.
- Public users cannot access authenticated portal routes.
- Family/tutor/admin users land on correct dashboards.
- Server functions enforce permissions, not just UI.
- Role checks are reusable by later specs.

## Out Of Scope

- Minor student logins
- Parent approval of student login
- Complex RBAC role editor
- SAML/enterprise SSO
- Admin impersonation unless added by a later admin-support spec

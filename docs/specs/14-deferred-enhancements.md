# Spec 14: Deferred Enhancements

Collects features and decisions that were explicitly deferred during earlier specs. Each section notes which spec originally deferred it and what is needed to implement it.

---

## 14-A: Google SSO

**Deferred from:** Spec 01 (Auth, Roles, And Permissions)

**Why deferred:** Requires a Google Cloud project with an OAuth 2.0 client configured for the production domain. The Clerk production instance also uses shared dev credentials for Google in development mode, so this must be wired up before the production portal goes live to real users.

### What to build

- Enable Google as a social provider in Clerk dashboard → Configure → SSO Connections → Google
- Create a Google OAuth 2.0 client in Google Cloud Console scoped to `fromthehearttutoring.com`
- Set authorized redirect URI to the value shown in Clerk's SSO Connections → Google setup screen
- Enter the client ID and secret into Clerk
- Test Google sign-in on the production portal at `/portal/login` and `/portal/register`
- Verify that after Google SSO, the user lands on the correct dashboard for their role

### Manual actions required

- `ACCOUNT REQUIRED`: Google Cloud project with OAuth consent screen configured
- `ACCOUNT REQUIRED`: OAuth 2.0 Client ID (Web application) created with the correct redirect URI from Clerk
- No code changes required — Clerk surfaces the Google button automatically once the credentials are set

### Acceptance criteria

- "Continue with Google" button appears on `/portal/login` and `/portal/register`
- Signing in with a Google account creates a Clerk user and redirects to `/portal/dashboard`
- Existing email/password users are not affected

---

## 14-B: Clerk JWT Template (Role-Based Routing)

**Deferred from:** Spec 01 (Auth, Roles, And Permissions)

**Why deferred:** Requires manual dashboard configuration. Until the JWT template is set, all authenticated users default to the `family` role regardless of their `publicMetadata.role` value.

### What to build

- In Clerk dashboard → Configure → Sessions → Edit session token
- Add `"metadata": "{{user.public_metadata}}"` to the session token template body
- After saving, the `role` field in `publicMetadata` will appear in JWT claims and drive `requireRole()` server-side

### Manual actions required

- `ACCOUNT REQUIRED`: Edit session token template in Clerk dashboard (no code change needed)

### Acceptance criteria

- A user with `publicMetadata.role = "tutor"` is redirected to `/portal/tutor` after login
- A user with `publicMetadata.role = "admin"` is redirected to `/portal/admin` after login
- A user with no role set still defaults to `family`

---

## 14-C: Apple Sign-In

**Deferred from:** Spec 01 (Auth, Roles, And Permissions)

**Why deferred:** Apple requires an Apple Developer account and a Services ID. Lower priority than Google since most families and tutors already have Google accounts.

### What to build

- Enable Apple as a social provider in Clerk dashboard → Configure → SSO Connections → Apple
- Create a Services ID in Apple Developer Console
- Configure the redirect URI and private key as required by Clerk's Apple SSO setup guide

### Manual actions required

- `ACCOUNT REQUIRED`: Apple Developer account (paid)
- `ACCOUNT REQUIRED`: Services ID and key configured for `fromthehearttutoring.com`

### Acceptance criteria

- "Continue with Apple" button appears on login and register pages
- Sign-in flow completes and redirects to the correct dashboard

---

## 14-D: TutorBird Data Migration

**Deferred from:** Global out of scope (README)

**Why deferred:** Requires exporting existing family, student, session, and billing records from TutorBird and mapping them to the portal schema. Can only be done after Spec 02 (database schema) is stable.

### What to build

- Export script to pull data from TutorBird (CSV or API)
- One-time migration script to insert into D1 (families, students, tutors, sessions, invoices)
- Clerk user creation for existing families and tutors (via Clerk backend API)
- Verification pass to confirm record counts and referential integrity post-migration

### Manual actions required

- `OWNER REQUIRED`: Export data from TutorBird before cancelling the subscription
- `OWNER REQUIRED`: Review migrated records for accuracy before going live

### Acceptance criteria

- All active families, students, and tutors have portal accounts
- Session history is visible in the portal
- No duplicate records

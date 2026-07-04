# QA Plan: Spec 01 Auth, Roles, And Permissions

Use this plan after implementing or modifying Spec 01. The goal is to catch broken Clerk setup, bad redirects, missing route protection, role leakage, and committed secret mistakes before moving to Spec 02.

## Preconditions

- Spec 00 is complete.
- Clerk application exists.
- Local environment has Clerk keys configured outside committed files:
  - `CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- Google SSO is either configured in Clerk or explicitly deferred.
- Dev server starts without build errors.
- Test users are available:
  - Family user with no role metadata or role `family`
  - Tutor user with public metadata role `tutor`
  - Admin user with public metadata role `admin`

If role metadata is not configured yet, all signed-in users should default to `family`.

## Command Checks

Run these before browser testing:

```bash
npm run build
npx eslint src/portal src/routes/portal
```

Expected:

- Build succeeds.
- Targeted lint succeeds.
- No secrets appear in command output.

Known repo caveat: full `npm run lint` may still fail on unrelated repo-wide CRLF/Prettier issues. Do not treat that as a Spec 01 auth failure unless the new auth files are involved.

## Public Route Checks

### Marketing Site Still Works

1. Start the dev server.
2. Open `/`.
3. Click normal marketing nav links: About, Services, Pricing, Contact.

Expected:

- Pages load normally.
- No Clerk auth prompt appears on marketing routes.
- Header/footer still render.

### Student Portal Button

1. Sign out.
2. Open `/`.
3. Click the Student Portal link/button.

Expected:

- No React error boundary.
- No `Cannot read properties of undefined (reading 'auth')` error.
- User redirects to `/portal/login`.

## Auth Page Checks

### Login Page

1. Open `/portal/login`.

Expected:

- Clerk sign-in UI renders.
- Link to sign up points to `/portal/register`.
- No console error from Clerk missing publishable key.

### Register Page

1. Open `/portal/register`.

Expected:

- Clerk sign-up UI renders.
- Link to sign in points to `/portal/login`.
- Successful registration redirects back into `/portal`.

### Forgot Password Page

1. Open `/portal/forgot-password`.

Expected:

- Password reset/sign-in flow renders.
- User is not sent to a 404.

## Unauthenticated Protection Checks

While signed out, directly visit:

- `/portal`
- `/portal/dashboard`
- `/portal/tutor`
- `/portal/admin`
- `/portal/settings/account`

Expected:

- Each protected page redirects to `/portal/login`.
- No protected page flashes private content before redirect.
- No client-side auth/context exception appears in the console.

## Family User Checks

Sign in as a family user.

### Portal Redirect

1. Visit `/portal`.

Expected:

- Redirects to `/portal/dashboard`.

### Allowed Family Routes

Open:

- `/portal/dashboard`
- `/portal/settings/account`

Expected:

- Family dashboard renders.
- Account settings page renders.

### Blocked Family Routes

Open:

- `/portal/admin`
- `/portal/tutor`

Expected:

- User is redirected away from the blocked route, preferably back through `/portal` to the family dashboard.
- Admin/tutor placeholder content is not visible.

## Tutor User Checks

Set the Clerk user's public metadata role to `tutor`, then sign in as that user.

### Portal Redirect

1. Visit `/portal`.

Expected:

- Redirects to `/portal/tutor`.

### Allowed Tutor Routes

Open:

- `/portal/tutor`
- `/portal/settings/account`

Expected:

- Tutor dashboard renders.
- Account settings page renders.

### Blocked Tutor Routes

Open:

- `/portal/admin`
- `/portal/dashboard`

Expected:

- Admin route is blocked.
- Family dashboard route is blocked unless intentionally allowed later.

## Admin User Checks

Set the Clerk user's public metadata role to `admin`, then sign in as that user.

### Portal Redirect

1. Visit `/portal`.

Expected:

- Redirects to `/portal/admin`.

### Allowed Admin Routes

Open:

- `/portal/admin`
- `/portal/dashboard`
- `/portal/tutor`
- `/portal/settings/account`

Expected:

- Admin dashboard renders.
- Admin can view family/tutor placeholder dashboards if current role rules allow admin access.
- Account settings page renders.

## Logout Check

1. Sign in as any user.
2. Open `/portal/logout`.

Expected:

- User is signed out.
- User redirects to `/portal/login`.
- Opening `/portal/dashboard` after logout redirects to `/portal/login`.

## Clerk Metadata Check

In Clerk Dashboard, verify role behavior:

- No metadata role: defaults to family.
- `public_metadata.role = "family"`: family dashboard.
- `public_metadata.role = "tutor"`: tutor dashboard.
- `public_metadata.role = "admin"`: admin dashboard.

If roles do not flow into the session, configure the session/JWT claim so metadata is available to the app, or document that all users default to family until this is configured.

## Security Checks

- Search repo for accidental secrets:

```bash
rg -n "sk_live|sk_test|pk_live|pk_test|CLERK_SECRET|CLERK_PUBLISHABLE|whsec_|re_|AC[a-zA-Z0-9]" . --glob "!node_modules/**" --glob "!dist/**"
```

Expected:

- Only placeholder/example values appear in committed files.
- Real keys are not committed.

## Regression Checks

- Contact form page still loads.
- Existing `/portal/login` and `/portal/register` links are valid.
- Refreshing a protected portal page does not crash.
- Client-side navigation into `/portal` does not crash.
- Direct URL entry into `/portal` does not crash.

## Pass Criteria

Spec 01 passes QA when:

- All protected routes enforce auth.
- Family/tutor/admin redirects match expected role.
- Public marketing routes remain public.
- Clerk sign-in/sign-up/settings pages render.
- Logout works.
- No `context.auth` or Clerk server-auth client-navigation crash occurs.
- Build and targeted lint pass.
- No real secrets are committed.

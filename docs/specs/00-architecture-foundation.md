# Spec 00: Architecture Foundation

## Product Context

From the Heart Tutoring needs a full Student Portal inside the existing marketing site repo. The portal replaces TutorBird and supports family accounts, tutors, admins, scheduling, billing, session notes, messaging, files, and dashboards.

The existing repo is already a TanStack Start/TanStack Router app deployed as a Cloudflare Worker. It has a Resend-backed server function in the contact route and a placeholder `/portal` page. The implementation should build on this architecture.

## Goal

Prepare the repo for full-stack portal development with clear runtime boundaries, environment config, server-side data access patterns, and portal module organization.

## Pre-Spec Checklist

- Read [Product Outline](../product-outline.md) and [Manual Actions Checklist](./manual-actions.md).
- Confirm this repo should remain TanStack Start on Cloudflare Workers for the initial portal build.
- Confirm no provider accounts, production secrets, or database resources are required for this foundation-only spec.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on new portal foundation files, such as `npx eslint src/portal`.
- Confirm `.dev.vars.example` contains placeholders only, not real secrets.
- Confirm any local tool files, such as `.claude/settings.local.json`, are ignored or left uncommitted.
- Confirm Spec 01 manual actions are ready: auth provider decision, auth project setup, callback domains, Google OAuth if included, and auth secrets.

## Dependencies

None. This is the first implementation spec.

## Architecture Decisions

- Keep the current TanStack Start app.
- Keep Cloudflare Workers deployment.
- Use Cloudflare D1 as the primary relational database.
- Use Cloudflare R2 for uploaded files.
- Use Stripe for customer, payment method, invoice, and autopay workflows.
- Use Resend for email notifications.
- Add Twilio only where SMS notification work requires it.
- Keep external calendar sync, automatic meeting creation, and TutorBird migration out of scope.

## Required Work

### Project Structure

Create a portal-oriented structure under `src` that keeps marketing and portal code separated without moving the current marketing pages unnecessarily.

Recommended structure:

```text
src/
  portal/
    auth/
    components/
    data/
    hooks/
    layouts/
    lib/
    notifications/
    permissions/
    server/
    types/
  routes/
    portal...
```

The exact route file layout should follow TanStack Router conventions already used in the repo.

### Environment Config

Define a typed server config layer for:

- `APP_ENV`
- `PUBLIC_SITE_URL`
- `DATABASE_URL` or D1 binding name, depending on implementation
- `R2_BUCKET` binding
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_PHONE`
- `AUTH_SECRET`
- Auth provider keys if using a managed provider

Do not read raw environment variables throughout feature code. Create one server-side config helper and one client-safe public config helper.

### Server/Data Access Pattern

Create a consistent pattern for server-side mutations and queries:

- Server functions/API handlers validate inputs.
- Server code performs permission checks.
- Data access is centralized in repository/service modules.
- UI components call typed portal actions/queries instead of embedding database logic.

Recommended flow:

```text
route component -> portal hook/action -> server function -> service -> database
```

### Error Handling

Add shared error types or helpers for:

- Unauthorized
- Forbidden
- Not found
- Validation error
- Payment required
- Conflict/double-booking
- External provider failure

Errors shown to users should be plain and actionable. Internal details should not leak to the client.

### Audit History Foundation

Create a reusable audit event helper that future specs can call when important records change.

Audit events should support:

- Acting user
- Target entity type
- Target entity ID
- Event type
- JSON metadata
- Timestamp

Do not build a full audit UI in this spec.

## UI Requirements

No major UI is required in this spec beyond any temporary developer-only health page or portal placeholder needed to verify server configuration.

## Acceptance Criteria

- The app still builds after structural changes.
- Portal-specific modules have a clear home under `src/portal`.
- Server config is centralized and typed.
- There is a clear pattern for server functions/API handlers, services, and data access.
- The codebase has a reusable permission/error/audit foundation ready for later specs.
- Existing marketing routes continue to work.
- Existing contact form behavior is not broken.

## Out Of Scope

- Authentication UI
- Database schema implementation beyond minimal connection/bootstrap
- Portal dashboard UI
- Scheduling
- Billing
- Messaging
- File uploads
- Deployment automation

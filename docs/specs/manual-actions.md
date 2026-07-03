# Manual Actions Checklist

This file lists user/owner actions that must happen between or during implementation specs. These are intentionally marked because an AI coding agent can prepare code and instructions, but should not guess business credentials, create production accounts without approval, or make irreversible production configuration changes.

## Manual Action Labels

- `OWNER REQUIRED`: The business owner must decide, approve, or provide information.
- `ACCOUNT REQUIRED`: Someone with access to a vendor account must create/configure something.
- `SECRET REQUIRED`: A secret/API key must be created and stored outside the repo.
- `PRODUCTION GATE`: Do not proceed to production until this has been verified.

## Between-Spec Gates

### Before Spec 01: Auth, Roles, And Permissions

- `OWNER REQUIRED`: Confirm the auth provider. Recommended default is Clerk if it works cleanly with the runtime.
- `ACCOUNT REQUIRED`: Create the auth provider project/application.
- `ACCOUNT REQUIRED`: Configure allowed domains for local, dev/staging, and production.
- `ACCOUNT REQUIRED`: Configure Google OAuth if Google sign-in is included in the first pass.
- `SECRET REQUIRED`: Add auth secrets/API keys to local and Cloudflare environments.

### Before Spec 02: Database Schema

- `ACCOUNT REQUIRED`: Create Cloudflare D1 databases for local/dev/prod or approve the implementer to create them with Wrangler.
- `OWNER REQUIRED`: Confirm whether seed data can include real admin/tutor emails or should use test-only users.
- `PRODUCTION GATE`: Confirm production migrations are reviewed before applying them.

### Before Spec 04: Family Onboarding And Intake

- `OWNER REQUIRED`: Confirm final intake fields and wording for accommodations/learning differences.
- `OWNER REQUIRED`: Confirm whether adult-student accounts should use the same onboarding copy as parent accounts or separate labels.

### Before Spec 05: Tutor Profiles And Availability

- `OWNER REQUIRED`: Provide initial tutor list, subjects, grade ranges, bios, contact details, and meeting links.
- `OWNER REQUIRED`: Confirm who can approve tutors internally.
- `OWNER REQUIRED`: Confirm whether tutor pay reporting rates should be stored in the first implementation or left blank until admin setup.

### Before Spec 07: Stripe Billing And Invoicing

- `ACCOUNT REQUIRED`: Create or access the Stripe account.
- `ACCOUNT REQUIRED`: Complete Stripe business verification and payout/bank setup.
- `OWNER REQUIRED`: Confirm invoice grouping defaults: weekly is recommended based on current workflow.
- `OWNER REQUIRED`: Confirm default payment methods to enable: card plus ACH is recommended.
- `OWNER REQUIRED`: Confirm whether ACH should be encouraged as the preferred option to reduce fees.
- `SECRET REQUIRED`: Add Stripe publishable key, secret key, and webhook secret for each environment.
- `PRODUCTION GATE`: Run a full Stripe test-mode payment method setup, invoice, autopay, failed payment, and webhook test before live billing.

### Before Spec 09: Messaging And Notifications

- `ACCOUNT REQUIRED`: Verify Resend sending domain/DNS if not already fully configured.
- `SECRET REQUIRED`: Add Resend API key to each environment.
- `OWNER REQUIRED`: Confirm notification sender name and reply-to behavior.
- `OWNER REQUIRED`: Confirm whether SMS is included in the first production release or deferred.
- `ACCOUNT REQUIRED`: If SMS is included, create/configure Twilio phone number and required messaging registration.
- `OWNER REQUIRED`: Approve SMS consent language before enabling SMS.
- `SECRET REQUIRED`: Add Twilio credentials only if SMS is enabled.

### Before Spec 10: File Uploads With R2

- `ACCOUNT REQUIRED`: Create Cloudflare R2 buckets for dev/staging and production or approve the implementer to create them.
- `OWNER REQUIRED`: Confirm file size limit. Recommended initial limit is 20 MB per file.
- `OWNER REQUIRED`: Confirm allowed file types.
- `PRODUCTION GATE`: Confirm protected file downloads are not publicly accessible.

### Before Spec 13: Environments And Deployment

- `ACCOUNT REQUIRED`: Confirm Cloudflare account access and production zone access.
- `ACCOUNT REQUIRED`: Create/configure dev/staging Worker route or subdomain.
- `SECRET REQUIRED`: Add all production secrets through Cloudflare/GitHub secret storage, never committed files.
- `OWNER REQUIRED`: Confirm deployment trigger strategy: manual production deploy is recommended initially.
- `PRODUCTION GATE`: Verify auth, database, R2, Stripe, Resend, and optional Twilio all point at production resources before first real users.
- `PRODUCTION GATE`: Create the first production admin user.

## Ongoing Manual Operations

- `OWNER REQUIRED`: Keep tutor bios, meeting links, and availability accurate.
- `OWNER REQUIRED`: Review payment disputes/chargebacks in Stripe or PayPal/Square if alternatives are added later.
- `OWNER REQUIRED`: Review failed payments and blocked accounts.
- `OWNER REQUIRED`: Review user-reported data/privacy issues.
- `PRODUCTION GATE`: Apply production database migrations deliberately; do not let agents run production migrations without explicit approval.


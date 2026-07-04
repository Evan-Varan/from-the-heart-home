# Spec 13: Environments And Deployment

## Product Context

The current site is deployed cheaply on Cloudflare. The portal should preserve a low-cost, simple deployment model while adding full-stack backend behavior, database, file storage, Stripe, Resend, and optional Twilio.

## Goal

Define local, dev/staging, and production environments with Cloudflare deployment and simple GitHub Actions automation.

## Pre-Spec Checklist

- Confirm Specs 00-12 are complete or explicitly decide which incomplete features are not part of first deployment.
- Review [Manual Actions Checklist](./manual-actions.md), especially production gates.
- Confirm Cloudflare access, domain/zone access, environment names, and deployment trigger strategy.
- Confirm all provider accounts and secrets exist for the target environment.

## Manual Actions

- `ACCOUNT REQUIRED`: Confirm Cloudflare account access and production zone access.
- `ACCOUNT REQUIRED`: Create/configure dev/staging Worker route or subdomain.
- `SECRET REQUIRED`: Add production secrets through Cloudflare/GitHub secret storage, never committed files.
- `OWNER REQUIRED`: Confirm deployment trigger strategy. Manual production deploy is recommended initially.
- `PRODUCTION GATE`: Verify auth, database, R2, Stripe, Resend, and optional Twilio all point at production resources before first real users.
- `PRODUCTION GATE`: Create the first production admin user.

## Post-Spec Checklist

- Run `npm run build`.
- Verify local environment starts with documented commands.
- Verify dev/staging deployment uses non-production database, storage, Stripe, Resend, Twilio, and auth resources.
- Verify production deployment uses production resources only after explicit approval.
- Verify secrets are stored in Cloudflare/GitHub secret storage and are not committed.
- Verify first production admin can log in.
- Verify core smoke test: login, portal load, payment setup in correct mode, booking request, notification send, and protected file behavior if files are enabled.

## Dependencies

- Spec 00: Architecture Foundation
- Specs 01-12 implemented or in progress

## Environments

### Local

Used for local development.

Needs:

- Local dev server
- Local or preview D1 database
- Local/preview R2 bucket or stub
- Stripe test keys
- Resend test/development key
- Twilio test credentials or disabled SMS
- Local auth provider config

### Dev/Staging

Used for testing real deployed behavior before production.

Needs:

- Separate Cloudflare Worker name or environment
- Separate D1 database
- Separate R2 bucket
- Stripe test mode
- Resend configured for safe test recipients or dev domain
- Twilio test mode or disabled SMS
- Separate auth app/config if provider requires it

### Production

Used for real families, tutors, and admins.

Needs:

- Production Cloudflare Worker route
- Production D1 database
- Production R2 bucket
- Stripe live keys/webhook
- Resend production sending identity
- Twilio live credentials if SMS is enabled
- Production auth config

## Cloudflare Config

Update `wrangler.jsonc` or equivalent config to support:

- Environment-specific vars
- D1 bindings
- R2 bindings
- Worker routes
- Compatibility flags already required by the app

Do not put secrets directly in committed config. Use Cloudflare secrets or environment secret management.

## Environment Variables And Secrets

Required secrets/config:

- `APP_ENV`
- `PUBLIC_SITE_URL`
- `AUTH_SECRET`
- Auth provider keys
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_PHONE`

Cloudflare bindings:

- D1 database binding
- R2 bucket binding

## Stripe Webhooks

Set up webhook endpoints per environment.

Events should include at least:

- Payment succeeded
- Payment failed
- Invoice paid/open/past due, depending on chosen Stripe flow
- Payment method attached/updated if needed

Webhook handlers must be idempotent.

## GitHub Actions

Keep CI/CD simple:

- Install dependencies
- Build app
- Deploy to dev/staging on chosen branch or manual dispatch
- Deploy to production on main branch or manual approval

Avoid overcomplicated test gates initially. Running the build is enough unless feature specs later add tests.

## Migration Workflow

Define commands for:

- Creating D1 databases
- Applying migrations locally
- Applying migrations to dev/staging
- Applying migrations to production

Production migrations should be explicit and reviewed before deployment.

## Deployment Checklist

Before production:

- Auth provider production domain configured
- Stripe live mode configured
- Stripe webhook verified
- Resend production sender verified
- Twilio SMS consent behavior reviewed if SMS enabled
- D1 production migrations applied
- R2 production bucket created
- Admin user created
- Marketing routes still work
- `/portal` login/register works
- Payment method setup works in live mode
- Booking request notifications work

## Acceptance Criteria

- Local environment can run the portal.
- Dev/staging environment is separate from production.
- Production environment uses production resources.
- Secrets are not committed.
- GitHub Actions can build and deploy.
- D1 migrations are documented and repeatable.
- Stripe webhooks are configured per environment.

## Out Of Scope

- Complex test matrix
- Preview deployments for every pull request
- Multi-region deployment design
- Automated rollback system
- Infrastructure as code beyond practical Cloudflare/GitHub config

# Spec 07: Stripe Billing And Invoicing

## Product Context

From the Heart Tutoring charges per session. Default pricing is $70/hour, but price and duration should be configurable. Families are usually booked about a month out and billed through configurable invoice grouping. The new portal starts fresh and does not migrate TutorBird payment history.

## Goal

Implement Stripe customer setup, saved payment methods, autopay, automatic invoice generation from scheduled sessions, payment status tracking, and booking blocks for unpaid balances.

## Pre-Spec Checklist

- Confirm Specs 02, 04, and 06 are complete enough for family accounts, sessions, and billing settings.
- Review [Manual Actions Checklist](./manual-actions.md), especially Stripe account, secrets, and production gates.
- Confirm invoice grouping default, enabled payment methods, and ACH preference.
- Confirm Stripe test keys and webhook secret are available outside committed files.

## Manual Actions

- `ACCOUNT REQUIRED`: Create or access the Stripe account.
- `ACCOUNT REQUIRED`: Complete Stripe business verification and payout/bank setup.
- `OWNER REQUIRED`: Confirm invoice grouping defaults. Weekly is recommended based on current workflow.
- `OWNER REQUIRED`: Confirm enabled payment methods. Card plus ACH is recommended.
- `OWNER REQUIRED`: Confirm whether ACH should be presented as the preferred lower-fee option.
- `SECRET REQUIRED`: Add Stripe publishable key, secret key, and webhook secret for each environment.
- `PRODUCTION GATE`: Complete test-mode payment setup, invoice, autopay, failed payment, and webhook tests before live billing.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed billing/Stripe files.
- Verify Stripe test-mode customer and payment method setup.
- Verify automatic invoice generation from scheduled sessions.
- Verify late cancellation and no-show billing calculations.
- Verify webhook handling is idempotent.
- Verify booking is blocked when payment method/balance rules require it.
- Confirm no live Stripe keys were committed.
- Confirm Spec 08 can use billing/attendance hooks without manual invoice edits.

## Dependencies

- Spec 02: Database Schema
- Spec 04: Family Onboarding And Intake
- Spec 06: Scheduling And Booking Lifecycle

## Billing Rules

- Families must save a payment method before booking.
- Autopay should be supported.
- Invoices are generated automatically from scheduled sessions.
- Invoice grouping should be configurable:
  - Per session
  - Weekly
  - Monthly
  - Custom period if simple to support
- Default price is `$70/hour`.
- Session price and duration are configurable.
- Invoices are based on scheduled sessions.
- Unpaid balances should block future bookings after a configured threshold.
- Admin override for payment blocks is out of scope.
- Admin invoice line-item editing is out of scope.

## Cancellation Billing

- On-time cancellation: no charge
- Late cancellation under 24 hours: 50% charge
- No-show: full charge

Invoice line items should reflect the billing reason.

## Stripe Objects

Use Stripe for:

- Customers
- SetupIntents or equivalent saved payment method setup
- PaymentMethods
- PaymentIntents or Invoices, depending on chosen Stripe implementation
- Webhooks for payment succeeded/failed and invoice status changes

Use local database records for:

- Family account billing status
- Invoice grouping configuration
- Session-to-invoice linkage
- Payment method display summary
- Billing rules snapshots
- Audit/history

## Routes

Family:

- `/portal/invoices`
- `/portal/invoices/:invoiceId`
- `/portal/settings/billing`

Admin:

- `/portal/admin/invoices`
- `/portal/admin/families/:familyId/billing`
- `/portal/admin/settings/billing`

## UI Requirements

### Family Billing Settings

Families can:

- Add payment method
- View saved payment method summary
- Replace default payment method
- Enable/disable autopay if business rules allow
- View billing status

### Family Invoices

Show:

- Invoice number
- Period
- Status
- Line items
- Sessions linked to line items
- Amount
- Due date
- Payment status

### Admin Billing View

Admins can:

- View invoices by family/status/date
- View unpaid balances
- View payment failures
- See why a family is blocked
- Configure billing settings

Do not allow manual line-item editing in the initial scope.

## Backend Requirements

- Create Stripe customer when family account is created or reaches payment step.
- Save default payment method.
- Store local payment method summary.
- Create invoices from scheduled sessions according to grouping settings.
- Apply cancellation/no-show billing rules automatically.
- Process Stripe webhooks idempotently.
- Update invoice/payment/family billing statuses from webhook events.
- Block booking when payment method is missing or balance threshold is exceeded.
- Send invoice and payment failure notifications.

## Settings

Store system billing settings:

- Default session price cents
- Default session duration minutes
- Invoice grouping mode
- Autopay default
- Payment block threshold cents
- Cancellation free window hours
- Late cancellation charge percent
- No-show charge percent

## Edge Cases

- Payment method setup fails.
- Stripe webhook is delivered more than once.
- Payment succeeds after family was blocked.
- Session changes after invoice generated.
- Recurring sessions create many line items.
- Canceled-on-time session should not charge but should keep history.

## Acceptance Criteria

- Family must add payment method before booking.
- Stripe customer/payment method is linked to family account.
- Invoices generate automatically from scheduled sessions.
- Invoice grouping can be configured.
- Late cancellation and no-show line items are calculated correctly.
- Payment success/failure updates local records.
- Unpaid balances block booking after threshold.

## Out Of Scope

- Tutor payouts through Stripe
- TutorBird payment migration
- Packages/prepaid credits
- Admin invoice line-item adjustment
- Complex tax handling unless legally required
- Payment-provider alternatives beyond Stripe

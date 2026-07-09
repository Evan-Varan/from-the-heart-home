# Spec 05 QA Plan — Tutor Profiles & Availability

End-to-end flow: bootstrap admin → invite tutor → tutor onboards → admin approves → family views directory.

---

## Prerequisites

- Dev server running (`npm run dev`)
- `RESEND_API_KEY` set in `.dev.vars`
- `PUBLIC_SITE_URL=http://localhost:3000` in `.dev.vars`
- A family account that has completed onboarding (`onboarding_status = ready`) for the directory tests at the end
- A family account that has NOT completed onboarding (for gate tests)

---

## Part 1 — Bootstrap the First Admin

| # | Step | Expected Result |
|---|------|----------------|
| 1.1 | Go to **Clerk Dashboard → Configure → Sessions → Edit default session token** and add `"metadata": "{{user.public_metadata}}"` | Saved — JWT will now carry role |
| 1.2 | Sign up at `/portal/register` with your admin email | Account created; Clerk redirects to `/portal` |
| 1.3 | Without setting metadata yet: navigate to `/portal/admin/` | Redirected away — confirms template alone isn't enough without metadata |
| 1.4 | In **Clerk Dashboard → Users → [your user] → Public metadata** set `{"role": "admin"}` | Saved |
| 1.5 | Sign out and back in | Fresh JWT issued |
| 1.6 | Navigate to `/portal/admin/` | Admin dashboard loads with Tutors, Invites, and Families (coming soon) cards |

---

## Part 2 — Admin Sends a Tutor Invite

> Logged in as admin. Navigate to `/portal/admin/invites/`.

| # | Step | Expected Result |
|---|------|----------------|
| 2.1 | Page loads | Empty state: "No invites sent yet" |
| 2.2 | Click "Invite Someone" | Dialog opens with Email and Role fields |
| 2.3 | Submit with empty email | Error: "Email is required" — no network call |
| 2.4 | Submit with invalid email (no `@`) | Error: "Valid email required" |
| 2.5 | Enter tutor's email, Role = Tutor, click "Send Invite" | Dialog closes; invite appears in Pending list |
| 2.6 | Invite row shows email, "tutor" badge, "pending" badge, expiry date, "Copy link" button | Correct |
| 2.7 | Click "Copy link" | URL copied; button shows "Copied" briefly |
| 2.8 | Try inviting the same email again | Error: "An active invite already exists for this email" |
| 2.9 | Check the tutor's email inbox | Invite email received with an "Accept Invitation" button |
| 2.10 | Invite link in the email is `http://localhost:3000/portal/invite/$token` | Correct (not the production URL) |

---

## Part 3 — Tutor Accepts the Invite and Creates an Account

> Open the invite link in an incognito window (not logged in).

| # | Step | Expected Result |
|---|------|----------------|
| 3.1 | Visit `/portal/invite/$token` from the email | Invite page loads without redirecting to login |
| 3.2 | Page shows inviter name, "Tutor" role badge, and the invited email address | Correct |
| 3.3 | "Create your account" button visible; no "Accept Invitation" button yet | Correct — must sign up first |
| 3.4 | Click "Create your account" | Redirects to `/portal/register?invite=$token` |
| 3.5 | Complete Clerk signup | After signup, Clerk redirects back to `/portal/invite/$token` |
| 3.6 | Page now shows "Accept Invitation" button (user is now logged in) | Correct |
| 3.7 | Click "Accept Invitation" | Shows "Accepting…" then "You're all set!" success state |
| 3.8 | After ~1.5s, automatically signed out and redirected to `/portal/login` | Correct — role takes effect on next sign-in |
| 3.9 | Back in admin invites list: invite row now shows "accepted" badge with accepted date | Correct |

---

## Part 4 — Tutor Signs In and Sets Up Their Profile

> Sign in as the newly accepted tutor.

| # | Step | Expected Result |
|---|------|----------------|
| 4.1 | Sign in with the tutor account | Redirected to `/portal/tutor/` — NOT to family onboarding |
| 4.2 | Dashboard shows "Complete Your Profile" CTA | Correct — no profile exists yet |
| 4.3 | Navigate to `/portal/onboarding/` manually | Redirected back to `/portal/tutor/` — onboarding is family-only |
| 4.4 | Click the CTA or go to `/portal/tutor/profile` | Profile form opens; submit button says "Submit Profile" |
| 4.5 | Submit with Display Name blank | Error: "Display name is required" |
| 4.6 | Fill in display name, bio, email, phone, meeting link; toggle In-Person on | All fields accept input |
| 4.7 | Submit | Saves; redirects to `/portal/tutor/` |
| 4.8 | Dashboard now shows "Profile Under Review" state | Correct |
| 4.9 | Navigate back to `/portal/tutor/profile` | All saved values pre-populated; button now says "Save Changes" |
| 4.10 | Edit a field and save | "Changes saved" confirmation |

---

## Part 5 — Tutor Adds Availability Blocks

> Navigate to `/portal/tutor/availability`.

| # | Step | Expected Result |
|---|------|----------------|
| 5.1 | Page loads with Mon–Sun cards, all empty | "No blocks yet" on each day |
| 5.2 | Click "+ Add" on Monday | Dialog opens with Day, Start, End, Timezone, Location type fields |
| 5.3 | Set Monday 9:00 AM – 11:00 AM ET, Virtual; save | Block appears: `09:00–11:00 ET` with Virtual badge |
| 5.4 | Add Monday 10:00 AM – 12:00 PM ET (overlaps 5.3) | Error: "This block overlaps an existing block" |
| 5.5 | Add Monday 11:00 AM – 1:00 PM ET (adjacent, no overlap) | Saves; Monday now shows two blocks |
| 5.6 | Add Wednesday 2:00 PM – 4:00 PM PT, In-Person | Block appears on Wednesday with "PT" label and In-Person badge |
| 5.7 | Edit the Monday 9 AM block; change end to 10:30 AM; save | Block updates to `09:00–10:30` |
| 5.8 | Edit Monday 9 AM block to end at 11:30 AM (overlaps 5.5) | Error — blocked |
| 5.9 | Delete a block; confirm in dialog | Block removed |
| 5.10 | Reload page | Remaining blocks persist correctly |

---

## Part 6 — Admin Reviews and Approves the Tutor

> Log in as admin; navigate to `/portal/admin/tutors/`.

| # | Step | Expected Result |
|---|------|----------------|
| 6.1 | Tutor appears in "Pending Approval" section at the top | Correct — new profile starts as pending |
| 6.2 | Click the tutor row | Opens `/portal/admin/tutors/$tutorId` edit page |
| 6.3 | Status dropdown shows "Pending Review" | Correct |
| 6.4 | Add a subject via checkbox; set grade min = 6, max = 8 | Grade range inputs appear; values accepted |
| 6.5 | Set Default Hourly Rate to `45.50` | Input accepts the value |
| 6.6 | Change status to "Active"; click Save | "Changes saved" — no error |
| 6.7 | Navigate back to `/portal/admin/tutors/` | Tutor no longer in Pending; shows "active" badge in All Tutors |
| 6.8 | Reopen tutor; verify grade range and rate persisted | `Gr. 6–8` and `45.50` are still set |

---

## Part 7 — Family Views the Tutor Directory

> Log in as a family user with `onboarding_status = ready`.

| # | Step | Expected Result |
|---|------|----------------|
| 7.1 | Navigate to `/portal/tutors/` | Directory loads; activated tutor is visible |
| 7.2 | Tutor card shows: initials avatar, name, Virtual/In-Person indicators, bio preview, subject badges | Correct |
| 7.3 | Log in as a family user who has NOT completed onboarding; navigate to `/portal/tutors/` | Redirected to `/portal/dashboard` — directory is gated |
| 7.4 | Back as the ready family user: click the tutor card | Opens `/portal/tutors/$tutorId` |
| 7.5 | Detail page shows bio, subjects with grade ranges (Gr. 6–8), weekly availability by day | Correct |
| 7.6 | Availability shows Monday blocks in order; Wednesday PT block visible | Correct |
| 7.7 | "Request a Session" button is visible but disabled with "(Coming in Spec 06)" | Correct |
| 7.8 | "Back to Tutors" navigates to `/portal/tutors/` | Correct |
| 7.9 | Admin sets tutor to "Inactive"; family reloads `/portal/tutors/` | Tutor disappears from directory |

---

## Part 8 — Permission Boundaries

| # | Step | Expected Result |
|---|------|----------------|
| 8.1 | Family user navigates to `/portal/tutor/profile` | Redirected away |
| 8.2 | Family user navigates to `/portal/admin/tutors/` | Redirected away |
| 8.3 | Tutor navigates to `/portal/admin/tutors/` | Redirected away |
| 8.4 | Unauthenticated user visits `/portal/tutors/` | Redirected to `/portal/login` |
| 8.5 | Unauthenticated user visits `/portal/admin/invites/` | Redirected to `/portal/login` |
| 8.6 | Family user navigates to `/portal/admin/invites/` | Redirected away |
| 8.7 | Tutor navigates to `/portal/admin/invites/` | Redirected away |

---

## Part 9 — Edge Cases

| # | Step | Expected Result |
|---|------|----------------|
| 9.1 | Visit `/portal/invite/invalidtoken` | Error card: "This invite link is invalid or does not exist" |
| 9.2 | Visit an expired invite (set `expires_at` to the past via `wrangler d1 execute`) | Error card: "This invite link has expired" |
| 9.3 | Visit an already-accepted invite link | Error card: "This invite has already been used" |
| 9.4 | Tutor saves availability with start = end time | Should reject — zero-length block |
| 9.5 | Tutor saves availability with start after end | Should reject — invalid range |
| 9.6 | Navigate to `/portal/tutors/nonexistent-id` | Error state shown — not a blank page |
| 9.7 | Tutor with zero subjects | Subjects card absent from detail page |
| 9.8 | Tutor with zero availability blocks | Weekly Availability card shows "No availability listed yet." |
| 9.9 | `PUBLIC_SITE_URL` not set in `.dev.vars` | Invite email link goes to `fromthehearttutoring.com` instead of localhost — documents misconfiguration |

---

## Known Deferred Items

- Profile photo upload — spec 10
- Admin approval notification email — spec 09
- "Request a Session" button — spec 06
- Availability block duplication to another day — not implemented

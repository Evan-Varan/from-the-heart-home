import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/tanstack-react-start/server";
import { getDb } from "@/portal/lib/db.server";
import { users, family_accounts, notification_preferences } from "@/portal/db/schema";
import { assertAuthenticated } from "@/portal/permissions";
import { recordAuditEvent } from "@/portal/api/audit";
import { ValidationError } from "@/portal/lib/errors";

export interface FamilyAccountData {
  id: string;
  account_type: string;
  onboarding_status: string;
  billing_status: string;
  billing_email: string | null;
  billing_phone: string | null;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  status: string;
}

// Get or create the D1 user record for the current Clerk session.
// Must be called from a server function context.
async function syncUser(): Promise<UserData> {
  const { userId: clerkId, sessionClaims } = await auth();
  assertAuthenticated(clerkId);

  const db = getDb();
  const existing = await db.query.users.findFirst({
    where: eq(users.auth_provider_user_id, clerkId),
  });
  if (existing) return existing as UserData;

  // First-time sign-in: provision from Clerk claims
  const email =
    (sessionClaims as Record<string, unknown> | null)?.email as string | undefined ??
    `${clerkId}@unknown.local`;
  const name =
    (sessionClaims as Record<string, unknown> | null)?.name as string | undefined ?? "Portal User";

  const newUser = {
    auth_provider_user_id: clerkId,
    email,
    name,
    role: "family" as const,
    status: "active" as const,
  };
  await db.insert(users).values(newUser);

  const created = await db.query.users.findFirst({
    where: eq(users.auth_provider_user_id, clerkId),
  });
  return created as UserData;
}

// Returns the current user's family account, or null if none exists.
export const getFamilyAccount = createServerFn({ method: "GET" }).handler(
  async (): Promise<FamilyAccountData | null> => {
    const { userId: clerkId } = await auth();
    assertAuthenticated(clerkId);

    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.auth_provider_user_id, clerkId),
    });
    if (!user) return null;

    const account = await db.query.family_accounts.findFirst({
      where: eq(family_accounts.primary_user_id, user.id),
    });
    return account ?? null;
  },
);

export interface CreateFamilyAccountInput {
  accountType: "parent_managed" | "adult_student";
  phone?: string;
  billingEmail?: string;
}

export const createFamilyAccount = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: CreateFamilyAccountInput }): Promise<FamilyAccountData> => {
    const input = ctx.data;
    if (!input.accountType) throw new ValidationError("Account type is required.");

    const db = getDb();
    const user = await syncUser();

    // Idempotency: return existing account if already created
    const existing = await db.query.family_accounts.findFirst({
      where: eq(family_accounts.primary_user_id, user.id),
    });
    if (existing) return existing as FamilyAccountData;

    // Update user phone if provided
    if (input.phone) {
      await db
        .update(users)
        .set({ phone: input.phone })
        .where(eq(users.id, user.id));
    }

    // Create family account
    const accountId = crypto.randomUUID();
    await db.insert(family_accounts).values({
      id: accountId,
      primary_user_id: user.id,
      account_type: input.accountType,
      billing_email: input.billingEmail ?? user.email,
      billing_phone: input.phone ?? null,
      onboarding_status: "started",
    });

    // Create default notification preferences
    await db.insert(notification_preferences).values({
      user_id: user.id,
      email_enabled: 1,
      sms_enabled: input.phone ? 1 : 0,
    });

    await recordAuditEvent(db, {
      actorId: user.id,
      entityType: "family",
      entityId: accountId,
      eventType: "family_account.created",
      metadata: { accountType: input.accountType },
      timestamp: new Date(),
    });

    const created = await db.query.family_accounts.findFirst({
      where: eq(family_accounts.id, accountId),
    });
    return created as FamilyAccountData;
  },
);

export interface UpdateOnboardingStatusInput {
  status: "started" | "payment_required" | "ready" | "needs_admin_review";
}

export const updateOnboardingStatus = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: UpdateOnboardingStatusInput }): Promise<void> => {
    const { userId: clerkId } = await auth();
    assertAuthenticated(clerkId);

    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.auth_provider_user_id, clerkId),
    });
    if (!user) throw new ValidationError("User not found.");

    await db
      .update(family_accounts)
      .set({ onboarding_status: ctx.data.status })
      .where(eq(family_accounts.primary_user_id, user.id));
  },
);

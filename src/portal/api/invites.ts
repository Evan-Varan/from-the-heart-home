import { createServerFn } from "@tanstack/react-start";
import { eq, and, isNull, gt } from "drizzle-orm";
import { auth } from "@clerk/tanstack-react-start/server";
import { createClerkClient } from "@clerk/backend";
import { Resend } from "resend";
import { getDb } from "@/portal/lib/db.server";
import { users, portal_invites } from "@/portal/db/schema";
import { assertAuthenticated } from "@/portal/permissions";
import { requireRole } from "@/portal/auth";
import { getServerConfig } from "@/portal/lib/config.server";
import { recordAuditEvent } from "@/portal/api/audit";
import { ValidationError } from "@/portal/lib/errors";

export interface InviteData {
  id: string;
  email: string;
  role: string;
  token: string;
  invited_by_name: string;
  created_at: Date;
  expires_at: Date;
  accepted_at: Date | null;
  status: "pending" | "accepted" | "expired";
}

export interface InvitePublicData {
  email: string;
  role: string;
  inviterName: string;
  isExpired: boolean;
  isAccepted: boolean;
}

// Ensure the current Clerk user has a D1 record; creates one if absent.
// Kept local to this module so we don't cross-import between api files at
// module scope (which leaks db.server.ts into the client bundle).
async function ensureUser(
  clerkId: string,
  sessionClaims: Record<string, unknown> | null | undefined,
  defaultRole: string,
) {
  const db = getDb();
  const existing = await db.query.users.findFirst({
    where: eq(users.auth_provider_user_id, clerkId),
  });
  if (existing) return existing;

  const email =
    (sessionClaims?.email as string | undefined) ?? `${clerkId}@unknown.local`;
  const name = (sessionClaims?.name as string | undefined) ?? "Portal User";
  await db.insert(users).values({
    auth_provider_user_id: clerkId,
    email,
    name,
    role: defaultRole,
    status: "active",
  });
  return db.query.users.findFirst({ where: eq(users.auth_provider_user_id, clerkId) });
}

export const createInvite = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: { email: string; role: "tutor" | "admin" } }): Promise<void> => {
    const admin = await requireRole("admin");
    const { email, role } = ctx.data;

    if (!email || !email.includes("@")) throw new ValidationError("Valid email required.");
    if (role !== "tutor" && role !== "admin") throw new ValidationError("Role must be tutor or admin.");

    const { userId: clerkId, sessionClaims } = await auth();
    const db = getDb();

    const adminUser = await ensureUser(
      clerkId!,
      sessionClaims as Record<string, unknown>,
      admin.role,
    );
    if (!adminUser) throw new Error("Failed to provision admin user record.");

    const existing = await db.query.portal_invites.findFirst({
      where: and(
        eq(portal_invites.email, email.toLowerCase()),
        isNull(portal_invites.accepted_at),
        gt(portal_invites.expires_at, new Date()),
      ),
    });
    if (existing) throw new ValidationError("An active invite already exists for this email.");

    const token =
      crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(portal_invites).values({
      email: email.toLowerCase(),
      role,
      token,
      invited_by_user_id: adminUser.id,
      expires_at: expiresAt,
    });

    const config = getServerConfig();
    const inviteUrl = `${config.siteUrl}/portal/invite/${token}`;

    const resend = new Resend(config.resend.apiKey);
    await resend.emails.send({
      from: config.resend.fromEmail,
      to: email,
      subject: `You've been invited to join From the Heart Tutoring as a ${role}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="margin-bottom:8px;">You're invited!</h2>
          <p style="color:#444;">${adminUser.name} has invited you to join the From the Heart Tutoring portal as a <strong>${role}</strong>.</p>
          <p>
            <a href="${inviteUrl}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
              Accept Invitation
            </a>
          </p>
          <p style="color:#666;font-size:14px;">This link expires on ${expiresAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</p>
          <p style="color:#999;font-size:13px;">If you weren't expecting this, you can safely ignore this email.</p>
        </div>
      `,
    });

    await recordAuditEvent(db, {
      actorId: adminUser.id,
      entityType: "invite",
      entityId: token,
      eventType: "invite.created",
      metadata: { email, role },
      timestamp: new Date(),
    });
  },
);

export const listInvites = createServerFn({ method: "GET" }).handler(
  async (): Promise<InviteData[]> => {
    await requireRole("admin");
    const db = getDb();

    const rows = await db.query.portal_invites.findMany({
      orderBy: (t, { desc }) => [desc(t.created_at)],
      with: { invited_by: true },
    });

    const now = new Date();
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      role: r.role,
      token: r.token,
      invited_by_name: (r.invited_by as { name?: string } | null)?.name ?? "Admin",
      created_at: r.created_at,
      expires_at: r.expires_at,
      accepted_at: r.accepted_at,
      status: r.accepted_at ? "accepted" : r.expires_at < now ? "expired" : "pending",
    }));
  },
);

export const getInviteByToken = createServerFn({ method: "GET" }).handler(
  async (ctx: { data: { token: string } }): Promise<InvitePublicData | null> => {
    const db = getDb();
    const invite = await db.query.portal_invites.findFirst({
      where: eq(portal_invites.token, ctx.data.token),
      with: { invited_by: true },
    });
    if (!invite) return null;

    return {
      email: invite.email,
      role: invite.role,
      inviterName: (invite.invited_by as { name?: string } | null)?.name ?? "An admin",
      isExpired: invite.expires_at < new Date(),
      isAccepted: !!invite.accepted_at,
    };
  },
);

export const getPortalUserEmail = createServerFn({ method: "GET" }).handler(
  async (): Promise<string | null> => {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;
    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.auth_provider_user_id, clerkId),
    });
    // Only return real emails (not the fallback placeholder created when claims lacked email)
    if (!user || user.email.endsWith("@unknown.local")) return null;
    return user.email;
  },
);

export const acceptInvite = createServerFn({ method: "POST" }).handler(
  async (ctx: { data: { token: string } }): Promise<{ role: string }> => {
    const { userId: clerkId, sessionClaims } = await auth();
    assertAuthenticated(clerkId);

    const db = getDb();
    const invite = await db.query.portal_invites.findFirst({
      where: eq(portal_invites.token, ctx.data.token),
    });

    if (!invite) throw new ValidationError("Invalid invite link.");
    if (invite.accepted_at) throw new ValidationError("This invite has already been used.");
    if (invite.expires_at < new Date()) throw new ValidationError("This invite link has expired.");

    // Block wrong-account accepts: if the logged-in user already has a D1 record
    // (i.e., an existing user like admin), verify their email matches the invite.
    const existingUser = await db.query.users.findFirst({
      where: eq(users.auth_provider_user_id, clerkId!),
    });
    if (existingUser && !existingUser.email.endsWith("@unknown.local")) {
      if (existingUser.email.toLowerCase() !== invite.email.toLowerCase()) {
        throw new ValidationError(
          "This invite was sent to a different email address. Please sign out and use the invited account.",
        );
      }
    }

    let user = await db.query.users.findFirst({
      where: eq(users.auth_provider_user_id, clerkId!),
    });

    if (!user) {
      user = await ensureUser(
        clerkId!,
        sessionClaims as Record<string, unknown>,
        invite.role,
      );
    } else {
      await db.update(users).set({ role: invite.role }).where(eq(users.id, user.id));
    }

    const config = getServerConfig();
    if (config.clerk.secretKey) {
      const clerkClient = createClerkClient({ secretKey: config.clerk.secretKey });
      await clerkClient.users.updateUserMetadata(clerkId!, {
        publicMetadata: { role: invite.role },
      });
    }

    await db
      .update(portal_invites)
      .set({ accepted_at: new Date(), accepted_user_id: user!.id })
      .where(eq(portal_invites.token, ctx.data.token));

    await recordAuditEvent(db, {
      actorId: user!.id,
      entityType: "invite",
      entityId: invite.id,
      eventType: "invite.accepted",
      metadata: { role: invite.role },
      timestamp: new Date(),
    });

    return { role: invite.role };
  },
);

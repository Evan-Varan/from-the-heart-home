// Server-only — import only in server functions and route beforeLoad.

import { auth } from "@clerk/tanstack-react-start/server";
import { ForbiddenError } from "../lib/errors";
import { assertAuthenticated, assertRole } from "../permissions";
import type { UserRole } from "../types";

export type AuthUser = {
  userId: string;
  role: UserRole;
};

// Role is stored in Clerk publicMetadata and surfaced via a custom JWT template.
// Clerk dashboard → Configure → Sessions → Edit, add:
//   "metadata": "{{user.public_metadata}}"
// Until that is configured, all authenticated users default to 'family'.
function claimRole(claims: Record<string, unknown> | null | undefined): UserRole {
  return (claims?.metadata as { role?: UserRole } | undefined)?.role ?? "family";
}

export async function requireUser(): Promise<AuthUser> {
  const { userId, sessionClaims } = await auth();
  assertAuthenticated(userId);
  return {
    userId,
    role: claimRole(sessionClaims as Record<string, unknown>),
  };
}

export async function requireRole(required: UserRole): Promise<AuthUser> {
  const user = await requireUser();
  assertRole(user.role, required);
  return user;
}

export async function canAccessFamilyAccount(user: AuthUser, familyId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  if (user.role === "family") return user.userId === familyId;
  return false;
}

export async function assertFamilyAccountAccess(user: AuthUser, familyId: string): Promise<void> {
  if (!(await canAccessFamilyAccount(user, familyId))) throw new ForbiddenError();
}

export async function canAccessStudent(user: AuthUser, _studentId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  return user.role === "family"; // spec 02: verify family→student in DB
}

export async function canAccessSession(user: AuthUser, _sessionId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  return user.role === "tutor" || user.role === "family"; // spec 02: verify assignment in DB
}

export async function canManageTutor(user: AuthUser, tutorId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  if (user.role === "tutor") return user.userId === tutorId;
  return false;
}

export async function canViewInvoice(user: AuthUser, _invoiceId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  return user.role === "family"; // spec 02: verify invoice→family in DB
}
